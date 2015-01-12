/* Swim App Models */
var ExerciseStrokes = ["Free", "Breast", "IM", "Fly"];
var ExerciseTypes = ["Swim", "Drill", "Kick"];
var WorkoutSetTypes = ["Warm Up", "Pre Set", "Main Set", "Cool Down"];

var Exercise = function (distance, stroke, type, interval) {
    this.id = 0;
    this.distance = distance;
    this.stroke = stroke;
    this.type = type;
    this.interval = interval;

    /* Functions */
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
    this.clone = function () {
        return new ExerciseSet(this.order, this.repetitions, this.exercise, this.workoutSet);
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

var Workout = function (type) {
    this.id = 0;
    this.name = "Unamed Workout";
    this.created_at = new Date();
    this.author = ""; 
    this.type = "";

    this.workoutSets = [];

    /* Functions */

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