---
id: teorema-espectral
titulo: Teorema espectral
titulo_en: Spectral theorem
alias:
  - descomposición espectral
  - diagonalización ortogonal
  - teorema espectral para matrices simétricas
modulo: 0
submodulo: '0.3'
orden: 31
nivel: intermedio
prerrequisitos:
  - diagonalizacion
  - matrices-especiales
etiquetas:
  - matrices simétricas
  - valores propios reales
  - base ortonormal
  - covarianza
resumen: >
  Toda matriz simétrica real tiene valores propios reales y una base ortonormal de vectores propios, así que
  A = Q Lambda Q^T: gira a los ejes propios, estira por los valores propios y gira de regreso.
formula: 'A = A^\top \ \Longrightarrow\ A = Q\Lambda Q^\top = \sum_{i=1}^{n} \lambda_i\,\mathbf{q}_i\mathbf{q}_i^\top'
visualizacion:
  componente: MatrixTransform
  parametros:
    modo: espectral
    matrices:
      - nombre: Simétrica
        matriz: [[3, 1], [1, 2]]
      - nombre: Simétrica con un valor negativo
        matriz: [[1, 2], [2, -2]]
      - nombre: No simétrica
        matriz: [[2, 1], [0, 3]]
referencias:
  - clave: strang
  - clave: goodfellow
    capitulo: '2'
publicado: true
---

## Intuición

Una matriz simétrica, como una matriz de covarianzas o de distancias, trata igual la relación de $i$ con $j$ que la de $j$ con $i$. Esa simetría tiene una consecuencia geométrica fuerte: la transformación siempre es un estiramiento puro a lo largo de ciertos ejes perpendiculares, sin cizalla ni rotación escondidas. El círculo unitario se convierte en una elipse cuyos ejes son justamente esos ejes perpendiculares.

El teorema espectral lo dice con precisión: los vectores propios de una matriz simétrica se pueden elegir perpendiculares entre sí y de longitud 1, y sus valores propios son números reales. Entonces la matriz es una rotación a los ejes propios, un estiramiento por los valores propios y la rotación de regreso. En estadística, esos ejes son las direcciones principales de una nube de datos, y los valores propios, las varianzas a lo largo de ellas.

## Definición

:::teorema[Teorema espectral]
Si $A \in \mathbb{R}^{n \times n}$ es simétrica ($A^\top = A$), entonces todos sus valores propios son reales y existe una matriz ortogonal $Q$ tal que
$$
A = Q\Lambda Q^\top, \qquad \Lambda = \operatorname{diag}(\lambda_1, \dots, \lambda_n).
$$
Las columnas $\mathbf{q}_i$ de $Q$ son vectores propios ortonormales, y la **descomposición espectral** es
$$
A = \sum_{i=1}^{n} \lambda_i\,\mathbf{q}_i\mathbf{q}_i^\top.
$$
:::

El recíproco también vale: si $A = Q\Lambda Q^\top$ con $Q$ ortogonal y $\Lambda$ diagonal real, entonces $A$ es simétrica.

:::nota[Qué significa cada símbolo]
- $A$: matriz simétrica real de $n \times n$.
- $Q$: matriz ortogonal, $Q^\top Q = I$, con los vectores propios como columnas.
- $\Lambda$: matriz diagonal con los valores propios.
- $\lambda_i$: valor propio $i$, real.
- $\mathbf{q}_i$: vector propio unitario asociado a $\lambda_i$.
- $\mathbf{q}_i\mathbf{q}_i^\top$: matriz de proyección sobre la recta de $\mathbf{q}_i$.
:::

## Cómo usar la visualización

La reproducción aplica $Q^\top$, $\Lambda$ y $Q$ uno tras otro: primero una rotación lleva los vectores propios $\mathbf{q}_1$ y $\mathbf{q}_2$ a los ejes, después cada eje se multiplica por su valor propio y al final la rotación inversa los regresa. El panel muestra los valores propios, los vectores propios y su producto punto, que para una matriz simétrica es cero.

Con la matriz que tiene un valor propio negativo, el estiramiento de la segunda fase invierte uno de los ejes. Con la matriz no simétrica aparece un aviso: sus vectores propios no son perpendiculares y el teorema no aplica.

## Ejemplo

Las calificaciones en matemáticas y física de un grupo tienen matriz de covarianzas $S = \begin{pmatrix} 5 & 2 \\ 2 & 2 \end{pmatrix}$.

1. $p(\lambda) = \lambda^2 - 7\lambda + 6 = (\lambda - 6)(\lambda - 1)$: valores propios 6 y 1, ambos reales.
2. Para $\lambda = 6$: $S - 6I = \begin{pmatrix} -1 & 2 \\ 2 & -4 \end{pmatrix}$ da $\mathbf{q}_1 = (2, 1)/\sqrt{5}$.
3. Para $\lambda = 1$: $S - I = \begin{pmatrix} 4 & 2 \\ 2 & 1 \end{pmatrix}$ da $\mathbf{q}_2 = (1, -2)/\sqrt{5}$.
4. $\mathbf{q}_1 \cdot \mathbf{q}_2 = (2 - 2)/5 = 0$: son perpendiculares, como garantiza el teorema.
5. $S = 6\,\mathbf{q}_1\mathbf{q}_1^\top + 1\,\mathbf{q}_2\mathbf{q}_2^\top$: la dirección $(2, 1)$, en la que ambas calificaciones suben juntas, concentra seis veces más varianza que la dirección $(1, -2)$.

