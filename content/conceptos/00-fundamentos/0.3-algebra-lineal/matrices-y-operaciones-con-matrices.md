---
id: matrices-y-operaciones-con-matrices
titulo: Matrices y operaciones con matrices
titulo_en: Matrices and matrix operations
alias:
  - matriz
  - producto de matrices
  - suma de matrices
  - multiplicación de matrices
modulo: 0
submodulo: '0.3'
orden: 13
nivel: basico
prerrequisitos:
  - producto-punto
etiquetas:
  - matrices
  - producto de matrices
  - fila por columna
  - tablas de datos
resumen: >
  Una matriz es una tabla rectangular de números; se suma entrada a entrada, se multiplica por escalares
  entrada a entrada y el producto AB tiene en cada entrada el producto punto de una fila de A con una columna de B.
formula: '(AB)_{ij} = \sum_{k=1}^{p} a_{ik}\,b_{kj}'
visualizacion:
  componente: MatrixGrid
  parametros:
    modo: operaciones
    a: [[2, 1], [0, 3], [1, -1]]
    b: [[1, 0, 2], [4, 1, -1]]
    escalar: 3
    vista: producto
referencias:
  - clave: strang
  - clave: goodfellow
    capitulo: '2'
publicado: true
---

## Intuición

Una hoja de cálculo con las ventas de cada tienda (filas) por producto (columnas) es una matriz. Sumar las tablas de enero y febrero entrada por entrada da las ventas del bimestre; multiplicar toda la tabla por 1.16 agrega el impuesto. Esas dos operaciones tratan a la matriz como una lista larga de números.

El producto de matrices es distinto y es el que da su poder al álgebra lineal. Si una tabla dice cuántas unidades de cada producto vende cada tienda y un vector dice el precio de cada producto, el ingreso de una tienda se obtiene multiplicando su fila por el vector de precios, entrada con entrada, y sumando: un producto punto. El producto de dos matrices repite esa operación para cada combinación de fila de la primera y columna de la segunda. Por eso solo existe cuando las filas de la primera tienen tantas entradas como las columnas de la segunda, y por eso en general el orden importa.

## Definición

:::definicion[Matriz y operaciones]
Una matriz $A \in \mathbb{R}^{m \times n}$ es un arreglo de $m$ filas y $n$ columnas con entradas $a_{ij}$. Para $A, B \in \mathbb{R}^{m \times n}$ y $c \in \mathbb{R}$:
$$
(A + B)_{ij} = a_{ij} + b_{ij}, \qquad (cA)_{ij} = c\,a_{ij}.
$$
Si $A \in \mathbb{R}^{m \times p}$ y $B \in \mathbb{R}^{p \times n}$, el **producto** $AB \in \mathbb{R}^{m \times n}$ tiene entradas
$$
(AB)_{ij} = \sum_{k=1}^{p} a_{ik}\,b_{kj} = (\text{fila } i \text{ de } A) \cdot (\text{columna } j \text{ de } B).
$$
:::

Un vector de $\mathbb{R}^n$ se trata como una matriz de $n \times 1$, así que $A\mathbf{x}$ es un caso del producto.

:::nota[Qué significa cada símbolo]
- $A, B$: matrices, en mayúsculas.
- $a_{ij}$: entrada de la fila $i$ y columna $j$ de $A$.
- $m, n$: número de filas y de columnas.
- $p$: número de columnas de $A$, igual al de filas de $B$.
- $\mathbb{R}^{m \times n}$: conjunto de matrices reales de $m \times n$.
- $c$: escalar.
- $k$: índice que recorre la fila de $A$ y la columna de $B$ al mismo tiempo.
:::

## Cómo usar la visualización

Las pestañas eligen la operación: suma, producto por escalar o producto. En el producto, cada paso resalta una fila de $A$ y una columna de $B$ y escribe la suma de productos que da la entrada correspondiente del resultado, que se va llenando. En la pestaña del escalar hay un control para $c$.

Con $A$ de $3 \times 2$ y $B$ de $2 \times 3$ el producto $AB$ es de $3 \times 3$: cada entrada suma solo dos productos. En la pestaña de suma aparece el aviso de que las matrices deben tener el mismo tamaño, porque aquí no lo tienen.

## Ejemplo

Dos sucursales venden tres productos. Las unidades vendidas en un día forman $Q$ y los precios en pesos forman el vector $\mathbf{p}$:
$$
Q = \begin{pmatrix} 10 & 5 & 2 \\ 4 & 8 & 6 \end{pmatrix}, \qquad \mathbf{p} = \begin{pmatrix} 3 \\ 2 \\ 5 \end{pmatrix}.
$$

