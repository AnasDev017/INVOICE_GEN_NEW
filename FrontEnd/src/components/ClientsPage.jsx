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
import api from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";

const ClientsPage = () => {
  // State to manage view: 'list' or 'form'
  const [isAddingClient, setIsAddingClient] = useState(false);
  const [snackbar, setSnackbar] = useState({ show: false, message: "", type: "success" });
  const [loading, setLoading] = useState(true);
  const [Clients, setClients] = useState([])
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [isClients, setIsClients] = useState(true)
  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Save Client and switch view
  const handleSave = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone || !formData.address) {
      showSnackbar("All Feilds Are Required!", "error")
      return;
    }

    try {
      const response = await api.post(
        `${baseUrl}/saveClient`,
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
        },
        {
          withCredentials: true,
        }
      );
      showSnackbar("Client Save Successfuly!", "success")
    } catch (error) {
      // Axios me error.response me server ka message hota
      if (error.response && error.response.data && error.response.data.message) {
        showSnackbar(error.response.data.message, "error")
      } else {
        showSnackbar("Something went wrong!", "error")
      }
      console.log(error);
    }
    setFormData({ name: "", email: "", phone: "", address: "" }); // Reset form
    setIsAddingClient(false); // Switch back to list view
  };
  const showSnackbar = (message, type = "success") => {
    setSnackbar({ show: true, message, type });
    // Auto-hide after 4 seconds
    setTimeout(() => setSnackbar({ show: false, message: "", type: "success" }), 4000);
  };
  useEffect(() => {
    const getClientsData = async () => {
      try {
        const res = await api.get(`${baseUrl}/getClients`, {
          withCredentials: true,
        });

        const clientsData = res.data.clients || [];
        setClients(clientsData);
        setLoading(false)
        if (clientsData.length === 0) {
          setIsClients(false);
        } else {
          setIsClients(true);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getClientsData();
  }, [formData]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] p-6 md:p-12 font-sans text-black">
      <div className="max-w-6xl mx-auto">
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
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4"
        >
          <motion.div>
            <h1 className="text-4xl font-black tracking-tighter">
              CLIENT DIRECTORY
            </h1>
            <p className="text-gray-500 font-medium">
              Manage and organize your client database.
            </p>
          </motion.div>

          {!isAddingClient && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsAddingClient(true)}
              className="bg-black text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-xl hover:bg-gray-800 transition-all"
            >
              <PlusCircle size={20} />
              NEW CLIENT
            </motion.button>
          )}
        </motion.div>

        <AnimatePresence mode="wait">
          {isAddingClient ? (
            /* --- ADD CLIENT FORM VIEW --- */
            <motion.div
              key="add-form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white border border-gray-200 rounded-3xl p-8 md:p-12 shadow-sm max-w-3xl mx-auto"
            >
              <button
                onClick={() => setIsAddingClient(false)}
                className="flex items-center gap-2 text-gray-400 hover:text-black mb-8 font-bold text-xs tracking-widest transition-colors"
              >
                <ArrowLeft size={16} /> BACK TO DIRECTORY
              </button>

              <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                <Users className="text-gray-400" /> Client Details
              </h2>

              <form
                onSubmit={handleSave}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {/* Name Field */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">
                    Client Name
                  </label>
                  <div className="relative group">
                    <User
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-black transition-colors"
                      size={18}
                    />
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      type="text"
                      placeholder="Full Name"
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-12 pr-4 py-4 focus:outline-none focus:border-black focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">
                    Email Address
                  </label>
                  <div className="relative group">
                    <Mail
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-black transition-colors"
                      size={18}
                    />
                    <input
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      type="email"
                      placeholder="email@company.com"
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-12 pr-4 py-4 focus:outline-none focus:border-black focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Phone Field */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">
                    Phone Number
                  </label>
                  <div className="relative group">
                    <Phone
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-black transition-colors"
                      size={18}
                    />
                    <input
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      type="text"
                      placeholder="+91 00000 00000"
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-12 pr-4 py-4 focus:outline-none focus:border-black focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Address Field */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">
                    Location / Address
                  </label>
                  <div className="relative group">
                    <MapPin
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-black transition-colors"
                      size={18}
                    />
                    <input
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      type="text"
                      placeholder="City, State"
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-12 pr-4 py-4 focus:outline-none focus:border-black focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="md:col-span-2 pt-6">
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    type="submit"
                    className="w-full bg-black text-white font-bold py-5 rounded-2xl flex items-center justify-center gap-3 shadow-lg hover:bg-gray-800 transition-all"
                  >
                    <Save size={18} />
                    SAVE CLIENT DATA
                  </motion.button>
                </div>
              </form>
            </motion.div>
          ) : (
            /* --- CLIENT LIST VIEW --- */
            <>
              {Clients.length === 0 && (
                <h1 className="text-center text-2xl font-bold text-gray-500 my-10">
                  No Clients Yet!..Add Some Clients Here!
                </h1>
              )}

              <motion.div
                key="client-list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {Clients.map((client) => (
                  <motion.div
                    key={client.id}
                    layoutId={client.id}
                    whileHover={{ y: -5 }}
                    className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all group"
                  >
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors duration-300">
                        <User size={24} />
                      </div>
                      <div>
                        <h3 className="text-xl font-black truncate">{client.name}</h3>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          Verified Client
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <Mail size={16} className="text-gray-300" />
                        {client.email}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <Phone size={16} className="text-gray-300" />
                        {client.phone}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <MapPin size={16} className="text-gray-300" />
                        {client.address}
                      </div>
                    </div>

                    <div className="mt-8 pt-5 border-t border-gray-50 flex justify-between items-center">
                      <div className="flex -space-x-2">
                        <div className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white" />
                        <div className="w-6 h-6 rounded-full bg-gray-100 border-2 border-white" />
                      </div>
                      <span className="text-[10px] font-black bg-gray-50 px-3 py-1 rounded-full text-gray-400">
                        STATUS: ACTIVE
                      </span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>

  );
};

export default ClientsPage;
