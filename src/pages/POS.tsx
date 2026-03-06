import { useState } from 'react'
import { Search, ShoppingCart, IndianRupee, X, CheckCircle2, Plus, Minus } from 'lucide-react'
import { useOutletContext } from 'react-router-dom'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { Product } from '../App'

// Use Product from App.tsx

interface CartItem extends Product {
    cartId: string;
    quantity: number;
}

export default function POS() {
    const quickCategories = ["Milk", "Butter", "Cheese", "Ice Cream", "Beverages"];

    // Use layout context to stay in sync
    const { products: catalogData, handleSuccessfulSale } = useOutletContext<any>()

    const [cart, setCart] = useState<CartItem[]>([])
    const [isCheckingOut, setIsCheckingOut] = useState(false)

    // Add exactly 1 of the product to the cart upon clicking
    const addToCart = (product: Product) => {
        if (product.stock <= 0) return; // Check if out of stock
        setCart(prev => {
            const existingItem = prev.find(i => i.id === product.id)
            if (existingItem) {
                // Ensure we do not add more than the product's total inventory stock
                if (existingItem.quantity >= product.stock) return prev;
                return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i)
            }
            const newItem: CartItem = {
                ...product,
                cartId: Math.random().toString(36).substr(2, 9),
                quantity: 1
            }
            return [...prev, newItem]
        })
    }

    const removeFromCart = (cartId: string) => {
        setCart(prev => prev.filter(item => item.cartId !== cartId))
    }

    // Increase quantity of a cart item
    const increaseQuantity = (cartId: string, e: React.MouseEvent) => {
        e.stopPropagation()
        e.preventDefault()
        setCart(prev => prev.map(item => {
            if (item.cartId === cartId) {
                // Ensure quantity cannot go beyond item's original inventory stock limit
                if (item.quantity >= item.stock) return item;
                return { ...item, quantity: item.quantity + 1 }
            }
            return item
        }))
    }

    // Decrease quantity of a cart item (remove if reaches 0)
    const decreaseQuantity = (cartId: string, e: React.MouseEvent) => {
        e.stopPropagation()
        e.preventDefault()
        setCart(prev => prev.map(item =>
            item.cartId === cartId ? { ...item, quantity: item.quantity - 1 } : item
        ).filter(item => item.quantity > 0))
    }

    const handleCheckout = () => {
        if (cart.length === 0) return;
        setIsCheckingOut(true)

        // Generate PDF receipt locally
        const doc = new jsPDF()
        doc.setFontSize(20)
        doc.text("Amul Shop Receipt", 14, 22)
        doc.setFontSize(11)
        doc.text(`Date: ${new Date().toLocaleString()}`, 14, 30)
        doc.text(`Order: #${Math.floor(1000 + Math.random() * 9000)}`, 14, 36)

        const tableColumn = ["Item", "Qty", "Price", "Total"]
        const tableRows: any[] = []

        cart.forEach(item => {
            const rowData = [
                item.name,
                item.quantity.toString(),
                `Rs ${item.price.toFixed(2)}`,
                `Rs ${(item.quantity * item.price).toFixed(2)}`
            ]
            tableRows.push(rowData)
        })

        const subtotalCalc = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)

        autoTable(doc, {
            startY: 45,
            head: [tableColumn],
            body: tableRows,
            foot: [["", "", "Total:", `Rs ${subtotalCalc.toFixed(2)}`]],
            theme: 'striped',
            headStyles: { fillColor: [0, 82, 160] }, // Amul Dark Blue
            footStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold' }
        })

        doc.save(`amul-receipt-${new Date().getTime()}.pdf`)

        // Form items for successful sale
        const saleItems = cart.map((i: CartItem) => ({ id: i.id, quantity: i.quantity }))

        // Sync the inventory globally
        handleSuccessfulSale(subtotalCalc, saleItems)

        setTimeout(() => {
            setCart([])
            setIsCheckingOut(false)
        }, 2000) // fake processing time
    }

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)

    return (
        <div className="flex flex-col xl:flex-row h-[calc(100vh-8rem)] xl:h-full gap-4 xl:gap-6 animate-in slide-in-from-right-4 duration-300 relative">

            {/* Checkout Success Overlay */}
            {isCheckingOut && (
                <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-md rounded-2xl">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center animate-in zoom-in w-full max-w-sm sm:w-80">
                        <CheckCircle2 className="w-16 h-16 text-emerald-500 mb-4 animate-bounce" />
                        <h3 className="text-xl font-bold text-gray-900 text-center">Payment Successful</h3>
                        <p className="text-gray-500 mt-2 text-center">Processing receipt...</p>
                    </div>
                </div>
            )}

            {/* Left Area - POS Finder */}
            <div className="flex-1 flex flex-col gap-4 xl:gap-6 min-h-[50vh] xl:min-h-0">
                {/* Search Header */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 shrink-0">
                    <div className="relative">
                        <Search className="w-5 h-5 xl:w-6 xl:h-6 text-gray-400 absolute left-3 xl:left-4 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Scan or type name..."
                            className="w-full pl-10 xl:pl-14 pr-4 xl:pr-6 py-3 xl:py-4 bg-gray-50 border-2 border-transparent rounded-xl focus:outline-none focus:bg-white focus:border-amul-darkblue focus:ring-4 focus:ring-amul-lightblue transition-all text-base xl:text-lg font-medium shadow-inner"
                        />
                    </div>

                    <div className="flex gap-2 xl:gap-3 mt-4 overflow-x-auto pb-2 scrollbar-hide -mx-2 px-2 xl:mx-0 xl:px-0">
                        {quickCategories.map(cat => (
                            <button key={cat} className="px-4 py-1.5 xl:px-5 xl:py-2 whitespace-nowrap bg-gray-100 hover:bg-amul-lightblue hover:text-amul-darkblue font-semibold text-gray-700 text-xs xl:text-sm rounded-full transition-colors">
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Quick Add Grid */}
                <div className="flex-1 bg-white p-4 xl:p-6 rounded-2xl shadow-sm border border-gray-100 overflow-y-auto">
                    <h3 className="text-xs xl:text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Fast Moving Items</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-4 gap-3 xl:gap-4">
                        {catalogData.map((item: Product) => (
                            <button
                                key={item.id}
                                onClick={() => addToCart(item)}
                                disabled={item.stock <= 0}
                                className={`p-3 xl:p-4 border border-gray-100 rounded-xl bg-gray-50 hover:bg-blue-50 hover:border-blue-300 transition-all text-left flex flex-col active:scale-95 shadow-sm group ${item.stock <= 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                <span className="text-[10px] xl:text-xs font-bold text-amul-darkblue mb-1 flex flex-col xl:flex-row xl:items-center justify-between w-full gap-1 xl:gap-0">
                                    <span className="truncate">{item.name}</span>
                                    {item.stock <= 0 && <span className="text-[8px] xl:text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full w-fit">Out of Stock</span>}
                                </span>
                                <span className="font-semibold text-gray-800 text-xs xl:text-sm mb-2 xl:mb-3 group-hover:text-amul-darkblue truncate">{item.subname}</span>
                                <div className="mt-auto flex flex-col xl:flex-row xl:justify-between items-start xl:items-end w-full gap-1 xl:gap-0">
                                    <span className="font-black text-sm xl:text-lg text-gray-900 group-hover:text-blue-900">₹{item.price}</span>
                                    {item.stock > 0 && <span className="text-[10px] xl:text-xs font-medium text-gray-500">{item.stock} in stock</span>}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Area - Current Cart */}
            <div className="w-full xl:w-[400px] flex flex-col bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden shrink-0 h-[50vh] xl:h-auto">
                <div className="p-4 xl:p-5 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 flex items-center justify-between shrink-0">
                    <h2 className="text-base xl:text-lg font-black text-gray-900 flex items-center tracking-tight">
                        <ShoppingCart className="w-4 h-4 xl:w-5 xl:h-5 mr-2 text-amul-darkblue" />
                        Active Order
                    </h2>
                    <span className="bg-blue-100 text-amul-darkblue px-2 py-0.5 rounded-full text-[10px] xl:text-xs font-bold">#2048</span>
                </div>

                {/* Cart Items */}
                <div className={`flex-1 overflow-y-auto p-2 xl:p-3 space-y-2 ${cart.length === 0 ? 'flex flex-col items-center justify-center text-gray-400' : ''}`}>

                    {cart.length === 0 ? (
                        <>
                            <ShoppingCart className="w-10 h-10 xl:w-12 xl:h-12 mb-2 xl:mb-3 opacity-20" />
                            <p className="font-medium text-xs xl:text-sm">Cart is empty</p>
                            <p className="text-[10px] xl:text-xs text-center px-4">Scan items or click fast-moving items</p>
                        </>
                    ) : (
                        cart.map((item, index) => (
                            <div key={item.cartId} className="p-2.5 xl:p-3 bg-white border border-gray-100 rounded-xl shadow-sm flex gap-2 xl:gap-3 relative group animate-in slide-in-from-left-2 items-center">
                                <div className="w-8 h-8 xl:w-12 xl:h-12 bg-blue-50 rounded-lg flex items-center justify-center font-bold text-amul-darkblue shrink-0 text-xs xl:text-base">
                                    {index + 1}
                                </div>
                                <div className="flex-1 min-w-0 pr-6 xl:pr-8">
                                    <h4 className="font-bold text-gray-900 text-xs xl:text-sm leading-tight truncate">{item.name}</h4>
                                    <div className="text-[10px] xl:text-xs text-gray-500 mt-0.5 xl:mt-1 font-medium">₹{item.price} each</div>
                                    <div className="flex items-center space-x-1 xl:space-x-2 mt-1 xl:mt-2">
                                        <button type="button" onClick={(e) => decreaseQuantity(item.cartId, e)} className="p-1 text-gray-600 hover:text-gray-800">
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="font-medium text-gray-800">{item.quantity}</span>
                                        <button
                                            type="button"
                                            onClick={(e) => increaseQuantity(item.cartId, e)}
                                            disabled={item.quantity >= item.stock}
                                            className="p-1 text-gray-600 hover:text-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <div className="font-black text-gray-900 flex items-center text-sm xl:text-base mr-6 xl:mr-8">₹{item.price * item.quantity}</div>
                                <button
                                    onClick={() => removeFromCart(item.cartId)}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-red-500 opacity-100 xl:opacity-0 group-hover:opacity-100 transition-opacity bg-white hover:bg-red-50 rounded-lg shadow-sm border border-gray-100"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {/* Total & Checkout */}
                <div className="p-4 xl:p-5 bg-gray-50 border-t border-gray-200 shrink-0">
                    <div className="flex justify-between items-center mb-1.5 xl:mb-2 text-xs xl:text-sm">
                        <span className="text-gray-500 font-medium">Subtotal ({cart.length} items)</span>
                        <span className="font-bold text-gray-800">₹{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center mb-3 xl:mb-4 pb-3 xl:pb-4 border-b border-gray-200 text-xs xl:text-sm">
                        <span className="text-gray-500 font-medium">Tax</span>
                        <span className="font-bold text-gray-800">Included</span>
                    </div>

                    <div className="flex justify-between items-end mb-4 xl:mb-6">
                        <span className="text-base xl:text-lg font-bold text-gray-500 mb-1">Total</span>
                        <span className="text-3xl xl:text-4xl font-black text-amul-darkblue tracking-tight">₹{subtotal.toFixed(2)}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 xl:gap-3">
                        <button
                            disabled={cart.length === 0}
                            className="py-3 xl:py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 hover:border-gray-300 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed text-sm xl:text-base"
                        >
                            UPI/Card
                        </button>
                        <button
                            onClick={handleCheckout}
                            disabled={cart.length === 0}
                            className="py-3 xl:py-4 bg-amul-red text-white rounded-xl font-bold hover:bg-red-600 shadow-xl shadow-red-200/50 transition-all flex items-center justify-center active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 text-sm xl:text-base"
                        >
                            <IndianRupee className="w-4 h-4 xl:w-5 xl:h-5 mr-1" />
                            Cash Pay
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
