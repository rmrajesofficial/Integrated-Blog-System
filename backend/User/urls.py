from django.urls import path
from .views import *

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('signup/', SignupView.as_view(), name='signup'),
    path('user/', UserDataView.as_view(), name='user'),
    path('createblog/', CreateBlog.as_view(), name='create blog'),
    path('blog/', BlogView.as_view(), name='blod view '),
    path('blogchange/', BlogStateChange.as_view(), name='block status'),
    path('getuser/', GetUser.as_view(), name='get user'),
    path('createappointment/', CreateAppointment.as_view(), name='create appointment'),
    path('getappointments/', GetAppointments.as_view(), name='get appointment'),
    path('handle/', HandleAppointment.as_view(), name='handle appointment'),
]
