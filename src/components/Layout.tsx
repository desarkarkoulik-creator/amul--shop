import { useState, useEffect } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { LayoutDashboard, Store, Package, ShoppingCart, LogOut, Menu, X, Settings } from 'lucide-react'

export default function Layout({ appContext }: { appContext: any }) {
    const location = useLocation()
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [isProfileOpen, setIsProfileOpen] = useState(false)

    // Close sidebar on mobile when navigating
    useEffect(() => {
        setIsSidebarOpen(false)
    }, [location.pathname])

    const navigation = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Products', href: '/products', icon: Package },
        { name: 'Inventory', href: '/inventory', icon: Store },
        { name: 'POS / Billing', href: '/pos', icon: ShoppingCart },
    ]

    return (
        <div className="flex h-screen bg-gray-100 font-sans overflow-hidden">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-30 lg:hidden animate-in fade-in"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 z-40 w-64 bg-amul-darkblue text-white flex flex-col shadow-xl transform transition-transform duration-300 ease-in-out
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                lg:static lg:flex-shrink-0
            `}>
                <div className="p-6 flex items-center justify-between border-b border-blue-800">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-amul-yellow rounded-full flex items-center justify-center text-amul-darkblue font-extrabold text-xl shadow-inner shrink-0">
                            A
                        </div>
                        <div className="text-2xl font-bold tracking-wide text-white truncate">Amul Shop</div>
                    </div>
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="lg:hidden text-blue-200 hover:text-white p-1"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
                    {navigation.map((item) => {
                        const isActive = location.pathname.startsWith(item.href)
                        return (
                            <Link
                                key={item.name}
                                to={item.href}
                                className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                                    ? 'bg-amul-lightblue text-amul-darkblue font-semibold shadow-md translate-x-1 lg:translate-x-1'
                                    : 'text-gray-300 hover:bg-blue-800 hover:text-white'
                                    }`}
                            >
                                <item.icon className={`w-5 h-5 mr-3 shrink-0 ${isActive ? 'text-amul-darkblue' : 'text-gray-400'}`} />
                                <span className="truncate">{item.name}</span>
                            </Link>
                        )
                    })}
                </nav>
                <div className="p-4 border-t border-blue-800">
                    <button className="flex w-full items-center px-4 py-3 text-gray-300 hover:text-white hover:bg-red-500 rounded-xl transition-colors truncate">
                        <LogOut className="w-5 h-5 mr-3 shrink-0" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                <header className="bg-white/90 backdrop-blur-md shadow-sm z-10 p-4 lg:p-5 flex justify-between items-center border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="lg:hidden p-2 -ml-2 text-gray-600 hover:text-amul-darkblue hover:bg-gray-100 rounded-xl"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <h1 className="text-xl lg:text-2xl font-bold text-gray-800 capitalize leading-none tracking-tight truncate max-w-[150px] sm:max-w-xs md:max-w-md">
                            {location.pathname.replace('/', '').replace('pos', 'Point of Sale') || 'Dashboard'}
                        </h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="text-sm text-gray-500 hidden md:block">
                            Today: <span className="font-semibold text-gray-800">{new Date().toLocaleDateString()}</span>
                        </div>
                        <div className="relative">
                            <div
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="w-10 h-10 bg-gradient-to-tr from-blue-100 to-blue-200 border border-blue-300 rounded-full flex items-center justify-center text-amul-darkblue font-bold shadow-sm cursor-pointer hover:ring-2 hover:ring-amul-darkblue transition-all"
                            >
                                SK
                            </div>

                            {/* Profile Dropdown */}
                            {isProfileOpen && (
                                <>
                                    <div
                                        className="fixed inset-0 z-40"
                                        onClick={() => setIsProfileOpen(false)}
                                    ></div>
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                                        <div className="px-4 py-2 border-b border-gray-100 mb-1">
                                            <p className="text-sm font-bold text-gray-900">Admin User</p>
                                            <p className="text-xs text-gray-500">Stock Manager</p>
                                        </div>
                                        <button
                                            onClick={() => setIsProfileOpen(false)}
                                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center transition-colors"
                                        >
                                            <Settings className="w-4 h-4 mr-2 text-gray-400" />
                                            Account Settings
                                        </button>
                                        <button
                                            onClick={() => {
                                                setIsProfileOpen(false);
                                                appContext.handleLogout();
                                            }}
                                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center transition-colors font-medium mt-1"
                                        >
                                            <LogOut className="w-4 h-4 mr-2" />
                                            Sign Out
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </header>
                <div className="flex-1 overflow-auto p-8 relative">
                    <div className="max-w-7xl mx-auto h-full">
                        <Outlet context={appContext} />
                    </div>
                </div>
            </main>
        </div>
    )
}
