import React from 'react';
import { Link } from 'react-router-dom';

class CreateSchedule extends React.Component {
    state = {
        newScheduleNumber: '_',
        drivers: null,
        routes: [{
            "id": 1
        },
           {"id": 2
        }],
        vehicles: null,
        routeData: null,
        selectedRoute: '',
        selectedDate: null,
        selectedDriver: null,
        selectedVehicle: null,
        routeTableData: [],
        selectedDropOffInfo: 'Thank you for working hard today, your work means a lot and we appreciate the extra you put in',
        customersList: (givenData) => givenData && givenData.map((customer) => 
            <option key={customer.customer_id} value={customer.customer_id} >{customer.customer_name}</option>
            )
    }

    getNewScheduleNumber = () => {
        //fetch length of route_list and sets newRouteNumber to it + 1
        fetch("https://allin1ship.herokuapp.com/getNumberSchedules")
        .then(response => response.json())
        .then(json => this.setState({newScheduleNumber: json[0]["COUNT(*)"] + 1}))
        .then(() => console.log(this.state))
        .catch(err => console.log(err))
    }

    getCustomersData = () => {
        console.log('getcustoemrsdata running');
        const url = "https://allin1ship.herokuapp.com/getCustomersData";
        fetch(url)
        .then(response => response.json())
        .then(json => this.setState({customersData: json}))
        .then(() => console.log(this.state))
        .catch(err => console.log(err))
    }

    addRouteRow = () => {
        const { routeTableData } = this.state;
        const tableRow = (<tr>
            <td id={`stopNumber${routeTableData.length + 1}`}>{routeTableData.length + 1}</td>
            <td id={routeTableData.length + 1}><select id={`customerSelect${routeTableData.length + 1}`}><option value="none" selected disabled hidden> 
                        Select Customer
                    </option>{this.state.customersData && this.state.customersList(this.state.customersData)}</select></td>
            <td contentEditable="true"  ><textarea onChange={tasktext => this.setState({[`tasks${routeTableData.length + 1}`]: tasktext })}
                rows='3' cols='35' id={`tasks${routeTableData.length + 1}`}  value={this.state[`tasks${routeTableData.length + 1}`]} name={`taskTextArea${routeTableData.length + 1}`}
            >
            </textarea></td> 
            {/*<button type='button' onClick={() => this.deleteRouteRow(routeTableData.length + 1)}>delete row</button>*/}
        </tr>)
        console.log(tableRow);
        this.setState({routeTableData: [...this.state.routeTableData, tableRow]})
    }
    deleteRouteRow = (rowNumber) => {
        //somehow delete selected row from state. shdnt be too hard with stop_number
        //NOT WOKRING - RIGHT NOW DELETES FIRST ROW...
        console.log('deleterouterow');
        console.log('befrore splice:', this.state.routeTableData);
        let routeTableData = this.state.routeTableData.slice(rowNumber, 1).concat(this.state.routeTableData.slice(rowNumber));
        this.setState({routeTableData})
        console.log('aftersplice:', this.state.routeTableData);
        
    }
    

    setRouteTableData = () => {
        this.setState({routeTableData: []})
        console.log(this.state.routeData);
        //
        const { routeData } = this.state;
        for (let i=0;i<routeData.length;i++) {
            const tableRow = (<tr>
                <td id={`stopNumber${routeData[i].stop_number}`}>{routeData[i].stop_number}</td>
                <td id={routeData[i].stop_number}><select id={`customerSelect${routeData[i].stop_number}`}><option key='0' value={routeData[i].customer_id} >{routeData[i].customer_name}</option>{this.state.customersData && this.state.customersList(this.state.customersData)}</select></td>
                <td><textarea onChange={tasktext => this.setState({[`tasks${routeData[i].stop_number}`]: tasktext })}
                    rows='3' cols='35' id={`tasks${routeData[i].stop_number}`} defaultValue={this.state[`tasks${routeData[i].stop_number}`]} name={`taskTextArea${routeData[i].stop_number}`}
                ></textarea></td> 
                {/*<button type='button' onClick={() => this.deleteRouteRow(routeData[i].stop_number)}>delete row</button>*/}
            </tr>)
            this.setState({routeTableData: [...this.state.routeTableData, tableRow]})
        }
    }

    formatTasks = (json, stopi) => {
        let formatArray = [];
        for (let i=0;i<json.length;i++) {
            formatArray.push(json[i].task)
        }
        let formattedTasks = formatArray.join('\n')

        this.setState({[`tasks${stopi+1}`]: formattedTasks}) 
    }

    getTasks = (stop_ids) => {    
        console.log('stop_ids', stop_ids);    
        this.setState({stopTasks: []})
        for (let i=0;i<stop_ids.length;i++) {
            console.log('stopid[i]=', stop_ids[i]);
            const url = "https://allin1ship.herokuapp.com/getRouteTasks/" + stop_ids[i];
            fetch(url)
            .then(response => response.json())
            .then(json => this.formatTasks(json, i))
            .then(() => this.setRouteTableData())
            .catch(err => console.log(err))
        }
        console.log('finished fetching stops tasks', this.state);
    }

