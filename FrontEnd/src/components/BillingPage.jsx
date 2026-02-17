import React, { useState, useMemo,useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Zap,
  Globe,
  Wallet,
  Building2,
  Lock,
  ChevronRight,
  Info,
  Download,
  History,
  Search,
  ExternalLink,
  AlertCircle,
  X
} from "lucide-react";

const BillingPage = () => {
  const [selectedPlan, setSelectedPlan] = useState("pro");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Search state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBank, setSelectedBank] = useState(null);
  const [selectedWallet, setSelectedWallet] = useState(null);

  const plans = [
    {
      id: "starter",
      name: "Starter",
      price: 9,
      description: "Best for individuals exploring the platform",
      features: [
        "20 Credits per day",
        "20 clients storage",
        "Basic Insights",
        "Limited Access",
        "Community Support",
      ],
    },
    {
      id: "pro",
      name: "Pro",
      price: 29,
      description: "Ideal for professionals and growing teams",
      badge: "Most Popular",
      features: [
        "100 Credits per day",
        "Advanced Analytics",
        "50 clients storage",
        "CSV & Excel Export",
        "Priority Support",
        "request brand template",
        "Faster Processing",
      ],
    },
    {
      id: "team",
      name: "Team",
      price: 99,
      description: "Built for teams and organizations",
      features: [
        "200 Credits per day",
        "First priority",
        "100 clients storage",
        "Up to 10 Team Members",
        "Shared Workspace",
        "CSV & Excel Export",
        "brand template",
        "Monthly Insights",
        "Role-Based Access",
        "Dedicated Support"
      ],
    },
  ];
  
  const banks = {
    Pakistan: [
      "HBL LIMITED",
      "UBL LIMITED",
      "ALLIED BANK",
      "MEEZAN BANK",
      "ALBARAKA",
      "ALFALAH BANK",
      "MCB BANK",
      "FAYSAL BANK",
      "SINDH BANK",
      "BANK AL HABIB",
    ],
    UAE: [
      "EMIRATES NBD",
      "ADCB",
      "FIRST ABU DHABI BANK",
      "MASHREQ BANK",
      "DUBAI ISLAMIC BANK",
    ],
    International: [
      "HSBC",
      "JP MORGAN CHASE",
      "BARCLAYS",
      "CITIBANK",
      "STANDARD CHARTERED",
    ],
  };

  const wallets = [
    "PAYPAL",
    "STRIPE",
    // "SKRILL",
    "PAYONEER",
    "EASYPAISA",
    "JAZZCASH",
    "NAYAPAY",
    "SADAPAY",
    "ZINDAGI",
    "UPAISA",
    // "MASHREQ NEO",
  ];

  // Search logic for Banks
  const filteredBanks = useMemo(() => {
    if (!searchTerm) return banks;
    const filtered = {};
    Object.keys(banks).forEach((region) => {
      const matching = banks[region].filter((b) =>
        b.toLowerCase().includes(searchTerm.toLowerCase())
      );
      if (matching.length > 0) filtered[region] = matching;
    });
    return filtered;
  }, [searchTerm]);

  // Search logic for Wallets
  const filteredWallets = useMemo(() => {
    return wallets.filter((w) =>
      w.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const handlePayment = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setShowSuccess(true);
    }, 2000);
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };
  const [snackbar, setSnackbar] = useState({ show: false, message: "", type: "success" });

  const showSnackbar = (message, type = "success") => {
    setSnackbar({ show: true, message, type });
    // Auto-hide after 4 seconds
    setTimeout(
      () => setSnackbar({ show: false, message: "", type: "success" }),
      5000
    );
  };
  useEffect(() => {
  showSnackbar(
    "Billing Is Currently Disable From Team",
    "error"
  );

  const timer = setTimeout(() => {
    showSnackbar(
      "Team Increases The Free Limit To 50! Enjoy!",
      "success"
    );
  }, 5000);

  return () => clearTimeout(timer);
}, []);

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-[#1A1A1A] p-4 sm:p-8 font-sans overflow-x-hidden">
       <AnimatePresence>
          {snackbar.show && (
            <motion.div
              initial={{ opacity: 0, y: -20, x: 20 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
              className="fixed top-6 right-6 z-100 flex items-center gap-3 bg-[#1A1A1A] border text-amber-50 border-white/10 p-4 rounded-2xl shadow-2xl min-w-[320px] overflow-hidden"
            >
              {/* Icon based on type */}
              <div className={`p-2 rounded-xl ${snackbar.type === 'success' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                {snackbar.type === 'success' ? <ShieldCheck size={20} /> : <AlertCircle size={20} />}
              </div>

              {/* Content */}
              <div className="flex-1">
                <p className="text-sm font-bold tracking-tight">
                  {snackbar.type === 'success' ? 'Notification' : 'System Alert'}
                </p>
                <p className="text-xs text-gray-400 font-medium">{snackbar.message}</p>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setSnackbar({ ...snackbar, show: false })}
                className="text-gray-600 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>

              {/* Animated Progress Bar */}
              <motion.div
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: 4, ease: "linear" }}
                className={`absolute bottom-0 left-0 h-[3px] ${snackbar.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}
              />
            </motion.div>
          )}
        </AnimatePresence>
      <motion.div
        initial="hidden"
        animate="visible"
        className="max-w-6xl mx-auto space-y-12"
      >
        <motion.div variants={itemVariants} className="space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-full">
              Secure Checkout
            </span>
            <div className="h-px flex-1 bg-gray-100" />
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-gray-900 uppercase leading-none">
            Subscription <br /> & Billing
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-10">
            {/* Plan Cards with Fluid Selection */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {plans.map((plan) => (
                <button
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan.id)}
                  className="relative p-6 rounded-[2.5rem] border-2 border-gray-200 transition-all text-left overflow-hidden group"
                >
                  {selectedPlan === plan.id && (
                    <motion.div
                      layoutId="planHighlight"
                      className="absolute inset-0 bg-white border-2 border-black shadow-xl rounded-[2.5rem] z-0"
                      transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.6,
                      }}
                    />
                  )}
                  <div className="relative z-10">
                    <p
                      className={`text-[10px] font-black uppercase tracking-widest mb-1 transition-colors ${
                        selectedPlan === plan.id
                          ? "text-gray-400"
                          : "text-gray-300"
                      }`}
                    >
                      {plan.name}
                    </p>
                    <h2 className="text-3xl font-black mb-4">${plan.price}</h2>
                    <div className="space-y-2">
                      {plan.features.map((f, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase"
                        >
                          <CheckCircle2
                            size={12}
                            className={
                              selectedPlan === plan.id
                                ? "text-black"
                                : "text-gray-300"
                            }
                          />{" "}
                          {f}
                        </div>
                      ))}
                    </div>
                  </div>
                  {!selectedPlan === plan.id && (
                    <div className="absolute inset-0 border-2 border-gray-100 rounded-[2.5rem] pointer-events-none group-hover:border-gray-300 transition-colors" />
                  )}
                </button>
              ))}
            </div>

            {/* Enhanced Payment Selector */}
            <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 text-gray-50 pointer-events-none">
                <ShieldCheck size={120} />
              </div>

              <h3 className="text-2xl font-black uppercase tracking-tight mb-8 flex items-center gap-3 relative z-10">
                <Wallet size={24} /> Payment Methods
              </h3>

              <div className="grid grid-cols-3 gap-4 mb-8 relative z-10 bg-gray-50 p-2 rounded-[2.5rem]">
                {[
                  { id: "card", label: "Card", icon: CreditCard },
                  { id: "bank", label: "Bank", icon: Building2 },
                  { id: "wallet", label: "Wallet", icon: Globe },
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      setPaymentMethod(m.id);
                      setSearchTerm("");
                    }}
                    className={`relative flex flex-col items-center gap-3 p-5 rounded-4xl font-black text-[10px] uppercase tracking-widest transition-all ${
                      paymentMethod === m.id
                        ? "text-black"
                        : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    {paymentMethod === m.id && (
                      <motion.div
                        layoutId="paymentTab"
                        className="absolute inset-0 bg-white shadow-sm border border-gray-100 rounded-4xl z-0"
                        transition={{
                          type: "spring",
                          bounce: 0.2,
                          duration: 0.6,
                        }}
                      />
                    )}
                    <span className="relative z-10 flex flex-col items-center gap-3">
                      <m.icon size={22} />
                      {m.label}
                    </span>
                  </button>
                ))}
              </div>

              {/* Bank Transfer with Professional Grid */}
              {paymentMethod === "bank" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6 relative z-10"
                >
                  <div className="relative">
                    <Search
                      className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      type="text"
                      placeholder="SEARCH INSTITUTION..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-gray-50 border-none rounded-2xl py-5 pl-14 pr-6 text-sm font-bold focus:ring-2 focus:ring-black/5 outline-none uppercase tracking-tight"
                    />
                  </div>

                  <div className="max-h-[350px] overflow-y-auto pr-2 space-y-8 custom-scrollbar">
                    {Object.entries(filteredBanks).map(([region, bankList]) => (
                      <div key={region} className="space-y-4">
                        <div className="flex items-center gap-3">
                          <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">
                            {region} Region
                          </h4>
                          <div className="h-1px w-full bg-gray-50" />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {bankList.map((bank) => (
                            <button
                              key={bank}
                              onClick={() => setSelectedBank(bank)}
                              className="group relative p-4 rounded-xl border-2 text-[11px] font-black text-left transition-all flex items-center justify-between overflow-hidden"
                            >
                              {selectedBank === bank && (
                                <motion.div
                                  layoutId="bankActive"
                                  className="absolute inset-0 bg-black z-0"
                                  transition={{
                                    type: "spring",
                                    bounce: 0,
                                    duration: 0.4,
                                  }}
                                />
                              )}
                              <span
                                className={`relative z-10 uppercase tracking-tight ${
                                  selectedBank === bank
                                    ? "text-white"
                                    : "text-gray-900"
                                }`}
                              >
                                {bank}
                              </span>
                              <div className="relative z-10">
                                {selectedBank === bank ? (
                                  <CheckCircle2
                                    size={14}
                                    className="text-white"
                                  />
                                ) : (
                                  <ChevronRight
                                    size={14}
                                    className="text-gray-300 group-hover:text-black transition-colors"
                                  />
                                )}
                              </div>
                              {selectedBank !== bank && (
                                <div className="absolute inset-0 border-2 border-gray-100 group-hover:border-gray-300 rounded-xl pointer-events-none" />
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                    {Object.keys(filteredBanks).length === 0 && (
                      <div className="text-center py-16 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-100">
                        <p className="text-gray-400 font-black text-xs uppercase tracking-widest">
                          No match found in archive
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Digital Wallet with Professional Grid */}
              {paymentMethod === "wallet" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6 relative z-10"
                >
                  <div className="relative">
                    <Search
                      className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      type="text"
                      placeholder="SEARCH DIGITAL WALLET..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-gray-50 border-none rounded-2xl py-5 pl-14 pr-6 text-sm font-bold focus:ring-2 focus:ring-black/5 outline-none uppercase tracking-tight"
                    />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {filteredWallets.map((wallet) => (
                      <button
                        key={wallet}
                        onClick={() => setSelectedWallet(wallet)}
                        className="group relative p-5 rounded-2xl border-2 text-[11px] font-black text-center transition-all flex flex-col items-center gap-2 uppercase tracking-tighter overflow-hidden"
                      >
                        {selectedWallet === wallet && (
                          <motion.div
                            layoutId="walletActive"
                            className="absolute inset-0 bg-black z-0"
                            transition={{
                              type: "spring",
                              bounce: 0.1,
                              duration: 0.5,
                            }}
                          />
                        )}
                        <span
                          className={`relative z-10 ${
                            selectedWallet === wallet
                              ? "text-white"
                              : "text-gray-500 group-hover:text-black"
                          }`}
                        >
                          {wallet}
                        </span>
                        {selectedWallet !== wallet && (
                          <div className="absolute inset-0 border-2 border-gray-100 group-hover:border-gray-400 rounded-2xl pointer-events-none transition-colors" />
                        )}
                      </button>
                    ))}
                  </div>
                  {filteredWallets.length === 0 && (
                    <div className="text-center py-16 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-100">
                      <p className="text-gray-400 font-black text-xs uppercase tracking-widest">
                        No wallet match found
                      </p>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Card Form */}
              {paymentMethod === "card" && (
                <motion.form
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-5 relative z-10"
                >
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Cardholder Designation
                    </label>
                    <input
                      type="text"
                      placeholder="FULL NAME AS PRINTED"
                      className="w-full bg-gray-50 border-none rounded-2xl py-5 px-8 text-sm font-bold outline-none uppercase placeholder:text-gray-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Digital Sequence
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="0000 0000 0000 0000"
                        className="w-full bg-gray-50 border-none rounded-2xl py-5 px-8 text-sm font-bold outline-none placeholder:text-gray-300"
                      />
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 flex gap-2">
                        <div className="w-10 h-6 bg-gray-200 rounded-md" />
                        <div className="w-10 h-6 bg-black rounded-md" />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Validity
                      </label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="w-full bg-gray-50 border-none rounded-2xl py-5 px-8 text-sm font-bold outline-none text-center"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Pin
                      </label>
                      <input
                        type="password"
                        placeholder="CVC"
                        className="w-full bg-gray-50 border-none rounded-2xl py-5 px-8 text-sm font-bold outline-none text-center"
                      />
                    </div>
                  </div>
                </motion.form>
              )}
            </div>
          </div>

          {/* Checkout Summary - Fixed place */}
          <div className="lg:col-span-5">
            <div className="bg-black text-white p-10 rounded-[3rem] shadow-[0_30px_60px_rgba(0,0,0,0.3)] overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 blur-2xl" />

              <div className="flex justify-between items-start mb-10 relative z-10">
                <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-md border border-white/5">
                  <Zap size={24} className="text-yellow-400 fill-yellow-400" />
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">
                    Active Tier
                  </p>
                  <p className="text-xl font-black tracking-tight">
                    {plans.find((p) => p.id === selectedPlan)?.name}
                  </p>
                </div>
              </div>

              <div className="space-y-5 mb-10 text-sm font-bold uppercase tracking-tight relative z-10">
                <div className="flex justify-between">
                  <span className="text-white/40">License Fee</span>
                  <span>
                    ${plans.find((p) => p.id === selectedPlan)?.price}.00
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">Infrastructure</span>
                  <span>$0.00</span>
                </div>
                <div className="pt-8 border-t border-white/10 flex justify-between items-end">
                  <div>
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">
                      Grand Total
                    </p>
                    <p className="text-5xl font-black tracking-tighter">
                      ${plans.find((p) => p.id === selectedPlan)?.price}.00
                    </p>
                  </div>
                  <p className="text-[10px] text-white/40 pb-1 font-bold">
                    USD / MONTH
                  </p>
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full py-6 bg-white text-black rounded-2xl font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 relative z-10 disabled:opacity-50 shadow-xl"
              >
                {isProcessing ? (
                  <div className="w-6 h-6 border-3 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Initialize Payment <ArrowRight size={18} />
                  </>
                )}
              </button>

              <div className="mt-8 pt-8 border-t border-white/5 space-y-4 relative z-10">
                <div className="flex items-center gap-3 text-[10px] font-black text-white/40 uppercase tracking-widest">
                  <ShieldCheck size={16} className="text-green-500" /> AES-256
                  Encrypted Gateway
                </div>
                {paymentMethod === "bank" && selectedBank && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-3 text-[10px] font-black text-yellow-400 uppercase tracking-widest"
                  >
                    <Building2 size={16} /> Routing via {selectedBank}
                  </motion.div>
                )}
                {paymentMethod === "wallet" && selectedWallet && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-3 text-[10px] font-black text-blue-400 uppercase tracking-widest"
                  >
                    <Globe size={16} /> Connecting {selectedWallet} Gateway
                  </motion.div>
                )}
              </div>
            </div>

            {/* Professional Help Context */}
            <div className="mt-6 p-8 bg-white border border-gray-100 rounded-[2.5rem] flex items-center justify-between group cursor-pointer hover:border-gray-200 transition-colors">
              <div className="flex items-center gap-5">
                <div className="p-3 bg-gray-50 text-black rounded-2xl group-hover:bg-black group-hover:text-white transition-colors">
                  <Info size={22} />
                </div>
                <div>
                  <h4 className="font-black text-[11px] uppercase tracking-widest">
                    Need Assistance?
                  </h4>
                  <p className="text-gray-400 text-[10px] font-bold uppercase tracking-tight">
                    Our billing experts are online 24/7
                  </p>
                </div>
              </div>
              <ChevronRight size={16} className="text-gray-300" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccess && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white p-12 rounded-[3.5rem] max-w-sm w-full text-center border-2 border-black shadow-2xl"
            >
              <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={40} />
              </div>
              <h2 className="text-3xl font-black uppercase tracking-tight mb-2 leading-none">
                Transaction <br /> Complete
              </h2>
              <p className="text-gray-500 text-[11px] font-black mb-8 uppercase tracking-widest">
                Your premium infrastructure is active
              </p>
              <button
                onClick={() => setShowSuccess(false)}
                className="w-full py-5 bg-black text-white rounded-3xl font-black uppercase tracking-widest hover:scale-105 transition-transform shadow-lg"
              >
                Return to Console
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        /* Remove horizontal scrollbar */
        body {
          overflow-x: hidden;
        }
        
        /* Custom scrollbar for bank/wallet lists (Vertical only) */
        .custom-scrollbar::-webkit-scrollbar { 
          width: 4px; 
          height: 0; /* Ensures no horizontal scrollbar height */
        }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #1A1A1A; }
      `}</style>
    </div>
  );
};

export default BillingPage;
