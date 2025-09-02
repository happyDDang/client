const BASE_URL = 'https://happy-ddang.derek-94.deno.net/'; // API 기본 URL (필요 시 변경)

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
    console.log('API Request:', `${BASE_URL}${endpoint}`, config);
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    console.log('API Response:', response.status, response.headers);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(
        `HTTP error! status: ${response.status}, response: ${errorText}`
      );
    }
    const data = await response.json();
    console.log('API Success Data:', data);
    return data;
  } catch (error) {
    console.error('API 요청 중 오류 발생:', error.message);
    console.error('Full error:', error);
    throw error;
  }
};

export const checkNickname = (data) => request(`member`, 'POST', data);

export const registerRanking = (data) => request(`rank`, 'POST', data);

export const fetchRankings = (memberNo, topRankSize) =>
  request(`rank?member_no=${memberNo}&top_rank_size=${topRankSize}`, 'GET');
