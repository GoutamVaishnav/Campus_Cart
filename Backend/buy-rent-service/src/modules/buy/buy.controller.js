import { buyDb } from "../../config/buyDb.js";
import { uploadCompressedImage } from "../../utils/uploadImage.js";

export const getProducts = async (req, res, next) => {
  try {
    const products = await buyDb.buyProducts.findMany({
      orderBy: { created_at: "desc" },
    });
    res.status(200).json({
      success: true,
      message: "Products fetched successfully from buyDB",
      products,
    });
  } catch (err) {
    next(err);
  }
};

export const searchProducts = async (req, res, next) => {
  try {
    const q = req.query.q || "";

    const products = await buyDb.buyProducts.findMany({
      where: {
        OR: [
          {
            title: {
              contains: q,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: q,
              mode: "insensitive",
            },
          },
          {
            category: {
              contains: q,
              mode: "insensitive",
            },
          },
        ],
      },
      orderBy: {
        created_at: "desc",
      },
    });

    res.status(200).json({
      success: true,
      message: "Products fetched successfully from search query",
      products,
    });
  } catch (err) {
    next(err);
  }
};

export const getProductById = async (req, res, next) => {
  console.log("hello");

  try {
    const product = await buyDb.buyProducts.findUnique({
      where: { product_id: Number(req.params.id) },
    });
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product fetched successfully by id from buyDB",
      product,
    });
  } catch (err) {
    next(err);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    console.log("Body:", req.body);
    console.log("Files:", req.files);

    let imageUrls = [];

    // If files uploaded, compress and upload each
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const url = await uploadCompressedImage(file);
        imageUrls.push(url);
      }
    }

    // If image URLs are sent as text (optional)
    if (req.body.image_urls) {
      // assuming comma-separated URLs from Postman
      const urlsFromBody = req.body.image_urls.split(",").slice(0, 4);
      imageUrls = [...imageUrls, ...urlsFromBody];
    }

    if (imageUrls.length === 0) {
      return res
        .status(400)
        .json({ message: "Please provide at least one image (upload or URL)" });
    }

    if (!req.body.title || !req.body.price || !req.body.category) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const product = await buyDb.buyProducts.create({
      data: {
        title: req.body.title,
        description: req.body.description,
        price: Number(req.body.price),
        college: req.body.college,
        category: req.body.category,
        location: req.body.location,
        type: req.body.type,
        seller_id: req.user.id,
        seller_name: req.user.name,
        image_urls: imageUrls.slice(0, 4), // max 4 images
      },
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully in buyDB",
      product,
    });
  } catch (err) {
    next(err);
  }
};

export const updateProduct = async (req, res, next) => {
  console.log("BODY:", req.body);
  console.log("FILES:", req.files);
  try {
    const product = await buyDb.buyProducts.findUnique({
      where: { product_id: Number(req.params.id) },
    });

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    if (product.seller_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You can update only your own product",
      });
    }

    let imageUrls = [];

    // ✅ Keep existing images the user didn't remove
    if (req.body.existingImages) {
      // Could be a string (1 image) or array (multiple)
      const existing = Array.isArray(req.body.existingImages)
        ? req.body.existingImages
        : [req.body.existingImages];
      imageUrls = [...existing];
    }

    // ✅ Add newly uploaded images
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const url = await uploadCompressedImage(file);
        imageUrls.push(url);
      }
    }

    // Keep max 4
    imageUrls = imageUrls.slice(0, 4);

    if (imageUrls.length === 0) {
      return res
        .status(400)
        .json({ message: "Please provide at least one image" });
    }

    const updatedProduct = await buyDb.buyProducts.update({
      where: { product_id: Number(req.params.id) },
      data: {
        title: req.body.title ?? product.title,
        description: req.body.description ?? product.description,
        price: req.body.price ? Number(req.body.price) : product.price,
        category: req.body.category ?? product.category,
        location: req.body.location ?? product.location,
        college: req.body.college ?? product.college,
        image_urls: imageUrls,
      },
    });

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const product = await buyDb.buyProducts.findUnique({
      where: { product_id: Number(req.params.id) },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // check owner
    if (product.seller_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You can delete only your own product",
      });
    }

    await buyDb.buyProducts.delete({
      where: { product_id: Number(req.params.id) },
    });

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

export const updateStatus = async (req, res, next) => {
  try {
    const product = await buyDb.buyProducts.update({
      where: { product_id: Number(req.params.id) },
      data: { status: req.body.status },
    });
    res.status(200).json({
      success: true,
      message: "Product status updated successfully in buyDB",
      product,
    });
  } catch (err) {
    next(err);
  }
};

/////// ye user profile me niche dikhane wale hai jo user ne buy kiye hai
export const getMyProducts = async (req, res, next) => {
  try {
    const products = await buyDb.buyProducts.findMany({
      where: { seller_id: req.user.id },
      orderBy: { created_at: "desc" },
    });
    res.status(200).json({
      success: true,
      message: "My products fetched successfully",
      products,
    });
  } catch (err) {
    next(err);
  }
};

export const latestProducts = async (req, res, next) => {
  try {
    const products = await buyDb.buyProducts.findMany({
      take: 10,
      orderBy: { created_at: "desc" },
    });
    res.status(200).json({
      success: true,
      message: "Latest products fetched successfully",
      products,
    });
  } catch (err) {
    next(err);
  }
};
