---
id: sigma-algebras
titulo: Sigma-álgebras
titulo_en: Sigma-algebras
alias:
  - σ-álgebra
  - sigma-campo
  - σ-campo
  - tribu
modulo: 0
submodulo: '0.9'
orden: 1
nivel: avanzado
prerrequisitos:
  - conjunto-potencia
  - cardinalidad-finita-numerable-y-no-numerable
etiquetas:
  - teoría de la medida
  - conjuntos medibles
  - eventos
  - complemento y unión
resumen: >
  Una sigma-álgebra es una familia de subconjuntos que contiene al total y es cerrada bajo complementos
  y uniones numerables. Es la colección de conjuntos a los que se les puede asignar medida o probabilidad.
formula: '\Omega \in \mathcal{F}, \qquad A \in \mathcal{F} \Rightarrow A^c \in \mathcal{F}, \qquad A_1, A_2, \dots \in \mathcal{F} \Rightarrow \bigcup_{n} A_n \in \mathcal{F}'
visualizacion:
  componente: MeasureLab
  parametros:
    modo: sigma
    puntos: 6
    generadores:
      - [0, 1, 2]
      - [3, 4]
    etiquetas: ['1', '2', '3', '4', '5', '6']
referencias:
  - clave: durrett
  - clave: blitzstein-hwang
publicado: true
---

## Intuición

Al lanzar un dado, alguien que solo ve si el resultado es bajo (1, 2 o 3) o es 4 o 5 puede responder ciertas preguntas y otras no. Puede decir si ocurrió "resultado bajo", o "no salió 4 ni 5", pero no puede decir si salió 2. Las preguntas que sí puede contestar forman una familia de conjuntos con una propiedad natural: si sabe si ocurrió $A$, sabe si ocurrió su complemento; si sabe si ocurrió $A$ y si ocurrió $B$, sabe si ocurrió "$A$ o $B$".

Una sigma-álgebra es exactamente eso: una familia de conjuntos cerrada bajo complementos y uniones, que representa la información disponible. Las uniones se exigen también para sucesiones infinitas numerables, porque en probabilidad hay preguntas como "alguna vez sale seis" que combinan infinitos eventos.

La razón técnica para no usar siempre todos los subconjuntos es que, en espacios no numerables como $[0, 1]$, no se puede asignar una longitud coherente a todo subconjunto. Las sigma-álgebras delimitan los conjuntos que sí se pueden medir.

## Definición

:::definicion[Sigma-álgebra]
Sea $\Omega$ un conjunto. Una familia $\mathcal{F}$ de subconjuntos de $\Omega$ es una sigma-álgebra si

1. $\Omega \in \mathcal{F}$;
2. si $A \in \mathcal{F}$, entonces $A^c = \Omega \setminus A \in \mathcal{F}$;
3. si $A_1, A_2, \dots \in \mathcal{F}$, entonces $\bigcup_{n=1}^{\infty} A_n \in \mathcal{F}$.

Para una familia $\mathcal{G}$ de subconjuntos, la sigma-álgebra generada $\sigma(\mathcal{G})$ es la intersección de todas las sigma-álgebras que contienen a $\mathcal{G}$: la más pequeña que la contiene.
:::

En un conjunto finito, toda sigma-álgebra está formada por las uniones de sus átomos, los conjuntos no vacíos mínimos, que forman una partición de $\Omega$; si hay $m$ átomos, la sigma-álgebra tiene $2^m$ conjuntos.

:::nota[Qué significa cada símbolo]
- $\Omega$: conjunto de todos los resultados posibles.
- $\mathcal{F}$: sigma-álgebra, una familia de subconjuntos de $\Omega$.
- $A$, $A_n$: conjuntos de la familia.
- $A^c$: complemento de $A$ en $\Omega$.
- $\bigcup_n A_n$: unión de la sucesión.
- $\mathcal{G}$: familia generadora; $\sigma(\mathcal{G})$: sigma-álgebra que genera.
- $m$: número de átomos.
:::

## Cómo usar la visualización

Cada tarjeta es un conjunto de la familia: los cuadros rellenos indican qué puntos del dado contiene. La reproducción parte de los generadores, más el vacío y el total, y en cada ronda agrega los complementos y las uniones de lo que ya hay; las tarjetas nuevas se resaltan. Al terminar se marcan los átomos.

Con los generadores $\{1, 2, 3\}$ y $\{4, 5\}$ la familia pasa de 4 a 7 conjuntos en la primera ronda y a 8 en la segunda, donde se detiene. Los átomos son $\{1, 2, 3\}$, $\{4, 5\}$ y $\{6\}$, y los 8 conjuntos son todas sus uniones posibles: $2^3 = 8$. El conjunto $\{2\}$ nunca aparece.

## Ejemplo

En $\Omega = \{a, b, c, d\}$ se genera la sigma-álgebra de $\mathcal{G} = \{\{a\}, \{a, b\}\}$.

