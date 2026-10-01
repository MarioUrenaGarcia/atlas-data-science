---
id: funciones-de-varias-variables
titulo: Funciones de varias variables
titulo_en: Functions of several variables
alias:
  - función multivariable
  - campo escalar
  - función de dos variables
modulo: 0
submodulo: '0.5'
orden: 1
nivel: intermedio
prerrequisitos:
  - funciones-reales-y-sus-graficas
  - vectores-y-operaciones-con-vectores
etiquetas:
  - superficie
  - campo escalar
  - dominio
  - gráfica
resumen: >
  Una función de varias variables asigna un número a cada punto de un dominio en R^n; con dos variables su
  gráfica es una superficie z = f(x, y) sobre el plano.
formula: 'f : D \subseteq \mathbb{R}^n \to \mathbb{R}, \qquad \mathbf{x} = (x_1, \dots, x_n) \mapsto f(\mathbf{x})'
visualizacion:
  componente: SurfaceViz
  parametros:
    modo: superficie
    campos: [dos-colinas, paraboloide, silla, ondas]
referencias:
  - clave: strang
  - clave: boyd
publicado: true
---

## Intuición

La altura de un terreno depende de dos datos: cuánto se avanza hacia el este y cuánto hacia el norte. La temperatura de una placa metálica depende de la posición en la placa; el precio de una casa depende de su superficie, su antigüedad y su ubicación. En todos estos casos una sola cantidad depende de varias entradas a la vez.

Una función de varias variables formaliza esa dependencia: recibe un punto, es decir, una lista de números, y devuelve un número. Con dos entradas se puede dibujar como un paisaje: sobre cada punto $(x, y)$ del suelo se levanta una altura $f(x, y)$, y el conjunto de todas esas alturas forma una superficie. Con tres o más entradas ya no hay dibujo completo, pero las ideas son las mismas, y por eso conviene entenderlas primero en el caso de dos variables, donde todo se ve. En ciencia de datos casi todo es de este tipo: la pérdida de un modelo depende de todos sus parámetros y una densidad conjunta depende de varias variables.

## Definición

:::definicion[Función de varias variables]
Una **función real de $n$ variables** es una regla $f : D \to \mathbb{R}$ que asigna a cada punto $\mathbf{x} = (x_1, \dots, x_n)$ de un conjunto $D \subseteq \mathbb{R}^n$, su **dominio**, un único número $f(\mathbf{x})$. Su **imagen** es $f(D) = \{f(\mathbf{x}) : \mathbf{x} \in D\}$.
:::

Para $n = 2$ se escribe $z = f(x, y)$. Su **gráfica** es la superficie
$$
\{(x, y, f(x, y)) : (x, y) \in D\} \subseteq \mathbb{R}^3,
$$
y el número $f(x, y)$ es la altura de la superficie sobre el punto $(x, y)$. Para $n = 3$ la gráfica vive en $\mathbb{R}^4$ y se estudia por sus cortes y sus conjuntos de nivel.

:::nota[Qué significa cada símbolo]
- $f$: la función; $f(\mathbf{x})$ es el valor que asigna al punto $\mathbf{x}$.
- $n$: número de variables de entrada.
- $\mathbf{x} = (x_1, \dots, x_n)$: punto de entrada, un vector de $\mathbb{R}^n$; $x_i$ es su coordenada $i$.
- $D$: dominio, el conjunto de puntos donde $f$ está definida.
- $\mathbb{R}^n$: espacio de las listas de $n$ números reales.
- $f(D)$: imagen, el conjunto de valores que toma $f$.
- $(x, y, f(x, y))$: punto de la gráfica cuando $n = 2$; $z = f(x, y)$ es la altura.
:::

## Cómo usar la visualización

La escena dibuja la superficie $z = f(x, y)$ sobre un cuadrado del plano, con el color más intenso donde la función es más alta. El selector cambia la función: dos colinas, un tazón, una silla y un patrón de ondas. Los controles de giro y de inclinación mueven la cámara, y la reproducción hace girar la escena para ver la superficie desde todos los lados.

Con el tazón $x^2 + y^2$ se observa un único punto más bajo en el origen. Con la silla $x^2 - y^2$, la superficie sube en la dirección de $x$ y baja en la de $y$: el mismo punto parece un mínimo visto de frente y un máximo visto de lado. Con dos colinas se distinguen una cima alta y otra baja, separadas por un collado.

## Ejemplo

Una chimenea en el origen emite un contaminante. La concentración relativa a nivel del suelo, en un día sin viento, se modela como $C(x, y) = e^{-(x^2 + y^2)}$, con $x$ y $y$ en kilómetros.

