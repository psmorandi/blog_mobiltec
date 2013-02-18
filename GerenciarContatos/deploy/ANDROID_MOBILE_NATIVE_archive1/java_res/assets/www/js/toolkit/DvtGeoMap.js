var DvtGeographicMap = function (callback, callbackObj) {
  this.Init(callback, callbackObj);
}

DvtObj.createSubclass(DvtGeographicMap, DvtObj, "DvtGeographicMap");

/** @private */
// TODO change to supported map providers
DvtGeographicMap.MAP_PROVIDER_ORACLE = "oraclemaps";
DvtGeographicMap.MAP_PROVIDER_GOOGLE = "googlemaps";
DvtGeographicMap.MAP_VIEWER_URL = "http://elocation.oracle.com/mapviewer";
DvtGeographicMap.BASE_MAP = "ELOCATION_MERCATOR.WORLD_MAP";

DvtGeographicMap.prototype.Init = function (callback, callbackObj) {
  this._callback = callback;
  this._callbackObj = callbackObj;
  // by default, use google map as the provider
  this.mapProvider = DvtGeographicMap.MAP_PROVIDER_GOOGLE;
  this.mapViewerUrl = DvtGeographicMap.MAP_VIEWER_URL;
  this.baseMap = DvtGeographicMap.BASE_MAP;
  this.selection = [];
}

/**
 * Returns a new instance of DvtGeographicMap.
 * @param {string} callback The function that should be called to dispatch component events.
 * @param {object} callbackObj The optional object instance on which the callback function is defined.
 * @param {object} options The object containing options specifications for this component.
 * @return {DvtGeographicMap}
 */
DvtGeographicMap.newInstance = function (callback, callbackObj, options) {
  var map = new DvtGeographicMap(callback, callbackObj);
  map.setOptions(options);
  return map;
}

/**
 * Returns the map provider
 * @return {string}
 */
DvtGeographicMap.prototype.getMapProvider = function () {
  return this.mapProvider;
}
/**
 * Specifies the map provider
 * @param {string} provider The map provider.
 */
DvtGeographicMap.prototype.setMapProvider = function (provider) {
  // TODO change to supported map providers
  if (provider == DvtGeographicMap.MAP_PROVIDER_ORACLE || 
    provider == DvtGeographicMap.MAP_PROVIDER_GOOGLE)
  this.mapProvider = provider;
}

/**
 * Returns the map viewer url
 * @return {string}
 */
DvtGeographicMap.prototype.getMapViewerUrl = function () {
  return this.mapViewerUrl;
}

/**
 * Specifies the map viewer url
 * @param {string} mapViewerUrl The map viewer url
 */
DvtGeographicMap.prototype.setMapViewerUrl = function (url) {
  this.mapViewerUrl = url;
}

/**
 * Returns the base map
 * @return {string}
 */
DvtGeographicMap.prototype.getBaseMap = function () {
  return this.baseMap;
}


/**
 * Specifies the base map for oracle maps
 * @param {string} baseMap The base map
 */
DvtGeographicMap.prototype.setBaseMap = function (baseMap) {
  this.baseMap = baseMap;
}

/**
 * Specifies the non-data options for this component.
 * @param {object} options The object containing options specifications for this component.
 * @protected
 */
DvtGeographicMap.prototype.setOptions = function (options) {
   this.Options = DvtGeographicMapDefaults.calcOptions(options);
}

/**
 * Dispatches the event to the callback function.
 * @param {object} event The event to be dispatched.
 */
DvtGeographicMap.prototype.__dispatchEvent = function (event) {
  DvtEventDispatcher.dispatchEvent(this._callback, this._callbackObj, this, event);
}

/**
 * Renders the component with the specified data.  If no data is supplied to a component
 * that has already been rendered, the component will be rerendered to the specified size.
 * @param {object} mapCanvas The div to render the map.
 * @param {object} data The object containing data for this component.
 * @param {number} width The width of the component.
 * @param {number} height The height of the component.
 */
DvtGeographicMap.prototype.render = function (mapCanvas, data, width, height) {
  this.Data = data;
  this._width = width;
  this._height = height;
  
  DvtGeographicMapRenderer.render(this, mapCanvas, width, height);
}

/**
 * Default values and utility functions for chart versioning.
 * @class
 */
var DvtGeographicMapDefaults = new Object();

DvtObj.createSubclass(DvtGeographicMapDefaults, DvtObj, "DvtGeographicMapDefaults");

/**
 * Defaults for version 1.
 */ 
