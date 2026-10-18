---
id: muestreo-con-probabilidad-proporcional-al-tamano
titulo: Muestreo con probabilidad proporcional al tamaño
titulo_en: Probability proportional to size sampling
alias:
  - muestreo PPT
  - PPS
  - estimador de Hansen-Hurwitz
modulo: 5
submodulo: '5.1'
orden: 12
nivel: intermedio
prerrequisitos:
  - muestreo-con-y-sin-reemplazo
relaciones:
  - tipo: relacionado
    id: muestreo-multietapa
etiquetas:
  - variable auxiliar
  - probabilidades desiguales
  - Hansen-Hurwitz
  - encuestas de empresas
resumen: >
  Cada unidad se elige con probabilidad proporcional a una medida de tamaño conocida de antemano, como
  el número de empleados. Si la variable de interés crece con ese tamaño, el estimador es mucho más
  preciso que con probabilidades iguales.
formula: '\hat{\bar{Y}}_{HH} = \frac{1}{N\,n}\sum_{i=1}^{n}\frac{y_i}{p_i}, \qquad p_i = \frac{x_i}{\sum_{j=1}^{N} x_j}'
visualizacion:
  componente: SurveySampler
  parametros:
    diseno: pps
    disenos: [pps, mas]
    n: 20
    comparar: true
    repeticiones: 400
    poblacion:
      columnas: 20
      filas: 12
      estratos:
        - nombre: Parque industrial
          media: 300
      desviacion: 160
      icc: 0
      correlacionTamano: 0.9
      minimo: 10
      decimales: 0
      variable: Gasto en capacitación
      unidad: miles de pesos
      nombreUnidad: Empresa
      nombreTamano: número de empleados
referencias:
  - clave: lohr
    capitulo: '6'
publicado: true
---

## Intuición

Para estimar el gasto promedio en capacitación de las 240 empresas de un parque industrial, una empresa de 2000 empleados pesa mucho más en el total que un taller de cinco. Un muestreo aleatorio simple puede dejar fuera a las grandes por puro azar, y entonces la estimación queda muy baja; en otra muestra salen tres grandes y queda muy alta. Esa variación se debe a que la muestra mezcla al azar unidades de tamaños muy distintos.

El **muestreo con probabilidad proporcional al tamaño** usa una información que ya se tiene antes de muestrear, el número de empleados de cada empresa, y da a cada empresa una probabilidad de salir proporcional a ese número. Las grandes salen con frecuencia, las pequeñas rara vez. Después, para no inflar la estimación, cada empresa elegida se divide entre su probabilidad: una empresa con probabilidad alta representa a pocas, una con probabilidad baja representa a muchas. Si el gasto es más o menos proporcional al tamaño, todos los cocientes gasto entre probabilidad se parecen y la estimación casi no varía de una muestra a otra.

## Definición

:::definicion[Muestreo con probabilidad proporcional al tamaño con reemplazo]
Sea $x_i > 0$ una medida de tamaño conocida para cada unidad de la población, y $p_i = x_i / \sum_{j=1}^{N} x_j$. Se hacen $n$ extracciones independientes; en cada una, la unidad $i$ sale con probabilidad $p_i$. El **estimador de Hansen-Hurwitz** del total y de la media es
$$
\hat{T}_{HH} = \frac{1}{n}\sum_{k=1}^{n}\frac{y_{(k)}}{p_{(k)}}, \qquad \hat{\bar{Y}}_{HH} = \frac{\hat{T}_{HH}}{N},
$$
donde $y_{(k)}$ y $p_{(k)}$ son el valor y la probabilidad de la unidad obtenida en la extracción $k$.
:::

Cada cociente $y_{(k)}/p_{(k)}$ es un estimador insesgado del total $T = \sum_i y_i$, porque $\mathbb{E}[y/p] = \sum_i p_i \frac{y_i}{p_i} = T$. Su varianza es
$$
\operatorname{Var}(\hat{T}_{HH}) = \frac{1}{n}\sum_{i=1}^{N} p_i\left(\frac{y_i}{p_i} - T\right)^2,
$$
que es cero si $y_i$ es exactamente proporcional a $x_i$.

:::nota[Qué significa cada símbolo]
- $x_i$: medida de tamaño de la unidad $i$, conocida antes de muestrear.
- $p_i$: probabilidad de que una extracción elija a la unidad $i$.
- $n$: número de extracciones; $N$: tamaño de la población.
- $y_{(k)}$, $p_{(k)}$: valor y probabilidad de la unidad elegida en la extracción $k$.
- $T$: total de la variable en la población; $\hat{T}_{HH}$: su estimador de Hansen-Hurwitz.
:::

## Cómo usar la visualización

Cada punto es una empresa y su tamaño en la rejilla indica el número de empleados; el tono indica el gasto en capacitación. Al reproducir se hacen 20 extracciones con probabilidad proporcional al tamaño: los puntos grandes salen más a menudo. El encabezado divide cada gasto entre su probabilidad. La línea negra del histograma muestra un muestreo aleatorio simple de 20 empresas.

Experimentos sugeridos:

- Observa que el histograma del diseño proporcional al tamaño es mucho más angosto que el del aleatorio simple.
- Cambia a muestreo aleatorio simple y observa cuántas veces la muestra deja fuera a las empresas grandes.
- Observa en la tabla de datos que algunas empresas grandes salen más de una vez: el diseño es con reemplazo.

## Ejemplo

Un parque tiene 4 empresas con 10, 30, 60 y 100 empleados ($\sum x = 200$) y gastos de 25, 70, 160 y 245 miles de pesos (total $T = 500$). Se hace una sola extracción.

