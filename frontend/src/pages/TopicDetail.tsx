import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'

export default function TopicDetail() {
    const { slug } = useParams()
    const [topic, setTopic] = useState<any>(null)

    useEffect(() => {
        fetch(`/api/topics/${slug}/`)
            .then(res => res.json())
            .then(data => setTopic(data))
    }, [slug])

    if (!topic) return <div>Loading...</div>

    return (
        <div>
            <Link to="/" style={{ color: 'var(--text-secondary)', marginBottom: '24px', display: 'inline-block' }}>← Back to Topics</Link>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
                <span style={{ fontSize: '3rem' }}>{topic.icon}</span>
                <h1 className="page-title" style={{ marginBottom: 0 }}>{topic.name}</h1>
            </div>
            <p className="page-subtitle" style={{ maxWidth: '600px' }}>{topic.description}</p>

            <h2 style={{ fontSize: '1.5rem', marginBottom: '24px' }}>Courses</h2>
            <div className="grid">
                {topic.courses.map((c: any) => (
                    <Link key={c.slug} to={`/courses/${c.slug}`} className="card">
                        <h3 className="card-title">{c.title}</h3>
                        <p className="card-desc">{c.description}</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                            <span>{c.lesson_count} lessons</span>
                            <span style={{ color: 'var(--accent)' }}>Start course →</span>
                        </div>
                    </Link>
                ))}
                {topic.courses.length === 0 && <div style={{ color: 'var(--text-secondary)' }}>No courses published yet.</div>}
            </div>
        </div>
    )
}
