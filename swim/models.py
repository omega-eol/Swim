from django.db import models
from django.contrib.auth.models import User
from datetime import datetime

class Workout(models.Model):
    # model name
    name = models.CharField(max_length=255, blank=True)
    
    # model description
    description = models.CharField(max_length=2048, default="", blank=True)
    
    # date and time when the current Workout was created 
    created_at = models.DateTimeField(default=datetime.now)
    
    # date and time when the current Workout was updated
    updated_at = models.DateTimeField(default=datetime.now)
    
    # author
    user = models.ForeignKey(User)
    
    # type: User defined, SwimWeb define..
    type = models.CharField(max_length=42)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return "%s by %s %s" % (self.name, self.user.first_name, self.user.last_name)
    
    def getWorkoutSets(self):
        return WorkoutSet.objects.filter(workout=self)


class WorkoutSet(models.Model):
    # order
    order = models.PositiveSmallIntegerField()
    
    # number of repetitions
    repetitions = models.PositiveSmallIntegerField(default=1)
    
    # type: Warm Up, Pre Set, Main Set, and Cool Down
    type = models.CharField(max_length=42)
    
    # Workout
    workout = models.ForeignKey(Workout, related_name='workoutSets')
    
    class Meta:
        ordering = ['type', 'order']
    
    def __str__(self):
        return "%d x %s (%s)" % (self.repetitions, self.type, self.workout)


class Exercise(models.Model):
    # distance of the exercise
    distance = models.PositiveSmallIntegerField()

    # strokes: free, breast, back, and fly
    stroke = models.CharField(max_length=42, default="Free")
    
    # type: swim - normal swim, kick
    type = models.CharField(max_length=42, default="Swim")
    
    # interval - time in seconds
    interval = models.PositiveIntegerField()
    
    def __str__(self):
        return "%d meters %s %s in %d seconds" % (self.distance, 
                                                  self.stroke, 
                                                  self.type,
                                                  self.interval)
        
    def get_interval(self):
        return self.interval
    
    def get_distance(self):
        return self.distance

class ExerciseSet(models.Model):
    # order
    order = models.PositiveSmallIntegerField()
    
    # number of repetitions
    repetitions = models.PositiveSmallIntegerField(default=1)
    
    # Exercise
    exercise = models.ForeignKey(Exercise, related_name='exerciseSets')
    
    # Workout Set
    workoutSet = models.ForeignKey(WorkoutSet, related_name='exerciseSets')
    
    def delete(self, *args, **kwargs):
        self.exercise.delete() # Exercise Set will be deleted too, because of Django`s default delete: CASCADE
        # no need to call "real" delete method on self
        #super(ExerciseSet, self).delete(*args, **kwargs)
    
    def __str__(self):
        return "%d %s" % (self.repetitions, self.exercise)


    