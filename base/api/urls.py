from django.conf.urls import patterns, url


urlpatterns = patterns(
    'api.views',
    url(r'^putTextBottleIntoTheOcean/?$', "putTextBottleIntoTheOcean", name="putTextBottleIntoTheOcean"),
    url(r'^getRandomMessageFromTheOcean$', "getRandomMessageFromTheOcean", name="getRandomMessageFromTheOcean"),
    url(r'^generateUserToken$', "generateUserToken", name="generateUserToken"),
)
