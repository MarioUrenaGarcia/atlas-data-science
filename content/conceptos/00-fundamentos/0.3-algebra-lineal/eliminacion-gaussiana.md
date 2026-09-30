---
id: eliminacion-gaussiana
titulo: Eliminación gaussiana
titulo_en: Gaussian elimination
alias:
  - método de Gauss
  - Gauss-Jordan
  - reducción por filas
  - forma escalonada
  - forma escalonada reducida
modulo: 0
submodulo: '0.3'
orden: 23
nivel: basico
prerrequisitos:
  - sistemas-de-ecuaciones-lineales
etiquetas:
  - eliminación
  - operaciones de fila
  - pivotes
  - algoritmo
resumen: >
  La eliminación gaussiana resuelve un sistema lineal con operaciones de fila que no cambian sus soluciones:
  anula las entradas bajo cada pivote hasta una forma escalonada y luego despeja de abajo hacia arriba.
formula: 'R_i \leftarrow R_i - \frac{a_{ik}}{a_{kk}}\,R_k, \qquad [A \mid \mathbf{b}] \ \longrightarrow\ [U \mid \mathbf{c}]'
visualizacion:
  componente: MatrixSteps
  parametros:
    modo: gauss
    aumentada: true
    matrices:
      - nombre: Una solución
        matriz: [[1, 2, -1, 2], [2, 3, 1, 11], [-1, 1, 4, 13]]
      - nombre: Infinitas soluciones
        matriz: [[1, 2, -1, 2], [2, 3, 1, 11], [3, 5, 0, 13]]
      - nombre: Sin solución
        matriz: [[1, 2, -1, 2], [2, 3, 1, 11], [3, 5, 0, 14]]
referencias:
  - clave: strang
publicado: true
---

## Intuición

Resolver tres ecuaciones con tres incógnitas por sustitución se vuelve un enredo. La eliminación gaussiana lo ordena: usa la primera ecuación para quitar la primera incógnita de todas las demás, después usa la segunda para quitar la segunda incógnita de las que siguen, y así hasta que la última ecuación tiene una sola incógnita. Ahí se despeja, y el resto se resuelve de abajo hacia arriba.

Las operaciones permitidas son las que no cambian las soluciones: intercambiar dos ecuaciones, multiplicar una por un número distinto de cero y sumarle a una un múltiplo de otra. Como solo importan los coeficientes, se trabaja con la matriz aumentada y no se escriben las incógnitas. El proceso también responde las demás preguntas del sistema: una fila $0 = c$ con $c \neq 0$ anuncia que no hay solución, y una columna sin pivote anuncia una variable libre.

## Definición

:::definicion[Operaciones elementales de fila]
1. **Intercambio:** $R_i \leftrightarrow R_j$.
2. **Escalamiento:** $R_i \leftarrow c\,R_i$ con $c \neq 0$.
3. **Reemplazo:** $R_i \leftarrow R_i + c\,R_j$ con $i \neq j$.

Ninguna cambia el conjunto de soluciones del sistema.
:::

:::definicion[Algoritmo de eliminación]
Para $k = 1, 2, \dots$: se elige como **pivote** una entrada no nula de la columna $k$ en la fila $k$ o debajo (intercambiando filas si hace falta) y se anulan las entradas debajo con $R_i \leftarrow R_i - \frac{a_{ik}}{a_{kk}}R_k$. El resultado es una **forma escalonada** $[U \mid \mathbf{c}]$, que se resuelve por **sustitución hacia atrás**. Si además se escala cada pivote a 1 y se anulan las entradas encima, se obtiene la **forma escalonada reducida** (Gauss-Jordan).
:::

:::nota[Qué significa cada símbolo]
- $R_i$: fila $i$ de la matriz aumentada.
- $\leftarrow$: "se reemplaza por".
- $\leftrightarrow$: intercambio de filas.
- $a_{ik}$: entrada de la fila $i$ en la columna $k$.
- $a_{kk}$: pivote de la columna $k$.
- $c$: número por el que se multiplica una fila.
- $[A \mid \mathbf{b}]$: matriz aumentada del sistema.
- $U$: matriz escalonada, triangular superior si $A$ es cuadrada e invertible.
:::

## Cómo usar la visualización

El selector elige un sistema de tres ecuaciones. Cada paso aplica una operación de fila, escrita arriba en notación $R_i \leftarrow \dots$; la fila modificada se colorea y el pivote en uso se marca con borde. La barra vertical separa los coeficientes del lado derecho. Al final se muestra el tipo de sistema y, si es única, la solución.

En el sistema con infinitas soluciones la tercera fila se vuelve completamente cero y la tercera columna queda sin pivote. En el sistema sin solución la tercera fila termina como $(0, 0, 0 \mid 1)$: la ecuación $0 = 1$. Los tres sistemas solo difieren en la tercera ecuación.

## Ejemplo

Tres alimentos aportan proteína, grasa y carbohidrato. Se busca cuántas porciones $x_1, x_2, x_3$ de cada uno cumplen una dieta:
$$
\begin{aligned} 2x_1 + x_2 - x_3 &= 8 \\ -3x_1 - x_2 + 2x_3 &= -11 \\ -2x_1 + x_2 + 2x_3 &= -3 \end{aligned}
$$
(los signos negativos corresponden a balances respecto a una referencia).

