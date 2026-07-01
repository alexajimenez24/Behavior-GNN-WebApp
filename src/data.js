export const SCREENS = {
  PARTICIPANT_SETUP: 'SCR_SETUP',
  TASK_BRIEFING:     'SCR_TASK_BRIEF',
  CHAT_LIST:         'SCR_CHAT_LIST',
  CHAT_VIEW:         'SCR_CHAT_VIEW',
  CONTACT_INFO:      'SCR_CONTACT_INFO',
  NEW_CHAT:          'SCR_NEW_CHAT',
  SEARCH:            'SCR_SEARCH',
  STARRED:           'SCR_STARRED',
  SETTINGS:          'SCR_SETTINGS',
  TASK_COMPLETE:     'SCR_TASK_COMPLETE',
  SESSION_COMPLETE:  'SCR_SESSION_COMPLETE',
};

export const TARGETS = {
 
  NAV_SEARCH_ICON:     'TGT_NAV_SEARCH',
  NAV_NEW_CHAT:        'TGT_NAV_NEWCHAT',
  NAV_MENU:            'TGT_NAV_MENU',
  NAV_STARRED:         'TGT_NAV_STARRED',
  NAV_SETTINGS:        'TGT_NAV_SETTINGS',

  CHAT_ITEM:           'TGT_CHAT_ITEM',
  SEARCH_INPUT:        'TGT_SEARCH_INPUT',
  SEARCH_RESULT:       'TGT_SEARCH_RESULT',

  BACK_BUTTON:         'TGT_BACK_BTN',
  CONTACT_HEADER:      'TGT_CONTACT_HEADER',
  MSG_REPLY:           'TGT_MSG_REPLY',
  MSG_FORWARD:         'TGT_MSG_FORWARD',
  MSG_STAR:            'TGT_MSG_STAR',
  MSG_ITEM:            'TGT_MSG_ITEM',
  REPLY_CANCEL:        'TGT_REPLY_CANCEL',
  SEND_BTN:            'TGT_SEND_BTN',
  ATTACH_BTN:          'TGT_ATTACH_BTN',
  EMOJI_BTN:           'TGT_EMOJI_BTN',
  MSG_INPUT:           'TGT_MSG_INPUT',
  SCROLL_ACTION:       'TGT_SCROLL',

  CONTACT_MUTE:        'TGT_CONTACT_MUTE',
  CONTACT_BLOCK:       'TGT_CONTACT_BLOCK',
  CONTACT_MEDIA_TAB:   'TGT_CONTACT_MEDIA_TAB',

  FORWARD_CONTACT:     'TGT_FORWARD_CONTACT',
  FORWARD_SEND:        'TGT_FORWARD_SEND',
  FORWARD_CANCEL:      'TGT_FORWARD_CANCEL',

  NEW_CHAT_CONTACT:    'TGT_NEWCHAT_CONTACT',
  NEW_CHAT_SEARCH:     'TGT_NEWCHAT_SEARCH',

  HELP_BTN:            'TGT_HELP_BTN',
  TASK_DONE_BTN:       'TGT_TASK_DONE',
  NEXT_TASK_BTN:       'TGT_NEXT_TASK',
};


export const CONTACTS = [
  { id: 'C01', name: 'Alice Johnson',   avatar: 'AJ', color: '#6B8CFF', phone: '+1 312 555 0101' },
  { id: 'C02', name: 'Bob Martinez',    avatar: 'BM', color: '#FF8C69', phone: '+1 312 555 0102' },
  { id: 'C03', name: 'Carol Williams',  avatar: 'CW', color: '#69FFB8', phone: '+1 312 555 0103' },
  { id: 'C04', name: 'David Lee',       avatar: 'DL', color: '#FFD369', phone: '+1 312 555 0104' },
  { id: 'C05', name: 'Emma Davis',      avatar: 'ED', color: '#FF69E1', phone: '+1 312 555 0105' },
  { id: 'C06', name: 'Frank Chen',      avatar: 'FC', color: '#69E1FF', phone: '+1 312 555 0106' },
  { id: 'C07', name: 'Grace Kim',       avatar: 'GK', color: '#B869FF', phone: '+1 312 555 0107' },
  { id: 'C08', name: 'Henry Brown',     avatar: 'HB', color: '#FF6969', phone: '+1 312 555 0108' },
];

const now = Date.now();
const m = (mins) => now - mins * 60000;

