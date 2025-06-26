import { motion,AnimatePresence } from 'motion/react';
import { House,Youtube,UserRound,History,Menu } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import { useSelector } from 'react-redux';
import {LogOut,LogIn,UserPlus,SquareUser } from 'lucide-react';
function SideBar({isVisible,setIsVisible}){
    const currUser = useSelector((state)=>state.auth.user);
    const handleVisible = ()=>{
        setIsVisible(!isVisible);
    }
    const navigate = useNavigate();
    const toHome = ()=>{
        navigate("/");
    }
    return createPortal(
        <AnimatePresence >
            { isVisible?<motion.div initial={{x:-500,opacity:0}} animate={{x:0,opacity:1}} exit={{x:-500,opacity:0}} transition={{ type: "tween",}} className=" absolute z-20 top-0 left-0 flex flex-col opacity-100 bg-gray-100 shadow-xl w-[70vw] sm:w-[50vw] md:w-[15vw] p-4 text-2xl h-[100vh] ">
            <h2 className="cursor-pointer flex pl-4 hover:scale-[110%] duration-500 items-center"><Menu size={32} onClick={handleVisible} /></h2>
            <hr className="text-gray-500 mt-16 w-full" />
            <h2 className="my-4 cursor-pointer flex pl-1 hover:text-zinc-400 hover:scale-[110%] duration-500 items-center" onClick={toHome}><House/>&nbsp;Home</h2>
            <h2 className="my-4 cursor-pointer flex pl-1 hover:text-zinc-400 hover:scale-[110%] duration-500 items-center"><Youtube/>&nbsp; Subscriptions</h2>
            <h2 className="my-4 cursor-pointer flex pl-1 hover:text-zinc-400 hover:scale-[110%] duration-500 items-center"><UserRound/>&nbsp; You</h2>
            <h2 className="my-4 cursor-pointer flex pl-1 hover:text-zinc-400 hover:scale-[110%] duration-500 items-center"><History/> &nbsp;Recently Watched</h2>
            <hr className="text-gray-500 w-full"  />
            {currUser?null:<h2 className="my-4 cursor-pointer mt-10 flex pl-1 hover:text-zinc-400 hover:scale-[110%] duration-500 items-center" onClick={()=>navigate("/signUp")} ><UserPlus/>&nbsp;SignUp</h2>}
            {currUser?null:<h2 className="my-4 cursor-pointer flex pl-1 hover:text-zinc-400 hover:scale-[110%] duration-500 items-center" onClick={()=>navigate("/logIn")}><LogIn/> &nbsp;LogIn</h2>}
            {currUser?<h2 className="my-4 cursor-pointer flex pl-1 mt-10 hover:text-zinc-400 hover:scale-[110%] duration-500 items-center" onClick={()=>navigate("/logIn")} ><LogOut/> &nbsp;LogOut</h2>:null}
            {currUser?<h2 className="my-4 cursor-pointer flex pl-1 hover:text-zinc-400 hover:scale-[110%] duration-500 items-center" onClick={()=>navigate("/logIn")}><SquareUser/> &nbsp;Switch Account</h2>:null}
            <hr className="text-gray-500 w-full"  />
            </motion.div>:null}
        </AnimatePresence>,
        document.body
    )
}

export default SideBar;