import React from "react";
import { motion } from "framer-motion";
import Title from "../../components/common/Title";
import aboutImg from "../../assets/Shop2.jpg";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaHeart, FaLeaf, FaStar } from "react-icons/fa";

const About = () => {
  return (
    <>
      <section className="relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            animate={{ y: [0, -40, 0], x: [0, 30, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 left-10 w-80 h-80 bg-gradient-to-r from-purple-300/20 to-pink-300/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ y: [0, 50, 0], x: [0, -40, 0] }}
            transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-32 right-20 w-96 h-96 bg-gradient-to-l from-indigo-300/20 to-purple-300/20 rounded-full blur-3xl"
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-24 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center mb-20"
          >
            <Title text1="OUR" text2="STORY" />
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-2xl font-light text-gray-600 mt-8 max-w-3xl mx-auto leading-relaxed italic"
            >
              Crafting timeless pieces that speak to your soul — one design at a time.
            </motion.p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -80 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="relative group"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src={aboutImg}
                  alt="Forever — A Brand with Soul"
                  className="w-full h-[650px] object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-60"></div>

                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
                  className="absolute bottom-8 left-8 bg-white/95 backdrop-blur-lg px-8 py-4 rounded-full shadow-2xl flex items-center gap-4 font-bold text-indigo-700"
                >
                  <FaHeart className="text-red-500 text-xl animate-pulse" />
                  <span>Est. 2024 — Built on Love</span>
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 80 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="space-y-10"
            >
              <h2 className="text-6xl md:text-7xl font-extrabold text-gray-900 leading-tight">
                We Are <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
                  Forever
                </span>
              </h2>

              <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
                <p>
                  <strong className="text-indigo-600">Forever</strong> isn't just a brand — it's a promise.
                  A promise to create clothing that makes you feel seen, confident, and truly yourself.
                </p>
                <p>
                  Every collection is designed with intention: sustainable materials, ethical craftsmanship,
                  and styles that transcend trends.
                </p>
                <p>
                  We believe fashion should be a force for good — beautiful on the outside,
                  meaningful on the inside.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-8 mt-12">
                {[
                  { icon: FaLeaf, label: "Sustainable", color: "from-emerald-500 to-teal-600" },
                  { icon: FaHeart, label: "Ethical", color: "from-pink-500 to-rose-600" },
                  { icon: FaStar, label: "Timeless", color: "from-amber-500 to-orange-600" },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.2 }}
                    whileHover={{ scale: 1.15, rotate: 5 }}
                    className="text-center group cursor-default"
                  >
                    <div className={`w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white text-3xl shadow-xl group-hover:shadow-2xl transition-all`}>
                      <item.icon />
                    </div>
                    <p className="mt-4 font-bold text-gray-800 text-lg">{item.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <footer className="bg-gradient-to-b from-gray-900 to-black text-gray-300 py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-16">
          <div className="grid md:grid-cols-4 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h1 className="text-5xl font-bold text-white mb-6 bg-clip-text text-transparent bg-gradient-to kryptonian from-indigo-400 to-purple-400">
                Forever
              </h1>
              <p className="text-gray-400 leading-relaxed">
                More than fashion — a lifestyle. Crafted with care, worn with pride.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-bold text-white mb-6">Explore</h3>
              <ul className="space-y-4">
                {["Home", "Collection", "About Us", "Contact"].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-gray-400 hover:text-white transition-all duration-300 flex items-center gap-3 group">
                      <span className="w-0 group-hover:w-10 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration30"></span>
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-bold text-white mb-6">Stay Connected</h3>
              <div className="flex gap-6">
                {[FaInstagram, FaFacebookF, FaTwitter, FaLinkedinIn].map((Icon, i) => (
                  <motion.a
                    key={i}
                    href="#"
                    whileHover={{ scale: 1.3, rotate: 12 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all shadow-xl border border-white/10"
                  >
                    <Icon className="text-xl" />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              viewport={{ once: true }}
              className="text-right"
            >
              <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 leading-tight">
                Dress like<br />you mean it.
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center mt-20 pt-10 border-t border-gray-800 text-gray-500 text-sm font-light"
          >
            © {new Date().getFullYear()} Forever. Made with passion. Worn with purpose.
          </motion.div>
        </div>
      </footer>
    </>
  );
};

export default About;