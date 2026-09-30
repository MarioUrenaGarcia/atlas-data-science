---
id: descomposicion-lu
titulo: Descomposición LU
titulo_en: LU decomposition
alias:
  - factorización LU
  - LU con pivoteo
  - PA = LU
modulo: 0
submodulo: '0.3'
orden: 24
nivel: basico
prerrequisitos:
  - eliminacion-gaussiana
  - matrices-especiales
etiquetas:
  - factorización
  - triangular
  - eliminación
  - sistemas
resumen: >
  La descomposición LU escribe A = LU con L triangular inferior, que guarda los multiplicadores de la
  eliminación, y U triangular superior, el resultado; permite resolver muchos sistemas con la misma A.
formula: 'A = LU, \qquad \ell_{ik} = \frac{a_{ik}^{(k)}}{a_{kk}^{(k)}}, \qquad PA = LU'
visualizacion:
  componente: MatrixSteps
  parametros:
    modo: lu
    matrices:
      - nombre: Sin intercambios
        matriz: [[1, 2, 3], [2, 5, 7], [3, 7, 12]]
      - nombre: Pivote nulo
        matriz: [[0, 1, 2], [1, 1, 1], [2, 3, 5]]
referencias:
  - clave: strang
publicado: true
---

## Intuición

La eliminación gaussiana hace mucho trabajo sobre la matriz y muy poco sobre el lado derecho. Si una misma matriz tiene que resolverse con cien lados derechos distintos, como un puente que se analiza bajo cien cargas, repetir la eliminación cien veces desperdicia casi todo el esfuerzo. La descomposición LU guarda el trabajo hecho: la matriz $U$ es lo que queda al final de la eliminación y la matriz $L$ anota los multiplicadores que se usaron.

Con eso, cada sistema nuevo se resuelve en dos pasos baratos. Primero se aplica al lado derecho la misma eliminación, leyéndola de $L$ con sustitución hacia adelante; después se despeja con $U$ de abajo hacia arriba. Resolver un sistema triangular cuesta del orden de $n^2$ operaciones, frente a las $n^3$ de la eliminación completa. Cuando aparece un pivote nulo hay que intercambiar filas, y la factorización se escribe $PA = LU$ con una matriz de permutación $P$.

## Definición

:::definicion[Factorización LU]
Una matriz cuadrada $A$ admite **factorización LU** si
$$
A = LU,
$$
con $L$ triangular inferior con unos en la diagonal y $U$ triangular superior. La entrada $\ell_{ik}$ ($i > k$) de $L$ es el multiplicador usado en la eliminación para anular la posición $(i, k)$.
:::

:::teorema[Existencia]
$A$ tiene factorización LU sin intercambios si todos sus menores principales $\det A_{1:k,\,1:k}$ para $k = 1, \dots, n - 1$ son distintos de cero. Toda matriz cuadrada tiene una factorización $PA = LU$ con $P$ de permutación.
:::

:::nota[Qué significa cada símbolo]
- $A$: matriz cuadrada de $n \times n$.
- $L$: triangular inferior con unos en la diagonal.
- $U$: triangular superior.
- $\ell_{ik}$: multiplicador en la fila $i$, columna $k$ de $L$.
- $a_{ik}^{(k)}$: entrada $(i, k)$ en la etapa $k$ de la eliminación.
- $P$: matriz de permutación que registra los intercambios de filas.
- $A_{1:k,\,1:k}$: submatriz formada por las primeras $k$ filas y columnas.
:::

## Cómo usar la visualización

A la izquierda se construye $L$ y a la derecha $U$. Cada paso anula una entrada de $U$ con una operación de fila y guarda el multiplicador, resaltado, en la misma posición de $L$. Al terminar aparece el producto $LU$, que reproduce la matriz original, y el panel muestra el determinante como producto de la diagonal de $U$.

Con la matriz sin intercambios, los multiplicadores 2, 3 y 1 llenan la parte inferior de $L$. Con la matriz de pivote nulo el proceso se detiene en el primer paso: sin intercambiar filas no hay factorización.

## Ejemplo

Se factoriza $A = \begin{pmatrix} 2 & 1 & 1 \\ 4 & -6 & 0 \\ -2 & 7 & 2 \end{pmatrix}$, la matriz de rigidez de una estructura pequeña, y se resuelve $A\mathbf{x} = (5, -2, 9)^\top$.

