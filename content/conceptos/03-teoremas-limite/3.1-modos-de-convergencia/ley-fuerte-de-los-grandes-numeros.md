---
id: ley-fuerte-de-los-grandes-numeros
titulo: Ley fuerte de los grandes números
titulo_en: Strong law of large numbers
alias:
  - LFGN
  - ley fuerte de Kolmogorov
modulo: 3
submodulo: '3.1'
orden: 7
nivel: avanzado
prerrequisitos:
  - convergencia-casi-segura
  - ley-debil-de-los-grandes-numeros
etiquetas:
  - grandes números
  - convergencia casi segura
  - media muestral
  - trayectorias
resumen: >
  Si las observaciones son independientes, con la misma distribución y media finita μ, la media muestral
  converge a μ con probabilidad 1: casi toda secuencia de promedios termina quedándose cerca de μ para siempre.
formula: 'P\Big(\lim_{n \to \infty} \bar{X}_n = \mu\Big) = 1 \iff \mathbb{E}|X_1| < \infty \text{ y } \mu = \mathbb{E}[X_1]'
visualizacion:
  componente: LargeNumbers
  parametros:
    modo: fuerte
    poblacion: exponencial
    poblaciones:
      - exponencial
      - moneda
      - lluvia
      - uniforme
      - dado
      - pareto
      - cauchy
    epsilon: 0.15
    trayectorias: 60
    horizonte: 3000
    escalaLog: true
referencias:
  - clave: durrett
  - clave: wasserman
  - clave: ross-probabilidad
publicado: true
---

## Intuición

Un servicio meteorológico registra, día tras día durante décadas, si llueve en una ciudad. La frecuencia acumulada de días con lluvia oscila al principio y luego se va asentando cerca de la probabilidad climática de lluvia. La ley débil ya decía que, mirando un día lejano cualquiera, es poco probable que la frecuencia esté lejos de ese valor. La ley fuerte dice algo más: la historia concreta de esta ciudad, como sucesión de frecuencias, converge. A partir de cierto día, que depende de la historia, la frecuencia nunca vuelve a salir de cualquier margen fijado.

La diferencia importa cuando se trabaja con una sola realización larga, que es lo habitual: un solo registro histórico, una sola simulación de Monte Carlo, un solo flujo de transacciones. La ley fuerte garantiza que esa realización, salvo un conjunto de probabilidad cero, entrega la respuesta correcta si se espera lo suficiente. La condición es mínima: que la media exista. No hace falta varianza finita.

## Definición

:::teorema[Ley fuerte de los grandes números (Kolmogorov)]
Sean $X_1, X_2, \dots$ independientes e idénticamente distribuidas. Si $\mathbb{E}|X_1| < \infty$ y $\mu = \mathbb{E}[X_1]$, entonces
$$
\bar{X}_n = \frac{1}{n}\sum_{i=1}^n X_i \xrightarrow{c.s.} \mu, \quad \text{es decir,} \quad P\Big(\lim_{n \to \infty} \bar{X}_n = \mu\Big) = 1.
$$
Recíprocamente, si $\mathbb{E}|X_1| = \infty$, entonces $\bar{X}_n$ no converge a ningún valor finito con probabilidad 1.
:::

Por la caracterización de la convergencia casi segura, el teorema equivale a que para todo $\varepsilon > 0$
$$
\lim_{n \to \infty} P\Big(\sup_{m \ge n} |\bar{X}_m - \mu| > \varepsilon\Big) = 0.
$$

:::nota[Qué significa cada símbolo]
- $X_i$: observación $i$, independientes y con la misma distribución.
- $\mathbb{E}|X_1|$: esperanza del valor absoluto; si es finita, la media $\mu$ existe.
- $\mu = \mathbb{E}[X_1]$: media poblacional.
- $\bar{X}_n$: media muestral de las primeras $n$ observaciones.
- $\xrightarrow{c.s.}$: convergencia casi segura.
- $\sup_{m \ge n}$: peor desviación desde el índice $n$ en adelante.
- $\varepsilon$: tolerancia positiva.
:::

