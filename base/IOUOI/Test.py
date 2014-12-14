from IOUOI.models import MyUser, MoneyRecord

def createTestData():
    u1 = MyUser.objects.create_user('testuser1','testuser1@gmail.com','abcd1234')
    u2 = MyUser.objects.create_user('testuser2','testuser2@gmail.com','abcd1234')
    u3 = MyUser.objects.create_user('testuser3','testuser3@gmail.com','abcd1234')
    u4 = MyUser.objects.create_user('testuser4','testuser4@gmail.com','abcd1234')
    u5 = MyUser.objects.create_user('testuser5','testuser5@gmail.com','abcd1234')
    
    r12 = MoneyRecord(borrowFrom = u1, lendTo = u2, value = 12)
    r13 = MoneyRecord(borrowFrom = u1, lendTo = u2, value = 13)
    r41 = MoneyRecord(borrowFrom = u4, lendTo = u1, value = 41)
    r23 = MoneyRecord(borrowFrom = u2, lendTo = u3, value = 23)
    r12.save()
    r13.save()
    r41.save()
    r23.save()

