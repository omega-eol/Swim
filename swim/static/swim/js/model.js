	/* Swim App Models */
var ExerciseStrokes = ["Free", "Breast", "Back", "IM", "Fly"];
var ExerciseTypes = ["Swim", "Drill", "Kick"];
var WorkoutSetTypes = ["Warm Up", "Pre Set", "Main Set", "Cool Down"];
var WorkoutSetTypeColors = ['#FFFFB2', '#D6FFD6', '#FFCCCC', '#CCEBFF'];

var User = function (first_name, last_name) {
	this.first_name = first_name;
	this.last_name = last_name;
	this.id = 0;
	
	this.full_name = function() {
		return this.first_name + " " + this.last_name;
	};
	
	this.parse = function(s) {
		this.id = s.id;
		this.first_name = s.first_name;
		this.last_name = s.last_name;
	};
	
	this.toJSON = function() {
		return {
			first_name: this.first_name,
			last_name: this.last_name
		};
	};
};

var Exercise = function (distance, stroke, type, interval) {
    this.id = 0;
    this.distance = distance;
    this.stroke = stroke;
    this.type = type;
    this.interval = interval;

    /* Functions */
    // parse object from back-end
    this.parse = function(s) {
    	this.id = s.id;
        this.distance = s.distance;
        this.stroke = s.stroke;
        this.type = s.type;
        this.interval = s.interval;
    };
    
    // transform object to back-end
    this.toJSON = function() {
    	return {
    		//id: this.id,
    		distance: this.distance,
    		stroke: this.stroke,
    		type: this.type,
    		interval: this.interval
    	};
    };
    
    this.clone = function () {
        return new Exercise(this.distance, this.stroke, this.type, this.interval);
    };

    this.isValid = function () {
        if (this.distance === undefined || this.distance === null) {
            console.log("Exercise distance is not defined properly.");
            return false;
        };
        if (this.interval === undefined || this.interval === null) {
            console.log("Exercise interval is not defined properly.");
            return false;
        };
        /* Validation */
        if (parseInt(this.distance) < 10) {
            console.log("Exercise`s distance cannot be less than 10.");
            return false;
        };
        if (parseInt(this.interval) < 5) {
            console.log("Exercise`s interval cannot be less than 5.");
            return false;
        };
        return true;
    };

    this.print = function () {
    	//return this.distance + " meters " + this.stroke + " " + this.type + " in " + this.interval + " seconds";
    	return this.distance + " m " + this.stroke + " " + this.type + " in " + this.interval + " sec";
    };
    
    //if (debug) console.log("A new Exercise has been created");
};

var ExerciseSet = function (order, repetitions, exercise, workoutSet) {
    this.id = 0;
    this.order = order;
    this.repetitions = repetitions;

    /* Foreign Keys */
    this.exercise = exercise;
    this.workoutSet = workoutSet;

    /* Functions */
    this.parse = function(s) {
    	this.id = s.id;
        this.order = s.order;
        this.repetitions = s.repetitions;
        this.exercise = new Exercise();
        this.exercise.parse(s.exercise);
        // this.workoutSet must be set outside
    }
    
    this.clone = function () {
        return new ExerciseSet(this.order, this.repetitions, this.exercise, this.workoutSet);
    };

    this.toJSON = function() {
    	return {
    		//id: this.id,
    		order: this.order,
    		repetitions: this.repetitions,
    		exercise: this.exercise.toJSON(),
    		workoutSet: this.workoutSet.id
    	};
    };
    
    this.distance = function () {
        return this.repetitions * this.exercise.distance;
    };
    this.printDistance = function () {
        return printDistance(this.distance());
    };

    this.printInterval = function () {
        return printTime(this.interval());
    };
    this.interval = function () {
        return this.repetitions * this.exercise.interval;
    };

    //if (debug) console.log("A new ExerciseSet has been created");
};

