from django.db import models


class User(models.Model):
    name = models.CharField(max_length=100)
    uuid = models.CharField(max_length=100)

    def __str__(self):              # __unicode__ on Python 2
        return self.name


class Message(models.Model):
    # title = models.CharField(max_length=100)
    uuid = models.CharField(max_length=100)
    content = models.TextField()  # models.CharField(max_length=1000)
    # tagline = models.TextField()

    def __str__(self):              # __unicode__ on Python 2
        return self.content
