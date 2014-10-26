'use strict'

app = angular.module 'iscsi'

# external storage list controller
app.controller 'iscsiCtrl', [
  '$scope'
  'targets'
  'quota'
  '$timeout'
  '$http'
  '$modal'
  '$log'
  'toaster'
  ($scope, targets, quota, $timeout, $http, $modal, $log, toaster) ->
    $scope.targets = null

    # polling targets list
    (tick = ->
      targets.read().$promise.then ((resp) ->
        if resp.result
          $scope.targets = resp
        else
          $scope.targets = {}
          toaster.pop 'error', t('error_title'), resp.msg, null, 'trustedHtml'
        $scope.promise = $timeout tick, 100000
        return
      ), (error) ->
        $scope.isc = {}
        $log.error + error
      return
    )()

    # query quota of targets
    $scope.hasIscsiQuota = false
    quota.read().$promise.then ((resp) ->
      if resp.result
        $scope.hasIscsiQuota = (if resp.data.available.iscsi > 0 then true else false)
      else
        toaster.pop 'error', t('error_title'), resp.msg, null, 'trustedHtml'
      $.unblockUI()
      return
    ), (error) ->
      $log.error + error

    # toggle
    $scope.toggle = (item) ->
      # some client is connected
      if (item.status.code is 2 && not item.enabled)
        modalInstance = $modal.open(
          templateUrl: 'toggle-modal.html'
          controller: 'toggleModalCtrl'
          resolve:
            item: ->
              item
        )
        modalInstance.result.then ((item) ->
          $log.info 'Modal: toggle item success: ' + item._id
          $scope.targets = targets.read()
        ), ->
          $log.info 'Modal: dismissed at: ' + new Date()
          $scope.targets = targets.read()
          return
        return
      else
        loadingUI()
        targets.update(item).$promise.then ((resp) ->
          if resp.result
            toaster.pop "success", t('success_title'), resp.msg, 5000, "trustedHtml"
          else
            toaster.pop "error", t('error_title'), resp.msg, null, "trustedHtml"
          $.unblockUI()
          $scope.targets = targets.read()
          return
        ), (error) ->
          toaster.pop "error", t('error_title'), t('server_resp') + error.status, null, "trustedHtml"
          $.unblockUI()
          $scope.targets = targets.read()
          return

    # detail
    $scope.detailModal = (item) ->
      if not item
        item =
          _id: null
          enabled: true
          target_name: ''
          description: ''
          capacity: ''
          iqn: ''
          thin_provisioning: true
          multi_sessions: true
          chap: false
          username: ''
          password: ''
          acl: false
          acls: []

      modalInstance = $modal.open(
        templateUrl: 'detail-modal.html'
        controller: 'detailModalCtrl'
        resolve:
          item: ->
            item
        backdrop: 'static'
      )
      modalInstance.result.then ((item) ->
        $log.info 'Modal: add/edit item success: ' + item.description
        $scope.targets = targets.read()
      ), ->
        $log.info 'Modal: dismissed at: ' + new Date()
        return
      return

    # delete-modal
    $scope.deleteModal = (item) ->
      modalInstance = $modal.open(
        templateUrl: 'delete-modal.html'
        controller: 'deleteModalCtrl'
        resolve:
          item: ->
            item
        backdrop: 'static'
      )
      modalInstance.result.then ((item) ->
        $log.info 'Modal: delete item success: ' + item._id
        $scope.targets = targets.read()
      ), ->
        $log.info 'Modal: dismissed at: ' + new Date()
        return
      return

    $scope.pathDetailModal =  (item) ->
      modalInstance = $modal.open(
        templateUrl: "path-detail-modal.html"
        controller: 'pathDetailModalCtrl'
        resolve:
          item: ->
            item
        backdrop: 'static'
      )
      modalInstance.result.then ((item) ->
        $log.info "Modal: close path detail: " + item._id
        $scope.targets = targets.query()
      ), ->
        $log.info "Modal: dismissed at: " + new Date()
        return

    # exit event
    $scope.$on '$destroy', ->
      # cancel polling when left
      $timeout.cancel $scope.promise  if $scope.promise
      return
]

# toggle modal controller
app.controller 'toggleModalCtrl', [
  '$scope'
  '$modalInstance'
  'targets'
  'toaster'
  'item'
  ($scope, $modalInstance, targets, toaster, item) ->
    $scope.item = item
    $scope.ok = ()->
      $scope.is_processing = true

      targets.update(
        _id: item._id
        enabled: item.enabled
      ).$promise.then ((resp) ->
        if resp.result
          toaster.pop 'success', t('success_title'), resp.msg, 5000, 'trustedHtml'
          $modalInstance.close item
        else
          toaster.pop 'error', t('error_title'), resp.msg, null, 'trustedHtml'
        $scope.is_processing = false
        return
      ), (error) ->
        toaster.pop 'error', t('error_title'), t('server_resp') + error.status, null, 'trustedHtml'
        $scope.is_processing = false
        return
      return

    $scope.cancel = ->
      $modalInstance.dismiss 'cancel'
      return

    return
]

