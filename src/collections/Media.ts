import type { CollectionConfig } from 'payload'
import { v4 as uuidv4 } from 'uuid';  // Import the UUID function

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },

  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  hooks: {
    beforeOperation: [
      async (req) => {
        if (req.operation === 'create') {
          if (req.req.file) {
            // Generate a new UUID for the file name
            const fileExtension = req.req.file.name.split('.').pop(); // Extract file extension
            const newFileName = `${uuidv4()}.${fileExtension}`; // Generate UUID and append the file extension
            req.req.file.name = newFileName; // Assign the new name
          }
        }
      },
    ],
  },
  upload: true,
}
