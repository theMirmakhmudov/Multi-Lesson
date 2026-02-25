import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'

export default function CourseDetail() {
    const { slug } = useParams()
    const [course, setCourse] = useState<any>(null)

    useEffect(() => {
        fetch(`/api/courses/${slug}/`)
            .then(res => res.json())
            .then(data => setCourse(data))
    }, [slug])

    if (!course) return <div>Loading...</div>

    return (
        <div>
            <h1 className="page-title">{course.title}</h1>
            <p className="page-subtitle" style={{ maxWidth: '800px' }}>{course.description}</p>

            <div style={{ display: 'flex', gap: '32px' }}>
                <div style={{ flex: 1 }}>
                    <h2 style={{ fontSize: '1.4rem', marginBottom: '16px' }}>Course Lessons</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {course.lessons?.map((l: any, idx: number) => (
                            <Link
                                key={l.slug}
                                to={`/lessons/${l.slug}`}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '16px 24px',
                                    background: 'var(--panel-bg)',
                                    border: '1px solid var(--border)',
                                    borderRadius: '8px',
                                    textDecoration: 'none',
                                    color: 'inherit',
                                    transition: 'background 0.2s',
                                    gap: '16px'
                                }}
                            >
                                <div style={{
                                    width: '32px', height: '32px',
                                    borderRadius: '50%', background: 'rgba(255,255,255,0.1)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontWeight: 600, fontSize: '0.9rem'
                                }}>
                                    {idx + 1}
                                </div>
                                <div style={{ flex: 1, fontWeight: 500 }}>{l.title}</div>
                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                    {Math.floor((l.duration_seconds || 0) / 60)} min
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                <div style={{ width: '300px' }}>
                    <div className="card">
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>About Course</h3>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                            📚 {course.lesson_count} lessons
                        </div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
                            ⏱ {Math.floor(course.total_duration / 60)} total minutes
                        </div>
                        <Link to={`/lessons/${course.lessons?.[0]?.slug}`} className="btn-primary" style={{ display: 'block', textAlign: 'center', textDecoration: 'none', background: 'var(--accent)', color: '#fff', padding: '12px', borderRadius: '6px', fontWeight: 600 }}>
                            Start Learning
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
