---
id: ley-0-1-de-kolmogorov
titulo: Ley 0-1 de Kolmogorov
titulo_en: Kolmogorov's zero-one law
alias:
  - ley cero-uno de Kolmogorov
  - eventos de cola
modulo: 3
submodulo: '3.1'
orden: 20
nivel: avanzado
prerrequisitos:
  - lemas-de-borel-cantelli
etiquetas:
  - eventos de cola
  - independencia
  - probabilidad 0 o 1
  - series aleatorias
resumen: >
  Para variables independientes, cualquier evento que no depende de un número finito de ellas, un evento
  de cola, tiene probabilidad 0 o 1. Ejemplos: que una serie aleatoria converja o que un promedio tenga límite.
formula: 'X_1, X_2, \dots \text{ independientes},\ A \in \mathcal{T} = \bigcap_{n=1}^{\infty}\sigma(X_n, X_{n+1}, \dots) \ \Rightarrow\ P(A) \in \{0, 1\}'
visualizacion:
  componente: TailEventsViz
  parametros:
    modo: cero-uno
    exponente: 0.8
    horizonte: 5000
referencias:
  - clave: durrett
publicado: true
---

## Intuición

Un fondo de inversión hace apuestas sucesivas e independientes que ganan o pierden con la misma probabilidad, y cada apuesta es más pequeña que la anterior: la apuesta $i$ arriesga $1/i^a$ pesos. ¿Se estabilizará el saldo acumulado o seguirá oscilando sin límite? La respuesta podría parecer una cuestión de suerte. La ley 0-1 de Kolmogorov dice que no: la probabilidad de que el saldo converja es exactamente 0 o exactamente 1.

La razón es que la convergencia del saldo no depende de las primeras apuestas. Cambiar el resultado de las primeras diez, o de las primeras mil, desplaza todo el saldo por una cantidad fija, pero no altera si después se estabiliza. Un evento así, que no se ve afectado por ningún número finito de observaciones, se llama evento de cola. Como es independiente de cualquier bloque inicial y a la vez está determinado por toda la sucesión, termina siendo independiente de sí mismo, y un evento independiente de sí mismo solo puede tener probabilidad 0 o 1. La ley no dice cuál de los dos valores: eso hay que averiguarlo con otras herramientas.

## Definición

Sea $X_1, X_2, \dots$ una sucesión de variables aleatorias. La **$\sigma$-álgebra de cola** es
$$
\mathcal{T} = \bigcap_{n=1}^{\infty} \sigma(X_n, X_{n+1}, \dots),
$$
la familia de eventos que se pueden decidir observando la sucesión desde cualquier índice en adelante. Sus elementos son los **eventos de cola**.

:::teorema[Ley 0-1 de Kolmogorov]
Si $X_1, X_2, \dots$ son independientes, todo evento de cola $A \in \mathcal{T}$ cumple $P(A) = 0$ o $P(A) = 1$.
:::

Son eventos de cola: "$\sum X_n$ converge", "$\bar{X}_n$ converge", "$\limsup_n \bar{X}_n > c$", "$X_n > 1$ infinitas veces". No lo son: "$X_1 > 0$" o "$\sum X_n > 5$", que dependen de los primeros términos.

:::nota[Qué significa cada símbolo]
- $X_n$: variables independientes.
- $\sigma(X_n, X_{n+1}, \dots)$: eventos que dependen solo de las variables desde el índice $n$.
- $\mathcal{T}$: intersección de todas esas familias, la $\sigma$-álgebra de cola.
- $A$: evento de cola.
- $\limsup_n \bar{X}_n$: límite superior de las medias, el mayor valor al que se acercan infinitas veces.
- $c$: constante real.
:::

## Cómo usar la visualización

Cada trayectoria es una suma parcial de la serie $\sum \varepsilon_i/i^a$ con signos $\varepsilon_i = \pm 1$ al azar, en un eje logarítmico. Las trayectorias se colorean según el signo de la primera apuesta, un evento que no es de cola. Abajo se grafica la oscilación de las sumas entre $n$ y $2n$, promedio y máxima sobre las trayectorias: si tiende a cero, las series convergen. El control fija $a$.

Con $a = 0.8$ todas las trayectorias se estabilizan, sin importar el color, y la oscilación baja de forma sostenida. Con $a = 0.45$ ninguna se estabiliza: la oscilación no disminuye. En ningún caso se observa una fracción intermedia de trayectorias convergentes, y el primer signo no tiene relación con el resultado.

## Ejemplo

Se estudia la serie armónica con signos aleatorios, $S = \sum_{i=1}^{\infty} \varepsilon_i/i$, con $\varepsilon_i = \pm 1$ independientes y equiprobables.

