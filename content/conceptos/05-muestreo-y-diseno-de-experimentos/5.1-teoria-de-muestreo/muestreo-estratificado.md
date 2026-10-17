---
id: muestreo-estratificado
titulo: Muestreo estratificado
titulo_en: Stratified sampling
alias:
  - muestreo aleatorio estratificado
  - estratificación
modulo: 5
submodulo: '5.1'
orden: 4
nivel: basico
prerrequisitos:
  - muestreo-aleatorio-simple
  - media-ponderada
  - varianza-muestral
relaciones:
  - tipo: relacionado
    id: particiones-de-un-conjunto
etiquetas:
  - estratos
  - muestreo probabilístico
  - reducción de varianza
  - encuestas
  - ponderación
resumen: >
  Divide la población en grupos disjuntos, llamados estratos, y sortea una muestra aleatoria dentro de
  cada uno. Si los estratos difieren entre sí, estima con más precisión que un muestreo aleatorio simple.
formula: '\bar{y}_{st} = \sum_{h=1}^{H} W_h\,\bar{y}_h, \qquad W_h = \frac{N_h}{N}'
visualizacion:
  componente: SurveySampler
  parametros:
    diseno: estratificado
    disenos: [estratificado, mas]
    n: 30
    comparar: true
    repeticiones: 400
    poblacion:
      columnas: 20
      filas: 12
      estratos:
        - nombre: Norte seco
          media: 2.1
        - nombre: Bajío
          media: 4.5
        - nombre: Sur húmedo
          media: 6.8
      desviacion: 0.8
      icc: 0.2
      minimo: 0.2
      decimales: 2
      variable: Rendimiento de maíz
      unidad: t/ha
      nombreUnidad: Parcela
referencias:
  - clave: lohr
    capitulo: '3'
  - clave: casella-berger
publicado: true
---

## Intuición

Para estimar el rendimiento promedio de maíz de un estado con tres regiones muy distintas (un norte seco, el Bajío y un sur húmedo), un muestreo aleatorio simple de 30 parcelas puede salir, por azar, con 15 parcelas del norte y solo 5 del sur. La estimación quedaría muy baja, no por un defecto del método, sino por la mala suerte en la composición de la muestra.

El **muestreo estratificado** elimina esa fuente de variación: decide de antemano cuántas parcelas se toman de cada región y sortea solo dentro de cada una. La muestra ya no puede quedar cargada hacia una región. Después, las medias de las regiones se combinan con el peso que cada región tiene en la población. Lo único que queda por azar es la variación dentro de cada región, que es mucho menor que la variación entre regiones. Por eso, cuando los estratos son internamente parecidos y distintos entre sí, la precisión mejora mucho sin aumentar el tamaño de muestra.

## Definición

:::definicion[Muestreo aleatorio estratificado]
La población de $N$ unidades se divide en $H$ **estratos** disjuntos de tamaños $N_1, \dots, N_H$, con $\sum_h N_h = N$. En cada estrato $h$ se extrae, de forma independiente, un muestreo aleatorio simple de $n_h$ unidades, con $\sum_h n_h = n$. El estimador de la media poblacional es
$$
\bar{y}_{st} = \sum_{h=1}^{H} W_h\,\bar{y}_h, \qquad W_h = \frac{N_h}{N},
$$
donde $\bar{y}_h$ es la media muestral del estrato $h$.
:::

Como cada $\bar{y}_h$ es insesgada para la media del estrato $\bar{Y}_h$ y las muestras son independientes,
$$
\mathbb{E}[\bar{y}_{st}] = \bar{Y}, \qquad \operatorname{Var}(\bar{y}_{st}) = \sum_{h=1}^{H} W_h^2\left(1 - \frac{n_h}{N_h}\right)\frac{S_h^2}{n_h}.
$$

Los estratos deben definirse con información disponible para todas las unidades del marco antes de muestrear (región, tamaño de empresa, tipo de escuela).

:::nota[Qué significa cada símbolo]
- $H$: número de estratos; $h$: índice de un estrato.
- $N_h$, $n_h$: tamaño del estrato en la población y en la muestra.
- $W_h = N_h/N$: peso del estrato, la fracción de la población que representa.
- $\bar{y}_h$: media de la muestra del estrato $h$; $\bar{Y}_h$: media real del estrato.
- $S_h^2$: varianza dentro del estrato $h$, con denominador $N_h - 1$.
- $\bar{y}_{st}$: estimador estratificado de la media $\bar{Y}$.
:::

