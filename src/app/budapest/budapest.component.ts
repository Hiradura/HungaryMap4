import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-budapest',
  standalone: false,
  
  templateUrl: './budapest.component.html',
  styleUrl: './budapest.component.css'
})
export class BudapestComponent {
  
  isVisible = true;
  Text = '';
  X = 0;
  Y = 0;
  panelOpen = false;  
  selectedRegion = '';
  constructor(private router:Router){}
  showText(event: MouseEvent, text: string) {
    this.Text = text;
    this.isVisible = true;
    this.moveText(event);
  }
  moveText(event: MouseEvent) {
    this.X = event.clientX +15;  
    this.Y = event.clientY +10;  
  }
  hideText() {
    this.isVisible = false;
  }
  selectRegion(region: string) {
    this.selectedRegion = region;
    this.panelOpen = false;
    setTimeout(() => {
      this.panelOpen = true;
    }, 10);
  }
  closePanel() {
    this.panelOpen = false;
  }
  backbtn(){
    this.router.navigate(["/map"])
  }

}
