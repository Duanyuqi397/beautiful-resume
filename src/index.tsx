import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import doMock from './mock'
import { BrowserRouter } from 'react-router-dom';
import { client } from './core/network'
import MockAdapter from 'axios-mock-adapter'

if(process.env.REACT_APP_ENV === "test:mock"){
  console.info("start with axios mock")
  doMock(new MockAdapter(client, { delayResponse: 1000 }) )
}
ReactDOM.render(
  // <React.StrictMode>
    <BrowserRouter>
        <App/>
    </BrowserRouter>
  // </React.StrictMode>,
  ,document.getElementById('root')
);