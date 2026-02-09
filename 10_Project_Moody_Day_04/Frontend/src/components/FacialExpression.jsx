import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import "./FacialExpression.css";
import MoodSongs from "./MoodSongs";
import axios from 'axios'

export default function FacialExpression() {
  const videoRef = useRef();
  const [mood, setMood] = useState("");

  const [Songs, setSong] = useState([
    {
      title: "title_title",
      artist: "test_artist",
      url: "test_url",
    },
    {
      title: "title_title",
      artist: "test_artist",
      url: "test_url",
    },
    {
      title: "title_title",
      artist: "test_artist",
      url: "test_url",
    },
  ]);

  const loadModels = async () => {
    const MODEL_URL = "/models";
    await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
    await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
  };

  const startVideo = () => {
    navigator.mediaDevices
      // video start karo(video ki accesss mangoge)
      .getUserMedia({ video: true })
      .then((stream) => {
        // webcan ke stream - video stream aayegi use hum videoRef ke through video mein put kar rahe hai
        videoRef.current.srcObject = stream;
      })
      .catch((err) => {
        console.log(err);
      });
  };

  async function detectMood() {
    if (videoRef.current && videoRef.current.readyState === 4) {
      // Ensure video is ready
      const detections = await faceapi
        .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions();

      if (detections.length > 0) {
        const expressions = detections[0].expressions;
        let mostProbableExpression = Object.keys(expressions)[0];

        for (const expression in expressions) {
          if (expressions[expression] > expressions[mostProbableExpression]) {
            mostProbableExpression = expression;
          }
        }
        setMood(mostProbableExpression);
        // /get http://localhost:3000/songs?mood=happy
        axios.get(`http://localhost:3000/songs?mood=${mostProbableExpression}`)
        .then((response)=>{
          console.log(response.data.songs[0])
          setSong(response.data.songs)
        })
        .catch((error)=>{
          console.log(error)
        })
      } else {
        console.log("No Face Detected");
      }
    }
  }

  useEffect(() => {
    loadModels().then(startVideo);
  }, []);

  return (
    <div className="mood-element">
      <h1>Moody Player</h1>
      <div className="detect-section">
        <video ref={videoRef} autoPlay muted className="user-video-feed" />
        <button onClick={detectMood}>Detect Mood</button>
      </div>
      <div className="songs-container">
        <MoodSongs Songs={Songs} />
      </div>
    </div>
  );
}
