import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";

const Placeorder = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const hasCalled = useRef(false); 

  const { success, items, totalAmount, paymentId, orderId, userId } =
    location.state || {};

  const token = localStorage.getItem("token");

  const createOrder = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/v1/order/create",
        {
          userId,
          items,
          totalAmount,
          paymentId,
          orderId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      
      navigate("/order");
    } catch (err) {
      console.error("Order create error:", err);
    }
  };

  useEffect(() => {
    if (success && !hasCalled.current) {
      hasCalled.current = true; 
      createOrder();
    }
  }, [success]);

  return <h1>Processing your order</h1>;
};

export default Placeorder;
