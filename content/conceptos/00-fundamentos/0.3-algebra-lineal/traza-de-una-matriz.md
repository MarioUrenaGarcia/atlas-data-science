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
formula: '\operatorname{tr}A = \sum_{i=1}^{n} a_{ii} = \sum_{i=1}^{n}\lambda_i, \qquad \operatorname{tr}(AB) = \operatorname{tr}(BA)'
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
Para $A \in \mathbb{R}^{n \times n}$,
$$
\operatorname{tr}A = a_{11} + a_{22} + \dots + a_{nn} = \sum_{i=1}^{n} a_{ii}.
$$
:::

:::teorema[Traza y valores propios]
Si $\lambda_1, \dots, \lambda_n$ son los valores propios de $A$ contados con multiplicidad (posiblemente complejos), entonces $\operatorname{tr}A = \lambda_1 + \dots + \lambda_n$.
:::

:::nota[Qué significa cada símbolo]
- $A$: matriz cuadrada de $n \times n$.
- $a_{ii}$: entrada $i$ de la diagonal.
- $\operatorname{tr}A$: traza de $A$.
- $\lambda_i$: valores propios de $A$.
- $n$: tamaño de la matriz.
:::

## Cómo usar la visualización

Cada paso suma una entrada de la diagonal de $A$, resaltada, mientras el resto de la matriz aparece atenuado; la fórmula muestra la suma parcial. Al terminar se muestran $AB$ y $BA$ con sus diagonales resaltadas. El panel lista las trazas de $A$, $B$, $A + B$, $AB$ y $BA$.

Las matrices $AB$ y $BA$ son claramente distintas, pero sus diagonales suman lo mismo. La traza de $A + B$ es la suma de las trazas. Las entradas fuera de la diagonal no intervienen en la traza de $A$.

## Ejemplo

Tres indicadores de salud de un grupo de pacientes tienen matriz de covarianzas $\Sigma = \begin{pmatrix} 4 & 1 & 0 \\ 1 & 9 & 2 \\ 0 & 2 & 1 \end{pmatrix}$.

1. Varianza total: $\operatorname{tr}\Sigma = 4 + 9 + 1 = 14$.
2. La covarianza entre indicadores (entradas fuera de la diagonal) no cambia ese total.
3. Si los datos se rotan a sus componentes principales, las varianzas nuevas son los valores propios de $\Sigma$, y también suman 14.
4. La proporción de varianza explicada por una componente es su valor propio dividido entre 14.
5. Con la matriz $D = \operatorname{diag}(1, 2, 3)$: $\operatorname{tr}(\Sigma D) = 4 + 18 + 3 = 25 = \operatorname{tr}(D\Sigma)$.

:::figura[La matriz de covarianzas del ejemplo y la diagonal D: la traza de Σ es 14 y la de ΣD coincide con la de DΣ.]{componente="MatrixGrid"}
```yaml
modo: traza
a: [[4, 1, 0], [1, 9, 2], [0, 2, 1]]
b: [[1, 0, 0], [0, 2, 0], [0, 0, 3]]
```
:::

## Propiedades

- **Linealidad:** $\operatorname{tr}(A + B) = \operatorname{tr}A + \operatorname{tr}B$ y $\operatorname{tr}(cA) = c\operatorname{tr}A$.
- **Transpuesta:** $\operatorname{tr}A^\top = \operatorname{tr}A$.
- **Propiedad cíclica:** $\operatorname{tr}(AB) = \operatorname{tr}(BA)$ y $\operatorname{tr}(ABC) = \operatorname{tr}(BCA) = \operatorname{tr}(CAB)$, aunque los productos sean distintos.
- **Invariancia por semejanza:** $\operatorname{tr}(P^{-1}AP) = \operatorname{tr}A$.
- **Norma de Frobenius:** $\lVert A \rVert_F^2 = \operatorname{tr}(A^\top A)$.
- **Formas cuadráticas:** $\mathbf{x}^\top A\mathbf{x} = \operatorname{tr}(A\mathbf{x}\mathbf{x}^\top)$, truco usado para calcular esperanzas de formas cuadráticas.

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
Propiedad cíclica: $\operatorname{tr}(AB) = \sum_i (AB)_{ii} = \sum_i\sum_k a_{ik}b_{ki} = \sum_k\sum_i b_{ki}a_{ik} = \sum_k (BA)_{kk} = \operatorname{tr}(BA)$.
:::

## Errores comunes

- **Escribir $\operatorname{tr}(AB) = \operatorname{tr}A\,\operatorname{tr}B$.** La traza no es multiplicativa; $\operatorname{tr}(I_2 I_2) = 2 \neq 4$.
- **Reordenar libremente los factores.** Solo se permiten permutaciones cíclicas: $\operatorname{tr}(ABC) \neq \operatorname{tr}(ACB)$ en general.
- **Hablar de la traza de una matriz no cuadrada.** Solo está definida para matrices cuadradas, aunque $AB$ y $BA$ puedan serlo con $A$ y $B$ rectangulares.
- **Confundir traza con determinante.** La traza suma los valores propios; el determinante los multiplica.

## Conexiones

La traza es la suma de los [[valores-y-vectores-propios|valores propios]] y aparece como coeficiente del [[polinomio-caracteristico]]. No cambia con el [[cambio-de-base]] y define la norma de Frobenius de las [[normas-matriciales]]. En estadística, la varianza total es la traza de la covarianza, y los grados de libertad efectivos de una regresión regularizada son la traza de su matriz de suavizado.

## Formulario

:::formula[Traza]
$$
\operatorname{tr}A = \sum_{i=1}^{n} a_{ii}
$$

- $a_{ii}$: entradas de la diagonal.
:::

:::formula[Traza y valores propios]
$$
\operatorname{tr}A = \sum_{i=1}^{n}\lambda_i
$$

- $\lambda_i$: valores propios con multiplicidad.
:::

:::formula[Propiedad cíclica]
$$
\operatorname{tr}(AB) = \operatorname{tr}(BA), \qquad \operatorname{tr}(ABC) = \operatorname{tr}(CAB)
$$

- $A, B, C$: matrices de tamaños compatibles.
:::

:::formula[Frobenius]
$$
\lVert A \rVert_F^2 = \operatorname{tr}(A^\top A) = \sum_{i,j} a_{ij}^2
$$

- $\lVert A \rVert_F$: norma de Frobenius.
:::
