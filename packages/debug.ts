let numbers: number[] = [1, 2, 3, 1000];
let names: string[] = ['Sarah, Jane, Anna'];

console.table(numbers);
let sorted: string[] = [...names.sort()];
console.log(sorted);

let names2: string[] = names[0].split(', ');
let sorted2: string[] = names2.sort();
console.log(sorted2);
