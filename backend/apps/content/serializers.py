from rest_framework import serializers
from .models import Topic, Course, Lesson, Article, LessonProgress


class LessonSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = ('slug', 'title', 'duration_seconds', 'order', 'is_free')


class CourseSerializer(serializers.ModelSerializer):
    lessons = LessonSummarySerializer(many=True, read_only=True, source='lessons.filter')
    lesson_count = serializers.IntegerField(read_only=True)
    total_duration = serializers.IntegerField(read_only=True)

    class Meta:
        model = Course
        fields = ('slug', 'title', 'description', 'thumbnail', 'order',
                  'lesson_count', 'total_duration', 'lessons')


class CourseSummarySerializer(serializers.ModelSerializer):
    lesson_count = serializers.IntegerField(read_only=True)
    total_duration = serializers.IntegerField(read_only=True)

    class Meta:
        model = Course
        fields = ('slug', 'title', 'description', 'thumbnail', 'order',
                  'lesson_count', 'total_duration')


class TopicSerializer(serializers.ModelSerializer):
    courses = CourseSummarySerializer(many=True, read_only=True)

    class Meta:
        model = Topic
        fields = ('slug', 'name', 'icon', 'description', 'order', 'courses')


class TopicSummarySerializer(serializers.ModelSerializer):
    course_count = serializers.SerializerMethodField()

    class Meta:
        model = Topic
        fields = ('slug', 'name', 'icon', 'description', 'course_count')

    def get_course_count(self, obj):
        return obj.courses.filter(is_published=True).count()


class LessonDetailSerializer(serializers.ModelSerializer):
    course_title = serializers.CharField(source='course.title', read_only=True)
    course_slug = serializers.CharField(source='course.slug', read_only=True)

    class Meta:
        model = Lesson
        fields = ('slug', 'title', 'video_url', 'content_md', 'duration_seconds',
                  'order', 'is_free', 'course_title', 'course_slug')


class LessonProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = LessonProgress
        fields = ('lesson', 'completed', 'watched_seconds', 'completed_at')
        read_only_fields = ('completed_at',)
