from django.conf.urls import patterns, include, url
from api.views import WorkoutViewSet, ExerciseViewSet
from rest_framework import routers

# Routers provide an easy way of automatically determining the URL conf.
router = routers.DefaultRouter()
router.register(r'exercises', ExerciseViewSet)
router.register(r'workouts', WorkoutViewSet)

urlpatterns = patterns('',
    url(r'^', include(router.urls)),
)