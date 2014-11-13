from django.db import models

# Create your models here.

class User(models.Model):
    userId = models.CharField(max_length=200)
    userName = models.CharField(max_length=200)
    
    def __unicode__(self):
        return self.userId + " " + self.userName


#class Relation(models.Model):
#    user1 = models.ForeignKey(User , related_name='relation_set1')
#    user2 = models.ForeignKey(User , related_name='relation_set2')
#    #user2Id = models.ForeignKey(User)
#    value = models.IntegerField()
#    
#    def __str__(self):              # __unicode__ on Python 2
#        return str(self.user1) + " " + str(self.user2) + " " + str(self.value)


class Lender(models.Model):
    lendFrom = models.ForeignKey(User , related_name='lendFrom_set')
    lendTo = models.ForeignKey(User , related_name='lendTo_set')
    value = models.IntegerField()

    def __str__(self):              # __unicode__ on Python 2
        return str(self.lendFrom) + " to " + str(self.lendTo) + " " + str(self.value)  



class Borrower(models.Model):
    borrowFrom = models.ForeignKey(User , related_name='borrowFrom_set')
    borrowTo = models.ForeignKey(User , related_name='borrowTo_set')
    value = models.IntegerField()

    def __str__(self):              # __unicode__ on Python 2
        return str(self.borrowFrom) + " to " + str(self.borrowTo) + " " + str(self.value)



class EventQueue(models.Model):
    receiverId = models.ForeignKey(User, related_name='eventQueueReceiver_set')
    senderId = models.ForeignKey(User,related_name='eventQueueSender_set')
    value = models.IntegerField()
 
    def __str__(self):              # __unicode__ on Python 2
        return self.receiverId + " " + self.senderId


