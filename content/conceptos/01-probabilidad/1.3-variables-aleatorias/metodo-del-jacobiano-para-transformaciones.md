---
id: metodo-del-jacobiano-para-transformaciones
titulo: Método del jacobiano
titulo_en: Change of variables method for densities
alias:
  - fórmula del cambio de variable
  - método del jacobiano para transformaciones
  - densidad de una transformación
modulo: 1
submodulo: '1.3'
orden: 27
nivel: intermedio
prerrequisitos:
  - transformaciones-de-variables-aleatorias
  - regla-de-la-cadena
relaciones:
  - tipo: contrasta
    id: metodo-de-la-cdf-para-transformaciones
  - tipo: relacionado
    id: cambio-de-variables-y-determinante-jacobiano
etiquetas:
  - cambio de variable
  - jacobiano
  - conservación de probabilidad
  - transformación monótona
resumen: >
  Si g es diferenciable y monótona, la densidad de Y = g(X) es la de X en la preimagen por el valor absoluto de la derivada de la inversa. Ese factor corrige el estiramiento que produce g.
formula: 'f_Y(y) = f_X\big(g^{-1}(y)\big) \left| \frac{d}{dy} g^{-1}(y) \right| = \frac{f_X(x)}{|g''(x)|}\Big|_{x = g^{-1}(y)}'
visualizacion:
  componente: TransformationViz
  parametros:
    modo: jacobiano
    distribucion: normal
    parametros:
      mu: 0
      sigma: 0.5
    transformacion: exponencial
referencias:
  - clave: blitzstein-hwang
    capitulo: '8.1'
  - clave: ross-probabilidad
    capitulo: '5.7'
publicado: true
---

## Intuición

