import { LogIn } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'

const LandingPage = () => {
  return (
    <main className="bg-gradient-to-br from-blue-900 to-fuchsia-800 min-h-screen flex justify-center items-center
                                          px-4 sm:px-6 lg:px-8">
      <div className="text-center flex flex-col w-full max-w-md justify-between space-y-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl text-white mb-4">KBC JournaBuddy</h1>
        <Link to="/login" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          <button className="flex items-center justify-center w-full">
            <LogIn className="mr-2" size={20} />
            <span>Login</span>
          </button>
        </Link>
        <Link to="/register" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          <button className="flex items-center justify-center w-full">
            <span>Register</span>
          </button>
        </Link>
      </div>
    </main>
  )
}

export default LandingPage