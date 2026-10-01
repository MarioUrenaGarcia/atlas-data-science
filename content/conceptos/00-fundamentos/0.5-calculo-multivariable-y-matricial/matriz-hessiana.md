---
id: matriz-hessiana
titulo: Matriz hessiana
titulo_en: Hessian matrix
alias:
  - hessiano
  - matriz de segundas derivadas
modulo: 0
submodulo: '0.5'
orden: 8
nivel: intermedio
prerrequisitos:
  - derivadas-parciales
  - valores-y-vectores-propios
etiquetas:
  - hessiana
  - curvatura
  - segundas derivadas
  - optimización
resumen: >
  La hessiana reúne las segundas derivadas parciales de f en una matriz simétrica; uᵀHu es la curvatura
  en la dirección u y sus valores propios son las curvaturas extremas.
formula: '\mathbf{H}_f(\mathbf{x}) = \left[\frac{\partial^2 f}{\partial x_i\,\partial x_j}(\mathbf{x})\right], \qquad f(\mathbf{x} + \mathbf{h}) \approx f(\mathbf{x}) + \nabla f^\top \mathbf{h} + \tfrac{1}{2}\mathbf{h}^\top \mathbf{H}_f\,\mathbf{h}'
visualizacion:
  componente: SurfaceViz
  parametros:
    modo: hessiana
    campos: [cuadratica-girada, dos-colinas, silla]
referencias:
  - clave: boyd
  - clave: goodfellow
    capitulo: '4.3'
  - clave: strang
publicado: true
---

## Intuición

El gradiente dice hacia dónde sube el terreno; la hessiana dice cómo se curva. Al pie de una cancha de patinaje en forma de tazón, el suelo se curva hacia arriba en todas las direcciones; en un paso de montaña se curva hacia arriba en una dirección y hacia abajo en la otra; en el fondo de un cañón angosto la curvatura es enorme a lo ancho y casi nula a lo largo.

La hessiana recoge esa información en una matriz de segundas derivadas. Para cada dirección $\mathbf{u}$, el número $\mathbf{u}^\top \mathbf{H}\mathbf{u}$ es la segunda derivada de $f$ a lo largo de la recta en esa dirección: la curvatura de ese corte. Como la matriz es simétrica, tiene dos direcciones especiales, sus vectores propios, en las que la curvatura alcanza su mayor y su menor valor, y esos valores son sus valores propios. Con ellos se decide si un punto crítico es un mínimo, un máximo o una silla, y qué tan difícil será para un optimizador avanzar por un valle.

## Definición

:::definicion[Matriz hessiana]
Si $f : \mathbb{R}^n \to \mathbb{R}$ tiene segundas derivadas parciales en $\mathbf{x}$, su **hessiana** es la matriz de $n \times n$
$$
\mathbf{H}_f(\mathbf{x}) = \begin{pmatrix} \dfrac{\partial^2 f}{\partial x_1^2} & \cdots & \dfrac{\partial^2 f}{\partial x_1\,\partial x_n} \\ \vdots & \ddots & \vdots \\ \dfrac{\partial^2 f}{\partial x_n\,\partial x_1} & \cdots & \dfrac{\partial^2 f}{\partial x_n^2} \end{pmatrix}.
$$
:::

Si las segundas parciales son continuas, $\mathbf{H}_f$ es simétrica y es la jacobiana del gradiente. Para un vector unitario $\mathbf{u}$,
$$
\frac{d^2}{dt^2} f(\mathbf{x} + t\mathbf{u}) \Big|_{t = 0} = \mathbf{u}^\top \mathbf{H}_f(\mathbf{x})\,\mathbf{u},
$$
y si $\lambda_1 \ge \lambda_2$ son sus valores propios en dos variables, $\lambda_2 \le \mathbf{u}^\top \mathbf{H}_f \mathbf{u} \le \lambda_1$.

