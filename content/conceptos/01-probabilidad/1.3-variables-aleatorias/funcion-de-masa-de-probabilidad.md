---
id: funcion-de-masa-de-probabilidad
titulo: Función de masa de probabilidad
titulo_en: Probability mass function
alias:
  - función de probabilidad
  - fmp
  - pmf
modulo: 1
submodulo: '1.3'
orden: 3
nivel: basico
prerrequisitos:
  - variables-discretas-vs-continuas
relaciones:
  - tipo: contrasta
    id: funcion-de-densidad-de-probabilidad
  - tipo: relacionado
    id: distribucion-binomial
etiquetas:
  - distribución discreta
  - probabilidad puntual
  - diagrama de barras
  - normalización
resumen: >
  La función de masa de probabilidad de una variable discreta da la probabilidad de cada valor
  posible. Sus valores son no negativos, suman 1 y determinan toda la distribución.
formula: 'p_X(x) = P(X = x), \qquad \sum_x p_X(x) = 1'
visualizacion:
  componente: RandomVariableLab
  parametros:
    modo: mapeo
    experimento: cuatro-monedas
    variable: numero-de-caras
    variables: [numero-de-caras, indicadora-primera-cara]
referencias:
  - clave: blitzstein-hwang
    capitulo: '3.2'
  - clave: ross-probabilidad
    capitulo: '4.2'
publicado: true
---

## Intuición

Una variable discreta toma valores aislados, y la manera más directa de describirla es una tabla: cada valor con su probabilidad. Esa tabla es la **función de masa de probabilidad**. Para el número de caras en cuatro lanzamientos de una moneda, la tabla dice que 0 caras tiene probabilidad 1/16, 1 cara 4/16, 2 caras 6/16, 3 caras 4/16 y 4 caras 1/16.

El nombre viene de imaginar la probabilidad como una masa total de 1 kilogramo repartida en puntos de la recta: cada valor posible recibe un pedazo, y un diagrama de barras muestra cuánto pesa cada uno. Con esa tabla se responde cualquier pregunta sobre la variable sumando: la probabilidad de obtener al menos 3 caras es $4/16 + 1/16 = 5/16$.

## Definición

:::definicion[Función de masa de probabilidad]
Sea $X$ una variable aleatoria discreta. Su **función de masa de probabilidad** es
$$
p_X(x) = P(X = x), \qquad x \in \mathbb{R}.
$$
Cumple $p_X(x) \ge 0$, es positiva a lo más en un conjunto numerable de valores (el **soporte**) y
$$
\sum_{x} p_X(x) = 1.
$$
:::

Recíprocamente, cualquier función no negativa que sea positiva en un conjunto numerable y sume 1 es la función de masa de alguna variable aleatoria. Para un conjunto $B$ de valores, $P(X \in B) = \sum_{x \in B} p_X(x)$.

:::figura[La función de masa de una binomial con 4 ensayos y probabilidad 1/2 coincide con el conteo de caras: barras de 1/16, 4/16, 6/16, 4/16 y 1/16.]{componente="DistributionExplorer"}
```yaml
distribucion: binomial
valores:
  n: 4
  p: 0.5
fijos: [n]
desde: 3
hasta: 4
```
:::

:::nota[Qué significa cada símbolo]
- $X$: variable aleatoria discreta.
- $p_X(x)$: probabilidad de que $X$ valga exactamente $x$; se escribe $p(x)$ si no hay ambigüedad.
- $B$: conjunto de valores.
- $\sum_x$: suma sobre todos los valores del soporte.
- $D$: número de piezas defectuosas del ejemplo.
- $\binom{3}{k}$: número de maneras de elegir $k$ piezas de 3.
:::

## Cómo usar la visualización

La rejilla muestra las 16 secuencias de cuatro lanzamientos, cada una con probabilidad 1/16. La animación revisa una por una, escribe cuántas caras tiene y suma 1/16 a la barra de ese valor. Al final las barras son la función de masa: la más alta es la de 2 caras, con 6 secuencias.

El selector cambia a la indicadora de que la primera moneda cae cara. Las 16 secuencias se reparten en dos barras de 8/16, una para 0 y otra para 1: la misma rejilla produce una función de masa muy distinta.

## Ejemplo

Una máquina produce piezas defectuosas con probabilidad 0.1, de manera independiente. Se revisan 3 piezas y $D$ es el número de defectuosas.

