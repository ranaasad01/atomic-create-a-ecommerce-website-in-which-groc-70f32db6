"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ShoppingCart, Star, Truck, Shield, Leaf, Clock, ChevronRight, ArrowRight, Check, Heart, Sparkles, Package } from 'lucide-react';
import { fadeInUp, fadeIn, staggerContainer, scaleIn, slideInLeft, slideInRight } from "@/lib/motion";
import { useTranslations } from "next-intl";

// ─── Inline mock data ────────────────────────────────────────────────────────

const FEATURED_PRODUCTS = [
  {
    id: "p1",
    name: "Organic Strawberries",
    category: "Fruits",
    price: 4.99,
    originalPrice: 6.49,
    weight: "500g",
    image: "https://modernfarmer.com/wp-content/uploads/2018/07/how-to-grow-strawberries.jpg",
    badge: "Sale",
    rating: 4.8,
    reviews: 214,
    description: "Sun-ripened, hand-picked strawberries bursting with sweetness.",
  },
  {
    id: "p2",
    name: "Hass Avocados",
    category: "Fruits",
    price: 5.49,
    originalPrice: undefined,
    weight: "Pack of 4",
    image: "https://img.imageboss.me/fourwinds/width/425/dpr:2/shop/products/shutterstock_100322618hass_avocado.jpg?v=1729718212",
    badge: "Popular",
    rating: 4.9,
    reviews: 389,
    description: "Perfectly ripe, creamy avocados ready to enjoy today.",
  },
  {
    id: "p3",
    name: "Baby Spinach",
    category: "Vegetables",
    price: 3.29,
    originalPrice: undefined,
    weight: "200g",
    image: "https://www.earthboundfarm.com/wp-content/uploads/2024/04/BabySpinach-Half-10oz-Mockup.jpg",
    badge: "Organic",
    rating: 4.7,
    reviews: 156,
    description: "Tender, nutrient-rich baby spinach leaves, washed and ready.",
  },
  {
    id: "p4",
    name: "Whole Milk",
    category: "Dairy",
    price: 2.99,
    originalPrice: undefined,
    weight: "1 Litre",
    image: "https://i5.walmartimages.com/seo/Great-Value-Whole-Vitamin-D-Milk-Gallon-Plastic-Jug-128-Fl-Oz_6a7b09b4-f51d-4bea-a01c-85767f1b481a.86876244397d83ce6cdedb030abe6e4a.jpeg",
    badge: undefined,
    rating: 4.6,
    reviews: 98,
    description: "Farm-fresh whole milk from grass-fed cows, delivered daily.",
  },
  {
    id: "p5",
    name: "Sourdough Loaf",
    category: "Bakery",
    price: 6.99,
    originalPrice: undefined,
    weight: "800g",
    image: "https://www.theclevercarrot.com/wp-content/uploads/2013/12/sourdough-bread-round-1-of-1.jpg",
    badge: "Artisan",
    rating: 4.9,
    reviews: 271,
    description: "Slow-fermented, stone-baked sourdough with a perfect crust.",
  },
  {
    id: "p6",
    name: "Seedless Grapes",
    category: "Fruits",
    price: 3.79,
    originalPrice: 4.99,
    weight: "400g",
    image: "http://plantsexpress.com/cdn/shop/products/Green-Seedless-Table-Grape-2.jpg?v=1684510111",
    badge: "Sale",
    rating: 4.5,
    reviews: 133,
    description: "Crisp, sweet seedless grapes perfect for snacking.",
  },
  {
    id: "p7",
    name: "Cherry Tomatoes",
    category: "Vegetables",
    price: 2.49,
    originalPrice: undefined,
    weight: "300g",
    image: "https://picsum.photos/seed/f3ba096c5d3e/800/600",
    badge: undefined,
    rating: 4.7,
    reviews: 187,
    description: "Vine-ripened cherry tomatoes, sweet and full of flavour.",
  },
  {
    id: "p8",
    name: "Greek Yogurt",
    category: "Dairy",
    price: 3.49,
    originalPrice: undefined,
    weight: "500g",
    image: "https://www.daisybeet.com/wp-content/uploads/2024/01/Homemade-Greek-Yogurt-13.jpg",
    badge: "New",
    rating: 4.8,
    reviews: 62,
    description: "Thick, protein-rich Greek yogurt with a clean, tangy finish.",
  },
];