## Cómo usar la visualización

Las tres franjas son las regiones; el tono de cada parcela indica su rendimiento. Al reproducir se sortean parcelas dentro de cada franja y el encabezado combina las tres medias con sus pesos $W_h$. El histograma naranja acumula las estimaciones estratificadas y la línea negra muestra las de un muestreo aleatorio simple con el mismo número de parcelas.

Experimentos sugeridos:

- Compara los dos histogramas: el estratificado es mucho más angosto, y el efecto de diseño observado es menor que 1.
- Cambia la asignación a "Igual en cada estrato" y observa que el estimador sigue centrado porque los pesos $W_h$ corrigen la composición.
- Cambia el diseño a muestreo aleatorio simple y observa cómo cambia la proporción de parcelas de cada región en cada muestra.

## Ejemplo

El estado tiene 240 parcelas, 80 en cada región, con desviación estándar dentro de región de $0.8$ t/ha. Se toman 10 parcelas por región.

1. Pesos: $W_h = 80/240 = 1/3$ para las tres regiones.
2. Medias muestrales: $\bar{y}_1 = 2.0$, $\bar{y}_2 = 4.6$, $\bar{y}_3 = 6.9$ t/ha.
3. Estimación: $\bar{y}_{st} = \frac{1}{3}(2.0) + \frac{1}{3}(4.6) + \frac{1}{3}(6.9) = 4.5$ t/ha.
4. Varianza: cada estrato aporta $\frac{1}{9}\left(1 - \frac{10}{80}\right)\frac{0.8^2}{10} = 0.0062$; la suma es $0.0187$ y el error estándar $0.137$ t/ha.
5. Con un muestreo aleatorio simple de 30 parcelas, la varianza total del rendimiento es cercana a $4.3$ (incluye la diferencia entre regiones) y el error estándar sería $\sqrt{0.875 \cdot 4.3/30} \approx 0.35$ t/ha, más del doble.

:::figura[Una sola muestra estratificada de 30 parcelas: el encabezado combina las medias de las tres regiones con pesos de un tercio.]{componente="SurveySampler"}
```yaml
diseno: estratificado
n: 30
repeticiones: 1
poblacion:
  columnas: 20
  filas: 12
  estratos:
    - nombre: Norte seco
      media: 2.1
    - nombre: Bajío
      media: 4.5
    - nombre: Sur húmedo
      media: 6.8
  desviacion: 0.8
  icc: 0.2
  minimo: 0.2
  decimales: 2
  variable: Rendimiento de maíz
  unidad: t/ha
  nombreUnidad: Parcela
```
:::

## Propiedades

- **Insesgado con cualquier asignación**, siempre que cada estrato tenga $n_h \ge 1$ y se use el peso $W_h$.
- **La ganancia viene de la variación entre estratos.** Con asignación proporcional y $N_h$ grandes, $\operatorname{Var}_{\mathrm{MAS}} - \operatorname{Var}_{st} \approx \frac{1 - f}{n}\sum_h W_h (\bar{Y}_h - \bar{Y})^2$, que es mayor cuanto más difieren las medias de los estratos.
- **Si los estratos son iguales entre sí, no hay ganancia ni pérdida apreciable** frente al muestreo aleatorio simple con asignación proporcional.
- **Permite estimaciones por estrato** con tamaño de muestra controlado, útil cuando se quieren resultados para cada región.

:::figura[Propiedad de ganancia por diferencias entre estratos: tiendas de tres tamaños con ventas muy distintas. El estratificado tiene un error estándar mucho menor que el aleatorio simple.]{componente="SurveySampler"}
```yaml
diseno: estratificado
n: 24
comparar: true
repeticiones: 400
poblacion:
  columnas: 18
  filas: 12
  estratos:
    - nombre: Pequeñas
      media: 40
      desviacion: 8
    - nombre: Medianas
      media: 110
      desviacion: 15
    - nombre: Grandes
      media: 260
      desviacion: 30
  desviacion: 15
  icc: 0.1
  minimo: 5
  decimales: 0
  variable: Ventas diarias
  unidad: miles de pesos
  nombreUnidad: Tienda
```
:::

