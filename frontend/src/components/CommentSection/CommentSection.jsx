import { useEffect, useState } from "react"
import axios from "axios";
import { useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import CommentCard from "./CommentCard";

export default function CommentSection() {
    const [commentContent, setCommentContent] = useState("");
    const currVideo = useSelector((state) => state.playVideo.video);
    const [comments, setComments] = useState([]);
    const fetchComments = async () => {
        const result = await axios.get(`http://localhost:3000/comment/${currVideo._id}`);
        setComments(result.data.comments);
    }
    const handlePost = async () => {
        const result = await axios.post(`http://localhost:3000/comment/${currVideo._id}`, { commentContent }, {
            withCredentials: true
        });
        setCommentContent("");
        if (result.status == 200) {
            toast.success("Comment Posted");
        }
        fetchComments();
    }
    useEffect(() => {

        fetchComments();
    }, [])
    return (
        <div className="xl:w-[60vw] w-[100vw] flex flex-col 2xl:ml-[8vw] px-1 pb-5 mb-5">
            <div className="w-full mb-8">
                <h1 className="text-3xl font-bold tracking-tighter mb-2">Post a comment</h1>
                <textarea className="border-1 rounded-lg text-2xl w-full h-25" value={commentContent}
                    onChange={(e) => { setCommentContent(e.target.value) }} name="commentContent"></textarea>
                <button onClick={handlePost} className="btn btn-primary">Post</button>
            </div>
            <div >
                {comments.map((comment, key) => (
                    <CommentCard key={key} comment={comment} />
                ))}
            </div>
            <Toaster />
        </div>
    )
}