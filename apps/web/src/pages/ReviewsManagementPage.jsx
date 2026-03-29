import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { CheckCircle, XCircle, Star, ShieldCheck, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import AdminHeader from '@/components/AdminHeader.jsx';
import MetricCard from '@/components/MetricCard.jsx';
import pb from '@/lib/pocketbaseClient.js';
import { toast } from 'sonner';

const ReviewsManagementPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending'); // pending, approved

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      const records = await pb.collection('reviews').getFullList({
        sort: '-created',
        expand: 'productId,userId',
        $autoCancel: false
      });
      setReviews(records);
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await pb.collection('reviews').update(id, { isModerated: true }, { $autoCancel: false });
      toast.success('Review approved');
      loadReviews();
    } catch (error) {
      toast.error('Failed to approve review');
    }
  };

  const handleReject = async (id) => {
    if (window.confirm('Are you sure you want to reject and delete this review?')) {
      try {
        await pb.collection('reviews').delete(id, { $autoCancel: false });
        toast.success('Review rejected and deleted');
        loadReviews();
      } catch (error) {
        toast.error('Failed to reject review');
      }
    }
  };

  const filteredReviews = reviews.filter(r => {
    if (filter === 'pending') return !r.isModerated;
    if (filter === 'approved') return r.isModerated;
    return true;
  });

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  const pendingCount = reviews.filter(r => !r.isModerated).length;

  return (
    <>
      <Helmet>
        <title>Reviews Management - Sri Ganesh Battery Center</title>
        <meta name="description" content="Moderate customer reviews" />
      </Helmet>

      <Header />
      <AdminHeader />

      <main className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-8" style={{letterSpacing: '-0.02em'}}>
            Reviews Management
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <MetricCard
              title="Total Reviews"
              value={reviews.length}
              icon={Star}
            />
            <MetricCard
              title="Average Rating"
              value={averageRating}
              icon={Star}
            />
            <MetricCard
              title="Pending Moderation"
              value={pendingCount}
              icon={ShieldCheck}
            />
          </div>

          <div className="bg-card rounded-2xl border overflow-hidden">
            <div className="p-4 border-b">
              <Tabs value={filter} onValueChange={setFilter}>
                <TabsList>
                  <TabsTrigger value="pending">Pending ({pendingCount})</TabsTrigger>
                  <TabsTrigger value="approved">Approved</TabsTrigger>
                  <TabsTrigger value="all">All Reviews</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead className="w-1/3">Comment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12">
                      Loading reviews...
                    </TableCell>
                  </TableRow>
                ) : filteredReviews.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                      No reviews found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredReviews.map((review) => (
                    <TableRow key={review.id}>
                      <TableCell className="font-medium">
                        {review.expand?.productId?.name || 'Unknown Product'}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{review.expand?.userId?.firstName} {review.expand?.userId?.lastName}</span>
                          {review.verifiedPurchase && (
                            <span className="text-xs text-green-600 flex items-center gap-1 mt-1">
                              <ShieldCheck className="w-3 h-3" /> Verified
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{review.rating}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm line-clamp-2" title={review.comment}>
                          {review.comment || <span className="text-muted-foreground italic">No comment</span>}
                        </p>
                        {(review.helpfulVotes > 0 || review.unhelpfulVotes > 0) && (
                          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1"><ThumbsUp className="w-3 h-3" /> {review.helpfulVotes || 0}</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={review.isModerated ? 'default' : 'secondary'}>
                          {review.isModerated ? 'Approved' : 'Pending'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {!review.isModerated && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleApprove(review.id)}
                              className="text-green-600 hover:text-green-700 hover:bg-green-50 transition-all duration-200"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" /> Approve
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleReject(review.id)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10 transition-all duration-200"
                          >
                            <XCircle className="w-4 h-4 mr-1" /> Reject
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default ReviewsManagementPage;