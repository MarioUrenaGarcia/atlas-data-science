---
id: media-armonica
titulo: Media armónica
titulo_en: Harmonic mean
alias:
  - promedio armónico
modulo: 4
submodulo: '4.2'
orden: 4
nivel: basico
prerrequisitos:
  - media-aritmetica
etiquetas:
  - tendencia central
  - velocidades
  - razones
  - recíprocos
resumen: >
  La media armónica es el recíproco de la media de los recíprocos. Promedia razones como velocidades
  o rendimientos cuando lo que se mantiene fijo es el numerador, por ejemplo la distancia recorrida.
formula: '\bar{x}_H = \frac{n}{\sum_{i=1}^{n} \frac{1}{x_i}}'
visualizacion:
  componente: DataStrip
  parametros:
    modo: centro
    datos: [40, 60, 80, 30]
    medidas: [armonica, media]
    variable: Velocidad en cada tramo de 10 km
    unidad: km/h
    decimales: 0
    dominio: [20, 90]
    etiquetas: [Tramo 1, Tramo 2, Tramo 3, Tramo 4]
referencias:
  - clave: degroot
publicado: true
---

## Intuición

Un camión de reparto recorre cuatro tramos de 10 km cada uno, a 40, 60, 80 y 30 km/h. Parece natural decir que su velocidad media fue $(40 + 60 + 80 + 30)/4 = 52.5$ km/h, pero no es cierto. En el tramo lento el camión pasa mucho más tiempo que en el rápido: 20 minutos contra 7.5 minutos. La velocidad media real, distancia total entre tiempo total, da más peso a los tramos lentos, justo porque en ellos se acumula más tiempo.

La **media armónica** hace exactamente esa cuenta. En lugar de promediar las velocidades, promedia los tiempos que tarda cada kilómetro (los recíprocos de las velocidades) y luego invierte el resultado. Sirve siempre que se promedian razones del tipo "algo por unidad de otra cosa" y lo que se mantiene igual entre las observaciones es el numerador: la misma distancia, el mismo dinero invertido, la misma cantidad de trabajo.

## Definición

:::definicion[Media armónica]
Para valores estrictamente positivos $x_1, \dots, x_n$, la **media armónica** es
$$
\bar{x}_H = \frac{n}{\sum_{i=1}^{n} \frac{1}{x_i}} = \left(\frac{1}{n}\sum_{i=1}^{n} \frac{1}{x_i}\right)^{-1}.
$$
Con pesos $w_i > 0$, la versión ponderada es $\bar{x}_H = \sum w_i \big/ \sum (w_i / x_i)$.
:::

Si $x_i$ es una razón $a_i / b_i$ (distancia entre tiempo, kilómetros entre litros) y todos los $a_i$ son iguales, la razón total $\sum a_i / \sum b_i$ es exactamente la media armónica de las $x_i$. Si en cambio todos los $b_i$ son iguales (mismo tiempo en cada tramo), la razón total es la media aritmética.

:::figura[Rendimiento de combustible de un auto en tres viajes de 150 km: 12, 18 y 15 km por litro. El rendimiento global del recorrido es la media armónica, 14.59 km/L, un poco menor que la aritmética, 15.]{componente="DataStrip"}
```yaml
modo: centro
datos: [12, 18, 15]
medidas: [armonica, media]
variable: Rendimiento
unidad: km/L
decimales: 0
dominio: [10, 20]
etiquetas: [Ciudad, Carretera, Mixto]
```
:::

:::nota[Qué significa cada símbolo]
- $\bar{x}_H$: media armónica.
- $x_i$: valor positivo $i$, generalmente una razón.
- $n$: número de valores.
- $\frac{1}{x_i}$: recíproco de $x_i$; para una velocidad, el tiempo por unidad de distancia.
- $w_i$: peso del valor $i$ en la versión ponderada.
- $a_i, b_i$: numerador y denominador de la razón $x_i = a_i / b_i$.
:::

## Cómo usar la visualización

Cada círculo es la velocidad en un tramo de 10 km. El encabezado suma los recíprocos y calcula la media armónica; las dos líneas comparan la media armónica con la aritmética.

Al arrastrar el tramo más lento hacia 20 km/h, la media armónica baja mucho más que la aritmética: los valores pequeños dominan el resultado. Al subir el tramo más rápido hasta 90 km/h, la armónica apenas cambia, porque ganar velocidad en un tramo corto en tiempo ahorra poco. Si todas las velocidades se igualan, ambas medias coinciden.

## Ejemplo

Una ciclista sube a un mirador a 12 km/h y baja por el mismo camino de 6 km a 36 km/h. ¿Cuál fue su velocidad media en el recorrido completo?

