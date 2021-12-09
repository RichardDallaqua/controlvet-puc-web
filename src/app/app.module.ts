//Modules
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

//Components
import { ProcedimentoComponent } from './cadastro/procedimento/procedimento.component';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { MenuComponent } from './menu/menu.component';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { ComponenteBasicoComponent } from './shared/componente-basico/componente-basico.component';
import { CarregandoComponent } from './shared/carregando/carregando.component';
import { TituloTelaComponent } from './shared/titulo-tela/titulo-tela.component';
import { RelatorioAtendimentoComponent } from './relatorios/relatorio-atendimento/relatorio-atendimento.component';
import { AcessoBloqueadoComponent } from './shared/acesso-bloqueado/acesso-bloqueado.component';
import { ProdutoComponent } from './cadastro/produto/produto.component'
import { PerfilComponent } from './cadastro/perfil/perfil.component';
import { SalaComponent } from './cadastro/sala/sala.component';
import { TutorComponent } from './cadastro/tutor/tutor.component';
import { AgendamentoComponent } from './atendimento/agendamento/agendamento.component';
import { ConsultaComponent } from './atendimento/consulta/consulta.component';
import { RelatorioFinanceiroComponent } from './relatorios/relatorio-financeiro/relatorio-financeiro.component';

//Services
import { LoginService } from './login/login.service';
import { UsuarioComponent } from './cadastro/usuario/usuario.component';
import { UsuarioService } from './cadastro/usuario/usuario.service';
import { PerfilService } from './cadastro/perfil/perfil.service';
import { UtilsService } from './common/utils/utils.service';
import { ValidacaoService } from './common/validacao/validacao.service';
import { ProdutoService } from './cadastro/produto/produto.service';
import { ProcedimentoService } from './cadastro/procedimento/procedimento.service';
import { SalaService } from './cadastro/sala/sala.service'
import { TutorService } from './cadastro/tutor/tutor.service';
import { AtendimentoService } from './relatorios/relatorio-atendimento/relatorio-atendimento.service';
import { AgendamentoService } from './atendimento/agendamento/agendamento.service';
import { ConsultaService } from './atendimento/consulta/consulta.service';
import { FinanceiroService } from './relatorios/relatorio-financeiro/relatorio-financeiro.service';

//Terceiros
import { TableModule } from 'primeng/table';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FormsModule }   from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog'
import { ProgressSpinnerModule} from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { NgChartsModule } from 'ng2-charts';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { SpinnerModule } from 'primeng/spinner';

const maskConfig: Partial<IConfig> = {
  validation: false,
};

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MenuComponent,
    HeaderComponent,
    FooterComponent,
    RelatorioAtendimentoComponent,
    UsuarioComponent,
    ComponenteBasicoComponent,
    CarregandoComponent,
    AcessoBloqueadoComponent,
    ProcedimentoComponent,
    PerfilComponent,
    TituloTelaComponent,
    ProcedimentoComponent,
    ProdutoComponent,
    SalaComponent,
    TutorComponent,
    AgendamentoComponent,
    ConsultaComponent,
    RelatorioFinanceiroComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    TableModule,
    CheckboxModule,
    RadioButtonModule,
    FormsModule,
    DropdownModule,
    BrowserAnimationsModule,
    ConfirmDialogModule,    
    ProgressSpinnerModule,
    ToastModule,
    NgxMaskModule.forRoot(maskConfig),
    NgChartsModule,
    AutoCompleteModule,
    SpinnerModule
  ],
  providers: [
    LoginService,
    UsuarioService,
    UtilsService,
    ValidacaoService,
    ConfirmationService,
    MessageService,
    PerfilService,
    ProcedimentoService,
    ProdutoService,
    SalaService,
    TutorService,
    AtendimentoService,
    AgendamentoService,
    ConsultaService,
    FinanceiroService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
