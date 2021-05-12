/*function to edit todays schedule:

*Fetch list of drivers.

*on select driver fetch data for today for driver.
    store fetched schedule in state. - perm and temp?
    display data as defaults for inputs.
    on change update state obj.
    on submit send obj.
*/

import React from "react";
import axios from "axios";


class EditSchedule extends React.Component {
  state = {
    dataFetched: false,
    originalSchedule: {},
    scheduleData: {}
  };

  //FUNCTIONS ON COMPDIDMOUNT FETCHING LISTS OF DRIVERS VEHICLES, ROUTES AND CUSTOMERS AND STORING IN STATE.
  //works
  fetchDrivers = () => {
    //console.log("fetchschedules running");
    const url = "https://allin1ship.herokuapp.com/getDrivers";
    fetch(url)
      .then((response) => response.json())
      .then((json) => this.setState({ driverList: json }))
      .catch((err) => console.log(err));
  };
  //wroks:)
  getVehicles = () => {
    fetch("https://allin1ship.herokuapp.com/getVehicles")
      .then((response) => response.json())
      .then((json) => this.setState({ vehicleList: json }))
      .catch((err) => console.log(err));
  };
  //works:)
  getRoutes = () => {
    fetch("https://allin1ship.herokuapp.com/getNumberRoutes")
      .then((response) => response.json())
      .then((json) => this.setState({ routeList: json }))
      .catch((err) => console.log(err));
  };

  getCustomersData = () => {
    //console.log("getcustoemrsdata running");
    const url = "https://allin1ship.herokuapp.com/getCustomersData";
    fetch(url)
      .then((response) => response.json())
      .then((json) => this.setState({ customerList: json }))
      .catch((err) => console.log(err));
  };

  componentDidMount() {
    console.log("componentDidMount");
    this.fetchDrivers();
    this.getVehicles();
    this.getRoutes();
    this.getCustomersData();
  }

  handleSubmit = (e) => {
    e.preventDefault();
    console.log("handle submit goes here");
    axios.post(url, data)
    //switch to axios
  };

  getScheduleData = (driver) => {
    console.log('get schweduleData running');
    this.setState({ scheduleData: null, dataFetched: false });
    let scheduleData = {};
    const scheduleUrl = `https://allin1ship.herokuapp.com/singleScheduleDisplay/${driver}`;
    //console.log("getShceduleDAta", scheduleUrl);
    axios
      .get(scheduleUrl)
      .then((resSchedule) => {
        //console.log(resSchedule);
        scheduleData = resSchedule.data[0];
        if (!scheduleData) throw new Error
        console.log('gotSchedule', scheduleData);
        //this.setState({ scheduleData: res.data[0] });
      })
      .then(() => {
        const stopsUrl = `https://allin1ship.herokuapp.com/singleRouteDisplay/${scheduleData.id}`;
        return axios.get(stopsUrl);
      })
      .then((resStops) => {
        //console.log(resStops);
        scheduleData.stopsData = resStops.data;
        //console.log("scheduledata with resStops: ", scheduleData);
      })
      .then(() => {
        const { stopsData } = scheduleData;
        //let tasksArray = [];
        for (let i = 0; i < stopsData.length; i++) {
          let tasksUrl = `https://allin1ship.herokuapp.com/getRouteTasks/${stopsData[i].schedule_stop_id}`;
          axios.get(tasksUrl).then((taskRes) => {
            //console.log("taskRes", taskRes);
            scheduleData.stopsData[i].tasks = taskRes.data;
            //tasksArray.push(taskRes.data);
            //console.log("tasksarray in loop:", tasksArray);
            if (i + 1 === stopsData.length) {
              console.log("fetching tasks finished");
              this.setState({ scheduleData, dataFetched: true });
            }
          });
        }
      })
      .catch((err) => console.log("getScheduleData error: ", err));
  };

  handleChooseScheduleToEdit = (e) => {
    //this should set selected schedule state?
    //fetch scheudle data and set state.
    console.log("handlechoosescheduletoedit", e.target.value);
    this.setState({ selectedSchedule: e.target.value });
    this.getScheduleData(e.target.value);
  };

