import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter as Router } from 'react-router-dom';
import ScrollToTop from "./components/ScrollToTop.tsx";
import { AuthProvider } from './context/authContext.tsx';
import { AdminProvider } from "./context/adminProfileContext.tsx";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Router>
        <AuthProvider>
          <AdminProvider>
            <ScrollToTop />
            <App />
          </AdminProvider>
        </AuthProvider>
      </Router>
  </React.StrictMode>
);
