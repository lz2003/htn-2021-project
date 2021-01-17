chrome.runtime.onInstalled.addListener((details)=> {

    const fishdict = {
        "mola": false,
        "moray": false,
        "scallop": false,
        "shrimp": false,
        "octopus": false,
        "tuna": false,
        "jellyfish": false
    }

    console.log(details.reason)
    if (details.reason == "install" || details.reason == "update" ) {
        console.log("Added");
        chrome.storage.local.set({storage: fishdict}, function(){})

        chrome.storage.local.set({history: "none"}, function(){})
    }
});
