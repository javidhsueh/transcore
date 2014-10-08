var BasicMapView = Backbone.View.extend({
  
  initialize: function(args) {
    var self = this;
    this.containerID = args.containerID;

    _.bindAll(this, 'redraw');
	this.listenTo(this.model, 'change:raw_data', this.redraw);


	// initialize variables :
	this.mapZoomLevel = map_setting.mapZoomLevel;
	this.mapData = null;
	this.map = new google.maps.Map(d3.select( this.containerID ).node(), {
		zoom: this.mapZoomLevel,
		center: new google.maps.LatLng(map_setting.center_lat, map_setting.center_lon),
		mapTypeId: google.maps.MapTypeId.ROADMAP
	});
	this.markerBounds = new google.maps.LatLngBounds();

	this.overlay = new google.maps.OverlayView();
	this.overlay.onAdd = function() {
        self.layer = d3.select(this.getPanes().overlayLayer).append("div").attr("class", "stations");
        self.overlay.draw = self.redraw;
	};
	this.overlay.setMap(this.map);
    this.start_marker = new google.maps.Marker({map:this.map,icon: "images/icon/start_marker.png"});
    this.end_marker = new google.maps.Marker({map:this.map,icon: "images/icon/end_marker.png"});
	this.projection = this.overlay.getProjection();
	this.padding = 10;
	
	this.infoWindow = new google.maps.InfoWindow();
	this.currentMarker = 0;
	this.markers = [];

	//control map view
	this.fitBound = false;
  },
  redraw: function(){

    var self = this;
	var mapData = this.model.get("raw_data");
    
    console.log("in BasicMapView, ");
    console.log(mapData);

    if(mapData === null)  return;
	
    // reset bounding
	delete this.markerBounds;

	this.markerBounds = new google.maps.LatLngBounds();
	
    this.projection = this.overlay.getProjection();
    this.mapZoomLevel = this.map.getZoom();

	
	if( this.fitBound ){
		this.map.fitBounds(this.markerBounds);
		this.fitBound = false;
	}
	
  }
});