---
id: analitica-descriptiva-diagnostica-predictiva-y-prescriptiva
titulo: Analítica descriptiva, diagnóstica, predictiva y prescriptiva
titulo_en: Descriptive, diagnostic, predictive and prescriptive analytics
alias:
  - tipos de analítica
  - niveles de analítica
  - analítica prescriptiva
  - analítica predictiva
modulo: 12
submodulo: '12.1'
orden: 5
nivel: basico
prerrequisitos:
  - de-la-pregunta-de-negocio-a-la-pregunta-analitica
  - correlacion-no-implica-causalidad
  - problema-de-optimizacion
etiquetas:
  - proceso
  - pronóstico
  - optimización
  - tipos de preguntas
resumen: >
  Cuatro tipos de preguntas sobre los mismos datos: qué pasó (descriptiva), por qué pasó (diagnóstica),
  qué pasará (predictiva) y qué conviene hacer (prescriptiva), cada una con métodos y supuestos propios.
formula: 'q^* = \mu + \sigma\,\Phi^{-1}\!\left(\frac{p - c}{p}\right)'
visualizacion:
  componente: DataProjectViz
  parametros:
    modo: analitica
    tipo: descriptiva
referencias:
  - clave: hyndman-fpp
  - clave: kohavi
publicado: true
---

## Intuición

Una tienda vende garrafones de agua y tiene dos años de ventas mensuales. Con los mismos datos pueden hacerse cuatro preguntas muy distintas. ¿Cuánto se vendió y cuál fue el mejor mes? Es un resumen del pasado. ¿Por qué cayeron las ventas en marzo? Exige separar lo que se debe a la temporada, a la tendencia y a que en febrero hubo una promoción. ¿Cuánto se venderá el mes próximo? Requiere un modelo que se pueda proyectar hacia adelante y una medida de su incertidumbre. ¿Cuántos garrafones conviene pedir? Requiere además saber cuánto se gana por venta y cuánto se pierde por cada garrafón que sobra.

Las cuatro preguntas forman una escalera: cada una se apoya en la anterior y agrega supuestos. El resumen del pasado solo supone que los datos son correctos. La explicación supone un modelo de las causas. El pronóstico supone que el patrón continuará. La recomendación supone, además, un objetivo y los costos de equivocarse en cada dirección.

## Definición

:::definicion[Tipos de analítica]
- **Descriptiva:** resume lo ocurrido con estadísticos y gráficas. Pregunta "¿qué pasó?".
- **Diagnóstica:** atribuye un cambio o una diferencia a sus componentes o causas. Pregunta "¿por qué pasó?".
- **Predictiva:** estima valores futuros o no observados, con su incertidumbre. Pregunta "¿qué pasará?".
- **Prescriptiva:** elige la acción que optimiza un objetivo dado un modelo del resultado. Pregunta "¿qué conviene hacer?".
:::

Con un modelo aditivo $\hat{y}_t = \beta_0 + \beta_1 t + S_t + \beta_4\,\text{promo}_t$, el cambio entre dos meses se reparte en

$$
\Delta y = \Delta_{\text{tendencia}} + \Delta_{\text{estacional}} + \Delta_{\text{promoción}} + \Delta_{\text{residuo}} .
$$

Si la demanda del mes siguiente es $D \sim \mathcal{N}(\mu, \sigma^2)$, cada unidad vendida deja $p$ y cada unidad pedida cuesta $c$, la cantidad que maximiza la ganancia esperada es

$$
q^* = \mu + \sigma\,\Phi^{-1}\!\left(\frac{p - c}{p}\right).
$$

:::nota[Qué significa cada símbolo]
- $y_t$: ventas del mes $t$; $\hat{y}_t$, su valor según el modelo.
- $\beta_0$: nivel base; $\beta_1$: cambio por mes (tendencia); $\beta_4$: efecto de una promoción.
- $S_t$: componente estacional, que se repite cada 12 meses.
- $\text{promo}_t$: indicadora de que hubo promoción en el mes $t$.
- $\Delta y$: cambio observado entre dos meses; los cuatro sumandos son los aportes de cada componente.
- $D$: demanda del mes siguiente, con media $\mu$ y desviación estándar $\sigma$.
- $p$: precio de venta por unidad; $c$: costo por unidad pedida; $q$: unidades pedidas.
- $\Phi^{-1}$: función cuantil de la normal estándar.
- $q^*$: pedido que maximiza la ganancia esperada.
:::

## Cómo usar la visualización

Las pestañas muestran los cuatro tipos sobre las mismas ventas. En la descriptiva, los meses aparecen uno por uno y la línea punteada es el promedio. En la diagnóstica, la franja naranja marca la mayor caída mensual y las barras reparten esa caída entre tendencia, estacionalidad, promoción y residuo. En la predictiva, el pronóstico avanza mes por mes con su intervalo de 95 %. En la prescriptiva se dibuja la ganancia esperada para cada cantidad pedida y una línea marca el pedido óptimo.

Experimentos sugeridos: en la pestaña prescriptiva, subir el costo hasta acercarlo al precio y observar que el pedido óptimo baja por debajo de la demanda esperada; bajarlo y ver que el pedido sube por encima de ella.

## Ejemplo

La tienda vendió 140, 152 y 131 garrafones en enero, febrero y marzo; en febrero hubo promoción.

