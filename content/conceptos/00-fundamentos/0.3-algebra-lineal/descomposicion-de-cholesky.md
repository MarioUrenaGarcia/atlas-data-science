---
id: descomposicion-de-cholesky
titulo: Descomposición de Cholesky
titulo_en: Cholesky decomposition
alias:
  - factorización de Cholesky
  - raíz cuadrada de una matriz
  - LL transpuesta
modulo: 0
submodulo: '0.3'
orden: 34
nivel: intermedio
prerrequisitos:
  - matrices-definidas-positivas-y-semidefinidas
  - descomposicion-lu
etiquetas:
  - factorización
  - definida positiva
  - simulación
  - triangular
resumen: >
  Toda matriz simétrica definida positiva se factoriza como A = LL^T con L triangular inferior de diagonal
  positiva; cuesta la mitad que LU y sirve para simular vectores normales correlacionados.
formula: 'A = LL^\top, \quad \ell_{jj} = \sqrt{a_{jj} - \sum_{k<j}\ell_{jk}^2}, \quad \ell_{ij} = \frac{a_{ij} - \sum_{k<j}\ell_{ik}\ell_{jk}}{\ell_{jj}}'
visualizacion:
  componente: MatrixSteps
  parametros:
    modo: cholesky
    matrices:
      - nombre: Definida positiva de 3 por 3
        matriz: [[4, 2, 2], [2, 5, 3], [2, 3, 6]]
      - nombre: Definida positiva de 2 por 2
        matriz: [[9, 3], [3, 5]]
      - nombre: No definida positiva
        matriz: [[4, 2, 2], [2, 1, 3], [2, 3, 6]]
referencias:
  - clave: strang
  - clave: boyd
publicado: true
---

## Intuición

Un número positivo tiene raíz cuadrada. Una matriz definida positiva, que es la versión matricial de un número positivo, también tiene una especie de raíz: una matriz triangular $L$ tal que $L$ por su transpuesta reproduce la original. Encontrarla es sacar raíces cuadradas de las entradas diagonales, una por una, después de descontar lo que ya explican las filas anteriores.

Esa raíz tiene usos muy concretos. Para simular datos con una matriz de covarianzas dada, se generan variables independientes de varianza 1 y se multiplican por $L$: el resultado tiene exactamente la covarianza deseada. Geométricamente, $L$ transforma el círculo unitario en la elipse de la covarianza. Además, la factorización funciona como prueba: si en algún paso aparece un número negativo bajo la raíz, la matriz no era definida positiva.

## Definición

:::teorema[Factorización de Cholesky]
Si $A \in \mathbb{R}^{n \times n}$ es simétrica y definida positiva, existe una única matriz triangular inferior $L$ con diagonal positiva tal que
$$
A = LL^\top.
$$
Sus entradas se calculan fila por fila:
$$
\ell_{jj} = \sqrt{a_{jj} - \sum_{k=1}^{j-1}\ell_{jk}^2}, \qquad \ell_{ij} = \frac{1}{\ell_{jj}}\Big(a_{ij} - \sum_{k=1}^{j-1}\ell_{ik}\ell_{jk}\Big), \quad i > j.
$$
:::

Si $A$ no es definida positiva, en algún paso la cantidad bajo la raíz es cero o negativa y el algoritmo se detiene.

:::nota[Qué significa cada símbolo]
- $A$: matriz simétrica definida positiva, con entradas $a_{ij}$.
- $L$: factor de Cholesky, triangular inferior, con entradas $\ell_{ij}$.
- $L^\top$: su transpuesta, triangular superior.
- $\ell_{jj}$: entrada diagonal de $L$, positiva.
- $k$: índice de las columnas anteriores que ya se calcularon.
- $n$: tamaño de la matriz.
:::

## Cómo usar la visualización

A la izquierda está $A$ y a la derecha se construye $L$. Cada paso calcula una entrada de $L$, resaltada, y la entrada de $A$ que se usa; la fórmula de arriba muestra la cuenta, con la raíz para las entradas diagonales y la división entre el pivote para las demás. Al final aparece $LL^\top$, que coincide con $A$.

En la matriz de $3 \times 3$ todas las raíces son exactas y $L$ tiene entradas 2, 2 y 2 en la diagonal. En la matriz no definida positiva, la segunda entrada diagonal da $\sqrt{1 - 1} = 0$: el proceso se detiene y el panel indica que la matriz no es definida positiva.

## Ejemplo

Tres indicadores financieros tienen matriz de covarianzas $\Sigma = \begin{pmatrix} 4 & 12 & -16 \\ 12 & 37 & -43 \\ -16 & -43 & 98 \end{pmatrix}$.

