# Use a multi-stage build for better efficiency
FROM node:14 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Build the application
RUN npm run build

# Start a new stage for the final image
FROM node:14-alpine

WORKDIR /app

COPY --from=builder /app/dist /app
COPY package*.json ./

RUN npm install --only=production

EXPOSE 3000

CMD ["node", "server.js"]

