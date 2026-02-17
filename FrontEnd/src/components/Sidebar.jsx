import React, { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CreditCard,
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


const Sidebar = ({ currentPage, setPage, isMobileOpen, setIsMobileOpen }) => {
    const navItems = [
      {
        name: "Dashboard",
        icon: LayoutDashboard,
        page: "Dashboard",
        group: "main",
      },
      { name: "Invoices", icon: FileText, page: "Invoices", group: "main" },
      {
        name: "Create Invoice",
        icon: PlusCircle,
        page: "Create Invoice",
        group: "main",
      },
      {
        name: "Templates",
        icon: LayoutList,
        page: "Invoice Templates",
        group: "main",
      }, // NEW
      { name: "Clients", icon: Users, page: "Clients", group: "main" },
      // { name: "Reports", icon: TrendingUp, page: 'Reports', group: 'main' }, // Retained for future use
  
      { name: "Profile", icon: User, page: "Profile", group: "utility" }, // NEW
      { name: "Settings", icon: Settings, page: "Settings", group: "utility" },
      { name: "Billing", icon: CreditCard, page: "Billing", group: "utility" },
      { name: "Support", icon: LifeBuoy, page: "Support", group: "utility" }
    ];
  
    const baseClasses =
      "flex items-center p-4 rounded-xl transition duration-200 cursor-pointer";
  
    return (
      <>
        {/* Mobile Backdrop */}
        {isMobileOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={() => setIsMobileOpen(false)}
          ></div>
        )}
  
        {/* Sidebar Content */}
        <nav
          className={`fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 z-40 transform md:translate-x-0 ${
            isMobileOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 ease-in-out flex flex-col`}
        >
          {/* Logo and Close Button */}
          <div className="flex justify-between items-center p-6 pb-3 shrink-0">
            <div className="text-3xl font-extrabold text-black">
              Invoice<span className="text-gray-600">Pro</span>
            </div>
            <button
              className="md:hidden p-1"
              onClick={() => setIsMobileOpen(false)}
            >
              <X size={28} className="text-gray-700 hover:text-black" />
            </button>
          </div>
  
          {/* Navigation Links */}
          <div className="overflow-y-auto px-6 pt-2 pb-4 space-y-2 grow">
            {/* Main Group */}
            <div className="space-y-1 mt-4">
              {navItems
                .filter((item) => item.group === "main")
                .map((item) => (
                  <div
                    key={item.name}
                    onClick={() => {
                      setPage(item.page);
                      setIsMobileOpen(false);
                    }}
                    className={`${baseClasses} ${
                      currentPage === item.page
                        ? "bg-black text-white shadow-lg"
                        : "text-gray-600 hover:bg-gray-100 hover:text-black"
                    }`}
                  >
                    <item.icon className="w-6 h-6 mr-3" />
                    <span className="text-lg font-medium">{item.name}</span>
                  </div>
                ))}
            </div>
  
            {/* Utility Group */}
            <div className="space-y-1 pt-4 mt-4 border-t border-gray-100">
              {navItems
                .filter((item) => item.group === "utility")
                .map((item) => (
                  <div
                    key={item.name}
                    onClick={() => {
                      setPage(item.page);
                      setIsMobileOpen(false);
                    }}
                    className={`${baseClasses} ${
                      currentPage === item.page
                        ? "bg-black text-white shadow-lg"
                        : "text-gray-600 hover:bg-gray-100 hover:text-black"
                    }`}
                  >
                    <item.icon className="w-6 h-6 mr-3" />
                    <span className="text-lg font-medium">{item.name}</span>
                  </div>
                ))}
            </div>
          </div>
  
          {/* Logout at Bottom */}
          <div className="p-6 pt-4 shrink-0 border-t border-gray-100">
            <a
              href="#"
              className={`${baseClasses} text-red-500 hover:bg-red-50 hover:text-red-700`}
              onClick={async(e)=>{
                  e.preventDefault(); 
                  try {
                      await axios.post(`${baseUrl}/auth/logout`, {}, { withCredentials: true })
                      window.location.href = '/login';
                  } catch (error) {
                      console.error("Logout failed:", error);
                  }
                  }
              }
            >
              <LogOut className="w-6 h-6 mr-3" />
              <span className="text-lg font-medium">Log Out</span>
            </a>
          </div>
        </nav>
      </>
    );
  };

  export default Sidebar