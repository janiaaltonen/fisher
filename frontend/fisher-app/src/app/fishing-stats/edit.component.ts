/**
 * consider moving form to own class. Its needed also at least in add component and probably even somewhere else
 */

import {Component, OnInit} from '@angular/core';
import {FishingEvent} from '@app/_models/fishing-event.model';
import {AbstractControl, FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FishingStatsService} from '@app/_services';
import {ActivatedRoute, Router} from '@angular/router';
import {Catches} from '@app/_models/catches';
import {Stats} from '@app/_models/stats';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./list.component.css', './add.component.css']
})
export class EditComponent implements OnInit {
  methodIndex: number;
  fishingEvent: FishingEvent;
  eventStat: Stats;
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

  constructor(private formBuilder: FormBuilder, private api: FishingStatsService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.methodIndex = this.route.snapshot.params.methodIndex;
    this.api.getFormOptions().subscribe(
      data => {
        this.methods = data.fishing_methods;
        this.fishSpecies = data.catches;
        this.lures = data.lures;
      }
    );
    // get the current fishingEvent from router state attribute
    this.fishingEvent = history.state.data;
    this.eventStat = this.fishingEvent.stats[this.methodIndex];
    this.initForm();
  }

  initForm(): void {
    if (this.methodIndex > -1) {
      this.form = this.formBuilder.group({
        id: [this.eventStat.id],
        fishing_method: [this.eventStat.fishing_method, Validators.required],
        lure: [this.eventStat.lure],
        lure_details: [this.eventStat.lure_details],
        catches: this.initCatches(this.eventStat.catches)
      });
    } else {
      this.form = this.formBuilder.group({
        fishing_method: ['', Validators.required],
        lure: [''],
        lure_details: [''],
        catches: this.formBuilder.array([])
      });
    }
  }

  initStats(): FormArray {
    const arr = this.formBuilder.array([]);
    for (const stat of this.fishingEvent.stats) {
      const group = this.formBuilder.group({
        id: [stat.id],
        fishing_method: [stat.fishing_method, Validators.required],
        catches: this.initCatches(stat.catches)
      });
      arr.push(group);
    }
    return arr;
  }

  get date() {
    if (this.fishingEvent) {
      return this.fishingEvent.date;
    }
    return null;
  }

  get startTime() {
    if (this.fishingEvent.start_time) {
      return this.fishingEvent.start_time.substring(0, 5);
    }
  }

  get endTime() {
    if (this.fishingEvent.end_time) {
      return this.fishingEvent.end_time.substring(0, 5);
    }
  }

  initCatches(catchesArr): FormArray {
    const arr = this.formBuilder.array([]);
    for (const obj of catchesArr) {
      const group = this.formBuilder.group({
        id: [obj.id],
        fish_species: [obj.fish_species, Validators.required],
        weight: [obj.weight],
        length: [obj.length]
      });
      arr.push(group);
    }
    return arr;
  }

  initNewCatch(): FormGroup {
    return this.formBuilder.group({
      id: [null],
      fish_species: ['', Validators.required],
      weight: [null],
      length: [null]
    });
  }

  get f() { return this.form.controls; }

  getCatches() { return this.form.get('catches') as FormArray; }

  addCatch() {
    const control = this.getCatches();
    control.push(this.initNewCatch());
  }

  copyToNewCatch() {
    const newCatch = this.initNewCatch();
    const control = this.getCatches();
    const lastControl = control.controls[control.length - 1];
    // copy values from last catch to new catch except id
    newCatch.patchValue({
      fish_species: lastControl.get('fish_species').value,
      weight: lastControl.get('weight').value,
      length: lastControl.get('length').value
    });
    control.push(newCatch);
  }

  removeCatch(catchIndex): void {
    this.getCatches().removeAt(catchIndex);
  }

  submit(): void {
    this.checkControls(this.getCatches().controls);
    if (this.form.invalid) {
      return;
    }
    // weight and length needs to be checked that they are numbers
    // console.log(this.form.dirty);
    if (this.methodIndex > -1) {
      console.log(this.f);
      this.updateEventStat();
      console.log(this.eventStat);
      this.api.updateStat(this.fishingEvent.id, this.eventStat).subscribe(
        resp => {
          this.router.navigate([`events/details/${this.fishingEvent.id}/`]);
        }
      );
    } else {
      this.api.createStat(this.fishingEvent.id, this.createNewStat()).subscribe(
        resp => {
          this.router.navigate([`events/details/${this.fishingEvent.id}/`]);
        }
      );
    }
  }

  updateEventStat(): void {
    const arr: Catches[] = [];
    for (const c of this.getCatches().controls) {
      const obj = {
        id: c.get('id').value,
        fish_species: c.get('fish_species').value,
        weight: c.get('weight').value,
        length: c.get('length').value,
      };
      arr.push(obj);
    }
    this.eventStat.fishing_method = this.f.fishing_method.value;
    this.eventStat.lure = this.f.lure.value;
    this.eventStat.lure_details = this.f.lure_details.value;
    this.eventStat.catches = arr;
  }

  createNewStat() {
    const arr: Catches[] = [];
    for (const c of this.getCatches().controls) {
      const obj = {
        id: c.get('id').value,
        fish_species: c.get('fish_species').value,
        weight: c.get('weight').value,
        length: c.get('length').value
      };
      arr.push(obj);
    }
    return {
      fishing_method: this.f.fishing_method.value,
      lure: this.f.lure.value,
      lure_details: this.f.lure_details.value,
      catches: arr
    };
  }

  checkControls(controls: AbstractControl[]): void {
    /**
     * this implementation is quite ugly. Make it better when have time and go through this with more time
     */
    let sWeight: string;
    let sLength: string;
    controls.filter((control) => {
      if (control.get('weight').value) {
        sWeight = String(control.get('weight').value);
        if (sWeight.indexOf(',') > -1) {
          sWeight = sWeight.replace(',', '.');
          if (!Number.isNaN(Number(sWeight))) {
            control.patchValue( {
              weight: sWeight
            });
          } else {
            control.setErrors({
              incorrect: true
            });
          }
        } else if (Number.isNaN(Number(sWeight))){
          console.log('isNan');
          control.setErrors({
            incorrect: true
          });
        }
      } else {
        control.patchValue({
          weight: null
        });
      }
      if (control.get('length').value) {
        sLength = String(control.get('length').value);
        if (sLength.indexOf(',') > -1) {
          sLength = sLength.replace(',', '.');
          if (!Number.isNaN(Number(sLength))) {
            control.patchValue({
              length: sLength
            });
          } else {
            control.setErrors({
              incorrect: true
            });
          }
        } else if (Number.isNaN(Number(sLength))) {
          control.setErrors({
            incorrect: true
          });
        }
      } else {
        control.patchValue({
          length: null
        });
      }
    });
  }
}
