---
id: estandarizacion
titulo: Estandarización
titulo_en: Standardization
alias:
  - escalamiento z
  - z-score scaling
  - normalización por media y desviación estándar
modulo: 12
submodulo: '12.3'
orden: 2
nivel: basico
prerrequisitos:
  - escalamiento-min-max
  - puntuaciones-z-muestrales
etiquetas:
  - escalamiento
  - preprocesamiento
  - puntuación z
  - ingeniería de características
resumen: >
  Estandarizar una variable es restarle su media y dividirla entre su desviación estándar; el resultado
  tiene media 0 y desviación 1 y expresa cada valor en desviaciones estándar respecto al promedio.
formula: 'z = \frac{x - \bar{x}}{s}'
visualizacion:
  componente: FeatureEngineeringViz
  parametros:
    modo: escalamiento
    metodo: estandar
    caso: atletas
referencias:
  - clave: james-isl
  - clave: hastie-esl
publicado: true
---

## Intuición

Un entrenador compara velocistas por su estatura, en centímetros, y por su tiempo en 100 metros, en segundos. Las estaturas varían unos 8 centímetros alrededor del promedio; los tiempos, menos de un segundo. Si se suman diferencias en esas unidades, la estatura decide todo y el tiempo, que es lo que importa en una carrera, casi no cuenta.

**Estandarizar** cambia la pregunta "¿a cuántos centímetros o segundos está del promedio?" por "¿a cuántas desviaciones estándar está?". Una atleta con estatura estandarizada de 1 es una desviación más alta que el promedio del grupo; una con tiempo estandarizado de $-1.2$ es 1.2 desviaciones más rápida. Ambas variables quedan en la misma moneda: media 0 y desviación estándar 1. A diferencia del escalamiento min-max, no depende solo de los dos valores más extremos, sino de todos; y es la escala que esperan muchos métodos que penalizan coeficientes o que miden varianzas, como la regresión con penalización o el análisis de componentes principales.

## Definición

:::definicion[Estandarización]
Para una variable con valores $x_1, \dots, x_n$, media $\bar{x}$ y desviación estándar muestral $s$, la variable **estandarizada** es

$$
z_i = \frac{x_i - \bar{x}}{s}, \qquad i = 1, \dots, n.
$$

Los valores $z_1, \dots, z_n$ tienen media $0$ y desviación estándar $1$. La media y la desviación se estiman con los datos de entrenamiento y se aplican sin cambios a los datos nuevos.
:::

:::nota[Qué significa cada símbolo]
- $x_i$: valor original de la observación $i$.
- $\bar{x} = \frac{1}{n}\sum_i x_i$: media de la variable en entrenamiento.
- $s = \sqrt{\frac{1}{n - 1}\sum_i (x_i - \bar{x})^2}$: desviación estándar muestral.
- $z_i$: valor estandarizado, medido en desviaciones estándar.
- $n$: número de observaciones.
:::

## Cómo usar la visualización

Los diez atletas se dibujan con la misma escala en ambos ejes, así que la distancia que se ve es la distancia euclidiana. El punto rojo es la atleta de consulta y la línea naranja la une con su vecino más cercano. Al reproducir, los puntos pasan de centímetros y segundos a desviaciones estándar. El encabezado muestra la estandarización del tiempo de la primera atleta y las lecturas, la media y la desviación de cada variable.

Experimentos sugeridos: comparar el vecino antes y después; activar el valor extremo y observar que los demás tiempos se juntan: ocupan la misma fracción del rango que con el min-max, porque ambas transformaciones son lineales en cada columna; lo que cambia es su escala frente a la otra variable, y las diferencias de tiempo pesan menos en la distancia.

## Ejemplo

Las diez estaturas tienen media 176.2 cm y desviación estándar 7.93 cm; los tiempos, media 12.19 s y desviación 0.80 s.

