---
id: rango-de-una-matriz
titulo: Rango de una matriz
titulo_en: Rank of a matrix
alias:
  - rango
  - rank
  - rango completo
  - deficiencia de rango
modulo: 0
submodulo: '0.3'
orden: 19
nivel: basico
prerrequisitos:
  - base-y-dimension
  - matrices-y-operaciones-con-matrices
etiquetas:
  - rango
  - pivotes
  - columnas independientes
  - dimensión
resumen: >
  El rango de una matriz es el número máximo de columnas linealmente independientes, que coincide con el
  de filas independientes y con el número de pivotes al escalonarla; mide la dimensión de su imagen.
formula: '\operatorname{rango}(A) = \dim \operatorname{gen}\{\text{columnas de } A\} = \dim \operatorname{gen}\{\text{filas de } A\}'
visualizacion:
  componente: MatrixSteps
  parametros:
    modo: rango
    reducida: true
    matrices:
      - nombre: Rango 2 (3 por 4)
        matriz: [[1, 2, 0, 1], [2, 4, 1, 3], [3, 6, 1, 4]]
      - nombre: Rango 3 (3 por 3)
        matriz: [[1, 0, 2], [2, 1, 0], [0, 3, 1]]
      - nombre: Rango 1 (3 por 2)
        matriz: [[1, -2], [-3, 6], [2, -4]]
referencias:
  - clave: strang
  - clave: goodfellow
    capitulo: '2'
publicado: true
---

## Intuición

Una tabla de datos puede tener muchas columnas y aun así contener poca información genuinamente distinta. Si una columna registra el precio en pesos, otra el precio en dólares y una tercera el precio con impuesto, las tres dicen lo mismo con distintas escalas. El rango cuenta cuántas columnas realmente independientes hay: cuántas direcciones distintas aportan los datos.

Visto como transformación, el rango es la dimensión de todo lo que la matriz puede producir. Una matriz de $3 \times 3$ de rango 3 alcanza cualquier punto del espacio; una de rango 2 lo aplasta sobre un plano; una de rango 1, sobre una recta. Para calcularlo se escalona la matriz con operaciones de fila, que no cambian qué columnas dependen de cuáles, y se cuentan los pivotes. Un resultado sorprendente es que el número de filas independientes siempre coincide con el de columnas independientes.

## Definición

:::definicion[Rango]
El **rango** de $A \in \mathbb{R}^{m \times n}$ es la dimensión del espacio generado por sus columnas:
$$
\operatorname{rango}(A) = \dim \operatorname{gen}\{\mathbf{a}_1, \dots, \mathbf{a}_n\}.
$$
Coincide con la dimensión del espacio generado por sus filas y con el número de pivotes de cualquier forma escalonada de $A$.
:::

La matriz tiene **rango completo** si $\operatorname{rango}(A) = \min(m, n)$, y **deficiencia de rango** si es menor. Siempre $0 \le \operatorname{rango}(A) \le \min(m, n)$.

:::nota[Qué significa cada símbolo]
- $A$: matriz de $m$ filas y $n$ columnas.
- $\mathbf{a}_j$: columna $j$ de $A$.
- $\operatorname{gen}$: espacio generado.
- $\dim$: dimensión, el número de vectores de una base.
- $\operatorname{rango}(A)$: rango de $A$.
- $\min(m, n)$: el menor entre el número de filas y el de columnas.
:::

## Cómo usar la visualización

El selector elige una matriz. Cada paso aplica una operación de fila, escrita arriba, y resalta la fila que cambia y el pivote en uso. Al final quedan los pivotes con borde, uno por fila no nula, y el panel muestra el rango, las columnas pivote y las columnas libres.

En la matriz de $3 \times 4$, la segunda columna es el doble de la primera y nunca recibe pivote; la tercera fila termina en ceros porque es la suma de las otras dos. En la de rango 1, todas las filas son múltiplos de la primera y desaparecen en el primer paso.

## Ejemplo

Cuatro estaciones registran lluvia en la mañana, en la tarde y el total del día. Los datos forman
$$
X = \begin{pmatrix} 1 & 2 & 3 \\ 2 & 1 & 3 \\ 0 & 1 & 1 \\ 1 & 1 & 2 \end{pmatrix}.
$$

1. La tercera columna es la suma de las dos primeras, así que no aporta una dirección nueva.
2. Escalonando: $R_2 \leftarrow R_2 - 2R_1$ da $(0, -3, -3)$ y $R_4 \leftarrow R_4 - R_1$ da $(0, -1, -1)$.
3. Con el pivote $-3$ de la columna 2 se anulan las filas 3 y 4: $R_3 \leftarrow R_3 + \tfrac{1}{3}R_2$ y $R_4 \leftarrow R_4 - \tfrac{1}{3}R_2$.
4. Quedan dos pivotes, en las columnas 1 y 2: $\operatorname{rango}(X) = 2$, aunque la matriz tenga 3 columnas y 4 filas.
5. En un modelo de regresión con estas tres columnas, los coeficientes no están determinados de forma única.

