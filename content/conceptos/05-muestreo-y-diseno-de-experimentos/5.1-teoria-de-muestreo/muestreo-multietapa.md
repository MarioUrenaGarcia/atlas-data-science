---
id: muestreo-multietapa
titulo: Muestreo multietapa
titulo_en: Multistage sampling
alias:
  - muestreo bietápico
  - muestreo en dos etapas
  - unidades primarias de muestreo
modulo: 5
submodulo: '5.1'
orden: 8
nivel: basico
prerrequisitos:
  - muestreo-por-conglomerados
relaciones:
  - tipo: generaliza
    id: muestreo-por-conglomerados
  - tipo: relacionado
    id: marco-muestral
etiquetas:
  - unidades primarias
  - encuestas nacionales
  - conglomerados
  - submuestreo
resumen: >
  Se sortean grupos grandes, después grupos o unidades dentro de los elegidos, y así por etapas. Es
  el diseño de las encuestas nacionales de hogares, porque solo exige listar las unidades dentro de
  los grupos que salen sorteados.
formula: '\operatorname{Var}(\hat{\bar{Y}}) = \left(1 - \frac{m}{C}\right)\frac{S_1^2}{m} + \left(1 - \frac{k}{M}\right)\frac{S_2^2}{m\,k}'
visualizacion:
  componente: SurveySampler
  parametros:
    diseno: multietapa
    disenos: [multietapa, conglomerados, mas]
    n: 6
    porConglomerado: 4
    comparar: true
    repeticiones: 400
    poblacion:
      columnas: 24
      filas: 16
      estratos:
        - nombre: Municipio
          media: 850
      conglomerado: [6, 4]
      icc: 0.3
      desviacion: 260
      minimo: 0
      decimales: 0
      variable: Gasto mensual en medicamentos
      unidad: pesos
      nombreUnidad: Vivienda
      nombreConglomerado: Manzana
referencias:
  - clave: lohr
    capitulo: '6'
publicado: true
---

## Intuición

No existe una lista de todas las viviendas de un país. Sí existen listas de municipios, mapas de manzanas dentro de cada municipio y, una vez que un encuestador camina una manzana, una lista de sus viviendas. Las encuestas nacionales aprovechan eso: sortean municipios, dentro de cada municipio elegido sortean manzanas, y dentro de cada manzana elegida sortean unas cuantas viviendas. Solo hace falta listar las viviendas de las manzanas que salieron, no las del país entero.

Este **muestreo multietapa** combina las ventajas del muestreo por conglomerados (pocos lugares que visitar) con las del muestreo aleatorio simple (no se gasta toda la muestra en vecinos que se parecen). Tomar 4 viviendas de cada una de 6 manzanas suele dar más información que tomar las 24 viviendas de una sola manzana, porque las viviendas de una misma manzana se parecen. El diseño se ajusta eligiendo cuántos grupos sortear en cada etapa y cuántas unidades tomar dentro de cada uno.

## Definición

:::definicion[Muestreo en dos etapas]
La población se divide en $C$ **unidades primarias de muestreo** (conglomerados) de tamaño $M$. En la primera etapa se sortean $m$ unidades primarias con muestreo aleatorio simple. En la segunda, dentro de cada una se sortean $k$ de sus $M$ unidades, también con muestreo aleatorio simple. Con tamaños iguales, la media se estima con
$$
\hat{\bar{Y}} = \frac{1}{m}\sum_{c=1}^{m} \bar{y}_c,
$$
donde $\bar{y}_c$ es la media de las $k$ unidades observadas en el conglomerado $c$.
:::

El estimador es insesgado y su varianza tiene un término por cada etapa:
$$
\operatorname{Var}(\hat{\bar{Y}}) = \left(1 - \frac{m}{C}\right)\frac{S_1^2}{m} + \left(1 - \frac{k}{M}\right)\frac{S_2^2}{m\,k}.
$$
Con más de dos etapas el esquema se repite, y cada etapa agrega su propio término. Si los tamaños de los conglomerados difieren, cada unidad recibe un peso igual al inverso de su probabilidad total de inclusión, el producto de las probabilidades de cada etapa.

:::nota[Qué significa cada símbolo]
- $C$: unidades primarias en la población; $m$: unidades primarias sorteadas.
- $M$: unidades dentro de cada primaria; $k$: unidades sorteadas dentro de cada primaria elegida.
- $\bar{y}_c$: media de las unidades observadas en la primaria $c$.
- $S_1^2$: varianza entre las medias reales de las primarias.
- $S_2^2$: promedio de las varianzas dentro de las primarias.
- $m\,k$: tamaño total de la muestra.
:::

## Cómo usar la visualización

Cada rectángulo es una manzana con 24 viviendas; el tono indica el gasto en medicamentos. Al reproducir se sortean 6 manzanas (bordes resaltados) y dentro de cada una 4 viviendas. El histograma naranja acumula las estimaciones; la línea negra muestra un muestreo aleatorio simple de 24 viviendas.

Experimentos sugeridos:

- Cambia a 12 manzanas con 2 viviendas cada una: el mismo total de 24 viviendas da un histograma más angosto.
- Cambia a 2 manzanas con 12 viviendas: el efecto de diseño crece.
- Cambia el diseño a conglomerados con 1 manzana completa, que también da 24 viviendas: el histograma es mucho más ancho que el de 6 manzanas con 4 viviendas cada una.

## Ejemplo

Una colonia tiene $C = 50$ manzanas de $M = 30$ viviendas. Se sortean $m = 10$ manzanas y $k = 6$ viviendas en cada una. Por una encuesta anterior se sabe que $S_1^2 = 400$ y $S_2^2 = 2500$ (en pesos al cuadrado).

