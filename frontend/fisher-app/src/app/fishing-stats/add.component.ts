import { Component, OnInit } from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FishingStatsService} from '@app/_services';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {
  form: FormGroup;
  emptyArr = [
    {
      key: '',
      value: ''
    }
  ];
  methods = this.emptyArr;
  fishSpecies = this.emptyArr;
  lures = this.emptyArr;
  isAdding = false;
  submitted = false;

  constructor(private formBuilder: FormBuilder, private api: FishingStatsService) { }

  ngOnInit(): void {
    this.api.getFormOptions().subscribe(
        data => {
          this.methods = data.fishing_methods;
          this.fishSpecies = data.catches;
          this.lures = data.lures;
    }
    );
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
    // get clicked catches parent formArray and push new catches formArray to that
    const control = (this.stats).at(statIndex).get('catches') as FormArray;
    control.push(this.initCatches());
  }
  removeCatch(statIndex, catchIndex) {
    ((this.stats).at(statIndex).get('catches') as FormArray).removeAt(catchIndex);
  }

  get f() { return this.form.controls; }

  get stats(): FormArray { return this.form.get('stats') as FormArray; }

  getCatches(stats): FormArray { return stats.get('catches') as FormArray; }

  createFishingEvent() {
    // creates specified json from form values
    const statsArr = [];
    let catchesArr = [];
    for (const statControl of this.stats.controls) {
      for (const catchControl of this.getCatches(statControl).controls) {
        const catchObj = {
          fish_species: catchControl.get('fish_species').value,
          fish_details: catchControl.get('fish_details').value,
          lure: catchControl.get('lure').value,
          lure_details: catchControl.get('lure_details').value
        };
        catchesArr.push(catchObj);
      }
      const statObj = {
        fishing_method: statControl.get('fishing_method').value,
        catches: catchesArr
      };
      statsArr.push(statObj);
      catchesArr = [];
    }
    return {
      date: this.f.date.value,
      location: this.f.location.value,
      persons: this.f.persons.value,
      stats: statsArr
    };
  }

  createEvent() {
   console.log('aa');
   this.submitted = true;
   console.log(this.f);
   if (this.form.invalid) {
     return;
   }
   this.api.createEvent(this.createFishingEvent()).subscribe(
     data => {
       console.log('success');
     }
   );
  }

}
