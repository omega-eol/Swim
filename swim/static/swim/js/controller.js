var controllers = {};

/* INDEX.HTML */
controllers.WorkoutListCtrl = function ($scope, $route, workoutFactory) {
	$scope.workouts = workoutFactory.query(function() {
		if (debug) console.log($scope.workouts);
	});
};

/* Chart controll */
controllers.WorkoutListCharCtrl = function ($scope, visualization) {
	// get the current workout
	$scope.workout = $scope.$parent.workout;
	
	// get chart dimensions
	//$scope.chart_width = visualization.chart_width;
	//$scope.chart_height = visualization.chart_height;
	//$scope.dd_label = "Distance, m";
	
	// get data
	//var distanceDistByWSType = {};
	//distanceDistByWSType.data = visualization.DistanceDistByWorkourSetType($scope.workout);
	//$scope.distanceDist = visualization.DistanceDistByWorkourSetType($scope.workout);
	//$scope.distanceDist = visualization.DistanceDistTest($scope.workout);
	
	//$scope.strokeDist = visualization.StrokeDistribution($scope.$parent.workout);
	
	//$scope.distanceDist1 = visualization.DistanceDist($scope.workout);
};

/* Workout View/Edit page */
controllers.WorkoutCtrl = function ($scope, $route, $routeParams, workoutFactory, visualization) {
	$scope.workout = workoutFactory.get({id: $routeParams.id}, function(data) {
		// get chart dimensions
		$scope.chart_width = visualization.chart_width;
		$scope.chart_height = visualization.chart_height;
		
		/* Distance distribution chart */
	    var distanceDistByWSType = {};
	    distanceDistByWSType.data = visualization.DistanceDistByWorkourSetType(data);
	    distanceDistByWSType.ylabel = "Distance, m";
		$scope.distanceDistByWSType = distanceDistByWSType;
		
		/* Interval distribution chart */
		var intervalDistByWSType = {};
		intervalDistByWSType.data = visualization.IntervalDistByWorkourSetType(data);
		intervalDistByWSType.ylabel = "Time, min";
		$scope.intervalDistByWSType = intervalDistByWSType;
			
		return data;
	});
	console.log($scope.workout);
	
	// list of workout sets types
	$scope.WorkoutSetTypes = WorkoutSetTypes;
	
    /* Buttons */
    $scope.RemoveWorkoutSet = function (set, index) {
        set.splice(index, 1);
    	if (debug ) console.log("Workout Set has been removed.");
    };

    /* Fires when an user change a workout set type */
    $scope.WorkoutSetTypeUpdate = function(workoutSet, originalType, index) {
    	if (debug) {
    		console.log("Workout Set: ", workoutSet);
    		console.log("Workout Set type: ", originalType);
    		console.log("Index:" , index);
    	};
    	
    	// remove the current Workout Set from the current array
    	var old_array = $scope.workout.getWorkoutSetByType(originalType);
    	$scope.RemoveWorkoutSet(old_array, index);
    	
    	// add the current Workout Set to the new array
    	var new_array = $scope.workout.getWorkoutSetByType(workoutSet.type);
    	new_array.push(workoutSet);
    };
    
    /* New Workout Set */
    $scope.workoutSet_repetitions = 1;
    $scope.workoutSet_type = $scope.WorkoutSetTypes[0];
    $scope.AddWorkoutSet = function () {
    	if (debug) {
    		console.log("Selected type: " + $scope.workoutSet_type);
    		console.log("Selected number of repetitions: " + $scope.workoutSet_repetitions);
    	};
    	
    	if ($scope.workoutSet_type === 'Warm Up') {
    		// find max order
    		order = findMaxOrder($scope.workout.warmUpSets, $scope.workoutSet_type) + 1;
    		// create a Workout Set
    		$scope.workoutSet = new WorkoutSet(order, $scope.workoutSet_repetitions, $scope.workoutSet_type, $scope.workout);
    		// push new Workout Set to right array
    		$scope.workout.warmUpSets.push($scope.workoutSet);
    	} else if ($scope.workoutSet_type === 'Pre Set') {
    		// find max order
    		order = findMaxOrder($scope.workout.preSetSets, $scope.workoutSet_type) + 1;
    		// create a Workout Set
    		$scope.workoutSet = new WorkoutSet(order, $scope.workoutSet_repetitions, $scope.workoutSet_type, $scope.workout);
    		$scope.workout.preSetSets.push($scope.workoutSet);
    	} else if ($scope.workoutSet_type === 'Main Set') {
    		// find max order
    		order = findMaxOrder($scope.workout.mainSets, $scope.workoutSet_type) + 1;
    		// create a Workout Set
    		$scope.workoutSet = new WorkoutSet(order, $scope.workoutSet_repetitions, $scope.workoutSet_type, $scope.workout);
    		$scope.workout.mainSets.push($scope.workoutSet);
    	} else if ($scope.workoutSet_type === 'Cool Down') {
    		// find max order
    		order = findMaxOrder($scope.workout.coolDownSets, $scope.workoutSet_type) + 1;
    		// create a Workout Set
    		$scope.workoutSet = new WorkoutSet(order, $scope.workoutSet_repetitions, $scope.workoutSet_type, $scope.workout);
    		$scope.workout.coolDownSets.push($scope.workoutSet);
    	};
    	
	};

    /* Sortable functionality for Workout Sets */
    var newWorkoutSetPosition = 0;
    $scope.workoutSetsSortableOptions = {
        placeholder: "ui-state-highlight",
        forcePlaceholderSize: true,
        handle: "> div.fa-arrows-v"
    };
    
    /* Save Workout */
    $scope.saveWorkout = function() {
    	console.log($scope.workout.toJSON());
    	workoutFactory.update({ id: $scope.workout.id}, $scope.workout);
    };
    
};

