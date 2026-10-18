---
id: funcion-de-supervivencia
titulo: Función de supervivencia
titulo_en: Survival function
alias:
  - función de confiabilidad
  - cola derecha
  - complemento de la función de distribución
modulo: 1
submodulo: '1.3'
orden: 8
nivel: basico
prerrequisitos:
  - funcion-de-distribucion-acumulada
relaciones:
  - tipo: relacionado
    id: funcion-cuantil
etiquetas:
  - cola derecha
  - confiabilidad
  - tiempo de vida
  - tasa de riesgo
  - falta de memoria
resumen: >
  La función de supervivencia da la probabilidad de que una variable supere un valor x. Es el
  complemento de la función de distribución y es la forma natural de describir tiempos de vida,
  colas pesadas y riesgos.
formula: 'S(x) = P(X > x) = 1 - F(x)'
visualizacion:
  componente: RandomVariableLab
  parametros:
    modo: acumulada
    vista: supervivencia
    distribucion: weibull
    parametros:
      k: 2
      lambda: 1
    x: 1
referencias:
  - clave: ross-probabilidad
    capitulo: '5.5'
publicado: true
---

## Intuición

En muchos problemas lo que interesa es la cola derecha: la probabilidad de que un componente siga funcionando después de 5 años, de que un paciente sobreviva más de un año, de que una pérdida supere cierto monto. Esa probabilidad, como función del umbral, es la **función de supervivencia**.

Es simplemente lo que le falta a la función de distribución para llegar a 1, pero cambia el punto de vista. En lugar de acumular lo que ya ocurrió, mide lo que sigue en pie: empieza en 1 (todo sobrevive al principio) y baja hacia 0 (al final nada sobrevive). La rapidez con que baja describe la cola: si baja como $e^{-x}$ los valores grandes son rarísimos; si baja como $1/x^2$, los valores enormes aparecen con cierta frecuencia.

## Definición

:::definicion[Función de supervivencia]
La **función de supervivencia** de una variable aleatoria $X$ es
$$
S(x) = P(X > x) = 1 - F(x), \qquad x \in \mathbb{R}.
$$
:::

$S$ es no creciente, continua por la derecha, con $S(x) \to 1$ cuando $x \to -\infty$ y $S(x) \to 0$ cuando $x \to \infty$. Para una variable continua con densidad $f$, $S(x) = \int_x^\infty f(t)\,dt$ y $S'(x) = -f(x)$.

:::figura[La cara de un dado: la supervivencia en 4 es $P(X > 4) = 2/6$, la masa de las caras 5 y 6.]{componente="RandomVariableLab"}
```yaml
modo: acumulada
vista: supervivencia
experimento: dado
variable: valor
x: 4
```
:::

:::nota[Qué significa cada símbolo]
- $X$: variable aleatoria, típicamente un tiempo de vida.
- $S(x)$: probabilidad de que $X$ supere a $x$.
- $F(x)$: función de distribución.
- $f(x)$: densidad.
- $h(x)$: tasa de riesgo, probabilidad instantánea de falla entre los que siguen en pie.
- $T$: vida útil del componente del ejemplo, en años.
:::

## Cómo usar la visualización

La gráfica de arriba es la densidad de un tiempo de vida de Weibull; la de abajo, su función de supervivencia. Al mover el punto $x$, el área sombreada a la derecha de $x$ es $S(x)$ y coincide con la altura de la curva de abajo. La curva empieza en 1 y baja hacia 0: cada valor de $x$ dice qué fracción de las unidades sigue funcionando en ese momento.

El botón de reproducción barre $x$ de izquierda a derecha, y se ve cómo el área a la derecha se va agotando.

## Ejemplo

La vida útil $T$ de un componente es exponencial con media 5 años: $S(t) = e^{-t/5}$ para $t \ge 0$.

1. Probabilidad de que dure más de 5 años: $S(5) = e^{-1} \approx 0.368$.
2. Probabilidad de que dure más de 10 años: $S(10) = e^{-2} \approx 0.135$.
3. Probabilidad de que dure 5 años más, sabiendo que ya duró 3: $P(T > 8 \mid T > 3) = S(8) / S(3) = e^{-1} \approx 0.368$, igual que para un componente nuevo.

