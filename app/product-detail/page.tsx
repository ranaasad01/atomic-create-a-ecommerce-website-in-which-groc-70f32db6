"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { Star, ShoppingCart, Heart, Share2, ChevronRight, Minus, Plus, Truck, Shield, RotateCcw, Leaf, Check, ArrowLeft } from 'lucide-react';
import { useTranslations } from "next-intl";
import { fadeInUp, fadeIn, staggerContainer, scaleIn, slideInLeft, slideInRight } from "@/lib/motion";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const product = {
  id: "p-001",
  name: "Organic Fuji Apples",
  category: "Fruits",
  price: 4.99,
  originalPrice: 6.49,
  weight: "1 kg bag",
  image: "/images/organic-fuji-apples-fresh.jpg",
  badge: "Organic",
  rating: 4.8,
  reviews: 214,
  inStock: true,
  description:
    "Crisp, sweet, and perfectly balanced, our Organic Fuji Apples are hand-picked from certified organic orchards in Washington State. Each apple is carefully selected for size, color, and flavor to ensure you get the very best. Rich in fiber, vitamin C, and antioxidants, these apples make a perfect snack, addition to salads, or ingredient in your favorite baked goods.",
  highlights: [
    "Certified USDA Organic",
    "Hand-picked at peak ripeness",
    "No pesticides or synthetic fertilizers",
    "Rich in fiber and vitamin C",
    "Sourced from Washington State orchards",
  ],
  nutritionPer100g: [
    { label: "Calories", value: "52 kcal" },
    { label: "Carbohydrates", value: "13.8 g" },
    { label: "Fiber", value: "2.4 g" },
    { label: "Sugars", value: "10.4 g" },
    { label: "Protein", value: "0.3 g" },
    { label: "Fat", value: "0.2 g" },
    { label: "Vitamin C", value: "4.6 mg" },
    { label: "Potassium", value: "107 mg" },
  ],
  images: [
    "/images/organic-fuji-apples-fresh.jpg",
    "/images/fuji-apple-close-up.jpg",
    "/images/apple-orchard-harvest.jpg",
    "/images/sliced-fuji-apple.jpg",
  ],
};

const reviews = [
  {
    id: "r1",
    name: "Sarah M.",
    rating: 5,
    date: "March 12, 2025",
    comment:
      "These apples are absolutely incredible. So crisp and sweet, nothing like what you find at a regular grocery store. Will definitely be ordering again.",
    verified: true,
  },
  {
    id: "r2",
    name: "James T.",
    rating: 5,
    date: "March 8, 2025",
    comment:
      "Arrived fresh and well-packaged. My kids love them for school snacks. The organic certification gives me peace of mind.",
    verified: true,
  },
  {
    id: "r3",
    name: "Priya K.",
    rating: 4,
    date: "February 28, 2025",
    comment:
      "Great quality apples. A couple were slightly smaller than expected but the flavor was excellent. Delivery was fast too.",
    verified: true,
  },
  {
    id: "r4",
    name: "Carlos R.",
    rating: 5,
    date: "February 20, 2025",
    comment:
      "Best apples I have ever ordered online. Fresh Basket never disappoints. The packaging keeps them perfectly fresh.",
    verified: false,
  },
];

const relatedProducts = [
  {
    id: "rp1",
    name: "Organic Gala Apples",
    price: 4.49,
    originalPrice: 5.99,
    weight: "1 kg bag",
    image: "/images/organic-gala-apples.jpg",
    rating: 4.7,
    badge: "Organic",
  },
  {
    id: "rp2",
    name: "Bartlett Pears",
    price: 3.99,
    originalPrice: undefined,
    weight: "750 g",
    image: "/images/fresh-bartlett-pears.jpg",
    rating: 4.5,
    badge: undefined,
  },
  {
    id: "rp3",
    name: "Navel Oranges",
    price: 5.49,
    originalPrice: 6.99,
    weight: "1.2 kg bag",
    image: "/images/navel-oranges-fresh.jpg",
    rating: 4.9,
    badge: "Best Seller",
  },
  {
    id: "rp4",
    name: "Red Seedless Grapes",
    price: 6.29,
    originalPrice: undefined,
    weight: "500 g",
    image: "/images/red-seedless-grapes.jpg",
    rating: 4.6,
    badge: "New",
  },
];

const ratingBreakdown = [
  { stars: 5, count: 148 },
  { stars: 4, count: 42 },
  { stars: 3, count: 16 },
  { stars: 2, count: 5 },
  { stars: 1, count: 3 },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function StarRating({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={size}
          className={
            s <= Math.round(rating)
              ? "fill-[#F9A825] text-[#F9A825]"
              : "fill-gray-200 text-gray-200"
          }
        />
      ))}
    </span>
  );
}

