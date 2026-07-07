"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Search, SlidersHorizontal, Star, ShoppingCart, Heart, ChevronDown, X, Check, Leaf, Filter } from 'lucide-react';
import { CATEGORIES, type Category, type Product } from "@/lib/data";
import {
  fadeInUp,
  fadeIn,
  staggerContainer,
  scaleIn,
} from "@/lib/motion";
import { useTranslations } from "next-intl";

const ALL_PRODUCTS: Product[] = [
  { id: "p1", name: "Organic Strawberries", category: "Fruits", price: 4.99, originalPrice: 6.49, weight: "250g", image: "https://modernfarmer.com/wp-content/uploads/2018/07/how-to-grow-strawberries.jpg", badge: "Sale", rating: 4.8, reviews: 312, inStock: true, description: "Sun-ripened organic strawberries bursting with sweetness. Picked fresh from local farms." },
  { id: "p2", name: "Alphonso Mangoes", category: "Fruits", price: 8.99, weight: "500g", image: "https://www.starkbros.com/images/dynamic/6955.jpg", badge: "Seasonal", rating: 4.9, reviews: 204, inStock: true, description: "The king of mangoes. Creamy, aromatic, and naturally sweet Alphonso variety." },
  { id: "p3", name: "Blueberries", category: "Fruits", price: 5.49, weight: "200g", image: "https://hips.hearstapps.com/hmg-prod/images/blueberries-in-dish-royalty-free-image-1772132137.pjpeg?crop=0.771xw:1.00xh;0.135xw,0&resize=1200:*", rating: 4.7, reviews: 178, inStock: true, description: "Plump, antioxidant-rich blueberries perfect for smoothies, baking, or snacking." },
  { id: "p4", name: "Watermelon", category: "Fruits", price: 6.99, weight: "1 whole", image: "/images/whole-watermelon-fresh.jpg", badge: "Popular", rating: 4.6, reviews: 95, inStock: true, description: "Crisp, juicy watermelon — the ultimate summer refreshment." },
  { id: "p5", name: "Avocados", category: "Fruits", price: 3.49, weight: "2 pack", image: "/images/ripe-avocados-pair.jpg", rating: 4.8, reviews: 421, inStock: true, description: "Perfectly ripe Hass avocados, ready to eat. Creamy and rich in healthy fats." },
  { id: "p6", name: "Red Grapes", category: "Fruits", price: 4.29, originalPrice: 5.49, weight: "500g", image: "/images/red-seedless-grapes.jpg", badge: "Sale", rating: 4.5, reviews: 133, inStock: true, description: "Seedless red grapes with a perfect balance of sweet and tart." },
  { id: "p7", name: "Broccoli Crown", category: "Vegetables", price: 2.49, weight: "400g", image: "/images/fresh-broccoli-crown.jpg", rating: 4.6, reviews: 88, inStock: true, description: "Crisp, vibrant broccoli crowns packed with vitamins C and K." },
  { id: "p8", name: "Baby Spinach", category: "Vegetables", price: 3.29, weight: "150g", image: "https://www.earthboundfarm.com/wp-content/uploads/2024/04/BabySpinach-Half-10oz-Mockup.jpg", badge: "Organic", rating: 4.7, reviews: 215, inStock: true, description: "Tender organic baby spinach leaves, triple-washed and ready to use." },
  { id: "p9", name: "Cherry Tomatoes", category: "Vegetables", price: 2.99, weight: "300g", image: "https://picsum.photos/seed/f3ba096c5d3e/800/600", rating: 4.8, reviews: 302, inStock: true, description: "Sweet vine-ripened cherry tomatoes, perfect for salads and roasting." },
  { id: "p10", name: "Bell Peppers Mix", category: "Vegetables", price: 3.79, weight: "3 pack", image: "/images/mixed-bell-peppers.jpg", badge: "Popular", rating: 4.5, reviews: 167, inStock: true, description: "A vibrant trio of red, yellow, and orange bell peppers." },
  { id: "p11", name: "Carrots", category: "Vegetables", price: 1.99, weight: "500g", image: "/images/fresh-carrots-bunch.jpg", rating: 4.4, reviews: 74, inStock: true, description: "Sweet, crunchy carrots freshly harvested. Great for snacking and cooking." },
  { id: "p12", name: "Zucchini", category: "Vegetables", price: 2.29, weight: "2 pack", image: "/images/green-zucchini-fresh.jpg", rating: 4.3, reviews: 56, inStock: false, description: "Tender green zucchini, ideal for grilling, sautéing, or spiralizing." },
  { id: "p13", name: "Whole Milk", category: "Dairy", price: 3.99, weight: "1L", image: "https://i5.walmartimages.com/seo/Great-Value-Whole-Vitamin-D-Milk-Gallon-Plastic-Jug-128-Fl-Oz_6a7b09b4-f51d-4bea-a01c-85767f1b481a.86876244397d83ce6cdedb030abe6e4a.jpeg", rating: 4.7, reviews: 189, inStock: true, description: "Fresh, creamy whole milk from grass-fed cows. No added hormones." },
  { id: "p14", name: "Greek Yogurt", category: "Dairy", price: 4.49, originalPrice: 5.29, weight: "500g", image: "https://www.daisybeet.com/wp-content/uploads/2024/01/Homemade-Greek-Yogurt-13.jpg", badge: "Sale", rating: 4.8, reviews: 344, inStock: true, description: "Thick, protein-rich Greek yogurt with a clean, tangy flavor." },
  { id: "p15", name: "Cheddar Cheese", category: "Dairy", price: 5.99, weight: "200g", image: "/images/aged-cheddar-cheese.jpg", badge: "Aged", rating: 4.9, reviews: 278, inStock: true, description: "Sharp, aged cheddar with a rich, complex flavor. Perfect for boards and cooking." },
  { id: "p16", name: "Free-Range Eggs", category: "Dairy", price: 4.79, weight: "12 pack", image: "/images/free-range-eggs-carton.jpg", badge: "Free-Range", rating: 4.8, reviews: 512, inStock: true, description: "Golden-yolked eggs from free-range hens raised on pasture." },
  { id: "p17", name: "Sourdough Loaf", category: "Bakery", price: 5.49, weight: "800g", image: "https://www.theclevercarrot.com/wp-content/uploads/2013/12/sourdough-bread-round-1-of-1.jpg", badge: "Artisan", rating: 4.9, reviews: 398, inStock: true, description: "Slow-fermented sourdough with a crispy crust and chewy crumb. Baked fresh daily." },
  { id: "p18", name: "Croissants", category: "Bakery", price: 3.99, weight: "4 pack", image: "/images/butter-croissants-fresh.jpg", rating: 4.7, reviews: 221, inStock: true, description: "Flaky, buttery croissants made with pure French butter. Baked every morning." },
  { id: "p19", name: "Blueberry Muffins", category: "Bakery", price: 4.29, originalPrice: 5.49, weight: "4 pack", image: "/images/blueberry-muffins-bakery.jpg", badge: "Sale", rating: 4.6, reviews: 143, inStock: true, description: "Moist, golden muffins loaded with fresh blueberries and a hint of lemon zest." },
  { id: "p20", name: "Cold Brew Coffee", category: "Beverages", price: 4.99, weight: "330ml", image: "/images/cold-brew-coffee-bottle.jpg", badge: "New", rating: 4.7, reviews: 87, inStock: true, description: "Smooth, low-acid cold brew steeped for 18 hours. No sugar, no additives." },
  { id: "p21", name: "Fresh Orange Juice", category: "Beverages", price: 5.49, weight: "1L", image: "/images/fresh-squeezed-orange-juice.jpg", rating: 4.8, reviews: 265, inStock: true, description: "100% freshly squeezed orange juice. No concentrate, no preservatives." },
  { id: "p22", name: "Sparkling Water", category: "Beverages", price: 1.99, weight: "750ml", image: "/images/sparkling-mineral-water.jpg", rating: 4.5, reviews: 112, inStock: true, description: "Naturally carbonated mineral water from an Alpine spring." },
  { id: "p23", name: "Mixed Nuts", category: "Snacks", price: 7.99, originalPrice: 9.49, weight: "300g", image: "/images/premium-mixed-nuts.jpg", badge: "Sale", rating: 4.7, reviews: 198, inStock: true, description: "A premium blend of cashews, almonds, walnuts, and pecans. Lightly salted." },
  { id: "p24", name: "Dark Chocolate Bar", category: "Snacks", price: 3.49, weight: "100g", image: "/images/dark-chocolate-bar-70.jpg", badge: "70% Cacao", rating: 4.8, reviews: 334, inStock: true, description: "Intense 70% dark chocolate made from single-origin cacao beans." },
];

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
  { value: "name", label: "Name A–Z" },
];

