// Devuelve un emoji representativo segun palabras clave en el tipo de alimento.
// Es solo decorativo (ayuda a que las tarjetas se lean mas rapido de un vistazo).
const MAPA_ICONOS = [
  [["tomate"], "🍅"],
  [["papa", "patata"], "🥔"],
  [["cebolla"], "🧅"],
  [["mango"], "🥭"],
  [["aguacate"], "🥑"],
  [["platano", "plátano", "banano"], "🍌"],
  [["zanahoria"], "🥕"],
  [["naranja", "mandarina", "citrico", "cítrico"], "🍊"],
  [["yuca"], "🍠"],
  [["guayaba"], "🍈"],
  [["espinaca", "acelga", "repollo", "lechuga", "verdura", "col"], "🥬"],
  [["pimenton", "pimentón", "pimiento", "aji", "ají"], "🫑"],
  [["fresa"], "🍓"],
  [["pina", "piña"], "🍍"],
  [["limon", "limón"], "🍋"],
  [["uva"], "🍇"],
  [["pescado"], "🐟"],
  [["pollo", "carne"], "🍗"],
  [["pan"], "🍞"],
  [["leche", "lacteo", "lácteo", "queso"], "🥛"],
  [["huevo"], "🥚"],
];

export function iconoAlimento(tipoAlimento) {
  const texto = (tipoAlimento || "").toLowerCase();
  const coincidencia = MAPA_ICONOS.find(([claves]) =>
    claves.some((clave) => texto.includes(clave))
  );
  return coincidencia ? coincidencia[1] : "🌿";
}
