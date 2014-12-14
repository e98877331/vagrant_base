from . import views
from django.conf.urls import patterns, url


urlpatterns = patterns(
    'IOUOI.views',
    url(r'^$', views.index, name="home"),
    url(r'^/$', views.index, name="home"),
    url(r'^update$', views.iou_update, name="update"),
    url(r'^event$', views.event_actions, name="event_actions"),
)