DvtGeographicMapDefaults.VERSION_1 = {
  'mapOptions': {
    'mapType': "ROADMAP",
    'zoomLevel': "14",
    'centerX': "-98.57",
    'centerY': "39.82"
  }
};

/**
 * Combines the user options with the defaults for the specified version.  Returns the
 * combined options object.  This object will contain internal attribute values and
 * should be accessed in internal code only.
 * @param {object} userOptions The object containing options specifications for this component.
 * @return {object} The combined options object.
 */
DvtGeographicMapDefaults.calcOptions = function(userOptions) {
  var defaults = DvtGeographicMapDefaults._getDefaults(userOptions);

  // Use defaults if no overrides specified
  if(!userOptions)
    return defaults;
  else // Merge the options object with the defaults
    return DvtJSONUtils.merge(userOptions, defaults);
}

/**
 * Returns the default options object for the specified version of the component.
 * @param {object} userOptions The object containing options specifications for this component.
 * @private
 */
DvtGeographicMapDefaults._getDefaults = function(userOptions) {
  // Note: Version checking will eventually get added here
  // Note: Future defaults objects are deltas on top of previous objects
  return DvtJSONUtils.clone(DvtGeographicMapDefaults.VERSION_1);
}

/**
 * Renderer for DvtGeographicMap.
 * @class
 */
var DvtGeographicMapRenderer = new Object();

DvtObj.createSubclass(DvtGeographicMapRenderer, DvtObj, "DvtGeographicMapRenderer");

DvtGeographicMapRenderer.MAP_VIEWER_URL = "http://elocation.oracle.com/mapviewer";
DvtGeographicMapRenderer.ELOCATION_GEOCODER_URL = "http://elocation.oracle.com/elocation/jslib/oracleelocation.js";
DvtGeographicMapRenderer.DEFAULT_ORACLE_MARKER_IMG = "css/images/geomap/ball_ena.png";
DvtGeographicMapRenderer.DEFAULT_ORACLE_MARKER_HOVER_IMG = "css/images/geomap/ball_ovr.png";
DvtGeographicMapRenderer.DEFAULT_ORACLE_MARKER_SELECT_IMG = "css/images/geomap/ball_sel.png";
DvtGeographicMapRenderer.DEFAULT_GOOGLE_MARKER_IMG = "css/images/geomap/red-circle.png";
DvtGeographicMapRenderer.DEFAULT_GOOGLE_MARKER_HOVER_IMG = "css/images/geomap/ylw-circle.png";
DvtGeographicMapRenderer.DEFAULT_GOOGLE_MARKER_SELECT_IMG = "css/images/geomap/blu-circle.png";
DvtGeographicMapRenderer.MOUSE_OVER = "mouseover";
DvtGeographicMapRenderer.MOUSE_OUT = "mouseout";
DvtGeographicMapRenderer.CLICK = "click";
DvtGeographicMapRenderer.SEL_NONE = "none";
DvtGeographicMapRenderer.SEL_SINGLE = "single";
DvtGeographicMapRenderer.SEL_MULTIPLE = "multiple";

/**
 * Renders the geographic map in the specified area.
 * @param {DvtGeographicMap} map The geographic map being rendered.
 * @param {object} mapCanvas The div to render the map.
 * @param {number} width The width of the component.
 * @param {number} height The height of the component.
 */
DvtGeographicMapRenderer.render = function(map, mapCanvas, width, height) {
  var mapProvider = map.getMapProvider();
  if (mapProvider == DvtGeographicMap.MAP_PROVIDER_ORACLE)
    DvtGeographicMapRenderer.renderOracleMap(map, mapCanvas, width, height);
  else if (mapProvider == DvtGeographicMap.MAP_PROVIDER_GOOGLE)
    DvtGeographicMapRenderer.renderGoogleMap(map, mapCanvas, width, height);
}

/**
 * Renders the geographic map in the specified area.
 * @param {DvtGeographicMap} map The geographic map being rendered.
 * @param {object} mapCanvas The div to render the map.
 * @param {number} width The width of the component.
 * @param {number} height The height of the component.
 */
