import Product from "./product.model.js";

// Create a new product
export const createProduct = async (req, res) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "غير مسموح لك بإنشاء منتج"));
  }
  try {
    const product = new Product(req.body);
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all products
export const getAllProducts = async (req, res) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "غير مسموح لك بإنشاء منتج"));
  }
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single product by ID
export const getProductById = async (req, res) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "غير مسموح لك بإنشاء منتج"));
  }
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ error: "لم يتم العثور على المنتج" });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a product by ID
export const updateProduct = async (req, res) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "غير مسموح لك بإنشاء منتج"));
  }
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedProduct)
      return res.status(404).json({ error: "لم يتم العثور على المنتج" });
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a product by ID
export const deleteProduct = async (req, res) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "غير مسموح لك بإنشاء منتج"));
  }
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct)
      return res.status(404).json({ error: "لم يتم العثور على المنتج" });
    res.status(200).json({ message: "تم حذف المنتج بنجاح" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
