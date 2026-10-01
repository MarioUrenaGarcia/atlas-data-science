---
id: lemas-de-borel-cantelli
titulo: Lemas de Borel-Cantelli
titulo_en: Borel-Cantelli lemmas
alias:
  - lema de Borel-Cantelli
  - eventos que ocurren infinitas veces
modulo: 3
submodulo: '3.1'
orden: 19
nivel: avanzado
prerrequisitos:
  - convergencia-casi-segura
  - series-y-convergencia-de-series
etiquetas:
  - eventos
  - infinitas veces
  - series
  - independencia
  - convergencia casi segura
resumen: >
  Si la suma de las probabilidades de los eventos Aₙ es finita, casi seguramente ocurren solo finitos.
  Si la suma es infinita y los eventos son independientes, casi seguramente ocurren infinitos.
formula: '\sum_{n} P(A_n) < \infty \Rightarrow P(A_n \text{ i.v.}) = 0; \qquad \sum_{n} P(A_n) = \infty,\ A_n \text{ independientes} \Rightarrow P(A_n \text{ i.v.}) = 1'
visualizacion:
  componente: TailEventsViz
  parametros:
    modo: borel-cantelli
    exponente: 1.5
    constante: 1
    horizonte: 10000
referencias:
  - clave: durrett
  - clave: ross-probabilidad
publicado: true
---

## Intuición

Una estación climatológica registra cada año la lluvia máxima del año y anota si fue un récord, es decir, mayor que todas las anteriores. Si el clima es estable, la probabilidad de récord en el año $n$ es $1/n$: el máximo de $n$ años es igualmente probable en cualquiera de ellos. Los récords se vuelven cada vez más raros. ¿Llegará un año a partir del cual no haya más récords?

Los lemas de Borel-Cantelli responden mirando la suma de las probabilidades. Esa suma es el número esperado de eventos en toda la historia. Si es finita, casi seguramente solo hay finitos eventos: después de cierto momento no vuelven a ocurrir. Si es infinita y los eventos son independientes, casi seguramente ocurren infinitas veces. En el caso de los récords, la suma de $1/n$ es infinita y los eventos de récord resultan ser independientes, así que siempre habrá un récord más, aunque haya que esperar cada vez más. La independencia en el segundo lema es esencial: sin ella, una suma infinita puede concentrarse en unas pocas trayectorias.

## Definición

Para eventos $A_1, A_2, \dots$ se define el evento "$A_n$ infinitas veces":
$$
\{A_n \text{ i.v.}\} = \limsup_{n \to \infty} A_n = \bigcap_{n=1}^{\infty}\bigcup_{m=n}^{\infty} A_m,
$$
el conjunto de resultados que pertenecen a infinitos $A_n$.

:::teorema[Primer lema de Borel-Cantelli]
Si $\sum_{n=1}^{\infty} P(A_n) < \infty$, entonces $P(A_n \text{ i.v.}) = 0$.
:::

:::teorema[Segundo lema de Borel-Cantelli]
Si los eventos $A_n$ son independientes y $\sum_{n=1}^{\infty} P(A_n) = \infty$, entonces $P(A_n \text{ i.v.}) = 1$.
:::

El primer lema no necesita independencia. Juntos dan una ley 0-1 para eventos independientes: $P(A_n \text{ i.v.})$ vale 0 o 1 según la suma sea finita o infinita.

:::nota[Qué significa cada símbolo]
- $A_n$: evento número $n$.
- $P(A_n)$: su probabilidad.
- $\sum_n P(A_n)$: suma de las probabilidades, igual al número esperado de eventos que ocurren.
- $\{A_n \text{ i.v.}\}$: "ocurren infinitas veces", el límite superior de los eventos.
- $\bigcup_{m \ge n} A_m$: ocurre algún evento desde el índice $n$; $\bigcap_n$: eso pasa para todo $n$.
:::

## Cómo usar la visualización

Cada fila es una corrida independiente y cada marca, una ocurrencia de $A_n$ con probabilidad $c/n^s$, en un eje logarítmico; la última ocurrencia de cada corrida se resalta. Abajo, a la izquierda, la fracción de corridas con algún evento entre $n$ y el horizonte; a la derecha, el número medio de eventos acumulados, que sigue la suma de probabilidades. Los controles fijan $s$ y $c$.

Con $s = 1.5$ la suma converge y las últimas ocurrencias se agrupan al inicio: casi ninguna corrida tiene eventos después de $n = 100$. Con $s = 1$ la suma crece como $\log n$ y las marcas aparecen en todas las décadas, hasta el final. Con eventos dependientes $A_n = \{U < 1/n\}$ la suma también diverge, pero cada corrida tiene solo un bloque inicial de eventos.

## Ejemplo

Una estación registra la lluvia máxima anual, con años independientes y la misma distribución continua. Sea $A_n$ el evento "el año $n$ es récord".

1. El mayor de $n$ valores independientes con la misma distribución continua está en cualquier posición con igual probabilidad: $P(A_n) = 1/n$.
2. Los eventos de récord son independientes: saber cuál fue el orden de los primeros $n - 1$ años no informa si el año $n$ es el máximo.
3. $\sum_{n} 1/n = \infty$, así que por el segundo lema hay infinitos récords con probabilidad 1.
4. El número esperado de récords en 100 años es $\sum_{n=1}^{100} 1/n = 5.19$; en 1000 años, 7.49. Crecen como $\log n$.
5. En cambio, si $B_n$ es el evento "el año $n$ y el año $n + 1$ son ambos récords", $P(B_n) = \frac{1}{n(n+1)}$ y $\sum P(B_n) = 1 < \infty$: por el primer lema, casi seguramente solo hay finitos pares de récords consecutivos.

