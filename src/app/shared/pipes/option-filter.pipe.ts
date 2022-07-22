import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'optionFilter' })
export class OptionFilterPipe implements PipeTransform {
 
  public transform(data: any[], searchText: any, fieldName: string): any {
  if (searchText == null || data == null || searchText === '') {
    return data;
  }
  return data.filter(item => item[fieldName]?.toString()?.toLowerCase().indexOf(searchText?.toString()?.toLowerCase()) !== -1);
  }
}
