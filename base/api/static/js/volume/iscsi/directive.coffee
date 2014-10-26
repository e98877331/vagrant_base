'use strict'

app = angular.module 'iscsi'

# directive for custom validator
app.directive 'ensureTargetNameUnique', [
  '$http'
  ($http) ->
    return (
      require: 'ngModel'
      link: (scope, ele, attrs, c) ->
        # scope.$watch attrs.ngModel, ->
        ele.bind('blur', (e)->
          $http(
            method: 'GET'
            url: '/volume/iscsi/targets'
          ).success((resp, status, headers, cfg) ->
            item = JSON.parse(attrs.ensureTargetNameUnique)
            # edit mode always return true
            if item._id
              c.$setValidity 'unique', true
            else
              c.$setValidity 'unique', !_.contains _.pluck(resp.data, 'target_name'), item.target_name
            return
          ).error (resp, status, headers, cfg) ->
            c.$setValidity 'unique', false
            return
          return
      )
    )
]

app.directive 'ensureIqnUnique', [
  '$http'
  ($http) ->
    return (
      require: 'ngModel'
      link: (scope, ele, attrs, c) ->
        # scope.$watch attrs.ngModel, ->
        ele.bind('blur', (e)->
          $http(
            method: 'GET'
            url: '/volume/iscsi/targets'
          ).success((resp, status, headers, cfg) ->
            item = JSON.parse(attrs.ensureIqnUnique)
            # edit mode always return true
            if item._id
              c.$setValidity 'unique', true
            else
              c.$setValidity 'unique', !_.contains _.pluck(resp.data, 'iqn'), item.iqn
            return
          ).error (resp, status, headers, cfg) ->
            c.$setValidity 'unique', false
            return
          return
      )
    )
]

app.directive 'ensurePasswordMatch', [
  '$http'
  ($http) ->
    return (
      require: 'ngModel'
      link: (scope, ele, attrs, c) ->
        scope.$watch attrs.ngModel, ->

          item = JSON.parse(attrs.ensurePasswordMatch)
          # edit mode always return true
          if item._id
            return c.$setValidity 'match', true

          if item.password is item.confirmPassword
            return c.$setValidity 'match', true
          else
            return c.$setValidity 'match', false
    )
]