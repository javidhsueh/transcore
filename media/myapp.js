
	
$(document).ready(function() {

    var overallApp = OverallApp();
    
});


var OverallApp = function OverallApp(){

    if ( arguments.callee._singletonInstance )
        return arguments.callee._singletonInstance;
    arguments.callee._singletonInstance = this;

    var self = this;

    // ui binding
    this.el_tabs = $("#map_tabs");
    this.el_control_tabs = $("#time_tabs");

    this.el_map_container = $("#map_container");
    this.el_control_window = $("#control_window");
    this.el_control_window_toggle = $("#control_window_toggle");

    this.el_detail_window = $("#detail_window");
    this.el_detail_window_toggle = $("#detail_window_toggle");
    
    $(".round_div").corner();

    this.tabs = this.el_tabs.tabs({ heightStyle: "fill"});
    this.el_tabs.on("tabsactivate", function(event,ui){
        self.onTabChanged(ui.newTab.index());
    });
    this.tabs.delegate( "span.ui-icon-close", "click", function() {
        var panelId = $( this ).closest( "li" ).remove().attr( "aria-controls" );
        $( "#" + panelId ).remove();
        console.log(panelId);
        //TODO: delete the tab in tabContainer

        self.tabs.tabs( "refresh" );
    });
    this.tabs.bind( "keyup", function( event ) {
        if ( event.altKey && event.keyCode === $.ui.keyCode.BACKSPACE ) {
          var panelId = tabs.find( ".ui-tabs-active" ).remove().attr( "aria-controls" );
          $( "#" + panelId ).remove();
          //TODO: delete the tab in tabContainer
          self.tabs.tabs( "refresh" );
        }
    });

    this.el_control_tabs = this.el_control_tabs.tabs();

    var container_width = layout.window_width - 2*layout.tab_padding;

    // main windows
    var map_tabs_width = container_width,
        map_tabs_height = (layout.window_height-layout.header_height-2*layout.tab_padding),
        map_tabs_top = layout.header_height,
        map_tabs_left = 0;
    this.tabs.width(map_tabs_width+"px");
    this.tabs.height(map_tabs_height+"px");

    // map widget size:
    var map_container_width  = container_width,
        map_container_height =  (map_tabs_height-layout.tab_height-2*layout.tab_padding);
    this.el_map_container.width(map_container_width+"px");
    this.el_map_container.height(map_container_height+"px");

    var control_window_width = container_width*0.67,
        control_window_height = (layout.window_height-layout.header_height-2*layout.window_padding-8*layout.tab_padding)*0.33;

    this.el_control_window.width(control_window_width+"px");
    this.el_control_window.height(control_window_height+"px");
    // this.el_control_window.css("bottom",-1*control_window_height+"px");
    self.el_control_window.slideToggle('slow');
    this.el_control_window.corner("top");

    this.el_control_window_toggle.corner("top");
    this.el_control_window_toggle.css({bottom: control_window_height});
    self.el_control_window_toggle.animate({
            bottom: 0
        }, 'slow');

    var toggleControlWindowFlag = false;
    this.el_control_window_toggle.on('click', function(){
        var bottom_pos = 0;
        var icon_name = "up";
        if(!toggleControlWindowFlag){
            bottom_pos = control_window_height;
            icon_name = "down";
        }
        self.el_control_window_toggle.animate({
            bottom: bottom_pos
        }, 'slow');
        toggleControlWindowFlag = !toggleControlWindowFlag;
        $("#control_window_toggle img").attr({src:"images/icon/"+icon_name+".png"});
        self.el_control_window.slideToggle('slow');
    });

    var chart_height = (layout.window_height-layout.header_height-2*layout.tab_height- 8*layout.tab_padding -4* layout.window_padding)*0.33 - 20;
    // left
    this.el_control_tabs.width( (container_width*0.67-layout.tab_padding)+"px");


    // detail window
    var detail_window_width = layout.window_width*0.33;
    this.el_detail_window_toggle.corner("left");
    this.el_detail_window_toggle.css({right: 0, top: layout.header_height+layout.tab_height+16});
    this.el_detail_window.css({width: detail_window_width, height: map_container_height, right:-1*detail_window_width});
    var toggleDetailWindowFlag = false;
    this.el_detail_window_toggle.on('click', function(){
        var right_pos = 0;
        var icon_name = "left";
        if(!toggleDetailWindowFlag){
            right_pos = detail_window_width;
            icon_name = "right";
        }
        self.el_detail_window_toggle.animate({
            right: right_pos
        }, 'slow');

        var window_right_pos = 0;
        if(toggleDetailWindowFlag){
            window_right_pos = -1*detail_window_width;
        }
        self.el_detail_window.animate({
            right: window_right_pos
        }, 'slow');
        
        $("#detail_window_toggle img").attr({src:"images/icon/"+icon_name+".png"});

        toggleDetailWindowFlag = toggleDetailWindowFlag === false;
        
        

        
    });




    // init data model
    var dataModel = new DataModel();


    // init widgets:
    this.cityManager = new CityDataManager({containerID:"#detail_views", model: dataModel});

    this.googleMapView = new BasicMapView({containerID:"#map_container", model: dataModel});
    
    
    this.el_control_tabs.on('tabsactivate', function(event, ui) {
        
    });


    this.tabsContainer = [];

    this.addTab = function(no){
        var tabTemplate = "<li><a href='#{href}'>#{label}</a> <span class='ui-icon ui-icon-close' role='presentation'>Remove Tab</span></li>";
        var label = "#"+no,
            id = "tabs-"+no,
            li = $( tabTemplate.replace( /#\{href\}/g, "#" + id ).replace( /#\{label\}/g, label ) ) ;

        this.tabs.find( "ul" ).append( li );
        this.tabs.append( "<div id='" + id + "'></div>" );
        $("#singleTemplate").tmpl([{no:no}]).appendTo("#"+id);

        //crate App
        // var app = new SingeVehicleApp(no, tripTable[no]);
        // this.tabsContainer.push(app);

        this.tabs.tabs( "refresh" );
        this.tabs.tabs( "option", "active", -1 );
    };

    this.setUnfocus = function(){
        this.el_control_window_toggle.hide();
        this.el_control_window.hide();
    };
    this.setFocus = function(){
        this.el_control_window_toggle.show();
        this.el_control_window.show();
        google.maps.event.trigger(this.googleMapView.map, "resize");
        this.googleMapView.recenter();
    };

    this.onTabChanged = function(index){
        console.log(index);
        for(var i = 0, max = this.tabsContainer.length; i< max; i++){
            this.tabsContainer[i].setUnfocus();
        }
        if(index === 0 ){
            this.setFocus();
        }else{
            this.setUnfocus();
            this.tabsContainer[index-1].setFocus();
        }
    };
};