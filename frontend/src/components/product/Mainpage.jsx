import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import woman from "../../assets/woman.jpg";

const Mainpage = () => {
  return (
    <>
      <div className="relative min-h-screen w-full overflow-hidden bg-black flex items-center justify-center">
        <div className="absolute inset-0 -z-10">
          <motion.div
            animate={{
              x: [-100, 100, -100],
              y: [-100, 100, -100],
              scale: [1, 1.4, 1],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-pink-600/50 to-purple-600/50 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              x: [100, -100, 100],
              y: [100, -100, 100],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-orange-600/50 to-pink-600/50 rounded-full blur-3xl"
          />
        </div>

        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-left space-y-8 lg:w-1/2"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-4"
            >
              <div className="h-px w-16 bg-gradient-to-r from-pink-400 to-transparent" />
              <p className="text-pink-300 font-medium tracking-widest uppercase text-sm">
                Summer Collections
              </p>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 1 }}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold text-white leading-tight"
            >
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-orange-400 animate-gradient">
                Latest
              </span>
              <span className="block text-white drop-shadow-2xl">Arrivals</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-lg md:text-xl text-gray-200 font-light max-w-lg leading-relaxed"
            >
              Discover timeless elegance crafted for the modern soul.
              New drops every week — exclusively for you.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="flex items-center gap-6"
            >
              <Link to="/collection">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative px-10 py-5 bg-gradient-to-r from-pink-500 to-orange-500 text-white font-bold text-lg rounded-full shadow-2xl hover:shadow-pink-500/50 transition-all duration-500 overflow-hidden"
                >
                  <span className="relative z-10">Shop Now</span>
                  <motion.div
                    className="absolute inset-0 bg-white/20"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.6 }}
                  />
                </motion.button>
              </Link>

              <motion.div
                initial={{ width: 0 }}
                animate={{ width: 80 }}
                transition={{ delay: 1.5, duration: 0.8 }}
                className="h-px bg-gradient-to-r from-pink-400 to-transparent"
              />
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 100, rotate: 10 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            whileHover={{ y: -20 }}
            className="lg:w-1/2 flex justify-center"
          >
            <div className="relative group">
              <motion.img
                src={woman}
                alt="Latest Collection"
                className="w-full max-w-lg h-auto rounded-3xl shadow-2xl object-cover border-8 border-white/20 backdrop-blur-sm"
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              />

              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 1.8, type: "spring", stiffness: 200 }}
                className="absolute -top-6 -right-6 bg-gradient-to-br from-pink-500 to-orange-500 text-white px-6 py-3 rounded-full font-bold shadow-2xl border-4 border-white"
              >
                NEW
              </motion.div>

              <motion.div
                animate={{ opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -inset-4 bg-gradient-to-r from-pink-600/50 to-purple-600/50 rounded-3xl blur-3xl -z-10"
              />
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-white/60 rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 15, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-3 bg-white/80 rounded-full mt-2"
            />
          </motion.div>
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 8s ease infinite;
        }
      `}</style>
    </>
  );
};

export default Mainpage;
