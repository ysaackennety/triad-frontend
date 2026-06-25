export default function MenuItem({ icon, text, active, onClick }) {
  return (
    <div className={`menuItem ${active ? "active" : ""}`} onClick={onClick}>
      {icon}
      <span>{text}</span>
    </div>
  );
}
