import { Component, OnInit } from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {
  form: FormGroup;
  methods = [null, 'Casting', 'Fly fishing', 'Trolling', 'Net fishing', 'Pole fishing'];
  fish_species = ['Ahven', 'Kuha', 'Lahna'];
  lures = ['Jigi', 'Vaappu', 'Lusikka', 'Lippa'];
  isAdding = false;
  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      date: ['', Validators.required],
      location: ['', Validators.required],
      persons: ['', Validators.required],
      stats: this.formBuilder.array([
        this.formBuilder.group({
          fishing_method: ['', Validators.required],
          catches: this.formBuilder.array([
            this.formBuilder.group({
              fish_species: ['', Validators.required],
              fish_details: [''],
              lure: [''],
              lure_details: ['']
            })
          ])
        })
      ])
    });
  }

  get f() {return this.form.controls; }
  show(){
    console.log(this.f.stats.value);
  }
  // e.g. for accessing the value inside catches array this.f.stats.value[0].catches[0].lure
}
