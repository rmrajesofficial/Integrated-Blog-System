# myapp/views.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from User.models import CustomUser
from User.serializers import LoginSerializer, SignupSerializer,UserSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication


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
        user_id = request.query_params.get('id')  # Use 'query_params' instead of 'query_param'
        
        try:
            user = CustomUser.objects.get(id=user_id)
        except CustomUser.DoesNotExist:
            return Response({"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)
