import { Component, OnInit } from '@angular/core';
import { BaseService } from '../base.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-balaton',
  standalone: false,
  
  templateUrl: './balaton.component.html',
  styleUrl: './balaton.component.css'
})
export class BalatonComponent implements OnInit {
  datas:any[] = []
  isVisible = true;
  Text = '';
  X = 0;
  Y = 0;
  panelOpen = false;  
  selectedRegion = '';

  constructor(private  base:BaseService,private router:Router){}

  ngOnInit() {
      
  }

  // getDatas(){
  //   this.base.getDatas().subscribe((res)=>{
  //     this.datas=res
  //   })
  // }

    
    showText(event: MouseEvent, text: string) {
      this.Text = text;
      this.isVisible = true;
      this.moveText(event);
    }
    moveText(event: MouseEvent) {
      this.X = event.clientX +10;  
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
