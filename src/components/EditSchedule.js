import React from 'react';

class EditSchedule extends React.Component {
    state = {
    }

    fetchScheduleList = () => {
        console.log('fetchschedules running');
        const url = "https://allin1ship.herokuapp.com/fetchScheduleList";
        fetch(url)
        .then(response => response.json())
        .then(json => this.setState({scheduleList: json}))
        .then(() => console.log(this.state))
        .catch(err => console.log(err))
    }

    componentDidMount() {
        console.log('componentDidMount');
        this.fetchScheduleList();
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const postData = {
        }
        console.log('handlesubmit', JSON.stringify(postData));
        fetch("https://allin1ship.herokuapp.com/postSchedule", {
            method: "POST",  
            headers: {
                "Content-Type": "application/json"},
            body: JSON.stringify(postData)
        }).then(function(response) {
            console.log(response)
            alert('Schedule successfully posted');
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

        const scheduleOptions = this.state.scheduleList && this.state.scheduleList.map((schedule) => 
            <option key={schedule.id} value={schedule.id}>{schedule.id}</option>
        );

        return <div>            
             <main className='EditSchedule'>

                <form onSubmit={this.handleSubmit}>
                <br/><legend>Edit Schedule</legend><br/>
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


export default EditSchedule;