# Stage 1: Build the Application
FROM node:18 AS build

# Set the working directory inside the container
WORKDIR /usr/src/app

# Since Fly.io's GitHub integration builds from the root folder of your monorepo, 
# we must prefix everything with "backend/" so it can find the files!
COPY backend/package*.json ./

# Install dependencies safely
RUN npm install

# Copy the rest of the backend source code
COPY backend/ ./

# Build the NestJS app (Compiles TypeScript files into the /dist folder)
RUN npm run build

# Stage 2: Create the Final Production Image
FROM node:18

# Set the working directory
WORKDIR /usr/src/app

# Copy the node_modules and built application files from the 'build' stage
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/package*.json ./
COPY --from=build /usr/src/app/dist ./dist

# Create the uploads folder (for image uploading) and give permissions
RUN mkdir uploads && chown -R node:node uploads

# Expose the port your app runs on
ENV PORT=8080
EXPOSE $PORT

# Run the application using the non-root user (recommended for security)
USER node

# Define the command to start your NestJS application
CMD [ "node", "dist/main.js" ]
