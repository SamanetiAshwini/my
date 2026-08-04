from django.db import migrations

def populate_projects(apps, schema_editor):
    Project = apps.get_model('projects', 'Project')
    
    # SMRITI Project
    Project.objects.get_or_create(
        title="SMRITI – AI-Powered College Assistant Robot",
        description="Developing an AI-powered assistant robot for college environments with a focus on human–AI interaction. Implementing face recognition and facial emotion detection using computer vision techniques. Integrating conversational AI using ChatGPT API for intelligent, context-aware responses. Designing wake-word activation and polite interaction logic for department-level assistance. Following a structured AI project lifecycle including problem definition, system integration, testing, and documentation.",
        technology="Python, OpenCV, Speech Recognition, Text-to-Speech, ChatGPT API, Raspberry Pi",
        github_link="https://github.com/SamanetiAshwini",
        live_demo=""
    )
    
    # SentiBeats Project
    Project.objects.get_or_create(
        title="SentiBeats – Smart Facial Expression Analysis for Dynamic Playlists",
        description="Developed a real-time Python application that detects facial emotions using computer vision and dynamically recommends playlists. Implemented webcam-based face detection and emotion recognition to personalize playlist selection dynamically. Created a voice assistant for hands-free song control and feedback collection to improve future suggestions. Applied ResNet-based CNN for high-accuracy emotion classification and integrated playlist switching logic based on mood and age group.",
        technology="Python, OpenCV, ResNet, TensorFlow, Flask, Mediapipe, YouTube API",
        github_link="https://github.com/SamanetiAshwini",
        live_demo=""
    )

def remove_projects(apps, schema_editor):
    Project = apps.get_model('projects', 'Project')
    Project.objects.filter(title__in=[
        "SMRITI – AI-Powered College Assistant Robot",
        "SentiBeats – Smart Facial Expression Analysis for Dynamic Playlists"
    ]).delete()

class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0002_project_delete_projects'),
    ]

    operations = [
        migrations.RunPython(populate_projects, remove_projects),
    ]
