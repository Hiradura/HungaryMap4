import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CardService {
  private card: any[] = [];
  private cardSub = new BehaviorSubject<any[]>([]);
  private ordersURL = "https://magyarorszagmap-default-rtdb.europe-west1.firebasedatabase.app/orders.json";

  constructor(private http: HttpClient) {}
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
  }): Observable<any> {
    const body = { 
      ...orderData, 
      cart: orderData.cart.length ? orderData.cart : []
    };

    return this.http.post<any>(this.ordersURL, body).pipe(
      catchError(error => {
        console.error('Hiba történt a rendelés mentése során:', error);
        alert('Hiba történt a rendelés mentése során!');
        return of(null); 
      }),
      map(response => {
        console.log('Rendelés sikeresen leadva', response);
        return response; 
      })
    );
  }
  getOrdersByUser(email: string): Observable<any[]> {
    const url = `https://magyarorszagmap-default-rtdb.europe-west1.firebasedatabase.app/orders.json?orderBy="email"&equalTo="${encodeURIComponent(email)}"`;

    console.log("Lekérdezés URL:", url);
    return this.http.get<any>(url).pipe(
      catchError(error => {
        console.error('Hiba történt a rendeléseket tartalmazó lekérdezés során:', error);
        alert('Hiba történt a rendeléseket tartalmazó lekérdezés során!');
        return of([]); 
      }),
      map((response: any) => {
        console.log('Válasz a Firebase-től:', response);
        if (!response) return []; 
        return Object.values(response);
      })
    );
  }
  getCart(): Observable<any[]> {
    return this.cardSub.asObservable();
  }
  addElement(element: any, db: number): void {
    const index = this.card.findIndex((e: any) => e.id === element.id);

    if (index === -1) {
      element.db = db;
      this.card.push(element);
    } else {
      this.card[index].db = db;
    }

    this.cardSub.next(this.card); 
  }
  clearCart(): void {
    this.card = [];
    this.cardSub.next(this.card);
  }
  deleteItem(itemToDelete: any): void {
    const currentCart = this.cardSub.value; 
    const updatedCart = currentCart.filter(item => item.id !== itemToDelete.id); 
    this.cardSub.next(updatedCart); 
  }
}
