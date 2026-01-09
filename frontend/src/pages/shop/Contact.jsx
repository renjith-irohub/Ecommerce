import React from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, CheckCircle } from "lucide-react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";

// Updated validation schema with phone number
const ContactSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phone: Yup.string()
    .matches(/^\+?\d{10,15}$/, "Invalid phone number")
    .required("Phone number is required"),
  message: Yup.string()
    .min(10, "Message too short")
    .required("Message is required"),
});

const Contact = () => {
  const sendMessage = useMutation({
    mutationFn: async (formData) => {
      const res = await axios.post(
        "http://localhost:5000/api/v1/contact/create",
        formData
      );
      return res.data;
    },
  });

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 overflow-hidden py-20 px-6 lg:px-12">
      {/* Floating Background Orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ y: [0, -60, 0], x: [0, 40, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-indigo-300/20 to-purple-300/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ y: [0, 60, 0], x: [0, -50, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-32 right-32 w-80 h-80 bg-gradient-to-l from-pink-300/20 to-purple-300/20 rounded-full blur-3xl"
        />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Hero Title */}
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="text-center mb-16"
        >
          <h1 className="text-6xl md:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
            Get in Touch
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xl text-gray-600 mt-6 max-w-2xl mx-auto font-light"
          >
            We’d love to hear from you. Whether it’s a question, feedback, or just a hello — we’re here.
          </motion.p>
        </motion.div>

        {/* Contact Info Cards */}
        <div className="grid md:grid-cols-3 gap-10 mb-20">
          {[
            {
              icon: <Mail className="w-10 h-10" />,
              title: "Email Us",
              text: "support@myshop.com",
              color: "from-blue-500 to-cyan-500",
            },
            {
              icon: <Phone className="w-10 h-10" />,
              title: "Call Us",
              text: "+91 62380 57379",
              color: "from-emerald-500 to-teal-500",
            },
            {
              icon: <MapPin className="w-10 h-10" />,
              title: "Visit Us",
              text: "Kochi, Kerala, India",
              color: "from-purple-500 to-pink-500",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              whileHover={{ y: -12, scale: 1.05 }}
              className="group relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-white/30 overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
              <div className="p-10 text-center relative z-10">
                <div className={`inline-flex p-5 rounded-2xl bg-gradient-to-br ${item.color} text-white shadow-lg mb-6`}>
                  {item.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-gray-600 font-medium">{item.text}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto"
        >
          <div className="bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/40 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-1">
              <div className="bg-white rounded-3xl p-10 md:p-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">
                  Send Us a Message
                </h2>

                <Formik
                  initialValues={{ name: "", email: "", phone: "", message: "" }}
                  validationSchema={ContactSchema}
                  onSubmit={(values, { resetForm }) => {
                    sendMessage.mutate(values, {
                      onSuccess: () => {
                        alert("Message sent successfully!");
                        resetForm();
                      },
                      onError: () => {
                        alert("Failed to send. Please try again.");
                      },
                    });
                  }}
                >
                  {({ isSubmitting }) => (
                    <Form className="space-y-8">
                      <div className="grid md:grid-cols-2 gap-8">
                        <label className="block group">
                          <span className="text-gray-700 font-medium mb-3 block">Your Name</span>
                          <Field
                            name="name"
                            className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-300 outline-none bg-gray-50/50"
                            placeholder="Full name"
                          />
                          <ErrorMessage name="name" component="p" className="text-red-500 text-sm mt-2" />
                        </label>

                        <label className="block group">
                          <span className="text-gray-700 font-medium mb-3 block">Your Email</span>
                          <Field
                            name="email"
                            type="email"
                            className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300 outline-none bg-gray-50/50"
                            placeholder="Email"
                          />
                          <ErrorMessage name="email" component="p" className="text-red-500 text-sm mt-2" />
                        </label>
                      </div>

                      <label className="block group">
                        <span className="text-gray-700 font-medium mb-3 block">Phone Number</span>
                        <Field
                          name="phone"
                          className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all duration-300 outline-none bg-gray-50/50"
                          placeholder="Phone number"
                        />
                        <ErrorMessage name="phone" component="p" className="text-red-500 text-sm mt-2" />
                      </label>

                      <label className="block">
                        <span className="text-gray-700 font-medium mb-3 block">Your Message</span>
                        <Field
                          as="textarea"
                          name="message"
                          rows="6"
                          className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:border-pink-500 focus:ring-4 focus:ring-pink-100 transition-all duration-300 outline-none resize-none bg-gray-50/50"
                          placeholder="Tell us how we can help..."
                        />
                        <ErrorMessage name="message" component="p" className="text-red-500 text-sm mt-2" />
                      </label>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={isSubmitting || sendMessage.isPending}
                        className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-bold text-lg py-5 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-3 group"
                      >
                        {sendMessage.isPending ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                            Send Message
                          </>
                        )}
                      </motion.button>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </motion.div>

        {sendMessage.isSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
            onClick={() => sendMessage.reset()}
          >
            <motion.div
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              className="bg-white rounded-3xl p-10 text-center shadow-2xl"
            >
              <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-gray-900">Thank You!</h3>
              <p className="text-gray-600 mt-3">Your message has been sent successfully.</p>
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Contact;
