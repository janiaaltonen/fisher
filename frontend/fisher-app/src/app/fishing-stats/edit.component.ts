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
  catchesToDelete = [];
  statsToDelete = [];

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

  removeStat(statIndex): void {
    const statControl = this.stats.at(statIndex);
    if (statControl.get('id').value !== -1) {
      const statObj = {
        id: statControl.get('id').value,
        fishing_method: statControl.get('fishing_method').value,
        catches: statControl.get('catches').value
      };
      this.statsToDelete.push(statObj);
      console.log(statObj);
    }
    this.stats.removeAt(statIndex);
  }

  removeCatch(statIndex, catchIndex): void {
    const catchControl = ((this.stats).at(statIndex).get('catches') as FormArray).at(catchIndex);
    if (catchControl.get('id').value !== -1) {
      const catchObj = {
        id: catchControl.get('id').value,
        fish_species: catchControl.get('fish_species').value,
        fish_details: catchControl.get('fish_details').value,
        lure: catchControl.get('lure').value,
        lure_details: catchControl.get('lure_details').value
      };
      this.catchesToDelete.push(catchObj);
    }
    ((this.stats).at(statIndex).get('catches') as FormArray).removeAt(catchIndex);
  }

  submit(): void {
    /**
     * delete wanted stats from backend
     * check duplicate catches between stats -> catches and catchesToRemove [], if there are any, remove them
     * delete remaining wanted catches from backend
     * update event with new data or/and add new stats and catches to it
     * how to implement multiple delete ops? in body of delete request? chaining multiple delete ops?
     */
    // button (method) should only be active if the form data has changed
    if (this.statsToDelete.length > 0) {
      this.removeDuplicateCatches();
      if (this.statsToDelete.length === 1) {
        // make only one DELETE request
      } else {
        // make bulk DELETE in body of delete request?
      }
    }
    if (this.catchesToDelete.length > 0) {
      if (this.catchesToDelete.length === 1) {
        const catchId = this.catchesToDelete[0].id;
        // make only one DELETE request
      } else {
        // make bulk DELETE request
      }
    }
    // after deletions make PUT call to backend
  }

  removeDuplicateCatches(): void {
    for (const statObj of this.statsToDelete) {
      for (const catchObj of statObj.catches) {
        const i = this.catchesToDelete.findIndex(x => x.id === catchObj.id);
        if (i !== -1) {
          this.catchesToDelete.splice(i, 1);
        }
      }
    }
  }
}
