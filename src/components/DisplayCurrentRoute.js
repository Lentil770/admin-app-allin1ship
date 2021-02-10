import React from 'react';

import '../style/displayCurrentRoute.css';

class DisplayCurrentRoute extends React.Component {
    state = {
        taskTable: [],
        selectedDate: new Date().toISOString().split('T')[0],
    }

    getDrivers = () => {
        console.log('getdrviers running');
        const url = "https://allin1ship.herokuapp.com/getDrivers";
        fetch(url)
        .then(response => response.json())
        .then(json => this.setState({drivers: json}))
        .then(() => console.log(this.state))
        .catch(err => console.log(err))
    }

    
    componentDidMount() {
        console.log('componentDidMount');
        this.getDrivers();
    }

   
    fetchTasksData = (stopId, index) => {
        console.log('gettasks running');
        const url = `https://allin1ship.herokuapp.com/getDailyTasks/${stopId}`;
        fetch(url)
        .then(response => response.json())
        .then(json => this.setState({[`tasks${index}`]: json}, this.renderTask(index, json)))
        .catch(err => console.log(err))
    }

    fetchRoute = (driver, selectedDate) => {
        this.setState({taskTable: []})
        console.log(`https://allin1ship.herokuapp.com/getcurrentRouteDetails2/${driver}/${encodeURI(selectedDate)}`);
        fetch(`https://allin1ship.herokuapp.com/getcurrentRouteDetails2/${driver}/${encodeURI(selectedDate)}`)
            .then(response => response.json())
            .then(json => {
                this.setState({routeData: json})
                for (let i=0;i< json.length;i++) {                    
                this.fetchTasksData(json[i].schedule_stop_id, i)
                }
            })
    }
    handleDriverChange = (e) => {
        this.setState({selectedDriver: e.target.value}, this.fetchRoute(e.target.value, this.state.selectedDate))
        
    }

    renderTaskDetails = () => {
        let taskDetailsTable = []
        console.log(this.state);
        //need to somehow render tasks here. not supposesd to be so had. for each stop, if tasks, render each on new line with stop#, task and completed.
        for (let i=0;i<this.state.routeData.length;i++) {
            if (this.state[`tasks${i}`].length>0) taskDetailsTable.push(<tr><td>{i+1}</td><td>{this.state[`tasks${i}`][0].task}</td></tr>)
        }
        return taskDetailsTable;
    }

    renderTask = (index, json) => {
        console.log(json);
        json.length>0 && this.state.taskTable.push(<tr>
            <td  >{index+1}</td>
            {json.map(task => <><td className={`currentRouteTd ${task.completion_status==='complete' ? 'taskComplete' : 'taskIncomplete'}`} >{task.task}</td><td className='currentRouteTd' >{task.completion_status ? task.completion_status : 'incomplete'}</td></>)}    
        </tr>)
    }

    handleDateChange = (e) => {
        let selectedDate = e.target.value;
        this.setState({selectedDate}, this.fetchRoute(this.state.selectedDriver, selectedDate))
    }

    render() {
        const { routeData } = this.state;

        const optionsDrivers = this.state.drivers && this.state.drivers.map((driver) => 
            <option key={driver.driver}>{driver.driver}</option>
        );


        const renderRouteDetails = routeData && this.state.routeData.map((stop) => <tr>
            <td >{stop.stop_number}</td>
            <td className='currentRouteTd' >{stop.customer_name}</td>
            <td className='currentRouteTd' >{stop.number_packages ? stop.number_packages : 'n/a'}</td>
            <td className='currentRouteTd' >{stop.feedback ? stop.feedback : 'n/a' }</td>
            <td className='currentRouteTd' >{stop.check_in_time ? stop.check_in_time.substring(11, 19) : 'n/a'}</td>
            <td className='currentRouteTd' >{stop.check_out_time ? stop.check_out_time.substring(11, 19) : 'n/a' }</td>
            <td className='currentRouteTd' >{stop.completion_status ? stop.completion_status : 'incomplete'}</td>
        </tr>            
        )

        const todaysDate = new Date().toISOString().split('T')[0];

        return <div style={{padding: '15px'}}>            
             <main className='DisplayCurrentRoute'>
                    DRIVER:<br/>
                    <select onChange={this.handleDriverChange}>
                        <option value="none" selected disabled hidden> 
                            Select a Driver 
                        </option>
                        {optionsDrivers}
                    </select><br/><br/>

                    {routeData && <><label htmlFor="schedule-date">View schedule for:</label>
                    <input type="date" id="schedule-date" defaultValue={todaysDate} onChange={this.handleDateChange}/><br/><br/></>}
                   
                    
                    {routeData && routeData[0] && <div>
                        <p>Vehicle: {routeData[0].vehicle}</p>
                        <p>Route: {routeData[0].route_name}</p>
                        <p>Dropoff Info: {routeData[0].dropoff_info}</p>
                    </div>
                    }
                    <br/>
                    <table>
                        <thead>
                            {routeData && <tr>
                                <th>Stop #</th>
                                <th>Customer Name</th>
                                <th>Packages</th>
                                <th>Feedback</th>
                                <th>Check-in Time</th>
                                <th>Completion Time</th>
                                <th>Stop Status</th>
                            </tr>}
                        </thead>
                        <tbody>
                            {routeData && renderRouteDetails}
                        </tbody>
                    </table>
                    {routeData && <><h2>TASKS</h2>
                    <table>
                        <thead>
                            {this.state.tasks0 && <tr>
                                <th>Stop #</th>
                            </tr>}
                        </thead>
                        <tbody>
                            {this.state.taskTable.sort((a, b) => a.schedule_stop_id - b.schedule_stop_id)}
                        </tbody>
                    </table></>}
            </main>
        </div>
    }

}


export default DisplayCurrentRoute;