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
  myAppointmentAsDoctorParams = signal<AppointmentParams>(new AppointmentParams);

  resetAppointmentParams(){
    this.appointmentParams.set(new AppointmentParams);
  }

  resetMyAppointmentAsPatientParams(){
    this.myAppointmentAsPatientParams.set(new AppointmentParams);
  }

  resetMyAppointmentAsDoctorParams(){
    this.myAppointmentAsDoctorParams.set(new AppointmentParams);
  }

  getAppointments(){
    const response = this.appointmentCache.get(Object.values(this.appointmentParams()).join('-'));

    if (response) return this.setPaginatedResponse(response);
    let params = this.setPaginationHeaders(this.appointmentParams().pageNumber, this.appointmentParams().pageSize)

    params = params.append("status", "current-open");
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

    return this.http.get<Appointment[]>(this.baseUrl + "appointments/patient/my", {observe: 'response', params}).subscribe({
      next: response => {
        this.setPaginatedResponse(response);
        this.appointmentCache.set('myAsPatient-' + Object.values(this.myAppointmentAsPatientParams()).join("-"), response);
      }
    });
  }

  getMyAppointmentsAsDoctor(){
    const response = this.appointmentCache.get('myAsDoctor-' + Object.values(this.myAppointmentAsDoctorParams()).join('-'));

    if (response) return this.setPaginatedResponse(response);
    let params = this.setPaginationHeaders(this.myAppointmentAsDoctorParams().pageNumber, this.myAppointmentAsDoctorParams().pageSize)

    if (this.myAppointmentAsDoctorParams().status) params = params.append("status", this.myAppointmentAsDoctorParams().status as string);
    if (this.myAppointmentAsDoctorParams().orderBy) params = params.append("orderBy", this.myAppointmentAsDoctorParams().orderBy as string);
    params = params.append("officeId", this.myAppointmentAsDoctorParams().officeId);
    params = params.append("doctorId", this.myAppointmentAsDoctorParams().doctorId);
    params = params.append("month", this.myAppointmentAsDoctorParams().month);
    params = params.append("year", this.myAppointmentAsDoctorParams().year);

    return this.http.get<Appointment[]>(this.baseUrl + "appointments/doctor/my", {observe: 'response', params}).subscribe({
      next: response => {
        this.setPaginatedResponse(response);
        this.appointmentCache.set('myAsDoctor-' + Object.values(this.myAppointmentAsDoctorParams()).join("-"), response);
      }
    });
  }

  getMyClosestAppointmentsAsPatient(){
    const response = this.appointmentCache.get('myClosestAsPatient');

    if (response) return this.setPaginatedResponse(response);
    let params = this.setPaginationHeaders(1, 1)
    params = params.append("orderBy", "closest");

    return this.http.get<Appointment[]>(this.baseUrl + "appointments/patient/my", {observe: 'response', params}).subscribe({
      next: response => {
        this.setPaginatedResponse(response);
        this.appointmentCache.set('myClosestAsPatient', response);
      }
    });
  }

  getMyClosestAppointmentsAsDoctor(){
    const response = this.appointmentCache.get('myClosestAsDoctor');

    if (response) return this.setPaginatedResponse(response);
    let params = this.setPaginationHeaders(1, 1)
    params = params.append("status", "current-close");
    params = params.append("orderBy", "closest");

    return this.http.get<Appointment[]>(this.baseUrl + "appointments/doctor/my", {observe: 'response', params}).subscribe({
      next: response => {
        this.setPaginatedResponse(response);
        this.appointmentCache.set('myClosestAsDoctor', response);
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

  createAppointments(model: any){
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

  setAppointmentAsCompleted(appointmentId: number){
    return this.http.post(this.baseUrl + `appointments/${appointmentId}/complete`, {}).pipe(
      tap(() => {
        this.appointmentCache.clear();
      })
    );
  }

  setAppointmentAsUncompleted(appointmentId: number){
    return this.http.post(this.baseUrl + `appointments/${appointmentId}/uncomplete`, {}).pipe(
      tap(() => {
        this.appointmentCache.clear();
      })
    );
  }

  resetEverything(){
    this.appointmentCache.clear();
    this.paginatedResult.set(null);
    this.appointmentParams.set(new AppointmentParams);
    this.appointmentParams.set(new AppointmentParams);
    this.appointmentParams.set(new AppointmentParams);
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
