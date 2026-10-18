---
id: caracteristicas-polinomiales
titulo: Características polinomiales
titulo_en: Polynomial features
alias:
  - expansión polinomial
  - regresión polinomial
  - términos cuadráticos
modulo: 12
submodulo: '12.3'
orden: 14
nivel: basico
prerrequisitos:
  - caracteristicas-de-interaccion
  - combinaciones-con-repeticion
etiquetas:
  - ingeniería de características
  - no linealidad
  - sobreajuste
  - polinomios
resumen: >
  Las características polinomiales agregan potencias y productos de las variables (x al cuadrado, x por z, ...)
  para que un modelo lineal ajuste curvas; su número crece combinatoriamente con el grado y las variables.
formula: '\boldsymbol{\phi}(x) = (1, x, x^2, \dots, x^d)'
visualizacion:
  componente: FeatureEngineeringViz
  parametros:
    modo: polinomial
    grado: 6
    n: 20
referencias:
  - clave: james-isl
  - clave: hastie-esl
publicado: true
---

## Intuición

El consumo eléctrico de una ciudad depende de la temperatura en forma de U: es alto en los días fríos por la calefacción, bajo en los templados y vuelve a subir en los calurosos por el aire acondicionado. Una recta no puede seguir esa forma: cualquier pendiente se equivoca en uno de los dos extremos.

La solución no exige cambiar de modelo. Basta con darle al modelo lineal nuevas columnas: además de la temperatura $x$, su cuadrado $x^2$, y si hace falta $x^3$, $x^4$... El modelo sigue siendo una suma de coeficientes por columnas, pero ahora esa suma es un polinomio en $x$, que puede curvarse. Con grado 2 ya captura la U. Con grados cada vez más altos, el polinomio se dobla tanto como quiera y termina pasando cerca de cada punto de entrenamiento, incluido su ruido: el error en entrenamiento sigue bajando mientras el error con datos nuevos empieza a subir. Además, con varias variables, el número de columnas crece muy rápido porque se agregan también todos los productos entre ellas.

## Definición

:::definicion[Características polinomiales]
Para una variable $x$, la **expansión polinomial** de grado $d$ es

$$
\boldsymbol{\phi}(x) = (1, x, x^2, \dots, x^d),
$$

y el modelo $\hat{y} = \boldsymbol\beta^\top \boldsymbol{\phi}(x) = \sum_{k=0}^{d} \beta_k x^k$ es lineal en los coeficientes. Con $p$ variables, la expansión incluye todos los monomios $x_1^{a_1} \cdots x_p^{a_p}$ con $a_1 + \dots + a_p \le d$, cuyo número, contando la constante, es

$$
\binom{p + d}{d}.
$$
:::

:::nota[Qué significa cada símbolo]
- $x$: variable original.
- $d$: grado máximo de la expansión.
- $\boldsymbol{\phi}(x)$: vector de características polinomiales.
- $\boldsymbol\beta = (\beta_0, \dots, \beta_d)$: coeficientes del modelo lineal.
- $\hat{y}$: predicción.
- $p$: número de variables originales.
- $a_1, \dots, a_p$: exponentes de cada variable en un monomio.
- $\binom{p + d}{d}$: número de monomios de grado a lo más $d$.
:::

## Cómo usar la visualización

Los puntos azules son días de entrenamiento y los grises, días de prueba que el modelo no usa para ajustarse. Al reproducir, el grado sube de uno en uno hasta el máximo elegido y la curva naranja se reajusta. El encabezado lista las columnas del modelo actual. Las lecturas comparan el error en entrenamiento con el error en prueba y muestran cuántas columnas habría con cinco variables y el mismo grado.

Experimentos sugeridos: detenerse en grado 1, 2 y 6 y comparar los errores; reducir los datos de entrenamiento a 10 y subir el grado a 10 para ver la curva oscilar entre los puntos.

## Ejemplo

El consumo verdadero es $y = 50 + 0.15(x - 22)^2$, con $x$ la temperatura máxima.

