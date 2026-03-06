import { Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
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
    stockLevel: number; // Changed from stock to stockLevel to match DB
}

export default function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'))
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

    // Global App State
    const [products, setProducts] = useState<Product[]>([])

    const [metrics, setMetrics] = useState({
        revenue: 0,
        salesCount: 0
    })

    const fetchAppData = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            // Fetch products
            const prodRes = await fetch(`${API_URL}/api/products`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (prodRes.ok) {
                const data = await prodRes.json();
                setProducts(data);
            }

            // Fetch metrics
            const metricsRes = await fetch(`${API_URL}/api/dashboard`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (metricsRes.ok) {
                const mData = await metricsRes.json();
                setMetrics({
                    revenue: mData.revenue,
                    salesCount: mData.salesCount
                });
            }
        } catch (error) {
            console.error('Failed to load user data');
        }
    }

    useEffect(() => {
        if (isAuthenticated) {
            fetchAppData();
        }
    }, [isAuthenticated]);

    const handleSuccessfulSale = async (total: number, items: { id: number, quantity: number }[]) => {
        const token = localStorage.getItem('token');
        if (!token) return;

        // Post to backend
        try {
            await fetch(`${API_URL}/api/sales`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    totalAmount: total,
                    paymentType: 'CASH', // Default for now
                    items: items.map(i => ({ productId: i.id, quantity: i.quantity, price: products.find(p => p.id === i.id)?.price || 0 }))
                })
            });
            // Refresh state from DB
            fetchAppData();
        } catch (e) {
            console.error(e)
        }
    }

    const handleLogout = () => {
        setIsAuthenticated(false)
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setProducts([])
        setMetrics({ revenue: 0, salesCount: 0 })
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
                <Login onLogin={() => setIsAuthenticated(true)} />
            } />

            {/* Protected Routes */}
            <Route path="/" element={
                <Navigate to="/login" replace />
            } />

            <Route element={
                isAuthenticated ? <Layout appContext={appContext} /> : <Navigate to="/login" replace />
            }>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="products" element={<Products />} />
                <Route path="inventory" element={<Inventory />} />
                <Route path="pos" element={<POS />} />
                <Route path="settings" element={<Settings />} />
            </Route>
        </Routes>
    )
}
