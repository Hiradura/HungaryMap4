import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-side-panel',
  standalone: false,
  
  templateUrl: './side-panel.component.html',
  styleUrl: './side-panel.component.css'
})
export class SidePanelComponent {
  @Input() isOpen = false;  
  @Input() selectedRegion = '';
  @Input() redirectToRegion = '' 
  @Output() close = new EventEmitter<void>();
  bigCities: string[] = [];
  selectedCity: string | null = null;
  cityComments: { [key: string]: string[] } = {};
  
  constructor(private router:Router){}
  closePanel() {
    this.close.emit(); 
  }
  navigateToRegion() {
    if (this.selectedRegion) {
      const route = this.selectedRegion.toLowerCase();
      this.router.navigate([`/${route}`]);
    }
  }
  counties: { [key: string]: string[] } = {
    "Baranya": ["Pécs", "Komló", "Mohács", "Szigetvár", "Sellye", "Harkány", "Bóly", "Villány", "Szentlőrinc", "Pellérd"],
    "Bács-Kiskun": ["Kecskemét", "Baja", "Kalocsa", "Kiskunfélegyháza", "Kiskunhalas", "Lajosmizse", "Solt", "Tiszakécske", "Kunszentmiklós", "Izsák"],
    "Békés": ["Békéscsaba", "Gyula", "Orosháza", "Szarvas", "Mezőberény", "Szeghalom", "Tótkomlós", "Battonya", "Dévaványa", "Vésztő"],
    "Borsod-Abaúj-Zemplén": ["Miskolc", "Ózd", "Kazincbarcika", "Tiszaújváros", "Sátoraljaújhely", "Mezőkövesd", "Encs", "Edelény", "Tokaj", "Putnok"],
    "Csongrád-Csanád": ["Szeged", "Hódmezővásárhely", "Makó", "Szentes", "Csongrád", "Mórahalom", "Kistelek", "Sándorfalva", "Mindszent", "Balástya"],
    "Fejér": ["Székesfehérvár", "Dunaújváros", "Bicske", "Gárdony", "Mór", "Martonvásár", "Velence", "Pusztaszabolcs", "Polgárdi", "Enying"],
    "Győr-Moson-Sopron": ["Győr", "Mosonmagyaróvár", "Sopron", "Csorna", "Kapuvár", "Tét", "Pannonhalma", "Fertőd", "Jánossomorja", "Lébény"],
    "Hajdú-Bihar": ["Debrecen", "Hajdúszoboszló", "Berettyóújfalu", "Hajdúnánás", "Hajdúböszörmény", "Balmazújváros", "Püspökladány", "Nyíradony", "Téglás", "Derecske"],
    "Heves": ["Eger", "Gyöngyös", "Hatvan", "Füzesabony", "Heves", "Lőrinci", "Pétervására", "Recsk", "Verpelét", "Abasár"],
    "Jász-Nagykun-Szolnok": ["Szolnok", "Jászberény", "Törökszentmiklós", "Karcag", "Mezőtúr", "Kunszentmárton", "Tiszafüred", "Tiszaföldvár", "Újszász", "Fegyvernek"],
    "Komárom-Esztergom": ["Tatabánya", "Esztergom", "Komárom", "Oroszlány", "Dorog", "Nyergesújfalu", "Kisbér", "Ács", "Lábatlan", "Tokod"],
    "Nógrád": ["Salgótarján", "Balassagyarmat", "Pásztó", "Bátonyterenye", "Szécsény", "Rétság", "Bercel", "Romhány", "Érsekvadkert", "Nagyoroszi"],
    "Pest": ["Budapest", "Érd", "Vác", "Szentendre", "Dunakeszi", "Cegléd", "Gödöllő", "Nagykáta", "Vecsés", "Gyál", "Törökbálint"],
    "Somogy": ["Kaposvár", "Siófok", "Marcali", "Barcs", "Nagyatád", "Balatonlelle", "Balatonboglár", "Tab", "Lengyeltóti", "Csurgó"],
    "Szabolcs-Szatmár-Bereg": ["Nyíregyháza", "Mátészalka", "Kisvárda", "Fehérgyarmat", "Nagykálló", "Tiszavasvári", "Baktalórántháza", "Vásárosnamény", "Demecser", "Ibrány"],
    "Tolna": ["Szekszárd", "Paks", "Bonyhád", "Dombóvár", "Tamási", "Tolna", "Simontornya", "Nagymányok", "Dunaföldvár", "Bátaszék"],
    "Vas": ["Szombathely", "Kőszeg", "Sárvár", "Celldömölk", "Körmend", "Csepreg", "Őriszentpéter", "Jánosháza", "Vép", "Répcelak"],
    "Veszprém": ["Veszprém", "Ajka", "Tapolca", "Pápa", "Zirc", "Balatonfüred", "Balatonalmádi", "Sümeg", "Devecser", "Várpalota"],
    "Zala": ["Zalaegerszeg", "Nagykanizsa", "Keszthely", "Lenti", "Zalalövő", "Letenye", "Pacsa", "Zalakaros", "Sármellék", "Gelse"]
  };
  ngOnChanges() {
    this.updateBigCities();
  }

  updateBigCities() {
    if (this.selectedRegion) {
      this.bigCities = this.counties[this.selectedRegion] || [];
      this.selectedCity = null;
    }
  }

  selectCity(city: string) {
    this.selectedCity = city;
    if (!this.cityComments[city]) {
      this.cityComments[city] = [];
    }
  }

  addComment(commentInput: HTMLInputElement) {
    const comment = commentInput.value.trim();
    if (this.selectedCity && comment) {
      this.cityComments[this.selectedCity].push(comment);
      commentInput.value = '';
    }
  }



  closeCommentBox() {
    this.selectedCity = null;
  }


}
