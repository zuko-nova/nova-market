import { useListOrders, getListOrdersQueryKey } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Download, ExternalLink, PackageOpen, ShoppingBag } from "lucide-react";
import { format } from "date-fns";
import { Link } from "wouter";

export default function Orders() {
  const { data: orders, isLoading } = useListOrders({
    query: { queryKey: getListOrdersQueryKey() }
  });

  return (
    <div className="container mx-auto px-4 md:px-8 py-8 lg:py-12 max-w-5xl">
      <div className="mb-10">
        <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-3">My Orders</h1>
        <p className="text-muted-foreground text-lg">Access your purchased products and downloads.</p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 w-full rounded-2xl" />
          ))}
        </div>
      ) : !orders || orders.length === 0 ? (
        <div className="text-center py-24 bg-muted/20 rounded-3xl border border-dashed border-border flex flex-col items-center">
          <div className="w-20 h-20 bg-background rounded-full flex items-center justify-center mb-6 shadow-sm border border-border/50">
            <ShoppingBag className="w-10 h-10 text-muted-foreground opacity-50" />
          </div>
          <h3 className="text-2xl font-bold mb-3">No orders yet</h3>
          <p className="text-muted-foreground mb-8 max-w-md">You haven't purchased any products yet. Discover premium assets in the marketplace.</p>
          <Button asChild size="lg" className="rounded-full px-8">
            <Link href="/marketplace">Browse Marketplace</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order.id} className="overflow-hidden border-border/50 hover-elevate transition-all duration-300 group">
              <CardContent className="p-0 flex flex-col sm:flex-row">
                <div className="w-full sm:w-48 sm:h-auto h-40 bg-muted shrink-0 relative border-r border-border/20">
                  {order.productImageUrl ? (
                    <img src={order.productImageUrl} alt={order.productTitle} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground opacity-30">
                      <PackageOpen className="w-8 h-8 mb-2" />
                    </div>
                  )}
                  {order.status === "completed" && (
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-secondary text-secondary-foreground border-none">Completed</Badge>
                    </div>
                  )}
                </div>
                
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
                    <div>
                      <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold">
                        Order #{order.id.toString().padStart(6, '0')}
                      </div>
                      <h3 className="text-xl font-bold mb-1 leading-tight group-hover:text-primary transition-colors">
                        <Link href={`/products/${order.productId}`}>{order.productTitle}</Link>
                      </h3>
                      <div className="text-sm text-muted-foreground">
                        Purchased on {format(new Date(order.createdAt), "MMMM d, yyyy")}
                      </div>
                    </div>
                    <div className="text-xl font-bold text-primary sm:text-right">
                      ${order.amount.toFixed(2)}
                    </div>
                  </div>
                  
                  <div className="mt-auto pt-6 flex flex-wrap gap-3 items-center justify-between border-t border-border/10">
                    <Button variant="outline" className="rounded-full text-sm h-10" asChild>
                      <Link href={`/products/${order.productId}`}>
                        <ExternalLink className="w-4 h-4 mr-2" /> View Product
                      </Link>
                    </Button>
                    <Button className="rounded-full shadow-sm h-10 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground border-none">
                      <Download className="w-4 h-4 mr-2" /> Download Files
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
