import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import { useListProducts, useListCategories, getListProductsQueryKey, getListCategoriesQueryKey } from "@workspace/api-client-react";

type ListProductsSort = "newest" | "popular" | "price_asc" | "price_desc";
const ListProductsSort = {
  newest: "newest" as ListProductsSort,
  popular: "popular" as ListProductsSort,
  price_asc: "price_asc" as ListProductsSort,
  price_desc: "price_desc" as ListProductsSort,
};
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Star } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";

export default function Marketplace() {
  const [location, setLocation] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "all");
  const [sort, setSort] = useState<ListProductsSort>((searchParams.get("sort") as ListProductsSort) || ListProductsSort.newest);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (category && category !== "all") params.set("category", category);
    if (sort && sort !== ListProductsSort.newest) params.set("sort", sort);
    
    const newSearch = params.toString();
    const newUrl = newSearch ? `${location}?${newSearch}` : location;
    // We don't want to trigger a full navigation, just update the URL for sharing
    window.history.replaceState(null, "", newUrl);
  }, [search, category, sort, location]);

  const { data: categories } = useListCategories({
    query: { queryKey: getListCategoriesQueryKey() }
  });

  const queryParams = {
    search: search || undefined,
    category: category !== "all" ? category : undefined,
    sort,
    limit: 50
  };

  const { data, isLoading } = useListProducts(queryParams, {
    query: { queryKey: getListProductsQueryKey(queryParams) }
  });

  return (
    <div className="container mx-auto px-4 md:px-8 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Marketplace</h1>
          <p className="text-muted-foreground">Discover premium digital products</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search products..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 w-full rounded-full bg-muted/50 border-transparent focus-visible:border-primary"
            />
          </div>
          
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full sm:w-[180px] rounded-full bg-muted/50 border-transparent focus:border-primary">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <SelectValue placeholder="Category" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories?.map((c) => (
                <SelectItem key={c.id} value={c.slug}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sort} onValueChange={(val) => setSort(val as ListProductsSort)}>
            <SelectTrigger className="w-full sm:w-[160px] rounded-full bg-muted/50 border-transparent focus:border-primary">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ListProductsSort.newest}>Newest</SelectItem>
              <SelectItem value={ListProductsSort.popular}>Popular</SelectItem>
              <SelectItem value={ListProductsSort.price_asc}>Price: Low to High</SelectItem>
              <SelectItem value={ListProductsSort.price_desc}>Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <Card key={i} className="overflow-hidden border-border/50">
              <Skeleton className="w-full h-48 rounded-none" />
              <CardContent className="p-5">
                <Skeleton className="h-4 w-20 mb-3" />
                <Skeleton className="h-6 w-full mb-2" />
                <Skeleton className="h-4 w-2/3 mb-4" />
                <Skeleton className="h-4 w-1/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : data?.products.length === 0 ? (
        <div className="text-center py-24 bg-muted/20 rounded-2xl border border-dashed border-border">
          <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-bold mb-2">No products found</h3>
          <p className="text-muted-foreground mb-6">Try adjusting your search or filters to find what you're looking for.</p>
          <Button onClick={() => { setSearch(""); setCategory("all"); setSort(ListProductsSort.newest); }} variant="outline">
            Clear all filters
          </Button>
        </div>
      ) : (
        <>
          <div className="mb-4 text-sm text-muted-foreground font-medium">
            Showing {data?.total} products
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {data?.products.map((product) => (
              <Link key={product.id} href={`/products/${product.id}`}>
                <Card className="h-full overflow-hidden hover-elevate transition-all duration-300 border-border/50 hover:border-primary/50 group cursor-pointer flex flex-col bg-card">
                  <div className="relative h-48 overflow-hidden bg-muted">
                    {product.imageUrl ? (
                      <img 
                        src={product.imageUrl} 
                        alt={product.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground font-mono text-sm opacity-50">
                        No Image
                      </div>
                    )}
                    <div className="absolute top-3 left-3 flex gap-2">
                      <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">{product.category}</Badge>
                    </div>
                  </div>
                  <CardContent className="p-5 flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg line-clamp-2 leading-tight group-hover:text-primary transition-colors">{product.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{product.description}</p>
                    
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-auto">
                      <Star className="w-4 h-4 fill-secondary text-secondary" />
                      <span className="font-medium text-foreground">{product.rating.toFixed(1)}</span>
                      <span>({product.reviewCount})</span>
                    </div>
                  </CardContent>
                  <CardFooter className="p-5 pt-0 flex justify-between items-center mt-auto border-t border-border/10 pt-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                        {product.creatorName.charAt(0)}
                      </div>
                      <span className="text-sm font-medium">{product.creatorName}</span>
                    </div>
                    <span className="font-bold text-lg text-primary">${product.price}</span>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
