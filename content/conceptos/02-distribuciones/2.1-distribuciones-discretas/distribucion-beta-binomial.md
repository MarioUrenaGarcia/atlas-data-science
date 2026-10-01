---
id: distribucion-beta-binomial
titulo: Distribución beta-binomial
titulo_en: Beta-binomial distribution
alias:
  - beta-binomial
  - binomial con probabilidad aleatoria
  - BetaBin(n, α, β)
modulo: 2
submodulo: '2.1'
orden: 10
nivel: intermedio
prerrequisitos:
  - distribucion-binomial
  - funcion-beta
relaciones:
  - tipo: generaliza
    id: distribucion-binomial
  - tipo: relacionado
    id: distribucion-binomial-negativa
etiquetas:
  - distribución discreta
  - sobredispersión
  - mezcla
  - heterogeneidad
resumen: >
  Cuenta éxitos en n ensayos cuando la probabilidad de éxito no es fija sino que varía según una
  distribución beta. Tiene la misma media que una binomial, pero más varianza.
formula: 'P(X = k) = \binom{n}{k}\frac{B(k + \alpha,\, n - k + \beta)}{B(\alpha, \beta)}, \quad k = 0, \dots, n'
visualizacion:
  componente: DistributionStudio
  parametros:
    explorador:
      distribucion: beta-binomial
      valores:
        n: 10
        alpha: 8
        beta: 2
      casos:
        - nombre: 'Germinación por lote'
          descripcion: 'n = 10, α = 8 y β = 2: media 8 pero varianza 2.9, mucho mayor que la binomial, porque los lotes difieren.'
          valores: {n: 10, alpha: 8, beta: 2}
        - nombre: 'Sin información'
          descripcion: 'α = β = 1: todos los conteos de 0 a 10 son igual de probables.'
          valores: {n: 10, alpha: 1, beta: 1}
        - nombre: 'Opiniones polarizadas'
          descripcion: 'α = β = 0.5: forma de U; casi todos los grupos están en un extremo.'
          valores: {n: 10, alpha: 0.5, beta: 0.5}
      ejemplo:
        titulo: 'Charola pobre'
        contexto: 'Una charola de 10 semillas viene de un lote cuya germinación sigue una Beta(8, 2).'
        pregunta: '¿Qué probabilidad hay de que germinen 6 o menos semillas?'
        valores: {n: 10, alpha: 8, beta: 2}
        region: izquierda
        desde: 6
      referencia:
        distribucion: binomial
        valores: {n: 10, p: 0.8}
        etiqueta: 'Binomial con p fija de 0.8'
        visible: true
    genesis:
      componente: DistributionGenesis
      parametros:
        proceso: beta-binomial
        valores:
          n: 20
          alpha: 4
          beta: 2
        exito: Correcta
        fracaso: Incorrecta
        comparar: true
referencias:
  - clave: gelman-bda
    capitulo: '5'
  - clave: casella-berger
    capitulo: '4'
  - clave: agresti
publicado: true
---

## Intuición

Un examen tiene 20 preguntas y se quiere modelar cuántas contesta bien un estudiante elegido al azar. Si todos los estudiantes tuvieran la misma probabilidad de acertar cada pregunta, el puntaje sería binomial. Pero los estudiantes no son iguales: unos aciertan el 90 % de las veces y otros el 40 %. El puntaje de un estudiante al azar mezcla dos fuentes de variación: quién es el estudiante y cómo le va en las preguntas.

La beta-binomial describe exactamente ese proceso en dos pasos. Primero se sortea la probabilidad de acierto del estudiante a partir de una distribución beta, que representa la variedad de habilidades en el grupo. Después, con esa probabilidad fija, se contestan las 20 preguntas como en una binomial.

El resultado tiene la misma media que una binomial con la probabilidad promedio, pero se dispersa más: aparecen con más frecuencia puntajes muy altos y muy bajos, porque algunos estudiantes son mucho mejores o peores que el promedio. Esta varianza adicional, llamada sobredispersión, aparece en muchos datos reales de proporciones: germinación por lote, tasas de clics por usuario o aciertos por jugador.

## Definición

