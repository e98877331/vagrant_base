from django.conf.urls import patterns, include, url
from django.contrib import admin

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'base.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^admin/', include(admin.site.urls)),
    # url(r"^api/", include("api.urls", namespace="api")),
    url(r"^$", 'IOUOI.views.index'),
    url(r"^iou/", include("IOUOI.urls", namespace="iou")),
    url(r"^accounts/", include("account.urls")),
)
