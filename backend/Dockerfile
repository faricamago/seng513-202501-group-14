# Base image
FROM node:slim

# Set working directory
WORKDIR /app

# Copy pkg files and install deps
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Expose port and start
EXPOSE 5000
CMD ["node", "server.js"]