---
id: derivadas-parciales
titulo: Derivadas parciales
titulo_en: Partial derivatives
alias:
  - derivada parcial
  - parciales
modulo: 0
submodulo: '0.5'
orden: 3
nivel: intermedio
prerrequisitos:
  - funciones-de-varias-variables
  - derivada-como-pendiente-y-razon-de-cambio
etiquetas:
  - derivadas parciales
  - pendiente
  - cortes
  - razón de cambio
resumen: >
  La derivada parcial de f respecto a x es la derivada que se obtiene al mover solo x y dejar fijas las
  demás variables: la pendiente del corte de la superficie en esa dirección.
formula: '\frac{\partial f}{\partial x}(x_0, y_0) = \lim_{h \to 0} \frac{f(x_0 + h, y_0) - f(x_0, y_0)}{h}'
visualizacion:
  componente: SurfaceViz
  parametros:
    modo: parciales
    campos: [dos-colinas, ondas, eliptico]
referencias:
  - clave: strang
  - clave: goodfellow
    capitulo: '4'
publicado: true
---

## Intuición

Quien camina por una ladera puede preguntarse cuánto sube si da un paso hacia el este sin moverse hacia el norte, y cuánto si da el paso hacia el norte sin moverse hacia el este. Son dos preguntas distintas con dos respuestas distintas, y cada una se responde con una derivada de una sola variable: se congela una dirección y se mide el cambio en la otra.

Eso es una derivada parcial. Para $f(x, y)$ se fija $y$ en un valor y se obtiene una función ordinaria de $x$; su derivada es la parcial respecto a $x$. Geométricamente es la pendiente de la curva que se forma al cortar la superficie con un plano vertical paralelo al eje $x$. En un modelo con muchos parámetros, la parcial respecto a un parámetro dice cómo cambia el error si solo se ajusta ese parámetro y los demás se dejan quietos: es la pieza básica del entrenamiento por gradiente.

## Definición

:::definicion[Derivada parcial]
Para $f(x, y)$ y un punto $(x_0, y_0)$ de su dominio,
$$
\frac{\partial f}{\partial x}(x_0, y_0) = \lim_{h \to 0} \frac{f(x_0 + h, y_0) - f(x_0, y_0)}{h}, \qquad
\frac{\partial f}{\partial y}(x_0, y_0) = \lim_{h \to 0} \frac{f(x_0, y_0 + h) - f(x_0, y_0)}{h},
$$
cuando los límites existen. Para $f(x_1, \dots, x_n)$, la parcial $\dfrac{\partial f}{\partial x_i}$ se define igual moviendo solo $x_i$.
:::

En la práctica se calcula derivando respecto a una variable con las reglas usuales y tratando las demás como constantes. También se escribe $f_x$ y $f_y$. Las **derivadas parciales de segundo orden** son $f_{xx} = \dfrac{\partial^2 f}{\partial x^2}$, $f_{yy}$ y las cruzadas $f_{xy} = \dfrac{\partial^2 f}{\partial y\,\partial x}$.

:::nota[Qué significa cada símbolo]
- $f(x, y)$: función de dos variables.
- $(x_0, y_0)$: punto donde se mide la pendiente.
- $h$: tamaño del paso en una sola coordenada.
- $\frac{\partial f}{\partial x}$, $f_x$: derivada parcial respecto a $x$, con $y$ fija.
- $\frac{\partial f}{\partial y}$, $f_y$: derivada parcial respecto a $y$, con $x$ fija.
- $x_i$: coordenada $i$ de un punto de $\mathbb{R}^n$.
- $f_{xx}, f_{yy}, f_{xy}$: derivadas parciales de segundo orden; $f_{xy}$ deriva primero respecto a $x$ y luego respecto a $y$.
:::

## Cómo usar la visualización

A la izquierda, la superficie con dos cortes: el naranja mantiene $y = y_0$ y deja variar $x$; el verde mantiene $x = x_0$ y deja variar $y$. A la derecha, cada corte se dibuja como una curva ordinaria con su recta tangente en el punto. Las pendientes de esas tangentes son las dos derivadas parciales, que aparecen en el encabezado y en el panel. Los controles mueven el punto. La reproducción toma un paso $h$ cada vez más pequeño en cada corte y dibuja la secante punteada: su pendiente es el cociente de la definición, que el encabezado compara con la derivada parcial.

Con las dos colinas, si el punto se coloca en la cima la tangente del corte naranja queda horizontal; a un lado y al otro la pendiente cambia de signo. Con las ondas $\operatorname{sen} x \cos y$, en $y_0 = \pi/2$ el corte naranja es plano, y la parcial respecto a $x$ vale 0 para cualquier $x_0$.

## Ejemplo

Un paso de montaña tiene forma de silla: la altura, en cientos de metros, es $f(x, y) = x^2 - y^2$, con $x$ y $y$ también en cientos de metros, $x$ en la dirección del camino que cruza el paso y $y$ en la dirección de la cresta. Se buscan las pendientes en el punto $(1, 0.5)$.

