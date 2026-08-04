from django.contrib import admin
# pyrefly: ignore [missing-import]
from .models import Project

admin.site.register(Project)