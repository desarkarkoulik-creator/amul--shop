import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-for-amul-shop';

// Specifically allow all origins and standard methods for Netlify to connect
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Extend Express Request to include user
declare global {
    namespace Express {
        interface Request {
            user?: { id: number, email: string, role: string };
        }
    }
}

// Authentication Middleware
const authenticateUser = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: number, email: string, role: string };
        req.user = decoded;
        next();
    } catch (error) {
        res.status(403).json({ error: 'Invalid or expired token.' });
    }
};

// --- ROUTES ---

// 0. Authentication
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists with this email' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword
            }
        });

        // Generate JWT token
        const token = jwt.sign(
            { id: newUser.id, email: newUser.email, role: newUser.role },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Don't send back the password
        const { password: _, ...userWithoutPassword } = newUser;
        res.status(201).json({
            message: 'User registered successfully',
            user: userWithoutPassword,
            token
        });

    } catch (error) {
        res.status(500).json({ error: 'Registration failed' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        const { password: _, ...userWithoutPassword } = user;
        res.json({
            message: 'Login successful',
            user: userWithoutPassword,
            token
        });

    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
});

// 1. Dashboard Metrics
app.get('/api/dashboard', authenticateUser, async (req, res) => {
    try {
        const userId = req.user!.id;
        const totalProducts = await prisma.product.count({ where: { userId } });

        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

        const totalSalesCount = await prisma.sale.count({ where: { userId } });

        const todaySales = await prisma.sale.aggregate({
            _sum: { totalAmount: true },
            where: { userId, createdAt: { gte: startOfToday } }
        });

        const thisMonthSales = await prisma.sale.aggregate({
            _sum: { totalAmount: true },
            where: { userId, createdAt: { gte: startOfThisMonth } }
        });

        const lastMonthSales = await prisma.sale.aggregate({
            _sum: { totalAmount: true },
            where: { userId, createdAt: { gte: startOfLastMonth, lt: startOfThisMonth } }
        });

        const todayRevenue = todaySales._sum?.totalAmount || 0;
        const thisMonthRevenue = thisMonthSales._sum?.totalAmount || 0;
        const lastMonthRevenue = lastMonthSales._sum?.totalAmount || 0;

        let monthlyGrowth = 0;
        if (lastMonthRevenue > 0) {
            monthlyGrowth = ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100;
        } else if (thisMonthRevenue > 0) {
            monthlyGrowth = 100;
        }

        res.json({
            revenue: todayRevenue,
            salesCount: totalSalesCount,
            totalProducts,
            monthlyGrowth: parseFloat(monthlyGrowth.toFixed(1))
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch dashboard data' });
    }
});

// 2. Product Catalog
app.get('/api/products', authenticateUser, async (req, res) => {
    try {
        const userId = req.user!.id;
        const products = await prisma.product.findMany({ where: { userId } });
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

app.post('/api/products', authenticateUser, async (req, res) => {
    try {
        const userId = req.user!.id;
        const newProduct = await prisma.product.create({
            data: {
                ...req.body,
                userId
            }
        });
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ error: 'Failed to create product' });
    }
});

// 3. POS Process Sale
app.post('/api/sales', authenticateUser, async (req, res) => {
    const { totalAmount, paymentType, items } = req.body;
    const userId = req.user!.id;

    try {
        const result = await prisma.$transaction(async (tx) => {
            // Create Sale Record
            const sale = await tx.sale.create({
                data: {
                    totalAmount,
                    paymentType,
                    userId,
                    items: {
                        create: items.map((item: any) => ({
                            quantity: item.quantity,
                            price: item.price,
                            productId: item.productId
                        }))
                    }
                }
            });

            // Update Inventory Levels (Simple subtraction)
            for (const item of items) {
                await tx.product.updateMany({
                    where: { id: item.productId, userId },
                    data: { stockLevel: { decrement: item.quantity } }
                });
            }

            return sale;
        });

        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Transaction failed', details: error });
    }
});

// 4. Inventory Audit/Delivery
app.post('/api/inventory', authenticateUser, async (req, res) => {
    const { productId, type, quantity, reason } = req.body;
    const userId = req.user!.id;

    if (!productId || !type || !quantity) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const result = await prisma.$transaction(async (tx) => {
            // Create Audit/Delivery Record
            const transaction = await tx.inventoryTransaction.create({
                data: {
                    type,
                    quantity,
                    productId,
                    reason: reason || 'Manual adjustment',
                    userId
                }
            });

            // Update Product Stock
            const updatedProduct = await tx.product.updateMany({
                where: { id: productId, userId },
                data: {
                    stockLevel: type === 'IN' ? { increment: quantity } : { decrement: quantity }
                }
            });

            return transaction;
        });

        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Inventory update failed', details: error });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Amul API server running on http://localhost:${PORT}`);
});
