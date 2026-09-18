import { useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { Star } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useOrders } from "@/context/OrderContext";
import { useProducts } from "@/context/ProductContext";
import { useToast } from "@/context/ToastContext";
import { PageHeader } from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";
import { cx } from "@/lib/utils";
const CAPTIONS = ["", "Poor", "Fair", "Good", "Very Good", "Excellent!"];
const MAX = 200;
export function RateFarmerPage() {
  const { id = "" } = useParams();
  const { byId, markRated } = useOrders();
  const { addReview } = useProducts();
  const { user } = useAuth();
  const { notify } = useToast();
  const navigate = useNavigate();
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [review, setReview] = useState("");
  const order = byId(id);
  if (!order) return <Navigate to="/buyer/orders" replace />;
  function submit(e) {
    e.preventDefault();
    // Attribute the review to every product in the order.
    order.lines.forEach((line) =>
      addReview(line.productId, {
        author: user?.name ?? "",
        rating,
        title: CAPTIONS[rating] ?? "Rated",
        body: review.trim(),
        verified: true,
      }),
    );
    markRated(order.id);
    notify("Thanks for rating your farmer");
    navigate(`/buyer/orders/${order.id}`, { replace: true });
  }
  const shown = hover || rating;
  return (
    <>
      <PageHeader
        title="Rate Your Farmer"
        backTo={`/buyer/orders/${order.id}`}
      />

      <form
        onSubmit={submit}
        className="mx-auto w-full max-w-xl px-4 pb-12 lg:px-8"
      >
        <div className="flex flex-col items-center text-center">
          <h2 className="mt-3 text-[22px] font-bold text-ink">
            {order.farmerName}
          </h2>
          <p className="text-[22px] font-bold text-ink">{order.farmerPhone}</p>
        </div>

        <dl className="mt-3 flex flex-wrap justify-center gap-x-8 gap-y-1 text-[17px]">
          <div className="flex gap-2">
            <dt className="font-bold text-ink">Location:</dt>
            <dd className="text-ink">{order.farmerLocation}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="font-bold text-ink">Farm Type:</dt>
            <dd className="text-ink">{order.farmType}</dd>
          </div>
        </dl>

        <section className="mt-5 border-y border-ink-line py-4 text-center">
          <h3 className="text-[15px] font-bold text-ink">
            How was your experience?
          </h3>
          <div
            className="mt-2 flex justify-center gap-2"
            onMouseLeave={() => setHover(0)}
          >
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setRating(value)}
                onMouseEnter={() => setHover(value)}
                aria-label={`${value} star${value === 1 ? "" : "s"}`}
                className="transition active:scale-90"
              >
                <Star
                  className={cx(
                    "h-9 w-9 transition",
                    value <= shown
                      ? "fill-[#FFB800] text-[#FFB800]"
                      : "fill-ink-line text-ink-line",
                  )}
                />
              </button>
            ))}
          </div>
          <p className="mt-2 text-[19px] text-ink">{CAPTIONS[shown]}</p>
        </section>

        <div className="mt-5">
          <label htmlFor="review" className="text-[15px] font-bold text-ink">
            Write a review{" "}
            <span className="font-normal text-ink-soft">(optional)</span>
          </label>
          <textarea
            id="review"
            value={review}
            maxLength={MAX}
            onChange={(e) => setReview(e.target.value)}
            className="field-box mt-2 min-h-[104px] resize-none leading-relaxed"
          />
          <p className="mt-1 text-right text-[15px] text-ink-soft">
            {review.length}/{MAX}
          </p>
        </div>

        <Button type="submit" block className="mt-6">
          Submit Review
        </Button>
      </form>
    </>
  );
}