:::nota[Qué significa cada símbolo]
- $f$: función de $n$ variables con segundas derivadas.
- $\mathbf{H}_f(\mathbf{x})$: hessiana en $\mathbf{x}$, matriz simétrica de $n \times n$.
- $\frac{\partial^2 f}{\partial x_i\,\partial x_j}$: segunda derivada parcial respecto a $x_j$ y luego a $x_i$.
- $\mathbf{u}$: dirección unitaria.
- $t$: distancia recorrida en la dirección $\mathbf{u}$.
- $\mathbf{u}^\top \mathbf{H}_f\,\mathbf{u}$: curvatura de $f$ en la dirección $\mathbf{u}$.
- $\lambda_1, \lambda_2$: valores propios de $\mathbf{H}_f$, las curvaturas mayor y menor.
- $\mathbf{h}$: desplazamiento pequeño; $\nabla f$: gradiente.
:::

## Cómo usar la visualización

A la izquierda, el mapa de curvas de nivel con el punto elegido, los dos vectores propios de la hessiana en naranja y verde, y una línea amarilla que gira alrededor del punto. A la derecha, el corte de $f$ a lo largo de esa línea y, punteada, la parábola con la misma pendiente y curvatura $\mathbf{u}^\top \mathbf{H}\mathbf{u}$. El encabezado muestra la hessiana, sus valores propios y la curvatura en la dirección actual.

Al girar la línea, la curvatura oscila entre los dos valores propios y los alcanza cuando la línea coincide con un eje propio. En la silla toma valores positivos y negativos: la parábola se abre hacia arriba en unas direcciones y hacia abajo en otras.

## Ejemplo

La función de Rosenbrock $f(x, y) = (1 - x)^2 + 5(y - x^2)^2$ se usa para probar algoritmos de optimización; tiene su mínimo en $(1, 1)$, al fondo de un valle curvo y estrecho.

1. Primeras parciales: $f_x = -2(1 - x) - 20x(y - x^2)$ y $f_y = 10(y - x^2)$.
2. Segundas parciales: $f_{xx} = 2 - 20(y - x^2) + 40x^2$, $f_{xy} = -20x$, $f_{yy} = 10$.
3. En $(1, 1)$: $\mathbf{H} = \begin{pmatrix} 42 & -20 \\ -20 & 10 \end{pmatrix}$.
4. Traza 52 y determinante $420 - 400 = 20$; los valores propios son $\lambda = 26 \pm \sqrt{676 - 20} = 26 \pm 25.61$, es decir $51.61$ y $0.39$.
5. Ambos son positivos: la hessiana es definida positiva y $(1, 1)$ es un mínimo. Pero la curvatura en una dirección es unas 133 veces la de la otra: el valle es muy estrecho en una dirección y casi plano en la otra, y por eso el descenso por gradiente avanza en zigzag y muy despacio en esta función.

:::figura[El mínimo de Rosenbrock del ejemplo en (1, 1): los ejes propios marcan la dirección estrecha del valle, con curvatura 51.61, y la casi plana, con curvatura 0.39; al girar la línea, la parábola pasa de muy cerrada a casi recta.]{componente="SurfaceViz"}
```yaml
modo: hessiana
campos: [rosenbrock]
punto: [1, 1]
```
:::

## Propiedades

- **Aproximación cuadrática:** $f(\mathbf{x} + \mathbf{h}) \approx f(\mathbf{x}) + \nabla f(\mathbf{x})^\top \mathbf{h} + \tfrac{1}{2}\mathbf{h}^\top \mathbf{H}_f(\mathbf{x})\,\mathbf{h}$.
- **Clasificación de puntos críticos:** si $\nabla f = \mathbf{0}$ y $\mathbf{H}_f$ es definida positiva, el punto es un mínimo local; si es definida negativa, un máximo local; si tiene valores propios de ambos signos, una silla.
- **Convexidad:** $f$ es convexa en un conjunto convexo si y solo si $\mathbf{H}_f$ es semidefinida positiva en todos sus puntos.
- **Formas cuadráticas:** para $f(\mathbf{x}) = \tfrac{1}{2}\mathbf{x}^\top \mathbf{A}\mathbf{x}$ con $\mathbf{A}$ simétrica, $\mathbf{H}_f = \mathbf{A}$ en todas partes.
- **Condicionamiento:** el cociente $\lambda_{\max}/\lambda_{\min}$ mide qué tan alargado es el valle y controla la velocidad del descenso por gradiente.

