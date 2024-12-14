"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import ProductForm from "./ProductForm";

export default function EditProduct() {
  const { id } = useParams();
  const [editProduct, setEditProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchEditProduct = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/products/${id}`, {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "لايمكن الوصول لمعلومات هذا المنتج");
        }

        setEditProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEditProduct();
    }
  }, [id, apiUrl]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full py-10">
        <p className="text-gray-600 font-medium text-lg">جاري التحميل...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 p-6 text-center">
        <p className="text-red-500 font-semibold text-lg">Erreur : {error}</p>
        <button
          onClick={() => setError(null)}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-800 transition duration-300"
        >
          حاول
        </button>
      </div>
    );
  }

  return editProduct ? (
    <ProductForm {...editProduct} />
  ) : (
    <div className="flex items-center justify-center h-full py-10">
      <p className="text-gray-700 font-medium text-lg">
        لاتوجد معلومات لهذا المنتج.
      </p>
    </div>
  );
}
