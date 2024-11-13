import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { PaginatedResult } from '../_models/pagination';
import { Office } from '../_models/office';
import { OfficeParams } from '../_models/officeParams';
import { of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OfficeService {
  private http = inject(HttpClient);
  baseUrl = environment.apiUrl;
  officeCache = new Map();
  paginatedResult = signal<PaginatedResult<Office[]> | null>(null);
  officeParams = signal<OfficeParams>(new OfficeParams);

  resetOfficeParams(){
    this.officeParams.set(new OfficeParams);
  }

  getOffices(){
    const response = this.officeCache.get(Object.values(this.officeParams()).join('-'));

    if (response) return this.setPaginatedResponse(response);
    let params = this.setPaginationHeaders(this.officeParams().pageNumber, this.officeParams().pageSize)

    if (this.officeParams().city) params = params.append("city", this.officeParams().city as string);
    params = params.append("doctorId", this.officeParams().doctorId);

    return this.http.get<Office[]>(this.baseUrl + "offices", {observe: 'response', params}).subscribe({
      next: response => {
        this.setPaginatedResponse(response);
        this.officeCache.set(Object.values(this.officeParams()).join("-"), response);
      }
    });
  }

  getOffice(id: number){
    const office: Office = [...this.officeCache.values()]
      .reduce((arr, elem) => arr.concat(elem.body), [])
      .find((g: Office) => g.id == id);

    if (office) return of(office);
    
    return this.http.get<Office>(this.baseUrl + `offices/${id}`);
  }

  createOffice(model: any){
    return this.http.post<Office>(this.baseUrl + "offices", model).pipe(
      tap(() => {
        this.officeCache.clear();
        this.getOffices();
      })
    );
  }

  editOffice(officeId: number, model: any){
    return this.http.put<Office>(this.baseUrl + `offices/${officeId}`, model).pipe(
      tap(() => {
        this.officeCache.clear();
        this.getOffices();
      })
    );
  }

  deleteOffice(officeId: number){
    return this.http.delete(this.baseUrl + `offices/${officeId}`).pipe(
      tap(() => {
        this.officeCache.clear();
        this.getOffices();
      })
    );
  }

  private setPaginationHeaders(pageNumber: number, pageSize: number){
    let params = new HttpParams();

    if (pageNumber && pageSize){
      params = params.append("pageNumber", pageNumber);
      params = params.append("pageSize", pageSize);
    }

    return params;
  }

  private setPaginatedResponse(response: HttpResponse<Office[]>){
    this.paginatedResult.set({
      items: response.body as Office[],
      pagination: JSON.parse(response.headers.get("pagination")!)
    })
  }
}

