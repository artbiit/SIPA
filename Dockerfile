# Use the latest Node.js image as the base image
FROM node:latest

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and yarn.lock files first to leverage Docker cache
COPY package.json yarn.lock  swagger.yaml ./

# Install dependencies using yarn
RUN yarn install --frozen-lockfile

# Copy the rest of the application code to the working directory
COPY . .

# Run Prisma generate to build the client
RUN npx prisma generate

# Set environment variables (you can also use a .env file or specify these in docker-compose)
ENV NODE_ENV=production

# Expose the port that your app will run on
EXPOSE 3000

# Start the application
CMD ["yarn", "start"]
