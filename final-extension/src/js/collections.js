var table = document.createElement('table');

loadCollection();

function loadCollection() {

    document.getElementsByTagName('body')[0].appendChild(table);
    var row = document.createElement('tr');

    var title = document.createElement('th');
        title.innerHTML = "Portrait";
    row.appendChild(title);

    title = document.createElement('th');
    title.innerHTML = "Name";
    row.appendChild(title);

    title = document.createElement('th');
    title.innerHTML = "Capture Status";
    row.appendChild(title);
    
    table.appendChild(row);


    
    chrome.storage.local.get(function(result){
        var fishCollection = result.storage;
        //console.log(fishCollection);

        for (var key in fishCollection) {
            row = document.createElement('tr');
            var name = document.createElement('td');
            var status = document.createElement('td');
            var holder = document.createElement('td');
            var image = document.createElement('img');

            if (fishCollection[key] > 0) {
                name.innerHTML = key;
                status.innerHTML = "caught! x" + fishCollection[key];
                image.src = chrome.extension.getURL('../assets/' + key + '.png');
            } else {
                name.innerHTML = "???";
                status.innerHTML = "uncaught!";
                image.src = chrome.extension.getURL('../assets/placeholder.png');
            }

            holder.appendChild(image);
            row.appendChild(holder);
            row.appendChild(name);
            row.appendChild(status);
            table.appendChild(row);

        }
    });

}