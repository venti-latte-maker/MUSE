import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { RecommendationFeed } from './components/RecommendationFeed';
import { MovieSearch } from './components/MovieSearch';
import { PlaylistDetail } from './pages/PlaylistDetail';

const pageStyle = {
    backgroundColor: '#0a0a0a',
    minHeight: '100vh',
    color: '#ffffff',
    padding: '32px 24px 100px',
    fontFamily: 'sans-serif',
};

function App() {
    return (
        <BrowserRouter>
            <div style={pageStyle}>
                <header style={{ marginBottom: '32px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                        <Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>
                            <h1 style={{ margin: 0, fontSize: '28px' }}>🎬 MovieMusic (Muse)</h1>
                        </Link>

                        <nav style={{ display: 'flex', gap: '12px' }}>
                            <Link
                                to="/"
                                style={{ color: '#fff', textDecoration: 'none', padding: '8px 12px', background: '#141414', borderRadius: '6px' }}
                            >
                                Discover
                            </Link>
                            <Link
                                to="/search"
                                style={{ color: '#fff', textDecoration: 'none', padding: '8px 12px', background: '#141414', borderRadius: '6px' }}
                            >
                                Search
                            </Link>
                        </nav>
                    </div>
                </header>

                <Routes>
                    <Route path="/" element={<RecommendationFeed />} />
                    <Route path="/search" element={<MovieSearch />} />
                    <Route path="/playlist/:id" element={<PlaylistDetail />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
