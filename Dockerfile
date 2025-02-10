# Stage 1: Build the Angular application
FROM node:18 AS build

WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
RUN npx ngcc --properties es2023 browser module main --first-only --create-ivy-entry-points

COPY . .
RUN npm run build --prod

# Stage 2: Serve the Angular app using Nginx
FROM nginx:stable

# Copy the custom nginx.conf into the container
COPY nginx/nginx.conf /etc/nginx/nginx.conf

# Copy the built Angular files to the Nginx directory
COPY --from=build /app/dist/aqua-select/browser /usr/share/nginx/html


# Expose port 80 for the container
EXPOSE 80
