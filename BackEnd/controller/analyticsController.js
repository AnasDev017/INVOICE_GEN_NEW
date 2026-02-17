import invoiceModel from "../models/invoiceModel.js";

export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const invoices = await invoiceModel.find({ user: userId });

    let totalRevenue = 0;
    let pendingPayments = 0;
    let overdueInvoices = 0;
    let pendingCount = 0; // To count number of pending invoices

    invoices.forEach((invoice) => {
        // Normalize status to lowercase for comparison
        const status = invoice.status ? invoice.status.toLowerCase() : "";
        
        if (status === "paid") {
            totalRevenue += Number(invoice.totalAmount);
        } else if (status === "pending") {
            pendingPayments += Number(invoice.totalAmount);
            pendingCount++;
        } else if (status === "overdue") {
            overdueInvoices += Number(invoice.totalAmount);
        }
    });

    const aiPredictedCashflow = totalRevenue + pendingPayments;

    const stats = [
      {
        title: "Total Revenue",
        value: `$${totalRevenue.toLocaleString()}`,
        raw: totalRevenue,
        type: "revenue",
        change: "+0% (vs last month)", // You can implement real comparison later
        trend: "up"
      },
      {
        title: "Pending Payments",
        value: `$${pendingPayments.toLocaleString()}`,
        raw: pendingPayments,
        type: "pending",
        date: `${pendingCount} Invoices`,
        trend: "neutral"
      },
      {
        title: "Overdue Invoices",
        value: `$${overdueInvoices.toLocaleString()}`,
        raw: overdueInvoices,
        type: "overdue",
        trend: "down"
      },
      {
        title: "AI Predicted Cashflow",
        value: `$${aiPredictedCashflow.toLocaleString()}`,
        raw: aiPredictedCashflow,
        type: "cashflow",
        trend: "up"
      }
    ];

    // --- CHART DATA CALCULATION (Last 6 Months) ---
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const chartData = [];
    const today = new Date();
    
    // Initialize last 6 months
    for (let i = 5; i >= 0; i--) {
        const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const monthIndex = d.getMonth();
        const year = d.getFullYear();
        chartData.push({
            month: months[monthIndex],
            year: year, // internal use for filtering
            revenue: 0,
            pending: 0
        });
    }

    invoices.forEach(inv => {
        const date = new Date(inv.createdAt);
        const invMonth = date.getMonth();
        const invYear = date.getFullYear();
        
        // Find matching month in chartData
        const bucket = chartData.find(d => d.month === months[invMonth] && d.year === invYear);
        
        if (bucket) {
            const amount = Number(inv.totalAmount);
            const status = inv.status ? inv.status.toLowerCase() : "";
            
            if (status === 'paid') {
                bucket.revenue += amount;
            } else if (status === 'pending') {
                bucket.pending += amount; 
            }
        }
    });

    res.status(200).json({ success: true, stats, chartData });

  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
