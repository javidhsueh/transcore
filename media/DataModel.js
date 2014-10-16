
var DataModel = Backbone.Model.extend({
  defaults: {

    raw_data: {},
    
    filter: {},

    commodity: [],

    map_layer: "",
      
    regionA_cities : [],
    regionB_cities : [],

    attributes: [],

    chart_types: [],

  },
  initialize: function() {
    var self = this;

    this.bind('change:filter', function() {
      this.update();
    });

    this.set("map_layer", [setting.map.layer]);
    this.set("commodity", setting.commodity.default_commodity);
    this.set("chart_types", setting.charts.chart_types);

    this.set("attributes", ["weight"]);

    // menus:
  this.map_layers_option = $("#map_layers");
  loadOptions("#map_layers", menu.map_layer_types, setting.map.layer);
  // this.map_layers_option.selectbox();
  
  $("#map_layers").multiselect({
    selectedList: 4 // 0-based index
  });

  // $("#map_layers").bsmSelect({
  //   addItemTarget: 'top',
  //   animate: true,
  //   highlight: true,
  //   plugins: [$.bsmSelect.plugins.sortable()]
  // });

  // function update_layers(){
  //   var val = $("#map_layers").val();
  //   console.log(val);
  //   self.set("map_layer", val); // set to model  }
  // }

  // $("#map_layers").change(
  //   function(e, data) {
  //     console.log(data);
  //     // $("#layers_list").prepend($("<li>").html(data.type + ": " + data.value));
  //   });

  $("#map_layers").change(function(){
    var new_val = $(this).val();
    console.log("new_map_layers:"+new_val);
    self.set("map_layer", new_val); // set to model
  });



  this.commodity_option = $("#commodity_filter");
  loadOptions("#commodity_filter", menu.commodity_types, setting.commodity.default_commodity);
  // this.commodity_option.selectbox();
  $("#commodity_filter").multiselect({
   selectedList: 4 // 0-based index
  });

  this.commodity_option.change(function(){
  
    var new_val = $(this).val();
    console.log("new_commodities: " + new_val);
    self.set("commodity", new_val); // set to model
    // self.set("commodity", new_val); // set to model
  });


  this.attribute_option = $("#attribute_filter");
  //loadOptions("#attribute_filter", menu.attribute_types, setting.attribute.default_attribute);
  // this.attribute_option.selectbox();
  $("#attribute_filter").multiselect({
    selectedList: 4 // 0-based index
  });

  this.attribute_option.change(function(){
  
    var new_val = $(this).val();
    console.log("new_attrbiutes: " + new_val);
    self.set("attributes", new_val); // set to model
    // self.set("commodity", new_val); // set to model
  });


  $( "#accordion" ).accordion();

    // request data
    var req = 'data/full.json';
    d3.json(req, function(jsonData) {
      self.set({raw_data: jsonData});
    });

  },
  
  update: function() {
    var self = this;
    
    //get the filtered data
    var filter = this.get('filter');
    
    this.set({map_data: new_map_data});
  },
  clearFilter: function() {
    this.set({filter: {}});
    this.trigger('change:filter');
  }

});