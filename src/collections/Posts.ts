import type { CollectionConfig } from 'payload'
import slugify from 'slugify'
import { lexicalEditor } from '@payloadcms/richtext-lexical'


export const Posts: CollectionConfig = {
  slug: 'posts',
  access: {
    // Allow anyone (even unauthenticated users) to read posts
    read: () => true,
  },
  hooks: {
    beforeValidate: [
      ({ data }) => {
        // Generate slug from title if not already provided
        if (data && data.Title && (!data.Slug || data.Slug.trim() === '')) {
          const timestamp = new Date().getTime(); // Current timestamp in milliseconds
          const sluggedTitle = slugify(data.Title, { lower: true, strict: true });
          data.Slug = `${timestamp}-${sluggedTitle}`;
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
      name: 'Body Text',
      type: 'textarea',
    },
    {
      name: 'RT',
      type: 'richText',
      hidden: false,
      editor: lexicalEditor({}),
    },
    {
      name: 'Image', // The name of the field for image uploads
      type: 'upload', // The field type for file uploads
      relationTo: 'media', // If you want to store the image in a separate collection called 'media'
    },
  ]
}