---
id: muestreo-por-conglomerados
titulo: Muestreo por conglomerados
titulo_en: Cluster sampling
alias:
  - muestreo por racimos
  - muestreo de conglomerados en una etapa
modulo: 5
submodulo: '5.1'
orden: 6
nivel: basico
prerrequisitos:
  - muestreo-aleatorio-simple
relaciones:
  - tipo: contrasta
    id: muestreo-estratificado
etiquetas:
  - conglomerados
  - correlación intraclase
  - costos de campo
  - encuestas
resumen: >
  Se sortean grupos completos de unidades, como escuelas o manzanas, y se observan todas las unidades
  de los grupos elegidos. Abarata el trabajo de campo, pero pierde precisión si las unidades de un
  mismo grupo se parecen entre sí.
formula: '\hat{\bar{Y}} = \frac{\sum_{c \in \mathcal{S}} t_c}{\sum_{c \in \mathcal{S}} M_c}'
visualizacion:
  componente: SurveySampler
  parametros:
    diseno: conglomerados
    disenos: [conglomerados, mas]
    n: 3
    comparar: true
    repeticiones: 400
    poblacion:
      columnas: 24
      filas: 12
      estratos:
        - nombre: Zona escolar
          media: 68
      conglomerado: [4, 3]
      icc: 0.35
      desviacion: 11
      minimo: 0
      decimales: 0
      variable: Calificación de matemáticas
      unidad: puntos
      nombreUnidad: Alumno
      nombreConglomerado: Escuela
referencias:
  - clave: lohr
    capitulo: '5'
publicado: true
---

## Intuición

Aplicar un examen a 36 alumnos elegidos al azar entre todos los de una zona escolar obliga a visitar casi 36 escuelas distintas. Es mucho más barato sortear tres escuelas y examinar a todos sus alumnos: un solo viaje por escuela. Eso es el **muestreo por conglomerados**: las unidades que se sortean son grupos naturales (escuelas, manzanas, hospitales, lotes de producción) y dentro de cada grupo elegido se observa a todos.

El precio es la precisión. Los alumnos de una misma escuela comparten maestros, colonia y nivel socioeconómico, así que sus calificaciones se parecen. Examinar a 12 alumnos de una escuela da menos información que examinar a 12 alumnos de 12 escuelas distintas, porque muchas respuestas se repiten. En el caso extremo en que todos los alumnos de una escuela tuvieran la misma calificación, tres escuelas valdrían lo mismo que tres alumnos. Por eso la muestra efectiva es más pequeña que el número de alumnos observados.

## Definición

:::definicion[Muestreo por conglomerados en una etapa]
La población se divide en $C$ conglomerados disjuntos; el conglomerado $c$ tiene $M_c$ unidades y total $t_c = \sum_{i \in c} y_i$. Se extrae un muestreo aleatorio simple de $m$ conglomerados y se observan todas sus unidades. La media poblacional se estima con
$$
\hat{\bar{Y}} = \frac{\sum_{c \in \mathcal{S}} t_c}{\sum_{c \in \mathcal{S}} M_c}.
$$
:::

Si todos los conglomerados tienen el mismo tamaño $M$, el estimador es la media de las medias de los conglomerados elegidos, es insesgado y
$$
\operatorname{Var}(\hat{\bar{Y}}) = \left(1 - \frac{m}{C}\right)\frac{S_b^2}{m}, \qquad S_b^2 = \frac{1}{C-1}\sum_{c=1}^{C}\left(\bar{Y}_c - \bar{Y}\right)^2,
$$
donde $\bar{Y}_c = t_c / M$. La comparación con un muestreo aleatorio simple del mismo número de unidades da el efecto de diseño, aproximadamente $1 + (M - 1)\rho$, donde $\rho$ es la correlación intraclase.

:::nota[Qué significa cada símbolo]
- $C$: número de conglomerados en la población; $m$: número de conglomerados sorteados.
- $M_c$: unidades del conglomerado $c$; $M$: tamaño común cuando todos son iguales.
- $t_c$: total de la variable en el conglomerado $c$; $\bar{Y}_c$: su media.
- $\mathcal{S}$: conjunto de conglomerados elegidos.
- $S_b^2$: varianza entre las medias de los conglomerados.
- $\rho$: correlación intraclase, la similitud entre unidades del mismo conglomerado.
:::

## Cómo usar la visualización

Cada rectángulo es una escuela con 12 alumnos y el tono indica la calificación. Al reproducir se sortean 3 escuelas y se examina a todos sus alumnos; el encabezado suma los totales de las escuelas y divide entre los 36 alumnos. El histograma naranja acumula las estimaciones y la línea negra las de 36 alumnos elegidos con muestreo aleatorio simple.

Experimentos sugeridos:

- Observa que el histograma por conglomerados es más ancho y que el efecto de diseño es mayor que 1.
- Sube los conglomerados sorteados a 8 y observa cuánto baja el error estándar.
- Observa la rejilla: dentro de una escuela los tonos se parecen, y de una escuela a otra cambian.

## Ejemplo

Una zona tiene $C = 40$ escuelas de $M = 25$ alumnos y se sortean $m = 4$. Las medias de las escuelas elegidas son 71, 64, 78 y 69 puntos.