export const CHATS = [
  {
    id: 'CH01', contactId: 'C01',
    messages: [
      { id: 'MSG001', from: 'C01', text: 'Hey! Are you coming to the meeting tomorrow?', time: m(120), starred: false },
      { id: 'MSG002', from: 'me',  text: 'Yes, I will be there at 10am', time: m(118), starred: false },
      { id: 'MSG003', from: 'C01', text: 'Great! Do not forget to bring the report', time: m(115), starred: false },
      { id: 'MSG004', from: 'C01', text: 'Also, can you forward me that budget document?', time: m(60), starred: false },
      { id: 'MSG005', from: 'me',  text: 'Sure, I will send it over shortly', time: m(58), starred: false },
      { id: 'MSG006', from: 'C01', text: 'Thanks a lot! See you tomorrow 👍', time: m(30), starred: false },
    ]
  },
  {
    id: 'CH02', contactId: 'C02',
    messages: [
      { id: 'MSG007', from: 'C02', text: 'Did you see the game last night?', time: m(200), starred: false },
      { id: 'MSG008', from: 'me',  text: 'No, I missed it. What happened?', time: m(195), starred: false },
      { id: 'MSG009', from: 'C02', text: 'It was incredible! Last minute goal!', time: m(190), starred: false },
      { id: 'MSG010', from: 'C02', text: 'I recorded it, want me to send you the link?', time: m(45), starred: false },
      { id: 'MSG011', from: 'me',  text: 'Yes please!', time: m(40), starred: false },
    ]
  },
  {
    id: 'CH03', contactId: 'C03',
    messages: [
      { id: 'MSG012', from: 'C03', text: 'Hi! Happy birthday! 🎂🎉', time: m(300), starred: false },
      { id: 'MSG013', from: 'me',  text: 'Thank you so much Carol!', time: m(290), starred: false },
      { id: 'MSG014', from: 'C03', text: 'Are you doing anything special today?', time: m(285), starred: false },
      { id: 'MSG015', from: 'C03', text: 'We should go for dinner!', time: m(280), starred: false },
      { id: 'MSG016', from: 'me',  text: 'That sounds wonderful!', time: m(275), starred: false },
    ]
  },
  {
    id: 'CH04', contactId: 'C04',
    messages: [
      { id: 'MSG017', from: 'C04', text: 'Can you review the proposal I sent?', time: m(400), starred: false },
      { id: 'MSG018', from: 'me',  text: 'Just finished reading it. Looks good overall', time: m(390), starred: false },
      { id: 'MSG019', from: 'C04', text: 'Any suggestions for improvement?', time: m(385), starred: false },
      { id: 'MSG020', from: 'C04', text: 'The deadline is end of this week', time: m(380), starred: false },
    ]
  },
  {
    id: 'CH05', contactId: 'C05',
    messages: [
      { id: 'MSG021', from: 'C05', text: 'The package arrived! Thank you!', time: m(500), starred: false },
      { id: 'MSG022', from: 'me',  text: 'So glad it got there safely!', time: m(495), starred: false },
      { id: 'MSG023', from: 'C05', text: 'I love it, exactly what I wanted', time: m(490), starred: false },
    ]
  },
  {
    id: 'CH06', contactId: 'C06',
    messages: [
      { id: 'MSG024', from: 'C06', text: 'Quick question about the project timeline', time: m(600), starred: false },
      { id: 'MSG025', from: 'me',  text: 'Sure, what do you need to know?', time: m(595), starred: false },
      { id: 'MSG026', from: 'C06', text: 'When is the Phase 2 delivery due?', time: m(590), starred: false },
      { id: 'MSG027', from: 'C06', text: 'We need to update the stakeholders', time: m(585), starred: false },
    ]
  },
  {
    id: 'CH07', contactId: 'C07',
    messages: [
      { id: 'MSG028', from: 'C07', text: 'Are you free this weekend?', time: m(700), starred: false },
      { id: 'MSG029', from: 'me',  text: 'Saturday afternoon should work!', time: m(695), starred: false },
      { id: 'MSG030', from: 'C07', text: 'Perfect! Let us go to the art exhibit', time: m(690), starred: false },
    ]
  },
  {
    id: 'CH08', contactId: 'C08',
    messages: [
      { id: 'MSG031', from: 'C08', text: 'Remember to submit your timesheet', time: m(800), starred: false },
      { id: 'MSG032', from: 'me',  text: 'Thanks for the reminder, doing it now', time: m(795), starred: false },
      { id: 'MSG033', from: 'C08', text: 'Great, HR needs it by Friday', time: m(790), starred: false },
    ]
  },
];


export const TASKS = [];