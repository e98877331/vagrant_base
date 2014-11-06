from django.conf.urls import patterns, url


urlpatterns = patterns(
    'IOUOI.views',
    url(r'^$', "index", name="home"),
    url(r'^/$', "index", name="home"),
)