:::figura[Caso de la silla x² - y² en el origen: la hessiana tiene valores propios 2 y -2, y la curvatura uᵀHu = 2 cos 2θ cambia de signo al girar la línea: positiva a lo largo de x, negativa a lo largo de y y nula en las diagonales.]{componente="SurfaceViz"}
```yaml
modo: hessiana
campos: [silla]
punto: [0, 0]
```
:::

## Errores comunes

- **Mirar solo la diagonal.** Diagonal positiva no basta para que la hessiana sea definida positiva; hay que considerar los términos cruzados, mediante el determinante o los valores propios.
- **Confundir la hessiana con la jacobiana.** La hessiana es de una función con valores reales y contiene segundas derivadas; la jacobiana es de una función con varias salidas y contiene primeras derivadas.
- **Clasificar con determinante cero.** Si algún valor propio es 0, la prueba de la segunda derivada no decide y hay que estudiar términos de orden superior.
- **Olvidar el factor $\tfrac{1}{2}$** en la aproximación cuadrática, lo que duplica la curvatura estimada.

:::figura[En xy, en el punto (1, 1), la diagonal de la hessiana es (0, 0), pero sus valores propios son 1 y -1: hay curvatura positiva en la diagonal y = x y negativa en y = -x, invisible si solo se miran las segundas derivadas en los ejes.]{componente="SurfaceViz"}
```yaml
modo: hessiana
campos: [producto]
punto: [1, 1]
```
:::

## Conexiones

Reúne las segundas [[derivadas-parciales]] y es la [[matriz-jacobiana]] del [[gradiente]]. Su estudio usa [[valores-y-vectores-propios]] de matrices simétricas, como en el [[teorema-espectral]], y el signo de sus valores propios se estudia en [[matrices-definidas-positivas-y-semidefinidas]]. Clasifica los [[puntos-criticos-y-puntos-silla]], decide la convexidad de [[funciones-convexas-y-concavas]] en varias variables y es la base del método de Newton.

## Formulario

:::formula[Matriz hessiana]
$$
\mathbf{H}_f(\mathbf{x}) = \left[\frac{\partial^2 f}{\partial x_i\,\partial x_j}(\mathbf{x})\right]_{i, j = 1, \dots, n}
$$

- $f$: función de $n$ variables.
- $i, j$: índices de fila y columna.
- Simétrica si las segundas parciales son continuas.
:::

:::formula[Curvatura en una dirección]
$$
\frac{d^2}{dt^2} f(\mathbf{x} + t\mathbf{u}) \Big|_{t = 0} = \mathbf{u}^\top \mathbf{H}_f(\mathbf{x})\,\mathbf{u}
$$

- $\mathbf{u}$: dirección unitaria; $t$: distancia sobre la recta.
:::

:::formula[Aproximación cuadrática]
$$
f(\mathbf{x} + \mathbf{h}) \approx f(\mathbf{x}) + \nabla f(\mathbf{x})^\top \mathbf{h} + \tfrac{1}{2}\mathbf{h}^\top \mathbf{H}_f(\mathbf{x})\,\mathbf{h}
$$

- $\mathbf{h}$: desplazamiento pequeño.
- $\nabla f(\mathbf{x})$: gradiente en $\mathbf{x}$.
:::

:::formula[Valores propios en dos variables]
$$
\lambda_{1,2} = \frac{\operatorname{tr}\mathbf{H} \pm \sqrt{(\operatorname{tr}\mathbf{H})^2 - 4\det \mathbf{H}}}{2}
$$

- $\operatorname{tr}\mathbf{H}$: traza, suma de la diagonal.
- $\det \mathbf{H}$: determinante.
- $\lambda_1 \ge \lambda_2$: curvaturas máxima y mínima.
:::

:::formula[Hessiana del ejemplo]
$$
\mathbf{H}(1, 1) = \begin{pmatrix} 42 & -20 \\ -20 & 10 \end{pmatrix}, \qquad \lambda_1 = 51.61, \quad \lambda_2 = 0.39
$$

- Evaluada en el mínimo de la función de Rosenbrock $(1 - x)^2 + 5(y - x^2)^2$.
:::
