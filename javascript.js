var map = L.map('map').setView([47.505, -121.29], 8);
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiZW10YWMiLCJhIjoiY2w5ejR0bXZyMGJpbDNvbG5jMTFobGJlZCJ9.UMi2J2LPPuz0qbFaCh0uRA'
}).addTo(map);

var drawnItems = L.featureGroup().addTo(map);

// create draw control, limit features, assign to drawnItems layer
new L.Control.Draw({
    draw : {
        polygon : false,
        polyline : false,
        rectangle : false,     // Rectangles disabled
        circle : false,        // Circles disabled 
        circlemarker : false,  // Circle markers disabled
        marker: true
    },
    edit : {
        featureGroup: drawnItems
    }
}).addTo(map);

var popup = L.popup({className: 'infobox'})
    .setLatLng(map.getBounds().getCenter())
    .setContent('<p>Welcome!<hr />This tool is designed to help mushroom foragers track their finds. To get started, click on the location pin on the left and drop it on a foraging site. You will then be prompted to describe the area and conditions in an effort to identify similar sites.</p>')
    .openOn(map);

// Create popup form bound to drawnItems layer
function createFormPopup() {
    var popupContent =  
    '	<form>' + 
    '		What mushroom variety was found?<br><input type="text" id="variety"><br>' + 
    '		Attach a photo<br><input type="file" id="photo" onchange="loadFile(event)" accept="image/*" style="display: none;">' + 
    '		<div class="photo">' + 
    '			<label for="photo" style="cursor: pointer;"><span class="fa fa-image"></span></label><br><img id="output" width="200" /><br>' + 
    '		</div>' + 
    '		Provide a brief description of the area.<br><textarea name = "Description" id= "description" rows="5" cols="35"></textarea><br>' + 
    '		What were the surrounding tree species (if any)?<br><input type="text" id="trees"><br>' + 
    '		What were the dominant plant species in the area?<br><input type="text" id="plants"><br>' + 
    '		What has the weather been like in the past few days?<br>' + 
    '		<div class="weather">' + 
    '			<input id="sunny" name="weather" type="radio" value="sunny" class="radio-btn" />' + 
    '			<label for="sunny" >Sunny</label><br>' + 
    '			<input id="cloudy" name="weather" type="radio" value="cloudy" class="radio-btn" />' + 
    '			<label for="cloudy" >Cloudy</label><br>' + 
    '			<input id="rainy" name="weather" type="radio" value="rainy" class="radio-btn" />' + 
    '			<label for="rainy" >Rainy</label><br>' + 
    '			<input id="snowy" name="weather" type="radio" value="snowy" class="radio-btn" />' + 
    '			<label for="snowy" >Snowy</label><br>' + 
    '		</div><br>' + 
    '		What is the current temperature (in degrees fahrenheit)?<br><input type="number" id="temperature"><br>' + 
    '		Rate the quality of this site.<br>' + 
    '		<div class="rating">' + 
    '            <input id="star5" name="star" type="radio" value="5" class="radio-btn hide" />' + 
    '            <label for="star5" ><span class="fa fa-star"></span></label>' + 
    '            <input id="star4" name="star" type="radio" value="4" class="radio-btn hide" />' + 
    '            <label for="star4" ><span class="fa fa-star checked"></span></label>' + 
    '            <input id="star3" name="star" type="radio" value="3" class="radio-btn hide" />' + 
    '            <label for="star3" ><span class="fa fa-star checked"></span></label>' + 
    '            <input id="star2" name="star" type="radio" value="2" class="radio-btn hide" />' + 
    '            <label for="star2" ><span class="fa fa-star checked"></span></label>' + 
    '            <input id="star1" name="star" type="radio" value="1" class="radio-btn hide" />' + 
    '            <label for="star1" ><span class="fa fa-star checked"></span></label>' + 
    '            <div class="clear"></div>' + 
    '		</div>' + 
    '		What is the current date and time?<br><input type="datetime-local" id="date"><br>' + 
    '		<input type="button" value="Submit" id="submit">' + 
    '	</form>'
    drawnItems.bindPopup(popupContent).openPopup();
}

//change the event listener code to this
map.addEventListener("draw:created", function(e) {
    e.layer.addTo(drawnItems);
    createFormPopup();
});

function setData(e) {
    // exclusive to "submit" button
    if(e.target && e.target.id == "submit") {
        // Get user name and description
        var mushroomVariety = document.getElementById("variety").value;
        var photoSubmit = document.getElementById("photo").value;
        var description = document.getElementById("description").value;
        var treeSpecies = document.getElementById("trees").value;
        var plantSpecies = document.getElementById("plants").value;
        var temperature = document.getElementById("temperature").value;
        var date = document.getElementById("date").value;
        // Print user name and description
        console.log(mushroomVariety);
        console.log(photoSubmit);
        console.log(description);
        console.log(treeSpecies);
        console.log(plantSpecies);
        document.getElementsByName("weather")
        .forEach(radio => {
            if (radio.checked) {
                console.log(radio.value);
            }
        });
        console.log(temperature);
        document.getElementsByName("star")
            .forEach(radio => {
                if (radio.checked) {
                    console.log(radio.value);
                }
            });
        console.log(date);
        // Get and print GeoJSON for each drawn layer
        drawnItems.eachLayer(function(layer) {
            var drawing = JSON.stringify(layer.toGeoJSON().geometry);
            console.log(drawing);
        });
        // Clear drawn items layer
        drawnItems.closePopup();
        drawnItems.clearLayers();
    }
}

// run setData function on click
document.addEventListener("click", setData);

// close popup when user is editing or deleting features. Reopen when edits and deletions are complete (assuming there are features remaining)
map.addEventListener("draw:editstart", function(e) {
    drawnItems.closePopup();
});
map.addEventListener("draw:deletestart", function(e) {
    drawnItems.closePopup();
});
map.addEventListener("draw:editstop", function(e) {
    drawnItems.openPopup();
});
map.addEventListener("draw:deletestop", function(e) {
    if(drawnItems.getLayers().length > 0) {
        drawnItems.openPopup();
    }
});

var loadFile = function(event) {
	var image = document.getElementById('output');
	image.src = URL.createObjectURL(event.target.files[0]);
};