import React, { useState } from 'react';

let taskCounter = 0;

export default function TaskBuilder({ existingTasks, onAddTask, onDone, participant }) {
  const [form, setForm] = useState({ task_name: '', task_description: '', hint: '' });
  const [error, setError] = useState('');

  const handle = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const addTask = () => {
    if (!form.task_name.trim()) { setError('Task name is required'); return; }
    if (!form.task_description.trim()) { setError('Task description is required'); return; }
    taskCounter += 1;
    onAddTask({
      task_id: `T${String(existingTasks.length + 1).padStart(2, '0')}`,
      task_name: form.task_name.trim(),
      task_description: form.task_description.trim(),
      hint: form.hint.trim() || 'No hint available for this task.',
      optimal_path: [],
      target_contact: null,
      success_check: () => false,
    });
    setForm({ task_name: '', task_description: '', hint: '' });
    setError('');
  };

  return (
    <div style={{ height:'100vh', background:'#111b21', display:'flex', alignItems:'center', justifyContent:'center', overflowY:'auto', padding:'20px 0' }}>
      <div style={{ background:'#202c33', borderRadius:12, padding:'36px 44px', width:560, boxShadow:'0 8px 32px rgba(0,0,0,0.5)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:6 }}>
          <div style={{ width:40, height:40, borderRadius:10, background:'#00a884', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20 }}>📋</div>
          <div>
            <div style={{ color:'#e9edef', fontWeight:600, fontSize:17 }}>Set Up Tasks</div>
            <div style={{ color:'#8696a0', fontSize:13 }}>Participant: {participant?.participant_id}</div>
          </div>
        </div>
        <div style={{ height:1, background:'#2a3942', margin:'18px 0' }} />

        {error && <div style={{ background:'#3d1a1a', color:'#ff6b6b', borderRadius:8, padding:'10px 14px', marginBottom:16, fontSize:13 }}>{error}</div>}

        {existingTasks.length > 0 && (
          <div style={{ marginBottom:20 }}>
            <div style={{ color:'#00a884', fontSize:12, fontWeight:600, letterSpacing:0.4, marginBottom:8 }}>
              TASKS ADDED ({existingTasks.length})
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:6, maxHeight:180, overflowY:'auto' }}>
              {existingTasks.map((t, i) => (
                <div key={t.task_id} style={{ background:'#1a2530', borderRadius:8, padding:'10px 14px', display:'flex', alignItems:'flex-start', gap:10 }}>
                  <span style={{ background:'#2a3942', color:'#8696a0', fontSize:11, fontWeight:600, padding:'2px 8px', borderRadius:6, flexShrink:0 }}>{i + 1}</span>
                  <div style={{ minWidth:0 }}>
                    <div style={{ color:'#e9edef', fontSize:14, fontWeight:500 }}>{t.task_name}</div>
                    <div style={{ color:'#8696a0', fontSize:12, marginTop:2, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{t.task_description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <Field label="Task Name *">
            <input type="text" value={form.task_name} onChange={e => handle('task_name', e.target.value)}
              placeholder="e.g. Find a Message" style={inputStyle} />
          </Field>
          <Field label="Task Description / Instructions *">
            <textarea value={form.task_description} onChange={e => handle('task_description', e.target.value)}
              placeholder="What should the participant do? Be specific." rows={3}
              style={{ ...inputStyle, resize:'none' }} />
          </Field>
          <Field label="Hint (optional)">
            <input type="text" value={form.hint} onChange={e => handle('hint', e.target.value)}
              placeholder="Shown if participant clicks the Hint button" style={inputStyle} />
          </Field>
        </div>

        <button onClick={addTask} style={{
          marginTop:18, width:'100%', padding:'12px 0', background:'#2a3942', border:'1px solid #3d4f58',
          borderRadius:8, color:'#e9edef', fontSize:14, fontWeight:600, cursor:'pointer',
        }}>
          + Add Task
        </button>

        <button onClick={onDone} disabled={existingTasks.length === 0} style={{
          marginTop:10, width:'100%', padding:'13px 0',
          background: existingTasks.length === 0 ? '#1a2530' : '#00a884',
          border:'none', borderRadius:8,
          color: existingTasks.length === 0 ? '#4a5a63' : 'white',
          fontSize:15, fontWeight:600, cursor: existingTasks.length === 0 ? 'not-allowed' : 'pointer',
        }}>
          {existingTasks.length === 0 ? 'Add at least one task to continue' : `Start Session (${existingTasks.length} task${existingTasks.length === 1 ? '' : 's'}) →`}
        </button>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <div style={{ color:'#8696a0', fontSize:12, fontWeight:500, marginBottom:6, letterSpacing:0.4 }}>{label}</div>
      {children}
    </div>
  );
}

const inputStyle = {
  width:'100%', padding:'9px 12px', background:'#2a3942', border:'1px solid #3d4f58',
  borderRadius:8, color:'#e9edef', fontSize:14, outline:'none', fontFamily:'inherit',
};