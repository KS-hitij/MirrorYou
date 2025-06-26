export default function ReplyCard({reply}){
    return(
        <div className="w-full flex mb-3 px-2">
            <div className="flex mb-2">
                <img src={reply.user.profile} className="h-10 w-8 rounded-2xl" alt="user Image" />
            </div>
            <div>
                <h1 className="text-black">{reply.user.name}</h1>
                <p className="mb-2 text-xl ml-2">{reply.commentText}</p>
            </div>
        </div>
    )
}