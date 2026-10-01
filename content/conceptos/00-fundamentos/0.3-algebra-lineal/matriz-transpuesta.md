---
id: matriz-transpuesta
titulo: Matriz transpuesta
titulo_en: Transpose of a matrix
alias:
  - transpuesta
  - transposición
modulo: 0
submodulo: '0.3'
orden: 16
nivel: basico
prerrequisitos:
  - matrices-y-operaciones-con-matrices
etiquetas:
  - transpuesta
  - filas y columnas
  - matriz simétrica
  - producto punto
resumen: >
  La transpuesta de A intercambia filas por columnas, de modo que la entrada (i, j) pasa a la posición
  (j, i); invierte el orden de los productos y convierte el producto punto en un producto de matrices.
formula: '(A^\top)_{ij} = a_{ji}, \qquad (AB)^\top = B^\top A^\top'
visualizacion:
  componente: MatrixGrid
  parametros:
    modo: transpuesta
    a: [[2, -1, 0], [3, 4, 1]]
    b: [[1, 2], [0, 1], [-1, 3]]
referencias:
  - clave: strang
  - clave: goodfellow
    capitulo: '2'
publicado: true
---

## Intuición

Una tabla con estudiantes en las filas y materias en las columnas se puede reorganizar con las materias en las filas y los estudiantes en las columnas. La información es la misma; solo cambia la orientación. Esa reorganización es la transpuesta: la primera fila se vuelve la primera columna, la segunda fila la segunda columna, y así sucesivamente, como si la tabla se reflejara sobre su diagonal.

La transpuesta aparece por todas partes porque convierte vectores columna en filas y permite escribir el producto punto como un producto de matrices, $\mathbf{u}^\top\mathbf{v}$. También explica por qué ciertas matrices, como las de correlaciones o distancias, son simétricas: la entrada que relaciona la variable $i$ con la $j$ coincide con la que relaciona la $j$ con la $i$, así que la matriz es igual a su transpuesta.

## Definición

:::definicion[Transpuesta]
La **transpuesta** de $A \in \mathbb{R}^{m \times n}$ es la matriz $A^\top \in \mathbb{R}^{n \times m}$ con
$$
(A^\top)_{ij} = a_{ji}.
$$
La fila $i$ de $A$ es la columna $i$ de $A^\top$. Una matriz cuadrada es **simétrica** si $A^\top = A$.
:::

Con vectores columna, $\mathbf{u}^\top$ es un vector fila y $\mathbf{u}^\top\mathbf{v} = \mathbf{u} \cdot \mathbf{v}$.

:::nota[Qué significa cada símbolo]
- $A$: matriz de $m$ filas y $n$ columnas.
- $A^\top$: su transpuesta, de $n$ filas y $m$ columnas.
- $a_{ji}$: entrada de $A$ en la fila $j$ y columna $i$.
- $\mathbf{u}^\top$: el vector $\mathbf{u}$ escrito como fila.
- $m, n$: número de filas y columnas de $A$.
:::

## Cómo usar la visualización

Cada paso toma una entrada de $A$, resaltada, y la coloca en la posición espejo de $A^\top$. Las entradas de la diagonal, marcadas con borde, no cambian de lugar. Al terminar aparecen $(AB)^\top$ y $B^\top A^\top$, y el panel confirma que son iguales.

La matriz $A$ de $2 \times 3$ produce una transpuesta de $3 \times 2$. Los pasos recorren $A$ por filas, así que $A^\top$ se va llenando por columnas. Al final, el producto $AB$ transpuesto coincide entrada por entrada con $B^\top A^\top$, en ese orden invertido.

## Ejemplo

Una clínica registra dos variables, glucosa y presión (en desviaciones respecto a la media), para tres pacientes:
$$
X = \begin{pmatrix} -1 & 1 \\ 2 & -1 \\ -1 & 0 \end{pmatrix}.
$$

Cada columna suma 0, como corresponde a datos centrados.

