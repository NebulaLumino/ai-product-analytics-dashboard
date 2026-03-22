"use client";

import { useState } from "react";

interface MetricData {
  name: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
}

interface Insight {
  type: "anomaly" | "trend" | "summary" | "alert";
  title: string;
  description: string;
  severity: "info" | "warning" | "critical";
}

export default function AnalyticsDashboard() {
  const [activeTab, setActiveTab] = useState<"input" | "insights" | "qa">("input");
  const [platform, setPlatform] = useState("csv");
  const [csvData, setCsvData] = useState("");
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [metrics, setMetrics] = useState<MetricData[]>([
    { name: "Total Users", value: "24,521", change: "+12.3%", trend: "up" },
    { name: "Monthly Revenue", value: "$48,320", change: "+8.7%", trend: "up" },
    { name: "Churn Rate", value: "3.2%", change: "-0.4%", trend: "up" },
    { name: "Avg Session", value: "4m 32s", change: "+22.1%", trend: "up" },
  ]);
  const [insights, setInsights] = useState<Insight[]>([
    { type: "anomaly", title: "Drop in Conversions", description: "Checkout funnel shows 34% drop on mobile between 2-4 PM weekdays. Possible UX issue.", severity: "warning" },
    { type: "trend", title: "Feature Adoption Growing", description: "New dashboard feature seeing 67% weekly growth in active users.", severity: "info" },
    { type: "summary", title: "Weekly Summary", description: "Best performing day was Tuesday with 18% above average sessions. Worst performing: Friday.", severity: "info" },
  ]);
  const [qaHistory, setQaHistory] = useState<{q: string; a: string}[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [weeklyReport, setWeeklyReport] = useState("");

  const handleGenerateReport = async () => {
    if (!csvData.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/analytics/weekly-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ csvData, platform }),
      });
      const data = await res.json();
      setWeeklyReport(data.report);
      setActiveTab("insights");
    } catch {
      setWeeklyReport("Error generating report. Please try again.");
    }
    setLoading(false);
  };

  const handleAskQuestion = async () => {
    if (!question.trim()) return;
    setLoading(true);
    const q = question;
    setQuestion("");
    try {
      const res = await fetch("/api/analytics/qa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q, csvData }),
      });
      const data = await res.json();
      setQaHistory(prev => [...prev, { q, a: data.answer }]);
      setActiveTab("qa");
    } catch {
      setQaHistory(prev => [...prev, { q, a: "Error getting answer. Please try again." }]);
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <div style={{ width: 40, height: 40, background: "var(--primary)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>📊</div>
          <h1 style={{ fontSize: 28, fontWeight: 800 }}>AI Product Analytics Dashboard</h1>
        </div>
        <p style={{ color: "var(--text-muted)", fontSize: 15 }}>Connect your analytics data — get AI-powered insights, anomaly alerts, and weekly summaries</p>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 24, background: "var(--surface)", borderRadius: 10, padding: 4, width: "fit-content" }}>
        {(["input", "insights", "qa"] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: "8px 20px", background: activeTab === tab ? "var(--primary)" : "transparent", borderRadius: 7, fontSize: 13, fontWeight: 600, color: activeTab === tab ? "white" : "var(--text-muted)" }}>
            {tab === "input" ? "📥 Data Input" : tab === "insights" ? "💡 AI Insights" : "❓ Ask Questions"}
          </button>
        ))}
      </div>

      {/* Metrics Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 32 }}>
        {metrics.map((m, i) => (
          <div key={i} className="card">
            <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 6 }}>{m.name}</div>
            <div style={{ fontSize: 26, fontWeight: 800 }}>{m.value}</div>
            <div style={{ fontSize: 13, marginTop: 4, color: m.trend === "up" ? "var(--success)" : m.trend === "down" ? "var(--danger)" : "var(--text-muted)" }}>
              {m.trend === "up" ? "↑" : m.trend === "down" ? "↓" : "→"} {m.change}
            </div>
          </div>
        ))}
      </div>

      {/* DATA INPUT TAB */}
      {activeTab === "input" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          <div className="card">
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>📡 Connect Data Source</h2>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 13, color: "var(--text-muted)", marginBottom: 6 }}>Platform</label>
              <select value={platform} onChange={e => setPlatform(e.target.value)}>
                <option value="csv">CSV Upload / Paste</option>
                <option value="google-analytics">Google Analytics</option>
                <option value="mixpanel">Mixpanel</option>
                <option value="amplitude">Amplitude</option>
                <option value="heap">Heap</option>
              </select>
            </div>
            {platform === "csv" && (
              <>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ display: "block", fontSize: 13, color: "var(--text-muted)", marginBottom: 6 }}>
                    Paste CSV Data <span style={{ color: "var(--danger)" }}>*</span>
                  </label>
                  <textarea
                    value={csvData}
                    onChange={e => setCsvData(e.target.value)}
                    placeholder={`date,users,sessions,revenue,churn\n2024-01-01,1240,3890,4200,2.1\n2024-01-02,1380,4120,4650,1.8\n...`}
                    rows={10}
                    style={{ fontFamily: "monospace", fontSize: 12 }}
                  />
                </div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 12 }}>
                  Or enter your Google Analytics, Mixpanel, or Amplitude API credentials in the environment variables.
                </div>
              </>
            )}
            <button className="btn-primary" onClick={handleGenerateReport} disabled={loading || (platform === "csv" && !csvData.trim())} style={{ width: "100%" }}>
              {loading ? "⏳ Generating Report..." : "🚀 Generate Weekly Report"}
            </button>
          </div>

          <div className="card">
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>❓ Ask About Your Data</h2>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 13, color: "var(--text-muted)", marginBottom: 6 }}>Your Question</label>
              <textarea
                value={question}
                onChange={e => setQuestion(e.target.value)}
                placeholder="e.g., What is the churn trend over the last 30 days?"
                rows={4}
              />
            </div>
            <button className="btn-primary" onClick={handleAskQuestion} disabled={loading || !question.trim()} style={{ width: "100%" }}>
              {loading ? "⏳ Thinking..." : "🔍 Ask AI"}
            </button>
            <div style={{ marginTop: 16 }}>
              <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8 }}>Suggested questions:</p>
              {["What caused the revenue dip on March 5?", "Which channel has the best conversion rate?", "Predict churn for next month"].map((q, i) => (
                <button key={i} onClick={() => setQuestion(q)} style={{ display: "block", background: "none", border: "1px solid var(--border)", color: "var(--text-muted)", padding: "6px 10px", borderRadius: 6, fontSize: 12, marginBottom: 4, width: "100%", textAlign: "left" }}>
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* INSIGHTS TAB */}
      {activeTab === "insights" && (
        <div>
          {weeklyReport && (
            <div className="card" style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>📋 Weekly AI Summary Report</h2>
              <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.7, color: "var(--text-muted)", fontSize: 14 }}>{weeklyReport}</div>
            </div>
          )}
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>💡 AI-Generated Insights</h2>
          <div style={{ display: "grid", gap: 12 }}>
            {insights.map((insight, i) => (
              <div key={i} className="card" style={{ borderLeft: `3px solid ${insight.severity === "critical" ? "var(--danger)" : insight.severity === "warning" ? "var(--warning)" : "var(--accent)"}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <span className={`badge badge-${insight.severity === "critical" ? "danger" : insight.severity === "warning" ? "warning" : "info"}`}>
                    {insight.type.toUpperCase()}
                  </span>
                  <strong style={{ fontSize: 15 }}>{insight.title}</strong>
                </div>
                <p style={{ color: "var(--text-muted)", fontSize: 14, margin: 0, lineHeight: 1.6 }}>{insight.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* QA TAB */}
      {activeTab === "qa" && (
        <div>
          {qaHistory.length === 0 && (
            <div className="card" style={{ textAlign: "center", padding: 48 }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>❓</div>
              <p style={{ color: "var(--text-muted)", fontSize: 15 }}>Ask questions about your analytics data and get instant AI-powered answers.</p>
            </div>
          )}
          <div style={{ display: "grid", gap: 16 }}>
            {qaHistory.map((item, i) => (
              <div key={i}>
                <div className="card" style={{ marginBottom: 8, borderLeft: "3px solid var(--primary)" }}>
                  <div style={{ fontSize: 12, color: "var(--primary)", fontWeight: 600, marginBottom: 6 }}>YOU</div>
                  <div style={{ fontSize: 14 }}>{item.q}</div>
                </div>
                <div className="card" style={{ borderLeft: "3px solid var(--accent)" }}>
                  <div style={{ fontSize: 12, color: "var(--accent)", fontWeight: 600, marginBottom: 6 }}>AI INSIGHT</div>
                  <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.7, fontSize: 14, color: "var(--text-muted)" }}>{item.a}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
