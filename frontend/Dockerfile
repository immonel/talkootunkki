FROM node:18-alpine

WORKDIR /app
EXPOSE 3000

COPY package.json package-lock.json ./
RUN npm ci
COPY . ./

CMD ["npm", "run", "dev"]