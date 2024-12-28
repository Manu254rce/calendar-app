import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { login } from "../api/auth_api";
import { WebLoader } from "./home";

const Login: React.FC = () => {
    const [user_name, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const { login: authLogin } = useAuth();
    const navigate = useNavigate();

    const validateForm = () => {
        if (!user_name || !password) {
            setError('All fields are required')
            return false;
        }
        return true;
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validateForm()) return;
        setIsLoading(true);
        try {
            const { token, user } = await login(user_name, password);
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
            navigate('/home');
        } catch (error) {
            console.error('Login error:', error);
            setError('Invalid credentials')
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <main className="w-screen min-h-screen flex flex-col items-center justify-center 
                                                px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col justify-center items-center w-full max-w-md min-h-3/4 rounded-md space-y-2 
                            bg-gradient-to-br from-blue-900 to-fuchsia-700 shadow-md p-6 sm:p-8">
                <h1 className="text-2xl text-white font-medium">Login</h1>
                <form onSubmit={handleSubmit} className="flex flex-col space-y-4 w-2/3 h-1/2">
                    <div>
                        <label htmlFor="user_name" className="block text-sm font-medium text-white">
                            User Name
                        </label>
                        <input
                            data-testid="username-input"
                            type="text"
                            id="user_name"
                            value={user_name}
                            onChange={(e) => setUserName(e.target.value)}
                            className="mt-1 block w-full h-8 p-3 rounded-md shadow-sm"
                            required
                        />
                    </div>
                    {/* <hr className="border-white w-4/5 mx-auto" /> */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-white">
                            Password
                        </label>
                        <input
                            data-testid="password-input"
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full h-8 p-3 rounded-md shadow-sm"
                            required
                        />
                    </div>
                    {error && <p className="bg-red-200 p-3 font-bold text-red-600 text-sm rounded-md">{error}</p>}
                    <button
                        data-testid="login-button"
                        type="submit"
                        className="w-1/3 flex justify-center py-2 px-4 mx-auto rounded-md
                        bg-blue-900 hover:bg-slate-900 hover-animation border border-transparent shadow-sm text-sm text-white">
                        Login
                    </button>
                </form>
                <div className="flex flex-row items-center">
                    <h3 className="text-white text-md text-left">Don't have an account? <Link to="/register" className="text-white text-md text-right font-bold hover:text-blue-900 
                                hover-animation"> Register</Link></h3>
                </div>
            </div>
            {isLoading && <WebLoader />}
        </main>
    )
}

export default Login;