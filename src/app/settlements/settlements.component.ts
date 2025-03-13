import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BaseService } from '../base.service';
import { AuthService } from '../auth.service';

interface Settlement {
  Helysegnev: string;
  KH: number;
  keleti_hossz_fok_perc: number;
  ESZ: number;
  eszaki_szelesseg_fok_perc: number;
  id: string;
}

@Component({
  selector: 'app-settlements',
  standalone: false,
  templateUrl: './settlements.component.html',
  styleUrl: './settlements.component.css'
})
export class SettlementsComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  datas: Settlement[] = []; 
  paginatedDatas: Settlement[] = [];
  settlements={id:null,ESZ:null,Helysegnev:'',KH:null,eszaki_szelesseg_fok_perc:null,keleti_hossz_fok_perc:null} 
  currentPage: number = 1;
  itemsPerPage: number = 50;
  totalPages: number = 0;
  word: string = '';
  isVisible: boolean = false;
  user:any

  constructor(private baseService: BaseService,private auth:AuthService) { }

  ngOnInit(): void {
    this.getModifiedDatas();
    this.auth.getCurrentUser().subscribe(user => {
      this.user = user
    }) 
  }

  getModifiedDatas(): void {
    this.baseService.getDatas().subscribe((data: Settlement[]) => {
      this.datas = data; 
      this.updatePagination();
    });
  }

  updatePagination(): void {
    const filteredDatas = this.word 
      ? this.datas.filter(data => data.Helysegnev.toLowerCase().includes(this.word.toLowerCase())) 
      : this.datas;

    this.totalPages = Math.ceil(filteredDatas.length / this.itemsPerPage);
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedDatas = filteredDatas.slice(start, end);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  onKeyUp(event: any): void {
    this.word = event.target.value;
    this.currentPage = 1; 
    this.updatePagination();
  }

  updateSettlement(settlement: any) {
    if (!settlement.id) {
      console.error("Hiba: Az azonosító hiányzik!", settlement);
      return;
    }
    this.baseService.updateSettlement(settlement.id, settlement).subscribe(() => {
      console.log("Sikeres frissítés:", settlement);
      this.getModifiedDatas(); 
    }, error => {
      console.error("Hiba a frissítés során:", error);
    });
  }

  deleteSettlement(id: string): void {
    this.baseService.deleteSettlement(id).subscribe(() => {
      this.getModifiedDatas();
    });
  }
  addSettlement() {
            this.baseService.createSettlement(this.settlements).subscribe({
          next: () => {
            this.getModifiedDatas(); 
            this.settlements = { 
              id: null,
              Helysegnev: '',
              KH: null,
              keleti_hossz_fok_perc: null,
              ESZ: null,
              eszaki_szelesseg_fok_perc: null
            };
          },
        });
      }
  closePanel() {
    this.close.emit(); 
  }
  openModal() {
    this.isVisible = true;
  }
  closeModal() {
    this.isVisible = false;
  }
}
