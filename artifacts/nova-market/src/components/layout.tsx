import { Link, useLocation } from "wouter";
import { Package, Search, ShoppingBag, LayoutDashboard, User } from "lucide-react";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-primary">
              <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
                <Package className="h-5 w-5" />
              </div>
              NOVA MARKET
            </Link>
            
            <nav className="hidden md:flex gap-6">
              <Link 
                href="/marketplace" 
                className={`text-sm font-medium transition-colors hover:text-primary ${location === "/marketplace" ? "text-primary" : "text-muted-foreground"}`}
              >
                Marketplace
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input 
                type="search" 
                placeholder="Search products..." 
                className="h-10 w-64 rounded-full border border-input bg-background px-9 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all focus-within:w-80"
              />
            </div>
            
            <Link href="/orders" className="p-2 text-muted-foreground hover:text-primary transition-colors rounded-full hover:bg-muted">
              <ShoppingBag className="h-5 w-5" />
            </Link>
            <Link href="/dashboard" className="p-2 text-muted-foreground hover:text-primary transition-colors rounded-full hover:bg-muted">
              <LayoutDashboard className="h-5 w-5" />
            </Link>
            <Link href="/profile" className="p-2 text-muted-foreground hover:text-primary transition-colors rounded-full hover:bg-muted">
              <User className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        {children}
      </main>

      <footer className="border-t py-12 md:py-16 bg-muted/30 mt-auto">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
              <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-primary mb-4">
                <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
                  <Package className="h-5 w-5" />
                </div>
                NOVA
              </Link>
              <p className="text-sm text-muted-foreground max-w-xs">
                The premium digital bazaar for ambitious creators to sell their knowledge globally.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Marketplace</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/marketplace" className="hover:text-primary transition-colors">All Products</Link></li>
                <li><Link href="/marketplace?category=design" className="hover:text-primary transition-colors">Design</Link></li>
                <li><Link href="/marketplace?category=development" className="hover:text-primary transition-colors">Development</Link></li>
                <li><Link href="/marketplace?category=marketing" className="hover:text-primary transition-colors">Marketing</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Creators</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link></li>
                <li><Link href="/dashboard/products/new" className="hover:text-primary transition-colors">Sell a Product</Link></li>
                <li><Link href="/profile" className="hover:text-primary transition-colors">Creator Profile</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Account</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/orders" className="hover:text-primary transition-colors">My Orders</Link></li>
                <li><Link href="/profile" className="hover:text-primary transition-colors">Settings</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Nova Market. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