DvtGeographicMapRenderer.renderOracleMap = function(map, mapCanvas, width, height) {
  var options = map.Options;
  var data = map.Data;
  var baseURL = map.getMapViewerUrl();
  var baseMap = map.getBaseMap();
  var mapCenterLon = options.mapOptions.centerX;
  var mapCenterLat = options.mapOptions.centerY;
  var mpoint = MVSdoGeometry.createPoint(parseFloat(mapCenterLon),parseFloat(mapCenterLat),8307);
  var mapZoom = options.mapOptions.zoomLevel;
  
  var mapview = new MVMapView(mapCanvas, baseURL);
  mapview.addMapTileLayer(new MVBaseMap(baseMap));
  mapview.setCenter(mpoint);
  mapview.setZoomLevel(mapZoom);
  mapview.removeAllFOIs();  
  
  var initialZooming = true;
  if (options.mapOptions.initialZooming)
    initialZooming = options.mapOptions.initialZooming == "none" ? false : true;
  
  // recenter seems to be the default behaviour for double click
  mapview.setDoubleClickAction("recenter");
  
  // set touchHold behaviour
  mapview.setTouchBehavior({touchHold: "mouse_over"});
  
  // set the data layer
  DvtGeographicMapRenderer.setOracleMapDataLayer(map, mapview, data, initialZooming);
  
  mapview.display();
}

/**
 * Set the data layer on oracle map
 * @param {DvtGeographicMap} map The geographic map being rendered.
 * @param {object} mapview The MVMapView
 * @param {object} data The geographic map data object
 * @param {boolean} initialZooming Should the map zoom to the data points
 */
DvtGeographicMapRenderer.setOracleMapDataLayer = function(map, mapview, data, initialZooming) {
  var dataLayers = data['dataLayers'];
  var foiCount = 10000;
  var minX = null;
  var maxX = null;
  var minY = null;
  var maxY = null;
  for (var i = 0; i<dataLayers.length; i++) {
    var dataLayer = dataLayers[i];
    var points = dataLayer['data'];
    for (var j = 0; j<points.length; j++) {
      var params = DvtGeographicMapRenderer.getParams(points[j], DvtGeographicMap.MAP_PROVIDER_ORACLE);
      var selMode = DvtGeographicMapRenderer.getSelMode(dataLayer);
      params['selMode'] = selMode;
      params['dataLayerIdx'] = dataLayer['idx'];
      if (points[j]['x'] && points[j]['y']) {         
        DvtGeographicMapRenderer.addPointFOI(map, mapview, points[j], foiCount++, params);
        minX = DvtGeographicMapRenderer.getMin(minX, parseFloat(points[j]['x']));
        maxX = DvtGeographicMapRenderer.getMax(maxX, parseFloat(points[j]['x']));
        minY = DvtGeographicMapRenderer.getMin(minY, parseFloat(points[j]['y']));
        maxY = DvtGeographicMapRenderer.getMax(maxY, parseFloat(points[j]['y']));
        if (initialZooming && (i == dataLayers.length-1 && j == points.length-1))
          mapview.zoomToRectangle(MVSdoGeometry.createRectangle(minX, minY, maxX, maxY, 8307));
      } else if (points[j]['address']) {
        var addr = points[j]['address'];
        var callback = function(params) {
          return function (gcResult) {
            if (gcResult.length == 0) {
              // no match
              console.log("No matching address found!");
            } else {
              // one or more matching address is found
              // we get the first one
              var addrObj = gcResult[0];                
              DvtGeographicMapRenderer.addPointFOI(map, mapview, addrObj, foiCount++, params);
              
              // This cannot be simply moved outside the loop because the callback may not be finished after the loop ends
              minX = DvtGeographicMapRenderer.getMin(minX, parseFloat(addrObj['x']));
              maxX = DvtGeographicMapRenderer.getMax(maxX, parseFloat(addrObj['x']));
              minY = DvtGeographicMapRenderer.getMin(minY, parseFloat(addrObj['y']));
              maxY = DvtGeographicMapRenderer.getMax(maxY, parseFloat(addrObj['y']));
              if (initialZooming)
                mapview.zoomToRectangle(MVSdoGeometry.createRectangle(minX, minY, maxX, maxY, 8307));
            }
          }
        }
		  
        var url = DvtGeographicMapRenderer.ELOCATION_GEOCODER_URL;
        var success = function(address, params) {
          // need this closure since this is in a loop
          return function () {
            dvtm.geoCoderAPILoaded = true;
            var eloc = new OracleELocation();
            eloc.geocode(address, callback(params));
          }
        };
		  
        var failure = function () {
          console.log("Failed to load GeoCoder API!");
        }
        if (!dvtm.geoCoderAPILoaded)
          dvtm.loadJS(url, success(addr, params));
        else {
               var eloc = new OracleELocation();
               eloc.geocode(addr, callback(params));
        }	
      }	
    }
  } 
}

