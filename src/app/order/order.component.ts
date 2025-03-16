import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CardService } from '../card.service';

interface Order {
  name: string;
  address: string;
  pickupDate: string;
  pickupTime: string;
  comment: string;
  phone: string;
  email: string;
  paymentMethod: string;
  cart: any[];
}

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css'],
  standalone: false
})
export class OrderComponent implements OnInit {
filterPrice($event: Event) {
throw new Error('Method not implemented.');
}
filterCategory($event: Event) {
throw new Error('Method not implemented.');
}
viewCart() {
throw new Error('Method not implemented.');
}
addStuff(_t18: any,arg1: any) {
throw new Error('Method not implemented.');
}

  name: string = '';
  address: string = '';
  pickupDate: string = '';
  pickupTime: string = '';
  comment: string = '';
  phone: string = '';
  email: string = '';
  paymentMethod: string = 'cash';

  paymentOptions: string[] = ['cash'];
  cart: any[] = [];
cartCount: any;
filteredShopDatas: any;

  constructor(private cardService: CardService, private router: Router) {}

  ngOnInit(): void {
    this.cardService.getCart().subscribe(cartData => {
      this.cart = cartData; 
    });
  }

  addOrder(): void {
    if (this.validateInputs()) {
      const orderData: Order = {
        name: this.name,
        address: this.address,
        pickupDate: this.pickupDate,
        pickupTime: this.pickupTime,
        comment: this.comment,
        phone: this.phone,
        email: this.email,
        paymentMethod: this.paymentMethod,
        cart: this.cart
      };
      
      this.cardService.addOrder(orderData); 
      this.router.navigate(['home']);
    } else {
      console.error('Hibás bemenet: Minden mező kitöltése kötelező!');
    }
  }

  private validateInputs(): boolean {
    return (
      this.name.trim().length > 0 &&
      this.address.trim().length > 0 &&
      this.pickupDate.trim().length > 0 &&
      this.pickupTime.trim().length > 0 &&
      this.phone.trim().length > 0 &&
      this.email.trim().length > 0 &&
      this.validateEmail(this.email)
    );
  }

  public validateEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
  }  
}
