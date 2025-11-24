import {defineCliConfig} from 'sanity/cli'
import {config} from '@dotenvx/dotenvx'

config({path: '.env'})

const projectId =
  process.env.SANITY_PROJECT_ID ||
  (() => {
    throw new Error('Missing SANITY_PROJECT_ID environment variable')
  })()

export default defineCliConfig({
  api: {
    projectId,
    dataset: 'production',
  },
  deployment: {
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/cli#auto-updates
     */
    autoUpdates: true,
  },
})
