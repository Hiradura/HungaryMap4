import { Component, EventEmitter, Input, Output } from '@angular/core';


@Component({
  selector: 'app-side-panel-city',
  standalone: false,
  
  templateUrl: './side-panel-city.component.html',
  styleUrl: './side-panel-city.component.css'
})
export class SidePanelCityComponent {
  @Input() isOpen = false;  
  @Input() selectedRegion = ''; 
  @Output() close = new EventEmitter<void>(); 

  constructor(){}
  closePanel() {
    this.close.emit(); 
  }
}
