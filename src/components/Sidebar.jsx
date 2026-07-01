import React, { useState } from 'react';
import { CONTACTS, CHATS } from '../data';
import { SCREENS, TARGETS } from '../data';

function formatTime(ts) {
  const d = new Date(ts);
  const now = new Date();
  if (d.toDateString() === now.toDateString()) {
    return d.toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' });
  }
  return d.toLocaleDateString([], { weekday:'short' });
}

function Avatar({ contact, size = 48 }) {
  return (
    <div style={{
      width:size, height:size, borderRadius:'50%', background: contact.color + '33',
      border: `2px solid ${contact.color}55`, display:'flex', alignItems:'center',
      justifyContent:'center', flexShrink:0, fontSize: size * 0.3, fontWeight:600, color:contact.color,
    }}>
      {contact.avatar}
    </div>
  );
}

export default function Sidebar({ currentScreen, activeChat, onSelectChat, onNavigate, onLog, searchQuery, setSearchQuery }) {
  const [showMenu, setShowMenu] = useState(false);
  const [tab, setTab] = useState('all');
  // Track which chat IDs have been opened this session
  const [readChats, setReadChats] = useState(new Set());

  const isSearch = currentScreen === SCREENS.SEARCH;
  const isNewChat = currentScreen === SCREENS.NEW_CHAT;

  const getContact = (contactId) => CONTACTS.find(c => c.id === contactId);
  const getLastMsg = (chat) => chat.messages[chat.messages.length - 1];

  const isUnread = (chat) => !readChats.has(chat.id);

  const filteredChats = CHATS.filter(chat => {
    const contact = getContact(chat.contactId);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!contact.name.toLowerCase().includes(q) &&
          !chat.messages.some(m => m.text.toLowerCase().includes(q))) return false;
    }
    if (tab === 'unread') return isUnread(chat);
    return true;
  });

  const handleSearchClick = () => {
    onLog({ screen_id: SCREENS.CHAT_LIST, action_type: 'tap', target_id: TARGETS.NAV_SEARCH_ICON, target_label: 'search icon', next_screen_id: SCREENS.SEARCH });
    onNavigate(SCREENS.SEARCH);
  };

  const handleNewChatClick = () => {
    onLog({ screen_id: SCREENS.CHAT_LIST, action_type: 'tap', target_id: TARGETS.NAV_NEW_CHAT, target_label: 'new chat', next_screen_id: SCREENS.NEW_CHAT });
    onNavigate(SCREENS.NEW_CHAT);
  };

  const handleChatSelect = (chat) => {
    // Mark as read when opened
    setReadChats(prev => new Set([...prev, chat.id]));
    onLog({ screen_id: currentScreen, action_type: 'tap', target_id: `${TARGETS.CHAT_ITEM}_${chat.id}`, target_label: getContact(chat.contactId).name, next_screen_id: SCREENS.CHAT_VIEW });
    onSelectChat(chat);
  };

  const handleContactSelect = (contact) => {
    onLog({ screen_id: SCREENS.NEW_CHAT, action_type: 'tap', target_id: `${TARGETS.NEW_CHAT_CONTACT}_${contact.id}`, target_label: contact.name, next_screen_id: SCREENS.CHAT_VIEW });
    const existingChat = CHATS.find(c => c.contactId === contact.id);
    if (existingChat) setReadChats(prev => new Set([...prev, existingChat.id]));
    onSelectChat(existingChat || { id: `CH_NEW_${contact.id}`, contactId: contact.id, messages: [] }, true);
  };

  const unreadCount = CHATS.filter(c => isUnread(c)).length;

  return (
    <div style={{ width:412, background:'#111b21', borderRight:'1px solid #2a3942', display:'flex', flexDirection:'column', height:'100%', flexShrink:0, overflow:'hidden' }}>
      {/* Header */}
      <div style={{ padding:'12px 16px', background:'#202c33', display:'flex', alignItems:'center', justifyContent:'space-between', minHeight:60, flexShrink:0 }}>
        {isSearch || isNewChat ? (
          <div style={{ display:'flex', alignItems:'center', gap:12, flex:1 }}>
            <button onClick={() => { onNavigate(SCREENS.CHAT_LIST); setSearchQuery(''); }}
              style={{ background:'none', border:'none', color:'#aebac1', cursor:'pointer', padding:'4px 8px 4px 0', fontSize:20, lineHeight:1 }}>
              ←
            </button>
            <span style={{ color:'#e9edef', fontSize:16, fontWeight:600 }}>
              {isSearch ? 'Search' : 'New Chat'}
            </span>
          </div>
        ) : (
          <>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ width:40, height:40, borderRadius:'50%', background:'#2a3942', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#aebac1"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>
              </div>
              <span style={{ color:'#e9edef', fontSize:17, fontWeight:600 }}>WhatsApp</span>
            </div>
            <div style={{ display:'flex', gap:4 }}>
              <IconBtn onClick={handleSearchClick} title="Search">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#aebac1" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              </IconBtn>
              <IconBtn onClick={handleNewChatClick} title="New chat">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#aebac1"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12zM7 9h10v2H7zm0-3h10v2H7zm0 6h7v2H7z"/></svg>
              </IconBtn>
              <div style={{ position:'relative' }}>
                <IconBtn onClick={() => setShowMenu(!showMenu)} title="Menu">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#aebac1"><circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/></svg>
                </IconBtn>
                {showMenu && (
                  <div style={{ position:'absolute', right:0, top:'100%', background:'#233138', borderRadius:6, boxShadow:'0 8px 24px rgba(0,0,0,0.5)', zIndex:100, minWidth:200, overflow:'hidden' }}>
                    {[
                      { label:'New group',         id: TARGETS.NAV_NEW_CHAT },
                      { label:'Starred messages',  id: TARGETS.NAV_STARRED,  screen: SCREENS.STARRED },
                      { label:'Settings',          id: TARGETS.NAV_SETTINGS, screen: SCREENS.SETTINGS },
                    ].map(item => (
                      <div key={item.label}
                        onClick={() => {
                          setShowMenu(false);
                          if (item.screen) {
                            onLog({ screen_id: SCREENS.CHAT_LIST, action_type: 'tap', target_id: item.id, target_label: item.label, next_screen_id: item.screen });
                            onNavigate(item.screen);
                          }
                        }}
                        style={{ padding:'13px 20px', color:'#e9edef', fontSize:14, cursor:'pointer' }}
                        onMouseEnter={e => e.currentTarget.style.background='#2a3942'}
                        onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                        {item.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      <div style={{ padding:'8px 12px', background:'#111b21', flexShrink:0 }}>
        <div style={{ background:'#202c33', borderRadius:8, display:'flex', alignItems:'center', gap:8, padding:'8px 12px' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8696a0" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input
            value={searchQuery}
            onChange={e => {
              setSearchQuery(e.target.value);
              onLog({ screen_id: currentScreen, action_type: 'text_input', target_id: TARGETS.SEARCH_INPUT, target_label: 'search field' });
            }}
            onFocus={() => {
              if (currentScreen !== SCREENS.SEARCH && currentScreen !== SCREENS.NEW_CHAT) handleSearchClick();
            }}
            placeholder={isNewChat ? 'Search contacts' : 'Search or start new chat'}
            style={{ background:'none', border:'none', outline:'none', color:'#e9edef', fontSize:14, flex:1, fontFamily:'inherit' }}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} style={{ background:'none', border:'none', color:'#8696a0', cursor:'pointer', fontSize:18 }}>×</button>
          )}
        </div>
      </div>

      {!isSearch && !isNewChat && (
        <div style={{ display:'flex', borderBottom:'1px solid #2a3942', background:'#111b21', flexShrink:0 }}>
          {[
            { key:'all',    label:'ALL' },
            { key:'unread', label:`UNREAD${unreadCount > 0 ? ` (${unreadCount})` : ''}` },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              flex:1, padding:'10px 0', background:'none', border:'none',
              color: tab === t.key ? '#00a884' : '#8696a0',
              fontSize:13, fontWeight:600, cursor:'pointer',
              borderBottom: tab === t.key ? '2px solid #00a884' : '2px solid transparent',
              letterSpacing:0.5,
            }}>
              {t.label}
            </button>
          ))}
        </div>
      )}

      {isNewChat && (
        <div style={{ flex:1, overflowY:'auto' }}>
          <div style={{ padding:'6px 16px 4px', color:'#00a884', fontSize:13, fontWeight:600 }}>CONTACTS ON WHATSAPP</div>
          {CONTACTS
            .filter(c => !searchQuery || c.name.toLowerCase().includes(searchQuery.toLowerCase()))
            .map(contact => (
              <div key={contact.id} onClick={() => handleContactSelect(contact)}
                style={{ display:'flex', alignItems:'center', gap:14, padding:'12px 16px', cursor:'pointer' }}
                onMouseEnter={e => e.currentTarget.style.background='#202c33'}
                onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                <Avatar contact={contact} />
                <div>
                  <div style={{ color:'#e9edef', fontSize:15, fontWeight:500 }}>{contact.name}</div>
                  <div style={{ color:'#8696a0', fontSize:13 }}>{contact.phone}</div>
                </div>
              </div>
            ))}
        </div>
      )}

      {!isNewChat && (
        <div style={{ flex:1, overflowY:'auto' }}>
          {filteredChats.length === 0 && (
            <div style={{ textAlign:'center', color:'#8696a0', fontSize:14, padding:'40px 20px' }}>
              {tab === 'unread' ? 'No unread chats' : 'No chats found'}
            </div>
          )}
          {filteredChats.map(chat => {
            const contact = getContact(chat.contactId);
            const last = getLastMsg(chat);
            const isActive = activeChat?.id === chat.id;
            const unread = isUnread(chat);
            return (
              <div key={chat.id} onClick={() => handleChatSelect(chat)}
                style={{
                  display:'flex', alignItems:'center', gap:14, padding:'12px 16px',
                  cursor:'pointer', background: isActive ? '#2a3942' : 'transparent',
                  transition:'background 0.1s', borderBottom:'1px solid #1a2530',
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background='#202c33'; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background='transparent'; }}>
                <Avatar contact={contact} />
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:3 }}>
                    <span style={{ color:'#e9edef', fontSize:15, fontWeight: unread ? 600 : 500 }}>{contact.name}</span>
                    <span style={{ color: unread ? '#00a884' : '#8696a0', fontSize:12, flexShrink:0 }}>
                      {last ? formatTime(last.time) : ''}
                    </span>
                  </div>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <div style={{ color:'#8696a0', fontSize:13, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', flex:1 }}>
                      {last
                        ? (last.from === 'me'
                            ? <><span style={{ color:'#aebac1' }}>You: </span>{last.text}</>
                            : last.text)
                        : 'No messages yet'}
                    </div>
                    {/* Unread indicator dot */}
                    {unread && (
                      <div style={{ width:9, height:9, borderRadius:'50%', background:'#00a884', flexShrink:0, marginLeft:8 }} />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function IconBtn({ children, onClick, title }) {
  const [hover, setHover] = useState(false);
  return (
    <button onClick={onClick} title={title}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        background: hover ? '#2a3942' : 'none', border:'none', borderRadius:'50%',
        width:38, height:38, display:'flex', alignItems:'center', justifyContent:'center',
        cursor:'pointer', transition:'background 0.15s',
      }}>
      {children}
    </button>
  );
}