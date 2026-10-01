---
id: desviacion-absoluta-media
titulo: Desviación absoluta media
titulo_en: Mean absolute deviation
alias:
  - desviación media
  - DAM
  - MAD (en algunos textos)
modulo: 4
submodulo: '4.3'
orden: 10
nivel: basico
prerrequisitos:
  - media-aritmetica
  - rango
etiquetas:
  - dispersión
  - valor absoluto
  - desviaciones
  - distancia promedio
resumen: >
  La desviación absoluta media es el promedio de las distancias de los datos a su media. Es la medida
  de dispersión más fácil de interpretar: cuánto se aleja, en promedio, cada dato del centro.
formula: '\mathrm{DAM} = \frac{1}{n}\sum_{i=1}^{n}\big|x_i - \bar{x}\big|'
visualizacion:
  componente: DataStrip
  parametros:
    modo: dispersion
    datos: [15, 18, 22, 20, 25]
    medida: dam
    lecturas: [dam, desviacion, mad]
    variable: Pedidos diarios de una panadería
    unidad: pedidos
    decimales: 0
    dominio: [12, 28]
referencias:
  - clave: degroot
publicado: true
---

## Intuición

Una panadería recibe 15, 18, 22, 20 y 25 pedidos en cinco días, con un promedio de 20. ¿Cuánto se aleja un día típico de ese promedio? La respuesta más directa es medir cada distancia sin importar el signo, 5, 2, 2, 0 y 5 pedidos, y promediarlas: 2.8 pedidos. Esa es la **desviación absoluta media**.

Es la forma más literal de responder "¿qué tan lejos del promedio está, en promedio, cada dato?". A diferencia de la varianza, no eleva al cuadrado, así que una distancia de 10 cuenta el doble que una de 5, no cuatro veces más; y queda en las mismas unidades que los datos. Su desventaja es matemática: el valor absoluto no es derivable en cero, lo que complica su uso en teoría y en optimización. Por eso la estadística clásica prefirió la desviación estándar, aunque la desviación absoluta media es más fácil de explicar.

## Definición

:::definicion[Desviación absoluta media]
Para datos $x_1, \dots, x_n$ con media $\bar{x}$,
$$
\mathrm{DAM} = \frac{1}{n}\sum_{i=1}^{n}\big|x_i - \bar{x}\big|.
$$
:::

Tiene las unidades de los datos. Una variante mide las distancias a la mediana, $\frac{1}{n}\sum |x_i - \tilde{x}|$, que es la menor posible entre todas las distancias absolutas promedio a un punto fijo.

:::figura[Desviación absoluta media de la temperatura del suelo al mediodía en siete días: cada segmento es la distancia de un día al promedio.]{componente="DataStrip"}
```yaml
modo: dispersion
datos: [31, 27, 35, 29, 33, 40, 26]
medida: dam
lecturas: [dam, desviacion]
variable: Temperatura del suelo al mediodía
unidad: °C
decimales: 0
```
:::

:::nota[Qué significa cada símbolo]
- $\mathrm{DAM}$: desviación absoluta media.
- $x_i$: observación $i$; $n$: número de observaciones.
- $\bar{x}$: media de los datos.
- $|x_i - \bar{x}|$: distancia, sin signo, de la observación $i$ a la media.
- $\tilde{x}$: mediana de los datos.
:::

## Cómo usar la visualización

Cada fila es un día. Los segmentos son las distancias a la media y el encabezado las va sumando sin signo; al final divide entre el número de días. El panel compara la desviación absoluta media con la desviación estándar y la desviación absoluta mediana.

La desviación estándar siempre queda por encima de la desviación absoluta media. Al alejar el día de 25 pedidos hasta 28, ambas crecen, pero la desviación estándar crece más, porque eleva al cuadrado la distancia mayor. Al juntar todos los días en el promedio, las tres medidas tienden a cero.

## Ejemplo

Para los pedidos 15, 18, 22, 20 y 25:

