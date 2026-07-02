import React, { useState } from 'react';

export default function ParticipantSetup({ onComplete }) {
  const [form, setForm] = useState({
    participant_id: '',
    age: '',
    age_group: 'older',
    scc_status: 'non_scc',
    scc_score: '',
    digital_literacy_score: '',
    smartphone_experience: 'moderate',
    notes: '',
  });
  const [error, setError] = useState('');

  const handle = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = () => {
    if (!form.participant_id.trim()) { setError('Participant ID is required'); return; }
    if (!form.age || isNaN(form.age)) { setError('Valid age is required'); return; }
    onComplete({ ...form, age: Number(form.age), scc_score: Number(form.scc_score) || 0, digital_literacy_score: Number(form.digital_literacy_score) || 0 });
  };

  return (
    <div style={{ height:'100vh', background:'#f0f2f5', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ background:'#ffffff', borderRadius:12, padding:'40px 48px', width:520, boxShadow:'0 8px 32px rgba(0,0,0,0.12)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:8 }}>
          <div style={{ width:44, height:44, borderRadius:12, background:'#00a884', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.557 4.126 1.532 5.86L.057 23.516a.75.75 0 00.927.927l5.656-1.475A11.943 11.943 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.96 0-3.8-.527-5.384-1.448l-.386-.228-3.997 1.042 1.07-3.878-.253-.4A9.953 9.953 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
          </div>
          <div>
            <div style={{ color:'#111b21', fontWeight:600, fontSize:18 }}>Cognitive Research App</div>
            <div style={{ color:'#667781', fontSize:13 }}>Participant Setup</div>
          </div>
        </div>
        <div style={{ height:1, background:'#e9edef', margin:'20px 0' }} />

        {error && <div style={{ background:'#fdecea', color:'#c0392b', borderRadius:8, padding:'10px 14px', marginBottom:16, fontSize:13 }}>{error}</div>}

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
          <Field label="Participant ID *" colSpan={2}>
            <input type="text" value={form.participant_id} onChange={e => handle('participant_id', e.target.value)}
              placeholder="e.g. P001" style={inputStyle} />
          </Field>
          <Field label="Age *">
            <input type="number" value={form.age} onChange={e => handle('age', e.target.value)}
              placeholder="e.g. 68" min="18" max="100" style={inputStyle} />
          </Field>
          <Field label="Age Group">
            <Select value={form.age_group} onChange={v => handle('age_group', v)} options={[
              { value:'younger', label:'Younger Adult (18–59)' },
              { value:'older',   label:'Older Adult (60+)' },
            ]} />
          </Field>
          <Field label="SCC Status">
            <Select value={form.scc_status} onChange={v => handle('scc_status', v)} options={[
              { value:'non_scc', label:'Non-SCC' },
              { value:'scc',     label:'SCC (Self-reported)' },
            ]} />
          </Field>
          <Field label="SCC Score (0–10)">
            <input type="number" value={form.scc_score} onChange={e => handle('scc_score', e.target.value)}
              placeholder="0" min="0" max="10" style={inputStyle} />
          </Field>
          <Field label="Digital Literacy Score">
            <input type="number" value={form.digital_literacy_score} onChange={e => handle('digital_literacy_score', e.target.value)}
              placeholder="0–100" min="0" max="100" style={inputStyle} />
          </Field>
          <Field label="Smartphone Experience">
            <Select value={form.smartphone_experience} onChange={v => handle('smartphone_experience', v)} options={[
              { value:'none',     label:'None' },
              { value:'minimal',  label:'Minimal' },
              { value:'moderate', label:'Moderate' },
              { value:'advanced', label:'Advanced' },
            ]} />
          </Field>
          <Field label="Notes" colSpan={2}>
            <textarea value={form.notes} onChange={e => handle('notes', e.target.value)}
              placeholder="Any relevant notes..." rows={2}
              style={{ ...inputStyle, resize:'none', height:'auto' }} />
          </Field>
        </div>

        <button onClick={submit} style={{
          marginTop:24, width:'100%', padding:'13px 0', background:'#00a884',
          border:'none', borderRadius:8, color:'white', fontSize:15, fontWeight:600,
          cursor:'pointer', letterSpacing:0.3,
        }}>
          Begin Research Session →
        </button>
      </div>
    </div>
  );
}

function Field({ label, children, colSpan }) {
  return (
    <div style={{ gridColumn: colSpan ? `span ${colSpan}` : 'span 1' }}>
      <div style={{ color:'#667781', fontSize:12, fontWeight:500, marginBottom:6, letterSpacing:0.4 }}>{label}</div>
      {children}
    </div>
  );
}

function Select({ value, onChange, options }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)} style={{ ...inputStyle, cursor:'pointer' }}>
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}

const inputStyle = {
  width:'100%', padding:'9px 12px', background:'#ffffff', border:'1px solid #d1d7db',
  borderRadius:8, color:'#111b21', fontSize:14, outline:'none', fontFamily:'inherit',
};