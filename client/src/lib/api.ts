import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Hacker {
  id: number;
  name: string;
  skills: string[];
  hackathon_experience: number;
  bio: string;
}

export interface Hackathon {
  _id: string;
  name: string;
  description: string;
  date: string; // ISO
  organizer: string;
  createdBy: string;
}

export interface UserPublic {
  _id: string;
  name: string;
  email: string;
  skills: string[];
  skillLevel: 'Beginner' | 'Intermediate' | 'Pro';
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface HackersResponse {
  message: string;
  hackers: Hacker[];
}

export interface HackathonsResponse {
  hackathons: Hackathon[];
}

export interface UsersResponse {
  users: UserPublic[];
}

// Auth API
export const authAPI = {
  signup: async (name: string, email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/signup', { name, email, password });
    return response.data;
  },
  
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
};

// Hackers API
export const hackersAPI = {
  getHackers: async (): Promise<HackersResponse> => {
    const response = await api.get('/hackers');
    return response.data;
  },
};

export const hackathonsAPI = {
  list: async (): Promise<HackathonsResponse> => {
    const response = await api.get('/hackathons');
    return response.data;
  },
  create: async (payload: { name: string; description: string; date: string; organizer: string; }) => {
    const response = await api.post('/hackathons', payload);
    return response.data as { message: string; hackathon: Hackathon };
  },
  enroll: async (hackathonId: string) => {
    const response = await api.post('/hackathons/enroll', { hackathonId });
    return response.data as { message: string };
  },
  myStats: async () => {
    const response = await api.get('/hackathons/stats/me');
    return response.data as { createdCount: number; joinedCount: number };
  }
};

export const usersAPI = {
  list: async (): Promise<UsersResponse> => {
    const response = await api.get('/users');
    return response.data;
  },
  updateMySkills: async (payload: { skills: string[]; skillLevel: 'Beginner' | 'Intermediate' | 'Pro'; }) => {
    const response = await api.put('/users/me/skills', payload);
    return response.data as { message: string; user: UserPublic };
  },
  me: async () => {
    const response = await api.get('/users/me');
    return response.data as { user: UserPublic };
  },
  all: async () => {
    const response = await api.get('/users/all');
    return response.data as { users: UserPublic[] };
  },
  patchUpdateSkills: async (payload: { skills?: string[]; skillLevel?: 'Beginner' | 'Intermediate' | 'Pro'; }) => {
    const response = await api.patch('/users/updateSkills', payload);
    return response.data as { message: string; user: UserPublic };
  },
  patchUpdateSkillLevel: async (skillLevel: 'Beginner' | 'Intermediate' | 'Pro') => {
    const response = await api.patch('/users/updateSkillLevel', { skillLevel });
    return response.data as { message: string; user: UserPublic };
  },
  sendConnection: async (toUserId: string) => {
    const response = await api.post('/users/connections', { toUserId });
    return response.data as { message: string };
  }
};

export default api;
