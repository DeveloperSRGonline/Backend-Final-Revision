import React, { useState, useRef, useEffect } from "react";
import "./MoodSongs.css";

const MoodSongs = ({ Songs }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(new Audio());

  useEffect(() => {
    const audio = audioRef.current;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.pause();
    };
  }, []);

  const handleClick = (song) => {
    const audio = audioRef.current;

    if (currentSong?.audio_url === song.audio_url) {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        audio.play();
        setIsPlaying(true);
      }
    } else {
      if (currentSong) audio.pause();

      audio.src = song.audio_url;
      audio.currentTime = 0;
      audio.load();
      audio.play();

      setCurrentSong(song);
      setIsPlaying(true);
    }
  };

  const handleSeek = (e) => {
    const newTime = e.target.value;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  return (
    <div className="mood-songs">
      <h2>Recomended Song</h2>
      {Songs.map((song, index) => (
        <div className="song-card" key={index}>
          <div className="title">
            <h3>{song.title}</h3>
            <p>{song.artist}</p>
          </div>

          {currentSong?.audio_url === song.audio_url && (
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              className="seek-slider"
              style={{ margin: "0 10px", flexGrow: 1 }}
            />
          )}

          <div onClick={() => handleClick(song)} className="play-pause-button">
            {currentSong?.audio_url === song.audio_url && isPlaying ? (
              <i className="ri-pause-line"></i>
            ) : (
              <i className="ri-play-line"></i>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MoodSongs;