  handleRouteChange = (e) => {
    console.log("handleRouteChange runnig", e.target.value);
    const { scheduleData } = this.state
    const url = `https://allin1ship.herokuapp.com/defaultRouteDisplay/${parseInt(e.target.value)}`
    axios.get(url).then(res => {
      console.log('res');
      scheduleData.stopsData = res.data;
      scheduleData.route_id = parseInt(e.target.value);
      this.setState({ scheduleData })
    })
  };

  handleChange = (key, value) => {
    console.log(
      "herer needs to update data obj from state (key value)",
      key,
      value
    );
    const { scheduleData } = this.state;
    scheduleData[key] = value;
    this.setState({ scheduleData });
  };

  handleCustomerChange = (stopIndex, value) => {
    //this function sets the schedule stops customer_id to given value and finds that customers name from customerList to set customer_name
    //console.log( "herer needs to update data obj from state (key value)", key,value );
    const { scheduleData, customerList } = this.state;
    if (!scheduleData.stopsData) return
    scheduleData.stopsData[stopIndex].customer_id = value;
    const customerObj = customerList.find(customer => customer.customer_id == value);
    scheduleData.stopsData[stopIndex].customer_name = customerObj.customer_name
    scheduleData.stopsData[stopIndex].address = customerObj.address
    this.setState({ scheduleData });
  };
  handleTaskChange = (stopIndex, value) => {
    //may need to server make new tasks if not already? or deleting all tasks and creating all new?
    console.log('handleTAskChanfe');
    console.log(stopIndex, value);
    const { scheduleData, customerList } = this.state;
    let taskArray = value.split('\n')
    taskArray = taskArray.filter(function (e) { return e != "" });
    console.log(taskArray);
    for (let i = 0; i < taskArray.length; i++) {
      if (scheduleData.stopsData[stopIndex].tasks[i]) {
        scheduleData.stopsData[stopIndex].tasks[i].task = taskArray[i]
      } else {
        scheduleData.stopsData[stopIndex].tasks[i] = {
          completion_status: null,
          schedule_stop_id: scheduleData.stopsData[stopIndex].schedule_stop_id,
          task: taskArray[i]
        }
      }
    }
    if (scheduleData.stopsData[stopIndex].tasks.length > taskArray.length) {
      scheduleData = scheduleData.stopsData[stopIndex].tasks.slice(taskArray.length)
    }
    scheduleData.stopsData[stopIndex].tasks.task = value;
    if (!scheduleData.stopsData[stopIndex].tasks) return
    this.setState({ scheduleData });
  };

  renderTable = () => {
    console.log("renderTabel");
    const { stopsData } = this.state.scheduleData;
    let tableRows = [];
    for (let i = 0; i < stopsData.length; i++) {
      //console.log("loop", i);
      let tableRow = (
        <tr key={'row' + i}>
          <td id={`stopNumber${stopsData[i].stop_number}`}>
            {stopsData[i].stop_number}
          </td>
          <td id={stopsData[i].stop_number}>
            <select id={`customerSelect${stopsData[i].stop_number}`} onChange={(e) => this.handleCustomerChange(i, e.target.value)}>
              <option key="0" value={stopsData[i].customer_id}>
                {stopsData[i].customer_name}
              </option>
              {this.renderOptions('customer', 'customer_id', 'customer_name')}
            </select>
          </td>
          <td>
            <textarea
              onChange={(e) => this.handleTaskChange(i, e.target.value)}
              rows="3"
              cols="35"
              id={`tasks${stopsData[i].stop_number}`}
              defaultValue={this.renderTasks(stopsData[i].tasks)}
              name={`taskTextArea${stopsData[i].stop_number}`}
            ></textarea>
          </td>
          {/*<input
            type="button"
            onClick={(e) => this.deleteRouteRow(e, stopsData[i].stop_number)}
            value="delete row"
          />*/}
        </tr>
      );
      tableRows.push(tableRow);
    }
    return tableRows;
  };
  //renders list of drivers as <options> for dropdown.

  renderTasks = (tasks) => {
    //console.log(tasks);
    if (!tasks) return '';
    //putting new line between tasks (notbefore the first task)
    const returnValue = tasks.map((task, index) => index !== 0 ? '\n' + task.task : task.task);
    //console.log(returnValue);
    return returnValue;
  };