var WorkoutSet = function (order, repetitions, type, workout) {
    this.id = 0;
    this.order = order;
    this.repetitions = repetitions;
    this.type = type;

    this.exerciseSets = [];

    /* Foreign Keys */
    this.workout = workout;

    /* Functions */
    this.parse = function(s) {
    	this.id = s.id;
        this.order = s.order;
        this.repetitions = s.repetitions;
        this.type = s.type;
        
        // parse exercise sets
        var that = this;
        angular.forEach(s.exerciseSets, function(es, index) {
        	var exerciseSet = new ExerciseSet();
        	exerciseSet.parse(es);
        	exerciseSet.workoutSet = that;
        	that.exerciseSets.push(exerciseSet);
        });
    };
    
    /* Serialize the WorkoutSet class to JSON */
    this.toJSON = function() {
    	return {
    		//id: this.id,
    		order: this.order,
    		repetitions: this.repetitions,
    		type: this.type,
    		exerciseSets: this.exerciseSetsToJSON()
    	};
    };
    
    /* Serialize set of Exercise Sets to JSON */
    this.exerciseSetsToJSON = function() {
    	var res = [];
		angular.forEach(this.exerciseSets, function(exerciseSet, index) {
			res.push(exerciseSet.toJSON());
		});
		return res;
    };
    
    /* Distance */
    this.distance = function () {
        var d = 0;
        this.exerciseSets.forEach(function (exerciseSet) {
            d += exerciseSet.distance();
        });
        return this.repetitions*d;
    };
    this.printDistance = function () {
        return printDistance(this.distance());
    };

    /* Interval */
    this.interval = function () {
        var ii = 0;
        this.exerciseSets.forEach(function (exerciseSet) {
            ii += exerciseSet.interval();
        });
        return this.repetitions*ii;
    };
    this.printInterval = function () {
        return printTime(this.interval());
    };

    /* Find Stroke Distribution for the current Workout Set */
    this.strokeDist = function() {
    	// Free, Breast, IM, Fly
    	// Initialize stroke counts array
    	var stroke_counts = [];
    	for (var i = 0; i < ExerciseStrokes.length; i++) stroke_counts.push(0);
    	
    	// for every Exercise Set in the Workout Set
    	this.exerciseSets.forEach(function (exerciseSet) {
    		// for every stroke type
        	for (var i = 0; i < ExerciseStrokes.length; i++) {
        		if (exerciseSet.exercise.stroke === ExerciseStrokes[i]) {
        			stroke_counts[i] += exerciseSet.repetitions;
        		};
        	};
        });
        
    	// multiply all coefficients by number of repetitions of the Workout Set
    	for (var i = 0; i < ExerciseStrokes.length; i++) stroke_counts[i] = stroke_counts[i]*parseInt(this.repetitions);
    	
    	return stroke_counts;
    };
    
    //if (debug) console.log("A new WorkoutSet has been created");
};

