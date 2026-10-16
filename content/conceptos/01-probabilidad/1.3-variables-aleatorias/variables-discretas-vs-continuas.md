---
id: variables-discretas-vs-continuas
titulo: Variables discretas y continuas
titulo_en: Discrete and continuous random variables
alias:
  - variable aleatoria discreta
  - variable aleatoria continua
  - tipos de variables aleatorias
modulo: 1
submodulo: '1.3'
orden: 2
nivel: basico
prerrequisitos:
  - variable-aleatoria
relaciones:
  - tipo: relacionado
    id: datos-discretos-y-continuos
  - tipo: relacionado
    id: integral-definida-como-area
etiquetas:
  - discreta
  - continua
  - masa puntual
  - densidad
  - conteo y medición
resumen: >
  Una variable discreta toma valores aislados, cada uno con probabilidad positiva; una continua
  varía en un intervalo y cada valor individual tiene probabilidad cero. La primera se describe con
  sumas y la segunda con áreas bajo una densidad.
formula: 'P(a \le X \le b) = \sum_{a \le x \le b} p(x) \quad \text{o} \quad P(a \le X \le b) = \int_a^b f(x)\,dx'
visualizacion:
  componente: RandomVariableLab
  parametros:
    modo: acumulada
    distribucion: exponencial
    parametros:
      lambda: 1
    x: 1
referencias:
  - clave: blitzstein-hwang
    capitulo: '3.2 y 5.1'
  - clave: ross-probabilidad
    capitulo: '4.2 y 5.1'
publicado: true
---

## Intuición

Hay dos maneras básicas de producir un número al azar: **contar** y **medir**. Contar caras, clientes o errores produce valores aislados (0, 1, 2, ...), y tiene sentido preguntar por la probabilidad de cada uno. Medir una estatura, un tiempo de espera o una temperatura produce valores en un continuo: entre 1.70 y 1.71 metros hay infinitos valores posibles.

En el primer caso la probabilidad se reparte en **masas puntuales**: cada valor posible se lleva un pedazo. En el segundo se reparte como una **arena** extendida sobre la recta: ningún punto se lleva nada por sí solo, pero cada intervalo se lleva una cantidad positiva. Preguntar la probabilidad de que una persona mida exactamente 1.7000... metros da 0; preguntar la de que mida entre 1.70 y 1.71 da un número positivo.

La diferencia cambia las herramientas: las variables discretas se tratan con sumas y la [[funcion-de-masa-de-probabilidad]]; las continuas con integrales y la [[funcion-de-densidad-de-probabilidad]]. La [[funcion-de-distribucion-acumulada]] sirve para ambas.

## Definición

:::definicion[Variable discreta y variable continua]
Una variable aleatoria $X$ es **discreta** si toma valores en un conjunto finito o numerable $\{x_1, x_2, \dots\}$ con
$$
\sum_{i} P(X = x_i) = 1.
$$
Es **continua** (más precisamente, absolutamente continua) si existe una función $f \ge 0$ tal que, para todos $a \le b$,
$$
P(a \le X \le b) = \int_a^b f(x)\,dx.
$$
:::

En una variable continua, $P(X = x) = \int_x^x f(t)\,dt = 0$ para cada $x$. En una discreta, la función de distribución avanza en escalones; en una continua, crece sin saltos.

:::figura[La suma de dos dados es discreta: la probabilidad está en 11 valores aislados y la función de distribución sube por escalones, uno en cada valor.]{componente="RandomVariableLab"}
```yaml
modo: acumulada
experimento: dos-dados
variable: suma
x: 7
```
:::

:::nota[Qué significa cada símbolo]
- $X$: variable aleatoria.
- $x_1, x_2, \dots$: valores posibles de una variable discreta.
- $p(x) = P(X = x)$: función de masa de probabilidad.
- $f(x)$: función de densidad de una variable continua.
- $a$, $b$: extremos de un intervalo.
- $\int_a^b f(x)\,dx$: área bajo la densidad entre $a$ y $b$.
- $T$: tiempo de espera del ejemplo, en minutos.
:::

## Cómo usar la visualización

La gráfica de arriba muestra la densidad de un tiempo de espera exponencial con media 1, y la de abajo su función de distribución. Al mover el punto $x$, el área sombreada a la izquierda de $x$ es $P(X \le x)$ y coincide con la altura de la curva de abajo. La curva crece sin saltos: no hay ningún valor que acumule probabilidad por sí solo.

El botón de reproducción barre $x$ de izquierda a derecha. Comparar con la figura de la suma de dos dados, donde la misma curva sube por escalones, muestra la diferencia entre ambos tipos.

## Ejemplo

El tiempo $T$ que tarda en llegar el siguiente cliente a una caja, en minutos, se modela como exponencial con densidad $f(t) = e^{-t}$ para $t \ge 0$.