1. **Descriptiva.** Promedio del trimestre: $\bar{y} = (140 + 152 + 131)/3 = 141$.
2. **Diagnóstica.** La caída de febrero a marzo es $\Delta y = 131 - 152 = -21$. Con el modelo ajustado: tendencia $+1.2$, estacionalidad $-9.0$, fin de la promoción $-22.0$ y residuo $-21 - (1.2 - 9.0 - 22.0) = 8.8$. La mayor parte de la caída se debe a que terminó la promoción.
3. **Predictiva.** Para abril el modelo da $\hat{y} = 150$ con $\hat\sigma = 12$; el intervalo de 95 % es $150 \pm 1.96(12) = [126.5,\ 173.5]$.
4. **Prescriptiva.** Con $p = 60$ y $c = 35$ pesos, la razón crítica es $(60 - 35)/60 = 0.4167$ y $\Phi^{-1}(0.4167) = -0.21$. Entonces $q^* = 150 + 12(-0.21) = 147.5$: conviene pedir 147 o 148 garrafones, un poco menos que la demanda esperada porque sobrar cuesta más de lo que se deja de ganar al faltar.

:::figura[La pestaña prescriptiva con precio de 60 y costo de 35 pesos: la ganancia esperada alcanza su máximo un poco por debajo de la demanda esperada.]{componente="DataProjectViz"}
```yaml
modo: analitica
tipo: prescriptiva
precio: 60
costo: 35
```
:::

## Propiedades

- **Cada nivel agrega supuestos.** La descomposición diagnóstica depende de la forma del modelo: con otro modelo, el aporte de la promoción cambia. Un diagnóstico no es una prueba causal salvo que el diseño lo permita.

:::figura[Analítica diagnóstica: la mayor caída mensual se reparte entre tendencia, estacionalidad, el fin de una promoción y un residuo que el modelo no explica.]{componente="DataProjectViz"}
```yaml
modo: analitica
tipo: diagnostica
```
:::

- **Un pronóstico sin incertidumbre está incompleto.** El ancho del intervalo es lo que permite pasar de la predicción a la decisión: con $\sigma = 0$ siempre convendría pedir exactamente $\mu$.

:::figura[Analítica predictiva: el pronóstico de seis meses proyecta tendencia y estacionalidad, y el intervalo de 95 % muestra el margen de error de cada mes.]{componente="DataProjectViz"}
```yaml
modo: analitica
tipo: predictiva
```
:::

- **La decisión óptima depende de los costos, no solo del pronóstico.** Si $p - c > c$, es decir, si ganar una venta vale más que perder un garrafón sobrante, $q^* > \mu$; en el caso contrario, $q^* < \mu$.

:::figura[Con costo de 15 pesos y precio de 60, la razón crítica es 0.75 y el pedido óptimo queda por encima de la demanda esperada.]{componente="DataProjectViz"}
```yaml
modo: analitica
tipo: prescriptiva
precio: 60
costo: 15
```
:::

## Errores comunes

- **Presentar un diagnóstico como causa.** Que las ventas bajen el mes en que termina la promoción es consistente con un efecto de la promoción, pero también con otros cambios simultáneos; la atribución depende del modelo elegido.
- **Pedir lo que dice el pronóstico.** Usar $q = \mu$ ignora la asimetría de los costos: es óptimo solo cuando $p - c = c$.
- **Confundir describir con predecir.** Que el promedio de los últimos meses sea 141 no significa que el próximo mes se venderán 141: la tendencia y la estacionalidad mueven el valor esperado.

:::figura[Error de confundir describir con predecir: el promedio de los meses observados queda lejos de varios meses individuales porque la serie tiene tendencia y temporada.]{componente="DataProjectViz"}
```yaml
modo: analitica
tipo: descriptiva
```
:::

## Conexiones

El tipo de analítica se decide al pasar [[de-la-pregunta-de-negocio-a-la-pregunta-analitica]]. La analítica descriptiva usa los resúmenes de la [[media-aritmetica]] y el [[grafico-de-lineas]]; la diagnóstica debe cuidarse de que la [[correlacion-no-implica-causalidad]]; la prescriptiva es un [[problema-de-optimizacion]] sobre el valor esperado, y el pedido óptimo es un cuantil de la [[distribucion-normal]]. La elección entre acciones con costos asimétricos reaparece en [[metricas-de-negocio-vs-metricas-del-modelo]].

## Formulario

:::formula[Media de las ventas observadas]
$$
\bar{y} = \frac{1}{n}\sum_{t=1}^{n} y_t
$$

- $n$: número de meses observados.
- $y_t$: ventas del mes $t$.
:::

:::formula[Descomposición de un cambio]
$$
\Delta y = \Delta_{\text{tendencia}} + \Delta_{\text{estacional}} + \Delta_{\text{promoción}} + \Delta_{\text{residuo}}
$$

- $\Delta y$: cambio observado entre dos meses.
- $\Delta_{\text{tendencia}} = \beta_1 \Delta t$: aporte de la tendencia.
- $\Delta_{\text{estacional}}$: diferencia del componente estacional $S_t$ entre los dos meses.
- $\Delta_{\text{promoción}} = \beta_4 \Delta\text{promo}$: aporte de iniciar o terminar una promoción.
- $\Delta_{\text{residuo}}$: parte que el modelo no explica.
:::

:::formula[Intervalo de pronóstico aproximado de 95 %]
$$
\hat{y}_{t} \pm 1.96\,\hat{\sigma}
$$

- $\hat{y}_t$: pronóstico del mes $t$.
- $\hat{\sigma}$: desviación estándar estimada de los errores del modelo.
:::

:::formula[Pedido óptimo con demanda normal]
$$
q^* = \mu + \sigma\,\Phi^{-1}\!\left(\frac{p - c}{p}\right)
$$

- $\mu$, $\sigma$: media y desviación estándar de la demanda.
- $p$: precio de venta por unidad; $c$: costo por unidad.
- $(p - c)/p$: razón crítica.
- $\Phi^{-1}$: cuantil de la normal estándar.
:::
