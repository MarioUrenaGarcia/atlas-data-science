---
id: calculo-matricial
titulo: Cálculo matricial
titulo_en: Matrix calculus
alias:
  - derivadas respecto a vectores y matrices
  - gradientes de expresiones matriciales
modulo: 0
submodulo: '0.5'
orden: 15
nivel: intermedio
prerrequisitos:
  - gradiente
  - formas-cuadraticas
etiquetas:
  - cálculo matricial
  - gradiente
  - mínimos cuadrados
  - ecuaciones normales
resumen: >
  El cálculo matricial obtiene gradientes de expresiones con vectores y matrices sin pasar por coordenadas,
  como ∇(xᵀAx) = (A + Aᵀ)x; con él se derivan de golpe las ecuaciones normales de mínimos cuadrados.
formula: '\nabla_{\mathbf{x}} (\mathbf{a}^\top \mathbf{x}) = \mathbf{a}, \quad \nabla_{\mathbf{x}} (\mathbf{x}^\top \mathbf{A}\mathbf{x}) = (\mathbf{A} + \mathbf{A}^\top)\mathbf{x}, \quad \nabla_{\boldsymbol{\beta}} \lVert \mathbf{X}\boldsymbol{\beta} - \mathbf{y} \rVert^2 = 2\mathbf{X}^\top(\mathbf{X}\boldsymbol{\beta} - \mathbf{y})'
visualizacion:
  componente: SurfaceViz
  parametros:
    modo: matricial
    casos: [alargada, redonda, minimos-cuadrados]
referencias:
  - clave: boyd
  - clave: goodfellow
    capitulo: '4.5'
  - clave: hastie-esl
    capitulo: '3.2'
publicado: true
---

## Intuición

Para derivar $x^2$ nadie expande un límite cada vez: se usa la regla $2x$. El cálculo matricial ofrece reglas parecidas para expresiones donde la variable es un vector o una matriz. Así como la derivada de $ax$ es $a$ y la de $ax^2$ es $2ax$, el gradiente de $\mathbf{a}^\top \mathbf{x}$ es $\mathbf{a}$ y el de $\mathbf{x}^\top \mathbf{A}\mathbf{x}$ es $2\mathbf{A}\mathbf{x}$ cuando $\mathbf{A}$ es simétrica.

Estas reglas ahorran páginas de cuentas con índices y muestran la estructura del problema. El ejemplo más importante es la regresión por mínimos cuadrados: la suma de cuadrados de los residuos es una función cuadrática de los coeficientes, su gradiente se escribe en una línea, y al igualarlo a cero salen las ecuaciones normales. El mismo cálculo, aplicado capa por capa, es el que hacen las bibliotecas de aprendizaje profundo al obtener gradientes de pérdidas con millones de parámetros.

## Definición

Para $f : \mathbb{R}^n \to \mathbb{R}$, el gradiente $\nabla_{\mathbf{x}} f$ es el vector columna de parciales $\partial f / \partial x_i$. Para $f : \mathbb{R}^{m \times n} \to \mathbb{R}$, el gradiente respecto a una matriz es la matriz de las mismas dimensiones
$$
\left(\nabla_{\mathbf{X}} f\right)_{ij} = \frac{\partial f}{\partial X_{ij}}.
$$

:::teorema[Reglas básicas]
Para vectores constantes $\mathbf{a}$, $\mathbf{b}$ y una matriz constante $\mathbf{A}$:
$$
\nabla_{\mathbf{x}} (\mathbf{a}^\top \mathbf{x}) = \mathbf{a}, \qquad
\nabla_{\mathbf{x}} (\mathbf{x}^\top \mathbf{A}\mathbf{x}) = (\mathbf{A} + \mathbf{A}^\top)\mathbf{x}, \qquad
\nabla_{\mathbf{x}} \lVert \mathbf{A}\mathbf{x} - \mathbf{b} \rVert^2 = 2\mathbf{A}^\top(\mathbf{A}\mathbf{x} - \mathbf{b}).
$$
Si $\mathbf{A}$ es simétrica, $\nabla_{\mathbf{x}} (\mathbf{x}^\top \mathbf{A}\mathbf{x}) = 2\mathbf{A}\mathbf{x}$ y la hessiana es $2\mathbf{A}$. Respecto a matrices: $\nabla_{\mathbf{X}} \operatorname{tr}(\mathbf{A}\mathbf{X}) = \mathbf{A}^\top$ y, para $\mathbf{X}$ invertible con determinante positivo, $\nabla_{\mathbf{X}} \log\det \mathbf{X} = (\mathbf{X}^{-1})^\top$.
:::

