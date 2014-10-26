from uuid import uuid4
import random

from models import Message
from util.util import json_response

from django.views.decorators.csrf import csrf_exempt


@csrf_exempt
def getRandomMessageFromTheOcean(request):
    try:
        random_num = random.randint(1, Message.objects.count())
        random_meessage = Message.objects.get(pk=random_num)
        print random_meessage
        return json_response(True, 'Success', {'messageContent': str(random_meessage)})
    except Exception as e:
        print str(e)


@csrf_exempt
def putTextBottleIntoTheOcean(request):
    my_uuid = request.POST.get('userToken', '')
    my_message = request.POST.get('message', '')

    if my_uuid == '':
        return json_response(False, 'UserToken is none.', {})

    if my_message == '':
        return json_response(False, 'message is none.', {})

    b = Message.objects.create(uuid=my_uuid, content=my_message)
    b.save()

    return json_response(True, 'hello world', {})


@csrf_exempt
def generateUserToken(request):
    try:
        return json_response(True, '', {'userToken': str(uuid4())})
    except Exception as e:
        return json_response(False, str(e), {})
