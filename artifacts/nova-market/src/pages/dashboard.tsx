import { useGetDashboardStats, getGetDashboardStatsQueryKey, useListMyProducts, getListMyProductsQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { DollarSign, Package, Star, TrendingUp, Plus, ArrowUpRight } from "lucide-react";
import { Link } from "wouter";
import { Separator } from "@/components/ui/separator";

export default function Dashboard() {
  const { data: stats, isLoading: isLoadingStats } = useGetDashboardStats({
    query: { queryKey: getGetDashboardStatsQueryKey() }
  });

  const { data: myProducts, isLoading: isLoadingProducts } = useListMyProducts({
    query: { queryKey: getListMyProductsQueryKey() }
  });

  return (
    <div className="container mx-auto px-4 md:px-8 py-8 lg:py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-2">Creator Dashboard</h1>
          <p className="text-muted-foreground text-lg">Manage your products and view your performance.</p>
        </div>
        <Button asChild size="lg" className="rounded-full shadow-lg shadow-primary/20">
          <Link href="/dashboard/products/new">
            <Plus className="w-5 h-5 mr-2" /> Create Product
          </Link>
        </Button>
      </div>

      {isLoadingStats ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="border-border/50 shadow-sm bg-card hover-elevate transition-all">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Total Revenue</p>
                  <h3 className="text-3xl font-extrabold text-foreground">${stats?.totalRevenue.toFixed(2) || "0.00"}</h3>
                </div>
                <div className="p-3 bg-primary/10 rounded-xl text-primary">
                  <DollarSign className="w-6 h-6" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <TrendingUp className="w-4 h-4 mr-1 text-secondary" />
                <span className="text-secondary font-medium mr-2">${stats?.revenueThisMonth.toFixed(2)}</span>
                <span className="text-muted-foreground">this month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-sm bg-card hover-elevate transition-all">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Total Sales</p>
                  <h3 className="text-3xl font-extrabold text-foreground">{stats?.totalSales || 0}</h3>
                </div>
                <div className="p-3 bg-secondary/10 rounded-xl text-secondary">
                  <ArrowUpRight className="w-6 h-6" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-muted-foreground">
                <span className="text-foreground font-medium mr-2">{stats?.salesThisMonth || 0}</span>
                sales this month
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-sm bg-card hover-elevate transition-all">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Active Products</p>
                  <h3 className="text-3xl font-extrabold text-foreground">{stats?.totalProducts || 0}</h3>
                </div>
                <div className="p-3 bg-accent rounded-xl text-accent-foreground">
                  <Package className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-sm bg-card hover-elevate transition-all">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Total Reviews</p>
                  <h3 className="text-3xl font-extrabold text-foreground">{stats?.totalReviews || 0}</h3>
                </div>
                <div className="p-3 bg-muted rounded-xl text-muted-foreground">
                  <Star className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="px-6 py-5 border-b border-border/10">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl">My Products</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/marketplace">View Store</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {isLoadingProducts ? (
                <div className="p-6 space-y-4">
                  {[1, 2].map(i => <Skeleton key={i} className="h-16 w-full" />)}
                </div>
              ) : !myProducts || myProducts.length === 0 ? (
                <div className="p-12 text-center">
                  <Package className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">You haven't created any products yet.</p>
                  <Button asChild>
                    <Link href="/dashboard/products/new">Create First Product</Link>
                  </Button>
                </div>
              ) : (
                <div className="divide-y divide-border/10">
                  {myProducts.map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-6 hover:bg-muted/30 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-lg bg-muted overflow-hidden shrink-0 border border-border/50">
                          {product.imageUrl && <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover" />}
                        </div>
                        <div>
                          <Link href={`/products/${product.id}`} className="font-bold hover:text-primary transition-colors text-lg line-clamp-1 mb-1">
                            {product.title}
                          </Link>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <span className="font-medium text-foreground">${product.price.toFixed(2)}</span>
                            <span>•</span>
                            <span>{product.salesCount} sales</span>
                            <span>•</span>
                            <span className="flex items-center"><Star className="w-3 h-3 mr-1 fill-secondary text-secondary" /> {product.rating.toFixed(1)}</span>
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline" className="hidden sm:inline-flex">{product.category}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="px-6 py-5 border-b border-border/10">
              <CardTitle className="text-xl">Recent Sales</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {isLoadingStats ? (
                <div className="p-6 space-y-4">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : !stats?.recentOrders || stats.recentOrders.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground text-sm">
                  No sales recorded yet.
                </div>
              ) : (
                <div className="divide-y divide-border/10">
                  {stats.recentOrders.map((order) => (
                    <div key={order.id} className="p-6 flex justify-between items-center">
                      <div>
                        <div className="font-medium line-clamp-1 mb-1">{order.productTitle}</div>
                        <div className="text-xs text-muted-foreground">Order #{order.id}</div>
                      </div>
                      <div className="font-bold text-primary whitespace-nowrap ml-4">
                        +${order.amount.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
