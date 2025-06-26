import axios from "axios"
import { useState } from "react";
import ReplyCard from "./ReplyCard";
import { useSelector } from "react-redux";

export default function CommentCard({comment}){
    const [isHidden,setIsHidden] = useState(true);
    const[replies,setReplies] = useState([]);
    const [isReplyBoxHidden,setIsReplyBoxHidden] = useState(true);
    const [replyText,setReplyText] = useState("");
    const currVideo = useSelector((state)=>state.playVideo.video);
    const postReply = async()=>{
        const result = await axios.post(`http://localhost:3000/comment/reply/${currVideo._id}/${comment._id}`,{replyContent:replyText},{
            withCredentials:true
        });
        console.log(result);
        if(result.status==201){
            setReplyText("");
            setIsReplyBoxHidden(true);
        }
    }
    const showReply = async()=>{
        const result = await axios.get(`http://localhost:3000/comment/reply/${comment._id}`);
        if(result.status==200){
            setReplies(result.data.replies);
        }
    }
    return(
        <div className="w-full mb-10 px-2">
            <div className="flex gap-x-4 mb-2">
                <img src={comment.user.profile} className="h-8 w-8 rounded-2xl" alt="user Image" />
                <h1>{comment.user.name}</h1>
            </div>
            <p className="mb-2">{comment.commentText}</p>
            <div className="flex gap-x-5 mb-2">
                <button className="btn btn-soft btn-link" 
                    onClick={async()=>{await showReply(); setIsHidden(!isHidden)}}>
                    { isHidden?"Show Replies":"Hide Replies"}
                </button>
                {isReplyBoxHidden && <button onClick={()=>{setIsReplyBoxHidden(!isReplyBoxHidden)}} className="btn btn-primary">Reply</button>}
            </div>
            {!isReplyBoxHidden && 
            <><textarea className="border-1 mt-2 rounded-lg text-2xl w-full h-15" name="replyText" onChange={(e)=>{setReplyText(e.target.value)}} value={replyText} id="reply"></textarea> 
            <button className="btn btn-primary" onClick={postReply}>Reply</button></>
            }
            <div className="w-full pl-4">
                {!isHidden && replies && replies.map((reply)=>{
                    return <ReplyCard reply={reply} key={reply._id} />
                })}
            </div>
        </div>
    )
}