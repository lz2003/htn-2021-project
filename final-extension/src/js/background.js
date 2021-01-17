var counting = false;
var endTimer = false;
var remain;
var views;
var fishdict = {};

var startTimerAudio = new Audio(chrome.runtime.getURL("../../assets/starttimer.wav"));
var endTimerAudio = new Audio(chrome.runtime.getURL("../../assets/endtimer.wav"));

// Listens for messages
chrome.runtime.onMessage.addListener(
    (request, _, sendResponse) => {
        if (request.action == "start") {
            startTimerAudio.play();
            chrome.storage.local.get(["duration"], function(result){ 
                createTimer(result.duration);
            });
            sendResponse( {status: "success"} );
        } else if (request.action == "check") {
            sendResponse( {status: counting});
        } else if (request.action == "stop") {
            endTimerAudio.play();
            endTimer = true;
            chrome.browserAction.setBadgeText({text: null}, function(response){});
            sendResponse( {status: "stopping timer"});
        } else if (request.action == "view") {
            startTimerAudio.play();
            openCollections();
            sendResponse( {status: "opened collections"});
        }
        else {
            sendResponse( {status: "error"});
        }
    }
)

// Creates the timer
function createTimer(timerMinutes)  {
    // Get time
    counting = true;
    var currTime = new Date().getTime();

    // Calculate total time 
    var totalSeconds = (timerMinutes * 60);
    if (totalSeconds > 1500 || totalSeconds < 0) {
        alert("Invalid range");
        counting = false;
        return;
    }
    var finalTime = new Date(currTime + totalSeconds * 1000);
    var frequency = 100;

    // Countdown
    var int = setInterval(function() {
        var currTime = new Date();
        remain = (finalTime - currTime) / 1000;

        if (remain <= 0 || endTimer) {
            clearInterval(int);
            counting = false;
            if (!endTimer) notifyUser();
            endTimer = false;
            chrome.browserAction.setBadgeText({text: ("")}, function(response){});
            return;
        }
        
        // Ay fixed it kind of?
        views = chrome.extension.getViews({ type: "popup" });
        if (views.length > 0) chrome.runtime.sendMessage({seconds: remain, name: null}, _ => {})   

        // For displaying badge
        var m = Math.floor(remain / 60);
        var s = Math.floor(remain % 60);

        if (s < 10) s = "0" + s;
        if (m < 10) m = "0" + m;

        chrome.browserAction.setBadgeBackgroundColor({color:"#153F9F"}, function(response){});
        chrome.browserAction.setBadgeText({text: (m+":"+s)}, function(response){});

    }, frequency);

}

function notifyUser() {
    chrome.notifications.create("caught-fish", 
    {
        type:'basic',
        title:"Pomodoro timer ended!",
        message:"You caught a fish! Check the compendium for all captured fish.",
        iconUrl: chrome.extension.getURL('../assets/icon.png')
    }, 
    (not) => {
        //console.log("WOW")
        //sends out message to change name of start button to "start fishing"
        views = chrome.extension.getViews({ type: "popup" });
        if (views.length > 0) chrome.runtime.sendMessage({name:"start fishing"}, function(response){console.log("change button");})
        randomFish()
    });
}

// Opens the compendium of fish!
function openCollections() {
    chrome.tabs.create({ 'url': '/src/html/collections.html'},(tab) => {});
}

function randomNumber(max, min) //picks random number between max (inclusive) and min (inclusive)
{
	return Math.floor(Math.random() * (max-min)) + min;
}

function randomFish() //updates the fish dictionary, returns a random name from the fishNames keys
{
	//chrome.storage.local.set({storage: fishdict}, function(){})

    // Retreive fish data
	chrome.storage.local.get(["storage"], function(result){
		fishdict = result.storage;

        // Extract keys
        var fishNames = Object.keys(fishdict);
        // Get total number of unqiue fishes
        var fishTypes = fishNames.length;
        
        // Generate a random fish
		var rand = randomNumber(0, fishTypes);
        var name = fishNames[rand];

        /* For testing outputs
        console.log(name);
		if (fishdict[name] > 0) console.log("caught before");
        else console.log("not caught before");
        */

        // Set the storage
        fishdict[name]++;
        chrome.storage.local.set({storage: fishdict}, function(){})

        // Send popup the updated image
        chrome.storage.local.set({history: name}, function(){})
        views = chrome.extension.getViews({ type: "popup" });
        if (views.length > 0) chrome.runtime.sendMessage({seconds: -1, name: name}, _ => {})   
	});
}