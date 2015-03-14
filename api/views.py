from rest_framework import viewsets
from swim.models import Workout, WorkoutSet, Exercise, ExerciseSet
from api.serializers import WorkoutSerializer, ExerciseSerializer, ExerciseSetSerializer,\
    WorkoutSetSerializer

class WorkoutViewSet(viewsets.ModelViewSet):
    queryset = Workout.objects.all()
    serializer_class = WorkoutSerializer

class WorkourSetViewSet(viewsets.ModelViewSet):
    queryset = WorkoutSet.objects.all()
    serializer_class = WorkoutSetSerializer

class ExerciseSetViewSet(viewsets.ModelViewSet):
    queryset = ExerciseSet.objects.all()
    serializer_class = ExerciseSetSerializer

# ViewSets define the view behavior for the Exercise
class ExerciseViewSet(viewsets.ModelViewSet):
    queryset = Exercise.objects.all()
    serializer_class = ExerciseSerializer
    
    