import type { CollectionConfig } from 'payload'



export const ArtImage: CollectionConfig = {
  slug: 'art',
  folders: true,
  access: {
    read: () => true,
  },
  admin:{
    useAsTitle: 'title',
  },
  fields: [
    {
        name: 'title',
        type: 'text',
        required: true,
    },
      {
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
        name: 'tags',
        type: 'relationship',
        relationTo: 'tags',
        hasMany: true,
    },
  ],
   upload: {
    // These are not supported on Workers yet due to lack of sharp
    crop: false,
    focalPoint: false,
    staticDir: 'media/artwork',
    mimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    disableLocalStorage: true,
  },
}