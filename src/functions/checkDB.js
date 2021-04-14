//function to check if thre is already a chedule for specific date & driver => to prevent multiples occuring
function checkIfScheduleExists(driver, date) {
    console.log('checkifschduleexists', driver, date);

    const scheduleExists = () => {
        return fetch(`https://allin1ship.herokuapp.com/getCurrentRouteDetails/${driver}/${date}`)
        .then(response => response.json())
        .then(json => {
            console.log(json);
            if (json.length > 1) {
                return true
            } else {
                return false
            }
        })
        .catch(err => console.log(err))
    }
    return scheduleExists()
}

export { checkIfScheduleExists }