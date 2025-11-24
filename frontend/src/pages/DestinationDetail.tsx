import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import './DestinationDetail.css';

interface Destination {
  id: number;
  name: string;
  description: string;
  location: string;
  category: string;
  image_url: string;
  latitude: number;
  longitude: number;
  rating: number;
}

const DestinationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [destination, setDestination] = useState<Destination | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDestination();
  }, [id]);

  const fetchDestination = async () => {
    try {
      const response = await api.get(`/destinations/${id}`);
      setDestination(response.data.destination);
    } catch (error) {
      console.error('Failed to fetch destination:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (!destination) {
    return <div>여행지를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="destination-detail">
      <Link to="/destinations" className="back-link">← 목록으로</Link>
      
      <div className="destination-header">
        <div className="destination-image-large">
          <img src={destination.image_url || '/placeholder.jpg'} alt={destination.name} />
        </div>
        <div className="destination-header-info">
          <h1>{destination.name}</h1>
          <p className="destination-location">📍 {destination.location}</p>
          <p className="destination-category">카테고리: {destination.category}</p>
          <div className="destination-rating-large">
            ⭐ {destination.rating}
          </div>
        </div>
      </div>

      <div className="card">
        <h2>상세 정보</h2>
        <p className="destination-description-full">{destination.description}</p>
        
        {destination.latitude && destination.longitude && (
          <div className="destination-map">
            <p>위치: {destination.latitude}, {destination.longitude}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DestinationDetail;

