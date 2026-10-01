---
id: leyes-de-de-morgan
titulo: Leyes de De Morgan
titulo_en: De Morgan's laws
alias:
  - De Morgan
  - complemento de la unión
modulo: 0
submodulo: '0.1'
orden: 6
nivel: basico
prerrequisitos:
  - operaciones-de-conjuntos
  - tablas-de-verdad
etiquetas:
  - conjuntos
  - complemento
  - lógica
  - negación
resumen: >
  El complemento de una unión es la intersección de los complementos, y el complemento de una
  intersección es la unión de los complementos. En lógica, negar un "o" produce un "y" de negaciones.
formula: '(A \cup B)^c = A^c \cap B^c,\qquad (A \cap B)^c = A^c \cup B^c'
visualizacion:
  componente: VennSets
  parametros:
    modo: de-morgan
    universo: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    conjuntos:
      - etiqueta: A
        elementos: [1, 2, 3, 4, 5, 6]
      - etiqueta: B
        elementos: [2, 4, 6, 8, 10, 12]
    ley: union
referencias:
  - clave: blitzstein-hwang
publicado: true
---

## Intuición

Una aerolínea permite abordar sin pagar cargo extra si el equipaje no es pesado ni voluminoso. Paga el cargo "quien lleva equipaje pesado o voluminoso". Quien no lo paga admite dos descripciones equivalentes: "no es cierto que lleve equipaje pesado o voluminoso" y "no lleva equipaje pesado y tampoco voluminoso".

Esa traducción es la ley de De Morgan. Lo que queda fuera de una unión es lo que no está en ninguna de las partes, es decir, lo que está fuera de la primera y también fuera de la segunda. Y lo que no cumple dos condiciones a la vez es lo que falla en al menos una: para no aprobar una materia que exige examen y proyecto basta fallar cualquiera de los dos.

Al negar, el "o" se convierte en "y" y el "y" se convierte en "o". Olvidar ese cambio es uno de los errores más frecuentes al negar condiciones, tanto en demostraciones como en reglas de negocio o en filtros de datos.

## Definición

:::teorema[Leyes de De Morgan]
Para subconjuntos $A$ y $B$ de un universo $U$:

$$
(A \cup B)^c = A^c \cap B^c, \qquad (A \cap B)^c = A^c \cup B^c.
$$

Para proposiciones $p$ y $q$:

$$
\lnot (p \lor q) \equiv \lnot p \land \lnot q, \qquad \lnot (p \land q) \equiv \lnot p \lor \lnot q.
$$
:::

Las leyes valen para cualquier familia de conjuntos, finita o infinita:

$$
\Big(\bigcup_{i \in I} A_i\Big)^c = \bigcap_{i \in I} A_i^c, \qquad \Big(\bigcap_{i \in I} A_i\Big)^c = \bigcup_{i \in I} A_i^c.
$$

:::nota[Qué significa cada símbolo]
- $A, B$: subconjuntos de un universo $U$.
- $A^c$: complemento de $A$, lo que está en $U$ fuera de $A$.
- $\cup$, $\cap$: unión e intersección.
- $p, q$: proposiciones; $\lnot$, $\lor$, $\land$: negación, "o" e "y".
- $\equiv$: equivalencia lógica.
- $I$: conjunto de índices de una familia de conjuntos; $A_i$ es el conjunto con índice $i$.
- $\bigcup_{i \in I}$, $\bigcap_{i \in I}$: unión e intersección de todos los $A_i$.
:::

## Cómo usar la visualización

Dos diagramas se construyen en paralelo. El de la izquierda sombrea primero $A \cup B$ y después su complemento; el de la derecha sombrea $A^c$, luego $B^c$ y al final su intersección. Cuando termina la reproducción ambos diagramas coinciden y el panel muestra el mismo conjunto de elementos en los dos lados. El selector cambia a la ley del complemento de una intersección.

Con la ley de la intersección, el lado izquierdo deja fuera solo la parte común de $A$ y $B$, mientras que el derecho se forma uniendo dos complementos grandes. Comparar los pasos intermedios muestra que $A^c$ por sí solo no basta: la igualdad aparece solo después de combinar ambos complementos.

## Ejemplo

Un sistema de control de calidad clasifica 500 botellas. $L$ es el conjunto de botellas con etiqueta defectuosa, con $|L| = 40$; $T$ es el de tapa defectuosa, con $|T| = 25$; y $|L \cap T| = 10$.

1. Botellas con algún defecto: $|L \cup T| = 40 + 25 - 10 = 55$.
2. Botellas sin defecto de etiqueta y sin defecto de tapa: por De Morgan, $L^c \cap T^c = (L \cup T)^c$, así que son $500 - 55 = 445$.
3. Botellas que no tienen ambos defectos a la vez: $(L \cap T)^c = L^c \cup T^c$, con $500 - 10 = 490$ botellas.

