import { eq } from "drizzle-orm";
import { db } from "./db";
import {
  adminUsers, type AdminUser, type InsertAdminUser,
  categories, type Category, type InsertCategory,
  products, type Product, type InsertProduct,
  shippingCarriers, type ShippingCarrier, type InsertShippingCarrier,
  shippingRates, type ShippingRate, type InsertShippingRate,
  coupons, type Coupon, type InsertCoupon,
  orders, type Order, type InsertOrder,
  orderItems, type OrderItem, type InsertOrderItem,
} from "@shared/schema";

export interface IStorage {
  // Admin users
  getAdminUser(id: string): Promise<AdminUser | undefined>;
  getAdminUserByUsername(username: string): Promise<AdminUser | undefined>;
  createAdminUser(user: InsertAdminUser): Promise<AdminUser>;

  // Categories
  getCategories(): Promise<Category[]>;
  getCategory(id: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: string, category: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: string): Promise<boolean>;

  // Products
  getProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  getProductBySku(sku: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: string): Promise<boolean>;

  // Shipping carriers
  getShippingCarriers(): Promise<ShippingCarrier[]>;
  getShippingCarrier(id: string): Promise<ShippingCarrier | undefined>;
  createShippingCarrier(carrier: InsertShippingCarrier): Promise<ShippingCarrier>;
  updateShippingCarrier(id: string, carrier: Partial<InsertShippingCarrier>): Promise<ShippingCarrier | undefined>;
  deleteShippingCarrier(id: string): Promise<boolean>;

  // Shipping rates
  getShippingRates(): Promise<ShippingRate[]>;
  getShippingRatesByCarrier(carrierId: string): Promise<ShippingRate[]>;
  createShippingRate(rate: InsertShippingRate): Promise<ShippingRate>;
  updateShippingRate(id: string, rate: Partial<InsertShippingRate>): Promise<ShippingRate | undefined>;
  deleteShippingRate(id: string): Promise<boolean>;

  // Coupons
  getCoupons(): Promise<Coupon[]>;
  getCoupon(id: string): Promise<Coupon | undefined>;
  getCouponByCode(code: string): Promise<Coupon | undefined>;
  createCoupon(coupon: InsertCoupon): Promise<Coupon>;
  updateCoupon(id: string, coupon: Partial<InsertCoupon>): Promise<Coupon | undefined>;
  deleteCoupon(id: string): Promise<boolean>;
  incrementCouponUsage(id: string): Promise<void>;

  // Orders
  getOrders(): Promise<Order[]>;
  getOrder(id: string): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: string, status: string): Promise<Order | undefined>;

  // Order items
  getOrderItems(orderId: string): Promise<OrderItem[]>;
  createOrderItem(item: InsertOrderItem): Promise<OrderItem>;
}

export class DatabaseStorage implements IStorage {
  // Admin users
  async getAdminUser(id: string): Promise<AdminUser | undefined> {
    const [user] = await db.select().from(adminUsers).where(eq(adminUsers.id, id));
    return user;
  }

  async getAdminUserByUsername(username: string): Promise<AdminUser | undefined> {
    const [user] = await db.select().from(adminUsers).where(eq(adminUsers.username, username));
    return user;
  }

