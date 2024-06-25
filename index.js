const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const multer = require('multer');
const {putObject, startmoderation, getmoderation,getObjectUrl}= require('./helper');



const app = express();
const port = 3000;
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // limit file size to 5MB
  },
});


app.set("view engine","ejs");
app.set("views",path.resolve("./views"));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.get('/',  (req, res) => {
  // res.sendFile(__dirname + '/index.html');
  return  res.render("home");

});
app.post('/api/uploads', upload.single('file'), async (req, res) => {
    try {
      const file = req.file;
      const fileName = file.originalname.toString();
      const key = `uploads/${fileName}`;
  
      // Create a presigned URL for the S3 bucket
    //   const params = {
    //     Bucket: 'YOUR_S3_BUCKET_NAME',
    //     Key: fileName,
    //     ContentType: file.mimetype,
    //     ACL: 'public-read', // Set appropriate permissionsf
    //   };
  
      const presignedUrl = await putObject(fileName,file.mimetype);
  
      // Redirect the client to the presigned URL

      console.log(`The Presigned Url is ${presignedUrl}`);


      return await fetch(presignedUrl, {
        method: 'PUT',
        body: req.file.buffer,
        headers:{
          'Content-Type': 'multipart/form-data'
        }
      }).then((response) => {
        if (!response.ok) {
          return res.render("home",{error:"Failed to Upload"});
        }
        console.log(`The upload response is ${JSON.stringify(response)}`);
        console.log(`The upload response orginal is ${response}`);
        console.log('%c The Upload Response is OK', 'color: green');
        return  res.render('home',{fileUploaded:true,ObjectKey:key}) 
      })

      
      // console.log(`The upload response is ${JSON.stringify(uploadResponse)}`);
      // console.log(`The upload response orginal is ${uploadResponse}`);


      // if (uploadResponse.ok) {
      // //  const startmoderationresponse=  await startmoderation(key);
      // console.log('%c The Upload Response is OK', 'color: green');
      // //  const getmoderationresponse = await getmoderation(startmoderationresponse.JobId);
      // //  console.log(`The moderation Response is ${getmoderationresponse}`);
      // return  res.render('home',{fileUploaded:true,ObjectKey:key}) 
        // return res.send({ ObjectKey:key});
      //  res.render("index",{objectKey:key});

        // res.json({"message":'File uploaded successfully!',"Upload Response":uploadResponse});



      // } else {
      //   return res.render("home",{error:"Failed to Upload"});
      //   // res.json({"message":'Error uploading file.'});

      // }
      
    } catch (error) {
      
      console.error('Error uploading file:', error);
      return res.render("home",{error:"Failed to Upload"});

      // res.status(500).send('Internal Server Error');
    }
  });
  app.post('/api/startAnalyze',async(req,res)=>{
    try {
      
      const ObjectKey= req.body.ObjectKey;
      console.log(`The Random Id received ${ObjectKey}`);


      if(ObjectKey){
        const Url = await getObjectUrl(ObjectKey);
        console.log(`The presignedUrl is ${JSON.stringify(Url)}`);
        const startmoderationresponse=  await startmoderation(ObjectKey);


        // setTimeout(async() => {
        //   const getmoderationresponse = await getmoderation(startmoderationresponse.JobId);
        //  console.log(`The moderation Response is ${getmoderationresponse}`);
        //  return res.render('home',{moderations:getmoderationresponse}) 
        // },5000 );
        // return res.render('home',{jobId:startmoderationresponse.JobId,presignedUrl:Url})



        
        return res.render('home',{jobId:startmoderationresponse.JobId,presignedUrl:Url})

      }else{
        throw Error('Object Key Missing');
      }
     

    } catch (error) {
      console.error('Error Moderating file:', error);
      return res.render("home",{error:error});

      // res.status(500).send('Internal Server Error');
    }
  });

  app.post('/api/GetAnalyzeResult',async(req,res)=>{
    try {
      
      const JobId = req.body.JobId;
      const RequestToken = req.body.RequestToken;
      const url = req.body.presignedUrl;
      console.log('============================================================');
      console.log(`The Url recieved in GetAnalayzeResult ${url}`);
      console.log(`The JobId received ${JobId}`);
      console.log('============================================================');
     
        const getmoderationresponse = await getmoderation(JobId,RequestToken);
      console.log('============================================================');

       console.log(`The moderation Response is ${JSON.stringify(getmoderationresponse[0])}`);

      console.log('============================================================');

      // return res.render('home',{data:[],AnalyserResult:"SUCCEEDED",presignedUrl:url}); 

       return res.render('home',{data:getmoderationresponse[0],AnalyserResult:getmoderationresponse[1],presignedUrl:url}); 
     
      

    } catch (error) {
      console.error('Error Moderating file:', error);
      return res.render("home",{error:"Internal Server Error"});

      // res.status(500).send('Internal Server Error');
    }
  });

  
  app.get('/api/dummy',async(req,res)=>{
    try {
      
      const dummyData =  [
        {"ModerationLabel":{"Confidence":91.28657531738281,"Name":"Weapon","ParentName":""},"Timestamp":0},
        {"ModerationLabel":{"Confidence":66.8774185180664,"Name":"Weapon Violence","ParentName":"Violence"},"Timestamp":0},
        {"ModerationLabel":{"Confidence":91.28657531738281,"Name":"Weapons","ParentName":"Violence"},"Timestamp":0},
        {"ModerationLabel":{"Confidence":91.39778900146484,"Name":"Violence","ParentName":""},"Timestamp":520},
        {"ModerationLabel":{"Confidence":64.1693115234375,"Name":"Weapon Violence","ParentName":"Violence"},"Timestamp":520}];
        console.log("Its here");
        return res.render("home",{data:dummyData});

    } catch (error) {
      console.error('Error Moderating file:', error);
      return res.render("home",{error:"Internal Server Error"});

      // res.status(500).send('Internal Server Error');
    }
  });

  
  app.listen(port, () => {
    console.log(`Server is running at https://localhost:${port}`);
  });