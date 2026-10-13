---
id: grafico-de-coordenadas-paralelas
titulo: Gráfico de coordenadas paralelas
titulo_en: Parallel coordinates plot
alias:
  - coordenadas paralelas
  - parallel coordinates
modulo: 4
submodulo: '4.6'
orden: 16
nivel: basico
prerrequisitos:
  - matriz-de-diagramas-de-dispersion
etiquetas:
  - visualización
  - varias variables
  - perfiles
  - grupos
resumen: >
  El gráfico de coordenadas paralelas dibuja un eje vertical por variable y representa cada observación
  como una línea quebrada que los cruza. Muestra perfiles, grupos y relaciones entre variables vecinas.
formula: 'u_{ij} = \frac{x_{ij} - \min_i x_{ij}}{\max_i x_{ij} - \min_i x_{ij}}'
visualizacion:
  componente: ChartGallery
  parametros:
    grafico: paralelas
    variables: [Calorías, Proteína, Fibra, Azúcar, Grasa]
    filas:
      - grupo: Integral
        valores: [340, 12, 11, 4, 3]
      - grupo: Integral
        valores: [355, 13, 10, 5, 4]
      - grupo: Integral
        valores: [330, 11, 12, 3, 2.5]
      - grupo: Integral
        valores: [348, 12.5, 9.5, 6, 3.5]
      - grupo: Integral
        valores: [338, 11.5, 11.5, 4.5, 3]
      - grupo: Azucarado
        valores: [385, 6, 2, 35, 2]
      - grupo: Azucarado
        valores: [390, 5, 1.5, 38, 1.5]
      - grupo: Azucarado
        valores: [378, 6.5, 2.5, 32, 2.5]
      - grupo: Azucarado
        valores: [395, 5.5, 1, 40, 1]
      - grupo: Azucarado
        valores: [382, 7, 3, 30, 2]
      - grupo: Granola
        valores: [450, 10, 7, 20, 15]
      - grupo: Granola
        valores: [470, 11, 6.5, 22, 18]
      - grupo: Granola
        valores: [440, 9.5, 8, 18, 14]
      - grupo: Granola
        valores: [465, 10.5, 7.5, 24, 17]
      - grupo: Granola
        valores: [455, 9, 6, 21, 16]
referencias:
  - clave: hastie-esl
  - clave: tufte
publicado: true
---

## Intuición

Una nutrióloga compara 15 cereales de desayuno en cinco características por cada 100 gramos: calorías, proteína, fibra, azúcar y grasa. Un diagrama de dispersión solo muestra dos variables a la vez. En cambio, si se dibujan cinco ejes verticales lado a lado, uno por característica, cada cereal puede representarse como una línea quebrada que toca cada eje a la altura de su valor.

El resultado es un **gráfico de coordenadas paralelas**. Los cereales parecidos producen líneas parecidas que viajan juntas formando haces: los integrales bajan en azúcar y suben en fibra; los azucarados hacen lo contrario; las granolas destacan en calorías y grasa. Además, la forma en que las líneas pasan de un eje al siguiente revela la relación entre esas dos variables: líneas casi paralelas indican asociación positiva y líneas que se cruzan en forma de X indican asociación negativa.

## Definición

:::definicion[Gráfico de coordenadas paralelas]
Para $n$ observaciones de $p$ variables, con valores $x_{ij}$, se dibujan $p$ ejes verticales paralelos y equiespaciados. Cada eje se escala a su propio rango, de modo que la observación $i$ toca el eje $j$ a la altura relativa

$$
u_{ij} = \frac{x_{ij} - \min_i x_{ij}}{\max_i x_{ij} - \min_i x_{ij}} \in [0, 1].
$$

La observación $i$ se representa como la línea quebrada que une los puntos $(j, u_{ij})$ para $j = 1, \dots, p$.
:::

Supuestos y decisiones de diseño:

- Las variables son cuantitativas (u ordinales codificadas con números).
- El orden de los ejes es una elección: solo se aprecia la relación entre ejes vecinos.
- Cada eje tiene su propia escala, de modo que las alturas solo se comparan dentro de un mismo eje.

:::nota[Qué significa cada símbolo]
- $n$: número de observaciones; $p$: número de variables (ejes).
- $x_{ij}$: valor de la variable $j$ en la observación $i$.
- $\min_i x_{ij}$, $\max_i x_{ij}$: mínimo y máximo de la variable $j$ entre todas las observaciones.
- $u_{ij}$: altura relativa, entre 0 y 1, en la que la observación $i$ cruza el eje $j$.
:::

## Cómo usar la visualización

Las líneas se agregan una a una; la más reciente se dibuja más gruesa y el encabezado muestra sus cinco valores. Cada eje indica su mínimo abajo y su máximo arriba.

El selector **Resaltar grupo** atenúa todas las líneas excepto las del grupo elegido.

Experimentos sugeridos:

1. Resaltar los cereales azucarados: su haz baja de azúcar alta a grasa baja y cruza el haz de los integrales.
2. Observar el tramo entre Fibra y Azúcar: las líneas forman una X, señal de asociación negativa.
3. Resaltar la granola: es el único grupo arriba en Calorías y en Grasa a la vez.

## Ejemplo

