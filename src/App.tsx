import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout/Layout';
import TimerContainer from './components/Timer/TimerContainer';
import { TimerProvider } from './context/TimerContext';
import { TaskProvider } from './context/TaskContext';
import { NotificationProvider } from './context/NotificationContext';

function App() {
  return (
    <ThemeProvider>
      <TimerProvider>
        <TaskProvider>
          <NotificationProvider>
            <Layout>
              <TimerContainer />
            </Layout>
          </NotificationProvider>
        </TaskProvider>
      </TimerProvider>
    </ThemeProvider>
  );
}

export default App;