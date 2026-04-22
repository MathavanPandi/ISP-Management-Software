import React from 'react';
import { 
  BarChart3, 
  Calendar, 
  Download, 
  ChevronRight,
  Building2,
  Globe,
  CreditCard,
  FileText,
  Clock,
  Zap,
  Shield,
  TrendingUp,
  PieChart as PieChartIcon,
  ChevronDown
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { cn } from '../lib/utils';
import { rechargeService } from '../services/rechargeService';
import { locationService } from '../services/locationService';
import { Loader2 } from 'lucide-react';

const COLORS = ['#007AFF', '#34C759', '#FF9500', '#FF3B30', '#AF52DE'];

export function Reports() {
  const [downloading, setDownloading] = React.useState<string | null>(null);
  const [reportType, setReportType] = React.useState<'Daily' | 'Monthly' | 'Yearly'>('Monthly');
  const [showTypeDropdown, setShowTypeDropdown] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [chartData, setChartData] = React.useState<any[]>([]);
  const [ispDistribution, setIspDistribution] = React.useState<any[]>([]);
  const [statsData, setStatsData] = React.useState<any>(null);

  React.useEffect(() => {
    fetchData();
  }, [reportType]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [trend, distribution, stats] = await Promise.all([
        rechargeService.getExpenditureTrend(reportType),
        rechargeService.getISPDistribution(),
        locationService.getDashboardStats()
      ]);
      setChartData(trend);
      setIspDistribution(distribution);
      setStatsData(stats);
    } catch (err) {
      console.error('Error fetching report data:', err);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { label: 'Total Expenditure', value: `₹${statsData?.totalPaidMTD?.toLocaleString('en-IN') || 0}`, change: statsData?.totalPaidMTD > 0 ? '+ Live' : '0', icon: CreditCard, color: 'text-[#007AFF]' },
    { label: 'Active Locations', value: statsData?.totalLocations?.toString() || '0', change: statsData?.activePlans?.toString() + ' active', icon: Building2, color: 'text-emerald-500' },
    { label: 'Upcoming Renewals', value: statsData?.dueSoon7Days?.toString() || '0', change: 'next 7d', icon: Calendar, color: 'text-amber-500' },
    { label: 'ISP Providers', value: ispDistribution.length.toString(), change: 'linked', icon: Globe, color: 'text-rose-500' },
  ];

  const reportList = [
    { title: 'Monthly Recharge Summary', description: 'Consolidated report of all recharges done in the current month.', icon: FileText },
    { title: 'Due Date Forecast', description: 'Predictive report of upcoming renewals for the next 3 months.', icon: Clock },
    { title: 'ISP Performance Report', description: 'Analysis of downtime and support response for each ISP.', icon: Zap },
    { title: 'Location-wise Cost Analysis', description: 'Detailed breakdown of internet costs across all branches.', icon: BarChart3 },
    { title: 'Audit Log Report', description: 'Complete history of all user actions and system changes.', icon: Shield },
  ];

  const handleDownload = (title: string) => {
    setDownloading(title);
    setTimeout(() => {
      setDownloading(null);
      console.log(`Downloaded report: ${title}`);
    }, 1500);
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#007AFF]" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 italic serif">Reports & Analytics</h2>
          <p className="text-sm text-slate-500">Analyze expenditure, monitor performance, and generate reports</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <button 
              onClick={() => setShowTypeDropdown(!showTypeDropdown)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg font-bold hover:bg-slate-50 transition-colors shadow-sm"
            >
              <Calendar size={18} />
              {reportType} View
              <ChevronDown size={14} className={cn("transition-transform", showTypeDropdown && "rotate-180")} />
            </button>
            {showTypeDropdown && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl border border-slate-200 shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                {(['Daily', 'Monthly', 'Yearly'] as const).map((type) => (
                  <button 
                    key={type}
                    onClick={() => {
                      setReportType(type);
                      setShowTypeDropdown(false);
                    }}
                    className={cn(
                      "w-full px-4 py-2 text-left text-sm font-bold transition-colors",
                      reportType === type ? "bg-[#007AFF] text-white" : "text-slate-600 hover:bg-slate-50"
                    )}
                  >
                    {type} Report
                  </button>
                ))}
              </div>
            )}
          </div>
          <button 
            onClick={() => handleDownload('All Reports')}
            className="flex items-center gap-2 px-4 py-2 bg-[#FF6B00] text-white rounded-lg font-bold hover:bg-[#E66000] transition-colors shadow-sm disabled:opacity-50"
            disabled={downloading === 'All Reports'}
          >
            {downloading === 'All Reports' ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Download size={18} />
            )}
            {downloading === 'All Reports' ? 'Downloading...' : 'Download All'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</span>
              <stat.icon className={stat.color} size={20} />
            </div>
            <div className="text-3xl font-bold text-slate-900">{stat.value}</div>
            <div className="flex items-center gap-1 text-xs mt-1">
              <span className={cn(
                "font-bold",
                stat.change.startsWith('+') ? "text-emerald-600" : 
                stat.change === '0' ? "text-slate-400" : "text-rose-600"
              )}>
                {stat.change}
              </span>
              <span className="text-slate-500">vs last {reportType === 'Daily' ? 'week' : reportType === 'Monthly' ? 'month' : 'year'}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#007AFF]/10 flex items-center justify-center text-[#007AFF]">
                <TrendingUp size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold italic serif">Expenditure Trend</h3>
                <p className="text-xs text-slate-500">Budget vs Actual spending analysis</p>
              </div>
            </div>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} 
                  tickFormatter={(value) => `₹${value >= 1000 ? (value / 1000) + 'k' : value}`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    borderRadius: '12px', 
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                  }}
                  itemStyle={{ fontSize: '12px', fontWeight: 700 }}
                />
                <Legend 
                  verticalAlign="top" 
                  align="right" 
                  iconType="circle"
                  wrapperStyle={{ paddingBottom: '20px', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="actual" 
                  stroke="#007AFF" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#007AFF', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                  name="Actual Spending"
                />
                <Line 
                  type="monotone" 
                  dataKey="budget" 
                  stroke="#e2e8f0" 
                  strokeWidth={2} 
                  strokeDasharray="5 5"
                  dot={false}
                  name="Budgeted Amount"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <PieChartIcon size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold italic serif">ISP Distribution</h3>
              <p className="text-xs text-slate-500">Market share across locations</p>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ispDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="count"
                >
                  {ispDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-4">
            {ispDistribution.map((item, index) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                  <span className="text-xs font-bold text-slate-600">{item.name}</span>
                </div>
                <span className="text-xs font-black text-slate-900">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold mb-6 italic serif">Available Reports</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reportList.map((report) => (
              <button 
                key={report.title}
                onClick={() => handleDownload(report.title)}
                disabled={downloading === report.title}
                className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-xl hover:border-[#007AFF]/30 hover:bg-white transition-all group text-left disabled:opacity-70"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-[#007AFF] transition-colors">
                    {downloading === report.title ? (
                      <div className="w-5 h-5 border-2 border-slate-200 border-t-[#007AFF] rounded-full animate-spin" />
                    ) : (
                      <report.icon size={20} />
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{report.title}</h4>
                    <p className="text-[10px] text-slate-500 line-clamp-1">{report.description}</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-slate-300 group-hover:text-[#007AFF] transition-colors" />
              </button>
            ))}
          </div>
        </div>

        <div className="bg-[#1A2B4C] p-6 rounded-xl text-white relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-lg font-bold mb-2 italic serif">Custom Analytics</h3>
            <p className="text-sm text-slate-400 mb-6 leading-relaxed">
              Need a specific report? Our data team can build custom dashboards for your organization.
            </p>
            <button className="w-full py-3 bg-white text-[#1A2B4C] rounded-xl font-bold text-sm hover:bg-slate-100 transition-all shadow-lg shadow-black/20">
              Request Custom Report
            </button>
          </div>
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute -left-10 -top-10 w-40 h-40 bg-[#007AFF]/20 rounded-full blur-3xl"></div>
        </div>
      </div>
    </div>
  );
}
