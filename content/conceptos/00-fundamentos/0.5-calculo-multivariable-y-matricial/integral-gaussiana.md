---
id: integral-gaussiana
titulo: Integral gaussiana
titulo_en: Gaussian integral
alias:
  - integral de Gauss
  - integral de Euler-Poisson
modulo: 0
submodulo: '0.5'
orden: 14
nivel: intermedio
prerrequisitos:
  - coordenadas-polares-cilindricas-y-esfericas
  - integrales-impropias
etiquetas:
  - integral gaussiana
  - distribución normal
  - coordenadas polares
  - integral impropia
resumen: >
  La integral de e^(-x²) sobre toda la recta vale √π; se calcula elevándola al cuadrado y pasando a
  coordenadas polares, y es la razón de la constante de la densidad normal.
formula: '\int_{-\infty}^{\infty} e^{-x^2}\,dx = \sqrt{\pi}, \qquad \int_{-\infty}^{\infty} e^{-x^2/2}\,dx = \sqrt{2\pi}'
visualizacion:
  componente: SurfaceViz
  parametros:
    modo: gaussiana
referencias:
  - clave: blitzstein-hwang
    capitulo: '5.4'
  - clave: strang
publicado: true
---

## Intuición

La curva de campana $e^{-x^2}$ aparece en todas partes, pero su integral indefinida no se puede escribir con funciones elementales: no hay una fórmula con potencias, exponenciales, logaritmos ni funciones trigonométricas cuya derivada sea $e^{-x^2}$. Aun así, el área total bajo la curva tiene un valor exacto y sorprendente, $\sqrt{\pi}$.

El cálculo usa un truco: en lugar de la integral se calcula su cuadrado. El cuadrado de una integral en $x$ es una integral doble sobre todo el plano de $e^{-x^2}e^{-y^2} = e^{-(x^2 + y^2)}$, una campana con simetría circular. En coordenadas polares la campana solo depende de la distancia al centro, el factor jacobiano $r$ aparece de regalo y la integral se resuelve con una sustitución elemental. El resultado, $\pi$, es el cuadrado de lo que se buscaba. De aquí sale el $\sqrt{2\pi}$ que aparece en el denominador de la densidad normal.

## Definición

:::teorema[Integral gaussiana]
$$
I = \int_{-\infty}^{\infty} e^{-x^2}\,dx = \sqrt{\pi}.
$$
:::

:::demostracion
Como el integrando es positivo e integrable, por Fubini
$$
I^2 = \int_{-\infty}^{\infty} e^{-x^2}dx \int_{-\infty}^{\infty} e^{-y^2}dy = \iint_{\mathbb{R}^2} e^{-(x^2 + y^2)}\,dx\,dy.
$$
En polares, $x^2 + y^2 = r^2$ y $dx\,dy = r\,dr\,d\theta$:
$$
I^2 = \int_0^{2\pi} \!\! \int_0^{\infty} e^{-r^2}\,r\,dr\,d\theta = 2\pi \left[-\tfrac{1}{2}e^{-r^2}\right]_0^{\infty} = 2\pi \cdot \tfrac{1}{2} = \pi.
$$
Como $I > 0$, $I = \sqrt{\pi}$.
:::

Con la sustitución $x = u/\sqrt{2a}$, para $a > 0$: $\displaystyle\int_{-\infty}^{\infty} e^{-a x^2}\,dx = \sqrt{\pi/a}$. En particular, con $a = \tfrac{1}{2}$, $\displaystyle\int_{-\infty}^{\infty} e^{-x^2/2}\,dx = \sqrt{2\pi}$.

:::nota[Qué significa cada símbolo]
- $I$: valor de la integral gaussiana.
- $e^{-x^2}$: campana de Gauss; $e^{-(x^2 + y^2)}$: su versión en el plano.
- $r$, $\theta$: coordenadas polares; $r\,dr\,d\theta$ es el elemento de área.
- $a$: constante positiva que ensancha o angosta la campana.
- $\sqrt{\pi}$, $\sqrt{2\pi}$: valores de las integrales sobre toda la recta.
:::

## Cómo usar la visualización

A la izquierda, el plano sombreado según $e^{-(x^2 + y^2)}$ y un disco que crece anillo por anillo; el anillo recién agregado se resalta. A la derecha, la campana de una variable con el área sombreada sobre $[-R, R]$. El primer renglón del encabezado da la integral doble sobre el disco, $\pi(1 - e^{-R^2})$; el segundo, el cuadrado de la integral de una variable. Ambos tienden a $\pi$.

Al principio el disco crece rápido en valor y después casi nada: con $R = 2$ ya se tiene el 98 % de $\pi$. El cuadrado de la integral sobre $[-R, R]$ va un poco por delante del disco, porque corresponde a un cuadrado, que contiene al disco.

## Ejemplo

La densidad de la normal estándar es $\varphi(z) = \dfrac{1}{\sqrt{2\pi}}e^{-z^2/2}$. Se comprueba que integra 1 a partir de la integral gaussiana.

