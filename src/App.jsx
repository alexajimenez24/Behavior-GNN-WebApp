import React, { useState, useCallback, useRef, useEffect } from 'react';
import { SCREENS, TASKS as DEFAULT_TASKS, CHATS } from './data';
import { useLogger } from './useLogger';
import ParticipantSetup from './components/ParticipantSetup';
import TaskBuilder from './components/TaskBuilder';
import Sidebar from './components/Sidebar';
import ChatView from './components/ChatView';
import TaskBar from './components/TaskBar';
import { TaskBriefing, TaskComplete, SessionComplete } from './components/TaskScreens';
import { ContactInfo, StarredMessages, Settings, EmptyState } from './components/SecondaryScreens';

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

  const freshChats = () => CHATS.map(c => ({ ...c, messages: [...c.messages.map(m => ({ ...m }))] }));
  const [chats, setChats] = useState(freshChats);

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
    setChats(freshChats());                 
    setLastTrial(null);
    setLastSuccess(false);
    setTaskStartTime(null);
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
  }, []);

  const handleSelectChat = useCallback((chat, isNew = false) => {
    const live = chats.find(c => c.id === chat.id) || chat;
    setActiveChat(live);
    setCurrentScreen(SCREENS.CHAT_VIEW);
    if (isNew) updateTaskState('newChatsStarted', chat.contactId);
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

  return (
    <div style={{ height:'100vh', display:'flex', flexDirection:'column', background:'#111b21', overflow:'hidden' }}>
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
            />
          ) : currentScreen === SCREENS.CONTACT_INFO ? (
            <ContactInfo chat={liveActiveChat} onNavigate={handleNavigate} onLog={logEvent} />
          ) : currentScreen === SCREENS.STARRED ? (
            <StarredMessages allChats={chats} onNavigate={handleNavigate} onLog={logEvent} />
          ) : currentScreen === SCREENS.SETTINGS ? (
            <Settings onNavigate={handleNavigate} onLog={logEvent} />
          ) : (
            <EmptyState />
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