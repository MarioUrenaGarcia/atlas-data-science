---
id: teorema-del-binomio
titulo: Teorema del binomio
titulo_en: Binomial theorem
alias:
  - binomio de Newton
  - desarrollo del binomio
modulo: 0
submodulo: '0.2'
orden: 13
nivel: basico
prerrequisitos:
  - coeficiente-binomial
relaciones:
  - tipo: relacionado
    id: triangulo-de-pascal
etiquetas:
  - coeficiente binomial
  - álgebra
  - desarrollo de potencias
  - polinomios
resumen: >
  La potencia (a + b)^n se desarrolla como la suma de C(n, k) a^(n-k) b^k para k de 0 a n: cada término
  cuenta las formas de elegir b en k de los n factores.
formula: '(a + b)^n = \sum_{k=0}^{n} \binom{n}{k}\, a^{n-k}\, b^{k}'
visualizacion:
  componente: PascalTriangle
  parametros:
    modo: binomio
    n: 4
    a: 1
    b: 2
referencias:
  - clave: ross-probabilidad
    capitulo: '1'
publicado: true
---

## Intuición

Al multiplicar $(a + b)(a + b)(a + b)$ se elige un sumando de cada paréntesis y se multiplican; el resultado es la suma de todos esos productos. Hay $2^3 = 8$ formas de elegir: $aaa$, $aab$, $aba$, $abb$, $baa$, $bab$, $bba$, $bbb$. Al agrupar los productos iguales, $aab$, $aba$ y $baa$ dan $a^2 b$, así que el coeficiente de $a^2 b$ es 3, el número de maneras de elegir en cuál de los tres paréntesis se toma la $b$.

En general, el coeficiente de $a^{n-k}b^k$ en $(a + b)^n$ es el número de formas de elegir en qué $k$ de los $n$ paréntesis se toma $b$: exactamente $\binom{n}{k}$. El teorema del binomio no es una fórmula que haya que memorizar, sino una consecuencia de contar las elecciones al desarrollar un producto.

## Definición

:::teorema[Teorema del binomio]
Para cualesquiera números $a$ y $b$ (y, en general, elementos que conmutan) y todo entero $n \ge 0$,
$$
(a + b)^n = \sum_{k=0}^{n} \binom{n}{k} a^{n-k} b^{k}.
$$
:::

:::demostracion
Al desarrollar el producto de $n$ factores $(a + b)$ se obtiene la suma de los $2^n$ productos que resultan de elegir $a$ o $b$ en cada factor. Un producto vale $a^{n-k}b^k$ exactamente cuando se eligió $b$ en $k$ factores, y hay $\binom{n}{k}$ formas de elegir esos factores.
:::

:::nota[Qué significa cada símbolo]
- $a, b$: los dos sumandos del binomio; pueden ser números o expresiones como $2x$ y $-3$.
- $n$: exponente, un entero no negativo.
- $k$: número de factores en los que se elige $b$; va de $0$ a $n$.
- $\binom{n}{k}$: coeficiente binomial, cuántas formas hay de elegir esos $k$ factores.
- $\alpha$: exponente real en el binomio generalizado.
:::

## Cómo usar la visualización

Las palabras de $a$ y $b$ representan las elecciones en cada factor. La reproducción las reparte en columnas según su número de letras $b$; cada columna $k$ recibe $\binom{n}{k}$ palabras. Las barras muestran los términos $\binom{n}{k}a^{n-k}b^k$ con los valores elegidos de $a$ y $b$, y se llenan conforme llegan sus palabras. El panel compara la suma acumulada con $(a + b)^n$.

Con $a = 1$ y $b = 2$, las barras de la fila 4 valen 1, 8, 24, 32 y 16, y suman $3^4 = 81$. Con $a = b = 1$ las barras reproducen la fila del triángulo de Pascal. Con $a = 1$ y $b = -1$ los términos alternan de signo y la suma es 0.

## Ejemplo

Se calcula $(2x - 3)^5$ y el coeficiente de $x^3$.

