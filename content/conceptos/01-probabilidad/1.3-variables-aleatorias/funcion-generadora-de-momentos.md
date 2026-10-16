---
id: funcion-generadora-de-momentos
titulo: Función generadora de momentos
titulo_en: Moment generating function
alias:
  - FGM
  - MGF
  - transformada de Laplace bilateral de la distribución
modulo: 1
submodulo: '1.3'
orden: 21
nivel: intermedio
prerrequisitos:
  - momentos
  - serie-de-taylor-y-de-maclaurin
relaciones:
  - tipo: relacionado
    id: funcion-caracteristica
  - tipo: relacionado
    id: funcion-generadora-de-probabilidad
etiquetas:
  - generadora de momentos
  - serie de Taylor
  - suma de independientes
  - unicidad
resumen: >
  La función generadora de momentos es la esperanza de e elevado a tX. Cuando existe cerca de 0,
  sus derivadas en 0 son los momentos, determina la distribución por completo y convierte la suma
  de variables independientes en un producto.
formula: 'M_X(t) = \mathbb{E}\big[e^{tX}\big] = \sum_{k=0}^{\infty} \mathbb{E}[X^k]\,\frac{t^k}{k!}, \qquad M_X^{(k)}(0) = \mathbb{E}[X^k]'
visualizacion:
  componente: MomentFunctionViz
  parametros:
    modo: fgm
    distribucion: poisson
    parametros:
      lambda: 2
    t: 0.8
    orden: 4
referencias:
  - clave: blitzstein-hwang
    capitulo: '6.4 a 6.6'
  - clave: ross-probabilidad
    capitulo: '7.7'
publicado: true
---

## Intuición

Los momentos $\mathbb{E}[X], \mathbb{E}[X^2], \mathbb{E}[X^3], \dots$ son una lista infinita de números. La **función generadora de momentos** los empaca en una sola función, del mismo modo que una serie de potencias guarda todos sus coeficientes. La clave es la serie de Taylor de la exponencial:
$$
e^{tX} = 1 + tX + \frac{t^2 X^2}{2!} + \frac{t^3 X^3}{3!} + \cdots
$$
Tomando esperanzas término a término, los momentos aparecen como coeficientes. Para recuperarlos basta derivar en $t = 0$: la primera derivada da la media, la segunda da $\mathbb{E}[X^2]$, y así sucesivamente.

Su segunda virtud es todavía más útil: si $X$ y $Y$ son independientes, $e^{t(X+Y)} = e^{tX} e^{tY}$ y la generadora de la suma es el producto de las generadoras. Calcular la distribución de una suma, que normalmente exige una convolución, se reduce a multiplicar funciones.

## Definición

:::definicion[Función generadora de momentos]
La **función generadora de momentos** de una variable aleatoria $X$ es
$$
M_X(t) = \mathbb{E}\big[e^{tX}\big],
$$
definida para los $t$ en los que la esperanza es finita. Se dice que la generadora existe si es finita en un intervalo abierto que contiene a 0. En ese caso todos los momentos son finitos y
$$
M_X^{(k)}(0) = \mathbb{E}[X^k], \qquad M_X(t) = \sum_{k=0}^{\infty} \mathbb{E}[X^k]\,\frac{t^k}{k!}.
$$
:::

Siempre $M_X(0) = 1$. En el caso discreto $M_X(t) = \sum_x e^{tx} p(x)$, y en el continuo $\int e^{tx} f(x)\,dx$.

:::figura[La exponencial con media 1 tiene $M(t) = 1/(1 - t)$ para $t < 1$. Sus polinomios de Taylor usan los momentos 1, 2, 6 y 24 y se pegan a la curva cerca de 0.]{componente="MomentFunctionViz"}
```yaml
modo: fgm
distribucion: exponencial
parametros:
  lambda: 1
t: 0.6
orden: 4
```
:::

:::nota[Qué significa cada símbolo]
- $X$, $Y$: variables aleatorias.
- $t$: variable real de la función generadora.
- $M_X(t)$: función generadora de momentos de $X$.
- $M_X^{(k)}(0)$: derivada de orden $k$ en $t = 0$.
- $k!$: factorial de $k$.
- $n$, $p$: parámetros de la binomial del ejemplo.
- $a$, $b$: constantes de una transformación afín.
:::

## Cómo usar la visualización

La curva es la generadora de una Poisson con media 2 en un intervalo alrededor de $t = 0$. La animación agrega un término de la serie a la vez: el polinomio de orden 1 es la recta tangente, de pendiente $\mathbb{E}[X] = 2$; el de orden 2 agrega la curvatura, $\mathbb{E}[X^2] = 6$; y cada orden nuevo pega el polinomio a la curva en un intervalo mayor. El encabezado escribe el polinomio con los momentos actuales, y el panel los lista.

## Ejemplo

