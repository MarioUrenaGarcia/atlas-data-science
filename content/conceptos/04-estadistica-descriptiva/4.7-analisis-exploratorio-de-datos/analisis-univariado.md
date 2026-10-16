---
id: analisis-univariado
titulo: Análisis univariado
titulo_en: Univariate analysis
alias:
  - exploración de una variable
  - análisis de una variable
modulo: 4
submodulo: '4.7'
orden: 2
nivel: basico
prerrequisitos:
  - analisis-exploratorio-de-datos
  - asimetria-muestral
etiquetas:
  - exploración
  - una variable
  - distribución
  - resúmenes
resumen: >
  El análisis univariado describe cada variable por separado: su tipo, completitud, centro, dispersión,
  forma y valores inusuales, con la gráfica adecuada a su tipo. Es el primer paso del análisis exploratorio.
formula: '(n,\ \text{faltantes},\ \tilde{x},\ \text{RIQ},\ g_1,\ \min,\ \max)'
visualizacion:
  componente: EdaWorkflow
  parametros:
    modo: univariado
    variable: superficie
referencias:
  - clave: james-isl
    capitulo: '2'
publicado: true
---

## Intuición

Antes de preguntar cómo se relacionan el precio y la superficie de una vivienda, conviene conocer cada variable por su cuenta. ¿Cuántos valores hay y cuántos faltan? ¿Dónde se concentran? ¿Qué tan dispersos están? ¿La distribución es simétrica o tiene una cola larga? ¿Hay valores imposibles, como una casa de 1210 m² en un fraccionamiento de casas medianas?

El **análisis univariado** responde esas preguntas variable por variable. Para una variable numérica se combinan un histograma, que muestra la forma, un diagrama de caja, que marca los cuartiles y los valores alejados, y unos pocos números. Para una variable categórica basta un gráfico de barras con las frecuencias de cada categoría. Este examen detecta la mayoría de los errores de captura y decide qué escala usar en los pasos siguientes.

## Definición

:::definicion[Análisis univariado]
El **análisis univariado** de una variable $X$ con valores observados $x_1, \dots, x_n$ (y posiblemente algunos faltantes) consiste en reportar:

1. **Tipo y completitud:** tipo de variable, número de valores observados y número de faltantes.
2. **Centro:** mediana $\tilde{x}$ y media $\bar{x}$.
3. **Dispersión:** rango intercuartílico $\text{RIQ} = Q_3 - Q_1$ y desviación estándar $s$.
4. **Forma:** asimetría $g_1$, número de modas y peso de las colas.
5. **Valores inusuales:** mínimo, máximo y valores fuera de las vallas $Q_1 - 1.5\,\text{RIQ}$ y $Q_3 + 1.5\,\text{RIQ}$.

Para una variable categórica: frecuencias y proporciones de cada categoría, moda y categorías raras.
:::

:::nota[Qué significa cada símbolo]
- $X$: la variable estudiada; $x_1, \dots, x_n$: sus valores observados; $n$: número de valores observados.
- $\tilde{x}$: mediana; $\bar{x}$: media.
- $Q_1$, $Q_3$: primer y tercer cuartil; $\text{RIQ}$: rango intercuartílico.
- $s$: desviación estándar muestral.
- $g_1$: coeficiente de asimetría muestral.
:::

## Cómo usar la visualización

El selector **Variable** elige una de las cinco columnas de las ventas de viviendas. Las viviendas entran por tandas; arriba se dibuja un diagrama de caja con los valores fuera de las vallas resaltados y abajo el histograma. El encabezado reporta $n$, media, mediana, desviación y asimetría.

Experimentos sugeridos:

1. Con la superficie, observar los dos puntos aislados a la derecha del diagrama de caja: son los errores de captura.
2. Cambiar a precio y activar la escala logarítmica: la asimetría pasa de cerca de 1.2 a casi cero.
3. Elegir antigüedad: el panel reporta 27 faltantes, algo que el histograma no muestra.

## Ejemplo

Siete ingresos mensuales (miles de pesos): 8, 10, 12, 15, 20, 30 y 55.

