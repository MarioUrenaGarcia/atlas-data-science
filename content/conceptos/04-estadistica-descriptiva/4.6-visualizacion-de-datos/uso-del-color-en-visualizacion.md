---
id: uso-del-color-en-visualizacion
titulo: Uso del color en visualización (paletas secuenciales, divergentes, categóricas)
titulo_en: Use of color in visualization
alias:
  - paletas de color
  - escalas de color
  - colores accesibles
modulo: 4
submodulo: '4.6'
orden: 27
nivel: basico
prerrequisitos:
  - mapa-de-calor
  - percepcion-visual-y-codificacion-de-variables
etiquetas:
  - visualización
  - color
  - accesibilidad
  - diseño
resumen: >
  El color se elige según el tipo de dato: paletas secuenciales para cantidades, divergentes para valores
  alrededor de un centro y categóricas para clases sin orden. Una buena paleta conserva el orden en gris y
  es legible con daltonismo.
formula: 't = \frac{v - v_{\min}}{v_{\max} - v_{\min}},\qquad u = \frac{v - m}{\max(m - v_{\min},\ v_{\max} - m)}'
visualizacion:
  componente: ChartGallery
  parametros:
    grafico: calor
    filas: ['2019', '2020', '2021', '2022', '2023', '2024']
    columnas: [Ene, Feb, Mar, Abr, May, Jun, Jul, Ago, Sep, Oct, Nov, Dic]
    valores:
      - [-0.4, -0.2, 0.1, 0.3, 0.2, -0.1, -0.3, 0.0, 0.2, 0.4, 0.1, -0.2]
      - [0.1, 0.3, 0.2, 0.5, 0.6, 0.4, 0.2, 0.3, 0.5, 0.7, 0.4, 0.2]
      - [-0.3, -0.5, -0.2, 0.0, 0.1, 0.3, 0.2, 0.1, -0.1, 0.0, -0.4, -0.6]
      - [0.2, 0.4, 0.6, 0.8, 0.9, 1.1, 1.0, 0.8, 0.7, 0.9, 0.6, 0.5]
      - [0.6, 0.8, 1.0, 1.2, 1.4, 1.6, 1.5, 1.3, 1.2, 1.4, 1.1, 0.9]
      - [0.9, 1.1, 1.3, 1.5, 1.7, 1.9, 1.8, 1.6, 1.5, 1.6, 1.3, 1.1]
    paleta: divergente
    centro: 0
    variable: Anomalía de temperatura (°C)
    compararPaletas: true
referencias:
  - clave: tufte
  - clave: murphy
publicado: true
---

## Intuición

Un instituto de clima publica la anomalía de temperatura de cada mes: cuántos grados estuvo por encima o por debajo del promedio histórico. El dato tiene un centro natural, el cero, y dos direcciones con significado: más cálido y más frío. Si se pinta con una paleta de un solo tono, de claro a oscuro, los meses fríos y los ligeramente cálidos quedan con tonos parecidos y el cero no se distingue. Con una paleta **divergente**, azul para negativos y rojo para positivos con blanco en el cero, el calentamiento de los últimos años salta a la vista.

El color es un canal visual poderoso pero fácil de usar mal. La regla es que la paleta respete la estructura del dato: una cantidad que va de poco a mucho pide una paleta **secuencial**, con luminosidad que cambia en una sola dirección; una cantidad con un centro pide una **divergente**; unas clases sin orden piden una **categórica**, con tonos bien distintos y luminosidad parecida. Además, cerca de uno de cada doce hombres y una de cada doscientas mujeres tienen alguna forma de daltonismo rojo y verde, y muchos gráficos se imprimen en gris: una buena paleta sigue funcionando en esas condiciones.

## Definición

:::definicion[Tipos de paleta]
Sea $v$ el valor de una celda o marca, con mínimo $v_{\min}$ y máximo $v_{\max}$ en los datos.

- **Secuencial:** el color es $C(t)$ con $t = \dfrac{v - v_{\min}}{v_{\max} - v_{\min}} \in [0, 1]$ y $C$ cambia de claro a oscuro de forma monótona.
- **Divergente:** con un valor de referencia $m$, el color es $C(u)$ con $u = \dfrac{v - m}{\max(m - v_{\min},\ v_{\max} - m)} \in [-1, 1]$; el signo de $u$ elige el tono y $|u|$ la intensidad, y $u = 0$ es neutro.
- **Categórica:** cada clase $c$ recibe un tono distinto $C_c$, sin orden de luminosidad.
:::

