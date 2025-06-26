import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { logInFeature } from "../features/auth/authSlice";
import toast, { Toaster } from 'react-hot-toast';
import Loading from "../components/Loading";
import { useState } from "react";
import Navbar from "../components/Navbar/Navbar";
function SignUp() {
    const [isLoading, setIsloading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file)
            return;
        const allowedTypes = ['image/jpeg', 'image/png'];

        if (!allowedTypes.includes(file.type)) {
            alert('Only JPG and PNG images are allowed.');
            e.target.value = '';
            return;
        }
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        try {
            setIsloading(true);
            const result = await axios.post("http://localhost:3000/user/signUp", formData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            const userResult = await axios.get("http://localhost:3000/user/profile", {
                withCredentials: true
            });
            dispatch(logInFeature(userResult.data));
            setIsloading(false);
            navigate("/");
            toast.success("Sign Up Success");
        } catch (err) {
            setIsloading(false);
            toast.error("Sign Up Failed");
        }

    }
    if (isLoading) {
        <div className="flex flex-col items-center justify-center relative h-[100vh] w-full " >
            <Loading text="Signing Up" />
        </div>
    }
    return (
        <div className="h-full w-full flex flex-col items-center p-0 lg:gap-y-5">
            <Navbar />
            <div className="form-container min-h-[90vh] md:min-h-[92vh] lg:min-h-[85vh] w-full lg:w-[60vw] shadow-2xl lg:rounded-2xl px-5 pt-3">
                <form method="POST" className="h-full w-full flex flex-col items-center" encType="multipart/form-data" onSubmit={handleSubmit} >
                    <h1 className="text-4xl mb-5 font-extrabold tracking-tight">Register Account</h1>
                    <div className="flex flex-col w-full justify-center items-center">
                        <label htmlFor="name" className="text-2xl font-bold">UserName</label><br />
                        <input type="text" id="name" name="name" placeholder="Enter Username" className="w-70 h-10 rounded-2xl p-1 border-2 border-gray-500 outline-0" />
                    </div><br />
                    <div className="flex flex-col w-full justify-center items-center">
                        <label htmlFor="mail" className="text-2xl font-bold">Email</label><br />
                        <input type="text" id="mail" name="mail" placeholder="Enter Email" className="w-70 h-10 rounded-2xl p-1 border-2 border-gray-500 outline-0" />
                    </div><br />
                    <div className="flex flex-col w-full justify-center items-center">
                        <label htmlFor="password" className="text-2xl font-bold">Password</label><br />
                        <input type="password" id="password" name="password" placeholder="Enter Password" className="w-70 h-10 rounded-2xl p-1 border-2 border-gray-500 outline-0" />
                    </div><br /><br />
                    <div className="flex flex-col w-full justify-center items-center">
                        <label htmlFor="profileLogo" className="text-2xl font-bold">Profile Photo</label><br />
                        <input type="file" name="profileLogo" id="profileLogo" accept="image/*" className="w-30 h-10 rounded-2xl p-1 border-2 border-gray-500" onChange={handleFileChange} />
                    </div><br />
                    <div className="flex flex-col w-full justify-center items-center">
                        <button className="w-30 h-10 rounded-2xl p-1 btn btn-primary cursor-pointer">SignUp</button>
                    </div>
                    <div className="mt-10 flex flex-col w-full justify-center items-center">
                        <h2>Already have an account?&nbsp;<Link to='/logIn' className="hover:cursor-pointer hover:underline">LogIn</Link></h2>
                    </div>
                </form>
                <Toaster />
            </div>
        </div>
    )
}
export default SignUp;