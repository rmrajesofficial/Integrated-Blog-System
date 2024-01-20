# myapp/views.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from User.models import *
from User.serializers import *
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.shortcuts import get_object_or_404
from django.utils.text import Truncator



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