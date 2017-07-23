import React, { Component } from 'react';
import { Router, Scene } from 'react-native-router-flux';

import Welcome from './Welcome';
import Loading from './Loading';
import Home from './Home';

const App = () => {
  return (
    <Router>
      <Scene key="root">
        <Scene key="loading"
          hideNavBar={true}
          component={Loading}
          title="Loading"
          initial
        />
        <Scene
          key="welcome"
          hideNavBar={true}
          component={Welcome}
          title="Welcome"
        />
        <Scene
          key="home"
          hideNavBar={true}
          component={Home}
          title="Home"
        />
      </Scene>
    </Router>
  );
}

export default App;
