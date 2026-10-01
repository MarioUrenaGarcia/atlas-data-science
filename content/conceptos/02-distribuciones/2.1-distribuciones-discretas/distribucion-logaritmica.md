---
id: distribucion-logaritmica
titulo: Distribución logarítmica
titulo_en: Logarithmic distribution
alias:
  - serie logarítmica
  - distribución log-serie
  - log-series distribution
modulo: 2
submodulo: '2.1'
orden: 12
nivel: intermedio
prerrequisitos:
  - distribucion-geometrica
  - serie-de-taylor-y-de-maclaurin
relaciones:
  - tipo: relacionado
    id: distribucion-binomial-negativa
  - tipo: relacionado
    id: distribucion-de-zipf
etiquetas:
  - distribución discreta
  - abundancia de especies
  - mezcla
  - cola larga
resumen: >
  Distribución en los enteros positivos con probabilidades proporcionales a p^k/k. Describe cuántos
  individuos tiene cada especie en una muestra ecológica y surge como mezcla de geométricas.
formula: 'P(X = k) = \frac{-1}{\log(1 - p)}\,\frac{p^{k}}{k}, \quad k = 1, 2, 3, \dots'
visualizacion:
  componente: DistributionGenesis
  parametros:
    proceso: mezcla-geometrica
    valores:
      p: 0.8
    exito: Éxito
    fracaso: Fracaso
referencias:
  - clave: ross-probabilidad
  - clave: newman
publicado: true
---

## Intuición

Una entomóloga coloca una trampa de luz durante una noche y luego clasifica los insectos capturados por especie. Muchas especies aparecen con un solo ejemplar, menos especies con dos, todavía menos con tres, y unas cuantas especies muy abundantes aportan decenas de individuos. El número de individuos de una especie elegida al azar entre las capturadas sigue con frecuencia una distribución logarítmica, el modelo que el estadístico R. A. Fisher propuso para estas abundancias.

Su forma se parece a la de la geométrica: el valor más probable es 1 y las probabilidades bajan conforme crece el conteo. Pero la cola es más pesada, porque además del factor geométrico $p^{k}$ hay una división entre $k$ que cae mucho más despacio.

Una manera de ver de dónde sale es imaginar que cada especie tiene su propia facilidad para caer en la trampa. Para cada especie se sortea primero una probabilidad de éxito y luego se cuentan ensayos hasta el primer éxito. Las especies con probabilidad pequeña producen esperas largas, y esa variedad de probabilidades engorda la cola. La mezcla de geométricas con el sorteo adecuado da exactamente la distribución logarítmica.

## Definición

:::definicion[Distribución logarítmica]
Sea $p \in (0, 1)$. Una variable $X$ con valores en $\{1, 2, 3, \dots\}$ tiene **distribución logarítmica**, $X \sim \operatorname{Log}(p)$, si
$$
P(X = k) = \frac{-1}{\log(1 - p)}\,\frac{p^{k}}{k}, \qquad k = 1, 2, 3, \dots
$$
:::

La constante sale de la serie de Taylor $-\log(1 - p) = \sum_{k \ge 1} p^{k}/k$, válida para $|p| < 1$, que garantiza que las probabilidades sumen uno.

**Construcción como mezcla.** Si $U \sim U(0, 1)$, se define la probabilidad de éxito $s = (1 - p)^{U}$ y, dado $s$, se cuenta el número $X$ de ensayos hasta el primer éxito, $X \mid s \sim \operatorname{Geom}(s)$. Entonces $X \sim \operatorname{Log}(p)$.

:::nota[Qué significa cada símbolo]
- $X$: conteo, por ejemplo individuos de una especie.
- $k$: valor particular, entero positivo.
- $p$: parámetro entre 0 y 1; valores cercanos a 1 dan colas más largas.
- $\log$: logaritmo natural; $-\log(1 - p) > 0$.
- $U$: número uniforme entre 0 y 1.
- $s = (1 - p)^{U}$: probabilidad de éxito sorteada, entre $1 - p$ y 1.
- $\operatorname{Geom}(s)$: ensayos hasta el primer éxito con probabilidad $s$.
:::

