# palm-kb-websearch

This project is a RESTful web service built with Node.js, TypeScript, and Express. It is ready to be built and run as a Docker image.

## Development

- Install dependencies: `npm install`
- Run in development mode: `npm run dev`
- Build TypeScript: `npm run build`
- Start production server: `npm start`

## Docker

To build and run the Docker image:

```sh
docker build -t palm-kb-websearch .
docker run -p 3000:3000 palm-kb-websearch
```

The service will be available at http://localhost:3000/
