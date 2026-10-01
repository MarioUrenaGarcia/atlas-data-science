---
id: axiomas-de-kolmogorov
titulo: Axiomas de Kolmogorov
titulo_en: Kolmogorov axioms
alias:
  - axiomas de la probabilidad
  - medida de probabilidad
  - espacio de probabilidad
modulo: 1
submodulo: '1.1'
orden: 7
nivel: basico
prerrequisitos:
  - eventos
  - series-y-convergencia-de-series
relaciones:
  - tipo: generaliza
    id: interpretacion-clasica
  - tipo: relacionado
    id: interpretacion-subjetiva-o-bayesiana
etiquetas:
  - axiomas
  - medida de probabilidad
  - aditividad
  - espacio de probabilidad
resumen: >
  Tres reglas que toda asignación de probabilidades debe cumplir: no negatividad, probabilidad 1 para
  el espacio muestral y aditividad numerable para eventos mutuamente excluyentes.
formula: 'P(A) \ge 0,\quad P(\Omega) = 1,\quad P\Big(\bigcup_{i=1}^{\infty} A_i\Big) = \sum_{i=1}^{\infty} P(A_i)'
visualizacion:
  componente: SampleSpaceLab
  parametros:
    modo: medida
    experimento: dado
    eventoA: par
    eventos: [par, mayor-que-4, primo, seis, menor-que-3]
    pesos: [1, 1, 1, 1, 1, 3]
referencias:
  - clave: durrett
    capitulo: '1.1'
  - clave: blitzstein-hwang
    capitulo: '1.6'
  - clave: ross-probabilidad
    capitulo: '2'
publicado: true
---

## Intuición

Las interpretaciones clásica, frecuentista y subjetiva discrepan sobre qué significa una probabilidad, pero coinciden en cómo se calcula con ellas. Las proporciones de casos, las frecuencias relativas y las creencias coherentes cumplen las mismas tres reglas: nunca son negativas, lo seguro vale 1, y la probabilidad de que ocurra una de varias cosas incompatibles es la suma de sus probabilidades.

En 1933, Andréi Kolmogorov tomó esas tres reglas como axiomas y construyó sobre ellas toda la teoría. A partir de ese momento, una probabilidad es cualquier función sobre los eventos que cumpla los axiomas, sin importar de dónde vengan los números. Esto separa la pregunta matemática (qué se deduce de unas probabilidades dadas) de la pregunta de modelado (qué probabilidades describen bien un fenómeno).

Un dado cargado ilustra la diferencia. La regla de Laplace no sirve, porque las caras no son simétricas, pero cualquier asignación de números no negativos a las caras que sume 1 define una probabilidad legítima. Cuál de esas asignaciones describe al dado real es un problema empírico.

## Definición

:::definicion[Espacio de probabilidad]
Un **espacio de probabilidad** es una terna $(\Omega, \mathcal{F}, P)$ donde $\Omega$ es el espacio muestral, $\mathcal{F}$ es la familia de eventos (una σ-álgebra de subconjuntos de $\Omega$) y $P : \mathcal{F} \to \mathbb{R}$ cumple:

1. **No negatividad:** $P(A) \ge 0$ para todo evento $A$.
2. **Normalización:** $P(\Omega) = 1$.
3. **Aditividad numerable:** si $A_1, A_2, \dots$ son eventos mutuamente excluyentes ($A_i \cap A_j = \varnothing$ para $i \neq j$), entonces

$$
P\Big(\bigcup_{i=1}^{\infty} A_i\Big) = \sum_{i=1}^{\infty} P(A_i).
$$

:::

La familia $\mathcal{F}$ contiene a $\Omega$ y es cerrada bajo complementos y uniones numerables. Si $\Omega$ es finito o numerable se puede tomar $\mathcal{F}$ igual a todos los subconjuntos de $\Omega$, y $P$ queda determinada por las probabilidades de los resultados individuales: $P(A) = \sum_{\omega \in A} P(\{\omega\})$.

