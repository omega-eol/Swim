	/* Swim App Models */
var ExerciseStrokes = ["Free", "Breast", "IM", "Fly"];
var ExerciseTypes = ["Swim", "Drill", "Kick"];
var WorkoutSetTypes = ["Warm Up", "Pre Set", "Main Set", "Cool Down"];

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
    	return this.distance + " meters " + this.stroke + " " + this.type + " in " + this.interval + " seconds.";
    };
    
    console.log("A new Exercise has been created");
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

    console.log("A new ExerciseSet has been created");
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

    console.log("A new WorkoutSet has been created");
};

var Workout = function () {
    this.id = 0;
    this.name = "";
    this.created_at = new Date();
    this.author = ""; 
    this.type = "";
    this.description = "";

    this.user = null;
    this.workoutSets = [];

    /* Functions */
    this.parse = function(s) {
    	// properties
    	this.id = s.id;
    	this.name = s.name;
    	this.created_at = s.created_at;
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
        	that.workoutSets.push(workoutSet);
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
    		user: this.user.toJSON(),
    		workoutSets: this.workoutSetsToJSON()
    	};
    };
    
    /* Serialize set of Workout Sets to JSON */
    this.workoutSetsToJSON = function() {
    	var res = [];
		angular.forEach(this.workoutSets, function(workoutSet, index) {
			res.push(workoutSet.toJSON());
		});
		return res;
    };
    
    /* Distance */
    this.distance = function () {
        var d = 0;
        this.workoutSets.forEach(function (workoutSet) {
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
        this.workoutSets.forEach(function (workoutSet) {
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

    /* Log */
    console.log("A new Workout has been created");
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