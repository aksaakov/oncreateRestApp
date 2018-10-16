import { Component } from '@angular/core';
import { IonicPage, ViewController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

/**
 * Component to input credit card name
 */
@IonicPage()
@Component({
  selector: 'credit-card-input',
  templateUrl: 'credit_card_input.html',
})
export class CreditCardInput {
  public cardForm: FormGroup;

  constructor(
    private viewCtrl: ViewController,
    private builder: FormBuilder
  ) {
      this.cardForm = this.builder.group({
        number: ['', Validators.required],
        expMonth: ['', Validators.required],
        expYear: ['', Validators.required],
        cvc: ['', Validators.required]
      });
  }

  pay() {
    this.viewCtrl.dismiss({
      number: this.cardForm.value.number,
      expMonth: this.cardForm.value.expMonth,
      expYear: this.cardForm.value.expYear,
      cvc: this.cardForm.value.cvc
    });
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }

}
