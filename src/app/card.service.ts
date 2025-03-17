import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CardService {

  private card:any=[]
  private cardSub = new BehaviorSubject([])
  private databaseURL= "https://magyarorszagmap-default-rtdb.europe-west1.firebasedatabase.app/shop/turafelszereles.json"
  constructor(private http: HttpClient) { }

  addOrder(orderData: { 
    name: string; 
    address: string; 
    pickupDate: string; 
    pickupTime: string; 
    comment: string; 
    phone: string; 
    email: string; 
    paymentMethod: string;
    cart: any[];
  }) {
    let body = { 
      ...orderData, 
      cart: this.card
    };
  
    this.http.post(this.databaseURL, body).subscribe(
      (res) => console.log("Sikeres rendelés leadás", res),
      (err) => console.error("Hiba történt a rendelés leadása közben", err)
    );
  }
  
  getOrdersByUser(email: string): Observable<any[]> {
    return this.http.get<any[]>(`/api/orders?email=${email}`);
  }
  getCart(){
    return this.cardSub
  }
  addElement(element: any, db: any) {
    let i = this.card.findIndex(
      (e: any) => e.id === element.id
    );
    console.log("i", i);
  
    if (i === -1) {
      element.db = db;
      this.card.push(element);
    } else {
 
      this.card[i].db = db;
    }
  
    console.log("Kosár tartalma:", this.card); 
    this.cardSub.next(this.card); 
  }  
}