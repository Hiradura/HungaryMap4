import { Component } from '@angular/core';
import { CardComponent } from '../card/card.component';
import { Router } from '@angular/router';
import { CardService } from '../card.service';

@Component({
  selector: 'app-order',
  standalone: false,
  
  templateUrl: './order.component.html',
  styleUrl: './order.component.css'
})
export class OrderComponent {

  name=""
  address=""

  constructor(private crd:CardService,private router:Router){}

  addOrder(){
    this.crd.addOrder(this.name, this.address)
    this.router.navigate(['home'])}
}