1. Tipo: numérica continua; $n = 7$, sin faltantes.
2. Centro: $\tilde{x} = 15$ y $\bar{x} = 150/7 \approx 21.43$. La media supera a la mediana: señal de cola derecha.
3. Cuartiles de tipo 7: $Q_1 = 11$ y $Q_3 = 25$, de modo que $\text{RIQ} = 14$.
4. Forma: $g_1 \approx 1.72$, asimetría positiva fuerte.
5. Vallas: $11 - 21 = -10$ y $25 + 21 = 46$. El ingreso de 55 queda fuera de la valla superior.

:::figura[Los siete ingresos del ejemplo: la caja, la mediana en 15 y el valor de 55 fuera de la valla superior.]{componente="FeatureTransformViz"}
```yaml
modo: atipicos-riq
muestra:
  nombre: Ingresos
  valores: [8, 10, 12, 15, 20, 30, 55]
eje:
  variable: Ingreso mensual
  unidad: miles de pesos
```
:::

## Propiedades

- **La gráfica depende del tipo:** histograma o densidad para continuas, barras para discretas con pocos valores y para categóricas.
- **Mediana y media juntas** indican la asimetría: si difieren mucho, la distribución es asimétrica o tiene atípicos.
- **Los faltantes son un resultado,** no un detalle: se reportan siempre, junto con el número de observaciones.

:::figura[Variable categórica: la zona de las 200 viviendas, con frecuencias y moda.]{componente="EdaWorkflow"}
```yaml
modo: univariado
variable: zona
```
:::

:::figura[Variable discreta: número de habitaciones. La mayoría tiene 2 o 3, y pocas tienen 5 o 6.]{componente="EdaWorkflow"}
```yaml
modo: univariado
variable: habitaciones
```
:::

## Errores comunes

- **Reportar solo la media.** Con una cola larga, la media describe mal un valor típico; se reporta también la mediana.
- **Ignorar los faltantes.** Una media calculada sobre los valores observados puede estar sesgada si los faltantes no son al azar.
- **Usar la misma gráfica para todo.** Un histograma de una variable categórica codificada con números (zona 1, 2, 3) sugiere un orden que no existe.

:::figura[Escala equivocada: el precio de las viviendas en escala lineal, con una cola larga que comprime la mayoría de los datos a la izquierda; con la escala logarítmica se ve la forma.]{componente="EdaWorkflow"}
```yaml
modo: univariado
variable: precio
```
:::

## Conexiones

El análisis univariado es el primer paso del [[analisis-exploratorio-de-datos]]. Usa el [[resumen-de-cinco-numeros]], la [[asimetria-muestral]], el [[histograma]] y el [[diagrama-de-caja]]. Sus hallazgos llevan a la [[deteccion-de-valores-atipicos-por-rango-intercuartilico]], a la [[transformacion-logaritmica-y-de-raiz]] y al [[analisis-bivariado]].

## Formulario

:::formula[Rango intercuartílico]
$$
\text{RIQ} = Q_3 - Q_1
$$

- $Q_1$, $Q_3$: primer y tercer cuartil.
:::

:::formula[Vallas de Tukey]
$$
Q_1 - 1.5\,\text{RIQ},\qquad Q_3 + 1.5\,\text{RIQ}
$$

- Valores fuera de este intervalo se examinan como posibles atípicos.
:::

:::formula[Media]
$$
\bar{x} = \frac{1}{n}\sum_{i=1}^{n} x_i
$$

- $x_i$: valores observados; $n$: número de valores observados.
:::

:::formula[Asimetría muestral]
$$
g_1 = \frac{\sqrt{n(n-1)}}{n-2}\cdot\frac{\frac{1}{n}\sum_{i=1}^{n}(x_i - \bar{x})^3}{\left(\frac{1}{n}\sum_{i=1}^{n}(x_i - \bar{x})^2\right)^{3/2}}
$$

- $g_1$: asimetría ajustada; positiva con cola derecha, negativa con cola izquierda.
- $x_i$, $\bar{x}$, $n$: valores, media y número de valores.
:::
