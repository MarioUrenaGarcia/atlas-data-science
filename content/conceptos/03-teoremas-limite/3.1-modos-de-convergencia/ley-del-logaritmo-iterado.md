---
id: ley-del-logaritmo-iterado
titulo: Ley del logaritmo iterado
titulo_en: Law of the iterated logarithm
alias:
  - ley del logaritmo iterado de Khinchin
  - LIL
modulo: 3
submodulo: '3.1'
orden: 21
nivel: avanzado
prerrequisitos:
  - ley-fuerte-de-los-grandes-numeros
  - teorema-central-del-limite
etiquetas:
  - caminata aleatoria
  - fluctuaciones
  - convergencia casi segura
  - límite superior
resumen: >
  Las sumas de variables independientes con media 0 y varianza σ² oscilan con amplitud exacta
  σ√(2n log log n): el límite superior de Sₙ/√(2n log log n) es σ con probabilidad 1.
formula: '\limsup_{n \to \infty} \frac{S_n}{\sqrt{2n\log\log n}} = \sigma, \qquad \liminf_{n \to \infty} \frac{S_n}{\sqrt{2n\log\log n}} = -\sigma \quad \text{c.s.}'
visualizacion:
  componente: LargeNumbers
  parametros:
    modo: logaritmo-iterado
    trayectorias: 20
    horizonte: 20000
referencias:
  - clave: durrett
publicado: true
---

## Intuición

Un jugador apuesta un peso a rojo o negro en una ruleta sin cero, una y otra vez. Su ganancia neta es una caminata aleatoria. La ley de los grandes números dice que la ganancia por apuesta tiende a cero, y el teorema central del límite, que en un instante dado la ganancia típica es del orden de $\sqrt{n}$. Pero el jugador vive toda la trayectoria, no un instante. ¿Qué tan lejos llegará en sus mejores y peores rachas?

La ley del logaritmo iterado responde con una precisión sorprendente: las mayores excursiones son del orden de $\sqrt{2n\log\log n}$. Es un poco más que $\sqrt{n}$, porque a lo largo de una trayectoria infinita se presentan muchas oportunidades de alcanzar valores poco probables en cualquier instante fijo, pero mucho menos que $n$. Con probabilidad 1 la caminata rebasa infinitas veces cualquier fracción menor que 1 de esa frontera, por arriba y por abajo, y a partir de cierto momento nunca rebasa cualquier múltiplo mayor que 1. El factor $\log\log n$ crece tan despacio que en un millón de apuestas apenas pasa de 2.6.

## Definición

:::teorema[Ley del logaritmo iterado (Hartman-Wintner)]
Sean $X_1, X_2, \dots$ independientes e idénticamente distribuidas con $\mathbb{E}[X_i] = 0$ y $\operatorname{Var}(X_i) = \sigma^2 < \infty$, y $S_n = X_1 + \cdots + X_n$. Entonces, con probabilidad 1,
$$
\limsup_{n \to \infty} \frac{S_n}{\sqrt{2n\log\log n}} = \sigma, \qquad \liminf_{n \to \infty} \frac{S_n}{\sqrt{2n\log\log n}} = -\sigma.
$$
:::

Equivalentemente, para todo $\delta > 0$: casi seguramente $S_n > (1 - \delta)\sigma\sqrt{2n\log\log n}$ para infinitos $n$, y $S_n > (1 + \delta)\sigma\sqrt{2n\log\log n}$ solo para finitos $n$. El conjunto de puntos límite de $S_n/\sqrt{2n\log\log n}$ es todo el intervalo $[-\sigma, \sigma]$.

:::nota[Qué significa cada símbolo]
- $X_i$: incrementos independientes con media 0 y varianza $\sigma^2$.
- $S_n$: suma de los primeros $n$ incrementos, una caminata aleatoria.
- $\log\log n$: logaritmo natural aplicado dos veces; está definido y es positivo para $n \ge 3$.
- $\sqrt{2n\log\log n}$: amplitud de las mayores excursiones.
- $\limsup$, $\liminf$: límites superior e inferior de la sucesión.
- $\delta$: margen positivo arbitrario.
- $\sigma$: desviación estándar de cada incremento.
:::

## Cómo usar la visualización

El panel superior muestra 20 caminatas simples ($\pm 1$, $\sigma = 1$) con el eje $n$ logarítmico, junto con las envolventes $\pm\sqrt{n}$ y $\pm\sqrt{2n\log\log n}$. El inferior divide cada caminata entre $\sqrt{2n\log\log n}$, con líneas en $\pm 1$. El panel reporta cuántas caminatas superan $\sqrt{n}$ y el mayor cociente observado desde $n = 100$.

En cada instante cerca de un tercio de las caminatas están fuera de $\pm\sqrt{n}$, como predice el teorema central del límite, porque $P(|Z| > 1) = 0.32$. Los cocientes normalizados no se asientan en ningún valor: vuelven a acercarse a $\pm 1$ de vez en cuando, y casi nunca los rebasan por mucho. En una simulación finita el mayor cociente puede superar 1, porque la convergencia del límite superior es extremadamente lenta.

## Ejemplo

Un jugador apuesta un peso un millón de veces en un juego justo de rojo o negro: $X_i = \pm 1$ con probabilidad $1/2$ cada uno, $\sigma = 1$.

