var endTimer = document.querySelector('#stop_button');
var timer = document.querySelector('#start_button');
var viewCollection = document.querySelector('#open_button');

timer.onclick = function () { 
    // Send first message to check if timer is counting
    chrome.runtime.sendMessage({action: "check"}, (response) => {
        // If not, send message to start timer
        if (!response.status) {
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

endTimer.onclick = function () { 
    // Send first message to check if timer is counting
    chrome.runtime.sendMessage({action: "check"}, (response) => {
        // If not, send message to start timer
        if (response.status) {
            chrome.runtime.sendMessage({action: "stop"}, (response) => {
                console.log(response.status);
                document.getElementById("time").innerHTML =  "00:00";
            });
        } else {
            console.log("Timer not active!")
        }
    });

}

viewCollection.onclick = function () { 
    chrome.windows.create({
        type: 'normal',
        url:  chrome.extension.getURL('../html/collections.html')
    }, 
    (win) => {

    });

}

window.onload = function () {
    document.getElementById("time").innerHTML = "00:00";

}

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
    if (response.seconds >= 0) {
        displayTime(response.seconds);
    }
    sendResponse();
});