import React from 'react';

class EditSchedule extends React.Component {
    state = {
        routeTableData: [],
        customersList: (givenData) => givenData && givenData.map((customer) =>
            <option key={customer.customer_id} value={customer.customer_id} >{customer.customer_name}</option>
        )
    }
    //works:)
    fetchDrivers = () => {
        console.log('fetchschedules running');
        const url = "https://allin1ship.herokuapp.com/getDrivers";
        fetch(url)
            .then(response => response.json())
            .then(json => this.setState({ driverList: json }))
            .then(() => console.log(this.state))
            .catch(err => console.log(err))
    }
    //wroks:)
    getVehicles = () => {
        fetch("https://allin1ship.herokuapp.com/getVehicles")
            .then(response => response.json())
            .then(json => this.setState({ vehiclesList: json }))
            .catch(err => console.log(err))
    }
    //works:)
    getRoutes = () => {
        fetch("https://allin1ship.herokuapp.com/getNumberRoutes")
            .then(response => response.json())
            .then(json => this.setState({ routesList: json }))
            .then(() => console.log('gotroutes, routes:', this.state.routesList))
            .catch(err => console.log(err))
    }

    getCustomersData = () => {
        console.log('getcustoemrsdata running');
        const url = "https://allin1ship.herokuapp.com/getCustomersData";
        fetch(url)
            .then(response => response.json())
            .then(json => this.setState({ customersData: json }))
            .then(() => console.log(this.state))
            .catch(err => console.log(err))
    }

    componentDidMount() {
        console.log('componentDidMount');
        this.fetchDrivers();
        this.getVehicles();
        this.getRoutes();
        this.getCustomersData();
    }

    setRouteTableData = () => {
        //this.setState({routeTableData: []})
        console.log(this.state.routeData);
        const { routeData } = this.state;
        let arrayToRender = []

        for (let i = 0; i < routeData.length; i++) {
            let tableRow = (<tr>
                <td id={`stopNumber${routeData[i].stop_number}`}>{routeData[i].stop_number}</td>
                <td id={routeData[i].stop_number}><select id={`customerSelect${routeData[i].stop_number}`}><option key='0' value={routeData[i].customer_id} >{routeData[i].customer_name}</option>{this.state.customersData && this.state.customersList(this.state.customersData)}</select></td>
                <td ><textarea onChange={tasktext => this.setState({ [`tasks${routeData[i].stop_number}`]: tasktext.target.value })}
                    rows='3' cols='35' id={`tasks${routeData[i].stop_number}`} defaultValue={this.state[`tasks${routeData[i].stop_number}`]} name={`taskTextArea${routeData[i].stop_number}`}
                ></textarea></td>
                <input type='button' onClick={(e) => this.deleteRouteRow(e, routeData[i].stop_number)} value='delete row' />
            </tr>)
            arrayToRender.push(tableRow)
        }
        this.setState({ routeTableData: arrayToRender })
    }

    setNewRouteTableData = (routeJson) => {
        this.setState({ routeTableData: [] })
        console.log(this.state.routeData, routeJson);
        let newRouteData = routeJson;
        for (let i = 0; i < newRouteData.length; i++) {
            const tableRow = (<tr>
                <td id={`stopNumber${newRouteData[i].stop_number}`}>{newRouteData[i].stop_number}</td>
                <td id={newRouteData[i].stop_number}><select id={`customerSelect${newRouteData[i].stop_number}`}><option key='0' value={newRouteData[i].customer_id} >{newRouteData[i].customer_name}</option>{this.state.customersData && this.state.customersList(this.state.customersData)}</select></td>
                <td ><textarea onChange={tasktext => this.setState({ [`tasks${newRouteData[i].stop_number}`]: tasktext.target.value })}
                    rows='3' cols='35' id={`tasks${newRouteData[i].stop_number}`} defaultValue={this.state[`tasks${newRouteData[i].stop_number}`]} name={`taskTextArea${newRouteData[i].stop_number}`}
                ></textarea></td>
                <input type='button' onClick={(e) => this.deleteRouteRow(e, newRouteData[i].stop_number)} value='delete row' />
                {/*<button type='button' onClick={() => this.deleteRouteRow(newRouteData[i].stop_number)}>delete row</button>*/}
            </tr>)
            this.setState({ routeTableData: [...this.state.routeTableData, tableRow] })
        }
    }

