import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Home from './pages/home';
import Header from './components/common/header';
import Footer from './components/common/footer'


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Header />
    <Home 
      className="pt-[120px]"
    />
    <Footer />
  </React.StrictMode>
);


