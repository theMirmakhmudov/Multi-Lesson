import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export default function Topics() {
    const [topics, setTopics] = useState<any[]>([])

    useEffect(() => {
        fetch('/api/topics/')
            .then(res => res.json())
            .then(data => setTopics(data))
    }, [])

    return (
        <div>
            <h1 className="page-title">Explore Topics</h1>
            <p className="page-subtitle">Master new skills with structured video courses.</p>

            <div className="grid">
                {topics.map(t => (
                    <Link key={t.slug} to={`/topics/${t.slug}`} className="card">
                        <div className="card-icon">{t.icon}</div>
                        <h2 className="card-title">{t.name}</h2>
                        <p className="card-desc">{t.description}</p>
                        <div style={{ marginTop: '16px', fontSize: '0.85rem', color: 'var(--accent)' }}>
                            {t.course_count} courses available →
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}
