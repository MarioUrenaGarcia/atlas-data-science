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
formula: '\mathbf{A} = \mathbf{L}\mathbf{U}, \qquad \ell_{ik} = \frac{a_{ik}^{(k)}}{a_{kk}^{(k)}}, \qquad \mathbf{P}\mathbf{A} = \mathbf{L}\mathbf{U}'
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

La eliminación gaussiana hace mucho trabajo sobre la matriz y muy poco sobre el lado derecho. Si una misma matriz tiene que resolverse con cien lados derechos distintos, como un puente que se analiza bajo cien cargas, repetir la eliminación cien veces desperdicia casi todo el esfuerzo. La descomposición LU guarda el trabajo hecho: la matriz $\mathbf{U}$ es lo que queda al final de la eliminación y la matriz $\mathbf{L}$ anota los multiplicadores que se usaron.

Con eso, cada sistema nuevo se resuelve en dos pasos baratos. Primero se aplica al lado derecho la misma eliminación, leyéndola de $\mathbf{L}$ con sustitución hacia adelante; después se despeja con $\mathbf{U}$ de abajo hacia arriba. Resolver un sistema triangular cuesta del orden de $n^2$ operaciones, frente a las $n^3$ de la eliminación completa. Cuando aparece un pivote nulo hay que intercambiar filas, y la factorización se escribe $\mathbf{P}\mathbf{A} = \mathbf{L}\mathbf{U}$ con una matriz de permutación $\mathbf{P}$.

## Definición

:::definicion[Factorización LU]
Una matriz cuadrada $\mathbf{A}$ admite **factorización LU** si
$$
\mathbf{A} = \mathbf{L}\mathbf{U},
$$
con $\mathbf{L}$ triangular inferior con unos en la diagonal y $\mathbf{U}$ triangular superior. La entrada $\ell_{ik}$ ($i > k$) de $\mathbf{L}$ es el multiplicador usado en la eliminación para anular la posición $(i, k)$.
:::

:::teorema[Existencia]
$\mathbf{A}$ tiene factorización LU sin intercambios si todos sus menores principales $\det \mathbf{A}_{1:k,\,1:k}$ para $k = 1, \dots, n - 1$ son distintos de cero. Toda matriz cuadrada tiene una factorización $\mathbf{P}\mathbf{A} = \mathbf{L}\mathbf{U}$ con $\mathbf{P}$ de permutación.
:::

:::nota[Qué significa cada símbolo]
- $\mathbf{A}$: matriz cuadrada de $n \times n$.
- $\mathbf{L}$: triangular inferior con unos en la diagonal.
- $\mathbf{U}$: triangular superior.
- $\ell_{ik}$: multiplicador en la fila $i$, columna $k$ de $\mathbf{L}$.
- $a_{ik}^{(k)}$: entrada $(i, k)$ en la etapa $k$ de la eliminación.
- $\mathbf{P}$: matriz de permutación que registra los intercambios de filas.
- $\mathbf{A}_{1:k,\,1:k}$: submatriz formada por las primeras $k$ filas y columnas.
:::

## Cómo usar la visualización

A la izquierda se construye $\mathbf{L}$ y a la derecha $\mathbf{U}$. Cada paso anula una entrada de $\mathbf{U}$ con una operación de fila y guarda el multiplicador, resaltado, en la misma posición de $\mathbf{L}$. Al terminar aparece el producto $\mathbf{L}\mathbf{U}$, que reproduce la matriz original, y el panel muestra el determinante como producto de la diagonal de $\mathbf{U}$.

Con la matriz sin intercambios, los multiplicadores 2, 3 y 1 llenan la parte inferior de $\mathbf{L}$. Con la matriz de pivote nulo el proceso se detiene en el primer paso: sin intercambiar filas no hay factorización.

## Ejemplo

Se factoriza $\mathbf{A} = \begin{pmatrix} 2 & 1 & 1 \\ 4 & -6 & 0 \\ -2 & 7 & 2 \end{pmatrix}$, la matriz de rigidez de una estructura pequeña, y se resuelve $\mathbf{A}\mathbf{x} = (5, -2, 9)^\top$.

