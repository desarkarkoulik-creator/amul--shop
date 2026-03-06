import { useState } from 'react'
import { PackagePlus, RefreshCw, X, CheckCircle2 } from 'lucide-react'
import { useOutletContext } from 'react-router-dom'
import { Product } from '../App'

export default function Inventory() {
    const { products, setProducts } = useOutletContext<any>()
    const [activeAction, setActiveAction] = useState<string | null>(null)
    const [selectedProductId, setSelectedProductId] = useState<number | ''>('')
    const [quantity, setQuantity] = useState<number | ''>('')
    const [showSuccess, setShowSuccess] = useState(false)

    const handleOpenModal = (action: string) => {
        setActiveAction(action)
        setSelectedProductId(products[0]?.id || '')
        setQuantity('')
        setShowSuccess(false)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedProductId || !quantity) return

        const qty = Number(quantity)
        const updatedProducts = products.map((p: Product) => {
            if (p.id === Number(selectedProductId)) {
                if (activeAction === 'delivery') {
                    return { ...p, stock: p.stockLevel + qty }
                } else if (activeAction === 'audit') {
                    return { ...p, stock: Math.max(0, p.stockLevel - qty) }
                }
            }
            return p
        })

        setProducts(updatedProducts)
        setShowSuccess(true)

        setTimeout(() => {
            setActiveAction(null)
            setShowSuccess(false)
        }, 1500)
    }

    return (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-4xl mx-auto mt-10 text-center animate-in fade-in zoom-in-95 duration-500 relative">

            {/* Modal */}
            {activeAction && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 text-left">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100">
                            <h3 className="text-xl font-bold text-gray-900">{activeAction === 'delivery' ? 'Log New Delivery' : 'Audit Stock Correction'}</h3>
                            <button onClick={() => setActiveAction(null)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {showSuccess ? (
                            <div className="p-8 text-center flex flex-col items-center">
                                <CheckCircle2 className="w-16 h-16 text-emerald-500 mb-4 animate-bounce" />
                                <h4 className="text-lg font-bold text-gray-900">Inventory Updated!</h4>
                                <p className="text-gray-500 mt-2 text-sm">Stock levels have been adjusted.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Select Product</label>
                                    <select
                                        required
                                        value={selectedProductId}
                                        onChange={(e) => setSelectedProductId(Number(e.target.value))}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amul-darkblue/50"
                                    >
                                        <option value="" disabled>-- Select an item --</option>
                                        {products.map((p: Product) => (
                                            <option key={p.id} value={p.id}>{p.name} ({p.stockLevel} currently in stock)</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        {activeAction === 'delivery' ? 'Quantity Received (Add)' : 'Quantity to Deduct (Remove)'}
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        min="1"
                                        value={quantity}
                                        onChange={(e) => setQuantity(Number(e.target.value))}
                                        placeholder="0"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amul-darkblue/50"
                                    />
                                </div>
                                <div className="flex justify-end pt-4">
                                    <button
                                        type="submit"
                                        className={`px-6 py-3 font-bold rounded-xl shadow-md w-full text-white transition-all ${activeAction === 'delivery' ? 'bg-amul-darkblue hover:bg-blue-800' : 'bg-red-600 hover:bg-red-700'}`}
                                    >
                                        {activeAction === 'delivery' ? 'Add Stock' : 'Deduct Stock'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}


            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                <PackagePlus className="w-10 h-10 text-amul-darkblue" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Inventory Operations</h2>
            <p className="text-gray-500 max-w-lg mx-auto mb-8">
                Manage incoming stock deliveries from the distributor, record damaged goods, and perform routine stock audits.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                <button onClick={() => handleOpenModal('delivery')} className="p-6 border-2 border-dashed border-gray-200 hover:border-amul-darkblue hover:bg-blue-50 rounded-2xl transition-all group flex flex-col items-center cursor-pointer">
                    <RefreshCw className="w-8 h-8 text-gray-400 group-hover:text-amul-darkblue mb-3" />
                    <span className="font-bold text-gray-800">Log New Delivery</span>
                    <span className="text-xs text-gray-500 mt-2">Scan POs and manually add stock levels.</span>
                </button>
                <button onClick={() => handleOpenModal('audit')} className="p-6 border-2 border-dashed border-red-200 hover:border-red-500 hover:bg-red-50 rounded-2xl transition-all group flex flex-col items-center cursor-pointer">
                    <PackagePlus className="w-8 h-8 text-red-300 group-hover:text-red-500 mb-3" />
                    <span className="font-bold text-gray-800 text-red-700">Audit & Corrections</span>
                    <span className="text-xs text-gray-500 mt-2">Manually deduct stock levels for expired or broken items.</span>
                </button>
            </div>
        </div>
    )
}
