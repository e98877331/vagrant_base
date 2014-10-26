'use strict'

app = angular.module 'iscsi'

app.factory 'targets', [
  '$resource'
  ($resource)->
    targets = $resource '/volume/iscsi/targets/:_id', {},
      create:
        method: 'POST'
      read:
        method: 'GET'
        isArray: false
        transformResponse: (resp, header) ->
          resp = angular.fromJson(resp)
          if resp.result
            # _.extend resp,
            #   totalUsage: _.reduce(resp.data, (memo, item) ->
            #     memo + parseInt(item.status.usage)
            #   , 0)
            _.extend resp,
              totalCapacity: _.reduce(resp.data, (memo, item) ->
                memo + parseInt(item.capacity)
              , 0)
          return resp
      update:
        method: 'PUT'
        params:
          _id: '@_id'
      delete:
        method: 'DELETE'
        params:
          _id: '@_id'
    return targets
]

app.factory 'quota', [
  '$resource'
  ($resource)->
    quota = $resource '/volume/iscsi/quota', {},
      read:
        method: 'GET'
        isArray: false
    return quota
]

app.factory 'network_config', [
  '$resource'
  ($resource)->
    network_config = $resource '/sys_admin/network_configuration/', {},
      get:
        method: 'GET'
        is_array: false
    return network_config
]