## Cómo usar la visualización

Cada experimento tiene dos pasos. Primero se sortea la probabilidad de éxito $s$: el triángulo cae en la franja sombreada, que va de $1 - p$ a 1. Después se lanzan ensayos con esa probabilidad hasta el primer éxito, y el número de ensayos cae en el histograma, que se compara con la función de masa logarítmica.

Con $p = 0.8$ casi la mitad de los experimentos termina en el primer ensayo, porque $s$ suele ser grande; pero cuando $s$ cae cerca de 0.2 la espera se alarga y alimenta la cola. Al llevar $p$ a 0.95 la franja se ensancha hasta 0.05 y aparecen esperas de 20 o más ensayos. Con $p = 0.2$ casi todos los experimentos terminan en uno o dos ensayos.

## Ejemplo

En una muestra de insectos, el número de individuos por especie sigue $\operatorname{Log}(0.9)$. Aquí $-\log(1 - 0.9) = \log 10 \approx 2.3026$.

1. Especies con un solo individuo: $P(X = 1) = 0.9/2.3026 \approx 0.391$.
2. Con dos: $P(X = 2) = 0.81/(2 \cdot 2.3026) \approx 0.176$; con tres: $0.729/(3 \cdot 2.3026) \approx 0.106$.
3. Especies con cuatro o más individuos: $1 - (0.391 + 0.176 + 0.106) \approx 0.328$.
4. Media: $\mathbb{E}[X] = \frac{-p}{(1 - p)\log(1 - p)} = \frac{0.9}{0.1 \cdot 2.3026} \approx 3.91$ individuos por especie, muy por encima de la moda, que es 1.

:::figura[Log(0.9): las barras desde 4 en adelante, sombreadas, suman 0.328. La media 3.91 queda lejos de la barra más alta.]{componente="DistributionExplorer"}
```yaml
distribucion: logaritmica
valores:
  p: 0.9
desde: 4
hasta: 40
muestras: false
```
:::

:::figura[Las especies del ejemplo generadas como mezcla: para cada especie se sortea s entre 0.1 y 1 y se cuentan ensayos hasta el primer éxito.]{componente="DistributionGenesis"}
```yaml
proceso: mezcla-geometrica
valores:
  p: 0.9
exito: Captura
fracaso: Sin captura
```
:::

## Propiedades

- **Media:** $\mathbb{E}[X] = \dfrac{-p}{(1 - p)\log(1 - p)}$.
- **Varianza:** $\operatorname{Var}(X) = \dfrac{-p\,\big(p + \log(1 - p)\big)}{(1 - p)^{2}\log^{2}(1 - p)}$.
- **Moda en 1:** el cociente $P(X = k + 1)/P(X = k) = p\,k/(k + 1) < 1$, así que la función de masa siempre decrece.
- **Mezcla de geométricas:** es una geométrica cuya probabilidad de éxito $s = (1 - p)^{U}$ es aleatoria.
- **Límite de la binomial negativa:** es el límite, cuando $r \to 0$, de la binomial negativa condicionada a ser positiva.
- **Poisson compuesta:** sumar $N \sim \operatorname{Poisson}(\lambda)$ variables logarítmicas independientes da una binomial negativa; por eso Fisher la usó para conectar el número de especies con el de individuos.

:::figura[Efecto de p: con p = 0.98 la cola es muy larga y la media sube a 12.5, aunque la moda sigue en 1.]{componente="DistributionExplorer"}
```yaml
distribucion: logaritmica
valores:
  p: 0.98
muestras: false
```
:::