## Cómo usar la visualización

Arriba, cada trayectoria es una media acumulada, con el eje $n$ en escala logarítmica para ver por igual el principio y el final. Las trayectorias que todavía saldrán de la banda $\mu \pm \varepsilon$ después del $n$ actual se resaltan. Abajo hay dos curvas: la fracción fuera de la banda en $n$ (la cantidad de la ley débil) y la fracción que tiene alguna salida posterior (la cantidad de la ley fuerte).

Con la exponencial, la segunda curva siempre está por encima de la primera pero también llega a cero: las trayectorias dejan de salir. Al reducir $\varepsilon$ ambas curvas se desplazan a la derecha. Con la Cauchy ninguna de las dos baja: sin media no hay ley fuerte.

## Ejemplo

En una ciudad llueve cada día con probabilidad $p = 0.3$, de forma independiente. Sea $\bar{X}_n$ la frecuencia de días lluviosos en los primeros $n$ días y $\varepsilon = 0.05$.

1. La desigualdad de Hoeffding para variables en $[0, 1]$ da $P(|\bar{X}_m - p| > \varepsilon) \le 2e^{-2m\varepsilon^2} = 2e^{-0.005\,m}$.
2. La probabilidad de que la frecuencia salga de la banda en algún día $m \ge n$ es a lo más la suma de esas cotas: $\sum_{m \ge n} 2e^{-0.005\,m} = \frac{2e^{-0.005\,n}}{1 - e^{-0.005}}$.
3. Con $n = 1500$ la cota vale 0.222; con $n = 2000$, 0.018; con $n = 3000$, 0.0001.
4. Como la cota tiende a cero, $P(\sup_{m \ge n} |\bar{X}_m - 0.3| > 0.05) \to 0$, que es la convergencia casi segura.
5. Interpretación: con probabilidad mayor que 0.98, después de unos cinco años y medio de registro la frecuencia ya no vuelve a alejarse más de 5 puntos porcentuales de 0.3.

:::figura[El ejemplo de la lluvia: frecuencia de días lluviosos con p = 0.3 y tolerancia 0.05. Las últimas salidas de la banda se concentran antes de unos miles de días, como anticipa la cota de Hoeffding.]{componente="LargeNumbers"}
```yaml
modo: fuerte
poblacion: lluvia
epsilon: 0.05
trayectorias: 60
horizonte: 5000
escalaLog: true
```
:::

## Propiedades

- **Condición necesaria y suficiente:** en el caso independiente e idénticamente distribuido, la media muestral converge casi seguramente si y solo si $\mathbb{E}|X_1| < \infty$.
- **Implica la ley débil:** la convergencia casi segura implica la convergencia en probabilidad.
- **Funciones de la muestra:** para cualquier $g$ con $\mathbb{E}|g(X_1)| < \infty$, $\frac{1}{n}\sum g(X_i) \xrightarrow{c.s.} \mathbb{E}[g(X_1)]$; con $g = \mathbf{1}\{X \le x\}$ se obtiene que la distribución empírica converge en cada punto.
- **Justifica Monte Carlo:** una sola simulación larga estima $\mathbb{E}[g(X)]$ con probabilidad 1.
- **Demostración con cuarto momento:** si $\mathbb{E}[X_1^4] < \infty$, $P(|\bar{X}_n - \mu| > \varepsilon) \le C/(n^2\varepsilon^4)$, una serie convergente, y Borel-Cantelli concluye.

:::figura[Propiedad: con media finita pero varianza infinita la ley fuerte se cumple. Las medias de la Pareto de índice 1.5 convergen a 3, con saltos esporádicos que se vuelven cada vez más pequeños.]{componente="LargeNumbers"}
```yaml
modo: fuerte
poblacion: pareto
epsilon: 0.5
trayectorias: 50
horizonte: 5000
escalaLog: true
```
:::

