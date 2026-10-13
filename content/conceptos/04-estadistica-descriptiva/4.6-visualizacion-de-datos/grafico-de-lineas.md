---
id: grafico-de-lineas
titulo: Gráfico de líneas
titulo_en: Line chart
alias:
  - gráfica de líneas
  - gráfico de series de tiempo
modulo: 4
submodulo: '4.6'
orden: 15
nivel: basico
prerrequisitos:
  - diagrama-de-dispersion
  - datos-transversales-longitudinales-y-de-panel
etiquetas:
  - visualización
  - tiempo
  - tendencia
  - series
resumen: >
  El gráfico de líneas une con segmentos los valores de una variable medidos en un orden natural, casi
  siempre el tiempo. La pendiente de cada tramo muestra el ritmo de cambio y permite ver tendencias,
  ciclos y quiebres.
formula: '\text{pendiente del tramo } t = \frac{y_{t+1} - y_t}{x_{t+1} - x_t}'
visualizacion:
  componente: ChartGallery
  parametros:
    grafico: lineas
    periodos: [Ene, Feb, Mar, Abr, May, Jun, Jul, Ago, Sep, Oct, Nov, Dic]
    series:
      - nombre: Monterrey
        valores: [20.5, 22.8, 26.1, 29.4, 31.6, 33.0, 33.4, 33.6, 30.9, 27.0, 23.3, 20.6]
      - nombre: Ciudad de México
        valores: [14.0, 15.6, 17.8, 19.2, 19.7, 18.9, 17.8, 17.9, 17.6, 16.5, 15.4, 14.3]
    variable: Temperatura media (°C)
referencias:
  - clave: hyndman-fpp
    capitulo: '2'
  - clave: tufte
publicado: true
---

## Intuición

Un servicio meteorológico publica la temperatura media de cada mes en dos ciudades. Si los doce valores de cada ciudad se dibujan como puntos y se unen con segmentos en orden de enero a diciembre, aparece la forma del año: una curva que sube hacia el verano y baja hacia el invierno. Las líneas de dos ciudades en el mismo gráfico muestran de un vistazo cuál es más cálida y cuál tiene mayor variación anual.

El **gráfico de líneas** aprovecha que el eje horizontal tiene un orden natural. Los segmentos guían la vista de un periodo al siguiente, y la inclinación de cada tramo indica qué tan rápido cambió la variable. Unir los puntos tiene sentido justamente porque entre un mes y el siguiente la temperatura pasa por valores intermedios; por la misma razón, no tiene sentido unir categorías sin orden, como países o marcas.

## Definición

:::definicion[Gráfico de líneas]
Sean $T$ mediciones $(x_1, y_1), \dots, (x_T, y_T)$ con $x_1 < x_2 < \dots < x_T$ en una escala ordenada (tiempo, edad, dosis). El **gráfico de líneas** dibuja los puntos $(x_t, y_t)$ y los une con segmentos consecutivos. La pendiente del tramo entre $t$ y $t + 1$ es

$$
m_t = \frac{y_{t+1} - y_t}{x_{t+1} - x_t}.
$$

:::

Condiciones de uso:

- El eje horizontal debe ser ordenado y, si es tiempo, con separaciones proporcionales a los intervalos reales.
- Con varias series, cada una lleva un color o estilo distinto y una etiqueta.
- El eje vertical no necesita empezar en cero, porque la lectura se basa en posiciones y pendientes, no en longitudes; pero el rango elegido cambia la impresión de la pendiente.

:::nota[Qué significa cada símbolo]
- $T$: número de periodos.
- $x_t$: posición del periodo $t$ en el eje horizontal.
- $y_t$: valor de la variable en el periodo $t$.
- $m_t$: pendiente del tramo entre los periodos $t$ y $t + 1$, cambio de $y$ por unidad de $x$.
:::

## Cómo usar la visualización

Las líneas se trazan mes a mes. El encabezado muestra el valor de cada ciudad en el último mes dibujado y su cambio $\Delta$ respecto al mes anterior.

Controles: **Escala vertical** (lineal o logarítmica) y **Solo puntos, sin unir**.

Experimentos sugeridos:

1. Detener la animación en mayo y comparar los cambios $\Delta$: Monterrey sube más rápido en primavera.
2. Activar solo puntos: la forma estacional sigue ahí, pero cuesta más seguirla sin los segmentos.
3. Observar que las líneas no se cruzan: Monterrey es más cálida todo el año, con una amplitud mucho mayor.

## Ejemplo

Para Monterrey, entre marzo (26.1 °C) y abril (29.4 °C), con meses consecutivos:

1. Cambio: $\Delta = 29.4 - 26.1 = 3.3$ °C.
2. Pendiente del tramo: $m = 3.3 / 1 = 3.3$ °C por mes.
3. Entre julio (33.4) y agosto (33.6) la pendiente es $0.2$ °C por mes: el tramo casi horizontal indica la meseta del verano.
4. Amplitud anual: $33.6 - 20.5 = 13.1$ °C en Monterrey frente a $19.7 - 14.0 = 5.7$ °C en la Ciudad de México.

