---
id: espacio-medible
titulo: Espacio medible
titulo_en: Measurable space
alias:
  - par medible
  - (Ω, F)
modulo: 0
submodulo: '0.9'
orden: 2
nivel: avanzado
prerrequisitos:
  - sigma-algebras
etiquetas:
  - teoría de la medida
  - sigma-álgebra
  - información
  - borelianos
resumen: >
  Un espacio medible es un conjunto con una sigma-álgebra de subconjuntos. Fija qué conjuntos se pueden
  medir antes de elegir cualquier medida; el mismo conjunto admite estructuras más finas o más gruesas.
formula: '(\Omega, \mathcal{F}), \qquad \mathcal{F} \subseteq 2^{\Omega} \text{ sigma-álgebra}'
visualizacion:
  componente: MeasureLab
  parametros:
    modo: sigma
    puntos: 4
    generadores:
      - [0, 1]
      - [1, 2]
referencias:
  - clave: durrett
publicado: true
---

## Intuición

Antes de hablar de cuánto mide algo hay que decidir qué cosas se van a medir. Un catastro mide terrenos, pero no asigna superficie a cada grano de tierra; una encuesta reporta porcentajes por estado, pero no por calle. En los dos casos hay una colección de regiones admitidas, y cualquier medición posterior se hace solo sobre ellas.

Un espacio medible es esa decisión previa: un conjunto $\Omega$ junto con la sigma-álgebra $\mathcal{F}$ de los subconjuntos que se consideran medibles. Todavía no hay números; la medida o la probabilidad se agregan después. El mismo $\Omega$ puede llevar sigma-álgebras distintas, y una más fina, con más conjuntos, representa más información o más detalle.

En probabilidad, $(\Omega, \mathcal{F})$ describe qué eventos se pueden observar. En el análisis de $\mathbb{R}$, el espacio medible estándar es la recta con sus conjuntos borelianos.

## Definición

:::definicion[Espacio medible]
Un espacio medible es un par $(\Omega, \mathcal{F})$, donde $\Omega$ es un conjunto no vacío y $\mathcal{F}$ es una sigma-álgebra de subconjuntos de $\Omega$. Los elementos de $\mathcal{F}$ se llaman conjuntos medibles.
:::

Si $\mathcal{F}_1 \subseteq \mathcal{F}_2$ son dos sigma-álgebras sobre $\Omega$, se dice que $\mathcal{F}_2$ es más fina que $\mathcal{F}_1$. Ejemplos: $(\Omega, \{\varnothing, \Omega\})$, el más grueso; $(\Omega, 2^\Omega)$, el más fino; $(\mathbb{R}, \mathcal{B}(\mathbb{R}))$, con la sigma-álgebra de Borel generada por los intervalos.

:::nota[Qué significa cada símbolo]
- $\Omega$: conjunto subyacente.
- $\mathcal{F}$, $\mathcal{F}_1$, $\mathcal{F}_2$: sigma-álgebras sobre $\Omega$.
- $2^\Omega$: conjunto potencia, todos los subconjuntos de $\Omega$.
- $\mathbb{R}$: números reales.
- $\mathcal{B}(\mathbb{R})$: sigma-álgebra de Borel de $\mathbb{R}$.
- $\varnothing$: conjunto vacío.
:::

## Cómo usar la visualización

Las tarjetas son los conjuntos medibles de $\Omega = \{a, b, c, d\}$ con la sigma-álgebra generada por dos conjuntos que se traslapan, $\{a, b\}$ y $\{b, c\}$. La reproducción agrega en cada ronda complementos y uniones; al terminar se marcan los átomos.

La familia crece de 4 a 7, 11, 14 y 16 conjuntos: el traslape obliga a separar $\{b\}$, luego $\{a\}$, $\{c\}$ y $\{d\}$, y el resultado es el espacio medible más fino posible sobre cuatro puntos, con todos los subconjuntos.

## Ejemplo

Se lanza un dado, $\Omega = \{1, 2, 3, 4, 5, 6\}$, y se comparan dos espacios medibles.

