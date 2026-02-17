import React, { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Filter,
  AlertCircle,
  ArrowUpRight,
  Printer,
  HelpCircle,
  ArrowRight,
  Check,
  Download,
  Send,
  MessageCircle,
  Slack,
  Plus,
  Trash2,
  Sparkles,
  ChevronDown,
  Wand2,
  Loader2,
  Image as ImageIcon,
  Percent,
  Layout,
  Eye,
  ShieldCheck,
  Flame,
  CheckCircle2,
  ArrowLeft,
  Users,
  Save,
  LayoutDashboard,
  FileText,
  TrendingUp,
  Settings,
  LogOut,
  Search,
  Bell,
  DollarSign,
  Clock,
  AlertTriangle,
  Zap,
  Menu,
  X,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  LifeBuoy,
  Camera,
  PlusCircle,
  LayoutList,
  User,
  List,
  Package,
  MapPin,
  Phone,
  Mail,
  Globe,
  ChevronUp,
  Palette,
  Upload,
} from "lucide-react";
import { baseUrl } from "../utils/apiConstant.js";
import axios from "axios";
import { useNavigate } from "react-router-dom";



const InvoiceTemplatesPage = () => {
  const mockTemplates = [
    {
      name: "Modern Minimalist",
      color: "bg-black",
      textColor: "text-black",
      tag: "Popular",
      stats: { time: "2m", fields: "Basic", geo: "Global" },
      icon: <Layout size={20} />
    },
    {
      name: "Corporate Blue",
      color: "bg-blue-600",
      textColor: "text-blue-600",
      tag: "Enterprise",
      stats: { time: "5m", fields: "Advanced", geo: "Multi-Tax" },
      icon: <ShieldCheck size={20} />
    },
    {
      name: "Freelancer Classic",
      color: "bg-emerald-600",
      textColor: "text-emerald-600",
      tag: "Trending",
      stats: { time: "3m", fields: "Standard", geo: "Local" },
      icon: <Flame size={20} />
    },
    {
      name: "Artisanal Light",
      color: "bg-orange-500",
      textColor: "text-orange-500",
      tag: "New",
      stats: { time: "4m", fields: "Custom", geo: "Global" },
      icon: <Zap size={20} />
    },
  ];
  const [snackbar, setSnackbar] = useState({ show: false, message: "", type: "success" });


  const showSnackbar = (message, type = "success") => {
    setSnackbar({ show: true, message, type });
    // Auto-hide after 4 seconds
    setTimeout(
      () => setSnackbar({ show: false, message: "", type: "success" }),
      10000
    );
  };
  useEffect(() => {
    showSnackbar("Selection Of Invoice Template Is Available An Only (Pro and Team) Plan", "error")
  }, [])
  return (
    <div className="min-h-screen p-6 md:p-16 font-sans">
      <div className="max-w-7xl mx-auto">
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
        {/* Header Section */}
        <header className="mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h2 className="text-4xl md:text-4xl font-black tracking-tighter text-black mb-4 uppercase">
              Template Gallery
            </h2>
            <p className="text-gray-400 text-md font-medium max-w-xl leading-relaxed">
              Experience live, high-fidelity invoice blueprints.
              Designed for modern brands that value precision.
            </p>
          </motion.div>
        </header>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
          {mockTemplates.map((template, index) => (
            <motion.div
              key={template.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15, duration: 0.8 }}
              whileHover={{ y: -10 }}
              className="group relative"
            >
              {/* Template Card Preview */}
              <div className="relative aspect-[3/4.2] bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden transition-all duration-500 group-hover:shadow-2xl group-hover:border-black/5">

                {/* Abstract Preview Mockup */}
                <div className="p-8 h-full flex flex-col justify-between relative z-10">
                  <div className="flex justify-between items-start">
                    {/* Floating Icon Animation */}
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      className={`w-12 h-12 rounded-2xl ${template.color} flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform duration-500`}
                    >
                      {template.icon}
                    </motion.div>

                    <div className="text-right space-y-2">
                      <motion.span
                        animate={{ opacity: [0.6, 1, 0.6] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-[9px] font-black bg-gray-50 text-gray-400 px-2 py-1 rounded-full uppercase tracking-tighter inline-block"
                      >
                        {template.tag}
                      </motion.span>
                      <div className="flex gap-1 justify-end">
                        <div className="h-1 w-6 bg-gray-100 rounded-full" />
                        <div className="h-1 w-3 bg-gray-200 rounded-full" />
                      </div>
                    </div>
                  </div>

                  {/* Body Content Details with Live Progress */}
                  <div className="grow flex flex-col justify-center space-y-5">
                    <div className="space-y-3">
                      <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden relative">
                        {/* Live Loading Bar */}
                        <motion.div
                          animate={{ x: ["-100%", "300%"] }}
                          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                          className={`absolute inset-0 w-1/4 ${template.color} opacity-20 blur-sm`}
                        />
                        <div className={`h-full w-1/3 ${template.color} opacity-10`} />
                      </div>
                      <div className="h-2 w-3/4 bg-gray-50 rounded-full" />
                      <div className="h-2 w-1/2 bg-gray-50 rounded-full" />
                    </div>

                    {/* Feature Chips */}
                    <div className="flex flex-wrap gap-2 pt-2">
                      <div className="flex items-center gap-1.5 text-[9px] font-bold text-gray-400 bg-gray-50/50 border border-gray-100 px-2.5 py-1.5 rounded-xl transition-colors group-hover:bg-white">
                        <Clock size={10} className="text-gray-300" /> {template.stats.time}
                      </div>
                      <div className="flex items-center gap-1.5 text-[9px] font-bold text-gray-400 bg-gray-50/50 border border-gray-100 px-2.5 py-1.5 rounded-xl transition-colors group-hover:bg-white">
                        <Globe size={10} className="text-gray-300" /> {template.stats.geo}
                      </div>
                    </div>
                  </div>

                  {/* Footer of Card */}
                  <div className="pt-6 border-t border-gray-50 flex justify-between items-end">
                    <div>
                      <div className="text-[10px] uppercase tracking-widest text-gray-300 font-bold mb-1">Invoice Total</div>
                      <motion.div
                        initial={{ opacity: 0.8 }}
                        whileInView={{ opacity: 1 }}
                        className="text-2xl font-black text-black tracking-tight"
                      >
                        $2,450.00
                      </motion.div>
                    </div>
                    {/* Pulsing Status Icon */}
                    <motion.div
                      animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <CheckCircle2 className={`${template.textColor}`} size={24} />
                    </motion.div>
                  </div>
                </div>

                {/* Hover Overlay - Centered and Non-Overlapping */}
                <div className="absolute inset-0 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center p-6 text-center">
                  {/* Backdrop Blur Layer */}
                  <div className="absolute inset-0 bg-white/60 backdrop-blur-md" />

                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    className="relative z-30 w-full space-y-3"
                  >
                    <button className="w-full bg-black text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-2xl hover:bg-gray-800 transition-all active:scale-95">
                      SELECT THEME <ChevronRight size={18} />
                    </button>
                    <p className="mt-2 text-[10px] text-gray-500 font-bold tracking-widest uppercase">Apply to Workspace</p>
                  </motion.div>
                </div>
              </div>

              {/* Label & Static Details */}
              <div className="mt-6 px-3 flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-black group-hover:text-gray-600 transition-colors tracking-tight">
                    {template.name}
                  </h3>
                  <div className="flex items-center gap-3 mt-1.5">
                    <div className="flex items-center gap-1 text-xs text-gray-400 font-medium">
                      <FileText size={12} /> {template.stats.fields} Layout
                    </div>
                  </div>
                  {/* Additional External Preview Button */}
                  <motion.button
                    whileHover={{ x: 5 }}
                    className="mt-4 flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
                  >
                    Live Preview <ChevronRight size={14} />
                  </motion.button>
                </div>
                {/* Interaction Button (Static) */}
                <motion.div
                  whileHover={{ rotate: 90 }}
                  className={`p-2.5 rounded-2xl bg-gray-50 ${template.textColor} group-hover:bg-black group-hover:text-white transition-all duration-300 cursor-pointer`}
                >
                  <Palette size={20} />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer Action */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="mt-24 text-center pb-12"
        >
          <div className="h-px w-20 bg-gray-100 mx-auto mb-8" />
          <button className="inline-flex items-center gap-3 text-gray-400 hover:text-black font-bold text-xs tracking-[0.2em] transition-all group">
            <PlusCircle size={18} className="group-hover:rotate-180 transition-transform duration-700" />
            REQUEST CUSTOM BLUEPRINT
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default InvoiceTemplatesPage