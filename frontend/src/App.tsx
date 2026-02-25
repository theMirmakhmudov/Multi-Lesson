import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Topics from './pages/Topics'
import TopicDetail from './pages/TopicDetail'
import CourseDetail from './pages/CourseDetail'
import LessonDetail from './pages/LessonDetail'

function App() {
    return (
        <BrowserRouter>
            <nav className="blog-nav">
                <Link to="/" className="blog-logo">Multi Lesson</Link>
                <div className="nav-links">
                    <Link to="/">Topics</Link>
                    {/* Always link to Multi ID for auth/profile */}
                    <a href={`${import.meta.env.VITE_MULTI_ID_URL || 'https://id.multi.co.uz'}/profile`}>Multi ID Account</a>
                </div>
            </nav>

            <div className="container">
                <Routes>
                    <Route path="/" element={<Topics />} />
                    <Route path="/topics/:slug" element={<TopicDetail />} />
                    <Route path="/courses/:slug" element={<CourseDetail />} />
                    <Route path="/lessons/:slug" element={<LessonDetail />} />
                </Routes>
            </div>
        </BrowserRouter>
    )
}

export default App
