export interface IUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'developer' | 'tester';
  photoURL?: string;
  createdAt: string;
} 