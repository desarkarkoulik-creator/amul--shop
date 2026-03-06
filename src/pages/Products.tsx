import { useState, useMemo } from 'react'
import { Plus, Search, Filter, X, ChevronDown } from 'lucide-react'
import { useOutletContext } from 'react-router-dom'

import { Product } from '../App'

export default function Products() {
    const { products: demoProducts, setProducts: setDemoProducts } = useOutletContext<any>()

    // State for modal
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingProduct, setEditingProduct] = useState<Product | null>(null)

    // State for filtering
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState<string>('All')
    const [isFilterOpen, setIsFilterOpen] = useState(false)

    // Derived unique categories
    const categories = useMemo(() => {
        const unique = new Set(demoProducts.map((p: Product) => p.category))
        return ['All', ...Array.from(unique)] as string[]
    }, [demoProducts])

    // Filtered products
    const filteredProducts = useMemo(() => {
        return demoProducts.filter((p: Product) => {
            const matchesSearch =
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                `AMUL-${1000 + p.id}`.toLowerCase().includes(searchQuery.toLowerCase())

            const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory

            return matchesSearch && matchesCategory
        })
    }, [demoProducts, searchQuery, selectedCategory])

    const handleOpenAdd = () => {
        setEditingProduct(null)
        setIsModalOpen(true)
    }

    const handleOpenEdit = (product: Product) => {
        setEditingProduct(product)
        setIsModalOpen(true)
    }

    const handleDeleteProduct = (id: number) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            setDemoProducts(demoProducts.filter((p: Product) => p.id !== id))
        }
    }

    const handleSaveProduct = (e: React.FormEvent) => {
        e.preventDefault()
        const form = e.target as HTMLFormElement
        const nameInput = form.elements.namedItem('productName') as HTMLInputElement
        const categoryInput = form.elements.namedItem('category') as HTMLInputElement
        const priceInput = form.elements.namedItem('price') as HTMLInputElement
        const stockInput = form.elements.namedItem('stock') as HTMLInputElement

        const productData = {
            id: editingProduct ? editingProduct.id : Date.now(),
            name: nameInput.value,
            subname: categoryInput.value ? `${categoryInput.value} Item` : "",
            category: categoryInput.value || "New Segment",
            price: parseFloat(priceInput.value) || 0,
            stock: parseInt(stockInput.value) || 0
        }

        if (editingProduct) {
            // Update existing
            const updatedProducts = demoProducts.map((p: Product) => p.id === editingProduct.id ? productData : p)
            setDemoProducts(updatedProducts)
        } else {
            // Add new
            setDemoProducts([productData, ...demoProducts])
        }

        setIsModalOpen(false)
    }

    return (
        <div className="h-full flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 animate-in fade-in duration-300 relative">

            {/* Modal Overlay */}
            {isModalOpen && (
                <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm rounded-2xl">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100">
                            <h3 className="text-xl font-bold text-gray-900">{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSaveProduct} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Product Name</label>
                                <input name="productName" defaultValue={editingProduct?.name || ''} type="text" required placeholder="e.g. Amul Masti Dahi" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amul-darkblue/50" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Category</label>
                                <input name="category" defaultValue={editingProduct?.category || ''} type="text" placeholder="e.g. Dairy" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amul-darkblue/50" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Selling Price (₹)</label>
                                    <input name="price" defaultValue={editingProduct?.price || ''} type="number" min="0" step="1" required placeholder="0" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amul-darkblue/50" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Initial Quantity (Stock)</label>
                                    <input name="stock" defaultValue={editingProduct?.stockLevel || ''} type="number" min="0" step="1" required placeholder="0" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amul-darkblue/50" />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 font-medium text-gray-600 hover:bg-gray-100 rounded-xl">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-amul-darkblue text-white font-bold rounded-xl hover:bg-blue-800 shadow-md">
                                    {editingProduct ? 'Save Changes' : 'Add Product'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Header & Controls */}
            <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 relative z-20">
                <div className="relative w-full sm:w-96 flex-shrink-0">
                    <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search products by name or SKU..."
                        className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amul-darkblue/50 focus:border-amul-darkblue transition-shadow text-sm"
                    />
                    {searchQuery && (
                        <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="relative flex-1 sm:flex-none">
                        <button
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className="w-full flex items-center justify-between sm:justify-center px-4 py-2.5 border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 rounded-xl text-sm font-medium transition-colors"
                        >
                            <div className="flex items-center">
                                <Filter className="w-4 h-4 mr-2 text-amul-darkblue" />
                                <span className="truncate max-w-[100px] sm:max-w-none">
                                    {selectedCategory === 'All' ? 'All Categories' : selectedCategory}
                                </span>
                            </div>
                            <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Dropdown Menu */}
                        {isFilterOpen && (
                            <div className="absolute right-0 mt-2 w-full sm:w-48 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                                <div className="max-h-60 overflow-auto py-1">
                                    {categories.map(cat => (
                                        <button
                                            key={cat}
                                            onClick={() => {
                                                setSelectedCategory(cat);
                                                setIsFilterOpen(false);
                                            }}
                                            className={`w-full text-left px-4 py-2 text-sm transition-colors ${selectedCategory === cat
                                                ? 'bg-blue-50 text-amul-darkblue font-bold'
                                                : 'text-gray-700 hover:bg-gray-50'
                                                }`}
                                        >
                                            {cat === 'All' ? 'All Categories' : cat}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <button onClick={handleOpenAdd} className="flex-1 sm:flex-none flex items-center justify-center px-4 py-2.5 bg-amul-darkblue text-white hover:bg-blue-800 rounded-xl text-sm font-bold shadow-md shadow-blue-200 transition-all active:scale-95">
                        <Plus className="w-4 h-4 mr-2" />
                        <span className="hidden sm:inline">Add Product</span>
                        <span className="sm:hidden">Add</span>
                    </button>
                </div>
            </div>

            {/* Table Area */}
            <div className="flex-1 overflow-auto rounded-b-2xl">
                {filteredProducts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500 py-12">
                        <Search className="w-12 h-12 text-gray-300 mb-4" />
                        <p className="text-lg font-medium">No products found</p>
                        <p className="text-sm">Try adjusting your search or filters.</p>
                        <button
                            onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                            className="mt-4 text-amul-darkblue font-bold hover:underline"
                        >
                            Clear all filters
                        </button>
                    </div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50/80 sticky top-0 z-10 backdrop-blur-md">
                            <tr className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                <th className="p-2 sm:p-4 pl-3 sm:pl-6">Product</th>
                                <th className="hidden sm:table-cell p-4">Category</th>
                                <th className="p-2 sm:p-4">Price</th>
                                <th className="p-2 sm:p-4">Stock</th>
                                <th className="p-2 sm:p-4 pr-3 sm:pr-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredProducts.map((p: Product) => (
                                <tr key={p.id} className="hover:bg-blue-50/50 transition-colors group align-top sm:align-middle">
                                    <td className="p-2 sm:p-4 pl-3 sm:pl-6">
                                        <div className="font-bold text-gray-900 group-hover:text-amul-darkblue transition-colors text-xs sm:text-base leading-tight mt-1 sm:mt-0">
                                            {p.name} {p.subname && <span className="text-gray-500 font-normal hidden sm:inline">({p.subname})</span>}
                                        </div>
                                        <div className="text-[9px] sm:text-xs text-gray-500 mt-1 sm:mt-0.5">
                                            SKU: AMUL-{1000 + p.id}
                                            {/* Show category here on mobile since we hide the column */}
                                            <span className="sm:hidden block mt-1">
                                                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-medium bg-gray-100 text-gray-800">
                                                    {p.category}
                                                </span>
                                            </span>
                                        </div>
                                    </td>
                                    <td className="hidden sm:table-cell p-4">
                                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                                            {p.category}
                                        </span>
                                    </td>
                                    <td className="p-2 sm:p-4 font-semibold text-gray-700 text-xs sm:text-base pt-3 sm:pt-4">₹{p.price}</td>
                                    <td className="p-2 sm:p-4 pt-3 sm:pt-4">
                                        <div className="flex items-center space-x-1 sm:space-x-2">
                                            <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full shrink-0 ${p.stockLevel < 10 ? 'bg-red-500' : p.stockLevel < 30 ? 'bg-orange-500' : 'bg-emerald-500'}`}></div>
                                            <span className={`font-semibold text-[10px] sm:text-sm whitespace-nowrap ${p.stockLevel < 10 ? 'text-red-700' : p.stockLevel < 30 ? 'text-orange-700' : 'text-gray-700'}`}>
                                                {p.stockLevel} <span className="hidden sm:inline">units</span>
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-2 sm:p-4 pr-3 sm:pr-6 text-right w-16 sm:w-auto">
                                        <div className="flex flex-col sm:flex-row justify-end gap-1 pt-1 sm:pt-0">
                                            <button
                                                onClick={() => handleOpenEdit(p)}
                                                className="text-[10px] sm:text-sm font-medium text-amul-darkblue hover:text-blue-900 hover:underline px-1 py-1 sm:px-3 sm:py-1.5 rounded hover:bg-blue-100 transition-colors w-full text-center"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteProduct(p.id)}
                                                className="text-[10px] sm:text-sm font-medium text-red-600 hover:text-red-900 hover:underline px-1 py-1 sm:px-3 sm:py-1.5 rounded hover:bg-red-50 transition-colors w-full text-center"
                                            >
                                                Del
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    )
}
