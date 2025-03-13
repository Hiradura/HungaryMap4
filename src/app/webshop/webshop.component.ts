import { Component, Input, input, OnInit } from '@angular/core';
import { BaseService } from '../base.service';
import { SearchService } from '../search.service';
import { Router } from '@angular/router';
import { CardService } from '../card.service';

@Component({
  selector: 'app-webshop',
  standalone: false,
  
  templateUrl: './webshop.component.html',
  styleUrl: './webshop.component.css'
})
export class WebshopComponent implements OnInit {
  shopDatas:any
element: any=[];

  constructor(private base:BaseService,private router:Router,private crd:CardService){}

  ngOnInit(): void {
    this.loadShopData()
}
loadShopData(){
  this.base.getShopData().subscribe((res)=> this.shopDatas=res)
}
cardbtn(){
  this.router.navigate(["/card"])
}
addStuff(element:any, db:any){
  this.crd.addElement(element, db)
}

}
