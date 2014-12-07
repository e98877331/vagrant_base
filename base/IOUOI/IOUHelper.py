from IOUOI.models import MyUser, Lender,Borrower
from django.core.exceptions import ObjectDoesNotExist

class IOUHelper:
    def __init__(self):
        pass

    def showCurrentInfo(self):
        print MyUser.objects.all()

    @staticmethod
    def showCurrentInfoS():
        print "static method called"
        print MyUser.objects.all()
     
    
    @staticmethod
    def lendTo(userMe,userTo,value):
        currentValue = 0

        #status 0 : user at lendFrom, 1: user at lendTo, 2:no user record
        status = -1 

        try:
            ldr = Lender.objects.get(lendFrom=userMe,lendTo=userTo)
            currentValue = ldr.value
            status = 0   
        except ObjectDoesNotExist:
            try:
                ldr = Lender.objects.get(lendFrom=userTo,lendTo=userMe)
                currentValue = - ldr.value
                status = 1
            except ObjectDoesNotExist:
                status = 2
        
        result = currentValue + value

        if result > 0:
            if status == 0:
                ldr.value =result
                ldr.save()
            else:
                Lender(lendFrom=userMe,lendTo=userTo,value=result).save()
                if status == 1:
                    ldr.delete()
        elif result < 0:
            if status == 1:
                ldr.value = -result
                ldr.save()
            else:
                Lender(lendFrom=userTo,lendTo=userMe,value=-result).save()
                if status == 0:
                    ldr.delete()

    @staticmethod
    def lendFrom(userMe,userFrom,value):
        IOUHelper.lendTo(userFrom,userMe,value)
            













