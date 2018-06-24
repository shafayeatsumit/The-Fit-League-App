import React, { Component } from 'react';
import { Router, Scene } from 'react-native-router-flux';

import Welcome from './Welcome';
import Loading from './Loading';
import GameRules from './GameRules';
import Home from './Home';
import Matchup from './Matchup';
import League from './League';
import Leagues from './Leagues';
import Workouts from './Workouts';
import PlayerCard from './PlayerCard';
import NewWorkoutWhen from './NewWorkoutWhen';
import NewWorkoutWhat from './NewWorkoutWhat';
import NewWorkoutHowMany from './NewWorkoutHowMany';
import NewWorkoutSuccess from './NewWorkoutSuccess';
import EditWorkoutSuccess from './EditWorkoutSuccess';
import SadConnection from './SadConnection';
import ProfileImage from './ProfileImage';
import Settings from './Settings';

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
          key="profileImage"
          component={ProfileImage}
          title="Add profile image."
        />          
        <Scene
          key="home"
          component={Home}
          title="Home"
        />
        <Scene
          key="settings"
          component={Settings}
          title="Settings"
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
          key="newWorkoutSuccess"
          component={NewWorkoutSuccess}
          title="Yasss! You did it."
        />
        <Scene
          key="editWorkoutSuccess"
          component={EditWorkoutSuccess}
          title="Workout Updated"
        />
        <Scene
          key="matchup"
          component={Matchup}
          title="Your Matchup"
        />
        <Scene
          key="league"
          component={League}
          title="Your League"
        />
        <Scene
          key="workouts"
          component={Workouts}
          title="Your Workouts"
        />
        <Scene
          key="rules"
          component={GameRules}
          title="Game Rules"
        />
        <Scene
          key="playerCard"
          component={PlayerCard}
          title="Player Card"
        />
        <Scene
          key="sadConnection"
          component={SadConnection}
          title="Slow Interwebz"
        />
        <Scene
          key="leagues"
          component={Leagues}
          title="Your Leagues"
        />
      </Scene>
    </Router>
  );
}

export default App;
