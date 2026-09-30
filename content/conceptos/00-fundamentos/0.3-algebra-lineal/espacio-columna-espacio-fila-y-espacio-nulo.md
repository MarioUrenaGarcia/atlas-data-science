---
id: espacio-columna-espacio-fila-y-espacio-nulo
titulo: Espacio columna, espacio fila y espacio nulo
titulo_en: Column space, row space and null space
alias:
  - espacio columna
  - imagen de una matriz
  - espacio nulo
  - núcleo
  - kernel
  - espacio fila
modulo: 0
submodulo: '0.3'
orden: 20
nivel: basico
prerrequisitos:
  - rango-de-una-matriz
  - subespacios
  - multiplicacion-de-matrices-como-transformacion-lineal
etiquetas:
  - espacio columna
  - espacio nulo
  - núcleo
  - subespacios fundamentales
resumen: >
  El espacio columna reúne todas las salidas Ax; el espacio nulo, las entradas que A manda a cero; el
  espacio fila es perpendicular al nulo. Ax solo depende de la parte de x en el espacio fila.
formula: 'C(A) = \{A\mathbf{x}\}, \quad N(A) = \{\mathbf{x} : A\mathbf{x} = \mathbf{0}\}, \quad C(A^\top) \perp N(A)'
visualizacion:
  componente: MatrixTransform
  parametros:
    modo: subespacios
    matrices:
      - nombre: Rango 1
        matriz: [[2, -1], [-4, 2]]
      - nombre: Rango 2
        matriz: [[2, 1], [1, 3]]
      - nombre: Rango 0
        matriz: [[0, 0], [0, 0]]
referencias:
  - clave: strang
publicado: true
---

## Intuición

Una matriz, vista como máquina, tiene dos preguntas naturales. La primera: ¿qué salidas puede producir? El conjunto de todas las $A\mathbf{x}$ posibles es el espacio columna, porque cada salida es una combinación de las columnas. Si una receta de cocina combina ingredientes para obtener sabores, el espacio columna son todos los sabores alcanzables. La segunda: ¿qué entradas producen nada? Las $\mathbf{x}$ con $A\mathbf{x} = \mathbf{0}$ forman el espacio nulo: combinaciones de ingredientes que se cancelan.

El espacio nulo explica por qué distintas entradas pueden dar la misma salida: si $\mathbf{n}$ está en el espacio nulo, $\mathbf{x}$ y $\mathbf{x} + \mathbf{n}$ producen lo mismo. Y el espacio fila, formado por combinaciones de las filas, resulta ser justo la parte perpendicular al espacio nulo. Toda entrada se separa en una pieza del espacio fila, que es la que la matriz "ve", y una pieza del espacio nulo, que la matriz ignora.

## Definición

:::definicion[Cuatro subespacios fundamentales]
Para $A \in \mathbb{R}^{m \times n}$:
- **Espacio columna:** $C(A) = \{A\mathbf{x} : \mathbf{x} \in \mathbb{R}^n\} = \operatorname{gen}\{\text{columnas}\} \subseteq \mathbb{R}^m$.
- **Espacio nulo:** $N(A) = \{\mathbf{x} \in \mathbb{R}^n : A\mathbf{x} = \mathbf{0}\}$.
- **Espacio fila:** $C(A^\top) = \operatorname{gen}\{\text{filas}\} \subseteq \mathbb{R}^n$.
- **Espacio nulo izquierdo:** $N(A^\top) = \{\mathbf{y} \in \mathbb{R}^m : A^\top\mathbf{y} = \mathbf{0}\}$.
:::

:::teorema[Ortogonalidad y dimensiones]
$C(A^\top) \perp N(A)$ en $\mathbb{R}^n$ y $C(A) \perp N(A^\top)$ en $\mathbb{R}^m$. Si $r = \operatorname{rango}(A)$, entonces $\dim C(A) = \dim C(A^\top) = r$, $\dim N(A) = n - r$ y $\dim N(A^\top) = m - r$.
:::

:::nota[Qué significa cada símbolo]
- $A$: matriz de $m \times n$.
- $\mathbf{x}$: vector de entrada en $\mathbb{R}^n$.
- $\mathbf{y}$: vector de $\mathbb{R}^m$.
- $C(A)$: espacio columna o imagen.
- $N(A)$: espacio nulo o núcleo.
- $C(A^\top)$: espacio fila.
- $N(A^\top)$: espacio nulo izquierdo.
- $r$: rango de $A$.
- $\perp$: ortogonal.
:::

## Cómo usar la visualización

El panel izquierdo es el espacio de entrada: la recta azul es el espacio fila y la rosa punteada el espacio nulo. El vector $\mathbf{x}$ se arrastra y se descompone en su parte fila y su parte nula. El panel derecho es la salida: la recta naranja es el espacio columna y ahí siempre cae $A\mathbf{x}$.

Al mover $\mathbf{x}$ a lo largo de la recta rosa, $A\mathbf{x}$ no cambia, porque solo cambia la parte que la matriz ignora. Con la matriz de rango 2 el espacio nulo es solo el origen y la salida cubre todo el plano; con la matriz cero, todo es espacio nulo y la salida es siempre el origen.

## Ejemplo

Se analiza $A = \begin{pmatrix} 1 & 2 \\ 2 & 4 \end{pmatrix}$, que convierte horas de dos máquinas en producción de dos piezas.

