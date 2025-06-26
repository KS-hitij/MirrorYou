import { Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import SideBar from './SideBar';
import { useState } from 'react';
function MenuOptions() {
    const [isVisible,setIsVisible] = useState(false);
    const handleVisible = ()=>{
        setIsVisible(!isVisible);
    }
    const navigate = useNavigate();
    const handleOnClick =()=>{
        navigate(`/`,{
        })
    }
    return(
        <>
            <div className="div flex justify-around w-[16vw] xl:w-[10vw] lg:w-[14vw] md:w-[16vw] sm:w-[16vw] text-2xl items-center">
                <Menu size={46} className='cursor-pointer rounded-full p-1' onClick={handleVisible} />
                <h1 className='hidden md:block cursor-pointer z-30 ' onClick={handleOnClick}>MirrorYou</h1>
                <SideBar isVisible={isVisible} setIsVisible={setIsVisible} />
            </div>
        </>
    )
}
export default MenuOptions