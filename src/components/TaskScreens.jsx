import React from 'react';

export function TaskBriefing({ task, taskIndex, totalTasks, onStart }) {
  return (
    <div style={{ position:'absolute', inset:0, background:'rgba(17,27,33,0.45)', zIndex:200, display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ background:'#ffffff', borderRadius:16, padding:'36px 44px', width:480, boxShadow:'0 20px 60px rgba(0,0,0,0.25)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:20 }}>
          <div style={{ background:'#00a884', borderRadius:8, padding:'4px 12px', fontSize:12, color:'white', fontWeight:600 }}>
            Task {taskIndex + 1} of {totalTasks}
          </div>
          <div style={{ background:'#f0f2f5', borderRadius:8, padding:'4px 12px', fontSize:12, color:'#667781' }}>
            {task.task_id}
          </div>
        </div>
        <h2 style={{ color:'#111b21', fontSize:22, fontWeight:600, marginBottom:12 }}>{task.task_name}</h2>
        <p style={{ color:'#3b4a54', fontSize:15, lineHeight:1.6, marginBottom:28 }}>{task.task_description}</p>
        <div style={{ background:'#f0f2f5', border:'1px solid #e9edef', borderRadius:10, padding:'14px 18px', marginBottom:28 }}>
          <div style={{ color:'#00a884', fontSize:12, fontWeight:600, marginBottom:4, letterSpacing:0.4 }}>WHAT WE'RE MEASURING</div>
          <p style={{ color:'#667781', fontSize:13, lineHeight:1.5 }}>
            Your navigation path, time taken, screens visited, and any actions you perform will be recorded for research purposes.
          </p>
        </div>
        <button onClick={onStart} style={{
          width:'100%', padding:'13px 0', background:'#00a884', border:'none', borderRadius:10,
          color:'white', fontSize:15, fontWeight:600, cursor:'pointer',
        }}>
          Start Task →
        </button>
      </div>
    </div>
  );
}

export function TaskComplete({ trial, task, taskIndex, totalTasks, isSuccess, onNext, isLast }) {
  const mins = trial ? Math.floor(trial.duration_seconds / 60) : 0;
  const secs = trial ? trial.duration_seconds % 60 : 0;

  return (
    <div style={{ position:'absolute', inset:0, background:'rgba(17,27,33,0.5)', zIndex:200, display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ background:'#ffffff', borderRadius:16, padding:'36px 44px', width:460, boxShadow:'0 20px 60px rgba(0,0,0,0.25)', textAlign:'center' }}>
        <div style={{ fontSize:52, marginBottom:16 }}>{isSuccess ? '✅' : '⏭️'}</div>
        <h2 style={{ color:'#111b21', fontSize:20, fontWeight:600, marginBottom:8 }}>
          {isSuccess ? 'Task Completed!' : 'Task Recorded'}
        </h2>
        <p style={{ color:'#667781', fontSize:14, marginBottom:24 }}>{task?.task_name}</p>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:28 }}>
          <StatBox label="Time" value={`${mins}m ${secs}s`} />
          <StatBox label="Status" value={isSuccess ? 'Success' : 'Incomplete'} color={isSuccess ? '#00a884' : '#c9820a'} />
          <StatBox label="Help Used" value={trial?.help_used ? 'Yes' : 'No'} />
          <StatBox label="Progress" value={`${taskIndex + 1} / ${totalTasks}`} />
        </div>

        {isLast ? (
          <button onClick={onNext} style={btnStyle('#00a884', '#ffffff')}>
            View Session Summary →
          </button>
        ) : (
          <button onClick={onNext} style={btnStyle('#00a884', '#ffffff')}>
            Next Task ({taskIndex + 2} of {totalTasks}) →
          </button>
        )}
      </div>
    </div>
  );
}

