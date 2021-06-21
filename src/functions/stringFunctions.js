export const formatTime = (givenDate) => {
    console.log('formatting', givenDate);
    let date = new Date(givenDate)
    if (!date) return 'invalid date'
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return (date.getMonth()+1) + "/" + date.getDate() + "/" + date.getFullYear() + "  " + strTime;
  }

/*
{
    const formattedTime = timeString;
    console.log(parseInt(formattedTime.substring(0, 1)) > 12);
    if (parseInt(formattedTime.substring(0, 2)) > 12) {
        console.log('hel');
        formattedTime = parseInt(formattedTime.substring(0, 2))
    }
    return formattedTime
}*/