function RatingBar({ stars, count, total }: { stars: number; count: number; total: number }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="w-6 text-right text-gray-600 font-medium">{stars}</span>
      <Star size={12} className="fill-[#F9A825] text-[#F9A825] shrink-0" />
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 * (5 - stars) }}
          className="h-full bg-[#F9A825] rounded-full"
        />
      </div>
      <span className="w-8 text-gray-500 text-xs">{count}</span>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProductDetailPage() {
  const t = useTranslations();

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [activeTab, setActiveTab] = useState<"description" | "nutrition" | "reviews">("description");

  const totalReviews = ratingBreakdown.reduce((s, r) => s + r.count, 0);
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  function handleQuantityChange(delta: number) {
    setQuantity((prev) => Math.max(1, Math.min(99, prev + delta)));
  }

  function handleAddToCart() {
    try {
      const stored = localStorage.getItem("freshbasket_cart");
      const cart: Array<{ id: string; quantity: number; [key: string]: unknown }> = stored
        ? JSON.parse(stored)
        : [];
      const existing = cart.find((i) => i.id === product.id);
      if (existing) {
        existing.quantity += quantity;
      } else {
        cart.push({ ...product, quantity });
      }
      localStorage.setItem("freshbasket_cart", JSON.stringify(cart));
      window.dispatchEvent(new Event("cart_updated"));
    } catch {
      // silent
    }
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2200);
  }

  return (
    <main className="min-h-screen bg-[#FAFAF8] pt-20 pb-24">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <motion.nav
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="flex items-center gap-1.5 text-sm text-gray-500"
          aria-label="Breadcrumb"
        >
          <Link href="/" className="hover:text-[#2E7D32] transition-colors">
            {t("nav.home") || "Home"}
          </Link>
          <ChevronRight size={14} />
          <Link href="/shop" className="hover:text-[#2E7D32] transition-colors">
            {t("nav.shop") || "Shop"}
          </Link>
          <ChevronRight size={14} />
          <span className="text-[#2E7D32] font-medium truncate max-w-[180px]">
            {product.name}
          </span>
        </motion.nav>
      </div>

      {/* Back link */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <Link
          href="/shop"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#2E7D32] transition-colors group"
        >
          <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
          {t("productDetail.back") || "Back to Shop"}
        </Link>
      </div>

      {/* Product Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20">
          {/* Image Gallery */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={slideInLeft}
            className="flex flex-col gap-4"
          >
            {/* Main image */}
            <div className="relative rounded-2xl overflow-hidden bg-white border border-black/5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.10)] aspect-square">
              <motion.img
                key={selectedImage}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                src={product.images[selectedImage] ?? product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.badge && (
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#2E7D32] text-white text-xs font-bold shadow">
                  {product.badge}
                </span>
              )}
              {discount > 0 && (
                <span className="absolute top-4 right-4 px-3 py-1 rounded-full bg-[#F9A825] text-white text-xs font-bold shadow">
                  -{discount}%
                </span>
              )}
              {/* Wishlist */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setWishlisted((w) => !w)}
                className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center border border-black/5 transition-colors"
                aria-label="Toggle wishlist"
              >
                <Heart
                  size={18}
                  className={wishlisted ? "fill-red-500 text-red-500" : "text-gray-400"}
                />
              </motion.button>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-3">
              {product.images.map((img, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                    selectedImage === idx
                      ? "border-[#2E7D32] shadow-md"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                  aria-label={`View image ${idx + 1}`}
                >
                  <img
                    src={img}
                    alt={`${product.name} view ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={slideInRight}
            className="flex flex-col gap-6"
          >
            {/* Category + Share */}
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F5E9] text-[#2E7D32] text-xs font-semibold">
                <Leaf size={12} />
                {product.category}
              </span>
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                className="w-9 h-9 rounded-full border border-black/8 flex items-center justify-center text-gray-400 hover:text-[#2E7D32] hover:border-[#2E7D32] transition-colors"
                aria-label="Share product"
              >
                <Share2 size={15} />
              </motion.button>
            </div>

            {/* Name */}
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight text-balance leading-tight">
              {product.name}
            </h1>

            {/* Rating row */}
            <div className="flex items-center gap-3 flex-wrap">
              <StarRating rating={product.rating} size={18} />
              <span className="text-sm font-semibold text-gray-800">{product.rating}</span>
              <span className="text-sm text-gray-400">
                ({product.reviews} {t("productDetail.reviews") || "reviews"})
              </span>
              <span className="text-sm text-[#2E7D32] font-medium">
                {product.inStock
                  ? t("productDetail.inStock") || "In Stock"
                  : t("productDetail.outOfStock") || "Out of Stock"}
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-extrabold text-[#1B5E20]">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-xl text-gray-400 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
              {discount > 0 && (
                <span className="px-2 py-0.5 rounded-md bg-[#FFF8E1] text-[#F57F17] text-sm font-bold">
                  Save {discount}%
                </span>
              )}
            </div>

            <p className="text-sm text-gray-500">{product.weight}</p>

            {/* Short description */}
            <p className="text-gray-600 leading-relaxed text-pretty">
              {product.description.slice(0, 160)}...
            </p>

            {/* Highlights */}
            <ul className="space-y-2">
              {product.highlights.map((h) => (
                <li key={h} className="flex items-start gap-2 text-sm text-gray-700">
                  <Check size={15} className="text-[#2E7D32] mt-0.5 shrink-0" />
                  {h}
                </li>
              ))}
            </ul>

            {/* Quantity + Add to Cart */}
            <div className="flex items-center gap-4 flex-wrap">
              {/* Quantity selector */}
              <div className="flex items-center gap-0 rounded-full border border-black/10 overflow-hidden shadow-sm">
                <motion.button
                  whileTap={{ scale: 0.88 }}
                  onClick={() => handleQuantityChange(-1)}
                  className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus size={15} />
                </motion.button>
                <span className="w-10 text-center text-sm font-bold text-gray-900">
                  {quantity}
                </span>
                <motion.button
                  whileTap={{ scale: 0.88 }}
                  onClick={() => handleQuantityChange(1)}
                  className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus size={15} />
                </motion.button>
              </div>

              {/* Add to cart */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`flex-1 min-w-[180px] flex items-center justify-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-all duration-300 shadow-md ${
                  addedToCart
                    ? "bg-[#1B5E20] text-white"
                    : "bg-[#2E7D32] text-white hover:bg-[#1B5E20] hover:shadow-lg"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {addedToCart ? (
                  <>
                    <Check size={16} />
                    {t("productDetail.added") || "Added to Cart!"}
                  </>
                ) : (
                  <>
                    <ShoppingCart size={16} />
                    {t("productDetail.addToCart") || "Add to Cart"}
                  </>
                )}
              </motion.button>

              {/* Wishlist button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => setWishlisted((w) => !w)}
                className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-200 ${
                  wishlisted
                    ? "border-red-300 bg-red-50 text-red-500"
                    : "border-black/10 text-gray-400 hover:border-red-300 hover:text-red-400"
                }`}
                aria-label="Toggle wishlist"
              >
                <Heart size={18} className={wishlisted ? "fill-red-500" : ""} />
              </motion.button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              {[
                { icon: Truck, label: t("productDetail.freeDelivery") || "Free Delivery", sub: "Orders over $35" },
                { icon: Shield, label: t("productDetail.freshGuarantee") || "Fresh Guarantee", sub: "100% satisfaction" },
                { icon: RotateCcw, label: t("productDetail.easyReturns") || "Easy Returns", sub: "Within 24 hours" },
              ].map(({ icon: Icon, label, sub }) => (
                <div
                  key={label}
                  className="flex flex-col items-center text-center gap-1.5 p-3 rounded-xl bg-white border border-black/5 shadow-sm"
                >
                  <div className="w-8 h-8 rounded-full bg-[#E8F5E9] flex items-center justify-center">
                    <Icon size={15} className="text-[#2E7D32]" />
                  </div>
                  <span className="text-xs font-semibold text-gray-800 leading-tight">{label}</span>
                  <span className="text-[10px] text-gray-400">{sub}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tabs: Description / Nutrition / Reviews */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeInUp}
        >
          {/* Tab bar */}
          <div className="flex gap-1 border-b border-gray-200 mb-8">
            {(["description", "nutrition", "reviews"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-3 text-sm font-semibold capitalize transition-all duration-200 border-b-2 -mb-px ${
                  activeTab === tab
                    ? "border-[#2E7D32] text-[#2E7D32]"
                    : "border-transparent text-gray-500 hover:text-gray-800"
                }`}
              >
                {tab === "reviews"
                  ? `${t("productDetail.tab.reviews") || "Reviews"} (${totalReviews})`
                  : t(`productDetail.tab.${tab}`) || tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Description tab */}
          {activeTab === "description" && (
            <motion.div
              key="description"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="max-w-3xl space-y-4"
            >
              <p className="text-gray-700 leading-relaxed text-pretty">{product.description}</p>
              <h3 className="text-lg font-bold text-gray-900 mt-6">
                {t("productDetail.whyChoose") || "Why Choose Our Apples?"}
              </h3>
              <ul className="space-y-3">
                {product.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-3 text-gray-700">
                    <span className="mt-1 w-5 h-5 rounded-full bg-[#E8F5E9] flex items-center justify-center shrink-0">
                      <Check size={11} className="text-[#2E7D32]" />
                    </span>
                    {h}
                  </li>
                ))}
              </ul>
              <div className="mt-6 p-5 rounded-2xl bg-[#F1F8E9] border border-[#C8E6C9]">
                <p className="text-sm text-[#2E7D32] font-semibold mb-1">
                  {t("productDetail.storageTitle") || "Storage Tips"}
                </p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Store apples in the refrigerator crisper drawer to keep them fresh for up to 4 weeks. Keep them away from strong-smelling foods as apples can absorb odors. For best flavor, bring to room temperature 30 minutes before eating.
                </p>
              </div>
            </motion.div>
          )}

          {/* Nutrition tab */}
          {activeTab === "nutrition" && (
            <motion.div
              key="nutrition"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="max-w-lg"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                {t("productDetail.nutritionTitle") || "Nutrition Facts"}
              </h3>
              <p className="text-sm text-gray-500 mb-5">
                {t("productDetail.nutritionSub") || "Per 100g serving"}
              </p>
              <div className="rounded-2xl overflow-hidden border border-black/8 shadow-sm">
                {product.nutritionPer100g.map((row, i) => (
                  <div
                    key={row.label}
                    className={`flex items-center justify-between px-5 py-3 text-sm ${
                      i % 2 === 0 ? "bg-white" : "bg-[#FAFAF8]"
                    }`}
                  >
                    <span className="text-gray-600">{row.label}</span>
                    <span className="font-semibold text-gray-900">{row.value}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-3">
                * Percent daily values are based on a 2,000 calorie diet.
              </p>
            </motion.div>
          )}

          {/* Reviews tab */}
          {activeTab === "reviews" && (
            <motion.div
              key="reviews"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-10"
            >
              {/* Summary */}
              <div className="lg:col-span-1">
                <div className="p-6 rounded-2xl bg-white border border-black/5 shadow-sm text-center">
                  <p className="text-6xl font-extrabold text-[#1B5E20]">{product.rating}</p>
                  <StarRating rating={product.rating} size={20} />
                  <p className="text-sm text-gray-500 mt-2">
                    {t("productDetail.basedOn") || "Based on"} {totalReviews}{" "}
                    {t("productDetail.reviews") || "reviews"}
                  </p>
                  <div className="mt-5 space-y-2">
                    {ratingBreakdown.map((rb) => (
                      <RatingBar
                        key={rb.stars}
                        stars={rb.stars}
                        count={rb.count}
                        total={totalReviews}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Review list */}
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="lg:col-span-2 space-y-4"
              >
                {reviews.map((review) => (
                  <motion.div
                    key={review.id}
                    variants={fadeInUp}
                    className="p-5 rounded-2xl bg-white border border-black/5 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-900 text-sm">{review.name}</span>
                          {review.verified && (
                            <span className="flex items-center gap-1 text-[10px] text-[#2E7D32] font-semibold bg-[#E8F5E9] px-2 py-0.5 rounded-full">
                              <Check size={9} />
                              {t("productDetail.verified") || "Verified"}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5">{review.date}</p>
                      </div>
                      <StarRating rating={review.rating} size={14} />
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      </section>

      {/* Related Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer}
        >
          <motion.h2
            variants={fadeInUp}
            className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mb-8"
          >
            {t("productDetail.youMayAlsoLike") || "You May Also Like"}
          </motion.h2>

          <motion.div
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6"
          >
            {relatedProducts.map((rp) => (
              <motion.div
                key={rp.id}
                variants={scaleIn}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="group bg-white rounded-2xl border border-black/5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.08)] overflow-hidden cursor-pointer"
              >
                <Link href="/shop" className="block">
                  <div className="relative aspect-square overflow-hidden bg-gray-50">
                    <img
                      src={rp.image}
                      alt={rp.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {rp.badge && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-[#2E7D32] text-white text-[10px] font-bold">
                        {rp.badge}
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-sm font-bold text-gray-900 leading-tight mb-1 line-clamp-2">
                      {rp.name}
                    </p>
                    <p className="text-xs text-gray-400 mb-2">{rp.weight}</p>
                    <div className="flex items-center gap-1 mb-3">
                      <StarRating rating={rp.rating} size={11} />
                      <span className="text-xs text-gray-500">{rp.rating}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-base font-extrabold text-[#1B5E20]">
                          ${rp.price.toFixed(2)}
                        </span>
                        {rp.originalPrice && (
                          <span className="text-xs text-gray-400 line-through">
                            ${rp.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                      <motion.span
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-8 h-8 rounded-full bg-[#E8F5E9] flex items-center justify-center text-[#2E7D32]"
                      >
                        <Plus size={14} />
                      </motion.span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>
    </main>
  );
}