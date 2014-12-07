from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.

#class User(models.Model):
#    userId = models.CharField(max_length=200)
#    userName = models.CharField(max_length=200)
#    
#    def __unicode__(self):
#        return self.userId + " " + self.userName
#

class MyUser(AbstractUser):
    UserId = models.CharField(max_length=20)

    def __str__(self):              # __unicode__ on Python 2
        return str(self.UserId)


class Lender(models.Model):
    lendFrom = models.ForeignKey(MyUser , related_name='lendFrom_set')
    lendTo = models.ForeignKey(MyUser , related_name='lendTo_set')
    value = models.IntegerField()

    def __str__(self):              # __unicode__ on Python 2
        return str(self.lendFrom) + " to " + str(self.lendTo) + " " + str(self.value)  



class Borrower(models.Model):
    borrowFrom = models.ForeignKey(MyUser , related_name='borrowFrom_set')
    borrowTo = models.ForeignKey(MyUser , related_name='borrowTo_set')
    value = models.IntegerField()

    def __str__(self):              # __unicode__ on Python 2
        return str(self.borrowFrom) + " to " + str(self.borrowTo) + " " + str(self.value)



class EventQueue(models.Model):
    receiverId = models.ForeignKey(MyUser, related_name='eventQueueReceiver_set')
    senderId = models.ForeignKey(MyUser,related_name='eventQueueSender_set')
    value = models.IntegerField()
 
    def __str__(self):              # __unicode__ on Python 2
        return self.receiverId + " " + self.senderId


