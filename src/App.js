import React from "react";
import TopBar from "./pages/topBar";
import CreateSchedule from "./pages/CreateSchedule";
import CreateRoute from "./pages/CreateRoute";
import AddCustomer from "./pages/AddCustomer";
import AddDriver from "./pages/AddDriver";
import AddVehicle from "./pages/AddVehicle";
import EditCustomer from "./pages/EditCustomer";
import EditSchedule from "./pages/EditScheduleB";
import EditDefaultRoute from "./pages/EditDefaultRoute";
import { Route } from "react-router-dom";
import DisplayFeedback from "./pages/DisplayFeedback";
import DisplayTimestamps from "./pages/DisplayTimestamps";
import DisplayStartTimes from "./pages/DisplayStartTimes";
import DisplayCurrentRoute from "./pages/DisplayCurrentRoute";

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
