import React from 'react';

class DisplayCurrentRoute extends React.Component {
    state = {
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

   
    fetchTasksData = (stopId) => {
        console.log('gettasks running');
        const url = `https://allin1ship.herokuapp.com/getDailyTasks/${stopId}`;
        fetch(url)
        .then(response => response.json())
        .then(json => this.setState({[`tasks${stopId}`]: json}))
        .then(() => console.log(this.state))
        .catch(err => console.log(err))
    }

    handleDriverChange = (e) => {
        this.setState({selectedDriver: e.target.value})
        fetch(`https://allin1ship.herokuapp.com/getcurrentRouteDetails/${e.target.value}`)
            .then(response => response.json())
            .then(json => {
                this.setState({routeData: json})
                this.fetchTasksData(json[0].schedule_stop_id)
            })
    }

    render() {
        const { routeData } = this.state;

        const optionsDrivers = this.state.drivers && this.state.drivers.map((driver) => 
            <option key={driver.driver}>{driver.driver}</option>
        );


        const renderRouteDetails = routeData && this.state.routeData.map((stop) => <tr>
            <td>{stop.stop_number}</td>
            <td>{stop.customer_name}</td>
            <td>{stop.number_packages}</td>
            <td>{stop.feedback}</td>
            <td>{stop.check_in_time}</td>
            <td>{stop.check_out_time}</td>
            <td>{stop.completion_status}</td>
        </tr>            
        )

        return <div style={{padding: '15px'}}>            
             <main className='DisplayCurrentRoute'>
                    DRIVER:<br/>
                    <select onChange={this.handleDriverChange}>
                        <option value="none" selected disabled hidden> 
                            Select a Driver 
                        </option>
                        {optionsDrivers}
                    </select><br/><br/>
                    
                    {routeData && <div>
                        <p>Vehicle: {routeData[0].vehicle}</p>
                        <p>Route: {routeData[0].route_name}</p><br/>
                        <p>Dropoff Info: {routeData[0].dropoff_info}</p>
                    </div>
                    }
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
                            {renderRouteDetails}
                        </tbody>
                    </table>
            </main>
        </div>
    }

}


export default DisplayCurrentRoute;