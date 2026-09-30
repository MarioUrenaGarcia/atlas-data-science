---
id: descomposicion-qr
titulo: Descomposición QR
titulo_en: QR decomposition
alias:
  - factorización QR
  - QR reducida
  - QR delgada
modulo: 0
submodulo: '0.3'
orden: 26
nivel: basico
prerrequisitos:
  - proceso-de-gram-schmidt
  - matrices-especiales
etiquetas:
  - factorización
  - ortogonalidad
  - mínimos cuadrados
  - triangular
resumen: >
  La descomposición QR escribe A = QR con Q de columnas ortonormales y R triangular superior; es
  Gram-Schmidt escrito con matrices y la forma estable de resolver problemas de mínimos cuadrados.
formula: 'A = QR, \qquad Q^\top Q = I, \qquad r_{ij} = \mathbf{q}_i^\top\mathbf{a}_j'
visualizacion:
  componente: MatrixSteps
  parametros:
    modo: qr
    matrices:
      - nombre: 3 por 2
        matriz: [[1, 2], [2, 1], [2, 2]]
      - nombre: 3 por 3
        matriz: [[1, 1, 0], [1, 0, 1], [0, 1, 1]]
      - nombre: Columnas dependientes
        matriz: [[1, 2], [2, 4], [1, 2]]
referencias:
  - clave: strang
  - clave: hastie-esl
publicado: true
---

## Intuición

Las columnas de una matriz de datos suelen estar inclinadas unas respecto de otras: la estatura y el peso, por ejemplo, apuntan en direcciones parecidas. La descomposición QR separa cada matriz en dos piezas con papeles distintos. $Q$ contiene ejes perpendiculares y de longitud 1 que describen el mismo espacio que las columnas originales. $R$ dice cómo reconstruir cada columna original a partir de esos ejes, y es triangular porque la columna $j$ solo usa los primeros $j$ ejes.

Esa separación hace fácil lo que antes era difícil. Multiplicar por $Q$ no deforma longitudes, así que no amplifica errores, y resolver un sistema con $R$ triangular se hace despejando de abajo hacia arriba. Por eso la regresión por mínimos cuadrados se calcula con QR y no con la fórmula $(X^\top X)^{-1}X^\top\mathbf{y}$, que pierde precisión cuando las columnas están muy correlacionadas.

## Definición

:::definicion[Descomposición QR]
Si $A \in \mathbb{R}^{m \times n}$ con $m \ge n$ tiene columnas independientes, existe una factorización
$$
A = QR,
$$
con $Q \in \mathbb{R}^{m \times n}$ de columnas ortonormales ($Q^\top Q = I_n$) y $R \in \mathbb{R}^{n \times n}$ triangular superior con diagonal positiva. Las entradas son $r_{ij} = \mathbf{q}_i^\top\mathbf{a}_j$ para $i \le j$, y la factorización con diagonal positiva es única.
:::

Esta es la versión reducida o delgada. En la versión completa, $Q$ se extiende a una matriz ortogonal de $m \times m$ y $R$ se completa con filas de ceros.

:::nota[Qué significa cada símbolo]
- $A$: matriz de $m$ filas y $n$ columnas independientes.
- $\mathbf{a}_j$: columna $j$ de $A$.
- $Q$: matriz con columnas ortonormales $\mathbf{q}_1, \dots, \mathbf{q}_n$.
- $R$: matriz triangular superior con entradas $r_{ij}$.
- $I_n$: identidad de $n \times n$.
- $m, n$: número de filas y de columnas.
:::

## Cómo usar la visualización

El selector elige una matriz. Cada paso calcula una entrada de $R$: primero las componentes de la columna actual de $A$ sobre los $\mathbf{q}$ anteriores y después la longitud de lo que queda, que produce la nueva columna de $Q$. La columna de $A$ en uso se resalta, y la entrada recién calculada se marca en $R$. Al final aparece $Q^\top Q$, que resulta la identidad.

En la matriz de $3 \times 3$ se ven tres columnas de $Q$ construidas en orden. Con columnas dependientes, la segunda columna es el doble de la primera: lo que queda tras quitar la proyección es cero y el proceso se detiene.

## Ejemplo

Un experimento mide dos variables, $\mathbf{a}_1 = (3, 4, 0)$ y $\mathbf{a}_2 = (2, 1, 2)$, en tres parcelas. Se factoriza $A = [\mathbf{a}_1 \ \mathbf{a}_2]$.

