import { Component, OnInit } from '@angular/core';
import {FishingEvent} from '@app/_models/fishing-event.model';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  fishingEvent = new FishingEvent();
  form: FormGroup;
  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    // get the current fishingEvent from router state attribute
    this.fishingEvent = history.state.data;
    console.log(this.fishingEvent);
    this.form = this.formBuilder.group({
      fishing_method: [this.fishingEvent.stats[0].fishing_method, Validators.required],
      catches: this.addCatchesFormArray()
    });
  }
  addCatchesFormArray(): FormArray {
    const arr = this.formBuilder.array([]);
    for (const c of this.fishingEvent.stats[0].catches) {
      const group = this.formBuilder.group({
        id: [c.id],
        fish_species: [c.fish_species, Validators.required],
        fish_details: [c.fish_details],
        lure: [c.lure],
        lure_details: [c.lure_details]
      });
      arr.push(group);
    }
    return arr;
  }
}
