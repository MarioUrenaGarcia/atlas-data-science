---
id: distribucion-geometrica
titulo: Distribución geométrica
titulo_en: Geometric distribution
alias:
  - geométrica
  - tiempo de espera discreto
  - número de ensayos hasta el primer éxito
modulo: 2
submodulo: '2.1'
orden: 4
nivel: basico
prerrequisitos:
  - distribucion-de-bernoulli
  - serie-geometrica
relaciones:
  - tipo: relacionado
    id: distribucion-binomial
etiquetas:
  - distribución discreta
  - tiempo de espera
  - pérdida de memoria
  - primer éxito
resumen: >
  Cuenta los ensayos de Bernoulli independientes necesarios hasta obtener el primer éxito. Sus
  probabilidades decrecen como una progresión geométrica y no tiene memoria.
formula: 'P(X = k) = (1 - p)^{k - 1} p, \quad k = 1, 2, 3, \dots'
visualizacion:
  componente: DistributionGenesis
  parametros:
    proceso: primer-exito
    valores:
      p: 0.2
    exito: Venta
    fracaso: Rechazo
    conteo: ensayos
referencias:
  - clave: blitzstein-hwang
    capitulo: '4'
  - clave: ross-probabilidad
    capitulo: '4'
publicado: true
---

## Intuición

Un vendedor telefónico cierra una venta en una de cada cinco llamadas, y cada llamada es independiente de las anteriores. ¿Cuántas llamadas hará hasta la primera venta? A veces basta una; otras veces la racha de rechazos se alarga. La distribución geométrica describe ese tiempo de espera medido en ensayos.

Para que la primera venta llegue en la llamada número cuatro tienen que ocurrir tres rechazos seguidos y después una venta. Cada llamada adicional exige un rechazo más, así que las probabilidades se multiplican por la misma fracción en cada paso y forman una progresión geométrica: la llamada uno es el valor más probable y las esperas largas son cada vez menos probables, aunque nunca imposibles.

La propiedad más llamativa es la falta de memoria. Si el vendedor ya lleva diez rechazos, la venta no está "más cerca" que al empezar: las llamadas futuras no saben cuántas fallaron antes. Lo que falta por esperar tiene la misma distribución que la espera completa. Esta es la versión discreta de la distribución exponencial.

## Definición

:::definicion[Distribución geométrica]
En una sucesión de ensayos de Bernoulli independientes con probabilidad de éxito $p \in (0, 1]$, sea $X$ el número de ensayos hasta el primer éxito, incluido. Entonces $X$ tiene **distribución geométrica**, $X \sim \operatorname{Geom}(p)$, con
$$
P(X = k) = (1 - p)^{k - 1} p, \qquad k = 1, 2, 3, \dots
$$
:::

Hay una segunda convención que cuenta los fracasos antes del primer éxito, $Y = X - 1$, con $P(Y = j) = (1 - p)^{j} p$ para $j = 0, 1, 2, \dots$ Ambas son correctas; conviene revisar cuál usa cada texto. La función de distribución de $X$ es
$$
P(X \le k) = 1 - (1 - p)^{k}, \qquad P(X > k) = (1 - p)^{k}.
$$

:::nota[Qué significa cada símbolo]
- $X$: número de ensayos hasta el primer éxito, incluido el éxito.
- $Y = X - 1$: número de fracasos antes del primer éxito.
- $p$: probabilidad de éxito en cada ensayo.
- $1 - p$: probabilidad de fracaso.
- $k$: número de ensayos; $j$: número de fracasos.
- $(1 - p)^{k - 1}$: probabilidad de los $k - 1$ fracasos previos.
- $P(X > k)$: probabilidad de que los primeros $k$ ensayos fracasen.
:::

## Cómo usar la visualización

Cada experimento es una jornada de llamadas: las fichas vacías son rechazos y la ficha rellena es la venta que termina el experimento. El número de llamadas cae en el histograma, que se compara con la función de masa geométrica. El selector "Qué se cuenta" cambia entre las dos convenciones: ensayos totales o solo fracasos.

