# Base image
FROM node:slim

# Set working directory
WORKDIR /app

# Copy package files and install deps
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Build the app
RUN npm run build

# Expose port and start
EXPOSE 3000
CMD ["npm", "start"]