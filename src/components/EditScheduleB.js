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
/*
function delay() {
  setTimeout(() => { console.log('delayt') }, 500)
}*/


/**
 * THIS IS REPLACEMENT TO BROKEN editschedule page
 */

//IDEA - MAYBE STORE TASKS AS JUST ARRAY IN EACH STOP, CAN GET STOP_ID FROM STOP ANYWAY, MAY MAKE ALL CHANGESTOP ISSUES MUCH SIMPLER
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

  //fetchiing the constant data when page loads here.
  componentDidMount() {
    console.log("componentDidMount");
    this.fetchDrivers();
    this.getVehicles();
    this.getRoutes();
    this.getCustomersData();
  }


  //nexct five functions are all steps in SUBMIT process.
  deleteStopTasks = () => {
    console.log('deletestoptasks running');
    const { scheduleData, schedule_stop_id_tracker } = this.state
    //sthis.setState({deletedTasks: this.state.deletedTasks++})
    const url = `https://allin1ship.herokuapp.com/deleteStopsTasks`
    let scheduleStopIds = []
    for (let i = 0; i < schedule_stop_id_tracker.length; i++) {
      scheduleStopIds.push(schedule_stop_id_tracker[i])
    };
    console.log(scheduleStopIds);
    const requestBody = {
      scheduleStopIds: scheduleStopIds
    }
    return axios.post(url, requestBody)
  }

  deleteStops = () => {
    console.log('delete stops runing');
    const url = `https://allin1ship.herokuapp.com/dropScheduleStops/${this.state.scheduleData.id}`
    return axios.get(url)//.catch(err=> console.log(err))
    //.then(res=> this.setState({stopsDeleted: true}))
  }

  editSchedule = () => {
    console.log('edit scheudle runnging - get data from state');
    const { scheduleData } = this.state;
    const url = `https://allin1ship.herokuapp.com/alterSchedule/${scheduleData.id}`
    const requestBody = {
      selectedDate: scheduleData.schedule_date.substring(0, 10),
      selectedDriver: scheduleData.driver,
      selectedVehicle: scheduleData.vehicle,
      selectedDropOffInfo: scheduleData.dropoff_info,
      selectedDefaultRoute: scheduleData.route_id ? scheduleData.route_id : 999 /**999 references an empty route in db */
    }
    console.log(requestBody);
    return axios.post(url, requestBody)
  }

  postNewStop = (i) => {
    console.log('postnewstop runnigi', i);
    const { scheduleData } = this.state;

    const url = `https://allin1ship.herokuapp.com/postScheduleStops`
    const requestBody = {
      scheduleId: scheduleData.id,
      customerId: scheduleData.stopsData[i].customer_id,
      stopNumber: scheduleData.stopsData[i].stop_number
    }
    console.log(requestBody);
    return axios.post(url, requestBody) /**needs to return schedulestopid */
  }

  postNewTask = (schedule_stop_id, taskText) => {
    console.log('postnewtask, need to get stop_id from api response', console.log(schedule_stop_id));
    const url = `https://allin1ship.herokuapp.com/postStopTask/${schedule_stop_id}`
    const requestBody = {
      task: taskText
    }
    return axios.post(url, requestBody)
  }

  //complex badly built submit function that calls : delete all tasks for all stops in schedule, then once that returns, delete all stops for schedule, then once eturns
  //edit scheduledata, then post stops, then post tasks.
  handleSubmit = (e) => {
    //need to do a bunch of steps, WITHOUT CALLBACK HELL 
    //currently best solutin i have is ridiculous inner loops etc.
    //probably better would be one api call that does everything...
    e.preventDefault();
    console.log("handle submit running");
    let newStopCounter = 0;
    const { scheduleData } = this.state;
    this.setState({ deletedTasks: 0, stopsDeleted: false })
    this.deleteStopTasks().then((res1) => {

      console.log("then after deletestoptasks", res1);
      this.deleteStops().then((res2) => {
        console.log("then after deletestops", res2);
        this.editSchedule().then((resedit) => {
          console.log('aftereditschedule,', resedit);
          for (let i = 0; i < scheduleData.stopsData.length; i++) {
            this.postNewStop(i).then((res3) => {
              console.log("then after postnewstop", res3);
              console.log("res3data schedstopids", res3.data);
              for (let ii = 0; ii < scheduleData.stopsData[i].tasks.length; ii++) {
                //need to call it with returned stopId. c\tes if this works...
                this.postNewTask(res3.data, scheduleData.stopsData[i].tasks[ii].task).then((resNewTask) => {
                  newStopCounter++
                  if (newStopCounter >= scheduleData.stopsData.length) alert('success!')
                })

              }
            }).then(() => {
              console.log("then nmot after postnewstops");
            })
          }
        })
      }).catch((err)=> console.log(err))

    }).catch((err) => {
      console.log('eror', err);
    })
    /*
    //.then()
      this.deleteStops()
       //.then
        this.editSchedule()
        //.then()
          for stop in stopsData:
            this.postNewStop()
              //.then(res=> 
              for task in stop {
                this.postNewStop(res.schedule_stop_id)
              }
            stopCounter++
            if stopCounter > stops.length, alert('success!') */
    console.log('finishedloop, this runs before any requests finished.');
    /**
     * /alterSchedule/${this.state.scheduleData[0].id}
     * s://allin1ship.herokuapp.com/deleteStopsTasks/${stopId}
     * /dropScheduleStops/${this.state.scheduleData[0].id
     * lin1ship.herokuapp.com/postScheduleStop
     * ps://allin1ship.herokuapp.com/postStopTask/${schedule_stop_id}
     */
    //then send deletestops with schedule id
    //then send EditSchedule with scheduleData info,
    //then for each Stop in scheduleData, send create new stop (schedule_id, customer_id, stop_number)
    //then for each task in each stop post new task (sched_id)
    //then alert status - error or complete:)
    //switch to axios
  };


  //long looping i think badly built but better than prev versions fetching scheduledata and then stopdata and then tasks for each stop and setting them all as one object in state
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
        if (!scheduleData) throw new Error()
        console.log('gotSchedule', scheduleData);
        //this.setState({ scheduleData: res.data[0] });
      })
      .then(() => {
        const stopsUrl = `https://allin1ship.herokuapp.com/singleRouteDisplay/${scheduleData.id}`;
        console.log('stopsURl');
        return axios.get(stopsUrl);
      })
      .then((resStops) => {
        console.log(resStops);
        scheduleData.stopsData = resStops.data;
        //console.log("scheduledata with resStops: ", scheduleData);
      })
      .then(() => {
        const { stopsData } = scheduleData;
        let schedule_stop_id_tracker = []
        //let tasksArray = [];
        if (stopsData.length === 0) {
          this.setState({ scheduleData, dataFetched: true });
        } else {
          for (let i = 0; i < stopsData.length; i++) {
            let tasksUrl = `https://allin1ship.herokuapp.com/getRouteTasks/${stopsData[i].schedule_stop_id}`;
            axios.get(tasksUrl).then((taskRes) => {
              console.log("taskRes", taskRes);
              scheduleData.stopsData[i].tasks = taskRes.data ? taskRes.data : [];
              taskRes.data[0] && schedule_stop_id_tracker.push(taskRes.data[0].schedule_stop_id)
              //tasksArray.push(taskRes.data);
              //console.log("tasksarray in loop:", tasksArray);
              if (taskRes.status === 200) {
                console.log("fetching tasks finished");
              }
              //setting state here after fetched last task
              if (i === stopsData.length - 1) this.setState({ scheduleData, dataFetched: true, schedule_stop_id_tracker });
            });
          }
        }

      })
      .catch((err) => console.log("getScheduleData error: ", err));
  };

  //on choosing driver to view their schedule, this calls getScheduleData to fetch todays scheudle for that driver
  handleChooseScheduleToEdit = (e) => {
    //this should set selected schedule state?
    //fetch scheudle data and set state.
    console.log("handlechoosescheduletoedit", e.target.value);
    this.setState({ selectedSchedule: e.target.value });
    this.getScheduleData(e.target.value);
  };

  //if defalut route is changed (from dropdown) - this fetches the new rute fromj db by id and sets scheduledata stopdata to the new stops
  handleRouteChange = (e) => {
    console.log("handleRouteChange runnig", e.target.value);
    const { scheduleData } = this.state;
    scheduleData.stopsData = {}
    this.setState({ scheduleData })
    const url = `https://allin1ship.herokuapp.com/defaultRouteDisplay/${parseInt(e.target.value)}`
    axios.get(url).then(res => {
      console.log('res');
      scheduleData.stopsData = res.data;
      for (let i = 0; i < res.data.length; i++) {
        scheduleData.stopsData[i].tasks = []
      }
      scheduleData.route_id = parseInt(e.target.value);
      this.setState({ scheduleData })
    })
  };

  //multipurpose change schedulechange individual key/values
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
    console.log('handleCustomerChange', stopIndex, value);
    const { scheduleData, customerList } = this.state;
    if (!scheduleData.stopsData) return
    scheduleData.stopsData[stopIndex].customer_id = value;
    const customerObj = customerList.find(customer => customer.customer_id === value);
    console.log(customerObj);
    scheduleData.stopsData[stopIndex].customer_name = customerObj.customer_name
    scheduleData.stopsData[stopIndex].address = customerObj.address
    this.setState({ scheduleData });
  };

  //ridiculously complex function for changing a task, BC objects in stop in scheduledata, and handling if exists or not.
  handleTaskChange = (stopIndex, value) => {
    //value is new task value, stopindex is which stop its task of.
    //may need to server make new tasks if not already? or deleting all tasks and creating all new?
    console.log('handleTAskChanfe');
    let scheduleData = this.state.scheduleData;
    console.log(stopIndex, value);
    //handle erasing task
    if (value === "") {
      console.log('value empty')
      scheduleData.stopsData[stopIndex].stops = []
    } else {
      //spliting value into lines bc each new line is new task
      let taskArray = value.split('\n')
      //ensuring no empty lines included
      taskArray = taskArray.filter(function (e) { return e != "" });
      console.log(taskArray);
      //ERROR HANDLE HERE
      for (let i = 0; i < taskArray.length; i++) {
        //this first if is because new stops were throwing error because didnt have tasks aray
        if (!scheduleData.stopsData[stopIndex].tasks) {
          scheduleData.stopsData[stopIndex].tasks = []
        }
        //if its a new task (ie no task obj already existed), creating task obj.
        if (!scheduleData.stopsData[stopIndex].tasks[i]) {
          scheduleData.stopsData[stopIndex].tasks[i] = {
            completion_status: null,
            schedule_stop_id: scheduleData.stopsData[stopIndex].schedule_stop_id,
            task: taskArray[i]
          }
        } else {
          scheduleData.stopsData[stopIndex].tasks[i].task = taskArray[i]
        }
      }
      //removing task objs if the tasks are now deleted i think?
      if (scheduleData.stopsData[stopIndex].tasks.length > taskArray.length) {
        scheduleData = scheduleData.stopsData[stopIndex].tasks.slice(taskArray.length)
      }
      //scheduleDataB.stopsData[stopIndex].tasks.task = value;
      if (!scheduleData.stopsData) console.log('issue');
      if (!scheduleData.stopsData[stopIndex].tasks) return
    }
    //const { scheduleData, customerList } = this.state;
    
    this.setState({ scheduleData });
  };

  //simply adds stop to state scheudledata
  addStopRow = () => {
    const { scheduleData } = this.state;
    scheduleData.stopsData.push({
      address: '',
      customer_id: '',
      customer_name: '',
      schedule_stop_id: null,
      stop_number: scheduleData.stopsData.length + 1,
      stops: []
    })
    this.setState({ scheduleData })
  }

  //just removes stop from scheduledata and updates state
  deleteStopRow = (e, stop_number) => {
    console.log(stop_number);
    const { scheduleData } = this.state;
    const filteredStops = scheduleData.stopsData.filter((stop) => stop.stop_number !== stop_number)
    for (let i = 0; i < filteredStops.length; i++) {
      if (filteredStops[i].stop_number > stop_number) {
        filteredStops[i].stop_number = filteredStops[i].stop_number - 1;
      }
    }
    scheduleData.stopsData = filteredStops
    this.setState({ scheduleData })
  }


  //renders the table of each stop with its tasks.
  //not complex, just long.
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
            <select id={`customerSelect${stopsData[i].stop_number}`} onChange={(e) => this.handleCustomerChange(i, parseInt(e.target.value))}>
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
          <input
            type="button"
            onClick={(e) => this.deleteStopRow(e, stopsData[i].stop_number)}
            value="delete row"
          />
        </tr>
      );
      tableRows.push(tableRow);
    }
    return tableRows;
  };
  //renders list of drivers as <options> for dropdown.


