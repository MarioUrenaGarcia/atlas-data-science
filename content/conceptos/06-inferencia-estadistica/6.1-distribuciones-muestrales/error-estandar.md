---
id: error-estandar
titulo: Error estándar
titulo_en: Standard error
alias:
  - EE
  - SE
  - error típico
modulo: 6
submodulo: '6.1'
orden: 2
nivel: basico
prerrequisitos:
  - distribucion-muestral
  - desviacion-estandar-muestral
etiquetas:
  - inferencia
  - precisión
  - tamaño de muestra
  - variabilidad
resumen: >
  El error estándar es la desviación estándar de la distribución muestral de un estadístico. Para la media
  vale sigma entre raíz de n: mide cuánto varía la media de muestra en muestra y disminuye al crecer la muestra.
formula: '\operatorname{EE}(\bar{X}) = \frac{\sigma}{\sqrt{n}},\qquad \widehat{\operatorname{EE}}(\bar{X}) = \frac{s}{\sqrt{n}}'
visualizacion:
  componente: SamplingLab
  parametros:
    modo: error-estandar
    poblacion: exponencial
    nMaximo: 200
referencias:
  - clave: wasserman
    capitulo: '6'
  - clave: casella-berger
    capitulo: '5'
publicado: true
---

## Intuición

Un laboratorio mide el colesterol de pacientes; entre persona y persona la medición varía con una desviación de unos 30 mg/dL. Si se promedian 9 pacientes, el promedio ya no varía tanto: los valores altos y bajos se compensan. ¿Cuánto varía ese promedio de una muestra de 9 a otra? Esa cantidad es el **error estándar** de la media.

No es la variación de los pacientes, sino la de los promedios. Y tiene una regla sorprendentemente simple: se divide la desviación de los datos entre la raíz cuadrada del tamaño de muestra. Con 9 pacientes, $30/3 = 10$; con 36, $30/6 = 5$. Para reducir el error a la mitad no basta con duplicar la muestra: hay que cuadruplicarla. Por eso las encuestas grandes cuestan tanto y mejoran tan poco a partir de cierto tamaño.

## Definición

:::definicion[Error estándar]
El **error estándar** de un estadístico $T$ es la desviación estándar de su distribución muestral:
$$
\operatorname{EE}(T) = \sqrt{\operatorname{Var}(T)}.
$$
Para la media de $n$ observaciones independientes con varianza $\sigma^2$,
$$
\operatorname{EE}(\bar{X}) = \frac{\sigma}{\sqrt{n}},
$$
y como $\sigma$ suele ser desconocida se estima con
$$
\widehat{\operatorname{EE}}(\bar{X}) = \frac{s}{\sqrt{n}},
$$
donde $s$ es la desviación estándar muestral.
:::

Si se muestrea sin reemplazo de una población finita de $N$ unidades, se multiplica por la corrección $\sqrt{(N - n)/(N - 1)}$, que es casi 1 cuando la muestra es una fracción pequeña de la población.

:::nota[Qué significa cada símbolo]
- $T$: un estadístico; $\operatorname{Var}(T)$: su varianza en el muestreo repetido.
- $\operatorname{EE}$: error estándar; $\widehat{\operatorname{EE}}$: su estimación.
- $\bar{X}$: media muestral; $n$: tamaño de la muestra.
- $\sigma$: desviación estándar de la población; $s$: desviación estándar muestral.
- $N$: tamaño de la población finita.
:::

## Cómo usar la visualización

Para 24 tamaños de muestra entre 1 y 200 se extraen 400 muestras de una población exponencial desplazada, con media 50 y desviación 10, y se calcula la desviación estándar de sus 400 medias. Los puntos aparecen uno por uno sobre la curva $\sigma/\sqrt{n}$; el encabezado compara el valor observado con el teórico.

El selector **Forma de la población** cambia la forma sin cambiar la media ni la desviación.

Experimentos sugeridos:

1. Comparar los puntos de $n = 4$ y $n = 25$: el error pasa de cerca de 5 a cerca de 2.
2. Cambiar la forma de la población: los puntos siguen sobre la misma curva, porque el error estándar de la media solo depende de $\sigma$ y de $n$.
3. Observar que a partir de $n = 100$ la curva casi se aplana: más datos ayudan cada vez menos.

## Ejemplo

Colesterol con $\sigma = 30$ mg/dL.