Criterios de una buena paleta:

- La luminosidad debe crecer en una sola dirección en las secuenciales y alejarse del centro en las divergentes, para que el orden se conserve al imprimir en gris.
- Debe evitar depender solo del contraste entre rojo y verde.
- Una paleta categórica legible no pasa de ocho tonos.

:::nota[Qué significa cada símbolo]
- $v$: valor representado; $v_{\min}$, $v_{\max}$: mínimo y máximo.
- $t$: posición entre 0 y 1 en una paleta secuencial.
- $m$: valor de referencia de una paleta divergente.
- $u$: posición entre $-1$ y $1$ en una paleta divergente.
- $C$: función que asigna un color a cada posición; $C_c$: color de la clase $c$.
:::

## Cómo usar la visualización

Las filas de años aparecen una por una. El encabezado indica la paleta y el rango de valores, y con la paleta divergente también el centro.

Controles: **Paleta** (secuencial, divergente, categórica o arcoíris), **Ver como** (visión típica, escala de grises o deuteranopía) y **Mostrar los valores**.

Experimentos sugeridos:

1. Cambiar a secuencial: los meses de 2021 por debajo del promedio dejan de distinguirse de los ligeramente cálidos.
2. Elegir arcoíris y luego escala de grises: el orden de claro a oscuro se rompe y aparecen bandas falsas.
3. Con la divergente, simular deuteranopía: el contraste entre azul y rojo se conserva.

## Ejemplo

Con la paleta divergente centrada en $m = 0$, $v_{\min} = -0.6$ y $v_{\max} = 1.9$:

1. Denominador: $\max(0 - (-0.6),\ 1.9 - 0) = 1.9$.
2. Para $v = 1.9$ (junio de 2024): $u = 1.9/1.9 = 1$, el rojo más intenso.
3. Para $v = -0.6$ (diciembre de 2021): $u = -0.6/1.9 \approx -0.32$, un azul claro. Como el denominador es común, un grado frío y uno cálido tienen la misma intensidad.
4. Para $v = 0$ (agosto de 2019 o abril de 2021): $u = 0$, blanco.

:::figura[Dos años del ejemplo, 2021 y 2024: el primero mezcla meses fríos y cálidos alrededor del cero; el segundo es cálido todo el año.]{componente="ChartGallery"}
```yaml
grafico: calor
filas: ['2021', '2024']
columnas: [Ene, Feb, Mar, Abr, May, Jun, Jul, Ago, Sep, Oct, Nov, Dic]
valores:
  - [-0.3, -0.5, -0.2, 0.0, 0.1, 0.3, 0.2, 0.1, -0.1, 0.0, -0.4, -0.6]
  - [0.9, 1.1, 1.3, 1.5, 1.7, 1.9, 1.8, 1.6, 1.5, 1.6, 1.3, 1.1]
paleta: divergente
centro: 0
variable: Anomalía de temperatura (°C)
```
:::

## Propiedades

**Paleta secuencial para cantidades sin centro.**

:::figura[Paleta secuencial: lluvia mensual en cuatro estados. Más oscuro significa más lluvia y el orden se conserva en gris.]{componente="ChartGallery"}
```yaml
grafico: calor
filas: [Chiapas, Veracruz, Jalisco, Sonora]
columnas: [Ene, Mar, May, Jul, Sep, Nov]
valores:
  - [60, 40, 150, 260, 330, 90]
  - [45, 30, 90, 300, 340, 80]
  - [15, 5, 25, 230, 170, 20]
  - [20, 8, 4, 90, 60, 15]
paleta: secuencial
variable: Lluvia (mm)
```
:::

**Paleta categórica para clases sin orden.** Los tonos distintos separan grupos; la luminosidad similar evita sugerir un orden.

:::figura[Paleta categórica: medios de transporte de una encuesta. Cada medio tiene un tono propio sin jerarquía.]{componente="ChartGallery"}
```yaml
grafico: barras
categorias: [Autobús, Metro, Auto, Bicicleta, A pie]
valores: [34, 22, 25, 7, 12]
variable: Porcentaje de viajes
vista: ambas
```
:::

