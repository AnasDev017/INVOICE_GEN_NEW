import React, { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Building, 
    CreditCard, 
    ToggleLeft,
    ToggleRight,
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



const SettingsPage = () => {
    const [activeTab, setActiveTab] = useState('general');
    const [isSaving, setIsSaving] = useState(false);
  
    const handleSave = () => {
      setIsSaving(true);
      setTimeout(() => {
        setIsSaving(false);
        // Using a custom UI notification is better, but keeping logic consistent
        alert('Settings saved successfully!');
      }, 1000);
    };

    // Helper component for styled select menus
    const StyledSelect = ({ label, icon: Icon, options, defaultValue }) => (
      <div className="space-y-2">
        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
          {Icon && <Icon size={12} />} {label}
        </label>
        <div className="relative group">
          <select 
            defaultValue={defaultValue}
            className="w-full bg-gray-50 border-none rounded-xl py-3.5 pl-4 pr-10 text-sm font-bold focus:ring-2 focus:ring-black/5 transition-all outline-none appearance-none cursor-pointer hover:bg-gray-100/80"
          >
            {options.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-black transition-colors">
            <ChevronDown size={16} />
          </div>
        </div>
      </div>
    );
  
    return (
      <div className="min-h-screen bg-[#FDFDFD] text-[#1A1A1A] p-4 sm:p-8 font-sans">
        <div className="max-w-6xl mx-auto space-y-8 ">
          
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }} 
            className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
          >
            <div>
              <h1 className="text-3xl font-black tracking-tight text-gray-900 uppercase">Settings & Preferences</h1>
              <p className="text-gray-500 font-medium mt-1">Configure your workspace and invoicing defaults.</p>
            </div>
           
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl text-sm font-bold uppercase tracking-widest hover:bg-gray-900 active:scale-95 transition-all shadow-lg disabled:opacity-70"
            >
              {isSaving ? 'Saving...' : 'Save Changes'} <Save size={16} />
            </button>
          </motion.div>
  
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1 space-y-2">
              {[
                { id: 'general', label: 'General', icon: Building },
                { id: 'invoicing', label: 'Invoicing', icon: FileText },
                { id: 'notifications', label: 'Notifications', icon: Bell },
                { id: 'security', label: 'Security', icon: ShieldCheck },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                    activeTab === tab.id 
                    ? 'bg-black text-white shadow-md' 
                    : 'text-gray-500 hover:bg-gray-100 hover:text-black'
                  }`}
                >
                  <tab.icon size={18} />
                  {tab.label}
                </button>
              ))}
            </div>
  
            {/* Main Content Area */}
            <div className="lg:col-span-3">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* GENERAL SETTINGS TAB */}
                  {activeTab === 'general' && (
                    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                      <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Building size={20} /> Business Details
                      </h3>
                      
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Business Name</label>
                            <input 
                              type="text" 
                              defaultValue="InvoicePro LLC" 
                              className="w-full bg-gray-50 border-none rounded-xl py-3.5 px-4 text-sm font-bold focus:ring-2 focus:ring-black/5 transition-all outline-none"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tax ID / VAT Number</label>
                            <input 
                              type="text" 
                              placeholder="Optional"
                              className="w-full bg-gray-50 border-none rounded-xl py-3.5 px-4 text-sm font-bold focus:ring-2 focus:ring-black/5 transition-all outline-none"
                            />
                          </div>
                        </div>
  
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Address</label>
                          <textarea 
                            rows="3"
                            defaultValue="123 Business Rd, Suite 100, New York, NY 10001"
                            className="w-full bg-gray-50 border-none rounded-xl py-3.5 px-4 text-sm font-medium focus:ring-2 focus:ring-black/5 transition-all outline-none resize-none"
                          />
                        </div>
  
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-50">
                          <StyledSelect 
                            label="Default Currency" 
                            icon={Globe}
                            defaultValue="USD"
                            options={[
                              { label: 'USD ($)', value: 'USD' },
                              { label: 'EUR (€)', value: 'EUR' },
                              { label: 'GBP (£)', value: 'GBP' },
                            ]}
                          />
                          <StyledSelect 
                            label="Timezone" 
                            icon={Clock}
                            defaultValue="EST"
                            options={[
                              { label: 'Eastern Time (EST)', value: 'EST' },
                              { label: 'Pacific Time (PST)', value: 'PST' },
                              { label: 'London (GMT)', value: 'GMT' },
                              { label: 'Universal (UTC)', value: 'UTC' },
                            ]}
                          />
                        </div>
                      </div>
                    </div>
                  )}
  
                  {/* INVOICING DEFAULTS TAB */}
                  {activeTab === 'invoicing' && (
                    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                      <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <FileText size={20} /> Invoice Defaults
                      </h3>
  
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <StyledSelect 
                            label="Payment Terms"
                            defaultValue="Net 30"
                            options={[
                              { label: 'Net 30 Days', value: 'Net 30' },
                              { label: 'Net 15 Days', value: 'Net 15' },
                              { label: 'Due on Receipt', value: 'Due' },
                            ]}
                          />
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Default Tax Rate (%)</label>
                            <input 
                              type="number" 
                              defaultValue="0" 
                              className="w-full bg-gray-50 border-none rounded-xl py-3.5 px-4 text-sm font-bold focus:ring-2 focus:ring-black/5 transition-all outline-none"
                            />
                          </div>
                        </div>
  
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Default Footer Message</label>
                          <textarea 
                            rows="3"
                            defaultValue="Thank you for your business! Please make checks payable to InvoicePro LLC."
                            className="w-full bg-gray-50 border-none rounded-xl py-3.5 px-4 text-sm font-medium focus:ring-2 focus:ring-black/5 transition-all outline-none resize-none"
                          />
                        </div>
                      </div>
                    </div>
                  )}
  
                  {/* NOTIFICATIONS TAB */}
                  {activeTab === 'notifications' && (
                    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                      <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Bell size={20} /> Email Notifications
                      </h3>
  
                      <div className="space-y-4">
                        {[
                          { label: "Invoice Viewed", desc: "Get notified when a client views an invoice." },
                          { label: "Payment Received", desc: "Get notified when a payment is successfully processed." },
                          { label: "Weekly Report", desc: "Receive a weekly summary of your business performance." },
                        ].map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:bg-gray-100/50 transition-colors">
                            <div>
                              <h4 className="font-bold text-sm text-gray-900">{item.label}</h4>
                              <p className="text-xs text-gray-500 font-medium">{item.desc}</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" className="sr-only peer" defaultChecked />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
  
                  {/* SECURITY TAB */}
                  {activeTab === 'security' && (
                    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                      <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <ShieldCheck size={20} /> Security Settings
                      </h3>
                      
                      <div className="p-4 bg-yellow-50 rounded-2xl border border-yellow-100 flex gap-4 mb-6">
                        <div className="mt-1 text-yellow-600"><CreditCard size={20} /></div>
                        <div>
                          <h4 className="font-bold text-sm text-yellow-800">Two-Factor Authentication</h4>
                          <p className="text-xs text-yellow-700 mt-1 leading-relaxed">
                            Add an extra layer of security to your account by enabling 2FA.
                          </p>
                        </div>
                        <button className="ml-auto text-xs font-bold text-black underline hover:text-gray-700 transition-colors">Enable</button>
                      </div>
  
                      <div className="space-y-4">
                         <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                            <div>
                              <h4 className="font-bold text-sm text-gray-900">Session Timeout</h4>
                              <p className="text-xs text-gray-500 font-medium">Automatically log out after inactivity.</p>
                            </div>
                            <div className="w-32">
                              <StyledSelect 
                                label=""
                                defaultValue="15 mins"
                                options={[
                                  { label: '15 mins', value: '15' },
                                  { label: '30 mins', value: '30' },
                                  { label: '1 hour', value: '60' },
                                ]}
                              />
                            </div>
                         </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    );
};

  export default SettingsPage