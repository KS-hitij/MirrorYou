function getDates(date) {
    let currDate = Date.now();
    let pastDate = new Date(date).getTime();
    let difference = currDate - pastDate;
    const secs = Math.floor(difference / 1000);
    const mins = Math.floor(secs / 60);
    const hours = Math.floor(mins / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);
    if (years > 0) {
        if (years === 1) {
            return `${years} year`
        }
        return `${years} years`;
    }
    else if (months > 0) {
        if (months === 1) {
            return `${months} month`
        }
        return `${months} months`;
    }
    else if(weeks>0){
        if(weeks===1){
            return `${weeks} week`;
        }
        return  `${weeks} weeks`;
    }
    else if (days > 0) {
        if (days === 1) {
            return `${days} day`
        }
        return `${days} days`;
    }
    else if (hours > 0) {
        if (hours === 1) {
            return `${hours} hour`
        }
        return `${hours} hours`;
    }
    else if (mins > 0) {
        if (mins === 1) {
            return `${mins} minute`
        }
        return `${mins} minutes`;
    } else {
        if (secs === 1) {
            return `${secs} second`
        }
        return `${secs} seconds`
    }
}
export default getDates