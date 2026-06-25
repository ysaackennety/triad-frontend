export default function Card({ icon, number, label }) {
  return (
    <div className="card">
      <div className="cardIcon">{icon}</div>
      <h3>{number}</h3>
      <p>{label}</p>
    </div>
  );
}