:::definicion[Distribución beta-binomial]
Sean $n \in \mathbb{N}$ y $\alpha, \beta > 0$. Si $P \sim \operatorname{Beta}(\alpha, \beta)$ y, dado $P = p$, $X \sim \operatorname{Bin}(n, p)$, entonces $X$ tiene **distribución beta-binomial**, $X \sim \operatorname{BetaBin}(n, \alpha, \beta)$, con
$$
P(X = k) = \binom{n}{k}\frac{B(k + \alpha,\, n - k + \beta)}{B(\alpha, \beta)}, \qquad k = 0, 1, \dots, n.
$$
:::

La fórmula resulta de promediar la función de masa binomial sobre todos los valores de $p$ con peso dado por la densidad beta: $P(X = k) = \int_0^1 \binom{n}{k} p^{k}(1-p)^{n-k}\,\frac{p^{\alpha-1}(1-p)^{\beta-1}}{B(\alpha,\beta)}\,dp$.

:::nota[Qué significa cada símbolo]
- $X$: número de éxitos en los $n$ ensayos.
- $n$: número de ensayos.
- $P$: probabilidad de éxito, aleatoria y común a los $n$ ensayos.
- $\alpha$, $\beta$: parámetros de forma de la beta; $\alpha/(\alpha + \beta)$ es la probabilidad media.
- $k$: número de éxitos.
- $B(a, b)$: función beta, $B(a, b) = \int_0^1 t^{a-1}(1-t)^{b-1}\,dt$.
- $\binom{n}{k}$: número de secuencias con $k$ éxitos.
:::

## Cómo usar la visualización

La pestaña Distribución muestra la función de masa beta-binomial junto a la binomial de $p$ fija (línea punteada), la región elegida y su probabilidad; los casos cargan lotes heterogéneos, ausencia de información y opiniones polarizadas, y el ejemplo de la ficha se carga con su botón. La pestaña Ver cómo surge sortea primero la probabilidad de acierto y luego contesta las preguntas.

La comparación muestra la sobredispersión: misma media, más varianza. Al subir $\alpha$ y $\beta$ con su cociente fijo, la beta-binomial se acerca a la binomial.

## Ejemplo

Un vivero vende charolas de 10 semillas. La tasa de germinación cambia de un lote a otro y se describe con una $\operatorname{Beta}(8, 2)$, de media 0.8. Sea $X$ el número de semillas que germinan en una charola, $X \sim \operatorname{BetaBin}(10, 8, 2)$.

1. Media: $\mathbb{E}[X] = 10 \cdot \frac{8}{10} = 8$, igual que con una binomial de $p = 0.8$.
2. Varianza: $\operatorname{Var}(X) = \frac{10 \cdot 8 \cdot 2\,(8 + 2 + 10)}{(8 + 2)^{2}(8 + 2 + 1)} = \frac{3200}{1100} \approx 2.91$, frente a $10 \cdot 0.8 \cdot 0.2 = 1.6$ de la binomial.
3. Germinan todas: con $B(18, 2) = 1/342$ y $B(8, 2) = 1/72$, $P(X = 10) = \frac{72}{342} \approx 0.211$, casi el doble del valor binomial $0.8^{10} \approx 0.107$.
4. Germinan 6 o menos: $P(X \le 6) \approx 0.184$, frente a 0.121 con la binomial. Los lotes malos producen charolas pobres con más frecuencia.

:::figura[Charolas de 10 semillas: primero se sortea la germinación del lote con la Beta(8, 2) y luego germinan las semillas. La línea punteada es la binomial con p = 0.8.]{componente="DistributionGenesis"}
```yaml
proceso: beta-binomial
valores:
  n: 10
  alpha: 8
  beta: 2
exito: Germina
fracaso: No germina
comparar: true
```
:::

