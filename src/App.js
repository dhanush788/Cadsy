import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  MeetingProvider,
  useMeeting,
  useParticipant,
} from "@videosdk.live/react-sdk";
import ReactPlayer from "react-player";
import axios from "axios";
// import Cadsy from "cadsy";

let flag = false;

function MeetingView() {
  const [joined, setJoined] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState([]);
  const ws = useRef(null);
  const { join, participants } = useMeeting({
    onMeetingJoined: () => {
      setJoined("JOINED");
    },
  });

  useEffect(() => {
    // Simulate WebSocket communication
    const simulateWebSocket = () => {
      const handleMessage = (event) => {
        const message = JSON.parse(event.data);
        setMessages((prevMessages) => [...prevMessages, message]);
      };

      ws.current = {
        addEventListener: (eventName, handler) => {
          if (eventName === "message") {
            handleMessage.handler = handler;
          }
        },
        removeEventListener: (eventName) => {
          if (eventName === "message") {
            delete handleMessage.handler;
          }
        },
        send: (message) => {
          handleMessage({ data: message }); // Call the handler directly
        },
        close: () => { },
      };
    };

    simulateWebSocket();

    return () => {
      // Cleanup
      ws.current = null;
    };
  }, []);

  const joinMeeting = () => {
    setJoined("JOINING");
    flag = true;
    join();
  };

  const handleSendMessage = () => {
    if (messageInput.trim() !== "") {
      // Send message via simulated WebSocket
      ws.current.send(JSON.stringify({ message: messageInput }));
      setMessageInput("");
    }
  };

  return (
    <div className="container">
      {joined && joined === "JOINED" ? (
        <div>
          {[...participants.keys()].map((participantId) => (
            <ParticipantView
              participantId={participantId}
              key={participantId}
            />
          ))}
          <div>
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
            />
            <button onClick={handleSendMessage}>Send</button>
          </div>
          <div>
            {messages.map((message, index) => (
              <div key={index}>{message.message}</div>
            ))}
          </div>
        </div>
      ) : joined && joined === "JOINING" ? (
        <p>Joining the meeting...</p>
      ) : (
        <button onClick={joinMeeting}>Join the meeting</button>
      )}
    </div>
  );
}

function ParticipantView(props) {
  const micRef = useRef(null);
  const [ready, setReady] = useState(false);

  const [canvas, setCanvas] = useState(null);

  useEffect(() => {
    const canvasElement = document.createElement("canvas");
    setCanvas(canvasElement);
  }, []);
  const { webcamStream, micStream, webcamOn, micOn, isLocal, displayName } =
    useParticipant(props.participantId);

  const videoStream = useMemo(() => {
    if (webcamOn && webcamStream) {
      const mediaStream = new MediaStream();
      mediaStream.addTrack(webcamStream.track);
      return mediaStream;
    }
  }, [webcamStream, webcamOn]);

  useEffect(() => {
    if (micRef.current) {
      if (micOn && micStream) {
        const mediaStream = new MediaStream();
        mediaStream.addTrack(micStream.track);

        micRef.current.srcObject = mediaStream;
        micRef.current
          .play()
          .catch((error) =>
            console.error("videoElem.current.play() failed", error)
          );
      } else {
        micRef.current.srcObject = null;
      }
    }
  }, [micStream, micOn]);

  const videoRef = useRef(null);

  const captureAndPostFrames = async () => {
    if (videoRef.current && ready && canvas) {
      const video = videoRef.current.getInternalPlayer(); // Get the video element from ReactPlayer
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height); // Render the video frame onto the canvas

      const image = canvas.toDataURL("image/jpeg");

      try {
        const [response1, response2] = await Promise.all([
          axios({
            method: "POST",
            url: "https://detect.roboflow.com/boobsdetector/1",
            params: {
              api_key: "sZFjx8Fimj7ZtIWfDnwo"
            },
            data: image,
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            }
          }),
          axios({
            method: "POST",
            url: "https://detect.roboflow.com/dickdetector/3",
            params: {
                api_key: "4WvQYKCiiFjRFkdUHdWw"
            },
            data: image,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        })
        ]);

  console.log('Image posted to API 1:', response1.data);
  console.log('Image posted to API 2:', response2.data);
} catch (error) {
  console.error('Error posting images to APIs:', error);
}
    }
  };


useEffect(() => {
  const intervalId = setInterval(() => {
    // captureAndPostFrames();
  }, 3000);

  return () => clearInterval(intervalId);
}, [videoRef, ready, canvas]);

return (
  <div>
    <audio ref={micRef} autoPlay playsInline muted={isLocal} />
    {webcamOn && (
      <ReactPlayer
        ref={videoRef}
        onReady={() => { setReady(true) }}
        playsinline
        pip={false}
        id="cadsyvideo"
        light={false}
        controls={false}
        muted={true}
        playing={true}
        url={videoStream}
        height={"300px"}
        width={"300px"}
        onError={(err) => {
          console.log(err, "participant video error");
        }}
      />
    )}
  </div>
);
}

const App = () => {

  return (
    <>
    {/* <Cadsy> */}
      <MeetingProvider
        config={{
          meetingId: "rae1-g8pe-drp3",
          micEnabled: true,
          webcamEnabled: true,
          name: "Dhanush's Org",
        }}
        token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiIyOTU1NzZmNi04ZTg0LTQxNjQtYmYyNS1mMWIyYjk1M2VjNWEiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0sImlhdCI6MTcwODc2NTg3MywiZXhwIjoxNzA4ODUyMjczfQ.pvsOYpgIWRG00ee6W1IZ-7FL5eGexGaBJvRf-NEfzbk"
      >
        <MeetingView />
      </MeetingProvider>
      {/* <h1 id="cadsyvideotrigger">hi</h1> */}
       {/* </Cadsy> */}
    </>
  );
};

export default App;
