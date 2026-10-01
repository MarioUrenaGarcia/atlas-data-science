---
id: integral-definida-como-area
titulo: Integral definida como área
titulo_en: Definite integral as area
alias:
  - integral definida
  - área bajo la curva
  - área con signo
  - integral de Riemann
modulo: 0
submodulo: '0.4'
orden: 14
nivel: basico
prerrequisitos:
  - sumas-de-riemann
etiquetas:
  - integral
  - área
  - acumulación
  - valor promedio
resumen: >
  La integral definida de f entre a y b es el límite de las sumas de Riemann: el área entre la gráfica y
  el eje, contando positiva la parte de arriba y negativa la de abajo.
formula: '\int_a^b f(x)\,dx = \lim_{n \to \infty}\sum_{i=1}^{n} f(x_i^{*})\,\Delta x'
visualizacion:
  componente: CalculusViz
  parametros:
    modo: area
    funcion: seno
    intervalo: [0, 5]
referencias:
  - clave: blitzstein-hwang
publicado: true
---

## Intuición

Si una camioneta viaja a velocidad variable, la distancia recorrida es la acumulación de velocidad por tiempo en cada instante. En una gráfica de velocidad contra tiempo, esa acumulación es el área bajo la curva. La integral definida formaliza esa idea para cualquier función: suma infinitas contribuciones infinitamente pequeñas $f(x)\,dx$ entre dos límites.

Cuando la función es negativa, su contribución resta. Si la camioneta retrocede, su velocidad es negativa y la integral da el desplazamiento neto, no la distancia total recorrida. Por eso la integral es un área con signo: la parte sobre el eje suma y la parte bajo el eje resta, y ambas pueden cancelarse. Para obtener el área geométrica total se integra el valor absoluto. Las probabilidades de variables continuas, los valores esperados y las distancias entre distribuciones se calculan con integrales de este tipo.

## Definición

:::definicion[Integral definida]
Si $f$ es continua en $[a, b]$, la **integral definida** es
$$
\int_a^b f(x)\,dx = \lim_{n \to \infty}\sum_{i=1}^{n} f(x_i^{*})\,\Delta x,
$$
donde el límite de las sumas de Riemann no depende de la elección de los $x_i^{*}$. Por convención $\int_a^a f = 0$ y $\int_b^a f = -\int_a^b f$.
:::

:::definicion[Área geométrica y valor promedio]
El área total entre la gráfica y el eje es $\int_a^b |f(x)|\,dx$. El **valor promedio** de $f$ en $[a, b]$ es $\bar{f} = \frac{1}{b - a}\int_a^b f(x)\,dx$.
:::

:::nota[Qué significa cada símbolo]
- $\int_a^b$: integral de $a$ (límite inferior) a $b$ (límite superior).
- $f(x)$: integrando, la función que se acumula.
- $dx$: indica la variable de integración y el ancho infinitesimal.
- $x_i^{*}$, $\Delta x$: puntos y ancho de las sumas de Riemann.
- $|f(x)|$: valor absoluto, para medir área sin signo.
- $\bar{f}$: valor promedio de $f$ en el intervalo.
:::

## Cómo usar la visualización

Los controles fijan los límites $a$ y $b$. La reproducción rellena el área desde $a$ hacia $b$: en azul lo que suma y en naranja lo que resta. El panel muestra por separado el área sobre el eje, el área bajo el eje, la integral con signo y el área total.

Con el seno en $[0, 5]$, la parte negativa, a partir de $\pi$, reduce la integral. Al llevar $b$ hasta $2\pi \approx 6.28$ las dos partes se igualan y la integral se anula, aunque el área total sea 4. Intercambiar $a$ y $b$ en los controles no cambia el relleno porque la vista siempre integra de izquierda a derecha.

## Ejemplo

Un globo meteorológico sube y baja con velocidad vertical $v(t) = t^3 - 3t$ (metros por minuto) durante $t \in [-2, 2]$ en un sistema de tiempo centrado.

