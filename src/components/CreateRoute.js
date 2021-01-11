import React from 'react';

class CreateRoute extends React.Component {
    

    constructor(props) {
        super(props)
        this.state = {
            newRouteNumber: null,
            newRoute: [],
            numberStops: 1,
            customersData: null
        }
        this.handleAddStop = this.handleAddStop.bind(this);
        
        this.customersList = this.customersList.bind(this);
    }

    getCustomersData = () => {
        console.log('getcustoemrsdata running');
        const url = "http://localhost:8000/getCustomersData";
        fetch(url)
        .then(response => response.json())
        .then(json => this.setState({customersData: json}))
        .then(() => console.log(this.state))
        .catch(err => console.log(err))
    }

    getNewRouteNumber = () => {
        //fetch length of route_list and sets newRouteNumber to it + 1
        fetch("http://localhost:8000/getRouteLength")
        .then(response => response.json())
        .then(json => this.setState({newRouteNumber: json.[0]["COUNT(*)"] + 1}))
        .then(() => console.log(this.state))
        .catch(err => console.log(err))
    }

    componentDidMount() {
        //fetch number routes and add one for number of this new route.
        //fetch list of all customers unique names and ids
        this.setState({numberStops: 1})
        this.getCustomersData()
        this.getNewRouteNumber()
    }

    createNewRoute = () => {
        //get server endpoint that jusst creates new row in route_list
        fetch("http://localhost:8000/createNewRouteList")
        .then(response => console.log('new route list created'))
        .catch(err => console.log(err))
    }

    postNewStop = (i) => {
        console.log('postnewstop running, i:', i, document.getElementById(`notes${i}`).value);
        
        const stopData = {
            route_id: this.state.newRouteNumber,
            stop_number: i,
            customer_id: 2,/* ??? how to get customer_id... document.getElementById(`customerselect${i}`).selectElement.options[document.getElementById(`customerselect${i}`).selectedIndex].value,*/
            notes: document.getElementById(`notes${i}`).value
        }
        console.log(JSON.stringify(stopData));
        fetch("http://192.168.1.137:8000/postNewRoute", {
            method: "POST",  
            headers: {
                "Content-Type": "application/json"},
            body: JSON.stringify(stopData)
        }).then(response => console.log('new stop posted', response.json()))
    }

    handleSubmit = (e) => {
        e.preventDefault();
        console.log('handlesubmit running', this.state.numberStops);
        this.createNewRoute()
        setTimeout(() => {
            for (let i=1;i<=this.state.numberStops;i++) {
                this.postNewStop(i)
            }
          }, 2000)
        
    }
//function to map fetched customer list and set an option for each with id customer_id and value address/name


    //        <div>
    //<p>${this.state.numberStops}</p>
    //<select>${() => this.customersList}</select>
  //  <input type='text' placeholder='optional notes'></input>
//</div>

    /*customersList = this.state.customersData && this.state.customersData.map((customer) => (
        {
            value: customer.customer_id, 
            label: customer.customer_name
        }
    ))*/
   //customersList =  [{value: 3, label: 'tippytoes'}, {value: 2, label: 'lentilhouse'}]
   customersList = () => this.state.customersData && this.state.customersData.map((customer) => 
            <option key={customer.customer_id}>{customer.customer_name}</option>
        );
        
    setStops = () => this.setState({numberStops: this.state.numberStops + 1})

    handleAddStop() {
        console.log('handleaddstoprunnign', this.customersList);
        this.setStops();
        console.log(this.state);
        document.getElementById('tbl').innerHTML += `<tr>
            <td>${this.state.numberStops + 1}</td>
            <td ><select name='customer' id=${`customerselect${this.state.numberStops + 1}`}>${this.customersList()}</select></td> 
            <td><input type="text" name="notes" id=${`notes${this.state.numberStops+1}`} /></td>   
        </tr>
        `;
    }


    render() {
        
        return <div>
            Create Route Page
            <p> ROUTE # {this.state.newRouteNumber}</p>
           <form id='route-form' onSubmit={this.handleSubmit}>
                <button type='button' onClick={this.handleAddStop}>Add Stop</button> <br/>
                <br/> <button type='submit'>Submit Route</button>
                {/*<div>
                    <span>{this.state.numberStops}</span>
                    <select>{() => this.customersList}</select>
                    <input type='text' placeholder='optional notes'></input>
                </div>*/}
                <table id="tbl">
                    <thead>
                        <tr>
                            <th>Stop Number</th>
                            <th>Customer</th>
                            <th>Notes</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td id='customerselect1'><select name='customer' >{this.customersList()}</select></td> 
                            <td><input type="text" name="notes" id='notes1' /></td>   
                            {/*<td><input type="submit" className="button" value="Add another line" onClick={() => console.log('add another line button clicked')} /></td>     */}     
                        </tr>
                    </tbody>
                </table>
            </form>
        </div>
    }

}


export default CreateRoute;