import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import ChildDetails from './ChildDetails';
import { SnackbarProvider } from 'notistack';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <SnackbarProvider maxSnack={3}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/child/:userId" element={<ChildDetails />} />
        </Routes>
      </BrowserRouter>
    </SnackbarProvider>
  </React.StrictMode>
);

