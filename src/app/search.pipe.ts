import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search',
  standalone: false
})
export class SearchPipe implements PipeTransform {

  transform(datas: any[], word: string): any {
    if (!datas) return [];
    if (!word) return datas;

    word = word.toLowerCase();

    return datas.filter(
      (elem) => elem.Helysegnev && elem.Helysegnev.toLowerCase().includes(word)
    );
  }
}