    getRouteData = () => {
        this.setState({routeData: null})
        const url = "https://allin1ship.herokuapp.com/singleRouteDisplay/" + document.getElementById("selectRoute").value;
        fetch(url)
        .then(response => response.json())
        .then(json => {
            this.setState({routeData: json})
            console.log(json);
            this.getTasks(json.map((obj) => obj.id))
        })
        //.then(() => this.getTasks(this.state.routeData.map(obj => obj.id)))
        //move insidefetchstops?.then(() => this.setRouteTableData())
        .catch(err => console.log(err))
    }

    getDrivers = () => {
        fetch("https://allin1ship.herokuapp.com/getDrivers")
        .then(response => response.json())
        .then(json => this.setState({drivers: json}))
        .catch(err => console.log(err))
    }

    getVehicles = () => {
        fetch("https://allin1ship.herokuapp.com/getVehicles")
        .then(response => response.json())
        .then(json => this.setState({vehicles: json}))
        .catch(err => console.log(err))
    }    

    getRoutes = () => {
        fetch("https://allin1ship.herokuapp.com/getNumberRoutes")
        .then(response => response.json())
        .then(json => this.setState({routes: json}))
        .then(e => console.log(this.state.routes))
        .catch(err => console.log(err))
    }

    componentDidMount() {
        this.getVehicles()
        this.getDrivers()
        this.getRoutes()
        this.getCustomersData()
        this.getNewScheduleNumber()
    }

    onSuccessfulPost = () => {
        alert('all successfully posted')
    }
    postSchedule = () => {
        const postData = {
            selectedDefaultRoute: this.state.selectedRoute,
            selectedDate: this.state.selectedDate,
            selectedDriver: this.state.selectedDriver,
            selectedVehicle: this.state.selectedVehicle,
            selectedDropOffInfo: this.state.selectedDropOffInfo
        }
        console.log('handlesubmit', JSON.stringify(postData));
        fetch("https://allin1ship.herokuapp.com/postSchedule", {
            method: "POST",  
            headers: {
                "Content-Type": "application/json"},
            body: JSON.stringify(postData)
        }).then((response) => {
            //for each row in state.routeStopsData
            if (response.ok) for (let i=0;i<this.state.routeTableData.length;i++) {
                this.postScheduleStops(i)
            }
        }).then(() => alert('schedule successfully posted')
        )
    }
    
    postStopTask = (tasks, schedule_stop_id) => {
        console.log(tasks);
        const taskArray = tasks.replace(/\r\n/g,"\n").split("\n").filter(line => line);
        console.log(taskArray, schedule_stop_id);
        for (let i=0;i<taskArray.length;i++) {
        fetch(`https://allin1ship.herokuapp.com/postStopTask/${schedule_stop_id}`, {
            method: "POST",  
            headers: {
                "Content-Type": "application/json"},
            body: JSON.stringify({task: taskArray[i]})
        }).then(function(response) {
            console.log('stop_task successfully posted', response)
            //this.onSuccessfulPost()
        })
    }
    }
    postScheduleStops = (i) => {
        console.log('postScheduleStops: ,', i);
        //for line in taskbox, run this.postStopTask(task, schedule_stop_id)
        const postStopData = {
            //customerSelect[i], task[i], (taskTextArea[i]) stopNumber[i]
            stopNumber:  document.getElementById(`stopNumber${i+1}`).innerText,
            scheduleId: this.state.newScheduleNumber, ////where to get scheduleId from??
            customerId: document.getElementById(`customerSelect${i+1}`).value// in state needs to be set from dropdown value?
        } 
        console.log('handlesubmitstop', JSON.stringify(postStopData));
        fetch("https://allin1ship.herokuapp.com/postScheduleStops", {
            method: "POST",  
            headers: {
                "Content-Type": "application/json"},
            body: JSON.stringify(postStopData)
        }).then((response) => {
            if(response.ok) {
                return response.json()
            }
            else {throw new Error(response.statusText) }
/*
            console.log('sched_stop successfully posted');
            this.postStopTask(stopData.tasks)
            return response.json();*/
    
        }).then(json => this.postStopTask(document.getElementById(`tasks${i+1}`).value, json))
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.postSchedule();
        /*for each row in state.routeStopsData
        for (let i=0;i<this.state.routeTableData.length;i++) {
        this.postScheduleStops(i)
        }*/
    }
/*
    //this.state.routeData[i].comments
    handleCommentChanges = () => {
        for (let i=0;i<this.state.routeData.length;i++) {
            console.log(document.getElementById(`${i}`));
            let commentsObj = {
                key: i,
                comment: 'document.getElementById(`${i}`).value'
            }
        
            console.log(commentsObj);
            fetch(`http://192.168.1.137:8000/postChangedComments/${this.state.selectedRoute}`, {
                method: "POST",  
                headers: {
                    "Content-Type": "application/json"},
                body: JSON.stringify(commentsObj)
            }).then(function(response) {
                console.log(response)
                alert('comment successfully posted');
                return response.json();
        })
    }
    } */
    /*handleCommentButton = (stop_number, comments) => {
            const commentsObj = {
                key: stop_number,
                comment: comments 
            }
        
            console.log(commentsObj);
            fetch(`https://allin1ship.herokuapp.com/postChangedComments/${this.state.selectedRoute}`, {
                method: "POST",  
                headers: {
                    "Content-Type": "application/json"},
                body: JSON.stringify(commentsObj)
            }).then(response =>  {
                console.log(response)
                return response.json();
        })
    }*/
/*
    handleComment = (e) => {
        const commentsObj = {
            key: e.target.id,
            comment: e.target.value
        }
    
        console.log(commentsObj);
        fetch(`http://192.168.1.137:8000/postChangedComments/${this.state.selectedRoute}`, {
            method: "POST",  
            headers: {
                "Content-Type": "application/json"},
            body: JSON.stringify(commentsObj)
        }).then(response =>  {
            console.log(response)
            return response.json();
    })
}*/