/**
 * Add point FOI to map
 * @param {DvtGeographicMap} map The geographic map being rendered.
 * @param {object} mapview The map view
 * @param {object} point The point
 * @param {string} pointId The point ID
 * @param {params} params The params for the point foi
 */
DvtGeographicMapRenderer.addPointFOI = function (map, mapview, point, pointId, params) {
  var action = params['action'];
  var geoPoint=MVSdoGeometry.createPoint(parseFloat(point['x']),parseFloat(point['y']),8307);
  var pointFOI = MVFOI.createMarkerFOI(pointId.toString(), geoPoint, params['source']);
  if (params['tooltip'])
    pointFOI.setInfoTip(params['tooltip']);
    
  var selMode = params['selMode'];
  
  // attach selection related event listeners
  if (selMode == DvtGeographicMapRenderer.SEL_SINGLE || selMode == DvtGeographicMapRenderer.SEL_MULTIPLE) {
    DvtGeographicMapRenderer.attachEventListener(map, pointFOI, DvtGeographicMapRenderer.MOUSE_OVER, params);
    DvtGeographicMapRenderer.attachEventListener(map, pointFOI, DvtGeographicMapRenderer.MOUSE_OUT, params);
    DvtGeographicMapRenderer.attachEventListener(map, pointFOI, DvtGeographicMapRenderer.CLICK, params);
  } else if (action) {
    pointFOI.attachEventListener(MVEvent.MOUSE_CLICK, function() {
      var actionEvent = new DvtMapActionEvent(params['clientId'], params['rowKey'], action);
      actionEvent.addParam('dataLayerIdx', params['dataLayerIdx']);
      map.__dispatchEvent(actionEvent);
    }); 
  }
  mapview.addFOI(pointFOI);
}

/**
 * Attach event listeners
 * @param {DvtGeographicMap} map The geographic map being rendered.
 * @param {object} pointFOI The point FOI
 * @param {string} eventType The event type
 * @param {object} params The params for the point foi
 */
DvtGeographicMapRenderer.attachEventListener = function (map, pointFOI, eventType, params) {
  switch (eventType) {
    case DvtGeographicMapRenderer.MOUSE_OVER:
        pointFOI.attachEventListener(MVEvent.MOUSE_OVER, function() {
          if (!pointFOI.selected) {
            pointFOI.updateImageURL(params['sourceHover']);
          } else {
            pointFOI.updateImageURL(params['sourceHoverSelected']);	
          }
        });
        break;
    case DvtGeographicMapRenderer.MOUSE_OUT:
        pointFOI.attachEventListener(MVEvent.MOUSE_OUT, function() {
          if (!pointFOI.selected) {
            pointFOI.updateImageURL(params['source']);
          }
        });
        break;
    case DvtGeographicMapRenderer.CLICK:
        pointFOI.attachEventListener(MVEvent.MOUSE_CLICK, function() {
          var idx = params['dataLayerIdx'];
          if (!map.selection[idx])
            map.selection[idx] = [];
          var selMode = params['selMode'];
          if (!pointFOI.selected) {
            var selection = map.selection[idx];
            if (selMode == DvtGeographicMapRenderer.SEL_SINGLE) {
              if (selection.length != 0) {
                for (var i = 0; i < selection.length; i++) {
                  selection[i].updateImageURL(params['source']);
                  selection[i].selected = false;
                }
                map.selection[idx] = [];
              }
            }
            pointFOI.updateImageURL(params['sourceSelected']);
            pointFOI.selected = true;
            pointFOI.rowKey = params['rowKey'];
            pointFOI.dataLayerIdx = idx;
            map.selection[idx].push(pointFOI);
          } else {
            // deselect
            pointFOI.updateImageURL(params['sourceHover']);
            pointFOI.selected = false;
            // remove from selection
            if (selMode == DvtGeographicMapRenderer.SEL_SINGLE) {
              map.selection[idx] = [];
            } else if (selMode == DvtGeographicMapRenderer.SEL_MULTIPLE) {
              for (var i = 0; i < map.selection[idx].length; i++) {
                if (pointFOI.getId() == map.selection[idx][i].getId()) {
                  map.selection[idx].splice(i, 1);
                  break;
                }
              }
            }
          }
          var evt = new DvtSelectionEvent(map.selection[idx]);
          evt.addParam('dataLayerIdx', idx);
          map.__dispatchEvent(evt);
        });
        break;
      default:
        break;
  }
}