1. $\int_{-2}^{2}(t^3 - 3t)\,dt = \Big[\frac{t^4}{4} - \frac{3t^2}{2}\Big]_{-2}^{2} = (4 - 6) - (4 - 6) = 0$: el desplazamiento neto es nulo.
2. Es consecuencia de la simetría: $v$ es impar, y en un intervalo simétrico lo que suma de un lado lo resta del otro.
3. La velocidad es positiva en $(-\sqrt{3}, 0)$ y en $(\sqrt{3}, 2)$, y negativa en el resto.
4. Área sobre el eje en $[-\sqrt{3}, 0]$: $\big[\frac{t^4}{4} - \frac{3t^2}{2}\big]_{-\sqrt{3}}^{0} = 0 - (2.25 - 4.5) = 2.25$.
5. Distancia total recorrida: por simetría, $2\,(2.25 + 0.25) = 5$ metros, aunque termine donde empezó.

:::figura[La velocidad del globo del ejemplo: las áreas azules y naranjas son iguales por simetría, así que la integral con signo es 0 mientras que el área total es 5.]{componente="CalculusViz"}
```yaml
modo: area
funcion: cubica
intervalo: [-2, 2]
```
:::

## Propiedades

- **Linealidad:** $\int_a^b (\alpha f + \beta g) = \alpha\int_a^b f + \beta\int_a^b g$.
- **Aditividad:** $\int_a^b f + \int_b^c f = \int_a^c f$.
- **Monotonía:** si $f \le g$ en $[a, b]$, entonces $\int_a^b f \le \int_a^b g$; en particular $\big|\int f\big| \le \int |f|$.
- **Simetría:** si $f$ es impar, $\int_{-a}^{a} f = 0$; si es par, $\int_{-a}^{a} f = 2\int_0^a f$.
- **Teorema del valor medio para integrales:** si $f$ es continua, existe $c \in [a, b]$ con $f(c) = \bar{f}$.
- **Probabilidad:** si $X$ tiene densidad $p$, $P(a \le X \le b) = \int_a^b p(x)\,dx$.

:::figura[Caso de un área completamente positiva: x² en [0, 3] encierra un área de 9, que es a la vez la integral con signo y el área total.]{componente="CalculusViz"}
```yaml
modo: area
funcion: cuadrada
intervalo: [0, 3]
```
:::

:::demostracion
Monotonía: si $f \le g$, cada suma de Riemann cumple $\sum f(x_i^{*})\Delta x \le \sum g(x_i^{*})\Delta x$, y la desigualdad se conserva en el límite.
:::

## Errores comunes

- **Confundir integral con área total.** $\int_0^{2\pi}\operatorname{sen} x\,dx = 0$, pero el área encerrada es 4.
- **Olvidar el $dx$.** Indica respecto a qué variable se integra y cambia en una sustitución.
- **Invertir los límites sin cambiar el signo.** $\int_3^1 f = -\int_1^3 f$.
- **Pensar que una integral positiva implica función positiva.** Puede haber tramos negativos compensados por tramos positivos mayores.

## Conexiones

La integral es el límite de las [[sumas-de-riemann]] y se calcula con el [[teorema-fundamental-del-calculo]] mediante antiderivadas. Técnicas como la [[integracion-por-sustitucion]] y la [[integracion-por-partes]] encuentran esas antiderivadas, y las [[integrales-impropias]] extienden la definición a intervalos infinitos. En probabilidad, las integrales de densidades dan probabilidades, esperanzas y varianzas.

## Formulario

:::formula[Integral definida]
$$
\int_a^b f(x)\,dx = \lim_{n \to \infty}\sum_{i=1}^{n} f(x_i^{*})\,\Delta x
$$

- $\Delta x = (b - a)/n$.
:::

:::formula[Propiedades básicas]
$$
\int_a^b (\alpha f + \beta g) = \alpha\!\int_a^b f + \beta\!\int_a^b g, \qquad \int_a^b f + \int_b^c f = \int_a^c f
$$

- $\alpha, \beta$: constantes.
:::

:::formula[Área total y valor promedio]
$$
A = \int_a^b |f(x)|\,dx, \qquad \bar{f} = \frac{1}{b - a}\int_a^b f(x)\,dx
$$

- $A$: área geométrica sin signo.
:::

:::formula[Probabilidad con densidad]
$$
P(a \le X \le b) = \int_a^b p(x)\,dx
$$

- $p$: función de densidad de $X$.
:::
