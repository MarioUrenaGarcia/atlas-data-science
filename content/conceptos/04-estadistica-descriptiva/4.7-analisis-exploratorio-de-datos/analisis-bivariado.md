---
id: analisis-bivariado
titulo: Análisis bivariado
titulo_en: Bivariate analysis
alias:
  - exploración de pares de variables
  - análisis de dos variables
modulo: 4
submodulo: '4.7'
orden: 3
nivel: basico
prerrequisitos:
  - analisis-univariado
  - coeficiente-de-correlacion-de-pearson
  - tablas-de-contingencia
relaciones:
  - tipo: relacionado
    id: correlacion-de-spearman
etiquetas:
  - exploración
  - dos variables
  - asociación
  - tipos de variables
resumen: >
  El análisis bivariado estudia la relación entre dos variables con la gráfica y la medida que
  corresponden a sus tipos: dispersión y correlación, cajas por grupo o tabla de contingencia.
formula: 'r = \frac{\sum (x_i - \bar{x})(y_i - \bar{y})}{\sqrt{\sum (x_i - \bar{x})^2 \sum (y_i - \bar{y})^2}},\qquad V = \sqrt{\frac{\chi^2}{n\,(k - 1)}}'
visualizacion:
  componente: EdaWorkflow
  parametros:
    modo: bivariado
    par: superficie-precio
    escalaLog: true
referencias:
  - clave: james-isl
    capitulo: '2'
  - clave: agresti
    capitulo: '2'
publicado: true
---

## Intuición

Después de conocer cada variable por separado, la pregunta natural es cómo se mueven juntas. ¿Las viviendas grandes cuestan más? ¿El precio depende de la zona? ¿Las zonas difieren en número de habitaciones? Cada una de estas preguntas cruza dos variables, pero de tipos distintos, y por eso pide una herramienta distinta.

Dos variables numéricas, como superficie y precio, se ven en un diagrama de dispersión y se resumen con una correlación. Una categórica y una numérica, como zona y precio, se comparan con un diagrama de caja por grupo y sus medianas. Dos categóricas, como zona y habitaciones, se cruzan en una tabla de contingencia con porcentajes por fila. El **análisis bivariado** consiste en elegir el par adecuado de gráfica y medida, y en leer la relación con cuidado: su dirección, su forma, su fuerza y los puntos que no la siguen.

## Definición

:::definicion[Análisis bivariado]
El **análisis bivariado** de dos variables $X$ y $Y$ medidas sobre las mismas $n$ unidades describe su relación según sus tipos:

| Tipos | Gráfica | Medida |
| --- | --- | --- |
| Numérica y numérica | Diagrama de dispersión | Correlación de Pearson $r$ o de Spearman $r_s$ |
| Categórica y numérica | Cajas o puntos por grupo | Diferencias de medianas o medias por grupo |
| Categórica y categórica | Tabla de contingencia, mosaico | Porcentajes por fila, $\chi^2$, V de Cramér |

Solo se usan los pares en que ambas variables están observadas (casos completos para ese par).
:::

La correlación de Pearson mide asociación lineal:
$$
r = \frac{\sum_{i=1}^{n} (x_i - \bar{x})(y_i - \bar{y})}{\sqrt{\sum_{i=1}^{n} (x_i - \bar{x})^2 \sum_{i=1}^{n} (y_i - \bar{y})^2}},
$$
y la V de Cramér mide asociación entre dos categóricas:
$$
V = \sqrt{\frac{\chi^2}{n\,(k - 1)}}.
$$

:::nota[Qué significa cada símbolo]
- $X$, $Y$: las dos variables; $x_i$, $y_i$: sus valores en la unidad $i$; $n$: número de pares completos.
- $\bar{x}$, $\bar{y}$: medias.
- $r$: correlación de Pearson, entre $-1$ y $1$; $r_s$: correlación de Spearman, la de Pearson aplicada a los rangos.
- $\chi^2$: estadístico ji cuadrada de la tabla de contingencia.
- $k$: el menor entre el número de filas y el de columnas de la tabla.
- $V$: V de Cramér, entre 0 y 1.
:::

## Cómo usar la visualización

El selector **Par de variables** ofrece los tres tipos de cruce sobre las ventas de viviendas. Los puntos entran por tandas y el encabezado actualiza la medida que corresponde: $r$ y $r_s$ para dos numéricas, las medianas por zona, o $\chi^2$ y $V$ para la tabla.

Con superficie y precio aparecen dos interruptores: excluir los errores de captura y usar escalas logarítmicas.

Experimentos sugeridos:

