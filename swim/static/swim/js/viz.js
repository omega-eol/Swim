// Visualization service
swimApp.service("visualization", function(){
    this.chart_width = 270;
    this.chart_height = 200;
    
    /* Prepare data for the Workout Distance Distribution by Workout Set type chart on Index page */
    this.DistanceDistByWorkourSetType = function(workout) {
    	// get distribution 
    	var distribution = workout.distanceByWSTypeDistribution();
    	
    	// generate output dataset
    	var dataset = [];
    	for (var i = 0; i < WorkoutSetTypes.length; i++) dataset.push( { 'x' : WorkoutSetTypes[i], 'y' :distribution[i] } );
    	
    	// chart schema
        var schema = {
        	day: {
        		type: 'string',
        		name: 'Workout Set Type'
        	}
        };
    	
        // chart options
        var options = {
        	rows: [{
        		key: 'y',
        		type: 'bar'
        	}],
        	xAxis: {
        		key: 'x',
        	},
        	yAxis: {
        		label: "Distance, m"
        	},
        	size: {
        		width: this.chart_width,
        		height: this.chart_height
        	},
        	legend: { show: false }
        };
        
        var output = { 'dataset':dataset, 'schema':schema, 'options':options };
    	return output;
    };

    /* Prepare data for the Workout Interval Distribution by Workout Set type chart on Index page */
    this.IntervalDistByWorkourSetType = function(workout) {
    	// get distribution 
    	var distribution = workout.intervalByWSTypeDistribution();
    	
    	// generate output dataset
    	var dataset = [];
    	for (var i = 0; i < WorkoutSetTypes.length; i++) dataset.push( { 'x' : WorkoutSetTypes[i], 'y' :distribution[i]/60 } );
    	
    	// chart schema
        var schema = {
        	day: {
        		type: 'string',
        		name: 'Workout Set Type'
        	}
        };
    	
        // chart options
        var options = {
        	rows: [{
        		key: 'y',
        		type: 'bar'
        	}],
        	xAxis: {
        		key: 'x',
        	},
        	yAxis: {
        		label: "Interval, min"
        	},
        	size: {
        		width: this.chart_width,
        		height: this.chart_height
        	},
        	legend: { show: false }
        };
        
        var output = { 'dataset':dataset, 'schema':schema, 'options':options };
    	return output;
    };
    
    /* Prepare data for the Workout Stroke Distribution chart on Index page */
    this.StrokeDistribution = function(workout) {
    	var distribution = workout.strokeDistribution();
    	
    	// generate dataset
    	var dataset = [];
    	for (var i = 0; i < ExerciseStrokes.length; i++) {
    		dataset.push( { 'x' : ExerciseStrokes[i], 'y' : distribution[i] } );
    	};	
    	
    	// chart schema
        var schema = {
        	day: {
        		type: 'string',
        		name: 'Stroke'
        	}
        };
    	
        // chart options
        var options = {
        	rows: [{
        		key: 'y',
        		type: 'bar'
        	}],
        	xAxis: {
        		key: 'x',
        	},
        	yAxis: {
        		label: "Frequncy, sets"
        	},
        	size: {
        		width: this.chart_width,
        		height: this.chart_height
        	},
        	legend: { show: false }
        };
        
        var output = { 'dataset':dataset, 'schema':schema, 'options':options };
    	return output;
    };
    
});
