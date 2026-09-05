/**
 * TrueSight — TypeScript Types: User
 * Represents authenticated users and their profiles.
 */

export interface UserProfile {
  id: string;
  displayName: string | null;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

/** The minimal user object available from Supabase Auth. */
export interface AuthUser {
  id: string;
  email: string | null;
  createdAt: string;
}

/** Combined user + profile for use throughout the app. */
export interface User extends AuthUser {
  profile: UserProfile | null;
}
