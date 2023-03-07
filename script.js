/*--------------------------------------------------------------------
GGR472 Lab 3
JavaScript
--------------------------------------------------------------------*/
/*--------------------------------------------------------------------
GGR472 WEEK 7: JavaScript for Web Maps
Adding elements to the map
--------------------------------------------------------------------*/

//Define access token
mapboxgl.accessToken = 'pk.eyJ1IjoiZW1pbHlzYWthZ3VjaGkiLCJhIjoiY2xkbTByeWl5MDF5YjNua2RmdWYyZ240ciJ9.l0mkQSD3VSua3-9301GQbA';

//Initialize map
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/emilysakaguchi/cle3eglbo000h01qi6soqwb00',
    center: [-79.371, 43.720], //these cooraintes load Toronto at the centre of the map
    zoom: 10.5, //this zooms to show all of Toronto, so users can explore by zooming in to areas of interest
    maxBounds: [
        [-180, 30], // Southwest
        [-25, 84]  // Northeast
    ],
});


/*--------------------------------------------------------------------
ADDING MAPBOX CONTROLS AS ELEMENTS ON MAP
--------------------------------------------------------------------*/
//Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());

//Add fullscreen option to the map
map.addControl(new mapboxgl.FullscreenControl());

/*--------------------------------------------------------------------
mapbox addControl method can also take position parameter 
(e.g., 'top-left') to move from default top right position

To place geocoder elsewhere on page (including outside of the map,
create HTML div tag for geocoder and use css to position
--------------------------------------------------------------------*/

//Create geocoder variable
const geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl,
    countries: "ca"
});

//Use geocoder div to position geocoder on page
document.getElementById('geocoder').appendChild(geocoder.onAdd(map));



/*--------------------------------------------------------------------
ADD DATA AS CHOROPLETH MAP ON MAP LOAD
Use get expression to categorise data based on population values
--------------------------------------------------------------------*/
//Add data source and draw initial visiualization of layer
map.on('load', () => {
    map.addSource('neighbourhoodsTO', {
        'type': 'vector',
        'url': 'mapbox://emilysakaguchi.bsiq2wyk' 
    });

    map.addLayer({
        'id': 'neighbourhoods-fill',
        'type': 'fill',
        'source': 'neighbourhoodsTO',
        'paint': {
            'fill-color': [
              'match',
              ['get', 'CLASSIFICATION'],
              'Not a NIA or Emerging Neighbourhood',
              '#96be25', // lime green
              'Neighbourhood Improvement Area', 
              '#F7d125', // soft red
              'Emerging Neighbourhood',
              '#Ff6700', // neutral yellow
              '#949494' // grey in case of uncategorized values, but there should not be any
              ],
            'fill-opacity': 0.5,
            'fill-outline-color': 'white'
        },
        'source-layer': 'Neighbourhoods-90ored'
    });

});



/*--------------------------------------------------------------------
CREATE LEGEND IN JAVASCRIPT
--------------------------------------------------------------------*/
//Declare arrayy variables for labels and colours
var legendlabels = [ //I use var rather than const here to provide myself with flexiblity as the legend changes
    'Not an NIA or Emerging Neighbourhood',
    'Neighbourhood Improvement Area', 
    'Emerging Neighbourhood'
];

var legendcolours = [ //I use var rather than const here to provide myself with flexiblity as the legend changes
    '#96be25', // lime green for 'Not an NIA or Emerging Neighbourhood'
    '#F7d125', // soft red for 'Neighbourhood Improvement Area',
    '#Ff6700' // neutral yellow for 'Emerging Neighbourhood'
];

//Declare legend variable using legend div tag
const legend = document.getElementById('legend');

//For each layer create a block to put the colour and label in
legendlabels.forEach((label, i) => {
    const color = legendcolours[i];

    const item = document.createElement('div'); //each layer gets a 'row' - this isn't in the legend yet, we do this later
    const key = document.createElement('span'); //add a 'key' to the row. A key will be the color circle

    key.className = 'legend-key'; //the key will take on the shape and style properties defined in css
    key.style.backgroundColor = color; // the background color is retreived from teh layers array

    const value = document.createElement('span'); //add a value variable to the 'row' in the legend
    value.innerHTML = `${label}`; //give the value variable text based on the label

    item.appendChild(key); //add the key (color cirlce) to the legend row
    item.appendChild(value); //add the value to the legend row

    legend.appendChild(item); //add row to the legend
});



/*--------------------------------------------------------------------
ADD INTERACTIVITY BASED ON HTML EVENT
--------------------------------------------------------------------*/

//Add event listeneer which returns map view to full screen on button click
document.getElementById('returnbutton').addEventListener('click', () => {
    map.flyTo({
        center: [-105, 58],
        zoom: 3,
        essential: true
    });
});

//Change display of legend based on check box
let legendcheck = document.getElementById('legendcheck');

legendcheck.addEventListener('click', () => {
    if (legendcheck.checked) {
        legendcheck.checked = true;
        legend.style.display = 'block';
    }
    else {
        legend.style.display = "none";
        legendcheck.checked = false;
    }
});


//Change map layer display based on check box using setlayoutproperty
document.getElementById('layercheck').addEventListener('change', (e) => {
    map.setLayoutProperty(
        'neighbourhoods-fill',
        'visibility',
        e.target.checked ? 'visible' : 'none'
    );
});

/*--------------------------------------------------------------------
ADD POP-UP ON CLICK EVENT
--------------------------------------------------------------------*/
map.on('mouseenter', 'neighbourhoods-fill', () => {
    map.getCanvas().style.cursor = 'pointer'; //Switch cursor to pointer when mouse is over provterr-fill layer
});

map.on('mouseleave', 'neighnourhoods-fill', () => {
    map.getCanvas().style.cursor = ''; //Switch cursor back when mouse leaves provterr-fill layer
    //map.setFilter("provterr-hl",['==', ['get', 'PRUID'], '']);
});


map.on('click', 'neighbourhoods-fill', (e) => {
    new mapboxgl.Popup() //Declare new popup object on each click
        .setLngLat(e.lngLat) //Use method to set coordinates of popup based on mouse click location
        .setHTML("<b>Neighbourhood name:</b> " + e.features[0].properties.AREA_NAME + "<br>" +
            "Improvment status: " + e.features[0].properties.CLASSIFICATION) //Use click event properties to write text for popup
        .addTo(map); //Show popup on map
})

