import React, { useState, useCallback, useRef, useEffect } from 'react';
import { SCREENS, TASKS as DEFAULT_TASKS, CHATS, getChatFavKey } from './data';
import { useLogger } from './useLogger';
import ParticipantSetup from './components/ParticipantSetup';
import TaskBuilder from './components/TaskBuilder';
import Sidebar from './components/Sidebar';
import ChatView from './components/ChatView';
import TaskBar from './components/TaskBar';
import { TaskBriefing, TaskComplete, SessionComplete } from './components/TaskScreens';
import { ContactInfo, ChatSearchPanel, StarredMessages, Settings, EmptyState } from './components/SecondaryScreens';

export default function App() {

  const [participant, setParticipant] = useState(null);

  const [tasks, setTasks] = useState(DEFAULT_TASKS);
  const [setupDone, setSetupDone] = useState(DEFAULT_TASKS.length > 0);

  const [taskIndex, setTaskIndex] = useState(0);
  const [taskPhase, setTaskPhase] = useState('briefing'); 
  const [taskStartTime, setTaskStartTime] = useState(null);
  const [lastTrial, setLastTrial] = useState(null);
  const [lastSuccess, setLastSuccess] = useState(false);

  const [currentScreen, setCurrentScreen] = useState(SCREENS.CHAT_LIST);
  const [activeChat, setActiveChat] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightMessageId, setHighlightMessageId] = useState(null);

  const freshChats = () => CHATS.map(c => ({ ...c, messages: [...c.messages.map(m => ({ ...m }))] }));
  const [chats, setChats] = useState(freshChats);

  const [contactPanelOpen, setContactPanelOpen] = useState(false);
  const [chatSearchOpen, setChatSearchOpen] = useState(false);
  const [mutedContacts, setMutedContacts] = useState(new Set());
  const [blockedContacts, setBlockedContacts] = useState(new Set());
  const [favoriteContacts, setFavoriteContacts] = useState(new Set());

  const logger = useLogger(participant);
  const {
    logEvent, startTrial, endTrial, markHelpUsed,
    exportToExcel, autoExportOnSessionEnd,
    sendToGoogleSheets, autoSendOnSessionEnd,
    sheetsStatus, sheetsError,
    taskState, updateTaskState, taskTrials,
    resetSession,
  } = logger;

  const currentTask = tasks[taskIndex];
  const isLastTask = taskIndex === tasks.length - 1;

  const handleParticipantComplete = (p) => {
    setParticipant(p);
    setTaskPhase('briefing');
  };

  const handleAddTask = (task) => {
    setTasks(prev => [...prev, task]);
  };

  const handleSetupDone = () => {
    setSetupDone(true);
  };

  const handleTaskStart = () => {
    startTrial(currentTask, taskIndex);
    setTaskStartTime(Date.now());
    setTaskPhase('active');
    logEvent({
      screen_id:    SCREENS.TASK_BRIEFING,
      action_type:  'screen_start',
      target_id:    currentTask.task_id,
      target_label: currentTask.task_name,
    });
  };

  const handleTaskComplete = (success) => {
    const trial = endTrial(success, logger.currentTrial?.help_used || false);
    setLastTrial(trial);
    setLastSuccess(success);
    setTaskPhase('complete');
  };

  const handleNextTask = () => {
    if (isLastTask) {
      setTaskPhase('session_done');
    } else {
      setTaskIndex(i => i + 1);
      setTaskPhase('briefing');
      setCurrentScreen(SCREENS.CHAT_LIST);
      setActiveChat(null);
    }
  };

  const handleExport = () => {
    exportToExcel();
  };

  const handleRestart = () => {
    resetSession();                          
    setParticipant(null);
    setTasks(DEFAULT_TASKS);
    setSetupDone(DEFAULT_TASKS.length > 0);
    setTaskIndex(0);
    setTaskPhase('briefing');
    setCurrentScreen(SCREENS.CHAT_LIST);
    setActiveChat(null);
    setSearchQuery('');
    setHighlightMessageId(null);
    setChats(freshChats());                 
    setLastTrial(null);
    setLastSuccess(false);
    setTaskStartTime(null);
    setContactPanelOpen(false);
    setChatSearchOpen(false);
    setMutedContacts(new Set());
    setBlockedContacts(new Set());
    setFavoriteContacts(new Set());
  };

 
  useEffect(() => {
    if (taskPhase === 'session_done') {
      autoSendOnSessionEnd();
      autoExportOnSessionEnd();
    }
  }, [taskPhase, autoSendOnSessionEnd, autoExportOnSessionEnd]);


  const handleNavigate = useCallback((screen) => {
    setCurrentScreen(screen);
    if (screen === SCREENS.CHAT_LIST) setActiveChat(null);
    setContactPanelOpen(false);
    setChatSearchOpen(false);
  }, []);

  const handleSelectChat = useCallback((chat, isNew = false, highlightMsgId = null) => {
    const live = chats.find(c => c.id === chat.id) || chat;
    setActiveChat(live);
    setCurrentScreen(SCREENS.CHAT_VIEW);
    setContactPanelOpen(false);
    setChatSearchOpen(false);
    setHighlightMessageId(highlightMsgId);
    if (isNew) updateTaskState('newChatsStarted', chat.contactId || chat.id);
  }, [chats, updateTaskState]);

  const handleSend = useCallback(({ chatId, message }) => {
    setChats(prev => prev.map(c =>
      c.id === chatId ? { ...c, messages: [...c.messages, message] } : c
    ));
    setActiveChat(prev =>
      prev && prev.id === chatId ? { ...prev, messages: [...prev.messages, message] } : prev
    );
  }, []);

  const handleForward = useCallback(({ message, toContact }) => {
    const fwd = { ...message, id: `MSG_FWD_${Date.now()}`, from: 'me', time: Date.now(), forwarded: true };
    setChats(prev => prev.map(c =>
      c.contactId === toContact.id ? { ...c, messages: [...c.messages, fwd] } : c
    ));
  }, []);

  const handleStar = useCallback((msg) => {
    setChats(prev => prev.map(c => ({
      ...c,
      messages: c.messages.map(m => m.id === msg.id ? { ...m, starred: !m.starred } : m),
    })));
  }, []);

  const handleCreateGroup = useCallback((memberIds, groupName) => {
    const newGroup = {
      id: `CHG_${Date.now()}`,
      isGroup: true,
      groupName,
      groupAvatar: '👥',
      members: memberIds,
      messages: [],
    };
    setChats(prev => [newGroup, ...prev]);
    return newGroup;
  }, []);

  const handleOpenContactPanel = useCallback(() => {
    setChatSearchOpen(false);
    setContactPanelOpen(true);
  }, []);
  const handleCloseContactPanel = useCallback(() => setContactPanelOpen(false), []);


  const handleOpenChatSearch = useCallback(() => {
    setContactPanelOpen(false);
    setChatSearchOpen(true);
  }, []);
  const handleCloseChatSearch = useCallback(() => setChatSearchOpen(false), []);

  const toggleInSet = (setter) => (id) => {
    setter(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };
  const handleToggleMute = toggleInSet(setMutedContacts);
  const handleToggleBlock = toggleInSet(setBlockedContacts);
  const handleToggleFavorite = toggleInSet(setFavoriteContacts);

  const handleClearChat = useCallback((chatId) => {
    setChats(prev => prev.map(c => c.id === chatId ? { ...c, messages: [] } : c));
    setActiveChat(prev => prev && prev.id === chatId ? { ...prev, messages: [] } : prev);
  }, []);

  const handleDeleteChat = useCallback((chatId) => {
    setChats(prev => prev.filter(c => c.id !== chatId));
    setActiveChat(prev => prev && prev.id === chatId ? null : prev);
    setCurrentScreen(SCREENS.CHAT_LIST);
    setContactPanelOpen(false);
  }, []);

  if (!participant) {
    return <ParticipantSetup onComplete={handleParticipantComplete} />;
  }

  if (!setupDone) {
    return (
      <TaskBuilder
        existingTasks={tasks}
        onAddTask={handleAddTask}
        onDone={handleSetupDone}
        participant={participant}
      />
    );
  }

  if (taskPhase === 'session_done') {
    return (
      <SessionComplete
        trials={taskTrials}
        participant={participant}
        onExport={handleExport}
        onRestart={handleRestart}
        sheetsStatus={sheetsStatus}
        sheetsError={sheetsError}
        onRetrySheets={sendToGoogleSheets}
      />
    );
  }

  if (!currentTask) {
    return (
      <TaskBuilder
        existingTasks={tasks}
        onAddTask={handleAddTask}
        onDone={handleSetupDone}
        participant={participant}
      />
    );
  }

  const liveActiveChat = activeChat ? chats.find(c => c.id === activeChat.id) || activeChat : null;
  const activeFavKey = getChatFavKey(liveActiveChat);

  return (
    <div style={{ height:'100vh', display:'flex', flexDirection:'column', background:'#f0f2f5', overflow:'hidden' }}>
      {taskPhase === 'active' && (
        <TaskBar
          task={currentTask}
          taskIndex={taskIndex}
          totalTasks={tasks.length}
          onHelp={markHelpUsed}
          onComplete={handleTaskComplete}
          startTime={taskStartTime}
        />
      )}

      <div style={{ display:'flex', flex:1, overflow:'hidden', position:'relative' }}>
        <div style={{ display:'flex', width:'100%', height:'100%', paddingTop: taskPhase === 'active' ? 72 : 0, boxSizing:'border-box' }}>
        <Sidebar
          currentScreen={currentScreen}
          activeChat={liveActiveChat}
          onSelectChat={handleSelectChat}
          onNavigate={handleNavigate}
          onLog={logEvent}
          searchQuery={searchQuery}
          setSearchQuery={(q) => {
            setSearchQuery(q);
            if (q) updateTaskState('searchesPerformed', q);
          }}
          chats={chats}
          onLogout={handleRestart}
          onCreateGroup={handleCreateGroup}
          favoriteContacts={favoriteContacts}
        />


        <div style={{ flex:1, display:'flex', overflow:'hidden', position:'relative' }}>
          {currentScreen === SCREENS.CHAT_VIEW && liveActiveChat ? (
            <ChatView
              chat={liveActiveChat}
              onNavigate={handleNavigate}
              onLog={logEvent}
              onSend={handleSend}
              onForward={handleForward}
              onStar={handleStar}
              onViewMessage={(msgId) => updateTaskState('viewedMessages', msgId)}
              taskState={taskState}
              updateTaskState={updateTaskState}
              onOpenContactPanel={handleOpenContactPanel}
              isMuted={mutedContacts.has(activeFavKey)}
              isBlocked={blockedContacts.has(activeFavKey)}
              isFavorite={favoriteContacts.has(activeFavKey)}
              onToggleMute={() => handleToggleMute(activeFavKey)}
              onToggleBlock={() => handleToggleBlock(activeFavKey)}
              onToggleFavorite={() => handleToggleFavorite(activeFavKey)}
              onClearChat={handleClearChat}
              onDeleteChat={handleDeleteChat}
              highlightMessageId={highlightMessageId}
              onOpenChatSearch={handleOpenChatSearch}
            />
          ) : currentScreen === SCREENS.STARRED ? (
            <StarredMessages allChats={chats} onNavigate={handleNavigate} onLog={logEvent} />
          ) : currentScreen === SCREENS.SETTINGS ? (
            <Settings onNavigate={handleNavigate} onLog={logEvent} />
          ) : (
            <EmptyState />
          )}

          {contactPanelOpen && currentScreen === SCREENS.CHAT_VIEW && liveActiveChat && (
            <ContactInfo
              chat={liveActiveChat}
              onClose={handleCloseContactPanel}
              onLog={logEvent}
              isMuted={mutedContacts.has(activeFavKey)}
              isBlocked={blockedContacts.has(activeFavKey)}
              isFavorite={favoriteContacts.has(activeFavKey)}
              onToggleMute={() => handleToggleMute(activeFavKey)}
              onToggleBlock={() => handleToggleBlock(activeFavKey)}
              onToggleFavorite={() => handleToggleFavorite(activeFavKey)}
              onOpenChatSearch={handleOpenChatSearch}
            />
          )}

          {chatSearchOpen && currentScreen === SCREENS.CHAT_VIEW && liveActiveChat && (
            <ChatSearchPanel
              chat={liveActiveChat}
              onClose={handleCloseChatSearch}
              onLog={logEvent}
              onSelectMessage={(msgId) => setHighlightMessageId(msgId)}
            />
          )}

          {taskPhase === 'briefing' && (
            <TaskBriefing
              task={currentTask}
              taskIndex={taskIndex}
              totalTasks={tasks.length}
              onStart={handleTaskStart}
            />
          )}

          {taskPhase === 'complete' && (
            <TaskComplete
              trial={lastTrial}
              task={currentTask}
              taskIndex={taskIndex}
              totalTasks={tasks.length}
              isSuccess={lastSuccess}
              onNext={handleNextTask}
              isLast={isLastTask}
            />
          )}
        </div>
        </div>
      </div>
    </div>
  );
}