1. Atleta 1 (178 cm, 11.2 s): $z_{\text{est}} = (178 - 176.2)/7.93 = 0.23$ y $z_{\text{t}} = (11.2 - 12.19)/0.80 = -1.23$.
2. Atleta 2 (179 cm, 13.4 s): $z_{\text{est}} = 0.35$ y $z_{\text{t}} = 1.51$.
3. Atleta 9 (175 cm, 11.8 s): $z_{\text{est}} = -0.15$ y $z_{\text{t}} = -0.49$.
4. Sin estandarizar, la atleta 2 es la más cercana a la 1: $\sqrt{1^2 + 2.2^2} = 2.42$, frente a $\sqrt{3^2 + 0.6^2} = 3.06$ de la atleta 9.
5. Estandarizado: distancia a la 2, $\sqrt{0.13^2 + 2.74^2} = 2.74$; a la 9, $\sqrt{0.38^2 + 0.75^2} = 0.84$. La vecina más parecida ahora es la 9, de tiempo similar.

:::figura[Los diez atletas del ejemplo: estandarizados, la vecina de la primera atleta es la de tiempo parecido y no la de estatura casi igual.]{componente="FeatureEngineeringViz"}
```yaml
modo: escalamiento
metodo: estandar
caso: atletas
```
:::

## Propiedades

- **Media 0 y desviación 1 en entrenamiento.** Por linealidad, $\bar{z} = 0$ y $s_z = 1$.
- **No cambia la forma.** Si la variable era asimétrica, la estandarizada también lo es; estandarizar no la vuelve normal.
- **Las correlaciones no cambian.** La correlación de Pearson entre dos variables es la covarianza de sus versiones estandarizadas.

:::figura[Clientes con edad e ingreso estandarizados: las dos variables quedan en desviaciones estándar y la vecina de Ana pasa a ser alguien de edad e ingreso parecidos.]{componente="FeatureEngineeringViz"}
```yaml
modo: escalamiento
metodo: estandar
caso: clientes
```
:::

- **Los extremos inflan la desviación.** Con un tiempo de 19.5 s, la desviación sube de 0.80 a 2.33 y el extremo solo queda a 2.85 desviaciones; los demás tiempos se juntan entre $-0.8$ y $0.2$.

:::figura[Con un tiempo extremo de 19.5 segundos, la desviación estándar se triplica y los demás tiempos estandarizados se juntan.]{componente="FeatureEngineeringViz"}
```yaml
modo: escalamiento
metodo: estandar
caso: atletas
atipico: true
```
:::

## Errores comunes

- **Confundir estandarizar con normalizar la distribución.** Restar la media y dividir entre la desviación no corrige la asimetría; para eso se usan transformaciones de potencia.
- **Estandarizar con estadísticos de todos los datos.** La media y la desviación deben calcularse con el entrenamiento para no filtrar información de la prueba.
- **Estandarizar variables indicadoras sin pensarlo.** Una columna 0/1 estandarizada pierde su interpretación directa; muchos prefieren dejarlas en 0 y 1.

:::figura[Error de confundir estandarizar con normalizar la distribución: una transformación lineal de los tiempos, como Box-Cox con lambda igual a 1, cambia la escala pero deja intacta la forma, y la asimetría transformada es igual a la original.]{componente="FeatureTransformViz"}
```yaml
modo: box-cox
lambda: 1
muestra:
  nombre: Tiempos de espera
  valores: [2, 3, 3, 4, 5, 6, 8, 11, 15, 24, 40]
eje:
  variable: Tiempo de espera
  unidad: min
```
:::

## Conexiones

Cada valor estandarizado es una [[puntuaciones-z-muestrales|puntuación z]], calculada con la [[media-aritmetica]] y la [[desviacion-estandar-muestral]]. Es la alternativa al [[escalamiento-min-max]] cuando no hay un rango natural, y el [[escalamiento-robusto]] la sustituye cuando hay extremos. La correlación de Pearson es la [[covarianza-muestral]] de dos variables estandarizadas, y la normal estándar de [[normal-estandar-y-puntuacion-z]] es la versión poblacional de la misma operación.

## Formulario

:::formula[Variable estandarizada]
$$
z_i = \frac{x_i - \bar{x}}{s}
$$

- $x_i$: valor original; $z_i$: valor estandarizado.
- $\bar{x}$: media de entrenamiento; $s$: desviación estándar de entrenamiento.
:::

:::formula[Desviación estándar muestral]
$$
s = \sqrt{\frac{1}{n - 1}\sum_{i=1}^{n} (x_i - \bar{x})^2}
$$

- $n$: número de observaciones.
:::

:::formula[Regreso a unidades originales]
$$
x_i = \bar{x} + s\,z_i
$$

- Sirve para expresar en unidades originales una predicción hecha en la escala estandarizada.
:::