1. El evento "la serie converge" es de cola: cambiar los primeros $n$ signos suma una cantidad finita a todas las sumas parciales y no altera la convergencia.
2. Por la ley 0-1, la probabilidad de convergencia es 0 o 1.
3. Para decidir cuál, se usa que los sumandos son independientes con media cero y $\sum_i \operatorname{Var}(\varepsilon_i/i) = \sum_i 1/i^2 = \pi^2/6 < \infty$. Por el teorema de las dos series de Kolmogorov, la serie converge casi seguramente.
4. Con pesos $1/i^a$ el mismo criterio da $\sum 1/i^{2a}$, finita si y solo si $a > 1/2$. Para $a \le 1/2$ la serie diverge casi seguramente.
5. A diferencia de la serie armónica ordinaria, que diverge, la versión con signos aleatorios converge con probabilidad 1.

:::figura[El ejemplo de la serie armónica con signos aleatorios, a = 1: todas las sumas parciales se estabilizan y la oscilación cae como 1/√n.]{componente="TailEventsViz"}
```yaml
modo: cero-uno
exponente: 1
horizonte: 5000
```
:::

## Propiedades

- **Límites de cola son constantes:** si $Y$ es una variable aleatoria medible respecto a $\mathcal{T}$, entonces $Y$ es constante casi seguramente. Por ejemplo, $\limsup \bar{X}_n$ es una constante.
- **Borel-Cantelli como caso particular:** $\{A_n \text{ i.v.}\}$ es un evento de cola cuando cada $A_n$ depende solo de $X_n$; los lemas determinan si su probabilidad es 0 o 1.
- **La media de la ley fuerte es un evento de cola:** que $\bar{X}_n$ converja tiene probabilidad 0 o 1, y la ley fuerte dice que es 1 cuando la media existe.
- **Ley 0-1 de Hewitt-Savage:** para variables independientes con la misma distribución, los eventos invariantes ante permutaciones finitas también tienen probabilidad 0 o 1.
- **Requiere independencia:** con una variable común a todas las observaciones, un evento de cola puede tener probabilidad intermedia.

:::figura[Propiedad: del otro lado de la frontera. Con a = 0.45 la suma de varianzas es infinita y ninguna trayectoria se estabiliza.]{componente="TailEventsViz"}
```yaml
modo: cero-uno
exponente: 0.45
horizonte: 5000
```
:::

:::demostracion
Idea: un evento de cola $A$ es independiente de $\sigma(X_1, \dots, X_n)$ para cada $n$, porque depende solo de $X_{n+1}, X_{n+2}, \dots$. Por tanto es independiente de la familia generada por todas las $X_n$, a la que él mismo pertenece. Entonces $P(A) = P(A \cap A) = P(A)^2$, cuyas únicas soluciones son 0 y 1.
:::

## Errores comunes

- **Creer que la ley dice cuál de los dos valores ocurre.** Solo dice que es 0 o 1; hay que determinarlo con otras herramientas, como Borel-Cantelli o el teorema de las tres series.
- **Aplicarla a eventos que dependen de los primeros términos.** "$\sum X_n > 5$" no es de cola y puede tener cualquier probabilidad.
- **Olvidar la independencia.** Si $X_n = Y + Z_n$ con $Y$ común, el evento "$\bar{X}_n \to$ un valor positivo" tiene probabilidad $P(Y > 0)$, que puede ser 1/2.
- **Pensar que el primer término importa para la convergencia.** El color de las trayectorias, que codifica el primer signo, no tiene relación con que se estabilicen.

:::figura[Error común: buscar una probabilidad intermedia. En la frontera a = 0.5 la suma de varianzas diverge como log n y ninguna trayectoria converge; nunca se ve una fracción intermedia.]{componente="TailEventsViz"}
```yaml
modo: cero-uno
exponente: 0.5
horizonte: 5000
```
:::

## Conexiones

Generaliza la dicotomía de los [[lemas-de-borel-cantelli]] a todos los eventos de cola. Explica por qué la convergencia en la [[ley-fuerte-de-los-grandes-numeros]] y los límites superiores en la [[ley-del-logaritmo-iterado]] son constantes. Los eventos de cola están ligados a la [[convergencia-casi-segura]] y a la convergencia de [[series-y-convergencia-de-series|series]] aleatorias.

## Formulario

:::formula[σ-álgebra de cola]
$$
\mathcal{T} = \bigcap_{n=1}^{\infty} \sigma(X_n, X_{n+1}, \dots)
$$

- $\sigma(X_n, X_{n+1}, \dots)$: eventos determinados por las variables desde el índice $n$.
:::

:::formula[Ley 0-1]
$$
X_n \text{ independientes},\ A \in \mathcal{T} \Rightarrow P(A) \in \{0, 1\}
$$

- $A$: evento de cola.
:::

:::formula[Serie con signos aleatorios]
$$
\sum_{i=1}^{\infty}\frac{\varepsilon_i}{i^a} \text{ converge c.s.} \iff \sum_{i=1}^{\infty}\frac{1}{i^{2a}} < \infty \iff a > \tfrac{1}{2}
$$

- $\varepsilon_i$: signos $\pm 1$ independientes y equiprobables.
- $a$: exponente de los pesos.
:::

:::formula[Clave de la demostración]
$$
P(A) = P(A)^2 \Rightarrow P(A) \in \{0, 1\}
$$

- Un evento independiente de sí mismo.
:::
