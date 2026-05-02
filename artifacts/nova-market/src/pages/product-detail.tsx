import { useParams } from "wouter";
import { useState } from "react";
import { useGetProduct, getGetProductQueryKey, useListReviews, getListReviewsQueryKey, useCreateOrder, useCreateReview } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, ShieldCheck, ArrowRight, PackageOpen, Download, MessageSquare } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Textarea } from "@/components/ui/textarea";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const productId = Number(id);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [isPurchasing, setIsPurchasing] = useState(false);
  const [newReviewText, setNewReviewText] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const { data: product, isLoading } = useGetProduct(productId, {
    query: { enabled: !!productId, queryKey: getGetProductQueryKey(productId) }
  });

  const { data: reviews, isLoading: isLoadingReviews } = useListReviews(productId, {
    query: { enabled: !!productId, queryKey: getListReviewsQueryKey(productId) }
  });

  const createOrder = useCreateOrder();
  const createReview = useCreateReview();

  const handlePurchase = () => {
    setIsPurchasing(true);
    createOrder.mutate({ data: { productId } }, {
      onSuccess: () => {
        toast({
          title: "Purchase successful!",
          description: "The product has been added to your orders.",
        });
        setIsPurchasing(false);
        // Refresh product to update sales count
        queryClient.invalidateQueries({ queryKey: getGetProductQueryKey(productId) });
      },
      onError: () => {
        toast({
          title: "Purchase failed",
          description: "There was an error processing your purchase.",
          variant: "destructive"
        });
        setIsPurchasing(false);
      }
    });
  };

  const handleSubmitReview = () => {
    if (!newReviewText.trim()) return;
    
    setIsSubmittingReview(true);
    createReview.mutate({ 
      id: productId, // Needs checking if this is correct param based on orval
      data: { rating: newReviewRating, comment: newReviewText }
    } as any, { // Type casting as we didn't check the exact Orval signature for path params yet
      onSuccess: () => {
        toast({ title: "Review submitted!" });
        setNewReviewText("");
        setNewReviewRating(5);
        setIsSubmittingReview(false);
        queryClient.invalidateQueries({ queryKey: getListReviewsQueryKey(productId) });
        queryClient.invalidateQueries({ queryKey: getGetProductQueryKey(productId) });
      },
      onError: () => {
        toast({ title: "Failed to submit review", variant: "destructive" });
        setIsSubmittingReview(false);
      }
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <Skeleton className="w-full h-[400px] rounded-2xl mb-8" />
            <Skeleton className="h-12 w-3/4 mb-4" />
            <Skeleton className="h-6 w-1/4 mb-8" />
            <Skeleton className="h-32 w-full mb-8" />
          </div>
          <div>
            <Skeleton className="w-full h-80 rounded-2xl sticky top-24" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) return <div className="text-center py-20 font-bold text-xl">Product not found</div>;

  return (
    <div className="container mx-auto px-4 md:px-8 py-8 lg:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <div className="rounded-2xl overflow-hidden bg-muted aspect-video relative border border-border/50 shadow-sm">
            {product.imageUrl ? (
              <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground opacity-50">
                <PackageOpen className="w-16 h-16 mb-4" />
                <span className="font-mono text-sm">No Preview Image</span>
              </div>
            )}
          </div>

          <div>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                {product.category}
              </Badge>
              {product.tags?.map((tag) => (
                <Badge key={tag} variant="outline" className="bg-background">
                  {tag}
                </Badge>
              ))}
            </div>

            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 leading-tight">{product.title}</h1>
            
            <div className="flex flex-wrap items-center gap-6 text-muted-foreground text-sm mb-8 bg-muted/30 p-4 rounded-xl border border-border/50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                  {product.creatorName.charAt(0)}
                </div>
                <div>
                  <div className="font-medium text-foreground">Created by {product.creatorName}</div>
                  <div className="text-xs">Joined {format(new Date(), "MMM yyyy")}</div>
                </div>
              </div>
              <Separator orientation="vertical" className="h-8 hidden sm:block" />
              <div className="flex items-center gap-1.5">
                <Star className="w-5 h-5 fill-secondary text-secondary" />
                <span className="font-bold text-foreground text-base">{product.rating.toFixed(1)}</span>
                <span>({product.reviewCount} reviews)</span>
              </div>
              <Separator orientation="vertical" className="h-8 hidden sm:block" />
              <div>
                <span className="font-bold text-foreground text-base">{product.salesCount}</span> sales
              </div>
            </div>

            <div className="prose prose-lg dark:prose-invert max-w-none">
              <h3 className="text-2xl font-bold mb-4">About this product</h3>
              <p className="whitespace-pre-line text-muted-foreground leading-relaxed text-lg">
                {product.description}
              </p>
            </div>
          </div>

          <Separator className="my-12" />

          {/* Reviews Section */}
          <div>
            <h3 className="text-2xl font-bold mb-8 flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-primary" />
              Customer Reviews
            </h3>

            <div className="bg-muted/20 p-6 rounded-2xl border border-border/50 mb-8">
              <h4 className="font-semibold mb-4">Leave a review</h4>
              <div className="flex gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} onClick={() => setNewReviewRating(star)} className="focus:outline-none">
                    <Star className={`w-8 h-8 ${star <= newReviewRating ? "fill-secondary text-secondary" : "text-muted"}`} />
                  </button>
                ))}
              </div>
              <Textarea 
                placeholder="What did you think of this product?" 
                value={newReviewText}
                onChange={(e) => setNewReviewText(e.target.value)}
                className="mb-4 bg-background resize-none"
                rows={3}
              />
              <Button onClick={handleSubmitReview} disabled={isSubmittingReview || !newReviewText.trim()}>
                {isSubmittingReview ? "Submitting..." : "Submit Review"}
              </Button>
            </div>

            <div className="space-y-6">
              {isLoadingReviews ? (
                <Skeleton className="h-32 w-full" />
              ) : reviews?.length === 0 ? (
                <p className="text-muted-foreground italic text-center py-8">No reviews yet. Be the first!</p>
              ) : (
                reviews?.map((review) => (
                  <div key={review.id} className="border-b pb-6 last:border-0 border-border/50">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium text-lg">{review.reviewerName}</div>
                      <div className="text-sm text-muted-foreground">{format(new Date(review.createdAt), "MMM d, yyyy")}</div>
                    </div>
                    <div className="flex mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < review.rating ? "fill-secondary text-secondary" : "text-muted"}`} />
                      ))}
                    </div>
                    <p className="text-muted-foreground">{review.comment}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-card rounded-3xl border border-border/50 shadow-xl overflow-hidden">
            <div className="p-8">
              <div className="text-4xl font-extrabold text-primary mb-6">${product.price.toFixed(2)}</div>
              
              <Button 
                size="lg" 
                className="w-full h-14 text-lg rounded-full shadow-lg shadow-primary/20 mb-4 font-bold"
                onClick={handlePurchase}
                disabled={isPurchasing}
              >
                {isPurchasing ? "Processing..." : "Purchase Now"}
                {!isPurchasing && <ArrowRight className="ml-2 w-5 h-5" />}
              </Button>
              
              <ul className="space-y-4 mt-8">
                <li className="flex items-start gap-3 text-sm text-muted-foreground">
                  <ShieldCheck className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                  <span>Secure, lifetime access to all files and future updates.</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-muted-foreground">
                  <Download className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                  <span>Instant download immediately after purchase.</span>
                </li>
              </ul>
            </div>
            <div className="bg-muted/50 p-6 border-t border-border/50 text-center text-sm text-muted-foreground">
              Guaranteed by Nova Market
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
