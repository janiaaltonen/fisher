import { Component, OnInit } from '@angular/core';
import {FishingEvent} from '@app/_models/fishing-event.model';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FishingStatsService} from '@app/_services';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  fishingEvent = new FishingEvent();
  tempFishingEvent = this.fishingEvent;
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

  constructor(private formBuilder: FormBuilder, private api: FishingStatsService) { }

  ngOnInit(): void {
    this.api.getFormOptions().subscribe(
      data => {
        this.methods = data.fishing_methods;
        this.fishSpecies = data.catches;
        this.lures = data.lures;
      }
    );
    // get the current fishingEvent from router state attribute
    this.fishingEvent = history.state.data;
    console.log(this.fishingEvent);
    this.form = this.formBuilder.group({
      date: [this.fishingEvent.date, Validators.required],
      location: [this.fishingEvent.location, Validators.required],
      persons: [this.fishingEvent.persons, Validators.required],
      stats: this.initStats()
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

  getCatches(stats): FormArray { return stats.get('catches') as FormArray; }

  addCatch(index) {
    const control = (this.stats).at(index).get('catches') as FormArray;
    console.log(control);
    control.push(this.initNewCatch());
  }

  removeCatch(statIndex, catchIndex): void {
    const removedId = ((this.stats).at(statIndex).get('catches') as FormArray).at(catchIndex).get('id').value;
    ((this.stats).at(statIndex).get('catches') as FormArray).removeAt(catchIndex);
  }
}
