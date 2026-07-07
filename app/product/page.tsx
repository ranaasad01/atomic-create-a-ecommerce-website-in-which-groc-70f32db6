"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { ShoppingCart, Star, ChevronLeft, ChevronRight, Plus, Minus, Check, Leaf, Truck, Shield, RefreshCw, Heart, Share2, ArrowRight } from 'lucide-react';
import { type Product, type Category } from "@/lib/data";
import {
  fadeInUp,
  fadeIn,
  staggerContainer,
  scaleIn,
  slideInLeft,
  slideInRight,
} from "@/lib/motion";
import { useTranslations } from "next-intl";

const ALL_PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Organic Fuji Apples",
    category: "Fruits",
    price: 4.99,
    originalPrice: 6.49,
    weight: "1 kg",
    image: "/images/organic-fuji-apples.jpg",
    badge: "Sale",
    rating: 4.8,
    reviews: 214,
    inStock: true,
    description:
      "Crisp, sweet Fuji apples grown without pesticides on family-owned orchards in Washington State. Perfect for snacking, baking, or adding to salads. Each apple is hand-picked at peak ripeness to ensure maximum flavor and nutrition.",
  },
  {
    id: "p2",
    name: "Ripe Cavendish Bananas",
    category: "Fruits",
    price: 1.99,
    weight: "500 g",
    image: "/images/ripe-cavendish-bananas.jpg",
    badge: "Fresh",
    rating: 4.6,
    reviews: 189,
    inStock: true,
    description:
      "Naturally ripened Cavendish bananas sourced directly from tropical farms. Rich in potassium and natural sugars, these bananas are ideal for smoothies, cereal toppings, or a quick energy boost on the go.",
  },
  {
    id: "p3",
    name: "Seedless Red Grapes",
    category: "Fruits",
    price: 5.49,
    originalPrice: 7.0,
    weight: "750 g",
    image: "/images/seedless-red-grapes.jpg",
    badge: "Sale",
    rating: 4.7,
    reviews: 132,
    inStock: true,
    description:
      "Plump, juicy seedless red grapes with a perfect balance of sweetness and tartness. Grown in sun-drenched California vineyards and chilled immediately after harvest to lock in freshness.",
  },
  {
    id: "p4",
    name: "Alphonso Mangoes",
    category: "Fruits",
    price: 8.99,
    weight: "4 pcs",
    image: "https://www.starkbros.com/images/dynamic/6955.jpg",
    badge: "Premium",
    rating: 4.9,
    reviews: 301,
    inStock: true,
    description:
      "The king of mangoes. Alphonso mangoes from Ratnagiri, India are celebrated for their rich, creamy texture and intensely sweet aroma. Limited seasonal availability — order while stocks last.",
  },
  {
    id: "p5",
    name: "Baby Spinach Leaves",
    category: "Vegetables",
    price: 3.29,
    weight: "200 g",
    image: "https://www.earthboundfarm.com/wp-content/uploads/2024/04/BabySpinach-Half-10oz-Mockup.jpg",
    badge: "Organic",
    rating: 4.5,
    reviews: 98,
    inStock: true,
    description:
      "Tender, pre-washed baby spinach leaves ready to eat straight from the bag. Packed with iron, vitamins A and C, and antioxidants. Great for salads, smoothies, and sautéed dishes.",
  },
  {
    id: "p6",
    name: "Cherry Tomatoes",
    category: "Vegetables",
    price: 3.79,
    weight: "400 g",
    image: "https://picsum.photos/seed/f3ba096c5d3e/800/600",
    badge: "Fresh",
    rating: 4.6,
    reviews: 145,
    inStock: true,
    description:
      "Vine-ripened cherry tomatoes bursting with sweet, tangy flavor. Grown in greenhouse conditions for consistent quality year-round. Perfect for salads, pasta, or roasting.",
  },
  {
    id: "p7",
    name: "Whole Milk (Organic)",
    category: "Dairy",
    price: 4.49,
    weight: "1 L",
    image: "/images/organic-whole-milk.jpg",
    badge: "Organic",
    rating: 4.7,
    reviews: 267,
    inStock: true,
    description:
      "Creamy, full-fat organic whole milk from grass-fed cows. No added hormones or antibiotics. Pasteurized and homogenized for safety while retaining natural nutrients.",
  },
  {
    id: "p8",
    name: "Sourdough Bread Loaf",
    category: "Bakery",
    price: 6.99,
    weight: "800 g",
    image: "https://i5.walmartimages.com/seo/Great-Value-Whole-Vitamin-D-Milk-Gallon-Plastic-Jug-128-Fl-Oz_6a7b09b4-f51d-4bea-a01c-85767f1b481a.86876244397d83ce6cdedb030abe6e4a.jpeg",
    badge: "Artisan",
    rating: 4.8,
    reviews: 178,
    inStock: true,
    description:
      "Slow-fermented sourdough loaf baked fresh every morning in our partner bakery. Crispy crust, chewy crumb, and a mild tangy flavor. Made with just flour, water, salt, and a live starter.",
  },
  {
    id: "p9",
    name: "Fresh Strawberries",
    category: "Fruits",
    price: 4.29,
    originalPrice: 5.49,
    weight: "500 g",
    image: "/images/fresh-strawberries.jpg",
    badge: "Sale",
    rating: 4.7,
    reviews: 223,
    inStock: true,
    description:
      "Sun-kissed strawberries picked at the height of the season. Intensely red, fragrant, and sweet with a slight tartness. Excellent for desserts, jams, or eating fresh with cream.",
  },
  {
    id: "p10",
    name: "Navel Oranges",
    category: "Fruits",
    price: 3.99,
    weight: "1 kg",
    image: "/images/navel-oranges.jpg",
    badge: "Fresh",
    rating: 4.5,
    reviews: 156,
    inStock: true,
    description:
      "Juicy, seedless navel oranges with a bright, sweet flavor and easy-peel skin. High in vitamin C and natural antioxidants. Great for juicing or eating as a healthy snack.",
  },
  {
    id: "p11",
    name: "Blueberries",
    category: "Fruits",
    price: 5.99,
    weight: "300 g",
    image: "https://hips.hearstapps.com/hmg-prod/images/blueberries-in-dish-royalty-free-image-1772132137.pjpeg?crop=0.771xw:1.00xh;0.135xw,0&resize=1200:*",
    badge: "Superfood",
    rating: 4.8,
    reviews: 198,
    inStock: true,
    description:
      "Plump, antioxidant-rich blueberries sourced from Pacific Northwest farms. Naturally sweet with a hint of tartness. Ideal for smoothies, pancakes, yogurt bowls, or snacking.",
  },
  {
    id: "p12",
    name: "Broccoli Crown",
    category: "Vegetables",
    price: 2.49,
    weight: "400 g",
    image: "/images/fresh-broccoli-crown.jpg",
    badge: "Fresh",
    rating: 4.4,
    reviews: 87,
    inStock: true,
    description:
      "Firm, vibrant green broccoli crowns harvested at peak freshness. Rich in fiber, vitamins K and C, and folate. Versatile for steaming, roasting, stir-frying, or eating raw.",
  },
];

