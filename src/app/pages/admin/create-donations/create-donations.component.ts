import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-create-donations',
  templateUrl: './create-donations.component.html',
  styleUrls: ['./create-donations.component.scss']
})
export class CreateDonationsComponent implements OnInit {
  pageTitle = 'Create Item';

  constructor(private title: Title) { }

  ngOnInit() {
    this.title.setTitle(this.pageTitle);
  }

}
