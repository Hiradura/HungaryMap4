import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CardService } from '../card.service';
import { Observable } from 'rxjs';

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

  constructor(private cardService: CardService, private router: Router) {}

  ngOnInit(): void {
    console.log('Navigáltam a /order oldalra');
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
  
      console.log('Rendelési adatok:', orderData);
  
      this.cardService.addOrder(orderData).subscribe(
        (response) => {
          console.log('Rendelés sikeresen leadva', response);
          this.resetForm();
          this.cardService.clearCart();
          this.router.navigate(['home']);
        },
        (error) => {
          console.error('Hiba történt a rendelés leadása közben', error);
          alert('Hiba történt a rendelés leadása közben');
        }
      );
    } else {
      console.error('Hibás bemenet: Minden mező kitöltése kötelező!');
      alert('Minden mezőt ki kell tölteni, és az email címnek érvényesnek kell lennie!');
    }
  }
  private validateInputs(): boolean {
    return (
      this.isNotEmpty(this.name) &&
      this.isNotEmpty(this.address) &&
      this.isNotEmpty(this.pickupDate) &&
      this.isNotEmpty(this.pickupTime) &&
      this.isNotEmpty(this.phone) &&
      this.isNotEmpty(this.email) &&
      this.validateEmail(this.email)
    );
  }
  private isNotEmpty(value: string): boolean {
    return value.trim().length > 0;
  }
  private validateEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
  }
  private resetForm(): void {
    this.name = '';
    this.address = '';
    this.pickupDate = '';
    this.pickupTime = '';
    this.comment = '';
    this.phone = '';
    this.email = '';
    this.paymentMethod = 'cash';
    this.cart = [];
  }
}
