---
id: imputacion-multiple
titulo: Imputación múltiple (MICE)
titulo_en: Multiple imputation (MICE)
alias:
  - MICE
  - imputación múltiple por ecuaciones encadenadas
  - especificación completamente condicional
  - multiple imputation by chained equations
modulo: 12
submodulo: '12.2'
orden: 9
nivel: intermedio
prerrequisitos:
  - imputacion-por-k-vecinos-mas-cercanos
  - covarianza-muestral
etiquetas:
  - datos faltantes
  - imputación
  - incertidumbre
  - regresión
resumen: >
  La imputación múltiple crea m tablas completas, cada una con valores imputados distintos tomados de un
  modelo con ruido; MICE las construye imputando una variable a la vez a partir de las demás, en ciclos.
formula: '\tilde{y}^{(t)}_{j,\text{mis}} \sim p\big(y_j \mid \mathbf{y}^{(t)}_{-j}, \tilde{\boldsymbol\theta}_j^{(t)}\big)'
visualizacion:
  componente: DataQualityTable
  parametros:
    modo: mice
    m: 5
    iteraciones: 10
    mecanismo: MAR
    tasa: 0.3
referencias:
  - clave: gelman-bda
  - clave: murphy
publicado: true
---

## Intuición

Cualquier imputación de un solo valor finge saber algo que no se sabe. Si falta el ingreso de una persona de 50 años que gasta 9 mil pesos al mes, un modelo puede predecir 27 mil, pero personas con esa edad y ese gasto ganan entre 21 y 33 mil. Escribir 27 en la tabla borra esa incertidumbre, y todo lo que se calcule después parecerá más preciso de lo que es.

La **imputación múltiple** escribe varias respuestas plausibles en lugar de una: crea $m$ copias completas de la tabla, en cada una el hueco se llena con un valor sorteado de la distribución de valores posibles (27.4 en una, 24.9 en otra, 29.8 en otra). Después se repite el análisis en cada copia y se combinan los resultados; la diferencia entre copias mide cuánto pesa la incertidumbre de los faltantes. **MICE** es la forma más usada de sortear esos valores cuando faltan datos en varias columnas: imputa una variable a partir de las demás con una regresión, luego la siguiente con la tabla actualizada, y repite el ciclo hasta que las imputaciones se estabilizan.

## Definición

:::definicion[Imputación múltiple por ecuaciones encadenadas]
Sean $y_1, \dots, y_p$ las variables de la tabla, algunas con faltantes. Se inicia cada faltante con un valor simple (por ejemplo, la media). En la iteración $t$, para cada variable incompleta $j$:

1. se ajusta un modelo de $y_j$ dadas las demás variables $\mathbf{y}_{-j}^{(t)}$ con las filas donde $y_j$ se observa;
2. se sortean los parámetros $\tilde{\boldsymbol\theta}_j^{(t)}$ de su distribución posterior aproximada;
3. se reemplazan los faltantes de $y_j$ por sorteos $\tilde{y}^{(t)}_{j,\text{mis}} \sim p\big(y_j \mid \mathbf{y}^{(t)}_{-j}, \tilde{\boldsymbol\theta}_j^{(t)}\big)$.

Tras $T$ iteraciones se obtiene una tabla completa. Repetir el proceso con $m$ cadenas independientes produce $m$ tablas imputadas.
:::

Para una variable continua con regresión lineal, el sorteo es $\tilde{y}_i = \tilde\beta_0 + \tilde{\boldsymbol\beta}^\top \mathbf{x}_i + \varepsilon_i$ con $\varepsilon_i \sim \mathcal{N}(0, \tilde\sigma^2)$.

:::nota[Qué significa cada símbolo]
- $y_j$: variable $j$; $\mathbf{y}_{-j}$: todas las demás variables, con sus valores actuales.
- $t$: número de iteración; $T$: total de iteraciones por cadena.
- $\tilde{\boldsymbol\theta}_j^{(t)}$: parámetros sorteados del modelo de $y_j$ (coeficientes y varianza del error).
- $\tilde{y}^{(t)}_{j,\text{mis}}$: valores imputados de $y_j$ en la iteración $t$.
- $p(\cdot \mid \cdot)$: distribución condicional del modelo.
- $\tilde\beta_0$, $\tilde{\boldsymbol\beta}$: intercepto y vector de coeficientes sorteados.
- $\mathbf{x}_i$: valores de las demás variables en la fila $i$.
- $\varepsilon_i$: ruido sorteado con varianza $\tilde\sigma^2$.
- $m$: número de tablas imputadas (cadenas).
:::

## Cómo usar la visualización

La tabla tiene tres variables: edad (completa), ingreso y gasto (con faltantes). Cada color es una cadena de imputación. A la izquierda se traza, iteración por iteración, la media de los ingresos imputados en cada cadena: todas parten de la media observada y se separan hacia valores más plausibles. A la derecha, los puntos de color son los ingresos imputados de cada cadena en la iteración actual, sobre los observados en gris. La lectura "Varianza entre cadenas" mide cuánto difieren las imputaciones.

Experimentos sugeridos: reducir las iteraciones a 2 y observar que las cadenas no se estabilizan; aumentar $m$ y ver la nube de imputaciones distintas para la misma persona.

## Ejemplo

Faltan el ingreso de una persona de 50 años que gasta 9 mil pesos al mes y el gasto de otra persona.

