import SearchBar from "./SearchBar"
import MenuOptions from "./MenuOptions"
import NavRight from "./NavRight"
function Navbar({videos,setVideos}){
    return(
        <div className="w-full h-[10vh] md:h-[8vh] flex justify-around sm:justify-between px-1 md:pl-3.5 sm:pr-20 lg:px-5 items-center sticky">
            <MenuOptions/>
            <SearchBar videos={videos} setVideos={setVideos}/>
            <NavRight />
        </div>
    )
}
export default Navbar