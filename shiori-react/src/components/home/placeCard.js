export default function PlaceCard({ address }) {
  console.log("PlaceCard received address:", address);

  return (
    <div style={{
      border: "1px solid #ccc",
      borderRadius: "12px",
      padding: "16px",
      margin: "8px 0",
      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
      background: "linear-gradient(145deg, #fefefe, #f0f0f0)",
      transition: "transform 0.2s",
      cursor: "pointer"
    }}
    onMouseEnter={e => e.currentTarget.style.transform = "scale(1.02)"}
    onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
    >
      <p style={{ margin: 0, color: "#555" }}>{address}</p>
    </div>
  );
}
