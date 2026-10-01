---
id: descomposicion-en-valores-singulares
titulo: Descomposición en valores singulares (SVD)
titulo_en: Singular value decomposition (SVD)
alias:
  - SVD
  - valores singulares
  - vectores singulares
modulo: 0
submodulo: '0.3'
orden: 35
nivel: intermedio
prerrequisitos:
  - teorema-espectral
etiquetas:
  - SVD
  - valores singulares
  - factorización
  - geometría
resumen: >
  Toda matriz se escribe A = U Σ V^T: una rotación, un estiramiento por los valores singulares a lo
  largo de ejes perpendiculares y otra rotación. El círculo unitario se convierte en una elipse.
formula: 'A = U\Sigma V^\top = \sum_{i=1}^{r} \sigma_i\,\mathbf{u}_i\mathbf{v}_i^\top, \qquad A\mathbf{v}_i = \sigma_i\mathbf{u}_i'
visualizacion:
  componente: MatrixTransform
  parametros:
    modo: svd
    matrices:
      - nombre: Estiramiento oblicuo
        matriz: [[1.5, 1], [0.5, 2]]
      - nombre: Singular
        matriz: [[1, 2], [0.5, 1]]
      - nombre: Rotación
        matriz: [[0.6, -0.8], [0.8, 0.6]]
referencias:
  - clave: strang
  - clave: hastie-esl
  - clave: goodfellow
    capitulo: '2'
publicado: true
---

## Intuición

Cualquier matriz, simétrica o no, cuadrada o no, hace con el plano algo que se puede descomponer en tres movimientos sencillos: primero gira (o refleja) para alinear dos direcciones perpendiculares especiales con los ejes, luego estira cada eje por su propio factor y finalmente vuelve a girar para colocar el resultado. Por eso toda matriz convierte el círculo unitario en una elipse: los semiejes de la elipse son los valores singulares y sus direcciones son los vectores singulares izquierdos.

A diferencia de los valores propios, los valores singulares siempre existen, son reales y no negativos, y las direcciones involucradas siempre son perpendiculares. Ordenados de mayor a menor, dicen cuánto estira la matriz en su dirección favorita, en la siguiente y así sucesivamente. Esa jerarquía es la base de la compresión de datos, del análisis de componentes principales y del cálculo de rangos, normas y pseudoinversas.

## Definición

:::teorema[Descomposición en valores singulares]
Toda matriz $A \in \mathbb{R}^{m \times n}$ se puede escribir como
$$
A = U\Sigma V^\top,
$$
con $U \in \mathbb{R}^{m \times m}$ y $V \in \mathbb{R}^{n \times n}$ ortogonales y $\Sigma \in \mathbb{R}^{m \times n}$ diagonal con entradas $\sigma_1 \ge \sigma_2 \ge \dots \ge 0$, los **valores singulares**. Las columnas $\mathbf{v}_i$ y $\mathbf{u}_i$ son los vectores singulares derechos e izquierdos, y cumplen $A\mathbf{v}_i = \sigma_i\mathbf{u}_i$.
:::

Los valores singulares son las raíces cuadradas de los valores propios de $A^\top A$, los $\mathbf{v}_i$ son sus vectores propios y los $\mathbf{u}_i$ son vectores propios de $AA^\top$. Si $r$ es el rango, exactamente $r$ valores singulares son positivos y $A = \sum_{i=1}^{r}\sigma_i\mathbf{u}_i\mathbf{v}_i^\top$.

:::nota[Qué significa cada símbolo]
- $A$: matriz de $m \times n$.
- $U$: matriz ortogonal de $m \times m$; columnas $\mathbf{u}_i$, vectores singulares izquierdos.
- $V$: matriz ortogonal de $n \times n$; columnas $\mathbf{v}_i$, vectores singulares derechos.
- $\Sigma$: matriz de $m \times n$ con los valores singulares en la diagonal.
- $\sigma_i$: valor singular $i$, real y no negativo.
- $r$: rango de $A$.
- $\mathbf{u}_i\mathbf{v}_i^\top$: matriz de rango 1.
:::

## Cómo usar la visualización

La reproducción aplica $V^\top$, $\Sigma$ y $U$ en tres fases sobre el círculo unitario y las direcciones $\mathbf{v}_1$ y $\mathbf{v}_2$. En la primera, una rotación lleva $\mathbf{v}_1$ y $\mathbf{v}_2$ a los ejes; en la segunda, cada eje se estira por su valor singular; en la tercera, otra rotación coloca la elipse. El panel muestra valores y vectores singulares y comprueba que $\sigma_1\sigma_2 = |\det A|$.

Con la matriz singular, el segundo valor singular es cero y la elipse se aplasta en un segmento. Con la rotación, ambos valores singulares son 1 y el círculo no cambia de forma, solo gira.

## Ejemplo

Se obtiene la SVD de $A = \begin{pmatrix} 2 & 2 \\ -1 & 1 \end{pmatrix}$, que mezcla dos señales de un sensor.

