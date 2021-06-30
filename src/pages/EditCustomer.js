import React from 'react';
import Table from 'react-bootstrap/Table'

class EditCustomer extends React.Component {
    state = {
        customersList: (givenData) => givenData && givenData.map((customer) => 
            <option key={customer.customer_id} value={customer.customer_id} >{customer.customer_name}</option>
        )
    }

    getCustomersData = () => {
        console.log('getcustoemrsdata running');
        const url = "https://allin1ship.herokuapp.com/getAllCustomersData";
        fetch(url)
        .then(response => response.json())
        .then(json => this.setState({customersData: json}))
        .then(() => console.log(this.state))
        .catch(err => console.log(err))
    }

    
    componentDidMount() {
        console.log('componentDidMount');
        this.getCustomersData();
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const postData = this.state.selectedCustomerData;

        console.log('handlesubmit', JSON.stringify(postData));
        fetch("https://allin1ship.herokuapp.com/editCustomerData", {
            method: "POST",  
            headers: {
                "Content-Type": "application/json"},
            body: JSON.stringify(postData)
        }).then(function(response) {
            console.log(response)
            alert('customer successfully posted');
            return response.json();
        })
    }

    handleChange = (name, e) => {
        console.log(name, e.target.value);
        const { selectedCustomerData } = this.state;
        selectedCustomerData[name] = e.target.value;
        this.setState({selectedCustomerData})
    }

    renderCustomerData = () => {
        const { selectedCustomer } = this.state;
        const renderData = []
        const customer = selectedCustomer && this.state.customersData.find(customer => customer.customer_id === parseInt(selectedCustomer))
        console.log(customer);
        customer && renderData.push(<tr>
            <td><input onChange={(e) => this.handleChange('customer_name', e)} value={customer.customer_name} /></td>
            <td><input onChange={(e) => this.handleChange('address', e)} value={customer.address} /></td>
            <td><input onChange={(e) => this.handleChange('location', e)} value={customer.location} /></td>
            <td><input onChange={(e) => this.handleChange('contact_name', e)} value={customer.contact_name} /></td>
            <td><input onChange={(e) => this.handleChange('contact_number', e)} value={customer.contact_number} /></td>
            <td><input onChange={(e) => this.handleChange('comments', e)} value={customer.comments} /></td>
            <td><input onChange={(e) => this.handleChange('latitude', e)} value={customer.latitude} /></td>
            <td><input onChange={(e) => this.handleChange('longitude', e)} value={customer.longitude} /></td>
        </tr>)
        return renderData
    }

    handleCustomerSelection = (e) => {
       const customer = this.state.customersData.find(customer => customer.customer_id === parseInt(e.target.value))
       this.setState({selectedCustomer: e.target.value, selectedCustomerData: customer})
    }

/*
    handleTextChange = (e) => {
        this.setState({selectedDropOffInfo: e.target.value})
    }
*/
    render() {
        return <div style={{padding: '15px'}}>            
             <main className='EditCustomer'>

                <form onSubmit={this.handleSubmit}>
                    <br/><legend>Edit customer</legend><br/>

                    <select name='customer' id='select1' onChange={this.handleCustomerSelection}>
                        <option selected hidden>choose a customer</option>
                        {this.state.customersData && this.state.customersList(this.state.customersData)}</select>

                    <Table bordered hover>
                        <thead>
                            <tr>
                                <th>Customer Name</th>
                                <th>Address</th>
                                <th>Location</th>
                                <th>Contact Name</th>
                                <th>Contact Number</th>
                                <th>Comments</th>
                                <th>Latitude</th>
                                <th>Longitude</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.renderCustomerData()}
                        </tbody>
                    </Table>
                    
                    <button type='submit' style={{color: 'white', backgroundColor: 'black', width: 300}}>SUBMIT</button><br/>
                </form>
            
            </main>
        </div>
    }

}


export default EditCustomer;