:::nota[Qué significa cada símbolo]
- $\mathbf{x}$: variable vectorial de $\mathbb{R}^n$; $\mathbf{X}$: variable matricial de $m \times n$, o la matriz de diseño en regresión.
- $\nabla_{\mathbf{x}} f$: gradiente de $f$ respecto a $\mathbf{x}$, de la misma forma que $\mathbf{x}$.
- $\mathbf{a}$, $\mathbf{b}$: vectores constantes; $\mathbf{A}$: matriz constante.
- $\mathbf{A}^\top$: transpuesta; $\operatorname{tr}$: traza; $\det$: determinante.
- $\lVert \cdot \rVert$: norma euclidiana.
- $\boldsymbol{\beta}$: vector de coeficientes; $\mathbf{y}$: vector de respuestas.
- $X_{ij}$: entrada $(i, j)$ de $\mathbf{X}$.
:::

## Cómo usar la visualización

Cada caso es una función cuadrática $f(\mathbf{x}) = \tfrac{1}{2}\mathbf{x}^\top \mathbf{A}\mathbf{x} - \mathbf{b}^\top \mathbf{x}$, cuyo gradiente es $\mathbf{A}\mathbf{x} - \mathbf{b}$. El mapa muestra sus curvas de nivel, el mínimo $\mathbf{A}^{-1}\mathbf{b}$ en verde y el camino del descenso por gradiente. El encabezado escribe la multiplicación $\mathbf{A}\mathbf{x}_k - \mathbf{b}$ con los números de cada iteración. En el caso de mínimos cuadrados, un segundo panel dibuja los datos y la recta de la iteración actual.

Con $\mathbf{A} = 2\mathbf{I}$ el gradiente apunta directo al mínimo. Con valores propios 1 y 9 el camino se tuerce, porque el gradiente apunta hacia la dirección empinada del valle y no hacia el mínimo.

## Ejemplo

Cinco estudiantes estudiaron $t = -2, -1, 0, 1, 2$ horas respecto al promedio de 3 horas, y obtuvieron calificaciones $\mathbf{y} = (3, 4, 6, 6, 8)$. Se ajusta la recta $y = \beta_0 + \beta_1 t$ minimizando $f(\boldsymbol{\beta}) = \lVert \mathbf{X}\boldsymbol{\beta} - \mathbf{y} \rVert^2$, donde la fila $i$ de $\mathbf{X}$ es $(1, t_i)$.

1. Gradiente: $\nabla f = 2\mathbf{X}^\top(\mathbf{X}\boldsymbol{\beta} - \mathbf{y})$. Igualarlo a cero da las ecuaciones normales $\mathbf{X}^\top \mathbf{X}\boldsymbol{\beta} = \mathbf{X}^\top \mathbf{y}$.
2. $\mathbf{X}^\top \mathbf{X} = \begin{pmatrix} 5 & \sum t_i \\ \sum t_i & \sum t_i^2 \end{pmatrix} = \begin{pmatrix} 5 & 0 \\ 0 & 10 \end{pmatrix}$.
3. $\mathbf{X}^\top \mathbf{y} = \begin{pmatrix} \sum y_i \\ \sum t_i y_i \end{pmatrix} = \begin{pmatrix} 27 \\ -6 - 4 + 0 + 6 + 16 \end{pmatrix} = \begin{pmatrix} 27 \\ 12 \end{pmatrix}$.
4. Solución: $\beta_0 = 27/5 = 5.4$ y $\beta_1 = 12/10 = 1.2$. La recta es $y = 5.4 + 1.2t$: la calificación media y 1.2 puntos por hora adicional.
5. Residuos: $(0, -0.2, 0.6, -0.6, 0.2)$, con suma de cuadrados 0.8, el mínimo de $f$.
6. Hessiana: $2\mathbf{X}^\top \mathbf{X}$, definida positiva, así que el punto crítico es el mínimo global.

:::figura[La regresión del ejemplo: el descenso por gradiente sobre las curvas de nivel de la suma de cuadrados llega al punto (5.4, 1.2), y la recta de la derecha se acomoda a los cinco datos en cada iteración.]{componente="SurfaceViz"}
```yaml
modo: matricial
casos: [minimos-cuadrados]
```
:::

## Propiedades

