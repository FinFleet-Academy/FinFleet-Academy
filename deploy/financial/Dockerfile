# Multi-stage build for production
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source
COPY . .

# In a real microservice, we might only copy the financial-related files
# But here we assume the monolith is structured to be split-able

# Final image
FROM node:20-alpine

WORKDIR /app
COPY --from=builder /app /app

EXPOSE 5000

# Set environment variables for the financial microservice
ENV NODE_ENV=production
ENV SERVICE_NAME=financial-intelligence

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget -qO- http://localhost:5000/api/financial/cards || exit 1

CMD ["npm", "start"]
