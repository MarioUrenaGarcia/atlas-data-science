---
id: funcion-exponencial-y-logaritmo-natural
titulo: Función exponencial y logaritmo natural
titulo_en: Exponential function and natural logarithm
alias:
  - exponencial
  - número e
  - logaritmo natural
  - ln
modulo: 0
submodulo: '0.4'
orden: 11
nivel: basico
prerrequisitos:
  - reglas-de-derivacion
etiquetas:
  - exponencial
  - logaritmo
  - número e
  - crecimiento
resumen: >
  La exponencial e^x es la única función igual a su propia derivada con valor 1 en 0; su inversa es el
  logaritmo natural log x, que convierte productos en sumas y tiene derivada 1/x.
formula: '\frac{d}{dx}e^{x} = e^{x}, \qquad \log(e^{x}) = x, \qquad \frac{d}{dx}\log x = \frac{1}{x}'
visualizacion:
  componente: CalculusViz
  parametros:
    modo: exponencial
    base: 2
referencias:
  - clave: blitzstein-hwang
publicado: true
---

## Intuición

En muchos procesos la cantidad crece en proporción a lo que ya hay: una colonia de bacterias con alimento abundante, un capital que se reinvierte, una infección en sus primeras semanas. Si la tasa de crecimiento es igual a la cantidad presente, la función que resulta es la exponencial natural $e^x$, la única cuya pendiente en cada punto es igual a su altura.

Cualquier base $b$ da una curva de la misma forma, $b^x$, pero su pendiente es la altura multiplicada por una constante, $\log b$. Esa constante vale 1 exactamente cuando $b = e \approx 2.718$, por eso $e$ es la base natural. El logaritmo natural deshace la exponencial: dice a qué potencia hay que elevar $e$ para obtener un número. Convierte multiplicaciones en sumas y crecimientos explosivos en rectas, lo que lo vuelve indispensable para trabajar con probabilidades muy pequeñas y datos que abarcan varios órdenes de magnitud.

## Definición

:::definicion[Exponencial y logaritmo natural]
La **función exponencial** es
$$
e^{x} = \sum_{n=0}^{\infty}\frac{x^n}{n!} = \lim_{n \to \infty}\Big(1 + \frac{x}{n}\Big)^{n}, \qquad e = e^{1} \approx 2.71828.
$$
El **logaritmo natural** $\log : (0, \infty) \to \mathbb{R}$ es su inversa: $\log x = y \iff e^{y} = x$. Para otra base $b > 0$, $b^{x} = e^{x \log b}$ y $\log_b x = \frac{\log x}{\log b}$.
:::

:::nota[Qué significa cada símbolo]
- $e$: número de Euler, base de la exponencial natural.
- $e^{x}$: exponencial natural de $x$.
- $n!$: factorial de $n$.
- $\log x$: logaritmo natural de $x > 0$ (también escrito $\ln x$).
- $b$: base positiva de una exponencial general.
- $\log_b x$: logaritmo en base $b$.
:::

## Cómo usar la visualización

La curva azul es $b^x$ y la naranja su inversa, $\log_b x$, reflejada sobre la recta punteada $y = x$. La curva verde punteada es $e^x$ como referencia. Un punto recorre $b^x$ con su tangente; su reflejo recorre el logaritmo. El control fija la base y el panel muestra la altura, la pendiente y el cociente entre ambas, que siempre es $\log b$.

Con $b = 2$ la pendiente es solo 0.693 veces la altura. Al llevar $b$ hacia 2.718 las curvas azul y verde se funden y el cociente se vuelve 1. Con bases mayores la curva crece más rápido y su logaritmo se aplana.

## Ejemplo

Un capital de 1000 pesos se invierte al 8 % anual con capitalización continua. Su valor es $V(t) = 1000\,e^{0.08t}$.

1. Después de 5 años: $V(5) = 1000\,e^{0.4} \approx 1491.82$ pesos.
2. Ritmo de crecimiento: $V'(t) = 0.08 \cdot 1000\,e^{0.08t} = 0.08\,V(t)$, el 8 % del valor en cada momento.
3. Tiempo para duplicar: $e^{0.08t} = 2$, así que $t = \frac{\log 2}{0.08} = \frac{0.6931}{0.08} \approx 8.66$ años.
4. Con capitalización anual el valor a 5 años sería $1000(1.08)^5 \approx 1469.33$, un poco menos.
5. La capitalización continua es el límite de capitalizar $n$ veces al año: $\big(1 + \tfrac{0.08}{n}\big)^{5n} \to e^{0.4}$.

