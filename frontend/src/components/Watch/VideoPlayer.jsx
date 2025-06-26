import { useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "videojs-contrib-quality-levels";
import "videojs-hls-quality-selector";
import axios from "axios";

function VideoPlayer() {
  const currVideo = useSelector((state) => state.playVideo.video);
  const currUser = useSelector((state)=>state.auth.user);
  const videoRef = useRef();
  const playerRef = useRef();

  const registerView = async()=>{
    if(!currUser){
      return;
    }
    await axios.post(`http://localhost:3000/videos/registerView/${currVideo._id}`,{},{
      withCredentials:true
    });
    return;
  }

  useEffect(() => {
    const lastTimer = sessionStorage.getItem("registerTimer");
    if(lastTimer){
      clearTimeout(+lastTimer);
    }
    const timer = setTimeout(registerView,0);
    sessionStorage.setItem('registerTimer',JSON.stringify(timer));
    if (!currVideo) return;
    const initializePlayer = () => {
      const player = videojs(videoRef.current, {
        controls: true,
        autoplay: true,
        fill: true,
        preload: 'auto',
        html5: {
          vhs: {
            overrideNative: true,
            enableLowInitialPlaylist: true,
          }
        },
        sources: [{
          src: currVideo.video.url,
          type: 'application/x-mpegURL'
        }],
      });

      player.ready(() => {
        setTimeout(() => {
          try {
            if (player.qualityLevels) {
              player.qualityLevels();
            }
            if (player.hlsQualitySelector) {
              player.hlsQualitySelector({ displayCurrentQuality: true });
            }
          } catch (error) {
            console.error('Quality plugin error:', error);
          }
        }, 500);
      });

      return player;
    };

    if (!playerRef.current) {
      playerRef.current = initializePlayer();
    }

    return () => {
      if (playerRef.current && !playerRef.current.isDisposed()) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [currVideo._id]);

  if (!currVideo) return null;

  return (
    <div className="w-[100vw] h-[40vh] md:h-[50vh] xl:w-[60vw] lg:h-[60vh] 2xl:ml-[8vw] lg:mt-[5vh] relative z-10 rounded-2xl">
      <video 
        key={currVideo._id}
        poster={currVideo.thumbnail.url} 
        ref={videoRef} 
        className="w-full h-full video-js vjs-big-play-centered"
      />
    </div>
  );
}

export default VideoPlayer;