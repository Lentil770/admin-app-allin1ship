/*import React from 'react';

class DisplayFeedback extends React.Component {
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
        fetch(`https://allin1ship.herokuapp.com/getFeedbackData/${e.target.value}`)
            .then(response => response.json())
            .then(json => this.setState({feedbackData: json}))
    }

    render() {
        const optionsDrivers = this.state.drivers && this.state.drivers.map((driver) => 
            <option key={driver.username}>{driver.username}</option>
        );

        const renderFeedback = this.state.feedbackData && this.state.feedbackData.map((feedback) => 
            <div>
                <span>{feedback.feedback_date}</span>{'  '}
                <span>STOP # {feedback.stop_number}</span>{' - '}
                <span>{feedback.feedback}</span>{'  '}
            </div>
        )

        return <div style={{padding: '15px'}}>            
             <main className='DisplayFeedback'>
                    DRIVER:<br/>
                    <select required onChange={this.handleDriverChange}>
                    <option value="none" selected disabled hidden> 
                        Select a Driver 
                    </option>
                        {optionsDrivers}
                    </select><br/><br/>
                    
                    {renderFeedback}
            </main>
        </div>
    }

}


export default DisplayFeedback;

not used anymore*/