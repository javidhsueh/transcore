
var BasicMapView = Backbone.View.extend({
  
  initialize: function(args) {
    var self = this;
    this.containerID = args.containerID;

    _.bindAll(this, 'redraw');
	this.listenTo(this.model, 'change:raw_data', this.redraw);
	this.listenTo(this.model, 'change:map_layer', this.redraw);
	this.listenTo(this.model, 'change:commodity', this.redraw);

	// initialize variables :
	this.mapZoomLevel = setting.map.zoomLevel;
	this.mapData = null;
	this.map = new google.maps.Map(d3.select( this.containerID ).node(), {
		zoom: this.mapZoomLevel,
		center: new google.maps.LatLng(setting.map.center_lat, setting.map.center_lon),
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		styles: setting.map.styles
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

	var default_select_bounds = new google.maps.LatLngBounds(
		new google.maps.LatLng(36.378, -102.649), new google.maps.LatLng(41.599, -95.443));

	// create controls
	this.region1 ={};
	var isSelectingRegion1 = false;
	this.regionBtnA = $('#regBtnA');
	this.regionBtnA.click( function(){
		console.log("select A region clicked");
		isSelectingRegion1 = !isSelectingRegion1;
		if(isSelectingRegion1){
			self.regionBtnA.css("color","red");
			self.region1 = new google.maps.Rectangle({
				bounds: default_select_bounds,
				editable: true
			});
			// add a listener to the region
			self.region1.setMap(self.map);

			var self_this = self;
			var self_region = self.region1;
			google.maps.event.addListener(self_region, 'bounds_changed', function(){
				var ne = self_region.getBounds().getNorthEast();
				var sw = self_region.getBounds().getSouthWest();
				var contentString = '<b>Rectangle moved.</b><br>' +
					'New north-east corner: ' + ne.lat() + ', ' + ne.lng() + '<br>' +
					'New south-west corner: ' + sw.lat() + ', ' + sw.lng();
				console.log(contentString);
				var selected_cities = [];
				for(var i=0;i<self_this.mapData.length;i+=1){
					var point = self_this.mapData[i];
					if( sw.lat() < point.o_lat && point.o_lat < ne.lat() && sw.lng() < point.o_long && point.o_long < ne.lng){
						if(selected_cities.indexOf(point.o_city) === -1)
							selected_cities.push(point.o_city);
					}
				}
				console.log("region A selected cities: ");
				console.log(selected_cities);
				$("#regionA_list").html(selected_cities.toString());
			});
		}else{
			self.regionBtnA.css("color","black");
			self.region1.setMap(null);
			delete self.region1;
		}
	});
	//regionBtn1.index = 1;
	// google.maps.event.addDomListener(this.controlUI, 'click', my_funct);
	
	this.region2 = {};

	var isSelectingRegion2 = false;
	this.regionBtnB = $('#regBtnB');
	this.regionBtnB.click( function(){
		console.log("select B region clicked");
		isSelectingRegion2 = !isSelectingRegion2;
		if(isSelectingRegion2){
			self.regionBtnB.css("color","red");
			self.region2 = new google.maps.Rectangle({
				bounds: default_select_bounds,
				editable: true
			});
			// add a listener to the region
			self.region2.setMap(self.map);

			var self_this = self;
			var self_region = self.region2;
			google.maps.event.addListener(self_region, 'bounds_changed', function(){
				var ne = self_region.getBounds().getNorthEast();
				var sw = self_region.getBounds().getSouthWest();
				var contentString = '<b>Rectangle moved.</b><br>' +
					'New north-east corner: ' + ne.lat() + ', ' + ne.lng() + '<br>' +
					'New south-west corner: ' + sw.lat() + ', ' + sw.lng();
				console.log(contentString);
				var selected_cities = [];
				for(var i=0;i<self_this.mapData.length;i+=1){
					var point = self_this.mapData[i];
					if( sw.lat() < point.o_lat && point.o_lat < ne.lat() && sw.lng() < point.o_long && point.o_long < ne.lng){
						if(selected_cities.indexOf(point.o_city) === -1)
							selected_cities.push(point.o_city);
					}
				}
				console.log("region B selected cities: ");
				console.log(selected_cities);

				$("#regionB_list").html(selected_cities.toString());
			});
		}else{
			self.regionBtnB.css("color","black");
			self.region2.setMap(null);
			delete self.region2;
		}
	});
	this.regionBtnB.detach();
	this.regionBtnA.detach();
	this.map.controls[google.maps.ControlPosition.TOP_RIGHT].push(this.regionBtnB[0]);
	this.map.controls[google.maps.ControlPosition.TOP_RIGHT].push(this.regionBtnA[0]);

	//menus' positions
	// var map_layers = $("#map_layers").detach();
	// this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(map_layers[0]);
	// var commodities = $("#commodity_filter").detach();
	// this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(commodities[0]);

  },
  redraw: function() {

	console.log("in BasicMapView, ");
    var self = this;
	this.mapData = this.model.get("raw_data");
    // console.log(this.mapData);

    if(this.mapData === null)  return;

    // filter data:
    var filtered_data = [];
    var commodities = this.model.get("commodity");
    console.log("commodities in models: "+ commodities);

    for(var i = 0; i < this.mapData.length; i+=1){
		var point = this.mapData[i];
		// not sure javascript has "in" operation
		if(commodities.indexOf(point.classification) != -1)
			filtered_data.push(point);
	}
	// console.log(filtered_data);
	this.mapData = filtered_data; // replace origin
	
    // reset bounding
	delete this.markerBounds;

	this.markerBounds = new google.maps.LatLngBounds();
	
    this.projection = this.overlay.getProjection();
    this.mapZoomLevel = this.map.getZoom();

    // show different views:
    // var layers = this.model.get("map_layer");
    var layers = $("#map_layers").val();
    
    console.log("map layer : "+layers);
    // clean up previous 
    if(this.heatmap){
		this.heatmap.setMap(null);
		delete this.heatmap;

	}
	this.layer.selectAll(".marker2").remove();

	for(var i = 0 ; i < layers.length; i+=1){
		var layer = layers[i];
		if(layer == "cities"){
			var padding = 10;
			var transform = function(d){
				var point = new google.maps.LatLng(d.value.o_lat, d.value.o_long);
				point = self.projection.fromLatLngToDivPixel(point);
				return d3.select(this).style("left", (point.x - padding) + "px").style("top", (point.y - padding) + "px");
			};
			// draw markers
			var marker2 = this.layer.selectAll("svg")
							.data(d3.entries(this.mapData))
							.each(transform)
							.enter().append("svg:svg")
							.each(transform)
							.attr("class", "marker2")
							.attr("id","marker2");
							

			marker2.append("svg:ellipse")
				// .style("opacity", function(d){return d.value.weight/50000;})
				.attr ("rx", 4).attr("ry", 4)
				.attr("cx", padding).attr("cy", padding);

		}else if(layer == "heatmap"){
			var heatmap_data = [];
			for(var i = 0; i < this.mapData.length; i+= 1){
				var point = this.mapData[i];
				// heatmap_data.push(new google.maps.LatLng(point.o_lat, point.o_long));
				heatmap_data.push({location: new google.maps.LatLng(point.o_lat, point.o_long), weight: point.weight/5000.0});
			}
			this.heatmap = new google.maps.visualization.HeatmapLayer({
				data: new google.maps.MVCArray(heatmap_data),
				dissipating:true,
				gradient: setting.map.heatmap_gradient,
				radius: 25,
				opacity: 0.2
			});
			this.heatmap.setMap(this.map);
		}
	}
	
	if( this.fitBound ){
		this.map.fitBounds(this.markerBounds);
		this.fitBound = false;
	}
	
  }
});