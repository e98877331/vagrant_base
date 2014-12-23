from django.db import models
from django.contrib.auth.models import AbstractUser

import IOUHelper as helper
# import IOUOI.IOUHelper
# Create your models here.

# class User(models.Model):
#    userId = models.CharField(max_length=200)
#    userName = models.CharField(max_length=200)
#
#    def __unicode__(self):
#        return self.userId + " " + self.userName
#


class MyUser(AbstractUser):
    userId = models.CharField(max_length=20)

    def __str__(self):              # __unicode__ on Python 2
        return str(self.username)

    def lendTo(self, userTo, value):
        helper.IOUHelper.lendTo(self, userTo, value)

    def borrowFrom(self, userTo, value):
        helper.IOUHelper.borrowFrom(self, userTo, value)


class MoneyRecord(models.Model):
    borrowFrom = models.ForeignKey(MyUser, related_name='borrowFrom_set')
    lendTo = models.ForeignKey(MyUser, related_name='lendTo_set')
    value = models.IntegerField()

    def __str__(self):              # __unicode__ on Python 2
        return str(self.borrowFrom) + " to " + str(self.lendTo) + " " + \
            str(self.value)


class EventQueue(models.Model):
    receiverId = models.ForeignKey(MyUser,
                                   related_name='eventQueueReceiver_set')
    senderId = models.ForeignKey(MyUser, related_name='eventQueueSender_set')
    value = models.IntegerField()
    message = models.CharField(max_length=80, default="")
    createDate = models.DateTimeField()

    def accept(self):
        print "TODO accept"

    def deny(self):
        print "TODO deny"

    def __str__(self):              # __unicode__ on Python 2
        return str(self.receiverId) + " " + str(self.senderId) + " " + \
            self.message


class EventHistory(models.Model):
    ACCEPT = "A"
    DENY = "D"
    STATUS_CHOICE = (
        (ACCEPT, 'accept'),
        (DENY, 'deny')
    )

    receiverId = models.ForeignKey(MyUser,
                                   related_name='eventHistoryReceiver_set')
    senderId = models.ForeignKey(MyUser, related_name='eventHistorySender_set')
    value = models.IntegerField()
    message = models.CharField(max_length=80, default="")
    status = models.CharField(max_length=2,
                              choices=STATUS_CHOICE)
    isRead = models.BooleanField(default=False)
    createDate = models.DateTimeField()

    def __str__(self):              # __unicode__ on Python 2
        return str(self.receiverId) + " " + str(self.senderId) + " " + \
            self.message

