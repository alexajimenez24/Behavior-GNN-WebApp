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
      border: `2px solid ${contact.color}66`, display:'flex', alignItems:'center',
      justifyContent:'center', flexShrink:0, fontSize: size * 0.3, fontWeight:600, color:contact.color,
    }}>
      {contact.avatar}
    </div>
  );
}

function IconRail({ currentScreen, onNavigate, onLog, unreadCount }) {
  const [active, setActive] = useState('chats');

  const railBtnStyle = (key) => ({
    width:42, height:42, borderRadius:10, border:'none', cursor:'pointer',
    background: active === key ? '#dff5ef' : 'transparent',
    color: active === key ? '#00a884' : '#54656f',
    display:'flex', alignItems:'center', justifyContent:'center',
    position:'relative', transition:'background 0.15s, color 0.15s',
  });

  const hoverHandlers = (key) => ({
    onMouseEnter: e => { if (active !== key) e.currentTarget.style.background = '#f0f2f5'; },
    onMouseLeave: e => { if (active !== key) e.currentTarget.style.background = 'transparent'; },
  });

  return (
    <div style={{
      width:56, background:'#ffffff', borderRight:'1px solid #e9edef', display:'flex', flexDirection:'column',
      alignItems:'center', justifyContent:'space-between', padding:'16px 0', flexShrink:0, height:'100%',
    }}>
      <div style={{ display:'flex', flexDirection:'column', gap:6, alignItems:'center' }}>
        <button title="Chats" onClick={() => { setActive('chats'); onNavigate(SCREENS.CHAT_LIST); }}
          style={railBtnStyle('chats')} {...hoverHandlers('chats')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M4 4h16v12H7l-3 3V4z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/></svg>
          {unreadCount > 0 && (
            <span style={{
              position:'absolute', top:2, right:2, background:'#00a884', color:'#ffffff',
              fontSize:10, fontWeight:700, borderRadius:'50%', minWidth:16, height:16,
              display:'flex', alignItems:'center', justifyContent:'center', padding:'0 2px',
            }}>
              {unreadCount}
            </span>
          )}
        </button>

        <button title="Status" onClick={() => setActive('status')} style={railBtnStyle('status')} {...hoverHandlers('status')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" strokeDasharray="3 3"/><circle cx="12" cy="12" r="3" fill="currentColor"/></svg>
        </button>

        <button title="Channels" onClick={() => setActive('channels')} style={railBtnStyle('channels')} {...hoverHandlers('channels')}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round">
            <path d="M3 11v2a2 2 0 002 2h1l3 4V7L6 11H5a2 2 0 00-2 2z"/>
            <path d="M11 9l7-3v12l-7-3"/>
          </svg>
        </button>

        <button title="Communities" onClick={() => setActive('communities')} style={railBtnStyle('communities')} {...hoverHandlers('communities')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="9" cy="9" r="3.2"/>
            <circle cx="16" cy="10.5" r="2.4"/>
            <path d="M4 19c0-2.8 2.2-5 5-5s5 2.2 5 5" strokeLinecap="round"/>
            <path d="M14.5 14.3c1.9.4 3.5 2 3.5 4.2" strokeLinecap="round"/>
          </svg>
        </button>

        <button title="Meta AI" onClick={() => setActive('metaai')} style={railBtnStyle('metaai')} {...hoverHandlers('metaai')}>
          <div style={{
            width:26, height:26, borderRadius:'50%',
            background:'conic-gradient(from 180deg, #4f9dff, #b768ff, #ff6bd6, #4f9dff)',
            display:'flex', alignItems:'center', justifyContent:'center',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2z"/></svg>
          </div>
        </button>
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:10, alignItems:'center' }}>
        <button title="Multimedia" onClick={() => setActive('multimedia')} style={railBtnStyle('multimedia')} {...hoverHandlers('multimedia')}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="14" rx="2"/>
            <circle cx="8" cy="9" r="1.6" fill="currentColor" stroke="none"/>
            <path d="M3 15l5-4 4 3.5 3-2.5 6 5" strokeLinecap="round"/>
          </svg>
        </button>

        <div style={{
          width:32, height:32, borderRadius:'50%', background:'#6B8CFF33', border:'2px solid #6B8CFF66',
          display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:600, color:'#3D5BDB',
          marginTop:4,
        }}>
          ME
        </div>
      </div>
    </div>
  );
}

export default function Sidebar({ currentScreen, activeChat, onSelectChat, onNavigate, onLog, searchQuery, setSearchQuery }) {
  const [showMenu, setShowMenu] = useState(false);
  const [tab, setTab] = useState('all');
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
    if (tab === 'favourites') return false;
    if (tab === 'groups') return false;
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
    <div style={{ display:'flex', height:'100%', flexShrink:0 }}>
      <IconRail currentScreen={currentScreen} onNavigate={onNavigate} onLog={onLog} unreadCount={unreadCount} />

      <div style={{ width:412, background:'#ffffff', borderRight:'1px solid #e9edef', display:'flex', flexDirection:'column', height:'100%', flexShrink:0, overflow:'hidden' }}>
        <div style={{ padding:'12px 16px', background:'#ffffff', borderBottom:'1px solid #e9edef', display:'flex', alignItems:'center', justifyContent:'space-between', minHeight:60, flexShrink:0 }}>
          {isSearch || isNewChat ? (
            <div style={{ display:'flex', alignItems:'center', gap:12, flex:1 }}>
              <button onClick={() => { onNavigate(SCREENS.CHAT_LIST); setSearchQuery(''); }}
                style={{ background:'none', border:'none', color:'#54656f', cursor:'pointer', padding:'4px 8px 4px 0', fontSize:20, lineHeight:1 }}>
                ←
              </button>
              <span style={{ color:'#111b21', fontSize:16, fontWeight:600 }}>
                {isSearch ? 'Search' : 'New Chat'}
              </span>
            </div>
          ) : (
            <>
              <span style={{ color:'#00a884', fontSize:22, fontWeight:700 }}>WhatsApp</span>
              <div style={{ display:'flex', gap:4 }}>
                <IconBtn onClick={handleNewChatClick} title="New chat">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#54656f"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12zM7 9h10v2H7zm0-3h10v2H7zm0 6h7v2H7z"/></svg>
                </IconBtn>
                <div style={{ position:'relative' }}>
                  <IconBtn onClick={() => setShowMenu(!showMenu)} title="Menu">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#54656f"><circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/></svg>
                  </IconBtn>
                  {showMenu && (
                    <div style={{ position:'absolute', right:0, top:'100%', background:'#ffffff', borderRadius:6, boxShadow:'0 4px 18px rgba(0,0,0,0.18)', border:'1px solid #e9edef', zIndex:100, minWidth:200, overflow:'hidden' }}>
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
                          style={{ padding:'13px 20px', color:'#111b21', fontSize:14, cursor:'pointer' }}
                          onMouseEnter={e => e.currentTarget.style.background='#f5f6f6'}
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

        <div style={{ padding:'8px 12px', background:'#ffffff', flexShrink:0 }}>
          <div style={{ background:'#f0f2f5', borderRadius:8, display:'flex', alignItems:'center', gap:8, padding:'8px 12px' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#54656f" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
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
              style={{ background:'none', border:'none', outline:'none', color:'#111b21', fontSize:14, flex:1, fontFamily:'inherit' }}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} style={{ background:'none', border:'none', color:'#54656f', cursor:'pointer', fontSize:18 }}>×</button>
            )}
          </div>
        </div>

        {!isSearch && !isNewChat && (
          <div style={{ display:'flex', alignItems:'center', gap:8, padding:'2px 12px 10px', background:'#ffffff', flexShrink:0 }}>
            {[
              { key:'all',        label:'All' },
              { key:'unread',     label:`Unread${unreadCount > 0 ? ` ${unreadCount}` : ''}` },
              { key:'favourites', label:'Favourites' },
              { key:'groups',     label:'Groups' },
            ].map(t => (
              <button key={t.key} onClick={() => setTab(t.key)} style={{
                padding:'6px 14px', borderRadius:20, cursor:'pointer',
                background: tab === t.key ? '#00a884' : 'transparent',
                border: tab === t.key ? 'none' : '1px solid #d1d7db',
                color: tab === t.key ? '#ffffff' : '#54656f',
                fontSize:13, fontWeight:600, letterSpacing:0.2,
              }}>
                {t.label}
              </button>
            ))}
            <button title="Add filter" style={{
              width:28, height:28, borderRadius:'50%', border:'1px solid #d1d7db', background:'transparent',
              color:'#54656f', fontSize:16, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
              flexShrink:0, marginLeft:2,
            }}>
              +
            </button>
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
                  onMouseEnter={e => e.currentTarget.style.background='#f5f6f6'}
                  onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                  <Avatar contact={contact} />
                  <div>
                    <div style={{ color:'#111b21', fontSize:15, fontWeight:500 }}>{contact.name}</div>
                    <div style={{ color:'#667781', fontSize:13 }}>{contact.phone}</div>
                  </div>
                </div>
              ))}
          </div>
        )}

        {!isNewChat && (
          <div style={{ flex:1, overflowY:'auto' }}>
            {filteredChats.length === 0 && (
              <div style={{ textAlign:'center', color:'#667781', fontSize:14, padding:'40px 20px' }}>
                {tab === 'unread' && 'No unread chats'}
                {tab === 'favourites' && 'No favourite chats yet'}
                {tab === 'groups' && 'No group chats yet'}
                {tab === 'all' && 'No chats found'}
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
                    cursor:'pointer', background: isActive ? '#f0f2f5' : 'transparent',
                    transition:'background 0.1s', borderBottom:'1px solid #f0f2f5',
                  }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.background='#f5f6f6'; }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.background='transparent'; }}>
                  <Avatar contact={contact} />
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:3 }}>
                      <span style={{ color:'#111b21', fontSize:15, fontWeight: unread ? 600 : 500 }}>{contact.name}</span>
                      <span style={{ color: unread ? '#00a884' : '#667781', fontSize:12, flexShrink:0 }}>
                        {last ? formatTime(last.time) : ''}
                      </span>
                    </div>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                      <div style={{ color:'#667781', fontSize:13, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', flex:1 }}>
                        {last
                          ? (last.from === 'me'
                              ? <><span style={{ color:'#3b4a54' }}>You: </span>{last.text}</>
                              : last.text)
                          : 'No messages yet'}
                      </div>
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
    </div>
  );
}

function IconBtn({ children, onClick, title }) {
  const [hover, setHover] = useState(false);
  return (
    <button onClick={onClick} title={title}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        background: hover ? '#f0f2f5' : 'none', border:'none', borderRadius:'50%',
        width:38, height:38, display:'flex', alignItems:'center', justifyContent:'center',
        cursor:'pointer', transition:'background 0.15s',
      }}>
      {children}
    </button>
  );
}