Con $p = 0.2$ la barra más alta es la de 1 y las demás bajan multiplicándose por 0.8, aunque la media es 5. Al bajar $p$ a 0.05 las esperas se alargan y la cola se extiende. Al cambiar a "Solo los fracasos" todo el histograma se desplaza una unidad a la izquierda sin cambiar de forma.

## Ejemplo

En temporada de lluvias, cada día llueve con probabilidad 0.3, independientemente de los demás. Sea $X$ el número de días, contando desde hoy, hasta el primer día con lluvia, $X \sim \operatorname{Geom}(0.3)$.

1. Que la primera lluvia sea el tercer día: $P(X = 3) = (0.7)^{2}(0.3) = 0.147$.
2. Que llueva en alguno de los tres primeros días: $P(X \le 3) = 1 - (0.7)^{3} = 0.657$.
3. Que pasen más de cinco días sin lluvia: $P(X > 5) = (0.7)^{5} \approx 0.168$.
4. Espera media: $\mathbb{E}[X] = 1/0.3 \approx 3.33$ días, con varianza $0.7/0.09 \approx 7.78$.

:::figura[Geom(0.3): las barras de 1 a 3 suman 0.657. Cada barra es 0.7 veces la anterior.]{componente="DistributionExplorer"}
```yaml
distribucion: geometrica
valores:
  p: 0.3
desde: 1
hasta: 3
muestras: false
```
:::

:::figura[Los días hasta la primera lluvia, simulados día por día. Los días secos son fichas vacías y el día lluvioso cierra el experimento.]{componente="DistributionGenesis"}
```yaml
proceso: primer-exito
valores:
  p: 0.3
exito: Lluvia
fracaso: Seco
conteo: ensayos
```
:::

## Propiedades

- **Media y varianza:** $\mathbb{E}[X] = \dfrac{1}{p}$ y $\operatorname{Var}(X) = \dfrac{1 - p}{p^{2}}$. Para $Y = X - 1$, $\mathbb{E}[Y] = \dfrac{1 - p}{p}$ con la misma varianza.
- **Moda en 1:** la función de masa es decreciente, así que el valor más probable es siempre $k = 1$.
- **Pérdida de memoria:** $P(X > m + n \mid X > m) = P(X > n)$ para enteros $m, n \ge 0$. Es la única distribución en los enteros positivos con esta propiedad.
- **Cola geométrica:** $P(X > k) = (1 - p)^{k}$, que decrece exponencialmente.
- **Mínimo de geométricas:** si $X_1, \dots, X_r$ son independientes con parámetros $p_i$, su mínimo es $\operatorname{Geom}\big(1 - \prod_i (1 - p_i)\big)$.

:::figura[La función de distribución P(X ≤ k) = 1 - 0.7^k sube rápido al principio y se acerca a 1 sin alcanzarlo. El cuantil 0.9 es 7 días.]{componente="DistributionExplorer"}
```yaml
distribucion: geometrica
valores:
  p: 0.3
vista: acumulada
probabilidad: 0.9
muestras: false
```
:::

:::figura[Las dos convenciones. Con "Solo los fracasos", la misma simulación de ventas cuenta los rechazos antes de la venta: el histograma empieza en 0 y su media es (1 - p)/p = 4.]{componente="DistributionGenesis"}
```yaml
proceso: primer-exito
valores:
  p: 0.2
exito: Venta
fracaso: Rechazo
conteo: fracasos
```
:::

:::demostracion
Media: con la serie $\sum_{k \ge 1} k x^{k-1} = \frac{1}{(1 - x)^{2}}$ para $|x| < 1$, $\mathbb{E}[X] = p \sum_{k \ge 1} k (1 - p)^{k - 1} = \frac{p}{p^{2}} = \frac{1}{p}$. Pérdida de memoria: $P(X > m + n \mid X > m) = \frac{(1 - p)^{m + n}}{(1 - p)^{m}} = (1 - p)^{n} = P(X > n)$.
:::

## Errores comunes