El primer cereal integral tiene calorías 340, proteína 12, fibra 11, azúcar 4 y grasa 3. Los rangos de cada variable en los 15 cereales son: calorías de 330 a 470, proteína de 5 a 13, fibra de 1 a 12, azúcar de 3 a 40 y grasa de 1 a 18.

1. Calorías: $u = (340 - 330)/(470 - 330) = 10/140 \approx 0.07$.
2. Proteína: $u = (12 - 5)/(13 - 5) = 7/8 \approx 0.88$.
3. Fibra: $u = (11 - 1)/(12 - 1) = 10/11 \approx 0.91$.
4. Azúcar: $u = (4 - 3)/(40 - 3) = 1/37 \approx 0.03$.
5. Grasa: $u = (3 - 1)/(18 - 1) = 2/17 \approx 0.12$.

La línea de este cereal empieza abajo, sube en proteína y fibra y vuelve a bajar en azúcar y grasa.

:::figura[Solo tres cereales, uno de cada grupo, para seguir cada línea eje por eje.]{componente="ChartGallery"}
```yaml
grafico: paralelas
variables: [Calorías, Proteína, Fibra, Azúcar, Grasa]
filas:
  - grupo: Integral
    valores: [340, 12, 11, 4, 3]
  - grupo: Azucarado
    valores: [385, 6, 2, 35, 2]
  - grupo: Granola
    valores: [450, 10, 7, 20, 15]
```
:::

## Propiedades

**Asociación positiva entre ejes vecinos:** las líneas viajan casi paralelas.

:::figura[Asociación positiva: horas de entrenamiento semanal y distancia recorrida de diez corredores, más su ritmo cardiaco en reposo. Entre los dos primeros ejes las líneas casi no se cruzan; entre el segundo y el tercero se cruzan en X.]{componente="ChartGallery"}
```yaml
grafico: paralelas
variables: [Entrenamiento (h), Distancia (km), Pulso en reposo]
filas:
  - grupo: Corredores
    valores: [2, 10, 72]
  - grupo: Corredores
    valores: [3, 16, 70]
  - grupo: Corredores
    valores: [4, 21, 66]
  - grupo: Corredores
    valores: [5, 26, 64]
  - grupo: Corredores
    valores: [6, 30, 62]
  - grupo: Corredores
    valores: [7, 37, 59]
  - grupo: Corredores
    valores: [8, 42, 57]
  - grupo: Corredores
    valores: [9, 47, 55]
  - grupo: Corredores
    valores: [10, 52, 52]
  - grupo: Corredores
    valores: [11, 58, 50]
```
:::

**Asociación negativa:** las líneas se cruzan en un punto común entre los dos ejes, formando una X. **Grupos:** observaciones similares forman haces.

## Errores comunes

- **Creer que el orden de los ejes no importa.** Solo se ve la relación entre ejes vecinos; dos variables muy relacionadas pero lejanas parecen independientes.
- **Comparar alturas entre ejes distintos.** Cada eje tiene su propia escala: una línea alta en Calorías y baja en Grasa no significa que tenga más calorías que grasa en ninguna unidad común.
- **Dibujar miles de líneas opacas.** Se forma una mancha; ayuda la transparencia o resaltar un grupo.

:::figura[El orden importa: los mismos diez corredores con los ejes reordenados. Entrenamiento y distancia ya no son vecinos y su relación positiva deja de verse directamente.]{componente="ChartGallery"}
```yaml
grafico: paralelas
variables: [Entrenamiento (h), Pulso en reposo, Distancia (km)]
filas:
  - grupo: Corredores
    valores: [2, 72, 10]
  - grupo: Corredores
    valores: [3, 70, 16]
  - grupo: Corredores
    valores: [4, 66, 21]
  - grupo: Corredores
    valores: [5, 64, 26]
  - grupo: Corredores
    valores: [6, 62, 30]
  - grupo: Corredores
    valores: [7, 59, 37]
  - grupo: Corredores
    valores: [8, 57, 42]
  - grupo: Corredores
    valores: [9, 55, 47]
  - grupo: Corredores
    valores: [10, 52, 52]
  - grupo: Corredores
    valores: [11, 50, 58]
```
:::

## Conexiones

Las coordenadas paralelas son una alternativa compacta a la [[matriz-de-diagramas-de-dispersion]] cuando hay muchas variables. Cada par de ejes vecinos equivale a un [[diagrama-de-dispersion]] transformado: la asociación positiva o negativa de la [[coeficiente-de-correlacion-de-pearson|correlación]] se traduce en líneas paralelas o cruzadas. Comparte con el [[mapa-de-calor]] la idea de mostrar perfiles completos de muchas observaciones.

## Formulario

:::formula[Altura relativa en cada eje]
$$
u_{ij} = \frac{x_{ij} - \min_i x_{ij}}{\max_i x_{ij} - \min_i x_{ij}}
$$

- $u_{ij}$: altura entre 0 y 1 en la que la observación $i$ cruza el eje $j$.
- $x_{ij}$: valor de la variable $j$ en la observación $i$.
- $\min_i x_{ij}$, $\max_i x_{ij}$: mínimo y máximo de la variable $j$.
:::

:::formula[Puntos de la línea de la observación i]
$$
(j, u_{ij}),\qquad j = 1, \dots, p
$$

- $j$: posición horizontal del eje de la variable $j$.
- $p$: número de variables.
:::