/**
 * Renders the geographic map in the specified area.
 * @param {DvtGeographicMap} map The geographic map being rendered.
 * @param {object} mapCanvas The div to render the map.
 * @param {number} width The width of the component.
 * @param {number} height The height of the component.
 */
DvtGeographicMapRenderer.renderGoogleMap = function(map, mapCanvas, width, height) {
  var options = map.Options;
  var data = map.Data;
  
  var mapCenterLon = parseFloat(options.mapOptions.centerX);
  var mapCenterLat = parseFloat(options.mapOptions.centerY);
  var mapZoom = parseInt(options.mapOptions.zoomLevel);
  var mapType = options.mapOptions.mapType;
  var mapOptions = new Object();
  mapOptions.center = new google.maps.LatLng(mapCenterLat, mapCenterLon);
  mapOptions.zoom = mapZoom;

  switch(mapType) {
    case "ROADMAP":
      mapOptions.mapTypeId = google.maps.MapTypeId.ROADMAP;
      break;
    case "SATELLITE":
      mapOptions.mapTypeId = google.maps.MapTypeId.SATELLITE;
      break;
    case "HYBRID":
      mapOptions.mapTypeId = google.maps.MapTypeId.HYBRID;
      break;
    case "TERRAIN":
      mapOptions.mapTypeId = google.maps.MapTypeId.TERRAIN;
      break;
  }
  
  
  var gmap = new google.maps.Map(mapCanvas, mapOptions);
  
  var initialZooming = true;
  if (options.mapOptions.initialZooming)
    initialZooming = options.mapOptions.initialZooming == "none" ? false : true;
    
  var animationOnDisplay = "none";
  if (options.mapOptions.animationOnDisplay)
    animationOnDisplay = options.mapOptions.animationOnDisplay;
  
  // set the data layer
  DvtGeographicMapRenderer.setGoogleMapDataLayer(map, gmap, data, initialZooming, animationOnDisplay);
  
  // when map is initialized in hidden panel, we need to resize and recenter the map
  google.maps.event.addListenerOnce(gmap, 'idle', function() {
    var center = gmap.getCenter();
    google.maps.event.trigger(gmap, 'resize');
    gmap.setCenter(center);
  });
}

/**
 * Set the data layer on google map
 * @param {DvtGeographicMap} map The geographic map being rendered.
 * @param {object} gmap The google map
 * @param {object} data The geographic map data object
 * @param {boolean} initialZooming Should the map zoom to the data points
 * @param {string} animation Marker animation
 */
DvtGeographicMapRenderer.setGoogleMapDataLayer = function(map, gmap, data, initialZooming, animation) {
  var dataLayers = data['dataLayers'];
  var minX = null;
  var maxX = null;
  var minY = null;
  var maxY = null;
  var markerLatLng = null;
  var bounds = null;
  for (var i = 0; i<dataLayers.length; i++) {
    var dataLayer = dataLayers[i];
    var points = dataLayer['data'];
    var singleMarker = false;
    if (dataLayers.length == 1 && points.length == 1)
      singleMarker = true;
    for (var j = 0; j<points.length; j++) {
      var params = DvtGeographicMapRenderer.getParams(points[j], DvtGeographicMap.MAP_PROVIDER_GOOGLE);
      var selMode = DvtGeographicMapRenderer.getSelMode(dataLayer);
      params['selMode'] = selMode;
      params['dataLayerIdx'] = dataLayer['idx'];
      if (points[j]['x'] && points[j]['y']) {   
        markerLatLng = new google.maps.LatLng(parseFloat(points[j]['y']), parseFloat(points[j]['x']));
        DvtGeographicMapRenderer.addMarker(map, gmap, markerLatLng, params, animation);
        if (initialZooming) {
          if (singleMarker) {
            DvtGeographicMapRenderer.zoomToMarker(gmap, markerLatLng);
          } else {
            minX = DvtGeographicMapRenderer.getMin(minX, parseFloat(points[j]['x']));
            maxX = DvtGeographicMapRenderer.getMax(maxX, parseFloat(points[j]['x']));
            minY = DvtGeographicMapRenderer.getMin(minY, parseFloat(points[j]['y']));
            maxY = DvtGeographicMapRenderer.getMax(maxY, parseFloat(points[j]['y']));
            bounds = DvtGeographicMapRenderer.getBounds(minX, maxX, minY, maxY);
            if (i == dataLayers.length-1 && j == points.length-1)
              gmap.fitBounds(bounds);
          }
        }
        
      } else if (points[j]['address']) {
        var addr = points[j]['address'];
        var geocoder = new google.maps.Geocoder();
        function callback(markerParams) {
          return function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
              markerLatLng = results[0].geometry.location;
              DvtGeographicMapRenderer.addMarker(map, gmap, markerLatLng, markerParams, animation);
              
              // This cannot be simply moved outside the loop because the callback may not be finished after the loop ends
              if (initialZooming) {
                if (singleMarker) {
                  DvtGeographicMapRenderer.zoomToMarker(gmap, markerLatLng);
                } else {
                  minX = DvtGeographicMapRenderer.getMin(minX, markerLatLng.lng());
                  maxX = DvtGeographicMapRenderer.getMax(maxX, markerLatLng.lng());
                  minY = DvtGeographicMapRenderer.getMin(minY, markerLatLng.lat());
                  maxY = DvtGeographicMapRenderer.getMax(maxY, markerLatLng.lat());
                  bounds = DvtGeographicMapRenderer.getBounds(minX, maxX, minY, maxY);
                  gmap.fitBounds(bounds);
                }
              }
            } 
          }
        };
        geocoder.geocode( { 'address': addr}, callback(params));       
        
      }	
    }
  } 
}

