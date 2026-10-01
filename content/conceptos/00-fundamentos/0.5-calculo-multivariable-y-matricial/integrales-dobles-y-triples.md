---
id: integrales-dobles-y-triples
titulo: Integrales dobles y triples
titulo_en: Double and triple integrals
alias:
  - integrales múltiples
  - teorema de Fubini
  - integrales iteradas
modulo: 0
submodulo: '0.5'
orden: 11
nivel: intermedio
prerrequisitos:
  - integral-definida-como-area
  - funciones-de-varias-variables
etiquetas:
  - integral doble
  - integral triple
  - Fubini
  - volumen
resumen: >
  La integral doble acumula f sobre una región del plano como límite de sumas de volúmenes de columnas; el
  teorema de Fubini la calcula como dos integrales de una variable, una dentro de otra.
formula: '\iint_R f(x, y)\,dA = \lim_{n \to \infty} \sum_{i,j} f(x_i^*, y_j^*)\,\Delta x\,\Delta y = \int_a^b \!\! \int_c^d f(x, y)\,dy\,dx'
visualizacion:
  componente: SurfaceViz
  parametros:
    modo: integral-doble
    casos:
      - campo: gaussiana
        region: [[-2, 2], [-2, 2]]
      - campo: paraboloide
        region: [[0, 2], [0, 1]]
referencias:
  - clave: strang
  - clave: blitzstein-hwang
    capitulo: '7'
publicado: true
---

## Intuición

La integral de una variable suma rectángulos delgados para obtener un área. Con dos variables se hace lo mismo un piso más arriba: la región del plano se divide en cuadritos, sobre cada uno se levanta una columna tan alta como la función en ese lugar, y se suman los volúmenes. Al hacer los cuadritos cada vez más pequeños, la suma se acerca al volumen bajo la superficie: la integral doble.

Si la función es una densidad, por ejemplo kilogramos por metro cuadrado de una placa, la integral doble es la masa total. Si es una densidad de probabilidad conjunta, es la probabilidad de caer en la región. Para calcularla casi nunca se suman columnas: el teorema de Fubini permite cortar el volumen en rebanadas, calcular el área de cada rebanada con una integral de una variable y luego integrar esas áreas. La integral triple repite la idea con cubitos en el espacio y una función de tres variables.

## Definición

:::definicion[Integral doble sobre un rectángulo]
Sea $R = [a, b] \times [c, d]$, dividido en $n \times n$ celdas de lados $\Delta x = (b - a)/n$ y $\Delta y = (d - c)/n$, con un punto $(x_i^*, y_j^*)$ en cada celda. Si el límite existe,
$$
\iint_R f(x, y)\,dA = \lim_{n \to \infty} \sum_{i=1}^{n}\sum_{j=1}^{n} f(x_i^*, y_j^*)\,\Delta x\,\Delta y.
$$
:::

:::teorema[Fubini]
Si $f$ es continua en $R = [a, b] \times [c, d]$,
$$
\iint_R f\,dA = \int_a^b \left(\int_c^d f(x, y)\,dy\right) dx = \int_c^d \left(\int_a^b f(x, y)\,dx\right) dy.
$$
:::

La **integral triple** sobre una caja $B$ se define igual con celdas de volumen $\Delta x\,\Delta y\,\Delta z$, y Fubini la reduce a tres integrales iteradas. Sobre regiones que no son rectángulos, como $\{a \le x \le b,\ g_1(x) \le y \le g_2(x)\}$, los límites interiores dependen de la variable exterior.

:::nota[Qué significa cada símbolo]
- $R = [a, b] \times [c, d]$: rectángulo de integración.
- $n$: número de divisiones en cada eje.
- $\Delta x, \Delta y$: lados de cada celda; $\Delta x\,\Delta y$ es su área.
- $(x_i^*, y_j^*)$: punto de la celda $(i, j)$ donde se evalúa $f$.
- $dA$: elemento de área; $dV$, de volumen.
- $\int_c^d f(x, y)\,dy$: integral interior, con $x$ fija; su valor es el área de una rebanada.
- $g_1(x), g_2(x)$: curvas que limitan una región que no es rectangular.
:::

## Cómo usar la visualización

A la izquierda, columnas sobre la región: cada una tiene por base una celda y por altura el valor de $f$ en el centro de la celda. A la derecha, la región vista desde arriba, con las celdas sombreadas según la altura y los centros marcados. La reproducción duplica el número de divisiones, de 1 a 16 por lado. El encabezado y el panel comparan la suma de volúmenes con el valor exacto de la integral.

Con la campana gaussiana sobre $[-2, 2]^2$, una sola columna, de altura 1, da 16, muy lejos del valor 3.112; con 16 por 16 celdas el error ya está en la tercera cifra decimal. Los controles giran las columnas para verlas desde otros ángulos.

## Ejemplo

Una placa rectangular ocupa $[0, 2] \times [0, 1]$ metros y su densidad es $\rho(x, y) = x^2 + y^2$ kilogramos por metro cuadrado. Se calcula su masa.