:::figura[Con p = 0.3 casi toda la masa está en 1 y 2: la franja de probabilidades sorteadas va de 0.7 a 1 y las esperas largas son raras.]{componente="DistributionGenesis"}
```yaml
proceso: mezcla-geometrica
valores:
  p: 0.3
```
:::

:::demostracion
Con $s = (1 - p)^{u}$, $P(X = k \mid u) = s(1 - s)^{k - 1}$. Integrando en $u$ con el cambio $s = (1 - p)^{u}$, $du = \frac{ds}{s\log(1 - p)}$, y recorriendo $s$ de 1 a $1 - p$:
$$
P(X = k) = \int_{1-p}^{1} s(1 - s)^{k-1}\frac{ds}{-s\log(1 - p)} = \frac{1}{-\log(1 - p)}\left[-\frac{(1 - s)^{k}}{k}\right]_{1-p}^{1} = \frac{p^{k}}{-k\log(1 - p)}.
$$
:::

## Errores comunes

- **Confundirla con una geométrica de la misma media.** Con media 2.49, la geométrica da $P(X > 10) \approx 0.006$, mientras que la logarítmica con $p = 0.8$ da 0.019: tres veces más especies abundantes.
- **Tomar la media como valor típico.** La media puede ser varias veces la moda; en el ejemplo, el 39 % de las especies tiene un solo individuo aunque la media sea 3.9.
- **Incluir el cero.** La distribución empieza en 1: en el modelo de abundancias solo se registran las especies que aparecen en la muestra.
- **Usar p fuera de (0, 1).** Con $p \ge 1$ la serie diverge y no hay distribución.

:::figura[Logarítmica con p = 0.8 (barras) frente a la geométrica con la misma media 2.49 (línea punteada): la geométrica cae más rápido y casi no tiene cola más allá de 8.]{componente="DistributionExplorer"}
```yaml
distribucion: logaritmica
valores:
  p: 0.8
dominio: [0.5, 20.5]
muestras: false
referencia:
  distribucion: geometrica
  valores:
    p: 0.4024
  etiqueta: Geométrica de media 2.49
```
:::

## Conexiones

La logarítmica es una mezcla de la [[distribucion-geometrica]] sobre su probabilidad de éxito, y su normalización es la [[serie-de-taylor-y-de-maclaurin|serie de Taylor]] de $-\log(1 - p)$. Aparece como límite de la [[distribucion-binomial-negativa]] truncada en cero, y una suma de Poisson de logarítmicas reproduce la binomial negativa. Junto con la [[distribucion-de-zipf]], describe abundancias muy desiguales en ecología, lingüística y economía.

## Formulario

:::formula[Función de masa]
$$
P(X = k) = \frac{-1}{\log(1 - p)}\,\frac{p^{k}}{k}, \qquad k = 1, 2, \dots
$$

- $p$: parámetro entre 0 y 1.
- $k$: conteo positivo.
- $\log$: logaritmo natural.
:::

:::formula[Normalización]
$$
-\log(1 - p) = \sum_{k=1}^{\infty} \frac{p^{k}}{k}, \qquad |p| < 1
$$

- Serie de Taylor del logaritmo alrededor de 0.
:::

:::formula[Media y varianza]
$$
\mathbb{E}[X] = \frac{-p}{(1 - p)\log(1 - p)}, \qquad \operatorname{Var}(X) = \frac{-p\,\big(p + \log(1 - p)\big)}{(1 - p)^{2}\log^{2}(1 - p)}
$$

- $\log^{2}(1 - p)$: cuadrado del logaritmo.
:::

:::formula[Construcción como mezcla]
$$
U \sim U(0, 1), \qquad s = (1 - p)^{U}, \qquad X \mid s \sim \operatorname{Geom}(s)
$$

- $U$: uniforme entre 0 y 1.
- $s$: probabilidad de éxito sorteada.
- $\operatorname{Geom}(s)$: ensayos hasta el primer éxito.
:::
