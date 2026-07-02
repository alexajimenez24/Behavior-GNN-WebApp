import React, { useState, useEffect } from 'react';

export default function TaskBar({ task, taskIndex, totalTasks, onHelp, onComplete, startTime }) {
  const [elapsed, setElapsed] = useState(0);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;

  const handleHelp = () => {
    setShowHint(true);
    onHelp();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0,
      zIndex: 300,
      background: '#ffffff',
      borderBottom: '2px solid #00a884',
      boxShadow: '0 4px 20px rgba(0,168,132,0.15)',
    }}>
      <div style={{ display:'flex', alignItems:'center', gap:16, padding:'10px 20px' }}>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:2 }}>
            <span style={{ background:'#00a884', color:'white', fontSize:11, fontWeight:700, padding:'2px 8px', borderRadius:20, letterSpacing:0.5, flexShrink:0 }}>
              TASK {taskIndex+1}/{totalTasks}
            </span>
            <span style={{ color:'#111b21', fontSize:14, fontWeight:600, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
              {task.task_name}
            </span>
          </div>
          <p style={{ color:'#667781', fontSize:12, margin:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
            {task.task_description}
          </p>
          {showHint && (
            <div style={{ background:'#e7f8f3', border:'1px solid #00a884', borderRadius:6, padding:'6px 12px', marginTop:6, fontSize:12, color:'#00806b' }}>
              💡 {task.hint}
            </div>
          )}
        </div>

        <div style={{ textAlign:'center', background:'#f0f2f5', borderRadius:8, padding:'6px 14px', flexShrink:0 }}>
          <div style={{ color:'#667781', fontSize:10, fontWeight:600, letterSpacing:0.5 }}>TIME</div>
          <div style={{ color: elapsed > 120 ? '#c9820a' : '#111b21', fontSize:16, fontWeight:700, fontVariantNumeric:'tabular-nums' }}>
            {String(mins).padStart(2,'0')}:{String(secs).padStart(2,'0')}
          </div>
        </div>

        <div style={{ display:'flex', gap:8, flexShrink:0 }}>
          {!showHint && (
            <button onClick={handleHelp} style={{ padding:'7px 14px', background:'#f0f2f5', border:'1px solid #d1d7db', borderRadius:8, color:'#54656f', fontSize:13, cursor:'pointer', fontFamily:'inherit' }}>
              💡 Hint
            </button>
          )}
          <button onClick={() => onComplete(true)} style={{ padding:'7px 16px', background:'#00a884', border:'none', borderRadius:8, color:'white', fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>
            ✓ Done
          </button>
          <button onClick={() => onComplete(false)} style={{ padding:'7px 14px', background:'#f0f2f5', border:'1px solid #d1d7db', borderRadius:8, color:'#667781', fontSize:13, cursor:'pointer', fontFamily:'inherit' }}>
            Skip →
          </button>
        </div>
      </div>
    </div>
  );
}