1. Pivote 2: $R_2 \leftarrow R_2 + \tfrac{3}{2}R_1$ da $(0, \tfrac{1}{2}, \tfrac{1}{2} \mid 1)$; $R_3 \leftarrow R_3 + R_1$ da $(0, 2, 1 \mid 5)$.
2. Pivote $\tfrac{1}{2}$: $R_3 \leftarrow R_3 - 4R_2$ da $(0, 0, -1 \mid 1)$.
3. Sustitución hacia atrás: $-x_3 = 1$, así que $x_3 = -1$.
4. $\tfrac{1}{2}x_2 + \tfrac{1}{2}(-1) = 1$, así que $x_2 = 3$.
5. $2x_1 + 3 - (-1) = 8$, así que $x_1 = 2$. La solución es $(2, 3, -1)$.

:::figura[El sistema del ejemplo llevado hasta la forma escalonada reducida. Al terminar, la última columna contiene la solución (2, 3, -1).]{componente="MatrixSteps"}
```yaml
modo: gauss
aumentada: true
reducida: true
matrices:
  - nombre: Dieta
    matriz: [[2, 1, -1, 8], [-3, -1, 2, -11], [-2, 1, 2, -3]]
```
:::

## Propiedades

- **Costo:** para $n$ ecuaciones y $n$ incógnitas se necesitan del orden de $\tfrac{2}{3}n^3$ operaciones aritméticas.
- **Forma reducida única:** la forma escalonada reducida de una matriz es única; la forma escalonada no.
- **Pivoteo parcial:** en aritmética de punto flotante se elige como pivote la entrada de mayor valor absoluto de la columna, para no dividir entre números pequeños.
- **Determinante:** es el producto de los pivotes, con signo negativo por cada intercambio de filas.
- **Inversa:** reducir $[A \mid I]$ hasta $[I \mid A^{-1}]$ calcula la inversa.
- **Registro de multiplicadores:** guardar los factores usados produce la factorización $A = LU$.

:::figura[Caso de un pivote nulo: la matriz empieza con un cero en la esquina, así que el primer paso intercambia filas antes de eliminar.]{componente="MatrixSteps"}
```yaml
modo: gauss
aumentada: true
matrices:
  - nombre: Pivote nulo
    matriz: [[0, 2, 1, 7], [1, 1, 1, 6], [2, 1, 3, 13]]
```
:::

:::demostracion
Las operaciones de fila no cambian las soluciones: cada una se deshace con otra del mismo tipo ($R_i \leftarrow R_i - c\,R_j$ deshace $R_i \leftarrow R_i + c\,R_j$). Toda solución del sistema original cumple el nuevo, y al deshacer la operación toda solución del nuevo cumple el original.
:::

## Errores comunes

- **Operar solo sobre los coeficientes y olvidar el lado derecho.** La columna aumentada recibe las mismas operaciones.
- **Usar como pivote una entrada cero.** Hay que intercambiar filas; y en cálculo numérico, evitar también pivotes muy pequeños.
- **Multiplicar una fila por cero.** No es una operación válida porque destruye información.
- **Leer una fila de ceros como "sin solución".** Una fila $0 = 0$ indica redundancia; solo $0 = c$ con $c \neq 0$ indica incompatibilidad.

## Conexiones

La eliminación gaussiana resuelve los [[sistemas-de-ecuaciones-lineales]] y revela su [[rango-de-una-matriz|rango]] y sus variables libres. Registrar sus multiplicadores produce la [[descomposicion-lu]], y aplicada a $[A \mid I]$ calcula la [[matriz-identidad-y-matriz-inversa|inversa]]. El producto de los pivotes es el [[determinante-como-factor-de-volumen|determinante]]. La sensibilidad de la solución a errores de redondeo la mide el [[numero-de-condicion]].

## Formulario

:::formula[Paso de eliminación]
$$
R_i \leftarrow R_i - m_{ik}\,R_k, \qquad m_{ik} = \frac{a_{ik}}{a_{kk}}
$$

- $m_{ik}$: multiplicador que anula la entrada $(i, k)$.
- $a_{kk}$: pivote.
:::

:::formula[Sustitución hacia atrás]
$$
x_n = \frac{c_n}{u_{nn}}, \qquad x_i = \frac{1}{u_{ii}}\Big( c_i - \sum_{j > i} u_{ij}\,x_j \Big)
$$

- $u_{ij}$: entradas de la matriz escalonada $U$.
- $c_i$: lado derecho transformado.
:::

:::formula[Determinante por eliminación]
$$
\det A = (-1)^{s} \prod_{k=1}^{n} u_{kk}
$$

- $s$: número de intercambios de filas.
- $u_{kk}$: pivotes.
:::

:::formula[Costo]
$$
\text{operaciones} \approx \tfrac{2}{3}\,n^3
$$

- $n$: número de ecuaciones e incógnitas.
:::
