"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Leaf, Mail, Phone, MapPin, Camera as Instagram, MessageCircle as Twitter, Globe as Facebook } from 'lucide-react';
import { APP_NAME, APP_EMAIL, APP_PHONE, APP_ADDRESS } from "@/lib/data";
import { fadeInUp, staggerContainer } from "@/lib/motion";
import { useTranslations } from "next-intl";

const shopLinks = [
  { label: "All Products", href: "/shop" },
  { label: "Fresh Fruits", href: "/shop" },
  { label: "Vegetables", href: "/shop" },
  { label: "Dairy & Eggs", href: "/shop" },
  { label: "Bakery", href: "/shop" },
];

const helpLinks = [
  { label: "My Cart", href: "/cart" },
  { label: "Checkout", href: "/checkout" },
  { label: "Order Confirmation", href: "/order-confirmation" },
];

export default function Footer() {
  const t = useTranslations();
  const pathname = usePathname();

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
    if (href.startsWith("#")) {
      if (pathname === "/") {
        e.preventDefault();
        document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
      }
    }
  }

  function resolveHref(href: string) {
    if (href.startsWith("#")) {
      return pathname === "/" ? href : "/" + href;
    }
    return href;
  }

  return (
    <footer className="bg-[#1B5E20] text-white">
      {/* Newsletter strip */}
      <div className="bg-[#2E7D32] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={staggerContainer}
            className="flex flex-col md:flex-row items-center justify-between gap-6"
          >
            <motion.div variants={fadeInUp} className="text-center md:text-left">
              <h3 className="text-xl font-extrabold">
                {t("footer.newsletter.title") || "Get fresh deals in your inbox"}
              </h3>
              <p className="text-green-200 text-sm mt-1">
                {t("footer.newsletter.subtitle") || "Weekly offers, seasonal picks, and exclusive discounts."}
              </p>
            </motion.div>
            <motion.form
              variants={fadeInUp}
              onSubmit={(e) => e.preventDefault()}
              className="flex w-full md:w-auto gap-2"
            >
              <input
                type="email"
                placeholder={t("footer.newsletter.placeholder") || "Your email address"}
                className="flex-1 md:w-64 px-4 py-2.5 rounded-full bg-white/10 border border-white/20 text-white placeholder-green-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#F9A825] transition"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-full bg-[#F9A825] text-white font-bold text-sm hover:bg-[#F57F17] transition-all duration-200 shadow-md hover:shadow-lg whitespace-nowrap"
              >
                {t("footer.newsletter.cta") || "Subscribe"}
              </button>
            </motion.form>
          </motion.div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10"
        >
          {/* Brand */}
          <motion.div variants={fadeInUp} className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-[#F9A825] flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-extrabold tracking-tight">{APP_NAME}</span>
            </Link>
            <p className="text-green-200 text-sm leading-relaxed mb-5">
              {t("footer.brand.description") ||
                "Bringing the freshest produce from local farms straight to your door. Quality you can taste, prices you will love."}
            </p>
            <div className="flex gap-3">
              {[
                { icon: Instagram, label: "Instagram" },
                { icon: Twitter, label: "Twitter" },
                { icon: Facebook, label: "Facebook" },
              ].map(({ icon: Icon, label }) => (
                <motion.a
                  key={label}
                  href="#"
                  whileHover={{ scale: 1.15, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={label}
                  className="w-9 h-9 rounded-full bg-white/10 border border-white/15 flex items-center justify-center hover:bg-[#F9A825] hover:border-[#F9A825] transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Shop links */}
          <motion.div variants={fadeInUp}>
            <h4 className="font-extrabold text-sm uppercase tracking-widest text-green-300 mb-4">
              {t("footer.shop.title") || "Shop"}
            </h4>
            <ul className="space-y-2.5">
              {shopLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={resolveHref(link.href)}
                    onClick={(e) => handleClick(e, link.href)}
                    className="text-green-100 text-sm hover:text-[#F9A825] transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Help links */}
          <motion.div variants={fadeInUp}>
            <h4 className="font-extrabold text-sm uppercase tracking-widest text-green-300 mb-4">
              {t("footer.help.title") || "Help"}
            </h4>
            <ul className="space-y-2.5">
              {helpLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={resolveHref(link.href)}
                    onClick={(e) => handleClick(e, link.href)}
                    className="text-green-100 text-sm hover:text-[#F9A825] transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div variants={fadeInUp}>
            <h4 className="font-extrabold text-sm uppercase tracking-widest text-green-300 mb-4">
              {t("footer.contact.title") || "Contact"}
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-green-100 text-sm">
                <MapPin className="w-4 h-4 mt-0.5 text-[#F9A825] shrink-0" />
                <span>{APP_ADDRESS}</span>
              </li>
              <li className="flex items-center gap-2.5 text-green-100 text-sm">
                <Phone className="w-4 h-4 text-[#F9A825] shrink-0" />
                <a href={`tel:${APP_PHONE}`} className="hover:text-[#F9A825] transition-colors">
                  {APP_PHONE}
                </a>
              </li>
              <li className="flex items-center gap-2.5 text-green-100 text-sm">
                <Mail className="w-4 h-4 text-[#F9A825] shrink-0" />
                <a href={`mailto:${APP_EMAIL}`} className="hover:text-[#F9A825] transition-colors">
                  {APP_EMAIL}
                </a>
              </li>
            </ul>
          </motion.div>
        </motion.div>

        {/* Bottom bar */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-green-300 text-xs"
        >
          <p>
            &copy; {new Date().getFullYear()} {APP_NAME}. {t("footer.rights") || "All rights reserved."}
          </p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-[#F9A825] transition-colors">
              {t("footer.privacy") || "Privacy Policy"}
            </a>
            <a href="#" className="hover:text-[#F9A825] transition-colors">
              {t("footer.terms") || "Terms of Service"}
            </a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}