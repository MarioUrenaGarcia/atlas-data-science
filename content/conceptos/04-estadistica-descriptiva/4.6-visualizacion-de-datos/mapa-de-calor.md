---
id: mapa-de-calor
titulo: Mapa de calor
titulo_en: Heatmap
alias:
  - heatmap
  - matriz de colores
modulo: 4
submodulo: '4.6'
orden: 12
nivel: basico
prerrequisitos:
  - tablas-de-contingencia
relaciones:
  - tipo: relacionado
    id: matriz-de-correlacion
  - tipo: relacionado
    id: uso-del-color-en-visualizacion
etiquetas:
  - visualización
  - color
  - tabla de doble entrada
  - patrones
resumen: >
  El mapa de calor representa una tabla de números como una cuadrícula de celdas coloreadas, donde el
  color codifica el valor. Hace visibles patrones por filas, columnas y bloques en tablas grandes.
formula: '\text{color}_{jk} = C\!\left(\frac{v_{jk} - v_{\min}}{v_{\max} - v_{\min}}\right)'
visualizacion:
  componente: ChartGallery
  parametros:
    grafico: calor
    filas: [Lunes, Martes, Miércoles, Jueves, Viernes, Sábado, Domingo]
    columnas: ['6 h', '8 h', '10 h', '12 h', '14 h', '16 h', '18 h', '20 h', '22 h']
    valores:
      - [20, 95, 50, 40, 45, 60, 98, 55, 18]
      - [22, 97, 52, 41, 46, 62, 99, 57, 19]
      - [21, 96, 51, 42, 47, 61, 97, 58, 20]
      - [22, 94, 50, 43, 48, 63, 96, 60, 22]
      - [23, 90, 49, 45, 50, 70, 92, 72, 35]
      - [8, 25, 40, 55, 60, 58, 50, 45, 30]
      - [5, 15, 30, 45, 50, 48, 40, 30, 15]
    paleta: secuencial
    variable: Miles de pasajeros por hora
referencias:
  - clave: tufte
  - clave: murphy
publicado: true
---

## Intuición

El sistema de transporte de una ciudad cuenta cuántos pasajeros entran cada hora, cada día de la semana. La tabla tiene 7 filas y 9 columnas: 63 números que nadie quiere leer uno por uno. Si cada número se reemplaza por un cuadro cuyo color es más oscuro cuanto mayor es el valor, aparecen de inmediato dos franjas oscuras, a las 8 y a las 18 horas, de lunes a viernes, y un fin de semana mucho más claro y repartido.

Un **mapa de calor** es eso: una tabla en la que el color sustituye al número. El ojo detecta bloques, franjas y celdas anómalas mucho más rápido en colores que en cifras. A cambio, se pierde precisión: es difícil saber si una celda vale 62 o 66 solo por su tono. Por eso se usa para descubrir patrones y se acompaña de los valores cuando se necesitan exactos.

## Definición

:::definicion[Mapa de calor]
Sea una tabla de valores $v_{jk}$ con $j = 1, \dots, r$ filas y $k = 1, \dots, c$ columnas. Un **mapa de calor** dibuja una cuadrícula de $r \times c$ celdas en la que la celda $(j, k)$ recibe el color

$$
\text{color}_{jk} = C\!\left(\frac{v_{jk} - v_{\min}}{v_{\max} - v_{\min}}\right),
$$

donde $C$ es una paleta que asigna un color a cada número entre 0 y 1.
:::

Condiciones de uso:

- La paleta debe respetar el tipo de dato: **secuencial** (de claro a oscuro en un solo tono) para cantidades, **divergente** (dos tonos que se alejan de un centro) cuando hay un valor de referencia como el cero, **categórica** solo para clases sin orden.
- Las filas y columnas pueden reordenarse (por ejemplo, agrupando las parecidas) para revelar bloques; el orden cambia la imagen, no los datos.

:::nota[Qué significa cada símbolo]
- $v_{jk}$: valor de la tabla en la fila $j$ y la columna $k$.
- $r$, $c$: número de filas y de columnas.
- $v_{\min}$, $v_{\max}$: valores mínimo y máximo de la tabla.
- $C$: paleta, función que asigna un color a cada número entre 0 y 1.
- $\text{color}_{jk}$: color de la celda $(j, k)$.
:::

## Cómo usar la visualización

Las filas aparecen una a una, de lunes a domingo. El encabezado muestra el rango de valores que cubre la paleta y la descripción identifica la celda máxima.

Controles: el interruptor **Mostrar los valores** escribe el número en cada celda y el selector **Ver como** simula la impresión en escala de grises o la visión con deuteranopía.

Experimentos sugeridos:

1. Con los valores ocultos, identificar a qué hora y qué día hay más pasajeros; después mostrar los números y comprobarlo.
2. Cambiar a escala de grises: con la paleta secuencial el orden de claro a oscuro se conserva.
3. Comparar el viernes con los otros días laborales: la franja de las 20 y 22 horas es más oscura.

## Ejemplo

Con la paleta secuencial y los datos del transporte, $v_{\min} = 5$ (domingo a las 6 h) y $v_{\max} = 99$ (martes a las 18 h).

1. El miércoles a las 10 h, $v = 51$: la posición en la paleta es $(51 - 5)/(99 - 5) = 46/94 \approx 0.49$, un tono intermedio.
2. El sábado a las 8 h, $v = 25$: $(25 - 5)/94 \approx 0.21$, un tono claro.
3. El lunes a las 18 h, $v = 98$: $(98 - 5)/94 \approx 0.99$, casi el tono más oscuro.