const badgeColors: Record<string, string> = {
  Sale: "bg-red-100 text-red-700",
  Organic: "bg-green-100 text-green-700",
  New: "bg-blue-100 text-blue-700",
  Popular: "bg-amber-100 text-amber-700",
  Seasonal: "bg-orange-100 text-orange-700",
  Artisan: "bg-purple-100 text-purple-700",
  Aged: "bg-yellow-100 text-yellow-800",
  "Free-Range": "bg-teal-100 text-teal-700",
  "70% Cacao": "bg-stone-100 text-stone-700",
};

function StarRating({ rating, reviews }: { rating: number; reviews: number }) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            className={`w-3.5 h-3.5 ${
              s <= Math.round(rating)
                ? "fill-amber-400 text-amber-400"
                : "fill-gray-200 text-gray-200"
            }`}
          />
        ))}
      </div>
      <span className="text-xs text-gray-500">({reviews})</span>
    </div>
  );
}

const cardVariant: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

function ProductCard({ product, onAddToCart, wishlist, onToggleWishlist }: {
  product: Product;
  onAddToCart: (p: Product) => void;
  wishlist: Set<string>;
  onToggleWishlist: (id: string) => void;
}) {
  const isWished = wishlist.has(product.id);
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <motion.div
      variants={cardVariant}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group relative bg-white rounded-2xl border border-black/5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.10)] overflow-hidden flex flex-col"
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-[#F9FBF7] aspect-[4/3]">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect fill='%23F1F8E9' width='400' height='300'/%3E%3Ctext fill='%232E7D32' font-family='sans-serif' font-size='16' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3E🌿%3C/text%3E%3C/svg%3E";
          }}
        />
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.badge && (
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${badgeColors[product.badge] ?? "bg-gray-100 text-gray-700"}`}>
              {product.badge}
            </span>
          )}
          {discount && (
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-red-500 text-white">
              -{discount}%
            </span>
          )}
        </div>
        {/* Wishlist */}
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={() => onToggleWishlist(product.id)}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm border border-black/5 transition-all duration-200 hover:bg-white"
          aria-label={isWished ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className={`w-4 h-4 transition-colors duration-200 ${isWished ? "fill-red-500 text-red-500" : "text-gray-400"}`}
          />
        </motion.button>
        {!product.inStock && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="text-sm font-bold text-gray-500 bg-white px-3 py-1.5 rounded-full border border-gray-200">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <span className="text-xs text-[#2E7D32] font-semibold uppercase tracking-wide">
              {product.category}
            </span>
            <h3 className="text-sm font-bold text-gray-900 leading-snug mt-0.5">
              {product.name}
            </h3>
          </div>
          <span className="text-xs text-gray-400 whitespace-nowrap mt-1">{product.weight}</span>
        </div>

        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 flex-1">
          {product.description}
        </p>

        <StarRating rating={product.rating} reviews={product.reviews} />

        <div className="flex items-center justify-between mt-1">
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-extrabold text-gray-900">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-gray-400 line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            disabled={!product.inStock}
            onClick={() => onAddToCart(product)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#2E7D32] text-white text-xs font-bold hover:bg-[#1B5E20] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            Add
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

export default function ShopAllProductsPage() {
  const t = useTranslations();

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | "All">("All");
  const [sortBy, setSortBy] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());
  const [sortOpen, setSortOpen] = useState(false);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState(20);

  const allCategories: Array<Category | "All"> = ["All", ...CATEGORIES];

  const filtered = useMemo(() => {
    let list = [...ALL_PRODUCTS];
    if (selectedCategory !== "All") {
      list = list.filter((p) => p.category === selectedCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }
    if (inStockOnly) {
      list = list.filter((p) => p.inStock);
    }
    list = list.filter((p) => p.price <= maxPrice);

    switch (sortBy) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        list.sort((a, b) => b.rating - a.rating);
        break;
      case "name":
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }
    return list;
  }, [selectedCategory, search, sortBy, inStockOnly, maxPrice]);

  function handleAddToCart(product: Product) {
    try {
      const stored = localStorage.getItem("freshbasket_cart");
      const cart: Array<Product & { quantity: number }> = stored ? JSON.parse(stored) : [];
      const idx = cart.findIndex((i) => i.id === product.id);
      if (idx >= 0) {
        cart[idx].quantity = (cart[idx].quantity ?? 0) + 1;
      } else {
        cart.push({ ...product, quantity: 1 });
      }
      localStorage.setItem("freshbasket_cart", JSON.stringify(cart));
      window.dispatchEvent(new Event("cart_updated"));
    } catch {
      // ignore
    }
    setAddedIds((prev) => {
      const next = new Set(prev);
      next.add(product.id);
      setTimeout(() => {
        setAddedIds((p) => {
          const n = new Set(p);
          n.delete(product.id);
          return n;
        });
      }, 1500);
      return next;
    });
  }

  function handleToggleWishlist(id: string) {
    setWishlist((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const currentSortLabel =
    SORT_OPTIONS.find((o) => o.value === sortBy)?.label ?? "Featured";

  return (
    <main className="min-h-screen bg-[#FAFDF7] pt-20 pb-24">
      {/* Page Header */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="bg-gradient-to-br from-[#E8F5E9] via-[#F1F8E9] to-[#FAFDF7] border-b border-green-100"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <motion.div variants={staggerContainer} initial="hidden" animate="visible">
            <motion.div variants={fadeInUp} className="flex items-center gap-2 mb-3">
              <Leaf className="w-5 h-5 text-[#2E7D32]" />
              <span className="text-sm font-semibold text-[#2E7D32] uppercase tracking-widest">
                Fresh Basket
              </span>
            </motion.div>
            <motion.h1
              variants={fadeInUp}
              className="text-4xl md:text-5xl font-extrabold text-[#1B5E20] tracking-tight text-balance"
            >
              All Products
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="mt-3 text-gray-600 text-lg max-w-xl leading-relaxed text-pretty"
            >
              Farm-fresh groceries and seasonal produce, delivered to your door. Browse our full selection below.
            </motion.p>
          </motion.div>

          {/* Search bar */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="mt-8 max-w-xl"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search fruits, vegetables, dairy..."
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-green-200 text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/30 focus:border-[#2E7D32] transition-all duration-200 shadow-sm"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </motion.section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters — desktop */}
          <motion.aside
            initial="hidden"
            animate="visible"
            variants={slideInLeftVariant}
            className="hidden lg:block w-64 flex-shrink-0"
          >
            <FilterPanel
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              allCategories={allCategories}
              inStockOnly={inStockOnly}
              setInStockOnly={setInStockOnly}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
            />
          </motion.aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
              <div className="flex items-center gap-3 flex-wrap">
                {/* Mobile filter toggle */}
                <button
                  onClick={() => setShowFilters(true)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-xl border border-green-200 bg-white text-sm font-semibold text-gray-700 hover:border-[#2E7D32] transition-all duration-200 shadow-sm"
                >
                  <Filter className="w-4 h-4 text-[#2E7D32]" />
                  Filters
                </button>
                <span className="text-sm text-gray-500">
                  <span className="font-bold text-gray-800">{filtered.length}</span> products
                </span>
                {/* Active filters */}
                {selectedCategory !== "All" && (
                  <span className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full bg-[#E8F5E9] text-[#2E7D32] border border-green-200">
                    {selectedCategory}
                    <button onClick={() => setSelectedCategory("All")}>
                      <X className="w-3 h-3 ml-0.5" />
                    </button>
                  </span>
                )}
                {inStockOnly && (
                  <span className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full bg-[#E8F5E9] text-[#2E7D32] border border-green-200">
                    In Stock
                    <button onClick={() => setInStockOnly(false)}>
                      <X className="w-3 h-3 ml-0.5" />
                    </button>
                  </span>
                )}
              </div>

              {/* Sort */}
              <div className="relative">
                <button
                  onClick={() => setSortOpen((v) => !v)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-green-200 bg-white text-sm font-semibold text-gray-700 hover:border-[#2E7D32] transition-all duration-200 shadow-sm"
                >
                  <SlidersHorizontal className="w-4 h-4 text-[#2E7D32]" />
                  {currentSortLabel}
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${sortOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {sortOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl border border-black/5 shadow-[0_8px_32px_rgba(0,0,0,0.12)] z-30 overflow-hidden"
                    >
                      {SORT_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => { setSortBy(opt.value); setSortOpen(false); }}
                          className={`w-full flex items-center justify-between px-4 py-3 text-sm transition-colors duration-150 ${
                            sortBy === opt.value
                              ? "bg-[#E8F5E9] text-[#2E7D32] font-bold"
                              : "text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {opt.label}
                          {sortBy === opt.value && <Check className="w-4 h-4" />}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Category pills — mobile/tablet quick filter */}
            <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide lg:hidden">
              {allCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                    selectedCategory === cat
                      ? "bg-[#2E7D32] text-white shadow-md"
                      : "bg-white text-gray-600 border border-green-200 hover:border-[#2E7D32]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Product Grid */}
            {filtered.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-24 text-center"
              >
                <div className="w-20 h-20 rounded-full bg-[#E8F5E9] flex items-center justify-center mb-4">
                  <Search className="w-8 h-8 text-[#2E7D32]" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">No products found</h3>
                <p className="text-gray-500 text-sm max-w-xs">
                  Try adjusting your search or filters to find what you are looking for.
                </p>
                <button
                  onClick={() => { setSearch(""); setSelectedCategory("All"); setInStockOnly(false); setMaxPrice(20); }}
                  className="mt-6 px-6 py-2.5 rounded-full bg-[#2E7D32] text-white text-sm font-bold hover:bg-[#1B5E20] transition-all duration-200"
                >
                  Clear all filters
                </button>
              </motion.div>
            ) : (
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
              >
                {filtered.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                    wishlist={wishlist}
                    onToggleWishlist={handleToggleWishlist}
                  />
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {showFilters && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFilters(false)}
              className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="fixed left-0 top-0 bottom-0 w-80 max-w-[90vw] bg-white z-50 overflow-y-auto shadow-2xl lg:hidden"
            >
              <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <span className="font-extrabold text-gray-900 text-lg">Filters</span>
                <button
                  onClick={() => setShowFilters(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-5">
                <FilterPanel
                  selectedCategory={selectedCategory}
                  setSelectedCategory={(c) => { setSelectedCategory(c); setShowFilters(false); }}
                  allCategories={allCategories}
                  inStockOnly={inStockOnly}
                  setInStockOnly={setInStockOnly}
                  maxPrice={maxPrice}
                  setMaxPrice={setMaxPrice}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Added to cart toast */}
      <AnimatePresence>
        {addedIds.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-[#1B5E20] text-white text-sm font-semibold shadow-[0_8px_32px_rgba(0,0,0,0.2)]"
          >
            <Check className="w-4 h-4 text-green-300" />
            Added to cart
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

const slideInLeftVariant: Variants = {
  hidden: { opacity: 0, x: -24 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

function FilterPanel({
  selectedCategory,
  setSelectedCategory,
  allCategories,
  inStockOnly,
  setInStockOnly,
  maxPrice,
  setMaxPrice,
}: {
  selectedCategory: Category | "All";
  setSelectedCategory: (c: Category | "All") => void;
  allCategories: Array<Category | "All">;
  inStockOnly: boolean;
  setInStockOnly: (v: boolean) => void;
  maxPrice: number;
  setMaxPrice: (v: number) => void;
}) {
  return (
    <div className="space-y-7">
      {/* Categories */}
      <div>
        <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-3">
          Category
        </h3>
        <div className="space-y-1">
          {allCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                selectedCategory === cat
                  ? "bg-[#E8F5E9] text-[#2E7D32]"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <span>{cat}</span>
              {selectedCategory === cat && (
                <Check className="w-4 h-4 text-[#2E7D32]" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Price range */}
      <div>
        <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-3">
          Max Price
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Up to</span>
            <span className="text-sm font-extrabold text-[#2E7D32]">${maxPrice.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min={1}
            max={20}
            step={0.5}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full accent-[#2E7D32] cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-400">
            <span>$1.00</span>
            <span>$20.00</span>
          </div>
        </div>
      </div>

      {/* In stock */}
      <div>
        <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-3">
          Availability
        </h3>
        <label className="flex items-center gap-3 cursor-pointer group">
          <div
            onClick={() => setInStockOnly(!inStockOnly)}
            className={`w-10 h-6 rounded-full transition-all duration-200 flex items-center px-0.5 ${
              inStockOnly ? "bg-[#2E7D32]" : "bg-gray-200"
            }`}
          >
            <motion.div
              animate={{ x: inStockOnly ? 16 : 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
              className="w-5 h-5 rounded-full bg-white shadow-sm"
            />
          </div>
          <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900 transition-colors">
            In stock only
          </span>
        </label>
      </div>

      {/* Ratings filter hint */}
      <div>
        <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-3">
          Top Picks
        </h3>
        <div className="space-y-1">
          {[
            { label: "Organic", badge: "Organic" },
            { label: "On Sale", badge: "Sale" },
            { label: "New Arrivals", badge: "New" },
            { label: "Seasonal", badge: "Seasonal" },
          ].map((item) => (
            <div
              key={item.badge}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-gray-600"
            >
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${badgeColors[item.badge] ?? "bg-gray-100 text-gray-600"}`}>
                {item.badge}
              </span>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Go to cart */}
      <Link
        href="/cart"
        className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-[#2E7D32] text-white text-sm font-bold hover:bg-[#1B5E20] transition-all duration-200 shadow-md hover:shadow-lg"
      >
        <ShoppingCart className="w-4 h-4" />
        View Cart
      </Link>
    </div>
  );
}