  async createAdminUser(user: InsertAdminUser): Promise<AdminUser> {
    const [newUser] = await db.insert(adminUsers).values(user).returning();
    return newUser;
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories);
  }

  async getCategory(id: string): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    return category;
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const [newCategory] = await db.insert(categories).values(category).returning();
    return newCategory;
  }

  async updateCategory(id: string, category: Partial<InsertCategory>): Promise<Category | undefined> {
    const [updated] = await db.update(categories).set(category).where(eq(categories.id, id)).returning();
    return updated;
  }

  async deleteCategory(id: string): Promise<boolean> {
    const result = await db.delete(categories).where(eq(categories.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  // Products
  async getProducts(): Promise<Product[]> {
    return await db.select().from(products);
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async getProductBySku(sku: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.sku, sku));
    return product;
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db.insert(products).values(product).returning();
    return newProduct;
  }

  async updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined> {
    const [updated] = await db.update(products).set(product).where(eq(products.id, id)).returning();
    return updated;
  }

  async deleteProduct(id: string): Promise<boolean> {
    const result = await db.delete(products).where(eq(products.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  // Shipping carriers
  async getShippingCarriers(): Promise<ShippingCarrier[]> {
    return await db.select().from(shippingCarriers);
  }

  async getShippingCarrier(id: string): Promise<ShippingCarrier | undefined> {
    const [carrier] = await db.select().from(shippingCarriers).where(eq(shippingCarriers.id, id));
    return carrier;
  }

  async createShippingCarrier(carrier: InsertShippingCarrier): Promise<ShippingCarrier> {
    const [newCarrier] = await db.insert(shippingCarriers).values(carrier).returning();
    return newCarrier;
  }

  async updateShippingCarrier(id: string, carrier: Partial<InsertShippingCarrier>): Promise<ShippingCarrier | undefined> {
    const [updated] = await db.update(shippingCarriers).set(carrier).where(eq(shippingCarriers.id, id)).returning();
    return updated;
  }

  async deleteShippingCarrier(id: string): Promise<boolean> {
    const result = await db.delete(shippingCarriers).where(eq(shippingCarriers.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  // Shipping rates
  async getShippingRates(): Promise<ShippingRate[]> {
    return await db.select().from(shippingRates);
  }

  async getShippingRatesByCarrier(carrierId: string): Promise<ShippingRate[]> {
    return await db.select().from(shippingRates).where(eq(shippingRates.carrierId, carrierId));
  }

  async createShippingRate(rate: InsertShippingRate): Promise<ShippingRate> {
    const [newRate] = await db.insert(shippingRates).values(rate).returning();
    return newRate;
  }

  async updateShippingRate(id: string, rate: Partial<InsertShippingRate>): Promise<ShippingRate | undefined> {
    const [updated] = await db.update(shippingRates).set(rate).where(eq(shippingRates.id, id)).returning();
    return updated;
  }

  async deleteShippingRate(id: string): Promise<boolean> {
    const result = await db.delete(shippingRates).where(eq(shippingRates.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  // Coupons
  async getCoupons(): Promise<Coupon[]> {
    return await db.select().from(coupons);
  }

  async getCoupon(id: string): Promise<Coupon | undefined> {
    const [coupon] = await db.select().from(coupons).where(eq(coupons.id, id));
    return coupon;
  }

  async getCouponByCode(code: string): Promise<Coupon | undefined> {
    const [coupon] = await db.select().from(coupons).where(eq(coupons.code, code));
    return coupon;
  }

  async createCoupon(coupon: InsertCoupon): Promise<Coupon> {
    const [newCoupon] = await db.insert(coupons).values(coupon).returning();
    return newCoupon;
  }

  async updateCoupon(id: string, coupon: Partial<InsertCoupon>): Promise<Coupon | undefined> {
    const [updated] = await db.update(coupons).set(coupon).where(eq(coupons.id, id)).returning();
    return updated;
  }

  async deleteCoupon(id: string): Promise<boolean> {
    const result = await db.delete(coupons).where(eq(coupons.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  async incrementCouponUsage(id: string): Promise<void> {
    const coupon = await this.getCoupon(id);
    if (coupon) {
      await db.update(coupons).set({ usageCount: coupon.usageCount + 1 }).where(eq(coupons.id, id));
    }
  }

  // Orders
  async getOrders(): Promise<Order[]> {
    return await db.select().from(orders);
  }

  async getOrder(id: string): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order;
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const [newOrder] = await db.insert(orders).values(order).returning();
    return newOrder;
  }

  async updateOrderStatus(id: string, status: string): Promise<Order | undefined> {
    const [updated] = await db.update(orders).set({ status }).where(eq(orders.id, id)).returning();
    return updated;
  }

  // Order items
  async getOrderItems(orderId: string): Promise<OrderItem[]> {
    return await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
  }

  async createOrderItem(item: InsertOrderItem): Promise<OrderItem> {
    const [newItem] = await db.insert(orderItems).values(item).returning();
    return newItem;
  }
}

export const storage = new DatabaseStorage();
