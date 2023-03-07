/*--------------------------------------------------------------------
GGR472 WEEK 7: JavaScript for Web Maps
Adding elements to the map
--------------------------------------------------------------------*/

//Define access token
mapboxgl.accessToken = 'pk.eyJ1IjoiZW1pbHlzYWthZ3VjaGkiLCJhIjoiY2xkbTByeWl5MDF5YjNua2RmdWYyZ240ciJ9.l0mkQSD3VSua3-9301GQbA';

//Initialize map
const map = new mapboxgl.Map({
    container: 'map',
    style:'mapbox://styles/emilysakaguchi/cle3eglbo000h01qi6soqwb00',
    center:[-79.402, 43.654],  //this will load Toronto at the centre of the map
    zoom: 12, // this zooms to a level from which users can zoom in or out
});
  
/*I have added all my sources using tilesets because it made the large files easier to work with*/
map.on('load', () => {
map.addSource('redLights', {
    'type': 'vector', 
    'url': 'mapbox://emilysakaguchi.autrtcjc' 
});

map.addLayer({
    'id': 'Red_Light_Cameras_Data-9xih4n',
    'type': 'circle',
    'source': 'redLights', 
    'paint': {
        'circle-radius': 4,
        'circle-color': 'red' // red is a logical colour to represent red lights
    },
    'source-layer': 'Red_Light_Cameras_Data-9xih4n' 
},
);

map.addSource('neighbourhoodsTO', { 
    'type': 'vector', 
    'url': 'mapbox://emilysakaguchi.bsiq2wyk' 
});

map.addLayer({
    'id': 'neighbourhoods',
    'type': 'polygon',
    'source': 'neighbourhoodsTO', 
    'paint': {
        'fill-color': 'green', // this 
        'fill-opacity': 0.8,
        'fill-outline-color': 'white'
    },
    'source-layer': 'Neighbourhoods-90ored' //name of layer. Get this from mapbox tileset page
    //'filter': ['==', ['get', 'PRUID'], ''] //Set an initial filter to return nothing
});

},
//This places it below all other data since it is more contextual
     'Red_Light_Cameras_Data-9xih4n',
     'Motor_Vehicle_Collisions_with-alntc8'
);

map.addSource('seriousCollisions', { //Your source ID
    'type': 'vector', 
    'url': 'mapbox://emilysakaguchi.0h4lt48g' //Your tileset link from mapbox
});
map.addLayer({
    'id': 'Motor_Vehicle_Collisions_with-alntc8',
    'type': 'circle',
    'source': 'seriousCollisions', 
    'paint': {
        'circle-radius': 2.5, //there are so many data points, so small size increases visibility
        'circle-color': 'yellow' //this is a good colour because it's associated with warnings/danger and red is better suited to cameras
    },
    'source-layer': 'Motor_Vehicle_Collisions_with-alntc8' 
},
    'Red_Light_Cameras_Data-9xih4n'//I want the red light cameras to be eaisly visible
);


map.addSource('toronto-mus', {
  type: 'geojson',
  data: 'https://raw.githubusercontent.com/smith-lg/ggr472-wk6-demo/main/data/torontomusicvenues.geojson'
  //'https://smith-lg.github.io/ggr472-wk6-demo/data/torontomusicvenues.geojson'
  /Users/emi/Desktop/Spring 2023/GGR472/lab_3/kensingtonMap.geojsonV2
});

map.addLayer({
  'id': 'toronto-mus-pnts',
  'type': 'circle',
  'source': 'toronto-mus',
  'paint': {
      'circle-radius': 5,
      'circle-color': 'white'
  }
});

//Draw GeoJSON labels using 'name' property
map.addLayer({
  'id': 'kesnington-labels',
  'type': 'symbol',
  'source': 'toronto-mus',
  'layout': {
      'text-field': ['get', 'Name'],
      'text-variable-anchor': ['bottom'],
      'text-radial-offset': 0.5,
      'text-justify': 'auto'
  },
  'paint': {
      'text-color': 'white'
  }
});

});