:::figura[BetaBin(10, 8, 2): las barras de 0 a 6 suman 0.184. La barra del 10 alcanza 0.211.]{componente="DistributionExplorer"}
```yaml
distribucion: beta-binomial
valores:
  n: 10
  alpha: 8
  beta: 2
ejemplo:
  titulo: 'Charola pobre'
  contexto: 'Una charola de 10 semillas viene de un lote cuya germinación sigue una Beta(8, 2).'
  pregunta: '¿Qué probabilidad hay de que germinen 6 o menos semillas?'
  valores: {n: 10, alpha: 8, beta: 2}
  region: izquierda
  desde: 6
region: izquierda
desde: 6
muestras: false
referencia:
  distribucion: binomial
  valores: {n: 10, p: 0.8}
  etiqueta: 'Binomial con p fija de 0.8'
  visible: true
```
:::

## Propiedades

- **Media:** $\mathbb{E}[X] = n\dfrac{\alpha}{\alpha + \beta}$.
- **Varianza:** $\operatorname{Var}(X) = n\pi(1 - \pi)\dfrac{\alpha + \beta + n}{\alpha + \beta + 1}$, con $\pi = \alpha/(\alpha + \beta)$; el último factor, mayor que 1 si $n > 1$, mide la sobredispersión.
- **Varianza total:** la descomposición $\operatorname{Var}(X) = \mathbb{E}[np(1 - p)] + \operatorname{Var}(np)$ separa la variación dentro de cada lote y entre lotes.
- **Caso uniforme:** con $\alpha = \beta = 1$, $P(X = k) = 1/(n + 1)$ para todo $k$.
- **Límite binomial:** si $\alpha, \beta \to \infty$ con $\alpha/(\alpha + \beta) = \pi$ fijo, la beta se concentra en $\pi$ y la beta-binomial tiende a $\operatorname{Bin}(n, \pi)$.
- **Predicción bayesiana:** es la distribución predictiva de nuevos éxitos cuando la incertidumbre sobre $p$ se describe con una beta.

:::figura[Tres casos con contexto (germinación por lote, sin información, opiniones polarizadas): cada botón carga los parámetros y una frase explica por qué la forma es así.]{componente="DistributionExplorer"}
```yaml
distribucion: beta-binomial
valores:
  n: 10
  alpha: 8
  beta: 2
casos:
  - nombre: 'Germinación por lote'
    descripcion: 'n = 10, α = 8 y β = 2: media 8 pero varianza 2.9, mucho mayor que la binomial, porque los lotes difieren.'
    valores: {n: 10, alpha: 8, beta: 2}
  - nombre: 'Sin información'
    descripcion: 'α = β = 1: todos los conteos de 0 a 10 son igual de probables.'
    valores: {n: 10, alpha: 1, beta: 1}
  - nombre: 'Opiniones polarizadas'
    descripcion: 'α = β = 0.5: forma de U; casi todos los grupos están en un extremo.'
    valores: {n: 10, alpha: 0.5, beta: 0.5}
referencia:
  distribucion: binomial
  valores: {n: 10, p: 0.8}
  etiqueta: 'Binomial con p fija de 0.8'
  visible: true
```
:::

:::figura[Con α = β = 1 la beta es uniforme y la beta-binomial reparte la probabilidad por igual: con n = 10 cada puntaje tiene 1/11.]{componente="DistributionExplorer"}
```yaml
distribucion: beta-binomial
valores:
  n: 10
  alpha: 1
  beta: 1
muestras: false
```
:::

:::figura[Límite binomial: con α = 16 y β = 4 la beta se angosta alrededor de 0.8 y la beta-binomial (barras) ya se parece a la Bin(10, 0.8) (línea punteada).]{componente="DistributionExplorer"}
```yaml
distribucion: beta-binomial
valores:
  n: 10
  alpha: 16
  beta: 4
muestras: false
referencia:
  distribucion: binomial
  valores:
    n: 10
    p: 0.8
  etiqueta: Bin(10, 0.8)
```
:::

:::figura[Con α y β menores que 1 la beta pone su masa cerca de 0 y de 1: casi todos los estudiantes saben todo o nada, y la beta-binomial tiene forma de U.]{componente="DistributionGenesis"}
```yaml
proceso: beta-binomial
valores:
  n: 12
  alpha: 0.5
  beta: 0.5
exito: Correcta
fracaso: Incorrecta
comparar: true
```
:::