## Errores comunes

- **Usar el arcoíris para cantidades.** No tiene un orden de luminosidad: el amarillo, más claro que el verde y el rojo, crea bandas falsas y en gris el orden se pierde.
- **Paleta secuencial para datos con centro.** Oculta el signo: un valor bajo y uno negativo se confunden.
- **Paleta categórica para cantidades.** Los tonos sin orden obligan a consultar la leyenda para cada celda.
- **Contraste solo rojo y verde.** Para las personas con deuteranopía esos tonos se ven casi iguales.

:::figura[Arcoíris en datos con centro: las mismas anomalías con la paleta arcoíris. Con Ver como en escala de grises o deuteranopía, el orden de los valores desaparece.]{componente="ChartGallery"}
```yaml
grafico: calor
filas: ['2019', '2020', '2021', '2022', '2023', '2024']
columnas: [Ene, Feb, Mar, Abr, May, Jun, Jul, Ago, Sep, Oct, Nov, Dic]
valores:
  - [-0.4, -0.2, 0.1, 0.3, 0.2, -0.1, -0.3, 0.0, 0.2, 0.4, 0.1, -0.2]
  - [0.1, 0.3, 0.2, 0.5, 0.6, 0.4, 0.2, 0.3, 0.5, 0.7, 0.4, 0.2]
  - [-0.3, -0.5, -0.2, 0.0, 0.1, 0.3, 0.2, 0.1, -0.1, 0.0, -0.4, -0.6]
  - [0.2, 0.4, 0.6, 0.8, 0.9, 1.1, 1.0, 0.8, 0.7, 0.9, 0.6, 0.5]
  - [0.6, 0.8, 1.0, 1.2, 1.4, 1.6, 1.5, 1.3, 1.2, 1.4, 1.1, 0.9]
  - [0.9, 1.1, 1.3, 1.5, 1.7, 1.9, 1.8, 1.6, 1.5, 1.6, 1.3, 1.1]
paleta: arcoiris
variable: Anomalía de temperatura (°C)
```
:::

:::figura[Paleta categórica para una cantidad: la lluvia de los cuatro estados con tonos sin orden. Hay que consultar el valor para saber qué celda tiene más lluvia.]{componente="ChartGallery"}
```yaml
grafico: calor
filas: [Chiapas, Veracruz, Jalisco, Sonora]
columnas: [Ene, Mar, May, Jul, Sep, Nov]
valores:
  - [60, 40, 150, 260, 330, 90]
  - [45, 30, 90, 300, 340, 80]
  - [15, 5, 25, 230, 170, 20]
  - [20, 8, 4, 90, 60, 15]
paleta: categorica
variable: Lluvia (mm)
```
:::

## Conexiones

El color es el canal de menor precisión en la jerarquía de [[percepcion-visual-y-codificacion-de-variables]], por lo que se usa para patrones más que para lecturas exactas. Su aplicación principal es el [[mapa-de-calor]], incluida la [[matriz-de-correlacion]], que pide una paleta divergente centrada en cero. Los [[principios-de-tufte-y-proporcion-de-tinta-de-datos|principios de Tufte]] piden además no usar el color como simple decoración.

## Formulario

:::formula[Posición en una paleta secuencial]
$$
t = \frac{v - v_{\min}}{v_{\max} - v_{\min}}
$$

- $t$: posición entre 0 y 1; $v$: valor; $v_{\min}$, $v_{\max}$: extremos de los datos.
:::

:::formula[Posición en una paleta divergente]
$$
u = \frac{v - m}{\max(m - v_{\min},\ v_{\max} - m)}
$$

- $u$: posición entre $-1$ y $1$; el signo elige el tono y $|u|$ la intensidad.
- $m$: valor de referencia; $v$, $v_{\min}$, $v_{\max}$: valor y extremos.
:::

:::formula[Luminancia relativa para la vista en gris]
$$
Y = 0.2126\,R + 0.7152\,G + 0.0722\,B
$$

- $Y$: luminancia con la que se dibuja cada color en escala de grises.
- $R$, $G$, $B$: componentes rojo, verde y azul del color.
:::
