---
id: reglas-de-rubin
titulo: Reglas de Rubin
titulo_en: Rubin's rules
alias:
  - combinación de imputaciones
  - pooling de imputación múltiple
  - varianza total de imputación múltiple
modulo: 12
submodulo: '12.2'
orden: 10
nivel: avanzado
prerrequisitos:
  - imputacion-multiple
etiquetas:
  - datos faltantes
  - imputación múltiple
  - incertidumbre
  - error estándar
resumen: >
  Las reglas de Rubin combinan los resultados de m tablas imputadas: la estimación es el promedio y su
  varianza total suma la varianza dentro de cada tabla y la varianza entre tablas, inflada por 1 + 1/m.
formula: 'T = \bar{W} + \left(1 + \frac{1}{m}\right) B'
visualizacion:
  componente: DataQualityTable
  parametros:
    modo: rubin
    m: 5
    mecanismo: MAR
    tasa: 0.3
referencias:
  - clave: gelman-bda
publicado: true
---

## Intuición

Después de una imputación múltiple hay $m$ tablas completas y, al repetir el análisis en cada una, $m$ respuestas: cinco estimaciones del ingreso medio, cada una con su error estándar. ¿Cuál se reporta y con qué precisión?

La estimación final es el promedio de las $m$ estimaciones. Su incertidumbre tiene dos fuentes. La primera existiría aunque no faltara nada: cada tabla es una muestra y su estimación tiene un error estándar, cuyo cuadrado promedio es la **varianza dentro**. La segunda se debe a los faltantes: las tablas difieren solo en los valores imputados, y si sus estimaciones discrepan mucho entre sí, es porque los faltantes dejan mucho sin determinar; esa discrepancia es la **varianza entre**. Las reglas de Rubin suman ambas. Si se usara una sola tabla imputada, solo se vería la primera y el intervalo sería engañosamente angosto.

## Definición

:::definicion[Reglas de Rubin]
Sean $\hat{Q}_1, \dots, \hat{Q}_m$ las estimaciones de una cantidad $Q$ en $m$ tablas imputadas y $U_1, \dots, U_m$ sus varianzas (errores estándar al cuadrado). Se definen

$$
\bar{Q} = \frac{1}{m}\sum_{l=1}^{m} \hat{Q}_l, \qquad \bar{W} = \frac{1}{m}\sum_{l=1}^{m} U_l, \qquad B = \frac{1}{m - 1}\sum_{l=1}^{m} \big(\hat{Q}_l - \bar{Q}\big)^2,
$$

y la **varianza total** $T = \bar{W} + \left(1 + \frac{1}{m}\right) B$. El intervalo de confianza es $\bar{Q} \pm t_{\nu,\,0.975}\sqrt{T}$, con grados de libertad

$$
\nu = \frac{m - 1}{\lambda^2}, \qquad \lambda = \frac{(1 + 1/m)\,B}{T}.
$$
:::

:::nota[Qué significa cada símbolo]
- $Q$: cantidad de interés, por ejemplo la media del ingreso.
- $m$: número de tablas imputadas; $l$: índice de cada tabla.
- $\hat{Q}_l$: estimación de $Q$ en la tabla $l$.
- $U_l$: varianza estimada de $\hat{Q}_l$, el cuadrado de su error estándar.
- $\bar{Q}$: estimación combinada.
- $\bar{W}$: varianza dentro, promedio de las $U_l$.
- $B$: varianza entre, dispersión de las $\hat{Q}_l$.
- $1 + 1/m$: corrección por usar un número finito de imputaciones.
- $T$: varianza total de $\bar{Q}$.
- $\lambda$: fracción de la varianza total debida a los faltantes.
- $\nu$: grados de libertad de la distribución $t$ de referencia; $t_{\nu,\,0.975}$ es su cuantil 0.975.
:::

## Cómo usar la visualización

Cada imputación aparece como una línea horizontal: su punto es la estimación de la media del ingreso y la línea, su intervalo de 95 %. La línea gris punteada es la media verdadera, conocida solo porque los datos son simulados. Al terminar aparece el intervalo combinado en naranja, calculado con $T$ y el cuantil de la distribución $t$ con $\nu$ grados de libertad. Las barras de la derecha comparan la varianza dentro, la parte de la varianza entre y la total; el encabezado sigue el cálculo paso a paso.

Experimentos sugeridos: con $m = 2$, el factor $1 + 1/m = 1.5$ pesa más; con $m = 20$, la varianza entre se estima mejor y $\lambda$ se estabiliza.

## Ejemplo

Con $m = 3$ tablas imputadas, la media del ingreso estimada es 18.2, 18.6 y 18.0 mil pesos, con varianzas 0.25, 0.27 y 0.23.

1. $\bar{Q} = (18.2 + 18.6 + 18.0)/3 = 18.267$.
2. $\bar{W} = (0.25 + 0.27 + 0.23)/3 = 0.25$.
3. $B = \frac{(-0.067)^2 + 0.333^2 + (-0.267)^2}{2} = \frac{0.1867}{2} = 0.0933$.
4. $T = 0.25 + \frac{4}{3}(0.0933) = 0.25 + 0.1244 = 0.3744$, así que el error estándar es $\sqrt{0.3744} = 0.612$.
5. $\lambda = 0.1244/0.3744 = 0.332$ y $\nu = 2/0.332^2 = 18.1$, con $t_{18.1,\,0.975} \approx 2.10$.
6. Intervalo: $18.267 \pm 2.10(0.612) = [16.98,\ 19.55]$.

