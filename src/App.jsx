import React from 'react';
import { Provider } from 'react-redux';
import 'antd/dist/antd.css';
import './App.css';

import store from './store';
import Music from './pages/music/components';

const App = () => (
  <Provider store={store}>
    <Music />
  </Provider>
);

export default App;
