import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

import { WorkFlow } from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WorkFlow />
  </React.StrictMode>,
);