Con solo la primera tabla se habría reportado $18.2 \pm 1.96\sqrt{0.25} = [17.22,\ 19.18]$, un intervalo 24 % más angosto que ignora un tercio de la incertidumbre.

:::figura[Cinco imputaciones y su combinación: el intervalo naranja usa la varianza total y el cuantil t, y es más ancho que el que daría solo la varianza dentro promedio; no necesariamente más ancho que el de cada tabla individual.]{componente="DataQualityTable"}
```yaml
modo: rubin
m: 5
mecanismo: MAR
tasa: 0.3
```
:::

## Propiedades

- **$B$ refleja la información perdida.** Sin faltantes, todas las tablas son iguales, $B = 0$ y $T = \bar{W}$.
- **$T$ nunca es menor que $\bar{W}$, pero puede ser menor que alguna $U_l$.** Si una tabla tiene una varianza dentro mayor que el promedio y $B$ es pequeña, su intervalo individual puede ser más ancho que el combinado.
- **$\lambda$ crece con la proporción de faltantes** y con su dificultad de predecirlos a partir de las otras variables.

:::figura[Con 50 % de ingresos faltantes, las estimaciones de las tablas discrepan más, la varianza entre crece y la fracción por datos faltantes sube.]{componente="DataQualityTable"}
```yaml
modo: rubin
m: 8
mecanismo: MAR
tasa: 0.5
```
:::

- **Pocas imputaciones bastan para la estimación, no siempre para el intervalo.** El factor $1 + 1/m$ y los grados de libertad compensan un $m$ pequeño, pero con $\lambda$ grande conviene usar 20 o más.

:::figura[Con veinte imputaciones, la varianza entre se estima con más estabilidad y el intervalo combinado cambia poco al repetir con otra semilla.]{componente="DataQualityTable"}
```yaml
modo: rubin
m: 20
mecanismo: MAR
tasa: 0.3
```
:::

## Errores comunes

- **Combinar promediando los errores estándar.** El promedio de los $\sqrt{U_l}$ omite la varianza entre; la combinación se hace con varianzas y agregando $B$.
- **Combinar estadísticos que no son aproximadamente normales.** Las reglas suponen que $\hat{Q}_l$ tiene distribución cercana a la normal; correlaciones o razones de momios se transforman primero (por ejemplo, con la transformación z de Fisher o el logaritmo) y se combinan en esa escala.
- **Usar la normal en lugar de la t con pocos grados de libertad.** Con $\nu$ pequeño, el cuantil 1.96 subestima el ancho del intervalo.

:::figura[Error de usar pocas imputaciones con muchos faltantes: con dos tablas y 50 % de faltantes, la varianza entre se estima con solo dos valores y el intervalo combinado es inestable.]{componente="DataQualityTable"}
```yaml
modo: rubin
m: 2
mecanismo: MAR
tasa: 0.5
```
:::

## Conexiones

Las reglas combinan los resultados de la [[imputacion-multiple]]. La varianza entre es una [[varianza-muestral]] de las $m$ estimaciones, y el intervalo usa la [[distribucion-t-de-student]]. La descomposición de la incertidumbre en una parte dentro y otra entre es la misma que aparece en la ley de varianza total; su justificación bayesiana considera los faltantes como parámetros adicionales con distribución posterior. Comparar este intervalo con el de una [[imputacion-simple]] muestra cuánto subestima la incertidumbre una sola imputación.

## Formulario

:::formula[Estimación combinada]
$$
\bar{Q} = \frac{1}{m}\sum_{l=1}^{m} \hat{Q}_l
$$

- $\hat{Q}_l$: estimación en la tabla $l$.
- $m$: número de tablas imputadas.
- $\bar{Q}$: estimación combinada.
:::

:::formula[Varianzas dentro y entre]
$$
\bar{W} = \frac{1}{m}\sum_{l=1}^{m} U_l, \qquad B = \frac{1}{m - 1}\sum_{l=1}^{m} \big(\hat{Q}_l - \bar{Q}\big)^2
$$

- $m$: número de tablas imputadas; $l$: índice de la tabla.
- $U_l$: varianza de la estimación en la tabla $l$.
- $\hat{Q}_l$: estimación en la tabla $l$; $\bar{Q}$: estimación combinada.
- $\bar{W}$: varianza dentro, promedio de las $U_l$.
- $B$: varianza entre, dispersión de las $\hat{Q}_l$.
:::

:::formula[Varianza total]
$$
T = \bar{W} + \left(1 + \frac{1}{m}\right) B
$$

- $T$: varianza total de $\bar{Q}$; $\sqrt{T}$ es su error estándar.
- $\bar{W}$: varianza dentro promedio.
- $B$: varianza entre las estimaciones.
- $m$: número de tablas imputadas; $1 + 1/m$ corrige por usar un número finito de ellas.
:::

:::formula[Grados de libertad y fracción por faltantes]
$$
\lambda = \frac{(1 + 1/m)\,B}{T}, \qquad \nu = \frac{m - 1}{\lambda^2}
$$

- $\lambda$: fracción de $T$ que se debe a los faltantes.
- $B$, $T$: varianza entre y varianza total; $m$: número de tablas.
- $\nu$: grados de libertad para el intervalo $\bar{Q} \pm t_{\nu,\,0.975}\sqrt{T}$.
- $t_{\nu,\,0.975}$: cuantil 0.975 de la distribución $t$ con $\nu$ grados de libertad.
:::