:::figura[Una sola serie del ejemplo, la temperatura de Monterrey: los tramos más inclinados de primavera y otoño y la meseta del verano.]{componente="ChartGallery"}
```yaml
grafico: lineas
periodos: [Ene, Feb, Mar, Abr, May, Jun, Jul, Ago, Sep, Oct, Nov, Dic]
series:
  - nombre: Monterrey
    valores: [20.5, 22.8, 26.1, 29.4, 31.6, 33.0, 33.4, 33.6, 30.9, 27.0, 23.3, 20.6]
variable: Temperatura media (°C)
```
:::

## Propiedades

- **Pendiente como ritmo de cambio:** tramos más inclinados indican cambios más rápidos.
- **Varias series comparables:** con una escala común se ven diferencias de nivel, cruces y tendencias.
- **Escala logarítmica para crecimiento:** con crecimiento porcentual constante, la línea en escala logarítmica es recta.

:::figura[Crecimiento porcentual: usuarios de dos aplicaciones. En escala lineal la de rápido crecimiento parece despegar de golpe; en escala logarítmica su línea es casi recta.]{componente="ChartGallery"}
```yaml
grafico: lineas
periodos: ['2018', '2019', '2020', '2021', '2022', '2023', '2024']
series:
  - nombre: Aplicación A
    valores: [5, 10, 20, 40, 80, 160, 320]
  - nombre: Aplicación B
    valores: [60, 72, 85, 100, 118, 140, 165]
variable: Usuarios (miles)
escala: logaritmica
```
:::

## Errores comunes

- **Unir categorías sin orden.** Una línea entre "Chile", "Perú" y "Cuba" sugiere una progresión que no existe; corresponde un gráfico de barras.
- **Espaciar igual periodos desiguales.** Si los años son 2000, 2010, 2020, 2022 y 2024, dibujarlos equidistantes exagera el cambio reciente.
- **Demasiadas series.** Con más de cinco o seis líneas el gráfico se vuelve un enredo; conviene resaltar una o usar paneles pequeños.

:::figura[Categorías sin orden unidas con líneas: esperanza de vida aproximada en cinco países. Los segmentos sugieren una tendencia entre países que no significa nada; al activar Solo puntos, sin unir, desaparece esa falsa progresión.]{componente="ChartGallery"}
```yaml
grafico: lineas
periodos: [Chile, Perú, Cuba, México, Brasil]
series:
  - nombre: Esperanza de vida
    valores: [80.7, 77.7, 78.2, 75.1, 75.9]
variable: Años
```
:::

:::figura[Error de espaciado: población de un municipio en los años 2000, 2010, 2020, 2022 y 2024, dibujados a la misma distancia. Los dos últimos tramos abarcan dos años cada uno pero se ven tan anchos como los de diez años, y su pendiente parece cinco veces más suave de lo que es.]{componente="ChartGallery"}
```yaml
grafico: lineas
periodos: ['2000', '2010', '2020', '2022', '2024']
series:
  - nombre: Población
    valores: [42, 51, 60, 62, 64]
variable: Habitantes (miles)
```
:::

:::figura[Demasiadas series: ventas mensuales de seis tiendas. Las líneas se cruzan constantemente y ninguna se puede seguir.]{componente="ChartGallery"}
```yaml
grafico: lineas
periodos: [Ene, Feb, Mar, Abr, May, Jun, Jul, Ago]
series:
  - nombre: Tienda 1
    valores: [50, 55, 48, 60, 58, 62, 57, 65]
  - nombre: Tienda 2
    valores: [52, 49, 57, 54, 61, 55, 63, 59]
  - nombre: Tienda 3
    valores: [48, 58, 52, 56, 54, 60, 61, 56]
  - nombre: Tienda 4
    valores: [55, 51, 54, 50, 59, 57, 55, 62]
  - nombre: Tienda 5
    valores: [47, 53, 59, 52, 56, 63, 58, 60]
  - nombre: Tienda 6
    valores: [53, 47, 50, 58, 52, 54, 64, 58]
variable: Ventas (miles de pesos)
```
:::

## Conexiones

El gráfico de líneas es un [[diagrama-de-dispersion]] con el eje horizontal ordenado y los puntos unidos; es la forma natural de mostrar [[datos-transversales-longitudinales-y-de-panel|datos longitudinales]]. Para crecimientos multiplicativos se combina con [[escalas-logaritmicas]], y la elección de la proporción del gráfico, que cambia la pendiente aparente, aparece entre los [[graficos-enganosos]].

## Formulario

:::formula[Pendiente de un tramo]
$$
m_t = \frac{y_{t+1} - y_t}{x_{t+1} - x_t}
$$

- $m_t$: ritmo de cambio entre los periodos $t$ y $t + 1$.
- $y_t$, $y_{t+1}$: valores en esos periodos.
- $x_t$, $x_{t+1}$: posiciones de esos periodos en el eje horizontal.
:::

:::formula[Cambio entre periodos]
$$
\Delta_t = y_{t+1} - y_t
$$

- $\Delta_t$: cambio absoluto de la variable entre los periodos $t$ y $t + 1$.
:::

:::formula[Amplitud de una serie]
$$
\max_t y_t - \min_t y_t
$$

- $\max_t y_t$, $\min_t y_t$: valores mayor y menor de la serie.
:::