1. El ingreso de la sucursal 1 es la fila 1 por $\mathbf{p}$: $10 \cdot 3 + 5 \cdot 2 + 2 \cdot 5 = 30 + 10 + 10 = 50$.
2. El de la sucursal 2: $4 \cdot 3 + 8 \cdot 2 + 6 \cdot 5 = 12 + 16 + 30 = 58$.
3. Entonces $Q\mathbf{p} = (50, 58)^\top$; $Q$ es de $2 \times 3$ y $\mathbf{p}$ de $3 \times 1$, así que el resultado es de $2 \times 1$.
4. El producto $\mathbf{p}Q$ no está definido: $\mathbf{p}$ tiene 1 columna y $Q$ tiene 2 filas.

:::figura[El producto del ejemplo entrada por entrada: cada ingreso es la fila de unidades de una sucursal por la columna de precios.]{componente="MatrixGrid"}
```yaml
modo: operaciones
a: [[10, 5, 2], [4, 8, 6]]
b: [[3], [2], [5]]
vista: producto
```
:::

## Propiedades

- **Suma:** conmutativa y asociativa; la matriz cero es el neutro.
- **Producto asociativo:** $(AB)C = A(BC)$.
- **Distributivo:** $A(B + C) = AB + AC$ y $(A + B)C = AC + BC$.
- **No conmutativo:** en general $AB \neq BA$, aun cuando ambos productos existan.
- **Sin cancelación:** $AB = 0$ no implica $A = 0$ o $B = 0$; por ejemplo $\begin{pmatrix} 1 & 0 \\ 0 & 0 \end{pmatrix}\begin{pmatrix} 0 & 0 \\ 0 & 1 \end{pmatrix} = 0$.
- **Columnas del producto:** la columna $j$ de $AB$ es $A$ por la columna $j$ de $B$, una combinación lineal de las columnas de $A$.
- **Costo:** multiplicar una matriz de $m \times p$ por una de $p \times n$ requiere $mnp$ multiplicaciones.

:::figura[Caso de la suma: se suman las entradas que ocupan la misma posición. Solo es posible con matrices del mismo tamaño.]{componente="MatrixGrid"}
```yaml
modo: operaciones
a: [[1, 2], [3, 4]]
b: [[5, -1], [0, 2]]
escalar: -2
vista: suma
```
:::

:::demostracion
Asociatividad: la entrada $(i, j)$ de $(AB)C$ es $\sum_l \big(\sum_k a_{ik}b_{kl}\big)c_{lj} = \sum_k\sum_l a_{ik}b_{kl}c_{lj}$, y la de $A(BC)$ es $\sum_k a_{ik}\big(\sum_l b_{kl}c_{lj}\big)$, que es la misma suma doble.
:::

## Errores comunes

- **Multiplicar entrada por entrada.** Eso es el producto de Hadamard, $A \odot B$, no el producto de matrices.
- **Suponer que $AB = BA$.** La mayoría de los pares no conmutan; el orden es parte de la operación.
- **No revisar tamaños.** $(m \times p)(p \times n)$ da $m \times n$; los números internos deben coincidir.
- **Simplificar $AB = AC$ a $B = C$.** Solo es válido si $A$ es invertible.

## Conexiones

Cada entrada del producto es un [[producto-punto]], y las columnas de una matriz son [[vectores-y-operaciones-con-vectores|vectores]]. Una matriz representa una función lineal, como se estudia en [[multiplicacion-de-matrices-como-transformacion-lineal]]; de ahí salen la [[matriz-identidad-y-matriz-inversa]] y la [[matriz-transpuesta]]. En ciencia de datos, una tabla de $n$ observaciones y $p$ variables es una matriz de $n \times p$, y las predicciones de un modelo lineal son $X\boldsymbol{\beta}$.

## Formulario

:::formula[Suma y producto por escalar]
$$
(A + B)_{ij} = a_{ij} + b_{ij}, \qquad (cA)_{ij} = c\,a_{ij}
$$

- $a_{ij}, b_{ij}$: entradas en la fila $i$ y columna $j$.
- $c$: escalar.
:::

:::formula[Producto de matrices]
$$
(AB)_{ij} = \sum_{k=1}^{p} a_{ik}\,b_{kj}
$$

- $A$: matriz de $m \times p$.
- $B$: matriz de $p \times n$.
- $k$: índice de la suma, de 1 a $p$.
:::

:::formula[Matriz por vector]
$$
A\mathbf{x} = x_1\mathbf{a}_1 + \dots + x_n\mathbf{a}_n
$$

- $\mathbf{a}_j$: columna $j$ de $A$.
- $x_j$: componente $j$ de $\mathbf{x}$.
:::

:::formula[Tamaños]
$$
(m \times p)\,(p \times n) = m \times n
$$

- Los números internos deben coincidir; los externos dan el tamaño del resultado.
:::