    handleRouteChange = (e) => {
        console.log(document.getElementById("selectRoute").value)
        this.setState({selectedRoute: e.target.value})
        this.getRouteData()
    }

    handleTextChange = (e) => {
        this.setState({selectedDropOffInfo: e.target.value})
    }

    handleDriverChange = (e) => {
        console.log(this.state);
        e.target.value !== 'none' && this.setState({selectedDriver: e.target.value})
    }

    handleVehicleChange = (e) => {
        this.setState({selectedVehicle: e.target.value})        
    }

    handleDateChange = (e) => {
        let selectedDate = e.target.value;
        this.setState({selectedDate})     
    }
    render() {

        const optionsDrivers = this.state.drivers && this.state.drivers.map((driver) => 
            <option key={driver.driver}>{driver.driver}</option>
        );

        const optionsRoutes = this.state.routes && this.state.routes.map((route) => 
            <option key={route.id} value={route.id}>{route.id} - {route.route_name}</option>
        );

        const optionsVehicles = this.state.vehicles && this.state.vehicles.map((vehicle) => 
            <option key={vehicle.vehicle}>{vehicle.vehicle}</option>
        );

        return <div style={{padding: '15px'}}>            
             <main className='CreateSchedule'>
                <form onSubmit={this.handleSubmit}>
                <br/><legend>New Schedule #{this.state.newScheduleNumber}</legend><br/>
                    <label htmlFor="schedule-date">Date:</label><br/>
                    <input type="date" id="schedule-date" required onChange={this.handleDateChange}/><br/><br/>
                   
                    DRIVER:<br/>
                    <select onChange={this.handleDriverChange}>
                    <option value="none" selected disabled hidden> 
                        Select a Driver 
                    </option>
                        {optionsDrivers}                   
                    </select><br/>
                    VEHICLE:{this.state.selectedVehicle}<br/>                    
                    <select required onChange={this.handleVehicleChange}>
                        <option value="none" selected disabled hidden>
                            Choose a Vehicle 
                        </option>
                        {optionsVehicles}
                        <option value={() => document.getElementById('new-vehicle').value} > 
                            New Vehicle
                        </option>
                        {/*<option value='newVehicle'>New Vehicle</option>*/}
                    </select><br/><label htmlFor='new-vehicle'>new vehicle</label><br/>
                    <input id='new-vehicle' onChange={this.handleVehicleChange} ></input><br/><br/>
                    DROP OFF INFO:<br/>
                    <textarea 
                    onChange={this.handleTextChange}
                    name='comment'
                    rows="8" cols="50"
                    >Thank you for the hard work today, it is greatly appreciated.

                    You’re the front line workers in our company and your hard work shows!
                    
                    Please park the van, near the office, if you cannot find parking you can always use the driveway at 740 Montgomery St,
                    (The driveway is narrow so just be alert).
                    
                    Rest up, looking forward to seeing you at the next drive!</textarea><br/><br/>
                    ROUTE:<br/> {/*drop down of number for each route_id from fetched data.*/}
                    <select id='selectRoute' onChange={this.handleRouteChange}>
                        <option value="" selected disabled hidden>Choose Route</option>
                        {optionsRoutes}
                    </select><br/>
                    <table>
                        <thead>
                            <tr><th>selected route #:{this.state.selectedRoute}</th></tr>
                            {this.state.routeData && <tr>
                                <th>Stop #</th>
                                <th>Address</th>
                                <th className='editable'>Tasks-Each New Line is a New Task.</th>
                            </tr>}
                        </thead>
                        <tbody>
                            {this.state.routeTableData}
                        </tbody>
                       <button type='button' onClick={() => this.addRouteRow()}>add row</button>
                    </table>


                    <button type='submit'>SUBMIT</button><br/>
                </form>
                
                <Link to='/create-route'><button>CREATE NEW ROUTE</button></Link>
            </main>
        </div>
    }

}


export default CreateSchedule;