---
id: media-aritmetica
titulo: Media aritmética
titulo_en: Arithmetic mean
alias:
  - promedio
  - media muestral
  - mean
modulo: 4
submodulo: '4.2'
orden: 1
nivel: basico
prerrequisitos:
  - parametro-y-estadistico
  - notacion-sumatoria-y-productoria
etiquetas:
  - tendencia central
  - promedio
  - centro de masa
  - media muestral
resumen: >
  La media aritmética suma los valores y divide entre su número. Es el punto de equilibrio de los
  datos: las desviaciones positivas y negativas respecto a ella se compensan exactamente.
formula: '\bar{x} = \frac{1}{n}\sum_{i=1}^{n} x_i'
visualizacion:
  componente: DataStrip
  parametros:
    modo: centro
    datos: [78, 85, 92, 70, 88, 81]
    medidas: [media]
    balanza: true
    variable: Puntos anotados por partido
    unidad: puntos
    decimales: 0
    dominio: [60, 100]
referencias:
  - clave: degroot
  - clave: wasserman
    capitulo: '3'
publicado: true
---

## Intuición

Si se colocan monedas iguales sobre una regla, una en la marca de cada dato, existe un único punto donde la regla queda en equilibrio sobre un dedo. Ese punto es la **media aritmética**. Los datos que quedan a la izquierda empujan la regla hacia un lado con una fuerza proporcional a su distancia; los de la derecha, hacia el otro; en la media ambas fuerzas se igualan.

La misma idea explica el cálculo de todos los días: si seis personas juntan su dinero y lo reparten en partes iguales, a cada una le toca la media. Por eso la media responde a la pregunta "¿cuánto le tocaría a cada uno si todo se repartiera por igual?". Y por eso también es sensible a los valores extremos: una moneda colocada muy lejos obliga a mover el punto de equilibrio aunque todas las demás sigan en su lugar.

## Definición

:::definicion[Media aritmética]
Para valores observados $x_1, \dots, x_n$ de una variable cuantitativa, la **media aritmética** o **media muestral** es
$$
\bar{x} = \frac{1}{n}\sum_{i=1}^{n} x_i = \frac{x_1 + x_2 + \dots + x_n}{n}.
$$
Para una población finita de $N$ valores, la media poblacional es $\mu = \frac{1}{N}\sum_{j=1}^{N} y_j$.
:::

La media requiere al menos una escala de intervalo: sumar valores solo tiene sentido si las diferencias entre ellos son cantidades. No está definida para variables nominales u ordinales, aunque sus categorías se codifiquen con números.

:::figura[La media como punto de equilibrio con la temperatura máxima de siete días en una ciudad. El triángulo bajo la regla está en la media; el panel muestra que la suma de distancias a la izquierda iguala la suma de distancias a la derecha.]{componente="DataStrip"}
```yaml
modo: centro
datos: [24, 27, 31, 26, 22, 29, 30]
medidas: [media]
balanza: true
variable: Temperatura máxima
unidad: °C
decimales: 0
dominio: [18, 34]
```
:::

:::nota[Qué significa cada símbolo]
- $\bar{x}$: media de la muestra; se lee "x barra".
- $x_i$: valor de la observación $i$.
- $n$: número de observaciones de la muestra.
- $\sum_{i=1}^{n}$: suma de los términos desde $i = 1$ hasta $i = n$.
- $\mu$: media de la población.
- $y_j$: valor de la unidad $j$ de la población.
- $N$: número de unidades de la población.
:::

## Cómo usar la visualización

Cada círculo es la puntuación de un equipo de baloncesto en un partido; aparecen uno por uno y el encabezado muestra la suma y la división con los datos que ya están en la gráfica. La línea vertical es la media y el triángulo es el punto de apoyo de la balanza. Los círculos se pueden arrastrar.

Al arrastrar un partido hacia la derecha, la media se mueve en la misma dirección, pero solo una sexta parte de lo que se movió el dato. Al llevar un partido hasta 60 puntos se ve cuánto puede desplazar un solo valor extremo al promedio. En cualquier posición, las dos sumas de distancias del panel son iguales.

## Ejemplo

Una familia anota su gasto semanal en el supermercado durante siete semanas: 420, 380, 510, 465, 395, 450 y 600 pesos.

1. Suma: $420 + 380 + 510 + 465 + 395 + 450 + 600 = 3220$.
2. Número de datos: $n = 7$.
3. Media: $\bar{x} = 3220 / 7 = 460$ pesos por semana.
4. Interpretación: si el gasto total de las siete semanas se hubiera repartido por igual, cada semana se habrían gastado 460 pesos.
5. Comprobación del equilibrio: las desviaciones $x_i - \bar{x}$ son $-40, -80, 50, 5, -65, -10, 140$, y suman $0$.

:::figura[El gasto semanal del ejemplo. La media de 460 pesos es el punto de equilibrio; la semana de 600 pesos es la que más jala la balanza hacia la derecha.]{componente="DataStrip"}
```yaml
modo: centro
datos: [420, 380, 510, 465, 395, 450, 600]
medidas: [media]
balanza: true
variable: Gasto semanal
unidad: pesos
decimales: 0
dominio: [350, 650]
```
:::

