---
id: traza-de-una-matriz
titulo: Traza de una matriz
titulo_en: Trace of a matrix
alias:
  - traza
  - trace
modulo: 0
submodulo: '0.3'
orden: 38
nivel: basico
prerrequisitos:
  - valores-y-vectores-propios
etiquetas:
  - traza
  - diagonal
  - valores propios
  - varianza total
resumen: >
  La traza de una matriz cuadrada es la suma de su diagonal; es lineal, cumple tr(AB) = tr(BA) y es igual a
  la suma de los valores propios.
formula: '\operatorname{tr}\mathbf{A} = \sum_{i=1}^{n} a_{ii} = \sum_{i=1}^{n}\lambda_i, \qquad \operatorname{tr}(\mathbf{A}\mathbf{B}) = \operatorname{tr}(\mathbf{B}\mathbf{A})'
visualizacion:
  componente: MatrixGrid
  parametros:
    modo: traza
    a: [[4, 1, 2], [0, -1, 3], [2, 5, 2]]
    b: [[1, 2, 0], [0, 1, 1], [3, 0, 2]]
referencias:
  - clave: strang
  - clave: goodfellow
    capitulo: '2'
publicado: true
---

## Intuición

La traza es la cuenta más sencilla que se puede hacer con una matriz: sumar los números de la diagonal. Parece demasiado simple para importar, pero tiene una propiedad notable: no depende de la base en la que se escriba la transformación. Si se cambian los ejes, la matriz cambia por completo, pero la suma de su diagonal sigue igual, y coincide siempre con la suma de los valores propios.

En estadística aparece con un significado concreto: la traza de una matriz de covarianzas es la varianza total, la suma de las varianzas de todas las variables. Al rotar los datos para ver sus componentes principales, la varianza se redistribuye entre las nuevas direcciones pero su total no cambia, porque es una traza.

## Definición

:::definicion[Traza]
Para $\mathbf{A} \in \mathbb{R}^{n \times n}$,
$$
\operatorname{tr}\mathbf{A} = a_{11} + a_{22} + \dots + a_{nn} = \sum_{i=1}^{n} a_{ii}.
$$
:::

:::teorema[Traza y valores propios]
Si $\lambda_1, \dots, \lambda_n$ son los valores propios de $\mathbf{A}$ contados con multiplicidad (posiblemente complejos), entonces $\operatorname{tr}\mathbf{A} = \lambda_1 + \dots + \lambda_n$.
:::

:::nota[Qué significa cada símbolo]
- $\mathbf{A}$: matriz cuadrada de $n \times n$.
- $a_{ii}$: entrada $i$ de la diagonal.
- $\operatorname{tr}\mathbf{A}$: traza de $\mathbf{A}$.
- $\lambda_i$: valores propios de $\mathbf{A}$.
- $n$: tamaño de la matriz.
:::

## Cómo usar la visualización

Cada paso suma una entrada de la diagonal de $\mathbf{A}$, resaltada, mientras el resto de la matriz aparece atenuado; la fórmula muestra la suma parcial. Al terminar se muestran $\mathbf{A}\mathbf{B}$ y $\mathbf{B}\mathbf{A}$ con sus diagonales resaltadas. El panel lista las trazas de $\mathbf{A}$, $\mathbf{B}$, $\mathbf{A} + \mathbf{B}$, $\mathbf{A}\mathbf{B}$ y $\mathbf{B}\mathbf{A}$.

Las matrices $\mathbf{A}\mathbf{B}$ y $\mathbf{B}\mathbf{A}$ son claramente distintas, pero sus diagonales suman lo mismo. La traza de $\mathbf{A} + \mathbf{B}$ es la suma de las trazas. Las entradas fuera de la diagonal no intervienen en la traza de $\mathbf{A}$.

## Ejemplo

Tres indicadores de salud de un grupo de pacientes tienen matriz de covarianzas $\boldsymbol{\\Sigma} = \begin{pmatrix} 4 & 1 & 0 \\ 1 & 9 & 2 \\ 0 & 2 & 1 \end{pmatrix}$.

1. Varianza total: $\operatorname{tr}\boldsymbol{\\Sigma} = 4 + 9 + 1 = 14$.
2. La covarianza entre indicadores (entradas fuera de la diagonal) no cambia ese total.
3. Si los datos se rotan a sus componentes principales, las varianzas nuevas son los valores propios de $\boldsymbol{\\Sigma}$, y también suman 14.
4. La proporción de varianza explicada por una componente es su valor propio dividido entre 14.
5. Con la matriz $\mathbf{D} = \operatorname{diag}(1, 2, 3)$: $\operatorname{tr}(\boldsymbol{\\Sigma} \mathbf{D}) = 4 + 18 + 3 = 25 = \operatorname{tr}(\mathbf{D}\boldsymbol{\\Sigma})$.

:::figura[La matriz de covarianzas del ejemplo y la diagonal D: la traza de Σ es 14 y la de ΣD coincide con la de DΣ.]{componente="MatrixGrid"}
```yaml
modo: traza
a: [[4, 1, 0], [1, 9, 2], [0, 2, 1]]
b: [[1, 0, 0], [0, 2, 0], [0, 0, 3]]
```
:::