const CATEGORIES_DISPLAY = [
  { name: "Fresh Fruits", icon: "🍓", color: "bg-rose-50 border-rose-100", accent: "text-rose-600", image: "https://www.unlockfood.ca/EatRightOntario/media/Website-images-resized/How-to-store-fruit-to-keep-it-fresh-resized.jpg" },
  { name: "Vegetables", icon: "🥦", color: "bg-emerald-50 border-emerald-100", accent: "text-emerald-600", image: "https://www.unlockfood.ca/EatRightOntario/media/Website-images-resized/How-to-store-fruit-to-keep-it-fresh-resized.jpg" },
  { name: "Dairy & Eggs", icon: "🥛", color: "bg-sky-50 border-sky-100", accent: "text-sky-600", image: "https://cdn.britannica.com/17/196817-050-6A15DAC3/vegetables.jpg?w=400&h=300&c=crop" },
  { name: "Bakery", icon: "🍞", color: "bg-amber-50 border-amber-100", accent: "text-amber-600", image: "https://www.mashed.com/img/gallery/the-reason-some-people-mistakenly-believe-eggs-are-dairy/l-intro-1619683011.jpg" },
  { name: "Beverages", icon: "🧃", color: "bg-violet-50 border-violet-100", accent: "text-violet-600", image: "https://pam-main-website-media.s3.amazonaws.com/wp-content/uploads/2025/05/23010753/Hanis-Bakery-interior.jpg" },
  { name: "Snacks", icon: "🥜", color: "bg-orange-50 border-orange-100", accent: "text-orange-600", image: "https://www.oysterenglish.com/images/beverage-types.jpg" },
];

const VALUE_PROPS = [
  {
    icon: Truck,
    title: "Free Same-Day Delivery",
    description: "Order before 11am and get your groceries delivered the same day, right to your door.",
    color: "bg-green-50",
    iconColor: "text-[#2E7D32]",
  },
  {
    icon: Leaf,
    title: "100% Organic Sourced",
    description: "Every product is sourced directly from certified organic farms within 150 miles.",
    color: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
  {
    icon: Shield,
    title: "Freshness Guaranteed",
    description: "Not happy with your produce? We'll replace it or refund you, no questions asked.",
    color: "bg-teal-50",
    iconColor: "text-teal-600",
  },
  {
    icon: Clock,
    title: "Flexible Subscriptions",
    description: "Set up a weekly basket and save up to 20% on every order, pause or cancel anytime.",
    color: "bg-lime-50",
    iconColor: "text-lime-700",
  },
];

const TESTIMONIALS = [
  {
    id: "t1",
    name: "Sarah Mitchell",
    location: "San Francisco, CA",
    avatar: "https://upload.wikimedia.org/wikipedia/commons/2/25/Minister_Mitchell_July_20_headshot_DSC6710a.jpg",
    rating: 5,
    text: "Fresh Basket has completely changed how I shop for groceries. The produce arrives so fresh it feels like I picked it myself. The strawberries last a full week in my fridge.",
    product: "Weekly Fruit Box",
  },
  {
    id: "t2",
    name: "James Okafor",
    location: "Oakland, CA",
    avatar: "https://achiya.org/wp-content/uploads/writers/james-okafor-4d4bc7.webp",
    rating: 5,
    text: "I switched from a big-box store six months ago and I'll never go back. The quality is night and day, and the same-day delivery fits perfectly into my schedule.",
    product: "Veggie Bundle",
  },
  {
    id: "t3",
    name: "Priya Sharma",
    location: "Berkeley, CA",
    avatar: "https://upload.wikimedia.org/wikipedia/en/thumb/d/de/Priya_Sharma_%28fictional_character%29.jpg/250px-Priya_Sharma_%28fictional_character%29.jpg",
    rating: 5,
    text: "The sourdough loaf alone is worth the subscription. My family goes through two a week. Everything is consistently excellent and the app makes reordering effortless.",
    product: "Bakery Subscription",
  },
];

const STATS = [
  { value: "50,000+", label: "Happy Customers" },
  { value: "200+", label: "Local Farm Partners" },
  { value: "4.9", label: "Average Rating" },
  { value: "98%", label: "On-Time Delivery" },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`w-3.5 h-3.5 ${s <= Math.round(rating) ? "fill-[#F9A825] text-[#F9A825]" : "text-gray-200 fill-gray-200"}`}
        />
      ))}
      <span className="text-xs text-gray-500 ml-1">({count})</span>
    </div>
  );
}

