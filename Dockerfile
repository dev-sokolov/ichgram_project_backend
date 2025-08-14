FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json tsconfig*.json ./
RUN npm ci
COPY src ./src
RUN npm run build

FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=builder ./app/dist ./dist
RUN mkdir -p /app/temp
EXPOSE 3000 5000
CMD ["npm", "dist/index.js"]

