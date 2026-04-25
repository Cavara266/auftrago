import { reviews } from "@/lib/reviews"
import ReviewCard from "./review-card"
import Container from "./container"

export default function ReviewsSection({
  providerSlug,
}: {
  providerSlug: string
}) {

  const providerReviews = reviews.filter(
    (review) => review.providerSlug === providerSlug
  )

  if (providerReviews.length === 0) return null

  return (
    <section className="py-20 border-t border-white/10">

      <Container>

        <h2 className="text-3xl font-bold text-white mb-10">
          Bewertungen
        </h2>

        <div className="grid md:grid-cols-2 gap-6">

          {providerReviews.map((review, i) => (
            <ReviewCard key={i} review={review} />
          ))}

        </div>

      </Container>

    </section>
  )
}