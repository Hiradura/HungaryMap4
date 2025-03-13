import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CardService } from '../card.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-card',
  standalone: false,
  
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent implements OnInit, OnDestroy{

  subscription!:Subscription
  card:any

  constructor(private router:Router,private crd:CardService){}

  backbtn(){
    this.router.navigate(["/shop"])
  }
  continuebtn(){
    this.router.navigate(["/order"])
  }
  ngOnInit(): void {
    this.subscription=this.crd.getCart().subscribe(
      (res)=>this.card=res
    )
  }
  ngOnDestroy(): void {
      if (this.subscription) this.subscription.unsubscribe()
  }
  price(element:any){
    return Number(element.db)*Number(element.ar)
  }
}
