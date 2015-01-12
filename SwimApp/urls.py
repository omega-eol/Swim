from django.conf.urls import patterns, include, url
from django.contrib import admin

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'SwimApp.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    # admin page
    url(r'^admin/', include(admin.site.urls)),
    
    # App
    url(r'app/', include('swim.urls')),
    
    # REST API
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    url(r'^api/', include('api.urls')),
)
