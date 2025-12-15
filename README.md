# Aquarium Review Map
A project created to host reviews of aquariums all over the US. Each aquarium can have multiple reviews including overall quality rating and jellyfish exhibit rating, as well as a gallery of user-uploaded photos. The reviews are only posted with permission but available to be viewed publicly by anyone. This site implements a custom JWT authentication mechanism without using any auth frameworks.

<img width="1920" height="918" alt="aquarium-landing" src="https://github.com/user-attachments/assets/fd21a0eb-b1a5-41fe-be7a-e8a44f57340a" />

## Key Features
* Interactive Map with over 100 aquarium locations in the US
* JWT User authentication from scratch
* Ability for verified users to post reviews of aquariums
* Image uploading for verified users

## Tech Stack
* Backend: Express.js, Node.js
* Frontend: React.js
* Database: MongoDB
* Map API: MapBox SDK
* Cloud Image Hosting: Google Cloud Buckets, Multer
* Cloud Deployment: Google Cloud Run

## Getting Started

### Prerequisites
1. Updating npm packages
   ```sh
   npm install
   ```
2. Set up .env file
   ```env
    MONGO_URI=<Your MongoDB database URI>
    JWT_SECRET=<Your Base64 secret key for JWT>
    PROD_URL=<The URL of the deployed site>
   ```

### Running the Project
* Compiling a build for deployment:
   ```sh
   npm run build
   ```
* Running the site's Express.js server locally:
  ```sh
  npm start
  ```

## Acknowledgements
Designed by Theresa He-Cheng
