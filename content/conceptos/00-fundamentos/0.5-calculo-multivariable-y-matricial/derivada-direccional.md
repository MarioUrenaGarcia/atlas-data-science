---
id: derivada-direccional
titulo: Derivada direccional
titulo_en: Directional derivative
alias:
  - derivada en una dirección
modulo: 0
submodulo: '0.5'
orden: 5
nivel: intermedio
prerrequisitos:
  - gradiente
  - producto-punto
etiquetas:
  - derivada direccional
  - gradiente
  - producto punto
  - razón de cambio
resumen: >
  La derivada direccional mide cuánto cambia f al moverse en una dirección unitaria u; para funciones
  diferenciables es el producto punto del gradiente con u.
formula: 'D_{\mathbf{u}} f(\mathbf{x}) = \lim_{h \to 0} \frac{f(\mathbf{x} + h\mathbf{u}) - f(\mathbf{x})}{h} = \nabla f(\mathbf{x}) \cdot \mathbf{u}'
visualizacion:
  componente: SurfaceViz
  parametros:
    modo: direccional
    campos: [paraboloide, ondas, dos-colinas]
referencias:
  - clave: strang
  - clave: boyd
publicado: true
---

## Intuición

Las derivadas parciales responden cuánto sube el terreno hacia el este o hacia el norte, pero un excursionista puede caminar en cualquier dirección: hacia el noreste, hacia el sur un poco al oeste. La derivada direccional responde a esa pregunta general: si se da un paso corto en esta dirección, cuánto cambia la altura por unidad de distancia recorrida.

Para funciones suaves no hace falta medir cada dirección por separado. Basta conocer el gradiente: la razón de cambio en una dirección es la proyección del gradiente sobre ella, un producto punto. Si la dirección coincide con el gradiente se obtiene la subida máxima; si es perpendicular, el cambio es nulo, porque se camina sobre una curva de nivel; si es opuesta, la bajada es máxima. Al girar la dirección una vuelta completa, la razón de cambio dibuja una onda coseno entre esos dos extremos.

## Definición

:::definicion[Derivada direccional]
Sea $\mathbf{u}$ un vector unitario, $\lVert \mathbf{u} \rVert = 1$. La **derivada direccional** de $f$ en $\mathbf{x}$ en la dirección $\mathbf{u}$ es
$$
D_{\mathbf{u}} f(\mathbf{x}) = \lim_{h \to 0} \frac{f(\mathbf{x} + h\mathbf{u}) - f(\mathbf{x})}{h},
$$
si el límite existe.
:::

:::teorema[Fórmula del gradiente]
Si $f$ es diferenciable en $\mathbf{x}$, para todo vector unitario $\mathbf{u}$
$$
D_{\mathbf{u}} f(\mathbf{x}) = \nabla f(\mathbf{x}) \cdot \mathbf{u} = \lVert \nabla f(\mathbf{x}) \rVert \cos \alpha,
$$
donde $\alpha$ es el ángulo entre $\nabla f(\mathbf{x})$ y $\mathbf{u}$.
:::

Las parciales son casos particulares: $\dfrac{\partial f}{\partial x} = D_{\mathbf{e}_1} f$ y $\dfrac{\partial f}{\partial y} = D_{\mathbf{e}_2} f$.

:::nota[Qué significa cada símbolo]
- $\mathbf{u}$: dirección del movimiento, un vector de norma 1.
- $D_{\mathbf{u}} f(\mathbf{x})$: razón de cambio de $f$ en $\mathbf{x}$ en la dirección $\mathbf{u}$.
- $h$: distancia recorrida en la dirección $\mathbf{u}$.
- $\nabla f(\mathbf{x})$: gradiente de $f$ en $\mathbf{x}$.
- $\cdot$: producto punto.
- $\alpha$: ángulo entre el gradiente y $\mathbf{u}$.
- $\mathbf{e}_1, \mathbf{e}_2$: vectores unitarios de los ejes $x$ y $y$.
:::

## Cómo usar la visualización

A la izquierda, el mapa de curvas de nivel con el punto elegido, la dirección $\mathbf{u}$ en verde, que gira, y el gradiente en naranja punteado. A la derecha, la derivada direccional según el ángulo de $\mathbf{u}$: una onda coseno cuyo pico está marcado con una línea vertical en el ángulo del gradiente. El encabezado escribe el producto punto con los números de cada instante.

Al reproducir se observa que la derivada se anula exactamente cuando $\mathbf{u}$ es tangente a la curva de nivel resaltada, y que el máximo coincide con la norma del gradiente. Si se mueve el punto hacia una zona más empinada, la onda se vuelve más alta sin cambiar de forma.

## Ejemplo

Un excursionista está en el borde de un cráter cuya altura, en cientos de metros, es $h(x, y) = x^2 + y^2$, con $x$ y $y$ en kilómetros desde el centro. Está en el punto $(1, 1.5)$ y quiere caminar hacia el noreste, en la dirección $\mathbf{u} = (0.6, 0.8)$.

