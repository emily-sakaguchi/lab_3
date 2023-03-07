/*--------------------------------------------------------------------
GGR472 Lab 3
JavaScript
--------------------------------------------------------------------*/

//My Mapbox access token
mapboxgl.accessToken = 'pk.eyJ1IjoiZW1pbHlzYWthZ3VjaGkiLCJhIjoiY2xkbTByeWl5MDF5YjNua2RmdWYyZ240ciJ9.l0mkQSD3VSua3-9301GQbA';

//Initialize map
const map = new mapboxgl.Map({
    container: 'map',
    style:'mapbox://styles/emilysakaguchi/cle3eglbo000h01qi6soqwb00',
    center:[-79.371, 43.720],  //these cooraintes load Toronto at the centre of the map
    zoom: 10.5 // this zooms to show all of Toronto, so users can explore by zooming in to areas of interest
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
CATEGORICAL MAP OF NEIGHBOURHOOD INPROVEMENT AREA DATA
Colours assigned to categorical data
--------------------------------------------------------------------*/
// I used a tileset so that I could handle the large file size 
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
        'Not an NIA or Emerging Neighbourhood',
        '#A3be25', // lime green
        'Neighbourhood Improvement Area', 
        '#F7d125', // soft red
        'Emerging Neighbourhood',
        '#Ff6700', // neutral yellow
        '#949494' // grey in case of uncategorized values, but there should not be any
        ],
        'fill-opacity': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            1,
            0.5
        ],
        'fill-outline-color': 'white'
      },
    'source-layer': 'Neighbourhoods-90ored' 
  });
},
);

map.addLayer({
  'id': 'neighbourhood-labels',
  'type': 'symbol',
  'source': 'neighbourhoodsTO',
  'layout': {
      'text-field': ['get', 'AREA_NAME'],
      'text-variable-anchor': ['bottom'],
      'text-radial-offset': 0.5,
      'text-justify': 'auto'
  },
  'paint': {
      'text-color': 'black'
  },

});


/*--------------------------------------------------------------------
CREATE LEGEND IN JAVASCRIPT
--------------------------------------------------------------------*/
// //Declare array variables for labels and colours
const legendlabels = [
    'Not an NIA or Emerging Neighbourhood',
    'Neighbourhood Improvement Area', 
    'Emerging Neighbourhood'
];

const legendcolours = [
    '#A3be25', // lime green for 'Not an NIA or Emerging Neighbourhood'
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
        center:[-79.371, 43.720],  //these cooraintes load Toronto at the centre of the map
        zoom: 10.5, // this zooms to show all of Toronto, so users can explore by zooming in to areas of interest
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
POPUP EVENT
--------------------------------------------------------------------*/
map.on('mouseenter', 'neighbourhoods-fill', () => {
    map.getCanvas().style.cursor = 'pointer'; //Switch cursor to pointer when mouse is over provterr-fill layer
});

map.on('mouseleave', 'neighbourhoods-fill', () => {
    map.getCanvas().style.cursor = ''; //Switch cursor back when mouse leaves provterr-fill layer
    map.setFilter("",['==', ['get', 'PRUID'], '']);
});

map.on('click', 'neihgbourhoods-fill', (e) => {
    new mapboxgl.Popup() //Declare new popup object on each click
        .setLngLat(e.lngLat) //Use method to set coordinates of popup based on mouse click location
        .setHTML("<b>Neighbourhood Name:</b> " + e.features[0].properties.AREA_NAME + "<br>" +
            "Status: " + e.features[0].properties.CLASSIFICATION) //Use click event properties to write text for popup
        .addTo(map); //Show popup on map
})

/*--------------------------------------------------------------------
HOVER EVENT
// --------------------------------------------------------------------*/
let areaID = null; //Declare initial province ID as null

map.on('mousemove', 'neighourhoods-fill', (e) => {
    if (e.features.length > 0) { //If there are features in array enter conditional

        if (areaID !== null) { //If provID IS NOT NULL set hover feature state back to false to remove opacity from previous highlighted polygon
            map.setFeatureState(
                { source: 'neighbourhoodsTO', id: areaID },
                { hover: false }
            );
        }

        areaID = e.features[0].id; //Update provID to featureID
        map.setFeatureState(
            { source: 'neighbourhoodsTO', id: areaID },
            { hover: true } //Update hover feature state to TRUE to change opacity of layer to 1
        );
    }
});


map.on('mouseleave', 'neighourhoods-fill', () => { //If mouse leaves the geojson layer, set all hover states to false and provID variable back to null
    if (areaID !== null) {
        map.setFeatureState(
            { source: 'neighbourhoodsTO', id: areaID },
            { hover: false }
        );
    }
    provID = null;
});

