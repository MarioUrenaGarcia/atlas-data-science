---
id: coeficiente-de-variacion
titulo: Coeficiente de variación
titulo_en: Coefficient of variation
alias:
  - CV
  - desviación estándar relativa
modulo: 4
submodulo: '4.3'
orden: 5
nivel: basico
prerrequisitos:
  - desviacion-estandar-muestral
  - escalas-nominal-ordinal-de-intervalo-y-de-razon
etiquetas:
  - dispersión relativa
  - comparación de variabilidad
  - escala de razón
  - precisión
resumen: >
  El coeficiente de variación divide la desviación estándar entre la media. Expresa la dispersión
  como fracción del nivel de los datos y permite comparar variables de escalas o unidades distintas.
formula: '\mathrm{CV} = \frac{s}{\bar{x}}'
visualizacion:
  componente: DataStrip
  parametros:
    modo: dispersion
    datos: [50.2, 49.8, 50.1, 49.9, 50.0]
    medida: cv
    lecturas: [desviacion, cv]
    banda: true
    variable: Balanza A, pesa patrón de 50 g
    unidad: g
    decimales: 1
    comparar:
      datos: [5.1, 4.8, 5.3, 4.9, 4.9]
      variable: Balanza B, pesa patrón de 5 g
      unidad: g
referencias:
  - clave: degroot
publicado: true
---

## Intuición

Un error de 2 gramos al pesar una cebolla no importa; el mismo error al pesar una dosis de medicamento puede ser grave. Lo que importa no es el tamaño absoluto de la variación, sino su tamaño en relación con lo que se mide. Dos laboratorios comparan sus balanzas: la primera pesa repetidamente una pesa de 50 g con una desviación estándar de 0.16 g; la segunda pesa una de 5 g con desviación estándar de 0.20 g. Las desviaciones son parecidas, pero la segunda balanza se equivoca en proporción mucho más.

El **coeficiente de variación** pone ambas en la misma escala dividiendo la desviación estándar entre la media. El resultado no tiene unidades y suele expresarse en porcentaje: la balanza A varía 0.3 % de lo que pesa y la B, 4 %. Por eso sirve para comparar la variabilidad de cosas que no se pueden comparar directamente, como la estatura de adultos y la de recién nacidos, o el precio de un auto y el de un refresco.

## Definición

:::definicion[Coeficiente de variación]
Para datos positivos con media $\bar{x} > 0$ y desviación estándar $s$,
$$
\mathrm{CV} = \frac{s}{\bar{x}}, \qquad \text{o en porcentaje,} \qquad \mathrm{CV} = 100\,\frac{s}{\bar{x}}\ \%.
$$
Su versión poblacional es $\sigma / \mu$.
:::

Solo tiene sentido para variables medidas en **escala de razón**, con un cero absoluto y valores positivos: si el cero es arbitrario, como en la temperatura en grados Celsius, la media puede estar cerca de cero o ser negativa y el cociente pierde significado.

:::figura[Coeficiente de variación de la estatura de cinco adultos y de cinco niños de dos años. Los adultos varían más en centímetros, pero ambos grupos varían de forma parecida en proporción a su estatura media.]{componente="DataStrip"}
```yaml
modo: dispersion
datos: [165, 172, 158, 180, 169]
medida: cv
lecturas: [desviacion, cv]
banda: true
variable: Estatura de adultos
unidad: cm
decimales: 0
comparar:
  datos: [86, 89, 84, 91, 88]
  variable: Estatura a los dos años
  unidad: cm
```
:::

:::nota[Qué significa cada símbolo]
- $\mathrm{CV}$: coeficiente de variación, sin unidades.
- $s$: desviación estándar muestral.
- $\bar{x}$: media muestral, que debe ser positiva.
- $\sigma$, $\mu$: desviación estándar y media de la población.
:::

## Cómo usar la visualización

Hay dos grupos de cinco pesadas, uno por balanza, cada uno con su propio eje. En cada grupo se dibujan las desviaciones y, al final, la banda de una desviación estándar. El encabezado de cada grupo calcula $s / \bar{x}$ y lo convierte en porcentaje.

Las dos bandas se ven de ancho parecido en sus ejes, pero el panel muestra que el coeficiente de la balanza B es más de diez veces mayor. Al arrastrar una pesada de la balanza A hasta 51 g, su CV sube, pero sigue siendo menor que el de B: hace falta un error enorme en 50 g para igualar en proporción un error pequeño en 5 g.

## Ejemplo