1. **Inicio:** el ingreso faltante se llena con la media observada, 18 mil, y el gasto faltante, con su media.
2. **Ingreso dado edad y gasto:** con las filas que tienen ingreso se ajusta $\text{ingreso} = 2 + 0.3\,\text{edad} + 1.1\,\text{gasto}$, y se sortean coeficientes cercanos a esos y $\tilde\sigma = 3$.
3. **Predicción:** $2 + 0.3(50) + 1.1(9) = 26.9$ mil pesos.
4. **Sorteo:** se suma ruido $\varepsilon \sim \mathcal{N}(0, 3^2)$; si sale $\varepsilon = -1.4$, el ingreso imputado es 25.5.
5. **Gasto dado edad e ingreso:** se repite con el gasto faltante, usando ya el ingreso imputado.
6. Tras 10 iteraciones, la cadena 1 da 25.8, la cadena 2 da 28.3 y la cadena 3 da 23.9: tres versiones plausibles del mismo ingreso.

:::figura[Cinco cadenas de MICE durante 10 iteraciones: las medias de los imputados salen del valor inicial y se mezclan alrededor de un nivel común, con diferencias que reflejan la incertidumbre.]{componente="DataQualityTable"}
```yaml
modo: mice
m: 5
iteraciones: 10
mecanismo: MAR
tasa: 0.3
```
:::

## Propiedades

- **Preserva la variabilidad y la asociación.** Como los imputados incluyen ruido, la dispersión de la columna y su correlación con las demás no se reducen como en la imputación por la media.
- **Las cadenas convergen en pocas iteraciones** cuando las variables están razonablemente relacionadas; las trazas de las medias sirven para comprobarlo.

:::figura[Con solo dos iteraciones se ve el salto inicial desde la media observada, pero no alcanzan para comprobar que las cadenas ya se mezclaron.]{componente="DataQualityTable"}
```yaml
modo: mice
m: 4
iteraciones: 2
mecanismo: MAR
tasa: 0.3
```
:::

- **Es válida bajo MAR** si los modelos condicionales incluyen las variables de las que depende el faltante.
- **La diferencia entre tablas es información, no ruido que haya que eliminar.** Se combina con las [[reglas-de-rubin]] para obtener errores estándar honestos.

:::figura[Con 50 % de faltantes, la nube de imputaciones de las ocho cadenas es amplia: la incertidumbre crece con la proporción de faltantes.]{componente="DataQualityTable"}
```yaml
modo: mice
m: 8
iteraciones: 10
mecanismo: MAR
tasa: 0.5
```
:::

## Errores comunes

- **Promediar las $m$ tablas en una sola.** Una tabla promedio vuelve a ser una imputación única y pierde la incertidumbre; se analizan las $m$ tablas por separado y se combinan los resultados.
- **Imputar sin la variable respuesta.** Si el análisis estudia la relación entre ingreso y gasto, el modelo de imputación del ingreso debe incluir el gasto; omitirlo atenúa esa relación.
- **Sortear solo el ruido.** Si los coeficientes se fijan en su estimación y solo se sortea $\varepsilon$, la incertidumbre de la estimación de los coeficientes se ignora y la variación entre tablas queda subestimada.

## Conexiones

MICE generaliza la [[imputacion-simple]] y la [[imputacion-por-k-vecinos-mas-cercanos]] al sortear varios valores plausibles. Cada ecuación aprovecha la [[covarianza-muestral]] entre la variable incompleta y las demás, y el ruido sorteado sigue una [[distribucion-normal]]. Los resultados de las $m$ tablas se combinan con las [[reglas-de-rubin]], y su validez depende de los [[mecanismos-de-datos-faltantes]]. Repetir el sorteo en ciclos, variable por variable, es la misma idea del muestreo de Gibbs.

## Formulario

:::formula[Paso de MICE para la variable j]
$$
\tilde{y}^{(t)}_{j,\text{mis}} \sim p\big(y_j \mid \mathbf{y}^{(t)}_{-j}, \tilde{\boldsymbol\theta}_j^{(t)}\big)
$$

- $\tilde{y}^{(t)}_{j,\text{mis}}$: imputaciones de la variable $j$ en la iteración $t$.
- $\mathbf{y}^{(t)}_{-j}$: las demás variables con sus valores actuales.
- $\tilde{\boldsymbol\theta}_j^{(t)}$: parámetros sorteados del modelo condicional.
:::

:::formula[Sorteo en una regresión lineal]
$$
\tilde{y}_i = \tilde\beta_0 + \tilde{\boldsymbol\beta}^\top \mathbf{x}_i + \varepsilon_i, \qquad \varepsilon_i \sim \mathcal{N}(0, \tilde\sigma^2)
$$

- $\tilde\beta_0$, $\tilde{\boldsymbol\beta}$: coeficientes sorteados.
- $\mathbf{x}_i$: demás variables de la fila $i$.
- $\tilde\sigma^2$: varianza del error sorteada.
- $\varepsilon_i$: ruido de la imputación.
:::

:::formula[Varianza entre cadenas de la media imputada]
$$
B = \frac{1}{m - 1}\sum_{l=1}^{m} (\bar{y}_l - \bar{\bar{y}})^2
$$

- $m$: número de cadenas.
- $\bar{y}_l$: media de los imputados en la cadena $l$.
- $\bar{\bar{y}}$: promedio de las $m$ medias.
:::
