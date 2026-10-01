---
id: curvas-de-nivel
titulo: Curvas de nivel
titulo_en: Level curves
alias:
  - conjuntos de nivel
  - isolíneas
  - contornos
modulo: 0
submodulo: '0.5'
orden: 2
nivel: intermedio
prerrequisitos:
  - funciones-de-varias-variables
etiquetas:
  - curvas de nivel
  - contornos
  - mapa topográfico
  - superficie
resumen: >
  La curva de nivel c de f(x, y) es el conjunto de puntos del plano donde f vale c; el conjunto de todas
  ellas es un mapa de la superficie, como las líneas de altitud de un mapa topográfico.
formula: 'L_c = \{(x, y) \in D : f(x, y) = c\}'
visualizacion:
  componente: SurfaceViz
  parametros:
    modo: curvas
    campos: [dos-colinas, eliptico, silla, rosenbrock]
referencias:
  - clave: strang
  - clave: boyd
publicado: true
---

## Intuición

Un mapa topográfico dibuja en papel un terreno montañoso sin necesidad de relieve: une con una línea todos los puntos que están a la misma altitud, por ejemplo cada 100 metros. Quien sabe leerlo reconoce una cima por las líneas cerradas que se van encogiendo, un valle por la forma en que se doblan y una pendiente fuerte porque las líneas se amontonan.

Las curvas de nivel hacen lo mismo con cualquier función de dos variables. Se corta la superficie con un plano horizontal a la altura $c$ y se proyecta el corte al suelo. Repetir el corte con varias alturas da un mapa completo que se dibuja en dos dimensiones. Es la forma habitual de mostrar funciones de pérdida en aprendizaje automático y densidades conjuntas en estadística: los contornos muestran dónde está el mínimo, cuán alargado es el valle y en qué dirección conviene moverse.

## Definición

:::definicion[Conjunto de nivel]
Para $f : D \subseteq \mathbb{R}^n \to \mathbb{R}$ y un número $c$, el **conjunto de nivel** $c$ es
$$
L_c = \{\mathbf{x} \in D : f(\mathbf{x}) = c\}.
$$
Si $n = 2$ se llama **curva de nivel**; si $n = 3$, **superficie de nivel**.
:::

La curva $L_c$ es la proyección sobre el plano $xy$ de la intersección de la gráfica $z = f(x, y)$ con el plano horizontal $z = c$. Un **mapa de contornos** dibuja varias curvas $L_{c_1}, L_{c_2}, \dots$ con alturas igualmente espaciadas. Puede ocurrir que $L_c$ sea vacío, un punto aislado o una curva que se cruza consigo misma.

:::nota[Qué significa cada símbolo]
- $f$: función de varias variables.
- $D$: dominio de $f$.
- $c$: valor fijo, la altura del corte.
- $L_c$: conjunto de nivel $c$, los puntos donde $f$ vale exactamente $c$.
- $\mathbf{x}$: punto de $\mathbb{R}^n$.
- $z = c$: plano horizontal a la altura $c$.
:::

## Cómo usar la visualización

A la izquierda se ve la superficie y un plano horizontal que sube por todas las alturas; a la derecha, el mapa de contornos, donde la curva del nivel actual se resalta. El sombreado del mapa es más intenso donde la función es más alta. El selector cambia la función.

Con las dos colinas se ve cómo la curva del plano que sube se parte en dos óvalos, uno por cima, y cómo los óvalos se encogen hasta desaparecer en cada pico. Con el valle de Rosenbrock las curvas son largas y curvas, señal de un fondo casi plano y difícil de recorrer. Con la silla, la curva de nivel 0 son dos rectas que se cruzan.

## Ejemplo

El fondo de un estanque tiene profundidad $h(x, y) = x^2 + 3y^2$ metros bajo un nivel de referencia, con $x$ y $y$ en metros desde el centro. Se busca la curva de nivel $c = 3$.

