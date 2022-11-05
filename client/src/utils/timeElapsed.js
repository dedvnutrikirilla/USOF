export function timeElapser(date) {
    const miliSexs = 1;
    const sexs = 1000 * miliSexs;
    const minutes = 60 * sexs;
    const hours = 60 * minutes;
    const days = 24 * hours;
    const current = new Date().getTime();

    // to use this feature you need to donate 300 buks to admins
    /*const weeks = 7 * days;
    const months = 4 * weeks + (2 * days);
    const years = 12 * months + (5 * days);*/

    const elapsed = current - date;
    //console.log(elapsed + ' = ' + current + ' - ' + date);

    if (elapsed < minutes) {
        return Math.round(elapsed/sexs) + ' seconds ago';
    }
    else if (elapsed < hours) {
        return Math.round(elapsed/minutes) + ' minutes ago';   
    }
    else if (elapsed < days) {
        return Math.round(elapsed/hours ) + ' hours ago';   
    }
    else {
        return Math.round(elapsed/days) + ' days ago';   
    }
}