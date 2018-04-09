import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-create-donations1',
  templateUrl: './create-donations1.component.html',
  styleUrls: ['./create-donations1.component.scss']
})
export class CreateDonations1Component implements OnInit {
  pageTitle = 'Create Item';

  constructor(private title: Title) { }

  ngOnInit() {
    this.title.setTitle(this.pageTitle);
  }

}
