import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import './Home.css';

interface Destination {
  id: number;
  name: string;
  description: string;
  location: string;
  category: string;
  image_url: string;
  rating: number;
}

const Home: React.FC = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    try {
      const response = await api.get('/destinations?limit=6');
      setDestinations(response.data.destinations);
    } catch (error) {
      console.error('Failed to fetch destinations:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home">
      <section className="hero">
        <h1>여행을 더 특별하게</h1>
        <p>Triple과 함께 새로운 여행 경험을 시작하세요</p>
        <Link to="/destinations" className="btn btn-primary">
          여행지 둘러보기
        </Link>
      </section>

      <section className="featured-destinations">
        <h2>추천 여행지</h2>
        {loading ? (
          <p>로딩 중...</p>
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
      </section>
    </div>
  );
};

export default Home;

