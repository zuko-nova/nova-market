import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateProduct, useListCategories, getListCategoriesQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Loader2, PackagePlus } from "lucide-react";
import { Link } from "wouter";

const createProductSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100),
  description: z.string().min(20, "Description must be at least 20 characters"),
  price: z.coerce.number().min(0, "Price must be positive"),
  imageUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  category: z.string().min(1, "Please select a category"),
  tags: z.string().optional(), // Will split by comma
  isFeatured: z.boolean().default(false),
});

type CreateProductValues = z.infer<typeof createProductSchema>;

export default function CreateProduct() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: categories } = useListCategories({
    query: { queryKey: getListCategoriesQueryKey() }
  });

  const createProductMutation = useCreateProduct();

  const form = useForm<CreateProductValues>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      imageUrl: "",
      category: "",
      tags: "",
      isFeatured: false,
    },
  });

  const onSubmit = (data: CreateProductValues) => {
    const payload = {
      ...data,
      imageUrl: data.imageUrl || undefined,
      tags: data.tags ? data.tags.split(",").map(t => t.trim()).filter(Boolean) : [],
    };

    createProductMutation.mutate(
      { data: payload },
      {
        onSuccess: (product) => {
          toast({
            title: "Product created!",
            description: "Your product is now live on the marketplace.",
          });
          setLocation(`/products/${product.id}`);
        },
        onError: () => {
          toast({
            title: "Error creating product",
            description: "Please check your inputs and try again.",
            variant: "destructive",
          });
        },
      }
    );
  };

  return (
    <div className="container mx-auto px-4 md:px-8 py-8 max-w-3xl">
      <div className="mb-8">
        <Button variant="ghost" asChild className="mb-6 -ml-4 text-muted-foreground">
          <Link href="/dashboard"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard</Link>
        </Button>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight flex items-center gap-3">
          <PackagePlus className="w-8 h-8 text-primary" />
          List a New Product
        </h1>
        <p className="text-muted-foreground text-lg mt-2">Add details about what you're selling.</p>
      </div>

      <div className="bg-card border border-border/50 rounded-3xl p-6 md:p-10 shadow-sm">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            
            <div className="space-y-6">
              <h3 className="text-xl font-bold border-b border-border/10 pb-2">Basic Info</h3>
              
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Product Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Master Figma UI Design" className="h-12 text-lg bg-muted/50 border-transparent focus-visible:bg-background" {...field} />
                    </FormControl>
                    <FormDescription>A clear, catchy title for your product.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Price ($)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" className="h-12 text-lg bg-muted/50 border-transparent focus-visible:bg-background" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12 text-lg bg-muted/50 border-transparent focus:bg-background">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories?.map((c) => (
                            <SelectItem key={c.id} value={c.slug}>{c.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="space-y-6 pt-4">
              <h3 className="text-xl font-bold border-b border-border/10 pb-2">Details</h3>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe what's included, who it's for, and the benefits..." 
                        className="min-h-[150px] resize-y bg-muted/50 border-transparent focus-visible:bg-background text-base" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Cover Image URL (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/image.jpg" className="h-12 bg-muted/50 border-transparent focus-visible:bg-background" {...field} />
                    </FormControl>
                    <FormDescription>A high-quality 16:9 image to represent your product.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Tags (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. ui, design, beginner" className="h-12 bg-muted/50 border-transparent focus-visible:bg-background" {...field} />
                    </FormControl>
                    <FormDescription>Comma-separated tags to help people find your product.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isFeatured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-2xl border border-border/50 p-6 bg-muted/20">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Feature this product</FormLabel>
                      <FormDescription>
                        Display prominently on your profile and marketplace.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <Button 
              type="submit" 
              size="lg" 
              className="w-full h-14 text-lg rounded-full shadow-lg shadow-primary/20"
              disabled={createProductMutation.isPending}
            >
              {createProductMutation.isPending ? (
                <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Publishing...</>
              ) : (
                "Publish Product"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
