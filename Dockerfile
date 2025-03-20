# Use official Node.js 20.12.2 as base image
FROM node:20.12.2

# Install yarn if not already included in the image

# Set working directory
WORKDIR /app

# Copy package.json and yarn.lock (if available)
COPY package*.json yarn*.lock* ./

# Install dependencies
RUN yarn install

# Copy application code
COPY . .

# Build the application
RUN yarn build

# Expose port 80
EXPOSE 80

# Run the application with sudo
# Note: We need to install sudo first
RUN apt-get update && apt-get install -y sudo

# Command to run the application
CMD ["sudo", "yarn", "start"]