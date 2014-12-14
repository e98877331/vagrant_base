from django.shortcuts import redirect, render
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_protect, requires_csrf_token
from IOUOI.models import MyUser


@login_required
@requires_csrf_token
def index(request):
    # get user name from request
    user_obj = MyUser.objects.get(username=request.user.username)
    i_am_from = user_obj.borrowFrom_set.all()
    i_am_to = user_obj.lendTo_set.all()

    # mock
    # TODO get lend list
    '''lend_list = [
        {'lendTo': 'michael@gmail.com', 'value': 15},
        {'lendTo': 'pajamas@yahoo.com.tw', 'value': 100},
    ]

    # mock
    #TODO get borrow list
    borrow_list = [
        {'borrowFrom': 'cm@gmail.com', 'value': 50},
        {'borrowFrom': 'ornage@yahoo.com.tw', 'value': 22},
    ]'''
    # mock
    # TODO get event list
    confirm_list = [
        {'senderId': 'aaa@gmail.com', 'value': 10},
        {'senderId': 'aaa@gmail.com', 'value': -10},
    ]

    # return render(request, "index.html", {
    return render(request, "dashboard.jade", {
        'i_am_from': i_am_from,
        'i_am_to': i_am_to,
        'confirm_list': confirm_list,
    })


@login_required
def event_actions(request, action):
    """"""
    # get user name from request
    user_name = request.user.username

    # TODO get target name from request

    # TODO Call api
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
        value = int(request.POST['value'])
        print '        %s' % value

        # Call api
        me = MyUser.objects.get(username=user_name)
        target = MyUser.objects.get(email=target_name)

        if action == 'lend':
            me.lendTo(userTo=target, value=value)
        elif action == "borrow":
            me.borrowFrom(userTo=target, value=value)
        else:
            # TODO wrong action
            pass

    return redirect('iou:home')
