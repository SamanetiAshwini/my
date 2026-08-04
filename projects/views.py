from django.shortcuts import render
from .models import Project

def home(request):
    projects = Project.objects.all().order_by('-created_at')
    for project in projects:
        project.tech_list = [t.strip() for t in project.technology.split(',')]
        project.description_bullets = [line.strip() for line in project.description.split('\n') if line.strip()]
    return render(request, 'projects/index.html', {'projects': projects})