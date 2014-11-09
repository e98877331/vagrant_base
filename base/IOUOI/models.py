from django.db import models

# Create your models here.

class User(models.Model):
	userId = models.CharField(max_length=200)
	userName = models.CharField(max_length=200)

class Relation(models.Model):
	user1Id = models.ForeignKey(User)
	#user2Id = models.ForeignKey(User ,related_name='user2Id_yaya')
	user2Id = models.ForeignKey(User)
	value = models.IntegerField()

class Queue(models.Model):
	receiverId = models.ForeignKey(User)
	#senderId = models.ForeignKey(User,related_name='senderId_yaya')
	senderId = models.ForeignKey(User)

