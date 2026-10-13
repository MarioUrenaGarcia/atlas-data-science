---
id: linealidad-de-la-esperanza
titulo: Linealidad de la esperanza
titulo_en: Linearity of expectation
alias:
  - aditividad de la esperanza
  - esperanza de una suma
modulo: 1
submodulo: '1.3'
orden: 11
nivel: basico
prerrequisitos:
  - esperanza-matematica
relaciones:
  - tipo: relacionado
    id: variables-indicadoras
etiquetas:
  - suma de variables
  - sin independencia
  - método de indicadoras
  - combinación lineal
resumen: >
  La esperanza de una suma es la suma de las esperanzas, y las constantes salen multiplicando. La
  propiedad vale aunque las variables sean dependientes, y permite calcular medias de sumas sin
  conocer su distribución.
formula: '\mathbb{E}[aX + bY + c] = a\,\mathbb{E}[X] + b\,\mathbb{E}[Y] + c'
visualizacion:
  componente: RandomVariableLab
  parametros:
    modo: linealidad
    experimento: dos-dados
    variable: suma
    segunda: maximo
referencias:
  - clave: blitzstein-hwang
    capitulo: '4.2'
  - clave: ross-probabilidad
    capitulo: '7.2'
publicado: true
---

## Intuición

Si un comercio vende en promedio 120 pesos por la mañana y 200 por la tarde, vende en promedio 320 pesos al día. Parece obvio, y lo es: el promedio de una suma es la suma de los promedios. Lo sorprendente es que esto vale **siempre**, aunque las ventas de la mañana y de la tarde estén relacionadas (un día de lluvia baja las dos).

Esta propiedad es una de las herramientas más poderosas de la probabilidad, porque la distribución de una suma suele ser difícil de calcular, mientras que su media es inmediata. La distribución de la suma de 4 dados tiene 21 valores con probabilidades poco obvias, pero su media es simplemente $4 \cdot 3.5 = 14$.

## Definición

:::definicion[Linealidad de la esperanza]
Si $X$ y $Y$ son variables aleatorias con esperanza finita y $a$, $b$, $c$ son constantes,
$$
\mathbb{E}[aX + bY + c] = a\,\mathbb{E}[X] + b\,\mathbb{E}[Y] + c.
$$
Más en general, para $X_1, \dots, X_n$ con esperanza finita,
$$
\mathbb{E}\left[\sum_{i=1}^{n} X_i\right] = \sum_{i=1}^{n} \mathbb{E}[X_i].
$$
:::

No se requiere independencia ni ninguna otra relación entre las variables. La demostración en el caso discreto agrupa la suma $\sum_\omega (X(\omega) + Y(\omega)) P(\{\omega\})$ en dos sumas separadas.

:::figura[Los dos dados por separado: el primero y el segundo tienen media 3.5 cada uno, y la suma de sus promedios se acerca a 7 en cada repetición.]{componente="RandomVariableLab"}
```yaml
modo: linealidad
experimento: dos-dados
variable: primero
segunda: segundo
```
:::

:::nota[Qué significa cada símbolo]
- $X$, $Y$, $X_1, \dots, X_n$: variables aleatorias.
- $a$, $b$, $c$: constantes.
- $\mathbb{E}[\,\cdot\,]$: esperanza.
- $\bar{S}$, $\bar{M}$: promedios observados de la suma y del máximo en la simulación.
- $\bar{X}$: promedio de $X_1, \dots, X_n$.
- $\mathbf{1}_{A_i}$: indicadora del evento $A_i$.
- $T$: suma de cuatro dados del ejemplo.
:::

## Cómo usar la visualización

La suma $S$ y el máximo $M$ de dos dados se calculan con el mismo lanzamiento, así que son fuertemente dependientes: si el máximo es 1, la suma solo puede ser 2. Arriba están las distribuciones de $S$ y de $M$, con medias 7 y 4.47; en medio, la distribución de $S + M$, cuya media marcada es $7 + 4.47 = 11.47$.

La animación lanza los dados repetidamente y abajo traza los promedios acumulados de $S$, de $M$ y de $S + M$. El tercero converge exactamente a la suma de los otros dos, aunque la distribución de $S + M$ no se parece a ninguna de las dos.

## Ejemplo

Se lanzan 4 dados y $T$ es la suma.

