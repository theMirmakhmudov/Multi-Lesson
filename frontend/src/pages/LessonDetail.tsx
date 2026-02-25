import { useEffect, useState, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'

export default function LessonDetail() {
    const { slug } = useParams()
    const [lesson, setLesson] = useState<any>(null)
    const [progress, setProgress] = useState<any>(null)

    useEffect(() => {
        fetch(`/api/lessons/${slug}/`)
            .then(res => res.json())
            .then(data => setLesson(data))

        const token = localStorage.getItem('multi_access')
        if (token) {
            fetch(`/api/lessons/${slug}/progress/`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
                .then(res => res.json())
                .then(data => setProgress(data))
        }
    }, [slug])

    const markCompleted = async () => {
        const token = localStorage.getItem('multi_access')
        if (!token) return alert('Please sign in to save progress')

        const res = await fetch(`/api/lessons/${slug}/progress/`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ completed: true })
        })
        const data = await res.json()
        setProgress(data)
    }

    if (!lesson) return <div>Loading...</div>

    // Create embed URL for YouTube
    const getEmbedUrl = (url: string) => {
        if (!url) return ''
        if (url.includes('youtube.com/watch?v=')) {
            return url.replace('watch?v=', 'embed/')
        }
        if (url.includes('youtu.be/')) {
            return url.replace('youtu.be/', 'youtube.com/embed/')
        }
        return url
    }

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <Link to={`/courses/${lesson.course_slug}`} style={{ color: 'var(--text-secondary)', marginBottom: '16px', display: 'inline-block' }}>
                ← Back to {lesson.course_title}
            </Link>

            <h1 className="page-title">{lesson.title}</h1>

            {lesson.video_url && (
                <div className="video-wrapper">
                    <iframe
                        src={getEmbedUrl(lesson.video_url)}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', paddingBottom: '24px', borderBottom: '1px solid var(--border)' }}>
                <div>
                    {progress?.completed ? (
                        <span style={{ color: '#00ff41', fontWeight: 500, background: 'rgba(0,255,65,0.1)', padding: '6px 12px', borderRadius: '4px', fontSize: '0.9rem' }}>
                            ✓ Completed
                        </span>
                    ) : (
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>In progress...</span>
                    )}
                </div>
                <button
                    onClick={markCompleted}
                    disabled={progress?.completed}
                    style={{
                        background: progress?.completed ? 'var(--panel-bg)' : 'var(--accent)',
                        color: progress?.completed ? 'var(--text-secondary)' : '#fff',
                        border: 'none', padding: '10px 20px', borderRadius: '6px', fontWeight: 600, cursor: progress?.completed ? 'default' : 'pointer'
                    }}
                >
                    {progress?.completed ? 'Marked as Complete' : 'Mark as Complete'}
                </button>
            </div>

            <div className="markdown-content">
                {/* Simple mock render of Markdown for now */}
                {lesson.content_md ? (
                    <div dangerouslySetInnerHTML={{
                        __html: lesson.content_md
                            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
                            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
                            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
                            .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
                            .replace(/\n$/gim, '<br />')
                            .replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>')
                            .replace(/\[(.*?)\]\((.*?)\)/gim, "<a href='$2'>$1</a>")
                    }} />
                ) : (
                    <p style={{ color: 'var(--text-secondary)' }}>No additional notes for this lesson.</p>
                )}
            </div>
        </div>
    )
}
