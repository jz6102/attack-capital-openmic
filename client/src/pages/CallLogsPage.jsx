import React from 'react';
import CallLogList from '../components/CallLogList';

const CallLogsPage = () => {
  return (
    <div>
      <h1>Call Logs</h1>
      <p>Here you will see the history of all calls captured by the webhooks.</p>
      <CallLogList />
    </div>
  );
};

export default CallLogsPage;