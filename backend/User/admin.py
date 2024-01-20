from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import *

class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_active', 'user_type', 'address')
    list_filter = ('user_type',)
    fieldsets = UserAdmin.fieldsets + (
        ('Custom Fields', {'fields': ('profile_picture', 'user_type', 'address')}),
    )

admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(Blog)
