---
id: regla-de-la-cadena-multivariable
titulo: Regla de la cadena multivariable
titulo_en: Multivariable chain rule
alias:
  - regla de la cadena en varias variables
  - derivada de una composición de funciones vectoriales
modulo: 0
submodulo: '0.5'
orden: 9
nivel: intermedio
prerrequisitos:
  - regla-de-la-cadena
  - matriz-jacobiana
etiquetas:
  - regla de la cadena
  - trayectorias
  - jacobiana
  - retropropagación
resumen: >
  La derivada de f a lo largo de una trayectoria r(t) es el producto punto del gradiente con la velocidad;
  en general, la jacobiana de una composición es el producto de las jacobianas.
formula: '\frac{d}{dt} f(\mathbf{r}(t)) = \nabla f(\mathbf{r}(t)) \cdot \mathbf{r}''(t), \qquad \mathbf{J}_{F \circ G} = \mathbf{J}_F(G)\,\mathbf{J}_G'
visualizacion:
  componente: SurfaceViz
  parametros:
    modo: trayectoria
    campos: [dos-colinas, paraboloide]
    curvas: [espiral, circulo, recta]
referencias:
  - clave: strang
  - clave: goodfellow
    capitulo: '6.5'
publicado: true
---

## Intuición

Un dron vuela sobre un terreno con una antena; la intensidad de la señal depende de la posición, y la posición depende del tiempo. ¿A qué ritmo cambia la señal que recibe el dron? Depende de dos cosas: de cuánto cambia la señal al moverse en cada dirección, que es el gradiente, y de hacia dónde y qué tan rápido se mueve el dron, que es su velocidad.

La regla de la cadena en varias variables las combina con un producto punto. Si el dron vuela en la dirección en que la señal sube más rápido, la señal crece al máximo; si vuela a lo largo de una curva de nivel, la señal no cambia, aunque el dron vaya muy rápido. Cuando hay muchas variables intermedias, como en las capas de una red neuronal, la misma idea se escribe con matrices: las jacobianas de cada etapa se multiplican. Calcular ese producto de atrás hacia adelante es la retropropagación.

## Definición

:::teorema[Regla de la cadena a lo largo de una trayectoria]
Si $\mathbf{r} : \mathbb{R} \to \mathbb{R}^n$ es derivable en $t$ y $f : \mathbb{R}^n \to \mathbb{R}$ es diferenciable en $\mathbf{r}(t)$, entonces
$$
\frac{d}{dt} f(\mathbf{r}(t)) = \nabla f(\mathbf{r}(t)) \cdot \mathbf{r}'(t) = \sum_{i=1}^{n} \frac{\partial f}{\partial x_i}(\mathbf{r}(t))\,\frac{dx_i}{dt}.
$$
:::

:::teorema[Forma general]
Si $G : \mathbb{R}^p \to \mathbb{R}^n$ es diferenciable en $\mathbf{s}$ y $F : \mathbb{R}^n \to \mathbb{R}^m$ es diferenciable en $G(\mathbf{s})$, entonces
$$
\mathbf{J}_{F \circ G}(\mathbf{s}) = \mathbf{J}_F(G(\mathbf{s}))\,\mathbf{J}_G(\mathbf{s}).
$$
:::

Por ejemplo, si $z = f(x, y)$ con $x = x(s, t)$ y $y = y(s, t)$, entonces $\dfrac{\partial z}{\partial s} = \dfrac{\partial f}{\partial x}\dfrac{\partial x}{\partial s} + \dfrac{\partial f}{\partial y}\dfrac{\partial y}{\partial s}$.

:::nota[Qué significa cada símbolo]
- $\mathbf{r}(t) = (x_1(t), \dots, x_n(t))$: trayectoria, la posición en el instante $t$.
- $\mathbf{r}'(t)$: velocidad, vector de derivadas $dx_i/dt$.
- $f(\mathbf{r}(t))$: valor de $f$ a lo largo de la trayectoria.
- $\nabla f(\mathbf{r}(t))$: gradiente de $f$ en la posición actual.
- $\cdot$: producto punto.
- $G$, $F$: funciones compuestas, primero $G$ y luego $F$.
- $\mathbf{J}_F$, $\mathbf{J}_G$: sus jacobianas; $\mathbf{s}$ es el punto de entrada de $G$.
- $z = f(x, y)$, $x(s, t)$, $y(s, t)$: variables intermedias que dependen de $s$ y $t$.
:::

## Cómo usar la visualización

A la izquierda, el mapa de curvas de nivel de $f$ y una trayectoria amarilla; un punto la recorre y lleva dos flechas: el gradiente en naranja y la velocidad en verde. A la derecha, el valor de $f$ a lo largo de la trayectoria con su recta tangente. El encabezado escribe el producto punto del gradiente con la velocidad, que es la pendiente de esa recta. Los selectores cambian la función y la trayectoria.

Con el tazón y el círculo, la trayectoria es una curva de nivel: la velocidad es perpendicular al gradiente y la derivada vale 0 en todo momento. Con la espiral sobre dos colinas, la derivada cambia de signo cada vez que el punto pasa de subir una ladera a bajarla.

## Ejemplo

Un dron vuela en línea recta con posición $\mathbf{r}(t) = (t,\ 0.5t - 0.3)$ kilómetros, con $t$ en minutos. La atenuación de la señal crece con el cuadrado de la distancia a una antena en el origen: $f(x, y) = x^2 + y^2$. Se busca el ritmo de cambio en $t = 1$.

