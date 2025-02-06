const BASE_URL = 'http://52.78.219.178:5000/'; // API 기본 URL (필요 시 변경)

const request = async (endpoint, method = 'GET', body = null, headers = {}) => {
  const config = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('API 요청 중 오류 발생:', error.message);
    throw error;
  }
};

export const checkNickname = (nickname) =>
  request(`happydaeng/nickname?nickname=${nickname}`, 'GET');

export const registerRanking = (data) =>
  request(`/happydaeng/rank`, 'POST', data);

export const fetchRankings = (memberNo, topRankSize) =>
  request(
    `happydaeng/rank?member_no=${memberNo}&top_rank_size=${topRankSize}`,
    'GET'
  );
