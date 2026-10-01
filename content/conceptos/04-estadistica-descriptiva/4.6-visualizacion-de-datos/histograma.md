---
id: histograma
titulo: Histograma
titulo_en: Histogram
alias:
  - gráfico de frecuencias
  - distribución de frecuencias
modulo: 4
submodulo: '4.6'
orden: 1
nivel: basico
prerrequisitos:
  - datos-discretos-y-continuos
  - rango
etiquetas:
  - visualización
  - distribución
  - intervalos
  - frecuencias
resumen: >
  Un histograma divide el rango de una variable cuantitativa en intervalos contiguos y dibuja sobre cada
  uno una barra cuya altura es el número de datos que contiene. Muestra la forma de la distribución.
formula: 'f_k = \#\{i : x_i \in [b_{k-1}, b_k)\}, \qquad h = b_k - b_{k-1}'
visualizacion:
  componente: ChartGallery
  parametros:
    grafico: histograma
    muestra:
      nombre: Llamadas
      forma: sesgo-derecha
      parametro: 3
      centro: 6
      escala: 2.5
      n: 300
    eje:
      variable: Duración de la llamada
      unidad: min
referencias:
  - clave: tufte
  - clave: wasserman
publicado: true
---

## Intuición

Un centro de atención registra la duración de 300 llamadas. Leer los 300 números no dice nada; ordenarlos ayuda poco. Lo que sí dice algo es agruparlos: cuántas llamadas duraron entre 2 y 4 minutos, cuántas entre 4 y 6, y así sucesivamente. Si sobre cada grupo se levanta una barra con altura igual al número de llamadas, aparece la forma de los datos: dónde se amontonan, qué tan dispersos están, si tienen una cola larga o varios picos.

Ese gráfico es el **histograma**. A diferencia de un gráfico de barras, sus barras están pegadas, porque los intervalos cubren sin huecos un eje numérico continuo, y lo que importa es su área. Es la herramienta más usada para mirar la distribución de una variable cuantitativa, pero su apariencia depende de dos decisiones: cuántos intervalos usar y dónde empezar el primero. Con pocos intervalos se pierden detalles; con demasiados aparece ruido.

## Definición

:::definicion[Histograma]
Sean $b_0 < b_1 < \dots < b_k$ los bordes de $k$ intervalos contiguos que cubren todos los datos. La **frecuencia** del intervalo $k$ es $f_k = \#\{i : x_i \in [b_{k-1}, b_k)\}$. El histograma dibuja sobre cada intervalo una barra de altura $f_k$ (histograma de frecuencias) o de altura $f_k/(n h_k)$ (histograma de densidad), donde $h_k = b_k - b_{k-1}$ es su ancho.
:::

En el histograma de densidad, el área de cada barra es la proporción de datos del intervalo y el área total es 1, lo que permite compararlo con una función de densidad. Con intervalos de igual ancho $h$, ambos histogramas tienen la misma forma.

:::figura[Histograma de 300 estaturas con forma de campana. La reproducción agrega los datos por lotes y las barras crecen hasta estabilizar su forma.]{componente="ChartGallery"}
```yaml
grafico: histograma
muestra:
  nombre: Estaturas
  forma: normal
  centro: 168
  escala: 7
  n: 300
eje:
  variable: Estatura
  unidad: cm
```
:::

:::nota[Qué significa cada símbolo]
- $b_0, \dots, b_k$: bordes de los intervalos.
- $k$: número de intervalos.
- $f_k$: frecuencia, número de datos en el intervalo $k$.
- $[b_{k-1}, b_k)$: intervalo que incluye su borde izquierdo y excluye el derecho.
- $h_k$ o $h$: ancho del intervalo.
- $n$: número total de datos.
- $f_k/(n h_k)$: altura de la barra en el histograma de densidad.
:::

## Cómo usar la visualización

La muestra de 300 duraciones de llamadas llega por lotes; las marcas bajo el eje son los datos y las barras sus frecuencias. El control del número de intervalos y el del desplazamiento del primer borde cambian la partición del eje; el encabezado muestra el ancho resultante.

Con 5 intervalos se ve solo una joroba con cola a la derecha; con 40, la cola se fragmenta en barras de 0 y 1 llamadas. Al desplazar el primer borde sin cambiar el número de intervalos, las alturas cambian y algún pico puede aparecer o desaparecer: la forma que se percibe depende de la partición elegida.

## Ejemplo