    addRouteRow = () => {
        const { routeTableData } = this.state;
        const tableRow = (<tr key={`stopNumber${routeTableData.length + 1}`}>
            <td id={`stopNumber${routeTableData.length + 1}`}>{routeTableData.length + 1}</td>
            <td id={routeTableData.length + 1}><select id={`customerSelect${routeTableData.length + 1}`}><option value="none" selected disabled hidden>
                Select Customer
                    </option>{this.state.customersData && this.state.customersList(this.state.customersData)}</select></td>
            <td ><textarea onChange={tasktext => this.setState({ [`tasks${routeTableData.length + 1}`]: tasktext.target.value })}
                rows='3' cols='35' id={`tasks${routeTableData.length + 1}`} defaultValue={this.state[`tasks${routeTableData.length + 1}`]} name={`taskTextArea${routeTableData.length + 1}`}
            >
            </textarea></td>
            <input type='button' onClick={(e) => this.deleteRouteRow(e, routeTableData.length + 1)} value='delete row' />
            {/*<button type='button' onClick={() => this.deleteRouteRow(routeTableData.length + 1)}>delete row</button>*/}
        </tr>)
        this.setState({ routeTableData: [...this.state.routeTableData, tableRow] })
        this.setState({ routeData: [...this.state.routeData, { schedule_stop_id: null, customer_id: null, stop_number: routeTableData.length + 1, }] })
    }

    deleteRouteRow = (e, rowNumber) => {
        e.preventDefault()
        const { routeData } = this.state;
        const filteredRouteData = routeData.filter((route) => route.stop_number !== rowNumber)
        for (let i = 0; i < filteredRouteData.length; i++) {
            filteredRouteData[i].stop_number = i + 1
            if (i + 1 >= rowNumber) {
                let taskString = this.state[`tasks${i + 1}`];
                taskString = this.state[`tasks${i + 2}`] ? this.state[`tasks${i + 2}`] : '';
                this.setState({ [`tasks${i + 1}`]: taskString });
            }
        }
        console.log(filteredRouteData);
        this.setState({ routeData: filteredRouteData, routeTableData: [], [`tasks${filteredRouteData.length + 1}`]: '' }, this.setRouteTableData)
    }

    formatTasks = (json, stopi) => {
        let formatArray = [];
        for (let i = 0; i < json.length; i++) {
            formatArray.push(json[i].task)
        }
        let formattedTasks = formatArray.join('\n')

        this.setState({ [`tasks${stopi + 1}`]: formattedTasks })
    }

    getTasks = (stop_ids) => {
        console.log('stop_ids', stop_ids);
        this.setState({ stopTasks: [] })
        for (let i = 0; i < stop_ids.length; i++) {
            console.log('stopid[i]=', stop_ids[i]);
            const url = "https://allin1ship.herokuapp.com/getRouteTasks/" + stop_ids[i];
            console.log(url);
            fetch(url)
                .then(response => response.json())
                .then(json => this.formatTasks(json, i))
                .then(() => this.setRouteTableData())
                .catch(err => console.log(err))
        }
        console.log('finished fetching stops tasks', this.state);
    }

    getInitialRouteData = () => {
        this.setState({ routeData: [] })
        const url = "https://allin1ship.herokuapp.com/singleRouteDisplay/" + this.state.scheduleData[0].id;
        fetch(url)
            .then(response => response.json())
            .then(json => {
                this.setState({ routeData: json })
                this.getTasks(json.map((obj) => obj.schedule_stop_id))
            })
            .catch(err => console.log(err))
    }
    //deal with!
    getRouteData = () => {
        console.log('getroutedata running');
        this.setState({ routeData: [] })
        const url = "https://allin1ship.herokuapp.com/defaultRouteDisplay/" + document.getElementById("selectRoute").value;
        console.log(url);
        fetch(url)
            .then(response => response.json())
            .then(json => {
                console.log('getroutedata json:', json);
                this.setState({ routeData: json, routeTableData: [] }, this.setRouteTableData)
            }).catch(err => console.log(err))
    }

    //works:)
    getScheduleData = () => {
        this.setState({ scheduleData: null });
        //const url = "http://localhost:8000/singleScheduleDisplay/" + document.getElementById("selectSchedule").value;
        const url = "https://allin1ship.herokuapp.com/singleScheduleDisplay/" + document.getElementById("selectSchedule").value;
        console.log(url);
        fetch(url)
            .then(response => {
                if (response.ok) { return response.json() }
                else { throw new Error() }

            })
            .then(json => {
                this.setState({ scheduleData: json })
                this.setState({ selectedDropOffInfo: json[0].dropoff_info })
                this.setState({ selectedDate: json[0].schedule_date.substring(0, 10) })
                this.setState({ selectedVehicle: json[0].vehicle })
                this.setState({ selectedDriver: json[0].driver })
                this.setState({ selectedDefaultRoute: json[0].route_id })
            })
            .then(() => this.getInitialRouteData())
            .catch(err => console.log(err))

    }

