import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Star } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface RatingCategory {
  name: string;
  key: string;
  rating: number;
}

interface RatingReviewProps {
  tripId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  isOpen: boolean;
  onClose: () => void;
}

export function RatingReview({ tripId, userId, userName, userAvatar, isOpen, onClose }: RatingReviewProps) {
  const { t } = useLanguage();
  const [overallRating, setOverallRating] = useState(0);
  const [comment, setComment] = useState('');
  const [categories, setCategories] = useState<RatingCategory[]>([
    { name: t('review.punctuality'), key: 'punctuality', rating: 0 },
    { name: t('review.cleanliness'), key: 'cleanliness', rating: 0 },
    { name: t('review.communication'), key: 'communication', rating: 0 },
  ]);

  const handleCategoryRating = (index: number, rating: number) => {
    const newCategories = [...categories];
    newCategories[index].rating = rating;
    setCategories(newCategories);
    
    // Update overall rating as average
    const avg = newCategories.reduce((sum, cat) => sum + cat.rating, 0) / newCategories.length;
    setOverallRating(Math.round(avg * 10) / 10);
  };

  const handleSubmit = async () => {
    if (overallRating === 0) {
      toast.error('Please provide a rating');
      return;
    }

    try {
      // TODO: Replace with Supabase insert
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const review = {
        tripId,
        userId,
        overallRating,
        categories: categories.reduce((acc, cat) => ({ ...acc, [cat.key]: cat.rating }), {}),
        comment,
        createdAt: new Date().toISOString(),
      };

      console.log('Review submitted:', review);
      toast.success('Review submitted successfully!');
      onClose();
    } catch (error) {
      toast.error('Failed to submit review');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t('review.rate')}</DialogTitle>
          <DialogDescription>
            Help others by sharing your experience
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* User Info */}
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={userAvatar} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {userName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{userName}</p>
              <p className="text-sm text-muted-foreground">Your travel companion</p>
            </div>
          </div>

          {/* Overall Rating */}
          <div className="space-y-2">
            <Label>Overall Rating</Label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setOverallRating(star)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`size-8 ${
                      star <= overallRating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Category Ratings */}
          <div className="space-y-4">
            {categories.map((category, index) => (
              <div key={category.key} className="space-y-2">
                <Label className="text-sm">{category.name}</Label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleCategoryRating(index, star)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`size-5 ${
                          star <= category.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <Label>{t('review.comment')}</Label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share details about your experience (optional)"
              rows={4}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button onClick={handleSubmit} className="flex-1">
              {t('review.submit')}
            </Button>
            <Button onClick={onClose} variant="outline" className="flex-1">
              {t('common.cancel')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Display reviews component
interface ReviewDisplayProps {
  reviews: Array<{
    id: string;
    userName: string;
    userAvatar?: string;
    rating: number;
    comment?: string;
    categories: {
      punctuality: number;
      cleanliness: number;
      communication: number;
    };
    createdAt: string;
  }>;
}

export function ReviewDisplay({ reviews }: ReviewDisplayProps) {
  const { t } = useLanguage();

  if (reviews.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          <Star className="size-12 mx-auto mb-4 opacity-50" />
          <p>No reviews yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <Card key={review.id}>
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <Avatar>
                <AvatarImage src={review.userAvatar} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {review.userName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-3">
                <div>
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{review.userName}</p>
                    <div className="flex items-center gap-1">
                      <Star className="size-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{review.rating.toFixed(1)}</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {review.comment && (
                  <p className="text-sm text-muted-foreground">{review.comment}</p>
                )}

                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">{t('review.punctuality')}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="size-3 fill-yellow-400 text-yellow-400" />
                      <span>{review.categories.punctuality}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-muted-foreground">{t('review.cleanliness')}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="size-3 fill-yellow-400 text-yellow-400" />
                      <span>{review.categories.cleanliness}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-muted-foreground">{t('review.communication')}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="size-3 fill-yellow-400 text-yellow-400" />
                      <span>{review.categories.communication}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
