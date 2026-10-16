---
id: variable-aleatoria
titulo: Variable aleatoria
titulo_en: Random variable
alias:
  - variable estocástica
  - v.a.
modulo: 1
submodulo: '1.3'
orden: 1
nivel: basico
prerrequisitos:
  - axiomas-de-kolmogorov
relaciones:
  - tipo: relacionado
    id: funciones-reales-y-sus-graficas
etiquetas:
  - función medible
  - distribución
  - resultado numérico
  - espacio muestral
resumen: >
  Una variable aleatoria es una función que asigna un número a cada resultado de un experimento
  aleatorio. Permite pasar de eventos a números y hablar de su distribución, su media y su
  variabilidad.
formula: 'X : \Omega \to \mathbb{R}, \qquad P(X \in B) = P(\{\omega \in \Omega : X(\omega) \in B\})'
visualizacion:
  componente: RandomVariableLab
  parametros:
    modo: mapeo
    experimento: dos-dados
    variable: suma
    variables: [suma, maximo, minimo, diferencia, producto, numero-de-seises]
referencias:
  - clave: blitzstein-hwang
    capitulo: '3.1'
  - clave: ross-probabilidad
    capitulo: '4.1'
publicado: true
---

## Intuición

En muchos experimentos no interesa el resultado completo, sino un número que depende de él. Al lanzar dos dados el resultado es un par como (2, 5), pero en un juego de mesa lo que importa es la suma, 7. Al encuestar a una persona el resultado es todo su cuestionario, pero el análisis usa su edad o su ingreso. Ese número es una **variable aleatoria**: una regla fija que convierte cada resultado en un valor.

Lo aleatorio no es la regla, que está completamente determinada, sino el resultado al que se aplica. La suma de dos dados siempre se calcula igual; lo que no se sabe de antemano es qué par saldrá. Por eso la probabilidad de que la suma valga 7 se obtiene juntando todos los pares cuya suma es 7 y sumando sus probabilidades: 6 pares de 36, es decir 1/6.

Con variables aleatorias se pasa de preguntas sobre conjuntos ("¿cuál es la probabilidad de este evento?") a preguntas sobre números ("¿cuánto vale en promedio?", "¿qué tan disperso es?"). Todo lo que sigue en este submódulo, desde la función de distribución hasta los momentos, se define sobre esta idea.

## Definición

:::definicion[Variable aleatoria]
Sea $(\Omega, \mathcal{F}, P)$ un espacio de probabilidad. Una **variable aleatoria** es una función $X : \Omega \to \mathbb{R}$ tal que, para todo número real $x$, el conjunto
$$
\{X \le x\} = \{\omega \in \Omega : X(\omega) \le x\}
$$
es un evento, es decir, pertenece a $\mathcal{F}$.
:::

La condición técnica garantiza que preguntas como $P(X \le x)$ o $P(a < X \le b)$ tengan respuesta. En espacios muestrales finitos todo subconjunto es un evento y cualquier función de $\Omega$ en $\mathbb{R}$ es una variable aleatoria. La **distribución** de $X$ es la asignación $B \mapsto P(X \in B)$, que traslada la probabilidad del espacio muestral a la recta real.

:::figura[El número de caras en tres lanzamientos de una moneda: cada una de las 8 secuencias recibe un número entre 0 y 3, y las secuencias con el mismo número juntan su probabilidad en una sola barra.]{componente="RandomVariableLab"}
```yaml
modo: mapeo
experimento: tres-monedas
variable: numero-de-caras
```
:::

:::nota[Qué significa cada símbolo]
- $\Omega$: espacio muestral, el conjunto de resultados posibles.
- $\omega$: un resultado particular.
- $\mathcal{F}$: colección de eventos a los que se asigna probabilidad.
- $P$: medida de probabilidad.
- $X$: variable aleatoria, en mayúscula.
- $x$: un valor numérico particular, en minúscula.
- $\{X \le x\}$: evento formado por los resultados en los que $X$ no supera a $x$.
- $B$: conjunto de números reales.
- $G$: ganancia de la apuesta del ejemplo.
:::

## Cómo usar la visualización

La rejilla muestra los 36 resultados de dos dados. La animación los recorre uno por uno, escribe en cada casilla el número que la variable le asigna y suma su probabilidad, 1/36, a la barra de ese valor. Al terminar, las barras forman la distribución de la variable.

El selector cambia la variable sobre el mismo experimento: la suma, el máximo, el mínimo, la diferencia absoluta, el producto o el número de seises. Los 36 resultados son los mismos; lo que cambia es cómo se agrupan, y con ello la forma de la distribución.

## Ejemplo

Una apuesta con un dado equilibrado cuesta 1 peso y paga 5 pesos si sale 6 (una ganancia neta de 4). La ganancia es la variable aleatoria $G$ definida por
$$
G(\omega) = \begin{cases} 4 & \text{si } \omega = 6, \\ -1 & \text{si } \omega \in \{1, 2, 3, 4, 5\}. \end{cases}
$$

