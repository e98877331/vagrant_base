'use strict'

((angular) ->

  # use mock api when localhost
  # return  unless document.URL.match(/:8000/)
  return unless document.URL.match(/127.0.0.1/)

  app = angular.module 'iscsi'
  # we want to use $httpBackend mock
  app.config ($provide) ->
    $provide.decorator "$httpBackend", angular.mock.e2e.$httpBackendDecorator
    return

  # define our fake backend
  app.run ($httpBackend) ->
    console.log 'init mock'

    # do not bother server, respond with given content
    $httpBackend
    .whenGET("/volume/iscsi/targets")
    .respond 200,
      result: true
      msg: null
      data:
        [
          {
            _id: 'dummymongoid01'
            enabled: false
            target_name: 'Target01'
            description: 'dummy description 01 haha.'
            capacity: 2*1024*1024*1024*1024
            iqn: 'iqn.2014-08.com.arkexpress:Target.01'
            thin_provisioning: false
            multi_sessions: true
            chap: true
            username: 'test'
            password: 'password'
            acl: true
            acls: [
              {
                iqn: 'iqn.2014-08.com.arkexpress:initiator.01'
                permission: 0
              },
              {
                iqn: 'iqn.2014-08.com.arkexpress:initiator.02'
                permission: 1
              }
            ]
            status:
              code: 0
              connected: ['192.168.1.1', '192.168.1.20']
              usage: 2*1024*1024*1024*1024
          }
          {
            _id: 'dummymongoid02'
            enabled: true
            target_name: 'Target02'
            description: 'dummy description 02 haha.'
            capacity: 2*1024*1024*1024*1024
            iqn: 'iqn.2014-08.com.arkexpress:Target.02'
            thin_provisioning: false
            multi_sessions: false
            chap: true
            username: 'test'
            password: 'password'
            acl: true
            acls: [
              {
                iqn: 'iqn.2014-08.com.arkexpress:initiator.01'
                permission: 0
              },
              {
                iqn: 'iqn.2014-08.com.arkexpress:initiator.02'
                permission: 1
              }
            ]
            status:
              code: 1
              connected: ['192.168.1.2', '192.168.1.20']
              usage: 512*1024*1024*1024
          }
          {
            _id: 'dummymongoid03'
            enabled: true
            target_name: 'Target03'
            description: 'dummy description 03 haha.'
            capacity: 2*1024*1024*1024*1024
            iqn: 'iqn.2014-08.com.arkexpress:Target.03'
            thin_provisioning: false
            multi_sessions: false
            chap: true
            username: 'test'
            password: 'password'
            acl: true
            acls: [
              {
                iqn: 'iqn.2014-08.com.arkexpress:initiator.01'
                permission: 0
              },
              {
                iqn: 'iqn.2014-08.com.arkexpress:initiator.02'
                permission: 1
              }
            ]
            status:
              code: 2
              connected: ['192.168.1.3', '192.168.1.20']
              usage: 512*1024*1024*1024
          }
        ]

    $httpBackend
    .whenGET("/volume/iscsi/quota")
    .respond 200,
      result: true
      msg: null
      data:
        available:
          iscsi: 0

    $httpBackend
    .whenPUT("/volume/iscsi/targets")
    .respond 200,
      result: true
      msg: null
      data: null

    $httpBackend
    .whenPOST("/volume/iscsi/targets")
    .respond 200,
      result: true
      msg: null
      data: null

    # do real request
    $httpBackend.whenGET(/i18n/).passThrough()
    $httpBackend.whenGET(/views/).passThrough()
    $httpBackend.whenGET(/partials/).passThrough()
    return
) angular
