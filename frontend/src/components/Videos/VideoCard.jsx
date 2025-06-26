import getDates from "/public/js/getDates";
import '../../index.css'
import { useNavigate } from "react-router-dom";
function VideoCard({video}) {
    const navigate = useNavigate();
    const handleOnClick =()=>{
        navigate(`/watch/${video._id}`);
    }
    return(
        <div className="video-card cursor-pointer rounded-4xl h-90 w-100 m-10" onClick={handleOnClick}>
            <div className="thumbnail w-full " style={{height:"70%"}}>
                <img src={video.thumbnail.url} alt="Thumbnail" className="h-full w-full object-cover rounded-xl"/>
            </div>
            <div className="title flex flex-col items-start justify-around w-full lg:h-[28%] h-[40%]">
                <div className="flex h-[65%] w-full pt-1">
                    <img className="rounded-[50%] h-[90%] w-15 mr-5 pl-0.5" src={video.owner.profile} alt="Channel profile" />
                    <div>
                        <h1 className="lg:text-2xl text-xl overflow-hidden">{video.title}</h1>
                        <h4 className="text-md text-gray-500">{video.owner.name}</h4>
                    </div>
                </div>
                <h4 className="text-md text-gray-500 ml-0.5">{video.views} views &nbsp;&nbsp;{getDates(video.timestamp)} ago</h4>
            </div>
        </div>
    )
}
export default VideoCard