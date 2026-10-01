---
id: distribucion-de-poisson
titulo: Distribución de Poisson
titulo_en: Poisson distribution
alias:
  - Poisson
  - ley de los eventos raros
  - conteo de llegadas
modulo: 2
submodulo: '2.1'
orden: 7
nivel: basico
prerrequisitos:
  - distribucion-binomial
  - serie-de-taylor-y-de-maclaurin
relaciones:
  - tipo: relacionado
    id: funcion-exponencial-y-logaritmo-natural
etiquetas:
  - distribución discreta
  - conteos
  - llegadas
  - eventos raros
resumen: >
  Modela el número de eventos que ocurren en un intervalo cuando suceden de forma independiente y a
  una tasa constante λ. Su media y su varianza son iguales a λ.
formula: 'P(X = k) = \frac{e^{-\lambda} \lambda^{k}}{k!}, \quad k = 0, 1, 2, \dots'
visualizacion:
  componente: DistributionGenesis
  parametros:
    proceso: llegadas
    valores:
      lambda: 4
    unidad: pacientes que llegan a urgencias en una hora
referencias:
  - clave: blitzstein-hwang
    capitulo: '4'
  - clave: ross-probabilidad
    capitulo: '4'
publicado: true
---

## Intuición

A la sala de urgencias de un hospital llegan en promedio cuatro pacientes por hora. Las llegadas no siguen un horario: cada persona decide ir por sus propios motivos, sin coordinarse con las demás, y la tasa promedio se mantiene a lo largo de la hora. En una hora concreta pueden llegar dos, cuatro o siete. La distribución de Poisson describe ese conteo.

Una forma de entenderla es partir la hora en muchos intervalos diminutos, por ejemplo segundos. En cada segundo la probabilidad de que llegue alguien es minúscula y es prácticamente imposible que lleguen dos. El conteo de la hora es entonces el número de segundos con llegada: una binomial con muchísimos ensayos y una probabilidad pequeñísima por ensayo. Al refinar la partición, esa binomial converge a la Poisson, que depende de un solo número, la tasa esperada de eventos en el intervalo.

Por eso la Poisson aparece en conteos muy distintos: llamadas a un conmutador, accidentes en una carretera, mutaciones en un tramo de ADN o defectos en un rollo de tela. En todos hay muchas oportunidades, cada una con probabilidad pequeña, y eventos que no se influyen entre sí.

## Definición

:::definicion[Distribución de Poisson]
Una variable aleatoria $X$ con valores en $\{0, 1, 2, \dots\}$ tiene **distribución de Poisson** con parámetro $\lambda > 0$, y se escribe $X \sim \operatorname{Poisson}(\lambda)$, si
$$
P(X = k) = \frac{e^{-\lambda} \lambda^{k}}{k!}, \qquad k = 0, 1, 2, \dots
$$
:::

Es el modelo adecuado para el número de eventos en un intervalo de tiempo, longitud, área o volumen cuando: los eventos ocurren de uno en uno, los conteos en intervalos disjuntos son independientes y la tasa promedio es constante en el intervalo. Las probabilidades suman uno por la serie de Taylor $e^{\lambda} = \sum_{k \ge 0} \lambda^{k}/k!$.

:::nota[Qué significa cada símbolo]
- $X$: número de eventos en el intervalo.
- $\lambda$: número esperado de eventos en ese intervalo, la tasa por la longitud del intervalo.
- $k$: número de eventos cuya probabilidad se calcula.
- $e$: base del logaritmo natural, aproximadamente 2.718.
- $k!$: factorial de $k$, con $0! = 1$.
:::

## Cómo usar la visualización

La línea representa una hora. Las llegadas aparecen en orden, como marcas sobre la línea, mientras el cursor avanza; el número de la derecha es el conteo. Al cerrar la hora, el conteo cae en el histograma, que se compara con la función de masa de Poisson.

Con $\lambda = 4$, el histograma tiene su máximo en 3 y 4, y la media y la varianza de los resultados se acercan ambas a 4. Al bajar $\lambda$ a 0.5 la mayoría de las horas no tiene llegadas y la barra del 0 domina. Al subir $\lambda$ a 15 la forma se vuelve simétrica, como una campana, aunque la varianza sigue siendo igual a la media.

