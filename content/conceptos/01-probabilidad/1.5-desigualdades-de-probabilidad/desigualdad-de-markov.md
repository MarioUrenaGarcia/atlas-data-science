---
id: desigualdad-de-markov
titulo: Desigualdad de Markov
titulo_en: Markov's inequality
alias:
  - cota de Markov
  - desigualdad de primer momento
modulo: 1
submodulo: '1.5'
orden: 1
nivel: intermedio
prerrequisitos:
  - esperanza-matematica
relaciones:
  - tipo: relacionado
    id: desigualdad-de-chebyshev
  - tipo: relacionado
    id: funcion-de-supervivencia
etiquetas:
  - cota de cola
  - variable no negativa
  - primer momento
  - peor caso
resumen: >
  Para una variable no negativa, la probabilidad de alcanzar un valor a es a lo más su media dividida
  entre a. Es la cota más simple de una cola: solo usa la media y vale para cualquier distribución.
formula: 'P(X \ge a) \le \frac{\mathbb{E}[X]}{a}, \qquad X \ge 0,\ a > 0'
visualizacion:
  componente: InequalityBound
  parametros:
    modo: cola
    cota: markov
    distribucion: exponencial
    parametros:
      lambda: 1
    umbral: 3
referencias:
  - clave: blitzstein-hwang
    capitulo: '10.1'
  - clave: ross-probabilidad
    capitulo: '8.2'
publicado: true
---

## Intuición

Si el ingreso promedio de un país es 10 mil pesos al mes, ¿qué fracción de las personas puede ganar 100 mil o más? A lo más una décima parte. Si fueran más, solo ellas ya aportarían más de 10 mil pesos al promedio, y como nadie tiene ingreso negativo, el promedio no podría ser 10 mil. Esa es toda la idea de la **desigualdad de Markov**: una variable no negativa no puede tomar valores grandes con mucha probabilidad sin que su media sea grande.

La cota es burda, porque no usa nada más que la media, pero es universal: vale para ingresos, tiempos de espera, tamaños de archivos o cualquier cantidad no negativa, sin saber nada de su distribución. Además es la pieza con la que se construyen casi todas las demás desigualdades de este submódulo.

## Definición

:::teorema[Desigualdad de Markov]
Si $X \ge 0$ y $a > 0$, entonces
$$
P(X \ge a) \le \frac{\mathbb{E}[X]}{a}.
$$
:::

La prueba es una línea: como $X \ge a\,\mathbf{1}\{X \ge a\}$, tomando esperanzas $\mathbb{E}[X] \ge a\,P(X \ge a)$. La cota solo informa algo cuando $a > \mathbb{E}[X]$; para umbrales menores que la media da un número mayor que 1.

:::figura[Una variable de Poisson con media 2: la probabilidad de llegar a 6 o más es cerca de 0.017, y la cota de Markov da $2/6 \approx 0.33$, veinte veces más.]{componente="InequalityBound"}
```yaml
modo: cola
cota: markov
distribucion: poisson
parametros:
  lambda: 2
umbral: 6
```
:::

:::nota[Qué significa cada símbolo]
- $X$: variable aleatoria no negativa.
- $a$: umbral positivo.
- $\mathbb{E}[X]$: media de $X$.
- $\mathbf{1}\{X \ge a\}$: indicadora del evento $X \ge a$.
- $g$: función creciente y no negativa.
- $\mu$: media de $X$; $k$: orden de un momento; $t$: parámetro real de $e^{tx}$.
- $T$: tiempo de respuesta del ejemplo, en segundos.
:::

## Cómo usar la visualización

Arriba está la densidad exponencial con media 1 y la cola $X \ge a$ sombreada. Abajo, la probabilidad exacta de esa cola, $e^{-a}$, y la cota de Markov, $1/a$, como funciones del umbral. El encabezado compara los dos números en el umbral actual.

La deslizadera mueve el umbral. La cota siempre queda por encima, pero la distancia crece muy rápido: en $a = 3$ la cola exacta es 0.05 y la cota 0.33; en $a = 8$, 0.0003 contra 0.125. Markov solo sabe que la media es 1, y debe cubrir distribuciones con colas mucho más pesadas que la exponencial.

## Ejemplo

El tiempo de respuesta $T$ de un servidor tiene media de 0.2 segundos y no se sabe nada más de su distribución.

1. $P(T \ge 1) \le 0.2 / 1 = 0.2$: a lo más el 20 % de las respuestas tarda un segundo o más.
2. $P(T \ge 4) \le 0.2 / 4 = 0.05$.
3. Para garantizar que a lo más el 1 % de las respuestas supere un umbral, basta tomar $a = 0.2 / 0.01 = 20$ segundos.

La garantía es débil pero no supone nada sobre la forma de la distribución.