  renderOptions = (type, typeB = type, typeC = null) => {
    //console.log(type, typeB, typeC);
    const returnValue = this.state[`${type}List`] ? (
      this.state[`${type}List`].map((singleValue, index) => (
        <option key={index} value={singleValue[typeB]}>
          {typeC ? singleValue[typeC] : singleValue[typeB]}
        </option>
      ))
    ) : (
      <option disabled>{type} Options Not Yet Ready</option>
    );
    return returnValue;
  };

  routeOptions = () => {
    const returnValue = this.state.routeList ? (
      this.state.routeList.map((route, index) => (
        <option key={index} value={route.id}>
          {route.id} - {route.route_name}
        </option>
      ))
    ) : (
      <option disabled>Driver Options Not Yet Ready</option>
    );
    return returnValue;
  };

  render() {
    const { selectedSchedule, scheduleData, dataFetched } = this.state;

    const todaysDate = new Date().toISOString().split("T")[0];

    return (
      <div>
        <legend>Edit Schedule</legend>
        <br />
        <select id="selectSchedule" onChange={this.handleChooseScheduleToEdit}>
          <option value="" selected disabled hidden>
            Choose Schedule for driver:
          </option>
          {this.renderOptions("driver")}
        </select>
        {dataFetched ? (
          <div>
            <br />
            Change Date:
            <br />
            <input
              type="date"
              id="schedule-date"
              defaultValue={todaysDate}
              onChange={(e) =>
                this.handleChange("schedule_date", e.target.value)
              }
            />
            <br />
            <br />
            Change Driver:
            <br />
            <select
              onChange={(e) => this.handleChange("driver", e.target.value)}
            >
              <option
                value={selectedSchedule}
                selected
                disabled
                hidden
              >
                {selectedSchedule}
              </option>
              {this.renderOptions("driver")}
              <option value={() => document.getElementById("new-driver").value}>
                New Driver
              </option>
            </select>
            <br />
            <label htmlFor="new-driver">new driver</label>
            <br />
            <input
              id="new-driver"
              onChange={(e) => this.handleChange("driver", e.target.value)}
            ></input>
            <br />
            <br />
            Change Vehicle:
            <br />
            <select
              required
              onChange={(e) => this.handleChange("vehicle", e.target.value)}
            >
              <option
                value={scheduleData.vehicle}
                selected
                disabled
                hidden
              >
                {scheduleData.vehicle}
              </option>
              {this.renderOptions("vehicle")}
              <option
                value={() => document.getElementById("new-vehicle").value}
              >
                New Vehicle
              </option>
            </select>
            <br />
            <label htmlFor="new-vehicle">new vehicle</label>
            <br />
            <input
              id="new-vehicle"
              onChange={(e) => this.handleChange("vehicle", e.target.value)}
            ></input>
            <br />
            <br />
            DROP OFF INFO:
            <br />
            <textarea
              rows="8"
              cols="50"
              onChange={(e) =>
                this.handleChange("dropoff_info", e.target.value)
              }
              name="comment"
              value={scheduleData["dropoff_info"]}
            ></textarea>
            <br />
            <br />
            ROUTE:
            <br />{" "}
            {/*drop down of number for each route_id from fetched data.*/}
            <select id="selectRoute" onChange={this.handleRouteChange}>
              <option value={scheduleData.route_id} selected hidden disabled>
                Original Route
              </option>
              {this.routeOptions()}
            </select>
            <br />
            <table>
              <thead>
                <tr>
                  <th>selected route # {scheduleData.route_id}</th>
                </tr>
                <tr>
                  <th>Stop #</th>
                  <th>Address</th>
                  <th className="editable">Tasks</th>
                </tr>
              </thead>
              <tbody>{this.renderTable()}</tbody>
            </table>
            <button
              onClick={this.handleSubmit}
              style={{ color: "white", backgroundColor: "black", width: 300 }}
            >
              SUBMIT
            </button>
            <br />
          </div>
        ) : (
          <div> Please select a Driver</div>
        )}
      </div>
    );
  }
}

export default EditSchedule;
