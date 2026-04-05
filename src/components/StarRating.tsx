export default function StarRating({ rating }: { rating: number }) {
  return (
    <span className="text-lg">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < rating ? "text-yellow-400" : "text-gray-300"}>
          ★
        </span>
      ))}
    </span>
  );
}