:::figura[Una distribución compatible con el ejemplo del servidor: si $T$ fuera exponencial con media 0.2, $P(T \ge 1) = e^{-5} \approx 0.0067$, muy por debajo de la garantía 0.2 de Markov, que tiene que valer para cualquier distribución con esa media. La deslizadera recorre umbrales hasta cerca de 1.4; con $a = 1.2$ la cota vale $0.2/1.2 \approx 0.17$ y la exacta $e^{-6} \approx 0.0025$.]{componente="InequalityBound"}
```yaml
modo: cola
cota: markov
distribucion: exponencial
parametros:
  lambda: 5
umbral: 1
nombre: Tiempo de respuesta
```
:::

## Propiedades

- **Igualdad:** se alcanza con la variable que vale $a$ con probabilidad $\mathbb{E}[X]/a$ y 0 el resto del tiempo; por eso la cota no se puede mejorar usando solo la media.
- **Funciones crecientes:** si $g \ge 0$ es creciente, $P(X \ge a) \le \mathbb{E}[g(X)]/g(a)$. Con $g(x) = x^2$ aplicada a $|X - \mu|$ se obtiene la desigualdad de Chebyshev y con $g(x) = e^{tx}$ la cota de Chernoff.
- **Momentos altos:** $P(|X| \ge a) \le \mathbb{E}|X|^k / a^k$, más fuerte para $a$ grande si el momento de orden $k$ existe.
- **Sin signo no hay cota:** si $X$ puede ser negativa, la media no controla la cola.
- **Colas pesadas:** la cota suele quedar más cerca de la probabilidad exacta cuando la cola de la distribución es pesada, porque entonces una parte apreciable de la media proviene de valores grandes, que son justamente los que la cota cuenta.

:::figura[Una cola pesada: con la distribución de Pareto de índice 1.5 y media 3, en $a = 6$ la cota 0.5 es unas 7 veces la probabilidad exacta, 0.068. Con la exponencial de media 1 y el mismo umbral, la cota es unas 67 veces la probabilidad exacta.]{componente="InequalityBound"}
```yaml
modo: cola
cota: markov
distribucion: pareto
parametros:
  xm: 1
  alpha: 1.5
umbral: 6
```
:::

:::figura[Una variable con muy poca dispersión: la gamma con forma 8 y media 8 concentra su masa cerca de la media, y para $a = 16$ la cota $8/16 = 0.5$ está lejísimos de la probabilidad exacta.]{componente="InequalityBound"}
```yaml
modo: cola
cota: markov
distribucion: gamma
parametros:
  alpha: 8
  beta: 1
umbral: 16
```
:::

## Errores comunes

- **Aplicarla a variables que pueden ser negativas.** Con $X$ normal de media 0, la cota diría $P(X \ge 1) \le 0$, lo cual es falso.
- **Esperar una cota ajustada.** Markov da el peor caso compatible con la media; para distribuciones concretas suele exagerar mucho.
- **Usarla con umbrales menores que la media.** La cota supera 1 y no dice nada.

:::figura[Una variable binomial con 10 ensayos y probabilidad 0.3: con el umbral en la media, $a = 3$, la cota vale 1 y no aporta información, aunque la probabilidad exacta es 0.62.]{componente="InequalityBound"}
```yaml
modo: cola
cota: markov
distribucion: binomial
parametros:
  n: 10
  p: 0.3
umbral: 3
```
:::

## Conexiones

La desigualdad de Markov acota la [[funcion-de-supervivencia]] con la [[esperanza-matematica]]. Aplicada a $(X - \mu)^2$ da la [[desigualdad-de-chebyshev]], y aplicada a $e^{tX}$ da la [[cota-de-chernoff]], que usa la [[funcion-generadora-de-momentos]]. Es el punto de partida de la [[ley-debil-de-los-grandes-numeros]] y de la [[convergencia-en-media-cuadratica]].

## Formulario

:::formula[Desigualdad de Markov]
$$
P(X \ge a) \le \frac{\mathbb{E}[X]}{a}
$$

- $X$: variable aleatoria no negativa, $X \ge 0$.
- $a$: umbral positivo, $a > 0$.
- $P(X \ge a)$: probabilidad de que $X$ alcance o supere el umbral.
- $\mathbb{E}[X]$: esperanza o media de $X$.
:::

:::formula[Versión con una función creciente]
$$
P(X \ge a) \le \frac{\mathbb{E}[g(X)]}{g(a)}
$$

- $g$: función creciente y no negativa, con $g(a) > 0$.
- $\mathbb{E}[g(X)]$: esperanza de la variable transformada $g(X)$.
:::

:::formula[Momentos de orden k]
$$
P(|X| \ge a) \le \frac{\mathbb{E}|X|^k}{a^k}
$$

- $|X|$: valor absoluto de $X$, que aquí puede tomar cualquier signo.
- $k > 0$: orden del momento; $\mathbb{E}|X|^k$: momento absoluto de orden $k$, que debe ser finito.
:::
