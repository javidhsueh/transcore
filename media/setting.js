
var layout = {

    window_width: $(window).width(),
    window_height: $(window).height(),
    window_padding: 7,

    header_height: 78,
    footer_height: 0,
    
    tab_height: 28,
    tab_padding: 4,

};

var setting = {

  map: {
    zoomLevel: 5,
    center_lat: 38.8833,
    center_lon: -98.35,
    styles: [{"featureType":"water","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":17}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":16}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":21}]},{"elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#000000"},{"lightness":16}]},{"elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#000000"},{"lightness":40}]},{"elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":19}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":17},{"weight":1.2}]}],
    layer: "heatmap",
    heatmap_gradient: [
        'rgba(0, 255, 255, 0)','rgba(0, 255, 255, 1)','rgba(0, 191, 255, 1)',
        'rgba(0, 127, 255, 1)','rgba(0, 63, 255, 1)','rgba(0, 0, 255, 1)',
        'rgba(0, 0, 223, 1)','rgba(0, 0, 191, 1)','rgba(0, 0, 159, 1)',
        'rgba(0, 0, 127, 1)','rgba(63, 0, 91, 1)','rgba(127, 0, 63, 1)',
        'rgba(191, 0, 31, 1)','rgba(255, 0, 0, 1)'
        ]
  },

  commodity: {
    default_commodity: "food",
  },
  charts: {
    chart_types: ["line"],
    
  }

};



var menu = {

  map_layer_types: ["cities", "heatmap"],

  commodity_types: ["electronics", "food", "fabrics", "farm", "stone",
                    "coal", "ores", "wood", "paper", "chemical",
                    "compounds", "mineral", "grain", "motor",
                    "iron", "waste", "plastic", "petroleum"],

};

var default_color_scale = [
            "#7ba1d7","#e374c3","#5fd2ad","#d08f6f","#f8be53",
            "#9dce66","#ff7f8b","#8484d5","#7db3b7","#cfe2e8",
            "#587aac","#fe6573","#99bec4","#ed8bdc","#46abdd",
            "#958a7e","#e77076","#d3c6b3","#eae44f","#ffb62f"];
