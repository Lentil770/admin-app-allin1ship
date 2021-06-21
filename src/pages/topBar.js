import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/allin1ship-logo.png";
// current page highlighted, and button links to other pages. display flex width 50%

class TopBar extends React.Component {
  //get current page and button highlighted accordingly
  render() {
    return (
      <div>
        <main className="TopBar">
          <img src={logo} alt="allin1ship logo" />
          <br />
          <div>
            <Link to="/create-schedule">
              <button>CREATE NEW SCHEDULE</button>
            </Link>
            <Link to="/display-current-route">
              <button>VIEW CURRENT ROUTE DATA</button>
            </Link>
            {/*<Link to='/create-route'><button>CREATE NEW ROUTE</button></Link>    needs to be edited */}
            <Link to="/add-customer">
              <button>ADD CUSTOMER</button>
            </Link>
            <Link to="/edit-customer">
              <button>EDIT CUSTOMER</button>
            </Link>
            <Link to="/edit-schedule">
              <button>EDIT SCHEDULE</button>
            </Link>
            <Link to="/edit-route">
              <button>EDIT DEFAULT ROUTE</button>
            </Link>
            {/*<Link to='/display-feedback'><button>VIEW FEEDBACK</button></Link> replaced with view currwnt route data
                    <Link to='/display-timestamps'><button>VIEW TIMESTAMPS</button></Link>* replaced with view curent route data */}
            {/*<Link to='/display-start-times'><button>VIEW START TIMES</button></Link> /**shd this be a seperate page? */}
            <Link to="/add-driver">
              <button>NEW DRIVER</button>
            </Link>
          </div>
        </main>
      </div>
    );
  }
}

export default TopBar;
