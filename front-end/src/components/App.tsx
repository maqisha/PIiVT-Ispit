import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import './App.scss';
import PizzaPage from './Pizza/PizzaPage';

export default function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <h1>Pizzeria Maqi</h1>
        <main>
          <Switch>
            <Route path='/pizza' component={PizzaPage} /> exact
          </Switch>

        </main>
        <footer></footer>
      </div>
    </BrowserRouter>
  );
}
