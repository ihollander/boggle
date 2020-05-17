import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'
import ReactGA from 'react-ga'

import './index.css';
import App from './App';
import ActionCableProvider from './actioncable/Provider'
import * as serviceWorker from './serviceWorker';
import store from './store'

ReactGA.initialize('UA-166916161-1')

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ActionCableProvider ws={process.env.REACT_APP_WS_ROOT}>
        <Router>
          <App />
        </Router>
      </ActionCableProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
