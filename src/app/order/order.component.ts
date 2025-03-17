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
  feedbackMessage: string = '';

  constructor(private cardService: CardService, private router: Router) {}

  ngOnInit(): void {
    console.log('Navigáltam a /order oldalra');
    this.cardService.getCart().subscribe(cartData => {
      this.cart = cartData;
    });
    this.setMinPickupDate();
    this.setMinPickupTime();
  }

  addOrder(): void {
    if (!this.validateInputs()) {
      return;
    }
    if (!this.validateDateAndTime()) {
      return;
    }

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

    this.cardService.addOrder(orderData).subscribe(
      (response) => {
        this.feedbackMessage = 'A rendelés sikeresen leadva! Egy hitelesítő emailt küldtünk a megadott címre.';
        this.resetForm();
        this.cardService.clearCart();
        this.router.navigate(['shop']);
        this.sendVerificationEmail(this.email);
      },
      (error) => {
        this.feedbackMessage = 'Hiba történt a rendelés leadása közben.';
      }
    );
  }

  private validateDateAndTime(): boolean {
    const selectedDate = new Date(`${this.pickupDate}T${this.pickupTime}:00`);
    const currentDate = new Date();
    if (selectedDate <= currentDate) {
      this.feedbackMessage = 'A megadott dátum vagy idő érvénytelen! Kérjük, válasszon egy jövőbeli dátumot és időpontot!';
      return false;
    }
    return true;
  }

  private validateInputs(): boolean {
    const namePattern = /^[a-zA-ZáéíóöőúüűÁÉÍÓÖŐÚÜŰ\s]+$/;
    if (!namePattern.test(this.name)) {
      this.feedbackMessage = 'A név érvénytelen! Csak betűk, szóközök és ékezetes karakterek engedélyezettek, számok nem.';
      return false;
    }
    return (
      this.isNotEmpty(this.name) &&
      this.isNotEmpty(this.address) &&
      this.isNotEmpty(this.pickupDate) &&
      this.isNotEmpty(this.pickupTime) &&
      this.isNotEmpty(this.phone) &&
      this.isNotEmpty(this.email) &&
      this.validateEmail(this.email)
    );
  

    return true;
  }

  private isNotEmpty(value: string): boolean {
    return value.trim().length > 0;
  }

  private validateEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
  }

  private sendVerificationEmail(email: string): void {
    console.log('Hitelesítő email küldése a következő címre:', email);
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
    this.feedbackMessage = '';
  }

  private setMinPickupDate(): void {
    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    this.pickupDate = today.toISOString().split('T')[0];
  }

  private setMinPickupTime(): void {
    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    this.pickupTime = today.toISOString().split('T')[1].substring(0, 5);
  }
}
