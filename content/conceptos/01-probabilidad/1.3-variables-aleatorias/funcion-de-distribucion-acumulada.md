---
id: funcion-de-distribucion-acumulada
titulo: Función de distribución acumulada
titulo_en: Cumulative distribution function
alias:
  - función de distribución
  - CDF
  - fda
modulo: 1
submodulo: '1.3'
orden: 5
nivel: basico
prerrequisitos:
  - variables-discretas-vs-continuas
relaciones:
  - tipo: relacionado
    id: funcion-de-supervivencia
  - tipo: relacionado
    id: funcion-cuantil
etiquetas:
  - probabilidad acumulada
  - función no decreciente
  - continuidad por la derecha
  - saltos
resumen: >
  La función de distribución acumulada da, para cada número x, la probabilidad de que la variable
  no lo supere. Existe para cualquier variable aleatoria, discreta, continua o mixta, y la
  determina por completo.
formula: 'F_X(x) = P(X \le x), \qquad P(a < X \le b) = F_X(b) - F_X(a)'
visualizacion:
  componente: RandomVariableLab
  parametros:
    modo: acumulada
    distribucion: binomial
    parametros:
      n: 10
      p: 0.3
    x: 3
referencias:
  - clave: blitzstein-hwang
    capitulo: '3.6'
  - clave: ross-probabilidad
publicado: true
---

## Intuición

La función de distribución acumulada responde una sola pregunta para cada número $x$: ¿qué tan probable es que la variable salga menor o igual que $x$? Al recorrer $x$ de izquierda a derecha, la respuesta va acumulando la probabilidad que queda atrás, desde 0 hasta 1.

Su gran ventaja es que funciona para cualquier variable. En una variable discreta sube por escalones, con un salto en cada valor posible; en una continua sube suavemente; en una mixta hace las dos cosas. Con ella se calcula la probabilidad de cualquier intervalo restando dos valores: la probabilidad de caer entre $a$ y $b$ es lo acumulado hasta $b$ menos lo acumulado hasta $a$.

## Definición

:::definicion[Función de distribución acumulada]
La **función de distribución acumulada** de una variable aleatoria $X$ es
$$
F_X(x) = P(X \le x), \qquad x \in \mathbb{R}.
$$
:::

Una función $F : \mathbb{R} \to [0, 1]$ es la función de distribución de alguna variable aleatoria si y solo si es no decreciente, continua por la derecha, y cumple $\lim_{x \to -\infty} F(x) = 0$ y $\lim_{x \to \infty} F(x) = 1$. Dos variables tienen la misma distribución exactamente cuando tienen la misma función de distribución.

:::figura[La cara de un dado: la función de distribución vale 0 antes de 1, sube 1/6 en cada cara y vale 1 desde 6. En 3.5 vale 3/6, lo acumulado por las caras 1, 2 y 3.]{componente="RandomVariableLab"}
```yaml
modo: acumulada
experimento: dado
variable: valor
x: 3.5
```
:::

:::nota[Qué significa cada símbolo]
- $X$: variable aleatoria.
- $F_X(x)$: probabilidad de que $X$ sea menor o igual que $x$; se escribe $F(x)$ si no hay ambigüedad.
- $a$, $b$: extremos de un intervalo, con $a < b$.
- $F(x^-)$: límite de $F$ por la izquierda en $x$.
- $p(x)$, $f(x)$: función de masa y densidad.
- $T$: vida útil del foco del ejemplo, en años.
:::

## Cómo usar la visualización

Arriba están las barras de una binomial con 10 ensayos y probabilidad 0.3; abajo, su función de distribución. Al mover el punto $x$, las barras a la izquierda de $x$ se iluminan y la altura de la curva de abajo es la suma de esas barras. Entre dos enteros la curva es plana; en cada entero salta exactamente la altura de su barra.

La segunda deslizadera elige una probabilidad $p$, y la línea punteada lee el cuantil correspondiente: sube a la altura $p$, avanza hasta la curva y baja al eje.

## Ejemplo

La vida útil $T$ de un foco, en años, tiene función de distribución $F(t) = 1 - e^{-t/2}$ para $t \ge 0$ (exponencial con media 2).

