---
id: grafico-hexbin
titulo: Gráfico hexbin
titulo_en: Hexagonal binning plot
alias:
  - hexbin
  - histograma bidimensional hexagonal
  - agrupamiento hexagonal
modulo: 4
submodulo: '4.6'
orden: 18
nivel: basico
prerrequisitos:
  - diagrama-de-dispersion
  - histograma
relaciones:
  - tipo: relacionado
    id: mapa-de-calor
etiquetas:
  - visualización
  - muchos datos
  - densidad bidimensional
  - sobreposición de puntos
resumen: >
  El gráfico hexbin divide el plano en hexágonos regulares, cuenta cuántos puntos caen en cada uno y
  colorea cada hexágono según su conteo. Sustituye al diagrama de dispersión cuando hay tantos puntos
  que se enciman.
formula: 'c_h = \#\{i : (x_i, y_i) \in H_h\},\qquad \text{área}(H_h) = \tfrac{3\sqrt{3}}{2}\,r^2'
visualizacion:
  componente: ChartGallery
  parametros:
    grafico: dispersion
    generador:
      n: 10000
      pendiente: 12
      ruido: 15
      media: 9
      mediaY: 140
      escala: 2.5
    ejes:
      x:
        variable: Distancia del viaje
        unidad: km
      y:
        variable: Tarifa
        unidad: pesos
    vista: hexagonos
referencias:
  - clave: james-isl
  - clave: tufte
publicado: true
---

## Intuición

Una aplicación de transporte registra 10000 viajes con su distancia y su tarifa. En un diagrama de dispersión los puntos se enciman tanto que el centro de la nube se vuelve una mancha uniforme: es imposible saber si en una zona hay 10 viajes o 500. El problema no está en los datos sino en la representación.

El **gráfico hexbin** resuelve la sobreposición contando. Se cubre el plano con hexágonos iguales, como un panal, se cuenta cuántos viajes caen en cada hexágono y se pinta cada uno con un tono más intenso cuanto mayor es su conteo. Es un histograma en dos dimensiones: en lugar de barras, celdas; en lugar de altura, color. Los hexágonos se prefieren a los cuadrados porque cubren el plano sin huecos, todos sus vecinos están a la misma distancia del centro y se parecen más a un círculo, lo que reduce el efecto de la orientación de la rejilla.

## Definición

:::definicion[Gráfico hexbin]
Sea una teselación del plano en hexágonos regulares $H_1, H_2, \dots$ de radio $r$ (distancia del centro a un vértice). Para $n$ puntos $(x_i, y_i)$, el conteo del hexágono $h$ es

$$
c_h = \#\{i : (x_i, y_i) \in H_h\}.
$$

El **gráfico hexbin** dibuja cada hexágono con $c_h > 0$ y le asigna un color que crece con $c_h$. Cada hexágono tiene área

$$
\text{área}(H_h) = \frac{3\sqrt{3}}{2}\, r^2,
$$

y cada punto se asigna al hexágono cuyo centro está más cerca.
:::

Decisiones de diseño:

- El radio $r$ juega el papel del ancho de intervalo del histograma: muy pequeño produce ruido, muy grande borra la estructura.
- La escala de color suele ser no lineal (raíz cuadrada o logaritmo) para que los hexágonos con pocos puntos no desaparezcan junto a los muy poblados.
- Los ejes deben estar en unidades comparables en pantalla para que los hexágonos sean regulares.

:::nota[Qué significa cada símbolo]
- $H_h$: hexágono número $h$ de la teselación.
- $r$: radio del hexágono, distancia del centro a un vértice.
- $(x_i, y_i)$: coordenadas del punto $i$; $n$: número de puntos.
- $c_h$: número de puntos dentro del hexágono $h$.
- $\#\{\cdot\}$: número de elementos del conjunto.
:::

## Cómo usar la visualización

Los 10000 viajes llegan en tandas y los hexágonos se oscurecen a medida que se llenan. En la esquina del gráfico se muestran los hexágonos ocupados y el conteo máximo.

Controles: **Forma de dibujar** permite volver a puntos opacos o con transparencia; **Radio de los hexágonos** cambia el tamaño de las celdas.

Experimentos sugeridos:

1. Cambiar a puntos opacos: el centro de la nube se ve plano y se pierde la concentración.
2. Bajar el radio a 5 píxeles: aparecen muchos hexágonos con uno o dos puntos y el patrón se vuelve granuloso.
3. Subir el radio a 30 píxeles: quedan pocos hexágonos grandes y la forma alargada de la nube se pierde.

## Ejemplo

Un área de dibujo de 600 por 400 píxeles con hexágonos de radio $r = 12$ píxeles:

