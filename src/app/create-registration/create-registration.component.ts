

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { ApiService } from '../services/api.service';
import { User } from '../models/register.model';


@Component({
  selector: 'app-create-registration',
  templateUrl: './create-registration.component.html',
  styleUrls: ['./create-registration.component.scss']
})
export class CreateRegistrationComponent implements OnInit {
  public packages: string[] = ['Monthly', 'Quarterly', 'Yearly'];
  public gneders: string[] = ['Male', 'Female'];
  public importantList: string[] = [
    "Toxic Fat reduction",
    "Energy and Endurance",
    "Building Lean Muscle",
    "Healthier Digestive System",
    "Sugar Craving Body",
    "Fitness"];
  public registerform!: FormGroup
  public userIdToUpdate!: number;
  public isUpdateAcitve: boolean = false;

  constructor(private fb: FormBuilder, private api: ApiService, private toastService: NgToastService, private activeRoute: ActivatedRoute, private router: Router) { }
  ngOnInit(): void {
    this.registerform = this.fb.group({
      firstName: [''],
      lastName: [''],
      email: [''],
      mobile: [''],
      weight: [''],
      height: [''],
      bmi: [''],
      bmiResult: [''],
      gender: [''],
      requireTrainer: [''],
      package: [''],
      important: [''],
      haveGymBefore: [''],
      enquiryDate: ['']
    })
    this.registerform.controls['height'].valueChanges.subscribe(res => {
      this.calculateBmi(res);
    });
    this.activeRoute.params.subscribe(val => {
      this.userIdToUpdate = val['id']
      this.api.getRegisteredUserId(this.userIdToUpdate)
        .subscribe(res => {
          this.isUpdateAcitve = true;
          this.fillFormToUpdate(res)
        })

    });
  }

  submit() {
    this.api.postRegistration(this.registerform.value)
      .subscribe((_res: any) => {
        this.toastService.success({ detail: 'SUCCESS', summary: 'Registration Successful', duration: 3000 });
        this.registerform.reset();
      });
  }
  update() {
    this.api.updateRegisterUser(this.registerform.value, this.userIdToUpdate)
      .subscribe(res => {
        this.toastService.success({ detail: 'SUCCESS', summary: 'User Details Updated Successful', duration: 3000 });
        this.router.navigate(['list']);
        this.registerform.reset();
      });
  }
  calculateBmi(_value: number) {
    const weight = this.registerform.value.weight;
    const height = this.registerform.value.height;
    const bmi = weight / (height * height);
    this.registerform.controls['bmi'].patchValue(bmi);
    switch (true) {
      case bmi < 18.5:
        this.registerform.controls['bmiResult'].patchValue('Underweight')
        break;
      case (bmi >= 18.5 && bmi > 25):
        this.registerform.controls['bmiResult'].patchValue('Normalweight')
        break;
      case (bmi >= 25 && bmi > 30):
        this.registerform.controls['bmiResult'].patchValue('Overweight')
        break;
      default:
        this.registerform.controls['bmiResult'].patchValue('obses');
        break;
    }
  }
  fillFormToUpdate(user: User) {
    this.registerform.setValue({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      mobile: user.mobile,
      weight: user.weight,
      height: user.height,
      bmi: user.bmi,
      bmiResult: user.bmiResult,
      gender: user.gender,
      requireTrainer: user.requireTrainer,
      package: user.package,
      important: user.important,
      haveGymBefore: user.haveGymBefore,
      enquiryDate: user.enquiryDate
    })
  }
}

