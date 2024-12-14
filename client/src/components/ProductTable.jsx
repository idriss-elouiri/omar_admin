"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

const ProductTable = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [productIdToDelete, setProductIdToDelete] = useState("");
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${apiUrl}/api/products/get`, {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();
        if (!response.ok) {
          setError(data.message);
          setLoading(false);
        } else {
          setProducts(data.products);
          setLoading(false);
        }
      } catch (error) {
        setError(error);
        setLoading(false);
        console.error("حدث خطأ أثناء جلب المنتجات:", error);
      }
    };
    fetchProducts();
  }, [apiUrl]);
  console.log(products);
  const handleEdit = (id) => {
    router.push(`/edit/${id}`);
    console.log(`Editing product with ID: ${id}`);
  };

  const handleDeleteProduct = async () => {
    try {
      const res = await fetch(
        `${apiUrl}/api/products/delete/${productIdToDelete}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      if (res.ok) {
        setProducts((prev) =>
          prev.filter((product) => product._id !== productIdToDelete)
        );
        setShowModal(false);
      } else {
        const data = await res.json();
        console.error(data.message);
      }
    } catch (error) {
      console.error("حدث خطأ أثناء حذف السيارة:", error);
    }
  };
  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold text-slate-700 mb-4">قائمة المنتجات</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white rounded-lg shadow-md">
          <thead>
            <tr className="bg-slate-100 border-b-2 border-slate-200">
              <th className="px-6 py-1 text-left text-slate-700 font-semibold">
                الصورة
              </th>
              <th className="px-6 py-1 text-left text-slate-600 font-semibold">
                اسم المنتج
              </th>
              <th className="px-6 py-1 text-left text-slate-700 font-semibold">
                الفئة
              </th>
              <th className="px-6 py-1 text-left text-slate-700 font-semibold">
                السعر
              </th>
              <th className="px-6 py-1 text-center text-slate-700 font-semibold">
                الإجراءات
              </th>
            </tr>
          </thead>
          <tbody>
            {products?.map((product) => (
              <tr
                key={product._id}
                className="border-b hover:bg-slate-50 transition"
              >
                {/* Image */}
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    {Object.values(product.imagesByColor).map(
                      (color, index) => (
                        <Image
                          key={index}
                          src={color.images[0]} // Display first image for each color
                          alt={`${product.title} (${color.color})`}
                          height={100}
                          width={100}
                          className="w-16 h-16 object-cover rounded-md border"
                        />
                      )
                    )}
                  </div>
                </td>

                {/* Product Title */}
                <td className="px-6 py-4 font-semibold text-slate-800">
                  {product.title}
                </td>

                {/* Category */}
                <td className="px-6 py-4 text-slate-600">
                  {product.category} - {product.subCategory}
                </td>

                {/* Price */}
                <td className="px-6 py-4 font-semibold text-slate-800">
                  {product.price} د.م
                </td>

                {/* Actions */}
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => handleEdit(product._id)}
                    className=" text-green-600 px-2 py-2 rounded-lg mr-2"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => {
                      setShowModal(true);
                      setProductIdToDelete(product._id);
                    }}
                    className="text-red-600 px-2 py-2 rounded-lg"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-md p-6 max-w-md w-full">
            <h3 className="text-lg text-center text-gray-700">
              هل أنت متأكد أنك تريد حذف هذه السيارة ?
            </h3>
            <div className="mt-6 flex justify-center gap-4">
              <button
                onClick={() => handleDeleteProduct(productIdToDelete)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                نعم انا متأكد
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                لا، إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductTable;
