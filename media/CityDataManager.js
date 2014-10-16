
var CityDataManager = Backbone.View.extend({
  
  initialize: function(args) {
    var self = this;
    this.containerID = args.containerID;

    _.bindAll(this, 'update');
    this.listenTo(this.model, 'change:raw_data', this.update);
	this.listenTo(this.model, 'change:regionA_cities', this.update);
	this.listenTo(this.model, 'change:regionB_cities', this.update);
	this.listenTo(this.model, 'change:chart_types', this.update);

	//listen more option : ex: chart types,  attribute( ex: weight, price, value )
	// pie chart(proportion of each commodity), line chart(certain attribute over time)

  },
  update: function(){

	console.log("in CityDataManager update");
	// get data
	var raw_data = this.model.get("raw_data");
	var regionA = this.model.get("regionA_cities");
	var regionB = this.model.get("regionB_cities");
	var chart_types = this.model.get("chart_types");

	if(regionA.length !== 0 && regionB.length !== 0){

		// calculate datae

		// remove previous charts

		// create new charts

		// A , B, A->B,  B->A

	}else if(regionA.length !== 0){
		// calculate datae

		// remove previous charts

		// create new charts

	}else if(regionB.length !== 0){
		// calculate datae

		// remove previous charts

		// create new charts

	}else{

		// show help, and descriptions

	}

  }
  
});