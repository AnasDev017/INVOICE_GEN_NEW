import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Filter, Search, ChevronDown, X, Printer, Plus, Eye, Download, Trash2, 
  CheckCircle2, Clock, AlertCircle, Loader2 
} from "lucide-react";
import axios from "axios";
import { baseUrl } from "../utils/apiConstant.js";

const InvoicesPage = ({ setPage }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  const filterRef = useRef(null);
  const [allInvoices, setAllInvoices] = useState([]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch invoices from API
  const fetchInvoices = async () => {
    try {
      const res = await axios.get(`${baseUrl}/getAllSavedInvoices`, { withCredentials: true });
      const data = res.data.user || [];
      
      // Remove duplicates based on invoiceNumber
      const uniqueInvoicesMap = new Map();
      data.forEach(inv => {
        if (!uniqueInvoicesMap.has(inv.invoiceNumber)) {
             uniqueInvoicesMap.set(inv.invoiceNumber, inv);
        }
      });
      const uniqueInvoices = Array.from(uniqueInvoicesMap.values());

      const formattedInvoices = uniqueInvoices.map(inv => ({
        id: inv.invoiceNumber, // Using invoiceNumber as the ID for the table
        _id: inv._id, // Keep the real MongoDB ID for actions like delete
        client: inv.clientName,
        amount: inv.totalAmount,
        status: inv.status,
        issueDate: inv.createdAt,
        dueDate: inv.updatedAt,
      }));
      setAllInvoices(formattedInvoices);
      console.log("SAVED INVOICES API DATA", formattedInvoices);
    } catch (error) {
      console.log("SAVED INVOICES API DATA ERR", error);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const filteredInvoices = allInvoices.filter(inv => {
    const matchesSearch =
      (inv.client?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (inv.id?.toLowerCase() || "").includes(searchTerm.toLowerCase());
    const matchesFilter =
      activeFilter === "All" || inv.status?.toLowerCase() === activeFilter.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  // Status styling
  const getStatusStyle = (status) => {
    switch (status) {
      case "Paid": return "bg-green-100 text-green-800 border-green-200";
      case "Pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Overdue": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Action Handlers
  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this invoice?")) return;
    try {
      await axios.delete(`${baseUrl}/deleteInvoice/${id}`, { withCredentials: true });
      // Update state locally
      setAllInvoices(prev => prev.filter(inv => inv._id !== id));
    } catch (error) {
      console.error("Error deleting invoice:", error);
      alert("Failed to delete invoice");
    }
  };

  const handleDownload = async (id, invoiceNumber, e) => {
    e.stopPropagation();
    try {
      const res = await axios.get(`${baseUrl}/downloadInvoice/${id}`, {
        withCredentials: true,
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${invoiceNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading invoice:", error);
      alert("Failed to download invoice");
    }
  };

  const handleView = async (id, e) => {
    e.stopPropagation();
    try {
      const res = await axios.get(`${baseUrl}/downloadInvoice/${id}`, {
        withCredentials: true,
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error viewing invoice:", error);
      alert("Failed to view invoice");
    }
  };

  // Status icons
  // Calculate Stats
  const stats = React.useMemo(() => {
    return allInvoices.reduce(
      (acc, inv) => {
        const amount = parseFloat(inv.amount.toString().replace(/[^0-9.-]+/g, "")) || 0;
        const status = inv.status ? inv.status.toLowerCase() : "";

        if (status === "paid") {
          acc.revenue += amount;
          acc.paidCount += 1;
        } else if (status === "pending") {
          acc.pending += amount;
        } else if (status === "overdue") {
          acc.overdueCount += 1;
        }
        return acc;
      },
      { revenue: 0, paidCount: 0, pending: 0, overdueCount: 0 }
    );
  }, [allInvoices]);

  const getStatusIcon = (status) => {
    switch(status) {
      case "Paid": return <CheckCircle2 size={12} className="text-green-600" />;
      case "Pending": return <Clock size={12} className="text-yellow-600" />;
      case "Overdue": return <AlertCircle size={12} className="text-red-600" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9] p-4 sm:p-8 md:p-10 font-sans text-slate-900 overflow-x-hidden">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}>
            <h2 className="text-4xl md:text-4xl font-black tracking-tighter text-black mb-4 uppercase">
              Invoice Management
            </h2>
            <p className="text-gray-400 text-md font-medium max-w-xl leading-relaxed">
              Experience live, high-fidelity invoice blueprints. 
            </p>
          </motion.div>
          <motion.button 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            onClick={() => setPage("Create Invoice")}
            className="flex items-center gap-2 bg-black text-white px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-widest shadow-2xl hover:bg-zinc-800 transition-all active:scale-95 whitespace-nowrap"
          >
            <Plus size={18} /> New Invoice
          </motion.button>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Revenue", val: `$${stats.revenue.toLocaleString()}` },
            { label: "Paid Invoices", val: stats.paidCount },
            { label: "Pending", val: `$${stats.pending.toLocaleString()}` },
            { label: "Overdue", val: stats.overdueCount },
          ].map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + (i * 0.1), duration: 0.6 }} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">{stat.label}</p>
              <h3 className="text-3xl font-black tracking-tighter text-black">{stat.val}</h3>
            </motion.div>
          ))}
        </div>

        {/* Table */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.8 }} className="bg-white rounded-[2.5rem] border border-gray-200 shadow-xl shadow-black/5 overflow-hidden min-h-[500px]">

          {/* Toolbar */}
          <div className="p-6 border-b border-gray-100 flex flex-col lg:flex-row gap-4 justify-between items-center bg-white/50 backdrop-blur-sm relative z-20">
            <div className="relative w-full lg:w-1/3">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input type="text" placeholder="Search clients or invoice ID..." className="w-full pl-12 pr-4 py-3.5 bg-gray-50 rounded-xl border-none text-sm font-medium focus:ring-2 focus:ring-black/10 outline-none" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <div className="flex gap-3 w-full lg:w-auto relative" ref={filterRef}>
              <button onClick={() => setIsFilterOpen(!isFilterOpen)} className={`flex-1 lg:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-bold transition-all uppercase tracking-widest border ${isFilterOpen || activeFilter !== "All" ? "bg-black text-white border-black" : "bg-white text-gray-600 border-gray-200 hover:border-black hover:text-black"}`}>
                <Filter size={14} /> {activeFilter === "All" ? "Filter" : activeFilter}
                <ChevronDown size={14} className={`${isFilterOpen ? "rotate-180" : ""} transition-transform`} />
              </button>

              <AnimatePresence>
                {isFilterOpen && (
                  <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} transition={{ duration: 0.2 }} className="absolute top-full right-0 mt-2 w-56 bg-white border border-gray-100 shadow-2xl rounded-2xl overflow-hidden z-50 p-2">
                    <p className="px-4 py-2 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 mb-1">Status Type</p>
                    {["All", "Paid", "Pending", "Overdue"].map(status => (
                      <button key={status} onClick={() => { setActiveFilter(status); setIsFilterOpen(false); }} className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold flex items-center justify-between ${activeFilter === status ? "bg-gray-50 text-black" : "text-gray-500 hover:bg-gray-50 hover:text-black"}`}>
                        {status}
                        {activeFilter === status && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                      </button>
                    ))}
                    {activeFilter !== "All" && (
                      <button onClick={() => setActiveFilter("All")} className="w-full mt-1 px-4 py-3 text-[10px] font-black text-red-500 uppercase tracking-widest hover:bg-red-50 rounded-xl flex items-center gap-2">
                        <X size={12} /> Clear Filter
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:border-black hover:text-black transition-all uppercase tracking-widest">
                <Printer size={14} /> Print
              </button>
            </div>
          </div>

          {/* Table View (Desktop) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50/50 text-left">
                  <th className="py-5 pl-10 pr-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Identifier</th>
                  <th className="py-5 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Recipient</th>
                  <th className="py-5 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Amount</th>
                  <th className="py-5 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Status</th>
                  <th className="py-5 px-4 pr-10 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                <AnimatePresence mode="popLayout">
                  {filteredInvoices.map(invoice => (
                    <motion.tr layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key={invoice.id} className="hover:bg-gray-50/80 transition-all group">
                      <td className="py-6 pl-10 pr-4 font-bold text-sm text-gray-900 tracking-tight">{invoice.id}</td>
                      <td className="py-6 px-4 font-bold text-sm">{invoice.client}</td>
                      <td className="py-6 px-4 font-black text-sm text-center">${invoice.amount}</td>
                      <td className="py-6 px-4 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black border uppercase tracking-wider ${getStatusStyle(invoice.status)}`}>
                          {getStatusIcon(invoice.status)} {invoice.status}
                        </span>
                      </td>
                      <td className="py-6 px-4 pr-10 text-right flex gap-3 justify-end">
                        <button 
                          onClick={(e) => handleView(invoice._id, e)}
                          className="p-2.5 text-slate-600 border border-slate-200 bg-white hover:bg-black hover:border-black hover:text-white rounded-xl transition-all shadow-sm hover:shadow-md active:scale-95" 
                          title="View Detail"
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          onClick={(e) => handleDownload(invoice._id, invoice.id, e)}
                          className="p-2.5 text-slate-600 border border-slate-200 bg-white hover:bg-black hover:border-black hover:text-white rounded-xl transition-all shadow-sm hover:shadow-md active:scale-95" 
                          title="Download PDF"
                        >
                          <Download size={16} />
                        </button>
                        <button 
                          onClick={(e) => handleDelete(invoice._id, e)}
                          className="p-2.5 text-red-500 border border-red-100 bg-red-50 hover:bg-red-500 hover:border-red-500 hover:text-white rounded-xl transition-all shadow-sm hover:shadow-md active:scale-95" 
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                  {filteredInvoices.length === 0 && (
                    <tr>
                      <td colSpan="5" className="py-20 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <Search size={40} className="text-gray-100" />
                          <p className="text-sm font-bold text-gray-400">No invoices found</p>
                          <button onClick={() => { setActiveFilter("All"); setSearchTerm(""); }} className="text-[10px] font-black uppercase text-black underline underline-offset-4">Clear all search</button>
                        </div>
                      </td>
                    </tr>
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Mobile View */}
          <div className="md:hidden space-y-4 p-4">
            <AnimatePresence mode="popLayout">
                {filteredInvoices.map(invoice => (
                    <motion.div layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} key={invoice.id} className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h4 className="font-bold text-lg text-black">{invoice.client}</h4>
                                <p className="text-xs text-gray-400 font-medium">#{invoice.id}</p>
                            </div>
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black border uppercase tracking-wider ${getStatusStyle(invoice.status)}`}>
                                {getStatusIcon(invoice.status)} {invoice.status}
                            </span>
                        </div>
                        <div className="flex justify-between items-end">
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Amount</p>
                                <p className="text-xl font-black text-black">${invoice.amount}</p>
                            </div>
                            <div className="flex gap-2">
                                <button 
                                  onClick={(e) => handleView(invoice._id, e)}
                                  className="p-2 text-slate-600 border border-slate-200 bg-white hover:bg-black hover:border-black hover:text-white rounded-lg transition-all active:scale-95" 
                                >
                                  <Eye size={16} />
                                </button>
                                <button 
                                  onClick={(e) => handleDownload(invoice._id, invoice.id, e)}
                                  className="p-2 text-slate-600 border border-slate-200 bg-white hover:bg-black hover:border-black hover:text-white rounded-lg transition-all active:scale-95" 
                                >
                                  <Download size={16} />
                                </button>
                                <button 
                                  onClick={(e) => handleDelete(invoice._id, e)}
                                  className="p-2 text-red-500 border border-red-100 bg-red-50 hover:bg-red-500 hover:border-red-500 hover:text-white rounded-lg transition-all active:scale-95" 
                                >
                                  <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
                {filteredInvoices.length === 0 && (
                     <div className="py-20 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <Search size={40} className="text-gray-100" />
                          <p className="text-sm font-bold text-gray-400">No invoices found</p>
                          <button onClick={() => { setActiveFilter("All"); setSearchTerm(""); }} className="text-[10px] font-black uppercase text-black underline underline-offset-4">Clear all search</button>
                        </div>
                      </div>
                  )}
            </AnimatePresence>
          </div>

        </motion.div>
      </div>
    </div>
  );
};

export default InvoicesPage;
