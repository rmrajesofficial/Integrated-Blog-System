# myapp/views.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from User.models import *
import os
from User.serializers import *
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.shortcuts import get_object_or_404
from django.utils.text import Truncator
from datetime import datetime
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from google.auth.transport.requests import Request
from google.oauth2 import service_account

from datetime import datetime, timedelta


class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            username = serializer.validated_data['username']
            user = CustomUser.objects.get(username=username)
            refresh = RefreshToken.for_user(user)
            access = str(refresh.access_token)
            return Response({'access': access, "refresh": str(refresh), "id": user.id})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class SignupView(APIView):
    def post(self, request):
        serializer = SignupSerializer(data=request.data)
        first_name = request.data.get('firstName')
        last_name = request.data.get('lastName')
        image = request.FILES.get('profile_photo')
        type = request.data.get('type')
        address = request.data.get('address')
        email = request.data.get('email')
        if serializer.is_valid():
            user = CustomUser.objects.create_user(**serializer.validated_data)
            if first_name:
                user.first_name = first_name
            if last_name:
                user.last_name = last_name
            if email:
                user.email = email
            if image:
                user.profile_picture = image
            if type:
                user.user_type = type
            if address:
                user.address = address
            user.save()
            return Response({"message": "User Created Successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserDataView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    def get(self, request):
        user_id = request.query_params.get('id') 
        try:
            user = CustomUser.objects.get(id=user_id)
        except CustomUser.DoesNotExist:
            return Response({"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)

class BlogView(APIView):
    def get(self, request):
        id=request.query_params.get('id')
        if id:
            blog=Blog.objects.filter(doctor=get_object_or_404(CustomUser,id=id))
            return Response(BlogExpandedSerializer(instance=blog,many=True).data,status=status.HTTP_201_CREATED)
        blog=Blog.objects.filter(upload=True)
        return Response(BlogExpandedSerializer(instance=blog,many=True).data,status=status.HTTP_201_CREATED)

class CreateBlog(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    def post(self, request):
        id = request.query_params.get('id')
        title=request.data.get('title','')
        image=request.data.get('image')
        category=request.data.get('category','')
        raw_summary=request.data.get('summary','')
        content=request.data.get('content','')
        upload=request.data.get('upload','false')
        upload_value = True if upload.lower() == 'true' else False
        if not id:
            return Response({"error": "id is required"}, status=status.HTTP_400_BAD_REQUEST)  # Correct the status code
        summary = Truncator(raw_summary).words(15, html=False, truncate='...')
        blog = Blog(title=title,image=image,category=category,summary=summary,content=content,upload=upload_value,doctor=get_object_or_404(CustomUser, id=id))
        blog.save()
        return Response({"message": "Blog Created Successfully"}, status=status.HTTP_201_CREATED)

class BlogStateChange(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    def post(self, request):
        id = request.query_params.get('id')
        state=request.query_params.get('state','false')
        state_value = True if state.lower() == 'false' else False
        blog=get_object_or_404(Blog,id=id)
        blog.upload=state_value
        blog.save()
        msj = 'Live' if state_value else 'Drafted'
        return Response({"message": f"Blog has been successfully {msj}"}, status=status.HTTP_201_CREATED)

class GetUser(APIView):
    def get(self, request):
        q=request.query_params.get('q')
        user=[]
        if q=="Patients":
            user=CustomUser.objects.filter(user_type="Patient")
        elif q=="Doctors":
            user=CustomUser.objects.filter(user_type="Doctor")
        elif q=="all":
            user=CustomUser.objects.all()
        else: return Response({"error": "q must be Doctor,Patient,all"}, status=status.HTTP_400_BAD_REQUEST)
        serializer=UserSerializer(instance=user,many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class GetAppointments(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    def get(self, request):
        user=request.user
        upcomming=[]
        if user.user_type=="Doctor":
            upcomming_appointments=Appointment.objects.filter(doctor=user,confirm=False)
            current_appointments=Appointment.objects.filter(doctor=user,confirm=True)
            upcomming=AppointmentSerializer(instance=upcomming_appointments,many=True).data
            current=AppointmentSerializer(instance=current_appointments,many=True).data
        else:
            current_appointments=Appointment.objects.filter(patient=user,confirm=True)
            current=AppointmentSerializer(instance=current_appointments,many=True).data
        return Response({"upcomming":upcomming,"current":current},status=status.HTTP_200_OK)
    

class CreateAppointment(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    def post(self, request):
        patient=request.user
        if patient.user_type=='Doctor':return Response({"error":"Doctor cannot able to create appointment"},status=status.HTTP_400_BAD_REQUEST)
        id = request.data.get('id')
        doctor =get_object_or_404(CustomUser,id=id)
        if doctor.user_type=='Patient':return Response({"error":"only doctors are acceptable"},status=status.HTTP_400_BAD_REQUEST)
        speciality=request.data.get('speciality','Confidential')
        date=request.data.get('date',datetime.now().date())
        time=request.data.get('time',datetime.now().date())
        Appointment.objects.create(doctor=doctor,patient=patient,speciality=speciality,date=date,time=time)
        return Response({"message":"Appointment successfully created"},status=status.HTTP_200_OK)

class HandleAppointment(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    def post(self, request):
        doctor = request.user
        id = request.query_params.get('id')
        action = request.query_params.get('action')
        if not id or not action:
            return Response({"error": "'id' and 'action' are required in the query parameters"}, status=status.HTTP_400_BAD_REQUEST)
        appointment = get_object_or_404(Appointment, id=id)
        if appointment.doctor != doctor:
            return Response({"error": "Unauthorized: This is not your appointment"}, status=status.HTTP_400_BAD_REQUEST)
        if action == "yes":
            appointment.confirm = True
            appointment.save()
            success = self.create_google_calendar_event(appointment)
            if not success:
                return Response({"error": "Failed to create Google Calendar event"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            return Response({"message": "Successfully Accepted the appointment"}, status=status.HTTP_200_OK)
        else:
            appointment.delete()
            return Response({"message": "Successfully Rejected the appointment"}, status=status.HTTP_200_OK)

    def create_google_calendar_event(self, appointment):
        
        try:
            credentials = self.get_credentials()
            service = build('calendar', 'v3', credentials=credentials)
            event = {
                'summary': 'Appointment with ' + appointment.patient.first_name,
                'description': 'Appointment details'+ appointment.speciality,
                'start': {
                    'dateTime': datetime.combine(appointment.date, appointment.time).isoformat(),
                    'timeZone': 'UTC',
                },
                'end': {
                    'dateTime': (datetime.combine(appointment.date, appointment.time) + timedelta(minutes=45)).isoformat(),
                    'timeZone': 'UTC',
                },
            }
            response =service.events().insert(calendarId='', body=event).execute() # can find the calender id in calender.google website
            print(response)
            return True
        except Exception as e:
            print(f"Error creating Google Calendar event: {e}")
            return False
    def get_credentials(self):
        current_directory = os.path.dirname(os.path.abspath(__file__))
        credentials_path = os.path.join(current_directory, 'shining-grid-xxxxxx-xxxxxxxxxxxx.json') # copy your file name 

        credentials = service_account.Credentials.from_service_account_file(
            credentials_path,
            scopes=['https://www.googleapis.com/auth/calendar.events']
        )

        if not credentials.valid:
            try:
                credentials.refresh(Request())
            except Exception as e:
                print(f"Error refreshing credentials: {e}")

        return credentials