:::figura[Dos monedas equilibradas: cada uno de los 4 resultados recibe 1/4. La animación apila las probabilidades de los resultados de "al menos una cara" para obtener 3/4, y después las del complemento, que completan 1.]{componente="SampleSpaceLab"}

```yaml
modo: medida
experimento: dos-monedas
eventoA: al-menos-una-cara
eventos: [al-menos-una-cara, primera-cara, todas-iguales]
```

:::

:::nota[Qué significa cada símbolo]

- $\Omega$: espacio muestral; $\omega$: un resultado.
- $\mathcal{F}$: familia de eventos a los que se asigna probabilidad (σ-álgebra).
- $P$: medida de probabilidad, función que asigna a cada evento un número real.
- $P(A)$: probabilidad del evento $A$; $P(\{\omega\})$: probabilidad del resultado $\omega$.
- $A_1, A_2, \dots$: sucesión de eventos; $A_i \cap A_j = \varnothing$ indica que no se traslapan.
- $\bigcup_{i=1}^{\infty} A_i$: evento "ocurre alguno de los $A_i$".
- $\sum_{i=1}^{\infty} P(A_i)$: serie de las probabilidades.
- $\mathbb{R}$: números reales.
  :::

## Cómo usar la visualización

Cada barra es la probabilidad asignada a una cara de un dado cargado: la cara 6 tiene el triple de peso que las demás. Los puntos de las barras se arrastran para cambiar las probabilidades. Los tres recuadros verifican los axiomas en vivo: si la suma deja de ser 1, el axioma 2 se marca como violado y el botón "Normalizar" divide todo entre la suma. La animación construye $P(A)$ apilando, uno por uno, los resultados de A (en azul) y después los de su complemento.

Con el dado cargado, $P(\text{par}) = 5/8 = 0.625$, no 1/2. Al arrastrar la barra del 6 hacia abajo hasta igualar a las demás, la suma baja de 1 y el axioma 2 falla; al normalizar se recupera el dado equilibrado con $P(\text{par}) = 0.5$.

## Ejemplo

Un control de calidad estima que un dado de cierto lote cae en cada cara con probabilidades

$$
p_1 = 0.10,\; p_2 = 0.10,\; p_3 = 0.15,\; p_4 = 0.15,\; p_5 = 0.20,\; p_6 = 0.30.
$$

1. **Axioma 1:** todos los $p_i$ son no negativos.
2. **Axioma 2:** $0.10 + 0.10 + 0.15 + 0.15 + 0.20 + 0.30 = 1$.
3. **Axioma 3:** para eventos excluyentes se suma; por ejemplo, $P(\{5, 6\}) = 0.20 + 0.30 = 0.50$.
4. Con la misma regla, $P(\text{par}) = p_2 + p_4 + p_6 = 0.55$ y $P(\text{impar}) = 0.45$, que suman 1.

Es una probabilidad legítima aunque no sea la del dado equilibrado.

:::figura[El dado del ejemplo: las probabilidades 0.10, 0.10, 0.15, 0.15, 0.20 y 0.30 cumplen los tres axiomas. La animación apila las caras 5 y 6 para obtener P(sale más de 4) = 0.50.]{componente="SampleSpaceLab"}

```yaml
modo: medida
experimento: dado
eventoA: mayor-que-4
eventos: [mayor-que-4, par, impar]
pesos: [0.10, 0.10, 0.15, 0.15, 0.20, 0.30]
```

:::

## Propiedades

- **Aditividad finita:** tomando $A_i = \varnothing$ desde cierto índice, el axioma 3 implica $P(A_1 \cup \dots \cup A_n) = P(A_1) + \dots + P(A_n)$ para eventos excluyentes.
- **Espacios discretos:** en un $\Omega$ finito o numerable, cualquier colección de números $p_\omega \ge 0$ con $\sum_\omega p_\omega = 1$ define una probabilidad mediante $P(A) = \sum_{\omega \in A} p_\omega$.
- **Consecuencias inmediatas:** $P(\varnothing) = 0$, $P(A^{c}) = 1 - P(A)$, $P(A) \le 1$ y la monotonía; todas se deducen de los tres axiomas.
- **Neutralidad:** los axiomas no dicen qué probabilidad tiene cada evento, solo qué reglas deben cumplir las asignaciones.