:::figura[Propiedad: la ley fuerte vista como convergencia casi segura de una sucesión. La proporción de caras converge a 1/2 trayectoria por trayectoria.]{componente="ConvergenceViz"}
```yaml
modo: casi-segura
sucesion: media-moneda
epsilon: 0.05
trayectorias: 100
horizonte: 1000
```
:::

:::demostracion
Con cuarto momento finito y $\mu = 0$: al desarrollar $\mathbb{E}[S_n^4]$ con $S_n = \sum X_i$, los términos con algún índice solitario se anulan, y quedan $n\,\mathbb{E}[X^4] + 3n(n-1)\sigma^4 \le Cn^2$. Por Markov, $P(|\bar{X}_n| > \varepsilon) \le \frac{Cn^2}{n^4\varepsilon^4} = \frac{C}{n^2\varepsilon^4}$, cuya suma es finita. Por el primer lema de Borel-Cantelli, solo ocurren finitas salidas de la banda.
:::

## Errores comunes

- **Pensar que la ley fuerte dice cuándo se estabiliza el promedio.** El índice a partir del cual la trayectoria se queda en la banda es aleatorio; el teorema no da su valor.
- **Confundirla con la ley débil.** La débil habla de un $n$ fijo; la fuerte, del comportamiento de toda la trayectoria.
- **Exigir varianza finita.** Basta con que la media exista.
- **Esperar convergencia sin media.** Con la Cauchy cada trayectoria sigue saltando para siempre.

:::figura[Error común: aplicar la ley fuerte sin media. Las medias acumuladas de datos Cauchy nunca dejan de salir de la banda.]{componente="LargeNumbers"}
```yaml
modo: fuerte
poblacion: cauchy
epsilon: 0.5
trayectorias: 40
horizonte: 5000
escalaLog: true
```
:::

## Conexiones

Refuerza la [[ley-debil-de-los-grandes-numeros]] pasando de [[convergencia-en-probabilidad]] a [[convergencia-casi-segura]]. Su demostración usa los [[lemas-de-borel-cantelli]], y la [[ley-0-1-de-kolmogorov]] explica por qué la convergencia de la media tiene probabilidad 0 o 1. La [[ley-del-logaritmo-iterado]] precisa el tamaño exacto de las oscilaciones que quedan, y el [[teorema-de-glivenko-cantelli]] la extiende a toda la función de distribución.

## Formulario

:::formula[Ley fuerte]
$$
P\Big(\lim_{n \to \infty} \bar{X}_n = \mu\Big) = 1
$$

- $\bar{X}_n$: media de las primeras $n$ observaciones.
- $\mu$: media poblacional, que debe existir.
:::

:::formula[Forma con el supremo]
$$
\lim_{n \to \infty} P\Big(\sup_{m \ge n} |\bar{X}_m - \mu| > \varepsilon\Big) = 0
$$

- $\sup_{m \ge n}$: peor desviación futura.
- $\varepsilon$: tolerancia.
:::

:::formula[Cota de Hoeffding]
$$
P\big(|\bar{X}_m - p| > \varepsilon\big) \le 2e^{-2m\varepsilon^2}
$$

- $\bar{X}_m$: frecuencia en $m$ ensayos con resultados en $\{0, 1\}$.
- $p$: probabilidad de éxito.
- $\varepsilon$: tolerancia.
:::

:::formula[Cota de la desviación futura del ejemplo]
$$
P\Big(\sup_{m \ge n} |\bar{X}_m - p| > \varepsilon\Big) \le \frac{2e^{-2n\varepsilon^2}}{1 - e^{-2\varepsilon^2}}
$$

- Suma geométrica de las cotas de Hoeffding desde $m = n$.
- $n$: primer día considerado.
:::

:::formula[Cota con cuarto momento]
$$
P\big(|\bar{X}_n - \mu| > \varepsilon\big) \le \frac{C}{n^2\varepsilon^4}
$$

- $C$: constante que depende de $\mathbb{E}[X^4]$ y $\sigma^4$.
- La suma sobre $n$ es finita, lo que permite aplicar Borel-Cantelli.
:::
