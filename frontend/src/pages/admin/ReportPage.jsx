import React from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getMonthlyOrders } from "../../utils/getMonthlyOrders";

const COLORS = ["#6366F1", "#22C55E", "#EF4444"];

const fetchAdminOrders = async () => {
  const res = await axios.get("http://localhost:5000/api/v1/admin/fetchadmin");
  return res.data.orders;
};

const ReportPage = () => {
  const navigate = useNavigate();

  const { data: orders = [], isLoading, isError } = useQuery({
    queryKey: ["adminOrders"],
    queryFn: fetchAdminOrders,
  });

  const monthlyData = getMonthlyOrders(orders);
  const totalRevenue = orders.reduce((a, b) => a + b.totalAmount, 0);

  const statusCount = {
    Paid: orders.filter(o => o.status === "Paid").length,
    Delivered: orders.filter(o => o.status === "Delivered").length,
    Cancelled: orders.filter(o => o.status === "Cancelled").length,
  };

  const pieData = Object.keys(statusCount).map((key) => ({
    name: key,
    value: statusCount[key],
  }));

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.3, repeat: Infinity, ease: "linear" }}
          className="w-20 h-20 border-8 border-t-indigo-600 border-purple-300 rounded-full"
        />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <h1 className="text-4xl font-bold text-red-600">Failed to load report</h1>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex flex-col overflow-auto">

      {/* Sticky Header - same vibe as Orders Page */}
      <header className="px-6 py-5 border-b border-white/60 backdrop-blur-sm bg-white/70 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-700 bg-clip-text text-transparent">
              Reports Dashboard
            </h1>
            <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
              Total Orders:
              <span className="font-bold text-indigo-700">{orders.length}</span>
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/admin")}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-700 text-white text-sm font-bold rounded-xl shadow-lg"
          >
            Go Back
          </motion.button>
        </div>
      </header>

      {/* Scrollable Content */}
      <main className="max-w-7xl mx-auto w-full px-6 py-10 flex flex-col gap-12">

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "Total Orders", value: orders.length, color: "text-indigo-600" },
            { title: "Delivered", value: statusCount.Delivered, color: "text-green-600" },
            { title: "Paid Orders", value: statusCount.Paid, color: "text-blue-500" },
            { title: "Total Revenue", value: "₹" + totalRevenue.toLocaleString("en-IN"), color: "text-purple-600" },
          ].map((card, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="p-6 bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl border"
            >
              <h3 className="text-gray-600 font-semibold">{card.title}</h3>
              <p className={`text-4xl font-extrabold ${card.color}`}>{card.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* Monthly Orders Bar Chart */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl border p-8"
          >
            <h2 className="text-2xl font-bold mb-6 text-indigo-900">Monthly Orders</h2>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="4 4" opacity={0.2} />
                  <XAxis dataKey="month" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="orders" fill="#7c3aed" radius={[12, 12, 0, 0]} barSize={50} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Order Status Pie Chart */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl border p-8"
          >
            <h2 className="text-2xl font-bold mb-6 text-indigo-900">Order Status Breakdown</h2>

            <div className="h-96 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={140}
                    innerRadius={60}
                    dataKey="value"
                    label
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

        </div>

      </main>

    </div>
  );
};

export default ReportPage;
