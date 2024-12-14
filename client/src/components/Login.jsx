"use client";

import React, { useState } from "react";
import ErrorMessage from "./ErrorMessage";
import LoadingSpinner from "./LoadingSpinner";
import SuccessMessage from "./SuccessMessage";
import { useRouter } from "next/navigation";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  // Updates form data
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value.trim() }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if all fields are filled
    if (!formData.email || !formData.password) {
      setError("يرجى ملء جميع الحقول");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "فشل تسجيل الدخول");
        setLoading(false);
        return;
      }
      setLoading(false);
      setSuccessMessage(true);
      setError(null);
      router.push("/");
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-sm bg-white p-10 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-black text-center mb-6">
          Admin Panel Login
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <div>
            <label
              htmlFor="بريد إلكتروني"
              className="block text-sm text-gray-700 font-semibold"
            >
              بريد إلكتروني
            </label>
            <input
              type="email"
              id="email"
              placeholder="ادخل البريد الاكتروني"
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg "
            />
          </div>

          {/* Password Input */}
          <div>
            <label
              htmlFor="كلمة السر"
              className="block text-sm font-medium  text-gray-700 font-semibold"
            >
              كلمة السر
            </label>
            <input
              type="password"
              id="password"
              placeholder="ادخل كلمة السر"
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg "
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-black text-white font-semibold rounded-lg   focus:ring-offset-2"
            disabled={loading}
          >
            {loading ? (
              <LoadingSpinner />
            ) : (
              <div className="text-center">تسجيل الدخول</div>
            )}
          </button>
          {successMessage && (
            <SuccessMessage message="تم حفظ تغييراتك بنجاح!" />
          )}
          {error && <ErrorMessage message={error} />}
        </form>
      </div>
    </div>
  );
}
