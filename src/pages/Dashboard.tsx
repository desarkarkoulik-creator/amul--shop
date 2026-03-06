import { IndianRupee, ShoppingBag, AlertTriangle, TrendingUp } from 'lucide-react'
import { useOutletContext } from 'react-router-dom'
import { Product } from '../App'

export default function Dashboard() {
    const { products, metrics } = useOutletContext<any>()

    const lowStockCount = products.filter((p: Product) => p.stockLevel < 10).length

    const stats = [
        { label: "Today's Revenue", value: `₹${metrics.revenue.toFixed(2)}`, icon: IndianRupee, color: "bg-blue-100 text-blue-700", border: 'border-blue-200' },
        { label: "Total Sales", value: metrics.salesCount.toString(), icon: ShoppingBag, color: "bg-emerald-100 text-emerald-700", border: 'border-emerald-200' },
        { label: "Low Stock Items", value: lowStockCount.toString(), icon: AlertTriangle, color: "bg-orange-100 text-orange-700", border: 'border-orange-200' },
        { label: "Monthly Growth", value: metrics.revenue > 0 ? "5.4%" : "0.0%", icon: TrendingUp, color: "bg-purple-100 text-purple-700", border: 'border-purple-200' }
    ]

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Top Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <div key={stat.label} className={`bg-white p-6 rounded-2xl shadow-sm border ${stat.border} flex flex-col hover:shadow-md transition-shadow delay-${i * 100}`}>
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-xl ${stat.color}`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-3xl font-extrabold text-gray-900 drop-shadow-sm">{stat.value}</h3>
                            <p className="text-sm font-medium text-gray-500 mt-1">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Chart Area */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[400px]">
                    <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center justify-between">
                        Revenue Trend
                        <span className="text-xs font-semibold px-3 py-1 bg-gray-100 text-gray-600 rounded-full">This Week</span>
                    </h2>
                    <div className="flex-1 flex items-center justify-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        <p className="text-gray-400 font-medium">Chart visualization placeholder (Recharts)</p>
                    </div>
                </div>

                {/* Actionable Alerts Area */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-[400px] flex flex-col">
                    <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center justify-between">
                        Attention Needed
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                    </h2>

                    <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                        {[1, 2, 3].map((item) => (
                            <div key={item} className="flex p-4 rounded-xl bg-orange-50 border border-orange-100">
                                <AlertTriangle className="w-5 h-5 text-orange-500 mr-3 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="text-sm font-bold text-gray-900">Amul Taaza (1L) Low Stock</h4>
                                    <p className="text-xs text-gray-600 mt-1">Only 5 units remaining. Restock immediately to avoid out-of-stock.</p>
                                </div>
                            </div>
                        ))}
                        <div className="flex p-4 rounded-xl bg-red-50 border border-red-100">
                            <AlertTriangle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
                            <div>
                                <h4 className="text-sm font-bold text-gray-900">Expiring Soon: Paneer</h4>
                                <p className="text-xs text-gray-600 mt-1">Batch #442 expires tomorrow. Consider discounting 20%.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
