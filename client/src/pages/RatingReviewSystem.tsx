import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocation } from "wouter";

interface Review {
  id: string;
  author: string;
  rating: number;
  title: string;
  content: string;
  date: Date;
  helpful: number;
  unhelpful: number;
  verified: boolean;
  images: string[];
}

interface RatingStats {
  average: number;
  total: number;
  distribution: Record<number, number>;
}

const mockReviews: Review[] = [
  {
    id: "1",
    author: "Sarah Ahmed",
    rating: 5,
    title: "Excellent care for my dog!",
    content:
      "Dr. Ahmed was very professional and caring. He took time to explain everything and my dog felt comfortable. Highly recommended!",
    date: new Date("2024-01-20"),
    helpful: 24,
    unhelpful: 2,
    verified: true,
    images: [],
  },
  {
    id: "2",
    author: "Mohamed Hassan",
    rating: 4,
    title: "Good service, a bit pricey",
    content:
      "The clinic is clean and the staff is friendly. The consultation was thorough but the fees are higher than other places.",
    date: new Date("2024-01-18"),
    helpful: 15,
    unhelpful: 1,
    verified: true,
    images: [],
  },
  {
    id: "3",
    author: "Fatima Karim",
    rating: 5,
    title: "Saved my cat's life!",
    content:
      "Emergency services were quick and professional. The team worked through the night to save my cat. Forever grateful!",
    date: new Date("2024-01-15"),
    helpful: 42,
    unhelpful: 0,
    verified: true,
    images: [],
  },
];

const ratingStats: RatingStats = {
  average: 4.7,
  total: 156,
  distribution: {
    5: 120,
    4: 25,
    3: 8,
    2: 2,
    1: 1,
  },
};

