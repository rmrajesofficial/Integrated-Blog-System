# customuser/serializers.py
from rest_framework import serializers
from User.models import *

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
    def validate(self, data):
        username = data.get('username', None)
        password = data.get('password', None)
        user = CustomUser.objects.filter(username=username).first()
        if user is None:
            raise serializers.ValidationError('User with this username does not exist.')
        if not user.check_password(password):
            raise serializers.ValidationError('Incorrect password.')
        return data

class SignupSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)  # Make username required
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        return data
    
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = '__all__'

class BlogExpandedSerializer(serializers.ModelSerializer):
    doctor=UserSerializer()
    class Meta:
        model = Blog
        fields = '__all__'

class AppointmentSerializer(serializers.ModelSerializer):
    doctor=UserSerializer()
    patient=UserSerializer()
    class Meta:
        model=Appointment
        fields='__all__'

