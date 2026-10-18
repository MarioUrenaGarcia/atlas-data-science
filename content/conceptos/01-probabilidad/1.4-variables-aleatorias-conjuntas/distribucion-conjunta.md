---
id: distribucion-conjunta
titulo: Distribución conjunta
titulo_en: Joint distribution
alias:
  - distribución bivariada
  - función de distribución conjunta
  - vector aleatorio
modulo: 1
submodulo: '1.4'
orden: 1
nivel: intermedio
prerrequisitos:
  - funcion-de-distribucion-acumulada
relaciones:
  - tipo: generaliza
    id: funcion-de-distribucion-acumulada
  - tipo: relacionado
    id: integrales-dobles-y-triples
etiquetas:
  - vector aleatorio
  - masa conjunta
  - densidad conjunta
  - dos variables
resumen: >
  La distribución conjunta de dos variables aleatorias describe cómo se reparte la probabilidad
  entre los pares de valores que pueden tomar juntas. Contiene a las distribuciones individuales y,
  además, la relación entre ellas.
formula: 'F_{X,Y}(x, y) = P(X \le x,\ Y \le y), \qquad P\big((X, Y) \in A\big) = \sum_{(x, y) \in A} p(x, y) \ \text{o} \iint_A f(x, y)\,dx\,dy'
visualizacion:
  componente: JointDistribution2D
  parametros:
    modo: conjunta
    experimento: dos-dados
    variable: maximo
    segunda: minimo
    x: 4
    y: 2
referencias:
  - clave: blitzstein-hwang
    capitulo: '7.1'
  - clave: ross-probabilidad
    capitulo: '6.1'
publicado: true
---

## Intuición

Al lanzar dos dados se pueden anotar el mayor y el menor de los dos valores. Cada número por separado tiene su distribución, pero las preguntas interesantes involucran a los dos a la vez: ¿qué tan probable es que el mayor sea 6 y el menor sea 1?, ¿puede el menor superar al mayor? La **distribución conjunta** responde todas esas preguntas porque asigna probabilidad a cada **par** de valores.

Para dos variables discretas, la distribución conjunta es una tabla de doble entrada: filas para los valores de una, columnas para los de la otra y, en cada casilla, la probabilidad de que ocurran ambos. Para dos variables continuas es una superficie de densidad sobre el plano: las probabilidades son volúmenes bajo la superficie. En ambos casos, la tabla o la superficie contiene más información que las dos distribuciones individuales juntas, porque también dice cómo se acompañan.

## Definición

:::definicion[Distribución conjunta]
Sean $X$ y $Y$ dos variables aleatorias definidas sobre el mismo espacio de probabilidad. Su **función de distribución conjunta** es
$$
F_{X,Y}(x, y) = P(X \le x,\ Y \le y), \qquad (x, y) \in \mathbb{R}^2.
$$
Si ambas son discretas, su **función de masa conjunta** es $p(x, y) = P(X = x,\ Y = y)$, con $\sum_x \sum_y p(x, y) = 1$. Si existe una función $f \ge 0$ con
$$
P\big((X, Y) \in A\big) = \iint_A f(x, y)\,dx\,dy
$$
para toda región $A$ del plano, $f$ es la **densidad conjunta**.
:::

El par $(X, Y)$ se llama **vector aleatorio**. Para tres o más variables las definiciones son las mismas con más coordenadas.

:::figura[Una densidad conjunta: la normal bivariada con correlación 0.6. El rectángulo de abajo a la izquierda es el evento $X \le 0,\ Y \le 0$, cuya probabilidad es cerca de 0.352, más que el 0.25 que tendría sin correlación.]{componente="JointDistribution2D"}
```yaml
modo: conjunta
modelo: normal-bivariada
parametros:
  rho: 0.6
x: 0
y: 0
```
:::

:::nota[Qué significa cada símbolo]
- $X$, $Y$: variables aleatorias sobre el mismo experimento.
- $(X, Y)$: vector aleatorio.
- $F_{X,Y}(x, y)$: probabilidad de que $X \le x$ y $Y \le y$ al mismo tiempo.
- $p(x, y)$: función de masa conjunta.
- $f(x, y)$: densidad conjunta.
- $A$: región del plano.
- $\iint_A$: integral doble sobre la región $A$.
- $L$: número de días con lluvia del ejemplo; $S$: indicadora de suspensión.
:::

## Cómo usar la visualización

Cada casilla es un par posible de (mayor, menor) al lanzar dos dados, con su probabilidad: 1/36 en la diagonal (dobles) y 2/36 arriba de ella; abajo no hay probabilidad, porque el menor nunca supera al mayor. Las barras de los bordes son las distribuciones de cada variable por separado.

Las deslizaderas mueven la esquina $(x, y)$: las casillas resaltadas forman el evento $M \le x,\ m \le y$, y el encabezado suma sus probabilidades. Con la esquina en (4, 2) la probabilidad es 1/3. El botón de reproducción lleva la esquina en diagonal y $F$ crece de 0 a 1. Comparar $F(x, y)$ con el producto de las dos probabilidades individuales del panel adelanta la idea de independencia.

## Ejemplo