var Workout = function () {
    this.id = 0;
    this.name = "";
    this.created_at = new Date();
    this.updated_at = null;
    this.author = ""; 
    this.type = "";
    this.description = "";

    this.user = null;
    //this.workoutSets = [];
    
    this.warmUpSets = [];
    this.preSetSets = [];
    this.mainSets = [];
    this.coolDownSets = [];

    /* Functions */
    this.parse = function(s) {
    	// properties
    	this.id = s.id;
    	this.name = s.name;
    	this.created_at = s.created_at;
    	this.updated_at = s.updated_at;
        this.author = s.author; 
        this.type = s.type;
        this.description = s.description;
        
        // user
        this.user = new User();
        this.user.parse(s.user);
        
        // workout sets
        var that = this;
        angular.forEach(s.workoutSets, function(ws, index) {
        	var workoutSet = new WorkoutSet();
        	workoutSet.parse(ws);
        	workoutSet.workout = that;
        	if (workoutSet.type === 'Warm Up') {
        		that.warmUpSets.push(workoutSet);
        	} else if (workoutSet.type === 'Pre Set') {
        		that.preSetSets.push(workoutSet);
        	} else if (workoutSet.type === 'Main Set') {
        		that.mainSets.push(workoutSet);
        	} else if (workoutSet.type === 'Cool Down') {
        		that.coolDownSets.push(workoutSet);
        	};
        	//that.workoutSets.push(workoutSet);
        });
    };
    
    /* Serialization of Workout class to JSON */
    this.toJSON = function() {
    	return {
    		id: this.id,
			name: this.name,
    		description: this.description,
    		type: this.type,
    		created_at: this.created_at,
    		updated_at: this.updated_at,
    		user: this.user.toJSON(),
    		workoutSets: this.workoutSetsToJSON()
    	};
    };
    
    /* Serialize set of Workout Sets to JSON */
    this.workoutSetsToJSON = function() {
    	var res = [];
    	var workoutSets = this.warmUpSets.concat(this.preSetSets, this.mainSets, this.coolDownSets);
		angular.forEach(workoutSets, function(workoutSet, index) {
			res.push(workoutSet.toJSON());
		});
		return res;
    };
    
    /* Return a Workout Set array based on type */
    this.getWorkoutSetByType = function(type) {
    	if (type === 'Warm Up') {
    		return this.warmUpSets;
    	} else if (type === 'Pre Set') {
    		return this.preSetSets;
    	} else if (type === 'Main Set') {
    		return this.mainSets;
    	} else if (type === 'Cool Down') {
    		return this.coolDownSets;
    	} else {
    		console.log('Cannot find requested workout set array');
    		return null;
    	}
    };
    
    /* Distance */
    this.distance = function () {
        var d = 0;
        var temp = this.warmUpSets.concat(this.preSetSets, this.mainSets, this.coolDownSets);
        temp.forEach(function (workoutSet) {
            d += workoutSet.distance();
        });
        return d;
    };
    this.printDistance = function () {
        var d = this.distance();
        return printDistance(d);
    }

    /* Interval */
    this.interval = function () {
        var ii = 0;
        var temp = this.warmUpSets.concat(this.preSetSets, this.mainSets, this.coolDownSets);
        temp.forEach(function (workoutSet) {
            ii += workoutSet.interval();
        });
        return ii;
    };
    this.printInterval = function () {
        var interval = this.interval();
        return printTime(interval);
    };

    /* Speed */
    this.speed = function () {
        var speed = 0;
        var interval = this.interval();
        if (interval > 0) {
            speed = this.distance() / interval;
        };
        return speed;
    };
    this.printSpeed = function () {
        return Math.round(this.speed()*100)/100 + " m/s";
    };

    /* Get distance distribution by Workout Set type for the Workout */
    this.distanceByWSTypeDistribution = function() {
    	// warm up
    	var warm_up_distance = 0;
    	this.warmUpSets.forEach(function(workoutSet) {
    		warm_up_distance += workoutSet.distance();
    	});
    	
    	// pre set
    	var pre_set_distance = 0;
    	this.preSetSets.forEach(function(workoutSet) {
    		pre_set_distance += workoutSet.distance();
    	});
    	
    	// main set
    	var main_set_distance = 0;
    	this.mainSets.forEach(function(workoutSet) {
    		main_set_distance += workoutSet.distance();
    	});
    	
    	// cool down
    	var cool_down_set_distance = 0;
    	this.coolDownSets.forEach(function(workoutSet) {
    		cool_down_set_distance += workoutSet.distance();
    	});
    	
    	return [warm_up_distance, pre_set_distance, main_set_distance, cool_down_set_distance];
    };
    
    /* Get interval distribution by Workout Set type for the Workout */
    this.intervalByWSTypeDistribution = function() {
    	// warm up
    	var warm_up_interval = 0;
    	this.warmUpSets.forEach(function(workoutSet) {
    		warm_up_interval += workoutSet.interval();
    	});
    	
    	// pre set
    	var pre_set_interval = 0;
    	this.preSetSets.forEach(function(workoutSet) {
    		pre_set_interval += workoutSet.interval();
    	});
    	
    	// main set
    	var main_set_interval = 0;
    	this.mainSets.forEach(function(workoutSet) {
    		main_set_interval += workoutSet.interval();
    	});
    	
    	// cool down
    	var cool_down_set_interval = 0;
    	this.coolDownSets.forEach(function(workoutSet) {
    		cool_down_set_interval += workoutSet.interval();
    	});
    	
    	return [warm_up_interval, pre_set_interval, main_set_interval, cool_down_set_interval];
    };
    
    /* Get stroke distribution for the current Workout Set */
    this.strokeDistribution = function() {
    	// Free, Breast, IM, Fly
    	var stroke_counts = [];
    	for (var i = 0; i < ExerciseStrokes.length; i++) {
    		stroke_counts.push(0);
    	};
    	
    	// Combine all workout set in one array 
    	var temp = this.warmUpSets.concat(this.preSetSets, this.mainSets, this.coolDownSets);
        temp.forEach(function (workoutSet) {
        	var temp = workoutSet.strokeDist();
        	for (var i = 0; i < ExerciseStrokes.length; i++) {
        		stroke_counts[i] += temp[i];
        	};
        });
        
        return stroke_counts;
    };
    
    /* Log */
    //if (debug) console.log("A new Workout has been created");
};

/* Utils */
var printTime = function (totalSeconds) {
    if (totalSeconds == 0) return "0 seconds";

    // num
    var hours = parseInt(totalSeconds / 3600) % 24;
    var minutes = parseInt(totalSeconds / 60) % 60;
    var seconds = totalSeconds % 60;
    
    // str
    var hours_str = "hour";
    if (hours > 1) {
        hours_str = "hours";
    };
    var minutes_str = "minute";
    if (minutes > 1) {
        minutes_str = "minutes";
    };
    var seconds_str = "second";
    if (seconds > 1) {
        seconds_str = "seconds";
    };

    // output
    var res = "";
    if (seconds > 0) {
        res = seconds + " " + seconds_str;
    }
    if (minutes > 0) {
        res = minutes + " " + minutes_str + " " + res;
    };
    if (hours > 0) {
        res = hours + " " + hours_str + " " + res;
    };
    return res;
};

// print distance in K or meters
var printDistance = function (totalDistance) {
    var km = totalDistance / 1000;
    var res = "";
    if (km >= 1.0) {
        res = km + "K";
    } else {
        res = totalDistance + " meters";
    };
    return res;
};

// finds current max order for a particular Workout Set type
var findMaxOrder = function(workoutSets, type) {
	var maxOrder = 0;
	for (var i = 0; i < workoutSets.length; i++) {
	    if (workoutSets[i].type === type) {
	        if (workoutSets[i].order > maxOrder) maxOrder = workoutSets[i].order;
	    };
	};
	return maxOrder;
};
