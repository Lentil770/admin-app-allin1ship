import React from 'react';

class AddDriver extends React.Component {
    state = {
    }

    componentDidMount() {
        console.log('componentDidMount');
    }

    handleSubmit = (e) => {
        e.preventDefault();
        fetch(`https://allin1ship.herokuapp.com/addDriver/${this.state.driverName}/${this.state.password}`)
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
*/  handleChange = (e) => {
        this.setState({driverName: e.target.value})
    }

    handlePasswordChange = (e) => {
        let password = e.target.value;
        if (password.length > 4) return;
        this.setState({password})
    }
    render() {
        return <div style={{padding: '15px'}}>            
             <main className='AddDriver'>

                <form onSubmit={this.handleSubmit}>
                <br/><legend>New Driver</legend><br/>
                    <p>Driver Name</p>
                    <input placeholder='driver name' onChange={this.handleChange}></input>
                    <br/>
                    <p>Password - 4 Digits</p>
                    <input type='number' onChange={this.handlePasswordChange} value={this.state.password}></input>
                    <br/><br/>    
                    <button type='submit' style={{color: 'white', backgroundColor: 'black', width: 300}}>SUBMIT</button><br/>
                </form>
            
            </main>
        </div>
    }

}


export default AddDriver
;