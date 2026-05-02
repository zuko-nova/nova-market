import { useGetMe, getGetMeQueryKey } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { User, Mail, Calendar, Sparkles } from "lucide-react";
import { format } from "date-fns";

export default function Profile() {
  const { data: user, isLoading } = useGetMe({
    query: { queryKey: getGetMeQueryKey() }
  });

  return (
    <div className="container mx-auto px-4 md:px-8 py-12 max-w-4xl">
      <div className="mb-10">
        <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-3">Your Profile</h1>
        <p className="text-muted-foreground text-lg">Manage your account settings and public persona.</p>
      </div>

      {isLoading ? (
        <Card className="border-border/50 rounded-3xl overflow-hidden shadow-sm">
          <div className="h-32 bg-muted/50 w-full" />
          <CardContent className="p-8 pt-0 relative">
            <div className="w-24 h-24 rounded-full border-4 border-card bg-muted absolute -top-12" />
            <div className="mt-16 space-y-4">
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-24 w-full mt-6" />
            </div>
          </CardContent>
        </Card>
      ) : user ? (
        <div className="space-y-8">
          <Card className="border-border/50 rounded-3xl overflow-hidden shadow-sm bg-card relative">
            <div className="h-32 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/10 w-full" />
            <CardContent className="p-8 pt-0 relative">
              <div className="w-24 h-24 rounded-full border-4 border-card bg-primary text-primary-foreground flex items-center justify-center text-4xl font-bold absolute -top-12 shadow-lg">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover rounded-full" />
                ) : (
                  user.name.charAt(0).toUpperCase()
                )}
              </div>
              
              <div className="mt-16">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div>
                    <h2 className="text-3xl font-bold mb-1">{user.name}</h2>
                    <div className="flex items-center gap-4 text-muted-foreground text-sm mb-4">
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-4 h-4" /> {user.email}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" /> Joined {format(new Date(user.joinedAt), "MMMM yyyy")}
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-sm px-4 py-1.5 border-primary/30 text-primary bg-primary/5 self-start">
                    <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)} Account
                  </Badge>
                </div>

                <div className="mt-8 pt-8 border-t border-border/10">
                  <h3 className="font-semibold text-lg mb-3">Bio</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {user.bio || "No bio provided yet. Update your profile to tell people about yourself."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="text-center py-20">Failed to load user profile.</div>
      )}
    </div>
  );
}
