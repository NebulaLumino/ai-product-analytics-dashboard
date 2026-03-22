"use client";
import { useState } from "react";
export default function Home() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [history, setHistory] = useState<{i:string;o:string}[]>([]);
  const handleGenerate = async () => {
    if(!input.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/generate", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ prompt:input }) });
      const data = await res.json();
      setResult(data.result || "Error generating content.");
      setHistory(prev=>[...prev,{i:input,o:data.result||"Error"}]);
      setInput("");
    } catch { setResult("Error generating content."); }
    setLoading(false);
  };
  return (
    <div style={{minHeight:"100vh",padding:"24px",maxWidth:"900px",margin:"0 auto"}}>
      <div style={{marginBottom:32}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:8}}>
          <div style={{width:40,height:40,background:"var(--primary)",borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>📊</div>
          <h1 style={{fontSize:28,fontWeight:800}}>AI Product Analytics Dashboard</h1>
        </div>
        <p style={{color:"var(--text-muted)",fontSize:15}}>AI-powered generator powered by DeepSeek</p>
      </div>
      <div className="card" style={{marginBottom:24}}>
        <textarea value={input} onChange={e=>setInput(e.target.value)} placeholder="Enter your input..." rows={6} style={{marginBottom:12}} />
        <button className="btn-primary" onClick={handleGenerate} disabled={loading||!input.trim()} style={{width:"100%"}}>
          {loading?"Generating...":"Generate"}
        </button>
      </div>
      {result&&<div className="card" style={{marginBottom:24,whiteSpace:"pre-wrap",lineHeight:1.7,color:"var(--text-muted)",fontSize:14}}>{result}</div>}
      <h2 style={{fontSize:16,fontWeight:700,marginBottom:12}}>History</h2>
      {history.length===0&&<div className="card" style={{textAlign:"center",padding:40,color:"var(--text-muted)"}}><p>Your generated content will appear here.</p></div>}
      {history.map((h,i)=>(
        <div key={i} className="card" style={{marginBottom:12}}>
          <div style={{fontSize:12,color:"var(--primary)",fontWeight:600,marginBottom:6}}>INPUT</div>
          <div style={{fontSize:13,marginBottom:12,color:"var(--text-muted)"}}>{h.i}</div>
          <div style={{fontSize:12,color:"var(--accent)",fontWeight:600,marginBottom:6}}>OUTPUT</div>
          <div style={{fontSize:13,whiteSpace:"pre-wrap",lineHeight:1.6}}>{h.o}</div>
        </div>
      ))}
    </div>
  );
}