:::demostracion
Por la ley de la esperanza total, $\mathbb{E}[X] = \mathbb{E}[nP] = n\pi$. Por la ley de la varianza total, $\operatorname{Var}(X) = \mathbb{E}[nP(1 - P)] + \operatorname{Var}(nP)$. Con $\mathbb{E}[P] = \pi$ y $\operatorname{Var}(P) = \frac{\pi(1 - \pi)}{\alpha + \beta + 1}$ se obtiene $\mathbb{E}[P(1-P)] = \pi(1-\pi)\frac{\alpha+\beta}{\alpha+\beta+1}$, y sumando $n\pi(1-\pi)\frac{\alpha+\beta}{\alpha+\beta+1} + n^{2}\frac{\pi(1-\pi)}{\alpha+\beta+1} = n\pi(1-\pi)\frac{\alpha+\beta+n}{\alpha+\beta+1}$.
:::

## Errores comunes

- **Modelar proporciones heterogéneas con una binomial.** Si las unidades difieren en su probabilidad, la binomial subestima la varianza y produce intervalos demasiado estrechos.
- **Pensar que la mezcla cambia la media.** La media es la misma que la de la binomial con $p = \alpha/(\alpha + \beta)$; lo que cambia es la dispersión.
- **Sortear una p distinta para cada ensayo.** Si cada ensayo usara su propia $p$ independiente, el conteo volvería a ser binomial con $p = \pi$. La sobredispersión aparece porque la misma $p$ se comparte dentro de cada grupo de $n$ ensayos.
- **Confundir α y β con conteos observados.** Funcionan como pseudoconteos de éxitos y fracasos previos, pero no son datos.

:::figura[Mismo promedio, distinta dispersión: con α = 4 y β = 2 la binomial (línea punteada) se concentra entre 11 y 16, mientras que la beta-binomial reparte masa desde 5 hasta 20.]{componente="DistributionExplorer"}
```yaml
distribucion: beta-binomial
valores:
  n: 20
  alpha: 4
  beta: 2
muestras: false
referencia:
  distribucion: binomial
  valores:
    n: 20
    p: 0.6667
  etiqueta: Bin(20, 0.667)
```
:::

## Conexiones

La beta-binomial es una mezcla de la [[distribucion-binomial]] sobre su probabilidad de éxito, y su normalización usa la [[funcion-beta]]. Así como la [[distribucion-binomial-negativa]] es una Poisson con tasa variable, la beta-binomial es una binomial con probabilidad variable: ambas modelan sobredispersión. Con más de dos categorías se generaliza a la Dirichlet-multinomial, mezcla de la [[distribucion-multinomial]]. En estadística bayesiana aparece como distribución predictiva del modelo beta-binomial conjugado.

## Formulario

:::formula[Función de masa]
$$
P(X = k) = \binom{n}{k}\frac{B(k + \alpha,\, n - k + \beta)}{B(\alpha, \beta)}
$$

- $n$: ensayos.
- $\alpha$, $\beta$: parámetros de la beta que genera $p$.
- $k$: éxitos.
- $B(\cdot, \cdot)$: función beta.
:::

:::formula[Construcción jerárquica]
$$
P \sim \operatorname{Beta}(\alpha, \beta), \qquad X \mid P = p \sim \operatorname{Bin}(n, p)
$$

- $P$: probabilidad de éxito sorteada, común a los $n$ ensayos.
- $X \mid P = p$: conteo condicionado a ese valor.
:::

:::formula[Media y varianza]
$$
\mathbb{E}[X] = n\pi, \qquad \operatorname{Var}(X) = n\pi(1 - \pi)\frac{\alpha + \beta + n}{\alpha + \beta + 1}, \qquad \pi = \frac{\alpha}{\alpha + \beta}
$$

- $\pi$: probabilidad media de éxito.
- $\frac{\alpha + \beta + n}{\alpha + \beta + 1}$: factor de sobredispersión.
:::

:::formula[Función beta]
$$
B(a, b) = \int_0^1 t^{a-1}(1-t)^{b-1}\,dt
$$

- $a$, $b$: argumentos positivos.
- $t$: variable de integración.
:::
