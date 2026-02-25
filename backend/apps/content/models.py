from django.db import models
from django.conf import settings


class Topic(models.Model):
    slug = models.SlugField(unique=True)
    name = models.CharField(max_length=100)
    icon = models.CharField(max_length=10, default='📚')
    description = models.TextField(blank=True)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', 'name']

    def __str__(self):
        return self.name


class Course(models.Model):
    topic = models.ForeignKey(Topic, on_delete=models.CASCADE, related_name='courses')
    slug = models.SlugField(unique=True)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    thumbnail = models.ImageField(upload_to='courses/thumbnails/', blank=True, null=True)
    order = models.PositiveIntegerField(default=0)
    is_published = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['topic', 'order']

    def __str__(self):
        return self.title

    @property
    def lesson_count(self):
        return self.lessons.filter(is_published=True).count()

    @property
    def total_duration(self):
        return sum(l.duration_seconds or 0 for l in self.lessons.filter(is_published=True))


class Lesson(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='lessons')
    slug = models.SlugField(unique=True)
    title = models.CharField(max_length=200)
    video_url = models.URLField(blank=True)   # YouTube / Vimeo embed URL
    content_md = models.TextField(blank=True)  # Markdown notes below video
    duration_seconds = models.PositiveIntegerField(null=True, blank=True)
    order = models.PositiveIntegerField(default=0)
    is_free = models.BooleanField(default=True)
    is_published = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['course', 'order']

    def __str__(self):
        return self.title





class LessonProgress(models.Model):
    """Tracks per-user lesson completion — user_id comes from Multi ID JWT."""
    user_id = models.UUIDField()
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='progress')
    completed = models.BooleanField(default=False)
    watched_seconds = models.PositiveIntegerField(default=0)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ('user_id', 'lesson')

    def __str__(self):
        return f'{self.user_id} — {self.lesson.title}'
