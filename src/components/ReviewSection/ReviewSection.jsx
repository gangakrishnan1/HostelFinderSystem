import { useState } from "react";

export default function ReviewSection({ hostel, onAddReview }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const submitReview = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    onAddReview({
      id: `review-${Date.now()}`,
      user: "Current User",
      rating,
      comment,
    });
    setComment("");
    setRating(5);
  };

  const total = hostel.reviews?.length || 0;
  const avg = total
    ? (hostel.reviews.reduce((sum, r) => sum + Number(r.rating), 0) / total).toFixed(1)
    : hostel.rating;

  return (
    <section className="card border-0 shadow-sm mt-4">
      <div className="card-body">
        <h5>Ratings & Reviews</h5>
        <p className="mb-3">Average rating: <strong>{avg}?</strong> ({total} reviews)</p>

        <form onSubmit={submitReview} className="row g-2 mb-4">
          <div className="col-md-3">
            <select
              className="form-select"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
            >
              {[5, 4, 3, 2, 1].map((item) => (
                <option key={item} value={item}>{item} Stars</option>
              ))}
            </select>
          </div>
          <div className="col-md-7">
            <input
              className="form-control"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write your review"
            />
          </div>
          <div className="col-md-2 d-grid">
            <button className="btn btn-primary" type="submit">Submit</button>
          </div>
        </form>

        <div className="d-flex flex-column gap-3">
          {hostel.reviews?.map((review) => (
            <article key={review.id} className="border rounded p-3 bg-light-subtle">
              <div className="d-flex justify-content-between">
                <strong>{review.user}</strong>
                <span>{review.rating}?</span>
              </div>
              <p className="mb-0 text-muted small">{review.comment}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