# path-detail modal controller
app.controller 'pathDetailModalCtrl', [
  '$scope'
  '$modalInstance'
  '$location'
  'targets'
  'toaster'
  'item'
  ($scope, $modalInstance, $location, targets, toaster, item) ->
    $scope.item = item
    $scope.ip = $location.host()
    $scope.close = ->
      $modalInstance.dismiss "close"
      return
    $scope.getTextToCopy = (text) ->
      console.log text
      return text
    return
]

# detail controller
app.controller 'detailModalCtrl', [
  '$scope'
  '$modalInstance'
  '$filter'
  'targets'
  'network_config'
  'toaster'
  'item'
  ($scope, $modalInstance, $filter, targets, network_config, toaster, item) ->
    $scope.item = item

    $scope.item.export_ip = []

    # get available ip
    network_config.get().$promise.then ((resp) ->
      angular.forEach resp.data.net_interfaces, (index) ->
        @push index.ip_address
      , $scope.item.export_ip
    )

    # convert item.capacity for ui
    $scope.item.capacityInt = $filter("getCapacityInt")(item.capacity)
    $scope.item.capacityUnit = $filter("getUnit")(item.capacity)
    $scope.availableUnit = ['MB', 'GB', 'TB']

    # convert password
    if item._id
      if item.chap
        $scope.item.password = 'NOCHANGED'
        $scope.item.confirmPassword = 'NOCHANGED'


    # convert acl tables
    $scope.availableAC = [0, 1]
    $scope.item.permissionInput = 1
    $scope.item.iqnInput = ''

    # setDefaultIqn iqn name
    $scope.setDefaultIqn = (target_name) ->
      if not $scope.item._id
        year  = $filter('date')(new Date(), 'yyyy')
        month = $filter('date')(new Date(), 'MM')
        iqn  = 'iqn.'
        iqn += year.toString()
        iqn += '-'
        iqn += month.toString()
        iqn += '.com.arkexpress:'
        iqn += target_name

        $scope.item.iqn = iqn

    $scope.addIqnList = () ->
      insertAc =
        iqn:        $scope.item.iqnInput
        permission: $scope.item.permissionInput

      $scope.deleteIqnList(insertAc)
      $scope.item.acls.push insertAc

      $scope.item.iqnInput = ''
      $scope.item.permissionInput = 1

    $scope.deleteIqnList = (ac) ->
      $scope.item.acls = _.reject($scope.item.acls, (obj) ->
        return (obj.iqn is ac.iqn)
      )

    $scope.editIqnList = (ac) ->
      $scope.item.iqnInput = ac.iqn
      $scope.item.permissionInput  = ac.permission
      $scope.deleteIqnList(ac)

    $scope.ok = (item)->
      unless item.chap
        delete item.username
        delete item.password

      unless item.acl
        delete item.acls

      delete item.permissionInput
      delete item.iqnInput

      # convert capacity
      item.capacity = $filter("getCapacity")(item.capacityInt, item.capacityUnit)
      delete item.capacityInt
      delete item.capacityUnit

      # convert password
      delete item.confirmPassword
      if item.password == 'NOCHANGED'
        delete item.password

      $scope.is_processing = true
      if item._id
        targets.update(item).$promise.then ((resp) ->
          if resp.result
            toaster.pop "success", t('success_title'), resp.msg, 5000, "trustedHtml"
            $modalInstance.close $scope.item
          else
            toaster.pop "error", t('error_title'), resp.msg, null, "trustedHtml"
            $scope.is_processing = false
          return
        ), (error) ->
          toaster.pop "error", t('error_title'), t('server_resp') + error.status, null, "trustedHtml"
          $scope.is_processing = false
          return
      else
        delete item._id
        targets.create(item).$promise.then ((resp) ->
          if resp.result
            toaster.pop "success", t('success_title'), resp.msg, 5000, "trustedHtml"
            $modalInstance.close $scope.item
          else
            toaster.pop "error", t('error_title'), resp.msg, null, "trustedHtml"
          $scope.is_processing = false
          return
        ), (error) ->
          toaster.pop "error", t('error_title'), t('server_resp') + error.status, null, "trustedHtml"
          $scope.is_processing = false
          return

      return

    $scope.cancel = ->
      $modalInstance.dismiss "cancel"
      return

    return
]

# delete modal controller
app.controller 'deleteModalCtrl', [
  '$scope'
  '$modalInstance'
  'targets'
  'toaster'
  'item'
  ($scope, $modalInstance, targets, toaster, item) ->
    $scope.item = item
    $scope.ok = ()->
      $scope.is_processing = true
      targets.delete(
        _id: item._id
      ).$promise.then ((resp) ->
        if resp.result
          toaster.pop 'success', t('success_title'), resp.msg, 5000, 'trustedHtml'
          $modalInstance.close item
        else
          toaster.pop 'error', t('error_title'), resp.msg, null, 'trustedHtml'
        $scope.is_processing = false
        return
      ), (error) ->
        toaster.pop 'error', t('error_title'), t('server_resp') + error.status, null, 'trustedHtml'
        $scope.is_processing = false
        return
      return

    $scope.cancel = ->
      $modalInstance.dismiss 'cancel'
      return

    return
]
