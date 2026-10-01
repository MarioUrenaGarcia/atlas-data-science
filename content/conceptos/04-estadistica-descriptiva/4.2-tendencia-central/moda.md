---
id: moda
titulo: Moda
titulo_en: Mode
alias:
  - valor más frecuente
  - valor modal
modulo: 4
submodulo: '4.2'
orden: 9
nivel: basico
prerrequisitos:
  - parametro-y-estadistico
  - datos-cualitativos-y-cuantitativos
etiquetas:
  - tendencia central
  - frecuencia
  - datos categóricos
  - multimodalidad
resumen: >
  La moda es el valor que aparece con mayor frecuencia. Es la única medida de tendencia central que
  sirve para variables nominales y puede no ser única: hay datos bimodales y datos sin moda.
formula: '\operatorname{Mo} = \arg\max_{v} f(v), \qquad f(v) = \#\{i : x_i = v\}'
visualizacion:
  componente: DataStrip
  parametros:
    modo: centro
    datos: [25, 26, 26, 27, 25, 26, 28, 24, 26, 27, 25]
    medidas: [moda, mediana, media]
    variable: Talla de calzado vendida
    unidad: cm
    decimales: 0
    dominio: [23, 29]
referencias:
  - clave: agresti
  - clave: degroot
publicado: true
---

## Intuición

Una zapatería que va a resurtir su inventario no necesita la talla promedio de sus clientes: una talla 25.7 no existe. Necesita saber cuál es la talla que más se vende, para tener más pares de esa. Esa talla es la **moda**: el valor que más se repite.

La moda es la medida de centro más directa y la única que funciona con cualquier tipo de dato. Se puede hablar del color de auto más vendido, del tipo de sangre más común o del día de la semana con más accidentes, aunque esas variables no tengan orden ni permitan sumar. A cambio, la moda solo mira cuál valor gana, sin importar por cuánto ni qué pasa con los demás. Puede haber empates, en cuyo caso los datos son bimodales o multimodales, y en datos continuos medidos con precisión puede no repetirse ningún valor.

## Definición

:::definicion[Moda]
Sea $f(v)$ el número de observaciones iguales a $v$. La **moda** es el valor (o los valores) con la mayor frecuencia:
$$
\operatorname{Mo} = \arg\max_{v} f(v).
$$
Si un solo valor alcanza el máximo, los datos son **unimodales**; si dos lo alcanzan, **bimodales**; si varios, **multimodales**. Si todos los valores aparecen una sola vez, la moda no aporta información.
:::

Para datos continuos agrupados en intervalos se habla de **clase modal**, el intervalo con más observaciones, y para una densidad, de su máximo.

:::figura[Datos bimodales: número de llamadas diarias a un centro de atención en doce días. Los valores 5 y 10 aparecen tres veces cada uno; el encabezado reporta las dos modas.]{componente="DataStrip"}
```yaml
modo: centro
datos: [3, 4, 4, 5, 5, 5, 6, 9, 10, 10, 10, 11]
medidas: [moda, media]
variable: Llamadas por día
decimales: 0
dominio: [2, 12]
```
:::

:::nota[Qué significa cada símbolo]
- $\operatorname{Mo}$: moda.
- $v$: un valor posible de la variable.
- $f(v)$: frecuencia de $v$, número de observaciones iguales a $v$.
- $\#\{\cdot\}$: número de elementos del conjunto.
- $x_i$: observación $i$.
- $\arg\max_v$: valor de $v$ que hace máxima la expresión.
:::

## Cómo usar la visualización

Cada círculo es un par de zapatos vendido; los pares de la misma talla se apilan, de modo que la columna más alta es la moda. El encabezado indica cuántas veces aparece. Se comparan tres marcadores: moda, mediana y media.

Al arrastrar un par de talla 27 a la talla 25, las columnas de 25 y 26 quedan con cuatro pares cada una y el encabezado muestra dos modas. Si en cambio se mueve un par de talla 26 a la 25, la moda salta de golpe a 25: la moda puede cambiar mucho con un cambio pequeño en los datos, mientras que la media y la mediana se mueven poco.

## Ejemplo

Una zapatería registra las tallas vendidas en una mañana: 25, 26, 26, 27, 25, 26, 28, 24, 26, 27, 25.

