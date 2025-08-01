// API Response Types based on your Rails backend

export interface User {
  id: number;
  email: string;
  provider: string;
  uid: string;
  allow_password_change: boolean;
  created_at: string;
  updated_at: string;
}

export interface Admin {
  id: number;
  email: string;
  provider: string;
  uid: string;
  allow_password_change: boolean;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: number;
  first_name: string;
  last_name: string;
  phone_number: string;
  passport: string;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Tour {
  id: number;
  name: string;
  description: string;
  duration: number;
  category_id: number;
  admin_id: number;
  created_at: string;
  updated_at: string;
  category?: Category;
  tour_dates?: TourDate[];
  prices?: Price[];
  destinations?: Destination[];
  activities?: Activity[];
  reviews?: Review[];
}

export interface TourDate {
  id: number;
  start_date: string;
  end_date: string;
  tour_id: number;
  created_at: string;
  updated_at: string;
}

export interface Price {
  id: number;
  amount: string;
  currency: string;
  tour_id: number;
  created_at: string;
  updated_at: string;
}

export interface Destination {
  id: number;
  name: string;
  description?: string;
  tour_id: number;
  created_at: string;
  updated_at: string;
}

export interface Activity {
  id: number;
  name: string;
  description?: string;
  tour_id: number;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: number;
  user_id: number;
  tour_id: number;
  booking_status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  booking_date: string;
  total_amount?: string;
  created_at: string;
  updated_at: string;
  tour?: Tour;
  user?: User;
}

export interface Review {
  id: number;
  rating: number;
  review_text: string;
  tour_id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
  tour?: Tour;
  user?: User;
}

export interface Cancellation {
  id: number;
  booking_id: number;
  reason?: string;
  cancellation_date: string;
  refund_amount?: string;
  created_at: string;
  updated_at: string;
  booking?: Booking;
}

// Auth Types
export interface AuthTokens {
  'access-token': string;
  client: string;
  uid: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  password_confirmation: string;
}

export interface AuthResponse {
  data: User | Admin;
}

// API Error Types
export interface ApiError {
  errors?: string[];
  error?: string;
  message?: string;
}

// Request/Response Wrappers
export interface ApiResponse<T> {
  data?: T;
  errors?: string[];
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta?: {
    current_page: number;
    per_page: number;
    total_pages: number;
    total_count: number;
  };
}