1. Por el camino largo habría que calcular la función de masa de $T$, que tiene 21 valores entre 4 y 24, y sumar $t \cdot p(t)$.
2. Con linealidad: $T = X_1 + X_2 + X_3 + X_4$, y cada $\mathbb{E}[X_i] = 3.5$.
3. $\mathbb{E}[T] = 4 \cdot 3.5 = 14$.

El mismo argumento da la media de una binomial: $n$ ensayos con probabilidad $p$ son $n$ indicadoras con media $p$, y la media es $np$.

:::figura[La suma de 4 dados por el camino largo: la animación suma los 21 términos $t \cdot p(t)$ y el punto de equilibrio llega a 14, el mismo valor que da la linealidad en una línea.]{componente="RandomVariableLab"}
```yaml
modo: esperanza
experimento: cuatro-dados
variable: suma
```
:::

## Propiedades

- **Sin independencia:** la linealidad vale para variables arbitrariamente dependientes; es la diferencia clave con la varianza.
- **Constantes:** $\mathbb{E}[aX] = a\,\mathbb{E}[X]$ y $\mathbb{E}[X + c] = \mathbb{E}[X] + c$.
- **Sumas infinitas:** si $X_i \ge 0$, entonces $\mathbb{E}[\sum_{i \ge 1} X_i] = \sum_{i \ge 1} \mathbb{E}[X_i]$, aunque ambos lados sean infinitos.
- **Método de indicadoras:** si $N = \sum_i \mathbf{1}_{A_i}$ cuenta cuántos eventos ocurren, $\mathbb{E}[N] = \sum_i P(A_i)$.

:::figura[El máximo más el mínimo de dos dados es igual a la suma de los dos dados, así que sus medias suman 7: $4.47 + 2.53 = 7$.]{componente="RandomVariableLab"}
```yaml
modo: linealidad
experimento: dos-dados
variable: maximo
segunda: minimo
```
:::

## Errores comunes

- **Exigir independencia.** No hace falta para la media de una suma; sí hace falta, en general, para la varianza de una suma y para la media de un producto.
- **Aplicarla a funciones no lineales.** $\mathbb{E}[X^2] \ne (\mathbb{E}[X])^2$ y $\mathbb{E}[\max(X, Y)] \ne \max(\mathbb{E}[X], \mathbb{E}[Y])$ en general.
- **Aplicarla a productos.** $\mathbb{E}[XY] = \mathbb{E}[X]\,\mathbb{E}[Y]$ solo se garantiza si $X$ y $Y$ son independientes (o, más en general, no correlacionadas).

:::figura[El máximo no es lineal: cada dado tiene media 3.5, pero el máximo de los dos tiene media 4.47, mayor que el máximo de las medias.]{componente="RandomVariableLab"}
```yaml
modo: esperanza
experimento: dos-dados
variable: maximo
```
:::

## Conexiones

La linealidad es la propiedad central de la [[esperanza-matematica]]. Combinada con las [[variables-indicadoras]] da el método de indicadoras, que resuelve el [[problema-del-coleccionista-de-cupones]] y da la media de la [[distribucion-binomial]]. Para funciones no lineales de una variable se necesita la [[ley-del-estadistico-inconsciente]], y la varianza de una suma requiere además conocer la relación entre las variables, como se ve en [[propiedades-de-la-varianza]]. La [[ley-debil-de-los-grandes-numeros]] parte de ella para calcular la media del promedio muestral.

## Formulario

:::formula[Linealidad]
$$
\mathbb{E}[aX + bY + c] = a\,\mathbb{E}[X] + b\,\mathbb{E}[Y] + c
$$

- No requiere independencia.
:::

:::formula[Suma de n variables]
$$
\mathbb{E}\left[\sum_{i=1}^{n} X_i\right] = \sum_{i=1}^{n} \mathbb{E}[X_i]
$$

- Cada $X_i$ con esperanza finita.
:::

:::formula[Método de indicadoras]
$$
\mathbb{E}\left[\sum_{i=1}^{n} \mathbf{1}_{A_i}\right] = \sum_{i=1}^{n} P(A_i)
$$

- Cuenta esperada de eventos que ocurren.
:::

:::formula[Media del promedio]
$$
\mathbb{E}[\bar{X}] = \frac{1}{n} \sum_{i=1}^{n} \mathbb{E}[X_i]
$$

- Si todas tienen media $\mu$, el promedio también.
:::
