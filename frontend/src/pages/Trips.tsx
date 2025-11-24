import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './Trips.css';

interface Trip {
  id: number;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  destinations: any[];
  created_at: string;
}

const Trips: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchTrips();
  }, [isAuthenticated, navigate]);

  const fetchTrips = async () => {
    try {
      const response = await api.get('/trips');
      setTrips(response.data.trips);
    } catch (error) {
      console.error('Failed to fetch trips:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="trips">
      <div className="trips-header">
        <h1>내 여행 일정</h1>
        <Link to="/trips/new" className="btn btn-primary">
          새 여행 만들기
        </Link>
      </div>

      {loading ? (
        <p>로딩 중...</p>
      ) : trips.length === 0 ? (
        <div className="empty-state">
          <p>아직 여행 일정이 없습니다.</p>
          <Link to="/trips/new" className="btn btn-primary">
            첫 여행 만들기
          </Link>
        </div>
      ) : (
        <div className="trips-list">
          {trips.map((trip) => (
            <Link key={trip.id} to={`/trips/${trip.id}`} className="trip-card">
              <h3>{trip.title}</h3>
              {trip.description && <p className="trip-description">{trip.description}</p>}
              <div className="trip-dates">
                <span>📅 {new Date(trip.start_date).toLocaleDateString('ko-KR')}</span>
                <span> → </span>
                <span>{new Date(trip.end_date).toLocaleDateString('ko-KR')}</span>
              </div>
              {trip.destinations && Array.isArray(trip.destinations) && trip.destinations.length > 0 && (
                <div className="trip-destinations">
                  여행지: {trip.destinations.length}개
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Trips;

