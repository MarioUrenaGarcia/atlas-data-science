---
id: matrices-especiales
titulo: Matrices especiales (diagonal, triangular, simétrica, ortogonal, de permutación)
titulo_en: Special matrices (diagonal, triangular, symmetric, orthogonal, permutation)
alias:
  - matriz diagonal
  - matriz triangular
  - matriz simétrica
  - matriz ortogonal
  - matriz de permutación
  - matriz antisimétrica
modulo: 0
submodulo: '0.3'
orden: 17
nivel: basico
prerrequisitos:
  - matriz-transpuesta
  - matriz-identidad-y-matriz-inversa
  - ortogonalidad-y-ortonormalidad
etiquetas:
  - matrices especiales
  - estructura
  - simetría
  - ortogonalidad
resumen: >
  Ciertas familias de matrices se reconocen por dónde están sus ceros o por cómo se relacionan con su
  transpuesta; esa estructura simplifica productos, inversas, determinantes y sistemas de ecuaciones.
formula: '\mathbf{D} = \operatorname{diag}(d_i), \quad \mathbf{U}_{ij} = 0 \ (i > j), \quad \mathbf{S}^\top = \mathbf{S}, \quad \mathbf{Q}^\top \mathbf{Q} = \mathbf{I}, \quad \mathbf{P}^{-1} = \mathbf{P}^\top'
visualizacion:
  componente: MatrixGrid
  parametros:
    modo: especiales
    n: 3
referencias:
  - clave: strang
  - clave: goodfellow
    capitulo: '2'
publicado: true
---

## Intuición

La mayoría de las matrices son tablas sin patrón, pero algunas tienen una forma que se nota a simple vista y que hace todo más fácil. Una matriz diagonal solo tiene números en la diagonal: multiplica cada coordenada por su propio factor, sin mezclarlas. Una triangular tiene ceros de un lado de la diagonal, y un sistema con ella se resuelve de una ecuación a la siguiente, despejando una incógnita a la vez. Una simétrica es su propio reflejo sobre la diagonal, como una tabla de distancias entre ciudades.

Dos familias se entienden mejor como movimientos. Una matriz ortogonal gira o refleja sin deformar: conserva longitudes y ángulos, y deshacerla es tan fácil como transponerla. Una de permutación tiene un solo 1 en cada fila y columna y lo único que hace es reordenar las coordenadas, como barajar filas de una tabla. Reconocer estas estructuras permite elegir el algoritmo correcto y ahorrar mucho cálculo.

## Definición

:::definicion[Familias de matrices cuadradas]
Sea $\mathbf{A} \in \mathbb{R}^{n \times n}$.
- **Diagonal:** $a_{ij} = 0$ si $i \neq j$; se escribe $\mathbf{D} = \operatorname{diag}(d_1, \dots, d_n)$.
- **Triangular superior:** $a_{ij} = 0$ si $i > j$. **Triangular inferior:** $a_{ij} = 0$ si $i < j$.
- **Simétrica:** $\mathbf{A}^\top = \mathbf{A}$. **Antisimétrica:** $\mathbf{A}^\top = -\mathbf{A}$.
- **Ortogonal:** $\mathbf{Q}^\top \mathbf{Q} = \mathbf{Q}\mathbf{Q}^\top = \mathbf{I}$, es decir, sus columnas forman una base ortonormal.
- **De permutación:** se obtiene reordenando las filas de la identidad; tiene exactamente un 1 en cada fila y en cada columna, y ceros en las demás posiciones.
:::

:::nota[Qué significa cada símbolo]
- $\mathbf{A}$: matriz cuadrada de $n \times n$.
- $a_{ij}$: entrada de la fila $i$ y columna $j$.
- $\mathbf{D}$: matriz diagonal; $d_i$ es su entrada $(i, i)$.
- $\mathbf{U}$, $\mathbf{L}$: matrices triangular superior e inferior.
- $\mathbf{S}$: matriz simétrica.
- $\mathbf{Q}$: matriz ortogonal.
- $\mathbf{P}$: matriz de permutación.
- $\mathbf{I}$: identidad.
:::

