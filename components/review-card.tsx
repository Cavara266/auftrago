type Review = {
  name: string
  rating: number
  comment: string
}

export default function ReviewCard({ review }: { review: Review }) {

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6">

      <div className="flex items-center justify-between mb-2">

        <p className="text-white font-medium">
          {review.name}
        </p>

        <p className="text-yellow-400">
          {"⭐".repeat(review.rating)}
        </p>

      </div>

      <p className="text-white/70 text-sm leading-relaxed">
        {review.comment}
      </p>

    </div>
  )
}