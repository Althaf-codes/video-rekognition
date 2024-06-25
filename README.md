# Video Rekognition

## Description
The Video Rekognition project utilizes AWS services to analyze video content for explicit, adult, violent, and weapon-related material. Built with HTML, EJS, Express, and Node.js, the app provides a simple user interface for uploading video files to Amazon S3 via presigned URLs. It then uses AWS Rekognition to detect and report on the content of the videos. The AWS SDK for Node.js is used to interact with AWS services.

## Features
- **Video Upload**: Simple UI for uploading video files to Amazon S3.
- **Presigned URLs**: Securely upload videos to S3 using presigned URLs.
- **Content Analysis**: Use AWS Rekognition to analyze video content for explicit, adult, violent, and weapon-related material.
- **Reports**: Generate and view detailed reports on video content.

## Technologies Used
- HTML
- EJS
- Node.js
- Express.js
- AWS S3
- AWS Rekognition
- AWS SDK for Node.js

## Installation Instructions

1. **Clone the repository**:
   ```sh
   git clone https://github.com/Althaf-codes/video-rekognition.git
   cd video-rekognition

2. Install Node.js dependencies:

   ```sh
   npm install

3. Configure environment variables:
   Create a .env file in the root of your project with the following content:

   ```sh
   AWS_REGION =your-aws-region
   S3_BUCKET_NAME =your-s3-bucket-name
   ACCESS_KEY = your-access-key
   SECRET_ACCESS_KEY = your-secret-access-key

4. Run the app:
   ```sh
   node app.js

5. Access the UI:
   Open your web browser and navigate to http://localhost:3000 to access the video upload interface. 

## Created Date:
This project was created on December 18, 2023.