1. Respecto a $x$, con $y$ constante: $\dfrac{\partial f}{\partial x} = 2x$, y en el punto vale $2 \cdot 1 = 2$.
2. Respecto a $y$, con $x$ constante: $\dfrac{\partial f}{\partial y} = -2y$, y en el punto vale $-2 \cdot 0.5 = -1$.
3. Interpretación: un paso corto de 10 m hacia $+x$ sube unos $2 \cdot 0.1 = 0.2$ cientos de metros, es decir, 20 m; uno de 10 m hacia $+y$ baja unos 10 m.
4. Valor en el punto: $f(1, 0.5) = 1 - 0.25 = 0.75$.
5. Segundas parciales: $f_{xx} = 2$, $f_{yy} = -2$ y $f_{xy} = f_{yx} = 0$.

:::figura[El paso de montaña del ejemplo en el punto (1, 0.5): el corte con y fija sube con pendiente 2 y el corte con x fija baja con pendiente -1, las dos derivadas parciales.]{componente="SurfaceViz"}
```yaml
modo: parciales
campos: [silla]
punto: [1, 0.5]
```
:::

## Propiedades

- **Reglas de derivación:** linealidad, producto, cociente y cadena valen igual que en una variable, con las demás variables tratadas como constantes.
- **Teorema de Schwarz (o de Clairaut):** si $f_{xy}$ y $f_{yx}$ son continuas cerca de un punto, ahí son iguales.
- **Existir no basta:** una función puede tener ambas parciales en un punto y no ser continua en él, porque las parciales solo miran dos direcciones.
- **Vector de parciales:** reunidas en un vector forman el [[gradiente]], que da la pendiente en cualquier dirección cuando $f$ es diferenciable.

:::figura[Las parciales dependen del punto: en sen x cos y, en el origen la pendiente en x es 1 y en y es 0. Al mover x₀ con el control, la pendiente del corte en x sigue a cos x₀.]{componente="SurfaceViz"}
```yaml
modo: parciales
campos: [ondas]
punto: [0, 0]
```
:::

## Errores comunes

- **Derivar la otra variable como si cambiara.** En $f(x, y) = xy$, $\dfrac{\partial f}{\partial x} = y$, porque $y$ es una constante al derivar respecto a $x$; no es $y + x\dfrac{dy}{dx}$.
- **Confundir $\partial$ con $d$.** $\dfrac{df}{dx}$ supone que solo hay una variable; $\dfrac{\partial f}{\partial x}$ indica que hay otras y que se mantienen fijas.
- **Creer que dos parciales describen todo el cambio.** Miden solo las dos direcciones de los ejes; para una dirección oblicua hace falta la [[derivada-direccional]].
- **Equivocar el orden en las cruzadas.** La notación $f_{xy}$ deriva primero respecto a $x$; con funciones suaves el orden no importa, pero sin continuidad de las segundas parciales puede importar.

:::figura[En xy, en el punto (1, 2), la pendiente en x es y = 2 y la pendiente en y es x = 1: cada parcial toma como constante la otra coordenada.]{componente="SurfaceViz"}
```yaml
modo: parciales
campos: [producto]
punto: [1, 2]
```
:::

## Conexiones

Extiende la [[derivada-como-pendiente-y-razon-de-cambio]] a [[funciones-de-varias-variables]]. Reunidas en un vector forman el [[gradiente]], y las de segundo orden forman la [[matriz-hessiana]]. Las parciales de varias funciones a la vez forman la [[matriz-jacobiana]]. El [[plano-tangente-y-aproximacion-lineal|plano tangente]] usa exactamente las dos pendientes de los cortes.

## Formulario

:::formula[Derivada parcial respecto a x]
$$
\frac{\partial f}{\partial x}(x_0, y_0) = \lim_{h \to 0} \frac{f(x_0 + h, y_0) - f(x_0, y_0)}{h}
$$

- $f$: función de dos variables.
- $(x_0, y_0)$: punto de evaluación.
- $h$: paso en la dirección de $x$; $y$ queda fija en $y_0$.
:::

:::formula[Derivada parcial respecto a y]
$$
\frac{\partial f}{\partial y}(x_0, y_0) = \lim_{h \to 0} \frac{f(x_0, y_0 + h) - f(x_0, y_0)}{h}
$$

- $h$: paso en la dirección de $y$; $x$ queda fija en $x_0$.
:::

:::formula[Teorema de Schwarz]
$$
\frac{\partial^2 f}{\partial y\,\partial x} = \frac{\partial^2 f}{\partial x\,\partial y}
$$

- Válido cuando ambas segundas parciales cruzadas son continuas.
- $\frac{\partial^2 f}{\partial y\,\partial x}$: derivar respecto a $x$ y luego respecto a $y$.
:::

:::formula[Parciales del ejemplo]
$$
f(x, y) = x^2 - y^2, \qquad f_x = 2x, \qquad f_y = -2y
$$

- $x$: dirección del camino; $y$: dirección de la cresta.
- $f$: altura en cientos de metros.
:::
