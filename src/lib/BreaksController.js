
/**
 *
 * @param timerDuration in seconds
 * @param callback
 */
module.exports.createTimer = (timerDuration, callback) => {

    const duration = timerDuration * 1000;
    const countDownDate = new Date(Date.now() + (duration)).getTime();

    return setInterval(() => {
        // Get today's date and time
        const now = new Date().getTime();

        // Find the distance between now and the count down date
        let distance = countDownDate - now;

            // Time calculations for days, hours, minutes and seconds
            // var days = Math.floor(distance / (1000 * 60 * 60 * 24));
            // var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            let seconds = Math.floor((distance % (1000 * 60)) / 1000);

            minutes = ('0' + minutes).slice(-2)
            seconds = ('0' + seconds).slice(-2);

            callback(distance, `${minutes}:${seconds}`);
        }, 1000)
}