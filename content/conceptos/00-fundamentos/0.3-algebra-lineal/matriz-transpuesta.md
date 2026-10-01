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
formula: '(\mathbf{A}^\top)_{ij} = a_{ji}, \qquad (\mathbf{A}\mathbf{B})^\top = \mathbf{B}^\top \mathbf{A}^\top'
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
La **transpuesta** de $\mathbf{A} \in \mathbb{R}^{m \times n}$ es la matriz $\mathbf{A}^\top \in \mathbb{R}^{n \times m}$ con
$$
(\mathbf{A}^\top)_{ij} = a_{ji}.
$$
La fila $i$ de $\mathbf{A}$ es la columna $i$ de $\mathbf{A}^\top$. Una matriz cuadrada es **simétrica** si $\mathbf{A}^\top = \mathbf{A}$.
:::

Con vectores columna, $\mathbf{u}^\top$ es un vector fila y $\mathbf{u}^\top\mathbf{v} = \mathbf{u} \cdot \mathbf{v}$.

:::nota[Qué significa cada símbolo]
- $\mathbf{A}$: matriz de $m$ filas y $n$ columnas.
- $\mathbf{A}^\top$: su transpuesta, de $n$ filas y $m$ columnas.
- $a_{ji}$: entrada de $\mathbf{A}$ en la fila $j$ y columna $i$.
- $\mathbf{u}^\top$: el vector $\mathbf{u}$ escrito como fila.
- $m, n$: número de filas y columnas de $\mathbf{A}$.
:::

## Cómo usar la visualización

Cada paso toma una entrada de $\mathbf{A}$, resaltada, y la coloca en la posición espejo de $\mathbf{A}^\top$. Las entradas de la diagonal, marcadas con borde, no cambian de lugar. Al terminar aparecen $(\mathbf{A}\mathbf{B})^\top$ y $\mathbf{B}^\top \mathbf{A}^\top$, y el panel confirma que son iguales.

La matriz $\mathbf{A}$ de $2 \times 3$ produce una transpuesta de $3 \times 2$. Los pasos recorren $\mathbf{A}$ por filas, así que $\mathbf{A}^\top$ se va llenando por columnas. Al final, el producto $\mathbf{A}\mathbf{B}$ transpuesto coincide entrada por entrada con $\mathbf{B}^\top \mathbf{A}^\top$, en ese orden invertido.

## Ejemplo

Una clínica registra dos variables, glucosa y presión (en desviaciones respecto a la media), para tres pacientes:
$$
\mathbf{X} = \begin{pmatrix} -1 & 1 \\ 2 & -1 \\ -1 & 0 \end{pmatrix}.
$$

Cada columna suma 0, como corresponde a datos centrados.

1. La transpuesta tiene una fila por variable: $\mathbf{X}^\top = \begin{pmatrix} -1 & 2 & -1 \\ 1 & -1 & 0 \end{pmatrix}$.
2. El producto $\mathbf{X}^\top \mathbf{X}$ es de $2 \times 2$. Entrada $(1, 1)$: $1 + 4 + 1 = 6$, suma de cuadrados de la glucosa.
3. Entrada $(1, 2)$: $(-1)(1) + (2)(-1) + (-1)(0) = -3$, producto cruzado de ambas variables; la entrada $(2, 1)$ es la misma.
4. Entrada $(2, 2)$: $1 + 1 + 0 = 2$.
5. $\mathbf{X}^\top \mathbf{X} = \begin{pmatrix} 6 & -3 \\ -3 & 2 \end{pmatrix}$ es simétrica. Como las columnas están centradas, al dividirla entre $n - 1 = 2$ se obtiene la matriz de covarianzas muestrales, $\begin{pmatrix} 3 & -1.5 \\ -1.5 & 1 \end{pmatrix}$: la covarianza negativa indica que, en estos tres pacientes, glucosa alta acompaña a presión baja.

:::figura[El producto del ejemplo: Xᵀ por X. Cada entrada combina dos variables sobre los tres pacientes, y el resultado es simétrico.]{componente="MatrixGrid"}
```yaml
modo: operaciones
a: [[-1, 2, -1], [1, -1, 0]]
b: [[-1, 1], [2, -1], [-1, 0]]
vista: producto
```
:::

## Propiedades

