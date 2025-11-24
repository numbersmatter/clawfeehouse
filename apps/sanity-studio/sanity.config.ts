import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {config} from '@dotenvx/dotenvx'

config({path: '.env'})

const projectId =
  process.env.SANITY_PROJECT_ID ||
  (() => {
    throw new Error('Missing SANITY_PROJECT_ID environment variable')
  })()

export default defineConfig({
  name: 'default',
  title: 'ClawfeeHouse',

  projectId,
  dataset: 'production',

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
})
