import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { map } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../_models/user';
import { ProfilePhoto } from '../_models/profilePhoto';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private http = inject(HttpClient);
  baseUrl = environment.apiUrl;
  currentUser = signal<User | null>(null);
  roles = computed(() => {
    const user = this.currentUser();
    if (user && user.token){
      const role = JSON.parse(atob(user.token.split('.')[1])).role;
      return Array.isArray(role) ? role : [role];
    }
    return [];
  })

  login(model: any){
    return this.http.post<User>(this.baseUrl + "account/login", model).pipe(
      map(user => {
        if (user){
          this.setCurrentUser(user);
        }
        return user;
      })
    )
  }

  register(model: any){
    return this.http.post<User>(this.baseUrl + "account/register", model).pipe(
      map(user => {
        if (user){
          this.setCurrentUser(user);
        }
        return user;
      })
    )
  }

  logout(){
    localStorage.removeItem("user");
    this.currentUser.set(null);
  }

  changePassword(model: any){
    return this.http.post<User>(this.baseUrl + "account/change-password", model).pipe(
      map(user => {
        if (user){
          this.setCurrentUser(user);
        }
        return user;
      })
    )
  }

  setCurrentUser(user: User){
    localStorage.setItem("user", JSON.stringify(user));
    this.currentUser.set(user);
  }

  uploadPhoto(file: File){
    const formData: FormData = new FormData();
    formData.append('file', file);

    return this.http.post<ProfilePhoto>(this.baseUrl + "account/add-photo", formData).pipe(
      map(photo => {
        const user = this.currentUser();
        if (user){
          user.profilePhotos.push(photo);
          if (photo.isMain){
            user.profilePhotoUrl = photo.url;
            user.profilePhotos.forEach(p => {
              if (p.isMain == true) p.isMain = false;
              if (p.id == photo.id) p.isMain = true;
            })
          }
          this.setCurrentUser(user);
        }
      })
    )
  }

  deletePhoto(photoId: number){
    return this.http.delete(this.baseUrl + "account/delete-photo/" + photoId, {}).pipe(
      map(_ => {
        const user = this.currentUser();
        if (user){
          user.profilePhotos = user.profilePhotos.filter(p => p.id != photoId);
          this.setCurrentUser(user);
        }
      })
    )
  }

  mainPhoto(photoId: number){
    return this.http.put(this.baseUrl + "account/set-main-photo/" + photoId, {}).pipe(
      map(_ => {
        const user = this.currentUser();
        if (user){
          user.profilePhotoUrl = user.profilePhotos.find(p => p.id == photoId)?.url;
          user.profilePhotos.forEach(p => {
            if (p.isMain == true) p.isMain = false;
            if (p.id == photoId) p.isMain = true;
          })
          this.setCurrentUser(user);
        }
      })
    )
  }
}