En un fin de semana, $L$ es el número de días con lluvia (0, 1 o 2) y $S$ indica si se suspende un partido (1) o no (0). La tabla conjunta es:

| | $S = 0$ | $S = 1$ |
| --- | --- | --- |
| $L = 0$ | 0.30 | 0.10 |
| $L = 1$ | 0.20 | 0.20 |
| $L = 2$ | 0.05 | 0.15 |

1. Las seis probabilidades suman $0.30 + 0.10 + 0.20 + 0.20 + 0.05 + 0.15 = 1$.
2. $P(L \ge 1,\ S = 1) = 0.20 + 0.15 = 0.35$.
3. $F(1, 0) = P(L \le 1,\ S \le 0) = 0.30 + 0.20 = 0.50$.
4. $P(S = 1) = 0.10 + 0.20 + 0.15 = 0.45$: sumar una columna da la distribución de una sola variable.

:::figura[La tabla del ejemplo: la esquina en $(1, 0)$ deja abajo a la izquierda las casillas 0.30 y 0.20, y $F(1, 0) = 0.5$.]{componente="JointDistribution2D"}
```yaml
modo: conjunta
valoresX: [0, 1, 2]
valoresY: [0, 1]
probabilidades:
  - [0.30, 0.10]
  - [0.20, 0.20]
  - [0.05, 0.15]
nombreX: días con lluvia
nombreY: suspensión del partido
simboloX: L
simboloY: S
x: 1
y: 0
```
:::

## Propiedades

- **Rango:** $F_{X,Y}$ es no decreciente en cada coordenada, tiende a 0 cuando $x$ o $y$ tienden a $-\infty$ y a 1 cuando ambas tienden a $+\infty$.
- **Rectángulos:** $P(a < X \le b,\ c < Y \le d) = F(b, d) - F(a, d) - F(b, c) + F(a, c)$.
- **Marginales:** $F_X(x) = \lim_{y \to \infty} F_{X,Y}(x, y)$; en masas y densidades, se suma o se integra sobre la otra variable.
- **Soporte:** el conjunto de pares con probabilidad o densidad positiva puede no ser un rectángulo; su forma ya revela dependencia.
- **Densidad y distribución:** donde la densidad es continua, $f(x, y) = \dfrac{\partial^2 F}{\partial x\, \partial y}(x, y)$.

:::figura[Un soporte triangular: la densidad uniforme sobre $0 < x < y < 1$ vale 2 en el triángulo y 0 fuera. Saber que $X$ es grande obliga a $Y$ a ser aún más grande.]{componente="JointDistribution2D"}
```yaml
modo: conjunta
modelo: uniforme-triangulo
x: 0.5
y: 0.5
```
:::

## Errores comunes

- **Creer que las distribuciones individuales determinan la conjunta.** Dos tablas muy distintas pueden tener los mismos bordes; la relación entre las variables solo está en la conjunta.
- **Olvidar que las variables viven en el mismo experimento.** La distribución conjunta de la estatura de una persona y el peso de otra elegida por separado no describe la relación entre estatura y peso.
- **Sumar probabilidades de casillas que se traslapan.** Para eventos como "$X \le 1$ o $Y \le 0$" se cuentan las casillas una sola vez, como en la fórmula de la unión.

:::figura[Dos monedas que siempre coinciden: la tabla pone 0.5 en (0, 0) y 0.5 en (1, 1). Cada moneda por separado es equilibrada, igual que dos monedas independientes, pero la conjunta es completamente distinta.]{componente="JointDistribution2D"}
```yaml
modo: conjunta
valoresX: [0, 1]
valoresY: [0, 1]
probabilidades:
  - [0.5, 0]
  - [0, 0.5]
nombreX: la primera moneda
nombreY: la segunda moneda
x: 0
y: 0
```
:::

## Conexiones

La distribución conjunta generaliza la [[funcion-de-distribucion-acumulada]] a varias variables y usa la [[integral-definida-como-area]] en su versión de [[integrales-dobles-y-triples]]. De ella se obtienen las [[distribuciones-marginales]] y la [[distribucion-condicional]], y en ella se definen la [[independencia-de-variables-aleatorias]] y la [[covarianza]]. Las [[copulas]] la separan en marginales y dependencia, y la [[suma-de-variables-aleatorias]] es una de las funciones del par cuya distribución se calcula a partir de ella.

## Formulario

:::formula[Función de distribución conjunta]
$$
F_{X,Y}(x, y) = P(X \le x,\ Y \le y)
$$

- $X$, $Y$: variables sobre el mismo experimento.
:::

:::formula[Caso discreto]
$$
p(x, y) = P(X = x,\ Y = y), \qquad \sum_x \sum_y p(x, y) = 1
$$

- Una probabilidad por cada par de valores.
:::

:::formula[Caso continuo]
$$
P\big((X, Y) \in A\big) = \iint_A f(x, y)\,dx\,dy, \qquad \iint_{\mathbb{R}^2} f = 1
$$

- $f$: densidad conjunta; $A$: región del plano.
:::

:::formula[Probabilidad de un rectángulo]
$$
P(a < X \le b,\ c < Y \le d) = F(b, d) - F(a, d) - F(b, c) + F(a, c)
$$

- Inclusión y exclusión de las cuatro esquinas.
:::
