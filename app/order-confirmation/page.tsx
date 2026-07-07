"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { CheckCircle, Package, MapPin, Clock, ArrowRight, ShoppingBag, Truck, Star } from 'lucide-react';
import { fadeInUp, fadeIn, staggerContainer, scaleIn } from "@/lib/motion";
import { useTranslations } from "next-intl";

const ORDER_NUMBER = "FB-20847";
const ESTIMATED_DELIVERY = "Today, 3:00 PM – 5:00 PM";

const orderedItems = [
  { id: "1", name: "Organic Strawberries", qty: 2, price: 4.99, image: "https://modernfarmer.com/wp-content/uploads/2018/07/how-to-grow-strawberries.jpg" },
  { id: "2", name: "Baby Spinach", qty: 1, price: 3.49, image: "https://modernfarmer.com/wp-content/uploads/2018/07/how-to-grow-strawberries.jpg" },
  { id: "3", name: "Whole Milk (1 gal)", qty: 1, price: 5.29, image: "https://modernfarmer.com/wp-content/uploads/2018/07/how-to-grow-strawberries.jpg" },
  { id: "4", name: "Sourdough Bread", qty: 1, price: 6.99, image: "https://i5.walmartimages.com/seo/Great-Value-Whole-Vitamin-D-Milk-Gallon-Plastic-Jug-128-Fl-Oz_6a7b09b4-f51d-4bea-a01c-85767f1b481a.86876244397d83ce6cdedb030abe6e4a.jpeg" },
];

const subtotal = orderedItems.reduce((s, i) => s + i.price * i.qty, 0);
const deliveryFee = 2.99;
const discount = 3.0;
const total = subtotal + deliveryFee - discount;

const steps = [
  { label: "Order Placed", icon: ShoppingBag, done: true },
  { label: "Being Packed", icon: Package, done: true },
  { label: "Out for Delivery", icon: Truck, done: false },
  { label: "Delivered", icon: Star, done: false },
];

const checkmarkVariants: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 0.7, ease: "easeOut", delay: 0.3 },
  },
};

const circleVariants: Variants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const pulseRing: Variants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: [1, 1.18, 1],
    opacity: [0.6, 0, 0],
    transition: { duration: 1.6, ease: "easeOut", delay: 0.6, repeat: 2 },
  },
};

