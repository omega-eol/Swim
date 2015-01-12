from swim.models import Exercise, Workout, WorkoutSet, ExerciseSet
from django.contrib.auth.models import User
from rest_framework import serializers

# User proveded by Django
class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ('first_name', 'last_name')

# Exercise
class ExerciseSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Exercise
        fields = ('id', 'distance', 'stroke', 'type', 'interval')

# Exercise Set
class ExerciseSetSerializer(serializers.HyperlinkedModelSerializer):
    
    exercise = ExerciseSerializer()
    
    class Meta:
        model = ExerciseSet
        fields = ('id', 'order', 'repetitions', 'exercise')

# Workout Set
class WorkoutSet(serializers.HyperlinkedModelSerializer):
    
    exerciseSets = ExerciseSetSerializer(read_only=True, many=True)
    
    class Meta:
        model = WorkoutSet
        fields = ('id', 'order', 'repetitions', 'type', 'exerciseSets')

# Workout
class WorkoutSerializer(serializers.HyperlinkedModelSerializer):
    # User
    user = UserSerializer()
    
    # Workout Sets
    workoutSets = WorkoutSet(read_only=True, many=True)
    
    # Other fileds
    class Meta:
        model = Workout
        fields = ('id', 'name', 'description', 'user', 'type', 'workoutSets')