:::figura[Las 500 botellas del ejemplo. Las consultas muestran que $(L \cup T)^c$ y $L^c \cap T^c$ sombrean la misma región, con 445 botellas, y que $(L \cap T)^c$ y $L^c \cup T^c$ también coinciden, con 490.]{componente="VennSets"}
```yaml
modo: conteos
etiquetas: [L, T]
universo: Botellas
conteos:
  L: 30
  T: 15
  LT: 10
  ninguno: 445
consultas:
  - nombre: "L ∪ T"
    regiones: [L, T, LT]
  - nombre: "(L ∪ T)ᶜ"
    regiones: [ninguno]
  - nombre: "Lᶜ ∩ Tᶜ"
    regiones: [ninguno]
  - nombre: "L ∩ T"
    regiones: [LT]
  - nombre: "(L ∩ T)ᶜ"
    regiones: [L, T, ninguno]
  - nombre: "Lᶜ ∪ Tᶜ"
    regiones: [L, T, ninguno]
```
:::

## Propiedades

- Las leyes son duales: al intercambiar $\cup$ con $\cap$ y $\varnothing$ con $U$ una se transforma en la otra.
- Permiten expresar la unión con intersección y complemento: $A \cup B = (A^c \cap B^c)^c$.
- En probabilidad dan $P(A \cup B) = 1 - P(A^c \cap B^c)$, útil cuando la probabilidad de que no ocurra ninguno es más fácil de calcular.
- Negar un cuantificador sigue el mismo patrón: $\lnot \forall x\, P(x) \equiv \exists x\, \lnot P(x)$.

:::demostracion
Usamos doble contención con la ley lógica: $x \in (A \cup B)^c$ equivale a $\lnot(x \in A \lor x \in B)$, que equivale a $x \notin A \land x \notin B$, es decir, $x \in A^c \cap B^c$. La segunda ley se obtiene aplicando la primera a $A^c$ y $B^c$ y tomando complementos.
:::

## Errores comunes

- **Distribuir el complemento sin cambiar la operación.** $(A \cup B)^c \neq A^c \cup B^c$ en general.
- **Negar una "o" dejándola como "o".** "No es cierto que llueva o nieve" significa que no llueve y no nieva, no que "no llueve o no nieva": esta última frase es cierta en un día de lluvia sin nieve, y la original no.
- **Filtrar datos con condiciones negadas mal agrupadas.** Excluir registros "con edad faltante o ingreso faltante" deja los que tienen ambos datos, no los que tienen al menos uno.
- **Olvidar el universo.** Los complementos se toman respecto del mismo $U$ en ambos lados.

:::figura[El error de distribuir el complemento sin cambiar la operación. $(A \cup B)^c$ contiene solo los 7 elementos que no están en ningún conjunto, mientras que $A^c \cup B^c$ contiene 17: todos los que faltan en al menos uno de los dos.]{componente="VennSets"}
```yaml
modo: conteos
etiquetas: [A, B]
conteos:
  A: 6
  B: 4
  AB: 3
  ninguno: 7
consultas:
  - nombre: "(A ∪ B)ᶜ"
    regiones: [ninguno]
  - nombre: "Aᶜ ∪ Bᶜ"
    regiones: [A, B, ninguno]
  - nombre: "Aᶜ ∩ Bᶜ"
    regiones: [ninguno]
```
:::

## Conexiones

Las leyes combinan las [[operaciones-de-conjuntos]] con la negación lógica y se verifican con [[tablas-de-verdad]]. Su versión con cuantificadores aparece en [[cuantificadores-universal-y-existencial]]. En probabilidad sostienen el cálculo por complemento, y en los [[diagramas-de-venn]] se ven como igualdades entre regiones.

## Formulario

:::formula[De Morgan para conjuntos]
$$
(A \cup B)^c = A^c \cap B^c, \qquad (A \cap B)^c = A^c \cup B^c
$$

- $A, B$: conjuntos dentro del universo $U$.
- $^c$: complemento respecto a $U$.
- Al complementar, la unión se vuelve intersección y viceversa.
:::

:::formula[De Morgan para proposiciones]
$$
\lnot (p \lor q) \equiv \lnot p \land \lnot q, \qquad \lnot (p \land q) \equiv \lnot p \lor \lnot q
$$

- $p, q$: proposiciones.
- $\lnot$: negación; $\lor$: "o"; $\land$: "y".
:::

:::formula[De Morgan para familias]
$$
\Big(\bigcup_{i \in I} A_i\Big)^c = \bigcap_{i \in I} A_i^c, \qquad \Big(\bigcap_{i \in I} A_i\Big)^c = \bigcup_{i \in I} A_i^c
$$

- $I$: conjunto de índices, finito o infinito.
- $A_i$: el conjunto número $i$ de la familia.
:::

:::formula[Probabilidad por complemento]
$$
P(A \cup B) = 1 - P(A^c \cap B^c)
$$

- $P(\cdot)$: probabilidad de un evento.
- $A^c \cap B^c$: el evento "no ocurre ninguno".
:::
