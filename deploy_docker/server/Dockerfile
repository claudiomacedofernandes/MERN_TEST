FROM node:13.14.0

WORKDIR /app

# Copy package.json and install dependencies
COPY package.json .
RUN npm install --production

# Copy the rest of the server files
COPY dist ./dist
COPY .env .
COPY wait-for-it.sh .

# Expose port 3001
EXPOSE 3001

# Command to run the API server
CMD ["node", "dist/index.js"]