// Regex para validação de string no formato CNPJ
export const regexCNPJ = /^\d{2}.\d{3}.\d{3}\/\d{4}-\d{2}$/;

// Método de validação
// Referência: https://pt.wikipedia.org/wiki/Cadastro_Nacional_da_Pessoa_Jur%C3%ADdica
export function isCnpjValid(value: string | number | number[] = "") {
  if (!value) return false;

  // Aceita receber o valor como string, número ou array com todos os dígitos
  const isString = typeof value === "string";
  const validTypes =
    isString || Number.isInteger(value) || Array.isArray(value);

  // Elimina valor de tipo inválido
  if (!validTypes) return false;

  // Filtro inicial para entradas do tipo string
  if (isString) {
    // Teste Regex para veificar se é uma string apenas dígitos válida
    const digitsOnly = /^\d{14}$/.test(value);
    // Teste Regex para verificar se é uma string formatada válida
    const validFormat = regexCNPJ.test(value);
    // Verifica se o valor passou em ao menos 1 dos testes
    const isValid = digitsOnly || validFormat;

    // Se o formato não é válido, retorna inválido
    if (!isValid) return false;
  }

  // Elimina tudo que não é dígito
  const numbers = matchNumbers(value);

  // Valida a quantidade de dígitos
  if (numbers.length !== 14) return false;

  // Elimina inválidos com todos os dígitos iguais
  const items = [...new Set(numbers)];
  if (items.length === 1) return false;

  // Separa os 2 últimos dígitos verificadores
  const digits = numbers.slice(12);

  // Valida 1o. dígito verificador
  const digit0 = validCalc(12, numbers);
  if (digit0 !== digits[0]) return false;

  // Valida 2o. dígito verificador
  const digit1 = validCalc(13, numbers);
  return digit1 === digits[1];
}

// Método de formatação
export function formatCNPJ(value: string | number | number[] = "") {
  // Verifica se o valor é válido
  const valid = isCnpjValid(value);

  // Se o valor não for válido, retorna vazio
  if (!valid) return "";

  // Elimina tudo que não é dígito
  const numbers = matchNumbers(value);
  const text = numbers.join("");

  // Formatação do CNPJ: 99.999.999/9999-99
  const format = text.replace(
    /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
    "$1.$2.$3/$4-$5"
  );

  // Retorna o valor formatado
  return format;
}

// Cálculo validador
function validCalc(x: number, numbers: number[]) {
  const slice = numbers.slice(0, x);
  let factor = x - 7;
  let sum = 0;

  for (let i = x; i >= 1; i--) {
    const n = slice[x - i];
    sum += n * factor--;
    if (factor < 2) factor = 9;
  }

  const result = 11 - (sum % 11);

  return result > 9 ? 0 : result;
}

// Elimina tudo que não é dígito
function matchNumbers(value: string | number | number[] = "") {
  const match = value.toString().match(/\d/g);
  return Array.isArray(match) ? match.map(Number) : [];
}

export function isEmailValid(email: string) {
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  return emailRegex.test(email);
}

export function hasNumber(text: string): boolean {
  return !!text.match(/(?=.*[0-9])/g);
}
export function hasLowerCase(text: string) {
  return !!text.match(/(?=.*[a-z])/g);
}
export function hasUpperCase(text: string) {
  return !!text.match(/(?=.*[A-Z])/g);
}
export function hasSpecialChar(text: string) {
  return !!text.match(/(?=.*[ç~^;/\\!@#$%¨&*()])/g);
}

export function onlyNumbers(text: string) {
  return text.replace(/\D/g, "");
}

export function formatarParaBRL(numero: number): string {
  const numeroFormatado: string = numero.toFixed(2);

  return `R$ ${numeroFormatado
    .replace(".", ",")
    .replace(/(\d)(?=(\d{3})+,)/g, "$1.")}`;
}

export function formatarTelefone(telefone: string): string {
  const numeros = telefone.replace(/\D/g, "");

  const ehCelular = numeros.length === 11;

  if (ehCelular) {
    return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(
      7
    )}`;
  } else {
    return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 6)}-${numeros.slice(
      6
    )}`;
  }
}

export function formatarCPF(cpf: string): string {
  const numeros = cpf.replace(/\D/g, "");

  return `${numeros.slice(0, 3)}.${numeros.slice(3, 6)}.${numeros.slice(
    6,
    9
  )}-${numeros.slice(9)}`;
}
