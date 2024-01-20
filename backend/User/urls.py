from django.urls import path
from .views import *

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('signup/', SignupView.as_view(), name='signup'),
    path('user/', UserDataView.as_view(), name='user'),
    path('createblog/', CreateBlog.as_view(), name='create blog'),
    path('blog/', BlogView.as_view(), name='blod view '),
    path('blogchange/', BlogStateChange.as_view(), name='block status')
]
