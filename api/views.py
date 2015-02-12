from rest_framework import viewsets
from swim.models import Workout, Exercise, ExerciseSet
from api.serializers import WorkoutSerializer, ExerciseSerializer, ExerciseSetSerializer

class WorkoutViewSet(viewsets.ModelViewSet):
    queryset = Workout.objects.all()
    serializer_class = WorkoutSerializer

class ExerciseSetViewSet(viewsets.ModelViewSet):
    queryset = ExerciseSet.objects.all()
    serializer_class = ExerciseSetSerializer

# ViewSets define the view behavior for the Exercise
class ExerciseViewSet(viewsets.ModelViewSet):
    queryset = Exercise.objects.all()
    serializer_class = ExerciseSerializer
    
    