:::figura[El ejemplo de los récords: eventos independientes con probabilidad 1/n. La suma diverge y las ocurrencias siguen apareciendo en cada década del horizonte.]{componente="TailEventsViz"}
```yaml
modo: borel-cantelli
exponente: 1
constante: 1
horizonte: 10000
```
:::

## Propiedades

- **Número esperado:** $\mathbb{E}\big[\sum_n \mathbf{1}\{A_n\}\big] = \sum_n P(A_n)$; si es finito, el número de eventos es finito casi seguramente.
- **Criterio de convergencia casi segura:** si $\sum_n P(|X_n - X| > \varepsilon) < \infty$ para todo $\varepsilon > 0$, entonces $X_n \xrightarrow{c.s.} X$.
- **Subsucesiones:** de la convergencia en probabilidad se extrae una subsucesión con $\sum_k P(|X_{n_k} - X| > 2^{-k}) < \infty$, que converge casi seguramente.
- **Frontera en $1/n$:** con $p_n = c/n^s$ la suma converge si y solo si $s > 1$.
- **Versiones con dependencia débil:** el segundo lema sigue valiendo bajo independencia por pares o ciertas condiciones de correlación.

:::figura[Propiedad: con s = 2 y c = 3 los primeros eventos son casi seguros, pero la suma es finita y las ocurrencias terminan pronto en todas las corridas.]{componente="TailEventsViz"}
```yaml
modo: borel-cantelli
exponente: 2
constante: 3
horizonte: 10000
```
:::

:::demostracion
Primer lema: para todo $n$, $\{A_n \text{ i.v.}\} \subseteq \bigcup_{m \ge n} A_m$, así que $P(A_n \text{ i.v.}) \le \sum_{m \ge n} P(A_m)$, que es la cola de una serie convergente y tiende a 0. Segundo lema: por independencia y $1 - x \le e^{-x}$, $P\big(\bigcap_{m=n}^{N} A_m^c\big) = \prod_{m=n}^{N}(1 - P(A_m)) \le \exp\big(-\sum_{m=n}^{N} P(A_m)\big) \to 0$ cuando $N \to \infty$. Entonces cada cola $\bigcup_{m \ge n} A_m$ tiene probabilidad 1 y su intersección también.
:::

## Errores comunes

- **Aplicar el segundo lema sin independencia.** Con $A_n = \{U < 1/n\}$ y un solo $U$ uniforme, $\sum P(A_n) = \infty$, pero $A_n$ ocurre solo para $n < 1/U$: finitas veces.
- **Confundir número esperado infinito con ocurrencias infinitas seguras.** En el ejemplo dependiente el número esperado de eventos es infinito y el número real es finito con probabilidad 1.
- **Creer que $P(A_n) \to 0$ basta para que los eventos terminen.** Con $P(A_n) = 1/n$ independientes la probabilidad tiende a cero y aun así ocurren infinitas veces.
- **Invertir el primer lema.** Que solo ocurran finitos eventos no implica que la suma sea finita.

:::figura[Error común: el segundo lema sin independencia. Con Aₙ = {U < 1/n} la suma diverge, pero cada corrida solo tiene un bloque inicial de eventos y luego ninguno.]{componente="TailEventsViz"}
```yaml
modo: borel-cantelli
dependientes: true
horizonte: 10000
```
:::

## Conexiones

Es la herramienta principal para probar [[convergencia-casi-segura]] y para construir los contraejemplos de [[relaciones-entre-modos-de-convergencia]]. Se basa en [[series-y-convergencia-de-series|series]] de probabilidades y se usa en la demostración de la [[ley-fuerte-de-los-grandes-numeros]] y de la [[ley-del-logaritmo-iterado]]. La [[ley-0-1-de-kolmogorov]] generaliza la dicotomía 0 o 1 a todos los eventos de cola.

## Formulario

:::formula[Eventos que ocurren infinitas veces]
$$
\{A_n \text{ i.v.}\} = \bigcap_{n=1}^{\infty}\bigcup_{m=n}^{\infty} A_m
$$

- $A_m$: eventos.
- $\bigcup_{m \ge n} A_m$: algún evento ocurre desde $n$.
:::

:::formula[Primer lema]
$$
\sum_{n=1}^{\infty} P(A_n) < \infty \Rightarrow P(A_n \text{ i.v.}) = 0
$$

- $P(A_n)$: probabilidad del evento $n$; no se requiere independencia.
:::

:::formula[Segundo lema]
$$
A_n \text{ independientes},\ \sum_{n=1}^{\infty} P(A_n) = \infty \Rightarrow P(A_n \text{ i.v.}) = 1
$$

- Requiere independencia de los eventos.
:::

:::formula[Probabilidad de algún evento desde n]
$$
P\Big(\bigcup_{m \ge n} A_m\Big) = 1 - \prod_{m \ge n}\big(1 - P(A_m)\big)
$$

- Válida para eventos independientes.
:::

:::formula[Número esperado de récords]
$$
\mathbb{E}[R_n] = \sum_{k=1}^{n}\frac{1}{k} \approx \log n + 0.5772
$$

- $R_n$: número de récords en $n$ años.
- $0.5772$: constante de Euler-Mascheroni.
:::
