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


const SupportPage = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [openFaqIndex, setOpenFaqIndex] = useState(0); // Default first open
  
    const faqs = [
      { question: "How does the AI invoice generation work?", answer: "Our AI assistant uses advanced models to parse your natural language descriptions into structured line items. Simply describe the project scope, and it calculates quantities and prices automatically." },
      { question: "Can I change the invoice branding?", answer: "Yes. You can upload your own logo, toggle its visibility, and even customize the status labels to match your brand identity directly from the invoice creation page." },
      { question: "What payment methods are supported?", answer: "Currently, we support Stripe and PayPal integrations. You can configure your payment gateways in the Settings tab to accept payments directly via the invoice link." },
      { question: "How do I export to PDF?", answer: "Once your invoice is finalized, click the 'Process Invoice' button. You will see an option to download the document as a high-resolution PDF." },
    ];
  
    const categories = [
      { icon: <FileText size={24} />, title: "Billing & Invoices", desc: "Manage payments and history" },
      { icon: <User size={24} />, title: "Account Settings", desc: "Profile, security, and preferences" },
      { icon: <HelpCircle size={24} />, title: "Technical Support", desc: "Troubleshooting bugs and API" },
    ];
  
    const toggleFaq = (index) => {
      setOpenFaqIndex(openFaqIndex === index ? null : index);
    };
  
    return (
      <div className="min-h-screen bg-[#FDFDFD] text-[#1A1A1A] p-6 sm:p-12 font-sans antialiased selection:bg-slate-100">
        <div className="max-w-4xl mx-auto space-y-16">
          
          {/* Header & Search */}
          <header className="text-center space-y-8 animate-in fade-in slide-in-from-top-4 duration-700">
            <motion.div  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}  className="space-y-4">
              <h1 className="text-4xl sm:text-6xl font-black tracking-tighter text-slate-900 uppercase">
                Support Center
              </h1>
              <p className="text-lg text-slate-500 font-medium max-w-xl mx-auto">
                Search our knowledge base or get in touch with our expert support team.
              </p>
            </motion.div>
  
            <div className="relative max-w-2xl mx-auto group">
              <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
              </div>
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for articles (e.g. 'Payment failed')"
                className="w-full pl-14 pr-6 py-5 rounded-full bg-white border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] focus:outline-none focus:ring-0 focus:border-slate-900 transition-all text-base placeholder:text-slate-400 font-medium"
              />
            </div>
          </header>
  
          {/* Quick Categories */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
            {categories.map((cat, idx) => (
              <button 
                key={idx}
                className="flex flex-col items-center text-center p-8 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:border-slate-200 hover:-translate-y-1 transition-all duration-300 group outline-none"
              >
                <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-6 group-hover:bg-slate-900 group-hover:text-white transition-colors duration-300">
                  {cat.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 tracking-tight">{cat.title}</h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">{cat.desc}</p>
              </button>
            ))}
          </section>
  
          {/* FAQs */}
          <section className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            <div className="flex items-center gap-4 mb-10">
              <div className="h-px flex-1 bg-slate-100"></div>
              <h2 className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">Frequently Asked Questions</h2>
              <div className="h-px flex-1 bg-slate-100"></div>
            </div>
  
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div 
                  key={index}
                  onClick={() => toggleFaq(index)}
                  className={`cursor-pointer bg-white border transition-all duration-300 rounded-3xl overflow-hidden group ${openFaqIndex === index ? 'border-slate-900 shadow-lg scale-[1.01]' : 'border-slate-100 hover:border-slate-300'}`}
                >
                  <div className="w-full flex items-center justify-between p-6 sm:p-8">
                    <span className={`text-base sm:text-lg font-bold transition-colors ${openFaqIndex === index ? 'text-slate-900' : 'text-slate-600 group-hover:text-slate-900'}`}>
                      {faq.question}
                    </span>
                    <div className={`p-2 rounded-full transition-colors ${openFaqIndex === index ? 'bg-slate-100 text-slate-900' : 'bg-transparent text-slate-300 group-hover:text-slate-500'}`}>
                      {openFaqIndex === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>
                  </div>
                  <div 
                    className={`px-6 sm:px-8 text-slate-500 text-sm sm:text-base leading-relaxed overflow-hidden transition-all duration-500 ease-in-out ${openFaqIndex === index ? 'max-h-40 pb-8 opacity-100' : 'max-h-0 opacity-0'}`}
                  >
                    {faq.answer}
                  </div>
                </div>
              ))}
            </div>
          </section>
  
          {/* Contact Footer */}
          <section className="bg-slate-900 rounded-[2.5rem] p-8 md:p-16 text-center relative overflow-hidden animate-in fade-in zoom-in duration-500 delay-300 shadow-2xl">
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-60 h-60 bg-white/5 rounded-full -ml-20 -mb-20 blur-3xl pointer-events-none" />
            
            <div className="relative z-10 space-y-8">
              <div>
                <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-4">Still need help?</h2>
                <p className="text-slate-400 font-medium max-w-md mx-auto text-sm sm:text-base">
                  Our dedicated support team is available 24/7 to assist you with any issues or questions.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-white text-slate-900 rounded-2xl font-bold text-sm tracking-wide hover:bg-slate-100 transition-all active:scale-95 shadow-xl uppercase">
                  <Mail size={18} /> Contact Support
                </button>
                <button className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-slate-800/50 text-white border border-slate-700 rounded-2xl font-bold text-sm tracking-wide hover:bg-slate-800 transition-all active:scale-95 uppercase">
                  <MessageCircle size={18} /> Live Chat
                </button>
              </div>
            </div>
          </section>
  
        </div>
      </div>
    );
  };

  export default SupportPage