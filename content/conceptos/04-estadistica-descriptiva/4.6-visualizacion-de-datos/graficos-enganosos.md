---
id: graficos-enganosos
titulo: Gráficos engañosos
titulo_en: Misleading graphs
alias:
  - gráficos distorsionados
  - factor de mentira
  - lie factor
modulo: 4
submodulo: '4.6'
orden: 24
nivel: basico
prerrequisitos:
  - principios-de-tufte-y-proporcion-de-tinta-de-datos
relaciones:
  - tipo: relacionado
    id: escalas-logaritmicas
etiquetas:
  - visualización
  - integridad gráfica
  - distorsión
  - pensamiento crítico
resumen: >
  Un gráfico engañoso transmite una impresión distinta de la que sostienen los datos: ejes truncados,
  figuras escaladas en dos dimensiones, ventanas de tiempo elegidas o proporciones estiradas. El factor
  de mentira mide la exageración.
formula: '\text{factor de mentira} = \frac{\text{tamaño del efecto en el gráfico}}{\text{tamaño del efecto en los datos}}'
visualizacion:
  componente: ChartGallery
  parametros:
    grafico: enganoso
    truco: eje-truncado
    etiquetas: ['2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024']
    valores: [62, 60, 61, 63, 64, 66, 65, 68]
    variable: Hogares con internet (%)
referencias:
  - clave: tufte
publicado: true
---

## Intuición

Un boletín municipal anuncia que el porcentaje de hogares con internet "se duplicó": su gráfico de barras muestra la barra de 2024 el doble de alta que la de 2017. Los datos dicen otra cosa: pasó de 62 % a 68 %, un aumento de casi 10 %. La diferencia está en el eje vertical, que empieza en 56 y no en cero. La barra de 2017 mide 6 unidades y la de 2024 mide 12, así que el dibujo muestra un aumento del 100 %.

Un **gráfico engañoso** no necesita datos falsos: basta con una decisión de diseño que haga que lo visible no corresponda a lo medido. Las más comunes son truncar el eje de un gráfico de barras, escalar figuras en dos dimensiones cuando la cantidad es de una, elegir la ventana de tiempo que conviene al mensaje y estirar o aplastar la proporción del gráfico para exagerar o esconder una pendiente. Edward Tufte propuso medir la distorsión con el **factor de mentira**: cuántas veces el efecto dibujado es mayor que el efecto real.

## Definición

:::definicion[Factor de mentira]
Si una cantidad pasa de $a$ a $b$ en los datos y su representación gráfica pasa de $a'$ a $b'$ (alturas, áreas o longitudes), el **tamaño del efecto** es el cambio relativo

$$
E = \frac{|b - a|}{a},\qquad E' = \frac{|b' - a'|}{a'},
$$

y el **factor de mentira** es

