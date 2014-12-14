from django.shortcuts import redirect, render
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_protect, requires_csrf_token
from IOUOI.models import MyUser, EventQueue
from django.core.exceptions import ObjectDoesNotExist


@login_required
@requires_csrf_token
def index(request):
    # get user name from request
    my_name = request.user.username

    # Get user object
    my_obj = MyUser.objects.get(username=my_name)

    # Get the list which I lend to
    i_am_from = my_obj.borrowFrom_set.all()

    # Get the list which I borrow from
    i_am_to = my_obj.lendTo_set.all()

    # Get confirm event list
    confirm_list = my_obj.eventQueueReceiver_set.all()

    return render(request, "dashboard.jade", {
        'i_am_from': i_am_from,
        'i_am_to': i_am_to,
        'confirm_list': confirm_list,
    })


@login_required
def event_actions(request):
    """"""
    # get user name from request
    event_obj = EventQueue.objects.get(pk=request.POST['event_id'])

    my_obj = event_obj.receiverId
    target_obj = event_obj.senderId

    action = 'confirm' if 'confirm' in request.POST else 'deny'
    # Call api
    if action == 'confirm':
        if event_obj.value > 0:
            target_obj.lendTo(my_obj, event_obj.value)
        elif event_obj.value < 0:
            my_obj.lendTo(target_obj, -event_obj.value)
        else:
            raise Exception("Value cannot be zero")
    elif action == 'deny':
        pass
    else:
        raise Exception("Wrong method, should be 'confirm' or 'deny'")

    event_obj.delete()

    return redirect('iou:home')


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
        my_obj = MyUser.objects.get(username=user_name)
        target_obj = MyUser.objects.get(email=target_name)

        if action == 'borrow':
            value = -value

        EventQueue(senderId=my_obj, receiverId=target_obj, value=value).save()

    return redirect('iou:home')
