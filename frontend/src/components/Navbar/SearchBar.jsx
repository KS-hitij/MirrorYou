import axios from 'axios';
import { Search } from 'lucide-react';
import { useRef } from 'react';
function SearchBar({videos,setVideos}) {
    const searchText = useRef(null);
    const handleClick= async (e)=>{
        const searchInput = searchText.current.value;
        const title = [];
        const words = searchInput.trim().split(/\s+/);
        words.forEach(word=>{
            title.push(word);
        })
        const params = new URLSearchParams();
        if (title.length > 0) params.set("title", title.join(" "));
        const url = `http://localhost:3000/videos/search?${params}`;
        const data = await axios.get(url);
        console.log(data.data);
        if(data.data){
            setVideos(data.data);
        }else{
            setVideos(null);
        }
    }
    return(
        <>
            <div className='flex h-12 text-2xl overflow-hidden rounded-full border-2 border-gray-500 items-center pl-4 md:h-12'>
                <input ref={searchText} type="text" placeholder="Search" className="focus:outline-none active:outline-none MirrorYou w-[50vw] sm:w-[50vw] md:w-70 lg:w-100 xl:w-120 md:mr-5 sm:mr-10" />
                <button className="flex items-center justify-center h-full px-4 py-2 bg-gray-200 shadow-xl cursor-pointer" onClick={handleClick}>
                    <Search size={20} />
                </button>
            </div>
        </>
    )
}
export default SearchBar