:::figura[El escalonamiento de la tabla de lluvias paso a paso. Solo aparecen dos pivotes: la columna del total no aporta información nueva.]{componente="MatrixSteps"}
```yaml
modo: rango
matrices:
  - nombre: Lluvias
    matriz: [[1, 2, 3], [2, 1, 3], [0, 1, 1], [1, 1, 2]]
```
:::

## Propiedades

- **Rango de filas igual a rango de columnas:** $\operatorname{rango}(A) = \operatorname{rango}(A^\top)$.
- **Invertibilidad:** una matriz de $n \times n$ es invertible si y solo si tiene rango $n$.
- **Producto:** $\operatorname{rango}(AB) \le \min(\operatorname{rango} A, \operatorname{rango} B)$.
- **Matrices de Gram:** $\operatorname{rango}(A^\top A) = \operatorname{rango}(A)$.
- **Rango 1:** una matriz tiene rango 1 si y solo si es un producto $\mathbf{u}\mathbf{v}^\top$ de una columna por una fila, con ambos no nulos.
- **Operaciones de fila:** no cambian el rango.
- **Valores singulares:** el rango es el número de valores singulares distintos de cero.

:::figura[Casos del rango de una matriz de 2 por 2 como transformación: rango 2 cubre el plano, rango 1 lo aplasta sobre una recta y rango 0 lo manda todo al origen.]{componente="MatrixTransform"}
```yaml
modo: transformacion
circulo: true
matrices:
  - nombre: Rango 2
    matriz: [[2, 1], [1, 2]]
  - nombre: Rango 1
    matriz: [[1, 2], [0.5, 1]]
  - nombre: Rango 0
    matriz: [[0, 0], [0, 0]]
```
:::

:::demostracion
Las operaciones de fila no cambian el rango de columnas: si $E$ es una matriz invertible que realiza operaciones de fila, $\sum c_j\mathbf{a}_j = \mathbf{0}$ si y solo si $\sum c_j E\mathbf{a}_j = \mathbf{0}$, así que las columnas de $A$ y de $EA$ tienen exactamente las mismas relaciones de dependencia.
:::

## Errores comunes

- **Contar filas no nulas antes de escalonar.** Una matriz sin filas de ceros puede tener rango bajo; hay que escalonar primero.
- **Suponer que el rango es el número de columnas.** Solo si las columnas son independientes.
- **Confiar en el rango numérico sin tolerancia.** Con datos reales, una columna casi dependiente produce un pivote diminuto; en la práctica se cuentan valores singulares mayores que un umbral.
- **Pensar que las columnas pivote de la forma escalonada son una base del espacio columna de $A$.** La base está formada por las columnas de la matriz original en esas posiciones.

## Conexiones

El rango mide la [[independencia-lineal]] de las columnas en términos de [[base-y-dimension|dimensión]]. Es la dimensión del espacio columna estudiado en [[espacio-columna-espacio-fila-y-espacio-nulo]], y el [[teorema-del-rango-y-la-nulidad]] lo relaciona con las soluciones de $A\mathbf{x} = \mathbf{0}$. Se calcula con [[eliminacion-gaussiana]] y, de forma numéricamente estable, con la [[descomposicion-en-valores-singulares]]. La [[aproximacion-de-bajo-rango]] busca la matriz de rango dado más cercana a una matriz de datos.

## Formulario

:::formula[Definición]
$$
\operatorname{rango}(A) = \dim \operatorname{gen}\{\mathbf{a}_1, \dots, \mathbf{a}_n\}
$$

- $\mathbf{a}_j$: columnas de $A$.
:::

:::formula[Cotas]
$$
0 \le \operatorname{rango}(A) \le \min(m, n), \qquad \operatorname{rango}(AB) \le \min(\operatorname{rango} A, \operatorname{rango} B)
$$

- $m, n$: tamaño de $A$.
:::

:::formula[Igualdades]
$$
\operatorname{rango}(A) = \operatorname{rango}(A^\top) = \operatorname{rango}(A^\top A) = \#\{\text{pivotes}\} = \#\{\sigma_i > 0\}
$$

- $\sigma_i$: valores singulares de $A$.
- $\#$: número de elementos.
:::

:::formula[Rango 1]
$$
\operatorname{rango}(A) = 1 \iff A = \mathbf{u}\mathbf{v}^\top, \quad \mathbf{u}, \mathbf{v} \neq \mathbf{0}
$$

- $\mathbf{u}$: vector columna de $\mathbb{R}^m$.
- $\mathbf{v}$: vector de $\mathbb{R}^n$.
:::
