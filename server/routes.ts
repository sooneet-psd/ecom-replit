import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import {
  insertCategorySchema,
  insertProductSchema,
  insertShippingCarrierSchema,
  insertShippingRateSchema,
  insertCouponSchema,
  insertOrderSchema,
  insertOrderItemSchema,
} from "@shared/schema";
import { z } from "zod";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string): Promise<boolean> {
  const [hashedPassword, salt] = stored.split(".");
  const hashedPasswordBuf = Buffer.from(hashedPassword, "hex");
  const suppliedPasswordBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedPasswordBuf, suppliedPasswordBuf);
}

// Auth middleware
function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.session.adminId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // ===== Admin Authentication =====
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ error: "Username and password required" });
      }

      const admin = await storage.getAdminUserByUsername(username);
      if (!admin || !(await comparePasswords(password, admin.password))) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      req.session.adminId = admin.id;
      res.json({ success: true, user: { id: admin.id, username: admin.username } });
    } catch (error) {
      res.status(500).json({ error: "Login failed" });
    }
  });

  app.post("/api/admin/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Logout failed" });
      }
      res.json({ success: true });
    });
  });

  app.get("/api/admin/session", async (req, res) => {
    if (!req.session.adminId) {
      return res.json({ authenticated: false });
    }
    const admin = await storage.getAdminUser(req.session.adminId);
    if (!admin) {
      return res.json({ authenticated: false });
    }
    res.json({ authenticated: true, user: { id: admin.id, username: admin.username } });
  });

  // Create initial admin if none exists
  app.post("/api/admin/setup", async (req, res) => {
    try {
      const existingAdmin = await storage.getAdminUserByUsername("admin");
      if (existingAdmin) {
        return res.status(400).json({ error: "Admin already exists" });
      }
      
      const { password } = req.body;
      if (!password || password.length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters" });
      }

      const hashedPassword = await hashPassword(password);
      const admin = await storage.createAdminUser({
        username: "admin",
        password: hashedPassword,
      });
      
      res.json({ success: true, message: "Admin created successfully" });
    } catch (error) {
      res.status(500).json({ error: "Setup failed" });
    }
  });

  // ===== Categories (Protected) =====
  app.get("/api/categories", async (req, res) => {
    const categories = await storage.getCategories();
    res.json(categories);
  });

  app.get("/api/categories/:id", async (req, res) => {
    const category = await storage.getCategory(req.params.id);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.json(category);
  });

  app.post("/api/categories", requireAdmin, async (req, res) => {
    try {
      const data = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(data);
      res.status(201).json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create category" });
    }
  });

  app.patch("/api/categories/:id", requireAdmin, async (req, res) => {
    try {
      const data = insertCategorySchema.partial().parse(req.body);
      const category = await storage.updateCategory(req.params.id, data);
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to update category" });
    }
  });

  app.delete("/api/categories/:id", requireAdmin, async (req, res) => {
    const success = await storage.deleteCategory(req.params.id);
    if (!success) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.json({ success: true });
  });

  // ===== Products =====
  app.get("/api/products", async (req, res) => {
    const products = await storage.getProducts();
    res.json(products);
  });

  app.get("/api/products/:id", async (req, res) => {
    const product = await storage.getProduct(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(product);
  });

  app.post("/api/products", requireAdmin, async (req, res) => {
    try {
      const data = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(data);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create product" });
    }
  });

  app.patch("/api/products/:id", requireAdmin, async (req, res) => {
    try {
      const data = insertProductSchema.partial().parse(req.body);
      const product = await storage.updateProduct(req.params.id, data);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to update product" });
    }
  });

  app.delete("/api/products/:id", requireAdmin, async (req, res) => {
    const success = await storage.deleteProduct(req.params.id);
    if (!success) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json({ success: true });
  });

  // ===== Shipping Carriers =====
  app.get("/api/shipping-carriers", async (req, res) => {
    const carriers = await storage.getShippingCarriers();
    res.json(carriers);
  });

  app.post("/api/shipping-carriers", requireAdmin, async (req, res) => {
    try {
      const data = insertShippingCarrierSchema.parse(req.body);
      const carrier = await storage.createShippingCarrier(data);
      res.status(201).json(carrier);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create shipping carrier" });
    }
  });

  app.patch("/api/shipping-carriers/:id", requireAdmin, async (req, res) => {
    try {
      const data = insertShippingCarrierSchema.partial().parse(req.body);
      const carrier = await storage.updateShippingCarrier(req.params.id, data);
      if (!carrier) {
        return res.status(404).json({ error: "Carrier not found" });
      }
      res.json(carrier);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to update carrier" });
    }
  });

  app.delete("/api/shipping-carriers/:id", requireAdmin, async (req, res) => {
    const success = await storage.deleteShippingCarrier(req.params.id);
    if (!success) {
      return res.status(404).json({ error: "Carrier not found" });
    }
    res.json({ success: true });
  });

  // ===== Shipping Rates =====
  app.get("/api/shipping-rates", async (req, res) => {
    const rates = await storage.getShippingRates();
    res.json(rates);
  });

  app.post("/api/shipping-rates", requireAdmin, async (req, res) => {
    try {
      const data = insertShippingRateSchema.parse(req.body);
      const rate = await storage.createShippingRate(data);
      res.status(201).json(rate);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create shipping rate" });
    }
  });

  app.patch("/api/shipping-rates/:id", requireAdmin, async (req, res) => {
    try {
      const data = insertShippingRateSchema.partial().parse(req.body);
      const rate = await storage.updateShippingRate(req.params.id, data);
      if (!rate) {
        return res.status(404).json({ error: "Rate not found" });
      }
      res.json(rate);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to update rate" });
    }
  });

  app.delete("/api/shipping-rates/:id", requireAdmin, async (req, res) => {
    const success = await storage.deleteShippingRate(req.params.id);
    if (!success) {
      return res.status(404).json({ error: "Rate not found" });
    }
    res.json({ success: true });
  });

  // ===== Shipping Calculation =====
  app.post("/api/shipping/calculate", async (req, res) => {
    try {
      const { carrierId, length, width, height, actualWeight } = req.body;
      
      if (!carrierId || !length || !width || !height || !actualWeight) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Volumetric weight calculation: (L+8 x W+8 x H+8) / 5000
      const adjustedL = parseFloat(length) + 8;
      const adjustedW = parseFloat(width) + 8;
      const adjustedH = parseFloat(height) + 8;
      const volumetricWeight = (adjustedL * adjustedW * adjustedH) / 5000;
      const chargeableWeight = Math.max(parseFloat(actualWeight), volumetricWeight);

      // Get rates for the carrier
      const rates = await storage.getShippingRatesByCarrier(carrierId);
      
      // Find applicable rate
      const applicableRate = rates.find(rate => {
        const min = parseFloat(rate.minWeight);
        const max = parseFloat(rate.maxWeight);
        return chargeableWeight >= min && chargeableWeight <= max;
      });

      if (!applicableRate) {
        return res.status(400).json({ error: "No applicable rate found for this weight" });
      }

      res.json({
        volumetricWeight: volumetricWeight.toFixed(2),
        actualWeight: parseFloat(actualWeight).toFixed(2),
        chargeableWeight: chargeableWeight.toFixed(2),
        rate: applicableRate.rate,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to calculate shipping" });
    }
  });

  // ===== Coupons =====
  app.get("/api/coupons", requireAdmin, async (req, res) => {
    const coupons = await storage.getCoupons();
    res.json(coupons);
  });

  app.post("/api/coupons/validate", async (req, res) => {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ error: "Coupon code required" });
    }
    const coupon = await storage.getCouponByCode(code.toUpperCase());
    if (!coupon || !coupon.isActive) {
      return res.status(404).json({ error: "Invalid or expired coupon" });
    }
    res.json(coupon);
  });

  app.post("/api/coupons", requireAdmin, async (req, res) => {
    try {
      const data = insertCouponSchema.parse({
        ...req.body,
        code: req.body.code?.toUpperCase(),
      });
      const coupon = await storage.createCoupon(data);
      res.status(201).json(coupon);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create coupon" });
    }
  });

  app.patch("/api/coupons/:id", requireAdmin, async (req, res) => {
    try {
      const data = insertCouponSchema.partial().parse(req.body);
      const coupon = await storage.updateCoupon(req.params.id, data);
      if (!coupon) {
        return res.status(404).json({ error: "Coupon not found" });
      }
      res.json(coupon);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to update coupon" });
    }
  });

  app.delete("/api/coupons/:id", requireAdmin, async (req, res) => {
    const success = await storage.deleteCoupon(req.params.id);
    if (!success) {
      return res.status(404).json({ error: "Coupon not found" });
    }
    res.json({ success: true });
  });

  // ===== Orders =====
  app.get("/api/orders", requireAdmin, async (req, res) => {
    const orders = await storage.getOrders();
    res.json(orders);
  });

  app.get("/api/orders/:id", async (req, res) => {
    const order = await storage.getOrder(req.params.id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    const items = await storage.getOrderItems(order.id);
    res.json({ ...order, items });
  });

  app.post("/api/orders", async (req, res) => {
    try {
      const orderData = insertOrderSchema.parse(req.body);
      const order = await storage.createOrder(orderData);

      // Create order items
      if (req.body.items && Array.isArray(req.body.items)) {
        for (const item of req.body.items) {
          const itemData = insertOrderItemSchema.parse({
            ...item,
            orderId: order.id,
          });
          await storage.createOrderItem(itemData);
        }
      }

      // Increment coupon usage if used
      if (order.couponId) {
        await storage.incrementCouponUsage(order.couponId);
      }

      res.status(201).json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create order" });
    }
  });

  app.patch("/api/orders/:id/status", requireAdmin, async (req, res) => {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: "Status required" });
    }
    const order = await storage.updateOrderStatus(req.params.id, status);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.json(order);
  });

  return httpServer;
}
