from django.urls import path
from . import views

urlpatterns = [
    path('topics/', views.topics_list),
    path('topics/<slug:slug>/', views.topic_detail),
    path('courses/<slug:slug>/', views.course_detail),
    path('lessons/<slug:slug>/', views.lesson_detail),
    path('lessons/<slug:slug>/progress/', views.lesson_progress),

]
