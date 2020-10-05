/**
 * consider moving form to own class. Its needed also at least in add component and probably even somewhere else
 */

import {Component, OnInit} from '@angular/core';
import {FishingEvent} from '@app/_models/fishing-event.model';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FishingStatsService} from '@app/_services';
import {ActivatedRoute, Router} from '@angular/router';
import {Catches} from '@app/_models/catches';

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
    this.initForm();
  }

  initForm(): void {
    if (this.methodIndex > -1) {
      console.log(this.methodIndex);
      const statObj = this.fishingEvent.stats[this.methodIndex];
      this.form = this.formBuilder.group({
        id: [statObj.id],
        fishing_method: [statObj.fishing_method, Validators.required],
        catches: this.initCatches(statObj.catches)
      });
    } else {
      this.form = this.formBuilder.group({
        fishing_method: ['', Validators.required],
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
      id: [null],
      fish_species: ['', Validators.required],
      fish_details: [''],
      lure: [''],
      lure_details: ['']
    });
  }

  get f() { return this.form.controls; }

  getCatches() { return this.form.get('catches') as FormArray; }

  addCatch() {
    const control = this.getCatches();
    console.log(control);
    control.push(this.initNewCatch());
  }

  removeCatch(catchIndex): void {
    this.getCatches().removeAt(catchIndex);
  }

  submit(): void {
    if (this.methodIndex > -1) {
      this.updateFishingEvent();
      this.api.updateFishingEvent(this.fishingEvent.id, this.fishingEvent).subscribe(
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

  updateFishingEvent(): void {
    const arr: Catches[] = [];
    for (const c of this.getCatches().controls) {
      const obj = {
        id: c.get('id').value,
        fish_species: c.get('fish_species').value,
        fish_details: c.get('fish_details').value,
        lure: c.get('lure').value,
        lure_details: c.get('lure_details').value
      };
      arr.push(obj);
    }
    this.fishingEvent.stats[this.methodIndex].fishing_method = this.f.fishing_method.value;
    this.fishingEvent.stats[this.methodIndex].catches = arr;
  }

  createNewStat() {
    const arr: Catches[] = [];
    for (const c of this.getCatches().controls) {
      const obj = {
        id: c.get('id').value,
        fish_species: c.get('fish_species').value,
        fish_details: c.get('fish_details').value,
        lure: c.get('lure').value,
        lure_details: c.get('lure_details').value
      };
      arr.push(obj);
    }
    return {
      fishing_method: this.f.fishing_method.value,
      catches: arr
    };
  }
}
