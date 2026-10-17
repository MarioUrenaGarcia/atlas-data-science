---
id: analisis-exploratorio-de-datos
titulo: Análisis exploratorio de datos (enfoque de Tukey)
titulo_en: Exploratory data analysis
alias:
  - EDA
  - análisis exploratorio
  - exploración de datos
modulo: 4
submodulo: '4.7'
orden: 1
nivel: basico
prerrequisitos:
  - histograma
  - diagrama-de-caja
  - diagrama-de-dispersion
relaciones:
  - tipo: relacionado
    id: perfilado-de-datos
etiquetas:
  - exploración
  - Tukey
  - visualización
  - hipótesis
resumen: >
  El análisis exploratorio de datos examina un conjunto de datos con gráficas y resúmenes simples antes
  de ajustar modelos, para descubrir su estructura, sus errores y las preguntas que vale la pena hacer.
formula: '\text{datos} = \text{ajuste} + \text{residuo}'
visualizacion:
  componente: EdaWorkflow
  parametros:
    modo: recorrido
referencias:
  - clave: tufte
  - clave: james-isl
    capitulo: '2'
publicado: true
---

## Intuición

Una inmobiliaria recibe un archivo con 200 ventas de viviendas: zona, superficie, habitaciones, antigüedad y precio. La tentación es ajustar de inmediato un modelo que prediga el precio. John Tukey, que acuñó la expresión "análisis exploratorio de datos" en los años setenta, propuso lo contrario: primero mirar. Un histograma del precio muestra una cola larga a la derecha; el logaritmo la vuelve simétrica. Un diagrama de dispersión contra la superficie revela dos casas de más de 700 m² con precio común, un error de captura. Colorear por zona muestra tres bandas paralelas. Un recuento de faltantes muestra que la antigüedad casi nunca se registró en el Sur.

Cada gráfica cambia lo que se mira en la siguiente. Ese es el **análisis exploratorio**: un trabajo de detective, con herramientas sencillas y robustas, que busca patrones, anomalías y preguntas antes de confirmar hipótesis con pruebas formales. Tukey lo contrastaba con el análisis confirmatorio, el del juez: ambos son necesarios, pero el detective va primero.

## Definición

:::definicion[Análisis exploratorio de datos]
El **análisis exploratorio de datos** es el examen de un conjunto de datos, sin un modelo fijado de antemano, mediante resúmenes resistentes y gráficas, para:

1. conocer la distribución de cada variable (centro, dispersión, forma, valores raros, faltantes);
2. descubrir relaciones entre variables y estructuras de grupo;
3. detectar errores de captura y problemas de calidad;
4. sugerir transformaciones, modelos e hipótesis que después se comprueban.
:::

Tukey lo resumía con la descomposición
$$
\text{datos} = \text{ajuste} + \text{residuo},
$$
donde el ajuste es la parte que explica una descripción simple (una mediana, una recta, una diferencia entre grupos) y el residuo es lo que queda; el residuo de una etapa se examina en la siguiente.

Principios del enfoque: preferir resúmenes resistentes (mediana, cuartiles) a los sensibles a valores extremos; graficar antes de resumir; transformar cuando la escala oculta la estructura; y tratar los hallazgos como hipótesis, no como conclusiones.

:::nota[Qué significa cada símbolo]
- datos: los valores observados.
- ajuste: la parte de los datos que describe un resumen o modelo simple.
- residuo: la diferencia entre los datos y el ajuste, que se examina en busca de más estructura.
:::

## Cómo usar la visualización

El recorrido avanza por seis pasos sobre las 200 ventas de viviendas. Cada paso dibuja una gráfica distinta, y el encabezado muestra el número que resume el hallazgo: asimetría del precio, correlación con y sin errores, medianas por zona y porcentaje de faltantes.

Experimentos sugeridos:

1. Detenerse en el paso 3 y localizar los dos puntos resaltados: la correlación es apenas 0.27.
2. Avanzar al paso 4: sin esos dos puntos la correlación sube a 0.70.
3. Comparar el paso 5 con el 4: la zona explica buena parte de la dispersión que quedaba.

## Ejemplo

Descomposición en ajuste y residuo con las medianas por zona. Las medianas del precio (millones de pesos) son 2.29 en el Norte, 3.71 en el Centro y 1.51 en el Sur.

1. Una vivienda del Centro que se vendió en 4.20 tiene ajuste 3.71 y residuo $4.20 - 3.71 = 0.49$.
2. Una del Sur que se vendió en 1.30 tiene ajuste 1.51 y residuo $1.30 - 1.51 = -0.21$.
3. Los residuos ya no dependen de la zona; el siguiente paso es graficarlos contra la superficie, donde aparece la relación que quedaba.

:::figura[El paso de las zonas en detalle: precio por zona con cajas y medianas, el ajuste del ejemplo.]{componente="EdaWorkflow"}
```yaml
modo: bivariado
par: zona-precio
```
:::

## Propiedades

- **Iterativo:** cada hallazgo redirige la exploración; no hay una secuencia única.
- **Resistente:** usa estadísticos poco afectados por errores y valores extremos, porque al empezar no se sabe si los hay.
- **Escéptico:** los patrones encontrados son candidatos; se confirman con datos nuevos o con métodos formales.
- **Revela errores antes de modelar:** dos superficies mal capturadas bastan para reducir la correlación de 0.70 a 0.27.

:::figura[Un error de captura cambia todo: precio contra superficie con los dos registros erróneos resaltados.]{componente="EdaWorkflow"}
```yaml
modo: bivariado
par: superficie-precio
```
:::

## Errores comunes

- **Saltar directamente al modelo.** Un modelo ajustado a datos con errores o con la escala equivocada da coeficientes engañosos.
- **Confirmar con los mismos datos que generaron la hipótesis.** Un patrón descubierto explorando parece significativo en esos mismos datos casi siempre; hay que comprobarlo con otros.
- **Eliminar sin investigar.** Un valor raro puede ser un error o el hallazgo más importante; se investiga antes de excluirlo.

:::figura[Corregir no es borrar: con el interruptor de errores de captura se comparan las correlaciones con y sin los dos registros, que se documentan antes de excluirlos.]{componente="EdaWorkflow"}
```yaml
modo: bivariado
par: superficie-precio
excluirErrores: true
escalaLog: true
```
:::

## Conexiones

El análisis exploratorio se organiza por número de variables: [[analisis-univariado]], [[analisis-bivariado]] y [[analisis-multivariado-exploratorio]]. Sus herramientas son el [[histograma]], el [[diagrama-de-caja]], el [[diagrama-de-dispersion]] y los resúmenes resistentes como la [[mediana]] y el [[rango-intercuartilico]]. Incluye el [[perfilado-de-datos]], los [[patrones-de-valores-faltantes]], la detección de atípicos con la [[deteccion-de-valores-atipicos-por-rango-intercuartilico|regla del rango intercuartílico]] y las transformaciones como la [[transformacion-logaritmica-y-de-raiz|logarítmica]].

## Formulario

:::formula[Descomposición de Tukey]
$$
\text{datos} = \text{ajuste} + \text{residuo}
$$

- datos: valores observados.
- ajuste: lo que explica una descripción simple.
- residuo: lo que queda y se examina después.
:::

:::formula[Residuo respecto a la mediana del grupo]
$$
e_i = y_i - \tilde{y}_{g(i)}
$$

- $e_i$: residuo de la observación $i$.
- $y_i$: valor observado.
- $\tilde{y}_{g(i)}$: mediana del grupo $g(i)$ al que pertenece la observación.
:::