export default function RatingReviewSystem() {
  const [location, setLocation] = useLocation();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [formData, setFormData] = useState({
    rating: 5,
    title: "",
    content: "",
  });
  const [sortBy, setSortBy] = useState<"helpful" | "recent" | "rating">("helpful");
  const [filterRating, setFilterRating] = useState<number | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "rating" ? parseInt(value) : value,
    }));
  };

  const handleSubmitReview = () => {
    if (!formData.title || !formData.content) {
      alert("Please fill in all fields");
      return;
    }
    // TODO: Call API to submit review
    setShowReviewForm(false);
    setFormData({ rating: 5, title: "", content: "" });
  };

  const filteredReviews = mockReviews
    .filter((r) => !filterRating || r.rating === filterRating)
    .sort((a, b) => {
      if (sortBy === "helpful") return b.helpful - a.helpful;
      if (sortBy === "recent") return b.date.getTime() - a.date.getTime();
      if (sortBy === "rating") return b.rating - a.rating;
      return 0;
    });

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900 overflow-hidden">
      {/* Background animations */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full min-h-screen flex flex-col px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-400 mb-2">
            Ratings & Reviews
          </h1>
          <p className="text-yellow-200">Help others find the best pet care providers</p>
        </div>

        <div className="max-w-4xl mx-auto w-full">
          {/* Rating summary */}
          <div className="bg-slate-800/60 border-2 border-yellow-400/40 rounded-2xl p-8 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Average rating */}
              <div className="flex flex-col items-center justify-center">
                <div className="text-7xl font-bold text-yellow-300 mb-2">
                  {ratingStats.average}
                </div>
                <div className="flex gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-3xl ${
                        i < Math.round(ratingStats.average) ? "text-yellow-400" : "text-slate-600"
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-yellow-100/60">Based on {ratingStats.total} reviews</p>
              </div>

              {/* Rating distribution */}
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center gap-3">
                    <span className="text-yellow-200 font-semibold w-8">{rating}★</span>
                    <div className="flex-1 bg-slate-700/50 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-full"
                        style={{
                          width: `${(ratingStats.distribution[rating] / ratingStats.total) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-yellow-100/60 w-12 text-right">
                      {ratingStats.distribution[rating]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Write review button */}
            <div className="mt-8 pt-8 border-t border-yellow-400/30">
              <Button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-slate-900 font-bold py-3 rounded-lg hover:shadow-lg"
              >
                {showReviewForm ? "Cancel" : "✍️ Write a Review"}
              </Button>
            </div>
          </div>

          {/* Review form */}
          {showReviewForm && (
            <div className="bg-slate-800/60 border-2 border-yellow-400/40 rounded-2xl p-8 mb-8">
              <h3 className="text-2xl font-bold text-yellow-200 mb-6">Share Your Experience</h3>

              <div className="space-y-6">
                {/* Rating selector */}
                <div>
                  <label className="block text-yellow-200 font-semibold mb-3">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setFormData((prev) => ({ ...prev, rating: star }))}
                        className={`text-4xl transition-all ${
                          star <= formData.rating ? "text-yellow-400 scale-110" : "text-slate-600"
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-yellow-200 font-semibold mb-2">Review Title</label>
                  <Input
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Summarize your experience..."
                    className="bg-slate-700/50 border-yellow-400/30"
                  />
                </div>

                {/* Content */}
                <div>
                  <label className="block text-yellow-200 font-semibold mb-2">Your Review</label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    placeholder="Share your experience in detail..."
                    rows={5}
                    className="w-full bg-slate-700/50 border border-yellow-400/30 text-yellow-100 rounded-lg px-4 py-2"
                  />
                </div>

                {/* Submit button */}
                <Button
                  onClick={handleSubmitReview}
                  className="w-full bg-gradient-to-r from-green-400 to-green-500 text-slate-900 font-bold py-3 rounded-lg"
                >
                  Submit Review
                </Button>
              </div>
            </div>
          )}

          {/* Filters and sorting */}
          <div className="mb-8 space-y-4">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setFilterRating(null)}
                className={`px-4 py-2 rounded-full font-semibold transition-all ${
                  filterRating === null
                    ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-slate-900"
                    : "bg-slate-700/50 text-yellow-200 border border-yellow-400/30"
                }`}
              >
                All Reviews
              </button>
              {[5, 4, 3, 2, 1].map((rating) => (
                <button
                  key={rating}
                  onClick={() => setFilterRating(rating)}
                  className={`px-4 py-2 rounded-full font-semibold transition-all ${
                    filterRating === rating
                      ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-slate-900"
                      : "bg-slate-700/50 text-yellow-200 border border-yellow-400/30 hover:bg-slate-600/70"
                  }`}
                >
                  {rating}★
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              {[
                { label: "Most Helpful", value: "helpful" },
                { label: "Most Recent", value: "recent" },
                { label: "Highest Rated", value: "rating" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSortBy(opt.value as typeof sortBy)}
                  className={`px-4 py-2 rounded-full font-semibold transition-all ${
                    sortBy === opt.value
                      ? "bg-gradient-to-r from-purple-400 to-purple-500 text-slate-900"
                      : "bg-slate-700/50 text-yellow-200 border border-yellow-400/30 hover:bg-slate-600/70"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Reviews list */}
          <div className="space-y-4">
            {filteredReviews.map((review) => (
              <div
                key={review.id}
                className="bg-slate-800/60 border border-yellow-400/30 rounded-lg p-6 hover:border-yellow-400/60 transition-all"
              >
                {/* Review header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="text-lg font-bold text-yellow-200">{review.author}</h4>
                      {review.verified && (
                        <span className="bg-green-400/20 text-green-300 px-2 py-1 rounded text-xs font-semibold">
                          ✓ Verified
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2 items-center">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`text-lg ${
                              i < review.rating ? "text-yellow-400" : "text-slate-600"
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="text-yellow-100/60 text-sm">
                        {review.date.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Review title and content */}
                <h5 className="text-lg font-semibold text-yellow-200 mb-2">{review.title}</h5>
                <p className="text-yellow-100/80 mb-4">{review.content}</p>

                {/* Helpful/unhelpful buttons */}
                <div className="flex gap-4 text-sm">
                  <button className="text-yellow-200 hover:text-yellow-100 transition-colors">
                    👍 Helpful ({review.helpful})
                  </button>
                  <button className="text-yellow-200 hover:text-yellow-100 transition-colors">
                    👎 Not helpful ({review.unhelpful})
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Back button */}
          <div className="mt-8">
            <Button
              onClick={() => setLocation("/")}
              variant="outline"
              className="border-2 border-yellow-400 text-yellow-200 font-bold px-6 py-2 rounded-full"
            >
              ← Back
            </Button>
          </div>
        </div>
      </div>

      {/* Styles */}
      <style>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
}
