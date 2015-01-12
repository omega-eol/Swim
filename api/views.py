from rest_framework import viewsets
from swim.models import Workout, Exercise
from api.serializers import WorkoutSerializer, ExerciseSerializer

class WorkoutViewSet(viewsets.ModelViewSet):
    queryset = Workout.objects.all()
    serializer_class = WorkoutSerializer

# ViewSets define the view behavior for the Exercise
class ExerciseViewSet(viewsets.ModelViewSet):
    queryset = Exercise.objects.all()
    serializer_class = ExerciseSerializer
    
    