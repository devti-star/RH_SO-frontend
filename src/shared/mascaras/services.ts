import type { ChangeEvent } from "react";

export const mascaraRG = (e: ChangeEvent<HTMLInputElement>) => {
  let value = e.target.value;
  const lastChar = value[value.length - 1];

  // Remove tudo que não for dígito, exceto a última letra (se for)
  value = value.replace(/[^0-9]/g, ""); // pega só números
  if (/[a-zA-Z]/.test(lastChar)) {
    value += lastChar; // adiciona letra se for válida
  }

  // Formata o RG
  if (value.length > 2) {
    value = value.replace(/^(\d{2})(\d)/, "$1.$2");
  }
  if (value.length > 6) {
    value = value.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
  }
  if (value.length > 9) {
    value = value.replace(
      /^(\d{2})\.(\d{3})\.(\d{3})([0-9A-Za-z])/,
      "$1.$2.$3-$4"
    );
  }

  return value.substring(0, 12);
};

export const mascaraCPF = (e: ChangeEvent<HTMLInputElement>) => {
  let value = e.target.value.replace(/\D/g, "");

  if (value.length > 3) {
    value = value.replace(/^(\d{3})(\d)/, "$1.$2");
  }
  if (value.length > 7) {
    value = value.replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3");
  }
  if (value.length > 10) {
    value = value.replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d{2})/, "$1.$2.$3-$4");
  }

  return value.substring(0, 14);
};

export const mascaraTelefone = (e: ChangeEvent<HTMLInputElement>) => {
  // Remove tudo que não for número
  let value = e.target.value.replace(/\D/g, "");

  // Aplica os parênteses ao DDD
  if (value.length >= 1) {
    value = value.replace(/^(\d{0,2})/, "($1");
  }
  if (value.length >= 3) {
    value = value.replace(/^\((\d{2})(\d)/, "($1) $2");
  }

  // Aplica o traço após os 5 primeiros dígitos do número
  if (value.length >= 9) {
    value = value.replace(/(\d{5})(\d{1,4})/, "$1-$2");
  }

  // Limita a 15 caracteres: (99) 99999-9999
  return value.substring(0, 15);

};
