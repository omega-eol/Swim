from django.conf.urls import patterns, include, url
from swim import views

urlpatterns = patterns('',
    url(r'^workouts', views.workouts, name='workouts'),
)