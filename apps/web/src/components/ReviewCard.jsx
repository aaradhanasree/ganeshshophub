import React from 'react';
import { Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const ReviewCard = ({ review, userName }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <Card className="bg-muted/50">
      <CardContent className="p-4">
        <div className="flex items-start gap-3 mb-3">
          <Avatar className="w-10 h-10 rounded-xl">
            <AvatarFallback className="rounded-xl bg-primary/10 text-primary">
              {getInitials(userName)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-semibold">{userName || 'Anonymous'}</p>
            <p className="text-xs text-muted-foreground">{formatDate(review.created)}</p>
          </div>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < review.rating
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
        <p className="text-sm leading-relaxed">{review.comment}</p>
      </CardContent>
    </Card>
  );
};

export default ReviewCard;