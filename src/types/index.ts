export {};

declare global {
  interface Window {
    config: {
      background_color: string;
      tenant: string;
      card: string;
      icon: string;
      favicon: string;
      logo: string;
      bannerLogin: string;
      theme_color: string;
      loginUrl: string;
      baseUrl: string;
      cardTransporte: string;
      cardTransportePne: string;
      cardTransporteSenior: string;
      cardTransporteEstudante: string;
      nomeUser: string;
    }; // whatever type you want to give. (any,number,float etc)
  }
}

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
  valorDaRecarga: number | string; //deletar
  valor: number | string;
};

export type PedidoType = {
  numero: number;
  idCliente: number;
  nomeCliente: string;
  documentoCliente: string;
  quantidadeItens: number;
  valorCalculadoPedido: number;
  statusPedido: string;
  valorPago: number;
  dataPagamento?: string;
  dataInclusao: string;
  itensPedido: ItensPedidoType[];
  pagamentosPedido: PagamentosPedido[];
  nrSeqEndereco: number;
  podeExcluir: boolean;
  dataCancelamento?: string;
};
type PagamentosPedido = {
  valorPago: number;
  dataPagamento?: string;
  formaPagamento: string;
  identificador?: number;
  dataBaixa?: string;
  tipoBaixa?: string;
  usuario?: number;
};
export type ItensPedidoType = {
  numeroItem: number;
  idCliente: number;
  usuario: string;
  cartao?: string;
  valor: number;
  idServico: number;
  servico: string;
  idTipoItemPedido: number;
  idTipoBeeValePedido?: number;
  documento: string;
  valorUsoDiario: number;
  idProduto: number;
};

export type LojaType = {
  codigo: number;
  nome: string;
  numeroDocumento: string;
  idContaAcesso: number;
  tipoDocumento: TipoDocumento;
  tipoPessoa: string;
  email: string;
  telefone: string;
  dataCadastro: string;
  enderecos: EnderecoType[];
  tiposDePerfis: string[];
  nomeMae: string;
  nomePai: string;
  sexo: string;
  jsonIntegracao: string;
  numeroCartaoOperador: string;
};

type TipoDocumento = {
  codigo: number;
  descricao: string;
};

export type UsuarioType = {
  jti: string;
  sub: string;
  nome: string;
  perfis: string[];
  email: string;
  iat: number;
  iss: string;
  exp: number;
  idCliente: number;
  codigo: number;
  enderecos: EnderecoType[];
  numeroDocumento: string;
  telefone: string;
  tipoDocumento: TipoDocumento;
  senha: string;
  confirmacaoSenha: string;
  servicoRequisicao: boolean;
  idTipoPerfilCliente: number;
  autorizadoRequisicao: boolean;
  tipoGeracaoFatura: string;
  tipoPagamento: string;
};

export type EnderecoType = {
  nrSeqEndereco: number;
  logradouro: string;
  complemento: string;
  bairro: string;
  cidade: string;
  uf: string;
  cep: string;
  numero: string;
  dataCadastro: string;
  dataInativacao: string;
  latitude: string;
  longitude: string;
  tipoEndereco: string;
  tipoLogradouro: string;
};

export type RequestNovoColaborador = {
  matricula: string;
  idClientePrincipal: number;
  colaborador: Colaborador;
  valorUsoDiario: number;
};

type Colaborador = {
  email: string;
  sexo: string;
  numeroDocumento: string;
  nome: string;
  tipoDocumento: string;
  canalCadastro: string;
  idTiposPerfisCliente: number[];
  idClienteFavorecido: number;
  telefone: string;
  dataNascimento: string;
};
