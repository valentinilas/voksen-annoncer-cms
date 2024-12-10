import type { CollectionConfig } from 'payload'

export const Posts: CollectionConfig = {
  slug: 'posts',
  access: {
    // Allow anyone (even unauthenticated users) to read posts
    read: () => true,
  },
  fields: [
    {
      name: 'Slug',
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
      name: 'Image', // The name of the field for image uploads
      type: 'upload', // The field type for file uploads
      relationTo: 'media', // If you want to store the image in a separate collection called 'media'
    },
  ]
}