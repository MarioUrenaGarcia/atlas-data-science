---
id: discretizacion
titulo: Discretización (binning)
titulo_en: Discretization (binning)
alias:
  - binning
  - agrupamiento en intervalos
  - categorización de variables continuas
modulo: 12
submodulo: '12.3'
orden: 6
nivel: basico
prerrequisitos:
  - histograma
  - cuantiles-cuartiles-deciles-y-percentiles
etiquetas:
  - discretización
  - intervalos
  - cuantiles
  - ingeniería de características
resumen: >
  Discretizar es convertir una variable continua en categorías ordenadas cortándola en intervalos, de igual
  anchura o de igual frecuencia. Simplifica y permite efectos no lineales, a costa de perder información.
formula: 'b(x) = j \iff c_{j-1} \le x < c_j'
visualizacion:
  componente: FeatureEngineeringViz
  parametros:
    modo: discretizacion
    metodo: anchura
    intervalos: 5
referencias:
  - clave: hastie-esl
  - clave: james-isl
publicado: true
---

## Intuición

Una paquetería registra el tiempo de entrega de cada envío en días con decimales, pero el área comercial piensa en "entrega rápida", "normal" y "tardía". Convertir el número en esas tres categorías es **discretizar**: cortar el eje en intervalos y reemplazar cada valor por el intervalo al que pertenece.

Hay dos maneras sencillas de poner los cortes. Con **igual anchura**, los intervalos miden lo mismo; si la variable tiene una cola larga, casi todos los envíos caen en los primeros intervalos y los últimos quedan casi vacíos. Con **igual frecuencia**, los cortes se colocan en los cuantiles, así que cada intervalo recibe aproximadamente el mismo número de envíos; los intervalos son angostos donde hay muchos datos y anchos en la cola. En un modelo lineal, usar los intervalos como categorías permite que el efecto del tiempo de entrega sea distinto en cada tramo, sin imponer una recta. El costo es que dos envíos de 2.1 y 3.9 días quedan iguales si caen en el mismo intervalo, y dos de 3.9 y 4.1 quedan distintos aunque casi coinciden.

## Definición

:::definicion[Discretización]
Sean $c_0 < c_1 < \dots < c_k$ los cortes de $k$ intervalos. La **discretización** asigna a cada valor el índice de su intervalo:

$$
b(x) = j \iff c_{j-1} \le x < c_j, \qquad j = 1, \dots, k,
$$

con el último intervalo cerrado en $c_k$. Con **igual anchura**, $c_j = \min x + j\,h$ con $h = (\max x - \min x)/k$. Con **igual frecuencia**, $c_j = q_{j/k}$, el cuantil de orden $j/k$.
:::

:::nota[Qué significa cada símbolo]
- $k$: número de intervalos.
- $c_0, \dots, c_k$: cortes; $c_0$ es el mínimo y $c_k$ el máximo.
- $b(x)$: índice del intervalo que contiene a $x$.
- $h$: anchura común de los intervalos en el método de igual anchura.
- $q_{j/k}$: cuantil de orden $j/k$ de los datos de entrenamiento.
:::

## Cómo usar la visualización

Arriba, cada punto es un envío colocado según su tiempo de entrega; las líneas naranjas son los cortes y el color indica el intervalo asignado. Al reproducir, los envíos se asignan uno por uno y las barras de abajo cuentan cuántos cae en cada intervalo. El encabezado muestra cómo se calculan los cortes.

Experimentos sugeridos: con igual anchura y cinco intervalos, observar que el último casi no recibe envíos; cambiar a igual frecuencia y comparar la anchura de los intervalos; subir el número de intervalos y ver que algunos de igual anchura quedan casi vacíos.

## Ejemplo

Diez envíos tardaron 1, 1.5, 2, 2.2, 3, 3.5, 4, 6, 9 y 15 días. Se discretiza en $k = 3$ intervalos.

1. **Igual anchura:** $h = (15 - 1)/3 = 4.67$; cortes en 1, 5.67, 10.33 y 15. Conteos: 7, 2 y 1.
2. **Igual frecuencia:** el cuantil 1/3 está en la posición $1 + 9/3 = 4$, es decir 2.2; el cuantil 2/3 en la posición 7, es decir 4. Intervalos $[1, 2.2)$, $[2.2, 4)$ y $[4, 15]$ con 3, 3 y 4 envíos.
3. Con igual anchura, el primer intervalo mezcla envíos de 1 y de 4 días; con igual frecuencia, el último mezcla envíos de 4 y de 15 días.

:::figura[Los mismos tiempos de entrega con cortes de igual frecuencia: las barras quedan parejas y los intervalos de la cola son anchos.]{componente="FeatureEngineeringViz"}
```yaml
modo: discretizacion
metodo: frecuencia
intervalos: 5
```
:::

## Propiedades

- **Igual anchura respeta las distancias, igual frecuencia respeta los rangos.** La primera es fácil de interpretar; la segunda reparte los datos de forma pareja y es más resistente a los extremos.
- **La discretización pierde información dentro de cada intervalo.** Cuantos menos intervalos, más grande la pérdida.

:::figura[Con diez intervalos de igual anchura, varios intervalos de la cola quedan casi vacíos y sus categorías tienen muy pocos datos.]{componente="FeatureEngineeringViz"}
```yaml
modo: discretizacion
metodo: anchura
intervalos: 10
```
:::

- **Permite efectos no lineales en modelos lineales.** Codificando cada intervalo como una categoría, el modelo estima un nivel distinto por tramo: una función escalonada.

## Errores comunes

- **Discretizar para "simplificar" sin necesidad.** Partir una variable continua en dos grupos (por ejemplo, por la mediana) desperdicia información y reduce la potencia de cualquier análisis.
- **Elegir los cortes mirando la relación con la variable objetivo.** Buscar los cortes que más separan el resultado sobreajusta y produce efectos aparentes que no se repiten en datos nuevos.
- **Calcular los cortes con todos los datos.** Los cuantiles de igual frecuencia se calculan con el entrenamiento, igual que cualquier parámetro de preprocesamiento.

:::figura[Error de simplificar de más: con solo dos intervalos de igual frecuencia, todo envío por debajo de la mediana, que es de unos 3.8 días, se trata igual, sea de un día o de casi cuatro.]{componente="FeatureEngineeringViz"}
```yaml
modo: discretizacion
metodo: frecuencia
intervalos: 2
```
:::

## Conexiones

Los cortes de igual anchura son los de un [[histograma]], cuyo número de intervalos se discute en [[seleccion-del-numero-de-intervalos]]; los de igual frecuencia son [[cuantiles-cuartiles-deciles-y-percentiles|cuantiles]]. Cada intervalo resultante es una categoría ordinal, que puede usarse con la [[codificacion-ordinal]] o con la [[codificacion-one-hot]]. La función que asigna el intervalo es una suma de [[funcion-indicadora-y-funcion-escalon|funciones escalón]].

## Formulario

:::formula[Intervalo de un valor]
$$
b(x) = j \iff c_{j-1} \le x < c_j
$$

- $c_{j-1}$, $c_j$: cortes inferior y superior del intervalo $j$.
:::

:::formula[Cortes de igual anchura]
$$
c_j = \min x + j\,h, \qquad h = \frac{\max x - \min x}{k}
$$

- $k$: número de intervalos; $h$: anchura de cada uno.
:::

:::formula[Cortes de igual frecuencia]
$$
c_j = q_{j/k}, \qquad j = 0, \dots, k
$$

- $q_{j/k}$: cuantil de orden $j/k$.
:::