1. Probabilidad de que falle en el primer año: $F(1) = 1 - e^{-0.5} \approx 0.393$.
2. Probabilidad de que dure entre 1 y 3 años: $F(3) - F(1) = e^{-0.5} - e^{-1.5} \approx 0.607 - 0.223 = 0.383$.
3. Probabilidad de que dure más de 4 años: $1 - F(4) = e^{-2} \approx 0.135$.
4. Densidad: $f(t) = F'(t) = \tfrac{1}{2} e^{-t/2}$.

:::figura[El foco del ejemplo: en $t = 2$ la función de distribución vale cerca de 0.632. Aunque la media es 2 años, más de la mitad de los focos falla antes.]{componente="RandomVariableLab"}
```yaml
modo: acumulada
distribucion: exponencial
parametros:
  lambda: 0.5
x: 2
p: 0.5
```
:::

## Propiedades

- **Intervalos:** $P(a < X \le b) = F(b) - F(a)$ y $P(X > x) = 1 - F(x)$.
- **Saltos:** $P(X = x) = F(x) - F(x^-)$, el tamaño del salto en $x$. Si $F$ es continua en $x$, ese punto no tiene masa.
- **Discreta:** $F(x) = \sum_{t \le x} p(t)$, una función escalonada.
- **Continua:** $F(x) = \int_{-\infty}^{x} f(t)\,dt$, una función continua con $F' = f$ donde $f$ es continua.
- **Continuidad por la derecha:** en cada salto, el valor de $F$ es el de arriba, porque $\{X \le x\}$ incluye al propio $x$.

:::figura[Una función de distribución con saltos y tramos continuos: el tiempo de espera en un semáforo vale 0 con probabilidad 0.4 (luz verde) y se reparte de manera uniforme entre 0 y 2 minutos si la luz está en rojo.]{componente="RandomVariableLab"}
```yaml
modo: mixta
distribucion: uniforme
parametros:
  a: 0
  b: 2
atomos:
  - x: 0
    p: 0.4
x: 1
```
:::

## Errores comunes

- **Confundir $\le$ con $<$ en variables discretas.** Para un dado, $P(X \le 3) = 1/2$ pero $P(X < 3) = 1/3$; la diferencia es $P(X = 3)$.
- **Restar mal en intervalos cerrados.** $P(a \le X \le b) = F(b) - F(a^-)$, que en el caso discreto incluye la masa de $a$.
- **Tomar la función de distribución por la densidad.** $F$ siempre está entre 0 y 1 y nunca baja; una curva que sube y baja no puede ser una función de distribución.

:::figura[En el dado, $F(3) = 0.5$: la masa del 3 cuenta porque la desigualdad incluye al propio valor. Justo antes de 3, la curva vale 1/3.]{componente="RandomVariableLab"}
```yaml
modo: acumulada
experimento: dado
variable: valor
x: 3
```
:::

## Conexiones

La función de distribución existe para toda [[variable-aleatoria]] y describe por igual las discretas, las continuas y las [[distribuciones-mixtas]] (ver [[variables-discretas-vs-continuas]]). Sumando la [[funcion-de-masa-de-probabilidad]] o integrando la [[funcion-de-densidad-de-probabilidad]] se obtiene $F$. Su complemento $1 - F$ es la [[funcion-de-supervivencia]], y su inversa generalizada es la [[funcion-cuantil]]. Evaluar una variable en su propia función de distribución da una uniforme, la [[transformada-integral-de-probabilidad]], y el [[metodo-de-la-cdf-para-transformaciones]] la usa para hallar la distribución de $g(X)$. La [[convergencia-en-distribucion]] se define como convergencia de funciones de distribución.

## Formulario

:::formula[Definición]
$$
F_X(x) = P(X \le x)
$$

- No decreciente, continua por la derecha, de 0 a 1.
:::

:::formula[Probabilidad de un intervalo]
$$
P(a < X \le b) = F_X(b) - F_X(a)
$$

- $a < b$; el extremo izquierdo queda excluido.
:::

:::formula[Masa de un punto]
$$
P(X = x) = F_X(x) - F_X(x^-)
$$

- Es el tamaño del salto; vale 0 donde $F_X$ es continua.
:::

:::formula[Discreta y continua]
$$
F_X(x) = \sum_{t \le x} p_X(t), \qquad F_X(x) = \int_{-\infty}^{x} f_X(t)\,dt
$$

- Suma de masas o área bajo la densidad.
:::