1. Tamaño de muestra: $m k = 60$ viviendas.
2. Término de la primera etapa: $(1 - 10/50)\cdot 400/10 = 32$.
3. Término de la segunda etapa: $(1 - 6/30)\cdot 2500/60 = 33.3$.
4. Varianza total: $65.3$; error estándar $8.1$ pesos.
5. Con $m = 20$ manzanas y $k = 3$ viviendas (también 60), los términos serían $0.6 \cdot 20 = 12$ y $0.9 \cdot 41.7 = 37.5$: varianza $49.5$, un 24 % menor, a cambio de visitar el doble de manzanas.

:::figura[Una sola muestra en dos etapas: 6 manzanas sorteadas y 4 viviendas sorteadas dentro de cada una. El encabezado promedia las medias de las manzanas.]{componente="SurveySampler"}
```yaml
diseno: multietapa
n: 6
porConglomerado: 4
repeticiones: 1
poblacion:
  columnas: 24
  filas: 16
  estratos:
    - nombre: Municipio
      media: 850
  conglomerado: [6, 4]
  icc: 0.3
  desviacion: 260
  minimo: 0
  decimales: 0
  variable: Gasto mensual en medicamentos
  unidad: pesos
  nombreUnidad: Vivienda
  nombreConglomerado: Manzana
```
:::

## Propiedades

- **Generaliza al muestreo por conglomerados**, que es el caso $k = M$; en el otro extremo, $m = C$ equivale a un muestreo estratificado con las primarias como estratos.
- **El primer término suele dominar.** Si las primarias difieren mucho entre sí, aumentar $k$ ayuda poco; conviene aumentar $m$.
- **Diseño autoponderado:** si las primarias se sortean con probabilidad proporcional a su tamaño y en cada una se toma el mismo número de unidades, todas las unidades tienen la misma probabilidad total de inclusión.
- **Solo hace falta el marco de las etapas sorteadas**, lo que hace posible muestrear poblaciones sin lista completa.

:::figura[Propiedad del reparto entre etapas: 12 manzanas con 2 viviendas cada una. Con el mismo total de 24 viviendas que la visualización principal, el error estándar es menor.]{componente="SurveySampler"}
```yaml
diseno: multietapa
n: 12
porConglomerado: 2
comparar: true
repeticiones: 400
poblacion:
  columnas: 24
  filas: 16
  estratos:
    - nombre: Municipio
      media: 850
  conglomerado: [6, 4]
  icc: 0.3
  desviacion: 260
  minimo: 0
  decimales: 0
  variable: Gasto mensual en medicamentos
  unidad: pesos
  nombreUnidad: Vivienda
  nombreConglomerado: Manzana
```
:::

## Errores comunes

- **Calcular el error estándar solo con la variación dentro de las primarias.** Eso ignora el término $S_1^2/m$, que casi siempre es el mayor, y produce intervalos demasiado optimistas.
- **Olvidar los pesos cuando las primarias tienen tamaños distintos.** Una vivienda de una manzana pequeña tiene más probabilidad de entrar que una de una manzana grande si en ambas se toman $k$ viviendas.
- **Sortear muy pocas primarias para ahorrar traslados.** Con 2 o 3 primarias la varianza del primer término es grande y además se estima con muy pocos grados de libertad.

:::figura[Error de sortear muy pocas primarias: dos hospitales y 12 pacientes en cada uno para estimar la estancia promedio. El efecto de diseño es alto porque cada hospital tiene su propio estilo de atención.]{componente="SurveySampler"}
```yaml
diseno: multietapa
n: 2
porConglomerado: 12
nMaximo: 60
comparar: true
repeticiones: 400
poblacion:
  columnas: 24
  filas: 16
  estratos:
    - nombre: Red de salud
      media: 5.2
  conglomerado: [6, 4]
  icc: 0.45
  desviacion: 1.6
  minimo: 1
  decimales: 1
  variable: Días de estancia
  unidad: días
  nombreUnidad: Paciente
  nombreConglomerado: Hospital
```
:::

## Conexiones

El muestreo multietapa extiende el [[muestreo-por-conglomerados]] submuestreando dentro de cada conglomerado, y resuelve la falta de un [[marco-muestral]] completo construyendo el marco solo donde se necesita. Suele combinarse con el [[muestreo-estratificado]] en la primera etapa y con probabilidades proporcionales al tamaño para que las unidades finales tengan pesos iguales.

## Formulario

:::formula[Estimador en dos etapas]
$$
\hat{\bar{Y}} = \frac{1}{m}\sum_{c=1}^{m}\bar{y}_c
$$

- $m$: unidades primarias sorteadas.
- $\bar{y}_c$: media de las $k$ unidades observadas en la primaria $c$.
:::

:::formula[Varianza en dos etapas]
$$
\operatorname{Var}(\hat{\bar{Y}}) = \left(1 - \frac{m}{C}\right)\frac{S_1^2}{m} + \left(1 - \frac{k}{M}\right)\frac{S_2^2}{m\,k}
$$

- $C$: primarias en la población; $M$: unidades por primaria; $k$: unidades sorteadas por primaria.
- $S_1^2$: varianza entre las medias de las primarias.
- $S_2^2$: varianza promedio dentro de las primarias.
:::

:::formula[Probabilidad total de inclusión]
$$
\pi_i = \pi_{c} \cdot \pi_{i \mid c}
$$

- $\pi_c$: probabilidad de que salga la primaria $c$ que contiene a la unidad $i$.
- $\pi_{i \mid c}$: probabilidad de que salga la unidad $i$ dado que salió su primaria.
- El peso de la unidad es $1/\pi_i$.
:::
