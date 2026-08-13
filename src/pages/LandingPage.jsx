import { Link } from "react-router";

export default function LandingPage() {
  return (
    <div className="landing-page" style={{ padding: "40px 24px", maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
      {/* Brand Header */}
      <div style={{ marginBottom: "40px" }}>
        <div
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "16px",
            background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#ffffff",
            fontSize: "28px",
            marginBottom: "12px",
            boxShadow: "0 4px 14px rgba(37, 99, 235, 0.3)",
          }}
        >
          🚗
        </div>
        <h1 style={{ fontSize: "36px", fontWeight: "800", color: "#0f172a" }}>אוטופיה (Autopia)</h1>
        <p style={{ fontSize: "16px", color: "#64748b", marginTop: "4px" }}>
          ניהול רכב חכם במקום אחד
        </p>
      </div>

      {/* Main Intro Card */}
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "20px",
          border: "1px solid #e2e8f0",
          padding: "36px 24px",
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05)",
          marginBottom: "32px",
        }}
      >
        <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#1e293b", marginBottom: "16px" }}>
          ברוכים הבאים לניהול הרכב שלכם
        </h2>
        <p style={{ fontSize: "16px", color: "#475569", lineHeight: "1.6", marginBottom: "24px" }}>
          מעקב טיפולים, תזכורות לטסט שנתי וביטוח, ועוזר AI אישי הלומד את ספר הרכב שלך.
        </p>

        {/* Navigation Buttons */}
        <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
          <Link
            to="/auth"
            style={{
              padding: "12px 24px",
              borderRadius: "10px",
              fontWeight: "700",
              fontSize: "15px",
              color: "#ffffff",
              backgroundColor: "#2563eb",
            }}
          >
            התחברות / הרשמה
          </Link>
          <Link
            to="/home"
            style={{
              padding: "12px 24px",
              borderRadius: "10px",
              fontWeight: "600",
              fontSize: "15px",
              color: "#334155",
              backgroundColor: "#f1f5f9",
              border: "1px solid #cbd5e1",
            }}
          >
            כניסה לדשבורד
          </Link>
        </div>
      </div>
    </div>
  );
}
