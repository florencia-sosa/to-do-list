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

  public item = new FormControl('', toDoValueValidator());

  public ngOnInit(): void {
    this.buildCollections();
  }

  private buildCollections(): void {
    const notFinalized = JSON.parse(localStorage.getItem('not-finalized') ?? '[]');
    const finalized = JSON.parse(localStorage.getItem('finalized') ?? '[]');
    this.toDOListNotFinalized = new Map(notFinalized);
    this.toDOListFinalized = new Map(finalized);
  }

  private saveToLocalStorage(): void {
    const notFinalized = JSON.stringify(Array.from(this.toDOListNotFinalized.entries()));
    const finalized = JSON.stringify(Array.from(this.toDOListFinalized.entries()));

    localStorage.setItem('not-finalized', notFinalized);
    localStorage.setItem('finalized', finalized);

  }

  public addToDo() {
    const id = Date.now();
    this.toDOListNotFinalized.set(id, { value: this.item.value!, id, status: 'not-finalized' });
    this.item.setValue('');
    this.saveToLocalStorage();
  }

  public markToDoAsFinalized(item: ToDo): void {
    item.status = 'finalized';
    this.toDOListNotFinalized.delete(item.id);
    this.toDOListFinalized.set(item.id, item);
    this.saveToLocalStorage();
  }

}

export interface ToDo {
  value: string;
  id: number;
  status: 'finalized' | 'not-finalized'
}

const toDoValueValidator = (): ValidatorFn => (control: AbstractControl): ValidationErrors | null => {
  const isValid = !!control.value.trim();
  return isValid ? null : { wrongValue: { value: control.value } };
};