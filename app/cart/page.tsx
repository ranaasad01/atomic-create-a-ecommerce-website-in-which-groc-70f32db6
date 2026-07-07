"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Trash2, Plus, Minus, ShoppingCart, ArrowRight, Tag, Truck, ChevronRight, Leaf } from 'lucide-react';
import { type CartItem } from "@/lib/data";
import { fadeInUp, fadeIn, staggerContainer, scaleIn } from "@/lib/motion";
import { useTranslations } from "next-intl";

const DELIVERY_THRESHOLD = 50;
const DELIVERY_FEE = 4.99;
const DISCOUNT_CODE = "FRESH10";
const DISCOUNT_RATE = 0.1;

const DEFAULT_CART: CartItem[] = [
  {
    id: "p1",
    name: "Organic Fuji Apples",
    category: "Fruits",
    price: 5.99,
    originalPrice: 7.49,
    weight: "1 kg",
    image: "/images/organic-fuji-apples.jpg",
    badge: "Organic",
    rating: 4.8,
    reviews: 124,
    inStock: true,
    description: "Crisp, sweet Fuji apples sourced from certified organic orchards.",
    quantity: 2,
  },
  {
    id: "p2",
    name: "Baby Spinach",
    category: "Vegetables",
    price: 3.49,
    weight: "200 g",
    image: "https://www.earthboundfarm.com/wp-content/uploads/2024/04/BabySpinach-Half-10oz-Mockup.jpg",
    badge: "Local",
    rating: 4.6,
    reviews: 89,
    inStock: true,
    description: "Tender baby spinach leaves, washed and ready to eat.",
    quantity: 1,
  },
  {
    id: "p3",
    name: "Whole Grain Sourdough",
    category: "Bakery",
    price: 6.49,
    weight: "800 g",
    image: "/images/whole-grain-sourdough-bread.jpg",
    rating: 4.9,
    reviews: 210,
    inStock: true,
    description: "Slow-fermented sourdough with a chewy crumb and crispy crust.",
    quantity: 1,
  },
  {
    id: "p4",
    name: "Fresh Strawberries",
    category: "Fruits",
    price: 4.99,
    originalPrice: 5.99,
    weight: "500 g",
    image: "/images/fresh-strawberries-punnet.jpg",
    badge: "Sale",
    rating: 4.7,
    reviews: 156,
    inStock: true,
    description: "Sun-ripened strawberries bursting with natural sweetness.",
    quantity: 3,
  },
];

const itemExitVariant: Variants = {
  hidden: { opacity: 0, x: -60, scale: 0.92 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    x: 80,
    scale: 0.88,
    transition: { duration: 0.3, ease: "easeIn" },
  },
};

const summaryVariant: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut", delay: 0.15 },
  },
};

