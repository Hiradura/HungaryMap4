import { AfterViewChecked, Component,  ElementRef,  OnInit, ViewChild, } from '@angular/core';
import { BaseService } from '../base.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-map',
  standalone: false,
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit,AfterViewChecked  {
  datas : any;
  lakes : any;
  isVisible = true;
  Text = '';
  X = 0;
  Y = 0;
  panelOpen = false;  
  selectedRegion = '';
  currentMap: string = 'map1';
  private scale: number = 1; 
  private viewBoxBase: [number, number, number, number] = [50, 0, 3100, 1900];
  public viewBox: string = `50 0 3100 1900`; 
  private minScale: number = 1500 / 1500; 
  private maxScale: number = 5;
  private isDragging: boolean = false;
  private dragStart: { x: number, y: number } | null = null;
  regionName1  = ''
  regionName2 = ''
  regionName3 = ''
  regionName4 = ''
  regionName5 = ''
  constructor(private http:HttpClient,private base: BaseService,private route:ActivatedRoute) {}

  ngOnInit(){
      this.getDatas()
      this.getLakeDatas()
      this.route.paramMap.subscribe(params => {
        this.regionName1 = params.get(this.regionName1) || '';
        this.regionName2 = params.get(this.regionName2) || '';
        this.regionName3 = params.get(this.regionName3) || '';
        this.regionName4 = params.get(this.regionName4)|| '';
        this.regionName5 = params.get(this.regionName5) || '';
      });
      
  }
  ngAfterViewChecked() {
    this.addCirclesToSvg();
    this.addLakeCirclesToSvg();
  }

  zoomIn(): void {
    if (this.scale < this.maxScale) {
      this.scale *= 1.2;  
      this.updateViewBox();
    }
  }

  zoomOut(): void {
    if (this.scale > this.minScale) {
      this.scale /= 1.2;  
      this.updateViewBox();
    }
  }

  private updateViewBox(): void {
    const newWidth = this.viewBoxBase[2] / this.scale;
    const newHeight = this.viewBoxBase[3] / this.scale;
    const offsetX = (this.viewBoxBase[2] - newWidth) / 2;
    const offsetY = (this.viewBoxBase[3] - newHeight) / 2;
    this.viewBox = `${offsetX + this.viewBoxBase[0]} ${offsetY + this.viewBoxBase[1]} ${newWidth} ${newHeight}`;
  }

  onMouseDown(event: MouseEvent): void {
    this.isDragging = true;
    this.dragStart = { x: event.clientX, y: event.clientY };
  }

  onMouseMove(event: MouseEvent): void {
    if (!this.isDragging || !this.dragStart) return;
    const dx = event.clientX - this.dragStart.x;
    const dy = event.clientY - this.dragStart.y;
    this.viewBoxBase[0] -= dx / this.scale;  
    this.viewBoxBase[1] -= dy / this.scale;  
    this.updateViewBox();
    this.dragStart = { x: event.clientX, y: event.clientY };
  }

  onMouseUp(): void {
    this.isDragging = false;
    this.dragStart = null;
  }

  onMouseLeave(): void {
    this.isDragging = false;
    this.dragStart = null;
  }

  getDatas() {
    this.base.getBigCities().subscribe((res)=>{
      this.datas=res
    })
  }
  getLakeDatas(){
    this.base.getLakeDatas().subscribe((res)=>{this.lakes =res})
  }
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
  convertDegreesMinutesToDecimal(degreesMinutes: string): number {
    const parts = degreesMinutes.split(':');
    const degrees = parseFloat(parts[0]);
    const minutes = parseFloat(parts[1]);
    return degrees + (minutes / 60);
  }
  
  addCirclesToSvg() {    

    const svgElement = document.getElementById('map1');
    if (!svgElement) {
      return;
    }
    const minLong = 16;
    const maxLong = 22;
    const minLat = 45;
    const maxLat = 49;
    const svgWidth = 1000;
    const svgHeight = 750;
    const offsetX = 35;
    const offsetY = 25;
  
    this.datas.forEach((helyseg: any) => {
      const helysegNev = helyseg['Helysegnev'];
      if (!helyseg['KH'] || !helyseg['ESZ']) {
        return;
      }
      const hossz = parseFloat(helyseg['KH']);
      const szel = parseFloat(helyseg['ESZ']);
      let hosszDecimal = isNaN(hossz) ? this.convertDegreesMinutesToDecimal(helyseg['keleti_hossz_fok_perc']) : hossz;
      let szelDecimal = isNaN(szel) ? this.convertDegreesMinutesToDecimal(helyseg['eszaki_szelesseg_fok_perc']) : szel;
      if (isNaN(hosszDecimal) || isNaN(szelDecimal)) {
        return;
      }
      const cx = (hosszDecimal - minLong) / (maxLong - minLong) * svgWidth + offsetX;
      const cy = svgHeight - ((szelDecimal - minLat) / (maxLat - minLat) * svgHeight) + offsetY;
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', cx.toString());
      circle.setAttribute('cy', cy.toString());
      circle.setAttribute('r', '3');
      circle.setAttribute('fill', 'grey');
      circle.setAttribute('stroke', 'black');
      circle.setAttribute('stroke-width', '10');
      circle.setAttribute('id', helysegNev);
      
      circle.addEventListener('mouseover', (event: MouseEvent) => {
        this.showText(event, helysegNev);
      });
  
      circle.addEventListener('mouseout', () => {
        this.hideText();
      });

      svgElement.appendChild(circle);
    });
  }
  addLakeCirclesToSvg()   {
    const svgElement = document.getElementById('map1');
    if (!svgElement) {
      return;
    }
  
    const minLong = 16;
    const maxLong = 22;
    const minLat = 45;
    const maxLat = 49;
    const svgWidth = 1000;
    const svgHeight = 750;
    const offsetX = 35;
    const offsetY = 25;
  
    console.log("Adatok Firebase-ből:", this.lakes);
  
    this.lakes.forEach((lake: any, index: number) => {
      if (!lake || typeof lake !== 'object' || !lake.coordinates) {
        console.warn(`Hibás adat az indexnél (${index}):`, lake);
        return;
      }
  
      const lakeName = lake['name'] || `Ismeretlen tó ${index}`;
      const hossz = parseFloat(lake.coordinates['longitude']);
      const szel = parseFloat(lake.coordinates['latitude']);
  
      // Ellenőrizzük, hogy léteznek-e a koordináták
      if (isNaN(hossz) || isNaN(szel)) {
        console.warn(`Hiányzó vagy érvénytelen koordináták: ${lakeName} (long: ${lake.coordinates['longitude']}, lat: ${lake.coordinates['latitude']})`);
        return;
      }
  
      const cx = (hossz - minLong) / (maxLong - minLong) * svgWidth + offsetX;
      const cy = svgHeight - ((szel - minLat) / (maxLat - minLat) * svgHeight) + offsetY;
  
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', cx.toString());
      circle.setAttribute('cy', cy.toString());
      circle.setAttribute('r', '5');
      circle.setAttribute('fill', 'blue');
      circle.setAttribute('stroke', 'black');
      circle.setAttribute('stroke-width', '1');
      circle.setAttribute('id', lakeName);
  
      circle.addEventListener('mouseover', (event: MouseEvent) => {
        this.showText(event, lakeName);
      });
  
      circle.addEventListener('mouseout', () => {
        this.hideText();
      });
  
      svgElement.appendChild(circle);
    });
  }
  showMap(): void {
    this.addCirclesToSvg();
    this.addLakeCirclesToSvg();
    this.currentMap = this.currentMap === 'map1' ? 'map2' : 'map1';
   
  }
}