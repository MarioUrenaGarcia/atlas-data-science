---
id: plano-tangente-y-aproximacion-lineal
titulo: Plano tangente y aproximación lineal
titulo_en: Tangent plane and linear approximation
alias:
  - linealización
  - aproximación de primer orden
  - diferencial total
modulo: 0
submodulo: '0.5'
orden: 6
nivel: intermedio
prerrequisitos:
  - gradiente
etiquetas:
  - plano tangente
  - linealización
  - diferenciabilidad
  - aproximación
resumen: >
  Cerca de un punto, una función diferenciable se parece a su plano tangente; el error de esa
  aproximación lineal es pequeño incluso comparado con la distancia al punto.
formula: 'L(\mathbf{x}) = f(\mathbf{a}) + \nabla f(\mathbf{a})^\top (\mathbf{x} - \mathbf{a}), \qquad \frac{f(\mathbf{x}) - L(\mathbf{x})}{\lVert \mathbf{x} - \mathbf{a} \rVert} \to 0'
visualizacion:
  componente: SurfaceViz
  parametros:
    modo: tangente
    campos: [dos-colinas, ondas, gaussiana]
referencias:
  - clave: strang
  - clave: boyd
publicado: true
---

## Intuición

Vista de cerca, la Tierra parece plana: para trazar una cancha de fútbol nadie corrige la curvatura del planeta. Lo mismo pasa con cualquier superficie suave: alrededor de un punto se parece cada vez más a un plano, el plano tangente, que la toca en ese punto con la misma inclinación en todas las direcciones.

Ese plano está determinado por dos pendientes, las derivadas parciales, y permite aproximar valores cercanos con una fórmula lineal muy simple. La clave de la palabra "tangente" no es solo que el plano pase por el punto, porque muchos planos lo hacen, sino que el error de la aproximación se encoge más rápido que la distancia: al acercarse a la mitad, el error baja a cerca de la cuarta parte. Esa propiedad es la definición de diferenciable en varias variables, y es lo que justifica aproximar un modelo complicado por uno lineal cerca de un punto de operación.

## Definición

:::definicion[Diferenciabilidad y plano tangente]
$f : \mathbb{R}^n \to \mathbb{R}$ es **diferenciable** en $\mathbf{a}$ si existe un vector, que resulta ser $\nabla f(\mathbf{a})$, tal que
$$
\lim_{\mathbf{x} \to \mathbf{a}} \frac{f(\mathbf{x}) - f(\mathbf{a}) - \nabla f(\mathbf{a})^\top (\mathbf{x} - \mathbf{a})}{\lVert \mathbf{x} - \mathbf{a} \rVert} = 0.
$$
La función $L(\mathbf{x}) = f(\mathbf{a}) + \nabla f(\mathbf{a})^\top (\mathbf{x} - \mathbf{a})$ es la **aproximación lineal** de $f$ en $\mathbf{a}$.
:::

Para $n = 2$ y $\mathbf{a} = (x_0, y_0)$, la gráfica de $L$ es el **plano tangente**
$$
z = f(x_0, y_0) + f_x(x_0, y_0)(x - x_0) + f_y(x_0, y_0)(y - y_0).
$$
Si las parciales existen y son continuas cerca de $\mathbf{a}$, entonces $f$ es diferenciable en $\mathbf{a}$.

:::nota[Qué significa cada símbolo]
- $\mathbf{a}$: punto de tangencia; $(x_0, y_0)$ en dos variables.
- $f(\mathbf{a})$: valor de la función en ese punto.
- $\nabla f(\mathbf{a})$: gradiente en $\mathbf{a}$.
- $\mathbf{x} - \mathbf{a}$: desplazamiento desde el punto de tangencia.
- $L(\mathbf{x})$: aproximación lineal, la altura del plano tangente sobre $\mathbf{x}$.
- $f_x, f_y$: derivadas parciales en $(x_0, y_0)$.
- $\lVert \mathbf{x} - \mathbf{a} \rVert$: distancia al punto de tangencia.
:::

## Cómo usar la visualización

A la izquierda, la superficie con el plano tangente en naranja y un segmento negro que une la superficie con el plano sobre la posición de una sonda. A la derecha, el mapa de curvas de nivel con la sonda verde, que se acerca al punto en línea recta. El primer renglón del encabezado escribe el plano tangente con sus números; el segundo, la distancia $h$, el error $\lvert f - L \rvert$ y el cociente error entre $h$.

Al reproducir, la sonda reduce su distancia por un factor fijo en cada paso. El error baja más rápido que $h$ y el cociente tiende a 0: es lo que hace al plano tangente. Si se elige un punto cercano a una cima, el plano queda casi horizontal.

## Ejemplo

Una lámina ondulada tiene altura $f(x, y) = \operatorname{sen} x \cos y$ decímetros. Se aproxima la altura en $(0.6, 0.4)$ usando el plano tangente en $(0.5, 0.5)$.

1. Valor en el punto: $f(0.5, 0.5) = \operatorname{sen} 0.5 \cos 0.5 = 0.479426 \cdot 0.877583 = 0.420735$.
2. Parciales: $f_x = \cos x \cos y$ y $f_y = -\operatorname{sen} x \operatorname{sen} y$; en el punto, $f_x = 0.770151$ y $f_y = -0.229849$.
3. Plano: $L(x, y) = 0.420735 + 0.770151(x - 0.5) - 0.229849(y - 0.5)$.
4. Aproximación: $L(0.6, 0.4) = 0.420735 + 0.077015 + 0.022985 = 0.520735$.
5. Valor exacto: $\operatorname{sen} 0.6 \cos 0.4 = 0.564642 \cdot 0.921061 = 0.520072$. El error es $0.000663$, mientras la distancia es $\sqrt{0.02} = 0.1414$: un error relativo a la distancia de apenas $0.0047$.

