import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcessoBloqueadoComponent } from './acesso-bloqueado.component';

describe('AcessoBloqueadoComponent', () => {
  let component: AcessoBloqueadoComponent;
  let fixture: ComponentFixture<AcessoBloqueadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcessoBloqueadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcessoBloqueadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
