import React from "react";
import TopBar from "./components/topBar";
import CreateSchedule from "./components/CreateSchedule";
import CreateRoute from "./components/CreateRoute";
import AddCustomer from "./components/AddCustomer";
import AddDriver from "./components/AddDriver";
import AddVehicle from "./components/AddVehicle";
import EditCustomer from "./components/EditCustomer";
import EditSchedule from "./components/EditScheduleB";
import EditDefaultRoute from "./components/EditDefaultRoute";
import { Route } from "react-router-dom";
import DisplayFeedback from "./components/DisplayFeedback";
import DisplayTimestamps from "./components/DisplayTimestamps";
import DisplayStartTimes from "./components/DisplayStartTimes";
import DisplayCurrentRoute from "./components/DisplayCurrentRoute";

//admin GUI for database, to add schedules routes (and eventually customers) to database!

function App() {
  return (
    <main className="App">
      <TopBar />
      <Route path="/create-schedule" exact component={CreateSchedule} />
      <Route path="/create-route" component={CreateRoute} />
      <Route path="/add-customer" component={AddCustomer} />
      <Route path="/add-driver" component={AddDriver} />
      <Route path="/add-vehicle" component={AddVehicle} />
      <Route path="/edit-customer" component={EditCustomer} />
      <Route path="/edit-schedule" component={EditSchedule} />
      <Route path="/edit-route" component={EditDefaultRoute} />
      <Route path="/display-feedback" component={DisplayFeedback} />
      <Route path="/display-start-times" component={DisplayStartTimes} />
      <Route path="/display-timestamps" component={DisplayTimestamps} />
      <Route path="/display-current-route" component={DisplayCurrentRoute} />
    </main>
  );
}

export default App;
