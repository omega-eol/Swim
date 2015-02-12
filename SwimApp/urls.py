from django.conf.urls import patterns, include, url
from django.contrib import admin
from swim.views import IndexView

urlpatterns = patterns('',
    # admin page
    url(r'^admin/', include(admin.site.urls)),
    
    # REST API
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    url(r'^api/', include('api.urls')),
    
    # AngularJS
    url('^.*$', IndexView.as_view(), name='index'),
)
