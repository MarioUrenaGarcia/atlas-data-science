---
id: multiplicadores-de-lagrange
titulo: Multiplicadores de Lagrange
titulo_en: Lagrange multipliers
alias:
  - método de Lagrange
  - optimización con restricciones de igualdad
  - lagrangiano
modulo: 0
submodulo: '0.5'
orden: 16
nivel: intermedio
prerrequisitos:
  - gradiente
  - curvas-de-nivel
etiquetas:
  - multiplicadores de Lagrange
  - restricciones
  - optimización
  - lagrangiano
resumen: >
  Para optimizar f sujeta a g = 0, en un óptimo regular los gradientes son paralelos, ∇f = λ∇g; el
  multiplicador λ mide cuánto cambia el óptimo al relajar la restricción.
formula: '\nabla f(\mathbf{x}^*) = \lambda\,\nabla g(\mathbf{x}^*), \quad g(\mathbf{x}^*) = 0, \qquad \mathcal{L}(\mathbf{x}, \lambda) = f(\mathbf{x}) - \lambda\,g(\mathbf{x})'
visualizacion:
  componente: SurfaceViz
  parametros:
    modo: lagrange
    casos: [suma-circulo, producto-elipse, paraboloide-recta]
referencias:
  - clave: boyd
    capitulo: '5'
  - clave: strang
publicado: true
---

## Intuición

Un excursionista no puede ir a donde quiera: debe seguir un sendero. Quiere saber en qué punto del sendero está más alto. Mientras camina, va cruzando curvas de nivel del terreno; si el sendero corta una curva de nivel, puede seguir subiendo un poco más adelante. El punto más alto del sendero es aquel donde el sendero deja de cruzar las curvas de nivel y solo toca una, tangente a ella.

En ese punto de tangencia, la curva de nivel de la función y el sendero, que es una curva de nivel de la restricción, tienen la misma dirección, así que sus gradientes, perpendiculares a ambas, son paralelos: uno es un múltiplo del otro. El método de Lagrange convierte esa observación en ecuaciones. El número que los relaciona, el multiplicador, tiene además un significado útil: cuánto mejoraría el óptimo si la restricción se relajara un poco, como el valor de un recurso escaso.

## Definición

:::teorema[Condición de Lagrange]
Sean $f, g : \mathbb{R}^n \to \mathbb{R}$ con derivadas continuas y $\mathbf{x}^*$ un máximo o mínimo local de $f$ sobre el conjunto $\{g(\mathbf{x}) = 0\}$. Si $\nabla g(\mathbf{x}^*) \neq \mathbf{0}$, existe un número $\lambda$ tal que
$$
\nabla f(\mathbf{x}^*) = \lambda\,\nabla g(\mathbf{x}^*).
$$
:::

Equivalentemente, $(\mathbf{x}^*, \lambda)$ es un punto crítico del **lagrangiano**
$$
\mathcal{L}(\mathbf{x}, \lambda) = f(\mathbf{x}) - \lambda\,g(\mathbf{x}),
$$
pues $\nabla_{\mathbf{x}}\mathcal{L} = \mathbf{0}$ da la condición de los gradientes y $\partial\mathcal{L}/\partial\lambda = 0$ da la restricción. Con varias restricciones $g_1 = \dots = g_m = 0$ de gradientes linealmente independientes, $\nabla f = \sum_k \lambda_k \nabla g_k$.

:::nota[Qué significa cada símbolo]
- $f$: función objetivo que se maximiza o minimiza.
- $g$: función de la restricción; los puntos permitidos cumplen $g(\mathbf{x}) = 0$.
- $\mathbf{x}^*$: punto óptimo sobre la restricción.
- $\nabla f$, $\nabla g$: gradientes de cada función.
- $\lambda$: multiplicador de Lagrange.
- $\mathcal{L}$: lagrangiano.
- $\lambda_k$, $g_k$: multiplicador y función de la restricción $k$ cuando hay varias.
:::

## Cómo usar la visualización

A la izquierda, las curvas de nivel de $f$, la restricción $g = 0$ en morado y un punto que la recorre con dos flechas: $\nabla f$ en naranja y $\nabla g$ en verde. A la derecha, el valor de $f$ a lo largo de la restricción. Los puntos negros, en ambos paneles, son los que cumplen $\nabla f = \lambda\nabla g$. El encabezado indica si en el instante actual los gradientes son paralelos y, cuando lo son, escribe $\lambda$.

Al reproducir, la curva de nivel resaltada corta a la restricción en casi todos los puntos; solo en los puntos negros la toca sin cruzarla, y ahí la gráfica de la derecha tiene un máximo o un mínimo.

## Ejemplo

Una antena se puede colocar en cualquier punto de un riel circular de radio 1 m, $x^2 + y^2 = 1$; su ganancia en la dirección de un receptor es proporcional a $f(x, y) = x + y$. Se busca la mejor posición.

