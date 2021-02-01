import React from 'react';

class AddCustomer extends React.Component {
    state = {
    }

    componentDidMount() {
        console.log('componentDidMount');
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const postData = {
            customer_name: this.state.customerName,
            address: this.state.address,
            location: this.state.location ? this.state.location : '',
            contact_name: this.state.contactrName ? this.state.contactName : '',
            contact_number: this.state.contactNumber,
            comments: this.state.comments ? this.state.comments : ''
        };
        
        console.log('handlesubmit', JSON.stringify(postData));
        fetch("https://allin1ship.herokuapp.com/postNewCustomer", {
            method: "POST",  
            headers: {
                "Content-Type": "application/json"},
            body: JSON.stringify(postData)
        }).then(function(response) {
            console.log(response)
            if (response.ok) {alert('customer successfully posted')}
            return response.json();
        })
    }


    handleChange = (e) => {
        const stateKey = e.target.id;
        this.setState({...this.state, [stateKey]: e.target.value})
    }

    render() {

        return <div style={{padding: '15px'}}>            
             <main className='AddCustomer'>

                <form onSubmit={this.handleSubmit}>
                    <br/><legend><h2>New customer</h2></legend>

                    <label htmlFor='customerName'>Customer Name  </label>
                    <input type="text" id='customerName' required value={this.state.customerName} onChange={this.handleChange} /><br/><br/>

                    <label htmlFor='address'>Address  </label>
                    <input type="text" id='address' required value={this.state.address} onChange={this.handleChange} /><br/><br/>

                    <label htmlFor='location'>Location  </label>
                    <input type="text" id='location' value={this.state.location} onChange={this.handleChange} /><br/><br/>

                    <label htmlFor='contactName'>Contact name  </label>
                    <input type="text" id='contactName' value={this.state.contactName} onChange={this.handleChange} /><br/><br/>

                    <label htmlFor='contactNumber'>Contact phone number  </label>
                    <input type="number" id='contactNumber' required value={this.state.contactNumber} onChange={this.handleChange} /><br/><br/>

                    <label htmlFor='comments'>Comments  </label>
                    <textarea id='comments' value={this.state.comments} onChange={this.handleChange} /><br/><br/>

                    <button type='submit'>SUBMIT</button><br/>
                </form>
            
            </main>
        </div>
    }

}


export default AddCustomer;