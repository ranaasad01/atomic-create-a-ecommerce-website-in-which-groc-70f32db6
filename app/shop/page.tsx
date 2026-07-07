"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Search, SlidersHorizontal, Star, ShoppingCart, X, ChevronDown, Check, Leaf, Filter } from 'lucide-react';
import { useTranslations } from "next-intl";
import { fadeInUp, staggerContainer, scaleIn } from "@/lib/motion";
import type { Category } from "@/lib/data";
import { CATEGORIES } from "@/lib/data";

// ─── Inline product data ────────────────────────────────────────────────────

type Product = {
  id: string;
  name: string;
  category: Category;
  price: number;
  originalPrice?: number;
  weight: string;
  image: string;
  badge?: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  description: string;
};

const PRODUCTS: Product[] = [
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
    reviews: 124,
    inStock: true,
    description: "Crisp, sweet Fuji apples sourced from certified organic orchards.",
  },
  {
    id: "p2",
    name: "Alphonso Mangoes",
    category: "Fruits",
    price: 8.99,
    weight: "500 g",
    image: "https://www.starkbros.com/images/dynamic/6955.jpg",
    badge: "Seasonal",
    rating: 4.9,
    reviews: 87,
    inStock: true,
    description: "The king of mangoes — rich, creamy, and intensely fragrant.",
  },
  {
    id: "p3",
    name: "Strawberries",
    category: "Fruits",
    price: 3.49,
    weight: "250 g",
    image: "/images/fresh-strawberries.jpg",
    rating: 4.7,
    reviews: 203,
    inStock: true,
    description: "Sun-ripened strawberries bursting with natural sweetness.",
  },
  {
    id: "p4",
    name: "Seedless Green Grapes",
    category: "Fruits",
    price: 5.49,
    originalPrice: 6.99,
    weight: "500 g",
    image: "/images/seedless-green-grapes.jpg",
    badge: "Sale",
    rating: 4.6,
    reviews: 91,
    inStock: true,
    description: "Crisp, juicy seedless grapes perfect for snacking.",
  },
  {
    id: "p5",
    name: "Ripe Bananas",
    category: "Fruits",
    price: 1.99,
    weight: "6 pcs",
    image: "/images/ripe-bananas-bunch.jpg",
    rating: 4.5,
    reviews: 312,
    inStock: true,
    description: "Naturally sweet bananas, great for smoothies or a quick snack.",
  },
  {
    id: "p6",
    name: "Blueberries",
    category: "Fruits",
    price: 6.49,
    weight: "200 g",
    image: "https://hips.hearstapps.com/hmg-prod/images/blueberries-in-dish-royalty-free-image-1772132137.pjpeg?crop=0.771xw:1.00xh;0.135xw,0&resize=1200:*",
    badge: "Organic",
    rating: 4.9,
    reviews: 156,
    inStock: true,
    description: "Antioxidant-rich blueberries, hand-picked at peak ripeness.",
  },
  {
    id: "p7",
    name: "Baby Spinach",
    category: "Vegetables",
    price: 2.99,
    weight: "200 g",
    image: "https://www.earthboundfarm.com/wp-content/uploads/2024/04/BabySpinach-Half-10oz-Mockup.jpg",
    badge: "Organic",
    rating: 4.7,
    reviews: 78,
    inStock: true,
    description: "Tender baby spinach leaves, washed and ready to eat.",
  },
  {
    id: "p8",
    name: "Cherry Tomatoes",
    category: "Vegetables",
    price: 3.29,
    weight: "300 g",
    image: "https://picsum.photos/seed/f3ba096c5d3e/800/600",
    rating: 4.8,
    reviews: 145,
    inStock: true,
    description: "Vine-ripened cherry tomatoes with a sweet, tangy flavour.",
  },
  {
    id: "p9",
    name: "Broccoli Crown",
    category: "Vegetables",
    price: 2.49,
    weight: "400 g",
    image: "/images/fresh-broccoli-crown.jpg",
    rating: 4.6,
    reviews: 67,
    inStock: true,
    description: "Firm, vibrant broccoli crowns packed with vitamins.",
  },
  {
    id: "p10",
    name: "Carrots",
    category: "Vegetables",
    price: 1.79,
    weight: "500 g",
    image: "/images/fresh-carrots-bunch.jpg",
    rating: 4.5,
    reviews: 99,
    inStock: true,
    description: "Sweet, crunchy carrots straight from the farm.",
  },
  {
    id: "p11",
    name: "Red Bell Peppers",
    category: "Vegetables",
    price: 3.99,
    originalPrice: 4.99,
    weight: "3 pcs",
    image: "/images/red-bell-peppers.jpg",
    badge: "Sale",
    rating: 4.7,
    reviews: 53,
    inStock: true,
    description: "Bright, meaty red bell peppers ideal for roasting or salads.",
  },
  {
    id: "p12",
    name: "Zucchini",
    category: "Vegetables",
    price: 2.19,
    weight: "2 pcs",
    image: "/images/fresh-zucchini.jpg",
    rating: 4.4,
    reviews: 41,
    inStock: false,
    description: "Tender zucchini, perfect for grilling or spiralizing.",
  },
  {
    id: "p13",
    name: "Full-Fat Milk",
    category: "Dairy",
    price: 2.99,
    weight: "1 L",
    image: "/images/full-fat-milk-bottle.jpg",
    rating: 4.8,
    reviews: 220,
    inStock: true,
    description: "Creamy whole milk from grass-fed cows, pasteurised fresh daily.",
  },
  {
    id: "p14",
    name: "Greek Yogurt",
    category: "Dairy",
    price: 3.49,
    weight: "500 g",
    image: "https://www.daisybeet.com/wp-content/uploads/2024/01/Homemade-Greek-Yogurt-13.jpg",
    badge: "Best Seller",
    rating: 4.9,
    reviews: 188,
    inStock: true,
    description: "Thick, protein-rich Greek yogurt with a clean, tangy taste.",
  },
  {
    id: "p15",
    name: "Cheddar Cheese Block",
    category: "Dairy",
    price: 5.99,
    weight: "200 g",
    image: "/images/cheddar-cheese-block.jpg",
    rating: 4.7,
    reviews: 102,
    inStock: true,
    description: "Aged sharp cheddar with a bold, nutty flavour.",
  },
  {
    id: "p16",
    name: "Sourdough Loaf",
    category: "Bakery",
    price: 4.49,
    weight: "700 g",
    image: "https://i5.walmartimages.com/seo/Great-Value-Whole-Vitamin-D-Milk-Gallon-Plastic-Jug-128-Fl-Oz_6a7b09b4-f51d-4bea-a01c-85767f1b481a.86876244397d83ce6cdedb030abe6e4a.jpeg",
    badge: "Freshly Baked",
    rating: 4.9,
    reviews: 174,
    inStock: true,
    description: "Artisan sourdough with a crisp crust and chewy crumb.",
  },
  {
    id: "p17",
    name: "Croissants",
    category: "Bakery",
    price: 3.99,
    weight: "4 pcs",
    image: "/images/butter-croissants.jpg",
    rating: 4.8,
    reviews: 139,
    inStock: true,
    description: "Buttery, flaky croissants baked fresh every morning.",
  },
  {
    id: "p18",
    name: "Cold Brew Coffee",
    category: "Beverages",
    price: 4.99,
    weight: "330 ml",
    image: "/images/cold-brew-coffee-bottle.jpg",
    badge: "New",
    rating: 4.7,
    reviews: 63,
    inStock: true,
    description: "Smooth, low-acid cold brew steeped for 18 hours.",
  },
  {
    id: "p19",
    name: "Fresh Orange Juice",
    category: "Beverages",
    price: 3.99,
    weight: "1 L",
    image: "/images/fresh-orange-juice.jpg",
    rating: 4.8,
    reviews: 211,
    inStock: true,
    description: "100% freshly squeezed orange juice, no added sugar.",
  },
  {
    id: "p20",
    name: "Mixed Nuts",
    category: "Snacks",
    price: 7.99,
    originalPrice: 9.49,
    weight: "300 g",
    image: "/images/mixed-nuts-bag.jpg",
    badge: "Sale",
    rating: 4.6,
    reviews: 88,
    inStock: true,
    description: "A premium blend of cashews, almonds, walnuts, and pecans.",
  },
  {
    id: "p21",
    name: "Rice Cakes",
    category: "Snacks",
    price: 2.49,
    weight: "130 g",
    image: "/images/rice-cakes-pack.jpg",
    rating: 4.3,
    reviews: 55,
    inStock: true,
    description: "Light, crispy rice cakes — a guilt-free snack any time.",
  },
  {
    id: "p22",
    name: "Watermelon",
    category: "Fruits",
    price: 6.99,
    weight: "2 kg",
    image: "/images/fresh-watermelon.jpg",
    rating: 4.8,
    reviews: 97,
    inStock: true,
    description: "Juicy, seedless watermelon — the ultimate summer refresher.",
  },
  {
    id: "p23",
    name: "Kale Bunch",
    category: "Vegetables",
    price: 2.29,
    weight: "200 g",
    image: "/images/fresh-kale-bunch.jpg",
    badge: "Organic",
    rating: 4.5,
    reviews: 44,
    inStock: true,
    description: "Nutrient-dense curly kale, great for salads and smoothies.",
  },
  {
    id: "p24",
    name: "Granola Bar",
    category: "Snacks",
    price: 1.99,
    weight: "50 g",
    image: "/images/granola-bar-oat.jpg",
    rating: 4.4,
    reviews: 72,
    inStock: true,
    description: "Wholesome oat and honey granola bar for on-the-go energy.",
  },
];

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
  { value: "name", label: "Name A–Z" },
];

