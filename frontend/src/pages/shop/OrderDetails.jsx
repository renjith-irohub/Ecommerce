import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// ================= Review Popup =================
const ReviewPopup = ({ orderItemId, productId, onClose, onSuccess }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const token = localStorage.getItem("token");

  const handleSubmit = async () => {
    if (!rating) return alert("Pick a rating ⭐");

    try {
      await axios.post(
        "http://localhost:5000/api/v1/rate/add",
        { productId, rating, comment, orderItemId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      onSuccess(orderItemId);
      onClose();
    } catch (error) {
      alert(error.response?.data?.message || "Rating failed");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-80 relative shadow-xl">
        <button onClick={onClose} className="absolute top-2 right-2 text-2xl font-bold">×</button>
        <h2 className="text-xl font-semibold text-center mb-3">Rate Product</h2>

        <div className="flex justify-center mb-3 text-2xl gap-2">
          {[1, 2, 3, 4, 5].map(num => (
            <span key={num}
              onClick={() => setRating(num)}
              className={`cursor-pointer ${rating >= num ? "text-yellow-500" : "text-gray-400"}`}>
              ★
            </span>
          ))}
        </div>

        <textarea
          className="w-full border p-2 rounded"
          placeholder="Write review..."
          value={comment}
          onChange={e => setComment(e.target.value)}
        />

        <button
          className="bg-blue-600 text-white w-full py-2 rounded mt-3"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

// ================= Orders Page =================
const OrderDetails = () => {
  const token = localStorage.getItem("token");
  const [selected, setSelected] = useState(null);
  const [ordersUI, setOrdersUI] = useState([]);

  // Fetch orders
  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:5000/api/v1/order/myorder", {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data.orders ?? [];
    }
  });

  // Fetch reviews
  const { data: reviews, isLoading: reviewsLoading } = useQuery({
    queryKey: ["myReviews"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:5000/api/v1/rate/myreviews", {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data.reviews || [];
    }
  });

  // Merge rating + delivery status
  useEffect(() => {
    if (!orders || !reviews) return;

    const mapped = orders.map(order => ({
      ...order,
      items: order.items.map(item => {
        const rated = reviews.some(r => r.orderItemId === item._id);
        return {
          ...item,
          isRated: rated,
          canRate: order.status === "Delivered" && !rated,
          trackingStatus: order.status // simple tracking UI
        };
      })
    }));

    setOrdersUI(mapped);
  }, [orders, reviews]);

  const successRating = (orderItemId) => {
    setOrdersUI(prev =>
      prev.map(o => ({
        ...o,
        items: o.items.map(i => i._id === orderItemId ? { ...i, isRated: true, canRate: false } : i)
      }))
    );
  }

  if (ordersLoading || reviewsLoading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">My Orders</h1>

      {ordersUI.map(order => (
        <div key={order._id} className="bg-white p-5 mt-6 rounded-xl shadow">
          <p className="font-bold">Order #{order._id}</p>

          {order.items.map(item => (
            <div key={item._id} className="flex flex-col md:flex-row items-center gap-4 p-3 bg-gray-100 rounded-xl mt-3">
              <img src={item.image} className="w-16 h-16 object-cover rounded" />

              <div className="flex-1">
                <p className="font-semibold">{item.name}</p>

                {/* Tracking Status */}
                <p className="text-sm text-gray-600">Status: <b>{item.trackingStatus}</b></p>

                {/* Rating Button */}
                {item.isRated ? (
                  <button className="bg-green-600 text-white px-3 py-1 rounded mt-1">Rated ⭐</button>
                ) : item.canRate ? (
                  <button
                    className="bg-yellow-500 text-white px-3 py-1 rounded mt-1"
                    onClick={() => setSelected({ orderItemId: item._id, productId: item.productId })}
                  >
                    Rate Product ⭐
                  </button>
                ) : (
                  <button className="bg-gray-400 text-white px-3 py-1 rounded mt-1">Rate after delivery</button>
                )}
              </div>
            </div>
          ))}
        </div>
      ))}

      {selected && <ReviewPopup {...selected} onClose={() => setSelected(null)} onSuccess={successRating} />}
    </div>
  );
};

export default OrderDetails;
