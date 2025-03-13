import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CardService {

  private card:any=[]
  private cardSub = new BehaviorSubject([])
  private databaseURL= "https://magyarorszagmap-default-rtdb.europe-west1.firebasedatabase.app/shop/turafelszereles.json"
  constructor(private http: HttpClient) { }

  addOrder(name:any, address:any){
    let body={name:name, address:address, cart:this.card}
    this.http.post(this.databaseURL,body).subscribe(
      (res)=>console.log("sikeres rendelés leadás", res)
    )
  }
  getCart(){
    return this.cardSub
  }
  addElement(element:any, db:any){
    let i = this.card.findIndex(
      (e:any)=>e.id==element.id
    )
    console.log("i",i)
    if (i==-1)
    {
      element.db=db
      delete element.leiras  
      this.card.push(element)
    }
    else{
      this.card[i].db=db
    }
    console.log(this.card)
    this.cardSub.next(this.card)
  }
}
