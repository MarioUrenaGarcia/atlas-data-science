---
id: ortogonalidad-y-ortonormalidad
titulo: Ortogonalidad y ortonormalidad
titulo_en: Orthogonality and orthonormality
alias:
  - vectores ortogonales
  - vectores perpendiculares
  - base ortonormal
  - conjunto ortonormal
modulo: 0
submodulo: '0.3'
orden: 11
nivel: basico
prerrequisitos:
  - normas-vectoriales
  - base-y-dimension
etiquetas:
  - ortogonalidad
  - base ortonormal
  - perpendicularidad
  - coordenadas
resumen: >
  Dos vectores son ortogonales si su producto punto es cero; un conjunto es ortonormal si sus vectores
  son ortogonales entre sí y de longitud 1, y en una base así cada coordenada es un producto punto.
formula: '\mathbf{q}_i \cdot \mathbf{q}_j = \begin{cases} 1 & i = j \\ 0 & i \neq j \end{cases}, \qquad c_i = \mathbf{x} \cdot \mathbf{q}_i'
visualizacion:
  componente: VectorPlane
  parametros:
    modo: cambio-base
    b1: [0.6, 0.8]
    b2: [-0.8, 0.6]
    punto: [3, -1]
referencias:
  - clave: strang
  - clave: goodfellow
    capitulo: '2'
publicado: true
---

## Intuición

En un mapa con los ejes norte y este, avanzar hacia el norte no cambia en nada la posición este-oeste: las dos direcciones no se estorban. Esa independencia total es la ortogonalidad. Dos vectores ortogonales forman un ángulo recto, y moverse a lo largo de uno no produce ninguna sombra sobre el otro.

Una base ortonormal es un juego de direcciones perpendiculares entre sí y de longitud 1, como los ejes de un mapa bien dibujado pero posiblemente girados. En una base así, averiguar las coordenadas de un punto es inmediato: basta medir la sombra del punto sobre cada eje con un producto punto, sin resolver ningún sistema de ecuaciones. Además, las longitudes y los ángulos se calculan con las coordenadas como si fuera la base usual. Por eso las bases ortonormales aparecen en las descomposiciones de matrices, en el análisis de componentes principales y en las series de Fourier.

## Definición

:::definicion[Ortogonalidad y ortonormalidad]
Dos vectores $\mathbf{u}, \mathbf{v} \in \mathbb{R}^n$ son **ortogonales**, $\mathbf{u} \perp \mathbf{v}$, si $\mathbf{u} \cdot \mathbf{v} = 0$. Un conjunto $\{\mathbf{q}_1, \dots, \mathbf{q}_k\}$ es **ortogonal** si sus vectores son ortogonales dos a dos, y **ortonormal** si además cada uno tiene norma 1:
$$
\mathbf{q}_i \cdot \mathbf{q}_j = \delta_{ij} = \begin{cases} 1 & i = j, \\ 0 & i \neq j. \end{cases}
$$
:::

:::teorema[Coordenadas en una base ortonormal]
Si $\{\mathbf{q}_1, \dots, \mathbf{q}_n\}$ es una base ortonormal de $\mathbb{R}^n$, entonces para todo $\mathbf{x}$
$$
\mathbf{x} = \sum_{i=1}^{n} (\mathbf{x} \cdot \mathbf{q}_i)\,\mathbf{q}_i, \qquad \lVert \mathbf{x} \rVert^2 = \sum_{i=1}^{n} (\mathbf{x} \cdot \mathbf{q}_i)^2.
$$
:::

:::nota[Qué significa cada símbolo]
- $\mathbf{u}, \mathbf{v}$: vectores de $\mathbb{R}^n$.
- $\perp$: "es ortogonal a".
- $\mathbf{q}_1, \dots, \mathbf{q}_k$: vectores del conjunto.
- $\delta_{ij}$: delta de Kronecker, 1 si $i = j$ y 0 si $i \neq j$.
- $\mathbf{x} \cdot \mathbf{q}_i$: coordenada de $\mathbf{x}$ a lo largo de $\mathbf{q}_i$.
- $\lVert \mathbf{x} \rVert$: norma euclidiana.
- $n$: dimensión del espacio.
:::

## Cómo usar la visualización

La rejilla azul es la de la base $\mathbf{b}_1 = (0.6, 0.8)$, $\mathbf{b}_2 = (-0.8, 0.6)$: la rejilla usual girada, con cuadrados del mismo tamaño porque los vectores son perpendiculares y de longitud 1. La reproducción deforma la rejilla estándar hasta la nueva y dibuja el camino $c_1\mathbf{b}_1 + c_2\mathbf{b}_2$ hasta el punto; los vectores y el punto se arrastran.

Con el punto $(3, -1)$, las coordenadas nuevas son $(1, -3)$, justo los productos punto con cada vector de la base. Al arrastrar $\mathbf{b}_2$ fuera de la perpendicular, la rejilla se vuelve de rombos y las coordenadas ya no coinciden con los productos punto.

## Ejemplo

Una estación meteorológica mide el viento $\mathbf{x} = (2, 1)$ m/s en ejes este y norte. Una pista de aterrizaje está orientada según $\mathbf{q}_1 = (0.6, 0.8)$, y su perpendicular es $\mathbf{q}_2 = (-0.8, 0.6)$.

