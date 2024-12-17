"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import ErrorMessage from "./ErrorMessage";
import LoadingSpinner from "./LoadingSpinner";
import { useRouter } from "next/navigation";

const MAX_IMAGES = 6;

const ProductForm = ({
  _id,
  title: existingTitle,
  content: existingContent,
  category: existingCategory,
  subCategory: existingSubCategory,
  price: existingPrice,
  sizes: existingSizes,
  bestseller: existingBestseller,
  imagesByColor: existingImagesByColor,
}) => {
  const [formData, setFormData] = useState({
    title: existingTitle || "",
    content: existingContent || "",
    category: existingCategory || "",
    subCategory: existingSubCategory || "",
    price: existingPrice || "",
    sizes: existingSizes || [],
    bestseller: existingBestseller || false,
    imagesByColor: existingImagesByColor || {},
    reviews: [],
  });
  Image;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState([]);
  const [selectedColor, setSelectedColor] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const filePickerRef = useRef();
  const router = useRouter();
  const colors = [
    "احمر",
    "اسود",
    "ازرق",
    "اخضر",
    "ابيض",
    "رمادي",
    "الوردي",
    "اصفر",
  ];
  const sizeMapping = {
    SM: "SM",
    MD: "MD",
    LG: "LG",
    XL: "XL",
    XXL: "XXL",
  };
  const categories = [
    { label: "رجال", value: "رجال" },
    { label: "نساء", value: "نساء" },
    { label: "أطفال", value: "اطفال" },
  ];

  const subCategories = [
    { label: "ملابس علوية", value: "ملابس علوية" },
    { label: "ملابس سفلية", value: "ملابس سفلية" },
    { label: "ملابس شتوية", value: "ملابس شتوية" },
  ];

  const prepareSizesForSubmission = (sizes) =>
    sizes.map((size) =>
      Object.keys(sizeMapping).includes(size)
        ? size
        : Object.keys(sizeMapping).find((key) => sizeMapping[key] === size)
    );

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
  };

  const uploadImage = async (file) => {
    const storage = getStorage(app);
    const storageRef = ref(storage, `${Date.now()}_${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(1));
        },
        (error) => {
          setImageUploadError("Image upload failed (2 mb max per image)");
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(resolve);
        }
      );
    });
  };

  const handleImageSubmit = async (e) => {
    e.preventDefault();

    if (!selectedColor) {
      setImageUploadError("يرجى اختيار لون قبل رفع الصور");
      return;
    }

    setUploading(true);
    try {
      const uploadPromises = Array.from(files).map(uploadImage);
      const urls = await Promise.all(uploadPromises);

      setFormData((prevData) => ({
        ...prevData,
        imagesByColor: {
          ...prevData.imagesByColor,
          [selectedColor]: {
            color: selectedColor,
            images: [
              ...(prevData.imagesByColor[selectedColor]?.images || []),
              ...urls, // Ensure urls is an array of image URLs
            ],
          },
        },
      }));

      setImageUploadError(null);
    } catch (error) {
      console.error(error);
    } finally {
      setUploading(false);
      setImageUploadProgress(null);
    }
  };

  const handleRemoveImageByColor = (color, index) => {
    setFormData((prevData) => ({
      ...prevData,
      imagesByColor: {
        ...prevData.imagesByColor,
        [color]: {
          ...prevData.imagesByColor[color],
          images: prevData.imagesByColor[color].images.filter(
            (_, i) => i !== index
          ),
        },
      },
    }));
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "price") {
      setFormData((prev) => ({ ...prev, [name]: parseFloat(value) || "" }));
    } else if (type === "checkbox" && name === "sizes") {
      setFormData((prev) => ({
        ...prev,
        sizes: checked
          ? [...prev.sizes, value]
          : prev.sizes.filter((size) => size !== value),
      }));
    } else if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = _id
      ? `${apiUrl}/api/products/edit/${_id}`
      : `${apiUrl}/api/products/create`;

    try {
      setLoading(true);

      const preparedSizes = prepareSizesForSubmission(formData.sizes);
      const formattedImagesByColor = Object.keys(
        formData.imagesByColor || {}
      ).reduce((acc, color) => {
        acc[color] = {
          color,
          images: formData.imagesByColor[color]?.images || [],
        };
        return acc;
      }, {});

      const response = await fetch(url, {
        method: _id ? "PUT" : "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          sizes: preparedSizes,
          imagesByColor: formattedImagesByColor,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrors(errorData.message || "حدث خطأ أثناء إرسال النموذج.");
        setLoading(false);
        return;
      }

      const data = await response.json();
      setErrors({});
      setLoading(false);
      router.push("/view-items");
    } catch (err) {
      if (err.errors) {
        setErrors(
          err.errors.reduce((acc, error) => {
            acc[error.path] = error.message;
            return acc;
          }, {})
        );
      } else {
        setErrors({
          general: "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.",
        });
      }
      setLoading(false);
    }
  };

  console.log(formData.imagesByColor);
  return (
    <div className="max-w-xl p-6 rounded-lg">
      <h2 className="text-2xl text-slate-600 font-bold mb-4">اضافة منتجات</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xl font-semibold mb-1 text-gray-600">
            اختر لون الصورة
          </label>
          <select
            value={selectedColor}
            onChange={(e) => setSelectedColor(e.target.value)}
            className="w-[150px] px-4 py-2 border font-semibold rounded-md text-slate-600 border border-gray-300"
          >
            <option value="" disabled>
              اختر لون
            </option>
            {colors.map((color) => (
              <option key={color} value={color}>
                {color}
              </option>
            ))}
          </select>
        </div>
        {/* Upload Images */}
        <div>
          <h2 className="text-slate-600 font-semibold text-xl">ارفع الصور</h2>
          <div className="flex gap-4 items-center justify-between border-4 border-slate-600 border-dotted p-3">
            <input
              type="file"
              multiple
              accept="image/*"
              ref={filePickerRef}
              onChange={handleFileChange}
              hidden
            />
            <Image
              src="/images/uploading.png"
              alt="Upload Images"
              width={100}
              height={100}
              onClick={() => filePickerRef.current.click()}
              className="cursor-pointer"
            />
            <button
              type="button"
              className="p-2 bg-black text-xl font-semibold text-white"
              onClick={handleImageSubmit}
              disabled={uploading}
            >
              {uploading ? (
                <LoadingSpinner />
              ) : (
                <div className="text-center"> رفع الصورة</div>
              )}
            </button>
          </div>
          {imageUploadError && <ErrorMessage message={imageUploadError} />}
          {/* Display Previews */}
          <div>
            <div>
              <h3 className="text-lg font-semibold text-slate-600 text-xl">
                صور لكل لون
              </h3>
              {Object.values(formData.imagesByColor).map(
                ({ color, images }) => (
                  <div key={color}>
                    <h4 className="text-md font-semibold">{color}</h4>
                    <div className="flex gap-2">
                      {images.map((url, index) => (
                        <div key={index} className="relative group">
                          <Image
                            src={url}
                            alt={color}
                            className="object-cover h-32 w-32 rounded-md border"
                            width={100}
                            height={100}
                          />
                          <button
                            className="absolute top-2 right-2"
                            onClick={() =>
                              handleRemoveImageByColor(color, index)
                            }
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6 text-red-600"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        {/* Product Details Form */}
        <div>
          <label className="block text-xl font-semibold mb-1 text-gray-600">
            اسم المنتج
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-md placeholder:text-slate-600 placeholder:font-semibold border border-gray-300"
            placeholder="ادخل اسم المنتج"
          />
        </div>

        <div>
          <label className="block text-xl font-semibold mb-1 text-gray-600">
            وصف المنتج
          </label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-md placeholder:text-slate-600 placeholder:font-semibold border border-gray-300"
            placeholder="ادخل وصف للمنتج"
          />
        </div>

        {/* Category and Sub Category */}
        <div className="flex items-center justify-between">
          <div>
            <label className="block text-xl font-semibold mb-1 text-gray-600">
              فئة المنتج
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-[150px] px-4 py-2 border font-semibold rounded-md text-slate-600 border-gray-300"
            >
              <option value="">اختر فئة المنتج</option>
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xl font-semibold mb-1 text-gray-600">
              الفئة الفرعية
            </label>
            <select
              name="subCategory"
              value={formData.subCategory}
              onChange={handleInputChange}
              className="w-[150px] px-4 py-2 border font-semibold rounded-md text-slate-600 border-gray-300"
            >
              <option value="">اختر فئة المنتج</option>
              {subCategories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xl font-semibold mb-1 text-gray-600">
              السعر
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className="w-28 px-4 py-2 border rounded-md placeholder:text-slate-600 placeholder:font-semibold border border-gray-300"
              placeholder="25"
            />
          </div>
        </div>

        {/* Sizes Selector */}
        <div className="mb-4">
          <label className="block text-lg font-medium mb-2">Sizes</label>
          <div className="flex flex-wrap gap-4">
            {Object.keys(sizeMapping).map((key) => (
              <label key={key} className="cursor-pointer">
                {/* Hidden Checkbox */}
                <input
                  type="checkbox"
                  name="sizes"
                  value={key}
                  className="hidden" // Hides the default checkbox
                  checked={formData.sizes.includes(key)}
                  onChange={handleInputChange}
                />
                {/* Custom Styled Div */}
                <div
                  className={`w-16 h-16 flex items-center justify-center rounded-lg font-bold text-white transition-all ${
                    formData.sizes.includes(key)
                      ? "bg-pink-300 text-slate-600 scale-105 shadow-md"
                      : "bg-blue-100 text-slate-600 shadow-blue-300"
                  }`}
                >
                  {sizeMapping[key]} {/* Display the size label */}
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Bestseller */}
        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="bestseller"
              checked={formData.bestseller}
              onChange={handleInputChange}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-lg">هذا منتج مميز</span>
          </label>
        </div>

        <div className="pt-5 ">
          <button
            type="submit"
            className="bg-black font-semibold text-white py-3 px-6"
            disabled={loading}
          >
            {loading ? (
              <LoadingSpinner />
            ) : (
              <div className="text-center"> حفظ المنتج</div>
            )}
          </button>
        </div>
      </form>
      {errors.category && <ErrorMessage message={errors.category} />}
      {errors.price && <ErrorMessage message={errors.price} />}
      {errors.content && <ErrorMessage message={errors.content} />}
      {errors.sizes && <ErrorMessage message={errors.sizes} />}
      {errors.imagesByColor && <ErrorMessage message={errors.imagesByColor} />}
    </div>
  );
};
export default ProductForm;
