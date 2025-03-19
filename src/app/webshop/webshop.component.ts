import { Component, OnInit } from '@angular/core';
import { BaseService } from '../base.service';
import { Router } from '@angular/router';
import { CardService } from '../card.service';

interface ShopData {
  nev: string;
  ar: number;
  kategoria: string;
  path: string;
  alt: string;
  maxDb: number;
  db: number;
}

@Component({
  selector: 'app-webshop',
  templateUrl: './webshop.component.html',
  styleUrls: ['./webshop.component.css'],
  standalone: false
})
export class WebshopComponent implements OnInit {
  shopDatas: ShopData[] = [];
  bikeDatas:[] = []
  filteredShopDatas: ShopData[] = [];
  filterPriceValue: number | null = null;
  filterCategoryValue: string = '';
  cartCount: number = 0;
  filterOpen: boolean = false; 
  priceInvalid: boolean = false; 
  categoryInvalid: boolean = false; 

  constructor(private base: BaseService, private router: Router, private crd: CardService) {}

  ngOnInit(): void {
    this.loadShopData();
    this.crd.getCart().subscribe((cart: any) => {
      this.cartCount = cart.length;
    });
  }

  toggleFilter() {
    this.filterOpen = !this.filterOpen; 
  }

  loadShopData() {
    this.base.getShopData().subscribe((res) => {
      this.shopDatas = Object.values(res);
      this.filteredShopDatas = [...this.shopDatas];
    });
  }


  // loadBikeData() {
  //   this.base.getBikes().subscribe((res) => {
  //     this.bikeDatas = res
  //   });
  // }
  filterPrice($event: Event) {
    const price = ($event.target as HTMLInputElement)?.value;
    if (price && isNaN(parseInt(price, 10))) {
      this.priceInvalid = true;  
    } else {
      this.priceInvalid = false;
      this.filterPriceValue = price ? parseInt(price, 10) : null;
      this.applyFilters();
    }
  }

  filterCategory($event: Event) {
    const category = ($event.target as HTMLInputElement)?.value || '';
    this.categoryInvalid = category.length === 0; 
    this.filterCategoryValue = category;
    this.applyFilters();
  }

  applyFilters() {
    this.filteredShopDatas = this.shopDatas.filter((item: ShopData) => {
      let matchesPrice = true;
      let matchesCategory = true;

      if (this.filterPriceValue !== null) {
        matchesPrice = item.ar <= this.filterPriceValue;
      }

      if (this.filterCategoryValue) {
        matchesCategory = item.kategoria.toLowerCase().includes(this.filterCategoryValue.toLowerCase());
      }

      return matchesPrice && matchesCategory;
    });
  }

  viewCart() {
    this.router.navigate(['/card']);
  }

  addStuff(element: any, db: any) {
    this.crd.addElement(element, db);
  }
}
