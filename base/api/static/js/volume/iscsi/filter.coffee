'use strict'

app = angular.module 'iscsi'

# byte filter
app.filter 'bytes', ->
  (bytes, precision) ->
    return '-'  if bytes < 0 or isNaN(parseFloat(bytes)) or not isFinite(bytes)
    return '0 bytes' if bytes is 0
    precision = 0  if typeof precision is 'undefined'
    units = [
      'bytes'
      'kB'
      'MB'
      'GB'
      'TB'
      'PB'
    ]
    number = Math.floor(Math.log(bytes) / Math.log(1024))
    (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision) + ' ' + units[number]

app.filter 'getUnit', ->
  (bytes) ->
    return 'TB'  if bytes < 0 or isNaN(parseFloat(bytes)) or not isFinite(bytes)
    return '0 bytes' if bytes is 0
    precision = 0  if typeof precision is 'undefined'
    units = [
      'bytes'
      'kB'
      'MB'
      'GB'
      'TB'
      'PB'
    ]
    number = Math.floor(Math.log(bytes) / Math.log(1024))
    units[number]

app.filter 'getCapacityInt', ->
  (bytes) ->
    return ''  if bytes < 0 or isNaN(parseFloat(bytes)) or not isFinite(bytes)
    return '0 bytes' if bytes is 0
    precision = 0  if typeof precision is 'undefined'
    units = [
      'bytes'
      'kB'
      'MB'
      'GB'
      'TB'
      'PB'
    ]
    number = Math.floor(Math.log(bytes) / Math.log(1024))
    (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision)

app.filter 'getCapacity', ->
  (bytes, unit) ->
    return ''  if bytes < 0 or isNaN(parseFloat(bytes)) or not isFinite(bytes)
    return '0 bytes' if bytes is 0
    precision = 0  if typeof precision is 'undefined'

    switch unit
      when 'MB'
        return parseFloat(bytes)*1024*1024
      when 'GB'
        return parseFloat(bytes)*1024*1024*1024
      when 'TB'
        return parseFloat(bytes)*1024*1024*1024*1024


# Y/N filter
app.filter 'booleanValue', [
  '$sce'
  ($sce) ->
    (booleanValue)->
      if booleanValue
        return t('yes')
      else
        return t('no')
]

# statusCode filter
app.filter 'statusCode', [
  '$sce'
  ($sce) ->
    (statusCode, connected)->
      if isNaN(parseFloat(statusCode)) or not isFinite(statusCode)
        statusCode = 99

      statusCodeMapping =
        0 : 'disabled'
        1 : 'ready'
        2 : 'connected'
        99: '-'

      if statusCode is 2
        connectedHtml  = connected.length
        connectedHtml += ' '
        connectedHtml += t('of_client_is_connecting')
        connectedHtml += ':<br>'

        _.each(connected, (ip) ->
          connectedHtml += '<i class="fa fa-laptop"> '+ip+' '+'<br>'
        , 0)
        return $sce.trustAsHtml(connectedHtml)

      return t(statusCodeMapping[statusCode])
]

# statusCodeIcon filter
app.filter 'statusCodeIcon', [
  '$sce'
  ($sce) ->
    (statusCode)->
      if isNaN(parseFloat(statusCode)) or not isFinite(statusCode)
        statusCode = 99

      disableHtml  = '<i class="fa fa-lg fa-minus-circle text-error"></i>'
      readyHtml  = '<i class="fa fa-lg fa-check-circle text-success"></i>'
      connectedHtml  = '<i class="fa fa-lg fa-link text-info"></i>'

      statusCodeIconMapping =
        0 : disableHtml
        1 : readyHtml
        2 : connectedHtml
        99: '-'

      $sce.trustAsHtml statusCodeIconMapping[statusCode]
]

# permission filter
app.filter 'permission', [
  '$sce'
  ($sce) ->
    (permission, connected)->
      if isNaN(parseFloat(permission)) or not isFinite(permission)
        permission = 99

      permissionMapping =
        0 : 'readOnly'
        1 : 'readWrite'
        99: '-'
      return t(permissionMapping[permission])
]