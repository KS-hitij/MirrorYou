import { useRef, useState } from "react";
import { X } from 'lucide-react';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';
import Loading from "../components/Loading";
import Navbar from "../components/Navbar/Navbar";

function Upload() {
    const navigate = useNavigate();
    const [thumbnail, setThumbnail] = useState(null);
    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState("");
    const videoElementRef = useRef(null);
    const [isLoading,setIsLoading] = useState(false);
    const handleKeyDown = (e) => {
        if (e.key === "Enter" && tagInput.trim() != "") {
            e.preventDefault();
            if (!tags.includes(tagInput.trim())) {
                setTags([...tags, tagInput.trim()]);
            }
            setTagInput("");
        }
    }
    const dataURLToBlob = (dataURL) => {
        const byteString = atob(dataURL.split(',')[1]);
        const arrayBuffer = new ArrayBuffer(byteString.length);
        const uintArray = new Uint8Array(arrayBuffer);
        for (let i = 0; i < byteString.length; i++) {
            uintArray[i] = byteString.charCodeAt(i);
        }

        return new Blob([uintArray], { type: 'image/jpeg' });
    };

    const addThumbnail = () => {
        const video = videoElementRef.current;
        if (!video) return;
        video.currentTime = 0.1;
        video.onseeked = () => {
            const canvas = document.createElement("canvas");
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const dataURL = canvas.toDataURL("image/jpeg");
            setThumbnail(dataURL);
        }
    }
    const removeTag = (tagToRemove) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };
    const [videoFile, setVideoFile] = useState(null);
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file)
            return;
        const allowedTypes = ["video/mp4", "video/quicktime", "video/x-msvideo", "video/mpeg", "video/webm", "video/ogg", "video/x-matroska", "video/x-msvideo", "video/3gpp"];

        if (!allowedTypes.includes(file.type)) {
            alert('Only Videos Allowed.');
            e.target.value = '';
            return;
        }
        const url = URL.createObjectURL(file);
        setVideoFile(url);
        setThumbnail(null);
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        const videoData = new FormData(e.target);
        tags.forEach(tag => {
            videoData.append('tags[]', tag);
        });
        if (thumbnail) {
            const thumbnailBlob = dataURLToBlob(thumbnail);
            videoData.append('thumbnail', thumbnailBlob, 'thumbnail.jpg');
        }
        
        try {
            setIsLoading(true);
            const result = await axios.post("http://localhost:3000/videos/upload", videoData, {
                maxContentLength: Infinity,
                maxBodyLength: Infinity,
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setIsLoading(false);
            navigate('/');
            toast.success("Video Uploaded Successfully");
        } catch (err) {
            setIsLoading(false);
            toast.error("Video Upload Failed");
            console.log(err.response);
            
        }
    }
    if (isLoading) {
        return (
          <div className="flex flex-col items-center justify-center relative h-[100vh] w-full " >
            <Loading text="Uploading Video" />
          </div>
        );
      }
    return (<>
        <Navbar/>
        <div className="flex flex-col h-min-[80vh] w-[100vw] items-center overflow-x-hidden">
            <div className="form-container flex flex-col items-start h-full pt-[5vh] w-full lg:min-h-[90vh] lg:w-[60vw] lg:rounded-2xl px-5 lg:pt-30 text-[5vw] lg:text-2xl">
                <form onSubmit={handleSubmit} className="h-full w-full">
                    <div className="lg:flex flex flex-col lg:flex-row w-full justify-center items-center mb-7 lg:mb-6">
                        <label htmlFor="title" className="font-bold mb-4 lg:mr-4 ">Enter Title Of The Video</label>
                        <input type="text" placeholder="Title" required maxLength="32" id="title" name="title" className="w-70 h-10 rounded-2xl p-1 border-2 border-gray-500 outline-0" />
                    </div>
                    <div className="lg:flex flex flex-col lg:flex-row w-full justify-center items-center mb-7 lg:mb-6">
                        <label htmlFor="desc" className=" font-bold mb-4 lg:mr-4 ">Enter Description Of The Video</label>
                        <textarea name="desc" id="desc" className="w-80 h-25 rounded-2xl p-1 border-2 border-gray-500 outline-0" placeholder="Description"></textarea>
                    </div>
                    <div className="lg:flex flex flex-col lg:flex-row w-full justify-center items-center mb-7 lg:mb-6">
                        <label htmlFor="video" className=" font-bold mb-4 lg:mr-4 ">Choose The Video To Be Uploaded</label>
                        <button className="btn btn-primary h-8 p-1 cursor-pointer rounded-2xl"><input type="file" id="video" name="video" required accept="video/" className="font-bold w-30 cursor-pointer" onChange={handleFileChange} placeholder="Video" /></button>
                    </div>
                    {videoFile && <div className="lg:flex flex flex-col lg:flex-row w-full justify-center items-center mb-7 lg:mb-6" >
                        <label htmlFor="preview" className=" font-bold mb-4 lg:mr-4 ">Video Preview</label>
                        <video src={videoFile} id="preview" ref={videoElementRef} onLoadedMetadata={addThumbnail} controls className="h-30 w-50" alt="Preview"></video>
                    </div>}
                    {thumbnail && <div className="lg:flex flex flex-col lg:flex-row w-full justify-center items-center mb-7 lg:mb-6">
                        <label htmlFor="preview" className=" font-bold mb-4 lg:mr-4 ">Thumbnail Preview</label>
                        <img src={thumbnail} alt="Thumbnail" name="thumbnail" className="h-20 w-20" />
                    </div>}
                    <div className="lg:flex flex flex-col lg:flex-row w-full justify-center items-center mb-5 lg:mb-3">
                        <label htmlFor="tags" className=" font-bold mb-4 lg:mr-4 ">Enter Tags For The Video</label>
                        <input type="text" placeholder="Tag" maxLength="32" id="tags" value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={handleKeyDown} className="w-30 h-10 rounded-2xl p-1 border-2 border-gray-500 outline-0" />
                    </div>
                    {tags.length > 0 && <div className="flex flex-wrap w-full justify-center items-center mb-7 lg:mb-5 gap-x-6 gap-y-3" >
                        {tags.map(tag => (
                            <span name="tags" key={tag} onClick={() => removeTag(tag)} className="border-2 border-gray-500 rounded-2xl p-1 w-max-18 px-5 flex items-center justify-around ">{tag}&nbsp;<X className="text-gray-500" ></X></span>
                        ))}
                    </div>}
                    <div className="lg:flex flex flex-col lg:flex-row w-full justify-center items-center mb-5 lg:mb-3 mt-10">
                        <button className="btn btn-primary p-2 rounded-2xl text-xl cursor-pointer">Upload Video</button>
                    </div>
                </form>
                <Toaster/>
            </div>
        </div>
    </>

    )
}
export default Upload;