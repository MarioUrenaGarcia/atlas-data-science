---
id: aproximacion-de-bajo-rango
titulo: Aproximación de bajo rango (teorema de Eckart-Young)
titulo_en: Low-rank approximation (Eckart-Young theorem)
alias:
  - teorema de Eckart-Young
  - SVD truncada
  - compresión por SVD
modulo: 0
submodulo: '0.3'
orden: 37
nivel: intermedio
prerrequisitos:
  - descomposicion-en-valores-singulares
etiquetas:
  - bajo rango
  - compresión
  - SVD truncada
  - reducción de dimensión
resumen: >
  La mejor aproximación de rango k de una matriz se obtiene conservando los k valores singulares más grandes
  de su SVD; el error que queda está dado exactamente por los valores singulares descartados.
formula: 'A_k = \sum_{i=1}^{k}\sigma_i\,\mathbf{u}_i\mathbf{v}_i^\top, \qquad \lVert A - A_k \rVert_2 = \sigma_{k+1}, \quad \lVert A - A_k \rVert_F = \sqrt{\textstyle\sum_{i>k}\sigma_i^2}'
visualizacion:
  componente: MatrixGrid
  parametros:
    modo: bajo-rango
    imagen: figura
referencias:
  - clave: strang
  - clave: hastie-esl
publicado: true
---

## Intuición

Una fotografía en escala de grises es una matriz de brillos. Guardarla completa requiere un número por píxel, pero muchas imágenes tienen estructura: franjas, degradados, formas repetidas. La descomposición en valores singulares escribe la imagen como una suma de capas, cada una de ellas una matriz de rango 1 (una columna por una fila), ordenadas por importancia según su valor singular.

Quedarse con las primeras capas y tirar las demás da una versión aproximada de la imagen que ocupa mucho menos espacio. El teorema de Eckart-Young garantiza que no hay manera de hacerlo mejor: entre todas las matrices de rango $k$, la suma de las primeras $k$ capas es la más cercana a la original. Además, el error cometido se conoce de antemano: es el tamaño de los valores singulares descartados. Si estos decaen rápido, unas pocas capas bastan.

## Definición

:::teorema[Eckart-Young]
Sea $A = \sum_{i=1}^{r}\sigma_i\mathbf{u}_i\mathbf{v}_i^\top$ la SVD de $A$ con $\sigma_1 \ge \dots \ge \sigma_r > 0$, y sea $A_k = \sum_{i=1}^{k}\sigma_i\mathbf{u}_i\mathbf{v}_i^\top$ para $k < r$. Entonces, para toda matriz $B$ con $\operatorname{rango}(B) \le k$,
$$
\lVert A - A_k \rVert_2 = \sigma_{k+1} \le \lVert A - B \rVert_2, \qquad \lVert A - A_k \rVert_F = \sqrt{\sigma_{k+1}^2 + \dots + \sigma_r^2} \le \lVert A - B \rVert_F.
$$
:::

Guardar $A_k$ requiere $k(m + n + 1)$ números en lugar de $mn$.

:::nota[Qué significa cada símbolo]
- $A$: matriz de $m \times n$ y rango $r$.
- $\sigma_i$: valores singulares ordenados de mayor a menor.
- $\mathbf{u}_i, \mathbf{v}_i$: vectores singulares izquierdo y derecho.
- $A_k$: aproximación truncada con $k$ términos.
- $B$: cualquier matriz de rango a lo más $k$.
- $\lVert \cdot \rVert_2$: norma espectral; $\lVert \cdot \rVert_F$: norma de Frobenius.
:::

## Cómo usar la visualización

A la izquierda está la imagen original de $24 \times 24$ y a la derecha su aproximación de rango $k$; abajo, las barras de los valores singulares, azules las que se usan y grises las descartadas. La reproducción aumenta $k$ de uno en uno y el selector cambia de imagen. El panel muestra el error relativo, el error espectral $\sigma_{k+1}$ y cuántos números se guardan.

La figura de anillo y cruz tiene rango 8: con $k = 8$ el error es cero. Las ondas suaves se reconstruyen casi perfectamente con muy pocas capas porque sus valores singulares caen rápido. El tablero con marco necesita más capas para recuperar sus bordes nítidos.

## Ejemplo

Se aproxima $A = \begin{pmatrix} 2 & 2 \\ -1 & 1 \end{pmatrix}$ con una matriz de rango 1. Su SVD tiene $\sigma_1 = 2\sqrt{2}$, $\mathbf{u}_1 = (1, 0)$, $\mathbf{v}_1 = (1, 1)/\sqrt{2}$ y $\sigma_2 = \sqrt{2}$.

