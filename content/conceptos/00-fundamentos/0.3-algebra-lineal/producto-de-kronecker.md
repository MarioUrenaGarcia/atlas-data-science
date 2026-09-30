---
id: producto-de-kronecker
titulo: Producto de Kronecker
titulo_en: Kronecker product
alias:
  - producto tensorial de matrices
  - producto directo
modulo: 0
submodulo: '0.3'
orden: 41
nivel: avanzado
prerrequisitos:
  - valores-y-vectores-propios
etiquetas:
  - Kronecker
  - matrices por bloques
  - estructura
  - vectorización
resumen: >
  El producto de Kronecker A ⊗ B reemplaza cada entrada a_ij de A por el bloque a_ij B; produce matrices
  grandes con estructura, cuyos valores propios e inversas se obtienen de los de A y B.
formula: 'A \otimes B = \begin{pmatrix} a_{11}B & \cdots & a_{1n}B \\ \vdots & \ddots & \vdots \\ a_{m1}B & \cdots & a_{mn}B \end{pmatrix}'
visualizacion:
  componente: MatrixGrid
  parametros:
    modo: kronecker
    a: [[2, -1], [1, 0]]
    b: [[1, 2, 0], [0, 1, 1]]
referencias:
  - clave: strang
  - clave: murphy
publicado: true
---

## Intuición

Un edificio tiene pisos, y cada piso tiene la misma distribución de departamentos. Para describir cómo se conectan todos los departamentos del edificio basta saber cómo se conectan los pisos entre sí y cómo se conectan los departamentos dentro de un piso. El producto de Kronecker arma esa descripción completa: toma la matriz de los pisos y, en lugar de cada número, coloca una copia de la matriz de los departamentos multiplicada por ese número.

El resultado es una matriz grande pero muy ordenada, hecha de bloques repetidos. Esa estructura permite trabajar con ella sin formarla: sus valores propios son productos de los valores propios de las piezas, y su inversa es el producto de Kronecker de las inversas. Aparece en imágenes, donde una operación sobre filas y otra sobre columnas se combinan, en modelos estadísticos con covarianzas separables y en redes neuronales que se comprimen con factores pequeños.

## Definición

:::definicion[Producto de Kronecker]
Para $A \in \mathbb{R}^{m \times n}$ y $B \in \mathbb{R}^{p \times q}$, el producto de Kronecker $A \otimes B \in \mathbb{R}^{mp \times nq}$ es la matriz por bloques cuyo bloque $(i, j)$ es $a_{ij}B$:
$$
A \otimes B = \begin{pmatrix} a_{11}B & \cdots & a_{1n}B \\ \vdots & \ddots & \vdots \\ a_{m1}B & \cdots & a_{mn}B \end{pmatrix}.
$$
:::

:::nota[Qué significa cada símbolo]
- $A$: matriz de $m \times n$ con entradas $a_{ij}$.
- $B$: matriz de $p \times q$.
- $\otimes$: producto de Kronecker.
- $a_{ij}B$: bloque de $p \times q$, la matriz $B$ multiplicada por el número $a_{ij}$.
- $mp \times nq$: tamaño del resultado.
:::

## Cómo usar la visualización

Cada paso coloca un bloque del resultado: se resalta la entrada $a_{ij}$ de $A$ y aparece en su posición la copia de $B$ multiplicada por ella. Los bloques alternan un sombreado suave para distinguirse. El panel muestra el tamaño del resultado y cuántos bloques se han colocado.

Con $A$ de $2 \times 2$ y $B$ de $2 \times 3$, el resultado es de $4 \times 6$. El bloque que corresponde al cero de $A$ queda completamente en ceros, y el que corresponde a $-1$ es $B$ con todos los signos cambiados.

## Ejemplo

Se calcula $A \otimes B$ con $A = \begin{pmatrix} 1 & 2 \\ 3 & 4 \end{pmatrix}$ y $B = \begin{pmatrix} 0 & 5 \\ 6 & 7 \end{pmatrix}$.

1. Bloque $(1, 1)$: $1 \cdot B = \begin{pmatrix} 0 & 5 \\ 6 & 7 \end{pmatrix}$. Bloque $(1, 2)$: $2B = \begin{pmatrix} 0 & 10 \\ 12 & 14 \end{pmatrix}$.
2. Bloque $(2, 1)$: $3B = \begin{pmatrix} 0 & 15 \\ 18 & 21 \end{pmatrix}$. Bloque $(2, 2)$: $4B = \begin{pmatrix} 0 & 20 \\ 24 & 28 \end{pmatrix}$.
3. $A \otimes B = \begin{pmatrix} 0 & 5 & 0 & 10 \\ 6 & 7 & 12 & 14 \\ 0 & 15 & 0 & 20 \\ 18 & 21 & 24 & 28 \end{pmatrix}$, de $4 \times 4$.
4. Determinante: $\det(A \otimes B) = (\det A)^2(\det B)^2 = (-2)^2(-30)^2 = 3600$.
5. En cambio, $B \otimes A$ es otra matriz: el producto de Kronecker no conmuta.

