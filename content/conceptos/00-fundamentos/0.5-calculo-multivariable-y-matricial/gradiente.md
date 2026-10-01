---
id: gradiente
titulo: Gradiente
titulo_en: Gradient
alias:
  - vector gradiente
  - nabla f
modulo: 0
submodulo: '0.5'
orden: 4
nivel: intermedio
prerrequisitos:
  - derivadas-parciales
etiquetas:
  - gradiente
  - máximo ascenso
  - curvas de nivel
  - optimización
resumen: >
  El gradiente reúne las derivadas parciales en un vector; apunta hacia donde la función crece más rápido,
  su longitud es esa rapidez y es perpendicular a las curvas de nivel.
formula: '\nabla f(\mathbf{x}) = \left(\frac{\partial f}{\partial x_1}(\mathbf{x}), \dots, \frac{\partial f}{\partial x_n}(\mathbf{x})\right)^\top'
visualizacion:
  componente: SurfaceViz
  parametros:
    modo: gradiente
    campos: [dos-colinas, eliptico, rosenbrock]
referencias:
  - clave: strang
  - clave: goodfellow
    capitulo: '4.3'
  - clave: boyd
publicado: true
---

## Intuición

En una ladera con niebla no se ve la cima, pero bajo los pies se siente hacia dónde sube el terreno con más fuerza. Esa dirección cambia de un lugar a otro, y en cada lugar también se siente cuán empinada es la subida. El gradiente es precisamente esa información, dirección y empinamiento, codificada en una flecha.

Se construye juntando las derivadas parciales: la pendiente hacia el este y la pendiente hacia el norte forman las dos componentes de un vector. Ese vector resulta apuntar hacia el ascenso más rápido, y su longitud es la pendiente en esa dirección. Por eso, para bajar lo más rápido posible se camina en la dirección contraria al gradiente: es la idea del descenso por gradiente con el que se entrenan los modelos de aprendizaje automático. También es perpendicular a las curvas de nivel: caminar a lo largo de una curva de nivel no cambia la altura, y la mayor subida está en ángulo recto con ella.

## Definición

:::definicion[Gradiente]
Si $f : \mathbb{R}^n \to \mathbb{R}$ tiene derivadas parciales en $\mathbf{x}$, su **gradiente** en $\mathbf{x}$ es el vector
$$
\nabla f(\mathbf{x}) = \begin{pmatrix} \dfrac{\partial f}{\partial x_1}(\mathbf{x}) \\ \vdots \\ \dfrac{\partial f}{\partial x_n}(\mathbf{x}) \end{pmatrix}.
$$
:::

Cuando $f$ es diferenciable en $\mathbf{x}$ y $\nabla f(\mathbf{x}) \neq \mathbf{0}$:

- la dirección unitaria de crecimiento más rápido es $\nabla f(\mathbf{x}) / \lVert \nabla f(\mathbf{x}) \rVert$;
- la razón de cambio en esa dirección es $\lVert \nabla f(\mathbf{x}) \rVert$;
- $\nabla f(\mathbf{x})$ es perpendicular al conjunto de nivel que pasa por $\mathbf{x}$.

:::nota[Qué significa cada símbolo]
- $f$: función de $n$ variables con valores reales.
- $\mathbf{x} = (x_1, \dots, x_n)$: punto donde se calcula el gradiente.
- $\nabla f(\mathbf{x})$: gradiente, vector columna de derivadas parciales; $\nabla$ se lee "nabla".
- $\frac{\partial f}{\partial x_i}$: derivada parcial respecto a la coordenada $i$.
- $\lVert \nabla f(\mathbf{x}) \rVert$: norma del gradiente, la pendiente máxima.
- $\mathbf{0}$: vector cero de $\mathbb{R}^n$.
:::

## Cómo usar la visualización

El mapa muestra las curvas de nivel de $f$ y, encima, un campo de flechas grises: el gradiente en una rejilla de puntos, con longitud proporcional a la pendiente. La flecha naranja es el gradiente en la posición actual. Al reproducir, el punto sube dando pasos cortos en la dirección del gradiente y deja un camino. El primer renglón del encabezado da el gradiente y su norma en el punto elegido; el segundo, el gradiente en el paso actual del ascenso.

Las flechas cruzan siempre las curvas de nivel en ángulo recto. Con el tazón alargado $x^2 + 3y^2$, las flechas no apuntan hacia el centro sino hacia el lado más empinado. Con dos colinas, el camino que sale de la izquierda termina en la colina baja: seguir el gradiente lleva a la cima más cercana, no a la más alta.

## Ejemplo

La temperatura de una placa, en grados sobre la del ambiente, es $T(x, y) = 2x^2 + 2xy + y^2$, con $x$ y $y$ en centímetros. Un sensor está en $(1, -0.5)$.

1. Parciales: $T_x = 4x + 2y$ y $T_y = 2x + 2y$.
2. En el punto: $T_x = 4 - 1 = 3$ y $T_y = 2 - 1 = 1$, así que $\nabla T(1, -0.5) = (3, 1)$.
3. Rapidez máxima de calentamiento: $\lVert (3, 1) \rVert = \sqrt{10} = 3.162$ grados por centímetro.
4. Dirección de máximo calentamiento: $(3, 1)/\sqrt{10} = (0.949, 0.316)$; la de máximo enfriamiento es la opuesta, $(-0.949, -0.316)$.
5. Una dirección que no cambia la temperatura es perpendicular: $(-1, 3)/\sqrt{10}$, tangente a la curva de nivel $T = T(1, -0.5) = 1.25$.

