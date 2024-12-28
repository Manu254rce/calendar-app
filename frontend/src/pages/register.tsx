import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { register } from "../api/auth_api";
import { WebLoader } from "./home";

const Register: React.FC = () => {
    const [email, setEmail] = useState("");
    const [first_name, setFirstName] = useState("");
    const [last_name, setLastName] = useState("");
    const [user_name, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    // const [confirm_password, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { login: authLogin } = useAuth();

    const validateForm = () => {
        if (!email || !first_name || !password || !last_name || !user_name) {
            setError('All fields are required')
            return false;
        }
        return true;
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!validateForm()) return;
        setIsLoading(true);
        try {
            const userData = {
                email,
                password,
                first_name,
                last_name,
                user_name
            }
            const { token, user } = await register(userData);

            authLogin(token, {
                id: user.id,
                _id: user._id,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                user_name: user.user_name,
                password: user.password,
                preferences: user.preferences,
                isAdmin: user.isAdmin,
                user_role: user.user_role
            });
            navigate('/home')
        } catch (error) {
            setError('Invalid credentials')
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <main className="w-screen min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col justify-evenly items-center w-full max-w-md h-4/5 rounded-md space-y-2 
            bg-gradient-to-br from-blue-900 to-fuchsia-700 shadow-md p-6 sm:p-8">
                <h1 className="text-2xl text-white font-medium">Register</h1>
                <form onSubmit={handleSubmit} className="flex flex-col space-y-4 w-2/3 h-2/3 overflow-y-scroll no-scrollbar">
                    <div>
                        <label htmlFor="user_name" className="block text-sm font-medium text-white">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full h-8 p-3 rounded-md shadow-sm"
                            required
                        />
                    </div>
                    <div className="flex flex-row justify-between space-x-4">
                        <div>
                            <label htmlFor="user_name" className="block text-sm font-medium text-white">
                                First Name
                            </label>
                            <input
                                type="text"
                                id="first_name"
                                value={first_name}
                                onChange={(e) => setFirstName(e.target.value)}
                                className="mt-1 block w-full h-8 p-3 rounded-md shadow-sm"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="user_name" className="block text-sm font-medium text-white">
                                Last Name
                            </label>
                            <input
                                type="text"
                                id="last_name"
                                value={last_name}
                                onChange={(e) => setLastName(e.target.value)}
                                className="mt-1 block w-full h-8 p-3 rounded-md shadow-sm"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="user_name" className="block text-sm font-medium text-white">
                            User Name
                        </label>
                        <input
                            type="text"
                            id="user_name"
                            value={user_name}
                            onChange={(e) => setUserName(e.target.value)}
                            className="mt-1 block w-full h-8 p-3 rounded-md shadow-sm"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-white">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full h-8 p-3 rounded-md shadow-sm"
                            required
                        />
                    </div>
                    {error && <p className=" bg-red-300 p-3 font-bold text-red-600 text-sm rounded-md">{error}</p>}
                    <button
                        type="submit"
                        className="w-1/3 flex justify-center py-2 px-4 mx-auto rounded-md
                        bg-blue-900 hover:bg-slate-900 hover-animation border border-transparent shadow-sm text-sm text-white">
                        Register
                    </button>

                </form>
                <div className="flex flex-row items-center">
                    <h3 className="text-white text-md text-left">Back to <Link to="/login" className="text-white text-md text-right font-bold hover:text-blue-900 
                                hover-animation">Login</Link></h3> 
                </div>
            </div>
            {isLoading && <WebLoader />}
        </main>
    )
}

export default Register;