:::figura[Propiedad sin ganancia: si los tres turnos de una fábrica producen piezas con el mismo peso promedio, estratificar por turno da prácticamente el mismo histograma que el muestreo aleatorio simple.]{componente="SurveySampler"}
```yaml
diseno: estratificado
n: 30
comparar: true
repeticiones: 400
poblacion:
  columnas: 20
  filas: 12
  estratos:
    - nombre: Mañana
      media: 250
    - nombre: Tarde
      media: 250
    - nombre: Noche
      media: 250
  desviacion: 4
  icc: 0.05
  decimales: 1
  variable: Peso de la pieza
  unidad: g
  nombreUnidad: Pieza
```
:::

## Errores comunes

- **Promediar todas las observaciones sin pesos cuando la asignación no es proporcional.** Si se toman 10 tiendas grandes y 10 pequeñas aunque las pequeñas sean mayoría, la media simple de las 20 sobrerrepresenta a las grandes; hay que usar $\sum_h W_h \bar{y}_h$.
- **Estratificar con una variable sin relación con lo que se mide**, esperando una mejora. La ganancia depende de que los estratos difieran en la variable de interés.
- **Llenar cada estrato con las unidades más fáciles de encontrar.** Eso conserva la composición por estrato pero no es aleatorio dentro de él: es muestreo por cuotas y puede tener sesgo.

:::figura[Error de llenar los estratos sin sorteo: cada región recibe su número correcto de parcelas, pero se eligen las más cercanas al acceso, que son de menor rendimiento, y las estimaciones quedan desplazadas.]{componente="SurveySampler"}
```yaml
diseno: cuotas
disenos: [cuotas, estratificado]
n: 30
repeticiones: 300
poblacion:
  columnas: 20
  filas: 12
  estratos:
    - nombre: Norte seco
      media: 2.1
    - nombre: Bajío
      media: 4.5
    - nombre: Sur húmedo
      media: 6.8
  desviacion: 0.8
  icc: 0.2
  tendencia: 2
  minimo: 0.2
  decimales: 2
  variable: Rendimiento de maíz
  unidad: t/ha
  nombreUnidad: Parcela
```
:::

## Conexiones

El muestreo estratificado aplica un [[muestreo-aleatorio-simple]] dentro de cada bloque de una [[particiones-de-un-conjunto|partición]] de la población y combina los resultados con una [[media-ponderada]]. Su varianza se escribe con la [[varianza-muestral]] de cada estrato. La forma de repartir $n$ entre los estratos se estudia en la asignación proporcional y de Neyman, y la idea de corregir la composición después de muestrear lleva a la post-estratificación. Es el análogo en encuestas del bloqueo en el diseño de experimentos.

## Formulario

:::formula[Estimador estratificado]
$$
\bar{y}_{st} = \sum_{h=1}^{H} W_h\,\bar{y}_h, \qquad W_h = \frac{N_h}{N}
$$

- $H$: número de estratos.
- $W_h$: peso del estrato $h$; $N_h$: su tamaño; $N$: tamaño de la población.
- $\bar{y}_h$: media muestral del estrato $h$.
:::

:::formula[Varianza del estimador estratificado]
$$
\operatorname{Var}(\bar{y}_{st}) = \sum_{h=1}^{H} W_h^2\left(1 - \frac{n_h}{N_h}\right)\frac{S_h^2}{n_h}
$$

- $n_h$: tamaño de muestra del estrato $h$.
- $S_h^2$: varianza poblacional dentro del estrato $h$.
- $1 - n_h/N_h$: corrección por población finita del estrato.
:::

:::formula[Ganancia frente al muestreo aleatorio simple]
$$
\operatorname{Var}_{\mathrm{MAS}} - \operatorname{Var}_{st,\,\mathrm{prop}} \approx \frac{1 - f}{n}\sum_{h=1}^{H} W_h\left(\bar{Y}_h - \bar{Y}\right)^2
$$

- $f = n/N$: fracción de muestreo.
- $\bar{Y}_h$: media real del estrato; $\bar{Y}$: media real de la población.
- $\operatorname{Var}_{st,\,\mathrm{prop}}$: varianza estratificada con asignación proporcional.
:::
