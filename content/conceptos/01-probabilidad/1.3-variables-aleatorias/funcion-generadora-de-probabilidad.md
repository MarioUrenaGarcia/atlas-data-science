---
id: funcion-generadora-de-probabilidad
titulo: Función generadora de probabilidad
titulo_en: Probability generating function
alias:
  - FGP
  - PGF
  - función generadora de una variable entera
modulo: 1
submodulo: '1.3'
orden: 23
nivel: intermedio
prerrequisitos:
  - ley-del-estadistico-inconsciente
  - serie-de-taylor-y-de-maclaurin
relaciones:
  - tipo: relacionado
    id: funcion-generadora-de-momentos
  - tipo: relacionado
    id: distribucion-de-poisson
etiquetas:
  - serie de potencias
  - variables de conteo
  - momentos factoriales
  - suma aleatoria
resumen: >
  La generadora de probabilidad de una variable de conteo es la serie de potencias cuyos coeficientes son sus probabilidades. Da la media como pendiente en s = 1 y convierte sumas independientes en productos.
formula: 'G_X(s) = \mathbb{E}\big[s^X\big] = \sum_{k=0}^{\infty} P(X = k)\, s^k, \qquad |s| \le 1'
visualizacion:
  componente: MomentFunctionViz
  parametros:
    modo: fgp
    distribucion: poisson
    parametros:
      lambda: 2
    orden: 6
referencias:
  - clave: ross-procesos
    capitulo: '2.6'
  - clave: karlin-taylor
    capitulo: '1.1'
publicado: true
---

## Intuición

Para una variable que cuenta (clientes, defectos, hijos, llegadas), la función de masa es una lista de números $p_0, p_1, p_2, \dots$. La **función generadora de probabilidad** los convierte en los coeficientes de un polinomio o serie,
$$
G(s) = p_0 + p_1 s + p_2 s^2 + p_3 s^3 + \cdots,
$$
en la que $s$ es una variable auxiliar sin significado propio: solo sirve para mantener separados los coeficientes.

El truco paga por dos razones. Primero, operaciones difíciles con listas se vuelven operaciones fáciles con funciones: la distribución de la suma de dos conteos independientes es el producto de sus generadoras, porque multiplicar polinomios es exactamente sumar exponentes con todas las combinaciones. Segundo, la información está a la vista: $G(0) = p_0$, $G(1) = 1$ y la pendiente en $s = 1$ es la media.

## Definición

:::definicion[Función generadora de probabilidad]
Sea $X$ una variable aleatoria con valores en $\{0, 1, 2, \dots\}$. Su **función generadora de probabilidad** es
$$
G_X(s) = \mathbb{E}\big[s^X\big] = \sum_{k=0}^{\infty} P(X = k)\, s^k,
$$
que converge al menos para $|s| \le 1$.
:::

Las probabilidades se recuperan derivando en 0: $P(X = k) = G_X^{(k)}(0) / k!$. Los momentos factoriales se obtienen derivando en 1: $G_X'(1) = \mathbb{E}[X]$ y $G_X''(1) = \mathbb{E}[X(X - 1)]$.

:::figura[La cara de un dado tiene $G(s) = (s + s^2 + \dots + s^6)/6$: el término constante es 0 porque la cara 0 no existe, y la pendiente en 1 es 3.5.]{componente="MomentFunctionViz"}
```yaml
modo: fgp
valores: [1, 2, 3, 4, 5, 6]
nombre: la cara de un dado
orden: 6
```
:::

:::nota[Qué significa cada símbolo]
- $X$, $Y$, $N$: variables con valores enteros no negativos.
- $s$: variable auxiliar, con $|s| \le 1$.
- $G_X(s)$: función generadora de probabilidad de $X$.
- $p_k = P(X = k)$: probabilidades de la función de masa.
- $G_X^{(k)}$: derivada de orden $k$.
- $\mathbb{E}[X(X-1)]$: segundo momento factorial.
- $S$: suma de dos dados del ejemplo.
:::

## Cómo usar la visualización

A la izquierda está la generadora de una Poisson con media 2 entre $s = 0$ y $s = 1$; a la derecha, su función de masa. La animación suma la serie término por término: cada término $p_k s^k$ usa la barra $k$ de la derecha, que se ilumina, y la suma parcial punteada sube hacia la curva. El encabezado escribe el polinomio con las probabilidades actuales.

Al final aparece la tangente en $s = 1$, cuya pendiente es la media, 2. El punto de la izquierda, en $s = 0$, es $G(0) = P(X = 0) = e^{-2} \approx 0.135$.

## Ejemplo

$S$ es la suma de dos dados independientes. Cada dado tiene $G(s) = \tfrac{1}{6}(s + s^2 + \dots + s^6)$.