1. La transpuesta tiene una fila por variable: $X^\top = \begin{pmatrix} -1 & 2 & -1 \\ 1 & -1 & 0 \end{pmatrix}$.
2. El producto $X^\top X$ es de $2 \times 2$. Entrada $(1, 1)$: $1 + 4 + 1 = 6$, suma de cuadrados de la glucosa.
3. Entrada $(1, 2)$: $(-1)(1) + (2)(-1) + (-1)(0) = -3$, producto cruzado de ambas variables; la entrada $(2, 1)$ es la misma.
4. Entrada $(2, 2)$: $1 + 1 + 0 = 2$.
5. $X^\top X = \begin{pmatrix} 6 & -3 \\ -3 & 2 \end{pmatrix}$ es simétrica. Como las columnas están centradas, al dividirla entre $n - 1 = 2$ se obtiene la matriz de covarianzas muestrales, $\begin{pmatrix} 3 & -1.5 \\ -1.5 & 1 \end{pmatrix}$: la covarianza negativa indica que, en estos tres pacientes, glucosa alta acompaña a presión baja.

:::figura[El producto del ejemplo: Xᵀ por X. Cada entrada combina dos variables sobre los tres pacientes, y el resultado es simétrico.]{componente="MatrixGrid"}
```yaml
modo: operaciones
a: [[-1, 2, -1], [1, -1, 0]]
b: [[-1, 1], [2, -1], [-1, 0]]
vista: producto
```
:::

## Propiedades

- **Involución:** $(A^\top)^\top = A$.
- **Linealidad:** $(A + B)^\top = A^\top + B^\top$ y $(cA)^\top = cA^\top$.
- **Producto:** $(AB)^\top = B^\top A^\top$, con el orden invertido.
- **Inversa:** $(A^{-1})^\top = (A^\top)^{-1}$.
- **Determinante y rango:** $\det A^\top = \det A$ y $\operatorname{rango} A^\top = \operatorname{rango} A$.
- **Gram:** para cualquier $A$, las matrices $A^\top A$ y $AA^\top$ son simétricas.
- **Producto punto con matrices:** $(A\mathbf{x}) \cdot \mathbf{y} = \mathbf{x} \cdot (A^\top\mathbf{y})$.

:::figura[Caso de una matriz simétrica: al transponerla cada entrada cae sobre otra igual, así que A y Aᵀ coinciden.]{componente="MatrixGrid"}
```yaml
modo: transpuesta
a: [[4, 1, 2], [1, 3, 0], [2, 0, 5]]
```
:::

:::demostracion
Producto: $((AB)^\top)_{ij} = (AB)_{ji} = \sum_k a_{jk}b_{ki} = \sum_k (B^\top)_{ik}(A^\top)_{kj} = (B^\top A^\top)_{ij}$.
:::

## Errores comunes

- **Escribir $(AB)^\top = A^\top B^\top$.** El orden se invierte; si los tamaños no son cuadrados, el producto sin invertir ni siquiera existe.
- **Confundir transpuesta con inversa.** Solo coinciden para matrices ortogonales.
- **Transponer "girando" la matriz.** No es una rotación de 90 grados: es un reflejo sobre la diagonal.
- **Olvidar que cambia el tamaño.** Una matriz de $3 \times 2$ tiene transpuesta de $2 \times 3$.

## Conexiones

La transpuesta reorganiza las [[matrices-y-operaciones-con-matrices|matrices]] y escribe el [[producto-punto]] como $\mathbf{u}^\top\mathbf{v}$. Las matrices iguales a su transpuesta son las simétricas de las [[matrices-especiales]], y las que cumplen $Q^\top Q = I$ son las ortogonales. La matriz $X^\top X$ aparece en la [[proyeccion-ortogonal]], en la [[descomposicion-en-valores-singulares]] y en las ecuaciones normales de la regresión lineal.

## Formulario

:::formula[Definición]
$$
(A^\top)_{ij} = a_{ji}
$$

- $a_{ji}$: entrada de $A$ en la fila $j$ y columna $i$.
:::

:::formula[Propiedades algebraicas]
$$
(A^\top)^\top = A, \qquad (A + B)^\top = A^\top + B^\top, \qquad (AB)^\top = B^\top A^\top
$$

- $A, B$: matrices de tamaños compatibles.
:::

:::formula[Producto punto y adjunción]
$$
\mathbf{u} \cdot \mathbf{v} = \mathbf{u}^\top\mathbf{v}, \qquad (A\mathbf{x}) \cdot \mathbf{y} = \mathbf{x} \cdot (A^\top\mathbf{y})
$$

- $\mathbf{u}^\top$: vector fila.
:::

:::formula[Simetría]
$$
A^\top = A \iff a_{ij} = a_{ji} \text{ para todos } i, j
$$

- $A$: matriz cuadrada.
:::
