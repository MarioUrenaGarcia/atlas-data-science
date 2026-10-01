---
id: integracion-por-sustitucion
titulo: Integración por sustitución
titulo_en: Integration by substitution
alias:
  - cambio de variable
  - sustitución u
  - regla de sustitución
modulo: 0
submodulo: '0.4'
orden: 16
nivel: basico
prerrequisitos:
  - teorema-fundamental-del-calculo
  - regla-de-la-cadena
etiquetas:
  - integración
  - cambio de variable
  - regla de la cadena
  - antiderivadas
resumen: >
  La sustitución u = g(x) convierte una integral de f(g(x)) g'(x) en una integral de f(u) sobre el
  intervalo transformado; es la regla de la cadena leída al revés.
formula: '\int_a^b f\big(g(x)\big)\,g''(x)\,dx = \int_{g(a)}^{g(b)} f(u)\,du'
visualizacion:
  componente: CalculusViz
  parametros:
    modo: sustitucion
    casos: [coseno-cuadrado, gauss-lineal, lineal-interior, logaritmo]
referencias:
  - clave: blitzstein-hwang
publicado: true
---

## Intuición

Medir un terreno en metros o en pasos da números distintos para las longitudes, pero el área del terreno es la misma: solo hay que tener en cuenta cuántos metros mide cada paso. Cambiar de variable en una integral funciona igual. Si se reemplaza $x$ por una nueva variable $u = g(x)$, cada tramo pequeño $dx$ se convierte en un tramo $du = g'(x)\,dx$, más largo o más corto según la pendiente de $g$.

Por eso, cuando el integrando tiene la forma $f(g(x))\,g'(x)$, el factor $g'(x)$ es exactamente el ajuste de escala del cambio de variable, y la integral se convierte en $\int f(u)\,du$, que suele ser mucho más sencilla. Los límites también cambian: $x$ de $a$ a $b$ se traduce en $u$ de $g(a)$ a $g(b)$. Las dos áreas son iguales aunque las gráficas se vean distintas.

## Definición

:::teorema[Regla de sustitución]
Si $g$ tiene derivada continua en $[a, b]$ y $f$ es continua en la imagen de $g$, entonces
$$
\int_a^b f\big(g(x)\big)\,g'(x)\,dx = \int_{g(a)}^{g(b)} f(u)\,du.
$$
Para integrales indefinidas: si $F' = f$, entonces $\int f(g(x))\,g'(x)\,dx = F(g(x)) + C$.
:::

En la práctica se escribe $u = g(x)$, $du = g'(x)\,dx$, se reescribe todo el integrando en términos de $u$ y se cambian los límites.

:::nota[Qué significa cada símbolo]
- $g$: función que define la nueva variable, $u = g(x)$.
- $g'(x)\,dx$: diferencial de la nueva variable, $du$.
- $f$: función que queda al expresar el integrando en términos de $u$.
- $a, b$: límites en la variable original.
- $g(a), g(b)$: límites en la nueva variable.
- $F$: antiderivada de $f$; $C$: constante.
:::

## Cómo usar la visualización

A la izquierda está el integrando original en la variable $x$; a la derecha, el integrando nuevo en $u = g(x)$. La reproducción avanza $x$ desde $a$ y, al mismo tiempo, $u$ desde $g(a)$: las dos áreas sombreadas crecen y el encabezado muestra que siempre son iguales. El selector cambia de integral.

En la integral de $2x\cos(x^2)$ la curva de la izquierda es más complicada, pero la de la derecha es un simple coseno. En el caso lineal $u = 2x - 1$, el intervalo en $u$ es el doble de largo y la altura se reduce a la mitad para compensar.

## Ejemplo

Un modelo de difusión de calor pide $\int_0^2 x\,e^{-x^2}\,dx$.

