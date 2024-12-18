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
export const getAllProducts = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex, 10) || 0;
    const limit = parseInt(req.query.limit, 10) || 9;
    const sortDirection = req.query.sort === "asc" ? 1 : -1;

    // Construct filter options
    const filterOptions = {
      ...(req.query.title && {
        title: { $regex: decodeURIComponent(req.query.title), $options: "i" },
      }),
      ...(req.query.categories && {
        category: {
          $in: req.query.categories.split(",").map(decodeURIComponent),
        },
      }),
      ...(req.query.bestseller && {
        bestseller: req.query.bestseller === "true",
      }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: "i" } },
          { content: { $regex: req.query.searchTerm, $options: "i" } },
        ],
      }),
    };

    const products = await Product.find(filterOptions)
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    res.status(200).json({ products });
  } catch (error) {
    next(error);
  }
};

// Get a single product by ID
export const getProductById = async (req, res) => {
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

// Add Review for a Product
export const addReview = async (req, res) => {
  const { rating, comment } = req.body;
  const { id } = req.params;

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (!product.reviews) {
      product.reviews = [];
    }

    const newReview = {
      user: req.user.id,
      rating,
      comment,
      createdAt: Date.now(),
    };

    product.reviews.push(newReview);
    await product.save();

    // Send the updated product as a response
    res.status(201).json(newReview); // Return the updated product here
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
