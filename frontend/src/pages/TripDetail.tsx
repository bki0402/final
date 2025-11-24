import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './TripDetail.css';

interface Trip {
  id: number;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  destinations: number[];
  created_at: string;
  updated_at: string;
}

const TripDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [destinations, setDestinations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchTrip();
  }, [id, isAuthenticated, navigate]);

  const fetchTrip = async () => {
    try {
      const response = await api.get(`/trips/${id}`);
      const tripData = response.data.trip;
      setTrip(tripData);

      // 여행지 정보 가져오기
      if (tripData.destinations && Array.isArray(tripData.destinations) && tripData.destinations.length > 0) {
        const destPromises = tripData.destinations.map((destId: number) =>
          api.get(`/destinations/${destId}`).then((res) => res.data.destination)
        );
        const dests = await Promise.all(destPromises);
        setDestinations(dests);
      }
    } catch (error) {
      console.error('Failed to fetch trip:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('정말 이 여행 일정을 삭제하시겠습니까?')) {
      return;
    }

    setDeleting(true);
    try {
      await api.delete(`/trips/${id}`);
      navigate('/trips');
    } catch (error) {
      console.error('Failed to delete trip:', error);
      alert('삭제에 실패했습니다.');
    } finally {
      setDeleting(false);
    }
  };

  if (!isAuthenticated || loading) {
    return <div>로딩 중...</div>;
  }

  if (!trip) {
    return <div>여행 일정을 찾을 수 없습니다.</div>;
  }

  return (
    <div className="trip-detail">
      <Link to="/trips" className="back-link">← 목록으로</Link>

      <div className="trip-header">
        <div>
          <h1>{trip.title}</h1>
          <div className="trip-dates">
            <span>📅 {new Date(trip.start_date).toLocaleDateString('ko-KR')}</span>
            <span> → </span>
            <span>{new Date(trip.end_date).toLocaleDateString('ko-KR')}</span>
          </div>
        </div>
        <button
          onClick={handleDelete}
          className="btn btn-danger"
          disabled={deleting}
        >
          {deleting ? '삭제 중...' : '삭제'}
        </button>
      </div>

      {trip.description && (
        <div className="card">
          <h2>설명</h2>
          <p>{trip.description}</p>
        </div>
      )}

      {destinations.length > 0 && (
        <div className="card">
          <h2>여행지 ({destinations.length}개)</h2>
          <div className="trip-destinations-list">
            {destinations.map((destination) => (
              <Link
                key={destination.id}
                to={`/destinations/${destination.id}`}
                className="trip-destination-item"
              >
                <h3>{destination.name}</h3>
                <p>{destination.location}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TripDetail;

