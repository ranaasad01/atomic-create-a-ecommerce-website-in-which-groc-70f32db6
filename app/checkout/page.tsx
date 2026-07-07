"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { MapPin, Clock, CreditCard, Smartphone, Banknote, ChevronRight, ShieldCheck, Truck, CheckCircle2, Package, ArrowRight, Tag, X } from 'lucide-react';
import { fadeInUp, fadeIn, staggerContainer, scaleIn } from "@/lib/motion";
import { useTranslations } from "next-intl";

// ─── Mock order items ────────────────────────────────────────────────────────
const ORDER_ITEMS = [
  {
    id: "p1",
    name: "Organic Strawberries",
    weight: "500g",
    price: 4.99,
    qty: 2,
    image: "https://modernfarmer.com/wp-content/uploads/2018/07/how-to-grow-strawberries.jpg",
  },
  {
    id: "p2",
    name: "Whole Milk",
    weight: "1L",
    price: 2.49,
    qty: 1,
    image: "https://modernfarmer.com/wp-content/uploads/2018/07/how-to-grow-strawberries.jpg",
  },
  {
    id: "p3",
    name: "Sourdough Bread",
    weight: "800g",
    price: 5.99,
    qty: 1,
    image: "https://i5.walmartimages.com/seo/Great-Value-Whole-Vitamin-D-Milk-Gallon-Plastic-Jug-128-Fl-Oz_6a7b09b4-f51d-4bea-a01c-85767f1b481a.86876244397d83ce6cdedb030abe6e4a.jpeg",
  },
  {
    id: "p4",
    name: "Baby Spinach",
    weight: "200g",
    price: 3.29,
    qty: 3,
    image: "/images/baby-spinach-bag.jpg",
  },
];

const TIME_SLOTS = [
  { id: "ts1", label: "9:00 AM – 11:00 AM", available: true },
  { id: "ts2", label: "11:00 AM – 1:00 PM", available: true },
  { id: "ts3", label: "1:00 PM – 3:00 PM", available: false },
  { id: "ts4", label: "3:00 PM – 5:00 PM", available: true },
  { id: "ts5", label: "5:00 PM – 7:00 PM", available: true },
  { id: "ts6", label: "7:00 PM – 9:00 PM", available: true },
];

const PAYMENT_METHODS = [
  { id: "card", label: "Credit / Debit Card", icon: CreditCard },
  { id: "upi", label: "UPI / Mobile Pay", icon: Smartphone },
  { id: "cod", label: "Cash on Delivery", icon: Banknote },
];

// ─── Checkmark animation variant ─────────────────────────────────────────────
const checkmarkVariant: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut", delay: 0.3 },
  },
};

const circleVariant: Variants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

const pulseRing: Variants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: [1, 1.18, 1],
    opacity: [0.6, 0, 0],
    transition: { duration: 1.4, ease: "easeOut", delay: 0.5, repeat: 2 },
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function calcSubtotal() {
  return ORDER_ITEMS.reduce((sum, item) => sum + item.price * item.qty, 0);
}

const DELIVERY_FEE = 2.99;
const DISCOUNT = 3.0;

