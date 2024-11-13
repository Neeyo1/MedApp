import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { RouterLink } from '@angular/router';
import { OfficeService } from '../../_services/office.service';

@Component({
  selector: 'app-office-list',
  standalone: true,
  imports: [FormsModule, PaginationModule, RouterLink],
  templateUrl: './office-list.component.html',
  styleUrl: './office-list.component.css'
})
export class OfficeListComponent implements OnInit{
  officeService = inject(OfficeService);

  ngOnInit(): void {
    if (!this.officeService.paginatedResult()) this.loadOffices();
  }

  loadOffices(){
    this.officeService.getOffices();
  }

  resetFilters(){
    this.officeService.resetOfficeParams();
    this.loadOffices();
  }

  pageChanged(event: any){
    if (this.officeService.officeParams().pageNumber != event.page){
      this.officeService.officeParams().pageNumber = event.page;
      this.loadOffices();
    }
  }
}