## Propiedades

- **Las desviaciones suman cero:** $\sum_{i=1}^{n}(x_i - \bar{x}) = 0$. Es la versión algebraica del equilibrio de la balanza.
- **Minimiza la suma de cuadrados:** $\bar{x}$ es el valor de $c$ que hace mínima $\sum (x_i - c)^2$.
- **Linealidad:** si $y_i = a + b x_i$, entonces $\bar{y} = a + b\bar{x}$. Cambiar de unidades transforma la media del mismo modo.
- **Suma total:** $n\bar{x} = \sum x_i$; conocer la media y $n$ equivale a conocer el total.
- **Sensibilidad a extremos:** cambiar un solo dato en $\Delta$ mueve la media en $\Delta / n$. Un valor suficientemente grande puede llevar la media a cualquier lugar; se dice que su punto de ruptura es 0.

:::demostracion
Desviaciones: $\sum (x_i - \bar{x}) = \sum x_i - n\bar{x} = n\bar{x} - n\bar{x} = 0$. Mínimos cuadrados: $\sum (x_i - c)^2 = \sum (x_i - \bar{x})^2 + n(\bar{x} - c)^2$, porque el término cruzado $2(\bar{x} - c)\sum (x_i - \bar{x})$ vale cero; la expresión es mínima cuando $c = \bar{x}$.
:::

:::figura[Sensibilidad a extremos: los tiempos de traslado de siete personas. Cuando aparecen todos, uno de ellos se aleja hasta 45 minutos; la media lo sigue mientras la mediana casi no se mueve.]{componente="DataStrip"}
```yaml
modo: centro
datos: [12, 15, 14, 18, 15, 13, 16]
medidas: [media, mediana]
atipico:
  indice: 6
  hasta: 45
variable: Tiempo de traslado
unidad: min
decimales: 0
```
:::

## Errores comunes

- **Esperar que la media sea un valor observado o típico.** El promedio de hijos por hogar puede ser 1.8 aunque ningún hogar tenga 1.8 hijos; y en datos muy asimétricos, como ingresos, la mayoría de las observaciones puede quedar por debajo de la media.
- **Promediar promedios de grupos de distinto tamaño.** El promedio de dos grupos con medias 8 y 6 es 7 solo si ambos grupos tienen el mismo número de personas; en general se necesita la [[media-ponderada]].
- **Calcular la media de códigos de categorías.** Sin escala de intervalo, la media de los códigos no tiene significado.

:::figura[Error de "valor típico" con ingresos mensuales de diez hogares, en miles de pesos. Un hogar con 95 mil lleva la media a casi 20 mil, cuando nueve de los diez hogares ganan 15 mil o menos.]{componente="DataStrip"}
```yaml
modo: centro
datos: [8, 9, 10, 11, 12, 12, 13, 14, 15, 95]
medidas: [media, mediana]
variable: Ingreso mensual
unidad: miles de pesos
decimales: 0
```
:::

## Conexiones

La media es el [[parametro-y-estadistico|estadístico]] más usado para estimar el centro de una población y se escribe con la [[notacion-sumatoria-y-productoria|notación de sumatoria]]. Sus variantes cambian la forma de promediar: la [[media-ponderada]] da pesos distintos, la [[media-geometrica]] y la [[media-armonica]] promedian productos y tasas, y la [[media-recortada]] descarta extremos. La [[mediana]] resiste los valores atípicos que la media no resiste. En probabilidad, el análogo poblacional de la media es la esperanza de una variable aleatoria.

## Formulario

:::formula[Media muestral]
$$
\bar{x} = \frac{1}{n}\sum_{i=1}^{n} x_i
$$

- $\bar{x}$: media de la muestra.
- $x_i$: observación $i$.
- $n$: número de observaciones.
:::

:::formula[Media poblacional]
$$
\mu = \frac{1}{N}\sum_{j=1}^{N} y_j
$$

- $\mu$: media de la población.
- $y_j$: valor de la unidad $j$.
- $N$: tamaño de la población.
:::

:::formula[Desviaciones respecto a la media]
$$
\sum_{i=1}^{n}(x_i - \bar{x}) = 0
$$

- $x_i - \bar{x}$: desviación de la observación $i$; positiva si está por encima de la media.
:::

:::formula[Mínimos cuadrados]
$$
\bar{x} = \arg\min_{c} \sum_{i=1}^{n}(x_i - c)^2
$$

- $c$: candidato a valor central.
- $\arg\min_c$: valor de $c$ que hace mínima la expresión.
:::

:::formula[Transformación lineal]
$$
y_i = a + b\,x_i \ \Longrightarrow\ \bar{y} = a + b\,\bar{x}
$$

- $a$: desplazamiento; $b$: cambio de escala.
- $\bar{y}$: media de los valores transformados.
:::

:::formula[Efecto de cambiar un dato]
$$
\Delta\bar{x} = \frac{\Delta}{n}
$$

- $\Delta$: cambio en una sola observación.
- $\Delta\bar{x}$: cambio resultante en la media.
:::
