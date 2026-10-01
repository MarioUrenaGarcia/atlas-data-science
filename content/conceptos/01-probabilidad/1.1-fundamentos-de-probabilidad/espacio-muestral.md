---
id: espacio-muestral
titulo: Espacio muestral
titulo_en: Sample space
alias:
  - conjunto de resultados
  - universo de resultados
modulo: 1
submodulo: '1.1'
orden: 2
nivel: basico
prerrequisitos:
  - experimento-aleatorio
  - producto-cartesiano
relaciones:
  - tipo: relacionado
    id: eventos
etiquetas:
  - resultados
  - conjuntos
  - modelado
  - omega
resumen: >
  Conjunto de todos los resultados posibles de un experimento aleatorio. Cada realización produce
  exactamente uno de sus elementos, y los eventos se definen como subconjuntos de él.
formula: '\Omega = \{\omega_1, \omega_2, \dots\}'
visualizacion:
  componente: SampleSpaceLab
  parametros:
    modo: eventos
    experimento: dos-dados
    eventoA: dobles
    operaciones: [A]
referencias:
  - clave: blitzstein-hwang
    capitulo: '1.1'
  - clave: degroot
publicado: true
---

## Intuición

Antes de calcular cualquier probabilidad hay que responder una pregunta más básica: ¿qué puede pasar? Si se lanzan dos dados y se anota qué salió en cada uno, la respuesta es una lista de 36 pares ordenados, del $(1, 1)$ al $(6, 6)$. Esa lista completa es el espacio muestral.

Elegir bien el espacio muestral es parte del modelado. Debe ser **exhaustivo**, para que cualquier resultado que ocurra esté en la lista, y sus elementos deben ser **mutuamente excluyentes**, para que cada realización corresponda a uno solo. Además conviene que sea lo bastante detallado para responder las preguntas de interés: si se anota solo la suma de los dados, ya no se puede saber si salieron dobles.

Hay espacios muestrales finitos (las caras de un dado), infinitos numerables (el número de llamadas que recibe un conmutador en una hora) y no numerables (el tiempo de espera de un autobús, que puede ser cualquier número real positivo). El tipo de espacio determina las herramientas matemáticas que se usan después.

## Definición

:::definicion[Espacio muestral]
El **espacio muestral** $\Omega$ de un experimento aleatorio es el conjunto de todos sus resultados posibles. Sus elementos $\omega \in \Omega$ se llaman **resultados** o **puntos muestrales**, y cumplen:

1. Cada realización del experimento produce algún $\omega \in \Omega$ (exhaustividad).
2. Ninguna realización produce dos elementos distintos de $\Omega$ (exclusión mutua).
   :::

Cuando el experimento consiste en realizar $k$ experimentos simples, el espacio muestral suele ser un producto cartesiano: al lanzar dos dados,

$$
\Omega = \{1, \dots, 6\} \times \{1, \dots, 6\} = \{(i, j) : i, j \in \{1, \dots, 6\}\}, \qquad |\Omega| = 36.
$$

:::figura[El espacio muestral de dos dados como producto cartesiano: las filas son el primer dado, las columnas el segundo y cada casilla es un par ordenado. Fijar el primer dado en 6 selecciona una fila completa de 6 pares, uno por cada valor del segundo dado.]{componente="SampleSpaceLab"}

```yaml
modo: eventos
experimento: dos-dados
eventoA: primero-6
operaciones: [A]
```

:::

:::nota[Qué significa cada símbolo]

- $\Omega$: espacio muestral, el conjunto de todos los resultados posibles.
- $\omega$, $\omega_1, \omega_2, \dots$: resultados individuales, elementos de $\Omega$.
- $\times$: producto cartesiano; $A \times B$ es el conjunto de pares $(a, b)$ con $a \in A$ y $b \in B$.
- $(i, j)$: par ordenado; $i$ es la cara del primer dado y $j$ la del segundo.
- $|\Omega|$: número de elementos del espacio muestral (su cardinalidad).
  :::

## Cómo usar la visualización

Cada casilla de la rejilla es un resultado del lanzamiento de dos dados: la fila indica el primer dado y la columna el segundo. La reproducción recorre las 36 casillas una por una y lleva la cuenta de las que pertenecen al evento elegido. El selector permite cambiar el evento para ver qué forma tiene como subconjunto del espacio muestral.

Los dobles forman la diagonal principal. "La suma es 7" forma la diagonal opuesta, y "el primer dado es 6" ocupa toda la última fila. Al elegir "la suma es 10 o más" aparece un triángulo en la esquina inferior derecha con solo 6 casillas, lo que explica por qué esas sumas son poco frecuentes.

## Ejemplo

Una familia planea tener tres hijos y se registra el sexo de cada uno en orden de nacimiento (M: mujer, H: hombre).

