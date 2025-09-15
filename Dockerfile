# Use official Node.js LTS image
FROM node:22-alpine AS base

# Set working directory
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Build the Next.js app
RUN pnpm build

# Expose port (default for Next.js)
EXPOSE 3000

# Start the Next.js app
CMD ["pnpm", "start"]