:::figura[La placa del ejemplo: en el sensor, en (1, -0.5), el gradiente (3, 1) cruza en ángulo recto la curva de nivel resaltada, T = 1.25. Al reproducir, el punto sigue el gradiente y se aleja del mínimo en el origen.]{componente="SurfaceViz"}
```yaml
modo: gradiente
campos: [cuadratica-girada]
punto: [1, -0.5]
```
:::

## Propiedades

- **Linealidad:** $\nabla(af + bg) = a\nabla f + b\nabla g$; también valen versiones del producto, $\nabla(fg) = f\nabla g + g\nabla f$, y de la cadena.
- **Puntos críticos:** en un mínimo o máximo local interior de una función diferenciable, $\nabla f = \mathbf{0}$.
- **Perpendicular a los niveles:** si $\mathbf{r}(t)$ recorre una curva de nivel, $\nabla f \cdot \mathbf{r}'(t) = 0$.
- **Descenso por gradiente:** el paso $\mathbf{x}_{k+1} = \mathbf{x}_k - \eta\,\nabla f(\mathbf{x}_k)$ reduce $f$ si la tasa $\eta$ es suficientemente pequeña.
- **Gradientes conocidos:** $\nabla(\mathbf{a}^\top \mathbf{x}) = \mathbf{a}$ y $\nabla \lVert \mathbf{x} \rVert^2 = 2\mathbf{x}$.

:::figura[En sen x cos y las flechas del campo son perpendiculares a las curvas de nivel en todas partes y se anulan en los máximos, los mínimos y las sillas, donde el gradiente es cero.]{componente="SurfaceViz"}
```yaml
modo: gradiente
campos: [ondas]
punto: [0.5, 0.5]
```
:::

## Errores comunes

- **Creer que el gradiente apunta al máximo global.** Apunta al ascenso más rápido en ese lugar. Siguiéndolo se llega a la cima más cercana, que puede ser solo un máximo local.
- **Creer que apunta al centro de las curvas.** En un tazón alargado el gradiente apunta hacia la pendiente más fuerte, que en general no pasa por el mínimo.
- **Confundir el gradiente con la gráfica.** El gradiente es un vector en el plano de las entradas, no una flecha sobre la superficie.
- **Olvidar el signo en el descenso.** Para minimizar se resta el gradiente; sumarlo hace subir la función.

:::figura[Seguir el gradiente lleva a la colina más cercana, no a la más alta: desde (-1.2, 1) el camino de ascenso termina en la colina baja, de altura 1, aunque a la derecha hay otra de altura 2.]{componente="SurfaceViz"}
```yaml
modo: gradiente
campos: [dos-colinas]
punto: [-1.2, 1]
```
:::

## Conexiones

Reúne las [[derivadas-parciales]] en un vector como los de [[vectores-y-operaciones-con-vectores]]. Su [[producto-punto]] con una dirección da la [[derivada-direccional]], y es perpendicular a las [[curvas-de-nivel]]. Se anula en los [[puntos-criticos-y-puntos-silla]], su derivada es la [[matriz-hessiana]] y define el [[plano-tangente-y-aproximacion-lineal|plano tangente]]. En [[calculo-matricial]] se obtienen gradientes de funciones de vectores sin pasar por coordenadas.

## Formulario

:::formula[Gradiente]
$$
\nabla f(\mathbf{x}) = \left(\frac{\partial f}{\partial x_1}(\mathbf{x}), \dots, \frac{\partial f}{\partial x_n}(\mathbf{x})\right)^\top
$$

- $f$: función de $n$ variables.
- $\mathbf{x}$: punto de evaluación.
- $\frac{\partial f}{\partial x_i}$: derivada parcial respecto a $x_i$.
- $^\top$: transpuesta; el gradiente se escribe como vector columna.
:::

:::formula[Dirección y rapidez de máximo crecimiento]
$$
\mathbf{u}^* = \frac{\nabla f(\mathbf{x})}{\lVert \nabla f(\mathbf{x}) \rVert}, \qquad \max_{\lVert \mathbf{u} \rVert = 1} D_{\mathbf{u}} f(\mathbf{x}) = \lVert \nabla f(\mathbf{x}) \rVert
$$

- $\mathbf{u}^*$: dirección unitaria de crecimiento más rápido.
- $D_{\mathbf{u}} f$: derivada direccional en la dirección $\mathbf{u}$.
- $\lVert \cdot \rVert$: norma euclidiana.
:::

:::formula[Descenso por gradiente]
$$
\mathbf{x}_{k+1} = \mathbf{x}_k - \eta\,\nabla f(\mathbf{x}_k)
$$

- $\mathbf{x}_k$: punto en la iteración $k$.
- $\eta$: tasa de aprendizaje, un número positivo pequeño.
:::

:::formula[Gradientes conocidos]
$$
\nabla(\mathbf{a}^\top \mathbf{x}) = \mathbf{a}, \qquad \nabla \lVert \mathbf{x} \rVert^2 = 2\mathbf{x}
$$

- $\mathbf{a}$: vector constante.
- $\mathbf{x}$: variable vectorial.
:::

:::formula[Gradiente del ejemplo]
$$
T = 2x^2 + 2xy + y^2, \qquad \nabla T = (4x + 2y,\ 2x + 2y)
$$

- $T$: temperatura sobre el ambiente; $x, y$: posición en centímetros.
:::
