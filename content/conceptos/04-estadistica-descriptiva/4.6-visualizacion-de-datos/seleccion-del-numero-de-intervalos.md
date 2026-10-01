---
id: seleccion-del-numero-de-intervalos
titulo: Selección del número de intervalos (Sturges, Scott, Freedman-Diaconis)
titulo_en: Histogram bin selection (Sturges, Scott, Freedman-Diaconis)
alias:
  - regla de Sturges
  - regla de Scott
  - regla de Freedman-Diaconis
  - ancho de intervalo
modulo: 4
submodulo: '4.6'
orden: 2
nivel: basico
prerrequisitos:
  - histograma
  - rango-intercuartilico
  - desviacion-estandar-muestral
etiquetas:
  - histograma
  - intervalos
  - ancho de banda
  - reglas empíricas
resumen: >
  Las reglas de Sturges, Scott y Freedman-Diaconis proponen cuántos intervalos o qué ancho usar en un
  histograma según el número de datos y su dispersión, para equilibrar detalle y ruido.
formula: 'k = \lceil \log_2 n \rceil + 1, \qquad h = \frac{3.49\,s}{n^{1/3}}, \qquad h = \frac{2\,\mathrm{RIQ}}{n^{1/3}}'
visualizacion:
  componente: ChartGallery
  parametros:
    grafico: histograma
    muestra:
      nombre: Mangos
      forma: normal
      centro: 320
      escala: 35
      n: 400
      decimales: 0
    eje:
      variable: Peso del mango
      unidad: g
    reglas: true
referencias:
  - clave: wasserman
publicado: true
---

## Intuición

Al hacer un histograma hay que decidir cuántas barras dibujar. Con muy pocas, todo se ve como un bloque y se pierde la forma; con demasiadas, cada barra tiene tan pocos datos que el gráfico parece ruido. La cantidad adecuada depende de cuántos datos hay: con 20 mangos pesados no tiene sentido usar 50 intervalos, pero con 4000 sí.

Las **reglas de selección** dan un punto de partida razonable. La de **Sturges** solo mira cuántos datos hay y crece muy despacio, con el logaritmo de $n$. La de **Scott** fija el ancho de cada intervalo en proporción a la desviación estándar y lo achica conforme crece $n$. La de **Freedman-Diaconis** hace lo mismo pero con el rango intercuartílico, que no se deja inflar por valores extremos. Ninguna es la correcta en todos los casos: son puntos de partida que conviene ajustar mirando el gráfico.

## Definición

:::definicion[Reglas para el número de intervalos]
Para $n$ datos con desviación estándar $s$ y rango intercuartílico $\mathrm{RIQ}$:

- **Sturges:** $k = \lceil \log_2 n \rceil + 1$ intervalos.
- **Scott:** ancho $h = 3.49\,s\,n^{-1/3}$.
- **Freedman-Diaconis:** ancho $h = 2\,\mathrm{RIQ}\,n^{-1/3}$.

Cuando la regla da un ancho $h$, el número de intervalos es $k = \lceil (x_{(n)} - x_{(1)})/h \rceil$.
:::

Las reglas de Scott y de Freedman-Diaconis se derivan de minimizar el error cuadrático integrado entre el histograma de densidad y la densidad verdadera; de ahí el factor $n^{-1/3}$. La de Sturges supone datos aproximadamente normales y muestras moderadas.

:::figura[Las tres reglas con 400 tiempos de entrega con cola larga: Scott y Freedman-Diaconis proponen intervalos más angostos que Sturges y muestran mejor la cola.]{componente="ChartGallery"}
```yaml
grafico: histograma
muestra:
  nombre: Entregas
  forma: sesgo-derecha
  parametro: 2
  centro: 35
  escala: 12
  n: 400
eje:
  variable: Tiempo de entrega
  unidad: min
reglas: true
```
:::

:::nota[Qué significa cada símbolo]
- $k$: número de intervalos.
- $n$: número de datos.
- $\lceil \cdot \rceil$: redondeo hacia arriba.
- $\log_2$: logaritmo en base 2.
- $h$: ancho de cada intervalo.
- $s$: desviación estándar muestral.
- $\mathrm{RIQ}$: rango intercuartílico.
- $n^{-1/3}$: inverso de la raíz cúbica de $n$.
- $x_{(n)} - x_{(1)}$: rango de los datos.
:::

## Cómo usar la visualización

El histograma principal usa el número de intervalos de Freedman-Diaconis; abajo, tres histogramas pequeños aplican cada regla a los 400 pesos de mangos. El encabezado calcula las tres reglas con los números de la muestra, y el panel lista cuántos intervalos propone cada una.

