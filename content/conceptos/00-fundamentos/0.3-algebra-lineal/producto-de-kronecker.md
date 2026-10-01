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
formula: '\mathbf{A} \otimes \mathbf{B} = \begin{pmatrix} a_{11}\mathbf{B} & \cdots & a_{1n}\mathbf{B} \\ \vdots & \ddots & \vdots \\ a_{m1}\mathbf{B} & \cdots & a_{mn}\mathbf{B} \end{pmatrix}'
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
Para $\mathbf{A} \in \mathbb{R}^{m \times n}$ y $\mathbf{B} \in \mathbb{R}^{p \times q}$, el producto de Kronecker $\mathbf{A} \otimes \mathbf{B} \in \mathbb{R}^{mp \times nq}$ es la matriz por bloques cuyo bloque $(i, j)$ es $a_{ij}\mathbf{B}$:
$$
\mathbf{A} \otimes \mathbf{B} = \begin{pmatrix} a_{11}\mathbf{B} & \cdots & a_{1n}\mathbf{B} \\ \vdots & \ddots & \vdots \\ a_{m1}\mathbf{B} & \cdots & a_{mn}\mathbf{B} \end{pmatrix}.
$$
:::

:::nota[Qué significa cada símbolo]
- $\mathbf{A}$: matriz de $m \times n$ con entradas $a_{ij}$.
- $\mathbf{B}$: matriz de $p \times q$.
- $\otimes$: producto de Kronecker.
- $a_{ij}\mathbf{B}$: bloque de $p \times q$, la matriz $\mathbf{B}$ multiplicada por el número $a_{ij}$.
- $mp \times nq$: tamaño del resultado.
:::

## Cómo usar la visualización

Cada paso coloca un bloque del resultado: se resalta la entrada $a_{ij}$ de $\mathbf{A}$ y aparece en su posición la copia de $\mathbf{B}$ multiplicada por ella. Los bloques alternan un sombreado suave para distinguirse. El panel muestra el tamaño del resultado y cuántos bloques se han colocado.

Con $\mathbf{A}$ de $2 \times 2$ y $\mathbf{B}$ de $2 \times 3$, el resultado es de $4 \times 6$. El bloque que corresponde al cero de $\mathbf{A}$ queda completamente en ceros, y el que corresponde a $-1$ es $\mathbf{B}$ con todos los signos cambiados.

## Ejemplo

Se calcula $\mathbf{A} \otimes \mathbf{B}$ con $\mathbf{A} = \begin{pmatrix} 1 & 2 \\ 3 & 4 \end{pmatrix}$ y $\mathbf{B} = \begin{pmatrix} 0 & 5 \\ 6 & 7 \end{pmatrix}$.

1. Bloque $(1, 1)$: $1 \cdot \mathbf{B} = \begin{pmatrix} 0 & 5 \\ 6 & 7 \end{pmatrix}$. Bloque $(1, 2)$: $2\mathbf{B} = \begin{pmatrix} 0 & 10 \\ 12 & 14 \end{pmatrix}$.
2. Bloque $(2, 1)$: $3\mathbf{B} = \begin{pmatrix} 0 & 15 \\ 18 & 21 \end{pmatrix}$. Bloque $(2, 2)$: $4\mathbf{B} = \begin{pmatrix} 0 & 20 \\ 24 & 28 \end{pmatrix}$.
3. $\mathbf{A} \otimes \mathbf{B} = \begin{pmatrix} 0 & 5 & 0 & 10 \\ 6 & 7 & 12 & 14 \\ 0 & 15 & 0 & 20 \\ 18 & 21 & 24 & 28 \end{pmatrix}$, de $4 \times 4$.
4. Determinante: $\det(\mathbf{A} \otimes \mathbf{B}) = (\det \mathbf{A})^2(\det \mathbf{B})^2 = (-2)^2(-30)^2 = 3600$.
5. En cambio, $\mathbf{B} \otimes \mathbf{A}$ es otra matriz: el producto de Kronecker no conmuta.

:::figura[El producto del ejemplo bloque por bloque: cada entrada de A escala una copia completa de B.]{componente="MatrixGrid"}
```yaml
modo: kronecker
a: [[1, 2], [3, 4]]
b: [[0, 5], [6, 7]]
```
:::

## Propiedades

