import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import { loginUserAPI, registerUserAPI } from "../../services/userServices";
import { loginSuccess } from "../../redux/authSlice";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const AuthPage = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loginMutation = useMutation({ mutationFn: loginUserAPI });
  const registerMutation = useMutation({ mutationFn: registerUserAPI });

  const formik = useFormik({
    initialValues: { name: "", email: "", password: "", address: "" },
    validationSchema: Yup.object({
      name: isRegister ? Yup.string().required("Name is required") : Yup.string(),
      email: Yup.string().email("Invalid email").required("Email is required"),
      password: Yup.string().min(6, "Minimum 6 characters").required("Password is required"),
      address: isRegister ? Yup.string().required("Address is required") : Yup.string(),
    }),
    onSubmit: async (values) => {
      try {
        let data;
        if (isRegister) {
          data = await registerMutation.mutateAsync(values);
          alert("Account created successfully!");
          setIsRegister(false);
        } else {
          data = await loginMutation.mutateAsync({
            email: values.email,
            password: values.password,
          });

          dispatch(loginSuccess(data));

          const decoded = jwtDecode(data.token);
          navigate(decoded.role === "admin" ? "/admin" : "/");
        }
      } catch (error) {
        alert(error.response?.data?.message || "Something went wrong");
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center  ">
      <div className="absolute inset-0 -z-10">
        <img
          src="https://static.vecteezy.com/system/resources/previews/011/083/131/large_2x/minimal-shopping-online-concept-colorful-paper-shopping-bag-go-down-from-floating-blue-background-for-copy-space-customer-can-buy-everything-form-home-and-the-messenger-will-deliver-free-photo.jpg"
          alt="Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      </div>

      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-purple-900/40 via-transparent to-pink-900/30"></div>

      <div className="w-full max-w-md">
        <div className="bg-white/12 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 p-8 md:p-10 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none rounded-3xl"></div>

          <div className="relative z-10">
            <div className="text-center mb-10">
              <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight drop-shadow-lg">
                {isRegister ? "Create Account" : "Welcome Back"}
              </h1>
              <p className="mt-3 text-white/80 text-sm md:text-base font-light">
                {isRegister
                  ? "Join thousands of happy customers"
                  : "Sign in to access your dashboard"}
              </p>
            </div>

            <form onSubmit={formik.handleSubmit} className="space-y-6">
              {isRegister && (
                <div className="space-y-2">
                  <label className="text-white/90 text-sm font-medium">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    className={`w-full px-5 py-4 rounded-2xl bg-white/10 border text-white placeholder-white/50 
                      ${formik.touched.name && formik.errors.name ? "border-red-500" : "border-white/30"}`}
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.name && formik.errors.name && (
                    <p className="text-red-400 text-xs mt-1">{formik.errors.name}</p>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-white/90 text-sm font-medium">Email Address</label>
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  className={`w-full px-5 py-4 rounded-2xl bg-white/10 border text-white placeholder-white/50 
                    ${formik.touched.email && formik.errors.email ? "border-red-500" : "border-white/30"}`}
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.email && formik.errors.email && (
                  <p className="text-red-400 text-xs mt-1">{formik.errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-white/90 text-sm font-medium">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="••••••••"
                    className={`w-full px-5 py-4 pr-14 rounded-2xl bg-white/10 border text-white placeholder-white/50 
                      ${formik.touched.password && formik.errors.password ? "border-red-500" : "border-white/30"}`}
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition"
                  >
                    {showPassword ? "🔓" : "🔐"}
                  </button>
                </div>

                {formik.touched.password && formik.errors.password && (
                  <p className="text-red-400 text-xs mt-1">{formik.errors.password}</p>
                )}
              </div>

              {isRegister && (
                <div className="space-y-2">
                  <label className="text-white/90 text-sm font-medium">Delivery Address</label>
                  <textarea
                    name="address"
                    rows={3}
                    placeholder="123 Main St, New York, USA"
                    className={`w-full px-5 py-4 rounded-2xl bg-white/10 border text-white placeholder-white/50 resize-none 
                      ${formik.touched.address && formik.errors.address ? "border-red-500" : "border-white/30"}`}
                    value={formik.values.address}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.address && formik.errors.address && (
                    <p className="text-red-400 text-xs mt-1">{formik.errors.address}</p>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={loginMutation.isPending || registerMutation.isPending}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-lg shadow-xl hover:shadow-purple-500/50 transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {loginMutation.isPending || registerMutation.isPending ? (
                  <>Loading...</>
                ) : (
                  <>{isRegister ? "Create Account" : "Sign In"}</>
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-white/70 text-sm">
                {isRegister ? "Already have an account?" : "New here?"}{" "}
                <span
                  onClick={() => setIsRegister(!isRegister)}
                  className="font-semibold text-purple-300 hover:text-white cursor-pointer underline underline-offset-4 transition-all"
                >
                  {isRegister ? "Sign In" : "Create an account"}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