- **Linealidad:** $\nabla(f + g) = \nabla f + \nabla g$ y $\nabla(cf) = c\nabla f$.
- **Cadena:** si $f(\mathbf{x}) = g(\mathbf{A}\mathbf{x} + \mathbf{b})$, entonces $\nabla f(\mathbf{x}) = \mathbf{A}^\top \nabla g(\mathbf{A}\mathbf{x} + \mathbf{b})$.
- **Cuadráticas:** el mínimo de $\tfrac{1}{2}\mathbf{x}^\top \mathbf{A}\mathbf{x} - \mathbf{b}^\top \mathbf{x}$, con $\mathbf{A}$ definida positiva, es la solución de $\mathbf{A}\mathbf{x} = \mathbf{b}$.
- **Comprobación de dimensiones:** el gradiente respecto a $\mathbf{x}$ tiene la forma de $\mathbf{x}$; si una regla produce algo de otra forma, hay un error de transpuesta.
- **Regularización:** con penalización ridge, $\nabla(\lVert \mathbf{X}\boldsymbol{\beta} - \mathbf{y} \rVert^2 + \lambda\lVert \boldsymbol{\beta} \rVert^2) = 2\mathbf{X}^\top(\mathbf{X}\boldsymbol{\beta} - \mathbf{y}) + 2\lambda\boldsymbol{\beta}$.

:::figura[Con A = 2I las curvas de nivel son círculos y el gradiente Ax - b apunta siempre hacia el mínimo (1, 0.5): el descenso va en línea recta.]{componente="SurfaceViz"}
```yaml
modo: matricial
casos: [redonda]
```
:::

## Errores comunes

- **Usar $2\mathbf{A}\mathbf{x}$ con $\mathbf{A}$ no simétrica.** La regla general es $(\mathbf{A} + \mathbf{A}^\top)\mathbf{x}$; solo coincide con $2\mathbf{A}\mathbf{x}$ si $\mathbf{A} = \mathbf{A}^\top$.
- **Equivocar la transpuesta.** $\nabla_{\mathbf{x}}(\mathbf{b}^\top \mathbf{A}\mathbf{x}) = \mathbf{A}^\top \mathbf{b}$, no $\mathbf{A}\mathbf{b}$.
- **Resolver las ecuaciones normales invirtiendo $\mathbf{X}^\top \mathbf{X}$ cuando está mal condicionada.** Es más estable usar una factorización QR.
- **Creer que el gradiente apunta al mínimo.** En una cuadrática alargada apunta hacia la parte empinada del valle, no al mínimo, y el descenso avanza en curva.

:::figura[Con valores propios 1 y 9, el gradiente Ax - b no apunta hacia el mínimo (-0.33, 0.67): el camino del descenso se tuerce primero hacia el fondo del valle y luego lo recorre despacio.]{componente="SurfaceViz"}
```yaml
modo: matricial
casos: [alargada]
```
:::

## Conexiones

Extiende el [[gradiente]] a expresiones con matrices, usando [[matriz-transpuesta]], [[traza-de-una-matriz]] y [[formas-cuadraticas]]. La hessiana de una cuadrática es su matriz, como en [[matriz-hessiana]], y sus valores propios explican la forma del valle. Las ecuaciones normales se resuelven con [[descomposicion-qr]] o con la [[pseudoinversa-de-moore-penrose]]. Es la base de la regresión lineal, la regresión ridge y la retropropagación.

## Formulario

:::formula[Gradiente de una función lineal]
$$
\nabla_{\mathbf{x}} (\mathbf{a}^\top \mathbf{x}) = \mathbf{a}
$$

- $\mathbf{a}$: vector constante; $\mathbf{x}$: variable.
:::

:::formula[Gradiente de una forma cuadrática]
$$
\nabla_{\mathbf{x}} (\mathbf{x}^\top \mathbf{A}\mathbf{x}) = (\mathbf{A} + \mathbf{A}^\top)\mathbf{x}
$$

- $\mathbf{A}$: matriz cuadrada constante; si es simétrica, el resultado es $2\mathbf{A}\mathbf{x}$.
:::

:::formula[Gradiente de mínimos cuadrados]
$$
\nabla_{\boldsymbol{\beta}} \lVert \mathbf{X}\boldsymbol{\beta} - \mathbf{y} \rVert^2 = 2\mathbf{X}^\top(\mathbf{X}\boldsymbol{\beta} - \mathbf{y})
$$

- $\mathbf{X}$: matriz de diseño; $\boldsymbol{\beta}$: coeficientes; $\mathbf{y}$: respuestas.
:::

:::formula[Ecuaciones normales]
$$
\mathbf{X}^\top \mathbf{X}\,\hat{\boldsymbol{\beta}} = \mathbf{X}^\top \mathbf{y}
$$

- $\hat{\boldsymbol{\beta}}$: coeficientes que minimizan la suma de cuadrados.
:::

:::formula[Gradientes respecto a matrices]
$$
\nabla_{\mathbf{X}} \operatorname{tr}(\mathbf{A}\mathbf{X}) = \mathbf{A}^\top, \qquad \nabla_{\mathbf{X}} \log\det \mathbf{X} = (\mathbf{X}^{-1})^\top
$$

- $\operatorname{tr}$: traza; $\det$: determinante, positivo para el logaritmo.
- $\mathbf{X}$: variable matricial.
:::