/**
 * Add marker to map
 * @param {DvtGeographicMap} map The geographic map being rendered.
 * @param {object} gmap The google map
 * @param {object} markerLatLng
 * @param {params} params The params for the point foi
 * @param {string} animation Marker animation
 */
DvtGeographicMapRenderer.addMarker = function (map, gmap, markerLatLng, params, animation) {
  var action = params['action'];
  var tooltip = "";
  if (params['tooltip'])
    tooltip = params['tooltip'];
 
  var sourceImg = new google.maps.MarkerImage(params['source'], null, null, null, new google.maps.Size(32, 32));
  var marker = new google.maps.Marker({
    position: markerLatLng,
    icon: sourceImg,
    title: tooltip
  });
  
  if (animation == "auto")
    marker.setAnimation (google.maps.Animation.DROP);
  
  // Add marker to the map
  marker.setMap(gmap);
  
  var selMode = params['selMode'];
  
  // attach selection related event listeners
  if (selMode == DvtGeographicMapRenderer.SEL_SINGLE || selMode == DvtGeographicMapRenderer.SEL_MULTIPLE) {
    DvtGeographicMapRenderer.attachGMapEventListener(map, marker, DvtGeographicMapRenderer.MOUSE_OVER, params);
    DvtGeographicMapRenderer.attachGMapEventListener(map, marker, DvtGeographicMapRenderer.MOUSE_OUT, params);
    DvtGeographicMapRenderer.attachGMapEventListener(map, marker, DvtGeographicMapRenderer.CLICK, params);
  } else if (action) {
    google.maps.event.addListener(marker, DvtGeographicMapRenderer.CLICK, function() {
      var actionEvent = new DvtMapActionEvent(params['clientId'], params['rowKey'], action);
      actionEvent.addParam('dataLayerIdx', params['dataLayerIdx']);
      map.__dispatchEvent(actionEvent);
    }); 
  }
}

/**
 * Attach event listeners
 * @param {DvtGeographicMap} map The geographic map being rendered.
 * @param {object} marker The marker
 * @param {string} eventType The event type
 * @param {object} params The params for the point
 */
