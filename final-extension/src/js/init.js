chrome.runtime.onInstalled.addListener((details)=> {

    const fishdict = {
        "mola": 0,
        "moray": 0,
        "scallop": 0,
        "shrimp": 0,
        "octopus": 0,
        "tuna": 0,
        "jellyfish": 0,
        "squid": 0,
        "ray": 0,
        "pufferfish": 0
    }

    //console.log(details.reason)
    if (details.reason == "install") {
        //console.log("Added");
        chrome.storage.local.set({storage: fishdict}, function(){})

        chrome.storage.local.set({history: "none"}, function(){})
        chrome.storage.local.set({duration: 25}, function(){})
    }
});