Para estos datos, con forma de campana, las tres reglas proponen números del mismo orden, entre 10 y 20 intervalos. Al mover el control de intervalos lejos de esos valores, hacia 3 o hacia 60, se ve por qué se necesitan reglas: el histograma pierde forma o se vuelve irregular.

## Ejemplo

Con los 20 tiempos de traslado (12, 15, ..., 65 minutos), la desviación estándar es $s \approx 14.02$, el rango intercuartílico es $17$ y el rango es $53$.

1. **Sturges:** $\log_2 20 \approx 4.32$, así que $k = 5 + 1 = 6$ intervalos.
2. **Scott:** $h = 3.49 \cdot 14.02 / 20^{1/3} \approx 48.93/2.714 \approx 18.02$; $k = \lceil 53/18.02 \rceil = 3$.
3. **Freedman-Diaconis:** $h = 2 \cdot 17/2.714 \approx 12.53$; $k = \lceil 53/12.53 \rceil = 5$.
4. Las reglas discrepan: con solo 20 datos, cualquier número entre 3 y 6 es defendible.

:::figura[Las tres reglas aplicadas a los 20 tiempos del ejemplo.]{componente="ChartGallery"}
```yaml
grafico: histograma
muestra:
  nombre: Traslado
  valores: [12, 15, 18, 22, 25, 26, 28, 30, 31, 33, 34, 35, 38, 40, 42, 45, 48, 52, 58, 65]
eje:
  variable: Tiempo de traslado
  unidad: min
reglas: true
```
:::

## Propiedades

- **Crecimiento con $n$:** Sturges crece como $\log_2 n$; Scott y Freedman-Diaconis, como $n^{1/3}$. Con muestras grandes, Sturges propone muy pocos intervalos.
- **Robustez:** Freedman-Diaconis usa el RIQ y no se deja inflar por atípicos; Scott usa $s$ y ensancha los intervalos si hay valores extremos.
- **Óptimo teórico:** el ancho $h \propto n^{-1/3}$ minimiza el error cuadrático integrado de un histograma para densidades suaves.
- **Ninguna regla ve la forma:** todas proponen intervalos iguales; con distribuciones multimodales o muy asimétricas, conviene probar varios valores.

:::figura[Propiedad del crecimiento: 2000 pesos de mangos. Sturges propone solo 12 intervalos, mientras que Scott y Freedman-Diaconis proponen bastantes más y muestran la forma con más detalle.]{componente="ChartGallery"}
```yaml
grafico: histograma
muestra:
  nombre: Mangos
  forma: normal
  centro: 320
  escala: 35
  n: 2000
  decimales: 0
eje:
  variable: Peso del mango
  unidad: g
reglas: true
```
:::

## Errores comunes

- **Aceptar sin mirar el número que da el programa.** Muchos programas usan Sturges por defecto, que se queda corto con muestras grandes.
- **Usar Scott con colas pesadas.** Un par de valores extremos inflan $s$ y producen intervalos tan anchos que el centro de la distribución se aplana.
- **Creer que hay un número correcto.** Las reglas son aproximaciones; si dos números de intervalos razonables cuentan historias distintas, la conclusión no es firme.

:::figura[Scott con colas pesadas: 400 rendimientos de una t de Student con 2 grados de libertad. Los valores extremos inflan la desviación estándar y la regla de Scott propone muy pocos intervalos; Freedman-Diaconis propone muchos más.]{componente="ChartGallery"}
```yaml
grafico: histograma
muestra:
  nombre: Rendimientos
  forma: colas-pesadas
  parametro: 2
  centro: 0
  escala: 1
  n: 400
eje:
  variable: Rendimiento diario
  unidad: '%'
reglas: true
```
:::

## Conexiones

Las reglas fijan el ancho de los intervalos del [[histograma]] a partir de la [[desviacion-estandar-muestral]] o del [[rango-intercuartilico]]. El mismo problema de elegir cuánto suavizar aparece en el [[grafico-de-densidad]] con el ancho de banda, que también se escala con $n^{-1/5}$ o $n^{-1/3}$ según el método.

## Formulario

:::formula[Regla de Sturges]
$$
k = \lceil \log_2 n \rceil + 1
$$

- $k$: número de intervalos; $n$: número de datos.
:::

:::formula[Regla de Scott]
$$
h = \frac{3.49\,s}{n^{1/3}}
$$

- $h$: ancho; $s$: desviación estándar.
:::

:::formula[Regla de Freedman-Diaconis]
$$
h = \frac{2\,\mathrm{RIQ}}{n^{1/3}}
$$

- $\mathrm{RIQ}$: rango intercuartílico.
:::

:::formula[Del ancho al número de intervalos]
$$
k = \left\lceil \frac{x_{(n)} - x_{(1)}}{h} \right\rceil
$$

- $x_{(n)} - x_{(1)}$: rango de los datos.
:::
