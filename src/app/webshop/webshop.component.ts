import { Component, OnInit } from '@angular/core';
import { BaseService } from '../base.service';
import { Router } from '@angular/router';
import { CardService } from '../card.service';

@Component({
  selector: 'app-webshop',
  templateUrl: './webshop.component.html',
  styleUrls: ['./webshop.component.css'],
  standalone: false
})
export class WebshopComponent implements OnInit {
  shopDatas: any = [];
  filteredShopDatas: any = [];
  filterPriceValue: number | null = null;
  filterCategoryValue: string = '';
  cartCount: number = 0;

  constructor(private base: BaseService, private router: Router, private crd: CardService) {}

  ngOnInit(): void {
    this.loadShopData();
    this.crd.getCart().subscribe((cart: any) => {
      this.cartCount = cart.length;
    });
  }

  loadShopData() {
    this.base.getShopData().subscribe((res) => {
      console.log('Shop data:', res);
      this.shopDatas = Object.values(res);
      this.filteredShopDatas = [...this.shopDatas];
      
    });
  }

  filterPrice($event: Event) {
    const price = ($event.target as HTMLInputElement)?.value;
    this.filterPriceValue = price ? parseInt(price, 10) : null;
    this.applyFilters();
  }

  filterCategory($event: Event) {
    const category = ($event.target as HTMLInputElement)?.value || '';
    this.filterCategoryValue = category;
    this.applyFilters();
  }

  applyFilters() {
    this.filteredShopDatas = this.shopDatas.filter((item: any) => {
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
