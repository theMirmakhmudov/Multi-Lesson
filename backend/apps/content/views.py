from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from django.utils import timezone
from .models import Topic, Course, Lesson, LessonProgress
from .serializers import (TopicSummarySerializer, TopicSerializer, CourseSummarySerializer,
                          CourseSerializer, LessonDetailSerializer, 
                          LessonProgressSerializer)


@api_view(['GET'])
@permission_classes([AllowAny])
def topics_list(request):
    topics = Topic.objects.all()
    return Response(TopicSummarySerializer(topics, many=True).data)


@api_view(['GET'])
@permission_classes([AllowAny])
def topic_detail(request, slug):
    try:
        topic = Topic.objects.get(slug=slug)
    except Topic.DoesNotExist:
        return Response({'error': 'Not found'}, status=404)
    return Response(TopicSerializer(topic).data)


@api_view(['GET'])
@permission_classes([AllowAny])
def course_detail(request, slug):
    try:
        course = Course.objects.prefetch_related('lessons').get(slug=slug, is_published=True)
    except Course.DoesNotExist:
        return Response({'error': 'Not found'}, status=404)
    lessons = course.lessons.filter(is_published=True).order_by('order')
    data = CourseSummarySerializer(course).data
    data['lessons'] = LessonDetailSerializer(lessons, many=True).data
    return Response(data)


@api_view(['GET'])
@permission_classes([AllowAny])
def lesson_detail(request, slug):
    try:
        lesson = Lesson.objects.select_related('course').get(slug=slug, is_published=True)
    except Lesson.DoesNotExist:
        return Response({'error': 'Not found'}, status=404)
    return Response(LessonDetailSerializer(lesson).data)





@api_view(['GET', 'POST'])
def lesson_progress(request, slug):
    """Requires Multi ID authentication."""
    try:
        lesson = Lesson.objects.get(slug=slug)
    except Lesson.DoesNotExist:
        return Response({'error': 'Not found'}, status=404)

    user_id = request.user.id

    if request.method == 'GET':
        try:
            prog = LessonProgress.objects.get(user_id=user_id, lesson=lesson)
            return Response(LessonProgressSerializer(prog).data)
        except LessonProgress.DoesNotExist:
            return Response({'completed': False, 'watched_seconds': 0})

    prog, _ = LessonProgress.objects.get_or_create(user_id=user_id, lesson=lesson)
    prog.watched_seconds = request.data.get('watched_seconds', prog.watched_seconds)
    completed = request.data.get('completed', False)
    if completed and not prog.completed:
        prog.completed = True
        prog.completed_at = timezone.now()
    prog.save()
    return Response(LessonProgressSerializer(prog).data)
