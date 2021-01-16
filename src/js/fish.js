var fishdict = {
	"mola": false,
	"lionfish": false,
	"blue tang": false,
	"clownfish": false
}
chrome.storage.local.set({storage: fishdict}, function(){})
var fishNames = Object.keys(fishdict);
var testText = document.getElementById("fishdisplay");

function randomNumber(max, min) //picks random number between max (inclusive) and min (inclusive)
{
	return Math.floor(Math.random() * (max-min+1) + min);
}

function randomFish() //updates the fish dictionary, returns a random name from the fishNames keys
{
	var rand = randomNumber(0, fishNames.length);
	var name = fishNames[rand];
	chrome.storage.local.get(["storage"], function(result){fishdict = result.storage;})

	if (fishdict[name]) 
	{
		//fish has already been caught before, no need to update storage
		console.log("caught before");
		testText.innerHTML = name;
		return;
	}
	else 
	{
		//new fish! update dictionary and save locally
		console.log("not caught before");
		fishdict[name] = true;
		chrome.storage.local.set({storage: fishdict}, function(){})

		testText.innerHTML = name;
		return;
	}
}

chrome.extension.onMessage.addListener(
    (request, _, sendResponse) => 
	{	
		if (request.fishing == "caught")
		{
			randomFish();
		}
		
    }
)

// Listen for messages from background
/**chrome.extension.onMessage.addListener(function(request, sender, sendResponse){
	alert("got your message coz");

    if (request.fishing == "caught")
		{
			alert("got your message");
			randomFish();
			sendResponse();
		}
}); **/