Una transformación mueve la probabilidad de lugar sin cambiar su cantidad. Una franja angosta de ancho $dx$ alrededor de $x$ tiene probabilidad $f_X(x)\,dx$. La función $g$ la lleva a una franja alrededor de $y = g(x)$ de ancho $dy \approx |g'(x)|\,dx$. Como la probabilidad es la misma,
$$
f_Y(y)\,dy = f_X(x)\,dx \quad \Longrightarrow \quad f_Y(y) = \frac{f_X(x)}{|g'(x)|}.
$$

Donde $g$ estira ($|g'|$ grande), la misma probabilidad se reparte en una franja más ancha y la densidad de $Y$ baja. Donde comprime ($|g'|$ pequeño), la densidad sube. El valor absoluto de la derivada es el **jacobiano** de la transformación, el factor que convierte longitudes en $x$ en longitudes en $y$.

## Definición

:::definicion[Fórmula del cambio de variable]
Sea $X$ continua con densidad $f_X$ y sea $g$ diferenciable y estrictamente monótona en el soporte de $X$, con inversa $g^{-1}$. Entonces $Y = g(X)$ tiene densidad
$$
f_Y(y) = f_X\big(g^{-1}(y)\big) \left| \frac{d}{dy} g^{-1}(y) \right|
$$
para $y$ en la imagen de $g$, y $f_Y(y) = 0$ fuera de ella.
:::

Si $g$ no es monótona pero es monótona por tramos, se suma la fórmula sobre todas las preimágenes:
$$
f_Y(y) = \sum_{x \,:\, g(x) = y} \frac{f_X(x)}{|g'(x)|}.
$$

:::figura[$Y = -\ln U$ con $U$ uniforme: cerca de $u = 0$ la función estira muchísimo, así que la probabilidad de esa franja se reparte en una zona larga de $y$ con densidad baja. El resultado es la densidad exponencial $e^{-y}$.]{componente="TransformationViz"}
```yaml
modo: jacobiano
distribucion: uniforme
parametros:
  a: 0
  b: 1
transformacion: logaritmo-negativo
```
:::

:::nota[Qué significa cada símbolo]
- $X$: variable continua con densidad $f_X$.
- $g$: transformación diferenciable; $Y = g(X)$.
- $g^{-1}$: función inversa de $g$.
- $g'(x)$: derivada de $g$.
- $\left|\frac{d}{dy} g^{-1}(y)\right| = 1/|g'(x)|$: jacobiano de la transformación inversa.
- $f_Y$: densidad de $Y$.
- $dx$, $dy$: anchos de franjas correspondientes.
- $\sigma$: desviación estándar de la normal del ejemplo.
:::

## Cómo usar la visualización

Arriba está la densidad normal de $X$, con media 0 y desviación estándar 0.5, y una franja angosta resaltada; abajo, el histograma simulado de $Y = e^{X}$ y la densidad que da la fórmula, punteada. La animación barre la franja de izquierda a derecha y dibuja su imagen abajo: ambas franjas contienen la misma probabilidad, pero la de abajo cambia de ancho según $|g'(x)| = e^{x}$.

El panel da la probabilidad de la franja, sus anchos en $x$ y en $y$, el jacobiano y la densidad de $Y$ en el centro, y el encabezado escribe la fórmula con esos números. A la derecha de 0 la exponencial estira, y la densidad de $Y$ forma una cola larga: es la lognormal.

## Ejemplo

$X$ es normal con media 0 y desviación estándar $\sigma$, y $Y = e^{X}$.

1. $g(x) = e^{x}$ es creciente con inversa $g^{-1}(y) = \ln y$ para $y > 0$.
2. $\dfrac{d}{dy} \ln y = \dfrac{1}{y}$.
3. $f_Y(y) = f_X(\ln y) \cdot \dfrac{1}{y} = \dfrac{1}{y\,\sigma\sqrt{2\pi}} \exp\left(-\dfrac{(\ln y)^2}{2\sigma^2}\right)$ para $y > 0$.
4. Es la densidad lognormal. Su mediana es $e^{0} = 1$, porque las transformaciones crecientes preservan cuantiles, pero su media es $e^{\sigma^2/2} > 1$.

:::figura[Otra transformación creciente: $Y = \sqrt{X}$ con $X$ exponencial de media 1. Cerca de 0 la raíz estira y la densidad de $Y$ empieza en 0; el resultado es $f_Y(y) = 2y\,e^{-y^2}$, una Rayleigh.]{componente="TransformationViz"}
```yaml
modo: jacobiano
distribucion: exponencial
parametros:
  lambda: 1
transformacion: raiz
```
:::

## Propiedades

- **Equivalencia con el método de la función de distribución:** para $g$ creciente, $F_Y(y) = F_X(g^{-1}(y))$; derivando con la regla de la cadena se obtiene la fórmula.
- **Afines:** $f_{aX+b}(y) = f_X((y - b)/a) / |a|$.
- **Varias ramas:** si $g$ no es inyectiva, cada preimagen aporta su término; para $Y = X^2$, $f_Y(y) = \big(f_X(\sqrt{y}) + f_X(-\sqrt{y})\big) / (2\sqrt{y})$.
- **Varias variables:** en dimensión mayor el factor es el valor absoluto del determinante de la matriz jacobiana, con la misma interpretación de cambio de volumen.

:::figura[Una transformación con dos ramas: $Y = X^2$ con $X$ normal estándar. Cada valor de $y$ recibe probabilidad de $\sqrt{y}$ y de $-\sqrt{y}$, y la suma da la chi-cuadrada con 1 grado de libertad.]{componente="TransformationViz"}
```yaml
modo: jacobiano
distribucion: normal
transformacion: cuadrado
```
:::

## Errores comunes

- **Omitir el valor absoluto.** Si $g$ es decreciente, $\frac{d}{dy} g^{-1}(y)$ es negativa y sin el valor absoluto la "densidad" saldría negativa.
- **Omitir el jacobiano.** $f_Y(y) = f_X(g^{-1}(y))$ no integra 1 en general: ignora el estiramiento.
- **Aplicar la fórmula con una sola rama** cuando $g$ no es inyectiva, o fuera de la imagen de $g$, donde la densidad es 0.

:::figura[Una transformación decreciente: $Y = 1/U$ con $U$ uniforme. La derivada de la inversa $1/y$ es $-1/y^2$; con el valor absoluto, $f_Y(y) = 1/y^2$ para $y \ge 1$, una Pareto con cola pesada.]{componente="TransformationViz"}
```yaml
modo: jacobiano
distribucion: uniforme
parametros:
  a: 0
  b: 1
transformacion: reciproco
```
:::

## Conexiones

La fórmula es el caso diferenciable de las [[transformaciones-de-variables-aleatorias]] y se obtiene derivando el resultado del [[metodo-de-la-cdf-para-transformaciones]] con la [[regla-de-la-cadena]]. Su versión en varias variables usa el determinante del [[cambio-de-variables-y-determinante-jacobiano]] y es la base de las transformaciones de vectores aleatorios. La [[funcion-de-densidad-de-probabilidad]] cambia de escala exactamente como dice el jacobiano, y aplicada a $Y = F_X(X)$ la fórmula da la densidad uniforme de la [[transformada-integral-de-probabilidad]].

## Formulario

:::formula[Transformación monótona]
$$
f_Y(y) = f_X\big(g^{-1}(y)\big) \left| \frac{d}{dy} g^{-1}(y) \right|
$$

- $g$ diferenciable y estrictamente monótona.
:::

:::formula[Forma con la derivada de g]
$$
f_Y(y) = \frac{f_X(x)}{|g'(x)|}, \qquad x = g^{-1}(y)
$$

- Equivalente a la anterior.
:::

:::formula[Varias ramas]
$$
f_Y(y) = \sum_{x \,:\, g(x) = y} \frac{f_X(x)}{|g'(x)|}
$$

- Para $g$ monótona por tramos.
:::

:::formula[Lognormal]
$$
f_{e^X}(y) = \frac{1}{y}\, f_X(\ln y), \qquad y > 0
$$

- Con $X$ normal se obtiene la lognormal.
:::
