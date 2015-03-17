from swim.models import Exercise, Workout, WorkoutSet, ExerciseSet
from django.contrib.auth.models import User
from rest_framework import serializers

# User proveded by Django
class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'first_name', 'last_name')

# Exercise
class ExerciseSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Exercise
        fields = ('id', 'distance', 'stroke', 'type', 'interval')

# Exercise Set
class ExerciseSetSerializer(serializers.HyperlinkedModelSerializer):
    workoutSet = serializers.PrimaryKeyRelatedField(read_only=True)
    #workoutSet = serializers.PrimaryKeyRelatedField(read_only=False, queryset=WorkoutSet.objects.all())
    exercise = ExerciseSerializer()
    
    class Meta:
        model = ExerciseSet
        fields = ('id', 'order', 'repetitions', 'workoutSet', 'exercise')
        
    def create(self, validated_data):
        exercise_data = validated_data.pop('exercise')
        exercise = Exercise.objects.create(**exercise_data)
        workoutSet = validated_data.pop('workoutSet')
        exerciseSet = ExerciseSet.objects.create(exercise=exercise, workoutSet=workoutSet, **validated_data)
        return exerciseSet

# Workout Set
class WorkoutSetSerializer(serializers.HyperlinkedModelSerializer):
    #workout = serializers.PrimaryKeyRelatedField(read_only=True, queryset=Workout.objects.all())
    workout = serializers.PrimaryKeyRelatedField(read_only=True)
    
    exerciseSets = ExerciseSetSerializer(read_only=False, many=True)
    
    class Meta:
        model = WorkoutSet
        fields = ('id', 'order', 'repetitions', 'type', 'workout', 'exerciseSets')

# Workout
class WorkoutSerializer(serializers.HyperlinkedModelSerializer):
    # User
    user = UserSerializer()
    
    # Workout Sets
    workoutSets = WorkoutSetSerializer(read_only=False, many=True)
    
    # Other fileds
    class Meta:
        model = Workout
        fields = ('id', 'name', 'description', 'type', 'created_at', 'updated_at', 'user', 'workoutSets')
        read_only_fields = ('created_at',)
       
    def create(self, validated_data):
        print('This is Workout create.')
        return Workout.objects.get(pk=1)
        
    def update(self, instance, validated_data):
        #print(validated_data)
        
        #TODO implement backup functionality in case of server fails
        #backup = validated_data.copy()
        
        # get Workout fields
        instance.name = validated_data.get('name', instance.name)
        instance.description = validated_data.get('description', instance.description)
        
        # delete all workout sets
        WorkoutSet.objects.filter(workout=instance).delete()
        #print('All previous Workout Set has been removed')
        
        workoutSetsDictionary = validated_data.pop('workoutSets')
        workoutSet_order = 0;
        for workoutSetDictionary in workoutSetsDictionary:
            #print(workoutSetDictionary)
            
            # create new Workout Set
            workoutSet_order = workoutSet_order + 1
            workoutSet = WorkoutSet(order = workoutSet_order, 
                                    repetitions = workoutSetDictionary['repetitions'],
                                    type = workoutSetDictionary['type'],
                                    workout = instance)
            workoutSet.save()
            for exerciseSetDictionary in workoutSetDictionary['exerciseSets']:
                #print(exerciseSetDictionary)
                
                # create new Exercise
                exerciseDictionary = exerciseSetDictionary['exercise']
                exercise = Exercise(distance = exerciseDictionary['distance'],
                                    stroke = exerciseDictionary['stroke'],
                                    type = exerciseDictionary['type'],
                                    interval = exerciseDictionary['interval'])
                exercise.save()
                # create new Exercise Set
                exerciseSet = ExerciseSet(order = exerciseSetDictionary['order'],
                                          repetitions = exerciseSetDictionary['repetitions'],
                                          exercise = exercise,
                                          workoutSet = workoutSet)
                exerciseSet.save()
                
        # save Workout        
        instance.save()
        return instance
