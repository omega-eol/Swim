var controllers = {};

var w = null;

controllers.WorkoutCtrl = function ($scope, $route, $routeParams, workoutFactory) {
	$scope.workout = workoutFactory.get({id:1});
	//console.log($scope.workout);
	
	// make w accessible in console
	//w = $scope.workout;
	
    /* Workout Set Type */
    $scope.WorkoutSetTypes = WorkoutSetTypes;
    $scope.getWorkoutSetTypeOrder = function (workoutSet) {
        for (var i = 0; i < $scope.WorkoutSetTypes.length; i++) {
            if (WorkoutSetTypes[i] === workoutSet.type) return i;
        };
        console.log(workoutSet.type + " is not found in WorkoutSetTypes.");
        return 0;
    };

    /* Buttons */
    $scope.RemoveWorkoutSet = function (index) {
        $scope.workout.workoutSets.splice(index, 1);
        console.log("Workout Set has been removed.");
    };

    /* New Workout Set */
    $scope.workoutSet_repetitions = 1;
    $scope.workoutSet_type = "Warm Up";
    $scope.AddWorkoutSet = function () {
        // find max order
        var maxOrder = 0;
        for (var i = 0; i < $scope.workout.workoutSets.length; i++) {
            if ($scope.workout.workoutSets[i].type === $scope.workoutSet_type) {
                if ($scope.workout.workoutSets[i].order > maxOrder) maxOrder = $scope.workout.workoutSets[i].order;
            };
        };        

        $scope.workoutSet = new WorkoutSet(maxOrder+1, $scope.workoutSet_repetitions, $scope.workoutSet_type, $scope.workout);
        $scope.workout.workoutSets.push($scope.workoutSet);
    };

    /* Change Workout Set Type -> Order */
    $scope.WorkoutSetTypeOrderUpdate = function (workoutSet) {
        // change the order of the current workoutSet
        workoutSet.order = -1;

        // find max order
        var maxOrder = 0;
        for (var i = 0; i < $scope.workout.workoutSets.length; i++) {
            if ($scope.workout.workoutSets[i].type === workoutSet.type) {
                if ($scope.workout.workoutSets[i].order > maxOrder) maxOrder = $scope.workout.workoutSets[i].order;
            };
        };
        workoutSet.order = maxOrder + 1;
    }

    /* Sortable functionality */
    $scope.workoutSetsSortableOptions = {
        placeholder: "ui-state-highlight",
        forcePlaceholderSize: true,
        handle: "> div.fa-arrows-v",
        start: function(e, ui) {
            console.log("Old position: " + ui.item.index());
        },
        stop: function(e, ui) {
            console.log("New position: " + ui.item.index());
            //ui.item.sortable.cancel();
        }
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

//Controllers
swimApp.controller(controllers);