DvtGeographicMapRenderer.attachGMapEventListener = function (map, marker, eventType, params) {
  var sourceImg = new google.maps.MarkerImage(params['source'], null, null, null, new google.maps.Size(32, 32));
  var sourceHoverImg = new google.maps.MarkerImage(params['sourceHover'], null, null, null, new google.maps.Size(32, 32));
  var sourceSelectedImg = new google.maps.MarkerImage(params['sourceSelected'], null, null, null, new google.maps.Size(32, 32));
  var sourceHoverSelectedImg = new google.maps.MarkerImage(params['sourceHoverSelected'], null, null, null, new google.maps.Size(32, 32));
  switch (eventType) {
    case DvtGeographicMapRenderer.MOUSE_OVER:
        google.maps.event.addListener(marker, DvtGeographicMapRenderer.MOUSE_OVER, function() {
          if (!marker.selected) {
            marker.setIcon(sourceHoverImg);
          } else {
            marker.setIcon(sourceHoverSelectedImg);
          }
        });
        break;
    case DvtGeographicMapRenderer.MOUSE_OUT:
        google.maps.event.addListener(marker, DvtGeographicMapRenderer.MOUSE_OUT, function() {
          if (!marker.selected) {
            marker.setIcon(sourceImg);
          }
        });
        break;
    case DvtGeographicMapRenderer.CLICK:
        google.maps.event.addListener(marker, DvtGeographicMapRenderer.CLICK, function() {
          var idx = params['dataLayerIdx'];
          if (!map.selection[idx])
            map.selection[idx] = [];
          var selMode = params['selMode'];
          if (!marker.selected) {
            var selection = map.selection[idx];
            if (selMode == DvtGeographicMapRenderer.SEL_SINGLE) {
              if (selection.length != 0) {
                for (var i = 0; i < selection.length; i++) {
                  selection[i].setIcon(sourceImg);
                  selection[i].selected = false;
                }
                map.selection[idx] = [];
              }
            }
            marker.setIcon(sourceSelectedImg);
            marker.selected = true;
            marker.rowKey = params['rowKey'];
            marker.dataLayerIdx = idx;
            map.selection[idx].push(marker);
          } else {
            // deselect
            marker.setIcon(sourceHoverImg);
            marker.selected = false;
            // remove from selection
            if (selMode == DvtGeographicMapRenderer.SEL_SINGLE) {
              map.selection[idx] = [];
            } else if (selMode == DvtGeographicMapRenderer.SEL_MULTIPLE) {
              for (var i = 0; i < map.selection[idx].length; i++) {
			  
                if (marker.rowKey == map.selection[idx][i].rowKey && marker.dataLayerIdx == map.selection[idx][i].dataLayerIdx) {
                  map.selection[idx].splice(i, 1);
                  break;
                }
              }
            }
          }
          var evt = new DvtSelectionEvent(map.selection[idx]);
          evt.addParam('dataLayerIdx', idx);
          map.__dispatchEvent(evt);
        });
        break;
      default:
        break;
  }
}

/**
 * Zoom to a single marker
 * @param {object} gmap the Google map
 * @param {object} markerLatLng the LatLng google maps object
 * @param {number} zoomLevel the zoom level (optional)
 */
DvtGeographicMapRenderer.zoomToMarker = function (gmap, markerLatLng, zoomLevel) {
  gmap.setCenter(markerLatLng);
  if (zoomLevel)
    gmap.setZoom(zoomLevel);
}

/**
 * Get the LatLngBounds that contain all the data points
 * @param {number} minX the min lng
 * @param {number} maxX the max lng
 * @param {number} minY the min lat
 * @param {number} maxY the max lat
 * @return {object} bounds the LatLngBounds
 */
DvtGeographicMapRenderer.getBounds = function (minX, maxX, minY, maxY) {
  var minLatLng = new google.maps.LatLng(minY, minX);
  var maxLatLng = new google.maps.LatLng(maxY, maxX);
  var bounds = new google.maps.LatLngBounds(minLatLng, maxLatLng);
  return bounds;
}

/**
 * Get the params for the point
 */
DvtGeographicMapRenderer.getParams = function (point, mapProvider) {
  var tooltip = DvtGeographicMapRenderer.getTooltip(point);
  var source = DvtGeographicMapRenderer.getSource(point, mapProvider);
  var sourceHover = DvtGeographicMapRenderer.getSourceHover(point, mapProvider);
  var sourceSelected = DvtGeographicMapRenderer.getSourceSelected(point, mapProvider);
  var sourceHoverSelected = DvtGeographicMapRenderer.getSourceHoverSelected(point, mapProvider);
  var rowKey = point['_rowKey'];
  var clientId = point['clientId'];
  var params = {};
  params['source'] = source;
  params['sourceHover'] = sourceHover;
  params['sourceSelected'] = sourceSelected;
  params['sourceHoverSelected'] = sourceHoverSelected;
  params['tooltip'] = tooltip;
  if (point['action'])
    params['action'] = point['action'];
  params['rowKey'] = rowKey;
  params['clientId'] = clientId;  
  return params;
}

/**
 * Get dataSelection mode
 * @param {object} dataLayer The dataLayer
 * @return {string} The selection mode
 */
DvtGeographicMapRenderer.getSelMode = function (dataLayer) {
  var selMode = DvtGeographicMapRenderer.SEL_NONE;
  if (dataLayer['dataSelection'])
      selMode = dataLayer['dataSelection'];

  return selMode;
}

/**
 * Get marker tooltip
 * @param {object} point
 * @return {string} The tooltip
 */
DvtGeographicMapRenderer.getTooltip = function (point) {
  var tooltip = null;
  if (point['shortDesc'])
    tooltip = point['shortDesc']; 
  return tooltip;
}