1. Con superficie y precio, desactivar las escalas logarítmicas: los dos errores de captura quedan aislados a la derecha.
2. Comparar $r$ y $r_s$ con los errores incluidos: la correlación de Spearman, basada en rangos, se afecta mucho menos.
3. Elegir antigüedad y precio: $r$ es casi cero; la antigüedad no se relaciona con el precio en estos datos.

## Ejemplo

Temperatura máxima (°C) y ventas de helado (piezas) en cinco días: $(18, 120)$, $(22, 150)$, $(25, 180)$, $(28, 210)$ y $(31, 260)$.

1. Medias: $\bar{x} = 24.8$ y $\bar{y} = 184$.
2. Covarianza muestral: $271$; desviaciones: $s_x \approx 5.07$ y $s_y \approx 54.13$.
3. Correlación: $r = 271/(5.07 \cdot 54.13) \approx 0.988$.
4. Los rangos de ambas variables coinciden (el día más caluroso es el de más ventas, y así sucesivamente), de modo que $r_s = 1$.

Para dos categóricas: en 100 estudiantes, 30 de 40 que desayunan aprueban y 15 de 60 que no desayunan aprueban. La tabla da $\chi^2 \approx 24.2$ y $V = \sqrt{24.2/100} \approx 0.49$.

:::figura[Los cinco días del ejemplo: una nube casi recta y creciente, con r cercana a 1.]{componente="ChartGallery"}
```yaml
grafico: dispersion
puntos: [[18, 120], [22, 150], [25, 180], [28, 210], [31, 260]]
ejes:
  x:
    variable: Temperatura máxima
    unidad: °C
  y:
    variable: Ventas de helado
    unidad: piezas
```
:::

## Propiedades

- **El tipo decide la herramienta:** usar una correlación entre una numérica y una categórica codificada con números da un resultado sin sentido.
- **Spearman es más resistente** que Pearson ante atípicos y detecta relaciones monótonas no lineales.
- **Los porcentajes por fila** de una tabla permiten comparar grupos de tamaño distinto.

:::figura[Categórica con numérica: precio por zona con cajas y medianas.]{componente="EdaWorkflow"}
```yaml
modo: bivariado
par: zona-precio
```
:::

:::figura[Categórica con categórica: habitaciones por zona como porcentaje de cada fila, con su V de Cramér.]{componente="EdaWorkflow"}
```yaml
modo: bivariado
par: zona-habitaciones
```
:::

## Errores comunes

- **Una correlación cercana a cero no significa independencia.** Puede haber una relación curva o por grupos que $r$ no detecta.
- **Leer conteos en lugar de porcentajes.** En una tabla con grupos de distinto tamaño, los conteos absolutos engañan; se comparan porcentajes por fila.
- **Olvidar terceras variables.** Una relación bivariada puede deberse a una variable que no está en la gráfica; eso se revisa en el análisis multivariado.

:::figura[Correlación casi nula: antigüedad y precio de las viviendas, sin relación visible.]{componente="EdaWorkflow"}
```yaml
modo: bivariado
par: antiguedad-precio
```
:::

## Conexiones

El análisis bivariado sigue al [[analisis-univariado]] y precede al [[analisis-multivariado-exploratorio]]. Usa el [[diagrama-de-dispersion]], el [[coeficiente-de-correlacion-de-pearson]], la [[correlacion-de-spearman]], las [[tablas-de-contingencia]], la [[v-de-cramer]] y el [[grafico-de-mosaico]]. Recuerda que la [[correlacion-no-implica-causalidad]].

## Formulario

:::formula[Correlación de Pearson]
$$
r = \frac{\sum_{i=1}^{n} (x_i - \bar{x})(y_i - \bar{y})}{\sqrt{\sum_{i=1}^{n} (x_i - \bar{x})^2 \sum_{i=1}^{n} (y_i - \bar{y})^2}}
$$

- $x_i$, $y_i$: valores del par $i$; $\bar{x}$, $\bar{y}$: medias; $n$: número de pares.
:::

:::formula[Correlación de Spearman]
$$
r_s = r\big(\operatorname{rango}(x),\ \operatorname{rango}(y)\big)
$$

- $\operatorname{rango}(x)$: posición de cada valor al ordenar la variable; $r$: correlación de Pearson.
:::

:::formula[V de Cramér]
$$
V = \sqrt{\frac{\chi^2}{n\,(k - 1)}}
$$

- $\chi^2$: estadístico ji cuadrada; $n$: total de observaciones; $k$: menor dimensión de la tabla.
:::

:::formula[Porcentaje por fila]
$$
p_{j \mid i} = \frac{n_{ij}}{n_{i\cdot}}
$$

- $n_{ij}$: conteo de la celda; $n_{i\cdot}$: total de la fila $i$; $p_{j \mid i}$: proporción de la columna $j$ dentro de la fila $i$.
:::