1. Desarrollando: $y = 0.15x^2 - 6.6x + 122.6$. Con las columnas $(1, x, x^2)$, el modelo lineal puede representarlo exactamente con $\beta = (122.6,\ -6.6,\ 0.15)$.
2. A 10 °C: $0.15(100) - 6.6(10) + 122.6 = 71.6$ kWh. A 22 °C: $50$ kWh. A 34 °C: $71.6$ kWh.
3. Con temperaturas repartidas de manera uniforme entre 10 y 34 °C, la recta de mínimos cuadrados es horizontal, a la altura del consumo promedio, $50 + 0.15 \times 48 = 57.2$ kWh, donde 48 es el promedio de $(x - 22)^2$ en ese intervalo: subestima en 14.4 kWh los extremos y sobrestima en 7.2 kWh el centro.
4. Número de columnas: con $p = 5$ variables y $d = 2$ son $\binom{7}{2} = 21$; con $d = 3$, $\binom{8}{3} = 56$; con $p = 20$ y $d = 3$, $\binom{23}{3} = 1771$.

:::figura[Grado 2: la parábola sigue la forma en U del consumo y el error de prueba es bajo.]{componente="FeatureEngineeringViz"}
```yaml
modo: polinomial
grado: 2
n: 20
```
:::

## Propiedades

- **Mínimos cuadrados sigue sirviendo.** El ajuste es una regresión lineal sobre las columnas $1, x, \dots, x^d$.
- **Con mínimos cuadrados, el error de entrenamiento nunca aumenta con el grado.** Cada grado agrega columnas que el modelo puede usar o ignorar. La visualización añade una penalización mínima para que el ajuste exista aun con más coeficientes que datos, y con ella el error de entrenamiento puede subir unas centésimas entre grados consecutivos.
- **El error de prueba tiene forma de U.** Primero baja al capturar la curvatura y luego sube cuando el polinomio sigue el ruido.

:::figura[Con 10 días de entrenamiento y grado 10, la curva pasa casi por cada punto y oscila entre ellos: el error de entrenamiento es casi cero y el de prueba se dispara.]{componente="FeatureEngineeringViz"}
```yaml
modo: polinomial
grado: 10
n: 10
```
:::

- **Las potencias altas son numéricamente delicadas.** $x^{10}$ con temperaturas de 40 da números enormes; se escala la variable antes de expandirla.

## Errores comunes

- **Elegir el grado por el error de entrenamiento.** Siempre favorece el grado más alto; el grado se elige con datos de validación.
- **Expandir sin escalar.** Las potencias de variables grandes producen columnas de magnitudes muy distintas y matrices mal condicionadas.
- **Extrapolar con polinomios de grado alto.** Fuera del rango de entrenamiento, el polinomio crece sin control; a 50 °C puede predecir consumos absurdos.

:::figura[Error de no tener suficientes datos: con 80 días de entrenamiento, el mismo grado 10 se comporta mucho mejor que con 10, porque hay más puntos que restringen la curva.]{componente="FeatureEngineeringViz"}
```yaml
modo: polinomial
grado: 10
n: 80
```
:::

## Conexiones

Las [[caracteristicas-de-interaccion]] son los términos cruzados de grado dos de esta expansión. El número de monomios es un caso de [[combinaciones-con-repeticion]]. El polinomio de grado $d$ recuerda a la [[serie-de-taylor-y-de-maclaurin]] truncada, y el problema numérico de las potencias altas se relaciona con el [[numero-de-condicion]]. Escalar antes de expandir usa el [[escalamiento-min-max]] o la [[estandarizacion]].

## Formulario

:::formula[Expansión polinomial de una variable]
$$
\boldsymbol{\phi}(x) = (1, x, x^2, \dots, x^d)
$$

- $d$: grado máximo.
:::

:::formula[Modelo polinomial]
$$
\hat{y} = \sum_{k=0}^{d} \beta_k x^k
$$

- $\beta_k$: coeficiente de la potencia $k$.
:::

:::formula[Número de columnas con p variables]
$$
\binom{p + d}{d} = \frac{(p + d)!}{p!\,d!}
$$

- $p$: número de variables; $d$: grado máximo.
- Incluye la columna constante.
:::
