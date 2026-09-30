---
id: proyeccion-ortogonal
titulo: Proyección ortogonal
titulo_en: Orthogonal projection
alias:
  - proyección de un vector
  - proyección sobre un subespacio
  - componente ortogonal
modulo: 0
submodulo: '0.3'
orden: 12
nivel: basico
prerrequisitos:
  - ortogonalidad-y-ortonormalidad
  - subespacios
etiquetas:
  - proyección
  - residuo
  - mínimos cuadrados
  - punto más cercano
resumen: >
  La proyección ortogonal de un vector sobre un subespacio es el punto del subespacio más cercano a él;
  lo que sobra, el residuo, es perpendicular al subespacio.
formula: '\operatorname{proy}_{\mathbf{a}}\mathbf{b} = \frac{\mathbf{a} \cdot \mathbf{b}}{\mathbf{a} \cdot \mathbf{a}}\,\mathbf{a}, \qquad (\mathbf{b} - \mathbf{p}) \perp \mathbf{a}'
visualizacion:
  componente: VectorPlane
  parametros:
    modo: proyeccion
    a: [4, 1]
    b: [2, 3]
referencias:
  - clave: strang
  - clave: hastie-esl
publicado: true
---

## Intuición

Al mediodía, la sombra de un poste inclinado sobre el piso es su proyección: la luz cae perpendicular al suelo y marca el punto del piso que queda justo debajo de cada punto del poste. De todos los puntos del piso, ese es el más cercano a la punta del poste, y el segmento que los une es vertical, perpendicular al piso.

La proyección ortogonal generaliza esa sombra. Dado un vector $\mathbf{b}$ y una recta o un plano que pasa por el origen, se busca el punto $\mathbf{p}$ de la recta o del plano más cercano a $\mathbf{b}$. La condición que lo caracteriza es que el error $\mathbf{b} - \mathbf{p}$ sea perpendicular a todo el subespacio: si no lo fuera, moverse un poco en la dirección de la sombra acortaría la distancia. Esta idea es el corazón de los mínimos cuadrados: ajustar un modelo lineal es proyectar el vector de datos observados sobre el subespacio de lo que el modelo puede predecir.

## Definición

:::definicion[Proyección sobre una recta]
La proyección de $\mathbf{b}$ sobre la recta generada por $\mathbf{a} \neq \mathbf{0}$ es
$$
\mathbf{p} = \operatorname{proy}_{\mathbf{a}}\mathbf{b} = \frac{\mathbf{a} \cdot \mathbf{b}}{\mathbf{a} \cdot \mathbf{a}}\,\mathbf{a},
$$
y el **residuo** $\mathbf{b} - \mathbf{p}$ cumple $\mathbf{a} \cdot (\mathbf{b} - \mathbf{p}) = 0$.
:::

:::definicion[Proyección sobre un subespacio]
Si $W \subseteq \mathbb{R}^n$ es un subespacio, la proyección de $\mathbf{b}$ sobre $W$ es el único $\mathbf{p} \in W$ con $\mathbf{b} - \mathbf{p} \perp W$. Si $\{\mathbf{q}_1, \dots, \mathbf{q}_k\}$ es una base ortonormal de $W$,
$$
\mathbf{p} = \sum_{i=1}^{k} (\mathbf{b} \cdot \mathbf{q}_i)\,\mathbf{q}_i, \qquad \lVert \mathbf{b} - \mathbf{p} \rVert = \min_{\mathbf{w} \in W} \lVert \mathbf{b} - \mathbf{w} \rVert.
$$
:::

:::nota[Qué significa cada símbolo]
- $\mathbf{b}$: vector que se proyecta.
- $\mathbf{a}$: vector no nulo que genera la recta.
- $\mathbf{p}$: proyección, el punto más cercano del subespacio.
- $\mathbf{b} - \mathbf{p}$: residuo, perpendicular al subespacio.
- $W$: subespacio sobre el que se proyecta.
- $\mathbf{q}_i$: vectores de una base ortonormal de $W$.
- $k$: dimensión de $W$.
- $\perp$: "es perpendicular a".
:::

## Cómo usar la visualización

La línea punteada es la recta generada por $\mathbf{a}$. La reproducción deja caer la punta de $\mathbf{b}$ perpendicularmente sobre la recta y marca la proyección $\mathbf{p}$ y el residuo $\mathbf{b} - \mathbf{p}$ con el ángulo recto. Las puntas de $\mathbf{a}$ y $\mathbf{b}$ se arrastran; el panel muestra el coeficiente, la proyección, el residuo y la distancia de $\mathbf{b}$ a la recta.

Al alargar $\mathbf{a}$ la proyección no cambia, porque solo importa la recta. Con $\mathbf{b}$ perpendicular a $\mathbf{a}$ la proyección es el cero; con $\mathbf{b}$ sobre la recta, el residuo desaparece. El producto $\mathbf{a} \cdot (\mathbf{b} - \mathbf{p})$ siempre vale cero.

## Ejemplo

Un avión debe volar en la dirección $\mathbf{a} = (3, 1)$ y el viento sopla con velocidad $\mathbf{b} = (2, 4)$ km/h. Se separa el viento en la parte que empuja a lo largo de la ruta y la parte lateral.

