---
id: matrices-dispersas
titulo: Matrices dispersas
titulo_en: Sparse matrices
alias:
  - matriz rala
  - formato CSR
  - filas comprimidas
modulo: 0
submodulo: '0.3'
orden: 44
nivel: intermedio
prerrequisitos:
  - matrices-y-operaciones-con-matrices
etiquetas:
  - dispersión
  - almacenamiento
  - eficiencia
  - grafos
resumen: >
  Una matriz dispersa tiene casi todas sus entradas iguales a cero; guardar solo las no nulas y sus posiciones
  reduce la memoria y el costo del producto por un vector a un número proporcional a las entradas no nulas.
formula: '\operatorname{nnz}(A) \ll mn, \qquad (A\mathbf{x})_i = \sum_{j:\,a_{ij} \neq 0} a_{ij}x_j'
visualizacion:
  componente: MatrixGrid
  parametros:
    modo: dispersa
    patron: tridiagonal
referencias:
  - clave: strang
  - clave: newman
publicado: true
---

## Intuición

La matriz de amistades de una red social con mil millones de usuarios tendría $10^{18}$ entradas, pero cada persona tiene unos cientos de amigos: casi todas las entradas son cero. Guardarla completa sería imposible e inútil. Basta anotar, para cada persona, quiénes son sus amigos y el valor de cada conexión.

Las matrices con esta propiedad se llaman dispersas y aparecen en todas partes: redes, sistemas de recomendación, textos codificados por palabras y ecuaciones físicas discretizadas en rejillas, donde cada punto solo interactúa con sus vecinos. Trabajar con ellas cambia la escala de lo posible. Multiplicar por un vector solo requiere visitar las entradas no nulas, y los métodos iterativos, que solo hacen productos de este tipo, pueden resolver sistemas con millones de incógnitas.

## Definición

:::definicion[Matriz dispersa]
Una matriz $A \in \mathbb{R}^{m \times n}$ es **dispersa** si su número de entradas no nulas, $\operatorname{nnz}(A)$, es mucho menor que $mn$, típicamente proporcional a $m$ o a $n$. Su **densidad** es $\operatorname{nnz}(A)/(mn)$.
:::

:::definicion[Filas comprimidas]
El formato de **filas comprimidas** (CSR) guarda tres arreglos: los valores no nulos recorridos por filas, el índice de columna de cada uno, y un puntero que indica dónde empieza cada fila. Ocupa $2\,\operatorname{nnz}(A) + m + 1$ números.
:::

:::nota[Qué significa cada símbolo]
- $A$: matriz de $m \times n$ con entradas $a_{ij}$.
- $\operatorname{nnz}(A)$: número de entradas distintas de cero.
- $m, n$: número de filas y de columnas.
- $\ll$: "mucho menor que".
- $\mathbf{x}$: vector que se multiplica.
- $(A\mathbf{x})_i$: componente $i$ del producto.
:::

## Cómo usar la visualización

Se dibuja el patrón de una matriz de $30 \times 30$: cada cuadro azul es una entrada no nula. La reproducción recorre el producto $A\mathbf{x}$ fila por fila, resaltando en amarillo las entradas que se usan. El selector cambia el patrón y el panel compara la memoria densa con la de filas comprimidas y cuenta las multiplicaciones realizadas.

En la tridiagonal cada fila usa a lo más tres multiplicaciones en lugar de 30. En la rejilla de vecinos aparecen dos diagonales lejanas, las conexiones con la fila de arriba y la de abajo de la rejilla. En el patrón aleatorio, que usa la semilla, las entradas no siguen orden pero el ahorro es similar.

## Ejemplo

La temperatura de una varilla discretizada en $n = 1000$ puntos cumple ecuaciones donde cada punto depende de sus dos vecinos, lo que produce una matriz tridiagonal.