1. Cada nacimiento tiene dos resultados, así que el espacio es $\{M, H\}^3$, con $2^3 = 8$ elementos.
2. Listados: $\Omega = \{MMM, MMH, MHM, MHH, HMM, HMH, HHM, HHH\}$.
3. Si en cambio solo se registra **cuántas** mujeres hay, el espacio es $\Omega' = \{0, 1, 2, 3\}$.
4. $\Omega'$ es más pequeño, pero pierde información: no permite responder "¿la primera hija es mujer?".
5. Los elementos de $\Omega$ son igualmente probables si cada nacimiento es independiente con probabilidad 1/2; los de $\Omega'$ no lo son, porque "1 mujer" agrupa tres resultados de $\Omega$ y "0 mujeres" solo uno.

:::figura[Tres nacimientos con dos resultados cada uno tienen la misma estructura que tres monedas: 8 resultados. Las casillas resaltadas son las tres secuencias con exactamente dos caras, que en el ejemplo corresponden a "exactamente dos mujeres".]{componente="SampleSpaceLab"}

```yaml
modo: eventos
experimento: tres-monedas
eventoA: exactamente-dos-caras
operaciones: [A]
```

:::

## Propiedades

- **Espacios finitos:** $\Omega = \{\omega_1, \dots, \omega_n\}$, como un dado o una baraja. La probabilidad se asigna resultado por resultado.
- **Espacios numerables:** $\Omega = \{\omega_1, \omega_2, \dots\}$, como el número de intentos hasta el primer éxito. La probabilidad sigue asignándose punto por punto y las sumas son series.
- **Espacios no numerables:** intervalos de $\mathbb{R}$ o regiones del plano. Cada punto individual suele tener probabilidad 0 y la probabilidad se asigna a intervalos o regiones.
- **Productos:** repetir un experimento con espacio $\Omega_1$ un total de $k$ veces da el espacio $\Omega_1^k$, con $|\Omega_1|^k$ elementos si $\Omega_1$ es finito.

:::figura[Un espacio finito más grande: las 52 cartas de una baraja inglesa, con palo en las filas y valor en las columnas. Las cartas de corazones forman una fila completa.]{componente="SampleSpaceLab"}

```yaml
modo: eventos
experimento: carta
eventoA: corazon
operaciones: [A]
```

:::

:::figura[Un producto con muchos factores: cuatro dados producen 6 elevado a la 4, es decir 1296 resultados. Las filas combinan los dos primeros dados y las columnas los dos últimos; el conteo recorre el espacio completo buscando los resultados con al menos un 6.]{componente="SampleSpaceLab"}

```yaml
modo: eventos
experimento: cuatro-dados
eventoA: al-menos-un-seis
operaciones: [A]
```

:::

## Errores comunes

- **Usar pares no ordenados cuando el experimento los distingue.** Si se lanzan dos dados, $(1, 2)$ y $(2, 1)$ son resultados distintos. Tratar "un 1 y un 2" como un solo resultado lleva a creer que los 21 pares no ordenados son igualmente probables, lo cual es falso.
- **Olvidar resultados.** Un espacio que no es exhaustivo produce probabilidades que no suman 1.
- **Resultados que se traslapan.** Si "sale par" y "sale 6" se toman como resultados del mismo espacio, una tirada produciría dos resultados a la vez.

:::figura[El par (1, 2) y el par (2, 1) son dos casillas distintas. El evento "los dados difieren en 1" tiene 10 casillas, no 5: cada pareja de caras consecutivas aparece dos veces, una en cada orden.]{componente="SampleSpaceLab"}

```yaml
modo: eventos
experimento: dos-dados
eventoA: diferencia-1
operaciones: [A]
```

:::

## Conexiones

El espacio muestral describe los resultados de un [[experimento-aleatorio]], y sus subconjuntos son los [[eventos]]. Cuando el experimento es compuesto se construye con el [[producto-cartesiano]] y se cuenta con el [[principio-del-producto]]. La probabilidad se define sobre los eventos del espacio muestral mediante los [[axiomas-de-kolmogorov]], y en los [[espacios-equiprobables]] se reduce a contar elementos.

## Formulario

:::formula[Espacio muestral]

$$
\Omega = \{\omega_1, \omega_2, \dots\}
$$

- $\Omega$: conjunto de todos los resultados posibles.
- $\omega_i$: el $i$-ésimo resultado posible.
  :::

:::formula[Espacio de un experimento compuesto]

$$
\Omega = \Omega_1 \times \Omega_2 \times \dots \times \Omega_k, \qquad |\Omega| = |\Omega_1| \cdot |\Omega_2| \cdots |\Omega_k|
$$

- $\Omega_i$: espacio muestral de la $i$-ésima etapa del experimento.
- $k$: número de etapas.
- $\times$: producto cartesiano.
- $|\Omega_i|$: número de resultados de la etapa $i$.
  :::

:::formula[Repeticiones del mismo experimento]

$$
|\Omega_1^{k}| = |\Omega_1|^{k}
$$

- $\Omega_1^{k}$: espacio de $k$ repeticiones de un experimento con espacio $\Omega_1$.
- $|\Omega_1|$: número de resultados de una repetición.
  :::
