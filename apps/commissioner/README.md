# Welcome to React Router!

## Setup
Used the create React Router command with template

```bash
pnpm create react-router@latest --template remix-run/react-router-templates/cloudflare
# dir
./apps/starter
# init git
No
# Install PNPM
No
```

## Scope to Repo
Change the app name in package.json to scoped to the namespace: @clawfeehouse/starter.

Modify vite.config.ts to set the server port and inspector port.

```jsonc
server:{
    host: "localhost",
    port: 5180,
    strictPort: true,
},
// Plugins 
cloudflare({
    inspectorPort: 9335,
})
```

Your application will be available at `http://localhost:5180`. With the inspector on port 9335.


Change the files for:
- tsconfig.json
- tsconfig.cloudflare.json
- tsconfig.node.json







## Getting Started

### Installation

I

### Development

Start the development server with HMR:

```bash
npm run dev
```


## Previewing the Production Build

Preview the production build locally:

```bash
npm run preview
```

## Building for Production

Create a production build:

```bash
npm run build
```

## Deployment

Deployment is done using the Wrangler CLI.

To build and deploy directly to production:

```sh
npm run deploy
```

To deploy a preview URL:

```sh
npx wrangler versions upload
```

You can then promote a version to production after verification or roll it out progressively.

```sh
npx wrangler versions deploy
```

---

Built with ❤️ using React Router.