$$
L = \frac{E'}{E}.
$$

Un gráfico íntegro tiene $L = 1$; con $L > 1$ exagera el cambio y con $L < 1$ lo minimiza. Tufte considera aceptable un factor entre 0.95 y 1.05.
:::

:::nota[Qué significa cada símbolo]
- $a$, $b$: valor inicial y final de la cantidad en los datos.
- $a'$, $b'$: tamaño inicial y final de lo dibujado (altura, área o longitud).
- $E$: tamaño del efecto en los datos; $E'$: tamaño del efecto en el gráfico.
- $L$: factor de mentira.
:::

## Cómo usar la visualización

A la izquierda está la versión honesta y a la derecha la distorsionada. La animación lleva la distorsión de cero a su valor completo, y el encabezado calcula el factor de mentira en cada momento.

El selector **Recurso engañoso** cambia entre eje truncado, figura escalada en dos dimensiones, ventana de tiempo elegida y proporción estirada.

Experimentos sugeridos:

1. Con el eje truncado, detener la animación a la mitad: el factor ya es cercano a 2, y en el último cuarto se dispara.
2. Cambiar a la figura escalada: el factor final es $1 + b/a$, cercano a 2.
3. Cambiar a la ventana de tiempo: el cambio que muestran los últimos años es distinto del de toda la serie.

## Ejemplo

Con los hogares con internet, $a = 62$ y $b = 68$:

1. Efecto en los datos: $E = (68 - 62)/62 \approx 0.097$, es decir, 9.7 %.
2. Con el eje desde 56, las barras miden $a' = 62 - 56 = 6$ y $b' = 68 - 56 = 12$.
3. Efecto dibujado: $E' = (12 - 6)/6 = 1$, es decir, 100 %.
4. Factor de mentira: $L = 1/0.097 \approx 10.3$. El gráfico exagera el cambio unas diez veces.

:::figura[Solo dos años, 2017 y 2024. Con estos dos datos la base sube hasta 59: las barras miden 3 y 9, el dibujo triplica la barra y el factor de mentira llega a 21.]{componente="ChartGallery"}
```yaml
grafico: enganoso
truco: eje-truncado
etiquetas: ['2017', '2024']
valores: [62, 68]
variable: Hogares con internet (%)
```
:::

## Propiedades

**Figuras escaladas en dos dimensiones.** Si un ícono crece en alto y en ancho proporcionalmente a la cantidad, su área crece con el cuadrado: una cantidad que se duplica se dibuja cuatro veces mayor, con $L = (r^2 - 1)/(r - 1) = r + 1$ para una razón $r = b/a$.

:::figura[Pictograma: producción de una granja que pasa de 40 a 80 toneladas. La figura que crece en alto y ancho cuadruplica su área.]{componente="ChartGallery"}
```yaml
grafico: enganoso
truco: pictograma
etiquetas: ['2020', '2024']
valores: [40, 80]
variable: Producción (toneladas)
```
:::

**Ventana de tiempo elegida.** Mostrar solo el tramo que favorece el mensaje cambia la conclusión sin alterar un solo dato.

:::figura[Ventana conveniente: accidentes viales mensuales que bajaron durante una década y repuntaron en los dos últimos años. Mostrando solo el final, parece una crisis.]{componente="ChartGallery"}
```yaml
grafico: enganoso
truco: ventana
etiquetas: ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024']
valores: [80, 76, 72, 70, 66, 63, 60, 58, 61, 64]
variable: Accidentes por mes
```
:::

**Proporción del gráfico.** Comprimir el ancho de un gráfico de líneas hace que la misma pendiente se vea más empinada.

:::figura[Proporción estirada: crecimiento de la deuda de un municipio. La misma serie dibujada en un espacio más angosto parece dispararse.]{componente="ChartGallery"}
```yaml
grafico: enganoso
truco: relacion-aspecto
etiquetas: ['2018', '2019', '2020', '2021', '2022', '2023', '2024']
valores: [100, 104, 107, 112, 115, 119, 124]
variable: Deuda (millones de pesos)
```
:::

## Errores comunes

- **Creer que todo eje que no empieza en cero engaña.** En un gráfico de barras la longitud codifica la cantidad y la base debe ser cero; en un gráfico de líneas o de puntos se leen posiciones, y un eje ajustado al rango de los datos es legítimo.
- **Pensar que sin datos falsos no hay engaño.** Todos los recursos de esta ficha usan datos verdaderos.
- **Fijarse solo en la forma y no en los ejes.** Leer siempre las escalas, el origen, las unidades y el periodo mostrado.
- **Confundir un gráfico en escala logarítmica con uno engañoso.** La escala logarítmica es legítima si está indicada; lo engañoso es no señalarla.

:::figura[Eje ajustado legítimo: la misma serie de hogares con internet como gráfico de líneas con el eje en el rango de los datos. Aquí se leen posiciones y pendientes, no longitudes desde cero.]{componente="ChartGallery"}
```yaml
grafico: lineas
periodos: ['2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024']
series:
  - nombre: Hogares con internet
    valores: [62, 60, 61, 63, 64, 66, 65, 68]
variable: Hogares con internet (%)
```
:::

## Conexiones

El factor de mentira formaliza la integridad gráfica de los [[principios-de-tufte-y-proporcion-de-tinta-de-datos|principios de Tufte]]. El eje truncado afecta sobre todo al [[grafico-de-barras]]; la ventana y la proporción, al [[grafico-de-lineas]]; las figuras escaladas, a las comparaciones de área que se estudian en [[percepcion-visual-y-codificacion-de-variables]]. Las [[escalas-logaritmicas]] cambian legítimamente la lectura de un gráfico y deben indicarse con claridad.

## Formulario

:::formula[Tamaño del efecto]
$$
E = \frac{|b - a|}{a}
$$

- $a$, $b$: valor inicial y final; $E$: cambio relativo.
:::

:::formula[Factor de mentira]
$$
L = \frac{E'}{E}
$$

- $E'$: cambio relativo de lo dibujado; $E$: cambio relativo de los datos.
:::

:::formula[Barras con base truncada en c]
$$
a' = a - c,\qquad b' = b - c
$$

- $c$: valor donde empieza el eje; $a'$, $b'$: alturas dibujadas.
:::

:::formula[Figura escalada en dos dimensiones]
$$
L = \frac{r^2 - 1}{r - 1} = r + 1,\qquad r = \frac{b}{a} \ne 1
$$

- $r$: razón entre el valor final y el inicial; el área dibujada crece como $r^2$.
:::