1. Las columnas $(1, 2)$ y $(2, 4)$ son paralelas: $C(A) = \operatorname{gen}\{(1, 2)\}$, una recta. Solo se pueden producir piezas en proporción 1 a 2.
2. $A\mathbf{x} = \mathbf{0}$ da $x_1 + 2x_2 = 0$: $N(A) = \operatorname{gen}\{(2, -1)\}$. Usar 2 horas de la primera y quitar 1 de la segunda no cambia la producción.
3. Las filas $(1, 2)$ y $(2, 4)$ generan $C(A^\top) = \operatorname{gen}\{(1, 2)\}$, y $(1, 2) \cdot (2, -1) = 0$: el espacio fila es perpendicular al nulo.
4. Para $\mathbf{x} = (3, 1)$: parte fila $\frac{5}{5}(1, 2) = (1, 2)$ y parte nula $(2, -1)$. Entonces $A\mathbf{x} = A(1, 2)^\top = (5, 10)$.
5. Dimensiones: rango 1 y nulidad 1, que suman las 2 columnas.

:::figura[La matriz del ejemplo. El vector x = (3, 1) se separa en (1, 2) sobre el espacio fila y (2, -1) sobre el espacio nulo; solo la primera parte llega a la salida.]{componente="MatrixTransform"}
```yaml
modo: subespacios
matrices:
  - nombre: Producción
    matriz: [[1, 2], [2, 4]]
```
:::

## Propiedades

- **Sistemas:** $A\mathbf{x} = \mathbf{b}$ tiene solución si y solo si $\mathbf{b} \in C(A)$.
- **Todas las soluciones:** si $\mathbf{x}_p$ es una solución, el conjunto de soluciones es $\mathbf{x}_p + N(A)$.
- **Unicidad:** la solución, si existe, es única exactamente cuando $N(A) = \{\mathbf{0}\}$.
- **Descomposición:** todo $\mathbf{x} \in \mathbb{R}^n$ se escribe de forma única como $\mathbf{x}_f + \mathbf{x}_n$ con $\mathbf{x}_f \in C(A^\top)$, $\mathbf{x}_n \in N(A)$, y $A\mathbf{x} = A\mathbf{x}_f$.
- **Operaciones de fila:** no cambian $N(A)$ ni $C(A^\top)$, pero sí pueden cambiar $C(A)$.

:::figura[Caso en el espacio: las tres columnas de una matriz de 3 por 3 de rango 2 están en un plano, que es su espacio columna. La tercera columna es la suma de las dos primeras.]{componente="Space3D"}
```yaml
modo: generado
conjuntos:
  - nombre: Columnas de A
    vectores: [[1, 0, 1], [0, 1, 1], [1, 1, 2]]
```
:::

:::demostracion
$C(A^\top) \perp N(A)$: si $A\mathbf{x} = \mathbf{0}$, cada fila $\mathbf{r}_i$ cumple $\mathbf{r}_i \cdot \mathbf{x} = 0$. Una combinación de filas $\sum c_i\mathbf{r}_i$ también cumple $\big(\sum c_i\mathbf{r}_i\big) \cdot \mathbf{x} = \sum c_i(\mathbf{r}_i \cdot \mathbf{x}) = 0$.
:::

## Errores comunes

- **Confundir en qué espacio vive cada subespacio.** $C(A)$ está en $\mathbb{R}^m$ (salidas) y $N(A)$ en $\mathbb{R}^n$ (entradas); para matrices no cuadradas ni siquiera tienen vectores del mismo tamaño.
- **Tomar las columnas de la forma escalonada como base de $C(A)$.** Las operaciones de fila cambian el espacio columna; la base son las columnas pivote de la matriz original.
- **Creer que el espacio nulo siempre es trivial.** Toda matriz con más columnas que filas tiene espacio nulo no trivial.
- **Pensar que el espacio nulo contiene solo el cero cuando el determinante no es cero en una matriz rectangular.** El determinante solo aplica a matrices cuadradas.

## Conexiones

Estos cuatro [[subespacios]] se construyen con la [[multiplicacion-de-matrices-como-transformacion-lineal|transformación lineal]] de la matriz, y sus dimensiones se expresan con el [[rango-de-una-matriz|rango]]. La relación entre ellas es el [[teorema-del-rango-y-la-nulidad]], y los [[sistemas-de-ecuaciones-lineales]] se entienden a partir de ellos. La [[pseudoinversa-de-moore-penrose]] envía cada salida a su preimagen en el espacio fila. En regresión, los valores ajustados viven en el espacio columna de la matriz de diseño y los residuos en el espacio nulo izquierdo.

## Formulario

:::formula[Espacio columna y espacio nulo]
$$
C(A) = \{A\mathbf{x} : \mathbf{x} \in \mathbb{R}^n\}, \qquad N(A) = \{\mathbf{x} : A\mathbf{x} = \mathbf{0}\}
$$

- $A$: matriz de $m \times n$.
:::

:::formula[Dimensiones]
$$
\dim C(A) = \dim C(A^\top) = r, \quad \dim N(A) = n - r, \quad \dim N(A^\top) = m - r
$$

- $r$: rango de $A$.
- $m, n$: número de filas y columnas.
:::

:::formula[Ortogonalidad]
$$
C(A^\top) \perp N(A), \qquad C(A) \perp N(A^\top)
$$

- $\perp$: todo vector de un subespacio es ortogonal a todo vector del otro.
:::

:::formula[Solución general]
$$
A\mathbf{x} = \mathbf{b} \ \Rightarrow\ \mathbf{x} = \mathbf{x}_p + \mathbf{x}_n, \quad \mathbf{x}_n \in N(A)
$$

- $\mathbf{x}_p$: una solución particular.
- $\mathbf{x}_n$: cualquier vector del espacio nulo.
:::
