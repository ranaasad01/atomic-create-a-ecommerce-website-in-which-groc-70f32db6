"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Menu, X, Search, Leaf } from 'lucide-react';
import { navLinks, APP_NAME } from "@/lib/data";
import { useTranslations } from "next-intl";

export default function Navbar() {
  const t = useTranslations();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const update = () => {
      try {
        const stored = localStorage.getItem("freshbasket_cart");
        if (stored) {
          const items = JSON.parse(stored) as Array<{ quantity: number }>;
          setCartCount(items.reduce((s, i) => s + i.quantity, 0));
        } else {
          setCartCount(0);
        }
      } catch {
        setCartCount(0);
      }
    };
    update();
    window.addEventListener("storage", update);
    window.addEventListener("cart_updated", update);
    return () => {
      window.removeEventListener("storage", update);
      window.removeEventListener("cart_updated", update);
    };
  }, []);

  function handleNavClick(
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) {
    if (href.startsWith("#")) {
      if (pathname === "/") {
        e.preventDefault();
        document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
      }
    }
    setMenuOpen(false);
  }

  function resolveHref(href: string) {
    if (href.startsWith("#")) {
      return pathname === "/" ? href : "/" + href;
    }
    return href;
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-[0_2px_16px_rgba(0,0,0,0.08)]"
          : "bg-white/90 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-18">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ rotate: 15, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="w-9 h-9 rounded-xl bg-[#2E7D32] flex items-center justify-center shadow-md"
            >
              <Leaf className="w-5 h-5 text-white" />
            </motion.div>
            <span className="text-xl font-extrabold text-[#1B5E20] tracking-tight">
              {APP_NAME}
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={resolveHref(link.href)}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`relative px-4 py-2 rounded-full text-sm font-700 font-bold transition-all duration-200 ${
                    isActive
                      ? "text-[#2E7D32] bg-[#E8F5E9]"
                      : "text-gray-600 hover:text-[#2E7D32] hover:bg-[#F1F8E9]"
                  }`}
                >
                  {t(`nav.${link.label.toLowerCase()}`) || link.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-[#E8F5E9] -z-10"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <Link
              href="/shop"
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-full text-gray-500 hover:text-[#2E7D32] hover:bg-[#F1F8E9] transition-all duration-200"
              aria-label="Search products"
            >
              <Search className="w-4 h-4" />
            </Link>

            <Link
              href="/cart"
              className="relative flex items-center gap-1.5 px-3 py-2 rounded-full text-gray-600 hover:text-[#2E7D32] hover:bg-[#F1F8E9] transition-all duration-200"
              aria-label="Shopping cart"
            >
              <ShoppingCart className="w-5 h-5" />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    key="badge"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-[#F9A825] text-white text-[10px] font-extrabold flex items-center justify-center shadow"
                  >
                    {cartCount > 9 ? "9+" : cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            <Link
              href="/checkout"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#2E7D32] text-white text-sm font-bold hover:bg-[#1B5E20] transition-all duration-200 shadow-md hover:shadow-lg"
            >
              {t("nav.order") || "Order Now"}
            </Link>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="md:hidden p-2 rounded-full text-gray-600 hover:bg-[#F1F8E9] transition-all"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <nav className="px-4 py-3 flex flex-col gap-1">
              {navLinks.map((link) => {
                const isActive =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={resolveHref(link.href)}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className={`px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                      isActive
                        ? "text-[#2E7D32] bg-[#E8F5E9]"
                        : "text-gray-600 hover:text-[#2E7D32] hover:bg-[#F1F8E9]"
                    }`}
                  >
                    {t(`nav.${link.label.toLowerCase()}`) || link.label}
                  </Link>
                );
              })}
              <Link
                href="/checkout"
                onClick={() => setMenuOpen(false)}
                className="mt-2 px-4 py-3 rounded-xl bg-[#2E7D32] text-white text-sm font-bold text-center hover:bg-[#1B5E20] transition-all"
              >
                {t("nav.order") || "Order Now"}
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}