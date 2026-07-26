export type FaqItem = {
  question: string;
  answer: string;
};

export default function FaqSection({
  items,
  title = "Häufige Fragen",
}: {
  items: FaqItem[];
  title?: string;
}) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section className="premium-section">
      <div className="container premium-faq">
        <span className="eyebrow">FAQ</span>
        <h2>{title}</h2>

        <div className="quote-faq">
          {items.map((item) => (
            <details key={item.question}>
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