1. Masa: $M = \iint_R (x^2 + y^2)\,dA$.
2. Integral interior en $y$, con $x$ fija: $\int_0^1 (x^2 + y^2)\,dy = x^2 + \tfrac{1}{3}$.
3. Integral exterior: $\int_0^2 \left(x^2 + \tfrac{1}{3}\right) dx = \tfrac{8}{3} + \tfrac{2}{3} = \tfrac{10}{3} = 3.3333$ kg.
4. En el otro orden: $\int_0^2 (x^2 + y^2)\,dx = \tfrac{8}{3} + 2y^2$, y $\int_0^1 \left(\tfrac{8}{3} + 2y^2\right) dy = \tfrac{8}{3} + \tfrac{2}{3} = \tfrac{10}{3}$, como asegura Fubini.
5. Con 8 por 8 celdas y la regla del punto medio, la suma de columnas da 3.3203, un error de 0.013.

:::figura[La placa del ejemplo: columnas de altura x² + y² sobre [0, 2] × [0, 1]. Al duplicar las celdas, la suma se acerca a la masa exacta, 10/3 = 3.3333.]{componente="SurfaceViz"}
```yaml
modo: integral-doble
casos:
  - campo: paraboloide
    region: [[0, 2], [0, 1]]
```
:::

## Propiedades

- **Linealidad:** $\iint (af + bg)\,dA = a\iint f\,dA + b\iint g\,dA$.
- **Aditividad:** si $R$ se divide en dos regiones sin traslape, la integral es la suma de las integrales sobre cada parte.
- **Área y volumen:** $\iint_R 1\,dA$ es el área de $R$; $\iiint_B 1\,dV$ es el volumen de $B$.
- **Funciones separables:** si $f(x, y) = g(x)h(y)$ en un rectángulo, $\iint_R f\,dA = \int_a^b g\,dx \cdot \int_c^d h\,dy$.
- **Probabilidad:** si $f$ es una densidad conjunta, $P((X, Y) \in R) = \iint_R f\,dA$ y la integral sobre todo el plano vale 1.
- **Valor promedio:** $\bar{f} = \dfrac{1}{\text{área}(R)}\iint_R f\,dA$.

:::figura[Caso de una función separable: xy sobre [0, 2] × [0, 2] es el producto de dos integrales de una variable, 2 · 2 = 4, y las columnas crecen en las dos direcciones a la vez.]{componente="SurfaceViz"}
```yaml
modo: integral-doble
casos:
  - campo: producto
    region: [[0, 2], [0, 2]]
```
:::

## Errores comunes

- **Pensar que la integral doble siempre es un volumen geométrico.** Donde $f$ es negativa, las columnas cuentan como volumen negativo y restan.
- **Poner límites constantes en una región que no es rectángulo.** Sobre el triángulo $0 \le y \le x \le 1$, el límite superior de $y$ es $x$, no 1.
- **Cambiar el orden de integración sin cambiar los límites.** En regiones generales, al invertir el orden hay que describir la región de nuevo.
- **Olvidar el elemento de área** al cambiar de coordenadas: en polares $dA = r\,dr\,d\theta$, no $dr\,d\theta$.

:::figura[x² - y² sobre [-1, 1] × [-1, 1]: las columnas hacia arriba y hacia abajo se cancelan exactamente y la integral vale 0, aunque el volumen geométrico entre la superficie y el plano no es cero.]{componente="SurfaceViz"}
```yaml
modo: integral-doble
casos:
  - campo: silla
    region: [[-1, 1], [-1, 1]]
```
:::

## Conexiones

Extiende la [[integral-definida-como-area]] y las [[sumas-de-riemann]] a [[funciones-de-varias-variables]]. El [[cambio-de-variables-y-determinante-jacobiano]] permite calcularlas en otras coordenadas, como las [[coordenadas-polares-cilindricas-y-esfericas]], que llevan a la [[integral-gaussiana]]. En probabilidad, las integrales dobles dan probabilidades conjuntas, marginales y esperanzas de funciones de dos variables aleatorias.

## Formulario

:::formula[Integral doble como límite]
$$
\iint_R f\,dA = \lim_{n \to \infty} \sum_{i=1}^{n}\sum_{j=1}^{n} f(x_i^*, y_j^*)\,\Delta x\,\Delta y
$$

- $R$: rectángulo; $n$: divisiones por lado.
- $(x_i^*, y_j^*)$: punto de la celda; $\Delta x\,\Delta y$: área de la celda.
:::

:::formula[Teorema de Fubini]
$$
\iint_{[a, b] \times [c, d]} f\,dA = \int_a^b \!\! \int_c^d f(x, y)\,dy\,dx = \int_c^d \!\! \int_a^b f(x, y)\,dx\,dy
$$

- Válido si $f$ es continua en el rectángulo.
- La integral interior se calcula con la otra variable fija.
:::

:::formula[Región entre dos curvas]
$$
\iint_D f\,dA = \int_a^b \!\! \int_{g_1(x)}^{g_2(x)} f(x, y)\,dy\,dx
$$

- $D = \{a \le x \le b,\ g_1(x) \le y \le g_2(x)\}$.
- $g_1, g_2$: curvas inferior y superior.
:::

:::formula[Integral triple sobre una caja]
$$
\iiint_B f\,dV = \int_a^b \!\! \int_c^d \!\! \int_p^q f(x, y, z)\,dz\,dy\,dx
$$

- $B = [a, b] \times [c, d] \times [p, q]$.
- $dV$: elemento de volumen.
:::

:::formula[Masa del ejemplo]
$$
M = \int_0^2 \!\! \int_0^1 (x^2 + y^2)\,dy\,dx = \frac{10}{3}
$$

- $x^2 + y^2$: densidad en kg por metro cuadrado.
:::