/**
 * Get marker source URL
 * @param {object} point
 * @param {string} mapProvider The map provider
 * @return {string} The source URL
 */
DvtGeographicMapRenderer.getSource = function (point, mapProvider) {
  var source;
  if (point['source'])
    source = point['source']; 
  else {
    if (mapProvider == DvtGeographicMap.MAP_PROVIDER_ORACLE) {
      source = DvtGeographicMapRenderer.DEFAULT_ORACLE_MARKER_IMG;
    } else if (mapProvider == DvtGeographicMap.MAP_PROVIDER_GOOGLE) {
      source = DvtGeographicMapRenderer.DEFAULT_GOOGLE_MARKER_IMG;
    }
  }
  return source;
}

/**
 * Get marker sourceSelected URL
 * @param {object} point
 * @param {string} mapProvider The map provider
 * @return {string} The sourceSelected URL
 */
DvtGeographicMapRenderer.getSourceSelected = function (point, mapProvider) {
  var sourceSelected;
  if (point['sourceSelected'])
    sourceSelected = point['sourceSelected']; 
  else {
    if (mapProvider == DvtGeographicMap.MAP_PROVIDER_ORACLE) {
      sourceSelected = DvtGeographicMapRenderer.DEFAULT_ORACLE_MARKER_SELECT_IMG;
    } else if (mapProvider == DvtGeographicMap.MAP_PROVIDER_GOOGLE) {
      sourceSelected = DvtGeographicMapRenderer.DEFAULT_GOOGLE_MARKER_SELECT_IMG;
    }
  }
  return sourceSelected;
}

/**
 * Get marker sourceHover URL
 * @param {object} point
 * @param {string} mapProvider The map provider
 * @return {string} The sourceHover URL
 */
DvtGeographicMapRenderer.getSourceHover = function (point, mapProvider) {
  var sourceHover;
  if (point['sourceHover'])
    sourceHover = point['sourceHover']; 
  else {
    if (mapProvider == DvtGeographicMap.MAP_PROVIDER_ORACLE) {
      sourceHover = DvtGeographicMapRenderer.DEFAULT_ORACLE_MARKER_HOVER_IMG;
    } else if (mapProvider == DvtGeographicMap.MAP_PROVIDER_GOOGLE) {
      sourceHover = DvtGeographicMapRenderer.DEFAULT_GOOGLE_MARKER_HOVER_IMG;
    }
  }
  return sourceHover;
}

/**
 * Get marker sourceHoverSelected URL
 * @param {object} point
 * @param {string} mapProvider The map provider
 * @return {string} The sourceHoverSelected URL
 */
DvtGeographicMapRenderer.getSourceHoverSelected = function (point, mapProvider) {
  var sourceHoverSelected;
  if (point['sourceHoverSelected'])
    sourceHoverSelected = point['sourceHoverSelected']; 
  else {
    if (mapProvider == DvtGeographicMap.MAP_PROVIDER_ORACLE) {
      sourceHoverSelected = DvtGeographicMapRenderer.DEFAULT_ORACLE_MARKER_SELECT_IMG;
    } else if (mapProvider == DvtGeographicMap.MAP_PROVIDER_GOOGLE) {
      sourceHoverSelected = DvtGeographicMapRenderer.DEFAULT_GOOGLE_MARKER_SELECT_IMG;
    }
  }
  return sourceHoverSelected;
}

/**
 * Get minimum number
 * @param {number} min
 * @param {number} n
 * @return min
 */
DvtGeographicMapRenderer.getMin = function (min, n) {
  if (min == null || min > n)
    min = n;
  return min;
}

/**
 * Get maximum number
 * @param {number} max
 * @param {number} n
 * @return max
 */
DvtGeographicMapRenderer.getMax = function (max, n) {
  if (max == null || max < n)
    max = n;
  return max;
}





var DvtMapActionEvent = function(clientId, rowKey, action) {
  this.Init(DvtMapActionEvent.TYPE);
  this._clientId = clientId;
  this._rowKey = rowKey;
  this._action = action;
}

DvtObj.createSubclass(DvtMapActionEvent, DvtBaseComponentEvent, "DvtMapActionEvent");

DvtMapActionEvent.TYPE = "action";

DvtMapActionEvent.prototype.getClientId = function() {
  return this._clientId;
}

DvtMapActionEvent.prototype.getRowKey = function() {
  return this._rowKey;
}

DvtMapActionEvent.prototype.getAction = function() {
  return this._action;
}
