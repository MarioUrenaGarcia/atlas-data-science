---
id: datos-transversales-longitudinales-y-de-panel
titulo: Datos transversales, longitudinales y de panel
titulo_en: Cross-sectional, longitudinal and panel data
alias:
  - corte transversal
  - datos longitudinales
  - datos de panel
  - datos de series de tiempo
modulo: 4
submodulo: '4.1'
orden: 6
nivel: basico
prerrequisitos:
  - poblacion-y-muestra
etiquetas:
  - diseño de datos
  - panel
  - series de tiempo
  - corte transversal
  - panel balanceado
resumen: >
  Los datos transversales observan muchas unidades en un momento, los longitudinales siguen a una
  unidad en el tiempo y los de panel siguen a las mismas unidades durante varios periodos.
formula: 'x_{it}, \quad i = 1, \dots, n, \quad t = 1, \dots, T'
visualizacion:
  componente: DataTypesViz
  parametros:
    modo: panel
    unidades: [Jalisco, Sonora, Yucatán, Puebla, Coahuila]
    periodos: ['2019', '2020', '2021', '2022', '2023']
    variable: Desempleo (%)
    valores:
      - [3.2, 4.9, 4.1, 3.2, 2.9]
      - [3.5, 4.4, 3.8, 3.1, 2.8]
      - [2.0, 3.1, 2.6, 2.2, 2.0]
      - [2.8, 3.8, 3.5, 2.9, 2.6]
      - [4.1, 5.6, 4.6, 3.6, 3.1]
    vista: panel
referencias:
  - clave: angrist-pischke
    capitulo: '5'
  - clave: shumway-stoffer
    capitulo: '1'
publicado: true
---

## Intuición

Una fotografía de un salón de clases muestra a todos los estudiantes en un instante: permite comparar estaturas entre ellos, pero no dice cuánto creció cada uno. Una serie de fotografías de un solo estudiante, una por año, muestra cómo crece esa persona, pero no permite compararla con sus compañeros. Un álbum con una fotografía de cada estudiante cada año permite ambas cosas: comparar entre personas y seguir a cada una en el tiempo.

Esas tres situaciones son los datos **transversales**, **longitudinales** y **de panel**. La diferencia está en cuántas unidades se observan y en cuántos momentos. Importa porque determina qué preguntas se pueden contestar. Con una fotografía del grupo no se puede saber si los estudiantes altos crecieron más rápido; con el álbum completo sí, porque se observa el cambio de cada unidad y no solo diferencias entre unidades distintas.

## Definición

:::definicion[Estructura temporal de los datos]
Sea $x_{it}$ el valor de una variable para la unidad $i$ en el periodo $t$.

- **Transversales:** muchas unidades en un solo periodo: $x_{1t}, \dots, x_{nt}$ con $t$ fijo.
- **Longitudinales** (o serie de tiempo, si es una sola unidad): una unidad en muchos periodos: $x_{i1}, \dots, x_{iT}$ con $i$ fijo.
- **De panel:** las mismas $n$ unidades observadas en $T$ periodos: $x_{it}$ con $i = 1, \dots, n$ y $t = 1, \dots, T$.
:::

Un panel es **balanceado** si cada unidad se observa en todos los periodos, con $nT$ observaciones en total, y **no balanceado** si faltan algunas. Si en cada periodo se toman unidades distintas, los datos son **cortes transversales repetidos**, no un panel: se sigue a la población, no a las unidades.

:::figura[Un corte transversal: el número de camas ocupadas en cuatro hospitales, un año a la vez. La reproducción recorre los años; en cada uno solo se comparan hospitales entre sí.]{componente="DataTypesViz"}
```yaml
modo: panel
unidades: [General, Norte, Sur, Infantil]
periodos: ['2021', '2022', '2023']
variable: Camas ocupadas
valores:
  - [182, 171, 176]
  - [96, 104, 110]
  - [131, 118, 124]
  - [74, 81, 79]
vista: transversal
```
:::

:::nota[Qué significa cada símbolo]
- $x_{it}$: valor de la variable para la unidad $i$ en el periodo $t$.
- $i$: índice de la unidad (persona, empresa, estado).
- $t$: índice del periodo (año, trimestre, mes).
- $n$: número de unidades.
- $T$: número de periodos.
- $nT$: número de observaciones de un panel balanceado.
:::

## Cómo usar la visualización

La tabla muestra la tasa de desempleo de cinco estados en cinco años; la gráfica muestra la parte de la tabla que se está leyendo. El selector cambia el tipo de datos. En la vista transversal la reproducción recorre las columnas: cada año es una comparación entre estados. En la vista longitudinal recorre las filas: cada estado es una serie de tiempo. En la vista de panel agrega un estado a la vez hasta dibujar la tabla completa.

En la vista de panel se ve algo que ningún corte aislado muestra: todos los estados suben en 2020 y bajan después, y el orden entre ellos se mantiene casi igual. La primera observación habla del tiempo; la segunda, de diferencias persistentes entre unidades.

## Ejemplo

Una cadena registra las ventas trimestrales, en miles de pesos, de tres sucursales:

| Sucursal | T1 | T2 | T3 | T4 |
| --- | --- | --- | --- | --- |
| Centro | 420 | 455 | 470 | 510 |
| Norte | 310 | 300 | 335 | 360 |
| Sur | 250 | 280 | 290 | 330 |

