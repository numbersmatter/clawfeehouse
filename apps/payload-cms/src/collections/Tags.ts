import { slugField, type CollectionConfig } from 'payload'


export const Tags: CollectionConfig = {
  slug: 'tags',
  folders: true,
  access: {
    read: () => true,
  },
  admin:{
    useAsTitle: 'name',
  },
  fields: [
     slugField({ useAsSlug: 'name' }),
    {
        name: 'name',
        type: 'text',
        required: true,
        unique: true,
        index: true,
    },
  ],
}