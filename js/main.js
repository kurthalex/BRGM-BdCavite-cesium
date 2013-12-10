/*
 * main.js
 * Launched when the document is ready and manage the loading of data
 */
var main=function() { 
    
    "use strict"; //use strict javascript    
    var viewer;
    var layers;
    var scene;
    var ellipsoid;
    var cursor="default";
    var currentCountry;
    var currentType = "indetermine";
    var points = [];
    var departementsIGC = new Array(75, 92, 93, 94, 78, 91, 95);

    /*
     * This function remove all the primitives
     */
    var clear = function() {
        scene.getPrimitives().removeAll();
    }

    /*
     * This function pick on the extent of the department and start the loading
     */
    var pickCountry = function(id) {
        // Loading the bouding box of the country and check if his defined
        lib_ajax.get("data/bbox_dpt_wgs84.json", function(__data) {
            var data = JSON.parse(__data).bbox_dpt_france[id];
            
            for (var i=0;i<departementsIGC.length;i++){
                if(departementsIGC[i] == id) {
                    alert("Pas de données BRGM disponibles pour les départements suivants :\n\n\n75, 92, 93, 94\nVeuillez vous renseigner auprès de l'IGC de Paris\n\n78, 91, 95\nVeuillez vous renseigner auprès de l'IGC de Versailles");
                    return;
                }
            }
            
            if(data == undefined) {
                alert("Ce département n'existe pas\n");
                return;
            }
            currentCountry = id;
            var radios = htmlInteraction.getElementsByName('type');
            for(var i = 0; i < radios.length; ++i) 
                radios[i].disabled = true;            
            
            var extent = new Cesium.Extent(
                Cesium.Math.toRadians(data["long_min"]),
                Cesium.Math.toRadians(data["lat_min"]),
                Cesium.Math.toRadians(data["long_max"]),
                Cesium.Math.toRadians(data["lat_max"]));
            scene.getAnimations().add(
                Cesium.CameraFlightPath.createAnimationExtent(scene, 
                {
                    destination: extent
                })
            );
        });
        loadData(id, true);
    }

    /*
     * This function load the data in memory
     */
    var loadData = function(country, displayErrors) {
        lib_ajax.get("data/"+country+".json", function(__data) {
            var data = JSON.parse(__data);
            points = data.data;
            // Computing the data
            for(var i = 0; i < points.length; ++i) {
                var point = points[i];
                htmlInteraction.getElement("legend_"+point["type_cavite"]).disabled = false;
            }
        });
    }

    /*
     * This function manage the changes of type of cavity and display the thumbtrack
     */
    var switchType = function(type_) {
        clear();
        for(var i = 0; i < points.length; ++i) {
            var point = points[i];
            var lat = parseFloat(point["x_wgs84"]);
            var lon = parseFloat(point["y_wgs84"]);
            if(point["type_cavite"] == type_) {
                var t = new Thumbtrack(ellipsoid, lat, lon);
                var elements = t.getPrimitives();
                for(var p in elements) {
                    var plot = scene.getPrimitives().add(elements[p]);
                    plot.pickable = true;
                    plot.pointIndex = i;
                }
            }   
        }

        //This part manage the calling of popup when a click is detect on a thumbtrack
        var handlerClick = new Cesium.ScreenSpaceEventHandler(scene.getCanvas());
        handlerClick.setInputAction(function (movement) {
            var pickedObject = scene.pick(movement.position);
            if (!Cesium.defined(pickedObject)) return;
            if (!pickedObject.primitive) return;
            if (!pickedObject.primitive.pickable) return;
            var point=points[pickedObject.primitive.pointIndex];
            popup.open(point);
            if (pickedObject.primitive.onclick) pickedObject.primitive.onclick(true);
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    };

    /*
     * This function remove all the primitives
     */
    var run = function() {
        /* Manage the several Events
         * This event listen the text box and read the department number
         */
        var formCountry = htmlInteraction.getElement("pickCountryForm");
        formCountry.addEventListener('submit', function(event) {
            event.preventDefault();
            pickCountry(htmlInteraction.getElement("countryNumber").value);
            switchType(currentType);
        });
        /*
         * This event listen the radio box and Check the type of cavity
         */
        var radios = htmlInteraction.getElementsByName('type');
        for(var i = 0; i < radios.length; ++i) {
            var radio = radios[i];            
            radio.addEventListener('click', function(event) {
                if(this.checked) {
                    currentType = this.value;
                    switchType(currentType);
                }  
            });
        }

       
        //open viewer using ArcGIS world street map
        viewer = new Cesium.CesiumWidget('cesiumContainer', {
            imageryProvider : new Cesium.ArcGisMapServerImageryProvider({
                url : 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer',
                proxy : new Cesium.DefaultProxy('proxy/index.php?url=')
            })
        });
      
               
        //open viewer using OSM world street map
        viewerOsm = new Cesium.CesiumWidget('cesiumContainer', {
            imageryProvider : new Cesium.OpenStreetMapImageryProvider({
                url : 'http://tile.openstreetmap.org/'
            })
        });
       
        
		//open viewer using Bing staellite Imagery world street map
        viewerBingSat = new Cesium.CesiumWidget('cesiumContainer', {
            imageryProvider : new Cesium.BingMapsImageryProvider({
                url: 'http://dev.virtualearth.net',
                mapStyle: Cesium.BingMapsStyle.AERIAL_WITH_LABELS
            })
        });


        // Reference to the layers of cesium
        layers = viewer.centralBody.getImageryLayers();
        scene = viewer.scene;
        ellipsoid = viewer.centralBody.getEllipsoid();

        // Loading the bouding box of the france
        lib_ajax.get("data/bbox_france_wgs84.json", function(__data) {
            var data = JSON.parse(__data).bbox_france;
            var extent = new Cesium.Extent(
                Cesium.Math.toRadians(data["long_min"]),
                Cesium.Math.toRadians(data["lat_min"]),
                Cesium.Math.toRadians(data["long_max"]),
                Cesium.Math.toRadians(data["lat_max"]));
            scene.getAnimations().add(
                Cesium.CameraFlightPath.createAnimationExtent(scene, 
                {
                    destination: extent
                })
            );
        });       
    };
    run();
};
