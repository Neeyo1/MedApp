import { HttpClient } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { environment } from "../../environments/environment";
import { Verification } from "../_models/verification";
import { tap } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private http = inject(HttpClient);
  baseUrl = environment.apiUrl;
  adminCache = new Map();
  result = signal<Verification[] | null>(null);

  getVerifications(){
    const response: Verification[] | null = this.adminCache.get('verification');

    if (response) return this.result.set(response);

    return this.http.get<Verification[]>(this.baseUrl + "admin/verifications").subscribe({
      next: response => {
        this.result.set(response)
        this.adminCache.set('verification', response);
      }
    });
  }

  confirmAsDoctor(verificationId: number){
    return this.http.post(this.baseUrl + `admin/verifications/${verificationId}`, {}).pipe(
      tap(() => {
        this.adminCache.clear();
      })
    );
  }

  resetEverything(){
    this.adminCache.clear();
  }
}
