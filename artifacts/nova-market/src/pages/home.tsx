import { Link } from "wouter";
import { ArrowRight, Star, TrendingUp, Zap } from "lucide-react";
import { useListFeaturedProducts, useListCategories, getListFeaturedProductsQueryKey, getListCategoriesQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const { data: featuredProducts, isLoading: isLoadingFeatured } = useListFeaturedProducts({
    query: { queryKey: getListFeaturedProductsQueryKey() }
  });
  const { data: categories, isLoading: isLoadingCategories } = useListCategories({
    query: { queryKey: getListCategoriesQueryKey() }
  });

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-background pt-24 pb-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-background to-background pointer-events-none"></div>
        <div className="container relative z-10 mx-auto px-4 md:px-8 text-center max-w-4xl">
          <Badge variant="outline" className="mb-6 px-3 py-1 rounded-full border-primary/30 bg-primary/5 text-primary text-sm">
            <Zap className="w-4 h-4 mr-2 inline" /> 
            The Digital Bazaar for Creators
          </Badge>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
            Curated Knowledge.<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              Premium Assets.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Discover high-quality courses, templates, and resources from ambitious creators in Japan and globally. Elevate your craft today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="rounded-full px-8 text-md h-14 w-full sm:w-auto shadow-lg shadow-primary/20">
              <Link href="/marketplace">
                Explore Marketplace <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full px-8 text-md h-14 w-full sm:w-auto">
              <Link href="/dashboard">
                Start Selling
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-2">
                <Star className="w-8 h-8 text-secondary fill-secondary" /> 
                Featured Products
              </h2>
              <p className="text-muted-foreground">Handpicked excellence from top creators</p>
            </div>
            <Button asChild variant="ghost" className="hidden sm:flex">
              <Link href="/marketplace">View all</Link>
            </Button>
          </div>

          {isLoadingFeatured ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
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
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featuredProducts?.map((product) => (
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
                        {product.isFeatured && (
                          <Badge className="bg-primary/90 hover:bg-primary text-primary-foreground border-none backdrop-blur-sm">Featured</Badge>
                        )}
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
              {(!featuredProducts || featuredProducts.length === 0) && (
                <div className="col-span-full py-12 text-center text-muted-foreground">
                  No featured products available at the moment.
                </div>
              )}
            </div>
          )}
          <div className="mt-8 text-center sm:hidden">
            <Button asChild variant="outline" className="w-full">
              <Link href="/marketplace">View all products</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4 flex items-center justify-center gap-2">
              <TrendingUp className="w-8 h-8 text-primary" />
              Explore by Category
            </h2>
            <p className="text-muted-foreground text-lg">Find exactly what you need to level up your skills</p>
          </div>

          {isLoadingCategories ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-32 rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {categories?.map((category) => (
                <Link key={category.id} href={`/marketplace?category=${category.slug}`}>
                  <div className="group relative overflow-hidden rounded-2xl bg-muted p-6 transition-all hover:bg-primary/5 hover:border-primary/20 border border-transparent flex flex-col items-center justify-center text-center h-full min-h-[140px] cursor-pointer">
                    <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">{category.productCount} products</p>
                  </div>
                </Link>
              ))}
              {(!categories || categories.length === 0) && (
                <div className="col-span-full py-8 text-center text-muted-foreground">
                  No categories found.
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