## Cómo usar la visualización

El selector elige la familia y el control fija el tamaño $n$. La matriz aparece con su patrón resaltado: los ceros obligatorios en gris, la diagonal con borde y el resto sombreado. A su derecha se muestra una segunda matriz que hace visible la propiedad: $\mathbf{Q}^\top \mathbf{Q}$ para la ortogonal, $\mathbf{P}\mathbf{x}$ para la permutación, la transpuesta para las simétricas y el producto por $(1, 2, \dots)$ para la diagonal.

En la ortogonal, $\mathbf{Q}^\top \mathbf{Q}$ sale igual a la identidad. En la permutación, $\mathbf{P}$ por $(1, 2, 3)$ devuelve los mismos números en otro orden. En la antisimétrica, la diagonal es forzosamente cero y la transpuesta cambia el signo de todo.

## Ejemplo

Se revisan dos matrices de $2 \times 2$ que aparecen al procesar imágenes: $\mathbf{Q} = \begin{pmatrix} 0.6 & -0.8 \\ 0.8 & 0.6 \end{pmatrix}$ y $\mathbf{P} = \begin{pmatrix} 0 & 1 \\ 1 & 0 \end{pmatrix}$.

1. Columnas de $\mathbf{Q}$: $(0.6, 0.8)$ y $(-0.8, 0.6)$. Sus longitudes al cuadrado son $0.36 + 0.64 = 1$ y su producto punto es $-0.48 + 0.48 = 0$.
2. Entonces $\mathbf{Q}^\top \mathbf{Q} = \mathbf{I}$ y $\mathbf{Q}^{-1} = \mathbf{Q}^\top = \begin{pmatrix} 0.6 & 0.8 \\ -0.8 & 0.6 \end{pmatrix}$; $\mathbf{Q}$ es la rotación por el ángulo cuyo coseno es 0.6, unos 53.1 grados.
3. $\mathbf{Q}$ conserva longitudes: $\mathbf{Q}(3, 4)^\top = (1.8 - 3.2,\ 2.4 + 2.4) = (-1.4, 4.8)$, y $\sqrt{1.96 + 23.04} = 5 = \lVert (3, 4) \rVert$.
4. $\mathbf{P}$ intercambia coordenadas: $\mathbf{P}(3, 4)^\top = (4, 3)$, y $\mathbf{P}^2 = \mathbf{I}$, así que $\mathbf{P}^{-1} = \mathbf{P} = \mathbf{P}^\top$.

:::figura[Las dos matrices del ejemplo: la ortogonal con QᵀQ = I y la permutación que reordena las coordenadas de (1, 2).]{componente="MatrixGrid"}
```yaml
modo: especiales
tipos: [ortogonal, permutacion]
n: 2
```
:::

## Propiedades

- **Diagonales:** se multiplican, invierten y elevan a potencias entrada por entrada; $\mathbf{D}^k = \operatorname{diag}(d_i^k)$.
- **Triangulares:** su determinante es el producto de la diagonal, el producto de dos triangulares del mismo tipo es del mismo tipo, y $\mathbf{L}\mathbf{x} = \mathbf{b}$ se resuelve por sustitución hacia adelante.
- **Simétricas:** tienen valores propios reales y vectores propios ortogonales; $\mathbf{A}^\top \mathbf{A}$ siempre es simétrica.
- **Ortogonales:** conservan longitudes, $\lVert \mathbf{Q}\mathbf{x} \rVert = \lVert \mathbf{x} \rVert$, y ángulos; $\det \mathbf{Q} = \pm 1$; el producto de ortogonales es ortogonal.
- **Permutación:** son ortogonales; $\det \mathbf{P} = \pm 1$ según el número de intercambios sea par o impar.
- **Antisimétricas:** su diagonal es cero y $\mathbf{x}^\top \mathbf{A}\mathbf{x} = 0$ para todo $\mathbf{x}$.

