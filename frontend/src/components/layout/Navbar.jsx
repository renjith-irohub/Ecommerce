import React, { useState, useContext, useEffect, useRef } from "react";
import logos from "../../assets/myshop.jpg";
import { Search, User, ShoppingCart, Menu, ChevronDown, X, Package, LogOut, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { ShopContext } from "../../context/ShopContext";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/authSlice";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const [openUser, setOpenUser] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { showSearch, setShowSearch, totalQuantity } = useContext(ShopContext);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const userRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userRef.current && !userRef.current.contains(e.target)) {
        setOpenUser(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchClick = () => {
    if (location.pathname.includes("collection")) setShowSearch((prev) => !prev);
  };

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    setOpenUser(false);
    setVisible(false);
    navigate("/login");
  };


  const navItemVariants = {
    initial: { y: -20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    hover: { scale: 1.05 },
  };

  const iconVariants = {
    hover: { scale: 1.2, rotate: 360, transition: { duration: 0.6 } },
    tap: { scale: 0.9 }
  };

  return (
    <>
      <div>
        <motion.div
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="flex items-center justify-between py-5 px-6 sm:px-10 bg-white/95 backdrop-blur-2xl shadow-xl border-b border-purple-100 relative z-50"
        >

          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <Link to="/">
              <motion.img
                src={logos}
                className="w-36 drop-shadow-lg"
                alt="MyShop Logo"
                animate={{ filter: ["brightness(1)", "brightness(1.2)", "brightness(1)"] }}
                transition={{ duration: 4, repeat: Infinity }}
              />
            </Link>
          </motion.div>


          <ul className="hidden sm:flex gap-8 text-sm font-medium text-gray-700">
            {["HOME", "COLLECTION", "ABOUT", "CONTACT"].map((item, index) => (
              <motion.li
                key={item}
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                variants={navItemVariants}
                whileHover="hover"
              >
                <NavLink
                  to={item === "HOME" ? "/" : `/${item.toLowerCase()}`}
                  className={({ isActive }) =>
                    `relative pb-2 transition-all duration-500 
                  ${isActive ? "text-purple-600 font-bold" : "hover:text-purple-600"}
                  after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-1
                  after:bg-gradient-to-r after:from-purple-600 after:to-pink-600 after:rounded-full
                  after:transition-all after:duration-500
                  ${isActive ? "after:w-full" : "hover:after:w-full"}`
                  }
                >
                  {item}
                </NavLink>
              </motion.li>
            ))}
          </ul>


          <div className="flex items-center gap-6">

            {/* Search */}
            <motion.button
              variants={iconVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={handleSearchClick}
              className={`p-3 rounded-full shadow-lg transition-all duration-500 group
              ${location.pathname.includes("collection")
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-2xl hover:shadow-purple-500/50"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
            >
              <Search className="w-5 h-5 group-hover:rotate-90 transition duration-700" />
            </motion.button>


            <div className="relative" ref={userRef}>
              <motion.button
                variants={iconVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={() => setOpenUser(!openUser)}
                className="flex items-center gap-1.5 p-3 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 
                         hover:from-purple-200 hover:to-pink-200 shadow-lg hover:shadow-xl transition-all duration-500 group"
              >
                <User className="w-5 h-5 text-purple-700 group-hover:rotate-12 transition" />
                <ChevronDown className={`w-4 h-4 text-purple-700 transition-transform duration-500 ${openUser ? "rotate-180" : ""}`} />
              </motion.button>

              <AnimatePresence>
                {openUser && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: -20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: -20 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    className="absolute right-0 mt-4 w-64 bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-purple-100 overflow-hidden"
                  >
                    <div className="p-4">
                      {user ? (
                        <>
                          <motion.div
                            initial={{ x: -50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="pb-4 border-b border-purple-100 flex items-center gap-3"
                          >
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                              {user.name?.[0] || "U"}
                            </div>
                            <div>
                              <p className="font-bold text-gray-800">{user.name || "User"}</p>
                              <p className="text-xs text-gray-500">{user.email}</p>
                            </div>
                          </motion.div>

                          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                            <Link
                              to="/order"
                              onClick={() => setOpenUser(false)}
                              className="flex items-center gap-4 px-4 py-4 hover:bg-purple-50 rounded-xl transition-all duration-300 group"
                            >
                              <Package className="w-5 h-5 text-purple-600 group-hover:scale-110 transition" />
                              <span className="font-medium">My Orders</span>
                            </Link>
                            <button
                              onClick={handleLogout}
                              className="flex items-center gap-4 w-full px-4 py-4 hover:bg-red-50 rounded-xl text-red-600 transition-all duration-300 group"
                            >
                              <LogOut className="w-5 h-5 group-hover:rotate-90 transition duration-500" />
                              <span className="font-medium">Logout</span>
                            </button>
                          </motion.div>
                        </>
                      ) : (
                        <motion.div
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: "spring", stiffness: 500 }}
                        >
                          <Link
                            to="/login"
                            onClick={() => setOpenUser(false)}
                            className="block text-center py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-2xl 
                                     hover:shadow-2xl hover:shadow-purple-500/50 transform hover:scale-105 transition-all duration-500"
                          >
                            <Sparkles className="inline-block w-5 h-5 mr-2 animate-pulse" />
                            Sign In Now
                          </Link>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>


            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Link to="/cart" className="relative group">
                <motion.div
                  animate={{ rotate: totalQuantity > 0 ? [0, -10, 10, -10, 0] : 0 }}
                  transition={{ duration: 0.5 }}
                  className="p-3 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 
                           hover:from-purple-200 hover:to-pink-200 shadow-lg hover:shadow-2xl transition-all duration-500"
                >
                  <ShoppingCart className="w-5 h-5 text-purple-700 group-hover:rotate-12 transition duration-700" />
                </motion.div>
                <AnimatePresence>
                  {totalQuantity > 0 && (
                    <motion.span
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: 180 }}
                      transition={{ type: "spring", stiffness: 500, damping: 20 }}
                      className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-r from-red-500 to-pink-600 
                               text-white text-sm font-bold rounded-full flex items-center justify-center 
                               shadow-2xl ring-4 ring-white animate-pulse"
                    >
                      {totalQuantity}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            </motion.div>


            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setVisible(true)}
              className="sm:hidden p-3 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 hover:shadow-xl transition"
            >
              <Menu className="w-6 h-6 text-purple-700" />
            </motion.button>
          </div>
        </motion.div>


        <AnimatePresence>
          {visible && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]"
                onClick={() => setVisible(false)}
              />
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed top-0 left-0 h-full bg-white/98 backdrop-blur-2xl shadow-2xl w-80 z-[9999] p-8"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex justify-between items-center mb-12"
                >
                  <img src={logos} className="w-32" alt="Logo" />
                  <motion.button
                    whileHover={{ rotate: 90 }}
                    onClick={() => setVisible(false)}
                    className="p-3 rounded-full bg-purple-100 hover:bg-purple-200 transition"
                  >
                    <X className="w-6 h-6 text-purple-700" />
                  </motion.button>
                </motion.div>

                <nav className="space-y-6">
                  {["HOME", "COLLECTION", "ABOUT", "CONTACT"].map((item, i) => (
                    <motion.div
                      key={item}
                      initial={{ x: -100, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <NavLink
                        to={item === "HOME" ? "/" : `/${item.toLowerCase()}`}
                        onClick={() => setVisible(false)}
                        className={({ isActive }) =>
                          `block text-2xl font-bold transition-all duration-500 
                        ${isActive ? "text-purple-600" : "text-gray-700 hover:text-purple-600"}`
                        }
                      >
                        {item}
                      </NavLink>
                    </motion.div>
                  ))}
                </nav>

                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="absolute bottom-10 left-8 right-8"
                >
                  {user ? (
                    <div className="space-y-4">
                      <Link to="/orders" onClick={() => setVisible(false)} className="flex items-center gap-4 text-lg font-medium hover:text-purple-600 transition">
                        <Package className="w-6 h-6" /> My Orders
                      </Link>
                      <button onClick={handleLogout} className="flex items-center gap-4 text-lg font-medium text-red-600">
                        <LogOut className="w-6 h-6" /> Logout
                      </button>
                    </div>
                  ) : (
                    <Link
                      to="/login"
                      onClick={() => setVisible(false)}
                      className="block text-center py-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xl rounded-2xl 
                               shadow-2xl hover:shadow-purple-500/50 transform hover:scale-105 transition-all duration-500"
                    >
                      Sign In
                    </Link>
                  )}
                </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default Navbar;