1. $\ell_{11} = \sqrt{4} = 2$; $\ell_{21} = 12/2 = 6$; $\ell_{31} = -16/2 = -8$.
2. $\ell_{22} = \sqrt{37 - 6^2} = \sqrt{1} = 1$; $\ell_{32} = (-43 - (-8)(6))/1 = 5$.
3. $\ell_{33} = \sqrt{98 - 64 - 25} = \sqrt{9} = 3$.
4. $L = \begin{pmatrix} 2 & 0 & 0 \\ 6 & 1 & 0 \\ -8 & 5 & 3 \end{pmatrix}$ y se comprueba que $LL^\top = \Sigma$.
5. Para simular: si $\mathbf{z}$ tiene tres componentes independientes de media 0 y varianza 1, entonces $\mathbf{x} = L\mathbf{z}$ tiene covarianza $L\,I\,L^\top = \Sigma$.

:::figura[La factorización de la matriz de covarianzas del ejemplo, entrada por entrada. Todas las raíces son de números positivos.]{componente="MatrixSteps"}
```yaml
modo: cholesky
matrices:
  - nombre: Indicadores
    matriz: [[4, 12, -16], [12, 37, -43], [-16, -43, 98]]
```
:::

:::figura[El factor L de la covarianza [[4, 2], [2, 2]] como transformación: lleva el círculo unitario a la elipse que describe la dispersión de datos con esa covarianza.]{componente="MatrixTransform"}
```yaml
modo: transformacion
circulo: true
matrices:
  - nombre: L
    matriz: [[2, 0], [1, 1]]
```
:::

## Propiedades

- **Unicidad:** con diagonal positiva, $L$ es única.
- **Costo:** del orden de $\tfrac{1}{3}n^3$ operaciones, la mitad que la factorización LU.
- **Estabilidad:** no requiere pivoteo para matrices definidas positivas.
- **Determinante:** $\det A = \prod_i \ell_{ii}^2$, y $\log\det A = 2\sum_i \log\ell_{ii}$, útil para evaluar densidades normales.
- **Sistemas:** $A\mathbf{x} = \mathbf{b}$ se resuelve con $L\mathbf{y} = \mathbf{b}$ y luego $L^\top\mathbf{x} = \mathbf{y}$.
- **Relación con QR:** si $A = B^\top B$ y $B = QR$, entonces $L = R^\top$.

:::demostracion
Entrada diagonal: igualando la entrada $(j, j)$ de $A = LL^\top$ se obtiene $a_{jj} = \sum_{k \le j}\ell_{jk}^2 = \ell_{jj}^2 + \sum_{k<j}\ell_{jk}^2$, de donde se despeja $\ell_{jj}$. La cantidad bajo la raíz es positiva porque es el cociente de dos menores principales dominantes consecutivos, positivos por el criterio de Sylvester.
:::

## Errores comunes

- **Aplicarla a matrices que no son simétricas.** La factorización supone $A = A^\top$.
- **Aplicarla a matrices semidefinidas.** Con un valor propio cero aparece $\sqrt{0}$ y la división siguiente falla; se usan variantes con pivoteo o se suma $\epsilon I$.
- **Confundir $L$ con $L^\top$ al simular.** Se multiplica $\mathbf{x} = L\mathbf{z}$; con $L^\top\mathbf{z}$ la covarianza sería $L^\top L$, que en general es otra.
- **Tomar raíces de las entradas de $A$ directamente.** Hay que descontar primero lo explicado por las columnas anteriores.

## Conexiones

La factorización de Cholesky existe exactamente para las [[matrices-definidas-positivas-y-semidefinidas|matrices definidas positivas]] y es la versión simétrica de la [[descomposicion-lu]]. Se relaciona con la [[descomposicion-qr]] de una matriz $B$ con $A = B^\top B$. En estadística se usa para simular vectores normales multivariados, evaluar su densidad y resolver las ecuaciones normales de la regresión.

## Formulario

:::formula[Factorización]
$$
A = LL^\top
$$

- $A$: simétrica definida positiva.
- $L$: triangular inferior con diagonal positiva.
:::

:::formula[Entradas diagonales]
$$
\ell_{jj} = \sqrt{a_{jj} - \sum_{k<j}\ell_{jk}^2}
$$

- $a_{jj}$: entrada diagonal de $A$.
- $\ell_{jk}$: entradas ya calculadas de la fila $j$.
:::

:::formula[Entradas fuera de la diagonal]
$$
\ell_{ij} = \frac{1}{\ell_{jj}}\Big(a_{ij} - \sum_{k<j}\ell_{ik}\ell_{jk}\Big), \quad i > j
$$

- $\ell_{jj}$: pivote de la columna $j$.
:::

:::formula[Simulación y determinante]
$$
\mathbf{x} = L\mathbf{z} \ \Rightarrow\ \operatorname{Cov}(\mathbf{x}) = LL^\top = \Sigma, \qquad \det\Sigma = \prod_i \ell_{ii}^2
$$

- $\mathbf{z}$: vector de componentes independientes de varianza 1.
- $\Sigma$: covarianza deseada.
:::
