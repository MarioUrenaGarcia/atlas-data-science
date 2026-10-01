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
formula: '\mathbf{A} = \mathbf{Q}\mathbf{R}, \qquad \mathbf{Q}^\top \mathbf{Q} = \mathbf{I}, \qquad r_{ij} = \mathbf{q}_i^\top\mathbf{a}_j'
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

Las columnas de una matriz de datos suelen estar inclinadas unas respecto de otras: la estatura y el peso, por ejemplo, apuntan en direcciones parecidas. La descomposición QR separa cada matriz en dos piezas con papeles distintos. $\mathbf{Q}$ contiene ejes perpendiculares y de longitud 1 que describen el mismo espacio que las columnas originales. $\mathbf{R}$ dice cómo reconstruir cada columna original a partir de esos ejes, y es triangular porque la columna $j$ solo usa los primeros $j$ ejes.

Esa separación hace fácil lo que antes era difícil. Multiplicar por $\mathbf{Q}$ no deforma longitudes, así que no amplifica errores, y resolver un sistema con $\mathbf{R}$ triangular se hace despejando de abajo hacia arriba. Por eso la regresión por mínimos cuadrados se calcula con QR y no con la fórmula $(\mathbf{X}^\top \mathbf{X})^{-1}\mathbf{X}^\top\mathbf{y}$, que pierde precisión cuando las columnas están muy correlacionadas.

## Definición

:::definicion[Descomposición QR]
Si $\mathbf{A} \in \mathbb{R}^{m \times n}$ con $m \ge n$ tiene columnas independientes, existe una factorización
$$
\mathbf{A} = \mathbf{Q}\mathbf{R},
$$
con $\mathbf{Q} \in \mathbb{R}^{m \times n}$ de columnas ortonormales ($\mathbf{Q}^\top \mathbf{Q} = \mathbf{I}_n$) y $\mathbf{R} \in \mathbb{R}^{n \times n}$ triangular superior con diagonal positiva. Las entradas son $r_{ij} = \mathbf{q}_i^\top\mathbf{a}_j$ para $i \le j$, y la factorización con diagonal positiva es única.
:::

Esta es la versión reducida o delgada. En la versión completa, $\mathbf{Q}$ se extiende a una matriz ortogonal de $m \times m$ y $\mathbf{R}$ se completa con filas de ceros.

:::nota[Qué significa cada símbolo]
- $\mathbf{A}$: matriz de $m$ filas y $n$ columnas independientes.
- $\mathbf{a}_j$: columna $j$ de $\mathbf{A}$.
- $\mathbf{Q}$: matriz con columnas ortonormales $\mathbf{q}_1, \dots, \mathbf{q}_n$.
- $\mathbf{R}$: matriz triangular superior con entradas $r_{ij}$.
- $\mathbf{I}_n$: identidad de $n \times n$.
- $m, n$: número de filas y de columnas.
:::

## Cómo usar la visualización

El selector elige una matriz. Cada paso calcula una entrada de $\mathbf{R}$: primero las componentes de la columna actual de $\mathbf{A}$ sobre los $\mathbf{q}$ anteriores y después la longitud de lo que queda, que produce la nueva columna de $\mathbf{Q}$. La columna de $\mathbf{A}$ en uso se resalta, y la entrada recién calculada se marca en $\mathbf{R}$. Al final aparece $\mathbf{Q}^\top \mathbf{Q}$, que resulta la identidad.

En la matriz de $3 \times 3$ se ven tres columnas de $\mathbf{Q}$ construidas en orden. Con columnas dependientes, la segunda columna es el doble de la primera: lo que queda tras quitar la proyección es cero y el proceso se detiene.

## Ejemplo

Un experimento mide dos variables, $\mathbf{a}_1 = (3, 4, 0)$ y $\mathbf{a}_2 = (2, 1, 2)$, en tres parcelas. Se factoriza $\mathbf{A} = [\mathbf{a}_1 \ \mathbf{a}_2]$.

1. $r_{11} = \lVert \mathbf{a}_1 \rVert = 5$ y $\mathbf{q}_1 = (0.6, 0.8, 0)$.
2. $r_{12} = \mathbf{q}_1 \cdot \mathbf{a}_2 = 1.2 + 0.8 + 0 = 2$.
3. Lo que queda: $\mathbf{a}_2 - 2\mathbf{q}_1 = (0.8, -0.6, 2)$, de longitud $r_{22} = \sqrt{0.64 + 0.36 + 4} = \sqrt{5} \approx 2.236$.
4. $\mathbf{q}_2 = (0.8, -0.6, 2)/\sqrt{5} \approx (0.358, -0.268, 0.894)$.
5. $\mathbf{R} = \begin{pmatrix} 5 & 2 \\ 0 & 2.236 \end{pmatrix}$ y, por ejemplo, $\mathbf{a}_2 = 2\mathbf{q}_1 + 2.236\,\mathbf{q}_2$.

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