export default function CheckoutPage() {
  const t = useTranslations();

  // ── Step state: "checkout" | "confirmation"
  const [step, setStep] = useState<"checkout" | "confirmation">("checkout");
  const [orderNumber] = useState("FB-20847");

  // ── Form state
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    notes: "",
  });

  const [selectedSlot, setSelectedSlot] = useState("ts1");
  const [selectedPayment, setSelectedPayment] = useState("card");
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardName, setCardName] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const subtotal = calcSubtotal();
  const discount = promoApplied ? DISCOUNT : 0;
  const total = subtotal + DELIVERY_FEE - discount;

  function handleFormChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  }

  function applyPromo() {
    if (promoCode.trim().toUpperCase() === "FRESH10") {
      setPromoApplied(true);
    }
  }

  function removePromo() {
    setPromoApplied(false);
    setPromoCode("");
  }

  function validate() {
    const errs: Record<string, string> = {};
    if (!form.firstName.trim()) errs.firstName = "Required";
    if (!form.lastName.trim()) errs.lastName = "Required";
    if (!form.email.trim()) errs.email = "Required";
    if (!form.phone.trim()) errs.phone = "Required";
    if (!form.address.trim()) errs.address = "Required";
    if (!form.city.trim()) errs.city = "Required";
    if (!form.zip.trim()) errs.zip = "Required";
    if (selectedPayment === "card") {
      if (!cardNumber.trim()) errs.cardNumber = "Required";
      if (!cardExpiry.trim()) errs.cardExpiry = "Required";
      if (!cardCvv.trim()) errs.cardCvv = "Required";
      if (!cardName.trim()) errs.cardName = "Required";
    }
    return errs;
  }

  function handlePlaceOrder(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setStep("confirmation");
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  if (step === "confirmation") {
    return <OrderConfirmation orderNumber={orderNumber} total={total} />;
  }

  return (
    <main className="min-h-screen bg-[#F9FBF7] pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="mb-10"
        >
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
            <Link href="/cart" className="hover:text-[#2E7D32] transition-colors">
              Cart
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#2E7D32] font-semibold">Checkout</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#1B5E20] tracking-tight">
            Secure Checkout
          </h1>
          <p className="text-gray-500 mt-1 text-sm flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#2E7D32]" />
            Your information is encrypted and secure.
          </p>
        </motion.div>

        <form onSubmit={handlePlaceOrder} noValidate>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* ── Left column: form ─────────────────────────────────────── */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="lg:col-span-2 space-y-6"
            >
              {/* Delivery Address */}
              <motion.section
                variants={fadeInUp}
                className="bg-white rounded-2xl shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.10)] border border-black/5 p-6 md:p-8"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-9 h-9 rounded-xl bg-[#E8F5E9] flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-[#2E7D32]" />
                  </div>
                  <h2 className="text-lg font-extrabold text-[#1B5E20]">
                    Delivery Address
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field
                    label="First Name"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleFormChange}
                    error={errors.firstName}
                    placeholder="Jane"
                  />
                  <Field
                    label="Last Name"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleFormChange}
                    error={errors.lastName}
                    placeholder="Smith"
                  />
                  <Field
                    label="Email Address"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleFormChange}
                    error={errors.email}
                    placeholder="jane@example.com"
                  />
                  <Field
                    label="Phone Number"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleFormChange}
                    error={errors.phone}
                    placeholder="+1 (555) 000-0000"
                  />
                  <div className="sm:col-span-2">
                    <Field
                      label="Street Address"
                      name="address"
                      value={form.address}
                      onChange={handleFormChange}
                      error={errors.address}
                      placeholder="123 Orchard Lane, Apt 4B"
                    />
                  </div>
                  <Field
                    label="City"
                    name="city"
                    value={form.city}
                    onChange={handleFormChange}
                    error={errors.city}
                    placeholder="San Francisco"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Field
                      label="State"
                      name="state"
                      value={form.state}
                      onChange={handleFormChange}
                      error={errors.state}
                      placeholder="CA"
                    />
                    <Field
                      label="ZIP Code"
                      name="zip"
                      value={form.zip}
                      onChange={handleFormChange}
                      error={errors.zip}
                      placeholder="94103"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Delivery Notes{" "}
                      <span className="font-normal text-gray-400">(optional)</span>
                    </label>
                    <textarea
                      name="notes"
                      value={form.notes}
                      onChange={handleFormChange}
                      rows={2}
                      placeholder="Leave at door, ring bell twice..."
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/30 focus:border-[#2E7D32] transition resize-none"
                    />
                  </div>
                </div>
              </motion.section>

              {/* Delivery Time Slot */}
              <motion.section
                variants={fadeInUp}
                className="bg-white rounded-2xl shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.10)] border border-black/5 p-6 md:p-8"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-9 h-9 rounded-xl bg-[#E8F5E9] flex items-center justify-center">
                    <Clock className="w-5 h-5 text-[#2E7D32]" />
                  </div>
                  <div>
                    <h2 className="text-lg font-extrabold text-[#1B5E20]">
                      Delivery Time Slot
                    </h2>
                    <p className="text-xs text-gray-400 mt-0.5">Today, same-day delivery available</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {TIME_SLOTS.map((slot) => (
                    <motion.button
                      key={slot.id}
                      type="button"
                      whileHover={slot.available ? { scale: 1.02 } : {}}
                      whileTap={slot.available ? { scale: 0.98 } : {}}
                      disabled={!slot.available}
                      onClick={() => slot.available && setSelectedSlot(slot.id)}
                      className={`relative px-3 py-3 rounded-xl border text-sm font-semibold text-center transition-all duration-200 ${
                        !slot.available
                          ? "border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed"
                          : selectedSlot === slot.id
                          ? "border-[#2E7D32] bg-[#E8F5E9] text-[#1B5E20] shadow-sm"
                          : "border-gray-200 bg-white text-gray-600 hover:border-[#2E7D32]/50 hover:bg-[#F1F8E9]"
                      }`}
                    >
                      {slot.label}
                      {!slot.available && (
                        <span className="block text-xs font-normal text-gray-300 mt-0.5">
                          Unavailable
                        </span>
                      )}
                      {selectedSlot === slot.id && slot.available && (
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#2E7D32]" />
                      )}
                    </motion.button>
                  ))}
                </div>
              </motion.section>

              {/* Payment Method */}
              <motion.section
                variants={fadeInUp}
                className="bg-white rounded-2xl shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.10)] border border-black/5 p-6 md:p-8"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-9 h-9 rounded-xl bg-[#E8F5E9] flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-[#2E7D32]" />
                  </div>
                  <h2 className="text-lg font-extrabold text-[#1B5E20]">
                    Payment Method
                  </h2>
                </div>

                <div className="space-y-3 mb-6">
                  {PAYMENT_METHODS.map((method) => {
                    const Icon = method.icon;
                    return (
                      <motion.button
                        key={method.id}
                        type="button"
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => setSelectedPayment(method.id)}
                        className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl border text-left transition-all duration-200 ${
                          selectedPayment === method.id
                            ? "border-[#2E7D32] bg-[#E8F5E9]"
                            : "border-gray-200 bg-white hover:border-[#2E7D32]/40 hover:bg-[#F9FBF7]"
                        }`}
                      >
                        <div
                          className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            selectedPayment === method.id
                              ? "bg-[#2E7D32] text-white"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <span
                          className={`text-sm font-semibold ${
                            selectedPayment === method.id
                              ? "text-[#1B5E20]"
                              : "text-gray-700"
                          }`}
                        >
                          {method.label}
                        </span>
                        <div className="ml-auto">
                          <div
                            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                              selectedPayment === method.id
                                ? "border-[#2E7D32]"
                                : "border-gray-300"
                            }`}
                          >
                            {selectedPayment === method.id && (
                              <div className="w-2 h-2 rounded-full bg-[#2E7D32]" />
                            )}
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Card details */}
                <AnimatePresence>
                  {selectedPayment === "card" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="overflow-hidden"
                    >
                      <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-gray-100 mt-2">
                        <div className="sm:col-span-2">
                          <Field
                            label="Name on Card"
                            name="cardName"
                            value={cardName}
                            onChange={(e) => {
                              setCardName(e.target.value);
                              if (errors.cardName) {
                                setErrors((prev) => {
                                  const n = { ...prev };
                                  delete n.cardName;
                                  return n;
                                });
                              }
                            }}
                            error={errors.cardName}
                            placeholder="Jane Smith"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <Field
                            label="Card Number"
                            name="cardNumber"
                            value={cardNumber}
                            onChange={(e) => {
                              setCardNumber(e.target.value);
                              if (errors.cardNumber) {
                                setErrors((prev) => {
                                  const n = { ...prev };
                                  delete n.cardNumber;
                                  return n;
                                });
                              }
                            }}
                            error={errors.cardNumber}
                            placeholder="4242 4242 4242 4242"
                          />
                        </div>
                        <Field
                          label="Expiry Date"
                          name="cardExpiry"
                          value={cardExpiry}
                          onChange={(e) => {
                            setCardExpiry(e.target.value);
                            if (errors.cardExpiry) {
                              setErrors((prev) => {
                                const n = { ...prev };
                                delete n.cardExpiry;
                                return n;
                              });
                            }
                          }}
                          error={errors.cardExpiry}
                          placeholder="MM / YY"
                        />
                        <Field
                          label="CVV"
                          name="cardCvv"
                          value={cardCvv}
                          onChange={(e) => {
                            setCardCvv(e.target.value);
                            if (errors.cardCvv) {
                              setErrors((prev) => {
                                const n = { ...prev };
                                delete n.cardCvv;
                                return n;
                              });
                            }
                          }}
                          error={errors.cardCvv}
                          placeholder="•••"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {selectedPayment === "upi" && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 rounded-xl bg-[#F1F8E9] border border-[#C8E6C9] text-sm text-[#2E7D32] font-medium"
                  >
                    You will be redirected to your UPI app to complete payment after placing the order.
                  </motion.div>
                )}

                {selectedPayment === "cod" && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 rounded-xl bg-[#FFF8E1] border border-[#FFE082] text-sm text-[#F57F17] font-medium"
                  >
                    Pay with cash when your order arrives. Please keep exact change ready.
                  </motion.div>
                )}
              </motion.section>
            </motion.div>

            {/* ── Right column: order summary ───────────────────────────── */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="lg:col-span-1"
            >
              <div className="bg-white rounded-2xl shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.10)] border border-black/5 p-6 sticky top-24">
                <h2 className="text-lg font-extrabold text-[#1B5E20] mb-5">
                  Order Summary
                </h2>

                {/* Items */}
                <div className="space-y-3 mb-5">
                  {ORDER_ITEMS.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#F1F8E9] flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).style.display = "none";
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          {item.weight} × {item.qty}
                        </p>
                      </div>
                      <span className="text-sm font-bold text-gray-800 flex-shrink-0">
                        ${(item.price * item.qty).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Promo code */}
                <div className="mb-5">
                  {promoApplied ? (
                    <div className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-[#E8F5E9] border border-[#A5D6A7]">
                      <div className="flex items-center gap-2 text-sm font-semibold text-[#2E7D32]">
                        <Tag className="w-4 h-4" />
                        FRESH10 applied
                      </div>
                      <button
                        type="button"
                        onClick={removePromo}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="Promo code (FRESH10)"
                        className="flex-1 px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/30 focus:border-[#2E7D32] transition"
                      />
                      <button
                        type="button"
                        onClick={applyPromo}
                        className="px-4 py-2.5 rounded-xl bg-[#2E7D32] text-white text-sm font-bold hover:bg-[#1B5E20] transition-all duration-200"
                      >
                        Apply
                      </button>
                    </div>
                  )}
                </div>

                {/* Totals */}
                <div className="space-y-2.5 border-t border-gray-100 pt-4 mb-5">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-semibold">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span className="flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5" /> Delivery fee
                    </span>
                    <span className="font-semibold">${DELIVERY_FEE.toFixed(2)}</span>
                  </div>
                  {promoApplied && (
                    <div className="flex justify-between text-sm text-[#2E7D32]">
                      <span>Discount (FRESH10)</span>
                      <span className="font-semibold">-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-extrabold text-[#1B5E20] border-t border-gray-100 pt-3 mt-1">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Place order */}
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full py-3.5 rounded-xl bg-[#2E7D32] text-white font-extrabold text-base shadow-[0_4px_14px_rgba(46,125,50,0.35)] hover:bg-[#1B5E20] transition-all duration-200 flex items-center justify-center gap-2"
                >
                  Place Order
                  <ArrowRight className="w-4 h-4" />
                </motion.button>

                <p className="text-xs text-gray-400 text-center mt-3 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#2E7D32]" />
                  256-bit SSL encrypted checkout
                </p>
              </div>
            </motion.div>
          </div>
        </form>
      </div>
    </main>
  );
}

// ─── Field component ──────────────────────────────────────────────────────────
function Field({
  label,
  name,
  value,
  onChange,
  error,
  placeholder,
  type = "text",
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-semibold text-gray-700 mb-1.5"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-4 py-2.5 rounded-xl border text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 transition ${
          error
            ? "border-red-400 focus:ring-red-200 bg-red-50"
            : "border-gray-200 focus:ring-[#2E7D32]/30 focus:border-[#2E7D32] bg-white"
        }`}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

// ─── Order Confirmation ───────────────────────────────────────────────────────
function OrderConfirmation({
  orderNumber,
  total,
}: {
  orderNumber: string;
  total: number;
}) {
  const steps = [
    { label: "Order Placed", done: true },
    { label: "Being Packed", done: false },
    { label: "Out for Delivery", done: false },
    { label: "Delivered", done: false },
  ];

  return (
    <main className="min-h-screen bg-[#F9FBF7] pt-24 pb-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* Success card */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={scaleIn}
          className="bg-white rounded-3xl shadow-[0_2px_4px_rgba(0,0,0,0.04),0_16px_48px_-12px_rgba(0,0,0,0.14)] border border-black/5 overflow-hidden"
        >
          {/* Full-bleed green header */}
          <div className="relative bg-gradient-to-br from-[#2E7D32] to-[#1B5E20] px-8 py-14 flex flex-col items-center text-center overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/5" />
            <div className="absolute -bottom-16 -left-10 w-56 h-56 rounded-full bg-white/5" />

            {/* Animated checkmark */}
            <div className="relative mb-6">
              {/* Pulse ring */}
              <motion.div
                initial="hidden"
                animate="visible"
                variants={pulseRing}
                className="absolute inset-0 rounded-full bg-white/30"
              />
              {/* Circle */}
              <motion.div
                initial="hidden"
                animate="visible"
                variants={circleVariant}
                className="w-24 h-24 rounded-full bg-white/15 border-2 border-white/40 flex items-center justify-center"
              >
                <svg
                  viewBox="0 0 52 52"
                  className="w-12 h-12"
                  fill="none"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <motion.path
                    d="M14 27 L22 35 L38 18"
                    variants={checkmarkVariant}
                    initial="hidden"
                    animate="visible"
                  />
                </svg>
              </motion.div>
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5, ease: "easeOut" }}
              className="text-3xl font-extrabold text-white tracking-tight"
            >
              Order Confirmed!
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.45, ease: "easeOut" }}
              className="text-green-200 mt-2 text-base"
            >
              Your fresh groceries are being prepared.
            </motion.p>

            {/* Order number badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.75, duration: 0.4, ease: "easeOut" }}
              className="mt-5 px-5 py-2 rounded-full bg-white/15 border border-white/25 text-white text-sm font-bold tracking-wide"
            >
              Order #{orderNumber}
            </motion.div>
          </div>

          {/* Body */}
          <div className="px-8 py-8 space-y-8">
            {/* Estimated delivery */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="flex items-center gap-4 p-4 rounded-2xl bg-[#F1F8E9] border border-[#C8E6C9]"
            >
              <div className="w-12 h-12 rounded-xl bg-[#2E7D32] flex items-center justify-center flex-shrink-0">
                <Truck className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#2E7D32] uppercase tracking-wider">
                  Estimated Delivery
                </p>
                <p className="text-lg font-extrabold text-[#1B5E20] mt-0.5">
                  Today, 3:00 PM – 5:00 PM
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Delivering to your selected address
                </p>
              </div>
            </motion.div>

            {/* Order tracking steps */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              <h2 className="text-sm font-extrabold text-gray-700 uppercase tracking-wider mb-4">
                Order Status
              </h2>
              <div className="relative">
                {/* Track line */}
                <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-gray-100" />
                <div className="space-y-5">
                  {steps.map((s, i) => (
                    <motion.div
                      key={s.label}
                      variants={fadeInUp}
                      className="flex items-center gap-4 relative"
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 border-2 ${
                          s.done
                            ? "bg-[#2E7D32] border-[#2E7D32]"
                            : i === 1
                            ? "bg-white border-[#F9A825]"
                            : "bg-white border-gray-200"
                        }`}
                      >
                        {s.done ? (
                          <CheckCircle2 className="w-4 h-4 text-white" />
                        ) : i === 1 ? (
                          <Package className="w-4 h-4 text-[#F9A825]" />
                        ) : (
                          <div className="w-2 h-2 rounded-full bg-gray-300" />
                        )}
                      </div>
                      <span
                        className={`text-sm font-semibold ${
                          s.done
                            ? "text-[#2E7D32]"
                            : i === 1
                            ? "text-[#F57F17]"
                            : "text-gray-400"
                        }`}
                      >
                        {s.label}
                      </span>
                      {s.done && (
                        <span className="ml-auto text-xs text-gray-400">
                          Just now
                        </span>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Order total */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-100"
            >
              <div>
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
                  Amount Charged
                </p>
                <p className="text-2xl font-extrabold text-[#1B5E20] mt-0.5">
                  ${total.toFixed(2)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
                  Items
                </p>
                <p className="text-lg font-bold text-gray-700 mt-0.5">
                  {ORDER_ITEMS.length} products
                </p>
              </div>
            </motion.div>

            {/* CTA */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-3"
            >
              <Link
                href="/shop"
                className="flex-1 py-3.5 rounded-xl bg-[#2E7D32] text-white font-extrabold text-base text-center shadow-[0_4px_14px_rgba(46,125,50,0.30)] hover:bg-[#1B5E20] transition-all duration-200 flex items-center justify-center gap-2"
              >
                Continue Shopping
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/"
                className="flex-1 py-3.5 rounded-xl bg-[#F1F8E9] text-[#2E7D32] font-extrabold text-base text-center border border-[#C8E6C9] hover:bg-[#E8F5E9] transition-all duration-200"
              >
                Back to Home
              </Link>
            </motion.div>

            <p className="text-xs text-center text-gray-400">
              A confirmation email has been sent to your registered address. Questions? Contact us at{" "}
              <a
                href="mailto:hello@freshbasket.com"
                className="text-[#2E7D32] font-semibold hover:underline"
              >
                hello@freshbasket.com
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </main>
  );
}