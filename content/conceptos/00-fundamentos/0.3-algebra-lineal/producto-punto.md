---
id: producto-punto
titulo: Producto punto
titulo_en: Dot product
alias:
  - producto escalar
  - producto interno
  - inner product
modulo: 0
submodulo: '0.3'
orden: 7
nivel: basico
prerrequisitos:
  - vectores-y-operaciones-con-vectores
etiquetas:
  - producto punto
  - ángulo
  - proyección
  - producto interno
resumen: >
  El producto punto multiplica componente a componente y suma; mide cuánto apunta un vector en la
  dirección de otro y es positivo con ángulo agudo, cero con ángulo recto y negativo con ángulo obtuso.
formula: '\mathbf{u} \cdot \mathbf{v} = \sum_{i=1}^{n} u_i v_i = \lVert \mathbf{u} \rVert \, \lVert \mathbf{v} \rVert \cos\theta'
visualizacion:
  componente: VectorPlane
  parametros:
    modo: producto-punto
    u: [4, 1]
    v: [1, 3]
referencias:
  - clave: strang
  - clave: goodfellow
    capitulo: '2'
publicado: true
---

## Intuición

Al empujar un carrito con una fuerza inclinada, solo la parte de la fuerza que apunta en la dirección del movimiento hace avanzar el carrito; la parte perpendicular se desperdicia empujando contra el piso. El producto punto mide exactamente eso: toma un vector, se queda con la sombra que proyecta sobre la dirección del otro y multiplica esa sombra por la longitud del otro.

Si los dos vectores apuntan hacia el mismo lado, la sombra es positiva y el producto también. Si forman un ángulo recto, no hay sombra y el producto es cero. Si apuntan hacia lados opuestos, la sombra cae hacia atrás y el producto es negativo. Lo sorprendente es que esa cantidad geométrica se calcula sin medir ángulos: basta multiplicar las componentes correspondientes y sumar. Por eso el producto punto es la herramienta básica para medir ángulos, longitudes, proyecciones y similitud entre vectores de cualquier dimensión.

## Definición

:::definicion[Producto punto]
Para $\mathbf{u}, \mathbf{v} \in \mathbb{R}^n$, el **producto punto** es el número
$$
\mathbf{u} \cdot \mathbf{v} = \mathbf{u}^\top\mathbf{v} = u_1 v_1 + u_2 v_2 + \dots + u_n v_n.
$$
:::

:::teorema[Forma geométrica]
Si $\theta \in [0, \pi]$ es el ángulo entre $\mathbf{u}$ y $\mathbf{v}$, entonces
$$
\mathbf{u} \cdot \mathbf{v} = \lVert \mathbf{u} \rVert \, \lVert \mathbf{v} \rVert \cos\theta.
$$
:::

La longitud de un vector se obtiene del producto consigo mismo: $\lVert \mathbf{u} \rVert = \sqrt{\mathbf{u} \cdot \mathbf{u}}$.

:::nota[Qué significa cada símbolo]
- $\mathbf{u}, \mathbf{v}$: vectores de $\mathbb{R}^n$ con el mismo número de componentes.
- $u_i, v_i$: componentes $i$ de cada vector.
- $n$: número de componentes.
- $\mathbf{u}^\top\mathbf{v}$: la misma operación escrita como fila por columna.
- $\lVert \mathbf{u} \rVert$: longitud euclidiana de $\mathbf{u}$.
- $\theta$: ángulo entre los vectores, entre 0 y $\pi$ radianes.
- $\cos\theta$: coseno de ese ángulo.
:::

## Cómo usar la visualización

Las puntas de $\mathbf{u}$ y $\mathbf{v}$ se arrastran. El segmento sobre la recta de $\mathbf{u}$ es la sombra de $\mathbf{v}$, y la línea punteada baja perpendicularmente desde la punta de $\mathbf{v}$. La reproducción hace girar $\mathbf{v}$ alrededor del origen; el panel muestra el producto, su forma geométrica, el ángulo y el tipo de ángulo.

Durante el giro, el producto pasa de positivo a cero exactamente cuando $\mathbf{v}$ queda perpendicular a $\mathbf{u}$, y luego a negativo. Al alargar $\mathbf{u}$ al doble, el producto se duplica aunque el ángulo no cambie. Con $\mathbf{v}$ sobre la misma recta que $\mathbf{u}$, el producto es el producto de las longitudes, con signo.

## Ejemplo

Una grúa arrastra una caja con una fuerza $\mathbf{F} = (3, 1)$ newtons mientras la caja se desplaza $\mathbf{d} = (2, 2)$ metros. El trabajo realizado es $\mathbf{F} \cdot \mathbf{d}$.

1. Producto componente a componente: $3 \cdot 2 + 1 \cdot 2 = 6 + 2 = 8$ joules.
2. Longitudes: $\lVert \mathbf{F} \rVert = \sqrt{10} \approx 3.162$ y $\lVert \mathbf{d} \rVert = \sqrt{8} \approx 2.828$.
3. Coseno del ángulo: $\cos\theta = 8 / (3.162 \cdot 2.828) = 8/\sqrt{80} \approx 0.894$, así que $\theta \approx 26.6$ grados.
4. La componente útil de la fuerza, su sombra sobre la dirección del movimiento, mide $8 / \sqrt{8} \approx 2.83$ newtons; el resto empuja de lado.

