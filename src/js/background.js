var counting = false;
var endTimer = false;
var remain;
var views;

// Listens for messages
chrome.runtime.onMessage.addListener(
    (request, _, sendResponse) => {
        if (request.action == "start") {
            createTimer(0, 10);
            sendResponse( {status: "success"} );
        } else if (request.action == "check") {
            sendResponse( {status: counting});
        } else if (request.action == "stop") {
            endTimer = true;
            sendResponse( {status: "stopping timer"});
        }
        else {
            sendResponse( {status: "error"});
        }
    }
)

function createTimer(timerMinutes, timerSeconds)  {
    // Get time
    counting = true;
    var currTime = new Date().getTime();

    // Calculate total time 
    var totalSeconds = (timerMinutes * 60) + (timerSeconds);
    if (totalSeconds > 1500) {
        alert("Too big");
        counting = false;
        return;
    }
    var finalTime = new Date(currTime + totalSeconds * 1000);
    var frequency = 100;

    var int = setInterval(function() {
        var currTime = new Date();
        remain = (finalTime - currTime) / 1000;

        if (remain <= 0 || endTimer) {
            clearInterval(int);
            counting = false;
            if (!endTimer) notifyUser();
            endTimer = false;
            return;
        }
        
        // Ay fixed it kind of?
        views = chrome.extension.getViews({ type: "popup" });
        if (views.length > 0)
        {
            chrome.runtime.sendMessage({seconds: remain}, _ => {});
        }
    }, frequency);

}

function notifyUser() {
    chrome.runtime.sendMessage({fishing: "caught"}, function(response){}); //when timer is done, alert fish.js to spit out a new fish
    chrome.notifications.create("caught-fish", 
    {
        type:'basic',
        title:"Timer ended!",
        message:"You caught a fish!",
        iconUrl: chrome.extension.getURL('../assets/bruh.png')
    }, 
    (not) => {
        // PLAY SOUND WOWOOWOWOOWOW
        console.log("WOW")
    });
}