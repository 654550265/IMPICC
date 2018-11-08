import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'appFilerPip',
})
export class AppFilerPipPipe implements PipeTransform {
    transform(value: any, exponent: string, num): any {
        console.log(num);
        let a = [];
        if (exponent == undefined) {
            a = value;
        } else {
            for (let k of value) {
                if ((num == 0 ? k.Name : k.name.FramName).indexOf(exponent) >= 0) {
                    a.push(k);
                }
            }
        }
        return a;
    }
}