:::figura[La lámina ondulada del ejemplo y su plano tangente en (0.5, 0.5): la sonda se acerca y el cociente entre el error y la distancia baja hacia 0.]{componente="SurfaceViz"}
```yaml
modo: tangente
campos: [ondas]
punto: [0.5, 0.5]
```
:::

## Propiedades

- **Error de segundo orden:** si $f$ tiene segundas derivadas continuas, $f(\mathbf{x}) - L(\mathbf{x}) \approx \tfrac{1}{2}(\mathbf{x} - \mathbf{a})^\top \mathbf{H}(\mathbf{a})(\mathbf{x} - \mathbf{a})$, proporcional al cuadrado de la distancia.
- **Diferencial total:** $df = f_x\,dx + f_y\,dy$ estima el cambio de $f$ ante pequeños cambios $dx$ y $dy$.
- **Plano horizontal:** si $\nabla f(\mathbf{a}) = \mathbf{0}$, el plano tangente es horizontal; ocurre en extremos y en sillas.
- **Diferenciable implica continua:** si $f$ es diferenciable en $\mathbf{a}$, es continua ahí.
- **Propagación de errores:** si $x$ y $y$ se miden con errores pequeños, el error de $f$ es aproximadamente $f_x\,\Delta x + f_y\,\Delta y$.

:::figura[En el tazón x² + y², desde (1, 1), el error de la aproximación lineal es exactamente el cuadrado de la distancia, así que el cociente error entre distancia baja en proporción a la distancia: al reducirla 0.8 veces, el cociente también se reduce 0.8 veces.]{componente="SurfaceViz"}
```yaml
modo: tangente
campos: [paraboloide]
punto: [1, 1]
```
:::

## Errores comunes

- **Pensar que el plano tangente no corta la superficie.** En una silla el plano tangente atraviesa la superficie: queda por debajo en una dirección y por encima en la otra. Tocar sin cruzar es propio de superficies convexas.
- **Creer que basta con que existan las parciales.** Una función puede tener ambas parciales en un punto sin ser diferenciable; hace falta, por ejemplo, que sean continuas cerca del punto.
- **Usar la aproximación lejos del punto.** El error crece como el cuadrado de la distancia; a una distancia grande la aproximación puede ser mala.
- **Olvidar el término constante.** $L$ no es $\nabla f(\mathbf{a})^\top \mathbf{x}$ sino $f(\mathbf{a}) + \nabla f(\mathbf{a})^\top(\mathbf{x} - \mathbf{a})$.

:::figura[En la silla x² - y², el plano tangente en (0.3, 0.2) atraviesa la superficie: hacia un lado la superficie queda arriba del plano y hacia el otro abajo, aunque el error sigue siendo pequeño cerca del punto.]{componente="SurfaceViz"}
```yaml
modo: tangente
campos: [silla]
punto: [0.3, 0.2]
```
:::

## Conexiones

Usa el [[gradiente]] y las [[derivadas-parciales]] para extender la recta tangente de la [[derivada-como-pendiente-y-razon-de-cambio]]. La aproximación cuadrática que la mejora usa la [[matriz-hessiana]], y ambas son los primeros términos de la [[serie-de-taylor-y-de-maclaurin|serie de Taylor]]. Para funciones con varias salidas el papel del gradiente lo toma la [[matriz-jacobiana]]. El método delta de la estadística aproxima la varianza de un estimador con esta linealización.

## Formulario

:::formula[Aproximación lineal]
$$
L(\mathbf{x}) = f(\mathbf{a}) + \nabla f(\mathbf{a})^\top (\mathbf{x} - \mathbf{a})
$$

- $\mathbf{a}$: punto de tangencia.
- $f(\mathbf{a})$: valor en ese punto.
- $\nabla f(\mathbf{a})$: gradiente en $\mathbf{a}$.
- $\mathbf{x}$: punto cercano donde se aproxima.
:::

:::formula[Plano tangente en dos variables]
$$
z = f(x_0, y_0) + f_x(x_0, y_0)(x - x_0) + f_y(x_0, y_0)(y - y_0)
$$

- $(x_0, y_0)$: punto de tangencia.
- $f_x, f_y$: derivadas parciales en ese punto.
- $z$: altura del plano sobre $(x, y)$.
:::

:::formula[Condición de diferenciabilidad]
$$
\lim_{\mathbf{x} \to \mathbf{a}} \frac{f(\mathbf{x}) - L(\mathbf{x})}{\lVert \mathbf{x} - \mathbf{a} \rVert} = 0
$$

- $f(\mathbf{x}) - L(\mathbf{x})$: error de la aproximación lineal.
- $\lVert \mathbf{x} - \mathbf{a} \rVert$: distancia al punto de tangencia.
:::

:::formula[Diferencial total]
$$
df = f_x\,dx + f_y\,dy
$$

- $dx, dy$: cambios pequeños en $x$ y en $y$.
- $df$: cambio aproximado de $f$.
:::
