
var DataModel = Backbone.Model.extend({
  defaults: {

    raw_data: {},
    
    filter: {},
      
  },
  initialize: function() {
    var self = this;

    this.bind('change:filter', function() {
      this.update();
    });
    
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