1. Con $a = 2x$ y $b = -3$, el término general es $\binom{5}{k}(2x)^{5-k}(-3)^k$.
2. El exponente de $x$ es $5 - k$; para $x^3$ se necesita $k = 2$.
3. El término es $\binom{5}{2}(2x)^3(-3)^2 = 10 \cdot 8x^3 \cdot 9 = 720x^3$.
4. Comprobación de la suma de coeficientes: con $x = 1$, $(2 - 3)^5 = -1$, que debe coincidir con la suma de todos los coeficientes del desarrollo.

:::figura[El desarrollo de $(a + b)^5$ con $a = 2$ y $b = -3$, los valores del ejemplo con $x = 1$. Los términos alternan de signo y su suma es $(2 - 3)^5 = -1$; la barra de $k = 2$ corresponde al término $720x^3$.]{componente="PascalTriangle"}
```yaml
modo: binomio
n: 5
a: 2
b: -3
```
:::

## Propiedades

- **Sumas de filas:** con $a = b = 1$, $\sum_k \binom{n}{k} = 2^n$; con $a = 1$, $b = -1$, $\sum_k (-1)^k\binom{n}{k} = 0$.
- **Aproximación:** $(1 + x)^n \approx 1 + nx$ para $x$ pequeño, y más precisamente $1 + nx + \binom{n}{2}x^2$.
- **Binomio generalizado:** para cualquier real $\alpha$ y $|x| < 1$, $(1 + x)^{\alpha} = \sum_{k \ge 0} \binom{\alpha}{k}x^k$, con $\binom{\alpha}{k} = \frac{\alpha(\alpha - 1)\cdots(\alpha - k + 1)}{k!}$.
- **Probabilidad:** con $a = 1 - p$ y $b = p$, los términos $\binom{n}{k}p^k(1-p)^{n-k}$ son las probabilidades binomiales y suman 1.
- **Conmutatividad necesaria:** para matrices que no conmutan, $(A + B)^2 = A^2 + AB + BA + B^2 \neq A^2 + 2AB + B^2$.

## Errores comunes

- **Escribir $(a + b)^n = a^n + b^n$.** Faltan todos los términos cruzados.
- **Olvidar el signo con binomios de resta.** En $(a - b)^n$ los términos con $k$ impar son negativos.
- **Olvidar elevar el coeficiente.** En $(2x)^3$ el coeficiente es $2^3 = 8$, no 2.
- **Confundir el índice.** El exponente de $b$ es $k$ y el de $a$ es $n - k$; la suma de exponentes siempre es $n$.

## Conexiones

Los coeficientes del desarrollo son los del [[coeficiente-binomial]], organizados en el [[triangulo-de-pascal]]. La generalización a más de dos sumandos es el [[coeficiente-multinomial]], y la versión con exponente real conecta con las [[series-y-convergencia-de-series|series]]. En probabilidad, el teorema del binomio prueba que la distribución binomial está bien definida y permite calcular su función generadora.

## Formulario

:::formula[Teorema del binomio]
$$
(a + b)^n = \sum_{k=0}^{n} \binom{n}{k} a^{n-k} b^{k}
$$

- $a, b$: sumandos que conmutan.
- $n$: exponente.
- $k$: potencia de $b$ en cada término; la de $a$ es $n - k$.
:::

:::formula[Término general]
$$
T_k = \binom{n}{k} a^{n-k} b^{k}
$$

- $T_k$: término con $b$ elevada a la $k$.
:::

:::formula[Sumas de filas]
$$
\sum_{k=0}^{n} \binom{n}{k} = 2^{n}, \qquad \sum_{k=0}^{n} (-1)^k\binom{n}{k} = 0 \ (n \ge 1)
$$

- Se obtienen con $a = b = 1$ y con $a = 1$, $b = -1$.
:::

:::formula[Binomio generalizado]
$$
(1 + x)^{\alpha} = \sum_{k \ge 0} \binom{\alpha}{k} x^{k}, \qquad \binom{\alpha}{k} = \frac{\alpha(\alpha-1)\cdots(\alpha-k+1)}{k!}, \quad |x| < 1
$$

- $\alpha$: exponente real cualquiera.
- $x$: variable con valor absoluto menor que 1.
:::
