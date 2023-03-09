/*--------------------------------------------------------------------
GGR472 Lab 3
JavaScript
--------------------------------------------------------------------*/


//Define access token
mapboxgl.accessToken = 'pk.eyJ1IjoiZW1pbHlzYWthZ3VjaGkiLCJhIjoiY2xkbTByeWl5MDF5YjNua2RmdWYyZ240ciJ9.l0mkQSD3VSua3-9301GQbA';

//Initialize map
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/emilysakaguchi/clexsrdwn000901nllrb8b6wy',
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
GEOCODER
--------------------------------------------------------------------*/

const geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl,
    countries: "ca"
});

//Use geocoder div to position geocoder on page
document.getElementById('geocoder').appendChild(geocoder.onAdd(map));


/*--------------------------------------------------------------------
DATA
--------------------------------------------------------------------*/
//I use match to visualize the categorical data using different colours
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
              '#a9e075', //soft green
              'Neighbourhood Improvement Area', 
              '#F7d125', //soft red
              'Emerging Neighbourhood',
              '#Ff6700' //neutral yellow
              ],
            'fill-opacity': 0.5,
            'fill-outline-color': 'white'
        },
        'source-layer': 'Neighbourhoods-90ored'
    });
  
    //The same polygon layers of neighbouroods with different visualization (for the hover event)
    map.addLayer({
        'id': 'neighbourhoods-opaque', //Update id to represent highlighted layer
        'type': 'fill',
        'source': 'neighbourhoodsTO',
        'paint': {
            'fill-color': [
                'match',
                ['get', 'CLASSIFICATION'],
                'Not an NIA or Emerging Neighbourhood',
                '#a9e075', //soft green
                'Neighbourhood Improvement Area', 
                '#F7d125', //soft red
                'Emerging Neighbourhood',
                '#Ff6700' //neutral yellow
                ],
            'fill-opacity': 1, //Opacity set to 1
            'fill-outline-color': 'white'
        },
        'source-layer': 'Neighbourhoods-90ored',
        'filter': ['==', ['get', '_id'], ''] //Set an initial filter to return nothing
    });


    /*--------------------------------------------------------------------
    HOVER EVENT
    --------------------------------------------------------------------*/

    map.on('mousemove', 'neighbourhoods-fill', (e) => {
        if (e.features.length > 0) { //if there are features in the event features array (i.e features under the mouse hover) then go into the conditional
    
            //set the filter of the provinces-hl to display the feature you're hovering over
            //e.features[0] is the first feature in the array and properties.PRUID is the Province ID for that feature
            map.setFilter('neighbourhoods-opaque', ['==', ['get', '_id'], e.features[0].properties._id]);
    
        }
     });
    
    
    /*--------------------------------------------------------------------
    LOADING GEOJSON FROM GITHUB
    --------------------------------------------------------------------*/
    map.addSource('cafesjson',{
    'type': 'geojson',
    'data': 'https://raw.githubusercontent.com/emily-sakaguchi/lab_3/main/CafeTO%20parklet.geojson'
    })

    map.addLayer({
        'id': 'cafe-parklets',
        'type':'circle',
        'source': 'cafesjson',
        'paint': {
            'circle-radius':['interpolate', ['linear'], ['zoom'], 9, 1, 10.5, 2, 12, 3, 15, 5],
            // the above code adjusts the size of points according to the zoom level
            'circle-color':'blue'
        }
    });
});

/*--------------------------------------------------------------------
LEGEND
--------------------------------------------------------------------*/
//Declare array variables for labels and colours
var legendlabels = [ //I use var rather than const here to provide myself with flexiblity as the legend changes
    'Not an NIA or Emerging Neighbourhood',
    'Neighbourhood Improvement Area', 
    'Emerging Neighbourhood',
    'Curb lane/parklet café'
];

var legendcolours = [ //I use var rather than const here to provide myself with flexiblity as the legend changes
    '#a9e075', // lime green for 'Not an NIA or Emerging Neighbourhood'
    '#F7d125', // soft red for 'Neighbourhood Improvement Area'
    '#Ff6700', // neutral yellow for 'Emerging Neighbourhood'
    'blue' // curb lane/parklet café
];

//legend variable that corresponds to legend div tag in html
const legend = document.getElementById('legend');

//Creates a legend block containing colours and labels
legendlabels.forEach((label, i) => {
    const color = legendcolours[i];

    const item = document.createElement('div'); //creates the rows
    const key = document.createElement('span'); //adds a key (circle of colour) to the row

    key.className = 'legend-key'; //style proprties assigned in style.css
    key.style.backgroundColor = color; //the color is assigned in the layers array

    const value = document.createElement('span'); //add a value variable to the 'row' in the legend
    value.innerHTML = `${label}`; //give the value variable text based on the label

    item.appendChild(key); //appends the key  to the legend row
    item.appendChild(value); //appends the value to the legend row

    legend.appendChild(item); //appends each row to the legend
});


/*--------------------------------------------------------------------
INTERACTIVITY
- check boxes and buttons
--------------------------------------------------------------------*/

//event listener to return map view to full screen on button click
document.getElementById('returnbutton').addEventListener('click', () => {
    map.flyTo({
        center: [-79.371, 43.720],
        zoom: 10.5,
        essential: true
    });
});

//Legend display (check box)
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

//Neighbourhood layer display (check box) using setlayoutproperty
document.getElementById('layercheck').addEventListener('change', (e) => {
    map.setLayoutProperty(
        'neighbourhoods-fill',
        'visibility',
        e.target.checked ? 'visible' : 'none'
    );
});

/*--------------------------------------------------------------------
POP-UP ON CLICK EVENT
- When the cursor moves over the map, it changes from the default hand to a pointer
- When the cursor clicks on a neighbourhood, the name and classification will appear in a pop-up
--------------------------------------------------------------------*/
map.on('mouseenter', 'neighbourhoods-fill', () => {
    map.getCanvas().style.cursor = 'pointer'; //Switch cursor to pointer when mouse is over provterr-fill layer
});

map.on('mouseleave', 'neighbourhoods-fill', () => {
    map.getCanvas().style.cursor = ''; //Switch cursor back when mouse leaves neighbourhood-fill layer
    //map.setFilter("provterr-hl",['==', ['get', 'PRUID'], '']);
});


map.on('click', 'neighbourhoods-fill', (e) => {
    new mapboxgl.Popup() //Declare new popup object on each click
        .setLngLat(e.lngLat) //Use method to set coordinates of popup based on mouse click location
        .setHTML("<b>Neighbourhood name:</b> " + e.features[0].properties.AREA_NAME + "<br>" +
            "<b>Improvment status:</b> " + e.features[0].properties.CLASSIFICATION) //Use click event properties to write text for popup
        .addTo(map); //Show popup on map
})
