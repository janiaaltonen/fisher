/**
 * consider moving form to own class. Its needed also at least in add component and probably even somewhere else
 */

import { Component, OnInit } from '@angular/core';
import {FishingEvent} from '@app/_models/fishing-event.model';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FishingStatsService} from '@app/_services';
import {forkJoin} from 'rxjs';
import {filter, map, switchMap} from 'rxjs/operators';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  methodIndex: number;
  fishingEvent = new FishingEvent();
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
    console.log(this.methodIndex);
    this.api.getFormOptions().subscribe(
      data => {
        this.methods = data.fishing_methods;
        this.fishSpecies = data.catches;
        this.lures = data.lures;
      }
    );
    // get the current fishingEvent from router state attribute
    this.fishingEvent = history.state.data;
    console.log(this.fishingEvent.stats[0]);
    console.log(this.fishingEvent);
    this.form = this.formBuilder.group({
      date: [this.fishingEvent.date, Validators.required],
      location: [this.fishingEvent.location, Validators.required],
      persons: [this.fishingEvent.persons, Validators.required],
      stats: this.initStats()
    });
  }

  initForm(): void {
    const statObj = this.fishingEvent.stats[this.methodIndex];
    this.form = this.formBuilder.group({
      id: [statObj.id],
      fishing_method: [statObj.fishing_method, Validators.required],
      catches: this.initCatches(statObj)
    });
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

  initCatches(catchesArr): FormArray {
    const arr = this.formBuilder.array([]);
    for (const obj of catchesArr) {
      const group = this.formBuilder.group({
        id: [obj.id],
        fish_species: [obj.fish_species, Validators.required],
        fish_details: [obj.fish_details],
        lure: [obj.lure],
        lure_details: [obj.lure_details]
      });
      arr.push(group);
    }
    return arr;
  }

  initNewCatch(): FormGroup {
    return this.formBuilder.group({
      fish_species: ['', Validators.required],
      fish_details: [''],
      lure: [''],
      lure_details: ['']
    });
  }

  get f() { return this.form.controls; }

  get stats(): FormArray { return this.form.get('stats') as FormArray; }

  getCatch()  { return this.stats.at(this.methodIndex).get('catches') as FormArray; }

  getCatches(stats): FormArray { return stats.get('catches') as FormArray; }

  addCatch(index) {
    const control = (this.stats).at(index).get('catches') as FormArray;
    console.log(control);
    control.push(this.initNewCatch());
  }

  removeCatch(statIndex, catchIndex): void {
    ((this.stats).at(statIndex).get('catches') as FormArray).removeAt(catchIndex);
  }

  submit(): void {
    this.api.updateFishingEvent(this.fishingEvent.id, this.updateFishingEvent()).subscribe(
      resp => {
        this.router.navigate([`events/details/${this.fishingEvent.id}/`]);
      }
    );
  }

  updateFishingEvent() {
    // creates specified json from form values
    const statsArr = [];
    let catchesArr = [];
    let catchObj = {};
    for (const statControl of this.stats.controls) {
      for (const catchControl of this.getCatches(statControl).controls) {
        if (catchControl.get('id') !== null) {
          catchObj = {
            id: catchControl.get('id').value,
            fish_species: catchControl.get('fish_species').value,
            fish_details: catchControl.get('fish_details').value,
            lure: catchControl.get('lure').value,
            lure_details: catchControl.get('lure_details').value
          };
        }
        else {
          catchObj = {
            fish_species: catchControl.get('fish_species').value,
            fish_details: catchControl.get('fish_details').value,
            lure: catchControl.get('lure').value,
            lure_details: catchControl.get('lure_details').value
          };
        }
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
}
