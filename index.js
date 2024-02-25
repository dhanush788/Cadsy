import axios from "axios";

const  Cadsy = ({ children }) => {
  
  const findVideoElement = () => {
    return document.getElementById('cadsyvideo');
  };

  const captureAndPostFrames = async () => {
    // console.log(videoElement,"videoelement from capture and post frame")
    const canvas = document.createElement('canvas');

    const videoElement = document.querySelector('#cadsyvideo video');
    // Ensure the video element is present and ready
    if (!videoElement || videoElement.readyState !== 4) {
        console.log("Video element not ready, please wait.");
        return;
    }

    const ctx = canvas.getContext('2d');

    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;

    ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

    const image = canvas.toDataURL('image/jpeg');

    try {
      // Perform two API requests concurrently
      const [response1, response2,response3] = await Promise.all([
        axios({
          method: "POST",
          url: "https://detect.roboflow.com/boobs-hlpjy/1",
          params: {
              api_key: "bDlLbarnCWb5q2UlZjnc"
          },
          data: image,
          headers: {
              "Content-Type": "application/x-www-form-urlencoded"
          }
      }),
        axios({
          method: "POST",
          url: "https://detect.roboflow.com/dicks-b5fv4/1",
          params: {
              api_key: "YiMe3gOCmm3WgkvBImqY"
          },
          data: image,
          headers: {
              "Content-Type": "application/x-www-form-urlencoded"
          }
      }),
        axios({
          method: "POST",
          url: "https://detect.roboflow.com/bikinis/1",
          params: {
            api_key: "UUD1qWjeQoBRsTOlhmhi"
          },
          data: image,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          }
        })
      ]);
        

      console.log('Image posted to API 1:', response1.data);
      console.log('Image posted to API 2:', response2.data);
      console.log('Image posted to API 3:', response3.data);
      if(response1.data.predictions.length > 0){
        localStorage.setItem('vulgar', JSON.stringify(response1.data.predictions));
        window.location.reload()
      }
      if(response2.data.predictions.length > 0){
        localStorage.setItem('vulgar', JSON.stringify(response2.data.predictions));
        window.location.reload()
      }
      if(response3.data.predictions.length > 0){
        localStorage.setItem('vulgar', JSON.stringify(response3.data.predictions));
        window.location.reload()
      }
    } catch (error) {
      console.error('Error posting images to APIs:', error);
    }
  };

  const processVideo = () => {
    // console.log('setInterval is running...'); // Log message when setInterval runs
    const videoElement = findVideoElement();
    if (videoElement) {
        // console.log(videoElement,"videoelementttttttt")
      captureAndPostFrames();
    }
  };

  // Set interval to call processVideo every 5 seconds (5000 milliseconds)
  setInterval(processVideo, 5000);
  const vulgarInLocalStorage = localStorage.getItem('vulgar');
  if (vulgarInLocalStorage) {
    alert("you are banned from this site");
    return 
  }

  return children;
};

export default Cadsy
