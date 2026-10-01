---
id: cuarteto-de-anscombe
titulo: Cuarteto de Anscombe
titulo_en: Anscombe's quartet
alias:
  - datos de Anscombe
modulo: 4
submodulo: '4.6'
orden: 21
nivel: basico
prerrequisitos:
  - diagrama-de-dispersion
  - coeficiente-de-correlacion-de-pearson
relaciones:
  - tipo: relacionado
    id: datasaurus-dozen
etiquetas:
  - visualización
  - resúmenes numéricos
  - regresión
  - atípicos
resumen: >
  El cuarteto de Anscombe son cuatro conjuntos de 11 puntos con las mismas medias, varianzas,
  correlación y recta de mínimos cuadrados, pero con diagramas de dispersión completamente distintos.
  Muestra que hay que graficar antes de resumir.
formula: '\bar{x} = 9,\quad s_x^2 = 11,\quad \bar{y} \approx 7.50,\quad s_y^2 \approx 4.12,\quad r \approx 0.816,\quad \hat{y} = 3.00 + 0.500\,x'
visualizacion:
  componente: AnscombeQuartet
  parametros:
    vista: cuarteto
referencias:
  - clave: tufte
  - clave: james-isl
    capitulo: '3'
publicado: true
---

## Intuición

En 1973 el estadístico Francis Anscombe construyó cuatro pequeños conjuntos de datos, de 11 pares cada uno, con una propiedad desconcertante: sus resúmenes numéricos son prácticamente idénticos. Los cuatro tienen la misma media y varianza en $x$, la misma media y varianza en $y$, la misma correlación y la misma recta de regresión. Quien solo mirara una tabla de estadísticos concluiría que son cuatro versiones del mismo fenómeno.

Al graficarlos, la impresión cambia por completo. El primero es una relación lineal con ruido, el caso que todos imaginan. El segundo es una curva perfecta, para la que una recta es el modelo equivocado. El tercero es una recta exacta con un solo punto fuera de lugar que inclina el ajuste. El cuarto no tiene relación alguna: todos los puntos comparten el mismo $x$ salvo uno, que por sí solo fabrica la correlación. El **cuarteto de Anscombe** se volvió el argumento clásico de que los resúmenes no sustituyen a las gráficas.

## Definición

:::definicion[Cuarteto de Anscombe]
El **cuarteto de Anscombe** son cuatro conjuntos $\{(x_i, y_i)\}_{i=1}^{11}$, numerados I, II, III y IV, que cumplen, con dos o tres cifras de precisión,

$$
\bar{x} = 9,\quad s_x^2 = 11,\quad \bar{y} \approx 7.50,\quad s_y^2 \approx 4.12,\quad r \approx 0.816,\quad \hat{y} = 3.00 + 0.500\,x,
$$

y cuyos diagramas de dispersión muestran respectivamente una relación lineal con ruido (I), una relación curva sin ruido (II), una relación lineal exacta con un atípico en $y$ (III) y un $x$ constante con un punto de alta palanca (IV).
:::

:::nota[Qué significa cada símbolo]
- $\bar{x}$, $\bar{y}$: medias de $x$ y de $y$.
- $s_x^2$, $s_y^2$: varianzas muestrales de $x$ y de $y$.
- $r$: coeficiente de correlación de Pearson.
- $\hat{y} = 3.00 + 0.500\,x$: recta de mínimos cuadrados, con ordenada al origen 3.00 y pendiente 0.500.
:::

## Cómo usar la visualización

La vista **Los cuatro conjuntos** empieza con los cuatro paneles vacíos y la tabla de resúmenes: idénticos. Cada paso revela un diagrama; después se dibujan las cuatro rectas de mínimos cuadrados, iguales, y al final los residuos de cada punto.

La vista **Un conjunto y sus residuos** muestra uno solo en grande, con su gráfico de residuos debajo; los puntos se pueden arrastrar en vertical y los estadísticos se recalculan en vivo.

Experimentos sugeridos:

1. Antes de revelar los paneles, imaginar cómo se ven a partir de la tabla; después comparar.
2. En el conjunto III, arrastrar el punto atípico hasta la recta de los demás: la pendiente cambia y la correlación sube casi a 1.
3. En el conjunto IV, bajar el punto aislado de la derecha hasta la altura de los demás: la correlación cae y llega a cambiar de signo.

## Ejemplo

Cálculo de los resúmenes del conjunto I, con $x = 10, 8, 13, 9, 11, 14, 6, 4, 12, 7, 5$ y $y = 8.04, 6.95, 7.58, 8.81, 8.33, 9.96, 7.24, 4.26, 10.84, 4.82, 5.68$:

