import React from 'react';
import { Link } from 'react-router-dom';

class CreateSchedule extends React.Component {
    state = {
        drivers: null,
        routes: [{
            "id": 3
        },
           {"id": 4
        }],
        vehicles: null,
        routeData: null,
        selectedRoute: '1',
        selectedDate: null,
        selectedDriver: null,
        selectedVehicle: null,
        selectedDropOffInfo: 'default text goes here - CHANGE ME IN STATE',
    }

    getRouteData = () => {
        const url = "https://allin1ship.herokuapp.com/singleRouteDisplay/" + this.state.selectedRoute;
        fetch(url)
        .then(response => response.json())
        .then(json => this.setState({routeData: json}))
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
        .catch(err => console.log(err))
    }

    componentDidMount() {
        this.getVehicles()
        this.getDrivers()
        this.getRoutes()
        this.getRouteData()
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const postData = {
            selectedRoute: this.state.selectedRoute,
            selectedDate: this.state.selectedDate,
            selectedDriver: this.state.selectedDriver,
            selectedVehicle: this.state.selectedVehicle,
            selectedDropOffInfo: this.state.selectedDropOffInfo
        }
        console.log('handlesubmit', JSON.stringify(postData));
        fetch("http://192.168.1.137:8000/postSchedule", {
            method: "POST",  
            headers: {
                "Content-Type": "application/json"},
            body: JSON.stringify(postData)
        }).then(function(response) {
            console.log(response)
            alert('schedule successfully posted');
            return response.json();
        })
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
    handleCommentButton = (stop_number, comments) => {
            const commentsObj = {
                key: stop_number,
                comment: comments 
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
    }
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
        this.setState({selectedRoute: e.target.value})
        this.getRouteData()
    }

    handleTextChange = (e) => {
        this.setState({selectedDropOffInfo: e.target.value})
    }

    handleDriverChange = (e) => {
        this.setState({selectedDriver: e.target.value})
    }

    handleVehicleChange = (e) => {
        this.setState({selectedVehicle: e.target.value})        
    }

    handleDateChange = (e) => {
        let selectedDate = e.target.value;
        this.setState({selectedDate})     
    }
    render() {

        let tableRouteData = this.state.routeData && this.state.routeData.map((stop) => 
            <tr>
                <td>{stop.stop_number}</td>
                <td>{stop.address}</td>
                <td contentEditable="true" id={stop.address} >{stop.comments}</td> 
                {/*<input type='text' id={stop.stop_number} defaultValue={stop.comments} onChange={() => this.handleComment}></input>*/}
                <button type='button' onClick={() => this.handleCommentButton(stop.stop_number, document.getElementById(`${stop.address}`).innerText)}>submit comment</button>
            </tr>  
        )
        const optionsDrivers = this.state.drivers && this.state.drivers.map((driver) => 
            <option key={driver.driver}>{driver.driver}</option>
        );

        const optionsRoutes = this.state.routes && this.state.routes.map((route) => 
            <option key={route.id}>{route.id}</option>
        );

        const optionsVehicles = this.state.vehicles && this.state.vehicles.map((vehicle) => 
            <option key={vehicle.vehicle}>{vehicle.vehicle}</option>
        );

        return <div>            
             <main className='CreateSchedule'>
                <form onSubmit={this.handleSubmit}>
                <br/><legend>Create Schedule Form</legend><br/>
                    <label htmlFor="schedule-date">Date: yyyy-mm-dd</label><br/>
                    <input type="date" id="schedule-date" required onChange={this.handleDateChange}/> SET DEFAULT TO TODAY!<br/><br/>
                   
                    DRIVER: drop down menu from fetched data<br/>
                    <select required onChange={this.handleDriverChange}>
                    <option value="none" selected disabled hidden> 
                        Select a Driver 
                    </option>
                        {optionsDrivers}
                    </select><br/><br/>
                    VEHICLE: drop down menu from fetched data<br/>
                    <select required onChange={this.handleVehicleChange}>
                    <option value="none" selected disabled hidden> 
                        Select a vehicle 
                    </option>
                        {optionsVehicles}
                    </select><br/><br/>
                    DROP OFF INFO: text input box<br/>
                    <textarea 
                    onChange={this.handleTextChange}
                    name='comment'>default text goes here</textarea><br/><br/>
                    ROUTE: drop down of number for each route_id from fetched data.<br/>
                    <select onChange={this.handleRouteChange}>
                        {optionsRoutes}
                    </select><br/><br/>
                    display box of fetched route according to route selection 
                    each stop_number, address, and an editable notes box.<br/>
                    TABLE TO DISPLAY DATA:
                    <table>
                        <thead>
                            <tr><th>selected route #:{this.state.selectedRoute}</th></tr>
                            <tr>
                                <th>Stop #</th>
                                <th>Address</th>
                                <th className='editable'>Comments</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableRouteData}
                        </tbody>
                       {/*<button onClick={this.handleCommentChanges}>submit comment changes</button>*/}
                    </table>


                    <button type='submit'>SUBMIT</button><br/>
                </form>
                
                <Link to='/create-route'><button>CREATE NEW ROUTE</button></Link>
            </main>
        </div>
    }

}


export default CreateSchedule;