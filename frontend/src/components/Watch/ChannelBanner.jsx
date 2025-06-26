import { ThumbsUp, ThumbsDown, Share2, Axe } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import debounce from 'lodash.debounce';
import { play } from '../../features/video/playVideo';
function ChannelBanner({ interaction, setInteraction, owner }) {
    let video = useSelector((state) => state.playVideo.video);
    const currUser = useSelector((state) => state.auth.user);
    const dipatch = useDispatch();
    const [like, setLike] = useState(interaction.reaction === "like");
    const [dislike, setDislike] = useState(interaction.reaction === "dislike");
    if (!owner) return;
    const debouncedLike = useCallback(
        debounce(async () => {
            const result = await axios.post(`http://localhost:3000/videos/like/${video._id}`, {}, {
                withCredentials: true
            });
            if (result.status != 200) {
                setLike(false);
                return;
            }
            setInteraction(result.data.videoInteraction);
            dipatch(play(result.data.video));
        }, 500),
        [video._id]
    );

    const debouncedDislike = useCallback(
        debounce(async () => {
            const result = await axios.post(`http://localhost:3000/videos/dislike/${video._id}`, {}, {
                withCredentials: true
            });
            if (result.status != 200) {
                setDislike(false);
                return;
            }
            setInteraction(result.data.videoInteraction);
            dipatch(play(result.data.video));
        }, 500),
        [video._id]
    );
    const likeVideo = () => {
        if (!currUser) {
            toast.error("You need to LogIn First");
            return;
        }
        setLike(true);
        debouncedLike();
    }
    const dislikeVideo = () => {
        if (!currUser) {
            toast.error("You need to LogIn First");
            return;
        }
        setDislike(true);
        debouncedDislike();
    }
    const shareVideo = async () => {
        const currentURL = window.location.href;
        try {
            await navigator.clipboard.writeText(currentURL);
            toast.success("Link copied to clipboard");
        } catch (err) {
            toast.error("Link could not be copied");
        }
    }
    useEffect(() => {
        if (interaction) {
            setLike(interaction.reaction === "like");
            setDislike(interaction.reaction === "dislike");
        }
    }, [interaction]);
    return (
        <div className="flex flex-col md:flex-row items-center justify-between pr-5 md:justify-around h-35 md:h-20   w-[100vw] 2xl:w-[60vw] 2xl:ml-[8vw] mt-1 mb-1">
            <div className='flex flex-row h-[45%] md:h-full justify-around text-xl md:text-2xl md:justify-start gap-x-5 w-full md:w-[40%]'>
                <div className=" h-full flex items-center justify-start  gap-x-4.5">
                    <div className="channel-profile"><img src={owner.profile} className="h-10 w-10 rounded-2xl text-xl md:text-2xl " alt="Channel Profile" /></div>
                    <div className="text-xl md:text-2xl flex flex-wrap max-[1000px]:w-8">{owner.name}</div>
                </div>
                <div className="w-[10%] h-full flex items-center justify-start">
                    {(currUser && currUser._id === owner._id) ? <button className="cursor-pointer text-black text-xl md:text-2xl border-2  border-gray-500 h-12 p-1 rounded-4xl">Subscribe</button> : ""}
                </div>
            </div>
            <div className="w-full md:w-[40%] h-[55%] md:h-full flex gap-x-2.5 items-center justify-around">
                <div className="border-2 border-gray-500 md:w-[70%] xl:w-[50%] flex justify-around rounded-4xl h-[65%] w-[45%] md:h-[70%] items-center overflow-hidden">
                    <span className={`flex h-full items-center cursor-pointer pl-2 border-r-2 md:border-gray-500 xl:px-4 transition-all md:rounded-l-3xl duration-200 w-full ${like ? 'bg-blue-600 text-white p-0' : 'bg-white'}`} onClick={likeVideo}><ThumbsUp />&nbsp; {video.likes}</span>
                    <span className={`flex h-full items-center cursor-pointer pl-2  md:border-gray-500 xl:px-4 transition-all duration-200 w-full ${dislike ? 'bg-blue-600 text-white p-0' : 'bg-white'}`} onClick={dislikeVideo}><ThumbsDown />&nbsp;{video.dislikes}</span>
                </div>
                <div className="border-2 border-gray-500 flex rounded-3xl w-[30%] h-[65%] md:h-[70%] items-center overflow-hidden">
                    <span className="flex h-full items-center cursor-pointer px-3 xl:px-4 " onClick={shareVideo}><Share2 className="md:mr-1" /> Share</span>
                </div>
            </div>
            <Toaster />
        </div>
    )
}
export default ChannelBanner;