1. Estimación: $\hat{\bar{Y}} = (71 + 64 + 78 + 69)/4 = 70.5$ puntos.
2. Varianza entre medias: $s_b^2 = \frac{0.5^2 + 6.5^2 + 7.5^2 + 1.5^2}{3} = 33.7$.
3. Varianza del estimador: $(1 - 4/40)\cdot 33.7/4 = 7.6$; error estándar $2.75$ puntos.
4. Si la desviación estándar entre alumnos es 12 puntos, un muestreo aleatorio simple de los mismos 100 alumnos tendría error estándar $\sqrt{0.9 \cdot 144/100} = 1.14$.
5. El efecto de diseño es $7.6/1.3 \approx 5.8$: las 100 calificaciones valen tanto como unas 17 calificaciones independientes.

:::figura[Una sola muestra de 3 escuelas: los rectángulos resaltados son las escuelas sorteadas y todos sus alumnos entran a la muestra.]{componente="SurveySampler"}
```yaml
diseno: conglomerados
n: 3
repeticiones: 1
poblacion:
  columnas: 24
  filas: 12
  estratos:
    - nombre: Zona escolar
      media: 68
  conglomerado: [4, 3]
  icc: 0.35
  desviacion: 11
  minimo: 0
  decimales: 0
  variable: Calificación de matemáticas
  unidad: puntos
  nombreUnidad: Alumno
  nombreConglomerado: Escuela
```
:::

## Propiedades

- **Insesgado con conglomerados de igual tamaño**; con tamaños distintos el estimador de razón tiene un sesgo pequeño que desaparece al aumentar $m$.
- **La precisión depende de cuántos conglomerados se sortean**, no de cuántas unidades se observan. Duplicar el tamaño de cada conglomerado ayuda poco si $\rho$ es alto.
- **Si las unidades se asignaran a los conglomerados al azar** ($\rho = 0$), el diseño sería tan preciso como el muestreo aleatorio simple.
- **Conviene que los conglomerados sean heterogéneos por dentro**, lo contrario de los estratos, que conviene que sean homogéneos.

:::figura[Propiedad con correlación intraclase nula: cajas de tornillos llenadas al azar. Sortear 4 cajas da prácticamente la misma precisión que 48 tornillos sueltos.]{componente="SurveySampler"}
```yaml
diseno: conglomerados
n: 4
comparar: true
repeticiones: 400
poblacion:
  columnas: 24
  filas: 12
  estratos:
    - nombre: Almacén
      media: 25
  conglomerado: [4, 3]
  icc: 0
  desviacion: 0.3
  decimales: 2
  variable: Longitud del tornillo
  unidad: mm
  nombreUnidad: Tornillo
  nombreConglomerado: Caja
```
:::

:::figura[Propiedad del número de conglomerados: el efecto de diseño crece con el tamaño de cada conglomerado y con la correlación intraclase. Mueve M y ρ para ver cuántas observaciones independientes quedan.]{componente="PrecisionPlanner"}
```yaml
modo: deff
m: 12
rho: 0.35
n: 120
nombreConglomerado: Escuela
nombreUnidad: Alumno
```
:::

## Errores comunes

- **Analizar los datos como si fueran un muestreo aleatorio simple.** Calcular el error estándar con $s/\sqrt{n}$ usando las 36 calificaciones subestima la incertidumbre por un factor cercano a $\sqrt{\text{deff}}$.
- **Contar unidades en vez de conglomerados al planear.** Con 3 escuelas el estimador tiene, en esencia, 3 observaciones de la variación entre escuelas, aunque haya 36 alumnos.
- **Confundir conglomerados con estratos.** En los estratos se observan todos los grupos y se sortea dentro; en los conglomerados se sortean grupos y se observa todo dentro.

:::figura[Error de analizar como muestreo aleatorio simple: manzanas de una ciudad con consumo eléctrico muy parecido dentro de cada manzana. El error estándar real es cuatro veces o más el que daría un muestreo aleatorio simple.]{componente="SurveySampler"}
```yaml
diseno: conglomerados
n: 4
comparar: true
repeticiones: 400
poblacion:
  columnas: 24
  filas: 12
  estratos:
    - nombre: Ciudad
      media: 210
  conglomerado: [6, 4]
  icc: 0.6
  desviacion: 45
  minimo: 30
  decimales: 0
  variable: Consumo eléctrico mensual
  unidad: kWh
  nombreUnidad: Vivienda
  nombreConglomerado: Manzana
```
:::

## Conexiones

El muestreo por conglomerados sortea grupos con un [[muestreo-aleatorio-simple]] y se contrasta con el [[muestreo-estratificado]], que observa todos los grupos. Cuando dentro de cada conglomerado se vuelve a sortear, se obtiene el muestreo multietapa. La pérdida de precisión se resume en el efecto de diseño y depende de la correlación intraclase, una forma de [[coeficiente-de-correlacion-de-pearson|correlación]] entre unidades del mismo grupo.

## Formulario

:::formula[Estimador de razón de la media]
$$
\hat{\bar{Y}} = \frac{\sum_{c \in \mathcal{S}} t_c}{\sum_{c \in \mathcal{S}} M_c}
$$

- $t_c$: total del conglomerado $c$; $M_c$: su número de unidades.
- $\mathcal{S}$: conglomerados sorteados.
:::

:::formula[Varianza con conglomerados de igual tamaño]
$$
\operatorname{Var}(\hat{\bar{Y}}) = \left(1 - \frac{m}{C}\right)\frac{S_b^2}{m}
$$

- $m$: conglomerados sorteados; $C$: conglomerados en la población.
- $S_b^2$: varianza entre las medias de los conglomerados.
:::

:::formula[Efecto de diseño aproximado]
$$
\text{deff} \approx 1 + (M - 1)\rho
$$

- $M$: unidades por conglomerado.
- $\rho$: correlación intraclase.
:::
