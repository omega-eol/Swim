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
    workoutSet = serializers.PrimaryKeyRelatedField(read_only=False, queryset=WorkoutSet.objects.all())
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
    
    exerciseSets = ExerciseSetSerializer(read_only=True, many=True)
    
    class Meta:
        model = WorkoutSet
        fields = ('id', 'order', 'repetitions', 'type', 'exerciseSets')

# Workout
class WorkoutSerializer(serializers.HyperlinkedModelSerializer):
    # User
    user = UserSerializer()
    
    # Workout Sets
    workoutSets = WorkoutSetSerializer(read_only=True, many=True)
    
    # Other fileds
    class Meta:
        model = Workout
        fields = ('id', 'name', 'description', 'type', 'created_at', 'user', 'workoutSets')
        read_only_fields = ('created_at',)
        
    def update(self, instance, validated_data):
        print(validated_data)
        instance.name = validated_data.get('name', instance.name)
        instance.description = validated_data.get('description', instance.description)
        
        workoutSets = validated_data.get('workoutSets')
        print(workoutSets)
        
        instance.save()
        return instance
