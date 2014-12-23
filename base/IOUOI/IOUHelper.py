# from IOUOI.models import MyUser, MoneyRecord
import models as md
from django.core.exceptions import ObjectDoesNotExist


class IOUHelper:
    def __init__(self):
        pass

    def showCurrentInfo(self):
        print md.MyUser.objects.all()

    @staticmethod
    def showCurrentInfoS():
        print "static method called"
        print md.MyUser.objects.all()

    @staticmethod
    def lendTo(userMe, userTo, value):
        currentValue = 0

        # status 0 : user at borrowFrom, 1: user at lendTo, 2:no user record
        status = -1

        try:
            ldr = md.MoneyRecord.objects.get(borrowFrom=userMe, lendTo=userTo)
            currentValue = ldr.value
            status = 0
        except ObjectDoesNotExist:
            try:
                ldr = md.MoneyRecord.objects.get(borrowFrom=userTo,
                                                 lendTo=userMe)
                currentValue = - ldr.value
                status = 1
            except ObjectDoesNotExist:
                status = 2

        result = currentValue + value

        if result > 0:
            if status == 0:
                ldr.value = result
                ldr.save()
            else:
                md.MoneyRecord(borrowFrom=userMe,
                               lendTo=userTo, value=result).save()
                if status == 1:
                    ldr.delete()
        elif result < 0:
            if status == 1:
                ldr.value = -result
                ldr.save()
            else:
                md.MoneyRecord(borrowFrom=userTo,
                               lendTo=userMe, value=-result).save()
                if status == 0:
                    ldr.delete()
        elif result == 0:
            ldr.delete()

    @staticmethod
    def borrowFrom(userMe, userFrom, value):
        IOUHelper.lendTo(userFrom, userMe, value)

    @staticmethod
    def MRListToJson(MRList):
        '''Money record list to json list for view showing'''
        olist = []
        for i in MRList:
            olist.append({})