const PRICE_RANGES = [
  { label: "Under $3", min: 0, max: 3 },
  { label: "$3 – $6", min: 3, max: 6 },
  { label: "$6 – $10", min: 6, max: 10 },
  { label: "Over $10", min: 10, max: Infinity },
];

// ─── Star rating component ───────────────────────────────────────────────────

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-3.5 h-3.5 ${
            star <= Math.round(rating)
              ? "fill-[#F9A825] text-[#F9A825]"
              : "fill-gray-200 text-gray-200"
          }`}
        />
      ))}
    </div>
  );
}

// ─── Product card ────────────────────────────────────────────────────────────

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

function ProductCard({ product }: { product: Product }) {
  const [added, setAdded] = useState(false);

  const handleAddToCart = useCallback(() => {
    try {
      const stored = localStorage.getItem("freshbasket_cart");
      const cart: Array<Product & { quantity: number }> = stored
        ? JSON.parse(stored)
        : [];
      const idx = cart.findIndex((i) => i.id === product.id);
      if (idx >= 0) {
        cart[idx].quantity = (cart[idx].quantity ?? 0) + 1;
      } else {
        cart.push({ ...product, quantity: 1 });
      }
      localStorage.setItem("freshbasket_cart", JSON.stringify(cart));
      window.dispatchEvent(new Event("cart_updated"));
      setAdded(true);
      setTimeout(() => setAdded(false), 1600);
    } catch {
      // silently fail
    }
  }, [product]);

  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) *
            100
        )
      : null;

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group relative bg-white rounded-2xl overflow-hidden border border-black/5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.10)] flex flex-col"
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-[#F1F8E9] aspect-[4/3]">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              "https://images.stockcake.com/public/7/8/f/78f27b46-a70c-4a90-9af4-9a1d29a85a8b_medium/farmer-harvesting-vegetables-stockcake.jpg";
          }}
        />
        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
          {product.badge && (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#2E7D32] text-white shadow-sm">
              {product.badge}
            </span>
          )}
          {discount && (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#F9A825] text-white shadow-sm">
              -{discount}%
            </span>
          )}
        </div>
        {!product.inStock && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="px-3 py-1 rounded-full bg-gray-800 text-white text-xs font-semibold">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        <span className="text-xs font-semibold text-[#2E7D32] uppercase tracking-wide">
          {product.category}
        </span>
        <h3 className="text-sm font-bold text-gray-900 leading-snug line-clamp-2">
          {product.name}
        </h3>
        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 flex-1">
          {product.description}
        </p>

        <div className="flex items-center gap-1.5 mt-1">
          <StarRating rating={product.rating} />
          <span className="text-xs text-gray-400">
            ({product.reviews})
          </span>
        </div>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-extrabold text-gray-900">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-gray-400 line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
            <span className="text-xs text-gray-400">{product.weight}</span>
          </div>
        </div>

        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className={`mt-2 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
            added
              ? "bg-[#1B5E20] text-white"
              : product.inStock
              ? "bg-[#2E7D32] text-white hover:bg-[#1B5E20] shadow-[0_2px_8px_rgba(46,125,50,0.30)] hover:shadow-[0_4px_16px_rgba(46,125,50,0.40)]"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
        >
          {added ? (
            <>
              <Check className="w-4 h-4" />
              Added
            </>
          ) : (
            <>
              <ShoppingCart className="w-4 h-4" />
              Add to Cart
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}

// ─── Main page ───────────────────────────────────────────────────────────────

export default function ShopPage() {
  const t = useTranslations();

  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<number | null>(
    null
  );
  const [sortBy, setSortBy] = useState("featured");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [onlyOnSale, setOnlyOnSale] = useState(false);

  const toggleCategory = useCallback((cat: Category) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  }, []);

  const clearFilters = useCallback(() => {
    setSelectedCategories([]);
    setSelectedPriceRange(null);
    setOnlyInStock(false);
    setOnlyOnSale(false);
    setSearch("");
  }, []);

  const filtered = useMemo(() => {
    let list = [...PRODUCTS];

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    if (selectedCategories.length > 0) {
      list = list.filter((p) => selectedCategories.includes(p.category));
    }

    if (selectedPriceRange !== null) {
      const range = PRICE_RANGES[selectedPriceRange];
      if (range) {
        list = list.filter(
          (p) => p.price >= range.min && p.price < range.max
        );
      }
    }

    if (onlyInStock) {
      list = list.filter((p) => p.inStock);
    }

    if (onlyOnSale) {
      list = list.filter(
        (p) => p.originalPrice !== undefined && p.originalPrice > p.price
      );
    }

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
  }, [search, selectedCategories, selectedPriceRange, sortBy, onlyInStock, onlyOnSale]);

  const activeFilterCount =
    selectedCategories.length +
    (selectedPriceRange !== null ? 1 : 0) +
    (onlyInStock ? 1 : 0) +
    (onlyOnSale ? 1 : 0);

  const categoryCounts = useMemo(() => {
    const counts: Partial<Record<Category, number>> = {};
    for (const cat of CATEGORIES) {
      counts[cat] = PRODUCTS.filter((p) => p.category === cat).length;
    }
    return counts;
  }, []);

  // ── Sidebar content (shared between desktop + mobile drawer) ──────────────

  const SidebarContent = () => (
    <div className="flex flex-col gap-6">
      {/* Categories */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
          Categories
        </h3>
        <ul className="flex flex-col gap-1">
          {CATEGORIES.map((cat) => {
            const active = selectedCategories.includes(cat);
            return (
              <li key={cat}>
                <button
                  onClick={() => toggleCategory(cat)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    active
                      ? "bg-[#E8F5E9] text-[#2E7D32] font-bold"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {active && <Check className="w-3.5 h-3.5 text-[#2E7D32]" />}
                    {!active && <span className="w-3.5 h-3.5" />}
                    {cat}
                  </span>
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded-full ${
                      active
                        ? "bg-[#2E7D32] text-white"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {categoryCounts[cat] ?? 0}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-100" />

      {/* Price range */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
          Price Range
        </h3>
        <ul className="flex flex-col gap-1">
          {PRICE_RANGES.map((range, idx) => {
            const active = selectedPriceRange === idx;
            return (
              <li key={range.label}>
                <button
                  onClick={() =>
                    setSelectedPriceRange(active ? null : idx)
                  }
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    active
                      ? "bg-[#E8F5E9] text-[#2E7D32] font-bold"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  {active ? (
                    <Check className="w-3.5 h-3.5 text-[#2E7D32]" />
                  ) : (
                    <span className="w-3.5 h-3.5" />
                  )}
                  {range.label}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-100" />

      {/* Availability & Sale */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
          Availability
        </h3>
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
            <input
              type="checkbox"
              checked={onlyInStock}
              onChange={(e) => setOnlyInStock(e.target.checked)}
              className="w-4 h-4 accent-[#2E7D32] rounded"
            />
            <span className="text-sm text-gray-700 font-medium">In Stock Only</span>
          </label>
          <label className="flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
            <input
              type="checkbox"
              checked={onlyOnSale}
              onChange={(e) => setOnlyOnSale(e.target.checked)}
              className="w-4 h-4 accent-[#2E7D32] rounded"
            />
            <span className="text-sm text-gray-700 font-medium">On Sale</span>
          </label>
        </div>
      </div>

      {/* Clear filters */}
      {activeFilterCount > 0 && (
        <button
          onClick={clearFilters}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-red-200 text-red-500 text-sm font-semibold hover:bg-red-50 transition-all duration-200"
        >
          <X className="w-4 h-4" />
          Clear All Filters
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      {/* ── Page header ─────────────────────────────────────────────────── */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="bg-gradient-to-br from-[#1B5E20] to-[#2E7D32] text-white pt-28 pb-12 px-4"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-green-300 text-sm mb-3">
            <Leaf className="w-4 h-4" />
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-white font-medium">Shop</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-balance">
            All Products
          </h1>
          <p className="mt-3 text-green-200 text-lg max-w-xl leading-relaxed">
            Fresh groceries, seasonal fruits, and pantry staples — sourced daily
            from local farms and trusted suppliers.
          </p>

          {/* Search bar */}
          <div className="mt-6 relative max-w-lg">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-300 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products, categories..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/15 border border-white/20 text-white placeholder-green-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#F9A825] focus:bg-white/20 transition-all duration-200"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-green-300 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* ── Body ────────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex gap-8">
          {/* ── Desktop sidebar ─────────────────────────────────────────── */}
          <aside className="hidden lg:block w-60 flex-shrink-0">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="sticky top-24 bg-white rounded-2xl border border-black/5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.08)] p-5"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-sm font-extrabold text-gray-900 flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#2E7D32]" />
                  Filters
                </h2>
                {activeFilterCount > 0 && (
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#2E7D32] text-white">
                    {activeFilterCount}
                  </span>
                )}
              </div>
              <SidebarContent />
            </motion.div>
          </aside>

          {/* ── Main content ─────────────────────────────────────────────── */}
          <div className="flex-1 min-w-0">
            {/* Top bar */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="flex flex-wrap items-center justify-between gap-3 mb-6"
            >
              <div className="flex items-center gap-3">
                {/* Mobile filter button */}
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-black/8 text-sm font-semibold text-gray-700 hover:bg-gray-50 shadow-sm transition-all duration-200"
                >
                  <Filter className="w-4 h-4 text-[#2E7D32]" />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="w-5 h-5 rounded-full bg-[#2E7D32] text-white text-xs font-bold flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                </button>

                <p className="text-sm text-gray-500">
                  <span className="font-bold text-gray-900">{filtered.length}</span>{" "}
                  {filtered.length === 1 ? "product" : "products"} found
                </p>
              </div>

              {/* Sort */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none pl-4 pr-9 py-2.5 rounded-xl bg-white border border-black/8 text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2E7D32] shadow-sm cursor-pointer transition-all duration-200"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </motion.div>

            {/* Active filter chips */}
            <AnimatePresence>
              {(selectedCategories.length > 0 ||
                selectedPriceRange !== null ||
                onlyInStock ||
                onlyOnSale) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex flex-wrap gap-2 mb-5 overflow-hidden"
                >
                  {selectedCategories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => toggleCategory(cat)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#E8F5E9] text-[#2E7D32] text-xs font-bold hover:bg-[#C8E6C9] transition-colors"
                    >
                      {cat}
                      <X className="w-3 h-3" />
                    </button>
                  ))}
                  {selectedPriceRange !== null && PRICE_RANGES[selectedPriceRange] && (
                    <button
                      onClick={() => setSelectedPriceRange(null)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFF8E1] text-[#F57F17] text-xs font-bold hover:bg-[#FFECB3] transition-colors"
                    >
                      {PRICE_RANGES[selectedPriceRange].label}
                      <X className="w-3 h-3" />
                    </button>
                  )}
                  {onlyInStock && (
                    <button
                      onClick={() => setOnlyInStock(false)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#E8F5E9] text-[#2E7D32] text-xs font-bold hover:bg-[#C8E6C9] transition-colors"
                    >
                      In Stock
                      <X className="w-3 h-3" />
                    </button>
                  )}
                  {onlyOnSale && (
                    <button
                      onClick={() => setOnlyOnSale(false)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFF8E1] text-[#F57F17] text-xs font-bold hover:bg-[#FFECB3] transition-colors"
                    >
                      On Sale
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Product grid */}
            <AnimatePresence mode="wait">
              {filtered.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  className="flex flex-col items-center justify-center py-24 text-center"
                >
                  <div className="w-16 h-16 rounded-2xl bg-[#E8F5E9] flex items-center justify-center mb-4">
                    <Search className="w-8 h-8 text-[#2E7D32]" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    No products found
                  </h3>
                  <p className="text-gray-500 text-sm max-w-xs">
                    Try adjusting your search or filters to find what you are
                    looking for.
                  </p>
                  <button
                    onClick={clearFilters}
                    className="mt-5 px-5 py-2.5 rounded-xl bg-[#2E7D32] text-white text-sm font-bold hover:bg-[#1B5E20] transition-all duration-200"
                  >
                    Clear Filters
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="grid"
                  initial="hidden"
                  animate="visible"
                  variants={staggerContainer}
                  className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
                >
                  {filtered.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ── Mobile filter drawer ─────────────────────────────────────────── */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            />
            <motion.div
              key="drawer"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 bottom-0 w-72 bg-white z-50 lg:hidden overflow-y-auto shadow-2xl"
            >
              <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <h2 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#2E7D32]" />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#2E7D32] text-white">
                      {activeFilterCount}
                    </span>
                  )}
                </h2>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  <X className="w-4 h-4 text-gray-600" />
                </button>
              </div>
              <div className="p-5">
                <SidebarContent />
              </div>
              <div className="p-5 border-t border-gray-100">
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="w-full py-3 rounded-xl bg-[#2E7D32] text-white font-bold text-sm hover:bg-[#1B5E20] transition-all duration-200"
                >
                  Show {filtered.length} Results
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}