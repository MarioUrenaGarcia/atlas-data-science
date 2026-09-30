---
id: unidad-de-observacion-y-datos-ordenados
titulo: Unidad de observación y datos ordenados (tidy data)
titulo_en: Unit of observation and tidy data
alias:
  - tidy data
  - formato largo
  - formato ancho
  - datos ordenados
modulo: 4
submodulo: '4.1'
orden: 8
nivel: basico
prerrequisitos:
  - datos-estructurados-semiestructurados-y-no-estructurados
etiquetas:
  - datos ordenados
  - unidad de observación
  - formato largo
  - formato ancho
  - organización de tablas
resumen: >
  La unidad de observación es aquello que describe cada fila. Una tabla está ordenada cuando cada
  variable es una columna, cada observación una fila y cada valor ocupa una celda.
formula: '\mathbf{X} = (x_{ij}) \in \mathbb{R}^{n \times p}: \ \text{fila } i = \text{observación},\ \text{columna } j = \text{variable}'
visualizacion:
  componente: DataTypesViz
  parametros:
    modo: ordenados
    caso: calificaciones
referencias:
  - clave: murphy
  - clave: james-isl
    capitulo: '2'
publicado: true
---

## Intuición

Una maestra anota las calificaciones en una tabla con una fila por estudiante y una columna por materia. Para leer, es cómoda. Pero si se pregunta "¿cuál es la calificación media por materia?" o "¿qué estudiante mejoró más entre materias?", el nombre de la materia está escondido en los encabezados, no en los datos, y cada pregunta nueva exige reacomodar la tabla.

El problema es no haber decidido qué es una **observación**. En esta tabla, una calificación no pertenece a un estudiante, sino a un estudiante en una materia. Si cada fila es esa pareja y hay una columna "materia" y otra "calificación", todas las preguntas se contestan con las mismas operaciones: filtrar filas, agrupar por una columna, resumir otra. Esa forma se llama **datos ordenados**. No es la única forma válida de guardar datos, pero es la que hace explícito qué se midió, sobre qué y con qué variables, y facilita graficar, resumir y modelar.

## Definición

:::definicion[Unidad de observación]
La **unidad de observación** es la entidad descrita por una fila de la tabla: una persona, una persona en una fecha, un producto en una tienda, una parcela en un año. Se identifica por las variables que la distinguen de las demás filas (las variables clave).
:::

:::definicion[Datos ordenados]
Una tabla $\mathbf{X}$ con $n$ filas y $p$ columnas está **ordenada** si:

1. cada variable forma una columna;
2. cada observación forma una fila;
3. cada valor ocupa una celda, $x_{ij}$, y cada tabla contiene un solo tipo de unidad de observación.
:::

Los desórdenes más frecuentes son: encabezados que son valores y no nombres de variables (formato ancho); nombres de variables guardados como valores de una columna; varias variables en una misma celda, como "12/35"; y un mismo tipo de dato repartido en varias tablas.

:::figura[Temperatura mensual con los meses repartidos en columnas. La reproducción mueve cada valor a una fila con su ciudad y su mes; la unidad de observación es la ciudad en un mes.]{componente="DataTypesViz"}
```yaml
modo: ordenados
caso: clima
```
:::

:::nota[Qué significa cada símbolo]
- $\mathbf{X}$: tabla de datos, escrita como matriz.
- $x_{ij}$: valor de la variable $j$ en la observación $i$.
- $n$: número de filas, es decir, de observaciones.
- $p$: número de columnas, es decir, de variables.
- $\mathbb{R}^{n \times p}$: conjunto de tablas numéricas de $n$ filas y $p$ columnas; con variables cualitativas las celdas contienen categorías.
:::

## Cómo usar la visualización

A la izquierda está la tabla original de calificaciones, con una columna por materia; a la derecha, la tabla ordenada, vacía al inicio. En cada paso se resaltan tres celdas de la tabla original: el nombre del estudiante, el encabezado de la materia y la calificación. Juntas forman una fila nueva de la tabla ordenada.

La tabla original tiene 3 filas y 4 columnas; la ordenada, 9 filas y 3 columnas. Las mismas nueve calificaciones cambian de lugar, pero ahora "materia" es una variable con valores que se pueden filtrar y agrupar. El panel indica cuál es la unidad de observación: un estudiante en una materia.

## Ejemplo

Una cadena guarda las ventas semanales así:

| tienda | medida | valor |
| --- | --- | --- |
| Norte | unidades | 120 |
| Norte | ingreso | 3600 |
| Sur | unidades | 80 |
| Sur | ingreso | 2800 |
| Centro | unidades | 150 |
| Centro | ingreso | 4200 |

