let seconds = 0;
let minutes = 0;
let hours = 0;
let timerRun = false;

onTimedHandle = async () => {
    $("#option-overlay").hide();
    $("#controls-container").hide();
    $("#timer-container").show();
    // Shuffling once
    onShuffleClick();
    timerRun = true;
    await startTimer();
}

onFreeplayHandle = () => {
    $("#option-overlay").hide();
}

startTimer = async () => {
    setTimeout(() => {
        seconds++;
        if(seconds >= 60) {
            minutes++;
            seconds = 0;
        }
        if(minutes >= 60) {
            hours++;
            minutes = 0;
        }
        $(".timer").html(`${hours}:${minutes}:${seconds}`);
        if(timerRun) startTimer();
        else $("#won-overlay").show();
    }, 1000);
}