1. Posición: $\mathbf{r}(1) = (1, 0.2)$. Velocidad: $\mathbf{r}'(t) = (1, 0.5)$.
2. Gradiente: $\nabla f = (2x, 2y)$, y en la posición, $(2, 0.4)$.
3. Regla de la cadena: $\dfrac{d}{dt} f(\mathbf{r}(t)) = (2)(1) + (0.4)(0.5) = 2.2$ unidades por minuto.
4. Comprobación directa: $f(\mathbf{r}(t)) = t^2 + (0.5t - 0.3)^2 = 1.25t^2 - 0.3t + 0.09$, cuya derivada es $2.5t - 0.3$, que en $t = 1$ vale $2.2$.
5. La atenuación es mínima cuando la derivada se anula: $2.5t - 0.3 = 0$, $t = 0.12$ minutos, el instante de mayor acercamiento a la antena.

:::figura[El dron del ejemplo sobre f = x² + y²: al pasar por t = 1, en (1, 0.2), el gradiente (2, 0.4) y la velocidad (1, 0.5) dan un producto punto de 2.2, la pendiente de la curva de la derecha; la pendiente se anula en t = 0.12, el punto más cercano a la antena.]{componente="SurfaceViz"}
```yaml
modo: trayectoria
campos: [paraboloide]
curvas: [recta]
```
:::

## Propiedades

- **Curvas de nivel:** si $\mathbf{r}(t)$ se mueve sobre una curva de nivel de $f$, $\nabla f \cdot \mathbf{r}' = 0$; por eso el gradiente es perpendicular a ellas.
- **Derivada direccional:** con $\mathbf{r}(t) = \mathbf{x} + t\mathbf{u}$ se recupera $D_{\mathbf{u}} f = \nabla f \cdot \mathbf{u}$.
- **Rapidez:** al recorrer la misma curva el doble de rápido, la derivada de $f(\mathbf{r}(t))$ se duplica.
- **Retropropagación:** en $f_L \circ \dots \circ f_1$ el gradiente respecto a la entrada es $\mathbf{J}_{f_1}^\top \cdots \mathbf{J}_{f_L}^\top$ aplicado al gradiente final; calcularlo de la última capa a la primera reutiliza productos.

:::figura[Caso de una curva de nivel: en el tazón x² + y² el círculo de radio 1.2 es una curva de nivel, la velocidad es siempre perpendicular al gradiente y f(r(t)) se queda constante en 1.44.]{componente="SurfaceViz"}
```yaml
modo: trayectoria
campos: [paraboloide]
curvas: [circulo]
```
:::

## Errores comunes

- **Olvidar un término de la suma.** Si $x$ y $y$ dependen de $t$, hay que sumar las contribuciones de ambas: $f_x\,x' + f_y\,y'$, no solo $f_x\,x'$.
- **Evaluar el gradiente en el punto equivocado.** El gradiente se evalúa en la posición actual $\mathbf{r}(t)$, no en el origen ni en el punto inicial.
- **Invertir el orden de las jacobianas.** $\mathbf{J}_{F \circ G} = \mathbf{J}_F\,\mathbf{J}_G$ con $\mathbf{J}_F$ evaluada en $G(\mathbf{s})$; en general $\mathbf{J}_G\,\mathbf{J}_F$ ni siquiera tiene las dimensiones correctas.
- **Confundir derivada total y parcial.** $\dfrac{dz}{dt}$ incluye todos los caminos por los que $t$ afecta a $z$; $\dfrac{\partial z}{\partial t}$ mantiene fijas las otras variables.

:::figura[Sobre las dos colinas, la espiral cruza laderas en distintas direcciones: la derivada de f(r(t)) es la suma de los dos términos del producto punto, y al omitir uno se perdería, por ejemplo, la subida que viene solo del movimiento en y.]{componente="SurfaceViz"}
```yaml
modo: trayectoria
campos: [dos-colinas]
curvas: [espiral]
```
:::

## Conexiones

Extiende la [[regla-de-la-cadena]] de una variable usando el [[gradiente]] y la [[matriz-jacobiana]]. Contiene la [[derivada-direccional]] como caso particular y explica por qué el gradiente es perpendicular a las [[curvas-de-nivel]]. En [[cambio-de-variables-y-determinante-jacobiano]] las jacobianas compuestas multiplican sus determinantes. En aprendizaje profundo la retropropagación es la aplicación sistemática de esta regla.

## Formulario

:::formula[Derivada a lo largo de una trayectoria]
$$
\frac{d}{dt} f(\mathbf{r}(t)) = \nabla f(\mathbf{r}(t)) \cdot \mathbf{r}'(t)
$$

- $\mathbf{r}(t)$: trayectoria; $\mathbf{r}'(t)$: velocidad.
- $\nabla f(\mathbf{r}(t))$: gradiente en la posición actual.
:::

:::formula[Forma con coordenadas]
$$
\frac{dz}{dt} = \frac{\partial f}{\partial x}\frac{dx}{dt} + \frac{\partial f}{\partial y}\frac{dy}{dt}
$$

- $z = f(x, y)$; $x(t)$, $y(t)$: coordenadas que dependen de $t$.
:::

:::formula[Forma general con jacobianas]
$$
\mathbf{J}_{F \circ G}(\mathbf{s}) = \mathbf{J}_F(G(\mathbf{s}))\,\mathbf{J}_G(\mathbf{s})
$$

- $G : \mathbb{R}^p \to \mathbb{R}^n$, $F : \mathbb{R}^n \to \mathbb{R}^m$.
- $\mathbf{s}$: punto de entrada de $G$.
:::

:::formula[Derivadas parciales de una composición]
$$
\frac{\partial z}{\partial s} = \frac{\partial f}{\partial x}\frac{\partial x}{\partial s} + \frac{\partial f}{\partial y}\frac{\partial y}{\partial s}
$$

- $x(s, t)$, $y(s, t)$: variables intermedias.
- $s$: variable respecto a la que se deriva, con $t$ fija.
:::
