import React, { useState, useRef, useEffect, use } from "react";
import { Dimensions } from "react-native";
import ProductListingScreen from "../../components/Products/product-listing";
import { getSellProducts } from "../../services/buy-sell-services/get-products";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48) / 2;

// ── Demo Data ─────────────────────────────────────────────────
const DEMO_PRODUCTS = [
  {
    id: "1",
    title: "MTech First Year Textbooks",
    description:
      "Set of 6 core textbooks, good condition, minimal highlighting",
    category: "Books & Notes",
    type: "LOST/FOUND",
    seller: "Arjun Sharma",
    college: "IIT Bombay",
    images: [
      "https://picsum.photos/seed/book1/400/300",
      "https://picsum.photos/seed/laptop1/400/300",
      "https://picsum.photos/seed/calc1/400/300",
    ],
    createdAt: "2025-03-10",
  },
  {
    id: "2",
    title: "Dell Laptop i5 8th Gen",
    description: "8GB RAM, 256GB SSD, battery life 4hrs, minor scratches",
    price: 22000,
    category: "Electronics",
    type: "RENT",
    seller: "Priya Mehra",
    college: "IIT Bombay",
    images: ["https://picsum.photos/seed/laptop1/400/300"],
    createdAt: "2025-03-09",
  },
  {
    id: "3",
    title: "Scientific Calculator Casio",
    description: "FX-991EX, barely used, all functions working",
    price: 600,
    category: "Stationery",
    type: "SELL",
    seller: "Rohit Verma",
    college: "IIT Bombay",
    images: ["https://picsum.photos/seed/calc1/400/300"],
    createdAt: "2025-03-08",
  },
  {
    id: "4",
    title: 'Cycle — Hero Sprint 26"',
    description: "1 year old, good condition, new tyres fitted last month",
    price: 3500,
    category: "Cycles & Transport",
    type: "SELL",
    seller: "Sneha Patel",
    college: "IIT Bombay",
    images: ["https://picsum.photos/seed/cycle1/400/300"],
    createdAt: "2025-03-07",
  },
  {
    id: "5",
    title: "JBL Go 3 Bluetooth Speaker",
    description: "Waterproof, 5hr battery, comes with charging cable",
    price: 1200,
    category: "Electronics",
    type: "SELL",
    seller: "Karan Singh",
    college: "IIT Bombay",
    images: ["https://picsum.photos/seed/speaker1/400/300"],
    createdAt: "2025-03-06",
  },
  {
    id: "6",
    title: "Single Bed Mattress",
    description: "Coir mattress 6 inch, 3x6 ft, used for 1 year",
    price: 1800,
    category: "Furniture",
    type: "SELL",
    seller: "Divya Nair",
    college: "IIT Bombay",
    images: ["https://picsum.photos/seed/mattress1/400/300"],
    createdAt: "2025-03-05",
  },
  {
    id: "7",
    title: "Badminton Racket Set",
    description: "2 Yonex rackets + shuttles + bag, used 6 months",
    price: 950,
    category: "Sports & Fitness",
    type: "SELL",
    seller: "Aditya Kumar",
    college: "IIT Bombay",
    images: ["https://picsum.photos/seed/badminton1/400/300"],
    createdAt: "2025-03-04",
  },
  {
    id: "8",
    title: "Winter Jacket — L size",
    description: "North Face lookalike, barely worn, warm lining inside",
    price: 700,
    category: "Clothing",
    type: "SELL",
    seller: "Meena Joshi",
    college: "IIT Bombay",
    images: ["https://picsum.photos/seed/jacket1/400/300"],
    createdAt: "2025-03-03",
  },
  {
    id: "9",
    title: "Induction Cooktop",
    description: "Prestige PIC 1.0, 1200W, works perfectly",
    price: 1100,
    category: "Kitchen & Appliances",
    type: "SELL",
    seller: "Nikhil Tiwari",
    college: "IIT Bombay",
    images: ["https://picsum.photos/seed/induction1/400/300"],
    createdAt: "2025-03-02",
  },
  {
    id: "10",
    title: "Gate 2024 Study Material",
    description: "Full set — Made Easy + ACE, all subjects covered",
    price: 1500,
    category: "Books & Notes",
    type: "SELL",
    seller: "Rahul Das",
    college: "IIT Bombay",
    images: ["https://picsum.photos/seed/gate1/400/300"],
    createdAt: "2025-03-01",
  },
];

export default function BuyScreen() {
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const user = await AsyncStorage.getItem("user");
        if (!user) {
          console.warn("User data not found in AsyncStorage");
          return;
        }
        const college = user ? JSON.parse(user).college : null;
        const products = await getSellProducts({ college });
        setProducts(products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const [Products, setProducts] = useState(DEMO_PRODUCTS);
  return <ProductListingScreen PRODUCTS={Products} PAGE="buy" mode="browse" />;
}