:::figura[El producto del ejemplo bloque por bloque: cada entrada de A escala una copia completa de B.]{componente="MatrixGrid"}
```yaml
modo: kronecker
a: [[1, 2], [3, 4]]
b: [[0, 5], [6, 7]]
```
:::

## Propiedades

- **Producto mixto:** $(A \otimes B)(C \otimes D) = (AC) \otimes (BD)$ cuando los productos existen.
- **Inversa y transpuesta:** $(A \otimes B)^{-1} = A^{-1} \otimes B^{-1}$ y $(A \otimes B)^\top = A^\top \otimes B^\top$.
- **Valores propios:** si $A$ tiene valores propios $\lambda_i$ y $B$ tiene $\mu_j$, los de $A \otimes B$ son todos los productos $\lambda_i\mu_j$.
- **Determinante y traza:** para $A$ de $n \times n$ y $B$ de $p \times p$, $\det(A \otimes B) = (\det A)^p(\det B)^n$ y $\operatorname{tr}(A \otimes B) = \operatorname{tr}A\,\operatorname{tr}B$.
- **Vectorización:** $\operatorname{vec}(AXB) = (B^\top \otimes A)\operatorname{vec}(X)$, que convierte ecuaciones matriciales en sistemas lineales.
- **No conmutativo:** $A \otimes B \neq B \otimes A$ en general, aunque son semejantes mediante matrices de permutación.

:::figura[Caso de la identidad: I ⊗ B es una matriz diagonal por bloques, con copias de B en la diagonal y ceros fuera.]{componente="MatrixGrid"}
```yaml
modo: kronecker
a: [[1, 0], [0, 1]]
b: [[2, 1], [1, 2]]
```
:::

:::demostracion
Producto mixto: el bloque $(i, k)$ de $(A \otimes B)(C \otimes D)$ es $\sum_j (a_{ij}B)(c_{jk}D) = \big(\sum_j a_{ij}c_{jk}\big)BD = (AC)_{ik}\,BD$, que es el bloque $(i, k)$ de $(AC) \otimes (BD)$.
:::

## Errores comunes

- **Confundirlo con el producto usual.** $A \otimes B$ existe para cualquier par de tamaños y produce una matriz más grande.
- **Suponer que conmuta.** El orden decide qué matriz se repite en bloques.
- **Formarlo explícitamente cuando no hace falta.** Para matrices grandes conviene usar las propiedades de producto mixto e inversa en lugar de construir la matriz completa.
- **Olvidar las potencias en el determinante.** El exponente de $\det A$ es el tamaño de $B$, y al revés.

## Conexiones

El producto de Kronecker se construye con los productos por escalar de [[matrices-y-operaciones-con-matrices]], y sus [[valores-y-vectores-propios|valores propios]] se obtienen de los de sus factores. Aparece al trabajar con [[tensores]] y con [[matrices-dispersas]] estructuradas, como las que surgen al discretizar ecuaciones en rejillas. En estadística, las covarianzas separables de datos espacio-temporales son productos de Kronecker.

## Formulario

:::formula[Definición por bloques]
$$
(A \otimes B)_{\text{bloque } (i,j)} = a_{ij}B
$$

- $a_{ij}$: entrada de $A$.
- $B$: matriz que se repite.
:::

:::formula[Producto mixto]
$$
(A \otimes B)(C \otimes D) = (AC) \otimes (BD)
$$

- $A, C$ y $B, D$: pares de matrices multiplicables.
:::

:::formula[Inversa, valores propios y determinante]
$$
(A \otimes B)^{-1} = A^{-1} \otimes B^{-1}, \qquad \lambda(A \otimes B) = \{\lambda_i\mu_j\}, \qquad \det(A \otimes B) = (\det A)^p(\det B)^n
$$

- $\lambda_i$, $\mu_j$: valores propios de $A$ y de $B$.
- $n$, $p$: tamaños de $A$ y de $B$.
:::

:::formula[Vectorización]
$$
\operatorname{vec}(AXB) = (B^\top \otimes A)\operatorname{vec}(X)
$$

- $\operatorname{vec}(X)$: columnas de $X$ apiladas en un solo vector.
:::