1. Media: $\bar{x} = 100/5 = 20$ pedidos.
2. Distancias absolutas: $|15 - 20| = 5$, $2$, $2$, $0$, $5$.
3. Suma: $14$. Desviación absoluta media: $14/5 = 2.8$ pedidos.
4. Comparación: la desviación estándar muestral es $\sqrt{58/4} \approx 3.81$ pedidos y la de denominador $n$ es $\sqrt{58/5} \approx 3.41$, ambas mayores que 2.8.

:::figura[Los pedidos del ejemplo con sus cinco distancias a la media de 20.]{componente="DataStrip"}
```yaml
modo: dispersion
datos: [15, 18, 22, 20, 25]
medida: dam
lecturas: [dam]
variable: Pedidos diarios
unidad: pedidos
decimales: 0
dominio: [12, 28]
etiquetas: [Lun, Mar, Mié, Jue, Vie]
```
:::

## Propiedades

- **Menor que la desviación estándar:** $\mathrm{DAM} \le \sqrt{\frac{1}{n}\sum (x_i - \bar{x})^2} \le s$, por la desigualdad entre la media aritmética y la cuadrática aplicada a las distancias.
- **Para datos normales**, $\mathrm{DAM} \approx 0.80\,\sigma$.
- **Equivarianza:** si $y_i = a + b x_i$, la DAM de las $y$ es $|b|$ veces la de las $x$.
- **Menos sensible que la desviación estándar, pero no resistente:** un valor extremo la aumenta en proporción a su distancia, sin límite.

:::figura[Propiedad de sensibilidad intermedia: los tiempos de siete tareas con una que tardó 30 minutos. La desviación absoluta media crece menos que la desviación estándar, pero más que la desviación absoluta mediana.]{componente="DataStrip"}
```yaml
modo: dispersion
datos: [2, 4, 4, 5, 7, 9, 30]
medida: dam
lecturas: [dam, desviacion, mad]
variable: Duración de la tarea
unidad: min
decimales: 0
```
:::

## Errores comunes

- **Olvidar el valor absoluto.** Sin él, las desviaciones respecto a la media siempre suman cero y el resultado es 0 para cualquier conjunto de datos.
- **Confundirla con la desviación absoluta mediana.** Ambas se abrevian a veces como MAD; una promedia distancias a la media y la otra toma la mediana de distancias a la mediana.
- **Compararla directamente con la desviación estándar de otro estudio.** Para datos normales la DAM es un 20 % menor; mezclar ambas medidas exagera o reduce las diferencias.

:::figura[Sin valor absoluto, las distancias con signo de los pedidos se cancelan: los segmentos azules y naranjas suman lo mismo a cada lado de la media.]{componente="DataStrip"}
```yaml
modo: dispersion
datos: [15, 18, 22, 20, 25]
medida: varianza
lecturas: [dam, varianza]
variable: Pedidos diarios
unidad: pedidos
decimales: 0
dominio: [12, 28]
```
:::

## Conexiones

La desviación absoluta media usa las mismas desviaciones que la [[varianza-muestral]], pero sin elevarlas al cuadrado, y como el [[rango]] se expresa en las unidades de los datos. Se contrasta con la [[desviacion-absoluta-mediana]], su versión robusta, y es siempre menor que la [[desviacion-estandar-muestral]]. En aprendizaje automático, el error absoluto medio de un modelo es esta misma idea aplicada a los errores de predicción.

## Formulario

:::formula[Desviación absoluta media]
$$
\mathrm{DAM} = \frac{1}{n}\sum_{i=1}^{n}|x_i - \bar{x}|
$$

- $x_i$: observaciones; $\bar{x}$: su media; $n$: número de datos.
:::

:::formula[Variante respecto a la mediana]
$$
\frac{1}{n}\sum_{i=1}^{n}|x_i - \tilde{x}| = \min_{c}\ \frac{1}{n}\sum_{i=1}^{n}|x_i - c|
$$

- $\tilde{x}$: mediana.
- $c$: cualquier valor de referencia.
:::

:::formula[Comparación con la desviación estándar]
$$
\mathrm{DAM} \le \sqrt{\frac{1}{n}\sum_{i=1}^{n}(x_i - \bar{x})^2} \le s
$$

- $s$: desviación estándar muestral.
:::
