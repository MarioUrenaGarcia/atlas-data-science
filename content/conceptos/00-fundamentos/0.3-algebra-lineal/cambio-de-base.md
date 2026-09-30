---
id: cambio-de-base
titulo: Cambio de base
titulo_en: Change of basis
alias:
  - matriz de cambio de base
  - cambio de coordenadas
  - matrices semejantes
modulo: 0
submodulo: '0.3'
orden: 27
nivel: basico
prerrequisitos:
  - base-y-dimension
  - matriz-identidad-y-matriz-inversa
etiquetas:
  - base
  - coordenadas
  - semejanza
  - rejilla
resumen: >
  Un mismo vector tiene coordenadas distintas en bases distintas; si P tiene como columnas los vectores
  de la base nueva, x = P[x]_B y [x]_B = P^{-1}x, y una transformación A se ve en la base nueva como P^{-1}AP.
formula: '\mathbf{x} = P\,[\mathbf{x}]_B, \qquad [\mathbf{x}]_B = P^{-1}\mathbf{x}, \qquad [T]_B = P^{-1}AP'
visualizacion:
  componente: VectorPlane
  parametros:
    modo: cambio-base
    b1: [2, 1]
    b2: [1, 2]
    punto: [4, 5]
referencias:
  - clave: strang
publicado: true
---

## Intuición

Una misma ubicación se puede dar de varias maneras: "4 cuadras al este y 5 al norte" o "1 tramo por la avenida diagonal y 2 por la calzada inclinada". El punto no cambia; cambian las direcciones de referencia y, con ellas, los números que lo describen. Una base es un juego de direcciones de referencia, y cambiar de base es traducir las coordenadas de un idioma a otro.

La traducción es una multiplicación por matriz. Si las columnas de $P$ son los vectores de la base nueva, entonces $P$ convierte coordenadas nuevas en coordenadas usuales, porque arma el punto con esos vectores. Para ir al revés se multiplica por $P^{-1}$. Lo mismo pasa con las transformaciones: una matriz que se ve complicada en la base usual puede verse muy simple, por ejemplo diagonal, en una base bien elegida. Esa es la idea detrás de la diagonalización y del análisis de componentes principales.

## Definición

:::definicion[Matriz de cambio de base]
Sea $B = \{\mathbf{b}_1, \dots, \mathbf{b}_n\}$ una base de $\mathbb{R}^n$ y $P = [\mathbf{b}_1 \ \cdots \ \mathbf{b}_n]$. Las coordenadas $[\mathbf{x}]_B = (c_1, \dots, c_n)$ de $\mathbf{x}$ en la base $B$ cumplen
$$
\mathbf{x} = c_1\mathbf{b}_1 + \dots + c_n\mathbf{b}_n = P\,[\mathbf{x}]_B, \qquad [\mathbf{x}]_B = P^{-1}\mathbf{x}.
$$
:::

:::teorema[Matriz de una transformación en otra base]
Si $T(\mathbf{x}) = A\mathbf{x}$ en la base usual, en la base $B$ la misma transformación tiene matriz
$$
[T]_B = P^{-1}AP.
$$
Dos matrices relacionadas así se llaman **semejantes**.
:::

:::nota[Qué significa cada símbolo]
- $B$: base nueva con vectores $\mathbf{b}_1, \dots, \mathbf{b}_n$.
- $P$: matriz cuyas columnas son los vectores de $B$, invertible.
- $\mathbf{x}$: vector con sus coordenadas usuales.
- $[\mathbf{x}]_B$: coordenadas de $\mathbf{x}$ en la base $B$.
- $c_i$: coordenada $i$ en la base $B$.
- $A$: matriz de la transformación en la base usual.
- $[T]_B$: matriz de la misma transformación en la base $B$.
:::

## Cómo usar la visualización

La reproducción deforma la rejilla usual hasta la rejilla de la base nueva, cuyas líneas son los múltiplos enteros de $\mathbf{b}_1$ y $\mathbf{b}_2$, y dibuja el camino $c_1\mathbf{b}_1 + c_2\mathbf{b}_2$ hasta el punto. Los vectores de la base y el punto se arrastran; el panel muestra las coordenadas en ambas bases y el determinante de $P$.

El punto $(4, 5)$ tiene coordenadas $(1, 2)$ en la base nueva: un paso por $\mathbf{b}_1$ y dos por $\mathbf{b}_2$. Al acercar $\mathbf{b}_2$ a la dirección de $\mathbf{b}_1$, las celdas se aplanan, el determinante se acerca a cero y las coordenadas nuevas se disparan.

## Ejemplo

