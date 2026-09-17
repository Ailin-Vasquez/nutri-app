export function calcularIMC(pesoKg, alturaCm) {
  const alturaM = alturaCm / 100;
  return pesoKg / (alturaM * alturaM);
}

const BANDAS = [
  {
    max: 18.5,
    key: "low",
    label: "Bajo peso",
    texto: "El IMC indica bajo peso. Se recomienda una valoración nutricional para asegurar un aporte calórico adecuado.",
  },
  {
    max: 25,
    key: "normal",
    label: "Normal",
    texto: "El IMC se encuentra dentro del rango saludable. Se recomienda mantener hábitos de alimentación balanceada y actividad física regular.",
  },
  {
    max: 30,
    key: "warn",
    label: "Sobrepeso",
    texto: "El IMC indica sobrepeso. Se sugiere ajustar hábitos alimenticios y aumentar la actividad física, con seguimiento nutricional.",
  },
  {
    max: Infinity,
    key: "bad",
    label: "Obesidad",
    texto: "El IMC indica obesidad. Se recomienda acompañamiento nutricional y médico para diseñar un plan de manejo adecuado.",
  },
];

export function clasificarIMC(imc) {
  return BANDAS.find((banda) => imc < banda.max) || BANDAS[BANDAS.length - 1];
}

export function posicionEnEscala(imc) {
  const acotado = Math.min(Math.max(imc, 12), 40);
  return ((acotado - 12) / (40 - 12)) * 100;
}