export default function OrderConfirmationPage() {
  const t = useTranslations();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Clear cart on confirmation
    try {
      localStorage.removeItem("freshbasket_cart");
      window.dispatchEvent(new Event("cart_updated"));
    } catch {
      // ignore
    }
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#F1F8E9] via-white to-white pt-24 pb-20">
      {/* Full-bleed success banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#2E7D32] via-[#388E3C] to-[#1B5E20] py-20 px-4 text-white text-center">
        {/* Decorative blobs */}
        <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-white/5 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-[#F9A825]/10 blur-3xl pointer-events-none" />

        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="relative z-10 max-w-xl mx-auto"
        >
          {/* Animated checkmark */}
          <motion.div
            variants={scaleIn}
            className="relative inline-flex items-center justify-center mb-6"
          >
            {/* Pulse ring */}
            <motion.div
              variants={pulseRing}
              className="absolute w-28 h-28 rounded-full border-4 border-[#A5D6A7]"
            />
            <motion.div
              variants={circleVariants}
              className="w-24 h-24 rounded-full bg-white/15 border-2 border-white/30 flex items-center justify-center shadow-[0_0_40px_rgba(255,255,255,0.15)]"
            >
              <svg
                viewBox="0 0 52 52"
                className="w-12 h-12"
                fill="none"
                stroke="white"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <motion.path
                  d="M14 27 L22 35 L38 18"
                  variants={checkmarkVariants}
                />
              </svg>
            </motion.div>
          </motion.div>

          <motion.p
            variants={fadeInUp}
            className="text-sm font-semibold uppercase tracking-widest text-green-200 mb-2"
          >
            {mounted ? t("orderConfirmation.badge") || "Order Confirmed" : "Order Confirmed"}
          </motion.p>
          <motion.h1
            variants={fadeInUp}
            className="text-4xl md:text-5xl font-extrabold tracking-tight text-balance mb-3"
          >
            {mounted ? t("orderConfirmation.heading") || "Your order is on its way!" : "Your order is on its way!"}
          </motion.h1>
          <motion.p
            variants={fadeInUp}
            className="text-green-100 text-lg leading-relaxed text-pretty"
          >
            {mounted
              ? t("orderConfirmation.subheading") ||
                "We've received your order and our team is already packing your fresh groceries."
              : "We've received your order and our team is already packing your fresh groceries."}
          </motion.p>

          {/* Order number pill */}
          <motion.div
            variants={fadeInUp}
            className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-full bg-white/15 border border-white/25 text-sm font-bold backdrop-blur-sm"
          >
            <Package className="w-4 h-4 text-[#F9A825]" />
            <span>Order {ORDER_NUMBER}</span>
          </motion.div>
        </motion.div>
      </section>

      {/* Estimated delivery banner */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-40px" }}
        variants={fadeIn}
        className="bg-[#F9A825] text-white"
      >
        <div className="max-w-4xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-center gap-3 text-center sm:text-left">
          <Clock className="w-5 h-5 shrink-0" />
          <p className="font-semibold text-sm">
            Estimated delivery:{" "}
            <span className="font-extrabold text-base">{ESTIMATED_DELIVERY}</span>
          </p>
          <span className="hidden sm:block text-white/50">|</span>
          <div className="flex items-center gap-1.5 text-sm">
            <MapPin className="w-4 h-4 shrink-0" />
            <span>123 Maple Avenue, San Francisco, CA 94103</span>
          </div>
        </div>
      </motion.div>

      {/* Main content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-14">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Left: tracking + items */}
          <div className="lg:col-span-3 space-y-8">
            {/* Order tracking */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={fadeInUp}
              className="bg-white rounded-2xl border border-black/5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.10)] p-6"
            >
              <h2 className="text-lg font-extrabold text-[#1B5E20] mb-6">
                Order Status
              </h2>
              <div className="relative flex items-start justify-between">
                {/* Progress line */}
                <div className="absolute top-5 left-5 right-5 h-0.5 bg-gray-100 z-0" />
                <div
                  className="absolute top-5 left-5 h-0.5 bg-[#2E7D32] z-0 transition-all duration-700"
                  style={{ width: "40%" }}
                />
                {steps.map((step, idx) => {
                  const Icon = step.icon;
                  return (
                    <motion.div
                      key={step.label}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 * idx, duration: 0.45, ease: "easeOut" }}
                      className="relative z-10 flex flex-col items-center gap-2 flex-1"
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                          step.done
                            ? "bg-[#2E7D32] border-[#2E7D32] text-white shadow-md"
                            : idx === 2
                            ? "bg-[#F9A825] border-[#F9A825] text-white shadow-md animate-pulse"
                            : "bg-white border-gray-200 text-gray-300"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span
                        className={`text-xs font-semibold text-center leading-tight ${
                          step.done || idx === 2 ? "text-[#1B5E20]" : "text-gray-400"
                        }`}
                      >
                        {step.label}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Order items */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={staggerContainer}
              className="bg-white rounded-2xl border border-black/5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.10)] p-6"
            >
              <h2 className="text-lg font-extrabold text-[#1B5E20] mb-5">
                Items in Your Order
              </h2>
              <ul className="divide-y divide-gray-50">
                {orderedItems.map((item) => (
                  <motion.li
                    key={item.id}
                    variants={fadeInUp}
                    className="flex items-center gap-4 py-4 first:pt-0 last:pb-0"
                  >
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#F1F8E9] shrink-0 border border-black/5">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            "/images/grocery-placeholder.jpg";
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800 text-sm truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Qty: {item.qty}
                      </p>
                    </div>
                    <p className="font-bold text-[#2E7D32] text-sm shrink-0">
                      ${(item.price * item.qty).toFixed(2)}
                    </p>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Delivery info */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={fadeInUp}
              className="bg-white rounded-2xl border border-black/5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.10)] p-6"
            >
              <h2 className="text-lg font-extrabold text-[#1B5E20] mb-4">
                Delivery Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#E8F5E9] flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-[#2E7D32]" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium mb-0.5">
                      Delivery Address
                    </p>
                    <p className="text-sm font-semibold text-gray-700 leading-snug">
                      123 Maple Avenue
                      <br />
                      San Francisco, CA 94103
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#E8F5E9] flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4 text-[#2E7D32]" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium mb-0.5">
                      Time Slot
                    </p>
                    <p className="text-sm font-semibold text-gray-700">
                      Today, 3:00 PM – 5:00 PM
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#E8F5E9] flex items-center justify-center shrink-0">
                    <Truck className="w-4 h-4 text-[#2E7D32]" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium mb-0.5">
                      Delivery Method
                    </p>
                    <p className="text-sm font-semibold text-gray-700">
                      Express Home Delivery
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#E8F5E9] flex items-center justify-center shrink-0">
                    <CheckCircle className="w-4 h-4 text-[#2E7D32]" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium mb-0.5">
                      Payment
                    </p>
                    <p className="text-sm font-semibold text-gray-700">
                      Visa ending in 4242
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right: order summary */}
          <div className="lg:col-span-2">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={fadeInUp}
              className="sticky top-24 bg-white rounded-2xl border border-black/5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.10)] p-6"
            >
              <h2 className="text-lg font-extrabold text-[#1B5E20] mb-5">
                Order Summary
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({orderedItems.length} items)</span>
                  <span className="font-semibold text-gray-800">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery fee</span>
                  <span className="font-semibold text-gray-800">
                    ${deliveryFee.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-[#2E7D32]">
                  <span>Promo discount</span>
                  <span className="font-semibold">-${discount.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between">
                  <span className="font-extrabold text-gray-900 text-base">
                    Total Paid
                  </span>
                  <span className="font-extrabold text-[#2E7D32] text-base">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Order number */}
              <div className="mt-6 p-3 rounded-xl bg-[#F1F8E9] border border-[#C8E6C9] flex items-center justify-between">
                <span className="text-xs text-gray-500 font-medium">
                  Order Number
                </span>
                <span className="text-sm font-extrabold text-[#1B5E20]">
                  {ORDER_NUMBER}
                </span>
              </div>

              {/* CTA */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="mt-6"
              >
                <Link
                  href="/shop"
                  className="flex items-center justify-center gap-2 w-full py-3.5 rounded-full bg-[#2E7D32] text-white font-bold text-sm hover:bg-[#1B5E20] transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Continue Shopping
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>

              <p className="text-center text-xs text-gray-400 mt-4 leading-relaxed">
                A confirmation email has been sent to{" "}
                <span className="font-semibold text-gray-600">
                  jane@example.com
                </span>
              </p>
            </motion.div>
          </div>
        </div>

        {/* Bottom CTA strip */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={fadeInUp}
          className="mt-14 rounded-2xl bg-gradient-to-r from-[#2E7D32] to-[#388E3C] p-8 text-white text-center shadow-[0_4px_32px_rgba(46,125,50,0.25)]"
        >
          <h3 className="text-2xl font-extrabold mb-2">
            Love fresh groceries?
          </h3>
          <p className="text-green-100 text-sm mb-6 max-w-md mx-auto">
            Subscribe to Fresh Basket Plus and get free delivery on every order,
            plus exclusive weekly deals on seasonal produce.
          </p>
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#F9A825] text-white font-bold text-sm hover:bg-[#F57F17] transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Explore Fresh Deals
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}