## Propiedades

- **Linealidad:** $\operatorname{tr}(\mathbf{A} + \mathbf{B}) = \operatorname{tr}\mathbf{A} + \operatorname{tr}\mathbf{B}$ y $\operatorname{tr}(cA) = c\operatorname{tr}\mathbf{A}$.
- **Transpuesta:** $\operatorname{tr}\mathbf{A}^\top = \operatorname{tr}\mathbf{A}$.
- **Propiedad cíclica:** $\operatorname{tr}(\mathbf{A}\mathbf{B}) = \operatorname{tr}(\mathbf{B}\mathbf{A})$ y $\operatorname{tr}(\mathbf{A}\mathbf{B}\mathbf{C}) = \operatorname{tr}(\mathbf{B}\mathbf{C}\mathbf{A}) = \operatorname{tr}(\mathbf{C}\mathbf{A}\mathbf{B})$, aunque los productos sean distintos.
- **Invariancia por semejanza:** $\operatorname{tr}(\mathbf{P}^{-1}\mathbf{A}\mathbf{P}) = \operatorname{tr}\mathbf{A}$.
- **Norma de Frobenius:** $\lVert \mathbf{A} \rVert_F^2 = \operatorname{tr}(\mathbf{A}^\top \mathbf{A})$.
- **Formas cuadráticas:** $\mathbf{x}^\top \mathbf{A}\mathbf{x} = \operatorname{tr}(\mathbf{A}\mathbf{x}\mathbf{x}^\top)$, truco usado para calcular esperanzas de formas cuadráticas.

:::figura[Caso de la relación con los valores propios: la matriz [[3, 1], [2, 2]] tiene traza 5 y valores propios 4 y 1, que suman 5.]{componente="MatrixTransform"}
```yaml
modo: transformacion
propios: true
matrices:
  - nombre: Traza 5
    matriz: [[3, 1], [2, 2]]
```
:::

:::demostracion
Propiedad cíclica: $\operatorname{tr}(\mathbf{A}\mathbf{B}) = \sum_i (\mathbf{A}\mathbf{B})_{ii} = \sum_i\sum_k a_{ik}b_{ki} = \sum_k\sum_i b_{ki}a_{ik} = \sum_k (\mathbf{B}\mathbf{A})_{kk} = \operatorname{tr}(\mathbf{B}\mathbf{A})$.
:::

## Errores comunes

- **Escribir $\operatorname{tr}(\mathbf{A}\mathbf{B}) = \operatorname{tr}\mathbf{A}\,\operatorname{tr}\mathbf{B}$.** La traza no es multiplicativa; $\operatorname{tr}(\mathbf{I}_2 \mathbf{I}_2) = 2 \neq 4$.
- **Reordenar libremente los factores.** Solo se permiten permutaciones cíclicas: $\operatorname{tr}(\mathbf{A}\mathbf{B}\mathbf{C}) \neq \operatorname{tr}(\mathbf{A}\mathbf{C}\mathbf{B})$ en general.
- **Hablar de la traza de una matriz no cuadrada.** Solo está definida para matrices cuadradas, aunque $\mathbf{A}\mathbf{B}$ y $\mathbf{B}\mathbf{A}$ puedan serlo con $\mathbf{A}$ y $\mathbf{B}$ rectangulares.
- **Confundir traza con determinante.** La traza suma los valores propios; el determinante los multiplica.

## Conexiones

La traza es la suma de los [[valores-y-vectores-propios|valores propios]] y aparece como coeficiente del [[polinomio-caracteristico]]. No cambia con el [[cambio-de-base]] y define la norma de Frobenius de las [[normas-matriciales]]. En estadística, la varianza total es la traza de la covarianza, y los grados de libertad efectivos de una regresión regularizada son la traza de su matriz de suavizado.

## Formulario

:::formula[Traza]
$$
\operatorname{tr}\mathbf{A} = \sum_{i=1}^{n} a_{ii}
$$

- $a_{ii}$: entradas de la diagonal.
:::

:::formula[Traza y valores propios]
$$
\operatorname{tr}\mathbf{A} = \sum_{i=1}^{n}\lambda_i
$$

- $\lambda_i$: valores propios con multiplicidad.
:::

:::formula[Propiedad cíclica]
$$
\operatorname{tr}(\mathbf{A}\mathbf{B}) = \operatorname{tr}(\mathbf{B}\mathbf{A}), \qquad \operatorname{tr}(\mathbf{A}\mathbf{B}\mathbf{C}) = \operatorname{tr}(\mathbf{C}\mathbf{A}\mathbf{B})
$$

- $\mathbf{A}, \mathbf{B}, \mathbf{C}$: matrices de tamaños compatibles.
:::

:::formula[Frobenius]
$$
\lVert \mathbf{A} \rVert_F^2 = \operatorname{tr}(\mathbf{A}^\top \mathbf{A}) = \sum_{i,j} a_{ij}^2
$$

- $\lVert \mathbf{A} \rVert_F$: norma de Frobenius.
:::
