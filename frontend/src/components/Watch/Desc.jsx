import ChannelBanner from "./ChannelBanner";
import ReadMore from "./ReadMore";
import { useSelector } from "react-redux";
function Desc({interaction,setInteraction,owner}) {
    const currVideo = useSelector((state) => state.playVideo.video);
    return(
        <div className="mb-10 flex flex-col">
            <h1 className=" 2xl:ml-[9vw] mt-2 text-3xl md:text-4xl text-black tracking-tight">{currVideo.title}</h1>
            <ChannelBanner interaction={interaction} setInteraction={setInteraction} owner={owner}/>
            <ReadMore/>
        </div>
    )
}
export default Desc;