1. ¿Qué describe cada fila? A una tienda, pero solo una de sus dos medidas. Una misma tienda ocupa dos filas.
2. La columna "medida" contiene nombres de variables (unidades, ingreso), no valores de una variable.
3. La unidad de observación es la tienda. La tabla ordenada tiene una fila por tienda y una columna por variable: (Norte, 120, 3600), (Sur, 80, 2800), (Centro, 150, 4200).
4. Ahora el precio medio por unidad de cada tienda es una operación entre columnas: $3600/120 = 30$, $2800/80 = 35$ y $4200/150 = 28$ pesos.

:::figura[El ejemplo de ventas: los nombres de dos variables guardados como valores pasan a ser columnas.]{componente="DataTypesViz"}
```yaml
modo: ordenados
caso: ventas
```
:::

## Propiedades

- **Número de filas.** Al pasar de formato ancho a largo, una tabla de $n$ unidades y $k$ columnas de valores produce $n \cdot k$ filas; la información no cambia, solo su disposición.
- **Depende de la pregunta.** La unidad de observación correcta depende de lo que se quiere estudiar: para comparar materias conviene "estudiante en materia"; para predecir el promedio general, "estudiante".
- **Operaciones uniformes.** En datos ordenados, filtrar, agrupar, resumir, graficar y ajustar modelos usan siempre la misma estructura, con variables como columnas.
- **Panel.** En datos de panel ordenados, la unidad de observación es la pareja unidad y periodo, con una columna para cada una.

:::figura[Propiedad del número de filas: las calificaciones como cuadro de estudiantes por materia. Cada celda es una observación, un estudiante en una materia; 3 estudiantes por 3 materias dan 9 filas en formato largo.]{componente="DataTypesViz"}
```yaml
modo: panel
unidades: [Ana, Beto, Carla]
periodos: [Matemáticas, Historia, Biología]
variable: Calificación
valores:
  - [9.1, 7.8, 8.5]
  - [6.4, 8.9, 7.2]
  - [8.0, 9.5, 9.0]
vista: transversal
```
:::

## Errores comunes

- **Tomar la forma más cómoda de leer como la forma de analizar.** Las tablas de reporte, con años en columnas, son buenas para leer, pero cada columna esconde valores de una variable.
- **Mezclar unidades de observación en una tabla.** Guardar en la misma tabla datos por estudiante y datos por escuela obliga a repetir los de escuela en cada estudiante; conviene tener dos tablas relacionadas por una clave.
- **Varias variables en una celda.** Una celda "12/35" con aciertos sobre preguntas contiene dos variables; debe separarse en dos columnas.
- **Contar filas como unidades.** En formato largo, 9 filas no son 9 estudiantes; son 9 calificaciones de 3 estudiantes.

:::figura[Error de conteo: en el formato largo de temperaturas cada ciudad aparece tres veces; hay 9 filas pero solo 3 ciudades.]{componente="DataTypesViz"}
```yaml
modo: clasificar
eje: estructura
ejemplos:
  - nombre: Tabla larga de temperaturas
    valores: ciudad, mes, temperatura
    clase: estructurado
    razon: Está ordenada, pero cada ciudad ocupa varias filas; el número de ciudades no es el número de filas.
  - nombre: Reporte con años en columnas
    valores: estado, 2021, 2022, 2023
    clase: estructurado
    razon: Es estructurado pero no ordenado; los años son valores de una variable.
  - nombre: Celdas como "12/35"
    valores: aciertos y preguntas
    clase: estructurado
    razon: Estructurado, pero con dos variables en una celda.
```
:::

## Conexiones

La unidad de observación es la unidad de la [[poblacion-y-muestra|muestra]] tal como aparece en la tabla. Los datos ordenados son el destino de la extracción de [[datos-estructurados-semiestructurados-y-no-estructurados|datos semiestructurados y no estructurados]], y en ellos las columnas se clasifican como [[datos-cualitativos-y-cuantitativos|cualitativas o cuantitativas]]. En [[datos-transversales-longitudinales-y-de-panel|datos de panel]] la observación es la pareja unidad y periodo. La tabla ordenada de variables numéricas es la [[matrices-y-operaciones-con-matrices|matriz]] de datos $\mathbf{X}$ que usan los métodos multivariados y de aprendizaje automático.

## Formulario

:::formula[Matriz de datos]
$$
\mathbf{X} = (x_{ij}), \quad i = 1, \dots, n, \quad j = 1, \dots, p
$$

- $x_{ij}$: valor de la variable $j$ en la observación $i$.
- $n$: número de observaciones (filas).
- $p$: número de variables (columnas).
:::

:::formula[Filas al pasar a formato largo]
$$
n_{\text{largo}} = n \cdot k
$$

- $n$: número de filas en formato ancho.
- $k$: número de columnas que contenían valores de una misma variable.
- $n_{\text{largo}}$: número de filas del formato largo.
:::

:::formula[Precio medio por unidad del ejemplo]
$$
\text{precio medio} = \frac{\text{ingreso}}{\text{unidades}} = \frac{3600}{120} = 30
$$

- ingreso: ventas de la tienda en pesos.
- unidades: artículos vendidos.
:::
