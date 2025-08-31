import React from 'react';

export default function AdminShell() {
  const base = 'http://localhost:8082/admin';
  return (
    <div style={{height:'100vh', width:'100vw', background:'#0b1220', color:'#e5e7eb'}}>
      <div style={{height:48, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 12px', borderBottom:'1px solid #1f2937'}}>
        <strong>Admin</strong>
        <a href={base} target="_blank" rel="noreferrer" style={{textDecoration:'underline'}}>Open in new tab</a>
      </div>
      <iframe title="Admin" src={base} style={{width:'100%', height:'calc(100vh - 48px)', border:'0'}} />
    </div>
  );
}