1. $\mathbf{a} \cdot \mathbf{b} = 6 + 4 = 10$ y $\mathbf{a} \cdot \mathbf{a} = 9 + 1 = 10$.
2. Coeficiente: $10/10 = 1$, así que $\mathbf{p} = 1 \cdot (3, 1) = (3, 1)$ km/h a favor de la ruta.
3. Residuo lateral: $\mathbf{b} - \mathbf{p} = (-1, 3)$ km/h.
4. Comprobación: $\mathbf{a} \cdot (\mathbf{b} - \mathbf{p}) = -3 + 3 = 0$.
5. Pitágoras: $\lVert \mathbf{b} \rVert^2 = 20 = \lVert \mathbf{p} \rVert^2 + \lVert \mathbf{b} - \mathbf{p} \rVert^2 = 10 + 10$.

:::figura[El viento del ejemplo proyectado sobre la ruta. La sombra (3, 1) es la parte a favor de la ruta y el residuo (-1, 3) es el viento cruzado, perpendicular a ella.]{componente="VectorPlane"}
```yaml
modo: proyeccion
a: [3, 1]
b: [2, 4]
```
:::

## Propiedades

- **Punto más cercano:** $\lVert \mathbf{b} - \mathbf{p} \rVert \le \lVert \mathbf{b} - \mathbf{w} \rVert$ para todo $\mathbf{w} \in W$.
- **Descomposición única:** $\mathbf{b} = \mathbf{p} + (\mathbf{b} - \mathbf{p})$ con $\mathbf{p} \in W$ y $\mathbf{b} - \mathbf{p} \in W^\perp$.
- **Idempotencia:** proyectar dos veces es lo mismo que proyectar una: $\operatorname{proy}_W(\operatorname{proy}_W\mathbf{b}) = \operatorname{proy}_W\mathbf{b}$.
- **Linealidad:** la proyección de una suma es la suma de las proyecciones; se representa con una matriz $P$ que cumple $P^2 = P$ y $P^\top = P$.
- **Matriz de proyección:** si las columnas de $A$ son independientes y generan $W$, $P = A(A^\top A)^{-1}A^\top$.
- **Pitágoras:** $\lVert \mathbf{b} \rVert^2 = \lVert \mathbf{p} \rVert^2 + \lVert \mathbf{b} - \mathbf{p} \rVert^2$.

:::figura[Caso de proyección sobre un plano en el espacio: el vector b cae perpendicularmente sobre el plano generado por a₁ y a₂; el residuo es vertical y perpendicular a ambos generadores.]{componente="Space3D"}
```yaml
modo: proyeccion
a1: [2, 0, 0]
a2: [1, 2, 0]
b: [1, 1, 2.5]
```
:::

:::demostracion
Punto más cercano: para $\mathbf{w} \in W$, $\mathbf{b} - \mathbf{w} = (\mathbf{b} - \mathbf{p}) + (\mathbf{p} - \mathbf{w})$, donde el primer término es perpendicular a $W$ y el segundo está en $W$. Por Pitágoras, $\lVert \mathbf{b} - \mathbf{w} \rVert^2 = \lVert \mathbf{b} - \mathbf{p} \rVert^2 + \lVert \mathbf{p} - \mathbf{w} \rVert^2 \ge \lVert \mathbf{b} - \mathbf{p} \rVert^2$.
:::

## Errores comunes

- **Olvidar dividir entre $\mathbf{a} \cdot \mathbf{a}$.** Si $\mathbf{a}$ no es unitario, $(\mathbf{a} \cdot \mathbf{b})\,\mathbf{a}$ no es la proyección.
- **Sumar proyecciones sobre vectores no ortogonales.** La fórmula $\sum (\mathbf{b} \cdot \mathbf{q}_i)\mathbf{q}_i$ solo vale con una base ortonormal de $W$.
- **Proyectar sobre una recta que no pasa por el origen con la misma fórmula.** Primero hay que trasladar.
- **Confundir la proyección con el coeficiente.** El coeficiente $\mathbf{a} \cdot \mathbf{b} / \mathbf{a} \cdot \mathbf{a}$ es un número; la proyección es un vector.

## Conexiones

La proyección combina la [[ortogonalidad-y-ortonormalidad|ortogonalidad]] con la noción de [[subespacios]], y minimiza las [[distancias]] euclidianas. El [[proceso-de-gram-schmidt]] resta proyecciones para construir bases ortonormales, y la [[pseudoinversa-de-moore-penrose]] resuelve sistemas sin solución proyectando el lado derecho. En regresión lineal, los valores ajustados son la proyección del vector de respuestas sobre el espacio de las columnas de diseño.

## Formulario

:::formula[Proyección sobre una recta]
$$
\mathbf{p} = \frac{\mathbf{a} \cdot \mathbf{b}}{\mathbf{a} \cdot \mathbf{a}}\,\mathbf{a}
$$

- $\mathbf{a}$: generador de la recta.
- $\mathbf{b}$: vector que se proyecta.
- $\mathbf{p}$: proyección.
:::

:::formula[Proyección con base ortonormal]
$$
\mathbf{p} = \sum_{i=1}^{k} (\mathbf{b} \cdot \mathbf{q}_i)\,\mathbf{q}_i
$$

- $\mathbf{q}_i$: base ortonormal del subespacio.
- $k$: dimensión del subespacio.
:::

:::formula[Matriz de proyección]
$$
P = A(A^\top A)^{-1}A^\top, \qquad P^2 = P, \qquad P^\top = P
$$

- $A$: matriz con columnas independientes que generan el subespacio.
- $P$: matriz que proyecta cualquier vector sobre el espacio columna de $A$.
:::

:::formula[Residuo]
$$
\mathbf{r} = \mathbf{b} - \mathbf{p}, \qquad A^\top\mathbf{r} = \mathbf{0}
$$

- $\mathbf{r}$: residuo, ortogonal a cada columna de $A$.
:::
