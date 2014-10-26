'use strict'

$('#volume').parent().addClass 'active'

app = angular.module 'iscsi', [
  'ngResource'
  'ngSanitize'
  'ngRoute'
  'angular-underscore'
  'ui.bootstrap'
  'ngAnimate'
  'toaster'
  'mgo-angular-wizard'
  'frapontillo.bootstrap-switch'
  'ngClipboard'
  'datatables'
]

# angularjs route
app.config [
  '$routeProvider'
  '$locationProvider'
  ($routeProvider, $locationProvider) ->
    $routeProvider
      .when '/volume/',
        redirectTo: '/volume/cifs/'
      .when '/volume/iscsi/',
        templateUrl: '/volume/partials/iscsi/index'
        controller: 'iscsiCtrl'
      .otherwise
        redirectTo: '/volume/cifs/'

    $locationProvider.html5Mode true
]

# replace interpolate for django template engine
app.config [
  '$interpolateProvider'
  ($interpolateProvider) ->
    $interpolateProvider.startSymbol('{$')
    $interpolateProvider.endSymbol('$}')
]

# add x-requested-with for ng-resource
app.config [
  '$httpProvider'
  ($httpProvider) ->
    $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
]

app.config [
  'ngClipProvider'
  (ngClipProvider) ->
    ngClipProvider.setPath '/static/components/zeroclipboard/ZeroClipboard2.1.3.swf'
]