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
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";


// --- MOCK DATA ---
const mockStats = [
  {
    title: "Total Revenue (YTD)",
    value: "$0",
    icon: DollarSign,
    color: "text-green-600",
    bgColor: "bg-green-100",
    change: "No Data",
    trend: "neutral",
  },
  {
    title: "Pending Payments",
    value: "$0",
    icon: Clock,
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
    change: "No Data",
    trend: "neutral",
  },
  {
    title: "Overdue Invoices",
    value: "$0",
    icon: AlertTriangle,
    color: "text-red-600",
    bgColor: "bg-red-100",
    change: "No Data",
    trend: "neutral",
  },
  {
    title: "AI Predicted Cashflow",
    value: "$0",
    icon: TrendingUp,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    change: "No Data",
    trend: "neutral",
  },
];

// --- UTILITY COMPONENTS ---

const StatCard = ({
  title,
  value,
  icon: Icon,
  color,
  bgColor,
  change,
  trend,
}) => {
  const TrendIcon =
    trend === "up" ? ArrowUp : trend === "down" ? ArrowDown : null;
  const trendColor =
    trend === "up"
      ? "text-green-500"
      : trend === "down"
        ? "text-red-500"
        : "text-gray-500";

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-lg transition hover:shadow-xl hover:scale-[1.01] duration-300 ease-in-out">
      <div className="flex items-center justify-between">

        <p className="text-gray-500 font-medium text-sm">{title}</p>
        <div className={`p-2 rounded-full ${bgColor}`}>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
      </div>
      <h2 className="text-3xl font-bold text-black mt-4">{value}</h2>
      <div className="flex items-center mt-3 text-sm">
        {TrendIcon && <TrendIcon className={`w-4 h-4 mr-1 ${trendColor}`} />}
        <span className={`${trendColor} font-semibold`}>{change}</span>
        <span className="text-gray-400 ml-2">
          {title.includes("YTD") ? "since last month" : ""}
        </span>
      </div>
    </div>
  );
};

