import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { logInFeature } from "../features/auth/authSlice";
import toast, { Toaster } from 'react-hot-toast';
import { useState } from "react";
import Loading from "../components/Loading";
import Navbar from "../components/Navbar/Navbar";

function LogIn() {
    const [isLoading, setIsloading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [errMsg, setErrMsg] = useState("");
    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        const data = {
            mail_name: form.mail_name.value,
            password: form.password.value
        }
        try {
            setIsloading(true);
            const result = await axios.post("http://localhost:3000/user/logIn", data, {
                withCredentials: true
            });
            const userResult = await axios.get("http://localhost:3000/user/profile", {
                withCredentials: true
            });
            dispatch(logInFeature(userResult.data));
            setIsloading(false);
            navigate("/");
            toast.success('Log In Success');
        }
        catch (err) {
            setIsloading(false);
            toast.error("Log In failed\n");
            setErrMsg(err.response.data.message);
        }
    }
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center relative h-[100vh] w-full " >
                <Loading text="Loggin In" />
            </div>
        )
    }
    return (
        <div className="h-full w-full flex flex-col items-center p-0 lg:gap-y-5">
            <Navbar />
            <div className="form-container min-h-[90vh] md:min-h-[92vh] lg:min-h-[85vh] w-full lg:w-[60vw] shadow-2xl lg:rounded-2xl px-5">
                <div className="flex flex-col w-full justify-center items-center lg:mb-5 mb-10">
                    <h1 className="text-4xl mb-5 font-extrabold tracking-tight">Log In</h1>
                </div>
                {errMsg.length > 0 && <div className="flex flex-col w-full justify-center items-center mb-5">
                    <h1 className="text-red-500 text-lg">{errMsg}</h1>
                </div>}
                <form method="POST" className="h-full w-full" onSubmit={handleSubmit}>
                    <div className="flex flex-col w-full justify-center items-center">
                        <label htmlFor="mail_name" className="text-2xl font-bold">Username/Email</label><br />
                        <input type="text" id="mail_name" name="mail_name" placeholder="Enter Username or Email" className="w-70 h-10 rounded-2xl p-1 border-2 border-gray-500 outline-0" />
                    </div><br />
                    <div className="flex flex-col w-full justify-center items-center">
                        <label htmlFor="password" className="text-2xl font-bold">Password</label><br />
                        <input type="password" id="password" name="password" placeholder="Enter Password" className="w-70 h-10 rounded-2xl p-1 border-2 border-gray-500 outline-0" />
                    </div><br /><br />
                    <div className="flex flex-col w-full justify-center items-center">
                        <button className="w-30 h-10 rounded-2xl p-1 btn btn-primary cursor-pointer">LogIn</button>
                    </div>
                    <div className="mt-15 flex flex-col w-full justify-center items-center">
                        <h2>Do not have an account?&nbsp;<Link to='/signUp' className="hover:cursor-pointer hover:underline">Register</Link></h2>
                    </div>
                </form>
                <Toaster />
            </div>
        </div>
    )
}
export default LogIn;