1. Medias: $\bar{x} = 99/11 = 9$ y $\bar{y} = 82.51/11 \approx 7.501$.
2. Suma de cuadrados de $x$: $S_{xx} = \sum (x_i - \bar{x})^2 = 110$, de modo que $s_x^2 = 110/10 = 11$.
3. Suma de productos: $S_{xy} = \sum (x_i - \bar{x})(y_i - \bar{y}) \approx 55.01$.
4. Pendiente: $b = S_{xy}/S_{xx} \approx 55.01/110 \approx 0.500$; ordenada: $a = \bar{y} - b\,\bar{x} \approx 7.501 - 0.500 \cdot 9 \approx 3.00$.
5. Con $S_{yy} \approx 41.27$, la correlación es $r = S_{xy}/\sqrt{S_{xx} S_{yy}} \approx 55.01/\sqrt{110 \cdot 41.27} \approx 0.816$.

Los otros tres conjuntos dan los mismos números en las cifras mostradas.

:::figura[El conjunto I en detalle: relación lineal con ruido, el único de los cuatro para el que la recta es un buen resumen. Los residuos se reparten sin patrón alrededor de cero.]{componente="AnscombeQuartet"}
```yaml
vista: conjunto
conjunto: 1
```
:::

## Propiedades

**Conjunto II, relación curva.** Los residuos forman una parábola: la recta es el modelo equivocado aunque $r = 0.816$.

:::figura[Conjunto II: los puntos siguen una curva sin ruido y los residuos dibujan una U invertida.]{componente="AnscombeQuartet"}
```yaml
vista: conjunto
conjunto: 2
```
:::

**Conjunto III, atípico.** Diez puntos están exactamente sobre una recta; el undécimo la desvía y reduce la correlación de casi 1 a 0.816.

:::figura[Conjunto III: un solo punto atípico en y inclina la recta. Al arrastrarlo hacia los demás la correlación se acerca a 1.]{componente="AnscombeQuartet"}
```yaml
vista: conjunto
conjunto: 3
```
:::

**Conjunto IV, punto de alta palanca.** Diez puntos tienen $x = 8$; sin el punto en $x = 19$ no podría calcularse ninguna pendiente. Ese único punto determina toda la recta.

:::figura[Conjunto IV: la pendiente depende por completo del punto aislado en x = 19.]{componente="AnscombeQuartet"}
```yaml
vista: conjunto
conjunto: 4
```
:::

## Errores comunes

- **Confiar solo en los resúmenes.** Medias, varianzas y correlación no distinguen entre una recta, una curva, un atípico o un punto aislado.
- **Leer una correlación alta como relación lineal.** $r = 0.816$ aparece en los cuatro conjuntos, y solo en uno la relación es lineal con ruido.
- **Ignorar los residuos.** Un gráfico de residuos con patrón (curva, un punto aislado) indica que el modelo no es adecuado, aunque el ajuste reporte un $R^2$ aceptable.

## Conexiones

El cuarteto se construye sobre el [[diagrama-de-dispersion]] y el [[coeficiente-de-correlacion-de-pearson]], y muestra los límites de la [[covarianza-muestral]] como resumen. El [[datasaurus-dozen]] lleva la misma idea a doce conjuntos con formas arbitrarias. Los conjuntos III y IV ilustran por qué la [[correlacion-de-spearman]], basada en rangos, y los métodos robustos son menos sensibles a un solo punto.

## Formulario

:::formula[Pendiente de mínimos cuadrados]
$$
b = \frac{S_{xy}}{S_{xx}} = \frac{\sum_{i=1}^{n} (x_i - \bar{x})(y_i - \bar{y})}{\sum_{i=1}^{n} (x_i - \bar{x})^2}
$$

- $b$: pendiente de la recta.
- $S_{xy}$: suma de productos de desviaciones; $S_{xx}$: suma de cuadrados de $x$.
- $x_i$, $y_i$: datos; $\bar{x}$, $\bar{y}$: medias; $n$: número de pares.
:::

:::formula[Ordenada al origen]
$$
a = \bar{y} - b\,\bar{x}
$$

- $a$: valor de la recta en $x = 0$; $b$: pendiente; $\bar{x}$, $\bar{y}$: medias.
:::

:::formula[Correlación de Pearson]
$$
r = \frac{S_{xy}}{\sqrt{S_{xx}\,S_{yy}}}
$$

- $S_{yy} = \sum (y_i - \bar{y})^2$: suma de cuadrados de $y$.
- $S_{xy}$, $S_{xx}$: como en la pendiente.
:::

:::formula[Varianza muestral]
$$
s_x^2 = \frac{S_{xx}}{n - 1}
$$

- $s_x^2$: varianza muestral de $x$; $n - 1$: grados de libertad.
:::

:::formula[Residuo]
$$
e_i = y_i - (a + b\,x_i)
$$

- $e_i$: distancia vertical entre el punto $i$ y la recta.
- $a$, $b$: ordenada y pendiente de la recta.
:::
