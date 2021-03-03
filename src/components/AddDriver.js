import React from 'react';

class AddDriver extends React.Component {
    state = {
    }

    componentDidMount() {
        console.log('componentDidMount');
    }

    handleSubmit = (e) => {
        e.preventDefault();
        fetch(`https://allin1ship.herokuapp.com/addDriver/${this.state.driverName}`)
        .then(function(response) {
            console.log(response)
            alert('Driver successfully posted');
            return response.json();
        })
    }

/*
    handleTextChange = (e) => {
        this.setState({selectedDropOffInfo: e.target.value})
    }
*/handleChange = (e) => {
            this.setState({driverName: e.target.value})
        }
    render() {
        /*left in if wabnt to copy
        const optionsDrivers = this.state.drivers && this.state.drivers.map((driver) => 
            <option key={driver.driver}>{driver.driver}</option>
        );*/

        
        return <div style={{padding: '15px'}}>            
             <main className='AddDriver'>

                <form onSubmit={this.handleSubmit}>
                <br/><legend>New Driver</legend><br/>
                  <input defaultValue='driver name' onChange={this.handleChange}></input>
                    <button type='submit'>SUBMIT</button><br/>
                </form>
            
            </main>
        </div>
    }

}


export default AddDriver
;