Una planta empaca cajas de cereal de 500 g y paquetes de galletas de 50 g. Cinco cajas pesaron 498, 503, 500, 497 y 502 g; cinco paquetes, 49, 52, 50, 48 y 51 g.

1. Cereal: $\bar{x} = 500$ g, $s \approx 2.55$ g, $\mathrm{CV} = 2.55/500 \approx 0.0051 = 0.51$ %.
2. Galletas: $\bar{x} = 50$ g, $s \approx 1.58$ g, $\mathrm{CV} = 1.58/50 \approx 0.0316 = 3.16$ %.
3. En gramos, las cajas de cereal varían más (2.55 contra 1.58), pero en proporción el empaque de galletas es seis veces menos preciso.

:::figura[Las cajas y los paquetes del ejemplo con su coeficiente de variación.]{componente="DataStrip"}
```yaml
modo: dispersion
datos: [498, 503, 500, 497, 502]
medida: cv
lecturas: [cv]
variable: Cajas de cereal
unidad: g
decimales: 0
comparar:
  datos: [49, 52, 50, 48, 51]
  variable: Paquetes de galletas
  unidad: g
```
:::

## Propiedades

- **Sin unidades:** si $y_i = b\,x_i$ con $b > 0$, entonces $\mathrm{CV}_y = \mathrm{CV}_x$. Pasar de kilogramos a gramos no lo cambia.
- **No es invariante ante traslaciones:** sumar una constante cambia la media y no la desviación estándar, así que cambia el CV.
- **Distribuciones con varianza proporcional a la media al cuadrado:** en variables como las lognormales, el CV es constante aunque cambie el nivel, lo que lo hace un buen resumen.
- **Inestable con medias pequeñas:** si $\bar{x}$ está cerca de cero, pequeños cambios en los datos producen cambios enormes en el CV.

:::figura[Propiedad de invariancia ante cambio de unidad: el mismo consumo de agua en metros cúbicos y en litros tiene exactamente el mismo coeficiente de variación, 15.25 %.]{componente="DataStrip"}
```yaml
modo: dispersion
datos: [1.2, 1.5, 1.1, 1.6, 1.4]
medida: cv
lecturas: [desviacion, cv]
variable: Consumo diario
unidad: m³
decimales: 1
comparar:
  datos: [1200, 1500, 1100, 1600, 1400]
  variable: Consumo diario en litros
  unidad: L
```
:::

## Errores comunes

- **Usarlo con escalas de intervalo.** El CV de temperaturas en grados Celsius cambia si se miden en Fahrenheit y explota cuando la media se acerca a 0 °C.
- **Calcularlo con medias negativas o cercanas a cero**, como rendimientos financieros o saldos que pueden ser negativos.
- **Comparar CV de variables con significados distintos sin pensar.** Un CV menor no siempre es mejor; en una inversión puede significar menos riesgo, pero también menos oportunidad.

:::figura[Error con escala de intervalo: temperaturas mínimas de cinco días de invierno (-2, 1, 3, 0 y -1 °C). La media es 0.2 °C y el coeficiente de variación sale cercano a 960 %, un número sin interpretación.]{componente="DataStrip"}
```yaml
modo: dispersion
datos: [-2, 1, 3, 0, -1]
medida: cv
lecturas: [desviacion, cv]
variable: Temperatura mínima
unidad: °C
decimales: 0
dominio: [-4, 5]
```
:::

## Conexiones

El coeficiente de variación combina la [[desviacion-estandar-muestral]] con la [[media-aritmetica]] y requiere una [[escalas-nominal-ordinal-de-intervalo-y-de-razon|escala de razón]]. Se usa en control de calidad para comparar la precisión de procesos, en química analítica como "desviación estándar relativa" y en finanzas para comparar riesgo por unidad de rendimiento.

## Formulario

:::formula[Coeficiente de variación]
$$
\mathrm{CV} = \frac{s}{\bar{x}}
$$

- $s$: desviación estándar muestral.
- $\bar{x}$: media muestral positiva.
:::

:::formula[En porcentaje]
$$
\mathrm{CV}\,\% = 100 \cdot \frac{s}{\bar{x}}
$$

- Expresa la desviación estándar como porcentaje de la media.
:::

:::formula[Invariancia ante cambio de unidad]
$$
y_i = b\,x_i,\ b > 0 \ \Longrightarrow\ \frac{s_y}{\bar{y}} = \frac{b\,s_x}{b\,\bar{x}} = \frac{s_x}{\bar{x}}
$$

- $b$: factor de cambio de unidad.
:::