1. Multiplicadores de la columna 1: $\ell_{21} = 4/2 = 2$ y $\ell_{31} = -2/2 = -1$. Las filas quedan $(0, -8, -2)$ y $(0, 8, 3)$.
2. Multiplicador de la columna 2: $\ell_{32} = 8/(-8) = -1$. La última fila queda $(0, 0, 1)$.
3. $L = \begin{pmatrix} 1 & 0 & 0 \\ 2 & 1 & 0 \\ -1 & -1 & 1 \end{pmatrix}$ y $U = \begin{pmatrix} 2 & 1 & 1 \\ 0 & -8 & -2 \\ 0 & 0 & 1 \end{pmatrix}$.
4. Hacia adelante, $L\mathbf{y} = \mathbf{b}$: $y_1 = 5$, $y_2 = -2 - 10 = -12$, $y_3 = 9 + 5 - 12 = 2$.
5. Hacia atrás, $U\mathbf{x} = \mathbf{y}$: $x_3 = 2$, $-8x_2 - 4 = -12$ da $x_2 = 1$, y $2x_1 + 1 + 2 = 5$ da $x_1 = 1$.

:::figura[La factorización de la matriz de rigidez del ejemplo. Los multiplicadores 2, -1 y -1 llenan L mientras U se vuelve triangular.]{componente="MatrixSteps"}
```yaml
modo: lu
matrices:
  - nombre: Rigidez
    matriz: [[2, 1, 1], [4, -6, 0], [-2, 7, 2]]
```
:::

## Propiedades

- **Costo:** factorizar cuesta del orden de $\tfrac{2}{3}n^3$ operaciones; cada sistema adicional, solo $2n^2$.
- **Determinante:** $\det A = \det U = \prod_i u_{ii}$ si no hay intercambios; con $PA = LU$ se multiplica por $\det P = \pm 1$.
- **Unicidad:** si $A$ es invertible y tiene factorización LU con unos en la diagonal de $L$, esta es única.
- **Variante LDU:** $A = LDU'$ con $D$ diagonal (los pivotes) y $U'$ con unos en la diagonal.
- **Matrices simétricas definidas positivas:** la factorización se simplifica a $A = LL^\top$, la de Cholesky.
- **Inversa de $L$:** es triangular inferior y se obtiene cambiando el signo de los multiplicadores debajo de la diagonal en el caso de una sola columna.

:::figura[Casos de las dos matrices triangulares que produce la factorización: la inferior con ceros encima de la diagonal y la superior con ceros debajo.]{componente="MatrixGrid"}
```yaml
modo: especiales
tipos: [triangular-inferior, triangular-superior]
n: 4
```
:::

:::demostracion
Cada reemplazo $R_i \leftarrow R_i - \ell_{ik}R_k$ equivale a multiplicar por la izquierda por $E_{ik} = I - \ell_{ik}\mathbf{e}_i\mathbf{e}_k^\top$. La eliminación da $E\,A = U$ con $E$ el producto de esas matrices, que es triangular inferior e invertible. Entonces $A = E^{-1}U$, y $E^{-1}$ resulta ser la matriz $L$ con los multiplicadores en sus posiciones.
:::

## Errores comunes

- **Suponer que toda matriz invertible tiene LU sin intercambios.** $\begin{pmatrix} 0 & 1 \\ 1 & 0 \end{pmatrix}$ es invertible y no la tiene.
- **Poner los multiplicadores con el signo de la operación.** Si la operación es $R_i \leftarrow R_i - 2R_k$, en $L$ se guarda $+2$.
- **Recalcular la factorización para cada lado derecho.** La ventaja de LU es factorizar una vez y reutilizar.
- **Ignorar el pivoteo en cálculo numérico.** Aunque no haya pivotes nulos, pivotes pequeños amplifican errores de redondeo.

## Conexiones

La descomposición LU registra la [[eliminacion-gaussiana]] con dos de las [[matrices-especiales]], las triangulares. Para matrices definidas positivas se convierte en la [[descomposicion-de-cholesky]], y junto con la [[descomposicion-qr]] es una de las factorizaciones básicas del cálculo numérico. Se usa para resolver [[sistemas-de-ecuaciones-lineales]] repetidos y para calcular [[determinante-como-factor-de-volumen|determinantes]].

## Formulario

:::formula[Factorización]
$$
A = LU, \qquad PA = LU
$$

- $L$: triangular inferior con unos en la diagonal.
- $U$: triangular superior.
- $P$: permutación de filas.
:::

:::formula[Multiplicadores]
$$
\ell_{ik} = \frac{a_{ik}^{(k)}}{a_{kk}^{(k)}}, \quad i > k
$$

- $a^{(k)}$: entradas en la etapa $k$ de la eliminación.
:::

:::formula[Resolución en dos pasos]
$$
L\mathbf{y} = \mathbf{b}, \qquad U\mathbf{x} = \mathbf{y}
$$

- $\mathbf{y}$: vector intermedio, obtenido por sustitución hacia adelante.
- $\mathbf{x}$: solución, obtenida por sustitución hacia atrás.
:::

:::formula[Determinante]
$$
\det A = \det P \cdot \prod_{i=1}^{n} u_{ii}
$$

- $\det P = \pm 1$ según la paridad de los intercambios.
:::