1. $r_{11} = \lVert \mathbf{a}_1 \rVert = 5$ y $\mathbf{q}_1 = (0.6, 0.8, 0)$.
2. $r_{12} = \mathbf{q}_1 \cdot \mathbf{a}_2 = 1.2 + 0.8 + 0 = 2$.
3. Lo que queda: $\mathbf{a}_2 - 2\mathbf{q}_1 = (0.8, -0.6, 2)$, de longitud $r_{22} = \sqrt{0.64 + 0.36 + 4} = \sqrt{5} \approx 2.236$.
4. $\mathbf{q}_2 = (0.8, -0.6, 2)/\sqrt{5} \approx (0.358, -0.268, 0.894)$.
5. $R = \begin{pmatrix} 5 & 2 \\ 0 & 2.236 \end{pmatrix}$ y, por ejemplo, $\mathbf{a}_2 = 2\mathbf{q}_1 + 2.236\,\mathbf{q}_2$.

:::figura[La factorización de las dos variables del ejemplo, entrada por entrada. Al final QᵀQ es la identidad.]{componente="MatrixSteps"}
```yaml
modo: qr
matrices:
  - nombre: Parcelas
    matriz: [[3, 2], [4, 1], [0, 2]]
```
:::

:::figura[Las dos columnas del ejemplo en el espacio: generan un plano, el mismo que generan las columnas ortonormales de Q.]{componente="Space3D"}
```yaml
modo: generado
conjuntos:
  - nombre: Columnas de A
    vectores: [[3, 4, 0], [2, 1, 2]]
  - nombre: Columnas de Q (escaladas por 2)
    vectores: [[1.2, 1.6, 0], [0.716, -0.536, 1.788]]
```
:::

## Propiedades

- **Mínimos cuadrados:** la solución de $\min \lVert A\mathbf{x} - \mathbf{b} \rVert$ cumple $R\mathbf{x} = Q^\top\mathbf{b}$, que se resuelve por sustitución hacia atrás.
- **Proyección:** $QQ^\top$ es la matriz de proyección sobre el espacio columna de $A$.
- **Determinante:** si $A$ es cuadrada, $|\det A| = \prod_i r_{ii}$.
- **Estabilidad:** calculada con reflexiones de Householder, la factorización es numéricamente estable.
- **Relación con Cholesky:** $A^\top A = R^\top Q^\top QR = R^\top R$, así que $R^\top$ es el factor de Cholesky de $A^\top A$.
- **Algoritmo QR para valores propios:** iterar $A_k = Q_kR_k$, $A_{k+1} = R_kQ_k$ converge, bajo condiciones generales, a una forma triangular con los valores propios en la diagonal.

:::demostracion
Mínimos cuadrados: $\lVert A\mathbf{x} - \mathbf{b} \rVert^2 = \lVert QR\mathbf{x} - QQ^\top\mathbf{b} \rVert^2 + \lVert (I - QQ^\top)\mathbf{b} \rVert^2$. El segundo término no depende de $\mathbf{x}$ y el primero vale $\lVert R\mathbf{x} - Q^\top\mathbf{b} \rVert^2$, que es cero con $R\mathbf{x} = Q^\top\mathbf{b}$.
:::

## Errores comunes

- **Esperar que $Q$ sea cuadrada.** En la versión reducida es de $m \times n$ y $QQ^\top \neq I$ si $m > n$; solo $Q^\top Q = I$.
- **Aplicarla con columnas dependientes esperando $R$ invertible.** Aparece un cero en la diagonal de $R$.
- **Resolver mínimos cuadrados con $(A^\top A)^{-1}$ por costumbre.** Formar $A^\top A$ eleva al cuadrado el número de condición; QR lo evita.
- **Confundir QR con LU.** LU usa eliminación y matrices triangulares; QR usa ortogonalización y una matriz ortogonal.

## Conexiones

La descomposición QR es el [[proceso-de-gram-schmidt]] escrito con [[matrices-especiales]]: una ortogonal y una triangular. Se contrasta con la [[descomposicion-lu]] y se relaciona con la [[descomposicion-de-cholesky]] de $A^\top A$. Resuelve los problemas de [[proyeccion-ortogonal]] y de mínimos cuadrados de forma estable, algo importante cuando el [[numero-de-condicion]] es grande.

## Formulario

:::formula[Factorización]
$$
A = QR, \qquad Q^\top Q = I, \qquad r_{ij} = 0 \ (i > j)
$$

- $Q$: columnas ortonormales.
- $R$: triangular superior.
:::

:::formula[Entradas de R]
$$
r_{ij} = \mathbf{q}_i^\top\mathbf{a}_j \ (i < j), \qquad r_{jj} = \Big\lVert \mathbf{a}_j - \sum_{i<j} r_{ij}\mathbf{q}_i \Big\rVert
$$

- $\mathbf{a}_j$: columna $j$ de $A$.
- $\mathbf{q}_i$: columna $i$ de $Q$.
:::

:::formula[Mínimos cuadrados]
$$
R\,\hat{\mathbf{x}} = Q^\top\mathbf{b}
$$

- $\hat{\mathbf{x}}$: solución de mínimos cuadrados.
- $\mathbf{b}$: vector de observaciones.
:::

:::formula[Proyección]
$$
P = QQ^\top
$$

- $P$: proyección sobre el espacio columna de $A$.
:::
