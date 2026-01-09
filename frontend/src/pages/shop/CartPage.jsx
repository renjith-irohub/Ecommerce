import React from "react";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";


function loadRazorpayScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}


const createOrder = async ({ userId, cartItems }) => {
  const res = await axios.post(
    "http://localhost:5000/api/v1/payment/createorder",
    { userId, cartItems }
  );
  return res.data.order;
};

// Verify Razorpay Payment
const verifyPayment = async (payload) => {
  const res = await axios.post(
    "http://localhost:5000/api/v1/payment/verify",
    payload
  );
  return res.data;
};


const placeOrder = async (cartItems) => {
  const res = await axios.post("http://localhost:5000/api/orders/place", {
    cartItems,
  });
  return res.data.order;
};

const CartPage = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user);
  const userId = user?.id;

 
  const { data, isLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:5000/api/v1/cart/getcart");
      return res.data;
    },
  });
console.log(data);

  const cart = data?.cart || [];

  
  const clearCart = useMutation({
    mutationFn: () => axios.delete("http://localhost:5000/api/v1/cart/clear"),
    onSuccess: () => queryClient.invalidateQueries(["cart"]),
  });

  const updateQuantity = useMutation({
    mutationFn: ({ id, action }) =>
      axios.put(`http://localhost:5000/api/v1/cart/update/${id}`, { action }),
    onSuccess: () => queryClient.invalidateQueries(["cart"]),
  });

  const removeItem = useMutation({
    mutationFn: (id) =>
      axios.delete(`http://localhost:5000/api/v1/cart/remove/${id}`),
    onSuccess: () => queryClient.invalidateQueries(["cart"]),
  });

  const orderMutation = useMutation({ mutationFn: createOrder });
  const verifyMutation = useMutation({ mutationFn: verifyPayment });
  const placeOrderMutation = useMutation({ mutationFn: placeOrder });

 
  const checkoutHandler = async () => {
    if (cart.length === 0) return alert("Cart empty!");
    if (!userId) return alert("Please login to continue");

    const sdkLoaded = await loadRazorpayScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );
    if (!sdkLoaded) return alert("Razorpay failed to load");

    try {
      const order = await orderMutation.mutateAsync({
        userId,
        cartItems: cart,
      });

      const options = {
        key: "rzp_test_Rh66fuEB6ifCUW",
        amount: order.amount,
        currency: order.currency,
        order_id: order.id,
        name: "MyShop",
        description: "Order Payment",

        handler: async function (response) {
          const verifyRes = await verifyMutation.mutateAsync(response);

          if (verifyRes.message === "Payment successful") {
           
    
            // !cart empty
           await clearCart.mutateAsync(); 

            
            
            navigate("/placeorder",{
              state:{
                success:true,
                items:cart,
                totalAmount:total,
                paymentId:response.razorpay_payment_id,
                orderId:response.razorpay_order_id,
                userId:user._id,
              },
            })
          }
        },

        theme: { color: "#121212" },
      };

      new window.Razorpay(options).open();
    } catch (err) {
      alert("Payment failed");
      console.error(err);
    }
  };

  if (isLoading) return <p className="p-6">Loading...</p>;

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">My Cart</h1>

      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          <div className="space-y-4">
            {cart.map((item) => (
              <div key={item._id} className="flex items-center gap-4 border p-4 rounded-xl">
                <img src={item.image} className="w-20 h-20 object-cover rounded" />
                <div className="flex-1">
                  <h2 className="font-semibold text-lg">{item.name}</h2>
                  <p>₹{item.price}</p>

                  <div className="flex items-center gap-2 mt-2">
                    <button
                      disabled={item.quantity <= 1}
                      onClick={() =>
                        updateQuantity.mutate({ id: item._id, action: "decrease" })
                      }
                      className="px-3 py-1 bg-gray-300 rounded"
                    >
                      -
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      onClick={() =>
                        updateQuantity.mutate({ id: item._id, action: "increase" })
                      }
                      className="px-3 py-1 bg-gray-300 rounded"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-right text-xl font-semibold mt-6">
            Total: ₹{total}
          </div>

          <div className="flex justify-between mt-6">
            <button
              onClick={() => clearCart.mutate()}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg"
            >
              Clear Cart
            </button>

            <button
              onClick={checkoutHandler}
              className="px-4 py-2 bg-green-600 text-white rounded-lg"
            >
              Pay Now
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;