1. Probabilidades: $p = 0.05,\ 0.15,\ 0.30,\ 0.50$.
2. Cocientes $y_i/p_i$: $500,\ 466.7,\ 533.3,\ 490$.
3. Cualquiera que sea la empresa elegida, la estimación del total queda entre 466.7 y 533.3.
4. Varianza: $0.05(0)^2 + 0.15(33.3)^2 + 0.30(33.3)^2 + 0.50(10)^2 = 550$; error estándar $23.5$.
5. Con una sola empresa elegida con probabilidades iguales, el estimador $4\,y$ va de 100 a 980, con error estándar cercano a 339.

:::figura[Una sola muestra de 20 extracciones proporcionales al tamaño: las empresas grandes dominan la muestra y el encabezado las divide entre su probabilidad.]{componente="SurveySampler"}
```yaml
diseno: pps
n: 20
repeticiones: 1
poblacion:
  columnas: 20
  filas: 12
  estratos:
    - nombre: Parque industrial
      media: 300
  desviacion: 160
  icc: 0
  correlacionTamano: 0.9
  minimo: 10
  decimales: 0
  variable: Gasto en capacitación
  unidad: miles de pesos
  nombreUnidad: Empresa
  nombreTamano: número de empleados
```
:::

## Propiedades

- **Insesgado** para el total y la media, con cualquier medida de tamaño positiva.
- **La ganancia depende de la proporcionalidad** entre $y$ y $x$: cuanto más constante es $y_i/x_i$, menor la varianza.
- **Si $y$ no se relaciona con $x$, puede ser peor** que el muestreo aleatorio simple, porque las unidades pequeñas reciben pesos enormes.
- **Es la base del muestreo multietapa autoponderado**: sortear primarias proporcionalmente a su tamaño y tomar el mismo número de unidades en cada una da a todas las unidades finales la misma probabilidad.

:::figura[Propiedad sin relación con el tamaño: si la calificación de satisfacción de los empleados no depende del tamaño de la empresa, el diseño proporcional al tamaño es menos preciso que el aleatorio simple.]{componente="SurveySampler"}
```yaml
diseno: pps
n: 20
comparar: true
repeticiones: 400
poblacion:
  columnas: 20
  filas: 12
  estratos:
    - nombre: Parque industrial
      media: 7.5
  desviacion: 1.2
  icc: 0
  correlacionTamano: 0
  decimales: 1
  variable: Satisfacción promedio de los empleados
  unidad: puntos
  nombreUnidad: Empresa
  nombreTamano: número de empleados
```
:::

## Errores comunes

- **Promediar las $y$ de la muestra sin dividir entre las probabilidades.** La media simple de una muestra proporcional al tamaño sobrerrepresenta a las unidades grandes y sobrestima la media.
- **Usar una medida de tamaño desactualizada o con ceros.** Una unidad con $x_i = 0$ nunca puede salir, aunque hoy tenga actividad, y una medida vieja puede estar poco relacionada con $y$.
- **Elegir la medida de tamaño después de ver los datos.** Las probabilidades deben fijarse antes de muestrear para que el estimador sea insesgado.

:::figura[Error de no dividir entre las probabilidades: las muestras proporcionales al tamaño contienen sobre todo empresas grandes. El estimador correcto (histograma) queda centrado; la media simple de esas mismas muestras estaría muy a la derecha de la línea de la media real.]{componente="SurveySampler"}
```yaml
diseno: pps
n: 30
repeticiones: 400
poblacion:
  columnas: 20
  filas: 12
  estratos:
    - nombre: Región agrícola
      media: 120
  desviacion: 70
  icc: 0
  correlacionTamano: 0.95
  minimo: 5
  decimales: 0
  variable: Producción anual
  unidad: t
  nombreUnidad: Granja
  nombreTamano: hectáreas
```
:::

## Conexiones

El muestreo con probabilidad proporcional al tamaño extiende el [[muestreo-con-y-sin-reemplazo|muestreo con reemplazo]] a probabilidades desiguales. Su versión sin reemplazo y con tamaño fijo se analiza con el estimador de Horvitz-Thompson, que pondera cada unidad por el inverso de su probabilidad de inclusión. Es la forma habitual de sortear unidades primarias en el [[muestreo-multietapa]], y aprovecha la [[coeficiente-de-correlacion-de-pearson|correlación]] entre la variable de interés y una variable auxiliar.

## Formulario

:::formula[Probabilidad de cada extracción]
$$
p_i = \frac{x_i}{\sum_{j=1}^{N} x_j}
$$

- $x_i$: medida de tamaño de la unidad $i$.
:::

:::formula[Estimador de Hansen-Hurwitz]
$$
\hat{T}_{HH} = \frac{1}{n}\sum_{k=1}^{n}\frac{y_{(k)}}{p_{(k)}}, \qquad \hat{\bar{Y}}_{HH} = \frac{\hat{T}_{HH}}{N}
$$

- $n$: número de extracciones; $N$: tamaño de la población.
- $y_{(k)}$, $p_{(k)}$: valor y probabilidad de la unidad de la extracción $k$.
:::

:::formula[Varianza del estimador de Hansen-Hurwitz]
$$
\operatorname{Var}(\hat{T}_{HH}) = \frac{1}{n}\sum_{i=1}^{N} p_i\left(\frac{y_i}{p_i} - T\right)^2
$$

- $T$: total real de la población.
- La varianza es cero si $y_i/p_i$ es igual para todas las unidades.
:::