1. $A^\top A = \begin{pmatrix} 5 & 3 \\ 3 & 5 \end{pmatrix}$, con valores propios 8 y 2. Entonces $\sigma_1 = \sqrt{8} \approx 2.828$ y $\sigma_2 = \sqrt{2} \approx 1.414$.
2. Vectores propios de $A^\top A$: $\mathbf{v}_1 = (1, 1)/\sqrt{2}$ y $\mathbf{v}_2 = (1, -1)/\sqrt{2}$.
3. $\mathbf{u}_1 = A\mathbf{v}_1/\sigma_1 = \frac{(4, 0)/\sqrt{2}}{2\sqrt{2}} = (1, 0)$ y $\mathbf{u}_2 = A\mathbf{v}_2/\sigma_2 = \frac{(0, -2)/\sqrt{2}}{\sqrt{2}} = (0, -1)$.
4. $A = U\Sigma V^\top$ con $U = \begin{pmatrix} 1 & 0 \\ 0 & -1 \end{pmatrix}$, $\Sigma = \operatorname{diag}(2\sqrt{2}, \sqrt{2})$ y $V = \tfrac{1}{\sqrt{2}}\begin{pmatrix} 1 & 1 \\ 1 & -1 \end{pmatrix}$.
5. Comprobación: $\sigma_1\sigma_2 = 4 = |\det A| = |2 + 2|$.

:::figura[La matriz del ejemplo en sus tres fases: V transpuesta alinea las diagonales con los ejes, Σ estira por 2.83 y 1.41, y U refleja sobre el eje horizontal.]{componente="MatrixTransform"}
```yaml
modo: svd
matrices:
  - nombre: Sensor
    matriz: [[2, 2], [-1, 1]]
```
:::

## Propiedades

- **Existencia:** toda matriz real tiene SVD; los valores singulares son únicos.
- **Rango:** es el número de valores singulares positivos.
- **Normas:** $\lVert A \rVert_2 = \sigma_1$ y $\lVert A \rVert_F = \sqrt{\sum\sigma_i^2}$.
- **Determinante:** para $A$ cuadrada, $|\det A| = \prod_i \sigma_i$.
- **Subespacios:** los primeros $r$ vectores $\mathbf{u}_i$ generan el espacio columna, los primeros $r$ vectores $\mathbf{v}_i$ el espacio fila y los restantes $\mathbf{v}_i$ el espacio nulo.
- **Matrices simétricas definidas positivas:** la SVD coincide con la descomposición espectral.
- **Mejor aproximación:** truncar la suma a los primeros $k$ términos da la mejor aproximación de rango $k$.

:::figura[Caso visto como estiramiento: la imagen del círculo unitario bajo la matriz del ejemplo es una elipse cuyo semieje mayor mide σ₁ = 2.83 y el menor σ₂ = 1.41.]{componente="MatrixTransform"}
```yaml
modo: estiramiento
matrices:
  - nombre: Sensor
    matriz: [[2, 2], [-1, 1]]
```
:::

:::demostracion
Construcción: $A^\top A$ es simétrica y semidefinida positiva, así que tiene vectores propios ortonormales $\mathbf{v}_i$ con valores propios $\sigma_i^2 \ge 0$. Para $\sigma_i > 0$ se define $\mathbf{u}_i = A\mathbf{v}_i/\sigma_i$; entonces $\mathbf{u}_i \cdot \mathbf{u}_j = \mathbf{v}_i^\top A^\top A\mathbf{v}_j/(\sigma_i\sigma_j) = \sigma_j^2\,\mathbf{v}_i \cdot \mathbf{v}_j/(\sigma_i\sigma_j) = \delta_{ij}$. Completando los $\mathbf{u}_i$ a una base ortonormal se obtiene $AV = U\Sigma$.
:::

## Errores comunes

- **Confundir valores singulares con valores propios.** Solo coinciden para matrices simétricas definidas positivas; una rotación tiene valores propios complejos y valores singulares 1.
- **Obtener los $\mathbf{u}_i$ por separado sin cuidar los signos.** Hay que calcularlos como $A\mathbf{v}_i/\sigma_i$ para que los signos sean consistentes.
- **Esperar valores singulares negativos.** Siempre son no negativos; el signo queda en $U$ o $V$.
- **Calcular la SVD numéricamente con $A^\top A$.** Formar $A^\top A$ pierde precisión; los algoritmos estables trabajan directamente con $A$.

## Conexiones

La SVD generaliza el [[teorema-espectral]] a cualquier matriz, usando la [[matriz-transpuesta]] para formar $A^\top A$. Revela el [[rango-de-una-matriz|rango]] y los subespacios fundamentales, define la [[pseudoinversa-de-moore-penrose]] y la [[aproximacion-de-bajo-rango]], y da las [[normas-matriciales]] y el [[numero-de-condicion]]. En ciencia de datos, el análisis de componentes principales es la SVD de la matriz de datos centrada.

## Formulario

:::formula[SVD]
$$
A = U\Sigma V^\top
$$

- $U$, $V$: matrices ortogonales.
- $\Sigma$: diagonal con los valores singulares $\sigma_1 \ge \sigma_2 \ge \dots \ge 0$.
:::

:::formula[Forma de suma]
$$
A = \sum_{i=1}^{r} \sigma_i\,\mathbf{u}_i\mathbf{v}_i^\top
$$

- $r$: rango.
- $\mathbf{u}_i\mathbf{v}_i^\top$: matriz de rango 1.
:::

:::formula[Relación con valores propios]
$$
A^\top A\,\mathbf{v}_i = \sigma_i^2\,\mathbf{v}_i, \qquad \mathbf{u}_i = \frac{A\mathbf{v}_i}{\sigma_i}
$$

- $\sigma_i^2$: valores propios de $A^\top A$.
:::

:::formula[Normas y determinante]
$$
\lVert A \rVert_2 = \sigma_1, \qquad \lVert A \rVert_F = \sqrt{\textstyle\sum_i \sigma_i^2}, \qquad |\det A| = \prod_i \sigma_i
$$

- $\lVert \cdot \rVert_2$: norma espectral.
- $\lVert \cdot \rVert_F$: norma de Frobenius.
:::
