var fish = document.querySelector('#start_button');
var timer = document.querySelector('#timer_button');
var port;

timer.onclick = function () { 
    // Send first message to check if timer is counting
    chrome.runtime.sendMessage({action: "check"}, (response) => {
        // If not, send message to start timer
        if (!response.on) {
            chrome.runtime.sendMessage({action: "start"}, (response) => {
                console.log(response.status);
            });
        } else {
            console.log("Timer still counting!")
        }
    });

    /*
    chrome.tabs.query(  {active: true, currentWindow: true }, function(tabs) {
        console.log("wow i feel tired");
        chrome.tabs.sendMessage(tabs[0].id, {action: "start"}, function(response) {
        });
    });*/
}

/*
window.onload = function () {
    document.getElementById("txt").innerHTML = "00:00";

}*/

// Displays into actual nice text haha
function displayTime(seconds) {
    var m = Math.floor(seconds / 60);
    var s = Math.floor(seconds % 60);

    if (s < 10) {
        s = "0" + s;
    }
    if (m < 10) {
        m = "0" + m;
    }
    document.getElementById("time").innerHTML =  m + ":" + s;
}

// Listen for messages from background
chrome.extension.onMessage.addListener((response, _, sendResponse) => {
    console.log(response.seconds);
    if (response.seconds >= 0) {
        displayTime(response.seconds);
    }
    sendResponse();
});