//simple func to render tasks in textbox on each new line
  renderTasks = (tasks) => {
    //console.log(tasks);
  //  console.log('resnder tasks');
    if (!tasks) return '';
    //console.log('tasks didnt return, is rendering');
    //putting new line between tasks (notbefore the first task)
    const returnValue = tasks.map((task, index) => index !== 0 ? '\n' + task.task : task.task);
    //console.log(returnValue);
    return returnValue;
  };

//renders list of option tags with given value from state array, option for multiple params to allow dif options.
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

  //for each route in routelist , renders name (to be selected if want to change default route)
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

  //rendering before driver selected just driver sropdown and message,
  //after editable option for each scheudla data point, updating state, and tanle of all stops with customers and tasks.
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
          {this.renderOptions("driver", "username")}
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
              {this.renderOptions("driver", "username")}
              {/*<option value={() => document.getElementById("new-driver").value}>
                New Driver
              </option>*/}
            </select>
            <br />
            {/*<label htmlFor="new-driver">new driver</label>
            <br />
            <input
              id="new-driver"
              onChange={(e) => this.handleChange("driver", e.target.value)}
            ></input>
            <br />
            <br />*/}
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
              {/**renders the table of all the stops and their tasks */}
              <tbody>{this.renderTable()}</tbody>
            </table>
            <button onClick={this.addStopRow}>add row</button>
            <br />
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