El tercer cálculo es la **falta de memoria** de la exponencial: un componente usado no está más gastado que uno nuevo.

:::figura[El componente del ejemplo: la supervivencia en 5 años, la media, es cerca de 0.368. La curva cruza 0.5 hacia los 3.5 años y sigue bajando sin llegar a 0.]{componente="RandomVariableLab"}
```yaml
modo: acumulada
vista: supervivencia
distribucion: exponencial
parametros:
  lambda: 0.2
x: 5
```
:::

## Propiedades

- **Media como área:** si $X \ge 0$, entonces $\mathbb{E}[X] = \int_0^\infty S(x)\,dx$; en el caso discreto con valores enteros, $\mathbb{E}[X] = \sum_{k \ge 0} P(X > k)$.
- **Supervivencia condicional:** $P(X > x + s \mid X > x) = S(x + s) / S(x)$.
- **Tasa de riesgo:** $h(x) = f(x) / S(x)$ mide la probabilidad de falla inmediata entre las unidades que siguen en pie, y $S(x) = \exp\left(-\int_0^x h(t)\,dt\right)$.
- **Colas:** la velocidad con que $S(x) \to 0$ clasifica las distribuciones; una cola potencial como $S(x) = x^{-\alpha}$ es pesada, una exponencial es ligera.

:::figura[Una cola pesada: la supervivencia de Pareto con índice 1.5 decae como $x^{-1.5}$, mucho más despacio que una exponencial, y valores 10 veces mayores que el mínimo siguen teniendo probabilidad apreciable.]{componente="RandomVariableLab"}
```yaml
modo: acumulada
vista: supervivencia
distribucion: pareto
parametros:
  xm: 1
  alpha: 1.5
x: 4
```
:::

## Errores comunes

- **Confundir $>$ con $\ge$ en variables discretas.** En el dado, $P(X > 4) = 1/3$ pero $P(X \ge 4) = 1/2$.
- **Interpretar la supervivencia como tasa de falla.** $S(x)$ es una probabilidad acumulada; la propensión a fallar en cada instante es la tasa de riesgo $h(x)$, que puede subir aunque $S$ siempre baje.
- **Suponer falta de memoria en todos los tiempos de vida.** Solo la exponencial (y la geométrica en el caso discreto) la tienen. Con desgaste, como en la Weibull con forma mayor que 1, una unidad usada sobrevive menos que una nueva.

:::figura[La supervivencia de la cara de un dado en 3.5: vale 0.5, la masa de 4, 5 y 6. En el mismo dado, $P(X \ge 4)$ también vale 0.5, mientras que $P(X > 4)$ baja a 1/3.]{componente="RandomVariableLab"}
```yaml
modo: acumulada
vista: supervivencia
experimento: dado
variable: valor
x: 3.5
```
:::

## Conexiones

La función de supervivencia es el complemento de la [[funcion-de-distribucion-acumulada]], y sus cuantiles altos se leen con la [[funcion-cuantil]]. Para variables no negativas, el área bajo ella es la [[esperanza-matematica]]. La forma de la cola que describe se relaciona con la [[curtosis]] y con las [[colas-ligeras-y-pesadas-en-datos]]. Las desigualdades de probabilidad del submódulo siguiente acotan $P(X > x)$ con la media y la varianza sin conocer la distribución.

## Formulario

:::formula[Definición]
$$
S(x) = P(X > x) = 1 - F(x)
$$

- No creciente, de 1 a 0.
:::

:::formula[Caso continuo]
$$
S(x) = \int_x^\infty f(t)\,dt, \qquad S'(x) = -f(x)
$$

- $f$: densidad de $X$.
:::

:::formula[Media de una variable no negativa]
$$
\mathbb{E}[X] = \int_0^\infty S(x)\,dx
$$

- Caso entero: $\mathbb{E}[X] = \sum_{k \ge 0} P(X > k)$.
:::

:::formula[Tasa de riesgo]
$$
h(x) = \frac{f(x)}{S(x)}, \qquad S(x) = \exp\left(-\int_0^x h(t)\,dt\right)
$$

- Para tiempos de vida no negativos.
:::
