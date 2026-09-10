import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const API_URL = 'http://localhost:5002/api/uploads';

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  constructor(private http: HttpClient) {}

  uploadThumbnail(courseId: string, file: File) {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(`${API_URL}/courses/${courseId}/thumbnail`, formData, {
      withCredentials: true,
    });
  }

  uploadResource(courseId: string, file: File) {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(`${API_URL}/courses/${courseId}/resources`, formData, {
      withCredentials: true,
    });
  }
}
