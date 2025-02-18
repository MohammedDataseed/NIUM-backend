# # # FROM node:20.17.0-slim
# # # WORKDIR /usr/src/app
# # # COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
# # # RUN npm install --silent
# # # COPY . .
# # # RUN npm run build


# # # # FROM node:20.17.0-alpine
# # # WORKDIR /usr/src/app
# # # COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
# # # RUN npm install --silent --production
# # # EXPOSE 4400
# # # COPY --from=0 /usr/src/app/dist/ /usr/src/app/dist/
# # # CMD npm run start:prod


# # # Build Stage
# # # FROM node:20.17.0-slim AS builder

# # FROM mirror.gcr.io/library/node:20.17.0-alpine AS builder
# # WORKDIR /usr/src/app

# # # Copy package files and install dependencies
# # COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
# # RUN npm install --silent

# # # Copy the rest of the files
# # COPY . .
# # RUN npm run build

# # # Production Stage
# # # FROM node:20.17.0-alpine

# # FROM mirror.gcr.io/library/node:20.17.0-alpine AS stage-1
# # WORKDIR /usr/src/app

# # # Copy only required files from the builder stage
# # COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
# # RUN npm install --silent --production

# # COPY --from=builder /usr/src/app/dist/ /usr/src/app/dist/

# # EXPOSE 4400
# # CMD ["npm", "run", "start:dev"]


# # Build Stage
# FROM mirror.gcr.io/library/node:20.17.0-alpine AS builder
# WORKDIR /usr/src/app

# # Copy package files and install all dependencies (including dev)
# COPY package.json package-lock.json* ./
# RUN npm install --silent  # Install both prod + dev dependencies

# # Copy the rest of the files
# COPY . .

# # Run the build process
# RUN npm run build

# # Development Stage
# FROM mirror.gcr.io/library/node:20.17.0-alpine AS dev
# WORKDIR /usr/src/app

# # Copy built files from builder stage
# COPY --from=builder /usr/src/app .

# # Expose port (if needed)
# EXPOSE 3000

# # Start the application (Replace with your NestJS start command)
# CMD ["npm", "run", "start:dev"]

# Build Stage
FROM mirror.gcr.io/library/node:20.17.0-alpine AS builder
WORKDIR /usr/src/app

# Copy package files and install all dependencies (including dev dependencies)
COPY package.json package-lock.json* ./ 
RUN npm install --silent  # Installs both prod and dev dependencies

# Copy the rest of the files
COPY . .

# Run the build process (typically for production, but not needed for dev stage)
RUN npm run build

# Development Stage
FROM mirror.gcr.io/library/node:20.17.0-alpine AS dev
WORKDIR /usr/src/app

# Copy built files from the builder stage
COPY --from=builder /usr/src/app ./

# Expose port for development (use port 3000 or whatever port your app runs on)
EXPOSE 3001

# Start the application in development mode
CMD ["npm", "run", "start:dev"]
