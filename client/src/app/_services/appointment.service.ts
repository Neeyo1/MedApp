import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { PaginatedResult } from '../_models/pagination';
import { Appointment } from '../_models/appointment';
import { AppointmentParams } from '../_models/appointmentParams';
import { of, tap } from 'rxjs';
import { AppointmentDetailed } from '../_models/appointmentDetailed';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private http = inject(HttpClient);
  baseUrl = environment.apiUrl;
  appointmentCache = new Map();
  paginatedResult = signal<PaginatedResult<Appointment[]> | null>(null);
  appointmentParams = signal<AppointmentParams>(new AppointmentParams);
  myAppointmentAsPatientParams = signal<AppointmentParams>(new AppointmentParams);

  resetAppointmentParams(){
    this.appointmentParams.set(new AppointmentParams);
  }

  resetMyAppointmentAsPatientParams(){
    this.myAppointmentAsPatientParams.set(new AppointmentParams);
  }

  getAppointments(){
    const response = this.appointmentCache.get(Object.values(this.appointmentParams()).join('-'));

    if (response) return this.setPaginatedResponse(response);
    let params = this.setPaginationHeaders(this.appointmentParams().pageNumber, this.appointmentParams().pageSize)

    if (this.appointmentParams().status) params = params.append("status", this.appointmentParams().status as string);
    if (this.appointmentParams().orderBy) params = params.append("orderBy", this.appointmentParams().orderBy as string);
    params = params.append("officeId", this.appointmentParams().officeId);
    params = params.append("month", this.appointmentParams().month);
    params = params.append("year", this.appointmentParams().year);

    return this.http.get<Appointment[]>(this.baseUrl + "appointments", {observe: 'response', params}).subscribe({
      next: response => {
        this.setPaginatedResponse(response);
        this.appointmentCache.set(Object.values(this.appointmentParams()).join("-"), response);
      }
    });
  }

  getMyAppointmentsAsPatient(){
    const response = this.appointmentCache.get('myAsPatient-' + Object.values(this.myAppointmentAsPatientParams()).join('-'));

    if (response) return this.setPaginatedResponse(response);
    let params = this.setPaginationHeaders(this.myAppointmentAsPatientParams().pageNumber, this.myAppointmentAsPatientParams().pageSize)

    if (this.myAppointmentAsPatientParams().status) params = params.append("status", this.myAppointmentAsPatientParams().status as string);
    if (this.myAppointmentAsPatientParams().orderBy) params = params.append("orderBy", this.myAppointmentAsPatientParams().orderBy as string);
    params = params.append("officeId", this.myAppointmentAsPatientParams().officeId);
    params = params.append("month", this.myAppointmentAsPatientParams().month);
    params = params.append("year", this.myAppointmentAsPatientParams().year);

    return this.http.get<Appointment[]>(this.baseUrl + "appointments/my", {observe: 'response', params}).subscribe({
      next: response => {
        this.setPaginatedResponse(response);
        this.appointmentCache.set('myAsPatient-' + Object.values(this.myAppointmentAsPatientParams()).join("-"), response);
      }
    });
  }

  getMyAllAppointmentsAsPatient(){
    const response = this.appointmentCache.get('myAllAsPatient');

    if (response) return this.setPaginatedResponse(response);
    let params = this.setPaginationHeaders(1, 1)

    return this.http.get<Appointment[]>(this.baseUrl + "appointments/my", {observe: 'response', params}).subscribe({
      next: response => {
        this.setPaginatedResponse(response);
        this.appointmentCache.set('myAllAsPatient', response);
      }
    });
  }

  getAppointmentDetailed(id: number){
    const response = this.appointmentCache.get('detailed-' + id);

    if (response) return of(response);

    return this.http.get<AppointmentDetailed>(this.baseUrl + `appointments/${id}`).pipe(
      tap(response => {
        this.appointmentCache.set('detailed-' + id, response);
      })
    );
  }

  createAppointment(model: any){
    return this.http.post<Appointment>(this.baseUrl + "appointments", model).pipe(
      tap(() => {
        this.appointmentCache.clear();
      })
    );
  }

  editAppointment(appointmentId: number, model: any){
    return this.http.put<Appointment>(this.baseUrl + `appointments/${appointmentId}`, model).pipe(
      tap(() => {
        this.appointmentCache.clear();
      })
    );
  }

  deleteAppointment(appointmentId: number){
    return this.http.delete(this.baseUrl + `appointments/${appointmentId}`).pipe(
      tap(() => {
        this.appointmentCache.clear();
      })
    );
  }

  bookAppointment(appointmentId: number){
    return this.http.post(this.baseUrl + `appointments/${appointmentId}/register`, {}).pipe(
      tap(() => {
        this.appointmentCache.clear();
      })
    );
  }

  cancelAppointment(appointmentId: number){
    return this.http.post(this.baseUrl + `appointments/${appointmentId}/cancel`, {}).pipe(
      tap(() => {
        this.appointmentCache.clear();
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

  private setPaginatedResponse(response: HttpResponse<Appointment[]>){
    this.paginatedResult.set({
      items: response.body as Appointment[],
      pagination: JSON.parse(response.headers.get("pagination")!)
    })
  }
}
