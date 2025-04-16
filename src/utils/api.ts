// src/utils/api.ts

interface ApiResponse<T> {
    data: T;
    error?: string;
  }
  
  const BASE_URL = 'http://localhost:8000/api'; // Remplace par l'URL de ton API
  
  // Fonction pour faire une requête POST générique
  export const postRequest = async <T>(endpoint: string, body: any): Promise<ApiResponse<T>> => {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/ld+json',
          'Accept': 'application/ld+json',
        },
        body: JSON.stringify(body),
      });
  
    // console.log('Réponse du serveur:', response); 
    
      if (!response.ok) {
        throw new Error('Erreur lors de la requête');
      }
  
      const data = await response.json();
      return { data };
    } catch (error: any) {
      return { data: null as any, error: error.message };
    }
  };
  
  // Fonction pour faire une requête GET générique
  export const getRequest = async <T>(
    endpoint: string,
    headers: Record<string, string> = {}
  ): Promise<ApiResponse<T>> => {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
      });
  
      if (!response.ok) {
        throw new Error("Erreur lors de la requête");
      }
  
      const data = await response.json();
      return { data };
    } catch (error: any) {
      return { data: null as any, error: error.message };
    }
  };

  