1. Sustitución $z = \sqrt{2}\,u$, con $dz = \sqrt{2}\,du$: $\int_{-\infty}^{\infty} e^{-z^2/2}dz = \sqrt{2}\int_{-\infty}^{\infty} e^{-u^2}du = \sqrt{2}\sqrt{\pi} = \sqrt{2\pi}$.
2. Por tanto $\int_{-\infty}^{\infty} \varphi(z)\,dz = \dfrac{\sqrt{2\pi}}{\sqrt{2\pi}} = 1$.
3. Numéricamente, $\sqrt{2\pi} = 2.5066$.
4. Sobre $[-4, 4]$ el área es $\sqrt{2\pi}\,(2\Phi(4) - 1) = 2.5066 \cdot 0.99994 = 2.5065$: fuera de ese intervalo queda menos de una diezmilésima del total.
5. Para una normal con media $\mu$ y desviación estándar $\sigma$, la sustitución $z = (x - \mu)/\sigma$ muestra que la constante es $\dfrac{1}{\sigma\sqrt{2\pi}}$.

:::figura[La campana e^(-z²/2) del ejemplo sobre [-4, 4]: el área es 2.5065, prácticamente todo el valor √(2π) = 2.5066 que hace que la densidad normal integre 1.]{componente="CalculusViz"}
```yaml
modo: area
funcion: gauss-medio
intervalo: [-4, 4]
```
:::

## Propiedades

- **Escala:** $\int_{-\infty}^{\infty} e^{-ax^2}dx = \sqrt{\pi/a}$ para $a > 0$.
- **Mitad:** $\int_0^{\infty} e^{-x^2}dx = \tfrac{\sqrt{\pi}}{2}$, por simetría.
- **Momentos:** $\int_{-\infty}^{\infty} x^2 e^{-x^2/2}dx = \sqrt{2\pi}$, de donde la varianza de la normal estándar es 1.
- **Función error:** $\operatorname{erf}(x) = \tfrac{2}{\sqrt{\pi}}\int_0^x e^{-t^2}dt$ está normalizada con esta constante para que tienda a 1.
- **Varias dimensiones:** $\int_{\mathbb{R}^n} e^{-\lVert \mathbf{x} \rVert^2}d\mathbf{x} = \pi^{n/2}$, el producto de $n$ integrales gaussianas.
- **Función gamma:** $\Gamma(\tfrac{1}{2}) = \sqrt{\pi}$ es la misma integral con la sustitución $t = x^2$.

:::figura[La acumulada de e^(-x²) desde -3: crece rápido cerca del centro y se aplana en √π = 1.7725; su forma es la de la función error, escalada.]{componente="CalculusViz"}
```yaml
modo: acumulada
funcion: gauss
desde: -3
hasta: 3
nombre: G
```
:::

## Errores comunes

- **Buscar una antiderivada elemental.** No existe; las integrales sobre intervalos finitos se expresan con la función error, y solo la integral sobre toda la recta tiene la forma cerrada $\sqrt{\pi}$.
- **Olvidar el factor $r$ al pasar a polares.** Sin él, $\int_0^\infty e^{-r^2}dr$ no se resuelve con una sustitución elemental y además daría un valor equivocado.
- **Confundir $e^{-x^2}$ con $e^{-x^2/2}$.** La primera integra $\sqrt{\pi}$ y la segunda $\sqrt{2\pi}$; la densidad normal usa la segunda.
- **Elevar al cuadrado dentro de la integral.** $I^2$ es el producto de dos integrales con variables distintas, no $\int (e^{-x^2})^2dx$.

:::figura[Sobre un intervalo finito la integral no tiene fórmula elemental: el área de e^(-x²) en [-1, 1] es √π · erf(1) = 1.4936, que se calcula con la función error y no con una antiderivada de potencias, exponenciales o funciones trigonométricas.]{componente="CalculusViz"}
```yaml
modo: area
funcion: gauss
intervalo: [-1, 1]
```
:::

## Conexiones

Se calcula con [[coordenadas-polares-cilindricas-y-esfericas|coordenadas polares]], el [[cambio-de-variables-y-determinante-jacobiano]] y [[integrales-dobles-y-triples]], y es una de las [[integrales-impropias]] más importantes. Normaliza la [[funcion-error]] y da $\Gamma(1/2) = \sqrt{\pi}$ en la [[funcion-gamma]]. Es la razón de la constante $\tfrac{1}{\sigma\sqrt{2\pi}}$ de la distribución normal y de la constante de la normal multivariada.

## Formulario

:::formula[Integral gaussiana]
$$
\int_{-\infty}^{\infty} e^{-x^2}\,dx = \sqrt{\pi}
$$

- $e^{-x^2}$: campana de Gauss.
- La integral es impropia, sobre toda la recta.
:::

:::formula[Cálculo en polares]
$$
I^2 = \int_0^{2\pi} \!\! \int_0^{\infty} e^{-r^2}\,r\,dr\,d\theta = \pi
$$

- $I$: la integral gaussiana.
- $r$: distancia al origen; $r\,dr\,d\theta$: elemento de área.
:::

:::formula[Versión con escala]
$$
\int_{-\infty}^{\infty} e^{-a x^2}\,dx = \sqrt{\frac{\pi}{a}}, \qquad a > 0
$$

- $a$: controla el ancho de la campana.
:::

:::formula[Constante de la normal]
$$
\int_{-\infty}^{\infty} \frac{1}{\sigma\sqrt{2\pi}}\,e^{-\frac{(x - \mu)^2}{2\sigma^2}}\,dx = 1
$$

- $\mu$: media; $\sigma > 0$: desviación estándar.
- $\frac{1}{\sigma\sqrt{2\pi}}$: constante de normalización.
:::
