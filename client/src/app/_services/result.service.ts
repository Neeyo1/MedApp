import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { PaginatedResult } from '../_models/pagination';
import { Result } from '../_models/result';
import { ResultParams } from '../_models/resultParams';
import { of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResultService {
  private http = inject(HttpClient);
  baseUrl = environment.apiUrl;
  resultCache = new Map();
  paginatedResult = signal<PaginatedResult<Result[]> | null>(null);
  resultParams = signal<ResultParams>(new ResultParams);
  myResultAsDoctorParams = signal<ResultParams>(new ResultParams);

  resetResultParams(){
    this.resultParams.set(new ResultParams);
  }

  resetMyResultAsDoctorParams(){
    this.myResultAsDoctorParams.set(new ResultParams);
  }

  getMyResultsAsPatient(){
    const response = this.resultCache.get('AsPatient-' + Object.values(this.resultParams()).join('-'));

    if (response) return this.setPaginatedResponse(response);
    let params = this.setPaginationHeaders(this.resultParams().pageNumber, this.resultParams().pageSize)

    if (this.resultParams().orderBy) params = params.append("orderBy", this.resultParams().orderBy as string);
    params = params.append("patientId", this.resultParams().patientId);
    params = params.append("doctorId", this.resultParams().doctorId);

    return this.http.get<Result[]>(this.baseUrl + "results/patient", {observe: 'response', params}).subscribe({
      next: response => {
        this.setPaginatedResponse(response);
        this.resultCache.set('AsPatient-' + Object.values(this.resultParams()).join("-"), response);
      }
    });
  }

  getResultsAsDoctor(){
    const response = this.resultCache.get('AsDoctor-' + Object.values(this.resultParams()).join('-'));

    if (response) return this.setPaginatedResponse(response);
    let params = this.setPaginationHeaders(this.resultParams().pageNumber, this.resultParams().pageSize)

    if (this.resultParams().orderBy) params = params.append("orderBy", this.resultParams().orderBy as string);
    params = params.append("patientId", this.resultParams().patientId);
    params = params.append("doctorId", this.resultParams().doctorId);

    return this.http.get<Result[]>(this.baseUrl + "results/doctor", {observe: 'response', params}).subscribe({
      next: response => {
        this.setPaginatedResponse(response);
        this.resultCache.set('AsDoctor-' + Object.values(this.resultParams()).join("-"), response);
      }
    });
  }

  getMyResultsAsDoctor(){
    const response = this.resultCache.get('MyAsDoctor-' + Object.values(this.myResultAsDoctorParams()).join('-'));

    if (response) return this.setPaginatedResponse(response);
    let params = this.setPaginationHeaders(this.myResultAsDoctorParams().pageNumber, this.myResultAsDoctorParams().pageSize)

    if (this.myResultAsDoctorParams().orderBy) params = params.append("orderBy", this.myResultAsDoctorParams().orderBy as string);
    params = params.append("patientId", this.myResultAsDoctorParams().patientId);
    params = params.append("doctorId", this.myResultAsDoctorParams().doctorId);

    return this.http.get<Result[]>(this.baseUrl + "results/doctor/my", {observe: 'response', params}).subscribe({
      next: response => {
        this.setPaginatedResponse(response);
        this.resultCache.set('MyAsDoctor-' + Object.values(this.myResultAsDoctorParams()).join("-"), response);
      }
    });
  }

  getResult(resultId: number){
    const result: Result = [...this.resultCache.values()]
      .reduce((arr, elem) => arr.concat(elem.body), [])
      .find((r: Result) => r.id === resultId);

      if (result) return of(result);
    
    return this.http.get<Result>(this.baseUrl + 'results/' + resultId);
  }

  createResult(model: any){
    return this.http.post<Result>(this.baseUrl + "results", model).pipe(
      tap(() => {
        this.resultCache.clear();
      })
    );
  }

  editResult(resultId: number, model: any){
    return this.http.put<Result>(this.baseUrl + `results/${resultId}`, model).pipe(
      tap(() => {
        this.resultCache.clear();
      })
    );
  }

  deleteResult(resultId: number){
    return this.http.delete(this.baseUrl + `results/${resultId}`).pipe(
      tap(() => {
        this.resultCache.clear();
      })
    );
  }

  resetEverything(){
    this.resultCache.clear();
    this.paginatedResult.set(null);
    this.resultParams.set(new ResultParams);
    this.myResultAsDoctorParams.set(new ResultParams);
  }

  private setPaginationHeaders(pageNumber: number, pageSize: number){
    let params = new HttpParams();

    if (pageNumber && pageSize){
      params = params.append("pageNumber", pageNumber);
      params = params.append("pageSize", pageSize);
    }

    return params;
  }

  private setPaginatedResponse(response: HttpResponse<Result[]>){
    this.paginatedResult.set({
      items: response.body as Result[],
      pagination: JSON.parse(response.headers.get("pagination")!)
    })
  }
}