1. Área de un hexágono: $\frac{3\sqrt{3}}{2} \cdot 12^2 \approx 2.598 \cdot 144 \approx 374$ px$^2$.
2. Número aproximado de hexágonos que cubren el área: $600 \cdot 400 / 374 \approx 642$.
3. Si 10000 puntos se repartieran de manera uniforme, cada hexágono tendría en promedio $10000/642 \approx 15.6$ puntos.
4. Al duplicar el radio a 24 píxeles el área de cada hexágono se multiplica por 4, hay unos 160 hexágonos y el promedio sube a unos 62 puntos por celda.

:::figura[Pocos datos: 300 viajes. Con tan pocos puntos el diagrama de dispersión común funciona bien y los hexágonos casi no agregan información.]{componente="ChartGallery"}
```yaml
grafico: dispersion
generador:
  n: 300
  pendiente: 12
  ruido: 15
  media: 9
  mediaY: 140
  escala: 2.5
ejes:
  x:
    variable: Distancia del viaje
    unidad: km
  y:
    variable: Tarifa
    unidad: pesos
vista: hexagonos
```
:::

## Propiedades

- **Conserva la información de densidad** que el diagrama de dispersión pierde con la sobreposición.
- **Costo independiente del número de puntos** al dibujar: se dibujan cientos de hexágonos aunque haya millones de puntos.
- **Elección del radio** con el mismo compromiso que el ancho de intervalo de un histograma.
- **Teselación hexagonal:** los seis vecinos de cada celda están a la misma distancia de su centro, a diferencia de los cuadrados, donde los vecinos en diagonal están más lejos.

:::figura[Sobreposición por redondeo: 8000 mediciones de dos sensores redondeadas a medio grado. Con puntos opacos el centro de la nube se ve uniforme; al cambiar a hexágonos aparece el núcleo donde se concentran las mediciones]{componente="ChartGallery"}
```yaml
grafico: dispersion
generador:
  n: 8000
  pendiente: 0.9
  ruido: 3
  media: 50
  escala: 6
  redondeo: 0.5
ejes:
  x:
    variable: Sensor A
  y:
    variable: Sensor B
vista: puntos
```
:::

## Errores comunes

- **Escala de color lineal.** Con un hexágono muy poblado, los de pocos puntos quedan casi invisibles y se pierde la extensión real de los datos.
- **Ejes con unidades muy distintas sin ajustar.** Si una unidad en $x$ ocupa mucho más espacio que en $y$, las celdas dejan de representar regiones comparables.
- **Interpretar los huecos como imposibilidad.** Un hexágono vacío indica que no hubo observaciones en esa muestra, no que el valor sea imposible.
- **Elegir un radio sin probar otros.** Como con el histograma, conviene revisar dos o tres tamaños antes de concluir.

:::figura[Radio demasiado pequeño: los mismos 10000 viajes con hexágonos de 5 píxeles. La imagen se vuelve granulosa y exagera fluctuaciones aleatorias; al subir el radio el patrón se suaviza]{componente="ChartGallery"}
```yaml
grafico: dispersion
generador:
  n: 10000
  pendiente: 12
  ruido: 15
  media: 9
  mediaY: 140
  escala: 2.5
ejes:
  x:
    variable: Distancia del viaje
    unidad: km
  y:
    variable: Tarifa
    unidad: pesos
vista: hexagonos
radio: 5
```
:::

## Conexiones

El hexbin es un [[histograma]] bidimensional y una solución a la sobreposición del [[diagrama-de-dispersion]]. Visualmente es un [[mapa-de-calor]] de conteos sobre una rejilla hexagonal, y la elección del radio es el análogo de la [[seleccion-del-numero-de-intervalos]]. Una alternativa suave es el [[grafico-de-densidad]] en dos dimensiones.

## Formulario

:::formula[Conteo por hexágono]
$$
c_h = \#\{i : (x_i, y_i) \in H_h\}
$$

- $c_h$: número de puntos en el hexágono $h$.
- $H_h$: hexágono $h$; $(x_i, y_i)$: punto $i$.
:::

:::formula[Área de un hexágono regular]
$$
\text{área}(H) = \frac{3\sqrt{3}}{2}\, r^2
$$

- $r$: radio, distancia del centro a cualquier vértice (igual a la longitud del lado).
:::

:::formula[Separación entre centros]
$$
\Delta x = \sqrt{3}\, r,\qquad \Delta y = \tfrac{3}{2}\, r
$$

- $\Delta x$: distancia horizontal entre centros vecinos de una misma fila.
- $\Delta y$: distancia vertical entre filas; las filas alternas se desplazan $\Delta x / 2$.
- $r$: radio del hexágono.
:::

:::formula[Promedio de puntos por hexágono]
$$
\bar{c} = \frac{n}{N_H}
$$

- $\bar{c}$: conteo promedio si los puntos se repartieran de manera uniforme.
- $n$: número de puntos; $N_H$: número de hexágonos que cubren el área.
:::
