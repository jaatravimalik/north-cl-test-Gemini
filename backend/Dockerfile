FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy dependency definitions
COPY package*.json ./

# Install dependencies safely
RUN npm ci

# Copy all source code
COPY . .

# Build the NestJS app
RUN npm run build

# Expose Port 3000 mapping
EXPOSE 3000

# Start server
CMD [ "npm", "run", "start:prod" ]