:::figura[Aditividad para eventos excluyentes: "la suma es 7" y "dobles" no comparten resultados. Al construir la unión, la intersección vacía no resta nada y P(A o B) = 6/36 + 6/36 = 12/36.]{componente="SampleSpaceLab"}

```yaml
modo: union
experimento: dos-dados
eventoA: suma-7
eventoB: dobles
```

:::

:::figura[Cuatro monedas con una asignación no uniforme: la casilla CCCC tiene más peso que las demás. Cualquier asignación no negativa que sume 1 es una probabilidad válida, y P(A) se obtiene sumando las probabilidades de los resultados de A.]{componente="SampleSpaceLab"}

```yaml
modo: medida
experimento: cuatro-monedas
eventoA: exactamente-dos-caras
eventos: [exactamente-dos-caras, al-menos-una-cara, primera-cara]
pesos: [4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
```

:::

## Errores comunes

- **Asignar probabilidades que no suman 1.** Si cada cara de un dado recibe 0.2, la suma es 1.2 y la asignación no es una probabilidad; hay que normalizar.
- **Sumar probabilidades de eventos que se traslapan.** El axioma 3 solo vale para eventos excluyentes. Para $P(A \cup B)$ en general hay que restar la intersección.
- **Creer que los axiomas fijan las probabilidades.** Un dado equilibrado y uno cargado cumplen los mismos axiomas; los axiomas no dicen cuál es el modelo correcto.

:::figura[Cada cara con probabilidad 0.2: la suma es 1.2 y el axioma 2 aparece violado. El botón de normalizar divide entre 1.2 y devuelve el dado equilibrado.]{componente="SampleSpaceLab"}

```yaml
modo: medida
experimento: dado
eventoA: par
eventos: [par]
pesos: [0.2, 0.2, 0.2, 0.2, 0.2, 0.2]
normalizar: false
```

:::

:::figura[Sumar sin restar la intersección cuenta dos veces los resultados comunes: con "corazones" y "figuras", P(A) + P(B) = 25/52, pero P(A o B) = 22/52.]{componente="SampleSpaceLab"}

```yaml
modo: union
experimento: carta
eventoA: corazon
eventoB: figura
```

:::

## Conexiones

Los axiomas dan un marco común a la [[interpretacion-clasica]], la [[interpretacion-frecuentista]] y la [[interpretacion-subjetiva-o-bayesiana]]. Se aplican a los [[eventos]] de un [[espacio-muestral]] y usan [[series-y-convergencia-de-series]] en la aditividad numerable. De ellos se deducen las [[propiedades-derivadas-de-los-axiomas]] y la [[probabilidad-de-la-union-de-eventos]]. En la teoría de la medida, una probabilidad es una medida de masa total 1, lo que permite tratar con la misma teoría espacios discretos y continuos.

## Formulario

:::formula[Axioma 1: no negatividad]

$$
P(A) \ge 0
$$

- $A$: cualquier evento; $P(A)$: su probabilidad.
  :::

:::formula[Axioma 2: normalización]

$$
P(\Omega) = 1
$$

- $\Omega$: espacio muestral, el evento seguro.
  :::

:::formula[Axioma 3: aditividad numerable]

$$
P\Big(\bigcup_{i=1}^{\infty} A_i\Big) = \sum_{i=1}^{\infty} P(A_i), \qquad A_i \cap A_j = \varnothing \ (i \neq j)
$$

- $A_1, A_2, \dots$: eventos mutuamente excluyentes.
- $\bigcup$: unión; $\sum$: suma de la serie.
  :::

:::formula[Probabilidad en un espacio discreto]

$$
P(A) = \sum_{\omega \in A} p_\omega, \qquad p_\omega \ge 0, \quad \sum_{\omega \in \Omega} p_\omega = 1
$$

- $p_\omega = P(\{\omega\})$: probabilidad del resultado $\omega$.
- $\sum_{\omega \in A}$: suma sobre los resultados del evento $A$.
  :::
