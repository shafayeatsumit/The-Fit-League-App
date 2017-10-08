import React, { Component } from 'react';
import { Router, Scene } from 'react-native-router-flux';

import Welcome from './Welcome';
import Loading from './Loading';
import Home from './Home';
import NewWorkoutWhen from './NewWorkoutWhen';
import NewWorkoutWhat from './NewWorkoutWhat';
import NewWorkoutHowMany from './NewWorkoutHowMany';
import NewWorkoutSpecificExercises from './NewWorkoutSpecificExercises';
import NewWorkoutSuccess from './NewWorkoutSuccess';

const App = () => {
  return (
    <Router>
      <Scene key="root" hideNavBar={true}>
        <Scene key="loading"
          component={Loading}
          title="Loading"
          initial
        />
        <Scene
          key="welcome"
          component={Welcome}
          title="Welcome"
        />
        <Scene
          key="home"
          component={Home}
          title="Home"
        />
        <Scene
          key="newWorkoutWhen"
          component={NewWorkoutWhen}
          title="When?"
        />
        <Scene
          key="newWorkoutWhat"
          component={NewWorkoutWhat}
          title="What?"
        />
        <Scene
          key="newWorkoutHowMany"
          component={NewWorkoutHowMany}
          title="How Many?"
        />
        <Scene
          key="newWorkoutSpecificExercises"
          component={NewWorkoutSpecificExercises}
          title="Add Specific Exercises"
        />
        <Scene
          key="newWorkoutSuccess"
          component={NewWorkoutSuccess}
          title="Yasss! You did it."
        />
      </Scene>
    </Router>
  );
}

export default App;
