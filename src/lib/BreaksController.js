module.exports = class BreaksController {

    /**
     *
     * @param timerDuration in minutes
     * @param callback
     */
    createTimer(timerDuration, callback) {
        let duration = timerDuration * 60 * 1000;
        let countDownDate = new Date(Date.now() + (duration)).getTime();
        let i = 0;

        return setInterval(() => {
            // Get today's date and time
            let now = new Date().getTime();

            // Find the distance between now and the count down date
            let distance = countDownDate - now;
            i++;

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
}