Los tiempos de traslado, en minutos, de 20 estudiantes son: 12, 15, 18, 22, 25, 26, 28, 30, 31, 33, 34, 35, 38, 40, 42, 45, 48, 52, 58, 65. Se construye un histograma con $k = 5$ intervalos de igual ancho.

1. Rango: $65 - 12 = 53$. Ancho: $h = 53/5 = 10.6$.
2. Bordes: 12, 22.6, 33.2, 43.8, 54.4 y 65.
3. Frecuencias: $[12, 22.6)$: 4 (12, 15, 18, 22); $[22.6, 33.2)$: 6; $[33.2, 43.8)$: 5; $[43.8, 54.4)$: 3; $[54.4, 65]$: 2. Suman 20.
4. La distribución tiene su pico en el segundo intervalo y una cola hacia los tiempos largos.

:::figura[Los 20 tiempos del ejemplo con 5 intervalos; al cambiar a 4 o a 8 intervalos la forma se ve distinta.]{componente="ChartGallery"}
```yaml
grafico: histograma
muestra:
  nombre: Traslado
  valores: [12, 15, 18, 22, 25, 26, 28, 30, 31, 33, 34, 35, 38, 40, 42, 45, 48, 52, 58, 65]
eje:
  variable: Tiempo de traslado
  unidad: min
intervalos: 5
```
:::

## Propiedades

- **Suma de frecuencias:** $\sum_k f_k = n$; en el histograma de densidad, $\sum_k h_k \cdot \frac{f_k}{n h_k} = 1$.
- **Dependencia de la partición:** el número de intervalos y la posición del primer borde cambian la forma percibida, sobre todo con pocos datos.
- **Pérdida de información:** dentro de cada intervalo se pierde la posición exacta de los datos.
- **Consistencia:** con más datos y intervalos cada vez más angostos, pero no demasiado, el histograma de densidad se acerca a la densidad de la población.

:::figura[Propiedad de la partición: las mismas 300 llamadas con solo 30 intervalos. La forma general se conserva, pero la cola se vuelve irregular.]{componente="ChartGallery"}
```yaml
grafico: histograma
muestra:
  nombre: Llamadas
  forma: sesgo-derecha
  parametro: 3
  centro: 6
  escala: 2.5
  n: 300
eje:
  variable: Duración de la llamada
  unidad: min
intervalos: 30
```
:::

## Errores comunes

- **Dejar espacios entre las barras.** Sugiere categorías separadas; en un histograma el eje es continuo y los intervalos son contiguos.
- **Usar intervalos de anchos distintos con alturas de frecuencia.** Un intervalo el doble de ancho parece tener el doble de datos; con anchos desiguales hay que usar alturas de densidad.
- **Usar demasiados intervalos con pocos datos.** El histograma muestra ruido como si fuera estructura.

:::figura[Demasiados intervalos para pocos datos: 30 tiempos de reacción con 40 intervalos. La mayoría de las barras tienen 0 o 1 datos y la forma no se distingue.]{componente="ChartGallery"}
```yaml
grafico: histograma
muestra:
  nombre: Reacción
  forma: normal
  centro: 250
  escala: 30
  n: 30
  decimales: 0
eje:
  variable: Tiempo de reacción
  unidad: ms
intervalos: 40
```
:::

## Conexiones

El histograma resume variables [[datos-discretos-y-continuos|continuas]] sobre su [[rango]]. La elección del número de intervalos se estudia en [[seleccion-del-numero-de-intervalos]], y el [[grafico-de-densidad]] es su versión suavizada. Permite ver la [[asimetria-muestral]], la [[multimodalidad]] y las colas, y se contrasta con el [[grafico-de-barras]], que es para categorías.

## Formulario

:::formula[Frecuencia de un intervalo]
$$
f_k = \#\{i : x_i \in [b_{k-1}, b_k)\}
$$

- $b_{k-1}, b_k$: bordes del intervalo; $x_i$: datos.
:::

:::formula[Ancho con intervalos iguales]
$$
h = \frac{x_{(n)} - x_{(1)}}{k}
$$

- $x_{(n)}, x_{(1)}$: máximo y mínimo; $k$: número de intervalos.
:::

:::formula[Altura de densidad]
$$
\hat{f}(x) = \frac{f_k}{n\,h_k}, \quad x \in [b_{k-1}, b_k)
$$

- $n$: total de datos; $h_k$: ancho del intervalo.
:::