1. Ley de los grandes números: la ganancia media por apuesta $S_n/n$ tiende a 0.
2. Teorema central del límite: en $n = 10^6$, $S_n \approx \mathcal{N}(0, 10^6)$, con desviación típica $\sqrt{n} = 1000$ pesos.
3. Escala de la ley del logaritmo iterado: $\log(10^6) = 13.82$, $\log 13.82 = 2.63$, y $\sqrt{2 \cdot 10^6 \cdot 2.63} = 2292$ pesos.
4. Interpretación: si el juego continuara indefinidamente, la ganancia acumulada rebasaría infinitas veces el 99 % de la frontera $\sqrt{2n\log\log n}$, que en $n = 10^6$ vale 2292 pesos, y solo finitas veces el 101 %; lo mismo vale para las pérdidas.
5. El cociente entre ambas escalas, $\sqrt{2\log\log n}$, vale 1.97 para $n = 10^3$, 2.29 para $n = 10^6$ y 2.46 para $n = 10^9$: crece sin límite, pero muy despacio.

:::figura[El ejemplo del jugador: veinte caminatas de 100000 apuestas. Las envolventes ±√(2n log log n) acotan las mayores excursiones, mientras que ±√n marca el tamaño típico.]{componente="LargeNumbers"}
```yaml
modo: logaritmo-iterado
trayectorias: 10
horizonte: 100000
```
:::

## Propiedades

- **Entre la ley de los grandes números y el teorema central del límite:** $S_n/n \to 0$ casi seguramente, $S_n/\sqrt{n}$ converge en distribución pero no casi seguramente, y $S_n/\sqrt{2n\log\log n}$ oscila exactamente en $[-\sigma, \sigma]$.
- **Consecuencia:** $S_n/\sqrt{n}$ no converge en probabilidad ni casi seguramente; su límite superior es $+\infty$ con probabilidad 1.
- **Valor constante del límite superior:** por la ley 0-1 de Kolmogorov, el límite superior es una constante; el teorema la identifica como $\sigma$.
- **Movimiento browniano:** $\limsup_{t \to \infty} \frac{B_t}{\sqrt{2t\log\log t}} = 1$ casi seguramente, y una versión local describe las oscilaciones cerca de $t = 0$.
- **Velocidad de la ley fuerte:** $|\bar{X}_n - \mu|$ es del orden de $\sigma\sqrt{2\log\log n / n}$ infinitas veces.

:::figura[Propiedad: la escala de la ley de los grandes números es demasiado grande. Las medias acumuladas de la moneda, que son Sₙ/n, convergen; la información sobre las oscilaciones se pierde al dividir entre n.]{componente="LargeNumbers"}
```yaml
modo: fuerte
poblacion: moneda
epsilon: 0.02
trayectorias: 40
horizonte: 5000
escalaLog: true
```
:::

## Errores comunes

- **Confundir el tamaño típico con el tamaño máximo.** En un instante fijo $S_n$ es del orden de $\sqrt{n}$; a lo largo del tiempo alcanza infinitas veces el orden $\sqrt{2n\log\log n}$.
- **Esperar verlo claramente en una simulación.** El factor $\log\log n$ cambia muy poco; con horizontes finitos los cocientes pueden superar 1 o quedarse lejos de él.
- **Pensar que el cociente normalizado converge.** No converge: su conjunto de puntos límite es todo $[-\sigma, \sigma]$.
- **Aplicarla sin varianza finita.** Con colas pesadas las excursiones son mucho mayores y la escala cambia.

:::figura[Error común: tamaño típico contra tamaño máximo. Con 40 caminatas de 3000 pasos, en cada instante unas dos de cada tres están dentro de ±√n, pero casi todas salen de esa franja en algún momento.]{componente="LargeNumbers"}
```yaml
modo: logaritmo-iterado
trayectorias: 40
horizonte: 3000
```
:::

## Conexiones

Precisa las fluctuaciones que quedan en la [[ley-fuerte-de-los-grandes-numeros]] y muestra que el [[teorema-central-del-limite]], que es una afirmación de [[convergencia-en-distribucion]], no se puede reforzar a [[convergencia-casi-segura]]. Su demostración usa los [[lemas-de-borel-cantelli]] sobre una sucesión geométrica de tiempos, y la [[ley-0-1-de-kolmogorov]] garantiza que el límite superior es constante. Tiene una versión funcional ligada al [[teorema-de-donsker]].

## Formulario

:::formula[Ley del logaritmo iterado]
$$
\limsup_{n \to \infty} \frac{S_n}{\sqrt{2n\log\log n}} = \sigma \quad \text{c.s.}
$$

- $S_n$: suma de $n$ incrementos independientes con media 0.
- $\sigma$: desviación estándar de cada incremento.
- $\log$: logaritmo natural.
:::

:::formula[Límite inferior]
$$
\liminf_{n \to \infty} \frac{S_n}{\sqrt{2n\log\log n}} = -\sigma \quad \text{c.s.}
$$

- $\liminf$: límite inferior de la sucesión.
:::

:::formula[Tres escalas]
$$
\frac{S_n}{n} \xrightarrow{c.s.} 0,\qquad \frac{S_n}{\sqrt{n}} \xrightarrow{d} \mathcal{N}(0, \sigma^2),\qquad \frac{S_n}{\sqrt{2n\log\log n}} \text{ oscila en } [-\sigma, \sigma]
$$

- Ley fuerte, teorema central del límite y ley del logaritmo iterado.
:::

:::formula[Forma con márgenes]
$$
S_n > (1 \pm \delta)\,\sigma\sqrt{2n\log\log n}:\ \text{infinitas veces con } -\delta,\ \text{finitas veces con } +\delta
$$

- $\delta$: margen positivo.
:::