:::figura[Tres días y tres horas del ejemplo. Al activar Mostrar los valores se leen los números; como esta tabla va de 25 a 98, esos extremos son los que fijan aquí el tono más claro y el más oscuro.]{componente="ChartGallery"}
```yaml
grafico: calor
filas: [Miércoles, Sábado, Lunes]
columnas: ['8 h', '10 h', '18 h']
valores:
  - [96, 51, 97]
  - [25, 40, 50]
  - [95, 50, 98]
paleta: secuencial
variable: Miles de pasajeros por hora
```
:::

## Propiedades

**Paleta divergente para datos con centro.** En una matriz de correlaciones, el cero es un valor natural de referencia: los positivos se pintan de un tono, los negativos de otro y los cercanos a cero quedan casi blancos.

:::figura[Matriz de correlaciones de cinco indicadores de salud con paleta divergente centrada en cero: los tonos opuestos separan relaciones positivas y negativas.]{componente="ChartGallery"}
```yaml
grafico: calor
filas: [Edad, Peso, Presión, Ejercicio, Sueño]
columnas: [Edad, Peso, Presión, Ejercicio, Sueño]
valores:
  - [1, 0.35, 0.62, -0.41, -0.18]
  - [0.35, 1, 0.48, -0.52, -0.12]
  - [0.62, 0.48, 1, -0.37, -0.21]
  - [-0.41, -0.52, -0.37, 1, 0.25]
  - [-0.18, -0.12, -0.21, 0.25, 1]
paleta: divergente
centro: 0
variable: Correlación
```
:::

**Reordenar revela estructura.** Una tabla con las filas en orden arbitrario puede verse como ruido; al agrupar las filas parecidas aparecen bloques.

:::figura[Calificaciones promedio de seis grupos escolares en cinco materias, con filas ordenadas para que los grupos con perfil de ciencias queden juntos.]{componente="ChartGallery"}
```yaml
grafico: calor
filas: [Grupo A, Grupo D, Grupo F, Grupo B, Grupo C, Grupo E]
columnas: [Matemáticas, Física, Química, Historia, Literatura]
valores:
  - [9.1, 8.8, 8.6, 6.9, 7.1]
  - [8.9, 9.0, 8.4, 7.2, 6.8]
  - [9.3, 8.7, 8.9, 7.0, 7.3]
  - [6.8, 7.0, 7.1, 9.0, 9.2]
  - [7.1, 6.9, 7.3, 8.8, 9.1]
  - [6.9, 7.2, 6.8, 9.2, 8.9]
paleta: secuencial
variable: Calificación promedio
```
:::

## Errores comunes

- **Usar el arcoíris para una cantidad.** Sus tonos no tienen un orden perceptual claro y crean fronteras artificiales donde cambia el tono; una paleta secuencial es preferible.
- **Usar una paleta secuencial para datos con centro.** Correlaciones o diferencias respecto a una meta piden una paleta divergente centrada en el valor de referencia.
- **Leer valores exactos en el color.** El color solo permite comparaciones gruesas; si importan las cifras, deben escribirse en las celdas.

:::figura[El mismo calendario de pasajeros con paleta arcoíris: el selector permite comparar paletas y la vista en grises muestra que el arcoíris no conserva el orden de claro a oscuro.]{componente="ChartGallery"}
```yaml
grafico: calor
filas: [Lunes, Martes, Miércoles, Jueves, Viernes, Sábado, Domingo]
columnas: ['6 h', '8 h', '10 h', '12 h', '14 h', '16 h', '18 h', '20 h', '22 h']
valores:
  - [20, 95, 50, 40, 45, 60, 98, 55, 18]
  - [22, 97, 52, 41, 46, 62, 99, 57, 19]
  - [21, 96, 51, 42, 47, 61, 97, 58, 20]
  - [22, 94, 50, 43, 48, 63, 96, 60, 22]
  - [23, 90, 49, 45, 50, 70, 92, 72, 35]
  - [8, 25, 40, 55, 60, 58, 50, 45, 30]
  - [5, 15, 30, 45, 50, 48, 40, 30, 15]
paleta: arcoiris
variable: Miles de pasajeros por hora
compararPaletas: true
```
:::

## Conexiones

Un mapa de calor puede mostrar una [[tablas-de-contingencia|tabla de contingencia]], una [[matriz-de-correlacion]] o cualquier tabla de doble entrada. La elección de la paleta se estudia en [[uso-del-color-en-visualizacion]], y la limitación del color para comparar magnitudes, en [[percepcion-visual-y-codificacion-de-variables]]. Para muchas variables continuas, el [[grafico-hexbin]] es un mapa de calor de conteos sobre una rejilla hexagonal.

## Formulario

:::formula[Posición en la paleta]
$$
t_{jk} = \frac{v_{jk} - v_{\min}}{v_{\max} - v_{\min}}
$$

- $t_{jk}$: número entre 0 y 1 que ubica la celda $(j, k)$ en la paleta.
- $v_{jk}$: valor de la celda; $v_{\min}$, $v_{\max}$: mínimo y máximo de la tabla.
:::

:::formula[Color de la celda]
$$
\text{color}_{jk} = C(t_{jk})
$$

- $C$: paleta que asigna un color a cada número entre 0 y 1.
- $t_{jk}$: posición de la celda en la paleta.
:::

:::formula[Paleta divergente con centro]
$$
u_{jk} = \frac{v_{jk} - m}{\max(m - v_{\min},\ v_{\max} - m)}
$$

- $u_{jk}$: posición entre $-1$ y $1$; el signo elige el tono y el valor absoluto la intensidad.
- $m$: valor de referencia que se pinta de blanco, por ejemplo 0.
- $v_{jk}$, $v_{\min}$, $v_{\max}$: valor de la celda, mínimo y máximo.
:::
