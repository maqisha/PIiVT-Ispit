import React, { useEffect, useState } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import api from '../api/api';
import EventRegister from '../api/EventRegister';
import './App.scss';
import Login from './Auth/Login';
import Logout from './Auth/Logout';
import Home from './Home/Home';
import Menu from './Menu/Menu';
import PizzaPage from './Pizza/PizzaPage';

type Role = 'visitor' | 'user' | 'administrator';

export default function App() {
  const [authorizedRole, setAuthorizedRole] = useState<Role>('visitor');

  const authEventHandler = (message: string) => {
    if (message === "force_login" || message === "user_logout") {
      return setAuthorizedRole('visitor');
    }

    if (message === "user_login") {
      return setAuthorizedRole('user');
    }

    if (message === "administrator_login") {
      return setAuthorizedRole('administrator');
    }
  }

  const checkRole = (role: 'administrator' | 'user') => {
    api('get', `/auth/${role}`, undefined, true)
      .then(res => {
        if (res?.data === "OK") {
          setAuthorizedRole(role);
          EventRegister.emit("AUTH_EVENT", role + "_login");
        }
      })
      .catch(() => { })
  }

  useEffect(() => {
    EventRegister.on("AUTH_EVENT", authEventHandler);
    checkRole('user');
    checkRole('administrator');
  
    return () => {
      EventRegister.off("AUTH_EVENT", authEventHandler);
    }
  }, []);

  return (
    <BrowserRouter>
      <div className="App">
        <h1>Pizzeria Maqi</h1>
        {authorizedRole}
        <Menu authorizedRole={authorizedRole}/>
        <main>
          <Switch>
            <Route path='/pizza' component={PizzaPage} exact />
            <Route path='/auth/login' component={Login} exact />
            <Route path='/auth/logout' component={Logout} exact />
            <Route component={Home} />
          </Switch>

        </main>
        <footer></footer>
      </div>
    </BrowserRouter>
  );
}
