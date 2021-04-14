import React from 'react';

class EditDefaultRoute extends React.Component {
    state = {
        routes: [{
            "id": 1
        },
           {"id": 2
        }],
        routeData: null,
        selectedRoute: '1',
        customersList: (givenData) => givenData && givenData.map((customer) => 
            <option key={customer.customer_id} value={customer.customer_id} >{customer.customer_name}</option>
            ),
        customersListB: (givenData) => givenData && givenData.map((customer) => 
            `<option key=${customer.customer_id} value=${customer.customer_id} >${customer.customer_name}</option>`
            )
    }

    getRouteData = () => {
        this.setState({routeData: null});
        const url = "https://allin1ship.herokuapp.com/defaultRouteDisplay/" + document.getElementById("selectRoute").value;
        console.log(url);
        fetch(url)
        .then(response => response.json())
        .then(json => {
            this.setState({routeData: json, routeTableData: []})
            console.log(json);
            //this.getTasks(json.map((obj) => obj.id))
        }).then(() => this.setRouteTableData())
        .catch(err => console.log(err))
    }

    getRoutes = () => {
        fetch("https://allin1ship.herokuapp.com/getNumberRoutes")
        .then(response => response.json())
        .then(json => this.setState({routes: json}))
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

    componentDidMount() {
        console.log('componentDidMount');
        this.getRoutes();
        this.getCustomersData();
    }
    
    postStopChanges = (i) => {
        console.log('poststopchanges running, i:', i, this.state.selectedRoute)
        const stopData = {
            key: i,
            stop_number: document.getElementById(`stopNumber${i}`).value,
            customer_id: document.getElementById(`customerSelect${i}`).value
            //notes: document.getElementById(`notes${i}`).innerText
        };
        console.log(JSON.stringify(stopData));
        fetch(`https://allin1ship.herokuapp.com/postStopChanges/${this.state.selectedRoute}`, {
            method: "POST",  
            headers: {
                "Content-Type": "application/json"},
            body: JSON.stringify(stopData)
        }).then(response =>  {
            console.log(response);
            if (response.ok) {
                alert('changes successfully sent')
            }
            return response.json();
    })
    }

    handleSubmit = (e) => {
        e.preventDefault();
        console.log('handlesubmitrunning');
        //CHANGE THIS, PROB CHANGE ENDPOINT TO DLETE PREV, AND POST ALL NEW
        //i think i have to work backwards from the server- figure out how to delete the old stops and post all new ones and then figute out how i need to send the new data.
        for (let i=1;i<=this.state.routeData.length;i++) {
            this.postStopChanges(i)
        }
    }
/*
    postScheduleStops = (i) => {
        //for line in taskbox, run this.postStopTask(task, schedule_stop_id)
        console.log('stopnumber:', document.getElementById(`stopNumber${i}`).value, 'customerId:', document.getElementById(`customerSelect${i+1}`).value);
        const postStopData = {
            stopNumber:  document.getElementById(`stopNumber${i}`).value,
            routeId: `${this.state.selectedRoute}`, ////where to get scheduleId from??
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
        }).then(json => this.postStopTask(document.getElementById(`tasks${i+1}`).value, json))
    }
*/
/*
    handleTextChange = (e) => {
        this.setState({selectedDropOffInfo: e.target.value})
    }
*/

    addRouteRow = () => {
        this.setState({routeTableData: [], routeData: [...this.state.routeData, {stop_number: this.state.routeTableData.length + 1}]}, this.setRouteTableData)
    }

    handleRouteChange = (e) => {
        //console.log(document.getElementById("selectRoute").value)
        this.setState({selectedRoute: e.target.value})
        this.getRouteData()
    }

    deleteRouteRow = (e, rowNumber) => {
        e.preventDefault()
        const { routeData } = this.state;
        const filteredRouteData = routeData.filter((route) => route.stop_number !== rowNumber)
        for (let i=0;i<filteredRouteData.length;i++){
            filteredRouteData[i].stop_number = i+1
        }
        console.log(filteredRouteData);
        this.setState({routeData: filteredRouteData, routeTableData: []}, this.setRouteTableData)
        this.setState({[`tasks${rowNumber}`]: null})
        for (let i=rowNumber;i<=routeData.length;i++) {
            this.setState({[`tasks${i}`]: this.state[`tasks${i+1}`]})
        }
    }

    setRouteTableData = () => {
        //this.setState({routeTableData: []})
        //
        const { routeData } = this.state;
        console.log(routeData);
        let arrayToRender = []
        for (let i=0;i<routeData.length;i++) {
            let tableRow = (<tr key={routeData[i].stop_number} id={`${routeData[i].stop_number}`} 
                /*draggable={true} 
                
                onDragStart={this.handleDrag} 
                onDrop={this.handleDrop}*/>
                <td id={`stopNumber${routeData[i].stop_number}`} value={routeData[i].stop_number} >{routeData[i].stop_number}</td>
                <td id={routeData[i].stop_number}><select id={`customerSelect${routeData[i].stop_number}`}><option key='0' value={routeData[i].customer_id} >{routeData[i].customer_name}</option>{this.state.customersData && this.state.customersList(this.state.customersData)}</select></td>
                {/*<td><textarea onChange={tasktext => this.setState({[`tasks${routeData[i].stop_number}`]: tasktext.target.value })}
                    rows='3' cols='35' id={`tasks${routeData[i].stop_number}`} defaultValue={this.state[`tasks${routeData[i].stop_number}`] && this.state[`tasks${routeData[i].stop_number}`]} name={`taskTextArea${routeData[i].stop_number}`}
                ></textarea></td> */}
                <input type='button' onClick={(e) => this.deleteRouteRow(e, routeData[i].stop_number)} value='delete row' />
            </tr>) 
            arrayToRender.push(tableRow)
        }
        this.setState({routeTableData: arrayToRender})
    }

    render() {
        /*left in if wabnt to copy
        const optionsDrivers = this.state.drivers && this.state.drivers.map((driver) => 
            <option key={driver.driver}>{driver.driver}</option>
        );*/
        const tableRouteData = this.state.routeData && this.state.routeData.map((stop) => 
            <tr >
                <td id={`stopNumber${stop.stop_number}`}>{stop.stop_number}</td>
                <td id={`customer${stop.stop_number}`}><select id={`customerSelect${stop.stop_number}`}><option key='0' value={stop.customer_id} >{stop.customer_name}</option>{this.state.customersData && this.state.customersList(this.state.customersData)}</select></td>
                <td contentEditable="true" id={`notes${stop.stop_number}`} >{stop.notes}</td> 
                {/*<input type='text' id={stop.stop_number} defaultValue={stop.comments} onChange={() => this.handleComment}></input>
                <button type='button' onClick={() => this.handleCommentButton(stop.stop_number, document.getElementById(`notes${stop.notes}`).innerText)}>submit changes</button>*/}
            </tr>  
        )

        const optionsRoutes = this.state.routes && this.state.routes.map((route) => 
        <option key={route.id} value={route.id}>{route.id} - {route.route_name}</option>
    );
        //const selectedRouteName = document.getElementById('selectRoute').value;
        //console.log(selectedRouteName);
        return <div style={{padding: '15px'}}>            
             <main className='EditDefaultRoute'>

                <form name='editDefaultRoute' onSubmit={this.handleSubmit}>
                <br/><legend>Edit Route</legend><br/>
                   
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
                            </tr>}
                        </thead>
                        <tbody>
                            {this.state.routeTableData}
                        </tbody>
                       <button type='button' onClick={() => this.addRouteRow()}>add row</button>
                    </table>

                    <button type='submit'>SUBMIT</button><br/>
                </form>
            </main>
        </div>
    }

}


export default EditDefaultRoute;