1. Multiplicadores de la columna 1: $\ell_{21} = 4/2 = 2$ y $\ell_{31} = -2/2 = -1$. Las filas quedan $(0, -8, -2)$ y $(0, 8, 3)$.
2. Multiplicador de la columna 2: $\ell_{32} = 8/(-8) = -1$. La última fila queda $(0, 0, 1)$.
3. $\mathbf{L} = \begin{pmatrix} 1 & 0 & 0 \\ 2 & 1 & 0 \\ -1 & -1 & 1 \end{pmatrix}$ y $\mathbf{U} = \begin{pmatrix} 2 & 1 & 1 \\ 0 & -8 & -2 \\ 0 & 0 & 1 \end{pmatrix}$.
4. Hacia adelante, $\mathbf{L}\mathbf{y} = \mathbf{b}$: $y_1 = 5$, $y_2 = -2 - 10 = -12$, $y_3 = 9 + 5 - 12 = 2$.
5. Hacia atrás, $\mathbf{U}\mathbf{x} = \mathbf{y}$: $x_3 = 2$, $-8x_2 - 4 = -12$ da $x_2 = 1$, y $2x_1 + 1 + 2 = 5$ da $x_1 = 1$.

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
- **Determinante:** $\det \mathbf{A} = \det \mathbf{U} = \prod_i u_{ii}$ si no hay intercambios; con $\mathbf{P}\mathbf{A} = \mathbf{L}\mathbf{U}$ se multiplica por $\det \mathbf{P} = \pm 1$.
- **Unicidad:** si $\mathbf{A}$ es invertible y tiene factorización LU con unos en la diagonal de $\mathbf{L}$, esta es única.
- **Variante LDU:** $\mathbf{A} = \mathbf{L}\mathbf{D}\mathbf{U}'$ con $\mathbf{D}$ diagonal (los pivotes) y $\mathbf{U}'$ con unos en la diagonal.
- **Matrices simétricas definidas positivas:** la factorización se simplifica a $\mathbf{A} = \mathbf{L}\mathbf{L}^\top$, la de Cholesky.
- **Inversa de $\mathbf{L}$:** es triangular inferior y se obtiene cambiando el signo de los multiplicadores debajo de la diagonal en el caso de una sola columna.

:::figura[Casos de las dos matrices triangulares que produce la factorización: la inferior con ceros encima de la diagonal y la superior con ceros debajo.]{componente="MatrixGrid"}
```yaml
modo: especiales
tipos: [triangular-inferior, triangular-superior]
n: 4
```
:::

:::demostracion
Cada reemplazo $R_i \leftarrow R_i - \ell_{ik}R_k$ equivale a multiplicar por la izquierda por $\mathbf{E}_{ik} = \mathbf{I} - \ell_{ik}\mathbf{e}_i\mathbf{e}_k^\top$. La eliminación da $\mathbf{E}\,\mathbf{A} = \mathbf{U}$ con $\mathbf{E}$ el producto de esas matrices, que es triangular inferior e invertible. Entonces $\mathbf{A} = \mathbf{E}^{-1}\mathbf{U}$, y $\mathbf{E}^{-1}$ resulta ser la matriz $\mathbf{L}$ con los multiplicadores en sus posiciones.
:::

## Errores comunes

- **Suponer que toda matriz invertible tiene LU sin intercambios.** $\begin{pmatrix} 0 & 1 \\ 1 & 0 \end{pmatrix}$ es invertible y no la tiene.
- **Poner los multiplicadores con el signo de la operación.** Si la operación es $R_i \leftarrow R_i - 2R_k$, en $\mathbf{L}$ se guarda $+2$.
- **Recalcular la factorización para cada lado derecho.** La ventaja de LU es factorizar una vez y reutilizar.
- **Ignorar el pivoteo en cálculo numérico.** Aunque no haya pivotes nulos, pivotes pequeños amplifican errores de redondeo.

## Conexiones

La descomposición LU registra la [[eliminacion-gaussiana]] con dos de las [[matrices-especiales]], las triangulares. Para matrices definidas positivas se convierte en la [[descomposicion-de-cholesky]], y junto con la [[descomposicion-qr]] es una de las factorizaciones básicas del cálculo numérico. Se usa para resolver [[sistemas-de-ecuaciones-lineales]] repetidos y para calcular [[determinante-como-factor-de-volumen|determinantes]].

## Formulario

:::formula[Factorización]
$$
\mathbf{A} = \mathbf{L}\mathbf{U}, \qquad \mathbf{P}\mathbf{A} = \mathbf{L}\mathbf{U}
$$

- $\mathbf{L}$: triangular inferior con unos en la diagonal.
- $\mathbf{U}$: triangular superior.
- $\mathbf{P}$: permutación de filas.
:::

:::formula[Multiplicadores]
$$
\ell_{ik} = \frac{a_{ik}^{(k)}}{a_{kk}^{(k)}}, \quad i > k
$$

- $a^{(k)}$: entradas en la etapa $k$ de la eliminación.
:::

:::formula[Resolución en dos pasos]
$$
\mathbf{L}\mathbf{y} = \mathbf{b}, \qquad \mathbf{U}\mathbf{x} = \mathbf{y}
$$

- $\mathbf{y}$: vector intermedio, obtenido por sustitución hacia adelante.
- $\mathbf{x}$: solución, obtenida por sustitución hacia atrás.
:::

:::formula[Determinante]
$$
\det \mathbf{A} = \det \mathbf{P} \cdot \prod_{i=1}^{n} u_{ii}
$$

- $\det \mathbf{P} = \pm 1$ según la paridad de los intercambios.
:::
