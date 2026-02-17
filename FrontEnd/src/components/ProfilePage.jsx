import React, { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  KeyRound,
  CreditCard,
  Shield,
  Activity,
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


const ProfilePage = () => {
  const [verificationCode, setVerificationCode] = useState("");
  const [userData, setUserData] = useState(null);
  const [newName, setNewName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [showVerification, setShowVerification] = useState(false);

  const [snackbar, setSnackbar] = useState({ show: false, message: "", type: "success" });

  const showSnackbar = (message, type = "success") => {
    setSnackbar({ show: true, message, type });
    // Auto-hide after 4 seconds
    setTimeout(() => setSnackbar({ show: false, message: "", type: "success" }), 4000);
  };

  // Fetch User Data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get(`${baseUrl}/auth/api/me`, { withCredentials: true });
        setUserData(res.data);
        setNewName(res.data?.name || "");
        setLoading(false);
        console.log("PROFILE API RES:", res.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleInitialPasswordUpdate = (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      showSnackbar("Password must be at least 6 characters", "error");
      return;
    }
    // Step 1: Show the verification input and message
    setShowVerification(true);
    showSnackbar("Verification code sent to your email", "success");
  };

  const handleFinalVerify = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      // Simulate API call for verification
      setTimeout(() => {
        showSnackbar("Password updated successfully!", "success");
        setShowVerification(false);
        setNewPassword("");
        setVerificationCode("");
        setIsUpdating(false);
      }, 1500);
    } catch (error) {
      showSnackbar("Invalid verification code", "error");
      setIsUpdating(false);
    }
  };
  // Update Profile Handler
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      await api.post(`${baseUrl}/auth/updateProfile`, {
        newName,
        newPassword,
        email: userData?.email
      });
      showSnackbar("Profile updated successfully!", "success");
      // Ideally refresh data here
    } catch (error) {
      console.error("Update failed", error);
      showSnackbar("Something went worng!", "error");
    } finally {
      setIsUpdating(false);
    }
  };

  // Profile Photo Upload Handler
  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      setUserData(prev => ({ ...prev, uploading: true }));
      await api.post(`${baseUrl}/auth/uploadProfilePhoto`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true
      });
      // Optimistic update or refetch would go here
      alert("Photo updated!");
    } catch (error) {
      console.error("Photo upload failed", error);
      showSnackbar("Something went worng!", "error");

    } finally {
      setUserData(prev => ({ ...prev, uploading: false }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-[#1A1A1A] p-4 sm:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
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
        {/* Header */}
        <motion.div key={activeTab}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 uppercase">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-gray-900">Account Settings</h1>
            <p className="text-gray-500 font-medium mt-1">Manage your profile details and security preferences.</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Sidebar / Navigation Card */}
          <div className="lg:col-span-1 space-y-6">

            {/* User Info Card */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
              <div className="relative group mb-4">
                <div className="w-28 h-28 rounded-full p-1 border-2 border-dashed border-gray-200 group-hover:border-black transition-colors">
                  <img
                    src={userData?.profilePhoto || `https://placehold.co/150x150/1A1A1A/FFFFFF?text=${userData?.name?.[0]?.toUpperCase() || 'U'}`}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <label htmlFor="photo-upload" className="absolute bottom-0 right-0 bg-black text-white p-2 rounded-full cursor-pointer hover:bg-gray-800 transition shadow-lg">
                  <Camera size={14} />
                  <input id="photo-upload" type="file" className="hidden" onChange={handlePhotoUpload} />
                </label>
                {userData?.uploading && (
                  <div className="absolute inset-0 bg-white/80 rounded-full flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>

              <h2 className="text-xl font-bold text-gray-900">{userData?.name}</h2>
              <p className="text-sm text-gray-500 font-medium mb-4">{userData?.email}</p>

              <div className="px-4 py-1.5 bg-black text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
                {userData?.subscriptionPlan || "Free Plan"}
              </div>
            </div>

            {/* Menu Links */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              {[
                { id: "overview", label: "Overview", icon: Layout },
                { id: "security", label: "Login & Security", icon: Lock },
                { id: "billing", label: "Plan & Billing", icon: CreditCard },
                { id: "notifications", label: "Notifications", icon: Bell },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between p-4 text-sm font-bold transition-all border-b border-gray-50 last:border-0 ${activeTab === item.id
                      ? "bg-gray-50 text-black border-l-4 border-l-black"
                      : "text-gray-500 hover:text-black hover:bg-gray-50"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={18} />
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight size={16} className="text-gray-300" />
                </button>
              ))}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2">

            {/* OVERVIEW TAB */}
            {activeTab === "overview" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Stats Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-2 bg-gray-50 rounded-xl"><Activity size={20} /></div>
                      <span className="text-green-600 font-bold text-xs bg-green-50 px-2 py-1 rounded-lg">+12%</span>
                    </div>
                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Login Activity</p>
                    <h3 className="text-2xl font-black mt-1">High</h3>
                  </div>
                  <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-2 bg-gray-50 rounded-xl"><Shield size={20} /></div>
                      <span className="text-gray-400 font-bold text-xs bg-gray-50 px-2 py-1 rounded-lg">Active</span>
                    </div>
                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Security Level</p>
                    <h3 className="text-2xl font-black mt-1">Strong</h3>
                  </div>
                </div>

                {/* Edit Profile Form */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-bold">Profile Details</h3>
                    <button
                      onClick={() => document.getElementById('nameInput').focus()}
                      className="text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-black transition-colors"
                    >
                      Edit Info
                    </button>
                  </div>

                  <form onSubmit={handleUpdateProfile} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Full Name</label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                          <input
                            id="nameInput"
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            className="w-full bg-gray-50 border-none rounded-xl py-3 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-black/5 transition-all outline-none"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Address</label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                          <input
                            type="email"
                            value={userData?.email}
                            readOnly
                            className="w-full bg-gray-50/50 border-none rounded-xl py-3 pl-12 pr-4 text-sm font-medium text-gray-500 cursor-not-allowed outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-gray-50 flex justify-end">
                      <button
                        type="submit"
                        disabled={isUpdating}
                        className="bg-black text-white px-8 py-3 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-gray-900 transition-all flex items-center gap-2 shadow-lg disabled:opacity-50"
                      >
                        {isUpdating ? "Saving..." : "Save Changes"} <CheckCircle2 size={16} />
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* SECURITY TAB */}
            {activeTab === "security" && (
              <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                <h3 className="text-xl font-bold mb-6">Password & Authentication</h3>

                <div className="space-y-6">
                  {!showVerification ? (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-6"
                    >
                      <div className="p-4 bg-yellow-50 rounded-2xl border border-yellow-100 flex gap-4">
                        <div className="mt-1 text-yellow-600"><Lock size={20} /></div>
                        <div>
                          <h4 className="font-bold text-sm text-yellow-800">Security Recommendation</h4>
                          <p className="text-xs text-yellow-700 mt-1 leading-relaxed">
                            For better security, we recommend changing your password every 90 days.
                          </p>
                        </div>
                      </div>

                      <form onSubmit={handleInitialPasswordUpdate} className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">New Password</label>
                          <div className="relative">
                            <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                              type="password"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              placeholder="••••••••"
                              className="w-full bg-gray-50 border-none rounded-xl py-3 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-black/5 transition-all outline-none"
                            />
                          </div>
                        </div>
                        <button
                          type="submit"
                          className="w-full py-4 bg-black text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-gray-900 transition-all flex items-center justify-center gap-2"
                        >
                          Update Password <ArrowRight size={16} />
                        </button>
                      </form>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-6"
                    >
                      {/* Step 2: Verification UI */}
                      <div className="p-5 bg-blue-50 rounded-2xl border border-blue-100 flex gap-4">
                        <div className="mt-1 text-blue-600"><Mail size={24} /></div>
                        <div>
                          <h4 className="font-bold text-sm text-blue-800">Check your email for verification code</h4>
                          <p className="text-xs text-blue-700 mt-1 leading-relaxed">
                            We've sent a 6-digit code to <strong>{userData?.email}</strong>. Enter it below to complete the update.
                          </p>
                        </div>
                      </div>

                      <form onSubmit={handleFinalVerify} className="space-y-4 text-center">
                        <div className="space-y-3">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Verification Code</label>
                          <input
                            type="text"
                            maxLength={6}
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                            placeholder="· · · · · ·"
                            className="w-full max-w-[280px] mx-auto bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl py-4 px-4 text-2xl font-black text-center tracking-[0.5em] focus:border-black focus:ring-0 transition-all outline-none"
                          />
                        </div>

                        <div className="pt-2 flex flex-col gap-3">
                          <button
                            type="submit"
                            disabled={verificationCode.length !== 6 || isUpdating}
                            className="w-full py-4 bg-gray-950 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-gray-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                          >
                            {isUpdating ? "Verifying..." : "Verify & Complete"}
                          </button>

                          <button
                            type="button"
                            onClick={() => setShowVerification(false)}
                            className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-black transition-colors"
                          >
                            Back to password
                          </button>
                        </div>
                      </form>
                    </motion.div>
                  )}
                </div>
              </div>
            )}

            {/* BILLING TAB */}
            {activeTab === "billing" && (
              <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xl font-bold">Current Plan</h3>
                  <span className="bg-black text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">Active</span>
                </div>

                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 mb-8">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-2xl font-black">Pro Member</h4>
                      <p className="text-gray-500 text-sm font-medium">$29/month</p>
                    </div>
                    <CreditCard size={24} className="text-gray-400" />
                  </div>
                  <div className="w-full bg-gray-200 h-1.5 rounded-full mb-2 overflow-hidden">
                    <div className="bg-black h-full w-3/4 rounded-full"></div>
                  </div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider text-right">24 days remaining</p>
                </div>

                <h4 className="text-sm font-bold mb-4">Billing History</h4>
                <div className="space-y-2">
                  {[
                    { date: "Oct 01, 2024", amount: "$29.00", status: "Paid" },
                    { date: "Sep 01, 2024", amount: "$29.00", status: "Paid" },
                    { date: "Aug 01, 2024", amount: "$29.00", status: "Paid" },
                  ].map((inv, idx) => (
                    <div key={idx} className="flex justify-between items-center p-4 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer group">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-white transition-colors"><FileTextIcon /></div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">Invoice #2024-00{3 - idx}</p>
                          <p className="text-xs text-gray-400 font-medium">{inv.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold">{inv.amount}</p>
                        <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded uppercase">{inv.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

// Small helper icon component
const FileTextIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
);

export default ProfilePage