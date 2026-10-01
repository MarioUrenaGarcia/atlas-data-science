---
id: serie-de-taylor-y-de-maclaurin
titulo: Serie de Taylor y de Maclaurin
titulo_en: Taylor and Maclaurin series
alias:
  - polinomio de Taylor
  - serie de Maclaurin
  - aproximación de Taylor
  - residuo de Taylor
modulo: 0
submodulo: '0.4'
orden: 12
nivel: basico
prerrequisitos:
  - derivadas-de-orden-superior
  - series-y-convergencia-de-series
etiquetas:
  - Taylor
  - aproximación polinomial
  - series de potencias
  - error de aproximación
resumen: >
  El polinomio de Taylor de orden n es el polinomio que coincide con f y sus primeras n derivadas en un
  punto; la serie de Taylor lo prolonga infinitamente y, dentro de su radio de convergencia, reproduce f.
formula: 'f(x) = \sum_{k=0}^{\infty}\frac{f^{(k)}(a)}{k!}(x - a)^{k}, \qquad \text{Maclaurin: } a = 0'
visualizacion:
  componente: CalculusViz
  parametros:
    modo: taylor
    funciones: [sin, cos, exp, log1p, geometric]
    orden: 12
referencias:
  - clave: blitzstein-hwang
publicado: true
---

## Intuición

Una calculadora no guarda tablas del seno ni de la exponencial: evalúa polinomios que imitan esas funciones con toda la precisión que se necesita. La idea es copiar el comportamiento de la función en un punto. Un polinomio de grado 0 copia su altura; uno de grado 1 copia además su pendiente, y es la recta tangente; uno de grado 2 copia también su curvatura; y así sucesivamente.

Cada término nuevo corrige el error del anterior y mantiene la aproximación buena en un tramo más largo alrededor del punto. Para funciones como $e^x$, $\operatorname{sen} x$ y $\cos x$, añadir términos sin fin reproduce la función en toda la recta. Para otras, como $\log(1 + x)$ o $\frac{1}{1 - x}$, la aproximación solo mejora dentro de un radio: fuera de él los polinomios se disparan, sin importar cuántos términos se sumen.

## Definición

:::definicion[Polinomio y serie de Taylor]
Si $f$ tiene $n$ derivadas en $a$, su **polinomio de Taylor** de orden $n$ en $a$ es
$$
P_n(x) = \sum_{k=0}^{n}\frac{f^{(k)}(a)}{k!}\,(x - a)^{k}.
$$
Si $f$ tiene derivadas de todos los órdenes, su **serie de Taylor** es $\sum_{k=0}^{\infty}\frac{f^{(k)}(a)}{k!}(x - a)^{k}$. Con $a = 0$ se llama **serie de Maclaurin**.
:::

:::teorema[Residuo de Lagrange]
Si $f$ tiene $n + 1$ derivadas continuas entre $a$ y $x$, existe $\xi$ entre ellos tal que
$$
f(x) - P_n(x) = \frac{f^{(n+1)}(\xi)}{(n + 1)!}\,(x - a)^{n+1}.
$$
:::

:::nota[Qué significa cada símbolo]
- $f$: función que se aproxima.
- $a$: punto de desarrollo.
- $n$: orden del polinomio.
- $f^{(k)}(a)$: derivada de orden $k$ en $a$.
- $k!$: factorial de $k$.
- $P_n$: polinomio de Taylor de orden $n$.
- $\xi$: punto intermedio desconocido entre $a$ y $x$.
:::

## Cómo usar la visualización

El selector elige la función y la reproducción añade términos del polinomio de uno en uno, alrededor de $x = 0$; el encabezado muestra el polinomio con sus coeficientes. El punto de prueba, que se ajusta con el control, marca con un segmento la diferencia entre la función y el polinomio, y el panel da el error.

Con el seno, cada término impar extiende el tramo de buen ajuste. Con $\log(1 + x)$ el ajuste mejora en $(-1, 1)$, pero en $x = 1.5$ el error crece con el orden: el punto está fuera del radio de convergencia. Con $\frac{1}{1 - x}$ los polinomios se separan de la función antes de $x = 1$, donde ella tiene un polo.

## Ejemplo

Una calculadora de bolsillo estima $e^{0.5}$ con el polinomio de Maclaurin de orden 3.

1. Todas las derivadas de $e^x$ valen 1 en 0, así que $P_3(x) = 1 + x + \frac{x^2}{2} + \frac{x^3}{6}$.
2. $P_3(0.5) = 1 + 0.5 + 0.125 + 0.020833 = 1.645833$.
3. Valor verdadero: $e^{0.5} = 1.648721$; el error es $0.002888$.
4. Cota de Lagrange: $|e^{\xi}|\frac{0.5^4}{4!} \le e^{0.5}\cdot\frac{0.0625}{24} \approx 0.00429$, que efectivamente supera al error real.
5. Con orden 5 el error baja a $0.0000234$.