- **Creer que tras muchos fracasos el éxito "ya toca".** Por la pérdida de memoria, después de 10 rechazos la probabilidad de vender en la siguiente llamada sigue siendo 0.2 y la espera restante tiene media 5, igual que al empezar. Es la falacia del jugador.
- **Mezclar convenciones.** Si un texto cuenta fracasos y otro ensayos, sus medias difieren en 1: $(1 - p)/p$ frente a $1/p$.
- **Pensar que la espera media es la más probable.** Con $p = 0.2$ la media es 5, pero el valor más probable es 1 y $P(X = 5) \approx 0.08$.
- **Olvidar que la cola es larga.** Con $p = 0.2$, $P(X > 10) = 0.8^{10} \approx 0.107$: una de cada diez jornadas necesita más de diez llamadas.

:::figura[La espera media no es la más probable: en Geom(0.2) la barra más alta es k = 1, con 0.2, mientras que la barra sombreada de la media, k = 5, solo tiene 0.08.]{componente="DistributionExplorer"}
```yaml
distribucion: geometrica
valores:
  p: 0.2
desde: 5
hasta: 5
muestras: false
```
:::

:::figura[La cola larga: la función de distribución de Geom(0.2) alcanza 0.893 en k = 10, así que 0.107 es la probabilidad de necesitar más de diez llamadas. Por la pérdida de memoria, la misma probabilidad vale para diez llamadas adicionales después de cualquier racha de rechazos.]{componente="DistributionExplorer"}
```yaml
distribucion: geometrica
valores:
  p: 0.2
vista: acumulada
probabilidad: 0.893
muestras: false
```
:::

## Conexiones

La geométrica es la espera hasta el primer éxito en ensayos de [[distribucion-de-bernoulli|Bernoulli]], y sus probabilidades forman una [[serie-geometrica]] que suma 1. Esperar hasta el éxito número $r$ lleva a la [[distribucion-binomial-negativa]], que es la suma de $r$ geométricas independientes. Mientras la [[distribucion-binomial]] fija los ensayos y cuenta éxitos, la geométrica fija los éxitos y cuenta ensayos. Si la probabilidad de éxito se elige al azar antes de cada espera, se obtienen mezclas como la [[distribucion-logaritmica]].

## Formulario

:::formula[Función de masa (ensayos)]
$$
P(X = k) = (1 - p)^{k - 1} p, \qquad k = 1, 2, \dots
$$

- $X$: ensayos hasta el primer éxito, incluido.
- $p$: probabilidad de éxito por ensayo.
- $k$: número de ensayos.
:::

:::formula[Función de masa (fracasos)]
$$
P(Y = j) = (1 - p)^{j} p, \qquad j = 0, 1, \dots
$$

- $Y = X - 1$: fracasos antes del primer éxito.
- $j$: número de fracasos.
:::

:::formula[Función de distribución y cola]
$$
P(X \le k) = 1 - (1 - p)^{k}, \qquad P(X > k) = (1 - p)^{k}
$$

- $(1 - p)^{k}$: probabilidad de $k$ fracasos seguidos.
:::

:::formula[Media y varianza]
$$
\mathbb{E}[X] = \frac{1}{p}, \qquad \mathbb{E}[Y] = \frac{1 - p}{p}, \qquad \operatorname{Var}(X) = \operatorname{Var}(Y) = \frac{1 - p}{p^{2}}
$$

- $\mathbb{E}[X]$, $\mathbb{E}[Y]$: esperas medias en cada convención.
- La varianza no cambia al restar 1.
:::

:::formula[Pérdida de memoria]
$$
P(X > m + n \mid X > m) = P(X > n)
$$

- $m$: ensayos ya fracasados.
- $n$: ensayos adicionales.
- $P(\cdot \mid \cdot)$: probabilidad condicional.
:::

:::formula[Mínimo de geométricas independientes]
$$
\min(X_1, \dots, X_r) \sim \operatorname{Geom}\Big(1 - \prod_{i=1}^{r} (1 - p_i)\Big)
$$

- $X_i \sim \operatorname{Geom}(p_i)$: esperas independientes.
- $\prod_i (1 - p_i)$: probabilidad de que en un ensayo fallen todas.
:::
