const{S3Client, GetObjectCommand, PutObjectCommand} = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const {RekognitionClient,StartContentModerationCommand,GetContentModerationCommand} = require('@aws-sdk/client-rekognition');
const dotenv = require('dotenv');

dotenv.config();

const s3Client = new S3Client({
    region:process.env.AWS_REGION,
    credentials:{
        accessKeyId:process.env.ACCESS_KEY,
        secretAccessKey:process.env.SECRET_ACCESS_KEY 
    }
})

const client = new RekognitionClient({region:process.env.AWS_REGION,credentials:{
    accessKeyId:process.env.ACCESS_KEY,
    secretAccessKey:process.env.SECRET_ACCESS_KEY }});

async function getObjectUrl(key){
    const command = new GetObjectCommand({
        Bucket:process.env.S3_BUCKET_NAME,
        Key:key,
    });

    const url = getSignedUrl(s3Client,command,{expiresIn:3600});
    // console.log(url);
    return url;
}


async function putObject(filename,contentType){
    const command = new PutObjectCommand({
        Bucket:process.env.S3_BUCKET_NAME,
        Key:`uploads/${filename}`,
        ContentType:contentType
    });


    const url = getSignedUrl(s3Client,command);

    return url;
} 


async function startmoderation(objectName){
    const input = { // StartContentModerationRequest
        Video: { // Video
          S3Object: { // S3Object
            Bucket: process.env.S3_BUCKET_NAME,
            Name: objectName,
           
          },
        
        },
        MinConfidence: 60,
    };
    
    const command =new  StartContentModerationCommand(input);
    const response = await client.send(command)
    
    // if(response.JobId){

    // moderationresponse = await getmoderation(response.JobId);
    // return moderationresponse;
    // }
    console.log(`The Full StartModeration Response is ${JSON.stringify(response)}`);


    
    return response;

}

async function getmoderation(jobId,RequestToken){
    const input = {
        "ClientRequestToken":RequestToken,
        "JobId":jobId

    }
    const command  = new GetContentModerationCommand(input);
    const response = await client.send(command);
    console.log(`The Full GetModeration Response is ${JSON.stringify(response)}`);
    const moderationresponse = response["ModerationLabels"];

    const UniqueModerationResponse = getUniqueTimestamps(moderationresponse);
    // for(let i=0;i < moderationresponse.length;i++){

    // }
    return [UniqueModerationResponse,response.JobStatus];

}


function getUniqueTimestamps(arr){
const seen = new Set();

const filteredArr = arr.filter(el => {
  const duplicate = seen.has(el.Timestamp);
  seen.add(el.Timestamp);
  return !duplicate;
});

return filteredArr;
}  
// async function init(){
//     console.log("The Url is ", await getObjectUrl("uploads/alcohol_test_video.mp4"));
//     // console.log("Thr Url is",await putObject(`image-${Date.now()}.jpeg`,"image/jpeg"));

//     // console.log("The Response is",await startmoderation("uploads/nato_test_video.mp4"));
//     // console.log("The Response is",await getmoderation("1358c849f8f211ad6a38b0af49a63e4e1f6e8659fea196e2f2d54ba90d4abf6a"));

// }

// init();

module.exports = {getObjectUrl,putObject,startmoderation,getmoderation,getUniqueTimestamps};