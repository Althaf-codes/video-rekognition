

document.getElementById("videoUpload").onchange = function(event) {
    let file = event.target.files[0];
    let blobURL = URL.createObjectURL(file);
    document.getElementById("myVideo").style.display = 'block';
    document.getElementById("myVideo").src = blobURL;
  }



  function seekToTime(time) {
    const video = document.getElementById('myVideo');
    const seconds = Math.floor((time / 1000) % 60);

    video.currentTime = seconds;
    video.play();
  }


  async function analyzeData(){
    console.log('Analyze Function Invoked');
    const objKey = ""
  //  await fetch(" https://localhost:3000/api/analyze",{
  //     method: 'POST',
  //     body: JSON.stringify({"ObjectKey":objKey})
  //   });
  }