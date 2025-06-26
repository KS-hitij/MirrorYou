import axios from "axios"
import Navbar from "../components/Navbar/Navbar"
import { useEffect, useState } from "react"
import Videos from "../components/Videos/Videos";
import { useLocation } from "react-router-dom";
import toast,{Toaster } from 'react-hot-toast';
import { AnimatePresence, motion } from "motion/react";
import Loading from "../components/Loading";

function Home(){
    const [videos,setVideos] = useState([]);
    const location = useLocation();
    const [isLoading,setIsloading] = useState(true);
    useEffect(()=>{
        const fetchVideo = async ()=>{
            const result = await axios.get('http://localhost:3000/videos/');
            const data = result.data;
            setVideos([...data]);
        }
        fetchVideo();
        setTimeout(()=>{setIsloading(false)},1000);
    },[location.key])
    if(isLoading){
        return(
            <AnimatePresence>
                <motion.div className='flex h-[100vh]  justify-center items-center' >
                    <Loading/>
                </motion.div>
            </AnimatePresence>
        )
    }
    return(  
        <div className="h-full w-full" >
            <Navbar className="w-full" videos={videos} setVideos={setVideos} />
            <Videos videos={videos}/>
            <Toaster />
        </div>
    )
}
export default Home