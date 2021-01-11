import React from 'react';
import { Link } from 'react-router-dom';
import logo from "../assets/allin1ship-logo.png";
//two buttons - current page highlighted, and button link to second page. display flex width 50%

class TopBar extends React.Component {
    state = {

    }
    //get current page and button highlighted accordingly
    render() {

        return <div>
            <main className='TopBar'>
                
                <img src={logo} alt='allin1ship logo'/>
                <br/>
                <div>
                    <Link to='/'><button>CREATE NEW SCHEDULE</button></Link>
                    <Link to='/create-route'><button>CREATE NEW ROUTE</button></Link>
                </div>
            </main>
        </div>
    }

}



export default TopBar;