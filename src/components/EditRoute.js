import React from 'react';

class EditRoute extends React.Component {
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
        const url = "https://allin1ship.herokuapp.com/singleRouteDisplay/" + document.getElementById("selectRoute").value;
        console.log(url);
        fetch(url)
        .then(response => response.json())
        .then(json => this.setState({routeData: json}))
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
            stop_number: document.getElementById(`stopNumber${i}`).innerText,
            customer_id: document.getElementById(`customerSelect${i}`).value,
            notes: document.getElementById(`notes${i}`).innerText
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
        for (let i=1;i<=this.state.routeData.length;i++) {
            this.postStopChanges(i)
        }
    }
/*
    handleTextChange = (e) => {
        this.setState({selectedDropOffInfo: e.target.value})
    }
*/



handleRouteChange = (e) => {
    console.log(document.getElementById("selectRoute").value)
    this.setState({selectedRoute: e.target.value})
    this.getRouteData()
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
             <main className='EditRoute'>

                <form name='editRoute' onSubmit={this.handleSubmit}>
                <br/><legend>Edit Route</legend><br/>
                   
                    <select id='selectRoute' onChange={this.handleRouteChange}>
                        <option value="" selected disabled hidden>Choose Route</option>
                        {optionsRoutes}
                    </select><br/>

                    <table>
                        <thead>
                            {/*<tr><th>Route #:{this.state.selectedRoute}{/*selectedRouteName && selectedRouteName.route_name</th></tr>*/}
                            <tr>
                                <th>Stop #</th>
                                <th>Customer</th>
                                <th>Tasks</th>
                            </tr>
                           {/* <span><input type="button" className="button" value="Add another line" onClick={() => this.handleAddStop()} /></span>*/}
                        </thead>
                        <tbody>
                            {tableRouteData}
                        </tbody>
                       {/*<button onClick={this.handleCommentChanges}>submit comment changes</button>*/}
                    </table>


                    <button type='submit'>SUBMIT</button><br/>
                </form>
            
            </main>
        </div>
    }

}


export default EditRoute;