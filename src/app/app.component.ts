import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule, ReactiveFormsModule, MatRadioModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  formFields: any;

  myForm: FormGroup = this.fb.group({});   

  constructor(
    private http: HttpClient,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.http.get<any>("/assets/json/formfields.json").subscribe((data: any) => {
      this.formFields = data;
      this.generateFields();
      console.log(this.formFields, "forms");
    });
  }

  generateFields() {
    let fg: Record<string, any> = {};
    this.formFields.field.forEach((field: any) => {
      let validators: Validators[] = [];
      field.validators?.forEach((validator: any) => {
        switch(validator.validator) {
          case 'required': { validators.push(Validators.required); break;}
          case 'email': { validators.push(Validators.email); break;}
          case 'minLength': { validators.push(Validators.minLength(validator.minLength? validator.minLength : 1)); break;}
          case 'maxLength': { validators.push(Validators.maxLength(validator.maxLength? validator.maxLength : 1)); break;}
          case 'pattern': { validators.push(Validators.pattern(validator.pattern ? validator.pattern : '')); break;}
        }
      });
      fg[field.controlName] = [field.value || '', validators];
    });
    this.myForm = this.fb.group(fg);
    console.log("myForm", this.myForm);
  }

  validateForm() {
    if (this.myForm.invalid) {
      const fields = Object.keys(this.myForm.controls);
      for(let i = 0; i < fields.length; i++) {
        const control = this.myForm.get(fields[i]);
        const controlSettings = this.formFields.field.filter((f: any) => f.controlName == fields[i])[0];
        if (control && control.invalid) {
          const error = Object.keys(control.errors as any)[0];
          let message = controlSettings.validators.filter((fv: any) => fv.validator.toLowerCase() == error.toLowerCase())[0].message;
          alert(message);
          break;
        }
      }
      // fields.forEach(field => {
        
      // });
    } else {
      alert('Form Submitted');
      console.log("Submit Form:", this.myForm.value);
      this.myForm.reset();
    }
  }

  formAction(action: string) {
    switch(action) {
      case 'submit':
        this.validateForm();
        break;
      default:
        break;
    }
  }

}