1. Gradiente: $\nabla h = (2x, 2y)$, y en el punto $\nabla h(1, 1.5) = (2, 3)$.
2. $\mathbf{u}$ es unitario: $0.6^2 + 0.8^2 = 1$.
3. Derivada direccional: $D_{\mathbf{u}} h = 2(0.6) + 3(0.8) = 1.2 + 2.4 = 3.6$ cientos de metros por kilómetro.
4. Subida máxima posible: $\lVert (2, 3) \rVert = \sqrt{13} = 3.606$, casi la misma, porque $\mathbf{u}$ forma un ángulo de solo 3.2 grados con el gradiente (53.1 contra 56.3 grados).
5. Caminando en la dirección $(-3, 2)/\sqrt{13}$ la derivada es $(-6 + 6)/\sqrt{13} = 0$: se recorre el borde del cráter sin subir ni bajar.

:::figura[El excursionista del ejemplo en (1, 1.5): la derivada direccional dibuja una onda coseno de amplitud 3.606, con su máximo a 56.3 grados, la dirección del gradiente. Cuando u pasa por 53.1 grados vale 3.6.]{componente="SurfaceViz"}
```yaml
modo: direccional
campos: [paraboloide]
punto: [1, 1.5]
```
:::

## Propiedades

- **Extremos:** el máximo de $D_{\mathbf{u}} f$ es $\lVert \nabla f \rVert$, en la dirección del gradiente; el mínimo es $-\lVert \nabla f \rVert$, en la opuesta.
- **Dirección neutra:** $D_{\mathbf{u}} f = 0$ cuando $\mathbf{u}$ es perpendicular al gradiente, tangente a la curva de nivel.
- **Simetría:** $D_{-\mathbf{u}} f = -D_{\mathbf{u}} f$.
- **Linealidad en la dirección:** $\nabla f \cdot \mathbf{u}$ depende linealmente de $\mathbf{u}$, por eso la gráfica contra el ángulo es una onda coseno.

:::figura[En el tazón alargado x² + 3y², en (1, 0.5), el gradiente es (2, 3): la onda va de -3.606 a 3.606 y cruza cero en dos ángulos opuestos, las dos direcciones tangentes a la elipse de nivel.]{componente="SurfaceViz"}
```yaml
modo: direccional
campos: [eliptico]
punto: [1, 0.5]
```
:::

## Errores comunes

- **Usar una dirección no unitaria.** Con $\mathbf{v} = (3, 4)$ en lugar de $(0.6, 0.8)$, el producto $\nabla h \cdot \mathbf{v} = 18$ sale 5 veces mayor, porque $\lVert \mathbf{v} \rVert = 5$. Hay que dividir entre la norma.
- **Pensar que la dirección más empinada es una de los ejes.** Las parciales solo miden dos direcciones; la subida máxima está en la dirección del gradiente, que en general es oblicua.
- **Aplicar la fórmula sin diferenciabilidad.** Si $f$ tiene una arista o un pico, el límite puede existir en cada dirección y aun así no ser igual a $\nabla f \cdot \mathbf{u}$.
- **Confundir la dirección con un punto de destino.** $\mathbf{u}$ indica hacia dónde se mueve, no a qué punto se llega.

:::figura[En la silla x² - y², en (1, 1), el gradiente es (2, -2): moverse en la dirección del eje x sube con pendiente 2, pero la subida máxima es 2.828, en la dirección oblicua (0.71, -0.71), que no es ninguno de los ejes.]{componente="SurfaceViz"}
```yaml
modo: direccional
campos: [silla]
punto: [1, 1]
```
:::

## Conexiones

Generaliza las [[derivadas-parciales]] a cualquier dirección y se calcula con el [[gradiente]] y el [[producto-punto]]. Se anula a lo largo de las [[curvas-de-nivel]]. La [[regla-de-la-cadena-multivariable]] la contiene como caso particular: es la derivada de $f$ a lo largo de la recta $\mathbf{x} + t\mathbf{u}$. En optimización, una dirección con $D_{\mathbf{u}} f < 0$ se llama dirección de descenso.

## Formulario

:::formula[Derivada direccional]
$$
D_{\mathbf{u}} f(\mathbf{x}) = \lim_{h \to 0} \frac{f(\mathbf{x} + h\mathbf{u}) - f(\mathbf{x})}{h}
$$

- $\mathbf{u}$: dirección unitaria.
- $h$: distancia del paso.
- $\mathbf{x}$: punto de partida.
:::

:::formula[Fórmula del gradiente]
$$
D_{\mathbf{u}} f(\mathbf{x}) = \nabla f(\mathbf{x}) \cdot \mathbf{u} = \lVert \nabla f(\mathbf{x}) \rVert \cos \alpha
$$

- $\nabla f(\mathbf{x})$: gradiente; $\cdot$: producto punto.
- $\alpha$: ángulo entre el gradiente y $\mathbf{u}$.
- Válida si $f$ es diferenciable en $\mathbf{x}$.
:::

:::formula[Normalización de una dirección]
$$
\mathbf{u} = \frac{\mathbf{v}}{\lVert \mathbf{v} \rVert}
$$

- $\mathbf{v}$: vector de dirección cualquiera, distinto de cero.
- $\lVert \mathbf{v} \rVert$: su norma.
:::