controllers.ExerciseSetCtrl = function ($scope) {
    // Constraints
    $scope.ExerciseStrokes = ExerciseStrokes;
    $scope.ExerciseTypes = ExerciseTypes;

    // get the current workout set
    $scope.workoutSet = $scope.$parent.workoutSet;

    // for Edit Exercise Set Button
    $scope.editable = new Array($scope.workoutSet.exerciseSets.length);
    for (var i = 0; i < $scope.workoutSet.exerciseSets.length; i++) { $scope.editable[i] = false };
    
    // create a temporary exercise for the new exercise form
    $scope.exercise = new Exercise(50, "Free", "Swim", 60);
    
    /* Buttons */
    $scope.AddExerciseSet = function (exercise) {
        var newExercise = exercise.clone();
        if (newExercise.isValid()) {
            var exerciseSet = new ExerciseSet(1, 1, newExercise, $scope.workoutSet);
            $scope.workoutSet.exerciseSets.push(exerciseSet);
            $scope.editable.push(false);
        };
    };
    
    $scope.RemoveExerciseSet = function(index) {
        $scope.workoutSet.exerciseSets.splice(index, 1);
        console.log("Exercise Set has been removed.");
    };

    $scope.EditExerciseSet = function (index) {
        $scope.editable[index] = true;
        console.log("Switched to Edit Exercise mode");

        // create a temp exercise
        $scope.temp_exercise = $scope.workoutSet.exerciseSets[index].exercise.clone();
    };

    $scope.CancelEditExerciseSet = function (index) {
        $scope.editable[index] = false;

        // replace current exercise with the temp
        $scope.workoutSet.exerciseSets[index].exercise = $scope.temp_exercise;
    };

    $scope.SaveExerciseSet = function (index) {
        $scope.editable[index] = false;
    };
    
    // Make Exercises sortable
    $scope.exerciseSetsSortableOptions = {
        placeholder: "ui-state-highlight",
        forcePlaceholderSize: true,
        handle: ">  span.fa-arrows-v",
        start: function(e, ui) {
            console.log("Old position: " + ui.item.index());
        },
        stop: function(e, ui) {
            console.log("New position: " + ui.item.index());
        }
    };
};

//exercises Test controller
controllers.ExerciseTestCtrl = function ($scope, exerciseFactory) {
	$scope.exercises = exerciseFactory.query();
	$scope.new_exercise = new Exercise(150, "Fly", "Drill", 140);
		
	// update exercise
	$scope.update = function(exercise) {
		console.log(exercise);
		exercise.$update();
	};
	
	// create new exercise
	$scope.create = function(exercise) {
		// back end
		var rest_exercise = new exerciseFactory(exercise.toJSON());
		
		rest_exercise.$save().then(function(exercise) {
			// front end: add the exercise to the list
			console.log(exercise);
			$scope.exercises.push(exercise);
		}, function(error){
			console.log(error);
			alert("Cannot save the Exercise.");
		});
		
		
	};
	
	// remove Exercise
	$scope.remove = function(exercise, index) {
		console.log("About to delete the exercise..");
		console.log(exercise);
		
		// remove exercise from server
		exercise.$delete().then(function() {
			// remove exercise from form
			$scope.exercises.splice(index, 1);
	        console.log("Exercise has been removed.");
		}, function(exercise) {
			alert("Cannot delete the Exercise: ", exercise.id, ".");
		});
	};
	
};

controllers.ExerciseSetTestCtrl = function ($scope, exerciseSetFactory) {
	// list of all exercise sets
	$scope.exerciseSets = exerciseSetFactory.query();
	
	// new exercise set
	var workoutSet = new WorkoutSet();
	workoutSet.id = 1;
	$scope.new_exerciseSet = new ExerciseSet(1, 1, new Exercise(50, "Fly", "Free", 60), workoutSet);
	
	// create new exercise
	$scope.create = function(exerciseSet) {
		var rest_exerciseSet = new exerciseSetFactory(exerciseSet.toJSON());
		
		rest_exerciseSet.$save().then(function(exerciseSet) {
			// front end: add the exercise to the list
			console.log(exerciseSets);
			$scope.exerciseSets.push(exerciseSet);
		}, function(error){
			console.log(error);
			alert("Cannot save the Exercise Set.");
		});
	};	

	// remove Exercise Set
	$scope.remove = function(exerciseSet, index) {
		console.log("About to delete Exercise Set, id:" + exerciseSet.id);
		
		// remove Exercise Set from server
		exerciseSet.$delete().then(function() {
			// remove exercise set from form
			$scope.exerciseSets.splice(index, 1);
	        console.log("Exercise Set has been removed.");
		}, function(exerciseSet) {
			alert("Cannot delete the Exercise Set, id: ", exerciseSet.id, ".");
		});
	};
};

//Attach controllers to the app
swimApp.controller(controllers);


