import React from 'react';
import { CONTACTS } from '../data';
import { SCREENS, TARGETS } from '../data';

function Header({ title, onBack, onLog, currentScreen }) {
  return (
    <div style={{ background:'#f0f2f5', borderBottom:'1px solid #e9edef', padding:'0 16px', display:'flex', alignItems:'center', gap:12, minHeight:60, flexShrink:0 }}>
      <button onClick={() => { onLog({ screen_id:currentScreen, action_type:'back', target_id:TARGETS.BACK_BUTTON, target_label:'back', next_screen_id:SCREENS.CHAT_LIST }); onBack(); }}
        style={{ background:'none', border:'none', color:'#00a884', cursor:'pointer', fontSize:22, padding:'4px 8px 4px 0', lineHeight:1 }}>←</button>
      <span style={{ color:'#111b21', fontSize:16, fontWeight:600 }}>{title}</span>
    </div>
  );
}

export function ContactInfo({ chat, onNavigate, onLog }) {
  if (!chat) return null;
  const contact = CONTACTS.find(c => c.id === chat.contactId);
  const currentScreen = SCREENS.CONTACT_INFO;

  const logTap = (target_id, label) => onLog({ screen_id: currentScreen, action_type:'tap', target_id, target_label:label });

  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', background:'#f0f2f5', overflow:'hidden' }}>
      <Header title="Contact Info" onBack={() => onNavigate(SCREENS.CHAT_VIEW)} onLog={onLog} currentScreen={currentScreen} />
      <div style={{ flex:1, overflowY:'auto' }}>
        <div style={{ background:'#ffffff', padding:'32px 24px', textAlign:'center', marginBottom:8 }}>
          <div style={{ width:100, height:100, borderRadius:'50%', background:contact.color+'33', border:`3px solid ${contact.color}88`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:32, fontWeight:700, color:contact.color, margin:'0 auto 16px' }}>{contact.avatar}</div>
          <div style={{ color:'#111b21', fontSize:22, fontWeight:600 }}>{contact.name}</div>
          <div style={{ color:'#667781', fontSize:14, marginTop:4 }}>{contact.phone}</div>
        </div>

        <div style={{ background:'#ffffff', margin:'0 0 8px', padding:'8px 0' }}>
          {[
            { icon:'🔇', label:'Mute notifications', target:TARGETS.CONTACT_MUTE },
            { icon:'🚫', label:'Block contact', target:TARGETS.CONTACT_BLOCK },
          ].map(item => (
            <div key={item.label} onClick={() => logTap(item.target, item.label)}
              style={{ display:'flex', alignItems:'center', gap:16, padding:'14px 24px', cursor:'pointer', color:'#111b21', fontSize:15 }}
              onMouseEnter={e => e.currentTarget.style.background='#f5f6f6'}
              onMouseLeave={e => e.currentTarget.style.background='transparent'}>
              <span style={{ fontSize:20 }}>{item.icon}</span> {item.label}
            </div>
          ))}
        </div>

        <div style={{ background:'#ffffff', padding:'16px 24px' }}>
          <div onClick={() => logTap(TARGETS.CONTACT_MEDIA_TAB, 'media tab')}
            style={{ color:'#00a884', fontSize:14, fontWeight:600, cursor:'pointer' }}>Media, links, and docs ({chat.messages.length} messages)</div>
        </div>
      </div>
    </div>
  );
}

export function StarredMessages({ allChats, onNavigate, onLog }) {
  const starred = [];
  allChats.forEach(chat => {
    const contact = CONTACTS.find(c => c.id === chat.contactId);
    chat.messages.filter(m => m.starred).forEach(m => starred.push({ ...m, contactName: contact.name, chatId: chat.id }));
  });

  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', background:'#f0f2f5', overflow:'hidden' }}>
      <Header title="Starred Messages" onBack={() => onNavigate(SCREENS.CHAT_LIST)} onLog={onLog} currentScreen={SCREENS.STARRED} />
      <div style={{ flex:1, overflowY:'auto', padding:'12px 0' }}>
        {starred.length === 0 ? (
          <div style={{ textAlign:'center', color:'#667781', fontSize:14, padding:'60px 20px' }}>
            <div style={{ fontSize:48, marginBottom:16 }}>⭐</div>
            No starred messages yet.<br />
            <span style={{ fontSize:12, marginTop:8, display:'block' }}>Hover over a message and click ⋮ to star it.</span>
          </div>
        ) : starred.map(m => (
          <div key={m.id} style={{ background:'#ffffff', margin:'4px 12px', borderRadius:10, padding:'14px 16px', boxShadow:'0 1px 2px rgba(0,0,0,0.06)' }}>
            <div style={{ color:'#00a884', fontSize:12, fontWeight:600, marginBottom:6 }}>{m.contactName}</div>
            <div style={{ color:'#111b21', fontSize:14 }}>{m.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Settings({ onNavigate, onLog }) {
  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', background:'#f0f2f5', overflow:'hidden' }}>
      <Header title="Settings" onBack={() => onNavigate(SCREENS.CHAT_LIST)} onLog={onLog} currentScreen={SCREENS.SETTINGS} />
      <div style={{ flex:1, overflowY:'auto' }}>
        <div style={{ background:'#ffffff', margin:'8px 0', padding:'8px 0' }}>
          {['Account', 'Privacy', 'Security', 'Notifications', 'Storage and data', 'App language', 'Help', 'About'].map(item => (
            <div key={item} onClick={() => onLog({ screen_id:SCREENS.SETTINGS, action_type:'tap', target_id:`TGT_SETTING_${item.replace(/ /g,'_').toUpperCase()}`, target_label:item })}
              style={{ padding:'14px 24px', color:'#111b21', fontSize:15, cursor:'pointer', borderBottom:'1px solid #f0f2f5' }}
              onMouseEnter={e => e.currentTarget.style.background='#f5f6f6'}
              onMouseLeave={e => e.currentTarget.style.background='transparent'}>
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function EmptyState() {
  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background:'#f0f2f5' }}>
      <div style={{ opacity:0.5, marginBottom:24 }}>
        <svg width="120" height="120" viewBox="0 0 24 24" fill="#8ea1a8"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.557 4.126 1.532 5.86L.057 23.516a.75.75 0 00.927.927l5.656-1.475A11.943 11.943 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/></svg>
      </div>
      <div style={{ color:'#41525d', fontSize:22, fontWeight:300, marginBottom:8 }}>WhatsApp Web</div>
      <div style={{ color:'#667781', fontSize:14, textAlign:'center', maxWidth:380, lineHeight:1.6 }}>
        Select a conversation from the left to start messaging
      </div>
    </div>
  );
}