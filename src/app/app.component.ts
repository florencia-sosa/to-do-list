import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public toDOListNotFinalized!: Map<number, ToDo>;
  public toDOListFinalized!: Map<number, ToDo>;
  public percentage = 0 ;

  public date =  new Date();

  public item = new FormControl('', toDoValueValidator());

  public ngOnInit(): void {
    this.buildCollections();
    this.percentageOfTasksCompleted();


  }

  private buildCollections(): void {
    const notFinalized = JSON.parse(localStorage.getItem('not-finalized') ?? '[]');
    const finalized = JSON.parse(localStorage.getItem('finalized') ?? '[]');
    const percentage = JSON.parse(localStorage.getItem('percentage') ?? '[]');
    this.toDOListNotFinalized = new Map(notFinalized);
    this.toDOListFinalized = new Map(finalized);
  }

  private saveToLocalStorage(): void {
    const notFinalized = JSON.stringify(Array.from(this.toDOListNotFinalized.entries()).slice());
    const finalized = JSON.stringify(Array.from(this.toDOListFinalized.entries()));

    localStorage.setItem('not-finalized', notFinalized);
    localStorage.setItem('finalized', finalized);
  }

  public addToDo() {
    const id = Date.now();
    this.toDOListNotFinalized.set(id, { value: this.item.value!, id, status: 'not-finalized' });
    this.item.setValue('');
    this.percentageOfTasksCompleted()
    this.saveToLocalStorage();
  }


  public markToDoAsFinalized(item: ToDo): void {
    item.status = 'finalized';
    setTimeout(() => this.itemFinalized(item), 500);
    let size = this.toDOListFinalized.size
    if (size > 5) {
      const firstElement = Array.from(this.toDOListFinalized.keys())[0];
      this.toDOListFinalized.delete(firstElement)
    }
   
  }

  public deleteItem(item: ToDo) {
    this.toDOListNotFinalized.delete(item.id);
    this.toDOListNotFinalized;
    this.percentageOfTasksCompleted();
    this.saveToLocalStorage();
  }
  public deleteList():void{
    this.toDOListFinalized.clear()
    this.saveToLocalStorage()
    this.percentageOfTasksCompleted();
  }

  private itemFinalized(item: ToDo) {
    this.toDOListNotFinalized.delete(item.id);
    this.toDOListFinalized.set(item.id, item);
    this.percentageOfTasksCompleted();
    this.saveToLocalStorage();
  }

  public percentageOfTasksCompleted() {
    const a = this.toDOListNotFinalized.size ?? 0;
    const b = this.toDOListFinalized.size ?? 0;
    const total = a + b;

     this.percentage = (b * 100) / total
    console.log('total:', total, 'resueltas:', b, 'no resueltas', a, this.percentage)

  }
}

export interface ToDo {
  value: string;
  id: number;
  status: 'finalized' | 'not-finalized'
}

export const toDoValueValidator = (): ValidatorFn => (control: AbstractControl): ValidationErrors | null => {
  const isValid = !!control.value.trim();
  return isValid ? null : { wrongValue: { value: control.value } };
};