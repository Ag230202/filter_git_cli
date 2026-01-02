# Use lightweight Node image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy source code
COPY . .

# Make CLI executable
RUN chmod +x bin/index.js

# Set default command
ENTRYPOINT ["node", "bin/index.js"]