1. Con $n = 9$: $\operatorname{EE} = 30/\sqrt{9} = 10$ mg/dL.
2. Con $n = 36$: $\operatorname{EE} = 30/6 = 5$ mg/dL, la mitad con cuatro veces más pacientes.
3. Con $n = 100$: $\operatorname{EE} = 3$ mg/dL.
4. Si $\sigma$ no se conoce y una muestra de 36 pacientes da $s = 27$, el error estándar estimado es $27/6 = 4.5$ mg/dL.
5. En una población de $N = 200$ pacientes, con $n = 36$ sin reemplazo, la corrección vale $\sqrt{164/199} \approx 0.908$ y el error baja a $5 \cdot 0.908 \approx 4.54$.

:::figura[El colesterol del ejemplo: población normal con media 200 y desviación 30 mg/dL. En n = 9 el error estándar es 10 mg/dL y en n = 25 es 6; los puntos siguen la curva sigma entre raíz de n.]{componente="SamplingLab"}
```yaml
modo: error-estandar
poblacion: normal
nMaximo: 100
media: 200
desviacion: 30
```
:::

## Propiedades

- **Ley de la raíz cuadrada:** multiplicar $n$ por $k$ divide el error estándar de la media entre $\sqrt{k}$.
- **No depende de la forma de la población** (para la media), solo de $\sigma$ y de $n$; la forma de la distribución muestral sí puede depender de ella.
- **Error estándar de una proporción:** $\sqrt{p(1 - p)/n}$, que es máximo en $p = 0.5$.
- **Base de intervalos y pruebas:** casi todos tienen la forma estimación más o menos un múltiplo del error estándar.

:::figura[Población muy asimétrica (lognormal) con la misma media y desviación: el error estándar de la media sigue la misma curva.]{componente="SamplingLab"}
```yaml
modo: error-estandar
poblacion: lognormal
nMaximo: 150
```
:::

## Errores comunes

- **Confundirlo con la desviación estándar de los datos.** $s$ describe la variación entre individuos; $s/\sqrt{n}$, la de la media. Reportar uno por otro exagera o subestima la precisión.
- **Pensar que duplicar la muestra reduce el error a la mitad.** Lo reduce en un factor $\sqrt{2} \approx 1.41$.
- **Olvidar la independencia.** Con observaciones correlacionadas (mediciones repetidas de la misma persona, conglomerados) el error real es mayor que $s/\sqrt{n}$.

:::figura[Confusión entre desviación y error estándar: la población varía con desviación 1, mientras que las medias de 25 observaciones varían con desviación 0.2, cinco veces menos.]{componente="SamplingSimulator"}
```yaml
poblacion:
  distribucion: normal
  valores:
    mu: 0
    sigma: 1
estadistico: media
n: 25
poblacionEditable: false
```
:::

## Conexiones

El error estándar es la desviación de la [[distribucion-muestral]] y se estima con la [[desviacion-estandar-muestral]]. Para la media da la escala de la [[distribucion-de-la-media-muestral]]; para una proporción, la de la [[distribucion-muestral-de-una-proporcion]]. Al dividir entre él se construyen los [[estadistico-pivote|estadísticos pivote]].

## Formulario

:::formula[Error estándar de un estadístico]
$$
\operatorname{EE}(T) = \sqrt{\operatorname{Var}(T)}
$$

- $T$: estadístico; $\operatorname{Var}(T)$: su varianza en el muestreo repetido.
:::

:::formula[Error estándar de la media]
$$
\operatorname{EE}(\bar{X}) = \frac{\sigma}{\sqrt{n}},\qquad \widehat{\operatorname{EE}}(\bar{X}) = \frac{s}{\sqrt{n}}
$$

- $\sigma$: desviación de la población; $s$: desviación muestral; $n$: tamaño de muestra.
:::

:::formula[Corrección por población finita]
$$
\operatorname{EE}(\bar{X}) = \frac{\sigma}{\sqrt{n}}\sqrt{\frac{N - n}{N - 1}}
$$

- $N$: tamaño de la población; $n$: tamaño de la muestra, tomada sin reemplazo.
:::

:::formula[Error estándar de una proporción]
$$
\operatorname{EE}(\hat{p}) = \sqrt{\frac{p(1 - p)}{n}}
$$

- $p$: proporción de la población; $\hat{p}$: proporción muestral; $n$: tamaño de muestra.
:::
