export type ColaboratorType = {
  idClientePrincipal: number;
  idPerfilClientePrincipal: number;
  idClienteFavorecido: number;
  idPerfilClienteFavorecido: number;
  dataInclusao: string;
  dataCancelamento: string;
  nome: string;
  email: string;
  sexo: string;
  dataNascimento: string;
  telefone: string;
  numeroDocumento: string;
  solicitarSegundaVia: boolean;
  solicitarPrimeiraVia: boolean;
  pedidoCartao: boolean;
  matricula: string;
  valorUsoDiario: number;
  valorUsoDiarioRefeicao: number;
  valorAlimentacao: number;
  valorCombustivel: number;
  numeroLogicoMidia: number;
  tipoDePedido: string;
  valorDaRecarga: number | string;
};
