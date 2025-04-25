
import React from 'react';
import { BrowserRouter as Router, Switch, Route, useLocation } from 'react-router-dom';
import App from '../App/App';
import SideBar from './SideBar';
import Header from './Header';
import { ProfileProvider } from '../../context/ProfileContext';
import { RegisterForm } from '../Register';

const BaseRoutes: React.FC = () => (
  <Switch>
    <Route exact path="/login">
      <RegisterForm heading="Login as Paid Girl" others={false} />
    </Route>
    <Route exact path="/free-demo">
      <RegisterForm heading="Login for Free Demo" others={false} />
    </Route>
    <Route exact path="/register">
      <RegisterForm others={true} />
    </Route>
    <Route exact path="/">
      <ProfileProvider>
        <App />
      </ProfileProvider>
    </Route>
  </Switch>
);

const UserRoutes: React.FC = () => (
  <ProfileProvider>
    <Switch>
      <Route exact path="/:user/login">
        <RegisterForm heading="Login as Paid Girl" others={false} />
      </Route>
      <Route exact path="/:user/free-demo">
        <RegisterForm heading="Login for Free Demo" others={false} />
      </Route>
      <Route exact path="/:user/register">
        <RegisterForm others={true} />
      </Route>
      <Route exact path="/:user/qr">
        <App isQROpen={true} />
      </Route>
      <Route exact path="/:user/pay-now">
        <App isPaymentModalOpen={true} />
      </Route>
      <Route exact path="/:user">
        <App />
      </Route>
    </Switch>
  </ProfileProvider>
);

const Routes: React.FC = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#242b2e]">
      <SideBar />
      <div className="flex flex-col max-w-7xl mx-auto min-h-screen relative">
        <Header />
        <main className="flex-1 pt-20 pb-6 overflow-hidden">
          <Switch location={location}>
            <Route path="/login" component={BaseRoutes} />
            <Route path="/free-demo" component={BaseRoutes} />
            <Route path="/register" component={BaseRoutes} />
            <Route exact path="/" component={BaseRoutes} />
            <Route path="/:user" component={UserRoutes} />
          </Switch>
        </main>
      </div>
    </div>
  );
};

const Navigation: React.FC = () => (
  <Router>
    <Routes />
  </Router>
);

export default Navigation;