1. Con $\mathcal{F}_1 = \sigma(\{\{1, 3, 5\}\}) = \{\varnothing, \{1, 3, 5\}, \{2, 4, 6\}, \Omega\}$ solo se puede hablar de la paridad.
2. Con $\mathcal{F}_2 = 2^\Omega$ se puede hablar de cualquier resultado: 64 conjuntos.
3. El evento "salió 6" es medible en $(\Omega, \mathcal{F}_2)$ pero no en $(\Omega, \mathcal{F}_1)$.
4. $\mathcal{F}_1 \subseteq \mathcal{F}_2$: el segundo espacio es más fino.

:::figura[Dado con la sigma-álgebra de la paridad: una ronda basta para llegar a 4 conjuntos, con átomos impares y pares; el evento "salió 6" no está entre las tarjetas.]{componente="MeasureLab"}
```yaml
modo: sigma
puntos: 6
generadores:
  - [0, 2, 4]
etiquetas: ['1', '2', '3', '4', '5', '6']
```
:::

## Propiedades

- **Estructura mínima:** todo espacio medible contiene a $\varnothing$ y a $\Omega$.
- **Orden por finura:** las sigma-álgebras sobre $\Omega$ están ordenadas parcialmente por inclusión, con $\{\varnothing, \Omega\}$ abajo y $2^\Omega$ arriba.

:::figura[Generador vacío sobre cuatro puntos: la familia se queda con el vacío y el total, el espacio medible más grueso, con un solo átomo.]{componente="MeasureLab"}
```yaml
modo: sigma
puntos: 4
generadores:
  - []
```
:::

- **Subespacios:** si $A \in \mathcal{F}$, la familia $\{B \cap A : B \in \mathcal{F}\}$ es una sigma-álgebra sobre $A$.
- **Productos:** de dos espacios medibles se forma $(\Omega_1 \times \Omega_2, \mathcal{F}_1 \otimes \mathcal{F}_2)$, con la sigma-álgebra generada por los rectángulos $A \times B$.
- **Funciones medibles:** una función entre espacios medibles es medible si las preimágenes de conjuntos medibles son medibles; el concepto depende de las dos sigma-álgebras.

## Errores comunes

- **Confundir espacio medible con espacio de medida.** El espacio medible no tiene números asociados a los conjuntos; la medida es una estructura adicional.
- **Pensar que más conjuntos siempre es mejor.** Con $2^{\mathbb{R}}$ no existe una medida de longitud que cumpla las propiedades deseadas; con los borelianos sí.
- **Olvidar que la sigma-álgebra es parte del objeto.** El mismo $\Omega$ con dos sigma-álgebras da dos espacios medibles distintos, y una función puede ser medible en uno y no en el otro.

:::figura[Cuatro puntos con $\{a\}$, $\{b\}$ y $\{c\}$ como generadores: $\{d\}$ aparece como complemento de la unión y la familia llega a los 16 subconjuntos, el espacio medible más fino, en el que toda función es medible.]{componente="MeasureLab"}
```yaml
modo: sigma
puntos: 4
generadores:
  - [0]
  - [1]
  - [2]
```
:::

## Conexiones

Se construye con una de las [[sigma-algebras]] sobre un conjunto. Al agregar una [[medida-y-espacio-de-medida|medida]] se obtiene un espacio de medida, y la [[medida-de-lebesgue]] se define sobre la recta con sus conjuntos medibles. Las [[funciones-medibles]] son las funciones que respetan la estructura de dos espacios medibles.

## Formulario

:::formula[Espacio medible]
$$
(\Omega, \mathcal{F})
$$

- $\Omega$: conjunto; $\mathcal{F}$: sigma-álgebra de subconjuntos de $\Omega$, los conjuntos medibles.
:::

:::formula[Sigma-álgebra de Borel]
$$
\mathcal{B}(\mathbb{R}) = \sigma\big(\{(a, b) : a < b\}\big)
$$

- $(a, b)$: intervalos abiertos; $\sigma$: sigma-álgebra generada.
:::

:::formula[Sigma-álgebra producto]
$$
\mathcal{F}_1 \otimes \mathcal{F}_2 = \sigma\big(\{A \times B : A \in \mathcal{F}_1,\ B \in \mathcal{F}_2\}\big)
$$

- $\mathcal{F}_1$, $\mathcal{F}_2$: sigma-álgebras de cada factor; $A \times B$: rectángulos medibles.
:::
