import React, { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Filter,
  CircleDollarSign,
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
import DashboardPage from "../components/DashboardPage.jsx";
import InvoicesPage from "../components/InvoicesPage.jsx";
import ClientsPage from "../components/ClientsPage.jsx";
import CreateInvoicePage from "../components/CreateInvoicePage.jsx";
import InvoiceTemplatesPage from "../components/InvoiceTemplatesPage.jsx";
import ProfilePage from "../components/ProfilePage.jsx";
import SettingsPage from "../components/SettingsPage.jsx";
import SupportPage from "../components/SupportPage.jsx";
import Sidebar from "../components/Sidebar.jsx";
import BillingPage from "../components/BillingPage.jsx";

// Main App Component
export default function App() {
  const [currentPage, setCurrentPage] = useState("Dashboard");
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [credits, setCredits] = useState("");
  // Function to determine which page component to render
  const renderPage = () => {
    switch (currentPage) {
      case "Dashboard":
        return <DashboardPage setPage={setCurrentPage} />;
      case "Invoices":
        return <InvoicesPage setPage={setCurrentPage} />;
      case "Create Invoice":
        return <CreateInvoicePage fetchCredits={fetchCredits} />;
      case "Invoice Templates":
        return <InvoiceTemplatesPage />; // NEW
      case "Clients":
        return <ClientsPage />;
      case "Profile":
        return <ProfilePage />; // NEW
      case "Settings":
        return <SettingsPage />;
      case "Billing":
        return <BillingPage />;
      case "Support":
        return <SupportPage />;
      default:
        return <DashboardPage setPage={setCurrentPage} />;
    }
  };

  // Custom alert function (to avoid window.alert)
  const alert = (message) => {
    console.log("APP NOTIFICATION:", message);
    // You could replace this with a custom modal or toast notification
  };
  const [userData, setUserData] = useState(null);
  const fetchCredits = async () => {
    try {
      const res = await axios.get(`${baseUrl}/getCreditInfo`, {
        withCredentials: true,
      });
      setCredits(res.data.credits);
      console.log("REMAINING CREDITS", res.data.credits);
    } catch (error) {
      console.log(error);
    }
  };
  const updateCredits = async () => {
    try {
      const res = await axios.get(`${baseUrl}/updateCredits`, {
        withCredentials: true,
      });
      setCredits(res.data.credits);
      console.log("REMAINING CREDITS", res.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchCredits()
    const interval = setInterval(() => {
      updateCredits();
    }, 86400000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    axios
      .get(`${baseUrl}/auth/api/me`, {
        withCredentials: true,
      })
      .then((res) => {
        console.log("API DATA:", res.data);
        setUserData(res.data);
      })
      .catch((err) => {
        console.log("Error:", err);
      });
  }, []);

  useEffect(() => {
    console.log("UPDATED STATE:", userData);
  }, [userData]);
  return (
    <div className="min-h-screen bg-gray-50 font-sans overflow-x-hidden">
      <Sidebar
        currentPage={currentPage}
        setPage={setCurrentPage}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main Content Area */}
      <div className="md:ml-64 transition-all duration-300">
        {/* Header/Navbar */}
        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-gray-200 p-4 md:p-6 flex justify-between items-center shadow-sm">
          <div className="flex items-center">
            <button
              className="md:hidden p-2 mr-4 hover:bg-gray-100 rounded-full transition"
              onClick={() => setIsMobileOpen(true)}
            >
              <Menu size={24} />
            </button>
            <h1 className="text-2xl font-bold text-black">{currentPage}</h1>
          </div>

          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <div className="relative hidden sm:block">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder={`Search ${currentPage
                  .toLowerCase()
                  .replace(" ", " ")}...`}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl w-64 focus:ring-2 focus:ring-black focus:border-black transition"
              />
            </div>

            {/* Notifications */}
            <div>
              <button className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-full transition">
                <CircleDollarSign className="w-5 h-5" />
                <span className="font-bold font-sans text-md">{credits}</span>
              </button>
            </div>
            <button className="p-2 text-gray-700 hover:bg-gray-100 rounded-full transition">
              <Bell className="w-6 h-6" />
            </button>

            {/* Profile */}
            <div
              className="flex items-center space-x-3 cursor-pointer p-1 rounded-full hover:bg-gray-100 transition"
              onClick={() => setCurrentPage("Profile")}
            >
              <img
                src={`https://placehold.co/100x100/000000/FFFFFF?text=${userData?.name[0].toUpperCase()}`}
                alt="User Avatar"
                className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-md"
              />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 md:p-6">{renderPage()}</main>
      </div>
    </div>
  );
}