1. Se elige $u = x^2$, con $du = 2x\,dx$, es decir, $x\,dx = \tfrac{1}{2}du$.
2. Límites: $x = 0 \Rightarrow u = 0$ y $x = 2 \Rightarrow u = 4$.
3. La integral se vuelve $\int_0^4 \tfrac{1}{2}e^{-u}\,du = \tfrac{1}{2}\big[-e^{-u}\big]_0^4$.
4. $= \tfrac{1}{2}(1 - e^{-4}) = \tfrac{1}{2}(1 - 0.01832) = 0.49084$.
5. Comprobación con la indefinida: $\int x\,e^{-x^2}dx = -\tfrac{1}{2}e^{-x^2} + C$, cuya derivada es $x\,e^{-x^2}$.

:::figura[La integral del ejemplo: el área bajo x e^(-x²) en [0, 2] coincide en todo momento con el área bajo e^(-u)/2 en [0, 4].]{componente="CalculusViz"}
```yaml
modo: sustitucion
casos: [gauss-lineal]
```
:::

## Propiedades

- **Sustituciones lineales:** $\int f(ax + b)\,dx = \frac{1}{a}F(ax + b) + C$.
- **Logarítmica:** $\int \frac{g'(x)}{g(x)}\,dx = \log|g(x)| + C$.
- **Potencias:** $\int g(x)^{n}\,g'(x)\,dx = \frac{g(x)^{n+1}}{n + 1} + C$ para $n \neq -1$.
- **Simetría:** con $u = -x$ se prueba que $\int_{-a}^{a} f = 0$ si $f$ es impar.
- **Densidades:** si $Y = g(X)$ con $g$ creciente, la densidad de $Y$ es $p_X(g^{-1}(y))\,\big|(g^{-1})'(y)\big|$; el factor es el mismo ajuste de escala.

:::figura[Caso de una sustitución logarítmica: con u = log x, la integral de (log x)²/x en [1, e] se convierte en la de u² en [0, 1], que vale 1/3.]{componente="CalculusViz"}
```yaml
modo: sustitucion
casos: [logaritmo]
```
:::

:::demostracion
Si $F' = f$, por la regla de la cadena $\frac{d}{dx}F(g(x)) = f(g(x))\,g'(x)$. Por el teorema fundamental, $\int_a^b f(g(x))g'(x)\,dx = F(g(b)) - F(g(a)) = \int_{g(a)}^{g(b)} f(u)\,du$.
:::

## Errores comunes

- **No cambiar los límites.** Si se integra en $u$, los límites deben ser $g(a)$ y $g(b)$; alternativamente se regresa a $x$ antes de evaluar.
- **Olvidar el factor $du$.** En $\int e^{3x}dx$ con $u = 3x$ queda $\frac{1}{3}\int e^{u}du$, no $\int e^{u}du$.
- **Dejar $x$ mezclada con $u$.** Todo el integrando debe quedar en la nueva variable.
- **Elegir una sustitución cuya derivada no aparece.** En $\int e^{-x^2}dx$ no hay factor $x$ que acompañe, y la sustitución $u = x^2$ no simplifica.

## Conexiones

La sustitución es la [[regla-de-la-cadena]] vista a través del [[teorema-fundamental-del-calculo]]. Junto con la [[integracion-por-partes]] resuelve la mayoría de las integrales elementales, y aparece al evaluar la [[funcion-gamma]] y la [[funcion-error]]. En probabilidad, el cambio de variable es la base para obtener la densidad de una transformación de una variable aleatoria.

## Formulario

:::formula[Sustitución en integral definida]
$$
\int_a^b f\big(g(x)\big)\,g'(x)\,dx = \int_{g(a)}^{g(b)} f(u)\,du
$$

- $u = g(x)$, $du = g'(x)\,dx$.
:::

:::formula[Sustitución en integral indefinida]
$$
\int f\big(g(x)\big)\,g'(x)\,dx = F\big(g(x)\big) + C
$$

- $F$: antiderivada de $f$.
:::

:::formula[Casos frecuentes]
$$
\int f(ax + b)\,dx = \frac{F(ax + b)}{a} + C, \qquad \int \frac{g'(x)}{g(x)}\,dx = \log|g(x)| + C
$$

- $a \neq 0$.
:::