//Lab 1 data
map.addLayer({
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "properties": {
          "Name": "Buddha's Vegetarian",
          "Type": "restaurant",
          "marker-color": "#ff7b0f",
          "marker-size": "medium"
        },
        "geometry": {
          "coordinates": [
            -79.40350442304744,
            43.65193070498
          ],
          "type": "Point"
        }
      },
      {
        "type": "Feature",
        "properties": {
          "Name": "Green's Vegetarian Restaurant",
          "Type": "restaurant",
          "marker-color": "#ff7b0f",
          "marker-size": "medium"
        },
        "geometry": {
          "coordinates": [
            -79.40249281601274,
            43.65214421768164
          ],
          "type": "Point"
        }
      },
      {
        "type": "Feature",
        "properties": {
          "Name": "King's Cafe",
          "Type": "restaurant",
          "marker-color": "#ff7b0f",
          "marker-size": "medium"
        },
        "geometry": {
          "coordinates": [
            -79.40207075812569,
            43.654235724951775
          ],
          "type": "Point"
        }
      },
      {
        "type": "Feature",
        "properties": {
          "Name": "Veggie D'Light",
          "Type": "restaurant",
          "marker-color": "#ff7b0f",
          "marker-size": "medium"
        },
        "geometry": {
          "coordinates": [
            -79.39971031543355,
            43.65489019908321
          ],
          "type": "Point"
        }
      },
      {
        "type": "Feature",
        "properties": {
          "Name": "Saigon Lotus",
          "Type": "restaurant",
          "marker-color": "#ff7b0f",
          "marker-size": "medium"
        },
        "geometry": {
          "coordinates": [
            -79.39928228784633,
            43.65439768569274
          ],
          "type": "Point"
        }
      },
      {
        "type": "Feature",
        "properties": {
          "Name": "Bellevue Square Park",
          "Type": "park",
          "marker-color": "",
          "stroke-opacity": "#ffffff",
          "stroke": "#10942a"
        },
        "geometry": {
          "coordinates": [
            [
              [
                -79.4030506682268,
                43.65358506232508
              ],
              [
                -79.40284953549805,
                43.65311161952616
              ],
              [
                -79.40157837665332,
                43.65337550613688
              ],
              [
                -79.40177950938207,
                43.653850887178294
              ],
              [
                -79.4030506682268,
                43.65358506232508
              ]
            ]
          ],
          "type": "Polygon"
        }
      },
      {
        "type": "Feature",
        "properties": {
          "Name": "Sonya's Parkette",
          "Type": "park",
          "marker-color": "",
          "stroke-opacity": "#ffffff",
          "stroke": "#10942a"
        },
        "geometry": {
          "coordinates": [
            [
              [
                -79.40220593520162,
                43.65614323823226
              ],
              [
                -79.40208441601108,
                43.65584453961449
              ],
              [
                -79.40200340321748,
                43.655865955791654
              ],
              [
                -79.40197224445079,
                43.65579043555522
              ],
              [
                -79.40184449350699,
                43.655820869094356
              ],
              [
                -79.40200340321748,
                43.65617930739887
              ],
              [
                -79.40220593520162,
                43.65614323823226
              ]
            ]
          ],
          "type": "Polygon"
        }
      },
      {
        "type": "Feature",
        "properties": {
          "Name": "Augusta Avenue",
          "Type": "major road",
          "stroke-opacity": "",
          "stroke-width": ""
        },
        "geometry": {
          "coordinates": [
            [
              -79.40318860700745,
              43.65733592088398
            ],
            [
              -79.40113907526616,
              43.65232289746817
            ]
          ],
          "type": "LineString"
        }
      },
      {
        "type": "Feature",
        "properties": {
          "Name": "Oxford Street",
          "Type": "major road"
        },
        "geometry": {
          "coordinates": [
            [
              -79.40602521321222,
              43.65544044246445
            ],
            [
              -79.39962151307682,
              43.656727724190546
            ]
          ],
          "type": "LineString"
        }
      },
      {
        "type": "Feature",
        "properties": {
          "Name": "Nassau Street",
          "Type": "major road",
          "fill": ""
        },
        "geometry": {
          "coordinates": [
            [
              -79.40681125523267,
              43.65430696622116
            ],
            [
              -79.39926466442851,
              43.65585055175097
            ]
          ],
          "type": "LineString"
        }
      },
      {
        "type": "Feature",
        "properties": {
          "Name": "Kensington Market",
          "Type": "neighbourhood",
          "stroke": "#0d0d0c",
          "stroke-width": 4,
          "stroke-opacity": 1,
          "fill": "#ffffff",
          "fill-opacity": 0
        },
        "geometry": {
          "coordinates": [
            [
              [
                -79.40773292877134,
                43.65647732117057
              ],
              [
                -79.40606754935986,
                43.65235950363831
              ],
              [
                -79.40548547500215,
                43.652417997341445
              ],
              [
                -79.40383626432258,
                43.65172776801322
              ],
              [
                -79.39812870187193,
                43.65293273947307
              ],
              [
                -79.40016596212314,
                43.65791615106613
              ],
              [
                -79.40773292877134,
                43.65647732117057
              ]
            ]
          ],
          "type": "Polygon"
        }
      },
      {
        "type": "Feature",
        "properties": {
          "stroke": "#10942a",
          "stroke-width": 2,
          "stroke-opacity": 1,
          "fill": "#a5ff75",
          "fill-opacity": 0.5
        },
        "geometry": {
          "coordinates": [
            [
              [
                -79.40895270237343,
                43.65356172816507
              ],
              [
                -79.40798233035454,
                43.65356172816507
              ],
              [
                -79.40798233035454,
                43.653837362956295
              ],
              [
                -79.40895270237343,
                43.653837362956295
              ],
              [
                -79.40895270237343,
                43.65356172816507
              ]
            ]
          ],
          "type": "Polygon"
        }
      }
    ]
  }


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
// map.on('load', () => {
//     map.addSource('canada-provterr', {
//         'type': 'vector',
//         'url': 'mapbox://lgsmith.843obi8n'
//     });

//     map.addLayer({
//         'id': 'provterr-fill',
//         'type': 'fill',
//         'source': 'canada-provterr',
//         'paint': {
//             'fill-color': [
//                 'step', // STEP expression produces stepped results based on value pairs
//                 ['get', 'POP2021'], // GET expression retrieves property value from 'capacity' data field
//                 '#fd8d3c', // Colour assigned to any values < first step
//                 100000, '#fc4e2a', // Colours assigned to values >= each step
//                 500000, '#e31a1c',
//                 1000000, '#bd0026',
//                 5000000, '#800026'
//             ],
//             'fill-opacity': 0.5,
//             'fill-outline-color': 'white'
//         },
//         'source-layer': 'can-provterr2021-9crjaq'
//     });

// });



/*--------------------------------------------------------------------
CREATE LEGEND IN JAVASCRIPT
--------------------------------------------------------------------*/
//Declare arrayy variables for labels and colours
const legendlabels = [
    'major collision', //yellow
    'red light camera', //red
    'pedestrian path' // pedestrian network
];

const legendcolours = [
    '#yellow',
    '#red',
    '#green'
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
        'provterr-fill',
        'visibility',
        e.target.checked ? 'visible' : 'none'
    );
});