1. Se parte de $\varnothing$, $\Omega$, $\{a\}$ y $\{a, b\}$.
2. Complementos: $\{b, c, d\}$ y $\{c, d\}$.
3. Uniones e intersecciones nuevas: $\{b\} = \{a, b\} \cap \{b, c, d\}$, y con él $\{a, c, d\}$, su complemento.
4. Los átomos son $\{a\}$, $\{b\}$ y $\{c, d\}$, y la sigma-álgebra tiene $2^3 = 8$ conjuntos.
5. Los conjuntos $\{c\}$ y $\{d\}$ no están: la información de $\mathcal{G}$ no distingue entre $c$ y $d$.

:::figura[Cuatro puntos con generadores $\{a\}$ y $\{a, b\}$: la familia crece de 4 a 6, 7 y 8 conjuntos en tres rondas y termina con los átomos $\{a\}$, $\{b\}$ y $\{c, d\}$.]{componente="MeasureLab"}
```yaml
modo: sigma
puntos: 4
generadores:
  - [0]
  - [0, 1]
```
:::

## Propiedades

- **Contiene al vacío:** $\varnothing = \Omega^c \in \mathcal{F}$.
- **Cerrada bajo intersecciones numerables:** por las leyes de De Morgan, $\bigcap_n A_n = \big(\bigcup_n A_n^c\big)^c$.
- **Cerrada bajo diferencias:** $A \setminus B = A \cap B^c$.
- **Extremos:** $\{\varnothing, \Omega\}$ es la sigma-álgebra más pequeña y el conjunto potencia $2^\Omega$ es la más grande.
- **Generadas en conjuntos finitos:** el número de conjuntos es una potencia de 2, la del número de átomos.

:::figura[Seis puntos con un solo generador, los números impares: en una ronda se agrega su complemento y la familia queda con 4 conjuntos y 2 átomos, pares e impares.]{componente="MeasureLab"}
```yaml
modo: sigma
puntos: 6
generadores:
  - [0, 2, 4]
etiquetas: ['1', '2', '3', '4', '5', '6']
```
:::

- **Intersección de sigma-álgebras:** la intersección de cualquier colección de sigma-álgebras es una sigma-álgebra; por eso $\sigma(\mathcal{G})$ está bien definida.
- **Borelianos:** la sigma-álgebra de Borel de $\mathbb{R}$ es la generada por los intervalos abiertos.

## Errores comunes

- **Pensar que la unión de dos sigma-álgebras es una sigma-álgebra.** En $\{a, b, c\}$, las familias generadas por $\{a\}$ y por $\{b\}$ son sigma-álgebras, pero su unión contiene $\{a\}$ y $\{b\}$ sin contener $\{a, b\}$.

:::figura[Tres puntos con los generadores $\{a\}$ y $\{b\}$ a la vez: la familia necesita una ronda más para incluir $\{a, b\}$ y los demás conjuntos, y termina con los 8 subconjuntos.]{componente="MeasureLab"}
```yaml
modo: sigma
puntos: 3
generadores:
  - [0]
  - [1]
```
:::

- **Exigir solo uniones finitas.** Una familia cerrada bajo uniones finitas es un álgebra; la sigma-álgebra exige uniones numerables, que en conjuntos infinitos agregan conjuntos nuevos.
- **Creer que "generada" significa "las uniones de los generadores".** También entran complementos, intersecciones y combinaciones repetidas; con generadores que se traslapan pueden aparecer muchos conjuntos.
- **Suponer que en $[0, 1]$ se mide cualquier subconjunto.** Existen conjuntos no medibles para la medida de Lebesgue; por eso se trabaja con los borelianos o con los conjuntos medibles de Lebesgue.

## Conexiones

Es una subfamilia del [[conjunto-potencia]] cerrada bajo operaciones de conjuntos, y las uniones numerables dependen de la noción de conjunto numerable de [[cardinalidad-finita-numerable-y-no-numerable]]. Junto con el conjunto total forma un [[espacio-medible]], sobre el que se define una [[medida-y-espacio-de-medida|medida]]. En probabilidad sus elementos son los eventos que admiten probabilidad, como en los [[axiomas-de-kolmogorov]].

## Formulario

:::formula[Axiomas de sigma-álgebra]
$$
\Omega \in \mathcal{F}, \qquad A \in \mathcal{F} \Rightarrow A^c \in \mathcal{F}, \qquad A_n \in \mathcal{F} \Rightarrow \bigcup_{n=1}^{\infty} A_n \in \mathcal{F}
$$

- $\Omega$: conjunto total; $\mathcal{F}$: familia de subconjuntos; $A^c$: complemento; $A_n$: sucesión de conjuntos de la familia.
:::

:::formula[Sigma-álgebra generada]
$$
\sigma(\mathcal{G}) = \bigcap \{\mathcal{F} : \mathcal{F} \text{ es sigma-álgebra y } \mathcal{G} \subseteq \mathcal{F}\}
$$

- $\mathcal{G}$: familia de conjuntos que se quiere incluir; $\sigma(\mathcal{G})$: la menor sigma-álgebra que la contiene.
:::

:::formula[Tamaño en un conjunto finito]
$$
|\mathcal{F}| = 2^{m}
$$

- $m$: número de átomos de $\mathcal{F}$; $|\mathcal{F}|$: número de conjuntos de la sigma-álgebra.
:::
