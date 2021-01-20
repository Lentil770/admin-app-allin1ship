import React from 'react';

class EditCustomer extends React.Component {
    state = {
        customersList: (givenData) => givenData && givenData.map((customer) => 
            <option key={customer.customer_id} value={customer.customer_id} >{customer.customer_name}</option>
        )
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
        this.getCustomersData();
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const postData = {
        }
        console.log('handlesubmit', JSON.stringify(postData));
        fetch("https://allin1ship.herokuapp.com/postCustomer", {
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

/*
    handleTextChange = (e) => {
        this.setState({selectedDropOffInfo: e.target.value})
    }
*/
    render() {
        /*left in if wabnt to copy
        const optionsDrivers = this.state.drivers && this.state.drivers.map((driver) => 
            <option key={driver.driver}>{driver.driver}</option>
        );*/


        return <div>            
             <main className='EditCustomer'>

                <form onSubmit={this.handleSubmit}>
                    <br/><legend>Edit customer</legend><br/>

                    <select name='customer' id='select1' >
                        {this.state.customersData && this.state.customersList(this.state.customersData)}</select>
                    according to selected customer - display their data in editable boxes, and uodate state acc to changes, and on submit run a post with data to alter table.
                   {/* LEFT IN TO COPY FOR NEW FORM IF WANTED
                    DRIVER:<br/>
                    <select required onChange={this.handleDriverChange}>
                    <option value="none" selected disabled hidden> 
                        Select a Driver 
                    </option>
                        {optionsDrivers}
                    </select><br/><br/>

                    DROP OFF INFO:<br/>
                    <textarea 
                    onChange={this.handleTextChange}
                    name='comment'>Thank you for working hard today, your work means a lot and we appreciate the extra you put in</textarea><br/><br/>
                   */}
                    
                    <button type='submit'>SUBMIT</button><br/>
                </form>
            
            </main>
        </div>
    }

}


export default EditCustomer;