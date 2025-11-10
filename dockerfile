# ---- Use lightweight Node.js image ----
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy dependency files first (for caching)
COPY package*.json ./

# Install dependencies (both dev + prod)
RUN npm install

# Copy all code
COPY . .

# Expose app port
EXPOSE 3000

# Automatically detect environment and run correct command
CMD [ "sh", "-c", "if [ \"$NODE_ENV\" = 'production' ]; then npm start; else npm run dev; fi" ]
