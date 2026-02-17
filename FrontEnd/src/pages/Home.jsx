"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Zap,
  FileText,
  Download,
  Shield,
  Clock,
  Users,
  Star,
  CheckCircle,
  ArrowRight,
  Menu,
  X,
  TrendingUp, 
  Sparkles// AI Insights के लिए नया आइकन
} from "lucide-react";
import { Link } from "react-router-dom";

// --- Typing Text Component ---
const TypingText = ({ phrases }) => {
  const [index, setIndex] = useState(0); // Which phrase in the array
  const [subIndex, setSubIndex] = useState(0); // Which letter in the phrase
  const [reverse, setReverse] = useState(false); // Whether to type or delete

  // Typing speed configuration
  const TYPING_SPEED = 100;
  const DELETING_SPEED = 50;
  const PAUSE_DURATION = 1500;

  useEffect(() => {
    if (index >= phrases.length) {
      setIndex(0); // Cycle phrases
    }

    let speed = reverse ? DELETING_SPEED : TYPING_SPEED;
    let timeout;
    const currentPhrase = phrases[index];

    if (!reverse && subIndex === currentPhrase.length) {
      // Finished typing the current phrase
      speed = PAUSE_DURATION;
      timeout = setTimeout(() => setReverse(true), speed);
    } else if (reverse && subIndex === 0) {
      // Finished deleting, move to the next phrase
      setReverse(false);
      setIndex((prev) => (prev + 1) % phrases.length);
    } else {
      // Typing or Deleting character
      timeout = setTimeout(() => {
        setSubIndex((prev) => prev + (reverse ? -1 : 1));
      }, speed);
    }

    return () => clearTimeout(timeout);
  }, [subIndex, index, reverse, phrases]);

  // Framer Motion cursor blink animation
  const cursorVariants = {
    blinking: {
      opacity: [0, 1, 1, 0],
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "easeInOut",
        times: [0, 0.5, 0.7, 1],
      },
    },
  };

  const currentText = phrases[index].substring(0, subIndex);

  return (
    // Cleaned up className string to avoid potential concatenation issues
    <span className="text-transparent bg-clip-text bg-gradient-to-r from-black to-gray-600 relative inline-block text-3xl md:text-5xl">
      {currentText}
      <motion.span
        className="ml-1 inline-block w-1.5 bg-black align-baseline"
        style={{ height: "1.1em" }}
        variants={cursorVariants}
        animate="blinking"
      >
        &nbsp;
      </motion.span>
    </span>
  );
};
// --- End Typing Text Component ---

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [invoiceStep, setInvoiceStep] = useState(0);

  // Phrases for the typing animation (More impactful and AI-focused)
  const animationPhrases = [
    "Automate Billing with AI.",
    "Predict Cashflow.",
    "Smart Payment Tracking.",
    "Stay Compliance Ready.",
  ];

  // Data for the animated invoice card
  const invoiceSteps = [
    // Step 0: Blank state (Quick transition for reset)
    { title: "Invoice", total: "$0.00", items: [] },
    // Step 1: First item entry
    {
      title: "Invoice #9021",
      total: "$250.00",
      items: [{ desc: "Web Design Fee", amount: "$250.00" }],
    },
    // Step 2: Multiple items entry
    {
      title: "Invoice #9022",
      total: "$1,500.00",
      items: [
        { desc: "App Development (Phase 1)", amount: "$1,000.00" },
        { desc: "Maintenance Support", amount: "$500.00" },
      ],
    },
    // Step 3: Different entry
    {
      title: "Invoice #9023",
      total: "$75.00",
      items: [{ desc: "Consulting Hour (1)", amount: "$75.00" }],
    },
  ];

  const currentInvoice = invoiceSteps[invoiceStep % invoiceSteps.length];

  // Logic for cycling the invoice card content
  useEffect(() => {
    const isBlankStep = invoiceStep % invoiceSteps.length === 0;
    // Short delay for the blank state, longer for the filled states
    const cycleTime = isBlankStep ? 1000 : 3000;

    const timer = setTimeout(() => {
      setInvoiceStep((prevStep) => prevStep + 1);
    }, cycleTime);

    return () => clearTimeout(timer);
  }, [invoiceStep, invoiceSteps.length]);

  const floatingAnimation = {
    y: [0, -15, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut",
    },
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen font-sans">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 w-full z-50 backdrop-blur-lg bg-white/90 border-b border-gray-200"
      >
        {/* Responsive Padding: px-4 default, sm:px-6 wider */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-black">
            Invoice<span className="text-gray-600">Gen</span>
          </div>

          <div className="hidden md:flex items-center gap-10">
            <a
              href="#features"
              className="text-gray-700 hover:text-black transition"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="text-gray-700 hover:text-black transition"
            >
              Pricing
            </a>
            <a
              href="#testimonials"
              className="text-gray-700 hover:text-black transition"
            >
              Reviews
            </a>
            <button className="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition hover:shadow-xl">
             <Link to={"/signUp"}>Get Started Free</Link> 
            </button>
          </div>

          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-white border-t border-gray-200"
          >
            <div className="px-4 sm:px-6 py-8 flex flex-col gap-6">
              <a href="#features" className="text-gray-700 text-lg">
                Features
              </a>
              <a href="#pricing" className="text-gray-700 text-lg">
                Pricing
              </a>
              <a href="#testimonials" className="text-gray-700 text-lg">
                Reviews
              </a>
              <button className="bg-black text-white px-8 py-4 rounded-full text-lg">
              <Link to={"/signUp"}>
                Get Started Free
                </Link>
              </button>
            </div>
          </motion.div>
        )}
      </motion.nav>

      {/* Hero Section (Updated with Animated Invoice Card) */}
      <section className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center px-4 sm:px-6 pt-20">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center w-full">
          {" "}
          {/* Ensure grid container is full width */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              visible: { transition: { staggerChildren: 0.2 } },
            }}
            className="w-full" // Ensure content column is full width
          >
            {/* Professional AI Powered Tag */}
            <motion.div variants={textVariants}>
              {/* <span className="text-sm md:text-lg font-bold text-white bg-black/80 px-4 py-1.5 rounded-full inline-flex items-center gap-3 mb-4 uppercase tracking-wider shadow-md">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>{" "}
                AI POWERED INVOICE GENERATOR
              </span> */}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-full mb-8 border border-gray-200"
            >
              <Sparkles className="w-4 h-4 text-black" />
              <span className="text-sm font-semibold">AI-Powered Invoice Generation</span>
            </motion.div>
            <motion.h1
              variants={textVariants}
              className="text-3xl md:text-5xl font-bold text-black leading-tight"
            >
              Generate Professional
              <br />
              {/* === Typing Animation Integrated Here === */}
              <TypingText phrases={animationPhrases} />
              {/* ======================================= */}
            </motion.h1>

            <motion.p
              variants={textVariants}
              className="text-xl text-gray-600 mt-8 leading-relaxed"
            >
              The fastest way for modern businesses to create, send, and track
              stunning invoices.
            </motion.p>

            <motion.div
              variants={textVariants}
              className="mt-10 flex flex-col sm:flex-row gap-6 w-full"
            >
              <button className="bg-black text-white px-10 py-5 rounded-full text-lg font-semibold hover:bg-gray-800 transition hover:shadow-2xl flex items-center justify-center gap-3 group w-full sm:w-auto">
              <Link to={"/signUp"}>
                Start Generating Free
              </Link>
                <ArrowRight className="group-hover:translate-x-2 transition" />
              </button>
              <button className="border-2 border-black text-black px-10 py-5 rounded-full text-lg font-semibold hover:bg-black hover:text-white transition w-full sm:w-auto">
                Watch Demo
              </button>
            </motion.div>

            {/* Hidden on small screens (like 320px), visible from md: */}
            <motion.div
              variants={textVariants}
              className="mt-12 md:flex items-center gap-8 w-full hidden"
            >
              {/* Profile Image Stack */}
              <div className="flex pl-3">
                {[1, 2, 3, 4].map((i) => (
                  <img
                    key={i}
                    src={`https://randomuser.me/api/portraits/men/${
                      i + 10
                    }.jpg`}
                    alt=""
                    className="w-12 h-12 rounded-full border-4 border-white object-cover"
                    style={{ marginLeft: i > 0 ? "-1rem" : "0" }}
                  />
                ))}
              </div>
              <div>
                <p className="text-gray-700 font-medium">
                  Join 50,000+ businesses
                </p>
                <div className="flex gap-1 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-black text-black" />
                  ))}
                  <span className="ml-2 text-gray-600">4.9/5</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
          {/* Animated Invoice Mockup */}
          <motion.div
            animate={floatingAnimation}
            className="relative hidden md:block w-full max-w-sm mx-auto"
          >
            <motion.div
              key={currentInvoice.title + invoiceStep} // Key change forces animation reset on content change
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-200 hover:shadow-2xl transition-shadow w-full"
              style={{
                transform: `rotate(${(invoiceStep % 4) * 2 - 4}deg)`, // Subtle dynamic rotation
              }}
            >
              <div className="space-y-6">
                <motion.h3
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.8 }}
                  className="text-2xl font-bold text-gray-800 h-8 flex items-center overflow-hidden whitespace-nowrap"
                >
                  {currentInvoice.title}
                </motion.h3>

                {/* Invoice Items */}
                <div className="space-y-4 min-h-[100px]">
                  {currentInvoice.items.length > 0 ? (
                    currentInvoice.items.map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 * i }}
                        className="flex justify-between items-center"
                      >
                        <div className="text-gray-600 truncate w-3/5">
                          {item.desc}
                        </div>
                        <div className="text-gray-800 font-medium w-1/5 text-right">
                          {item.amount}
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    // Placeholder animation for blank state
                    <>
                      <div className="h-6 bg-gray-100 rounded w-full animate-pulse"></div>
                      <div className="h-6 bg-gray-100 rounded w-4/5 animate-pulse"></div>
                      <div className="h-6 bg-gray-100 rounded w-3/5 animate-pulse"></div>
                    </>
                  )}
                </div>

                {/* Total */}
                <div className="border-t-2 border-dashed border-gray-300 pt-6">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      delay: currentInvoice.items.length > 0 ? 0.5 : 0,
                    }}
                    className="flex justify-between text-2xl font-extrabold text-black"
                  >
                    <span>TOTAL DUE</span>
                    <span>{currentInvoice.total}</span>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 sm:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-black">
              Why Businesses Love Us
            </h2>
            <p className="text-xl text-gray-600 mt-6">
              Everything you need to manage invoices like a pro
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                icon: Zap,
                title: "Lightning Fast",
                desc: "Generate invoices in under 10 seconds",
              },
              {
                icon: Download,
                title: "PDF Export",
                desc: "Professional PDF with your logo & Tax ID",
              },
              {
                icon: Shield,
                title: "100% Secure",
                desc: "Bank-grade encryption for your data",
              },
              {
                icon: Clock,
                title: "Payment Reminders",
                desc: "Auto reminders for pending payments",
              },
              {
                icon: FileText,
                title: "Compliance Ready",
                desc: "Tax codes & breakdown included",
              },
              // --- UPDATED FEATURE ---
              {
                icon: TrendingUp,
                title: "AI Insights",
                desc: "Predict cashflow and track spending with smart analysis",
              },
              // --- /UPDATED FEATURE ---
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-3xl border border-gray-200 hover:shadow-2xl transition group"
              >
                <feature.icon className="w-14 h-14 text-black mb-6 group-hover:scale-110 transition" />
                <h3 className="text-2xl font-bold text-black mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-lg">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section (Responsive & Decreased Size) */}
      <section
        id="pricing"
        className="py-24 px-4 sm:px-6 bg-gradient-to-b from-gray-50 to-white"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-black">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 mt-6">
              Choose the perfect plan for your business
            </p>
          </motion.div>

          {/* FIX: Changed grid to single column on mobile (grid-cols-1) and three columns on medium/desktop (md:grid-cols-3) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                plan: "Free",
                price: "$0",
                desc: "Perfect for freelancers",
                features: [
                  "50 invoices/month",
                  "Basic templates",
                  "PDF export",
                  "Email support",
                ],
              },
              {
                plan: "Pro",
                price: "$49.99",
                desc: "Most Popular",
                popular: true,
                features: [
                  "Unlimited invoices",
                  "Custom branding",
                  "Payment gateway",
                  "Priority support",
                  "Analytics",
                ],
              },
              {
                plan: "Enterprise",
                price: "Custom",
                desc: "For large teams",
                features: [
                  "Everything in Pro",
                  "API access",
                  "White labeling",
                  "Dedicated manager",
                  "SLA guarantee",
                ],
              },
            ].map((p, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }} // Reduced hover lift
                className={`relative bg-white rounded-2xl p-6 border-2 ${
                  p.popular ? "border-black shadow-xl" : "border-gray-200"
                } transition`} // Reduced padding (p-10 -> p-6) and rounding (rounded-3xl -> rounded-2xl), reduced shadow
              >
                {p.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-1.5 rounded-full text-xs font-bold">
                    {" "}
                    {/* Reduced badge size */}
                    MOST POPULAR
                  </div>
                )}
                <h3 className="text-2xl font-bold text-black">{p.plan}</h3>{" "}
                {/* Reduced title size */}
                {/* FIX: Reduced price size (text-5xl -> text-4xl) */}
                <p className="text-4xl font-bold text-black mt-3">
                  {p.price}
                  <span className="text-lg text-gray-600">/month</span>
                </p>
                <p className="text-gray-600 mt-3 text-sm">{p.desc}</p>{" "}
                {/* Reduced description size */}
                <ul className="mt-8 space-y-4">
                  {" "}
                  {/* Reduced top margin and vertical spacing */}
                  {p.features.map((f, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      {" "}
                      {/* Reduced gap */}
                      <CheckCircle className="w-5 h-5 text-black" />{" "}
                      {/* Reduced icon size */}
                      <span className="text-gray-700 text-sm">{f}</span>{" "}
                      {/* Reduced feature text size */}
                    </li>
                  ))}
                </ul>
                <button
                  className={`mt-8 w-full py-4 rounded-full text-base font-bold transition ${
                    // Reduced top margin, padding, and text size
                    p.popular
                      ? "bg-black text-white hover:bg-gray-800"
                      : "bg-gray-100 text-black hover:bg-gray-200"
                  }`}
                >
                  {p.plan === "Free"
                    ? "Get Started"
                    : p.plan === "Enterprise"
                    ? "Contact Sales"
                    : "Start Pro Trial"}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials (Redesigned) */}
      <section id="testimonials" className="py-24 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-black text-center mb-16">
            Trusted by businesses globally
          </h2>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                name: "Ahmed Khan",
                role: "Freelancer Developer",
                text: "InvoicePro saved me hours every week. Clients pay faster now!",
              },
              {
                name: "Zara Ali",
                role: "Startup Founder",
                text: "Professional invoices = professional impression. Best decision ever.",
              },
              {
                name: "Omar Tariq",
                role: "Accounting Consultant",
                text: "My team uses it daily. Clean, fast, and compliance friendly. 10/10",
              },
            ].map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="relative p-10 rounded-3xl shadow-lg bg-white border-b-4 border-black/10 hover:shadow-xl transition transform hover:-translate-y-1"
              >
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-6 h-6 fill-yellow-500 text-yellow-500"
                    />
                  ))}
                </div>
                <p className="text-xl text-black font-medium leading-relaxed italic mb-8">
                  "{t.text}"
                </p>
                <div className="pt-4 border-t border-gray-100">
                  <p className="font-bold text-lg text-black">{t.name}</p>
                  <p className="text-md text-gray-600">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-24 px-4 sm:px-6 bg-black text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-8">
            Ready to Create Your First Invoice?
          </h2>
          <p className="text-xl text-gray-300 mb-12">
            Join 50,000+ businesses already saving time and getting paid faster.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center w-full">
            {" "}
            {/* Ensure button group is full width */}
            <button className="bg-white text-black px-12 py-6 rounded-full text-xl font-bold hover:bg-gray-200 transition hover:shadow-2xl w-full sm:w-auto">
            <Link to={"/signUp"}>
              Start Free Now
              </Link>
            </button>
            <button className="border-2 border-white text-white px-12 py-6 rounded-full text-xl font-bold hover:bg-white hover:text-black transition w-full sm:w-auto">
              Schedule Demo
            </button>
          </div>
          <p className="mt-10 text-gray-400">
            No credit card required • Free forever plan available
          </p>
        </div>
      </section>

      <footer className="bg-white border-t border-gray-200 py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto text-center text-gray-600">
          <p>&copy; 2025 InvoicePro. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
