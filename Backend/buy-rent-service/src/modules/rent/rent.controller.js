import { rentDb } from "../../config/rentDb.js";
import { uploadCompressedImage } from "../../utils/uploadImage.js";

export const getProducts = async (req, res, next) => {
  console.log("api");

  try {
    const products = await rentDb.rentProducts.findMany({
      orderBy: { created_at: "desc" },
    });
    res.status(200).json({
      success: true,
      message: "Products fetched successfully from rentDB",
      products,
    });
  } catch (err) {
    next(err);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const product = await rentDb.rentProducts.findUnique({
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
      message: "Product fetched successfully by id",
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

    if (!req.body.title || !req.body.price_per_day || !req.body.category) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const product = await rentDb.rentProducts.create({
      data: {
        title: req.body.title,
        description: req.body.description,
        price_per_day: Number(req.body.price_per_day),
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
  try {
    const product = await rentDb.rentProducts.findUnique({
      where: { product_id: Number(req.params.id) },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Owner check
    if (product.seller_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You can update only your own product",
      });
    }

    let imageUrls = product.image_urls || [];

    // If new files uploaded, compress and add
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const url = await uploadCompressedImage(file);
        imageUrls.push(url);
      }
    }

    // If image URLs sent as text (optional)
    if (req.body.image_urls) {
      const urlsFromBody = req.body.image_urls.split(",");
      imageUrls = [...imageUrls, ...urlsFromBody];
    }

    // Keep only max 4 images
    imageUrls = imageUrls.slice(0, 4);

    if (imageUrls.length === 0) {
      return res
        .status(400)
        .json({ message: "Please provide at least one image (upload or URL)" });
    }

    const updatedProduct = await rentDb.rentProducts.update({
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
    const product = await rentDb.rentProducts.findUnique({
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

    await rentDb.rentProducts.delete({
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
    const product = await rentDb.rentProducts.update({
      where: { product_id: Number(req.params.id) },
      data: { status: req.body.status },
    });
    res.status(200).json({
      success: true,
      message: "Product status updated successfully",
      product,
    });
  } catch (err) {
    next(err);
  }
};

export const getMyProducts = async (req, res, next) => {
  try {
    const products = await rentDb.rentProducts.findMany({
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
export const searchProducts = async (req, res, next) => {
  try {
    const q = req.query.q || "";

    const products = await rentDb.rentProducts.findMany({
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

export const latestProducts = async (req, res, next) => {
  try {
    const products = await rentDb.rentProducts.findMany({
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