- **Producto mixto:** $(\mathbf{A} \otimes \mathbf{B})(\mathbf{C} \otimes \mathbf{D}) = (\mathbf{A}\mathbf{C}) \otimes (\mathbf{B}\mathbf{D})$ cuando los productos existen.
- **Inversa y transpuesta:** $(\mathbf{A} \otimes \mathbf{B})^{-1} = \mathbf{A}^{-1} \otimes \mathbf{B}^{-1}$ y $(\mathbf{A} \otimes \mathbf{B})^\top = \mathbf{A}^\top \otimes \mathbf{B}^\top$.
- **Valores propios:** si $\mathbf{A}$ tiene valores propios $\lambda_i$ y $\mathbf{B}$ tiene $\mu_j$, los de $\mathbf{A} \otimes \mathbf{B}$ son todos los productos $\lambda_i\mu_j$.
- **Determinante y traza:** para $\mathbf{A}$ de $n \times n$ y $\mathbf{B}$ de $p \times p$, $\det(\mathbf{A} \otimes \mathbf{B}) = (\det \mathbf{A})^p(\det \mathbf{B})^n$ y $\operatorname{tr}(\mathbf{A} \otimes \mathbf{B}) = \operatorname{tr}\mathbf{A}\,\operatorname{tr}\mathbf{B}$.
- **Vectorización:** $\operatorname{vec}(\mathbf{A}\mathbf{X}\mathbf{B}) = (\mathbf{B}^\top \otimes \mathbf{A})\operatorname{vec}(\mathbf{X})$, que convierte ecuaciones matriciales en sistemas lineales.
- **No conmutativo:** $\mathbf{A} \otimes \mathbf{B} \neq \mathbf{B} \otimes \mathbf{A}$ en general, aunque son semejantes mediante matrices de permutación.

:::figura[Caso de la identidad: I ⊗ B es una matriz diagonal por bloques, con copias de B en la diagonal y ceros fuera.]{componente="MatrixGrid"}
```yaml
modo: kronecker
a: [[1, 0], [0, 1]]
b: [[2, 1], [1, 2]]
```
:::

:::demostracion
Producto mixto: el bloque $(i, k)$ de $(\mathbf{A} \otimes \mathbf{B})(\mathbf{C} \otimes \mathbf{D})$ es $\sum_j (a_{ij}\mathbf{B})(c_{jk}\mathbf{D}) = \big(\sum_j a_{ij}c_{jk}\big)\mathbf{B}\mathbf{D} = (\mathbf{A}\mathbf{C})_{ik}\,\mathbf{B}\mathbf{D}$, que es el bloque $(i, k)$ de $(\mathbf{A}\mathbf{C}) \otimes (\mathbf{B}\mathbf{D})$.
:::

## Errores comunes

- **Confundirlo con el producto usual.** $\mathbf{A} \otimes \mathbf{B}$ existe para cualquier par de tamaños y produce una matriz más grande.
- **Suponer que conmuta.** El orden decide qué matriz se repite en bloques.
- **Formarlo explícitamente cuando no hace falta.** Para matrices grandes conviene usar las propiedades de producto mixto e inversa en lugar de construir la matriz completa.
- **Olvidar las potencias en el determinante.** El exponente de $\det \mathbf{A}$ es el tamaño de $\mathbf{B}$, y al revés.

## Conexiones

El producto de Kronecker se construye con los productos por escalar de [[matrices-y-operaciones-con-matrices]], y sus [[valores-y-vectores-propios|valores propios]] se obtienen de los de sus factores. Aparece al trabajar con [[tensores]] y con [[matrices-dispersas]] estructuradas, como las que surgen al discretizar ecuaciones en rejillas. En estadística, las covarianzas separables de datos espacio-temporales son productos de Kronecker.

## Formulario

:::formula[Definición por bloques]
$$
(\mathbf{A} \otimes \mathbf{B})_{\text{bloque } (i,j)} = a_{ij}\mathbf{B}
$$

- $a_{ij}$: entrada de $\mathbf{A}$.
- $\mathbf{B}$: matriz que se repite.
:::

:::formula[Producto mixto]
$$
(\mathbf{A} \otimes \mathbf{B})(\mathbf{C} \otimes \mathbf{D}) = (\mathbf{A}\mathbf{C}) \otimes (\mathbf{B}\mathbf{D})
$$

- $\mathbf{A}, \mathbf{C}$ y $\mathbf{B}, \mathbf{D}$: pares de matrices multiplicables.
:::

:::formula[Inversa, valores propios y determinante]
$$
(\mathbf{A} \otimes \mathbf{B})^{-1} = \mathbf{A}^{-1} \otimes \mathbf{B}^{-1}, \qquad \lambda(\mathbf{A} \otimes \mathbf{B}) = \{\lambda_i\mu_j\}, \qquad \det(\mathbf{A} \otimes \mathbf{B}) = (\det \mathbf{A})^p(\det \mathbf{B})^n
$$

- $\lambda_i$, $\mu_j$: valores propios de $\mathbf{A}$ y de $\mathbf{B}$.
- $n$, $p$: tamaños de $\mathbf{A}$ y de $\mathbf{B}$.
:::

:::formula[Vectorización]
$$
\operatorname{vec}(\mathbf{A}\mathbf{X}\mathbf{B}) = (\mathbf{B}^\top \otimes \mathbf{A})\operatorname{vec}(\mathbf{X})
$$

- $\operatorname{vec}(\mathbf{X})$: columnas de $\mathbf{X}$ apiladas en un solo vector.
:::