const FEATURED_PRODUCT_ID = "p1";

const GALLERY_IMAGES = [
  "/images/organic-fuji-apples.jpg",
  "/images/organic-fuji-apples-close.jpg",
  "/images/organic-fuji-apples-basket.jpg",
  "/images/organic-fuji-apples-sliced.jpg",
];

const BADGE_COLORS: Record<string, string> = {
  Sale: "bg-red-100 text-red-700",
  Fresh: "bg-emerald-100 text-emerald-700",
  Organic: "bg-lime-100 text-lime-700",
  Premium: "bg-amber-100 text-amber-700",
  Artisan: "bg-orange-100 text-orange-700",
  Superfood: "bg-purple-100 text-purple-700",
};

function StarRating({ rating, reviews }: { rating: number; reviews: number }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < full
                ? "fill-[#F9A825] text-[#F9A825]"
                : i === full && half
                ? "fill-[#F9A825]/50 text-[#F9A825]"
                : "fill-gray-200 text-gray-200"
            }`}
          />
        ))}
      </div>
      <span className="text-sm text-gray-500 font-medium">
        {rating.toFixed(1)} ({reviews} reviews)
      </span>
    </div>
  );
}

function RelatedProductCard({ product }: { product: Product }) {
  const [added, setAdded] = useState(false);

  function handleAdd() {
    try {
      const stored = localStorage.getItem("freshbasket_cart");
      const cart: Array<Product & { quantity: number }> = stored
        ? JSON.parse(stored)
        : [];
      const idx = cart.findIndex((i) => i.id === product.id);
      if (idx >= 0) {
        cart[idx].quantity += 1;
      } else {
        cart.push({ ...product, quantity: 1 });
      }
      localStorage.setItem("freshbasket_cart", JSON.stringify(cart));
      window.dispatchEvent(new Event("cart_updated"));
    } catch {}
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <motion.div
      variants={scaleIn}
      whileHover={{ y: -4, boxShadow: "0 12px 32px rgba(0,0,0,0.10)" }}
      transition={{ duration: 0.25 }}
      className="flex-shrink-0 w-52 bg-white rounded-2xl border border-black/5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_16px_-4px_rgba(0,0,0,0.08)] overflow-hidden group"
    >
      <div className="relative h-36 bg-[#F1F8E9] overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              "/images/placeholder-product.jpg";
          }}
        />
        {product.badge && (
          <span
            className={`absolute top-2 left-2 text-xs font-bold px-2 py-0.5 rounded-full ${
              BADGE_COLORS[product.badge] ?? "bg-gray-100 text-gray-600"
            }`}
          >
            {product.badge}
          </span>
        )}
      </div>
      <div className="p-3">
        <p className="text-xs text-[#2E7D32] font-semibold mb-0.5">
          {product.category}
        </p>
        <h4 className="text-sm font-bold text-gray-800 leading-snug line-clamp-2 mb-1">
          {product.name}
        </h4>
        <p className="text-xs text-gray-400 mb-2">{product.weight}</p>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-base font-extrabold text-[#1B5E20]">
              ${(product.price ?? 0).toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-gray-400 line-through ml-1">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleAdd}
            className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 ${
              added
                ? "bg-[#2E7D32] text-white"
                : "bg-[#E8F5E9] text-[#2E7D32] hover:bg-[#2E7D32] hover:text-white"
            }`}
            aria-label={`Add ${product.name} to cart`}
          >
            {added ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

export default function ProductDetailPage() {
  const t = useTranslations();

  const product = ALL_PRODUCTS.find((p) => p.id === FEATURED_PRODUCT_ID) ?? ALL_PRODUCTS[0];
  const relatedProducts = ALL_PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  );

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState<"description" | "nutrition" | "delivery">(
    "description"
  );

  const galleryImages = [product.image, ...GALLERY_IMAGES.slice(1)];

  function incrementQty() {
    setQuantity((q) => Math.min(q + 1, 20));
  }
  function decrementQty() {
    setQuantity((q) => Math.max(q - 1, 1));
  }

  function handleAddToCart() {
    try {
      const stored = localStorage.getItem("freshbasket_cart");
      const cart: Array<Product & { quantity: number }> = stored
        ? JSON.parse(stored)
        : [];
      const idx = cart.findIndex((i) => i.id === product.id);
      if (idx >= 0) {
        cart[idx].quantity += quantity;
      } else {
        cart.push({ ...product, quantity });
      }
      localStorage.setItem("freshbasket_cart", JSON.stringify(cart));
      window.dispatchEvent(new Event("cart_updated"));
    } catch {}
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2200);
  }

  const totalPrice = ((product.price ?? 0) * quantity).toFixed(2);
  const savings =
    product.originalPrice
      ? ((product.originalPrice - product.price) * quantity).toFixed(2)
      : null;

  const tabContent: Record<"description" | "nutrition" | "delivery", React.ReactNode> = {
    description: (
      <div className="space-y-3">
        <p className="text-gray-600 leading-relaxed text-sm">{product.description}</p>
        <ul className="space-y-2 mt-4">
          {[
            "Hand-picked at peak ripeness for maximum flavor",
            "No artificial preservatives or additives",
            "Sourced from certified sustainable farms",
            "Delivered within 24 hours of harvest",
          ].map((point) => (
            <li key={point} className="flex items-start gap-2 text-sm text-gray-600">
              <Check className="w-4 h-4 text-[#2E7D32] mt-0.5 flex-shrink-0" />
              {point}
            </li>
          ))}
        </ul>
      </div>
    ),
    nutrition: (
      <div className="space-y-2">
        <p className="text-xs text-gray-400 mb-3">Per 100g serving</p>
        {[
          { label: "Calories", value: "52 kcal" },
          { label: "Carbohydrates", value: "13.8 g" },
          { label: "Sugars", value: "10.4 g" },
          { label: "Dietary Fiber", value: "2.4 g" },
          { label: "Protein", value: "0.3 g" },
          { label: "Fat", value: "0.2 g" },
          { label: "Vitamin C", value: "4.6 mg" },
          { label: "Potassium", value: "107 mg" },
        ].map((row) => (
          <div
            key={row.label}
            className="flex justify-between items-center py-1.5 border-b border-gray-100 text-sm"
          >
            <span className="text-gray-500">{row.label}</span>
            <span className="font-semibold text-gray-800">{row.value}</span>
          </div>
        ))}
      </div>
    ),
    delivery: (
      <div className="space-y-4">
        {[
          {
            icon: <Truck className="w-5 h-5 text-[#2E7D32]" />,
            title: "Same-Day Delivery",
            desc: "Order before 2 PM for delivery by 8 PM today. Available in select zip codes.",
          },
          {
            icon: <RefreshCw className="w-5 h-5 text-[#2E7D32]" />,
            title: "Easy Returns",
            desc: "Not satisfied? We offer a full refund or replacement within 24 hours of delivery.",
          },
          {
            icon: <Shield className="w-5 h-5 text-[#2E7D32]" />,
            title: "Freshness Guarantee",
            desc: "Every product is quality-checked before dispatch. We guarantee freshness or your money back.",
          },
        ].map((item) => (
          <div key={item.title} className="flex gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#E8F5E9] flex items-center justify-center flex-shrink-0">
              {item.icon}
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800">{item.title}</p>
              <p className="text-xs text-gray-500 leading-relaxed mt-0.5">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    ),
  };

  return (
    <main className="min-h-screen bg-[#FAFDF7] pt-20 pb-24">
      {/* Breadcrumb */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4"
      >
        <nav className="flex items-center gap-2 text-sm text-gray-400">
          <Link href="/" className="hover:text-[#2E7D32] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/shop" className="hover:text-[#2E7D32] transition-colors">
            Shop
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/shop" className="hover:text-[#2E7D32] transition-colors">
            {product.category}
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-gray-700 font-medium truncate max-w-[160px]">
            {product.name}
          </span>
        </nav>
      </motion.div>

      {/* Product Split Layout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16">
          {/* LEFT — Image Gallery */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={slideInLeft}
            className="flex flex-col gap-4"
          >
            {/* Main Image */}
            <div className="relative rounded-3xl overflow-hidden bg-[#F1F8E9] aspect-square shadow-[0_2px_8px_rgba(0,0,0,0.06),0_16px_48px_-12px_rgba(0,0,0,0.12)]">
              <motion.img
                key={selectedImage}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                src={galleryImages[selectedImage] ?? product.image}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = product.image;
                }}
              />
              {/* Badge overlay */}
              {product.badge && (
                <span
                  className={`absolute top-4 left-4 text-sm font-bold px-3 py-1 rounded-full shadow-sm ${
                    BADGE_COLORS[product.badge] ?? "bg-gray-100 text-gray-600"
                  }`}
                >
                  {product.badge}
                </span>
              )}
              {/* Wishlist */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setWishlisted((w) => !w)}
                className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all duration-200 ${
                  wishlisted
                    ? "bg-red-500 text-white"
                    : "bg-white/90 text-gray-400 hover:text-red-500"
                }`}
                aria-label="Add to wishlist"
              >
                <Heart className={`w-5 h-5 ${wishlisted ? "fill-white" : ""}`} />
              </motion.button>
              {/* Nav arrows */}
              {galleryImages.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setSelectedImage((i) =>
                        i === 0 ? galleryImages.length - 1 : i - 1
                      )
                    }
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow hover:bg-white transition"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-4 h-4 text-gray-700" />
                  </button>
                  <button
                    onClick={() =>
                      setSelectedImage((i) =>
                        i === galleryImages.length - 1 ? 0 : i + 1
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow hover:bg-white transition"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-4 h-4 text-gray-700" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            <div className="flex gap-3">
              {galleryImages.map((img, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 flex-shrink-0 ${
                    selectedImage === idx
                      ? "border-[#2E7D32] shadow-md"
                      : "border-transparent opacity-60 hover:opacity-90"
                  }`}
                  aria-label={`View image ${idx + 1}`}
                >
                  <img
                    src={img}
                    alt={`${product.name} view ${idx + 1}`}
                    className="w-full h-full object-cover bg-[#F1F8E9]"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = product.image;
                    }}
                  />
                </motion.button>
              ))}
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 mt-2">
              {[
                { icon: <Leaf className="w-4 h-4" />, label: "100% Organic" },
                { icon: <Truck className="w-4 h-4" />, label: "Same-Day Delivery" },
                { icon: <Shield className="w-4 h-4" />, label: "Freshness Guaranteed" },
              ].map((badge) => (
                <div
                  key={badge.label}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-white border border-black/5 shadow-[0_1px_4px_rgba(0,0,0,0.04)] text-center"
                >
                  <span className="text-[#2E7D32]">{badge.icon}</span>
                  <span className="text-xs font-semibold text-gray-600 leading-tight">
                    {badge.label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* RIGHT — Product Info */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={slideInRight}
            className="flex flex-col gap-5"
          >
            {/* Category + Share */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-[#2E7D32] bg-[#E8F5E9] px-3 py-1 rounded-full">
                {product.category}
              </span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-[#2E7D32] transition-colors"
                aria-label="Share product"
              >
                <Share2 className="w-4 h-4" />
                Share
              </motion.button>
            </div>

            {/* Name */}
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1B5E20] leading-tight tracking-tight text-balance">
              {product.name}
            </h1>

            {/* Rating */}
            <StarRating rating={product.rating} reviews={product.reviews} />

            {/* Price block */}
            <div className="flex items-end gap-3 py-4 border-y border-gray-100">
              <span className="text-4xl font-extrabold text-[#1B5E20]">
                ${(product.price ?? 0).toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-xl text-gray-400 line-through mb-0.5">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
              {product.originalPrice && (
                <span className="mb-1 text-sm font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                  Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                </span>
              )}
              <span className="mb-1 text-sm text-gray-400 ml-auto">
                per {product.weight}
              </span>
            </div>

            {/* Freshness badge */}
            <div className="flex items-center gap-2 bg-[#E8F5E9] rounded-xl px-4 py-3">
              <Leaf className="w-5 h-5 text-[#2E7D32] flex-shrink-0" />
              <div>
                <p className="text-sm font-bold text-[#1B5E20]">Farm Fresh Guarantee</p>
                <p className="text-xs text-[#388E3C]">
                  Harvested within the last 48 hours. Delivered chilled to preserve nutrients.
                </p>
              </div>
            </div>

            {/* Quantity selector */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-gray-700">Quantity</span>
              <div className="flex items-center gap-0 rounded-full border border-gray-200 overflow-hidden shadow-sm">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={decrementQty}
                  disabled={quantity <= 1}
                  className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-[#E8F5E9] hover:text-[#2E7D32] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </motion.button>
                <span className="w-12 text-center text-base font-bold text-gray-800 select-none">
                  {quantity}
                </span>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={incrementQty}
                  disabled={quantity >= 20}
                  className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-[#E8F5E9] hover:text-[#2E7D32] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </motion.button>
              </div>
              <span className="text-sm text-gray-400">
                Total:{" "}
                <span className="font-bold text-[#1B5E20]">${totalPrice}</span>
              </span>
            </div>

            {savings && (
              <p className="text-sm text-emerald-600 font-semibold -mt-2">
                You save ${savings} on this order.
              </p>
            )}

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-1">
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: "0 8px 24px rgba(46,125,50,0.25)" }}
                whileTap={{ scale: 0.97 }}
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-full font-bold text-base transition-all duration-300 ${
                  addedToCart
                    ? "bg-emerald-600 text-white"
                    : "bg-[#2E7D32] text-white hover:bg-[#1B5E20]"
                } disabled:opacity-50 disabled:cursor-not-allowed shadow-md`}
              >
                {addedToCart ? (
                  <>
                    <Check className="w-5 h-5" />
                    Added to Cart
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    Add to Cart
                  </>
                )}
              </motion.button>
              <Link href="/cart">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center justify-center gap-2 py-3.5 px-6 rounded-full font-bold text-base border-2 border-[#2E7D32] text-[#2E7D32] hover:bg-[#E8F5E9] transition-all duration-200 cursor-pointer"
                >
                  View Cart
                  <ArrowRight className="w-4 h-4" />
                </motion.div>
              </Link>
            </div>

            {!product.inStock && (
              <p className="text-sm text-red-500 font-medium text-center">
                Currently out of stock. Check back soon.
              </p>
            )}

            {/* Tabs */}
            <div className="mt-2">
              <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
                {(["description", "nutrition", "delivery"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold capitalize transition-all duration-200 ${
                      activeTab === tab
                        ? "bg-white text-[#2E7D32] shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="mt-4 px-1"
              >
                {tabContent[activeTab]}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* You May Also Like */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={staggerContainer}
        >
          <motion.div
            variants={fadeInUp}
            className="flex items-center justify-between mb-6"
          >
            <div>
              <h2 className="text-2xl font-extrabold text-[#1B5E20] tracking-tight">
                You May Also Like
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                More fresh picks from the {product.category} section
              </p>
            </div>
            <Link
              href="/shop"
              className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-[#2E7D32] hover:text-[#1B5E20] transition-colors"
            >
              View all
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide"
            style={{ scrollbarWidth: "none" }}
          >
            {(relatedProducts.length > 0 ? relatedProducts : ALL_PRODUCTS.filter((p) => p.id !== product.id).slice(0, 6)).map(
              (rp) => (
                <RelatedProductCard key={rp.id} product={rp} />
              )
            )}
          </motion.div>

          <div className="mt-4 sm:hidden text-center">
            <Link
              href="/shop"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2E7D32] hover:text-[#1B5E20] transition-colors"
            >
              View all products
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Recently Viewed / Social Proof */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={staggerContainer}
          className="bg-white rounded-3xl border border-black/5 shadow-[0_2px_8px_rgba(0,0,0,0.04),0_16px_48px_-12px_rgba(0,0,0,0.08)] p-8"
        >
          <motion.h2
            variants={fadeInUp}
            className="text-xl font-extrabold text-[#1B5E20] mb-6 tracking-tight"
          >
            What Our Customers Say
          </motion.h2>
          <motion.div
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {[
              {
                name: "Sarah M.",
                avatar: "/images/customer-sarah.jpg",
                rating: 5,
                comment:
                  "These apples are absolutely incredible. Crisp, sweet, and arrived perfectly fresh. Will definitely order again.",
                date: "2 days ago",
              },
              {
                name: "James T.",
                avatar: "/images/customer-james.jpg",
                rating: 5,
                comment:
                  "Best quality fruit I've found online. The packaging keeps everything fresh and the delivery was super fast.",
                date: "1 week ago",
              },
              {
                name: "Priya K.",
                avatar: "/images/customer-priya.jpg",
                rating: 4,
                comment:
                  "Great taste and good value for organic produce. Slightly smaller than expected but flavor is top notch.",
                date: "2 weeks ago",
              },
            ].map((review) => (
              <motion.div
                key={review.name}
                variants={scaleIn}
                className="bg-[#FAFDF7] rounded-2xl p-5 border border-black/5"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-[#E8F5E9] overflow-hidden flex-shrink-0">
                    <img
                      src={review.avatar}
                      alt={review.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800">{review.name}</p>
                    <p className="text-xs text-gray-400">{review.date}</p>
                  </div>
                </div>
                <div className="flex gap-0.5 mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < review.rating
                          ? "fill-[#F9A825] text-[#F9A825]"
                          : "fill-gray-200 text-gray-200"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>
    </main>
  );
}