1. $A_1 = \sigma_1\mathbf{u}_1\mathbf{v}_1^\top = 2\sqrt{2}\cdot\frac{1}{\sqrt{2}}\begin{pmatrix} 1 & 1 \\ 0 & 0 \end{pmatrix} = \begin{pmatrix} 2 & 2 \\ 0 & 0 \end{pmatrix}$.
2. Error: $A - A_1 = \begin{pmatrix} 0 & 0 \\ -1 & 1 \end{pmatrix}$, con norma de Frobenius $\sqrt{2} = \sigma_2$.
3. Norma espectral del error: la matriz $\begin{pmatrix} 0 & 0 \\ -1 & 1 \end{pmatrix}$ tiene un solo valor singular, $\sqrt{2}$, igual a $\sigma_2$.
4. Error relativo en Frobenius: $\sqrt{2}/\sqrt{10} \approx 0.447$, porque $\lVert A \rVert_F^2 = 4 + 4 + 1 + 1 = 10$.
5. Ninguna matriz de rango 1 queda más cerca de $A$.

:::figura[La matriz del ejemplo y su aproximación de rango 1 como transformaciones: la original convierte el círculo en una elipse, y la aproximación la aplasta sobre su eje mayor.]{componente="MatrixTransform"}
```yaml
modo: transformacion
circulo: true
matrices:
  - nombre: A
    matriz: [[2, 2], [-1, 1]]
  - nombre: Aproximación de rango 1
    matriz: [[2, 2], [0, 0]]
```
:::

## Propiedades

- **Error conocido:** el error de la mejor aproximación depende solo de los valores singulares descartados.
- **Fracción de energía:** $\lVert A_k \rVert_F^2/\lVert A \rVert_F^2 = \sum_{i \le k}\sigma_i^2/\sum_i \sigma_i^2$, la proporción conservada.
- **Anidamiento:** $A_{k+1} = A_k + \sigma_{k+1}\mathbf{u}_{k+1}\mathbf{v}_{k+1}^\top$; cada capa corrige a las anteriores.
- **No unicidad:** si $\sigma_k = \sigma_{k+1}$, la mejor aproximación no es única.
- **Componentes principales:** la mejor aproximación de rango $k$ de una matriz de datos centrada corresponde a proyectar los datos sobre sus $k$ primeras componentes principales.

:::figura[Caso de una imagen suave: las ondas tienen valores singulares que caen muy rápido, así que pocas capas reconstruyen casi toda la imagen.]{componente="MatrixGrid"}
```yaml
modo: bajo-rango
imagen: degradado
```
:::

:::demostracion
Idea para la norma espectral: si $\operatorname{rango}(B) \le k$, el espacio nulo de $B$ tiene dimensión al menos $n - k$ y corta al espacio generado por $\mathbf{v}_1, \dots, \mathbf{v}_{k+1}$ en algún $\mathbf{x}$ unitario. Para ese vector, $\lVert (A - B)\mathbf{x} \rVert = \lVert A\mathbf{x} \rVert \ge \sigma_{k+1}$.
:::

## Errores comunes

- **Truncar sin ordenar.** Hay que quedarse con los valores singulares más grandes, no con los primeros que produzca un algoritmo.
- **Medir el error con los valores singulares conservados.** El error lo dan los descartados.
- **Aplicar la compresión a datos sin centrar al hacer componentes principales.** Sin centrar, la primera capa suele capturar solo la media.
- **Esperar que cualquier imagen se comprima bien.** Bordes nítidos y texturas aleatorias tienen valores singulares que decaen lentamente.

## Conexiones

La aproximación truncada usa directamente la [[descomposicion-en-valores-singulares]] y reduce el [[rango-de-una-matriz|rango]]. Su error se mide con las [[normas-matriciales]]. En ciencia de datos sustenta el análisis de componentes principales, los sistemas de recomendación por factorización de matrices y la eliminación de ruido.

## Formulario

:::formula[Aproximación truncada]
$$
A_k = \sum_{i=1}^{k}\sigma_i\,\mathbf{u}_i\mathbf{v}_i^\top
$$

- $k$: rango de la aproximación.
- $\sigma_i, \mathbf{u}_i, \mathbf{v}_i$: términos de la SVD.
:::

:::formula[Errores de Eckart-Young]
$$
\lVert A - A_k \rVert_2 = \sigma_{k+1}, \qquad \lVert A - A_k \rVert_F = \sqrt{\textstyle\sum_{i>k}\sigma_i^2}
$$

- $\sigma_{k+1}$: primer valor singular descartado.
:::

:::formula[Almacenamiento]
$$
k(m + n + 1) \ \text{ frente a } \ mn
$$

- $m, n$: tamaño de la matriz.
:::