## Ejemplo

Un tramo de carretera registra en promedio 2.5 accidentes por mes. Sea $X$ el número de accidentes en un mes, $X \sim \operatorname{Poisson}(2.5)$.

1. Ningún accidente: $P(X = 0) = e^{-2.5} \approx 0.0821$.
2. Exactamente dos: $P(X = 2) = e^{-2.5}\,2.5^{2}/2! \approx 0.0821 \cdot 3.125 \approx 0.2565$.
3. Al menos cuatro: $P(X \ge 4) = 1 - [P(0) + P(1) + P(2) + P(3)] \approx 1 - (0.0821 + 0.2052 + 0.2565 + 0.2138) = 0.2424$.
4. Media y varianza: ambas valen 2.5; la desviación estándar es $\sqrt{2.5} \approx 1.58$ accidentes.

:::figura[Poisson(2.5): las barras desde 4 en adelante suman 0.2424. La media 2.5 no es un valor posible, pero la masa se reparte alrededor de ella.]{componente="DistributionExplorer"}
```yaml
distribucion: poisson
valores:
  lambda: 2.5
desde: 4
hasta: 15
muestras: false
```
:::

:::figura[Los accidentes de cada mes como llegadas sobre la línea de tiempo. El histograma de los conteos mensuales reproduce las probabilidades del ejemplo.]{componente="DistributionGenesis"}
```yaml
proceso: llegadas
valores:
  lambda: 2.5
unidad: accidentes en un mes
```
:::

## Propiedades

- **Media igual a varianza:** $\mathbb{E}[X] = \operatorname{Var}(X) = \lambda$; la desviación estándar es $\sqrt{\lambda}$.
- **Moda:** el valor más probable es $\lfloor \lambda \rfloor$; si $\lambda$ es entero, $\lambda - 1$ y $\lambda$ empatan.
- **Recurrencia:** $P(X = k + 1) = \dfrac{\lambda}{k + 1} P(X = k)$; las probabilidades crecen mientras $k + 1 < \lambda$ y luego decrecen.
- **Suma:** si $X \sim \operatorname{Poisson}(\lambda_1)$ y $Y \sim \operatorname{Poisson}(\lambda_2)$ son independientes, $X + Y \sim \operatorname{Poisson}(\lambda_1 + \lambda_2)$.
- **Adelgazamiento:** si cada evento se conserva con probabilidad $q$, independientemente, los eventos conservados forman una $\operatorname{Poisson}(q\lambda)$.
- **Límite de la binomial:** si $n \to \infty$ y $p \to 0$ con $np = \lambda$, $\operatorname{Bin}(n, p) \to \operatorname{Poisson}(\lambda)$.

:::figura[Ley de los eventos raros: la hora dividida en 20 rendijas, cada una con probabilidad 4/20 de llegada, da una binomial (barras teóricas) muy parecida a la Poisson(4) (línea punteada). Con 200 rendijas son casi idénticas.]{componente="DistributionGenesis"}
```yaml
proceso: llegadas
valores:
  lambda: 4
rendijas: 20
comparar: true
unidad: pacientes en una hora
```
:::

:::figura[Con λ pequeño la forma es decreciente: Poisson(0.7) tiene su moda en 0.]{componente="DistributionExplorer"}
```yaml
distribucion: poisson
valores:
  lambda: 0.7
muestras: false
```
:::

:::figura[Con λ grande la forma se parece a una campana: Poisson(20) es casi simétrica alrededor de 20, con desviación estándar 4.47.]{componente="DistributionExplorer"}
```yaml
distribucion: poisson
valores:
  lambda: 20
muestras: false
```
:::

