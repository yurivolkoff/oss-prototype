import React, { useEffect } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';

import { DashboardScreen } from './screens/DashboardScreen';
import { PrepHouseAScreen } from './screens/PrepHouseAScreen';
import { PrepHouseBScreen } from './screens/PrepHouseBScreen';
import { Module2Placeholder } from './screens/Module2Placeholder';
import { ToastHost } from './components/ui/Toast';

import { useMeetingStore } from './lib/store';
import { applyDemoStateFromUrl } from './lib/demo-state';

function FlowGuard({ children, requireMeeting }: { children: React.ReactNode; requireMeeting?: boolean }) {
  const navigate = useNavigate();
  const meeting = useMeetingStore((s) => s.meeting);
  useEffect(() => {
    if (requireMeeting && meeting.state === 'none') {
      navigate('/', { replace: true });
    }
  }, [requireMeeting, meeting.state, navigate]);
  return <>{children}</>;
}

export default function App() {
  useEffect(() => {
    applyDemoStateFromUrl();
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<DashboardScreen />} />
        <Route
          path="/oss/new/house-a"
          element={
            <FlowGuard requireMeeting>
              <PrepHouseAScreen />
            </FlowGuard>
          }
        />
        <Route
          path="/oss/new/house-b"
          element={
            <FlowGuard requireMeeting>
              <PrepHouseBScreen />
            </FlowGuard>
          }
        />
        <Route
          path="/oss/new/module-2"
          element={
            <FlowGuard requireMeeting>
              <Module2Placeholder />
            </FlowGuard>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ToastHost />
    </>
  );
}