1. El evento $\{G = 4\}$ es $\{6\}$, de modo que $P(G = 4) = 1/6$.
2. El evento $\{G = -1\}$ es $\{1, 2, 3, 4, 5\}$, de modo que $P(G = -1) = 5/6$.
3. Las dos probabilidades suman 1: la distribución de $G$ está completa con solo dos valores, aunque el dado tenga seis caras.

:::figura[La ganancia de la apuesta: cinco caras van al valor $-1$ y una al valor 4, así que la variable tiene solo dos valores posibles.]{componente="RandomVariableLab"}
```yaml
modo: mapeo
experimento: dado
variable: ganancia-apuesta
```
:::

## Propiedades

- **Eventos generados:** cada pregunta sobre $X$ es un evento del espacio original. $\{X = x\}$, $\{X \le x\}$ y $\{a < X \le b\}$ son conjuntos de resultados, y sus probabilidades se calculan con los axiomas.
- **Funciones de variables:** si $X$ es una variable aleatoria y $g$ es una función razonable (continua, por ejemplo), $Y = g(X)$ también lo es. Sumas, productos, máximos y mínimos de variables aleatorias son variables aleatorias.
- **Indicadoras:** la función que vale 1 si ocurre un evento $A$ y 0 si no, $\mathbf{1}_A$, es una variable aleatoria. Con ella cualquier evento se convierte en número.
- **Varias variables sobre el mismo experimento:** sobre los mismos 36 pares pueden definirse la suma, el máximo y el número de seises. Como dependen del mismo resultado, sus valores están relacionados entre sí.

:::figura[La indicadora de dobles convierte un evento en variable: los 6 dobles van al valor 1 y los otros 30 resultados al valor 0, así que $P(I = 1) = 1/6$.]{componente="RandomVariableLab"}
```yaml
modo: mapeo
experimento: dos-dados
variable: indicadora-dobles
```
:::

:::figura[El máximo de dos dados sobre los mismos 36 resultados: el valor 6 recibe 11 casillas y el valor 1 solo una, una distribución muy distinta de la de la suma.]{componente="RandomVariableLab"}
```yaml
modo: mapeo
experimento: dos-dados
variable: maximo
```
:::

## Errores comunes

- **Pensar que la variable es un número.** $X$ es una función; lo que se observa en un ensayo es un valor $x = X(\omega)$. Por eso se escribe $P(X = 3)$ y no tiene sentido escribir $P(3)$.
- **Confundir la variable con su distribución.** Dos variables distintas pueden tener la misma distribución: el valor del primer dado y el del segundo tienen distribución uniforme en $\{1, \dots, 6\}$, pero casi nunca coinciden.
- **Olvidar que valores distintos pueden venir de muchos resultados.** $P(S = 7)$ no es 1/36: hay que sumar sobre todos los pares cuya suma es 7.

:::figura[Dos variables con la misma distribución no son la misma variable: el primer dado asigna a cada casilla su fila y tiene distribución uniforme, igual que el segundo, que asigna la columna.]{componente="RandomVariableLab"}
```yaml
modo: mapeo
experimento: dos-dados
variable: primero
variables: [primero, segundo]
```
:::

## Conexiones

Una variable aleatoria traslada la probabilidad del [[espacio-muestral]] a la recta real, y cada pregunta sobre ella es uno de los [[eventos]] del experimento. Su distribución se describe con la [[funcion-de-masa-de-probabilidad]] cuando toma valores aislados o con la [[funcion-de-densidad-de-probabilidad]] cuando varía en un continuo, como se compara en [[variables-discretas-vs-continuas]]; en todos los casos queda determinada por la [[funcion-de-distribucion-acumulada]]. Los resúmenes más usados son la [[esperanza-matematica]] y la [[varianza]]. Las [[variables-indicadoras]] son el puente entre eventos y números, y las [[transformaciones-de-variables-aleatorias]] estudian la distribución de $g(X)$.

## Formulario

:::formula[Variable aleatoria]
$$
X : \Omega \to \mathbb{R}, \qquad \{X \le x\} \in \mathcal{F} \text{ para todo } x \in \mathbb{R}
$$

- $X$ asigna un número a cada resultado $\omega$.
:::

:::formula[Distribución]
$$
P(X \in B) = P(\{\omega \in \Omega : X(\omega) \in B\})
$$

- La probabilidad de un conjunto de valores es la de los resultados que llevan a él.
:::

:::formula[Variable discreta]
$$
P(X = x) = \sum_{\omega \,:\, X(\omega) = x} P(\{\omega\})
$$

- En espacios finitos se suman las probabilidades de los resultados con ese valor.
:::
