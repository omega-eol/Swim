from django.contrib import admin
from swim.models import Workout, WorkoutSet, Exercise, ExerciseSet

# Register your models here.
admin.site.register(Workout)
admin.site.register(WorkoutSet)
admin.site.register(Exercise)
admin.site.register(ExerciseSet)