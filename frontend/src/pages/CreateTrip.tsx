import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './CreateTrip.css';

interface Destination {
  id: number;
  name: string;
  location: string;
}

const CreateTrip: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedDestinations, setSelectedDestinations] = useState<number[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchDestinations();
  }, [isAuthenticated, navigate]);

  const fetchDestinations = async () => {
    try {
      const response = await api.get('/destinations');
      setDestinations(response.data.destinations);
    } catch (error) {
      console.error('Failed to fetch destinations:', error);
    }
  };

  const handleDestinationToggle = (id: number) => {
    setSelectedDestinations((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/trips', {
        title,
        description,
        start_date: startDate,
        end_date: endDate,
        destinations: selectedDestinations,
      });
      navigate('/trips');
    } catch (err: any) {
      setError(err.response?.data?.error || '여행 일정 생성에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="create-trip">
      <h1>새 여행 만들기</h1>
      
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="trip-form">
        <div className="form-group">
          <label className="form-label">여행 제목 *</label>
          <input
            type="text"
            className="form-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">설명</label>
          <textarea
            className="form-textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">시작일 *</label>
            <input
              type="date"
              className="form-input"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">종료일 *</label>
            <input
              type="date"
              className="form-input"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">여행지 선택</label>
          <div className="destinations-select">
            {destinations.map((destination) => (
              <label key={destination.id} className="destination-checkbox">
                <input
                  type="checkbox"
                  checked={selectedDestinations.includes(destination.id)}
                  onChange={() => handleDestinationToggle(destination.id)}
                />
                <span>
                  {destination.name} ({destination.location})
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate('/trips')}
          >
            취소
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? '생성 중...' : '여행 만들기'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTrip;

