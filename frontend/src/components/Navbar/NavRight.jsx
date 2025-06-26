import { CirclePlus } from 'lucide-react';
import Profile from './Profile'
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { AnimatePresence,motion } from 'motion/react';
import { useSelector } from 'react-redux';
import toast,{Toaster} from 'react-hot-toast';
function NavRight() {
    const navigate = useNavigate();
    const currUser = useSelector((state)=>state.auth.user);
    const [uploadClick,setUploadClick] = useState(false);
    const handleUploadClick =()=>{
        setUploadClick(!uploadClick)
    }

    const handleClickVideoUpload = ()=>{
        setUploadClick(false);
        if(currUser)
            navigate('/upload');
        else{
            navigate('/signUp')
        }
    }
    const handleClickLiveStream = ()=>{
        setUploadClick(false);
        toast("Feature will be available in future");
    }
    return(
        <div className='hidden md:flex items-center justify-around md:w-50 h-full '>
            <CirclePlus className='cursor-pointer h-9 w-9 pt-1 mb-3' onClick={handleUploadClick} />
            <AnimatePresence>
                {uploadClick && (
                    <motion.div className=' absolute top-12 right-20 w-50 mt-2 bg-gray-100 shadow-xl rounded-md z-10 p-4 flex flex-col items-star text-lg '
                    initial={{ opacity: 0, scale: 0.5, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.5, y: -10 }}
                    transition={{ type: 'spring', stiffness: 80, damping: 10 }}>
                        <h2 className='my-2 cursor-pointer hover:text-zinc-400 hover:scale-[110%] duration-500' onClick={handleClickVideoUpload}>Upload Video</h2>
                        <h2 className='my-2 cursor-pointer hover:text-zinc-400 hover:scale-[110%] duration-500 ' onClick={handleClickLiveStream}>Live Stream</h2>
                    </motion.div>
                )}
            </AnimatePresence>
            <Profile />
            <Toaster/>
        </div>
    )
}
export default NavRight