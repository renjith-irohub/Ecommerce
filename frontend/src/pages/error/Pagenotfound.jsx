import React from 'react';
import { ArrowLeft, Home, Search } from 'lucide-react'; 

// grok 

const Pagenotfound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 flex items-center justify-center px-4">
      <div className="max-w-4xl w-full text-center">
        
        <h1 className="text-9xl md:text-[12rem] font-black text-white drop-shadow-2xl tracking-tighter animate-pulse">
          4<span className="text-yellow-300">0</span>4
        </h1>

       
        <p className="text-4xl md:text-6xl font-bold text-white mt-8 tracking-wide">
          Oops! Page Not Found
        </p>

        <p className="text-xl md:text-2xl text-pink-100 mt-6 max-w-2xl mx-auto leading-relaxed">
          Looks like you've wandered into the digital wilderness. 
          The page you're looking for has vanished into thin air.
        </p>

       
        <div className="mt-12 text-6xl">🕵️‍♂️</div>

       
        <div className="mt-12 flex flex-col sm:flex-row gap-6 justify-center items-center">
          <a
            href="/"
            className="group flex items-center gap-3 bg-white text-purple-600 font-bold text-lg px-10 py-5 rounded-full shadow-2xl hover:bg-gray-100 transform hover:scale-105 transition-all duration-300"
          >
            <Home className="w-6 h-6 group-hover:animate-bounce" />
            Back to Home
          </a>

         
        </div>

       
        <p className="mt-16 text-pink-200 text-lg">
          Or try searching for what you need 
          <Search className="inline-block w-5 h-5 ml-2 animate-pulse" />
        </p>
      </div>

      
      <div className="absolute top-20 left-10 text-white opacity-20 text-9xl font-bold pointer-events-none animate-float">
        ?
      </div>
      <div className="absolute bottom-20 right-10 text-white opacity-20 text-8xl font-bold pointer-events-none animate-float-delayed">
        !
      </div>
      <div className="absolute top-1/2 left-1/4 text-white opacity-10 text-9xl font-bold pointer-events-none animate-bounce">
        🤔
      </div>
    </div>
  );
};

export default Pagenotfound;