1. Por independencia, $G_S(s) = G(s)^2 = \tfrac{1}{36}(s + s^2 + \dots + s^6)^2$.
2. Al desarrollar el cuadrado, el coeficiente de $s^k$ cuenta las maneras de escribir $k$ como suma de dos números entre 1 y 6.
3. El coeficiente de $s^4$ viene de $s \cdot s^3$, $s^2 \cdot s^2$ y $s^3 \cdot s$: $P(S = 4) = 3/36$.
4. $G_S'(1) = 2\,G(1)\,G'(1) = 2 \cdot 1 \cdot 3.5 = 7$.

:::figura[La generadora de la suma de dos dados: los coeficientes 1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1 (sobre 36) de las potencias 2 a 12 son la función de masa de la suma.]{componente="MomentFunctionViz"}
```yaml
modo: fgp
valores: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
probabilidades: [1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1]
nombre: la suma de dos dados
orden: 8
```
:::

## Propiedades

- **Normalización:** $G(1) = 1$ y $G(0) = P(X = 0)$.
- **Momentos factoriales:** $G'(1) = \mathbb{E}[X]$, $G''(1) = \mathbb{E}[X(X-1)]$, y $\operatorname{Var}(X) = G''(1) + G'(1) - G'(1)^2$.
- **Sumas independientes:** $G_{X+Y}(s) = G_X(s)\,G_Y(s)$.
- **Sumas aleatorias:** si $N$ es independiente de $X_1, X_2, \dots$ idénticas, la suma $X_1 + \dots + X_N$ tiene generadora $G_N(G_X(s))$.
- **Relación con la generadora de momentos:** $M_X(t) = G_X(e^{t})$.
- **Familias:** binomial $(1 - p + ps)^n$, Poisson $e^{\lambda(s - 1)}$.

:::figura[La binomial con 4 ensayos y probabilidad 0.4 tiene $G(s) = (0.6 + 0.4s)^4$, un polinomio de grado 4: la serie termina después de cinco términos y su pendiente en 1 es $4 \cdot 0.4 = 1.6$.]{componente="MomentFunctionViz"}
```yaml
modo: fgp
distribucion: binomial
parametros:
  n: 4
  p: 0.4
orden: 4
```
:::

## Errores comunes

- **Usarla con valores negativos o no enteros.** La definición supone valores en $\{0, 1, 2, \dots\}$; para otras variables se usa la generadora de momentos o la característica.
- **Leer la media en $G(1)$.** $G(1) = 1$ siempre; la media es la pendiente, $G'(1)$, que puede ser infinita.
- **Olvidar el desplazamiento del soporte.** La geométrica que cuenta ensayos hasta el primer éxito empieza en 1, y su generadora no tiene término constante.

:::figura[La geométrica con $p = 0.3$ cuenta los ensayos hasta el primer éxito: $G(0) = 0$ porque nunca vale 0, y la pendiente en 1 es $1/0.3 \approx 3.33$.]{componente="MomentFunctionViz"}
```yaml
modo: fgp
distribucion: geometrica
parametros:
  p: 0.3
orden: 6
```
:::

## Conexiones

La generadora de probabilidad guarda la [[funcion-de-masa-de-probabilidad]] de una variable de conteo como una serie de potencias, y se calcula con la [[ley-del-estadistico-inconsciente]] aplicada a $s^x$. Con $s = e^{t}$ se convierte en la [[funcion-generadora-de-momentos]], y con $s = e^{it}$ en la [[funcion-caracteristica]]. Es la herramienta natural para la [[distribucion-de-poisson]], la [[distribucion-binomial]] y la [[distribucion-geometrica]], y para estudiar procesos de ramificación y sumas aleatorias.

## Formulario

:::formula[Definición]
$$
G_X(s) = \mathbb{E}\big[s^X\big] = \sum_{k \ge 0} P(X = k)\, s^k
$$

- Para variables con valores enteros no negativos.
:::

:::formula[Probabilidades y momentos]
$$
P(X = k) = \frac{G_X^{(k)}(0)}{k!}, \qquad \mathbb{E}[X] = G_X'(1)
$$

- Derivadas en 0 y en 1.
:::

:::formula[Varianza]
$$
\operatorname{Var}(X) = G_X''(1) + G_X'(1) - G_X'(1)^2
$$

- $G_X''(1) = \mathbb{E}[X(X-1)]$.
:::

:::formula[Sumas]
$$
G_{X+Y}(s) = G_X(s)\,G_Y(s), \qquad G_{X_1 + \dots + X_N}(s) = G_N(G_X(s))
$$

- Independencia en ambos casos.
:::
