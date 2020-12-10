import { Component, OnInit } from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FishingStatsService} from '@app/_services';
import {map} from 'rxjs/operators';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./list.component.css', './add.component.css']
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
  isCatches = false;
  submitted = false;

  constructor(private formBuilder: FormBuilder,
              private api: FishingStatsService,
              private route: ActivatedRoute,
              private router: Router) { }

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
      location: [null, Validators.required],
      location_details: [null],
      start_time: [null],
      end_time: [null],
      weather: [null],
      air_temperature: [null],
      persons: [null, Validators.required],
      stats: this.formBuilder.array([
        this.initStats()
      ])
    });
  }

  initStats(): FormGroup {
    return this.formBuilder.group({
        fishing_method: [null, Validators.required],
        lure: [null],
        lure_details: [''],
        catches: this.formBuilder.array([])
    });
  }

  initCatches(): FormGroup {
    return this.formBuilder.group({
        fish_species: ['', Validators.required],
        weight: [''],
        length: ['']
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
    // disable no catches checkbox
    const noCatchCheckBox = 'noCatches' + statIndex;
    if (control.length > 0) {
      document.getElementById(noCatchCheckBox).setAttribute('disabled', 'disabled');
    }
  }

  removeStat(statIndex): void {
    this.stats.removeAt(statIndex);
  }

  removeCatch(statIndex, catchIndex) {
    ((this.stats).at(statIndex).get('catches') as FormArray).removeAt(catchIndex);
    // enable no catches checkbox if there isn't catches in array
    const control = (this.stats).at(statIndex).get('catches') as FormArray;
    const noCatchCheckBox = 'noCatches' + statIndex;
    if (control.length === 0) {
      document.getElementById(noCatchCheckBox).removeAttribute('disabled');
    }
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
          weight: catchControl.get('weight').value,
          length: catchControl.get('length').value
        };
        catchesArr.push(catchObj);
      }
      const statObj = {
        fishing_method: statControl.get('fishing_method').value,
        lure: statControl.get('lure').value,
        lure_details: statControl.get('lure_details').value,
        catches: catchesArr
      };
      statsArr.push(statObj);
      catchesArr = [];
    }
    return {
      date: this.f.date.value,
      location: this.f.location.value,
      location_details: this.f.location_details.value,
      start_time: this.f.start_time.value,
      end_time: this.f.end_time.value,
      weather: this.f.weather.value,
      air_temperature: this.f.air_temperature.value,
      persons: this.f.persons.value,
      stats: statsArr
    };
  }

  disableAddCatch() {
    if (!this.isCatches) {
      document.getElementById('addCatchBtn').setAttribute('disabled', 'disabled');
    } else {
      document.getElementById('addCatchBtn').removeAttribute('disabled');
    }
    this.isCatches = !this.isCatches;
  }

  createEvent() {
   this.submitted = true;
   console.log(this.f);
   if (this.form.invalid) {
     return;
   }
   this.api.createEvent(this.createFishingEvent()).subscribe(
     data => {
       this.router.navigate(['events/']);
     }
   );
  }

}