1. Probabilidad de esperar entre 1 y 2 minutos: $\int_1^2 e^{-t}\,dt = e^{-1} - e^{-2} \approx 0.3679 - 0.1353 = 0.2325$.
2. Probabilidad de esperar exactamente 1 minuto: $\int_1^1 e^{-t}\,dt = 0$.
3. Por lo anterior, $P(1 \le T \le 2) = P(1 < T < 2)$: incluir o excluir los extremos no cambia nada.

En cambio, si $N$ cuenta los clientes que llegan en un minuto, $N$ es discreta y $P(N = 1)$ es positiva; ahí sí importa si el extremo se incluye: $P(N \le 1) \ne P(N < 1)$.

:::figura[El ejemplo del tiempo de espera: el área sombreada entre 1 y 2 vale cerca de 0.233, la diferencia entre las alturas de la función de distribución en esos dos puntos.]{componente="DistributionExplorer"}
```yaml
distribucion: exponencial
valores:
  lambda: 1
fijos: [lambda]
desde: 1
hasta: 2
```
:::

## Propiedades

- **Puntos sin masa:** si $X$ es continua, $P(X = x) = 0$ para todo $x$, y por eso $P(a < X < b) = P(a \le X \le b)$.
- **Saltos:** si $X$ es discreta, su función de distribución salta en cada $x_i$ exactamente $P(X = x_i)$ y es constante entre saltos.
- **Densidad y no probabilidad:** en una variable continua, $f(x)$ no es una probabilidad y puede ser mayor que 1; lo que es probabilidad es el área $f(x)\,\Delta x$ de una franja angosta.
- **Hay un tercer caso:** una variable puede tener masas puntuales y una parte continua a la vez; son las [[distribuciones-mixtas]].

:::figura[Una densidad que supera 1: la uniforme en el intervalo de 0 a 0.5 tiene altura 2, pero el área total sigue siendo 1.]{componente="DistributionExplorer"}
```yaml
distribucion: uniforme
valores:
  a: 0
  b: 0.5
fijos: [a, b]
desde: 0.1
hasta: 0.3
```
:::

:::figura[Una variable discreta con muchos valores: el número de llegadas de Poisson con media 12 parece casi continua a lo lejos, pero su función de distribución sigue subiendo por escalones.]{componente="RandomVariableLab"}
```yaml
modo: acumulada
distribucion: poisson
parametros:
  lambda: 12
x: 12
```
:::

## Errores comunes

- **Leer la densidad como probabilidad.** Que $f(0.2) = 2$ no significa que $P(X = 0.2) = 2$, que sería imposible; esa probabilidad es 0.
- **Tratar como discreta una medición redondeada.** Una estatura registrada al centímetro toma valores aislados, pero modelarla como continua suele ser más útil; el redondeo se trata aparte.
- **Suponer que toda variable es de un tipo u otro.** La cantidad de lluvia diaria es 0 con probabilidad positiva y continua cuando llueve: no es ni discreta ni continua.

:::figura[La lluvia diaria como variable mixta: un salto de 0.6 en el valor 0 (días secos) y luego un crecimiento continuo. No es discreta ni continua.]{componente="RandomVariableLab"}
```yaml
modo: mixta
distribucion: exponencial
parametros:
  lambda: 0.5
atomos:
  - x: 0
    p: 0.6
x: 2
```
:::

## Conexiones

Una [[variable-aleatoria]] discreta se describe con su [[funcion-de-masa-de-probabilidad]], y una continua con su [[funcion-de-densidad-de-probabilidad]]. La [[funcion-de-distribucion-acumulada]] describe a ambas, y también a las [[distribuciones-mixtas]]. La diferencia entre sumas e integrales recorre todo el submódulo: la [[esperanza-matematica]] es una suma ponderada en el caso discreto y una integral en el continuo, como el área de la [[integral-definida-como-area]]. En estadística descriptiva, la distinción se refleja en los [[datos-discretos-y-continuos]].

## Formulario

:::formula[Variable discreta]
$$
P(X \in B) = \sum_{x_i \in B} P(X = x_i), \qquad \sum_i P(X = x_i) = 1
$$

- La probabilidad se reparte en valores aislados.
:::

:::formula[Variable continua]
$$
P(a \le X \le b) = \int_a^b f(x)\,dx, \qquad \int_{-\infty}^{\infty} f(x)\,dx = 1
$$

- $f$: densidad; las probabilidades son áreas.
:::

:::formula[Puntos sin masa en el caso continuo]
$$
P(X = x) = 0 \quad \Rightarrow \quad P(a < X < b) = P(a \le X \le b)
$$

- En el caso discreto los extremos sí importan.
:::