:::demostracion
Media: $\mathbb{E}[X] = \sum_{k \ge 1} k \frac{e^{-\lambda}\lambda^{k}}{k!} = \lambda e^{-\lambda} \sum_{k \ge 1} \frac{\lambda^{k-1}}{(k-1)!} = \lambda e^{-\lambda} e^{\lambda} = \lambda$. Del mismo modo $\mathbb{E}[X(X - 1)] = \lambda^{2}$, así que $\operatorname{Var}(X) = \lambda^{2} + \lambda - \lambda^{2} = \lambda$. Límite binomial: con $p = \lambda/n$, $\binom{n}{k}p^{k}(1-p)^{n-k} = \frac{n(n-1)\cdots(n-k+1)}{n^{k}}\frac{\lambda^{k}}{k!}\left(1 - \frac{\lambda}{n}\right)^{n-k}$; el primer factor tiende a 1 y el último a $e^{-\lambda}$.
:::

## Errores comunes

- **No ajustar λ al intervalo.** Si llegan 4 pacientes por hora, el conteo de media hora es $\operatorname{Poisson}(2)$, no $\operatorname{Poisson}(4)$; con $\lambda = 2$, $P(X \ge 1) = 1 - e^{-2} \approx 0.865$.
- **Usarla con datos sobredispersos.** Si la varianza observada es mucho mayor que la media, por ejemplo por muchos ceros o por tasas que cambian entre unidades, la Poisson subestima la variabilidad.
- **Usarla cuando los eventos se agrupan.** Contagios en una familia o réplicas de un sismo no son independientes; el conteo varía más de lo que predice la Poisson.
- **Pensar que λ debe ser entero.** $\lambda$ es una media y puede valer 2.5; lo que es entero es cada conteo.

:::figura[Media hora en lugar de una hora: con λ = 2 las barras de 1 en adelante suman 0.865.]{componente="DistributionExplorer"}
```yaml
distribucion: poisson
valores:
  lambda: 2
desde: 1
hasta: 12
muestras: false
```
:::

:::figura[Datos con exceso de ceros: cuando una parte de los conteos es cero por razones estructurales, la Poisson con la misma media (línea punteada) subestima la barra del 0 y la varianza.]{componente="DistributionGenesis"}
```yaml
proceso: ceros-inflados
valores:
  pi: 0.35
  lambda: 3
comparar: true
unidad: visitas al médico en un año
```
:::

## Conexiones

La Poisson es el límite de la [[distribucion-binomial]] cuando hay muchos ensayos con probabilidad pequeña, y su normalización es la [[serie-de-taylor-y-de-maclaurin|serie de Taylor]] de la [[funcion-exponencial-y-logaritmo-natural|exponencial]]. La diferencia de dos conteos de Poisson independientes da la [[distribucion-de-skellam]], y los datos con ceros de más se modelan con la [[distribucion-de-poisson-inflada-en-ceros]]. Cuando la varianza supera a la media, la [[distribucion-binomial-negativa]] es la alternativa habitual. Los tiempos entre llegadas de un proceso de Poisson siguen una distribución exponencial.

## Formulario

:::formula[Función de masa]
$$
P(X = k) = \frac{e^{-\lambda} \lambda^{k}}{k!}, \qquad k = 0, 1, 2, \dots
$$

- $X$: número de eventos en el intervalo.
- $\lambda$: número esperado de eventos.
- $k$: conteo particular.
- $k!$: factorial de $k$.
:::

:::formula[Media y varianza]
$$
\mathbb{E}[X] = \operatorname{Var}(X) = \lambda
$$

- La desviación estándar es $\sqrt{\lambda}$.
:::

:::formula[Recurrencia]
$$
P(X = k + 1) = \frac{\lambda}{k + 1}\, P(X = k)
$$

- Permite calcular las probabilidades una a partir de la anterior, empezando en $P(X = 0) = e^{-\lambda}$.
:::

:::formula[Suma de Poisson independientes]
$$
\operatorname{Poisson}(\lambda_1) + \operatorname{Poisson}(\lambda_2) \sim \operatorname{Poisson}(\lambda_1 + \lambda_2)
$$

- $\lambda_1$, $\lambda_2$: tasas de cada conteo, que deben ser independientes.
:::

:::formula[Límite de la binomial]
$$
\binom{n}{k}p^{k}(1-p)^{n-k} \to \frac{e^{-\lambda}\lambda^{k}}{k!}, \qquad n \to \infty,\ np = \lambda
$$

- $n$: número de ensayos.
- $p = \lambda/n$: probabilidad por ensayo.
:::
