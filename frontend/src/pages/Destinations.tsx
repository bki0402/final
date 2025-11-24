import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import './Destinations.css';

interface Destination {
  id: number;
  name: string;
  description: string;
  location: string;
  category: string;
  image_url: string;
  rating: number;
}

const Destinations: React.FC = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    if (searchQuery) {
      searchDestinations();
    } else {
      fetchDestinations();
    }
  }, [category]);

  const fetchDestinations = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (category) params.category = category;
      const response = await api.get('/destinations', { params });
      setDestinations(response.data.destinations);
    } catch (error) {
      console.error('Failed to fetch destinations:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchDestinations = async () => {
    if (!searchQuery.trim()) {
      fetchDestinations();
      return;
    }
    try {
      setLoading(true);
      const response = await api.get(`/destinations/search?q=${encodeURIComponent(searchQuery)}`);
      setDestinations(response.data.destinations);
    } catch (error) {
      console.error('Failed to search destinations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchDestinations();
  };

  return (
    <div className="destinations">
      <h1>여행지 탐색</h1>
      
      <div className="search-filters">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            className="search-input"
            placeholder="여행지 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">검색</button>
        </form>
        
        <div className="category-filters">
          <button
            className={`category-btn ${category === '' ? 'active' : ''}`}
            onClick={() => setCategory('')}
          >
            전체
          </button>
          <button
            className={`category-btn ${category === '자연' ? 'active' : ''}`}
            onClick={() => setCategory('자연')}
          >
            자연
          </button>
          <button
            className={`category-btn ${category === '해변' ? 'active' : ''}`}
            onClick={() => setCategory('해변')}
          >
            해변
          </button>
          <button
            className={`category-btn ${category === '역사' ? 'active' : ''}`}
            onClick={() => setCategory('역사')}
          >
            역사
          </button>
          <button
            className={`category-btn ${category === '문화' ? 'active' : ''}`}
            onClick={() => setCategory('문화')}
          >
            문화
          </button>
          <button
            className={`category-btn ${category === '랜드마크' ? 'active' : ''}`}
            onClick={() => setCategory('랜드마크')}
          >
            랜드마크
          </button>
        </div>
      </div>

      {loading ? (
        <p>로딩 중...</p>
      ) : destinations.length === 0 ? (
        <p>여행지를 찾을 수 없습니다.</p>
      ) : (
        <div className="grid grid-3">
          {destinations.map((destination) => (
            <Link
              key={destination.id}
              to={`/destinations/${destination.id}`}
              className="destination-card"
            >
              <div className="destination-image">
                <img src={destination.image_url || '/placeholder.jpg'} alt={destination.name} />
              </div>
              <div className="destination-info">
                <h3>{destination.name}</h3>
                <p className="destination-location">{destination.location}</p>
                <p className="destination-description">{destination.description}</p>
                <div className="destination-rating">
                  ⭐ {destination.rating}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Destinations;

