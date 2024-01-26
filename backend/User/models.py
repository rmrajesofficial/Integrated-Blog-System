from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.
class CustomUser(AbstractUser):
    USER_TYPES = (
        ('Patient', 'Patient'),
        ('Doctor', 'Doctor'),
    )

    profile_picture = models.ImageField(upload_to='profile_pics/', blank=True, null=True)
    user_type = models.CharField(max_length=10, choices=USER_TYPES, blank=True,null=True)
    address=models.CharField(max_length=255, blank=True,null=True)

    def __str__(self):
        return self.username

class Blog(models.Model):
    CATEGORY_CHOICES = [
        ('Mental Health', 'Mental Health'),
        ('Heart Disease', 'Heart Disease'),
        ('Covid19', 'Covid19'),
        ('Immunization', 'Immunization'),
    ]
    title = models.CharField(max_length=255)
    image = models.ImageField(upload_to='blogs/')
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    summary = models.TextField()
    content = models.TextField()
    upload = models.BooleanField(default=False)
    doctor = models.ForeignKey(CustomUser, on_delete=models.CASCADE,null=True,blank=True)

    def __str__(self):
        return self.title

class Appointment(models.Model):
    doctor=models.ForeignKey(CustomUser, on_delete=models.CASCADE ,related_name="Doctor")
    patient=models.ForeignKey(CustomUser, on_delete=models.CASCADE,related_name="Patient")
    speciality = models.CharField(max_length=255)
    date=models.DateField()
    time= models.TimeField()
    confirm=models.BooleanField(default=False)
    def __str__(self):
        return self.speciality