function BadgePill({ badge }: { badge: string }) {
  const colors: Record<string, string> = {
    Sale: "bg-rose-100 text-rose-700",
    Popular: "bg-amber-100 text-amber-700",
    Organic: "bg-green-100 text-green-700",
    Artisan: "bg-violet-100 text-violet-700",
    New: "bg-sky-100 text-sky-700",
  };
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${colors[badge] ?? "bg-gray-100 text-gray-600"}`}>
      {badge}
    </span>
  );
}

function ProductCard({ product }: { product: typeof FEATURED_PRODUCTS[0] }) {
  const [added, setAdded] = useState(false);
  const [liked, setLiked] = useState(false);

  function handleAdd() {
    setAdded(true);
    try {
      const stored = localStorage.getItem("freshbasket_cart");
      const cart: Array<{ id: string; quantity: number; name: string; price: number; image: string; weight: string }> = stored ? JSON.parse(stored) : [];
      const idx = cart.findIndex((i) => i.id === product.id);
      if (idx >= 0) {
        cart[idx].quantity += 1;
      } else {
        cart.push({ id: product.id, quantity: 1, name: product.name, price: product.price, image: product.image, weight: product.weight });
      }
      localStorage.setItem("freshbasket_cart", JSON.stringify(cart));
      window.dispatchEvent(new Event("cart_updated"));
    } catch {
      // silent
    }
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <motion.div
      variants={scaleIn}
      whileHover={{ y: -4, boxShadow: "0 12px 32px -8px rgba(0,0,0,0.12)" }}
      transition={{ duration: 0.25 }}
      className="group bg-white rounded-2xl border border-black/5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_16px_-4px_rgba(0,0,0,0.08)] overflow-hidden flex flex-col"
    >
      <div className="relative overflow-hidden bg-gray-50 aspect-[4/3]">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = "https://images.stockcake.com/public/7/8/f/78f27b46-a70c-4a90-9af4-9a1d29a85a8b_medium/farmer-harvesting-vegetables-stockcake.jpg";
          }}
        />
        <div className="absolute top-3 left-3 flex gap-1.5">
          {product.badge && <BadgePill badge={product.badge} />}
        </div>
        <button
          onClick={() => setLiked((v) => !v)}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:scale-110 transition-transform duration-200"
          aria-label="Wishlist"
        >
          <Heart className={`w-4 h-4 transition-colors ${liked ? "fill-rose-500 text-rose-500" : "text-gray-400"}`} />
        </button>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <p className="text-[11px] font-semibold text-[#2E7D32] uppercase tracking-wider mb-1">{product.category}</p>
        <h3 className="font-bold text-gray-900 text-sm leading-snug mb-1">{product.name}</h3>
        <p className="text-xs text-gray-500 mb-2 leading-relaxed line-clamp-2">{product.description}</p>
        <StarRating rating={product.rating} count={product.reviews} />
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-extrabold text-gray-900">${product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="text-xs text-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>
              )}
            </div>
            <p className="text-[11px] text-gray-400">{product.weight}</p>
          </div>
          <motion.button
            whileTap={{ scale: 0.93 }}
            onClick={handleAdd}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
              added
                ? "bg-green-100 text-green-700"
                : "bg-[#2E7D32] text-white hover:bg-[#1B5E20] shadow-md hover:shadow-lg"
            }`}
          >
            {added ? <Check className="w-3.5 h-3.5" /> : <ShoppingCart className="w-3.5 h-3.5" />}
            {added ? "Added" : "Add"}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const t = useTranslations();
  const shouldReduceMotion = useReducedMotion();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  }

  const motionProps = shouldReduceMotion
    ? {}
    : { initial: "hidden", whileInView: "visible", viewport: { once: true, margin: "-80px" } };

  return (
    <main className="overflow-x-hidden">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex items-center bg-gradient-to-br from-[#F1F8E9] via-white to-[#E8F5E9] pt-20 pb-16 overflow-hidden">
        {/* Background texture */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-[#A5D6A7]/20 blur-[120px] translate-x-1/3 -translate-y-1/4" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-[#C8E6C9]/30 blur-[100px] -translate-x-1/4 translate-y-1/4" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left copy */}
            <motion.div
              {...motionProps}
              variants={staggerContainer}
              className="text-left"
            >
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 bg-[#E8F5E9] border border-[#A5D6A7] rounded-full px-4 py-1.5 mb-6">
                <Sparkles className="w-3.5 h-3.5 text-[#2E7D32]" />
                <span className="text-xs font-bold text-[#2E7D32] tracking-wide uppercase">Farm Fresh, Delivered Fast</span>
              </motion.div>

              <motion.h1
                variants={fadeInUp}
                className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-[#1B5E20] leading-[1.05] tracking-tight text-balance mb-6"
              >
                Groceries that<br />
                <span className="text-[#2E7D32] relative">
                  taste like home.
                  <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 9C50 3 100 1 150 4C200 7 250 9 298 5" stroke="#F9A825" strokeWidth="3" strokeLinecap="round"/>
                  </svg>
                </span>
              </motion.h1>

              <motion.p
                variants={fadeInUp}
                className="text-lg text-gray-600 leading-relaxed mb-8 max-w-lg text-pretty"
              >
                Seasonal produce, organic staples, and artisan goods sourced from local farms and delivered to your door in hours. No queues, no compromise.
              </motion.p>

              <motion.div variants={fadeInUp} className="flex flex-wrap gap-4 mb-10">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 bg-[#2E7D32] text-white font-bold px-7 py-3.5 rounded-full shadow-[0_4px_20px_rgba(46,125,50,0.35)] hover:bg-[#1B5E20] hover:shadow-[0_6px_28px_rgba(46,125,50,0.45)] transition-all duration-300 text-sm"
                >
                  Shop Now
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 bg-white text-[#2E7D32] font-bold px-7 py-3.5 rounded-full border border-[#A5D6A7] hover:border-[#2E7D32] hover:bg-[#F1F8E9] transition-all duration-300 text-sm shadow-sm"
                >
                  Browse Categories
                </Link>
              </motion.div>

              <motion.div variants={fadeInUp} className="flex items-center gap-6">
                {[
                  { icon: Truck, text: "Free delivery over $35" },
                  { icon: Leaf, text: "Certified organic" },
                  { icon: Clock, text: "Same-day delivery" },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                    <item.icon className="w-3.5 h-3.5 text-[#2E7D32]" />
                    {item.text}
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right image collage */}
            <motion.div
              {...motionProps}
              variants={slideInRight}
              className="relative hidden lg:block"
            >
              <div className="relative w-full aspect-square max-w-[520px] ml-auto">
                {/* Main image */}
                <div className="absolute inset-0 rounded-[2.5rem] overflow-hidden shadow-[0_24px_80px_-16px_rgba(0,0,0,0.18)]">
                  <img
                    src="https://thumbs.dreamstime.com/b/wireframe-grocery-basket-overflowing-colorful-array-food-items-contents-include-fresh-produce-such-as-tomatoes-422576199.jpg"
                    alt="Fresh grocery basket overflowing with colourful produce"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = "https://images.stockcake.com/public/7/8/f/78f27b46-a70c-4a90-9af4-9a1d29a85a8b_medium/farmer-harvesting-vegetables-stockcake.jpg";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                </div>

                {/* Floating card 1 */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -left-10 top-1/4 bg-white rounded-2xl px-4 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-black/5 flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#E8F5E9] flex items-center justify-center text-xl">🍓</div>
                  <div>
                    <p className="text-xs font-bold text-gray-900">Organic Strawberries</p>
                    <p className="text-[11px] text-[#2E7D32] font-semibold">$4.99 / 500g</p>
                  </div>
                </motion.div>

                {/* Floating card 2 */}
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
                  className="absolute -right-8 bottom-1/4 bg-white rounded-2xl px-4 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-black/5"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex">
                      {[1,2,3,4,5].map((s) => (
                        <Star key={s} className="w-3 h-3 fill-[#F9A825] text-[#F9A825]" />
                      ))}
                    </div>
                    <span className="text-[11px] font-bold text-gray-700">4.9</span>
                  </div>
                  <p className="text-[11px] text-gray-500">50,000+ happy customers</p>
                </motion.div>

                {/* Floating badge */}
                <motion.div
                  animate={{ rotate: [0, 3, -3, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-4 right-12 bg-[#F9A825] text-white rounded-2xl px-3 py-2 shadow-lg"
                >
                  <p className="text-[11px] font-extrabold">Free Delivery</p>
                  <p className="text-[10px] opacity-90">Orders over $35</p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Stats bar ────────────────────────────────────────────────────── */}
      <section className="bg-[#2E7D32] py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            {...motionProps}
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 md:divide-x md:divide-white/20"
          >
            {STATS.map((stat) => (
              <motion.div
                key={stat.label}
                variants={fadeInUp}
                className="text-center px-6"
              >
                <p className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">{stat.value}</p>
                <p className="text-sm text-green-200 mt-1 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Categories ───────────────────────────────────────────────────── */}
      <section id="categories" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            {...motionProps}
            variants={staggerContainer}
            className="text-center mb-14"
          >
            <motion.p variants={fadeInUp} className="text-xs font-bold text-[#2E7D32] uppercase tracking-widest mb-3">Browse by Category</motion.p>
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight text-balance">
              Everything fresh, in one place
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-gray-500 mt-4 max-w-xl mx-auto leading-relaxed">
              From crisp seasonal vegetables to warm artisan bread, explore our full range of farm-sourced categories.
            </motion.p>
          </motion.div>

          <motion.div
            {...motionProps}
            variants={staggerContainer}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4"
          >
            {CATEGORIES_DISPLAY.map((cat) => (
              <motion.div
                key={cat.name}
                variants={scaleIn}
                whileHover={{ y: -6, scale: 1.03 }}
                transition={{ duration: 0.22 }}
              >
                <Link
                  href="/shop"
                  className={`flex flex-col items-center gap-3 p-5 rounded-2xl border ${cat.color} hover:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.1)] transition-all duration-300 group`}
                >
                  <span className="text-4xl group-hover:scale-110 transition-transform duration-200">{cat.icon}</span>
                  <span className={`text-xs font-bold text-center ${cat.accent}`}>{cat.name}</span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Featured Products ─────────────────────────────────────────────── */}
      <section id="featured" className="py-24 bg-[#F9FBF7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            {...motionProps}
            variants={staggerContainer}
            className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14"
          >
            <div>
              <motion.p variants={fadeInUp} className="text-xs font-bold text-[#2E7D32] uppercase tracking-widest mb-3">Hand-Picked for You</motion.p>
              <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight text-balance">
                Today's freshest picks
              </motion.h2>
            </div>
            <motion.div variants={fadeInUp}>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 text-sm font-bold text-[#2E7D32] hover:text-[#1B5E20] transition-colors group"
              >
                View all products
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            {...motionProps}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {FEATURED_PRODUCTS.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Value Props ───────────────────────────────────────────────────── */}
      <section id="about" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left image */}
            <motion.div
              {...motionProps}
              variants={slideInLeft}
              className="relative"
            >
              <div className="relative rounded-[2rem] overflow-hidden aspect-[4/5] shadow-[0_24px_80px_-16px_rgba(0,0,0,0.15)]">
                <img
                  src="https://images.stockcake.com/public/7/8/f/78f27b46-a70c-4a90-9af4-9a1d29a85a8b_medium/farmer-harvesting-vegetables-stockcake.jpg"
                  alt="Local farmer harvesting fresh vegetables at sunrise"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = "https://images.stockcake.com/public/7/8/f/78f27b46-a70c-4a90-9af4-9a1d29a85a8b_medium/farmer-harvesting-vegetables-stockcake.jpg";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1B5E20]/30 to-transparent" />
              </div>
              {/* Overlay card */}
              <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm rounded-2xl p-5 shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-black/5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-[#E8F5E9] flex items-center justify-center">
                    <Package className="w-5 h-5 text-[#2E7D32]" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">200+ Farm Partners</p>
                    <p className="text-xs text-gray-500">All within 150 miles of your door</p>
                  </div>
                </div>
                <div className="flex gap-1 mt-3">
                  {[1,2,3,4,5,6,7,8].map((i) => (
                    <div key={i} className="flex-1 h-1.5 rounded-full bg-[#2E7D32]" style={{ opacity: 0.3 + i * 0.09 }} />
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Right copy */}
            <motion.div
              {...motionProps}
              variants={staggerContainer}
            >
              <motion.p variants={fadeInUp} className="text-xs font-bold text-[#2E7D32] uppercase tracking-widest mb-3">Why Fresh Basket</motion.p>
              <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight text-balance mb-6">
                Better for you. Better for farmers.
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-gray-500 leading-relaxed mb-10 text-pretty">
                We cut out the middlemen and work directly with small-scale organic farms. That means fresher food for you, fairer prices for growers, and a lighter footprint for the planet.
              </motion.p>

              <motion.div variants={staggerContainer} className="grid sm:grid-cols-2 gap-5">
                {VALUE_PROPS.map((vp) => (
                  <motion.div
                    key={vp.title}
                    variants={fadeInUp}
                    whileHover={{ y: -3 }}
                    transition={{ duration: 0.2 }}
                    className="flex gap-4 p-5 rounded-2xl border border-black/5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_16px_-4px_rgba(0,0,0,0.06)] bg-white"
                  >
                    <div className={`w-11 h-11 rounded-xl ${vp.color} flex items-center justify-center flex-shrink-0`}>
                      <vp.icon className={`w-5 h-5 ${vp.iconColor}`} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 mb-1">{vp.title}</p>
                      <p className="text-xs text-gray-500 leading-relaxed">{vp.description}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────────────── */}
      <section id="reviews" className="py-24 bg-[#F1F8E9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            {...motionProps}
            variants={staggerContainer}
            className="text-center mb-14"
          >
            <motion.p variants={fadeInUp} className="text-xs font-bold text-[#2E7D32] uppercase tracking-widest mb-3">Real Customers, Real Results</motion.p>
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight text-balance">
              Loved by 50,000 households
            </motion.h2>
          </motion.div>

          <motion.div
            {...motionProps}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-6"
          >
            {TESTIMONIALS.map((review, i) => (
              <motion.div
                key={review.id}
                variants={fadeInUp}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.22 }}
                className={`bg-white rounded-2xl p-7 border border-black/5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.1)] flex flex-col ${i === 1 ? "md:mt-6" : ""}`}
              >
                <div className="flex items-center gap-1 mb-4">
                  {[1,2,3,4,5].map((s) => (
                    <Star key={s} className="w-4 h-4 fill-[#F9A825] text-[#F9A825]" />
                  ))}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed flex-1 mb-6 text-pretty">"{review.text}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-gray-50">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-[#E8F5E9] flex-shrink-0">
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
                    <p className="text-sm font-bold text-gray-900">{review.name}</p>
                    <p className="text-xs text-gray-400">{review.location} · {review.product}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA / Newsletter ─────────────────────────────────────────────── */}
      <section id="contact" className="py-24 bg-[#1B5E20] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-[#2E7D32]/40 blur-[100px]" />
        </div>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            {...motionProps}
            variants={staggerContainer}
          >
            <motion.div variants={scaleIn} className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6">
              <Sparkles className="w-3.5 h-3.5 text-[#F9A825]" />
              <span className="text-xs font-bold text-white tracking-wide uppercase">Limited Time Offer</span>
            </motion.div>

            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-extrabold text-white tracking-tight text-balance mb-4">
              Get 20% off your first order
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-green-200 text-lg leading-relaxed mb-10 text-pretty">
              Join over 50,000 households who get farm-fresh groceries delivered weekly. Subscribe to our newsletter and unlock your welcome discount.
            </motion.p>

            {subscribed ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="inline-flex items-center gap-3 bg-white/10 border border-white/20 rounded-2xl px-8 py-5"
              >
                <div className="w-10 h-10 rounded-full bg-[#F9A825] flex items-center justify-center">
                  <Check className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-white font-bold">You're on the list.</p>
                  <p className="text-green-200 text-sm">Check your inbox for your 20% discount code.</p>
                </div>
              </motion.div>
            ) : (
              <motion.form
                variants={fadeInUp}
                onSubmit={handleSubscribe}
                className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="flex-1 px-5 py-3.5 rounded-full bg-white/10 border border-white/20 text-white placeholder-green-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#F9A825] transition"
                />
                <button
                  type="submit"
                  className="px-7 py-3.5 rounded-full bg-[#F9A825] text-white font-bold text-sm hover:bg-[#F57F17] transition-all duration-200 shadow-[0_4px_20px_rgba(249,168,37,0.4)] hover:shadow-[0_6px_28px_rgba(249,168,37,0.5)] whitespace-nowrap"
                >
                  Claim 20% Off
                </button>
              </motion.form>
            )}

            <motion.p variants={fadeInUp} className="text-green-300 text-xs mt-5">
              No spam, ever. Unsubscribe in one click.
            </motion.p>
          </motion.div>
        </div>
      </section>
    </main>
  );
}