
//not workin gyet! not returning after file. fix this !

function checkIfScheduleExists(driver, date) {
    console.log('checkifschduleexists', driver, date);

    let scheduleExists = false;

    fetch(`https://allin1ship.herokuapp.com/getCurrentRouteDetails/${driver}/${date}`)
        .then(response => response.json())
        .then(json => {
            console.log(json);
            if (json.length > 1) {
                scheduleExists = true
                return true
            }
            })
        .catch(err => console.log(err))

}

export { checkIfScheduleExists }