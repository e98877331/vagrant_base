import json
from django.http import HttpResponse

def json_response(result, msg="", data={}):
    return HttpResponse(json.dumps({"result": result, "msg": msg, "data": data}), content_type='application/json')

