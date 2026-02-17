import React, { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Swal from 'sweetalert2'
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

const CreateInvoicePage = ({ fetchCredits }) => {
  const [isAiMode, setIsAiMode] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [status, setStatus] = useState("unpaid");
  const [logo, setLogo] = useState(null);
  const [showLogo, setShowLogo] = useState(true);
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [savedClients, setSavedClients] = useState([]);
  const [snackbar, setSnackbar] = useState({ show: false, message: "", type: "success" });

  // snack bar
  const showSnackbar = (message, type = "success") => {
    setSnackbar({ show: true, message, type });
    // Auto-hide after 4 seconds
    setTimeout(
      () => setSnackbar({ show: false, message: "", type: "success" }),
      4000
    );
  };

  // New State for checkboxes
  const [sendOptions, setSendOptions] = useState({
    email: true,
    whatsapp: false,
  });

  const [formData, setFormData] = useState({
    clientName: "Select a Client",
    clientEmail: "",
    invoiceNumber: "",
    issueDate: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
  });

  const [items, setItems] = useState([
    { description: "", quantity: 1, price: 0, subTotal: 0 },
  ]);

  // const savedClients = [
  //   { id: 1, name: "Acme Corp", email: "billing@acme.com", avatar: "AC" },
  //   { id: 2, name: "Global Tech Solutions", email: "accounts@globaltech.io", avatar: "GT" },
  //   { id: 3, name: "Stark Industries", email: "pepper@stark.com", avatar: "SI" },
  //   { id: 4, name: "Wayne Enterprises", email: "finance@wayne.com", avatar: "WE" },
  // ];

  const subtotal = items.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );
  const discountAmount = subtotal * (Number(discount) / 100);
  const total = (subtotal - discountAmount).toFixed(2);

  useEffect(() => {
    const getSavedClients = async () => {
      try {
        const res = await api.get(`${baseUrl}/getClients`, {
          withCredentials: true,
        });

        const clientsData = res.data.clients || [];
        const updateClientsAvatar = clientsData.map((client) => ({
          ...client,
          avatar: client.name?.[0]?.toUpperCase() || "U",
        }));
        setSavedClients(updateClientsAvatar);

        if (updateClientsAvatar.length === 0) {
          Swal.fire({
            icon: 'error',
            title: 'No available clients',
            text: 'Please add a client first',
          });
        }
      } catch (error) {
        console.log(error);
      }
    };
    getSavedClients();
  }, []);

  // Fetch Next Invoice Number
  useEffect(() => {
    const fetchInvoiceNumber = async () => {
      try {
        const res = await api.get(`${baseUrl}/getNextInvoiceNumber`, { withCredentials: true });
        if (res.data.success) {
          setFormData(prev => ({
            ...prev,
            invoiceNumber: res.data.nextId
          }));
        }
      } catch (error) {
        console.error("Error fetching invoice number:", error);
      }
    };
    fetchInvoiceNumber();
  }, []);


  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    updatedItems[index].subTotal =
      updatedItems[index].quantity * updatedItems[index].price;
    setItems(updatedItems);
  };

  const addItem = () =>
    setItems([
      ...items,
      { description: "", quantity: 1, price: 0, subTotal: 0 },
    ]);
  const removeItem = (index) =>
    items.length > 1 && setItems(items.filter((_, i) => i !== index));

  const handleGenerate = async () => {
    try {
      setLoading(true);
      showSnackbar("Generating Your Invoice| Please Wait A Moment!", "success");

      const res = await api.post(
        `${baseUrl}/generateInvoice`,
        {
          items,
          status,
          formData,
          discountAmount,
          sendOptions,
          template: "template1",
        },
        {
          withCredentials: true,
          responseType: "blob", // PDF ke liye
        }
      );

      const url = window.URL.createObjectURL(
        new Blob([res.data], { type: "application/pdf" })
      );
      fetchCredits();
      window.open(url, "_blank");
    } catch (err) {
      console.error("ERR", err);


      if (err.response && err.response.data) {
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const json = JSON.parse(reader.result);
            showSnackbar(json.message, "error");
          } catch (err) {
            console.error("ERR", err);

            if (err.response && err.response.data) {
              const reader = new FileReader();

              reader.onload = () => {
                const message = reader.result;
                showSnackbar(message || "Invoice generation failed", "error");
              };

              reader.readAsText(err.response.data);
            } else {
              showSnackbar("Server error", "error");
            }
          }

        };
        reader.readAsText(err.response.data);
      } else {
        showSnackbar("Something went wrong!", "error");
      }
    } finally {
      setLoading(false);
    }
  };


  const generateWithAi = async () => {
    if (!aiPrompt) return;
    setIsGenerating(true);
    const apiKey = "";
    const systemPrompt = `Return ONLY a JSON array of invoice items for: ${aiPrompt}. Format: [{"description": "item name", "quantity": 1, "price": 100}]`;

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: aiPrompt }] }],
            systemInstruction: { parts: [{ text: systemPrompt }] },
            generationConfig: { responseMimeType: "application/json" },
          }),
        }
      );
      const result = await response.json();
      const aiItems = JSON.parse(result.candidates[0].content.parts[0].text);
      setItems(aiItems.map((i) => ({ ...i, total: i.quantity * i.price })));
      setIsAiMode(false);
      setAiPrompt("");
    } catch (error) {
      console.error("AI Generation failed", error);
    } finally {
      setIsGenerating(false);
    }
  };


  return (
    <div className="  text-[#1A1A1A] p-4 sm:p-8 md:p-12 font-sans antialiased">
      <div className="max-w-6xl mx-auto space-y-10">
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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-black mb-4 uppercase">
                CREATE INVOICE
              </h2>
              <p className="text-gray-400 text-md font-medium max-w-xl leading-relaxed">
                Draft your professional invoice manually or with AI.
              </p>
            </motion.div>
          </div>

          {/* Animated AI Button */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gray-200 rounded-full blur opacity-50 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
            {/* <button
              onClick={() => setIsAiMode(!isAiMode)}
              className={`relative flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 border-none outline-none focus:outline-none focus:ring-0 active:scale-95 ${isAiMode
                ? "bg-white text-black border border-gray-200 shadow-md"
                : "bg-black text-white shadow-xl ring-2 ring-offset-2 ring-transparent group-hover:ring-gray-200"
                }`}
            >
              <Sparkles size={16} className={isAiMode ? "" : "animate-pulse"} />
              {isAiMode ? "Exit AI Mode" : "Generate with AI"}
            </button> */}
          </div>
        </div>

        {/* AI PANEL */}
        {isAiMode && (
          <div className="mb-10 bg-white border border-slate-200 rounded-2xl p-6 shadow-xl shadow-slate-100 animate-in slide-in-from-top-4 duration-300 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-slate-900" />
            <div className="flex gap-4">
              <div className="mt-1">
                <Wand2 size={18} className="text-slate-900" />
              </div>
              <div className="flex-1">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
                  AI Invoice Assistant
                </h3>
                <textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Describe your project items (e.g., 'A full branding package with logo, stationary, and website')..."
                  className="w-full bg-transparent border-none p-0  focus:ring-0 text-slate-900 placeholder:text-slate-300 resize-none text-lg  leading-relaxed focus:outline-0"
                  rows={2}
                />
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-50">
                  <span className="text-[10px] text-slate-300 italic font-medium">
                    Powered by Invoice-Gen Pro
                  </span>
                  <button
                    disabled={isGenerating || !aiPrompt}
                    onClick={generateWithAi}
                    className="bg-slate-900 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 disabled:opacity-50 flex items-center gap-2 transition-all"
                  >
                    {isGenerating ? (
                      <Loader2 className="animate-spin" size={16} />
                    ) : (
                      "Populate Items"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MAIN INVOICE FORM */}
        <div className="bg-white rounded-[2.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden">
          {/* Top Bar: Logo & Status */}
          <div className="p-5 sm:p-12 flex flex-col sm:flex-row justify-between gap-8 sm:gap-12 border-b border-gray-50">
            <div className="space-y-6">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                  Branding
                </span>
                <button
                  onClick={() => setShowLogo(!showLogo)}
                  className={`w-10 h-5 rounded-full transition-colors relative border-none outline-none focus:outline-none ${showLogo ? "bg-black" : "bg-gray-200"
                    }`}
                >
                  <div
                    className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${showLogo ? "left-6" : "left-1"
                      }`}
                  />
                </button>
              </div>

              {showLogo && (
                <div className="w-32 h-32 rounded-3xl border-2 border-dashed border-gray-100 flex items-center justify-center relative group overflow-hidden bg-gray-50/50 transition-all hover:border-black/20">
                  {logo ? (
                    <img
                      src={logo}
                      alt="Logo"
                      className="w-full h-full object-contain p-4"
                    />
                  ) : (
                    <label className="cursor-pointer flex flex-col items-center gap-2 text-gray-400 hover:text-black">
                      <ImageIcon size={24} />
                      <span className="text-[10px] font-bold uppercase">
                        Logo
                      </span>
                      <input
                        type="file"
                        onChange={(e) =>
                          setLogo(URL.createObjectURL(e.target.files[0]))
                        }
                        className="hidden"
                      />
                    </label>
                  )}
                  {logo && (
                    <button
                      onClick={() => setLogo(null)}
                      className="absolute top-2 right-2 p-1.5 bg-black text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity outline-none"
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="flex flex-col items-start sm:items-end gap-6 w-full sm:w-auto mt-6 sm:mt-0">
              {/* STATUS TOGGLE - Updated to Black for "Paid" */}
              <div className="relative bg-gray-100 p-1.5 rounded-2xl flex items-center w-full sm:w-48">
                <div
                  className={`absolute h-[calc(100%-12px)] w-[calc(50%-6px)] rounded-xl transition-all duration-300 ease-out shadow-sm ${status === "pending"
                    ? "left-1.5 bg-black"
                    : "left-[calc(50%+3px)] bg-black"
                    }`}
                />
                <button
                  onClick={() => setStatus("pending")}
                  className={`relative z-10 flex-1 py-2 text-[10px] font-black uppercase border-none outline-none transition-colors ${status === "pending" ? "text-white" : "text-gray-400 "
                    }`}
                >
                  Pending
                </button>
                <button
                  onClick={() => setStatus("paid")}
                  className={`relative z-10 flex-1 py-2 text-[10px] font-black uppercase border-none outline-none transition-colors ${status === "paid" ? "text-white" : "text-gray-400"
                    }`}
                >
                  Paid
                </button>
              </div>

              <div className="text-left sm:text-right w-full sm:w-auto">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                  Select Due Date
                </p>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) =>
                    setFormData({ ...formData, dueDate: e.target.value })
                  }
                  className="w-full sm:w-auto bg-transparent text-lg font-bold text-left sm:text-right outline-none hover:text-black border-none transition-colors p-0 focus:ring-0"
                />
              </div>
            </div>
          </div>

          {/* Client Selection - Redesigned Card Dropdown */}
          <div className="p-5 sm:p-12 border-b border-gray-50">
            <div className="space-y-4 max-w-lg">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <User size={12} /> Billed To
              </label>

              <div className="relative group/dropdown">
                {/* Trigger Button */}
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={`w-full flex items-center tracking-tighter justify-between text-xl sm:text-3xl font-light py-4 border-b-2 transition-all duration-300 border-none outline-none focus:outline-none ${isDropdownOpen ? "text-black" : "text-gray-900"
                    }`}
                >
                  <div className="flex items-center gap-4 text-2xl uppercase font-bold">
                    {formData.clientName !== "Select a Client" && (
                      <div className="h-10 w-10 rounded-xl bg-black flex items-center justify-center text-xs text-white font-bold shadow-lg shadow-black/20">
                        {formData.clientName.substring(0, 1)}
                      </div>
                    )}
                    <span
                      className={
                        formData.clientName === "Select a Client"
                          ? "text-gray-900"
                          : "text-black font-bold tracking-tight"
                      }
                    >
                      {formData.clientName}
                    </span>
                  </div>
                  <ChevronDown
                    size={24}
                    className={`text-gray-300 transition-transform duration-300 ${isDropdownOpen ? "rotate-180 text-black" : ""
                      }`}
                  />
                </button>

                {/* Dropdown Menu - Card Style */}
                {isDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsDropdownOpen(false)}
                    />
                    <div className="absolute top-full left-0 w-full sm:w-[480px] mt-6 bg-white border border-gray-100 rounded-3xl shadow-[0_40px_80px_rgba(0,0,0,0.1)] z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                      {/* Search Header */}
                      <div className="p-4 border-b border-gray-50 bg-gray-50/30 backdrop-blur-sm sticky top-0">
                        <div className="relative">
                          <Search
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                            size={16}
                          />
                          <input
                            type="text"
                            placeholder="Search clients..."
                            className="w-full bg-white border-none rounded-xl pl-12 pr-4 py-3 text-sm font-medium focus:ring-2 focus:ring-black/5 placeholder:text-gray-300"
                            autoFocus
                          />
                        </div>
                      </div>

                      {/* Client List */}
                      <div className="max-h-80 overflow-y-auto p-2 custom-scrollbar space-y-1">
                        {savedClients.map((client) => (
                          <div
                            key={client.id}
                            onClick={() => {
                              setFormData({
                                ...formData,
                                clientName: client.name,
                                clientEmail: client.email,
                              });
                              setIsDropdownOpen(false);
                            }}
                            className={`group p-4 rounded-2xl cursor-pointer flex justify-between items-center transition-all duration-200 border border-transparent ${formData.clientName === client.name
                              ? "bg-black text-white shadow-lg scale-[0.98]"
                              : "hover:bg-gray-50 hover:border-gray-100"
                              }`}
                          >
                            <div className="flex items-center gap-4">
                              <div
                                className={`h-10 w-10 rounded-xl flex items-center justify-center text-xs font-bold transition-colors ${formData.clientName === client.name
                                  ? "bg-white/20 text-white"
                                  : "bg-gray-100 text-gray-500 group-hover:bg-white group-hover:shadow-sm"
                                  }`}
                              >
                                {client.avatar}
                              </div>
                              <div>
                                <p className="text-sm font-bold tracking-tight">
                                  {client.name}
                                </p>
                                <p
                                  className={`text-[11px] font-medium ${formData.clientName === client.name
                                    ? "text-gray-400"
                                    : "text-gray-400"
                                    }`}
                                >
                                  {client.email}
                                </p>
                              </div>
                            </div>
                            {formData.clientName === client.name && (
                              <div className="bg-white/20 p-1.5 rounded-full">
                                <Check size={14} className="text-white" />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Footer Action */}
                      <div className="p-3 border-t border-gray-50 bg-gray-50/50">
                        <button className="w-full py-3 rounded-xl border border-dashed border-gray-300 text-xs font-bold text-gray-400 hover:text-black hover:border-black transition-all uppercase tracking-widest flex items-center justify-center gap-2">
                          <Plus size={14} /> Create New Client
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
              <p className="text-sm text-slate-400 font-medium pl-1">
                {formData.clientEmail}
              </p>
            </div>
          </div>

          {/* Table Items */}
          <div>
            <div className="hidden sm:flex px-8 py-4 bg-gray-50/50 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
              <div className="grow">Item Description</div>
              <div className="w-20 text-center px-4">Qty</div>
              <div className="w-28 text-right px-4">Price</div>
              <div className="w-28 text-right">Total</div>
              <div className="w-12"></div>
            </div>

            <div className="divide-y divide-gray-50">
              {items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row sm:items-center px-5 py-6 sm:px-8 group hover:bg-gray-50/30 transition-colors gap-4 sm:gap-0"
                >
                  <div className="grow w-full sm:w-auto">
                    <input
                      type="text"
                      placeholder="Item Description"
                      value={item.description}
                      onChange={(e) =>
                        handleItemChange(idx, "description", e.target.value)
                      }
                      className="w-full bg-transparent border-none p-0 text-base font-bold focus:ring-0 outline-0 placeholder:text-gray-400 text-gray-900"
                    />
                  </div>

                  <div className="grid grid-cols-12 sm:flex sm:w-auto items-center gap-2 sm:gap-0 w-full mt-2 sm:mt-0">
                    <div className="col-span-3 sm:w-20 sm:px-4">
                      <label className="sm:hidden text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1">Qty</label>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          handleItemChange(idx, "quantity", e.target.value)
                        }
                        className="w-full bg-transparent border-none p-0 text-left sm:text-center text-base font-bold focus:ring-0 outline-0"
                      />
                    </div>
                    <div className="col-span-4 sm:w-28 sm:px-4">
                      <label className="sm:hidden text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1">Price</label>
                      <input
                        type="number"
                        value={item.price}
                        onChange={(e) =>
                          handleItemChange(idx, "price", e.target.value)
                        }
                        className="w-full bg-transparent border-none p-0 text-left sm:text-right text-base font-bold focus:ring-0 outline-0"
                      />
                    </div>
                    <div className="col-span-4 sm:w-28 text-left sm:text-right text-base font-black">
                      <label className="sm:hidden text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1">Total</label>
                      <span className="block truncate">${item.subTotal.toLocaleString()}</span>
                    </div>
                    <div className="col-span-1 sm:w-12 text-right flex justify-end">
                      <button
                        onClick={() => removeItem(idx)}
                        className="text-gray-200 hover:text-black transition-colors outline-none"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={addItem}
              className="w-full py-6 text-[10px] font-black text-gray-400 hover:text-black transition-all uppercase tracking-widest flex items-center justify-center gap-2 border-t border-gray-50 bg-white hover:bg-gray-50 outline-none"
            >
              <Plus size={14} /> Add Line Item
            </button>
          </div>

          {/* Totals & Actions */}
          <div className="p-5 sm:p-12 bg-gray-50/20">
            <div className="flex flex-col md:flex-row justify-between items-start gap-12">
              {/* Left Side: Discount & Send Options */}
              <div className="flex-1 w-full max-w-sm space-y-8">
                {/* Discount */}
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Percent size={12} /> Apply Discount (%)
                  </label>
                  <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm transition-all focus-within:border-black">
                    <input
                      type="number"
                      value={discount}
                      onChange={(e) => setDiscount(e.target.value)}
                      className="w-full bg-transparent border-none p-0 text-lg font-black focus:ring-0 outline-0"
                      placeholder="0"
                    />
                    <span className="text-gray-300 font-bold">%</span>
                  </div>
                </div>

                {/* New Send Options */}
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Send size={12} /> Send via
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {/* Email Option */}
                    <button
                      onClick={() =>
                        setSendOptions({
                          ...sendOptions,
                          email: !sendOptions.email,
                        })
                      }
                      className={`flex items-center gap-3 px-5 py-3 rounded-xl border transition-all duration-200 outline-none ${sendOptions.email
                        ? "bg-black text-white border-black shadow-lg"
                        : "bg-white text-gray-500 border-gray-100 hover:border-gray-300"
                        }`}
                    >
                      <Mail size={16} />
                      <span className="text-xs font-bold uppercase tracking-wide">
                        Email
                      </span>
                      {sendOptions.email && (
                        <CheckCircle2 size={14} className="ml-1 text-white" />
                      )}
                    </button>

                    {/* WhatsApp Option */}
                    <button
                      onClick={() =>
                        setSendOptions({
                          ...sendOptions,
                          whatsapp: !sendOptions.whatsapp,
                        })
                      }
                      className={`flex items-center gap-3 px-5 py-3 rounded-xl border transition-all duration-200 outline-none ${sendOptions.whatsapp
                        ? "bg-black text-white border-black shadow-lg"
                        : "bg-white text-gray-500 border-gray-100 hover:border-gray-300"
                        }`}
                    >
                      <MessageCircle size={16} />
                      <span className="text-xs font-bold uppercase tracking-wide">
                        WhatsApp
                      </span>
                      {sendOptions.whatsapp && (
                        <CheckCircle2 size={14} className="ml-1 text-white" />
                      )}
                    </button>

                    {/* Slack Option
                      <button 
                        onClick={() => setSendOptions({...sendOptions, slack: !sendOptions.slack})}
                        className={`flex items-center gap-3 px-5 py-3 rounded-xl border transition-all duration-200 outline-none ${
                          sendOptions.slack 
                          ? 'bg-black text-white border-black shadow-lg' 
                          : 'bg-white text-gray-500 border-gray-100 hover:border-gray-300'
                        }`}
                      >
                        <slack size={16} />
                        <span className="text-xs font-bold uppercase tracking-wide">Slack</span>
                        {sendOptions.slack && <CheckCircle2 size={14} className="ml-1 text-white" />}
                      </button> */}
                  </div>
                </div>
              </div>

              {/* Right Side: Totals */}
              <div className="w-full md:w-80 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400 font-bold uppercase tracking-tighter">
                    Subtotal
                  </span>
                  <span className="font-black text-gray-900">
                    ${subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400 font-bold uppercase tracking-tighter">
                    Discount
                  </span>
                  <span className="font-black text-red-500">
                    -${discountAmount.toLocaleString()}
                  </span>
                </div>
                <div className="pt-6 border-t-2 border-black flex justify-between items-end">
                  <span className="font-black text-gray-400 uppercase text-[10px] tracking-widest mb-1">
                    Final Total
                  </span>
                  <span className="font-black text-4xl text-black tracking-tighter">
                    ${total}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-end gap-6 pt-4">
          <button className="text-[10px] font-black text-gray-400 hover:text-black transition-colors uppercase tracking-[0.2em] outline-none">
            Discard Draft
          </button>
          <button
            onClick={handleGenerate}
            disabled={loading}
            className={`
    group
    bg-black text-white
    px-10 py-5 rounded-2xl
    text-[11px] font-black
    shadow-2xl
    flex items-center justify-center gap-3
    uppercase tracking-[0.2em]
    outline-none
    transition-all duration-300
    ${loading
                ? "opacity-70 cursor-not-allowed"
                : "hover:bg-gray-900 active:scale-95"
              }
  `}
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <span className="transition-transform duration-300 group-hover:-translate-x-1">
                  Generate & Send
                </span>
                <CheckCircle2
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </>
            )}
          </button>
        </div>
      </div>

      <style>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #f9fafb;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #e5e7eb;
            border-radius: 10px;
          }
        `}</style>
    </div>
  );
};

export default CreateInvoicePage;