:::figura[Casos vistos como transformaciones del plano. La diagonal estira cada eje por separado, la cizalla es triangular, la simétrica estira en dos direcciones perpendiculares, la ortogonal gira sin deformar y la permutación refleja sobre la recta y = x.]{componente="MatrixTransform"}
```yaml
modo: transformacion
circulo: true
propios: true
matrices:
  - nombre: Diagonal
    matriz: [[2, 0], [0, 0.5]]
  - nombre: Triangular superior
    matriz: [[1, 1], [0, 1.5]]
  - nombre: Simétrica
    matriz: [[2, 1], [1, 2]]
  - nombre: Ortogonal
    matriz: [[0.6, -0.8], [0.8, 0.6]]
  - nombre: Permutación
    matriz: [[0, 1], [1, 0]]
```
:::

:::demostracion
Las ortogonales conservan longitudes: $\lVert \mathbf{Q}\mathbf{x} \rVert^2 = (\mathbf{Q}\mathbf{x})^\top(\mathbf{Q}\mathbf{x}) = \mathbf{x}^\top \mathbf{Q}^\top \mathbf{Q}\mathbf{x} = \mathbf{x}^\top\mathbf{x} = \lVert \mathbf{x} \rVert^2$.
:::

## Errores comunes

- **Llamar ortogonal a una matriz con columnas solo perpendiculares.** Las columnas deben tener además longitud 1.
- **Suponer que el producto de simétricas es simétrico.** $(AB)^\top = BA$, que en general no es $AB$.
- **Invertir una triangular invirtiendo cada entrada.** Eso solo vale para las diagonales.
- **Confundir antisimétrica con "no simétrica".** Antisimétrica es una condición precisa, $\mathbf{A}^\top = -\mathbf{A}$.

## Conexiones

Estas familias se definen con la [[matriz-transpuesta]] y la [[matriz-identidad-y-matriz-inversa|identidad]], y las ortogonales vienen de la [[ortogonalidad-y-ortonormalidad]]. Las triangulares aparecen en la [[descomposicion-lu]] y en la [[descomposicion-de-cholesky]]; las ortogonales en la [[descomposicion-qr]] y la [[descomposicion-en-valores-singulares]]; las simétricas en el [[teorema-espectral]]. En estadística, las matrices de covarianza son simétricas y las de permutación reordenan observaciones en pruebas de permutación.

## Formulario

:::formula[Diagonal]
$$
\mathbf{D} = \operatorname{diag}(d_1, \dots, d_n), \qquad \mathbf{D}^{-1} = \operatorname{diag}(1/d_1, \dots, 1/d_n)
$$

- $d_i$: entradas de la diagonal, distintas de cero para invertir.
:::

:::formula[Triangular]
$$
\det \mathbf{U} = \prod_{i=1}^{n} u_{ii}
$$

- $\mathbf{U}$: matriz triangular (superior o inferior).
- $u_{ii}$: entradas de su diagonal.
:::

:::formula[Simétrica y antisimétrica]
$$
\mathbf{S}^\top = \mathbf{S}, \qquad \mathbf{K}^\top = -\mathbf{K}, \qquad \mathbf{A} = \tfrac{1}{2}(\mathbf{A} + \mathbf{A}^\top) + \tfrac{1}{2}(\mathbf{A} - \mathbf{A}^\top)
$$

- $\mathbf{S}$: simétrica; $\mathbf{K}$: antisimétrica.
- Toda matriz cuadrada es suma de una parte simétrica y una antisimétrica.
:::

:::formula[Ortogonal y permutación]
$$
\mathbf{Q}^\top \mathbf{Q} = \mathbf{I}, \qquad \lVert \mathbf{Q}\mathbf{x} \rVert = \lVert \mathbf{x} \rVert, \qquad \mathbf{P}^{-1} = \mathbf{P}^\top
$$

- $\mathbf{Q}$: matriz ortogonal.
- $\mathbf{P}$: matriz de permutación.
:::