export function SessionComplete({ trials, participant, onExport, onRestart, sheetsStatus, sheetsError, onRetrySheets }) {
  const total = trials.length;
  const succeeded = trials.filter(t => t.success).length;
  const avgTime = total > 0 ? Math.round(trials.reduce((s, t) => s + (t.duration_seconds || 0), 0) / total) : 0;
  const helpCount = trials.filter(t => t.help_used).length;

  return (
    <div style={{ height:'100vh', background:'#f0f2f5', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ background:'#ffffff', borderRadius:16, padding:'40px 48px', width:560, boxShadow:'0 20px 60px rgba(0,0,0,0.12)' }}>
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <div style={{ fontSize:56, marginBottom:16 }}>🎉</div>
          <h2 style={{ color:'#111b21', fontSize:24, fontWeight:600, marginBottom:8 }}>Session Complete</h2>
          <p style={{ color:'#667781', fontSize:14 }}>Participant: {participant?.participant_id}</p>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:28 }}>
          <StatBox label="Tasks Completed" value={`${succeeded} / ${total}`} color='#00a884' large />
          <StatBox label="Avg. Time" value={`${avgTime}s`} large />
          <StatBox label="Help Requests" value={helpCount} />
          <StatBox label="SCC Group" value={participant?.scc_status === 'scc' ? 'SCC' : 'Non-SCC'} />
        </div>

        <div style={{ background:'#f0f2f5', border:'1px solid #e9edef', borderRadius:10, padding:'16px 20px', marginBottom:24 }}>
          <div style={{ color:'#00a884', fontSize:12, fontWeight:600, marginBottom:10, letterSpacing:0.4 }}>TASK BREAKDOWN</div>
          {trials.map((t, i) => (
            <div key={t.task_trial_id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'6px 0', borderBottom: i < trials.length-1 ? '1px solid #e9edef' : 'none' }}>
              <span style={{ color:'#3b4a54', fontSize:13 }}>{t.task_name}</span>
              <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                <span style={{ color:'#667781', fontSize:12 }}>{t.duration_seconds}s</span>
                <span style={{ fontSize:14 }}>{t.success ? '✅' : '⚠️'}</span>
              </div>
            </div>
          ))}
        </div>

        {sheetsStatus === 'sending' && (
          <div style={{ background:'#e8f2fb', border:'1px solid #2196f3', borderRadius:10, padding:'12px 16px', marginBottom:16, display:'flex', alignItems:'center', gap:10 }}>
            <span style={{ fontSize:18 }}>⏳</span>
            <span style={{ color:'#3b4a54', fontSize:13 }}>Uploading session data to Google Sheets...</span>
          </div>
        )}
        {sheetsStatus === 'success' && (
          <div style={{ background:'#e7f8f3', border:'1px solid #00a884', borderRadius:10, padding:'12px 16px', marginBottom:16, display:'flex', alignItems:'center', gap:10 }}>
            <span style={{ fontSize:18 }}>✅</span>
            <span style={{ color:'#3b4a54', fontSize:13 }}>Session data uploaded to Google Sheets successfully.</span>
          </div>
        )}
        {sheetsStatus === 'error' && (
          <div style={{ background:'#fdecea', border:'1px solid #e57373', borderRadius:10, padding:'12px 16px', marginBottom:16 }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
              <span style={{ fontSize:18 }}>⚠️</span>
              <span style={{ color:'#c0392b', fontSize:13 }}>Couldn't upload to Google Sheets: {sheetsError}</span>
            </div>
            <button onClick={onRetrySheets} style={{ ...btnStyle('#f0f2f5', '#111b21'), padding:'8px 0', fontSize:12, border:'1px solid #d1d7db' }}>
              Retry Upload
            </button>
          </div>
        )}

        <div style={{ background:'#e7f8f3', border:'1px solid #00a884', borderRadius:10, padding:'12px 16px', marginBottom:20, display:'flex', alignItems:'center', gap:10 }}>
          <span style={{ fontSize:18 }}>📁</span>
          <span style={{ color:'#3b4a54', fontSize:13 }}>A local Excel backup was also saved to your Downloads folder.</span>
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          <button onClick={onExport} style={{ ...btnStyle('#f0f2f5', '#111b21'), border:'1px solid #d1d7db' }}>📥 Re-download Excel Backup</button>
          <button onClick={onRestart} style={{ ...btnStyle('#f0f2f5', '#111b21'), border:'1px solid #d1d7db' }}>Start New Session</button>
        </div>
      </div>
    </div>
  );
}

function StatBox({ label, value, color, large }) {
  return (
    <div style={{ background:'#f0f2f5', border:'1px solid #e9edef', borderRadius:10, padding:'14px 16px' }}>
      <div style={{ color:'#667781', fontSize:11, fontWeight:600, letterSpacing:0.4, marginBottom:4 }}>{label.toUpperCase()}</div>
      <div style={{ color: color || '#111b21', fontSize: large ? 22 : 18, fontWeight:600 }}>{value}</div>
    </div>
  );
}

const btnStyle = (bg, textColor) => ({
  width:'100%', padding:'13px 0', background:bg, border:'none', borderRadius:10,
  color:textColor, fontSize:14, fontWeight:600, cursor:'pointer',
});