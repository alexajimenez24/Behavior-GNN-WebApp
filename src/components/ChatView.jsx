import React, { useState, useRef, useEffect } from 'react';
import { CONTACTS, CHATS } from '../data';
import { SCREENS, TARGETS } from '../data';

function formatTime(ts) {
  return new Date(ts).toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' });
}

function Avatar({ contact, size = 40 }) {
  return (
    <div style={{
      width:size, height:size, borderRadius:'50%', background: contact.color + '33',
      border:`2px solid ${contact.color}66`, display:'flex', alignItems:'center',
      justifyContent:'center', flexShrink:0, fontSize:size*0.3, fontWeight:600, color:contact.color,
    }}>
      {contact.avatar}
    </div>
  );
}

export default function ChatView({ chat, onNavigate, onLog, onSend, onForward, onStar, onViewMessage, taskState, updateTaskState }) {
  const [input, setInput] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [hoveredMsg, setHoveredMsg] = useState(null);
  const [showForward, setShowForward] = useState(null);
  const [showMsgMenu, setShowMsgMenu] = useState(null);
  const [messages, setMessages] = useState(chat.messages);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const contact = CONTACTS.find(c => c.id === chat.contactId);

  useEffect(() => {
    setMessages(chat.messages);
    messagesEndRef.current?.scrollIntoView({ behavior:'smooth' });
    onLog({ screen_id: SCREENS.CHAT_VIEW, action_type: 'screen_start', target_id: `TGT_CHAT_${chat.id}`, target_label: contact.name });
    updateTaskState && updateTaskState('viewedChats', chat.id);
  }, [chat.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior:'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMsg = { id: `MSG_${Date.now()}`, from:'me', text:input, time:Date.now(), replyTo: replyTo?.id, starred:false };
    setMessages(prev => [...prev, newMsg]);
    onLog({ screen_id: SCREENS.CHAT_VIEW, action_type: 'tap', target_id: TARGETS.SEND_BTN, target_label: 'send button' });
    onSend && onSend({ chatId: chat.id, message: newMsg });
    updateTaskState && updateTaskState('sentMessages', { chatId: chat.id, msg: newMsg });
    setInput('');
    setReplyTo(null);
  };

  const handleReply = (msg) => {
    onLog({ screen_id: SCREENS.CHAT_VIEW, action_type: 'tap', target_id: TARGETS.MSG_REPLY, target_label: 'reply to message' });
    setReplyTo(msg);
    setShowMsgMenu(null);
    inputRef.current?.focus();
  };

  const handleForwardInit = (msg) => {
    onLog({ screen_id: SCREENS.CHAT_VIEW, action_type: 'tap', target_id: TARGETS.MSG_FORWARD, target_label: 'forward message' });
    setShowForward(msg);
    setShowMsgMenu(null);
  };

  const handleForwardSend = (targetContact) => {
    onLog({ screen_id: SCREENS.CHAT_VIEW, action_type: 'tap', target_id: `${TARGETS.FORWARD_CONTACT}_${targetContact.id}`, target_label: targetContact.name });
    onLog({ screen_id: SCREENS.CHAT_VIEW, action_type: 'tap', target_id: TARGETS.FORWARD_SEND, target_label: 'send forwarded message' });
    onForward && onForward({ message: showForward, toContact: targetContact });
    updateTaskState && updateTaskState('forwardedMessages', { msg: showForward, to: targetContact.id });
    setShowForward(null);
  };

  const handleStar = (msg) => {
    onLog({ screen_id: SCREENS.CHAT_VIEW, action_type: 'tap', target_id: TARGETS.MSG_STAR, target_label: 'star message' });
    setMessages(prev => prev.map(m => m.id === msg.id ? {...m, starred:!m.starred} : m));
    onStar && onStar(msg);
    setShowMsgMenu(null);
  };

  const handleMsgClick = (msg) => {
    onLog({ screen_id: SCREENS.CHAT_VIEW, action_type: 'tap', target_id: `${TARGETS.MSG_ITEM}_${msg.id}`, target_label: msg.text.slice(0,30) });
    updateTaskState && updateTaskState('viewedMessages', msg.id);
    onViewMessage && onViewMessage(msg.id);
  };

  const handleScroll = (e) => {
    onLog({ screen_id: SCREENS.CHAT_VIEW, action_type: 'scroll', target_id: TARGETS.SCROLL_ACTION, target_label: 'message list scroll' });
  };

  const handleContactHeader = () => {
    onLog({ screen_id: SCREENS.CHAT_VIEW, action_type: 'tap', target_id: TARGETS.CONTACT_HEADER, target_label: contact.name, next_screen_id: SCREENS.CONTACT_INFO });
    onNavigate(SCREENS.CONTACT_INFO);
  };

  const handleBack = () => {
    onLog({ screen_id: SCREENS.CHAT_VIEW, action_type: 'back', target_id: TARGETS.BACK_BUTTON, target_label: 'back to chat list', next_screen_id: SCREENS.CHAT_LIST });
    onNavigate(SCREENS.CHAT_LIST);
  };

  const replyRef = messages.find(m => m.id === replyTo?.id);

  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', background:'#efeae2', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', inset:0, opacity:0.06, backgroundImage:`url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23111b21' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`, zIndex:0 }} />

      <div style={{ background:'#f0f2f5', padding:'0 16px', display:'flex', alignItems:'center', gap:12, minHeight:60, zIndex:10, borderBottom:'1px solid #e9edef' }}>
        <button onClick={handleBack} style={{ background:'none', border:'none', color:'#54656f', cursor:'pointer', fontSize:22, padding:'4px 8px 4px 0', lineHeight:1 }}>←</button>
        <div onClick={handleContactHeader} style={{ display:'flex', alignItems:'center', gap:12, cursor:'pointer', flex:1 }}>
          <Avatar contact={contact} />
          <div>
            <div style={{ color:'#111b21', fontSize:15, fontWeight:600 }}>{contact.name}</div>
            <div style={{ color:'#667781', fontSize:13 }}>online</div>
          </div>
        </div>
        <div style={{ display:'flex', gap:4 }}>
          <IconBtn title="Video call"><svg width="20" height="20" viewBox="0 0 24 24" fill="#54656f"><path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/></svg></IconBtn>
          <IconBtn title="Search in chat" onClick={() => onNavigate(SCREENS.SEARCH)}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#54656f" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg></IconBtn>
          <IconBtn title="More options"><svg width="20" height="20" viewBox="0 0 24 24" fill="#54656f"><circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/></svg></IconBtn>
        </div>
      </div>

      <div onScroll={handleScroll} style={{ flex:1, overflowY:'auto', padding:'12px 8%', zIndex:1, position:'relative' }}>
        <div style={{ display:'flex', flexDirection:'column', justifyContent:'flex-end', minHeight:'100%' }}>
          {messages.map((msg, i) => {
            const isMe = msg.from === 'me';
            const replyMsg = msg.replyTo ? messages.find(m => m.id === msg.replyTo) : null;
            const isHovered = hoveredMsg === msg.id;
            const menuOpen = showMsgMenu === msg.id;
            return (
              <div key={msg.id} style={{ display:'flex', justifyContent: isMe ? 'flex-end' : 'flex-start', marginBottom:4, position:'relative' }}
                onMouseEnter={() => setHoveredMsg(msg.id)}
                onMouseLeave={() => { setHoveredMsg(null); if (!menuOpen) setShowMsgMenu(null); }}>

                {isHovered && (
                  <div style={{ display:'flex', alignItems:'center', gap:4, margin: isMe ? '0 8px 0 0' : '0 0 0 8px', order: isMe ? -1 : 1 }}>
                    <MsgActionBtn title="Reply" onClick={() => handleReply(msg)}>↩</MsgActionBtn>
                    <MsgActionBtn title="More" onClick={() => setShowMsgMenu(menuOpen ? null : msg.id)}>⋮</MsgActionBtn>
                  </div>
                )}

                <div onClick={() => handleMsgClick(msg)} style={{ maxWidth:'65%', cursor:'default' }}>
                  {replyMsg && (
                    <div style={{ background: isMe ? '#c5f2bb' : '#ffffff', borderLeft:'4px solid #00a884', borderRadius:'4px 4px 0 0', padding:'6px 10px', fontSize:12, color:'#667781', marginBottom:0 }}>
                      <div style={{ color:'#00a884', fontWeight:600, marginBottom:2 }}>{replyMsg.from === 'me' ? 'You' : contact.name}</div>
                      {replyMsg.text.slice(0,60)}{replyMsg.text.length > 60 ? '...' : ''}
                    </div>
                  )}
                  <div style={{
                    background: isMe ? '#d9fdd3' : '#ffffff',
                    borderRadius: replyMsg ? (isMe ? '0 0 4px 12px' : '0 0 12px 4px') : (isMe ? '12px 4px 12px 12px' : '4px 12px 12px 12px'),
                    padding:'8px 12px 6px', boxShadow:'0 1px 2px rgba(0,0,0,0.1)',
                    border: msg.starred ? '1px solid #f0b42999' : 'none',
                  }}>
                    {msg.forwarded && <div style={{ color:'#667781', fontSize:11, marginBottom:3, display:'flex', alignItems:'center', gap:4 }}>↪ Forwarded</div>}
                    <span style={{ color:'#111b21', fontSize:14, lineHeight:1.5, wordBreak:'break-word' }}>{msg.text}</span>
                    <div style={{ display:'flex', justifyContent:'flex-end', alignItems:'center', gap:4, marginTop:2 }}>
                      {msg.starred && <span style={{ fontSize:10 }}>⭐</span>}
                      <span style={{ color:'#667781', fontSize:11 }}>{formatTime(msg.time)}</span>
                      {isMe && <span style={{ color:'#53bdeb', fontSize:14, lineHeight:1 }}>✓✓</span>}
                    </div>
                  </div>
                </div>

                {menuOpen && (
                  <div style={{ position:'absolute', [isMe ? 'right' : 'left']:0, top:'100%', background:'#ffffff', borderRadius:8, boxShadow:'0 4px 18px rgba(0,0,0,0.18)', border:'1px solid #e9edef', zIndex:50, minWidth:180, overflow:'hidden' }}>
                    {[
                      { label:'Reply', action:() => handleReply(msg) },
                      { label:'Forward', action:() => handleForwardInit(msg) },
                      { label: msg.starred ? 'Unstar' : 'Star message', action:() => handleStar(msg) },
                      { label:'Copy', action:() => { navigator.clipboard?.writeText(msg.text); setShowMsgMenu(null); } },
                    ].map(item => (
                      <div key={item.label} onClick={item.action}
                        style={{ padding:'12px 16px', color:'#111b21', fontSize:14, cursor:'pointer' }}
                        onMouseEnter={e => e.target.style.background='#f5f6f6'}
                        onMouseLeave={e => e.target.style.background='transparent'}>
                        {item.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {replyTo && (
        <div style={{ background:'#f0f2f5', borderTop:'1px solid #e9edef', padding:'8px 16px', display:'flex', alignItems:'center', gap:12, zIndex:10 }}>
          <div style={{ flex:1, borderLeft:'4px solid #00a884', paddingLeft:12 }}>
            <div style={{ color:'#00a884', fontSize:12, fontWeight:600, marginBottom:2 }}>{replyTo.from === 'me' ? 'You' : contact.name}</div>
            <div style={{ color:'#667781', fontSize:13 }}>{replyTo.text.slice(0,60)}</div>
          </div>
          <button onClick={() => { setReplyTo(null); onLog({ screen_id:SCREENS.CHAT_VIEW, action_type:'tap', target_id:TARGETS.REPLY_CANCEL, target_label:'cancel reply' }); }}
            style={{ background:'none', border:'none', color:'#667781', cursor:'pointer', fontSize:20, lineHeight:1 }}>×</button>
        </div>
      )}

      <div style={{ background:'#f0f2f5', padding:'8px 16px', display:'flex', alignItems:'center', gap:10, zIndex:10 }}>
        <IconBtn title="Emoji" onClick={() => onLog({ screen_id:SCREENS.CHAT_VIEW, action_type:'tap', target_id:TARGETS.EMOJI_BTN, target_label:'emoji' })}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="#54656f"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/></svg>
        </IconBtn>
        <IconBtn title="Attach" onClick={() => onLog({ screen_id:SCREENS.CHAT_VIEW, action_type:'tap', target_id:TARGETS.ATTACH_BTN, target_label:'attach' })}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="#54656f"><path d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z"/></svg>
        </IconBtn>
        <input
          ref={inputRef}
          value={input}
          onChange={e => { setInput(e.target.value); onLog({ screen_id:SCREENS.CHAT_VIEW, action_type:'text_input', target_id:TARGETS.MSG_INPUT, target_label:'message input' }); }}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
          placeholder="Type a message"
          style={{ flex:1, background:'#ffffff', border:'1px solid #e9edef', borderRadius:8, padding:'11px 16px', color:'#111b21', fontSize:14, outline:'none', fontFamily:'inherit' }}
        />
        <button onClick={handleSend} style={{ width:44, height:44, borderRadius:'50%', background:'#00a884', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          {input.trim() ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M12 14a3 3 0 003-3V5a3 3 0 10-6 0v6a3 3 0 003 3zm5-3a5 5 0 01-10 0H5a7 7 0 006 6.92V21h2v-3.08A7 7 0 0019 11h-2z"/></svg>
          )}
        </button>
      </div>

      {showForward && (
        <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.4)', zIndex:100, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <div style={{ background:'#ffffff', borderRadius:12, width:380, maxHeight:'70vh', overflow:'hidden', display:'flex', flexDirection:'column', boxShadow:'0 10px 40px rgba(0,0,0,0.25)' }}>
            <div style={{ padding:'16px 20px', borderBottom:'1px solid #e9edef', display:'flex', alignItems:'center', gap:12 }}>
              <button onClick={() => { setShowForward(null); onLog({ screen_id:SCREENS.CHAT_VIEW, action_type:'tap', target_id:TARGETS.FORWARD_CANCEL, target_label:'cancel forward' }); }}
                style={{ background:'none', border:'none', color:'#667781', cursor:'pointer', fontSize:20 }}>×</button>
              <div>
                <div style={{ color:'#111b21', fontSize:16, fontWeight:600 }}>Forward message</div>
                <div style={{ color:'#667781', fontSize:12 }}>Select a contact</div>
              </div>
            </div>
            <div style={{ padding:'10px 16px', borderBottom:'1px solid #e9edef', background:'#f0f2f5', fontSize:13, color:'#667781', fontStyle:'italic' }}>
              "{showForward.text.slice(0, 60)}{showForward.text.length > 60 ? '...' : ''}"
            </div>
            <div style={{ overflowY:'auto' }}>
              {CONTACTS.filter(c => c.id !== chat.contactId).map(c => (
                <div key={c.id} onClick={() => handleForwardSend(c)}
                  style={{ display:'flex', alignItems:'center', gap:14, padding:'12px 20px', cursor:'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.background='#f5f6f6'}
                  onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                  <div style={{ width:40, height:40, borderRadius:'50%', background:c.color+'33', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:600, color:c.color }}>{c.avatar}</div>
                  <span style={{ color:'#111b21', fontSize:15 }}>{c.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function IconBtn({ children, onClick, title }) {
  const [h, setH] = useState(false);
  return (
    <button onClick={onClick} title={title} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ background: h ? '#e9edef' : 'none', border:'none', borderRadius:'50%', width:40, height:40, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', flexShrink:0 }}>
      {children}
    </button>
  );
}

function MsgActionBtn({ children, onClick, title }) {
  return (
    <button onClick={onClick} title={title}
      style={{ background:'#ffffff', border:'1px solid #e9edef', borderRadius:'50%', width:30, height:30, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'#54656f', fontSize:16, boxShadow:'0 2px 6px rgba(0,0,0,0.12)' }}>
      {children}
    </button>
  );
}