:::figura[La matriz de covarianzas del ejemplo factorizada: rotación a los ejes propios, estiramiento por 6 y por 1, y rotación de regreso.]{componente="MatrixTransform"}
```yaml
modo: espectral
matrices:
  - nombre: Covarianzas
    matriz: [[5, 2], [2, 2]]
```
:::

## Propiedades

- **Valores propios reales** para toda matriz simétrica real.
- **Ortogonalidad:** vectores propios de valores propios distintos son perpendiculares.
- **Siempre diagonalizable,** aunque haya valores propios repetidos.
- **Suma de proyecciones:** $A = \sum \lambda_i P_i$ con $P_i = \mathbf{q}_i\mathbf{q}_i^\top$, proyecciones ortogonales que suman la identidad.
- **Cociente de Rayleigh:** $\lambda_{\min} \le \dfrac{\mathbf{x}^\top A\mathbf{x}}{\mathbf{x}^\top\mathbf{x}} \le \lambda_{\max}$, con igualdad en los vectores propios correspondientes.
- **Funciones de matrices:** $f(A) = Q f(\Lambda) Q^\top$; por ejemplo, la raíz cuadrada de una matriz simétrica con valores propios no negativos.

:::figura[Caso simétrico frente a no simétrico: en la matriz simétrica las rectas propias son perpendiculares y el círculo se vuelve una elipse alineada con ellas; en la triangular no simétrica las rectas propias forman un ángulo agudo.]{componente="MatrixTransform"}
```yaml
modo: transformacion
propios: true
circulo: true
matrices:
  - nombre: Simétrica
    matriz: [[2, 1], [1, 2]]
  - nombre: No simétrica
    matriz: [[2, 1], [0, 3]]
```
:::

:::demostracion
Ortogonalidad: si $A\mathbf{u} = \lambda\mathbf{u}$ y $A\mathbf{v} = \mu\mathbf{v}$ con $\lambda \neq \mu$, entonces $\lambda\,\mathbf{u}^\top\mathbf{v} = (A\mathbf{u})^\top\mathbf{v} = \mathbf{u}^\top A^\top\mathbf{v} = \mathbf{u}^\top A\mathbf{v} = \mu\,\mathbf{u}^\top\mathbf{v}$. Como $\lambda \neq \mu$, $\mathbf{u}^\top\mathbf{v} = 0$.
:::

## Errores comunes

- **Aplicarlo a matrices no simétricas.** Una matriz no simétrica puede tener valores propios complejos o vectores propios no perpendiculares.
- **Olvidar normalizar los vectores propios.** $Q$ debe tener columnas unitarias para que $Q^{-1} = Q^\top$.
- **Pensar que los valores propios de una simétrica son positivos.** Son reales, pero pueden ser negativos o cero; positivos solo si la matriz es definida positiva.
- **Creer que con valores propios repetidos no hay base ortonormal.** La hay; solo deja de ser única dentro del espacio propio repetido.

## Conexiones

El teorema espectral es la [[diagonalizacion]] de las matrices simétricas de [[matrices-especiales]], con una base ortonormal de vectores propios. De él se deducen los criterios de las [[matrices-definidas-positivas-y-semidefinidas]] y la forma de las [[formas-cuadraticas]], y es el punto de partida de la [[descomposicion-en-valores-singulares]]. En análisis de componentes principales, la descomposición espectral de la matriz de covarianzas da las direcciones principales.

## Formulario

:::formula[Descomposición espectral]
$$
A = Q\Lambda Q^\top = \sum_{i=1}^{n} \lambda_i\,\mathbf{q}_i\mathbf{q}_i^\top
$$

- $Q$: vectores propios ortonormales como columnas.
- $\Lambda$: valores propios reales en la diagonal.
:::

:::formula[Ortogonalidad de Q]
$$
Q^\top Q = QQ^\top = I, \qquad Q^{-1} = Q^\top
$$

- $I$: identidad.
:::

:::formula[Cociente de Rayleigh]
$$
\lambda_{\min} \le \frac{\mathbf{x}^\top A\mathbf{x}}{\mathbf{x}^\top\mathbf{x}} \le \lambda_{\max}
$$

- $\mathbf{x}$: vector no nulo.
- $\lambda_{\min}, \lambda_{\max}$: menor y mayor valor propio.
:::

:::formula[Funciones de una matriz simétrica]
$$
f(A) = Q\,\operatorname{diag}\big(f(\lambda_1), \dots, f(\lambda_n)\big)\,Q^\top
$$

- $f$: función aplicada a cada valor propio, por ejemplo $f(\lambda) = \lambda^k$.
:::