1. Tipo de datos: panel balanceado con $n = 3$ sucursales, $T = 4$ trimestres y $nT = 12$ observaciones.
2. Pregunta transversal, con el trimestre 4 fijo: ¿qué sucursal vende más? Centro, con 510, contra 330 de Sur.
3. Pregunta longitudinal, con Sur fija: ¿cuánto creció? De 250 a 330, un aumento de $330 - 250 = 80$ miles de pesos, es decir, $80/250 = 32$ %.
4. Pregunta de panel: ¿las sucursales que vendían menos crecieron más? Centro creció $90/420 \approx 21$ %, Norte $50/310 \approx 16$ % y Sur 32 %. Contestar esto exige seguir a cada sucursal, algo imposible con un solo trimestre.

:::figura[El panel de ventas del ejemplo en vista longitudinal: la reproducción recorre las sucursales y dibuja la trayectoria de cada una.]{componente="DataTypesViz"}
```yaml
modo: panel
unidades: [Centro, Norte, Sur]
periodos: [T1, T2, T3, T4]
variable: Ventas (miles de pesos)
valores:
  - [420, 455, 470, 510]
  - [310, 300, 335, 360]
  - [250, 280, 290, 330]
vista: longitudinal
```
:::

## Propiedades

- **Dos fuentes de variación.** En un panel, la variación total se separa en variación entre unidades (unas siempre más altas que otras) y variación dentro de cada unidad a lo largo del tiempo.
- **Control de características fijas.** Comparar a cada unidad consigo misma elimina las características que no cambian en el tiempo, aunque no se hayan medido; esta es la ventaja principal de los paneles para estudiar efectos.
- **Dependencia.** Las observaciones de una misma unidad en periodos distintos suelen estar correlacionadas, así que no se pueden tratar como independientes.
- **Desgaste.** En paneles de personas, algunas abandonan el estudio con el tiempo; el panel se vuelve no balanceado y, si quienes salen son distintos de quienes se quedan, aparece un sesgo.

:::figura[Propiedad de desgaste: un panel no balanceado. A la cohorte de pacientes le faltan dos mediciones; la línea de cada paciente se interrumpe en los periodos faltantes.]{componente="DataTypesViz"}
```yaml
modo: panel
unidades: [Paciente 1, Paciente 2, Paciente 3, Paciente 4]
periodos: [Mes 0, Mes 3, Mes 6, Mes 9]
variable: Glucosa (mg/dL)
valores:
  - [168, 151, 140, 134]
  - [142, 139, 131, 126]
  - [190, 172, 160, 150]
  - [155, 150, 147, 139]
faltantes: [[1, 2], [2, 3]]
vista: panel
```
:::

## Errores comunes

- **Llamar panel a cortes transversales repetidos.** Una encuesta anual que entrevista cada año a personas distintas permite ver cómo cambia la población, pero no cómo cambia cada persona.
- **Tratar las 12 observaciones de un panel como 12 unidades independientes.** Con tres sucursales en cuatro trimestres hay mucha menos información independiente de la que sugiere el número de filas.
- **Concluir sobre individuos con datos transversales.** Que los estados con más desempleo en 2023 sean también los de mayor desempleo en 2019 no se puede ver en un solo año; y una diferencia entre personas jóvenes y mayores en un mismo año no indica cómo cambia una persona al envejecer.

:::figura[Casos que se confunden: cortes repetidos, series de tiempo y paneles.]{componente="DataTypesViz"}
```yaml
modo: clasificar
eje: temporal
ejemplos:
  - nombre: Censo agropecuario de un año
    valores: 5000 parcelas, 2022
    clase: transversal
    razon: Muchas unidades, un solo momento.
  - nombre: Precio diario del dólar
    valores: 2023-01-02 a 2023-12-29
    clase: longitudinal
    razon: Una sola serie observada muchos días.
  - nombre: Encuesta anual con personas distintas cada año
    valores: 2019, 2020, 2021
    clase: transversal
    razon: Son cortes transversales repetidos; no se sigue a las mismas personas.
  - nombre: Cohorte de recién nacidos medidos cada año
    valores: 800 niños, 6 mediciones
    clase: panel
    razon: Las mismas unidades en varios momentos.
  - nombre: Ventas mensuales de 40 tiendas durante 3 años
    valores: 40 tiendas, 36 meses
    clase: panel
    razon: Mismas tiendas, muchos periodos.
```
:::

## Conexiones

La estructura temporal es otra manera de describir cómo se obtuvo una [[poblacion-y-muestra|muestra]]. En una tabla de [[unidad-de-observacion-y-datos-ordenados|datos ordenados]], la unidad de observación de un panel es la pareja unidad y periodo. Los datos longitudinales de una sola unidad son el objeto de estudio de las series temporales, y los paneles permiten estudiar efectos controlando características que no cambian en el tiempo.

## Formulario

:::formula[Observación de panel]
$$
x_{it}, \qquad i = 1, \dots, n, \quad t = 1, \dots, T
$$

- $x_{it}$: valor de la unidad $i$ en el periodo $t$.
- $n$: número de unidades.
- $T$: número de periodos.
:::

:::formula[Tamaño de un panel balanceado]
$$
\text{observaciones} = n \cdot T
$$

- $n$: unidades; $T$: periodos.
:::

:::formula[Cambio relativo de una unidad]
$$
\frac{x_{iT} - x_{i1}}{x_{i1}}
$$

- $x_{i1}$: valor de la unidad $i$ en el primer periodo.
- $x_{iT}$: valor en el último periodo.
:::
