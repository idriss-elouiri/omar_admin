import { z } from "zod";

export const productSchema = z.object({
  title: z
    .string({ required_error: "العنوان مطلوب" })
    .min(3, { message: "يجب أن يكون العنوان على الأقل 3 أحرف" }),
  content: z
    .string({ required_error: "الوصف مطلوب" })
    .min(10, { message: "يجب أن يكون الوصف على الأقل 10 أحرف" }),
  category: z
    .string({ required_error: "التصنيف مطلوب" })
    .refine((value) => ["Men", "Women", "Kids"].includes(value), {
      message: "التصنيف غير صالح",
    }),
  subCategory: z
    .string({ required_error: "التصنيف الفرعي مطلوب" })
    .refine(
      (value) => ["Topwear", "Bottomwear", "Winterwear"].includes(value),
      { message: "التصنيف الفرعي غير صالح" }
    ),
  price: z
    .number({ required_error: "السعر مطلوب" })
    .positive({ message: "يجب أن يكون السعر رقمًا موجبًا" }),
  sizes: z
    .array(z.enum(["SM", "MD", "LG", "XL", "XXL"]))
    .min(1, { message: "يجب تحديد حجم واحد على الأقل" }),
  bestseller: z.boolean().optional(),
  imagesByColor: z
    .record(
      z.string(),
      z.object({
        color: z.string(),
        images: z.array(
          z.string().url({ message: "يجب أن تكون كل صورة رابط URL صالح" })
        ),
      })
    )

    .optional(),
});

// Validation Function
export const validateProduct = (data) => productSchema.parse(data);