Un videojuego guarda la posición de un personaje en la base del mapa, pero la cámara usa ejes $\mathbf{b}_1 = (1, 1)$ y $\mathbf{b}_2 = (-1, 2)$. El personaje está en $\mathbf{x} = (1, 4)$.

1. $P = \begin{pmatrix} 1 & -1 \\ 1 & 2 \end{pmatrix}$, con $\det P = 2 + 1 = 3$.
2. $P^{-1} = \frac{1}{3}\begin{pmatrix} 2 & 1 \\ -1 & 1 \end{pmatrix}$.
3. $[\mathbf{x}]_B = P^{-1}(1, 4)^\top = \frac{1}{3}(2 + 4,\ -1 + 4) = (2, 1)$.
4. Comprobación: $2(1, 1) + 1(-1, 2) = (1, 4)$.
5. Un desplazamiento de la cámara de $(0, 1)$ en coordenadas de cámara equivale a $P(0, 1)^\top = (-1, 2)$ en el mapa.

:::figura[La posición del personaje del ejemplo en la base de la cámara: dos pasos por b₁ y uno por b₂ llegan a (1, 4).]{componente="VectorPlane"}
```yaml
modo: cambio-base
b1: [1, 1]
b2: [-1, 2]
punto: [1, 4]
```
:::

:::figura[La matriz P del ejemplo como transformación: lleva la rejilla usual a la rejilla de la cámara, con e₁ en b₁ y e₂ en b₂.]{componente="MatrixTransform"}
```yaml
modo: transformacion
matrices:
  - nombre: P
    matriz: [[1, -1], [1, 2]]
```
:::

## Propiedades

- **Composición de cambios:** pasar de la base $B$ a la $C$ se hace con $P_C^{-1}P_B$.
- **Base ortonormal:** si $P$ es ortogonal, $P^{-1} = P^\top$ y las coordenadas nuevas son productos punto.
- **Invariantes de la semejanza:** $A$ y $P^{-1}AP$ tienen el mismo determinante, traza, rango, polinomio característico y valores propios.
- **Base de vectores propios:** si $P$ tiene como columnas vectores propios de $A$, entonces $P^{-1}AP$ es diagonal.
- **Longitudes:** en una base que no es ortonormal, la norma de un vector no se calcula con la fórmula usual sobre sus coordenadas.

:::demostracion
Matriz en la base nueva: dado $[\mathbf{x}]_B$, se pasa a coordenadas usuales con $P$, se aplica $A$ y se regresa con $P^{-1}$: $[T\mathbf{x}]_B = P^{-1}AP\,[\mathbf{x}]_B$.
:::

## Errores comunes

- **Usar $P$ en la dirección equivocada.** $P$ convierte coordenadas nuevas en usuales; para obtener las nuevas se usa $P^{-1}$.
- **Pensar que el vector cambia.** Cambian sus coordenadas, no el vector.
- **Calcular longitudes con coordenadas de una base no ortonormal.** $\lVert (2, 1) \rVert$ en coordenadas de cámara no es la longitud real del vector $(1, 4)$.
- **Confundir semejanza con igualdad.** $A$ y $P^{-1}AP$ representan la misma transformación en bases distintas, pero son matrices distintas.

## Conexiones

El cambio de base traduce coordenadas entre dos [[base-y-dimension|bases]] y usa la [[matriz-identidad-y-matriz-inversa|inversa]] de la matriz de la base. Elegir como base los [[valores-y-vectores-propios|vectores propios]] conduce a la [[diagonalizacion]], y con bases ortonormales al [[teorema-espectral]]. En ciencia de datos, el análisis de componentes principales es un cambio a la base ordenada por varianza.

## Formulario

:::formula[Coordenadas en la base nueva]
$$
\mathbf{x} = P\,[\mathbf{x}]_B, \qquad [\mathbf{x}]_B = P^{-1}\mathbf{x}
$$

- $P$: matriz con los vectores de la base $B$ como columnas.
- $[\mathbf{x}]_B$: coordenadas de $\mathbf{x}$ en $B$.
:::

:::formula[Transformación en la base nueva]
$$
[T]_B = P^{-1}AP
$$

- $A$: matriz de $T$ en la base usual.
:::

:::formula[Base ortonormal]
$$
[\mathbf{x}]_Q = Q^\top\mathbf{x}
$$

- $Q$: matriz ortogonal cuyas columnas forman la base.
:::

:::formula[Invariantes]
$$
\det(P^{-1}AP) = \det A, \qquad \operatorname{tr}(P^{-1}AP) = \operatorname{tr}A
$$

- $\operatorname{tr}$: traza, suma de la diagonal.
:::