:::figura[La fuerza y el desplazamiento del ejemplo. La sombra de la fuerza sobre la dirección del desplazamiento es la parte que produce trabajo.]{componente="VectorPlane"}
```yaml
modo: producto-punto
u: [2, 2]
v: [3, 1]
```
:::

## Propiedades

- **Simetría:** $\mathbf{u} \cdot \mathbf{v} = \mathbf{v} \cdot \mathbf{u}$.
- **Linealidad:** $(a\mathbf{u} + b\mathbf{w}) \cdot \mathbf{v} = a\,\mathbf{u} \cdot \mathbf{v} + b\,\mathbf{w} \cdot \mathbf{v}$.
- **Positividad:** $\mathbf{u} \cdot \mathbf{u} = \lVert \mathbf{u} \rVert^2 \ge 0$, con igualdad solo si $\mathbf{u} = \mathbf{0}$.
- **Signo y ángulo:** el producto es positivo con ángulo agudo, cero con ángulo recto y negativo con ángulo obtuso.
- **Desigualdad de Cauchy-Schwarz:** $|\mathbf{u} \cdot \mathbf{v}| \le \lVert \mathbf{u} \rVert \, \lVert \mathbf{v} \rVert$, con igualdad solo si los vectores son paralelos.
- **Sombra:** la longitud con signo de la sombra de $\mathbf{v}$ sobre la dirección de $\mathbf{u}$ es $\mathbf{u} \cdot \mathbf{v} / \lVert \mathbf{u} \rVert$.

:::figura[Caso de ángulo recto: (2, 1) y (-1, 2) son perpendiculares y su producto es 2 · (-1) + 1 · 2 = 0. La sombra de uno sobre el otro se reduce a un punto.]{componente="VectorPlane"}
```yaml
modo: producto-punto
u: [2, 1]
v: [-1, 2]
```
:::

:::figura[Caso de ángulo obtuso: (3, 1) y (-2, 1) forman un ángulo de más de 90 grados, la sombra cae hacia atrás y el producto es -5.]{componente="VectorPlane"}
```yaml
modo: producto-punto
u: [3, 1]
v: [-2, 1]
```
:::

:::demostracion
Forma geométrica: por la ley de los cosenos en el triángulo de lados $\mathbf{u}$, $\mathbf{v}$ y $\mathbf{u} - \mathbf{v}$, $\lVert \mathbf{u} - \mathbf{v} \rVert^2 = \lVert \mathbf{u} \rVert^2 + \lVert \mathbf{v} \rVert^2 - 2\lVert \mathbf{u} \rVert\lVert \mathbf{v} \rVert\cos\theta$. Desarrollando el lado izquierdo con la linealidad, $\lVert \mathbf{u} - \mathbf{v} \rVert^2 = \lVert \mathbf{u} \rVert^2 - 2\,\mathbf{u} \cdot \mathbf{v} + \lVert \mathbf{v} \rVert^2$. Igualando se obtiene $\mathbf{u} \cdot \mathbf{v} = \lVert \mathbf{u} \rVert\lVert \mathbf{v} \rVert\cos\theta$.
:::

## Errores comunes

- **Esperar un vector como resultado.** El producto punto da un número; multiplicar componente a componente sin sumar es otra operación (el producto de Hadamard).
- **Leer un producto grande como ángulo pequeño.** El producto también crece con las longitudes; para comparar direcciones se divide entre ellas, lo que da el coseno.
- **Aplicarlo a vectores de distinto tamaño.** Solo está definido si tienen el mismo número de componentes.
- **Confundir producto cero con vector cero.** Dos vectores no nulos pueden tener producto cero: son perpendiculares.

## Conexiones

El producto punto usa las operaciones de [[vectores-y-operaciones-con-vectores]] y da origen a las [[normas-vectoriales|normas]], la [[similitud-coseno]], la [[ortogonalidad-y-ortonormalidad|ortogonalidad]] y la [[proyeccion-ortogonal]]. Cada entrada del producto de matrices es un producto punto entre una fila y una columna, como se ve en [[matrices-y-operaciones-con-matrices]]. En estadística, la covarianza muestral de dos variables centradas es su producto punto dividido entre $n - 1$.

## Formulario

:::formula[Producto punto]
$$
\mathbf{u} \cdot \mathbf{v} = \sum_{i=1}^{n} u_i v_i
$$

- $u_i, v_i$: componentes de los vectores.
- $n$: número de componentes.
:::

:::formula[Forma geométrica]
$$
\mathbf{u} \cdot \mathbf{v} = \lVert \mathbf{u} \rVert\,\lVert \mathbf{v} \rVert\cos\theta, \qquad \theta = \arccos\frac{\mathbf{u} \cdot \mathbf{v}}{\lVert \mathbf{u} \rVert\,\lVert \mathbf{v} \rVert}
$$

- $\lVert \cdot \rVert$: longitud euclidiana.
- $\theta$: ángulo entre los vectores.
:::

:::formula[Longitud]
$$
\lVert \mathbf{u} \rVert = \sqrt{\mathbf{u} \cdot \mathbf{u}} = \sqrt{u_1^2 + \dots + u_n^2}
$$

- $u_i$: componentes de $\mathbf{u}$.
:::

:::formula[Cauchy-Schwarz]
$$
|\mathbf{u} \cdot \mathbf{v}| \le \lVert \mathbf{u} \rVert\,\lVert \mathbf{v} \rVert
$$

- $|\cdot|$: valor absoluto del producto.
:::
