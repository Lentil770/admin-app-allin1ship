import React from 'react';
import $ from "jquery";

class CreateRoute extends React.Component {
    

    constructor(props) {
        super(props)
        this.state = {
            newRouteNumber: null,
            numberStops: 1,
            customersData: null,
            stopValue: 1,
            customersList: (givenData) => givenData && givenData.map((customer) => 
            <option key={customer.customer_id} value={customer.customer_id} >{customer.customer_name}</option>
            ),
            customersListB: (givenData) => givenData && givenData.map((customer) => 
            `<option key=${customer.customer_id} value=${customer.customer_id} >${customer.customer_name}</option>`
            )
        }
        this.handleAddStop = this.handleAddStop.bind(this);
        
        //this.customersList = this.customersList.bind(this);
    }

    setStops = () => this.setState({numberStops: this.state.numberStops + 1})

    getCustomersData = () => {
        console.log('getcustoemrsdata running');
        const url = "https://allin1ship.herokuapp.com/getCustomersData";
        fetch(url)
        .then(response => response.json())
        .then(json => this.setState({customersData: json}))
        .then(() => console.log(this.state))
        .catch(err => console.log(err))
    }

    getNewRouteNumber = () => {
        //fetch length of route_list and sets newRouteNumber to it + 1
        fetch("https://allin1ship.herokuapp.com/getRouteLength")
        .then(response => response.json())
        .then(json => this.setState({newRouteNumber: json[0]["COUNT(*)"] + 1}))
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

    createNewRoute = (newRouteName) => {
        //get server endpoint that jusst creates new row in route_list
        const route_name = encodeURIComponent(newRouteName)
        console.log(route_name);
        fetch(`https://allin1ship.herokuapp.com/createNewRouteList/${route_name}`)
        .then(response => alert('route successfully made!'))
        .catch(err => console.log(err))
    }

    postNewStop = (i) => {
        console.log('postnewstop running, i:', i)

        const stopData = {
            route_id: this.state.newRouteNumber,
            stop_number: document.getElementById(`stopNumber${i}`).innerText,
            customer_id: document.getElementById(`select${i}`).value,/* ****!!!!!!!??? how to get customer_id... document.getElementById(`customerselect${i}`).selectElement.options[document.getElementById(`customerselect${i}`).selectedIndex].value,*/
            notes: document.getElementById(`notes${i}`).value
        }
        console.log(JSON.stringify(stopData));
        fetch("https://allin1ship.herokuapp.com/postNewRoute", {
            method: "POST",  
            headers: {
                "Content-Type": "application/json"},
            body: JSON.stringify(stopData)
        })
    }

    handleSubmit = (e) => {
        e.preventDefault();
        console.log('handlesubmit running', document.getElementById(`route-name`).value);
        this.createNewRoute(document.getElementById(`route-name`).value)
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

    /*fakeCustomersList = this.state.customersData && this.state.customersData.map((customer) => (
        {
            value: customer.customer_id, 
            label: customer.customer_name
        }
    ))*/
   //customersList =  [{value: 3, label: 'tippytoes'}, {value: 2, label: 'lentilhouse'}]
        

    handleAddStop() {
        console.log('handleaddstoprunnign');
        this.setStops();
        $('tbody').append( `<tr>
            <td id=${`stopNumber${this.state.numberStops+1}`}>${this.state.numberStops + 1}</td>
            <td ><select name='customer' id=${`select${this.state.numberStops + 1}`}>${this.state.customersData && this.state.customersListB(this.state.customersData)}</select></td> 
            <td><input type="text" name="notes" id=${`notes${this.state.numberStops+1}`} /></td>   
        </tr>
        `)
    }
    
    removeRow(){
        console.log(this.state.customersData);
        //dunno how to do with the way i made table - switch all to .map an array of length starting one adding one for each addrwo click?
        /*let rows = this.state.items;
        rows.splice(1);
        this.setState({items:rows})*/
        }
    /*
    handleAddStop() {
        console.log('handleaddstoprunnign');
        this.setStops();
        document.getElementById('tbody').insertAdjacentHTML("beforeend", `<tr>
            <td id=${`stopNumber${this.state.numberStops+1}`}>${this.state.numberStops + 1}</td>
            <td ><select name='customer' id=${`customerselect${this.state.numberStops + 1}`}>${this.state.customersList}</select></td> 
            <td><input type="text" name="notes" id=${`notes${this.state.numberStops+1}`} /></td>   
        </tr>
        `)
    }*/

//$("#tbody").append(appRow);
    render() {
        
        return <div>
            <form id='route-form' onSubmit={this.handleSubmit}>
                <p> ROUTE # {this.state.newRouteNumber}</p>

                <label for='route-name'>Route Name:</label>
                <input type='text' id='route-name'></input>
                {/* <button type='button' onClick={this.handleAddStop}>Add Stop</button> <br/> */}
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
                        <input type="button" className="button" value="remove Row" onClick={() => this.removeRow()} />
                    </thead>
                    <tbody id='tbody'>
                        <tr>
                            <td id={`stopNumber1`} >1</td>
                            <td id='customerselect1'><select name='customer' id='select1' >{this.state.customersData && this.state.customersList(this.state.customersData)}</select></td> 
                            <td><input type="text" name="notes" id='notes1' /></td>   
                            <td><input type="button" className="button" value="Add another line" onClick={() => this.handleAddStop()} /></td>
                        </tr>
                    </tbody>
                </table>
            </form>
        </div>
    }
}


export default CreateRoute;