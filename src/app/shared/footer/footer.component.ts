import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  ano:any;
  constructor() { }
  // public version: string = environment.VERSION;
  ngOnInit() {
    this.ano = new Date().getUTCFullYear();
    // this.version == environment.VERSION;
  }

}
