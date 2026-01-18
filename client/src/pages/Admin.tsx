import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  Package, Tag, Truck, DollarSign, Upload, Download,
  Plus, Pencil, Trash2, Search, MoreVertical, ChevronLeft, LogOut, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface SessionResponse {
  authenticated: boolean;
  user?: { id: string; username: string };
}

// todo: remove mock data
const mockProducts = [
  { id: 1, name: "Wireless Headphones Pro", sku: "WHP-001", category: "Electronics", price: 79.99, stock: 45, status: "Active" },
  { id: 2, name: "Premium Leather Wallet", sku: "PLW-002", category: "Fashion", price: 49.99, stock: 23, status: "Active" },
  { id: 3, name: "Smart Watch Series 5", sku: "SWS-003", category: "Electronics", price: 299.99, stock: 0, status: "Out of Stock" },
  { id: 4, name: "Organic Cotton T-Shirt", sku: "OCT-004", category: "Fashion", price: 29.99, stock: 78, status: "Active" },
  { id: 5, name: "Yoga Mat Premium", sku: "YMP-005", category: "Sports", price: 39.99, stock: 12, status: "Low Stock" },
];

const mockCategories = [
  { id: 1, name: "Electronics", parent: null, productCount: 45 },
  { id: 2, name: "Phones", parent: "Electronics", productCount: 18 },
  { id: 3, name: "Laptops", parent: "Electronics", productCount: 12 },
  { id: 4, name: "Fashion", parent: null, productCount: 89 },
  { id: 5, name: "Men", parent: "Fashion", productCount: 34 },
  { id: 6, name: "Women", parent: "Fashion", productCount: 55 },
];

const mockShippingRates = [
  { id: 1, carrier: "DHL Express", weightType: "Actual", minWeight: 0, maxWeight: 5, rate: 12.99 },
  { id: 2, carrier: "DHL Express", weightType: "Volumetric", minWeight: 0, maxWeight: 5, rate: 14.99 },
  { id: 3, carrier: "Aramex", weightType: "Actual", minWeight: 0, maxWeight: 5, rate: 8.99 },
  { id: 4, carrier: "FedEx", weightType: "Actual", minWeight: 0, maxWeight: 10, rate: 9.99 },
];

const mockCoupons = [
  { id: 1, code: "SAVE10", discount: 10, type: "Percentage", status: "Active", uses: 234 },
  { id: 2, code: "WELCOME20", discount: 20, type: "Percentage", status: "Active", uses: 89 },
  { id: 3, code: "FLAT15", discount: 15, type: "Fixed", status: "Expired", uses: 56 },
];

