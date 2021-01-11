import React from 'react';
import TopBar from "./components/topBar";
import CreateSchedule from "./components/CreateSchedule";
import CreateRoute from "./components/CreateRoute";
import { Route } from 'react-router-dom';

//admin GUI for database, to add schedules routes (and eventually customers) to database!

function App() {
  return (
    <main className='App'>
      <TopBar/>

      <Route
        path='/' exact
        component={CreateSchedule}
      />
      <Route
        path='/create-route'
        component={CreateRoute}
      />
    </main>
  );
}

export default App;