- **Mínimos cuadrados:** la solución de $\min \lVert \mathbf{A}\mathbf{x} - \mathbf{b} \rVert$ cumple $\mathbf{R}\mathbf{x} = \mathbf{Q}^\top\mathbf{b}$, que se resuelve por sustitución hacia atrás.
- **Proyección:** $\mathbf{Q}\mathbf{Q}^\top$ es la matriz de proyección sobre el espacio columna de $\mathbf{A}$.
- **Determinante:** si $\mathbf{A}$ es cuadrada, $|\det \mathbf{A}| = \prod_i r_{ii}$.
- **Estabilidad:** calculada con reflexiones de Householder, la factorización es numéricamente estable.
- **Relación con Cholesky:** $\mathbf{A}^\top \mathbf{A} = \mathbf{R}^\top \mathbf{Q}^\top \mathbf{Q}\mathbf{R} = \mathbf{R}^\top \mathbf{R}$, así que $\mathbf{R}^\top$ es el factor de Cholesky de $\mathbf{A}^\top \mathbf{A}$.
- **Algoritmo QR para valores propios:** iterar $\mathbf{A}_k = \mathbf{Q}_kR_k$, $\mathbf{A}_{k+1} = \mathbf{R}_kQ_k$ converge, bajo condiciones generales, a una forma triangular con los valores propios en la diagonal.

:::demostracion
Mínimos cuadrados: $\lVert \mathbf{A}\mathbf{x} - \mathbf{b} \rVert^2 = \lVert \mathbf{Q}\mathbf{R}\mathbf{x} - \mathbf{Q}\mathbf{Q}^\top\mathbf{b} \rVert^2 + \lVert (\mathbf{I} - \mathbf{Q}\mathbf{Q}^\top)\mathbf{b} \rVert^2$. El segundo término no depende de $\mathbf{x}$ y el primero vale $\lVert \mathbf{R}\mathbf{x} - \mathbf{Q}^\top\mathbf{b} \rVert^2$, que es cero con $\mathbf{R}\mathbf{x} = \mathbf{Q}^\top\mathbf{b}$.
:::

## Errores comunes

- **Esperar que $\mathbf{Q}$ sea cuadrada.** En la versión reducida es de $m \times n$ y $\mathbf{Q}\mathbf{Q}^\top \neq \mathbf{I}$ si $m > n$; solo $\mathbf{Q}^\top \mathbf{Q} = \mathbf{I}$.
- **Aplicarla con columnas dependientes esperando $\mathbf{R}$ invertible.** Aparece un cero en la diagonal de $\mathbf{R}$.
- **Resolver mínimos cuadrados con $(\mathbf{A}^\top \mathbf{A})^{-1}$ por costumbre.** Formar $\mathbf{A}^\top \mathbf{A}$ eleva al cuadrado el número de condición; QR lo evita.
- **Confundir QR con LU.** LU usa eliminación y matrices triangulares; QR usa ortogonalización y una matriz ortogonal.

## Conexiones

La descomposición QR es el [[proceso-de-gram-schmidt]] escrito con [[matrices-especiales]]: una ortogonal y una triangular. Se contrasta con la [[descomposicion-lu]] y se relaciona con la [[descomposicion-de-cholesky]] de $\mathbf{A}^\top \mathbf{A}$. Resuelve los problemas de [[proyeccion-ortogonal]] y de mínimos cuadrados de forma estable, algo importante cuando el [[numero-de-condicion]] es grande.

## Formulario

:::formula[Factorización]
$$
\mathbf{A} = \mathbf{Q}\mathbf{R}, \qquad \mathbf{Q}^\top \mathbf{Q} = \mathbf{I}, \qquad r_{ij} = 0 \ (i > j)
$$

- $\mathbf{Q}$: columnas ortonormales.
- $\mathbf{R}$: triangular superior.
:::

:::formula[Entradas de R]
$$
r_{ij} = \mathbf{q}_i^\top\mathbf{a}_j \ (i < j), \qquad r_{jj} = \Big\lVert \mathbf{a}_j - \sum_{i<j} r_{ij}\mathbf{q}_i \Big\rVert
$$

- $\mathbf{a}_j$: columna $j$ de $\mathbf{A}$.
- $\mathbf{q}_i$: columna $i$ de $\mathbf{Q}$.
:::

:::formula[Mínimos cuadrados]
$$
\mathbf{R}\,\hat{\mathbf{x}} = \mathbf{Q}^\top\mathbf{b}
$$

- $\hat{\mathbf{x}}$: solución de mínimos cuadrados.
- $\mathbf{b}$: vector de observaciones.
:::

:::formula[Proyección]
$$
\mathbf{P} = \mathbf{Q}\mathbf{Q}^\top
$$

- $\mathbf{P}$: proyección sobre el espacio columna de $\mathbf{A}$.
:::