    deleteStopTasks = (schedule_stop_id) => {
        console.log(schedule_stop_id);
        fetch(`https://allin1ship.herokuapp.com/deleteStopsTasks/${schedule_stop_id}`)
            .then(response => console.log('deleted tasks', response))
    }

    postStopTask = (tasks, schedule_stop_id) => {
        console.log('poststoptask running tasks: ', tasks, schedule_stop_id);
        const taskArray = tasks.replace(/\r\n/g, "\n").split("\n").filter(line => line);
        console.log(taskArray, schedule_stop_id);
        //this.deleteStopTasks(schedule_stop_id);
        for (let i = 0; i < taskArray.length; i++) {
            fetch(`https://allin1ship.herokuapp.com/postStopTask/${schedule_stop_id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ task: taskArray[i] })
            }).then(function (response) {
                console.log('stop_task successfully posted', response)
                //this.onSuccessfulPost()
            })
        }
    }

    postScheduleStops = (givenI) => {
        //for line in taskbox, run this.postStopTask(task, schedule_stop_id)
        const alterStopData = {
            stopNumber: document.getElementById(`stopNumber${givenI + 1}`).innerText,
            scheduleId: `${this.state.scheduleData[0].id}`, ////where to get scheduleId from??
            customerId: document.getElementById(`customerSelect${givenI + 1}`).value// in state needs to be set from dropdown value?
        }
        console.log('handlesubmitstop', JSON.stringify(alterStopData));
        fetch("https://allin1ship.herokuapp.com/postScheduleStop", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(alterStopData)
        }).then((response) => {
            if (response.ok) {
                this.postStopTask(this.state[`tasks${givenI + 1}`], this.state.routeData[givenI].schedule_stop_id)
                //return response.json()
            }
            else { throw new Error(response.statusText) }
        })//.then(json => this.postStopTask(this.state[`tasks${givenI+1}`], this.state.routeData[givenI].schedule_stop_id))
            .catch(err => console.log(err))
    }

    deleteScheduleStopTasks = (givenI) => {
        const stopId = this.state.routeData[givenI].schedule_stop_id;

        fetch(`https://allin1ship.herokuapp.com/deleteStopsTasks/${stopId}`).then((response) => {
            //for each row in state.routeStopsData
            if (response.ok) {
                console.log('sucessfully dropped tasks', stopId);
                this.deleteScheduleStops(givenI)
            }
        })
    }