1. En la chimenea: $C(0, 0) = e^{0} = 1$, la concentración máxima.
2. A 1 km al este: $C(1, 0) = e^{-1} = 0.3679$.
3. En $(1, 1)$, a $\sqrt{2} = 1.414$ km: $C(1, 1) = e^{-2} = 0.1353$.
4. En $(0.5, 0.5)$: $C = e^{-0.5} = 0.6065$.
5. Los puntos $(1, 0)$, $(0, 1)$ y $(0.6, 0.8)$ están todos a 1 km y dan el mismo valor $0.3679$: la concentración solo depende de la distancia a la chimenea.
6. Dominio $D = \mathbb{R}^2$ e imagen $(0, 1]$: el valor nunca llega a 0, pero se acerca tanto como se quiera al alejarse.

:::figura[La concentración del ejemplo como superficie: una campana con su cima en la chimenea, de altura 1, que baja igual en todas las direcciones; a 1 km de distancia la altura ya es 0.37.]{componente="SurfaceViz"}
```yaml
modo: superficie
campos: [gaussiana]
```
:::

## Propiedades

- **Funciones lineales y afines:** $f(x, y) = ax + by + c$ tiene por gráfica un plano; $a$ y $b$ son sus inclinaciones en cada eje.
- **Formas cuadráticas:** $f(\mathbf{x}) = \mathbf{x}^\top \mathbf{A}\mathbf{x}$ da un tazón si $\mathbf{A}$ es definida positiva y una silla si tiene valores propios de ambos signos.
- **Operaciones:** sumas, productos, cocientes (donde el denominador no se anula) y composiciones de funciones de varias variables son funciones de varias variables.
- **Cortes:** fijar todas las variables menos una da una función de una variable, por ejemplo $x \mapsto f(x, y_0)$; esos cortes son la base de las derivadas parciales.
- **Conjuntos de nivel:** $\{\mathbf{x} : f(\mathbf{x}) = c\}$ resume la función sin necesidad de una dimensión extra.

:::figura[Tres formas básicas de superficie: el plano 2x - y + 1, inclinado igual en todas partes; el tazón x² + y², con un mínimo; y la silla x² - y², que sube en una dirección y baja en la otra.]{componente="SurfaceViz"}
```yaml
modo: superficie
campos: [plano, paraboloide, silla]
```
:::

## Errores comunes

- **Pensar que $f(x, y)$ se dibuja como una curva en el plano.** Una curva en el plano tiene una sola variable libre. La gráfica de $f(x, y)$ es una superficie en el espacio; lo que vive en el plano son sus curvas de nivel.
- **Confundir el dominio con la imagen.** El dominio está en $\mathbb{R}^n$, el espacio de las entradas; la imagen es un conjunto de números reales.
- **Tratar el punto como un número.** $f(1, 2)$ evalúa la función en el punto $(1, 2)$, no en 1 ni en 2 por separado, y en general $f(1, 2) \neq f(2, 1)$.
- **Olvidar las restricciones del dominio.** $\log(x - y)$ solo está definida donde $x > y$, un semiplano, no en todo $\mathbb{R}^2$.

:::figura[La misma campana de concentración vista de dos maneras: la superficie ocupa el espacio, y su sombra en el plano es un mapa de curvas de nivel, círculos alrededor de la chimenea. Ninguna de las dos es una curva única.]{componente="SurfaceViz"}
```yaml
modo: curvas
campos: [gaussiana]
```
:::

## Conexiones

Generaliza las [[funciones-reales-y-sus-graficas]] a entradas que son vectores, como los de [[vectores-y-operaciones-con-vectores]]. Sus conjuntos de nivel se estudian en [[curvas-de-nivel]], su cambio en cada dirección en [[derivadas-parciales]] y [[gradiente]], y la acumulación de sus valores sobre una región en [[integrales-dobles-y-triples]]. Las [[formas-cuadraticas]] son el ejemplo más importante: describen localmente a casi cualquier función suave cerca de un mínimo.

## Formulario

:::formula[Función de varias variables]
$$
f : D \subseteq \mathbb{R}^n \to \mathbb{R}, \qquad \mathbf{x} \mapsto f(\mathbf{x})
$$

- $f$: la función.
- $D$: dominio, subconjunto de $\mathbb{R}^n$.
- $\mathbf{x} = (x_1, \dots, x_n)$: punto de entrada.
- $f(\mathbf{x})$: valor real asignado a $\mathbf{x}$.
:::

:::formula[Gráfica de una función de dos variables]
$$
\{(x, y, f(x, y)) : (x, y) \in D\} \subseteq \mathbb{R}^3
$$

- $(x, y)$: punto del dominio en el plano.
- $f(x, y)$: altura de la superficie sobre ese punto.
- $D$: dominio en $\mathbb{R}^2$.
:::

:::formula[Imagen]
$$
f(D) = \{f(\mathbf{x}) : \mathbf{x} \in D\}
$$

- $f(D)$: conjunto de valores que toma la función.
- $D$: dominio.
- $\mathbf{x}$: punto del dominio.
:::

:::formula[Concentración del ejemplo]
$$
C(x, y) = e^{-(x^2 + y^2)}
$$

- $C$: concentración relativa, entre 0 y 1.
- $x, y$: posición en kilómetros respecto a la chimenea.
- $x^2 + y^2$: cuadrado de la distancia a la chimenea.
:::
