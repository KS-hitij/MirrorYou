import Navbar from "../components/Navbar/Navbar";
import VideoPlayer from "../components/Watch/VideoPlayer";
import Desc from "../components/Watch/Desc";
import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { play } from "../features/video/playVideo";
import Loading from "../components/Loading";
import CommentSection from "../components/CommentSection/CommentSection";

function Watch() {
  const { videoId } = useParams();
  const dispatch = useDispatch();
  const [interaction, setInteraction] = useState(null);
  const [owner, setOwner] = useState(null);
  const [loading, setLoading] = useState(true);
  const currUser = useSelector((state) => state.auth.user);

  useEffect(() => {
    async function fetchData() {
      try {
        const videoRes = await axios.get(`http://localhost:3000/videos/info/${videoId}`, {withCredentials: true,});
        dispatch(play(videoRes.data));
        let interactionRes = {reaction:"none"};
        if(currUser)
        interactionRes = await axios.get(`http://localhost:3000/videos/interactions/${videoId}`, {withCredentials: true,});
        if(currUser)
          setInteraction(interactionRes.data.interactions);
        else{
          setInteraction(interactionRes);
        }
        setOwner(videoRes.data.owner);
      } catch (err) {
        console.error("Error fetching video data:", err);
      } finally {
        setTimeout(()=>{setLoading(false);},2500);
      }
    }
    if (videoId) {
      fetchData();
    }
  }, [videoId, dispatch]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center relative h-[100vh] w-full " >
        <Loading/>
      </div>
    );
  }

  return (
    <div className="flex flex-col relative h-full w-full">
      <Navbar />
      <VideoPlayer />
      <Desc interaction={interaction} owner={owner} setInteraction={setInteraction} />
      <CommentSection/>
    </div>
  );
}
export default Watch;