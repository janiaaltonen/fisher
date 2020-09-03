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
        this.initStats()
      ])
    });
  }

  initStats(): FormGroup {
    return this.formBuilder.group({
        fishing_method: ['', Validators.required],
        catches: this.formBuilder.array([
          this.initCatches()
        ])
    });
  }

  initCatches(): FormGroup {
    return this.formBuilder.group({
        fish_species: ['', Validators.required],
        fish_details: [''],
        lure: [''],
        lure_details: ['']
    });
  }

  addStat() {
    const control = this.stats;
    control.push(this.initStats());
  }

  addCatch(statIndex) {
    const control = (this.stats).at(statIndex).get('catches') as FormArray;
    control.push(this.initCatches());
  }

  get f() { return this.form.controls; }
  get stats() { return this.form.get('stats') as FormArray; }
  getCatches(stats) { return stats.get('catches') as FormArray; }

  testCheck() {
    // console.log(this.f.stats.value);
    const a = (this.form.get('stats') as FormArray).at(0);
    const control = (this.form.controls.stats as FormArray).at(0).get('catches') as FormArray;
    console.log(a);
  }

}
