/**
 * Swim App Factories
 */

// Workout Factory
swimApp.factory("workoutFactory", function($resource) {
	var workout = $resource('/api/workouts/:id/', { id: '@id' }, { 
		query: {
			method: 'GET',
			isArray: true,
			transformResponse: function(data, header) {
				var wrapped = angular.fromJson(data);
				// for each workout
		        angular.forEach(wrapped, function(item, idx) {
		        	var workout = new Workout();
		        	workout.parse(wrapped[idx]);
		        	wrapped[idx] = workout;
		        });
		        return wrapped;
		    }
		},
		get: {
			method: 'GET',
			isArray: false,
			transformResponse: function(data, header) {
				var s = angular.fromJson(data);
			 	var workout = new Workout();
	        	workout.parse(s);
	        	return workout;
		    }
		},
		update: { 
			method: 'PUT',
			isArray: false,
			transformResponse: function(data, header) {
				var s = angular.fromJson(data);
			 	var workout = new Workout();
	        	workout.parse(s);
	        	return workout;
		    }
		} 
	});
	return workout;
});

swimApp.factory("workoutSetFactory", function($resource) {
	var workoutSet = $resource('/api/exerciseSets/:id/', { id: '@id' }, { 
		get: {
			method: 'GET',
			isArray: false,
			transformResponse: function(data, header) {
				var s = angular.fromJson(data);
				var exercise = new Exercise(s.exercise.distance, s.exercise.stroke, s.exercise.type, s.exercise.interval);
	        	var workoutSet = null;
	        	var exerciseSet = new ExerciseSet();
	        	
	        	wrapped[idx] = exerciseSet;
	        	console.log(exerciseSet);
		        return s;
		    }
		},
		update: { method: 'PUT' } 
	});
	return exerciseSet;
});

swimApp.factory("exerciseSetFactory", function($resource) {
	var exerciseSet = $resource('/api/exerciseSets/:id/', { id: '@id' }, { 
		query: {
			method: 'GET',
			isArray: true,
			transformResponse: function(data, header) {
				var wrapped = angular.fromJson(data);
				angular.forEach(wrapped, function(item, idx) {
		        	var exerciseSet = new ExerciseSet()
		        	exerciseSet.parse(item);
		        	wrapped[idx] = exerciseSet;
		        });
		        return wrapped;
		    }
		},
		get: {
			method: 'GET',
			isArray: false,
			transformResponse: function(data, header) {
				var s = angular.fromJson(data);
				var exercise = new Exercise(s.exercise.distance, s.exercise.stroke, s.exercise.type, s.exercise.interval);
	        	var workoutSet = null;
	        	var exerciseSet = new ExerciseSet();
	        	
	        	wrapped[idx] = exerciseSet;
	        	console.log(exerciseSet);
		        return s;
		    }
		},
		update: { method: 'PUT' } 
	});
	return exerciseSet;
});

swimApp.factory("exerciseFactory", function($resource, $http, $cookies) {
	var parseExercise = function(data, header) {
		var s = angular.fromJson(data);
		var exercise = new Exercise();
		exercise.parse(s);
		return exercise;
    };
    
	var exercise =  $resource('/api/exercises/:id/', { id: '@id' }, {
		query: { // get all exercises
			method: 'GET',
			isArray: true,
			transformResponse: function(data, header) {
				var wr = angular.fromJson(data);
				angular.forEach(wr, function(s, idx) {
					var exercise = new Exercise();
					exercise.parse(s);
					wr[idx] = exercise;
				})
				return wr;
			}
		},
		get: { // get by ID
			method: 'GET',
			isArray: false,
			transformResponse: parseExercise
		},
		save: { // save exercise
			method: 'POST',
			isArray: false,
			transformResponse: parseExercise
		},
		update: { // update
			method: 'PUT',
			isArray: false,
			transformResponse: parseExercise
		} 
	});
	
	return exercise;
});