$X$ es binomial con $n$ ensayos y probabilidad $p$, es decir, la suma de $n$ indicadoras independientes $I_k$ con $M_{I_k}(t) = 1 - p + p e^{t}$.

1. Por independencia, $M_X(t) = (1 - p + pe^{t})^n$.
2. $M_X'(t) = n(1 - p + pe^{t})^{n-1} pe^{t}$, y en $t = 0$: $\mathbb{E}[X] = np$.
3. $M_X''(0) = n(n - 1)p^2 + np$, de donde $\operatorname{Var}(X) = n(n-1)p^2 + np - (np)^2 = np(1 - p)$.
4. Con $n = 4$ y $p = 1/2$: $\mathbb{E}[X] = 2$ y $\mathbb{E}[X^2] = 3 + 2 = 5$.

:::figura[La binomial del ejemplo con 4 ensayos y $p = 1/2$: los coeficientes de la serie son los momentos 2, 5, 14 y 42.5, y el polinomio de orden 4 casi coincide con la curva en todo el intervalo.]{componente="MomentFunctionViz"}
```yaml
modo: fgm
distribucion: binomial
parametros:
  n: 4
  p: 0.5
t: 1
orden: 4
```
:::

## Propiedades

- **Unicidad:** si $M_X$ y $M_Y$ existen y coinciden en un intervalo alrededor de 0, $X$ y $Y$ tienen la misma distribución.
- **Sumas independientes:** si $X$ y $Y$ son independientes, $M_{X+Y}(t) = M_X(t)\,M_Y(t)$.
- **Transformación afín:** $M_{aX+b}(t) = e^{bt} M_X(at)$.
- **Convexidad:** $M_X$ es convexa y $\log M_X$ también; esta última es la generadora de cumulantes.
- **Colas:** si $M_X(t)$ existe para algún $t > 0$, la cola derecha decae al menos exponencialmente: $P(X \ge a) \le e^{-ta} M_X(t)$.

:::figura[La normal estándar tiene $M(t) = e^{t^2/2}$: los momentos impares son 0 y los pares son 1 y 3, así que los polinomios de orden 1 y 3 no agregan nada nuevo.]{componente="MomentFunctionViz"}
```yaml
modo: fgm
distribucion: normal
t: 1.5
orden: 4
```
:::

## Errores comunes

- **Suponer que siempre existe.** La Cauchy, la $t$ de Student y la Pareto no tienen generadora; la lognormal tiene todos sus momentos, pero $\mathbb{E}[e^{tX}] = \infty$ para todo $t > 0$. En esos casos se usa la función característica.
- **Multiplicar generadoras de variables dependientes.** $M_{X+Y} = M_X M_Y$ requiere independencia.
- **Leer los momentos en valores de $M$.** Los momentos son derivadas en $t = 0$; el valor $M(1)$ es $\mathbb{E}[e^{X}]$, no la media.

:::figura[Una variable que vale $-1$ o 1 con probabilidad 1/2 tiene $M(t) = \cosh t$. La pendiente en 0 es la media, 0, aunque $M(1) \approx 1.54$.]{componente="MomentFunctionViz"}
```yaml
modo: fgm
valores: [-1, 1]
probabilidades: [0.5, 0.5]
nombre: un paso aleatorio de tamaño 1
t: 1.5
orden: 4
```
:::

## Conexiones

La generadora guarda todos los [[momentos]] como coeficientes de una [[serie-de-taylor-y-de-maclaurin]], y se calcula con la [[ley-del-estadistico-inconsciente]] aplicada a $e^{tx}$. Su logaritmo es la generadora de cumulantes, estudiada en [[cumulantes-y-funcion-generadora-de-cumulantes]]. Cuando no existe se usa la [[funcion-caracteristica]], que siempre existe, y para variables con valores enteros no negativos la [[funcion-generadora-de-probabilidad]] es más cómoda. La cota $P(X \ge a) \le e^{-ta} M(t)$ es el punto de partida de la [[teoria-de-grandes-desviaciones]].

## Formulario

:::formula[Definición]
$$
M_X(t) = \mathbb{E}\big[e^{tX}\big]
$$

- Existe si es finita en un intervalo alrededor de 0.
:::

:::formula[Momentos]
$$
\mathbb{E}[X^k] = M_X^{(k)}(0)
$$

- Derivada de orden $k$ en $t = 0$.
:::

:::formula[Suma de independientes]
$$
M_{X+Y}(t) = M_X(t)\, M_Y(t)
$$

- Convierte convoluciones en productos.
:::

:::formula[Transformación afín]
$$
M_{aX+b}(t) = e^{bt} M_X(at)
$$

- $a$, $b$: constantes.
:::

:::formula[Ejemplos]
$$
\text{Normal: } e^{\mu t + \sigma^2 t^2/2}, \qquad \text{Poisson: } e^{\lambda(e^{t} - 1)}, \qquad \text{Exponencial: } \frac{\lambda}{\lambda - t}
$$

- La exponencial solo para $t < \lambda$.
:::