:::figura[El polinomio de Taylor de e^x del ejemplo: con cada término el polinomio se pega a la exponencial en un tramo más largo alrededor de 0.]{componente="CalculusViz"}
```yaml
modo: taylor
funciones: [exp]
orden: 5
```
:::

## Propiedades

- **Series básicas:** $e^x = \sum \frac{x^k}{k!}$, $\operatorname{sen} x = \sum \frac{(-1)^k x^{2k+1}}{(2k+1)!}$, $\cos x = \sum \frac{(-1)^k x^{2k}}{(2k)!}$, válidas para todo $x$.
- **Radio de convergencia finito:** $\log(1 + x) = \sum_{k\ge1}\frac{(-1)^{k+1}x^k}{k}$ y $\frac{1}{1 - x} = \sum x^k$ convergen solo para $|x| < 1$ (el logaritmo también en $x = 1$).
- **Orden del error:** $f(x) - P_n(x)$ es de orden $(x - a)^{n+1}$ cerca de $a$.
- **Unicidad:** si una serie de potencias representa a $f$ cerca de $a$, es su serie de Taylor.
- **Funciones que no coinciden con su serie:** $e^{-1/x^2}$ (con valor 0 en 0) tiene todas sus derivadas nulas en 0 y su serie es 0, aunque la función no lo sea.

:::figura[Caso de radio de convergencia finito: los polinomios de log(1 + x) mejoran dentro de (-1, 1) y empeoran fuera, sin importar cuántos términos se agreguen.]{componente="CalculusViz"}
```yaml
modo: taylor
funciones: [log1p]
orden: 12
```
:::

:::demostracion
Coeficientes: si $f(x) = \sum c_k (x - a)^k$, derivando $k$ veces término a término y evaluando en $a$ solo sobrevive el término $k$, que da $f^{(k)}(a) = k!\,c_k$. Por eso $c_k = \frac{f^{(k)}(a)}{k!}$.
:::

## Errores comunes

- **Suponer que más términos siempre mejoran.** Fuera del radio de convergencia la aproximación empeora.
- **Olvidar el factorial.** El coeficiente de $(x - a)^k$ es $f^{(k)}(a)/k!$, no $f^{(k)}(a)$.
- **Desarrollar en un punto y evaluar lejos de él.** La calidad depende de $|x - a|$; conviene elegir $a$ cerca de donde se evalúa.
- **Confundir polinomio con serie.** El polinomio es una suma finita con error; la serie es un límite que puede o no converger.

## Conexiones

Los coeficientes son [[derivadas-de-orden-superior]] y la convergencia se estudia con [[series-y-convergencia-de-series]]; la [[serie-geometrica]] es la serie de Taylor de $\frac{1}{1 - x}$. La definición en serie de la [[funcion-exponencial-y-logaritmo-natural|exponencial]] es su serie de Maclaurin. En estadística, el método delta aproxima la varianza de una función de un estimador con el término lineal de Taylor, y los métodos de optimización de Newton usan el término cuadrático.

## Formulario

:::formula[Polinomio de Taylor]
$$
P_n(x) = \sum_{k=0}^{n}\frac{f^{(k)}(a)}{k!}\,(x - a)^{k}
$$

- $a$: punto de desarrollo; $n$: orden.
:::

:::formula[Residuo de Lagrange]
$$
f(x) - P_n(x) = \frac{f^{(n+1)}(\xi)}{(n + 1)!}(x - a)^{n+1}
$$

- $\xi$: punto entre $a$ y $x$.
:::

:::formula[Series de Maclaurin básicas]
$$
e^{x} = \sum_{k=0}^{\infty}\frac{x^{k}}{k!}, \qquad \operatorname{sen} x = \sum_{k=0}^{\infty}\frac{(-1)^{k}x^{2k+1}}{(2k+1)!}, \qquad \frac{1}{1 - x} = \sum_{k=0}^{\infty}x^{k}\ (|x| < 1)
$$

- Las dos primeras valen para todo $x$ real.
:::

:::formula[Aproximaciones de orden 1 y 2]
$$
f(a + h) \approx f(a) + f'(a)h, \qquad f(a + h) \approx f(a) + f'(a)h + \tfrac{1}{2}f''(a)h^{2}
$$

- $h$: desplazamiento pequeño desde $a$.
:::
