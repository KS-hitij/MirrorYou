import { AnimatePresence,easeIn,motion } from 'motion/react';
export default function Loading({text="Loading"}){
    return(
        <AnimatePresence>
            <motion.div className='flex flex-col p-2' initial={{opacity:0}} 
                    animate={{opacity:1}} 
                    exit={{opacity:0}}
                    transition={{duration:0.2,repeat:Infinity,ease:easeIn}} >
                <motion.h1 className='text-5xl cursor-default' >{text}</motion.h1>
            </motion.div>
        </AnimatePresence>
    )
}