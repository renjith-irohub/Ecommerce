// import { motion } from "framer-motion";
// import { useQuery } from "@tanstack/react-query";
// import axios from "axios";
// import { Link, useNavigate } from "react-router-dom";

// const getProducts = async () => {
//   const res = await axios.get("http://localhost:5000/api/v1/product/all");
//   return res.data;
// };

// function Collection() {
//   const navigate = useNavigate();

//   const { data, isLoading, isError } = useQuery({
//     queryKey: ["products"],
//     queryFn: getProducts,
//   });

//   if (isLoading)
//     return (
//       <div className="flex justify-center items-center py-20">
//       <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-500 border-t-transparent" />
//       </div>
//     );

//   if (isError)
//     return (
//       <div className="text-center mt-10 text-red-500 font-medium">
//         Failed to load products 
//       </div>
//     );

//   const products = data?.readproduct || [];

//   return (
//     <section className="bg-white py-16 px-6 sm:px-10">

//       <motion.div
//         className="text-center mb-12"
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//       >
//         <h2 className="text-4xl font-extrabold text-gray-800">
//           Explore Our <span className="text-indigo-600">Collections</span>
//         </h2>
//         <p className="text-gray-500 mt-3 text-base">
//           All our latest arrivals — made with comfort and style in mind 
//         </p>
//       </motion.div>


//       <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
//         {products.length > 0 ? (
//           products.map((p, i) => (
//             <motion.div
//               key={p._id}
//               className="bg-gray-50 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
//               onClick={() => navigate(`/product/${p._id}`)}
//               initial={{ opacity: 0, y: 30 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: i * 0.05 }}
//             >
//               <img
//                 src={p.image}
//                 alt={p.pname}
//                 className="w-full h-64 object-cover rounded-t-2xl"
//               />
//               <div className="p-4 text-center">
//                 <h3 className="font-semibold text-lg text-gray-800 truncate">
//                   {p.pname}
//                 </h3>
//                 <p className="text-indigo-600 font-bold mt-1 text-xl">
//                   ₹{p.price}
//                 </p>
//                 <p className="text-gray-500 text-sm">{p.category}</p>
//               </div>
//             </motion.div>
//           ))
//         ) : (
//           <div className="col-span-full text-center text-gray-500 text-lg">
//             No products found 
//           </div>
//         )}
//       </div>


//       <motion.div
//         className="text-center mt-16 text-gray-500 text-sm border-t pt-6"
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ delay: 0.6 }}
//       >

//         <p>
//           Designed with  by<Link to='/'><span className="text-indigo-600 font-semibold">MyShop</span> —</Link>   
//           bringing fashion closer to you.
//         </p>
//         <p className="mt-2">
//           © {new Date().getFullYear()} MyShop. All rights reserved.
//         </p>
//       </motion.div>
//     </section>
//   );
// }

// export default Collection;



import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const getProducts = async () => {
  const res = await axios.get("http://localhost:5000/api/v1/product/all");
  return res.data;
};

function Collection() {
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-20 text-red-500 text-xl font-semibold bg-gradient-to-r from-rose-50 to-pink-50 min-h-screen flex items-center justify-center">
        Failed to load products
      </div>
    );
  }

  const products = data?.readproduct || [];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.3 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 60, scale: 0.9 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 100, damping: 15 },
    },
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-100 py-16 px-6 sm:px-10 lg:px-16">

      {/* Header */}
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.h2
          className="text-5xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600"
          initial={{ backgroundPosition: "0% 50%" }}
          animate={{ backgroundPosition: ["0% 50%", "100% 50%"] }}
          transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
          style={{ backgroundSize: "200%" }}
        >
          Explore Our Collections
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-lg text-gray-700 mt-5 font-medium max-w-2xl mx-auto"
        >
          Curated with love — timeless pieces crafted for the modern you.
        </motion.p>

        <motion.div
          className="h-1 w-32 bg-gradient-to-r from-indigo-500 to-pink-500 mx-auto mt-6 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: 128 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        />
      </motion.div>

      {/* Products */}
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 max-w-7xl mx-auto"
      >
        {products.length > 0 ? (
          products.map((p, i) => (
            <motion.div
              key={p._id}
              variants={item}
              whileHover={{
                y: -12,
                scale: 1.05,
                transition: { duration: 0.4 },
              }}
              onClick={() => navigate(`/product/${p._id}`)}
              className="group relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg hover:shadow-2xl overflow-hidden cursor-pointer border border-white/30"
            >
              {/* Image */}
              <div className="relative overflow-hidden">
                <motion.img
                  src={p.image}
                  alt={p.pname}
                  className="w-full h-72 object-cover transition-transform duration-700 group-hover:scale-110"
                  whileHover={{ scale: 1.15 }}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              {/* Product Info */}
              <div className="p-5 text-center">
                <motion.h3
                  className="font-bold text-lg text-gray-800 group-hover:text-indigo-600 transition-colors duration-300 line-clamp-2"
                  whileHover={{ scale: 1.05 }}
                >
                  {p.pname}
                </motion.h3>

                <div className="flex flex-col items-center mt-3">
                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      ₹{p.discount > 0 ? p.discount : p.price}
                    </p>
                    {p.discount > 0 && (
                      <p className="text-sm text-gray-400 line-through">₹{p.price}</p>
                    )}
                  </div>
                  {p.discount > 0 && (
                    <span className="text-green-600 text-xs font-bold mt-1">
                      {p.discountPercentage}% OFF
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full text-center py-20">
            <p className="text-2xl text-gray-500 font-medium">No products found</p>
          </div>
        )}
      </motion.div>


      <motion.footer
        className="text-center mt-24 pt-12 border-t border-white/30"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
      >
        <p className="text-gray-600 text-sm">
          Designed with love by{" "}
          <Link to="/" className="font-bold text-indigo-600 hover:text-pink-600 transition-colors">
            MyShop
          </Link>
        </p>
        <p className="text-gray-500 text-xs mt-3">
          © {new Date().getFullYear()} MyShop. Crafted for elegance.
        </p>
      </motion.footer>
    </section>
  );
}

export default Collection;
