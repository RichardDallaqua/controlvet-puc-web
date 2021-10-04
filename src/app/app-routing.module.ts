import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsuarioComponent } from './cadastro/usuario/usuario.component';
import { PerfilComponent } from './cadastro/perfil/perfil.component';
import { LoginComponent } from './login/login.component';
import { RelatorioAtendimentoComponent } from './relatorios/relatorio-atendimento/relatorio-atendimento.component';
import { RelatorioFinanceiroComponent } from './relatorios/relatorio-financeiro/relatorio-financeiro.component';
import { ProcedimentoComponent } from './cadastro/procedimento/procedimento.component';
import { ProdutoComponent } from './cadastro/produto/produto.component';
import { SalaComponent } from './cadastro/sala/sala.component';
import { TutorComponent } from './cadastro/tutor/tutor.component';
import { AgendamentoComponent } from './atendimento/agendamento/agendamento.component';
import { ConsultaComponent } from './atendimento/consulta/consulta.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'relatorio-atendimento', component: RelatorioAtendimentoComponent },
  { path: 'usuario', component: UsuarioComponent },
  { path: 'perfil', component: PerfilComponent },
  { path: 'procedimento', component: ProcedimentoComponent },
  { path: 'produto', component: ProdutoComponent },
  { path: 'sala', component: SalaComponent },
  { path: 'tutor', component: TutorComponent },
  { path: 'consulta', component: ConsultaComponent },
  { path: 'agendamento', component: AgendamentoComponent },
  { path: 'relatorio-financeiro', component: RelatorioFinanceiroComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