1. Tabla de frecuencias: 24 aparece 1 vez; 25, 3 veces; 26, 4 veces; 27, 2 veces; 28, 1 vez.
2. La frecuencia máxima es 4, alcanzada solo por la talla 26.
3. Moda: $\operatorname{Mo} = 26$.
4. Para comparar: la mediana también es 26 (sexto valor de 11 ordenados) y la media es $285/11 \approx 25.9$, una talla que no se vende.
5. La decisión de resurtido usa la moda: la talla 26 representa $4/11 \approx 36$ % de las ventas.

:::figura[Las once ventas del ejemplo, apiladas por talla. La columna de la talla 26 es la más alta.]{componente="DataStrip"}
```yaml
modo: centro
datos: [25, 26, 26, 27, 25, 26, 28, 24, 26, 27, 25]
medidas: [moda]
variable: Talla vendida
unidad: cm
decimales: 0
dominio: [23, 29]
```
:::

## Propiedades

- **Funciona con cualquier escala**, incluida la nominal, porque solo compara si dos valores son iguales.
- **Es siempre un valor observado**, a diferencia de la media y la mediana.
- **No es necesariamente única**: la presencia de dos modas separadas sugiere que los datos mezclan dos grupos.
- **Es inestable**: con pocos datos o muchos valores posibles, mover una sola observación puede cambiar la moda por completo.
- **No usa magnitudes ni orden**: los valores que no son la moda no influyen en ella, salvo por su conteo.

:::figura[Propiedad de inestabilidad: con las llamadas diarias, mover un solo día de 10 a 5 llamadas rompe el empate y deja una sola moda en 5.]{componente="DataStrip"}
```yaml
modo: centro
datos: [3, 4, 4, 5, 5, 5, 6, 9, 10, 10, 5, 11]
medidas: [moda, mediana]
variable: Llamadas por día
decimales: 0
dominio: [2, 12]
```
:::

## Errores comunes

- **Buscar la moda de datos continuos sin agrupar.** Pesos de 61.2, 63.5, 58.9 kg y similares casi nunca se repiten; la moda de los datos crudos no existe o es un accidente de redondeo. Se usa la clase modal de un histograma o el máximo de una densidad estimada.
- **Reportar una sola moda cuando hay empate.** Si dos valores empatan, elegir uno arbitrariamente oculta la forma bimodal de los datos.
- **Confundir la moda con la mayoría.** La moda puede representar una minoría: en el ejemplo, 26 es la talla modal con solo 36 % de las ventas.

:::figura[Error con datos continuos: pesos de siete personas medidos con un decimal. Ningún valor se repite y el encabezado indica que no hay moda.]{componente="DataStrip"}
```yaml
modo: centro
datos: [61.2, 63.5, 58.9, 70.1, 66.4, 59.7, 64.8]
medidas: [moda, media]
variable: Peso
unidad: kg
decimales: 1
dominio: [56, 72]
```
:::

## Conexiones

La moda es la medida de centro natural para [[datos-cualitativos-y-cuantitativos|datos cualitativos]] y la única válida en una [[escalas-nominal-ordinal-de-intervalo-y-de-razon|escala nominal]]. Se compara con la [[media-aritmetica]] y la [[mediana]], que requieren más estructura en los datos. La presencia de varias modas es la multimodalidad, una característica de la forma de la distribución que a menudo revela grupos distintos mezclados en la misma muestra.

## Formulario

:::formula[Moda]
$$
\operatorname{Mo} = \arg\max_{v} f(v)
$$

- $v$: valores posibles.
- $f(v)$: frecuencia del valor $v$.
:::

:::formula[Frecuencia de un valor]
$$
f(v) = \#\{i : x_i = v\} = \sum_{i=1}^{n} \mathbf{1}\{x_i = v\}
$$

- $\mathbf{1}\{x_i = v\}$: indicadora, vale 1 si $x_i = v$ y 0 si no.
- $n$: número de observaciones.
:::

:::formula[Proporción de la moda]
$$
\hat{p}_{\operatorname{Mo}} = \frac{f(\operatorname{Mo})}{n}
$$

- $\hat{p}_{\operatorname{Mo}}$: proporción de observaciones iguales a la moda.
:::