1. Tiempo de subida: $6 / 12 = 0.5$ h. Tiempo de bajada: $6 / 36 \approx 0.167$ h.
2. Distancia total: 12 km. Tiempo total: $0.5 + 0.167 = 0.667$ h.
3. Velocidad media: $12 / 0.667 = 18$ km/h.
4. Con la fórmula: $\bar{x}_H = \dfrac{2}{\frac{1}{12} + \frac{1}{36}} = \dfrac{2}{\frac{4}{36}} = 18$ km/h.
5. La media aritmética, $(12 + 36)/2 = 24$ km/h, supondría que pasó el mismo tiempo subiendo que bajando, cuando en realidad subió tres veces más tiempo.

:::figura[Subida y bajada del ejemplo: la media armónica de 12 y 36 km/h es 18 km/h, lejos de la aritmética de 24.]{componente="DataStrip"}
```yaml
modo: centro
datos: [12, 36]
medidas: [armonica, media]
variable: Velocidad
unidad: km/h
decimales: 0
dominio: [8, 40]
etiquetas: [Subida, Bajada]
```
:::

## Propiedades

- **Recíproco de la media de recíprocos:** $1/\bar{x}_H$ es la media aritmética de los $1/x_i$.
- **Dominada por los valores pequeños:** cuando un valor tiende a 0, la media armónica tiende a 0 aunque los demás sean grandes.
- **Orden entre medias:** para valores positivos, $\bar{x}_H \le \bar{x}_G \le \bar{x}$, con igualdad solo si todos son iguales.
- **Dos valores:** $\bar{x}_H = \dfrac{2ab}{a + b} = \dfrac{\bar{x}_G^{\,2}}{\bar{x}}$.

:::figura[Propiedad del orden entre medias: ritmo de cuatro estaciones de ensamble (2, 15, 18 y 20 piezas por hora). La armónica, la geométrica y la aritmética quedan en ese orden, y la armónica es muy sensible a la estación lenta de 2 piezas por hora.]{componente="DataStrip"}
```yaml
modo: centro
datos: [2, 15, 18, 20]
medidas: [armonica, geometrica, media]
variable: Piezas por hora en cada estación
decimales: 0
dominio: [0, 24]
```
:::

## Errores comunes

- **Usarla cuando lo fijo es el denominador.** Si el camión hubiera circulado 15 minutos a cada velocidad, la velocidad media sería la aritmética. Antes de elegir la fórmula hay que preguntar qué cantidad es igual entre las observaciones.
- **Promediar velocidades con la media aritmética en recorridos de igual distancia.** Sobrestima la velocidad media, porque ignora que en los tramos lentos se pasa más tiempo.
- **Aplicarla con valores cero o negativos.** Un recíproco de cero no existe y los valores negativos no tienen interpretación como razón de este tipo.

:::figura[Sensibilidad extrema: un tramo a 0.5 km/h (un embotellamiento) junto a tramos de 10 y 12 km/h. La media armónica cae a 1.37 km/h, porque casi todo el tiempo del recorrido se pasa en el embotellamiento.]{componente="DataStrip"}
```yaml
modo: centro
datos: [0.5, 10, 12]
medidas: [armonica, media]
variable: Velocidad en tramos de 1 km
unidad: km/h
decimales: 1
dominio: [0, 14]
```
:::

## Conexiones

La media armónica es la recíproca de la [[media-aritmetica]] de los recíprocos y una forma de [[media-ponderada]] en la que cada valor pesa según el tiempo o el recurso que consume. Con la [[media-geometrica]] completa la [[desigualdad-entre-medias]]. En aprendizaje automático, la medida F1 es la media armónica de la precisión y la exhaustividad, elegida justamente porque castiga que una de las dos sea pequeña.

## Formulario

:::formula[Media armónica]
$$
\bar{x}_H = \frac{n}{\sum_{i=1}^{n} \frac{1}{x_i}}
$$

- $x_i > 0$: valores.
- $n$: número de valores.
:::

:::formula[Media armónica ponderada]
$$
\bar{x}_H = \frac{\sum_{i=1}^{n} w_i}{\sum_{i=1}^{n} \frac{w_i}{x_i}}
$$

- $w_i$: peso del valor $i$, por ejemplo la distancia de cada tramo.
:::

:::formula[Dos valores]
$$
\bar{x}_H = \frac{2ab}{a + b}
$$

- $a, b$: los dos valores positivos.
:::

:::formula[Velocidad media en tramos de igual distancia]
$$
\bar{v} = \frac{\text{distancia total}}{\text{tiempo total}} = \frac{n\,d}{\sum_{i=1}^{n} d / v_i} = \bar{v}_H
$$

- $d$: distancia de cada tramo.
- $v_i$: velocidad en el tramo $i$.
- $\bar{v}_H$: media armónica de las velocidades.
:::