1. Comprobación de ortonormalidad: $\mathbf{q}_1 \cdot \mathbf{q}_2 = -0.48 + 0.48 = 0$, $\lVert \mathbf{q}_1 \rVert^2 = 0.36 + 0.64 = 1$ y $\lVert \mathbf{q}_2 \rVert^2 = 0.64 + 0.36 = 1$.
2. Viento a lo largo de la pista: $c_1 = \mathbf{x} \cdot \mathbf{q}_1 = 1.2 + 0.8 = 2$ m/s.
3. Viento cruzado: $c_2 = \mathbf{x} \cdot \mathbf{q}_2 = -1.6 + 0.6 = -1$ m/s.
4. Reconstrucción: $2(0.6, 0.8) - 1(-0.8, 0.6) = (1.2 + 0.8, 1.6 - 0.6) = (2, 1)$.
5. Conservación de la longitud: $2^2 + (-1)^2 = 5 = 2^2 + 1^2$.

:::figura[El viento del ejemplo en la base de la pista. La rejilla girada tiene cuadrados iguales y las coordenadas (2, -1) son los productos punto del viento con cada eje.]{componente="VectorPlane"}
```yaml
modo: cambio-base
b1: [0.6, 0.8]
b2: [-0.8, 0.6]
punto: [2, 1]
```
:::

## Propiedades

- **Independencia:** un conjunto ortogonal de vectores no nulos es linealmente independiente.
- **Teorema de Pitágoras:** si $\mathbf{u} \perp \mathbf{v}$, entonces $\lVert \mathbf{u} + \mathbf{v} \rVert^2 = \lVert \mathbf{u} \rVert^2 + \lVert \mathbf{v} \rVert^2$.
- **Normalizar:** si $\mathbf{v} \neq \mathbf{0}$, el vector $\mathbf{v}/\lVert \mathbf{v} \rVert$ tiene norma 1 y la misma dirección.
- **Matrices ortogonales:** si las columnas de $Q$ son ortonormales, $Q^\top Q = I$.
- **Complemento ortogonal:** los vectores ortogonales a todo un subespacio $W$ forman otro subespacio, $W^\perp$, y $\dim W + \dim W^\perp = n$.

:::figura[Caso de dos vectores ortogonales que no son unitarios: (2, 1) y (-1, 2) tienen producto punto 0 pero longitud raíz de 5; al dividir cada uno entre esa longitud se obtiene un par ortonormal.]{componente="VectorPlane"}
```yaml
modo: producto-punto
u: [2, 1]
v: [-1, 2]
```
:::

:::demostracion
Independencia: si $\sum c_i\mathbf{q}_i = \mathbf{0}$, el producto punto con $\mathbf{q}_j$ da $\sum c_i\,\mathbf{q}_i \cdot \mathbf{q}_j = c_j\lVert \mathbf{q}_j \rVert^2 = 0$, y como $\mathbf{q}_j \neq \mathbf{0}$, $c_j = 0$ para todo $j$.
:::

## Errores comunes

- **Confundir ortogonal con ortonormal.** Ortogonal solo pide ángulos rectos; ortonormal pide además longitud 1.
- **Calcular coordenadas con productos punto en una base que no es ortonormal.** En una base cualquiera hay que resolver un sistema; el atajo solo vale con bases ortonormales.
- **Pensar que el vector cero no es ortogonal a nada.** Es ortogonal a todos los vectores, por eso se excluye al hablar de conjuntos ortogonales independientes.
- **Llamar "matriz ortogonal" a una con columnas solo ortogonales.** Las columnas deben ser ortonormales.

## Conexiones

La ortogonalidad se define con el [[producto-punto]] y la normalización con las [[normas-vectoriales]]. Una base ortonormal es una [[base-y-dimension|base]] especialmente cómoda. La [[proyeccion-ortogonal]] separa un vector en una parte dentro de un subespacio y otra ortogonal a él, y el [[proceso-de-gram-schmidt]] convierte cualquier base en una ortonormal. Las matrices con columnas ortonormales son las ortogonales de las [[matrices-especiales]].

## Formulario

:::formula[Ortogonalidad]
$$
\mathbf{u} \perp \mathbf{v} \iff \mathbf{u} \cdot \mathbf{v} = 0
$$

- $\mathbf{u}, \mathbf{v}$: vectores.
:::

:::formula[Conjunto ortonormal]
$$
\mathbf{q}_i \cdot \mathbf{q}_j = \delta_{ij}, \qquad Q^\top Q = I
$$

- $\delta_{ij}$: 1 si $i = j$, 0 en otro caso.
- $Q$: matriz con columnas $\mathbf{q}_i$.
- $I$: matriz identidad.
:::

:::formula[Coordenadas y Parseval]
$$
\mathbf{x} = \sum_i (\mathbf{x} \cdot \mathbf{q}_i)\,\mathbf{q}_i, \qquad \lVert \mathbf{x} \rVert^2 = \sum_i (\mathbf{x} \cdot \mathbf{q}_i)^2
$$

- $\mathbf{x} \cdot \mathbf{q}_i$: coordenada de $\mathbf{x}$ en la dirección $\mathbf{q}_i$.
:::

:::formula[Pitágoras]
$$
\mathbf{u} \perp \mathbf{v} \ \Rightarrow\ \lVert \mathbf{u} + \mathbf{v} \rVert^2 = \lVert \mathbf{u} \rVert^2 + \lVert \mathbf{v} \rVert^2
$$

- $\lVert \cdot \rVert$: norma euclidiana.
:::
