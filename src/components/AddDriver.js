import React from 'react';

class AddDriver extends React.Component {
    state = {
    }

    componentDidMount() {
        console.log('componentDidMount');
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const postData = {
        }
        console.log('handlesubmit', JSON.stringify(postData));
        fetch("https://allin1ship.herokuapp.com/postDriver", {
            method: "POST",  
            headers: {
                "Content-Type": "application/json"},
            body: JSON.stringify(postData)
        }).then(function(response) {
            console.log(response)
            alert('Driver successfully posted');
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


        return <div style={{padding: '15px'}}>            
             <main className='AddDriver'>

                <form onSubmit={this.handleSubmit}>
                <br/><legend>New Driver</legend><br/>
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


export default AddDriver
;