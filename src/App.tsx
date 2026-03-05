import { Routes, Route, Navigate } from 'react-router-dom'
import { useState } from 'react'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import Inventory from './pages/Inventory'
import POS from './pages/POS'
import Login from './pages/Login'
import Settings from './pages/Settings'

export interface Product {
    id: number;
    name: string;
    subname: string;
    category: string;
    price: number;
    stock: number;
}

export default function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    // Global App State
    const [products, setProducts] = useState<Product[]>([
        { id: 1, name: "Amul Butter", subname: "100g Block", category: "Butter", price: 58, stock: 0 },
        { id: 2, name: "Amul Taaza Milk", subname: "1L Pouch", category: "Milk", price: 72, stock: 0 },
        { id: 3, name: "Amul Cheese", subname: "200g Slices", category: "Cheese", price: 125, stock: 0 },
        { id: 4, name: "Amul Vanilla", subname: "1L Tub", category: "Ice Cream", price: 240, stock: 0 },
        { id: 5, name: "Amul Kool Kesar", subname: "200ml Bottle", category: "Beverages", price: 25, stock: 0 },
        { id: 6, name: "Amul Ghee", subname: "1L Pouch", category: "Ghee", price: 620, stock: 0 },
    ])

    const [metrics, setMetrics] = useState({
        revenue: 0,
        salesCount: 0
    })

    const handleSuccessfulSale = (total: number, items: { id: number, quantity: number }[]) => {
        // Decrease inventory
        const newProducts = products.map(p => {
            const soldItem = items.find(i => i.id === p.id)
            if (soldItem) {
                return { ...p, stock: Math.max(0, p.stock - soldItem.quantity) }
            }
            return p
        })
        setProducts(newProducts)

        // Increase dashboard metrics
        setMetrics(prev => ({
            revenue: prev.revenue + total,
            salesCount: prev.salesCount + 1
        }))
    }

    const handleLogout = () => {
        setIsAuthenticated(false)
        // Note: In a real app we'd also clear the specific user token/session from localStorage
    }

    // Context bundle
    const appContext = {
        products,
        setProducts,
        metrics,
        handleSuccessfulSale,
        handleLogout
    }

    return (
        <Routes>
            <Route path="/login" element={
                isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login onLogin={() => setIsAuthenticated(true)} />
            } />

            {/* Protected Routes */}
            <Route path="/" element={
                isAuthenticated ? <Layout appContext={appContext} /> : <Navigate to="/login" replace />
            }>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="products" element={<Products />} />
                <Route path="inventory" element={<Inventory />} />
                <Route path="pos" element={<POS />} />
                <Route path="settings" element={<Settings />} />
            </Route>
        </Routes>
    )
}
