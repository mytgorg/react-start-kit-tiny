
import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import App from '../App/App';
import SideBar from './SideBar';
import Header from './Header';
import { ProfileProvider } from '../../context/ProfileContext';
import './Navigation.css';
import RegisterForm from '../Register/RegisterForm';

const BaseRoutes: React.FC = () => (
  <Routes>
    <Route path="/login" element={<RegisterForm heading="Login as Paid Girl" others={false} />} />
    <Route path="/free-demo" element={<RegisterForm heading="Login for Free Demo" others={false} />} />
    <Route path="/register" element={<RegisterForm others={true} />} />
    <Route path="/" element={
      <ProfileProvider>
        <App />
      </ProfileProvider>
    } />
  </Routes>
);

const UserRoutes: React.FC = () => (
  <ProfileProvider>
    <Routes>
      <Route path="/:user/login" element={<RegisterForm heading="Login as Paid Girl" others={false} />} />
      <Route path="/:user/free-demo" element={<RegisterForm heading="Login for Free Demo" others={false} />} />
      <Route path="/:user/register" element={<RegisterForm others={true} />} />
      <Route path="/:user/qr" element={<App isQROpen={true} />} />
      <Route path="/:user/pay-now" element={<App isPaymentModalOpen={true} />} />
      <Route path="/:user" element={<App />} />
    </Routes>
  </ProfileProvider>
);

const Routes: React.FC = () => {
  const location = useLocation();

  return (
    <>
      <SideBar />
      <div className="navigation__content">
        <Header />
        <div className="page-container">
          <Routes>
            <Route path="/login" element={<BaseRoutes />} />
            <Route path="/free-demo" element={<BaseRoutes />} />
            <Route path="/register" element={<BaseRoutes />} />
            <Route path="/" element={<BaseRoutes />} />
            <Route path="/:user/*" element={<UserRoutes />} />
          </Routes>
        </div>
      </div>
    </>
  );
};

const Navigation: React.FC = () => (
  <Router>
    <Routes />
  </Router>
);

export default Navigation;
