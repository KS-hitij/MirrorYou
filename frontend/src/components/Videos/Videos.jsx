import VideoCard from "./VideoCard"

function Videos({ videos }) {
  return (
    <div className="flex flex-wrap justify-around align-middle">
        {videos && videos.map((video, idx) => (
            <VideoCard key={idx} video={video} />
        ))}
        {(!videos || videos === null) && <h1 className="text-4xl mt-[35vh]">No result</h1> }
    </div>
  );
}

export default Videos;
