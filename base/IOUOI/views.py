from django.shortcuts import redirect, render
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_protect, requires_csrf_token
from IOUOI.models import MyUser, EventQueue
from django.core.exceptions import ObjectDoesNotExist
import pdb

@login_required
@requires_csrf_token
def index(request):

    # Get user object
    my_obj = request.user

    # Get the list which I lend to
    i_am_from = my_obj.borrowFrom_set.all()

    # Get the list which I borrow from
    i_am_to = my_obj.lendTo_set.all()

    # Get confirm event list
    confirm_list = my_obj.eventQueueReceiver_set.all()

    return render(request, "iouoi/dashboard.jade", {
        'i_am_from': i_am_from,
        'i_am_to': i_am_to,
        'confirm_list': confirm_list,
    })

# request accept
@login_required
def event_actions(request):
    """"""
    # get user name from request
    event_obj = EventQueue.objects.get(pk=request.POST['event_id'])

    action = 'confirm' if 'confirm' in request.POST else 'deny'
    # Call api
    if action == 'confirm':
        event_obj.accept()
    elif action == 'deny':
        event_obj.deny()
    else:
        raise Exception("Wrong method, should be 'confirm' or 'deny'")

    return redirect('iou:home')


# new request
@login_required
@csrf_protect
def iou_update(request):
    """"""
    if request.method == "POST":
        user = request.user
        # TODO change target_name to target_email
        targetUserName = request.POST['target_name']
        targetUser = MyUser.objects.get(email=targetUserName)
        action = request.POST['action']
        value = int(request.POST['value'])
        if action == 'borrow':
            value = -value
        user.sendEvent(targetUser, value)

    return redirect('iou:home')
