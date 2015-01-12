
/* jquery effects */
/*
$(function () {
    $("ul.workoutSets").sortable({
        placeholder: "ui-state-highlight"
    });
});
*/

/* angular js */
var controllers = {};

controllers.WorkoutCtrl = function ($scope) {
    $scope.workout = new Workout("defined");
    $scope.workout.author = "Artur Abdullin";

    var workoutSet1 = new WorkoutSet(1, 2, 'Warm Up', null);

    // create a few exerciseSets
    var exerciseSet1 = new ExerciseSet(1, 1, new Exercise(50, "Free", "Swim", 60), $scope.workoutSet);
    var exerciseSet2 = new ExerciseSet(2, 3, new Exercise(100, "IM", "Drill", 140), $scope.workoutSet);
    // add Exercise Sets to the Workout Set
    workoutSet1.exerciseSets = [exerciseSet1, exerciseSet2];
    $scope.workout.workoutSets = [workoutSet1];

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
    
};

controllers.ExerciseSetCtrl = function ($scope) {
    // Constants
    $scope.ExerciseStrokes = ExerciseStrokes;
    $scope.ExerciseTypes = ExerciseTypes;

    // get the current workout set
    $scope.workoutSet = $scope.$parent.workoutSet;

    // for Edit Exercise Set Button
    $scope.editable = new Array($scope.workoutSet.exerciseSets.length);
    for (var i = 0; i < $scope.workoutSet.exerciseSets.length; i++) { $scope.editable[i] = false };
    
    // create a temp exercise for the new exercise form
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

        // replace currente exercise with the temp
        $scope.workoutSet.exerciseSets[index].exercise = $scope.temp_exercise;
    };

    $scope.SaveExerciseSet = function (index) {
        $scope.editable[index] = false;
    };
    
    // Sortable
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

var swimApp = angular.module('swimApp', ['ui.sortable']);
swimApp.controller(controllers);
