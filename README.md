# Oracle Bone Rhyme

A web application for detecting and recognizing oracle bone scripts anywhere.

## Setup

Make sure to install the dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

Configure your MySQL database connectivity URL in the `.env` file(You might copy the `.env.example` file and rename it to `.env`)

Then you can run the following command to synchronize the schema migrates to the database:

```bash
npm run migrate
```

Put following ONNX format models into the `public/models` directory:

- `recognition-literature.onnx`
- `recognition-rubbing.onnx`
- `detection-literature.onnx`
- `detection-rubbing.onnx`

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm run dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm run build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm run preview

# yarn
yarn preview

# bun
bun run preview
```