export default function CartPage() {
  const t = useTranslations();
  const [items, setItems] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [removingId, setRemovingId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("freshbasket_cart");
      if (stored) {
        const parsed = JSON.parse(stored) as CartItem[];
        setItems(parsed.length > 0 ? parsed : DEFAULT_CART);
      } else {
        setItems(DEFAULT_CART);
      }
    } catch {
      setItems(DEFAULT_CART);
    }
    setMounted(true);
  }, []);

  function persistCart(next: CartItem[]) {
    setItems(next);
    try {
      localStorage.setItem("freshbasket_cart", JSON.stringify(next));
      window.dispatchEvent(new Event("cart_updated"));
    } catch {
      // ignore
    }
  }

  function updateQty(id: string, delta: number) {
    const next = items
      .map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
      .filter((item) => item.quantity > 0);
    persistCart(next);
  }

  function removeItem(id: string) {
    setRemovingId(id);
    setTimeout(() => {
      const next = items.filter((item) => item.id !== id);
      persistCart(next);
      setRemovingId(null);
    }, 320);
  }

  function applyCoupon() {
    if (coupon.trim().toUpperCase() === DISCOUNT_CODE) {
      setCouponApplied(true);
      setCouponError("");
    } else {
      setCouponApplied(false);
      setCouponError("Invalid coupon code. Try FRESH10.");
    }
  }

  const subtotal = (items ?? []).reduce(
    (sum, item) => sum + (item.price ?? 0) * (item.quantity ?? 1),
    0
  );
  const discount = couponApplied ? subtotal * DISCOUNT_RATE : 0;
  const delivery = subtotal >= DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  const total = subtotal - discount + delivery;
  const itemCount = (items ?? []).reduce((s, i) => s + (i.quantity ?? 1), 0);

  if (!mounted) {
    return (
      <main className="min-h-screen bg-[#F9FBF7] pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-96 flex items-center justify-center">
            <div className="w-10 h-10 rounded-full border-4 border-[#2E7D32] border-t-transparent animate-spin" />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F9FBF7] pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <motion.nav
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="flex items-center gap-1.5 text-sm text-gray-400 mb-8"
          aria-label="Breadcrumb"
        >
          <Link href="/" className="hover:text-[#2E7D32] transition-colors">
            {t("nav.home") || "Home"}
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/shop" className="hover:text-[#2E7D32] transition-colors">
            {t("nav.shop") || "Shop"}
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#2E7D32] font-medium">
            {t("cart.title") || "Cart"}
          </span>
        </motion.nav>

        {/* Page heading */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="mb-10"
        >
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#1B5E20] tracking-tight text-balance">
            {t("cart.heading") || "Your Cart"}
            {itemCount > 0 && (
              <span className="ml-3 text-lg font-semibold text-gray-400">
                ({itemCount} {itemCount === 1 ? "item" : "items"})
              </span>
            )}
          </h1>
          <p className="mt-2 text-gray-500 text-sm leading-relaxed">
            {t("cart.subheading") ||
              "Review your selections before checkout. Free delivery on orders over $50."}
          </p>
        </motion.div>

        {items.length === 0 ? (
          /* Empty state */
          <motion.div
            initial="hidden"
            animate="visible"
            variants={scaleIn}
            className="flex flex-col items-center justify-center py-28 text-center"
          >
            <div className="w-24 h-24 rounded-full bg-[#E8F5E9] flex items-center justify-center mb-6 shadow-inner">
              <ShoppingCart className="w-10 h-10 text-[#2E7D32]" />
            </div>
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-2">
              {t("cart.empty.title") || "Your cart is empty"}
            </h2>
            <p className="text-gray-500 max-w-sm mb-8 leading-relaxed">
              {t("cart.empty.description") ||
                "Looks like you haven't added anything yet. Head to the shop to discover fresh picks."}
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#2E7D32] text-white font-bold text-sm hover:bg-[#1B5E20] transition-all duration-200 shadow-md hover:shadow-lg"
            >
              {t("cart.empty.cta") || "Browse the Shop"}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* LEFT — Cart items */}
            <div className="lg:col-span-2 space-y-4">
              {/* Free delivery progress */}
              {subtotal < DELIVERY_THRESHOLD && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={fadeInUp}
                  className="bg-[#E8F5E9] border border-[#A5D6A7] rounded-2xl px-5 py-4 flex items-center gap-3"
                >
                  <Truck className="w-5 h-5 text-[#2E7D32] shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-[#1B5E20]">
                      {t("cart.delivery.progress") ||
                        `Add $${(DELIVERY_THRESHOLD - subtotal).toFixed(2)} more for free delivery`}
                    </p>
                    <div className="mt-2 h-1.5 rounded-full bg-[#C8E6C9] overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: `${Math.min((subtotal / DELIVERY_THRESHOLD) * 100, 100)}%`,
                        }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="h-full rounded-full bg-[#2E7D32]"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {subtotal >= DELIVERY_THRESHOLD && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={fadeInUp}
                  className="bg-[#E8F5E9] border border-[#A5D6A7] rounded-2xl px-5 py-3 flex items-center gap-3"
                >
                  <Truck className="w-5 h-5 text-[#2E7D32] shrink-0" />
                  <p className="text-sm font-semibold text-[#1B5E20]">
                    {t("cart.delivery.free") || "You qualify for free delivery."}
                  </p>
                </motion.div>
              )}

              {/* Items list */}
              <motion.ul
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
                className="space-y-3"
                role="list"
              >
                <AnimatePresence mode="popLayout">
                  {items.map((item) => (
                    <motion.li
                      key={item.id}
                      variants={itemExitVariant}
                      initial="hidden"
                      animate={removingId === item.id ? "exit" : "visible"}
                      exit="exit"
                      layout
                      className="bg-white rounded-2xl border border-black/5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_6px_20px_-6px_rgba(0,0,0,0.08)] overflow-hidden"
                    >
                      <div className="flex items-start gap-4 p-4 sm:p-5">
                        {/* Product image */}
                        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden shrink-0 bg-[#F1F8E9]">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src =
                                "/images/fresh-grocery-placeholder.jpg";
                            }}
                          />
                          {item.badge && (
                            <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md bg-[#2E7D32] text-white text-[10px] font-bold leading-none">
                              {item.badge}
                            </span>
                          )}
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <span className="text-[10px] font-semibold uppercase tracking-widest text-[#2E7D32] bg-[#E8F5E9] px-2 py-0.5 rounded-full">
                                {item.category}
                              </span>
                              <h3 className="mt-1.5 text-base font-bold text-gray-800 leading-snug">
                                {item.name}
                              </h3>
                              <p className="text-xs text-gray-400 mt-0.5">
                                {item.weight}
                              </p>
                            </div>
                            {/* Remove */}
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => removeItem(item.id)}
                              aria-label={`Remove ${item.name}`}
                              className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all duration-200 shrink-0"
                            >
                              <Trash2 className="w-4 h-4" />
                            </motion.button>
                          </div>

                          {/* Price + Qty */}
                          <div className="mt-3 flex items-center justify-between gap-3 flex-wrap">
                            <div className="flex items-baseline gap-2">
                              <span className="text-lg font-extrabold text-[#1B5E20]">
                                ${(item.price * item.quantity).toFixed(2)}
                              </span>
                              {item.originalPrice && (
                                <span className="text-xs text-gray-400 line-through">
                                  $
                                  {(
                                    item.originalPrice * item.quantity
                                  ).toFixed(2)}
                                </span>
                              )}
                              <span className="text-xs text-gray-400">
                                (${item.price.toFixed(2)} each)
                              </span>
                            </div>

                            {/* Quantity stepper */}
                            <div className="flex items-center gap-1 bg-[#F1F8E9] rounded-full p-1">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => updateQty(item.id, -1)}
                                aria-label="Decrease quantity"
                                className="w-7 h-7 rounded-full bg-white shadow-sm flex items-center justify-center text-[#2E7D32] hover:bg-[#E8F5E9] transition-colors"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </motion.button>
                              <span className="w-8 text-center text-sm font-bold text-gray-700">
                                {item.quantity}
                              </span>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => updateQty(item.id, 1)}
                                aria-label="Increase quantity"
                                className="w-7 h-7 rounded-full bg-[#2E7D32] shadow-sm flex items-center justify-center text-white hover:bg-[#1B5E20] transition-colors"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </motion.button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </motion.ul>

              {/* Continue shopping */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                className="pt-2"
              >
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#2E7D32] hover:text-[#1B5E20] transition-colors group"
                >
                  <span className="group-hover:-translate-x-1 transition-transform duration-200">
                    ←
                  </span>
                  {t("cart.continue") || "Continue Shopping"}
                </Link>
              </motion.div>
            </div>

            {/* RIGHT — Order summary */}
            <motion.aside
              initial="hidden"
              animate="visible"
              variants={summaryVariant}
              className="lg:col-span-1 sticky top-24"
            >
              <div className="bg-white rounded-2xl border border-black/5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.12)] overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#2E7D32] to-[#388E3C] px-6 py-5">
                  <h2 className="text-lg font-extrabold text-white tracking-tight">
                    {t("cart.summary.title") || "Order Summary"}
                  </h2>
                  <p className="text-green-200 text-xs mt-0.5">
                    {t("cart.summary.subtitle") || "Prices include applicable taxes"}
                  </p>
                </div>

                <div className="px-6 py-5 space-y-4">
                  {/* Line items */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>
                        {t("cart.summary.subtotal") || "Subtotal"} ({itemCount}{" "}
                        {itemCount === 1 ? "item" : "items"})
                      </span>
                      <span className="font-semibold text-gray-800">
                        ${subtotal.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm text-gray-600">
                      <span className="flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5 text-[#2E7D32]" />
                        {t("cart.summary.delivery") || "Delivery"}
                      </span>
                      <span
                        className={
                          delivery === 0
                            ? "font-semibold text-[#2E7D32]"
                            : "font-semibold text-gray-800"
                        }
                      >
                        {delivery === 0 ? "Free" : `$${delivery.toFixed(2)}`}
                      </span>
                    </div>

                    {couponApplied && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-between text-sm"
                      >
                        <span className="flex items-center gap-1.5 text-[#2E7D32]">
                          <Tag className="w-3.5 h-3.5" />
                          {t("cart.summary.discount") || "Discount (FRESH10)"}
                        </span>
                        <span className="font-semibold text-[#2E7D32]">
                          -${discount.toFixed(2)}
                        </span>
                      </motion.div>
                    )}
                  </div>

                  <div className="border-t border-dashed border-gray-100 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-base font-extrabold text-gray-800">
                        {t("cart.summary.total") || "Total"}
                      </span>
                      <span className="text-xl font-extrabold text-[#1B5E20]">
                        ${total.toFixed(2)}
                      </span>
                    </div>
                    {couponApplied && (
                      <p className="text-xs text-[#2E7D32] mt-1 text-right font-medium">
                        {t("cart.summary.saved") || `You saved $${discount.toFixed(2)}!`}
                      </p>
                    )}
                  </div>

                  {/* Coupon */}
                  <div className="pt-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                      {t("cart.coupon.label") || "Promo Code"}
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={coupon}
                        onChange={(e) => {
                          setCoupon(e.target.value);
                          setCouponError("");
                        }}
                        placeholder={t("cart.coupon.placeholder") || "e.g. FRESH10"}
                        className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/30 focus:border-[#2E7D32] transition"
                      />
                      <motion.button
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={applyCoupon}
                        className="px-4 py-2 rounded-xl bg-[#E8F5E9] text-[#2E7D32] font-bold text-sm hover:bg-[#C8E6C9] transition-colors"
                      >
                        {t("cart.coupon.apply") || "Apply"}
                      </motion.button>
                    </div>
                    {couponError && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-xs text-red-500 mt-1.5"
                      >
                        {couponError}
                      </motion.p>
                    )}
                    {couponApplied && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-xs text-[#2E7D32] font-semibold mt-1.5"
                      >
                        {t("cart.coupon.success") || "Coupon applied. 10% off your order."}
                      </motion.p>
                    )}
                  </div>

                  {/* CTA */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="pt-1"
                  >
                    <Link
                      href="/checkout"
                      className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-[#2E7D32] text-white font-extrabold text-sm hover:bg-[#1B5E20] transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                      {t("cart.cta") || "Proceed to Checkout"}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </motion.div>

                  {/* Trust badges */}
                  <div className="pt-2 border-t border-gray-50">
                    <div className="grid grid-cols-3 gap-2 text-center">
                      {[
                        { icon: "🔒", label: t("cart.trust.secure") || "Secure" },
                        { icon: "↩️", label: t("cart.trust.returns") || "Easy Returns" },
                        { icon: "🌿", label: t("cart.trust.fresh") || "100% Fresh" },
                      ].map((badge) => (
                        <div key={badge.label} className="flex flex-col items-center gap-1">
                          <span className="text-lg">{badge.icon}</span>
                          <span className="text-[10px] font-semibold text-gray-400 leading-tight">
                            {badge.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Freshness guarantee */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                className="mt-4 bg-[#E8F5E9] border border-[#A5D6A7] rounded-2xl px-5 py-4 flex items-start gap-3"
              >
                <Leaf className="w-5 h-5 text-[#2E7D32] shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-[#1B5E20]">
                    {t("cart.guarantee.title") || "Freshness Guarantee"}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                    {t("cart.guarantee.description") ||
                      "Not happy with your produce? We'll replace it or refund you, no questions asked."}
                  </p>
                </div>
              </motion.div>
            </motion.aside>
          </div>
        )}
      </div>
    </main>
  );
}