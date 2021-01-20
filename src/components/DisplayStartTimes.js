import React from 'react';

class DisplayStartTimes extends React.Component {
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
        fetch(`https://allin1ship.herokuapp.com/getStartTimesData/${e.target.value}`)
            .then(response => response.json())
            .then(json => this.setState({startTimesData: json}))
    }

    render() {
        const optionsDrivers = this.state.drivers && this.state.drivers.map((driver) => 
            <option key={driver.driver}>{driver.driver}</option>
        );

        const renderStartTimes = this.state.startTimesData && this.state.startTimesData.map((startTime) => 
            <div>
                <span>{startTime.feedback_date}</span>{'  '}
                <span>STOP # {startTime.stop_number}</span>{' - '}
                <span>{startTime.feedback}</span>{'  '}
            </div>
        )

        return <div>            
             <main className='DisplayStartTimes'>
                    DRIVER:<br/>
                    <select required onChange={this.handleDriverChange}>
                    <option value="none" selected disabled hidden> 
                        Select a Driver 
                    </option>
                        {optionsDrivers}
                    </select><br/><br/>
                    
                    {renderStartTimes}
            </main>
        </div>
    }

}


export default DisplayStartTimes;