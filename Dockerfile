# Build frontend
FROM node:18-alpine as build_frontend
WORKDIR /app
COPY frontend/package.json ./
COPY frontend/package-lock.json ./
RUN npm ci
COPY frontend ./
RUN npm run build

# Copy frontend and build backend
FROM node:18-alpine as talkootunkki
WORKDIR /app
COPY --from=build_frontend /app/dist ./dist
COPY backend/package.json ./
COPY backend/package-lock.json ./
RUN npm ci
COPY backend ./
RUN npm run build

EXPOSE 80
CMD ["npm", "run", "prod"]
