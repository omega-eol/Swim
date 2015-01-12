from django.shortcuts import render
from django.http.response import HttpResponse

def workouts(request):
    return HttpResponse('Hello There!')