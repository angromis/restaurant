import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: 'app-tags',
  templateUrl: './tags.page.html',
  styleUrls: ['./tags.page.scss'],
})
export class TagsPage implements OnInit {

  id:any;

  constructor(private actRoute: ActivatedRoute,
    private router: Router) {
      this.id = this.actRoute.snapshot.paramMap.get('id');
      console.log(this.id);
     }

  ngOnInit() {
  }

}