:::figura[La base e ≈ 2.718 del ejemplo: la curva de b^x coincide con la de e^x y la pendiente de la tangente es igual a la altura en cada punto.]{componente="CalculusViz"}
```yaml
modo: exponencial
base: 2.718
```
:::

## Propiedades

- **Leyes de exponentes:** $e^{a + b} = e^{a}e^{b}$ y $(e^{a})^{b} = e^{ab}$.
- **Leyes de logaritmos:** $\log(xy) = \log x + \log y$, $\log(x^{p}) = p\log x$ y $\log 1 = 0$.
- **Derivadas:** $(e^{x})' = e^{x}$ y $(\log x)' = \frac{1}{x}$.
- **Crecimiento:** $e^x$ crece más rápido que cualquier polinomio y $\log x$ más lento que cualquier potencia positiva.
- **Desigualdad básica:** $e^{x} \ge 1 + x$ para todo $x$, con igualdad solo en $x = 0$; equivalentemente $\log x \le x - 1$.
- **Ecuación diferencial:** $y' = ky$ con $y(0) = y_0$ tiene solución única $y = y_0 e^{kt}$.

:::figura[Caso de reflexiones: con a = -1 la exponencial se refleja sobre el eje horizontal y -e^x decrece sin cota; el selector cambia a log x, cuyo reflejo -log x es la función que aparece en la entropía.]{componente="CalculusViz"}
```yaml
modo: transformaciones
funciones: [exponencial, logaritmo]
valores: [-1, 1, 0, 0]
```
:::

:::demostracion
Derivada del logaritmo: de $e^{\log x} = x$, derivando con la regla de la cadena, $e^{\log x}\,(\log x)' = 1$, es decir, $x\,(\log x)' = 1$ y $(\log x)' = \frac{1}{x}$.
:::

## Errores comunes

- **Escribir $\log(x + y) = \log x + \log y$.** El logaritmo convierte productos en sumas, no sumas en sumas.
- **Aplicar el logaritmo a números no positivos.** $\log 0$ y $\log(-2)$ no están definidos en los reales.
- **Confundir $e^{x^2}$ con $(e^{x})^{2} = e^{2x}$.**
- **Mezclar bases.** En estadística $\log$ suele ser natural; en informática, base 2; en química, base 10.

## Conexiones

La exponencial se deriva con las [[reglas-de-derivacion]] y su definición en serie es su [[serie-de-taylor-y-de-maclaurin]]. Es convexa y el logaritmo cóncavo, como en [[funciones-convexas-y-concavas]]. Ambas funciones están en el corazón de la [[funcion-sigmoide-y-funcion-softplus|sigmoide y la softplus]], de la [[funcion-gamma]] y de las distribuciones exponencial, normal y de Poisson; el logaritmo de la verosimilitud se maximiza en lugar de la verosimilitud misma.

## Formulario

:::formula[Definiciones de e^x]
$$
e^{x} = \sum_{n=0}^{\infty}\frac{x^n}{n!} = \lim_{n \to \infty}\Big(1 + \frac{x}{n}\Big)^{n}
$$

- $n!$: factorial.
:::

:::formula[Derivadas]
$$
(e^{x})' = e^{x}, \qquad (\log x)' = \frac{1}{x}, \qquad (b^{x})' = b^{x}\log b
$$

- $b > 0$: base general.
:::

:::formula[Leyes]
$$
e^{a + b} = e^{a}e^{b}, \qquad \log(xy) = \log x + \log y, \qquad \log(x^{p}) = p\log x
$$

- $x, y > 0$.
:::

:::formula[Cambio de base y crecimiento continuo]
$$
\log_b x = \frac{\log x}{\log b}, \qquad y' = ky \Rightarrow y(t) = y_0\,e^{kt}
$$

- $k$: tasa de crecimiento; $y_0$: valor inicial.
:::
