import { useSelector } from "react-redux";
import getDates from "../../../public/js/getDates";
function ReadMore() {
    const video = useSelector((state)=>state.playVideo.video);
    if(!video)  return;
    return(
        <div className="w-[100vw] 2xl:w-[60vw] h-min-[15vh] xl:h-min-[10vh] 2xl:ml-[8vw] p-4 overflow-hidden xl:rounded-2xl bg-gray-100 shadow-lg">
            <p>{getDates(video.timestamp)} ago</p>
            <p>{video.desc}</p>
        </div>
    )
}
export default ReadMore;