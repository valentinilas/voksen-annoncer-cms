import type { CollectionConfig } from 'payload'
import slugify from 'slugify'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { OpenAI } from 'openai'
import { v4 as uuidv4 } from 'uuid';  // Import the UUID function


import fetch from 'node-fetch'; // Install this package for fetching images: npm install node-fetch


// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

export const AiPosts: CollectionConfig = {
    slug: 'ai-posts',
    access: {
        // Allow anyone (even unauthenticated users) to read posts
        read: () => true,
    },
    hooks: {
        beforeValidate: [
            async ({ data, req }) => {



                try {
                    const prompt = `
                    Generate a blog post based on the following topic, and deliver it in Danish. Format the output as follows:
                    
                    **Title:** [Title of the blog post in Danish]
                    
                    **Summary:** [Brief 2-3 sentence summary in Danish]
                    
                    **Body:** [Body of the article in Markdown, with appropriate headings and structure in Danish]

                    Topic: ${data.Topic}
                    `;

                    const response = await openai.chat.completions.create({
                        model: 'gpt-4o-mini',
                        messages: [
                            {
                                role: 'system',
                                content: 'You are an experienced writer who creates high-quality blog posts in Markdown format. All sections, including the body text, must follow the structured format: The title should go after **Title:**, The Summary should go after **Summary:** and the Body should go after **Body:**. Please ensure the entire content is in Danish.',
                            },
                            {
                                role: 'user',
                                content: prompt,
                            },
                        ],
                    })

                    const generatedText = response.choices[0].message.content;
                    console.log(generatedText);

                    // Extract content using regex
                    const titleMatch = generatedText.match(/\*\*Title:\*\* (.+)/);
                    const summaryMatch = generatedText.match(/\*\*Summary:\*\* (.+)/);
                    const bodyMatch = generatedText.match(/\*\*Body:\*\*\s([\s\S]*)/);

                    const title = titleMatch ? titleMatch[1].trim() : 'Untitled';
                    const summary = summaryMatch ? summaryMatch[1].trim() : 'No summary provided.';
                    const body = bodyMatch ? bodyMatch[1].trim() : 'No body content provided.';

                    // Assign the extracted content to the fields
                    data.Title = title;
                    data.Summary = summary;
                    data['Body'] = body;

                    // Generate slug from the generated Title
                    if (title && (!data.Slug || data.Slug.trim() === '')) {
                        const timestamp = new Date().getTime(); // Current timestamp in milliseconds
                        const sluggedTitle = slugify(title, { lower: true, strict: true });
                        data.Slug = `${timestamp}-${sluggedTitle}`;
                    }

                    // Set default Author if not provided
                    if (!data.Author || data.Author.trim() === '') {
                        data.Author = 'Admin';
                    }

                    // if (summary) {
                    //     try {
                    //         const imageResponse = await openai.images.generate({
                    //             prompt: `Photographic illustration for a blog post about: ${summary}`,
                    //             model: 'dall-e-3', // Specify the model explicitly
                    //             n: 1,
                    //             size: '1024x1024',
                    //             quality: 'standard',
                    //             response_format: 'url' // Explicitly request URL
                    //         });
                    
                    //         if (imageResponse && imageResponse.data && imageResponse.data.length > 0) {
                    //             const imageUrl = imageResponse.data[0].url;
                    
                    //             if (!imageUrl) {
                    //                 console.error('No image URL generated');
                    //                 return data;
                    //             }
                    
                    //             const imageFetchResponse = await fetch(imageUrl);
                                
                    //             if (!imageFetchResponse.ok) {
                    //                 console.error('Failed to fetch image:', imageFetchResponse.status, imageFetchResponse.statusText);
                    //                 return data;
                    //             }
                    
                    //             const arrayBuffer = await imageFetchResponse.arrayBuffer();
                    //             const imageBuffer = Buffer.from(arrayBuffer);
                    
                    //             if (!imageBuffer || imageBuffer.length === 0) {
                    //                 console.error('Empty image buffer');
                    //                 return data;
                    //             }
                    
                    //             const uploadedMedia = await req.payload.create({
                    //                 collection: 'media',
                    //                 data: {
                    //                     alt: `Illustration for: ${title}`,
                    //                     caption: 'AI-generated image'
                    //                 },
                    //                 file: {
                    //                     buffer: imageBuffer,
                    //                     originalname: `${uuidv4()}.png`,
                    //                     mimetype: 'image/png'
                    //                 },
                    //             });
                    
                    //             data.Image = uploadedMedia.id;
                    //         }
                    //     } catch (error) {
                    //         console.error('Comprehensive image generation error:', error);
                    //     }
                    // }

                } catch (error) {
                    console.error('Error generating content from OpenAI:', error)
                    throw new Error('Failed to generate content.')
                }


                return data;
            }
        ]
    },
    fields: [
        {
            name: 'Slug',
            type: 'text',
            unique: true, // Ensure slug uniqueness
            admin: {
                readOnly: true,
                description: 'Auto generated on Save'
            }
        },
        {
            name: 'Topic',
            type: 'text',
        },
        {
            name: 'Author',
            type: 'text',
        },
        {
            name: 'Title',
            type: 'text',
        },

        {
            name: 'Summary',
            type: 'text',
        },
        {
            name: 'Body',
            type: 'textarea',
        },
        {
            name: 'Image', // The name of the field for image uploads
            type: 'upload', // The field type for file uploads
            relationTo: 'media', // If you want to store the image in a separate collection called 'media'
        },
    ]
}