const ResponsiveBarChart = ({ data, title }) => {
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);

  const handleResize = useCallback(() => {
    if (containerRef.current) {
      // Ensure minimum width for readability
      setContainerWidth(Math.max(containerRef.current.offsetWidth, 250));
    }
  }, []);

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  const chartHeight = 250;
  const horizontalPadding = containerWidth < 400 ? 20 : 40; // Space for the Y-axis labels
  const verticalPadding = 20;

  const effectiveHeight = chartHeight - 2 * verticalPadding;
  const effectiveWidth = containerWidth - horizontalPadding;
  const barWidth = containerWidth < 400 ? 8 : 12; // Adjusted bar width for mobile

  const displayData = containerWidth < 500 ? data.slice(-4) : data; // Show only last 4 months on small screens

  // Check if displayData is empty to prevent division by zero
  if (displayData.length === 0) {
    return (
      <div
        ref={containerRef}
        className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-lg h-[350px] flex items-center justify-center"
      >
        No Data Available
      </div>
    );
  }

  if (containerWidth === 0) {
    return (
      <div
        ref={containerRef}
        className="bg-white p-6 rounded-2xl border border-gray-100 shadow-lg h-[350px] flex items-center justify-center"
      >
        Loading Chart...
      </div>
    );
  }

  const allValues = displayData.flatMap((d) => [d.revenue, d.pending]);
  const maxVal = Math.max(...allValues) || 100;
  const minVal = 0; // Bar charts typically start at 0

  const range = maxVal - minVal;

  // Function to calculate the Y position and height of a bar
  const getBarMetrics = (value) => {
    if (range === 0) return { y: effectiveHeight + verticalPadding, height: 0 };

    const normalizedHeight = (value - minVal) / range;
    const height = normalizedHeight * effectiveHeight;
    const y = effectiveHeight + verticalPadding - height;
    return { y, height };
  };

  // Calculate X position for the center of each group of bars
  const getXCenter = (index) => {
    const step = effectiveWidth / displayData.length;
    // Start from the middle of the first segment
    return index * step + step / 2 + horizontalPadding;
  };

  const Y_MAX_VAL = maxVal.toFixed(0);
  const Y_MID_VAL = (maxVal / 2).toFixed(1);
  const Y_MIN_VAL = 0;

  const Y_MAX_POS = verticalPadding;
  const Y_MID_POS = chartHeight / 2;
  const Y_MIN_POS = chartHeight - verticalPadding;

  // Total width used by a bar group (2 bars + spacing)
  const barGroupWidth = barWidth * 2 + 6;

  return (
    <div
      ref={containerRef}
      className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-lg"
    >
      <h3 className="text-xl font-bold text-black mb-6">{title}</h3>

      <div className="relative" style={{ height: `${chartHeight}px` }}>
        {/* Y-Axis Labels (Text only - positioned absolutely) */}
        <div className="absolute left-0 top-0 h-full pointer-events-none text-xs text-gray-500 z-10">
          {/* Max Label */}
          <div
            className="absolute left-0 pr-1"
            style={{ top: `${Y_MAX_POS}px`, transform: "translateY(-50%)" }}
          >
            {Y_MAX_VAL}
          </div>

          {/* Mid Label */}
          <div
            className="absolute left-0 pr-1"
            style={{ top: `${Y_MID_POS}px`, transform: "translateY(-50%)" }}
          >
            {Y_MID_VAL}
          </div>

          {/* Min Label */}
          <div
            className="absolute left-0 pr-1"
            style={{ top: `${Y_MIN_POS}px`, transform: "translateY(-50%)" }}
          >
            {Y_MIN_VAL}
          </div>
        </div>

        {/* SVG Chart Area (Contains Bars and Grid Lines) */}
        <svg width="100%" height={chartHeight} className="overflow-hidden">
          {/* Grid Lines (Now correctly inside the SVG) */}
          <g className="text-gray-200">
            {/* Max Line */}
            <line
              x1={horizontalPadding}
              y1={Y_MAX_POS}
              x2={containerWidth}
              y2={Y_MAX_POS}
              stroke="#E5E7EB"
              strokeDasharray="3 3"
            />
            {/* Mid Line */}
            <line
              x1={horizontalPadding}
              y1={Y_MID_POS}
              x2={containerWidth}
              y2={Y_MID_POS}
              stroke="#E5E7EB"
              strokeDasharray="3 3"
            />
            {/* Base Line */}
            <line
              x1={horizontalPadding}
              y1={Y_MIN_POS}
              x2={containerWidth}
              y2={Y_MIN_POS}
              stroke="#E5E7EB"
              strokeWidth="1"
            />
          </g>

          {/* Bars */}
          {displayData.map((d, index) => {
            const xCenter = getXCenter(index);

            // Revenue Bar
            const revenueMetrics = getBarMetrics(d.revenue);
            const revenueX = xCenter - barGroupWidth / 2;

            // Pending Bar
            const pendingMetrics = getBarMetrics(d.pending);
            const pendingX = xCenter - barGroupWidth / 2 + barWidth + 6;

            return (
              <g key={index}>
                {/* Revenue Bar (Black) */}
                <rect
                  x={revenueX}
                  y={revenueMetrics.y}
                  width={barWidth}
                  height={revenueMetrics.height}
                  fill="black"
                  rx="3"
                  className="transition-all duration-700 ease-out origin-bottom hover:opacity-75"
                />
                {/* Pending Bar (Gray) */}
                <rect
                  x={pendingX}
                  y={pendingMetrics.y}
                  width={barWidth}
                  height={pendingMetrics.height}
                  fill="rgb(156, 163, 175)" // Tailwind gray-400
                  rx="3"
                  className="transition-all duration-700 ease-out origin-bottom hover:opacity-75"
                />
              </g>
            );
          })}
        </svg>

        {/* X-Axis Labels */}
        <div className="absolute bottom-0 left-0 w-full flex text-xs text-gray-500 font-medium">
          {displayData.map((d, index) => (
            <div
              key={index}
              className="absolute text-center"
              style={{
                left: `${getXCenter(index)}px`,
                transform: "translateX(-50%)",
              }}
            >
              {d.month}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-8 mt-10 text-sm pt-4 border-t border-gray-100">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-black rounded-full mr-2"></div>
          Total Revenue
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-gray-400 rounded-full mr-2"></div>
          Pending Payments
        </div>
      </div>
    </div>
  );
};


const mockInvoices = [
  {
    id: 9025,
    client: "Acme Corp",
    amount: "$5,200",
    status: "Paid",
    date: "Oct 24",
    due: "Nov 24",
    items: 2,
  },
  {
    id: 9024,
    client: "Apex Solutions",
    amount: "$9,600",
    status: "Pending",
    date: "Oct 23",
    due: "Nov 23",
    items: 5,
  },
  {
    id: 9023,
    client: "Global Tech",
    amount: "$3,200",
    status: "Overdue",
    date: "Oct 20",
    due: "Nov 20",
    items: 1,
  },
  {
    id: 9022,
    client: "Innovate LLC",
    amount: "$1,800",
    status: "Paid",
    date: "Oct 19",
    due: "Nov 19",
    items: 3,
  },
  {
    id: 9021,
    client: "Future Hub",
    amount: "$2,500",
    status: "Pending",
    date: "Oct 18",
    due: "Nov 18",
    items: 4,
  },
  {
    id: 9020,
    client: "Quantum Dynamics",
    amount: "$12,100",
    status: "Paid",
    date: "Oct 17",
    due: "Nov 17",
    items: 2,
  },
];



const DashboardPage = ({ setPage }) => {
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
      "Some Features Are Currently Disable From Team. Because This Is Underdevelopment!",
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

  const [user, setUser] = useState("");
  const [allInvoices, setAllInvoices] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get(`${baseUrl}/auth/api/me`, {
        withCredentials: true,
      })
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => {
        // token invalid → logout
        console.log(err);
        navigate("/login");
      });
  }, []);
  useEffect(() => {
    const interval = setInterval(() => {
      axios.get(`${baseUrl}/updateCredits`, {
        withCredentials: true,
      })
        .then((res) => {
          console.log("CREDITS API", res.data);
        })
        .catch((err) => {
          console.log("CREDITS API ERROR", err);
        });
    }, 86400000);

    return () => clearInterval(interval);
  }, []);

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

  const [stats, setStats] = useState([]);
  const [chartData, setChartData] = useState([]);

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${baseUrl}/getDashboardStats`, {
        withCredentials: true,
      });
      if (res.data.success) {
        setStats(res.data.stats);
        setChartData(res.data.chartData);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([fetchStats(), fetchInvoices()]);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return <Loader />;
  }
  return (
    <>
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
      <motion.div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }} >
        <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-black mb-2 sm:mb-4 uppercase">
          Dashboard Overview
        </h2>
        <button
          onClick={() => setPage("Create Invoice")}
          className="w-full sm:w-auto bg-black text-white px-6 py-3 rounded-full font-semibold flex items-center justify-center shadow-lg hover:bg-gray-800 transition transform hover:scale-[1.05] active:scale-[0.98]"
        >
          <Zap className="w-5 h-5 mr-2 fill-yellow-300 text-yellow-300" />
          New Invoice
        </button>
      </motion.div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.length > 0 ? (
          stats.map((stat, index) => {
            const iconMap = {
              revenue: DollarSign,
              pending: Clock,
              overdue: AlertTriangle,
              cashflow: TrendingUp
            };
            const colorMap = {
              revenue: "text-green-600",
              pending: "text-yellow-600",
              overdue: "text-red-600",
              cashflow: "text-blue-600"
            };
            const bgMap = {
              revenue: "bg-green-100",
              pending: "bg-yellow-100",
              overdue: "bg-red-100",
              cashflow: "bg-blue-100"
            };

            return (
              <StatCard
                key={index}
                {...stat}
                icon={iconMap[stat.type] || DollarSign}
                color={colorMap[stat.type] || "text-gray-600"}
                bgColor={bgMap[stat.type] || "bg-gray-100"}
              />
            );
          })
        ) : (
          // Loading Skeleton or Default
          mockStats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))
        )}
      </div>

      {/* Charts and Tables Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
        {/* Main Chart Area (2/3 width on md/lg screens) */}
        <div className="md:col-span-2">
          <ResponsiveBarChart
            data={chartData.length > 0 ? chartData : []}
            title="Monthly Revenue & Cashflow Trend"
          />
        </div>

        {/* Recent Invoices Table (1/3 width on md/lg screens) */}
        <div className="md:col-span-1">
          <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-lg">
            <h3 className="text-xl font-bold text-black mb-6">
              Recent Invoices
            </h3>

            <ul className="space-y-4">
              {(allInvoices.length > 0 ? allInvoices : []).slice(0, 5).map((invoice) => {
                let statusClasses = "";
                switch (invoice.status) {
                  case "Paid":
                  case "paid":
                    statusClasses = "bg-green-100 text-green-700";
                    break;
                  case "Pending":
                  case "pending":
                    statusClasses = "bg-yellow-100 text-yellow-700";
                    break;
                  case "Overdue":
                  case "overdue":
                    statusClasses = "bg-red-100 text-red-700";
                    break;
                  default:
                    statusClasses = "bg-gray-100 text-gray-700";
                }

                return (
                  <li
                    key={invoice.id}
                    className="flex justify-between items-center border-b border-gray-100 pb-3 last:border-b-0 last:pb-0 hover:bg-gray-50 p-2 rounded-lg transition duration-200 cursor-pointer"
                  >
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-800 text-sm truncate">
                        {invoice.id} - {invoice.client}
                      </p>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full ${statusClasses}`}
                      >
                        {invoice.status}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-black text-sm">${invoice.amount}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{new Date(invoice.issueDate).toLocaleDateString()}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 ml-2 cursor-pointer hover:text-black" />
                  </li>
                );
              })}
              {allInvoices.length === 0 && (
                <div className="text-center py-8 text-gray-400 text-xs font-bold uppercase tracking-widest">No recent invoices</div>
              )}
            </ul>
            <button
              onClick={() => setPage("Invoices")}
              className="w-full mt-6 text-center text-sm font-semibold text-black/80 hover:text-black transition"
            >
              View All Invoices
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardPage