---
id: normas-matriciales
titulo: Normas matriciales (Frobenius, espectral)
titulo_en: Matrix norms (Frobenius, spectral)
alias:
  - norma de Frobenius
  - norma espectral
  - norma inducida
  - norma operador
modulo: 0
submodulo: '0.3'
orden: 39
nivel: intermedio
prerrequisitos:
  - descomposicion-en-valores-singulares
  - traza-de-una-matriz
etiquetas:
  - norma matricial
  - Frobenius
  - norma espectral
  - estiramiento máximo
resumen: >
  Una norma matricial mide el tamaño de una matriz; la espectral es el máximo estiramiento que produce sobre
  un vector unitario, sigma_1, y la de Frobenius es la raíz de la suma de los cuadrados de sus entradas.
formula: '\lVert \mathbf{A} \rVert_2 = \max_{\lVert \mathbf{x} \rVert = 1}\lVert \mathbf{A}\mathbf{x} \rVert = \sigma_1, \qquad \lVert \mathbf{A} \rVert_F = \sqrt{\textstyle\sum_{i,j}a_{ij}^2} = \sqrt{\textstyle\sum_i\sigma_i^2}'
visualizacion:
  componente: MatrixTransform
  parametros:
    modo: estiramiento
    matrices:
      - nombre: A
        matriz: [[2, 1], [0, 1.5]]
      - nombre: Rotación
        matriz: [[0.6, -0.8], [0.8, 0.6]]
      - nombre: Proyección
        matriz: [[1, 0], [0, 0]]
referencias:
  - clave: strang
  - clave: goodfellow
    capitulo: '2'
publicado: true
---

## Intuición

¿Qué tan grande es una matriz? Una respuesta natural es pensar en lo que le hace a los vectores: una matriz grande estira mucho. La norma espectral toma el vector unitario que más se estira y mide cuánto creció. Como la matriz convierte el círculo unitario en una elipse, esa norma es simplemente el semieje mayor de la elipse, el primer valor singular.

Otra respuesta es tratar la matriz como una lista larga de números y medir su longitud euclidiana: la norma de Frobenius. Es fácil de calcular y resulta que también es la raíz de la suma de los cuadrados de todos los valores singulares, es decir, combina todos los semiejes de la elipse, no solo el mayor. La espectral es la adecuada para acotar errores en el peor caso; la de Frobenius, para medir errores globales, como el de una aproximación de una matriz de datos.

## Definición

:::definicion[Normas matriciales]
Para $\mathbf{A} \in \mathbb{R}^{m \times n}$:
- **Norma inducida** por una norma vectorial: $\lVert \mathbf{A} \rVert = \max_{\mathbf{x} \neq \mathbf{0}} \dfrac{\lVert \mathbf{A}\mathbf{x} \rVert}{\lVert \mathbf{x} \rVert}$.
- **Norma espectral** (inducida por la euclidiana): $\lVert \mathbf{A} \rVert_2 = \sigma_1$, el mayor valor singular.
- **Norma de Frobenius**: $\lVert \mathbf{A} \rVert_F = \sqrt{\sum_{i,j} a_{ij}^2} = \sqrt{\operatorname{tr}(\mathbf{A}^\top \mathbf{A})} = \sqrt{\sigma_1^2 + \dots + \sigma_r^2}$.
- **Normas 1 e infinito** inducidas: $\lVert \mathbf{A} \rVert_1 = \max_j \sum_i |a_{ij}|$ (máxima suma por columna) y $\lVert \mathbf{A} \rVert_\infty = \max_i \sum_j |a_{ij}|$ (máxima suma por fila).
:::

:::nota[Qué significa cada símbolo]
- $\mathbf{A}$: matriz de $m \times n$ con entradas $a_{ij}$.
- $\mathbf{x}$: vector de entrada.
- $\lVert \cdot \rVert$: norma vectorial que induce la matricial.
- $\sigma_i$: valores singulares de $\mathbf{A}$; $r$ es el rango.
- $\operatorname{tr}$: traza.
- $\lVert \mathbf{A} \rVert_2$, $\lVert \mathbf{A} \rVert_F$, $\lVert \mathbf{A} \rVert_1$, $\lVert \mathbf{A} \rVert_\infty$: normas espectral, de Frobenius, 1 e infinito.
:::

## Cómo usar la visualización

Un vector unitario $\mathbf{v}$ recorre media vuelta del círculo y su imagen $\mathbf{A}\mathbf{v}$ recorre la elipse. A la derecha se grafica $\lVert \mathbf{A}\mathbf{v} \rVert$ según el ángulo de $\mathbf{v}$, con líneas en el máximo $\sigma_1$ y el mínimo $\sigma_2$. El panel muestra las normas espectral y de Frobenius y el número de condición.

La curva alcanza su máximo exactamente en la dirección del primer vector singular derecho. Con la rotación la curva es plana en 1: todas las direcciones se estiran igual. Con la proyección el mínimo es cero, y la norma de Frobenius coincide con la espectral porque solo hay un valor singular positivo.

## Ejemplo

La matriz $\mathbf{A} = \begin{pmatrix} 1.5 & 0 \\ 2 & 2.5 \end{pmatrix}$ representa la respuesta de un sistema de dos sensores.

1. Frobenius: $\sqrt{2.25 + 0 + 4 + 6.25} = \sqrt{12.5} \approx 3.536$.
2. $\mathbf{A}^\top \mathbf{A} = \begin{pmatrix} 6.25 & 5 \\ 5 & 6.25 \end{pmatrix}$, con valores propios 11.25 y 1.25; valores singulares $\sigma_1 \approx 3.354$ y $\sigma_2 \approx 1.118$.
3. Norma espectral: $\lVert \mathbf{A} \rVert_2 = 3.354$, alcanzada en la dirección $(1, 1)/\sqrt{2}$.
4. Comprobación: $\sqrt{\sigma_1^2 + \sigma_2^2} = \sqrt{11.25 + 1.25} = \sqrt{12.5}$, igual a Frobenius.
5. Normas 1 e infinito: máxima suma por columna $\max(3.5, 2.5) = 3.5$ y por fila $\max(1.5, 4.5) = 4.5$.

:::figura[La matriz de los sensores: la curva del estiramiento alcanza su máximo 3.354 en la diagonal y su mínimo 1.118 en la dirección perpendicular.]{componente="MatrixTransform"}
```yaml
modo: estiramiento
matrices:
  - nombre: Sensores
    matriz: [[1.5, 0], [2, 2.5]]
```
:::

## Propiedades

- **Axiomas de norma:** positividad, homogeneidad $\lVert cA \rVert = |c|\lVert \mathbf{A} \rVert$ y desigualdad del triángulo.
- **Submultiplicatividad:** $\lVert \mathbf{A}\mathbf{B} \rVert \le \lVert \mathbf{A} \rVert\,\lVert \mathbf{B} \rVert$ para las normas inducidas y para Frobenius.
- **Acotar productos:** $\lVert \mathbf{A}\mathbf{x} \rVert_2 \le \lVert \mathbf{A} \rVert_2\,\lVert \mathbf{x} \rVert_2$.
- **Comparación:** $\lVert \mathbf{A} \rVert_2 \le \lVert \mathbf{A} \rVert_F \le \sqrt{r}\,\lVert \mathbf{A} \rVert_2$.
- **Invariancia ortogonal:** $\lVert \mathbf{Q}\mathbf{A}\mathbf{V} \rVert_2 = \lVert \mathbf{A} \rVert_2$ y $\lVert \mathbf{Q}\mathbf{A}\mathbf{V} \rVert_F = \lVert \mathbf{A} \rVert_F$ para $\mathbf{Q}$, $\mathbf{V}$ ortogonales.
- **Simétricas:** si $\mathbf{A}$ es simétrica, $\lVert \mathbf{A} \rVert_2 = \max_i |\lambda_i|$.

:::figura[Caso ortogonal: una rotación estira todas las direcciones por 1, así que su norma espectral es 1 y su norma de Frobenius es raíz de 2.]{componente="MatrixTransform"}
```yaml
modo: estiramiento
matrices:
  - nombre: Rotación
    matriz: [[0.6, -0.8], [0.8, 0.6]]
```
:::

:::demostracion
Norma espectral: con $\mathbf{A} = \mathbf{U}\boldsymbol{\\Sigma} \mathbf{V}^\top$ y $\mathbf{y} = \mathbf{V}^\top\mathbf{x}$ unitario, $\lVert \mathbf{A}\mathbf{x} \rVert^2 = \lVert \boldsymbol{\\Sigma}\mathbf{y} \rVert^2 = \sum_i \sigma_i^2 y_i^2 \le \sigma_1^2\sum_i y_i^2 = \sigma_1^2$, con igualdad en $\mathbf{y} = \mathbf{e}_1$, es decir, $\mathbf{x} = \mathbf{v}_1$.
:::

## Errores comunes

- **Tomar la mayor entrada como norma espectral.** $\max|a_{ij}|$ no es una norma inducida y puede subestimar mucho el estiramiento.
- **Confundir la norma espectral con el mayor valor propio.** Coinciden en valor absoluto solo para matrices simétricas; en general se usan los valores singulares.
- **Confundir $\lVert \mathbf{A} \rVert_1$ con la suma de todas las entradas.** Es la mayor suma por columna.
- **Creer que Frobenius es una norma inducida.** No lo es: $\lVert \mathbf{I} \rVert_F = \sqrt{n}$, mientras que toda norma inducida da $\lVert \mathbf{I} \rVert = 1$.

## Conexiones

Las normas matriciales extienden las [[normas-vectoriales]] a matrices, y la espectral y la de Frobenius se leen de la [[descomposicion-en-valores-singulares]]. La de Frobenius se escribe con la [[traza-de-una-matriz|traza]]. Miden el error en la [[aproximacion-de-bajo-rango]] y definen el [[numero-de-condicion]]. En aprendizaje automático, la norma espectral de las capas controla la sensibilidad de una red neuronal a perturbaciones de la entrada.

## Formulario

:::formula[Norma inducida y espectral]
$$
\lVert \mathbf{A} \rVert_2 = \max_{\lVert \mathbf{x} \rVert_2 = 1}\lVert \mathbf{A}\mathbf{x} \rVert_2 = \sigma_1
$$

- $\sigma_1$: mayor valor singular.
:::

:::formula[Frobenius]
$$
\lVert \mathbf{A} \rVert_F = \sqrt{\sum_{i,j} a_{ij}^2} = \sqrt{\operatorname{tr}(\mathbf{A}^\top \mathbf{A})} = \sqrt{\sum_i \sigma_i^2}
$$

- $a_{ij}$: entradas.
- $\sigma_i$: valores singulares.
:::

:::formula[Normas 1 e infinito]
$$
\lVert \mathbf{A} \rVert_1 = \max_j \sum_i |a_{ij}|, \qquad \lVert \mathbf{A} \rVert_\infty = \max_i \sum_j |a_{ij}|
$$

- $j$: columnas; $i$: filas.
:::

:::formula[Submultiplicatividad]
$$
\lVert \mathbf{A}\mathbf{B} \rVert \le \lVert \mathbf{A} \rVert\,\lVert \mathbf{B} \rVert
$$

- Vale para normas inducidas y para Frobenius.
:::