    deleteScheduleStops = (givenI) => {

        fetch(`https://allin1ship.herokuapp.com/dropScheduleStops/${this.state.scheduleData[0].id}`).then((response) => {
            //for each row in state.routeStopsData
            if (response.ok) {
                console.log('drop stops successful');
                //for (let i=0;i<this.state.routeTableData.length;i++) {
                //this.deleteScheduleStopTasks(i)
                this.postScheduleStops(givenI)
                //}
            }
        })
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const postData = {//schedule_date=${req.body.selectedDate} , driver=${req.body.selectedDriver}, vehicle=${req.body.selectedVehicle}, dropoff_info=${req.body.selectedDropOffInfo}, route_id=${req.body.selectedDefaultRoute}`;
            selectedDate: this.state.selectedDate,
            selectedDriver: this.state.selectedDriver,
            selectedVehicle: this.state.selectedVehicle,
            selectedDropOffInfo: this.state.selectedDropOffInfo,
            selectedDefaultRoute: this.state.selectedDefaultRoute
        }
        console.log('handlesubmit', JSON.stringify(postData));
        fetch(`https://allin1ship.herokuapp.com/alterSchedule/${this.state.scheduleData[0].id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(postData)
        }).then((response) => {
            //for each row in state.routeStopsData
            if (response.ok) {
                for (let i = 0; i < this.state.routeTableData.length; i++) {
                    this.deleteScheduleStopTasks(i)
                }
                alert('schedule successfully posted')
            }
        })
    }

    handleRouteChange = (e) => {
        console.log('handle route change running selectroute dropdown value', document.getElementById("selectRoute").value)
        console.log(e.target.value);
        this.setState({ selectedDefaultRoute: e.target.value })
        this.getRouteData()
    }

    //works:) starts fetch for todays schedule for new seleceted driver
    handleScheduleChange = (e) => {
        //console.log('selectschedule.value = :', document.getElementById("selectSchedule").value)
        console.log('handleschedulechange', e.target.value);
        this.setState({ selectedSchedule: e.target.value })
        this.getScheduleData()
    }

    handleTextChange = (e) => {
        this.setState({ selectedDropOffInfo: e.target.value })
        console.log('handletextchange running', e.target);
    }

    handleDateChange = (e) => {
        let selectedDate = e.target.value;
        this.setState({ selectedDate })
    }

    handleDriverChange = (e) => {
        e.target.value !== 'none' && this.setState({ selectedDriver: e.target.value })
    }

    handleVehicleChange = (e) => {
        this.setState({ selectedVehicle: e.target.value })
    }

    render() {

        const driverOptions = this.state.driverList && this.state.driverList.map((driver, index) =>
            <option key={index} value={driver.username}>{driver.username}</option>
        );

        const vehicleOptions = this.state.vehiclesList && this.state.vehiclesList.map((vehicle, index) =>
            <option key={index} value={vehicle.vehicle}>{vehicle.vehicle}</option>
        );

        const routeOptions = this.state.routesList && this.state.routesList.map((route) =>
            <option key={route.id} value={route.id}>{route.id} - {route.route_name}</option>
        );

        const todaysDate = new Date().toISOString().split('T')[0];

        return <div style={{ padding: '15px' }}>
            <main className='EditSchedule'>

                <form onSubmit={this.handleSubmit}>
                    <br /><legend>Edit Schedule</legend><br />
                    <select id='selectSchedule' onChange={this.handleScheduleChange}>
                        <option value="" selected disabled hidden>Choose Schedule for driver:</option>
                        {driverOptions}
                    </select><br />

                    {this.state.routeData && <><label htmlFor="schedule-date">Change Date:</label><br />
                        <input type="date" id="schedule-date" defaultValue={todaysDate} onChange={this.handleDateChange} /><br /><br />

                    DRIVER:<br />
                        <select onChange={this.handleDriverChange}>
                            <option value={this.state.scheduleData && this.state.selectedSchedule} selected disabled hidden>
                                {this.state.scheduleData && this.state.selectedSchedule}
                            </option>
                            {driverOptions}
                            <option value={() => document.getElementById('new-driver').value} >
                                New Driver
                        </option>
                        </select><br />
                        <label htmlFor='new-driver'>new driver</label><br />
                        <input id='new-driver' onChange={this.handleDriverChange} ></input><br /><br />
                    VEHICLE:<br />
                        <select required onChange={this.handleVehicleChange}>
                            <option value={this.state.scheduleData && this.state.scheduleData[0].vehicle} selected disabled hidden>
                                {this.state.scheduleData && this.state.scheduleData[0].vehicle}
                            </option>
                            {vehicleOptions}
                            <option value={() => document.getElementById('new-vehicle').value} >
                                New Vehicle
                        </option>
                            {/*<option value='newVehicle'>New Vehicle</option>*/}
                        </select><br /><label htmlFor='new-vehicle'>new vehicle</label><br />
                        <input id='new-vehicle' onChange={this.handleVehicleChange} ></input><br /><br />
                    DROP OFF INFO:<br />
                        <textarea
                            rows="8" cols="50"
                            onChange={this.handleTextChange}
                            name='comment'
                            value={this.state.selectedDropOffInfo}
                        ></textarea><br /><br />
                    ROUTE:<br /> {/*drop down of number for each route_id from fetched data.*/}
                        <select id='selectRoute' onChange={this.handleRouteChange}>
                            <option value={this.state.scheduleData && this.state.scheduleData[0].route_id} selected disabled hidden>{this.state.scheduleData && this.state.scheduleData.route_id}</option>
                            {routeOptions}
                        </select><br />
                        <table>
                            <thead>
                                <tr><th>selected route #:{this.state.selectedDefaultRoute && this.state.selectedDefaultRoute}</th></tr>
                                <tr>
                                    <th>Stop #</th>
                                    <th>Address</th>
                                    <th className='editable'>Tasks</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.routeTableData}
                            </tbody>
                            <button type='button' onClick={() => this.addRouteRow()}>add row</button>
                        </table>
                        <button type='submit' style={{ color: 'white', backgroundColor: 'black', width: 300 }}>SUBMIT</button><br /></>}
                </form>

            </main>
        </div>
    }

}


export default EditSchedule;