1. La condición es $x^2 + 3y^2 = 3$, que se reescribe $\dfrac{x^2}{3} + \dfrac{y^2}{1} = 1$.
2. Es una elipse con semieje $\sqrt{3} = 1.732$ m sobre el eje $x$ y semieje 1 m sobre el eje $y$.
3. Para $c = 0.75$: $\dfrac{x^2}{0.75} + \dfrac{y^2}{0.25} = 1$, semiejes $0.866$ y $0.5$: la elipse tiene la misma forma, a la mitad de tamaño.
4. En general los semiejes son $\sqrt{c}$ y $\sqrt{c/3}$: todas las curvas son elipses semejantes, $\sqrt{3}$ veces más largas en $x$ que en $y$.
5. Como $h$ crece tres veces más rápido en la dirección de $y$, las curvas están más juntas sobre el eje $y$: el fondo es más empinado en esa dirección.

:::figura[El fondo del estanque del ejemplo, h = x² + 3y²: el plano horizontal sube y las curvas de nivel son elipses semejantes, alargadas en x y más apretadas en y, donde el fondo es más empinado.]{componente="SurfaceViz"}
```yaml
modo: curvas
campos: [eliptico]
```
:::

## Propiedades

- **No se cruzan:** dos curvas de nivel distintas no comparten puntos, porque en cada punto $f$ tiene un solo valor.
- **Separación y pendiente:** con niveles igualmente espaciados, curvas juntas indican cambio rápido y curvas separadas indican una zona casi plana.
- **Perpendicularidad:** el gradiente en un punto es perpendicular a la curva de nivel que pasa por él.
- **Extremos y sillas:** alrededor de un mínimo o un máximo local las curvas son óvalos que se encogen hacia el punto; en un punto silla la curva de su nivel se cruza consigo misma.
- **Contornos de densidades:** en una normal bivariada las curvas de nivel son elipses cuyos ejes son los vectores propios de la matriz de covarianza.

:::figura[Caso de un punto silla: en x² - y² las curvas de nivel positivas se abren hacia los lados, las negativas hacia arriba y abajo, y la curva de nivel 0 son las dos diagonales y = x y y = -x, que se cruzan en el origen.]{componente="SurfaceViz"}
```yaml
modo: curvas
campos: [silla]
```
:::

## Errores comunes

- **Leer curvas juntas como valores altos.** La cercanía de las curvas indica pendiente, no altura. Una cima ancha y suave tiene curvas separadas aunque sea el punto más alto del mapa.
- **Olvidar que los niveles importan.** Si los niveles no están igualmente espaciados, la separación entre curvas ya no se puede comparar entre zonas del mapa.
- **Suponer que una curva de nivel siempre es una sola curva cerrada.** Puede tener varios pedazos, como alrededor de dos colinas, o reducirse a un punto en un extremo.
- **Confundir la curva de nivel con la gráfica.** La curva vive en el plano de las entradas; la gráfica es la superficie en el espacio.

:::figura[Las dos colinas tienen alturas distintas, pero las curvas más apretadas están en las laderas, no en las cimas: la cercanía de las curvas mide la pendiente. La curva del nivel actual se parte en dos pedazos cuando el plano pasa por encima del collado.]{componente="SurfaceViz"}
```yaml
modo: curvas
campos: [dos-colinas]
```
:::

## Conexiones

Las curvas de nivel resumen una [[funciones-de-varias-variables|función de varias variables]] en el plano. El [[gradiente]] es perpendicular a ellas y la [[derivada-direccional]] se anula a lo largo de ellas. Los [[puntos-criticos-y-puntos-silla]] se reconocen por su forma, y los [[multiplicadores-de-lagrange]] se basan en la tangencia entre una curva de nivel y una restricción. En una [[formas-cuadraticas|forma cuadrática]] definida positiva todas las curvas son elipses.

## Formulario

:::formula[Conjunto de nivel]
$$
L_c = \{\mathbf{x} \in D : f(\mathbf{x}) = c\}
$$

- $L_c$: conjunto de nivel $c$.
- $f$: función; $D$: su dominio.
- $\mathbf{x}$: punto del dominio.
- $c$: valor fijo del nivel.
:::

:::formula[Curvas de nivel del ejemplo]
$$
x^2 + 3y^2 = c \iff \frac{x^2}{c} + \frac{y^2}{c/3} = 1
$$

- $x, y$: posición en metros.
- $c$: profundidad del nivel, $c > 0$.
- $\sqrt{c}$, $\sqrt{c/3}$: semiejes de la elipse en $x$ y en $y$.
:::
