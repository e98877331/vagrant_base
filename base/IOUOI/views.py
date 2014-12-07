from django.shortcuts import redirect, render
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_protect, requires_csrf_token
from IOUOI.models import MoneyRecord, MyUser


@login_required
@requires_csrf_token
def index(request):
    # get user name from request
    user_name = request.user.username

    # mock
    #TODO get lend list 
    #lend_list = [
    #    {'name': 'Michael', 'money': 15},
    #    {'name': 'Pajamas', 'money': 100},
    #]
    

    # mock
    #TODO get borrow list
    borrow_list = [
        {'name': 'CM', 'money': 50},
        {'name': 'Ornage', 'money': 22},
    ]
    # mock
    #TODO get event list
    confirm_list = [
        {'name': 'stranger1', 'money': 10},
        {'name': 'stranger2', 'money': 20},
    ]

    # return render(request, "index.html", {
    return render(request, "dashboard.jade", {
        'lend_list': lend_list,
        'borrow_list': borrow_list,
        'confirm_list': confirm_list,
    })


@login_required
def event_actions(request, action):
    """"""
    # get user name from request
    user_name = request.user.username

    #TODO get target name from request

    #TODO Call api
    if action == 'confirm':
        pass
    elif action == 'deny':
        pass
    else:
        # TODO return error
        pass

    return


@login_required
@csrf_protect
def iou_update(request):
    """"""
    if request.method == "POST":
        print '=========='
        print 'POST data:'
        # get user name from request
        user_name = request.user.username
        print '        %s' % user_name

        # get target name from request
        target_name = request.POST['target_name']
        print '        %s' % target_name

        # get action from request (lend or borrow)
        action = request.POST['action']
        print '        %s' % action

        # get value from request
        value = request.POST['value']
        print '        %s' % value

        #TODO Call api

    return redirect('iou:home')
