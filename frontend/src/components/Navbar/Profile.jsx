import { UserPen,LogOut,LogIn,UserPlus,Bolt,SquareUser } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion,AnimatePresence } from "motion/react";
import { useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { logOutFeature } from '../../features/auth/authSlice';
import toast,{Toaster } from 'react-hot-toast';
function Profile() {
    const currUser = useSelector((state)=>state.auth.user);
    const dispatch = useDispatch();
    const [profileClick,setProfileClick] = useState(false);
    const handleClick = ()=>{
        setProfileClick(!profileClick);
    }
    const navigate = useNavigate();
    const signUp= ()=>{
        navigate("/signUp")
    }
    const logIn= ()=>{
        navigate("/logIn")
    }
    const logOut = async()=>{
        await axios.post("http://localhost:3000/user/logOut",null,{
            withCredentials:true
        })
        setProfileClick(false);
        dispatch(logOutFeature(null));
        navigate("/");
        toast.success('Log Out Success');
    }
    return(
        <div className="Profile h-10 w-10 rounded cursor-pointer relative">
            {currUser?<img src={`${currUser.profileLogo}`} onClick={handleClick} alt="Profile" className='rounded-[50%] h-full w-full'/>:<UserPen size={28} onClick={handleClick} />}
            <AnimatePresence>
                {profileClick && (
                    <motion.div key="profile_options" className="absolute top-full right-0 mt-2 w-60 bg-gray-100 shadow-xl rounded-md z-10 p-4 flex flex-col items-start text-lg"
                    initial={{ opacity: 0, scale: 0.8, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: -10 }}
                    transition={{ type: 'spring', stiffness: 100, damping: 10 }}
                    >
                    {!currUser && <h2 onClick={signUp} className="my-2 cursor-pointer hover:text-zinc-400 hover:scale-[110%] duration-500 flex pl-1"><UserPlus/>&nbsp;SignUp</h2>}
                    {!currUser && <h2 onClick={logIn} className="my-2 cursor-pointer hover:text-zinc-400 hover:scale-[110%] duration-500 flex pl-1"><LogIn/> &nbsp; LogIn</h2>}
                    {currUser && <h2 onClick={logIn} className='my-2 cursor-pointer hover:text-zinc-400 hover:scale-[110%] duration-500 flex pl-1'><SquareUser/>&nbsp;Switch Account</h2> }
                    {currUser &&  <h2 onClick={logOut} className="my-2 cursor-pointer hover:text-zinc-400 hover:scale-[110%] duration-500 flex pl-1"><LogOut/>Log Out</h2>}
                    <h2 className="my-2 cursor-pointer hover:text-zinc-400 hover:scale-[110%] duration-500 flex pl-1"><Bolt/> &nbsp;Setting</h2>
                    </motion.div>
                )}
            </AnimatePresence>
            <Toaster/>
        </div>
    )
}
export default Profile