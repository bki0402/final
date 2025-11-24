-- 사용자 테이블
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 여행지 테이블
CREATE TABLE IF NOT EXISTS destinations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    image_url TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    rating DECIMAL(3, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 여행 일정 테이블
CREATE TABLE IF NOT EXISTS trips (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    destinations JSONB DEFAULT '[]',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_trips_user_id ON trips(user_id);
CREATE INDEX IF NOT EXISTS idx_destinations_category ON destinations(category);
CREATE INDEX IF NOT EXISTS idx_destinations_location ON destinations(location);

-- 샘플 데이터 삽입
INSERT INTO destinations (name, description, location, category, image_url, latitude, longitude, rating) VALUES
('제주도', '한국의 아름다운 섬, 푸른 바다와 한라산이 있는 관광지', '제주특별자치도', '자연', 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800', 33.4996, 126.5312, 4.8),
('부산 해운대', '아름다운 해변과 바다를 즐길 수 있는 관광지', '부산광역시', '해변', 'https://images.unsplash.com/photo-1539650116574-75c0c6d73a6e?w=800', 35.1587, 129.1604, 4.7),
('경복궁', '조선왕조의 대표적인 궁궐', '서울특별시', '역사', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800', 37.5796, 126.9770, 4.6),
('남산타워', '서울의 랜드마크, 전망대와 레스토랑', '서울특별시', '랜드마크', 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=800', 37.5512, 126.9882, 4.5),
('설악산', '한국의 대표적인 산, 등산과 자연을 즐길 수 있는 곳', '강원도', '자연', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', 38.1217, 128.4656, 4.7),
('한옥마을', '전통 한옥을 체험할 수 있는 문화 공간', '전주시', '문화', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800', 35.8167, 127.1500, 4.4),
('경주 불국사', '신라시대의 대표적인 사찰', '경주시', '역사', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800', 35.7894, 129.3318, 4.6),
('여수 엑스포', '바다를 배경으로 한 국제 박람회장', '여수시', '랜드마크', 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=800', 34.7604, 127.7622, 4.5)
ON CONFLICT DO NOTHING;

