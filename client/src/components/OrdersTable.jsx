"use client";

import React, { useState, useEffect } from "react";

const OrdersTable = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusUpdates, setStatusUpdates] = useState({}); // لتخزين الحالة المختارة لكل طلب
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/orders/get`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("فشل في جلب الطلبات");
        }

        const data = await response.json();
        setOrders(data); // تعيين الطلبات المسترجعة
        setLoading(false);
      } catch (error) {
        console.error("خطأ في جلب الطلبات:", error);
        setLoading(false);
      }
    };

    fetchOrders();
  }, [apiUrl]);

  const handleStatusChange = (orderId, newStatus) => {
    setStatusUpdates((prevStatusUpdates) => ({
      ...prevStatusUpdates,
      [orderId]: newStatus,
    }));
  };

  if (loading) {
    return <div>جاري تحميل الطلبات...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">الطلبات</h2>
      <div>
        {orders.map((order) => (
          <div
            key={order._id}
            className="order-card flex justify-between border text-slate-800 p-4 mb-4 rounded-md shadow-lg"
          >
            {/* رأس الطلب */}
            <div className="order-header mb-3">
              <div className="order-items mt-4 mb-2">
                <ul>
                  {order.cartItems.map((item, index) => (
                    <li key={index}>
                      <p className="text-slate-800">
                        {item.title} - ${item.price}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
              <h3 className="font-bold text-xl mb-2 text-slate-800">
                {order.deliveryInfo.firstName} {order.deliveryInfo.lastName}
              </h3>
              <p className="text-slate-800">
                {order.deliveryInfo.street}, {order.deliveryInfo.city},{" "}
                {order.deliveryInfo.state}, {order.deliveryInfo.country},{" "}
                {order.deliveryInfo.zipcode}
              </p>
            </div>

            {/* معلومات الطلب */}
            <div className="order-info mt-4 text-slate-800">
              <p className="text-slate-800 mb-2">
                <strong>عدد العناصر:</strong> {order.cartItems.length}
              </p>
              <p className=" text-slate-800">
                <strong>طريقة الدفع:</strong>{" "}
                {order.paymentMethod === "cashOnDelivery"
                  ? "الدفع عند التسليم"
                  : order.paymentMethod}
              </p>
              <p className="text-slate-800">
                <strong>حالة الدفع:</strong>{" "}
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </p>
              <p className=" text-slate-800">
                <strong>التاريخ:</strong>{" "}
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>

            <p className="mt-4 text-slate-800">
              <strong>الإجمالي:</strong> ${order.total.toFixed(2)}
            </p>
            {/* اختيار حالة الطلب */}
            <div className="order-status mt-4">
              <label
                htmlFor={`status-${order._id}`}
                className="block text-sm font-medium text-slate-800"
              >
                تحديث حالة الطلب
              </label>
              <select
                id={`status-${order._id}`}
                value={statusUpdates[order._id] || order.status}
                onChange={(e) => handleStatusChange(order._id, e.target.value)}
                className="mt-2 p-2  text-slate-800 border rounded-md w-full"
              >
                <option value="pending">تجهيز</option>
                <option value="shipped">تم الشحن</option>
                <option value="outForDelivery">في طريق التوصيل</option>
                <option value="delivered">تم التسليم</option>
              </select>
            </div>

            {/* العناصر الخاصة بالطلب */}

            {/* زر الإجراءات */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersTable;