- **Involución:** $(\mathbf{A}^\top)^\top = \mathbf{A}$.
- **Linealidad:** $(\mathbf{A} + \mathbf{B})^\top = \mathbf{A}^\top + \mathbf{B}^\top$ y $(cA)^\top = cA^\top$.
- **Producto:** $(\mathbf{A}\mathbf{B})^\top = \mathbf{B}^\top \mathbf{A}^\top$, con el orden invertido.
- **Inversa:** $(\mathbf{A}^{-1})^\top = (\mathbf{A}^\top)^{-1}$.
- **Determinante y rango:** $\det \mathbf{A}^\top = \det \mathbf{A}$ y $\operatorname{rango} \mathbf{A}^\top = \operatorname{rango} \mathbf{A}$.
- **Gram:** para cualquier $\mathbf{A}$, las matrices $\mathbf{A}^\top \mathbf{A}$ y $\mathbf{A}\mathbf{A}^\top$ son simétricas.
- **Producto punto con matrices:** $(\mathbf{A}\mathbf{x}) \cdot \mathbf{y} = \mathbf{x} \cdot (\mathbf{A}^\top\mathbf{y})$.

:::figura[Caso de una matriz simétrica: al transponerla cada entrada cae sobre otra igual, así que A y Aᵀ coinciden.]{componente="MatrixGrid"}
```yaml
modo: transpuesta
a: [[4, 1, 2], [1, 3, 0], [2, 0, 5]]
```
:::

:::demostracion
Producto: $((\mathbf{A}\mathbf{B})^\top)_{ij} = (\mathbf{A}\mathbf{B})_{ji} = \sum_k a_{jk}b_{ki} = \sum_k (\mathbf{B}^\top)_{ik}(\mathbf{A}^\top)_{kj} = (\mathbf{B}^\top \mathbf{A}^\top)_{ij}$.
:::

## Errores comunes

- **Escribir $(\mathbf{A}\mathbf{B})^\top = \mathbf{A}^\top \mathbf{B}^\top$.** El orden se invierte; si los tamaños no son cuadrados, el producto sin invertir ni siquiera existe.
- **Confundir transpuesta con inversa.** Solo coinciden para matrices ortogonales.
- **Transponer "girando" la matriz.** No es una rotación de 90 grados: es un reflejo sobre la diagonal.
- **Olvidar que cambia el tamaño.** Una matriz de $3 \times 2$ tiene transpuesta de $2 \times 3$.

## Conexiones

La transpuesta reorganiza las [[matrices-y-operaciones-con-matrices|matrices]] y escribe el [[producto-punto]] como $\mathbf{u}^\top\mathbf{v}$. Las matrices iguales a su transpuesta son las simétricas de las [[matrices-especiales]], y las que cumplen $\mathbf{Q}^\top \mathbf{Q} = \mathbf{I}$ son las ortogonales. La matriz $\mathbf{X}^\top \mathbf{X}$ aparece en la [[proyeccion-ortogonal]], en la [[descomposicion-en-valores-singulares]] y en las ecuaciones normales de la regresión lineal.

## Formulario

:::formula[Definición]
$$
(\mathbf{A}^\top)_{ij} = a_{ji}
$$

- $a_{ji}$: entrada de $\mathbf{A}$ en la fila $j$ y columna $i$.
:::

:::formula[Propiedades algebraicas]
$$
(\mathbf{A}^\top)^\top = \mathbf{A}, \qquad (\mathbf{A} + \mathbf{B})^\top = \mathbf{A}^\top + \mathbf{B}^\top, \qquad (\mathbf{A}\mathbf{B})^\top = \mathbf{B}^\top \mathbf{A}^\top
$$

- $\mathbf{A}, \mathbf{B}$: matrices de tamaños compatibles.
:::

:::formula[Producto punto y adjunción]
$$
\mathbf{u} \cdot \mathbf{v} = \mathbf{u}^\top\mathbf{v}, \qquad (\mathbf{A}\mathbf{x}) \cdot \mathbf{y} = \mathbf{x} \cdot (\mathbf{A}^\top\mathbf{y})
$$

- $\mathbf{u}^\top$: vector fila.
:::

:::formula[Simetría]
$$
\mathbf{A}^\top = \mathbf{A} \iff a_{ij} = a_{ji} \text{ para todos } i, j
$$

- $\mathbf{A}$: matriz cuadrada.
:::
