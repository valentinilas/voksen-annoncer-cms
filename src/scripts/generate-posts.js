// Your Payload CMS API URL and API Key
const API_URL = 'http://localhost:3000/api/posts';

// Array of topics to generate posts for
const topics = [

];

// Function to create a post
async function createPost(topic) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify({ Topic: topic }), // This triggers the hook to generate content
      credentials: "include",
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status} - ${await response.text()}`);
    }

    const data = await response.json();
    console.log(data);
    console.log(`Post created successfully: ${data.Title}`);
  } catch (error) {
    console.error(`Error creating post for topic "${topic}":`, error.message);
  }
}

// Main function to iterate over topics and create posts
async function createPostsFromTopics() {
  for (const topic of topics) {
    console.log(`Creating post for topic: "${topic}"`);
    await createPost(topic); // Wait for each post creation to complete before proceeding
  }

  console.log('All posts created!');
}

// Run the script
createPostsFromTopics();
