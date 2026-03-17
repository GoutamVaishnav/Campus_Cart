import lostFoundApi from "../lostFoundApi";

const DEMO_PRODUCTS = {
  message: "Items fetched successfully from lostFoundDB",
  success: true,
  products: [
    {
      product_id: 1,
      title: "Black JBL Earphones",
      description:
        "Found near the library entrance, black JBL wired earphones in a case.",
      category: "Electronics",
      type: "FOUND",
      location: "Library Block",
      college: "IIIT Nagpur",
      seller_id: "79ed60c3-e837-4ede-bf4f-c1f881808c4f",
      seller_name: "Rajveer Singh",
      image_urls: ["https://picsum.photos/seed/earphones/800/600"],
      created_at: "2026-03-15T10:22:00.000Z",
    },
    {
      product_id: 2,
      title: "Blue Water Bottle",
      description:
        "Lost my blue Milton water bottle somewhere in the CSE block, has my name written on it.",
      category: "Other",
      type: "LOST",
      location: "CSE Block",
      college: "IIIT Nagpur",
      seller_id: "5c659ef6-17e5-4254-aa30-b777ededdb32",
      seller_name: "Manoj Das",
      image_urls: ["https://picsum.photos/seed/bottle/800/600"],
      created_at: "2026-03-15T14:45:00.000Z",
    },
    {
      product_id: 3,
      title: "Student ID Card",
      description:
        "Found a student ID card near the canteen. Belongs to a 3rd year student.",
      category: "Stationery",
      type: "FOUND",
      location: "Canteen",
      college: "IIIT Nagpur",
      seller_id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      seller_name: "Priya Sharma",
      image_urls: ["https://picsum.photos/seed/idcard/800/600"],
      created_at: "2026-03-16T09:10:00.000Z",
    },
    {
      product_id: 4,
      title: "Casio Calculator",
      description:
        "Lost my Casio fx-991ES scientific calculator during the maths exam. Has a small scratch on the back.",
      category: "Stationery",
      type: "LOST",
      location: "Examination Hall",
      college: "IIIT Nagpur",
      seller_id: "79ed60c3-e837-4ede-bf4f-c1f881808c4f",
      seller_name: "Rajveer Singh",
      image_urls: ["https://picsum.photos/seed/calculator/800/600"],
      created_at: "2026-03-16T11:30:00.000Z",
    },
    {
      product_id: 5,
      title: "Grey Hoodie",
      description:
        "Left my grey Nike hoodie on a bench near the basketball court.",
      category: "Clothing",
      type: "LOST",
      location: "Basketball Court",
      college: "IIIT Nagpur",
      seller_id: "5c659ef6-17e5-4254-aa30-b777ededdb32",
      seller_name: "Manoj Das",
      image_urls: ["https://picsum.photos/seed/hoodie/800/600"],
      created_at: "2026-03-17T08:00:00.000Z",
    },
  ],
};

export const GetLostFoundProducts = async ({ college }) => {
  return DEMO_PRODUCTS;
  const response = await lostFoundApi.get(`/lost-found`, {
    timeout: 15000,
    params: { college },
  });
  return response.data;
};

export const mylostfoundProducts = async ({ userid }) => {
  return DEMO_PRODUCTS;
  const response = await lostFoundApi.get(`/lost-found`, {
    timeout: 15000,
    params: { userid },
  });
  return response.data;
};

export const GetLostFoundProductById = async ({ productId }) => {
  const response = await lostFoundApi.get(`/lost-found`, {
    timeout: 15000,
    params: { productId },
  });
  return response.data;
};
