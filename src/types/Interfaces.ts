export interface UserData {  // Renamed from User to avoid conflicts
  id: number;
  name: string;
  email: string;
  imageFilename?: string;
  dogs: Dog[];
  birthdate: string;
  score: number;
  description?: string;
}

export interface Dog {
  id: number;
  name: string;
  race: string;
  image?: string;
  user: string; 
}