export default function Admin() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [productDialogOpen, setProductDialogOpen] = useState(false);

  const sessionQuery = useQuery<SessionResponse>({
    queryKey: ["/api/admin/session"],
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/admin/logout");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/session"] });
      setLocation("/admin/login");
    },
  });

  const handleBulkUpload = () => {
    toast({ title: "Upload started", description: "Processing your CSV file..." });
  };

  const handleExport = () => {
    toast({ title: "Export started", description: "Downloading products with stock data..." });
  };

  if (sessionQuery.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!sessionQuery.data?.authenticated) {
    setLocation("/admin/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-background border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon" data-testid="button-back-admin">
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleExport} data-testid="button-export">
              <Download className="h-4 w-4 mr-2" /> Export
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" data-testid="button-bulk-upload">
                  <Upload className="h-4 w-4 mr-2" /> Bulk Upload
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Bulk Upload Products</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="border-2 border-dashed rounded-lg p-8 text-center">
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Drag and drop your CSV file here, or click to browse
                    </p>
                    <input type="file" className="hidden" accept=".csv" />
                    <Button variant="outline" size="sm" className="mt-4">
                      Select File
                    </Button>
                  </div>
                  <Button className="w-full" onClick={handleBulkUpload}>
                    Upload Products
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
              data-testid="button-logout"
            >
              {logoutMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <LogOut className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Package className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">156</p>
                  <p className="text-sm text-muted-foreground">Products</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <DollarSign className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">$12,450</p>
                  <p className="text-sm text-muted-foreground">Revenue</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Truck className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">89</p>
                  <p className="text-sm text-muted-foreground">Orders</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-500/10 rounded-lg">
                  <Tag className="h-5 w-5 text-orange-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">12</p>
                  <p className="text-sm text-muted-foreground">Categories</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="products" className="space-y-6">
          <TabsList>
            <TabsTrigger value="products" data-testid="tab-admin-products">Products</TabsTrigger>
            <TabsTrigger value="categories" data-testid="tab-admin-categories">Categories</TabsTrigger>
            <TabsTrigger value="shipping" data-testid="tab-admin-shipping">Shipping Rates</TabsTrigger>
            <TabsTrigger value="coupons" data-testid="tab-admin-coupons">Coupons</TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0">
                <CardTitle>Products</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-64"
                      data-testid="input-admin-search"
                    />
                  </div>
                  <Dialog open={productDialogOpen} onOpenChange={setProductDialogOpen}>
                    <DialogTrigger asChild>
                      <Button data-testid="button-add-product">
                        <Plus className="h-4 w-4 mr-2" /> Add Product
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Add New Product</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Product Name</Label>
                            <Input data-testid="input-product-name" />
                          </div>
                          <div>
                            <Label>SKU</Label>
                            <Input data-testid="input-product-sku" />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Category</Label>
                            <Select>
                              <SelectTrigger data-testid="select-product-category">
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="electronics">Electronics</SelectItem>
                                <SelectItem value="fashion">Fashion</SelectItem>
                                <SelectItem value="home">Home & Living</SelectItem>
                                <SelectItem value="sports">Sports</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Price</Label>
                            <Input type="number" step="0.01" data-testid="input-product-price" />
                          </div>
                        </div>
                        <div>
                          <Label>Description</Label>
                          <Textarea rows={3} data-testid="input-product-description" />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <Label>Length (cm)</Label>
                            <Input type="number" data-testid="input-product-length" />
                          </div>
                          <div>
                            <Label>Width (cm)</Label>
                            <Input type="number" data-testid="input-product-width" />
                          </div>
                          <div>
                            <Label>Height (cm)</Label>
                            <Input type="number" data-testid="input-product-height" />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Actual Weight (kg)</Label>
                            <Input type="number" step="0.01" data-testid="input-product-weight" />
                          </div>
                          <div>
                            <Label>Stock Quantity</Label>
                            <Input type="number" data-testid="input-product-stock" />
                          </div>
                        </div>
                        <div>
                          <Label>Product Images</Label>
                          <div className="border-2 border-dashed rounded-lg p-4 text-center mt-2">
                            <p className="text-sm text-muted-foreground">
                              Drop images here or click to upload
                            </p>
                          </div>
                        </div>
                        <Button onClick={() => setProductDialogOpen(false)} data-testid="button-save-product">
                          Save Product
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockProducts.map((product) => (
                      <TableRow key={product.id} data-testid={`row-product-${product.id}`}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell className="text-muted-foreground">{product.sku}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>${product.price.toFixed(2)}</TableCell>
                        <TableCell>{product.stock}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              product.status === "Active"
                                ? "default"
                                : product.status === "Low Stock"
                                ? "secondary"
                                : "destructive"
                            }
                          >
                            {product.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Pencil className="h-4 w-4 mr-2" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="h-4 w-4 mr-2" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0">
                <CardTitle>Categories</CardTitle>
                <Button data-testid="button-add-category">
                  <Plus className="h-4 w-4 mr-2" /> Add Category
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category Name</TableHead>
                      <TableHead>Parent</TableHead>
                      <TableHead>Products</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockCategories.map((cat) => (
                      <TableRow key={cat.id}>
                        <TableCell className="font-medium">{cat.name}</TableCell>
                        <TableCell className="text-muted-foreground">{cat.parent || "-"}</TableCell>
                        <TableCell>{cat.productCount}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon">
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="shipping">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0">
                <div>
                  <CardTitle>Shipping Rates</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Configure rates for actual weight and volumetric weight (L+8 x W+8 x H+8 / 5000)
                  </p>
                </div>
                <Button data-testid="button-add-shipping-rate">
                  <Plus className="h-4 w-4 mr-2" /> Add Rate
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Carrier</TableHead>
                      <TableHead>Weight Type</TableHead>
                      <TableHead>Min Weight (kg)</TableHead>
                      <TableHead>Max Weight (kg)</TableHead>
                      <TableHead>Rate</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockShippingRates.map((rate) => (
                      <TableRow key={rate.id}>
                        <TableCell className="font-medium">{rate.carrier}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{rate.weightType}</Badge>
                        </TableCell>
                        <TableCell>{rate.minWeight}</TableCell>
                        <TableCell>{rate.maxWeight}</TableCell>
                        <TableCell>${rate.rate.toFixed(2)}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon">
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="coupons">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0">
                <CardTitle>Discount Coupons</CardTitle>
                <Button data-testid="button-add-coupon">
                  <Plus className="h-4 w-4 mr-2" /> Add Coupon
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Discount</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Uses</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockCoupons.map((coupon) => (
                      <TableRow key={coupon.id}>
                        <TableCell className="font-mono font-medium">{coupon.code}</TableCell>
                        <TableCell>
                          {coupon.type === "Percentage" ? `${coupon.discount}%` : `$${coupon.discount}`}
                        </TableCell>
                        <TableCell>{coupon.type}</TableCell>
                        <TableCell>
                          <Badge variant={coupon.status === "Active" ? "default" : "secondary"}>
                            {coupon.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{coupon.uses}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon">
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