1. Cada secuencia con $k$ defectuosas tiene probabilidad $0.1^{k}\,0.9^{3-k}$, y hay $\binom{3}{k}$ secuencias así.
2. $p(0) = 0.9^3 = 0.729$, $p(1) = 3 \cdot 0.1 \cdot 0.81 = 0.243$, $p(2) = 3 \cdot 0.01 \cdot 0.9 = 0.027$, $p(3) = 0.001$.
3. Verificación: $0.729 + 0.243 + 0.027 + 0.001 = 1$.
4. Probabilidad de al menos una defectuosa: $1 - p(0) = 0.271$.

:::figura[El ejemplo de las piezas: la barra de 0 defectuosas domina con 0.729 y la de 3 apenas se ve con 0.001. El área sombreada, de 1 a 3, es la probabilidad de al menos una defectuosa.]{componente="DistributionExplorer"}
```yaml
distribucion: binomial
valores:
  n: 3
  p: 0.1
fijos: [n]
desde: 1
hasta: 3
```
:::

## Propiedades

- **Determina la distribución:** conocer $p_X$ equivale a conocer $P(X \in B)$ para todo conjunto $B$.
- **Relación con la función de distribución:** $F_X(x) = \sum_{t \le x} p_X(t)$, y cada $p_X(x)$ es el tamaño del salto de $F_X$ en $x$.
- **Funciones de la variable:** si $Y = g(X)$, entonces $p_Y(y) = \sum_{x \,:\, g(x) = y} p_X(x)$; valores distintos de $X$ con la misma imagen juntan su masa.
- **Soporte infinito:** el soporte puede ser infinito numerable, como en la Poisson; la suma infinita de las masas sigue valiendo 1.

:::figura[Una función de masa con soporte infinito: la Poisson de media 3 asigna masa positiva a todos los enteros no negativos, aunque desde 10 en adelante las barras casi no se ven.]{componente="DistributionExplorer"}
```yaml
distribucion: poisson
valores:
  lambda: 3
desde: 0
hasta: 2
```
:::

:::figura[Valores que juntan su masa: la diferencia absoluta de dos dados lleva los 6 dobles al 0 y los demás pares a valores del 1 al 5, y la barra del 1 recibe 10 casillas.]{componente="RandomVariableLab"}
```yaml
modo: mapeo
experimento: dos-dados
variable: diferencia
```
:::

## Errores comunes

- **Olvidar la normalización.** Si las masas propuestas no suman 1, no describen una variable aleatoria; hay que dividir entre su suma o revisar el cálculo.
- **Contar resultados en lugar de sumar probabilidades.** Si los resultados no son equiprobables, la masa de un valor no es la proporción de resultados que llevan a él.
- **Usar la función de masa con variables continuas.** Para ellas $P(X = x) = 0$ en todos los puntos; la descripción adecuada es la densidad.

:::figura[Una función de masa editable: al arrastrar una barra las demás se reescalan para que el total siga siendo 1, y el punto de equilibrio se mueve.]{componente="RandomVariableLab"}
```yaml
modo: esperanza
valores: [0, 1, 2, 3]
probabilidades: [0.729, 0.243, 0.027, 0.001]
nombre: el número de piezas defectuosas
simbolo: D
editable: true
```
:::

## Conexiones

La función de masa es la descripción natural de una [[variable-aleatoria]] discreta, mientras que para las continuas se usa la [[funcion-de-densidad-de-probabilidad]] (la diferencia se discute en [[variables-discretas-vs-continuas]]). Sumando masas se obtiene la [[funcion-de-distribucion-acumulada]], y ponderando valores por sus masas, la [[esperanza-matematica]]. Las familias discretas más usadas, como la [[distribucion-binomial]] y la [[distribucion-de-poisson]], se definen dando una fórmula para la función de masa. La [[funcion-generadora-de-probabilidad]] guarda toda la función de masa en una sola serie de potencias.

## Formulario

:::formula[Definición]
$$
p_X(x) = P(X = x), \qquad p_X(x) \ge 0, \qquad \sum_x p_X(x) = 1
$$

- La suma recorre el soporte de $X$.
:::

:::formula[Probabilidad de un conjunto]
$$
P(X \in B) = \sum_{x \in B} p_X(x)
$$

- $B$: cualquier conjunto de valores.
:::

:::formula[Función de una variable discreta]
$$
p_{g(X)}(y) = \sum_{x \,:\, g(x) = y} p_X(x)
$$

- Se suman las masas de todos los valores que $g$ lleva a $y$.
:::
