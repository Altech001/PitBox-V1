const BASE_URL = 'https://mintos-vd.vercel.app';

export interface MovieRequest {
  name: string;
  reason: string;
}

export interface MovieRequestResponse extends MovieRequest {
  id: number;
  created_at: string;
}

export const requestsApi = {
  requestMovie: async (data: MovieRequest): Promise<MovieRequestResponse> => {
    const response = await fetch(`${BASE_URL}/request_movie`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `Failed to request movie: ${response.status}`);
    }

    return response.json();
  },

  getAllRequests: async (limit = 100, skip = 0): Promise<MovieRequestResponse[]> => {
    const response = await fetch(`${BASE_URL}/request_movies?limit=${limit}&skip=${skip}`, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `Failed to fetch requests: ${response.status}`);
    }

    const data = await response.json();
    // Sort by created_at descending (latest first)
    return data.sort((a: MovieRequestResponse, b: MovieRequestResponse) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  },
};