1. Entradas no nulas: 1000 en la diagonal y 999 en cada diagonal vecina, $\operatorname{nnz} = 3n - 2 = 2998$.
2. Almacenamiento denso: $1000^2 = 1000000$ números. En filas comprimidas: $2 \cdot 2998 + 1001 = 6997$ números, unas 143 veces menos.
3. Producto por un vector: 2998 multiplicaciones en lugar de un millón.
4. Densidad: $2998/1000000 \approx 0.3\ \%$.
5. Además, un sistema tridiagonal se resuelve con eliminación en unas $8n$ operaciones, sin llenar de números nuevos las posiciones con cero.

:::figura[Caso de una rejilla: la matriz de vecinos de una rejilla de 5 por 6 tiene cinco diagonales ocupadas: la principal, con el número de vecinos de cada punto, las dos contiguas, de los vecinos laterales, y las dos a distancia 6, de los vecinos de arriba y abajo.]{componente="MatrixGrid"}
```yaml
modo: dispersa
patron: rejilla
```
:::

:::figura[Caso de banda: cada punto interactúa con los tres vecinos a cada lado, así que las entradas no nulas llenan una franja alrededor de la diagonal.]{componente="MatrixGrid"}
```yaml
modo: dispersa
patron: banda
```
:::

## Propiedades

- **Costo del producto:** $A\mathbf{x}$ cuesta $\operatorname{nnz}(A)$ multiplicaciones.
- **Relleno:** la eliminación gaussiana puede crear entradas no nulas nuevas (relleno); reordenar filas y columnas lo reduce.
- **Estructuras de banda:** para una matriz de ancho de banda $b$, la factorización LU conserva la banda y cuesta del orden de $nb^2$.
- **Inversas densas:** la inversa de una matriz dispersa suele ser densa, por eso se resuelven sistemas en lugar de calcular inversas.
- **Métodos iterativos:** gradiente conjugado y métodos similares solo necesitan productos $A\mathbf{x}$ y aprovechan la dispersión.
- **Grafos:** el patrón de una matriz dispersa es un grafo: hay una arista de $i$ a $j$ si $a_{ij} \neq 0$.

:::demostracion
Tamaño de CSR: los valores y los índices de columna ocupan $\operatorname{nnz}(A)$ números cada uno, y el arreglo de punteros necesita una posición por fila más una final que marca el total: $2\,\operatorname{nnz}(A) + m + 1$.
:::

## Errores comunes

- **Convertir a formato denso para operar.** Se pierde la ventaja de memoria y tiempo; las operaciones deben hacerse en el formato disperso.
- **Calcular la inversa de una matriz dispersa.** Suele ser densa y enorme.
- **Usar formato disperso en matrices densas.** Con densidades altas, guardar índices cuesta más que guardar la matriz completa.
- **Ignorar el relleno.** Factorizar sin reordenar puede convertir un problema disperso en uno denso.

## Conexiones

Las matrices dispersas son [[matrices-y-operaciones-con-matrices|matrices]] donde casi todo es cero, y su producto por vectores es la operación básica del [[metodo-de-la-potencia]]. El [[producto-de-kronecker]] genera matrices dispersas estructuradas, y las [[matrices-estocasticas]] de redes grandes suelen serlo. En ciencia de datos aparecen en las matrices documento por palabra, en las de usuarios por productos y en las de adyacencia de redes.

## Formulario

:::formula[Densidad]
$$
\text{densidad} = \frac{\operatorname{nnz}(A)}{mn}
$$

- $\operatorname{nnz}(A)$: entradas no nulas.
- $m, n$: tamaño de la matriz.
:::

:::formula[Producto disperso]
$$
(A\mathbf{x})_i = \sum_{j:\,a_{ij} \neq 0} a_{ij}\,x_j
$$

- Solo se suman los términos con $a_{ij}$ distinto de cero.
:::

:::formula[Memoria en filas comprimidas]
$$
2\,\operatorname{nnz}(A) + m + 1 \ \text{ frente a } \ mn
$$

- $m + 1$: tamaño del arreglo de punteros de fila.
:::

:::formula[Tridiagonal de tamaño n]
$$
\operatorname{nnz} = 3n - 2
$$

- $n$: número de filas.
:::
