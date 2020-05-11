import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'
import './index.css';
import App from './App';
import ActionCableProvider from './actioncable/Provider'
import * as serviceWorker from './serviceWorker';
import store from './store'

const ws = "ws://localhost:3000/cable"

if (window.matchMedia('(prefers-color-scheme)').media !== 'not all') {
  console.log('🎉 Dark mode is supported');
}

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ActionCableProvider ws={ws}>
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