1. Restricción: $g(x, y) = x^2 + y^2 - 1 = 0$. Gradientes: $\nabla f = (1, 1)$ y $\nabla g = (2x, 2y)$.
2. Condición: $1 = 2\lambda x$ y $1 = 2\lambda y$, así que $x = y = \dfrac{1}{2\lambda}$.
3. Sustituyendo en la restricción: $2 \cdot \dfrac{1}{4\lambda^2} = 1$, de donde $\lambda = \pm\dfrac{1}{\sqrt{2}}$.
4. Con $\lambda = 0.7071$: $(x, y) = (0.7071, 0.7071)$ y $f = \sqrt{2} = 1.414$, el máximo.
5. Con $\lambda = -0.7071$: $(x, y) = (-0.7071, -0.7071)$ y $f = -1.414$, el mínimo.
6. Sensibilidad: con un riel de radio $\sqrt{1 + c}$, el máximo es $\sqrt{2(1 + c)}$, cuya derivada en $c = 0$ es $\tfrac{1}{\sqrt{2}} = \lambda$.

:::figura[El riel del ejemplo: al recorrer el círculo, los gradientes de x + y y de la restricción solo son paralelos en (0.71, 0.71), el máximo √2, y en (-0.71, -0.71), el mínimo; la gráfica de la derecha alcanza ahí sus extremos.]{componente="SurfaceViz"}
```yaml
modo: lagrange
casos: [suma-circulo]
```
:::

## Propiedades

- **Interpretación de $\lambda$:** si la restricción es $h(\mathbf{x}) = c$, el valor óptimo $f^*(c)$ cumple $\dfrac{df^*}{dc} = \lambda$; en economía se llama precio sombra.
- **Regularidad:** la condición puede fallar si $\nabla g(\mathbf{x}^*) = \mathbf{0}$; esos puntos se revisan aparte.
- **Solo candidatos:** la condición es necesaria; hay que comparar los valores de $f$ en todos los candidatos para decidir cuál es el máximo y cuál el mínimo.
- **Existencia:** si la restricción define un conjunto cerrado y acotado, como un círculo, $f$ continua alcanza su máximo y su mínimo, y ambos están entre los candidatos.

:::figura[Caso de precio sombra: el mínimo de x² + y² sobre la recta x + y = 1 está en (0.5, 0.5), con valor 0.5 y λ = 1. Si la recta fuera x + y = c, el mínimo sería c²/2, cuya derivada en c = 1 es justamente λ = 1.]{componente="SurfaceViz"}
```yaml
modo: lagrange
casos: [paraboloide-recta]
```
:::

## Errores comunes

- **Suponer que la condición da solo el máximo.** Da todos los puntos donde la restricción es tangente a una curva de nivel: máximos, mínimos y, a veces, puntos que no son ninguno de los dos.
- **Olvidar la ecuación de la restricción.** $\nabla f = \lambda\nabla g$ son $n$ ecuaciones con $n + 1$ incógnitas; falta $g = 0$ para cerrar el sistema.
- **Igualar $\nabla f$ a cero.** El óptimo restringido casi nunca es un punto crítico de $f$; lo que se anula es el gradiente del lagrangiano.
- **Ignorar el signo de $\lambda$.** El signo depende de cómo se escriban la restricción y el lagrangiano; para interpretarlo como precio sombra hay que fijar la convención.

:::figura[xy sobre la elipse x²/4 + y² = 1 tiene cuatro puntos con gradientes paralelos: dos máximos de valor 1, en (1.41, 0.71) y (-1.41, -0.71), y dos mínimos de valor -1. La condición de Lagrange encuentra los cuatro y después se comparan sus valores.]{componente="SurfaceViz"}
```yaml
modo: lagrange
casos: [producto-elipse]
```
:::

## Conexiones

Usa el [[gradiente]] y la tangencia entre [[curvas-de-nivel]]. Extiende la búsqueda de [[puntos-criticos-y-puntos-silla]] a problemas con restricciones de igualdad, y las [[condiciones-de-karush-kuhn-tucker]] la amplían a desigualdades. Aparece en la estimación por máxima verosimilitud con restricciones, en el análisis de componentes principales, que maximiza una varianza con un vector de norma 1, y en la máxima entropía.

## Formulario

:::formula[Condición de Lagrange]
$$
\nabla f(\mathbf{x}^*) = \lambda\,\nabla g(\mathbf{x}^*), \qquad g(\mathbf{x}^*) = 0
$$

- $f$: objetivo; $g = 0$: restricción.
- $\lambda$: multiplicador; requiere $\nabla g(\mathbf{x}^*) \neq \mathbf{0}$.
:::

:::formula[Lagrangiano]
$$
\mathcal{L}(\mathbf{x}, \lambda) = f(\mathbf{x}) - \lambda\,g(\mathbf{x})
$$

- Sus puntos críticos en $(\mathbf{x}, \lambda)$ son los candidatos al óptimo.
:::

:::formula[Varias restricciones]
$$
\nabla f(\mathbf{x}^*) = \sum_{k=1}^{m} \lambda_k \nabla g_k(\mathbf{x}^*)
$$

- $g_1, \dots, g_m$: restricciones de igualdad con gradientes linealmente independientes.
- $\lambda_k$: multiplicador de la restricción $k$.
:::

:::formula[Sensibilidad del óptimo]
$$
\frac{d f^*(c)}{dc} = \lambda
$$

- $f^*(c)$: valor óptimo con la restricción $h(\mathbf{x}) = c$.
- $\lambda$: multiplicador en el óptimo.
:::
