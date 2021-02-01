import React from 'react';

class DisplayTimestamps extends React.Component {
    state = {
    }

    getDrivers = () => {
        console.log('getdrviers running');
        const url = "https://allin1ship.herokuapp.com/getDrivers";
        fetch(url)
        .then(response => response.json())
        .then(json => this.setState({drivers: json}))
        .then(() => console.log(this.state))
        .catch(err => console.log(err))
    }

    
    componentDidMount() {
        console.log('componentDidMount');
        this.getDrivers();
    }

   
    handleDriverChange = (e) => {
        this.setState({selectedDriver: e.target.value})
        fetch(`https://allin1ship.herokuapp.com/getTimestampsData/${e.target.value}`)
            .then(response => response.json())
            .then(json => this.setState({timestampsData: json}))
    }

    render() {
        const optionsDrivers = this.state.drivers && this.state.drivers.map((driver) => 
            <option key={driver.driver}>{driver.driver}</option>
        );

        //need to order by time?
        const renderTimestamps = this.state.timestampsData && this.state.timestampsData.map((timestamp) => 
            <div>
                <span>{timestamp.time_completed}</span>{'  '}
                <span>STOP # {timestamp.stop_number}</span>
            </div>
        )

        return <div style={{padding: '15px'}}>            
             <main className='DisplayTimestamps'>
                    DRIVER:<br/>
                    <select required onChange={this.handleDriverChange}>
                    <option value="none" selected disabled hidden> 
                        Select a Driver 
                    </option>
                        {optionsDrivers}
                    </select><br/><br/>
                    
                    {renderTimestamps}
            </main>
        </div>
    }

}


export default DisplayTimestamps;