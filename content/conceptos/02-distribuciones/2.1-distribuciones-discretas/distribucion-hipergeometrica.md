---
id: distribucion-hipergeometrica
titulo: Distribución hipergeométrica
titulo_en: Hypergeometric distribution
alias:
  - hipergeométrica
  - muestreo sin reemplazo
  - Hiper(N, K, n)
modulo: 2
submodulo: '2.1'
orden: 6
nivel: basico
prerrequisitos:
  - distribucion-binomial
relaciones:
  - tipo: contrasta
    id: distribucion-binomial
etiquetas:
  - distribución discreta
  - sin reemplazo
  - población finita
  - inspección de lotes
resumen: >
  Cuenta los elementos marcados en una muestra de tamaño n extraída sin reemplazo de una población de N
  elementos con K marcados. Las extracciones dependen entre sí, a diferencia de la binomial.
formula: 'P(X = k) = \frac{\binom{K}{k}\binom{N - K}{n - k}}{\binom{N}{n}}'
visualizacion:
  componente: DistributionStudio
  parametros:
    explorador:
      distribucion: hipergeometrica
      valores:
        N: 20
        K: 4
        n: 5
      casos:
        - nombre: 'Lote de medicamentos'
          descripcion: 'N = 20, K = 4 y n = 5: casi siempre aparecen 0, 1 o 2 caducados.'
          valores: {N: 20, K: 4, n: 5}
        - nombre: 'Peces marcados'
          descripcion: 'N = 50, K = 10 y n = 12: media 2.4, menos dispersa que una binomial con p = 0.2.'
          valores: {N: 50, K: 10, n: 12}
        - nombre: 'Muestra casi completa'
          descripcion: 'N = 12, K = 6 y n = 10: con la muestra cerca del total, el conteo queda casi fijo alrededor de 5.'
          valores: {N: 12, K: 6, n: 10}
      ejemplo:
        titulo: 'Detectar caducados'
        contexto: 'Un lote de 20 frascos tiene 4 caducados y un inspector revisa 5 sin reemplazo.'
        pregunta: '¿Qué probabilidad hay de que la inspección detecte al menos un caducado?'
        valores: {N: 20, K: 4, n: 5}
        region: derecha
        desde: 1
      referencia:
        distribucion: binomial
        valores: {n: 5, p: 0.2}
        etiqueta: 'Con reemplazo (binomial)'
        visible: false
    genesis:
      componente: DistributionGenesis
      parametros:
        proceso: urna
        valores:
          N: 50
          K: 10
          n: 12
        exito: Marcado
        fracaso: Sin marca
referencias:
  - clave: blitzstein-hwang
    capitulo: '3'
  - clave: ross-probabilidad
    capitulo: '4'
publicado: true
---

## Intuición

En un estanque hay 50 peces y 10 de ellos llevan una marca puesta en una captura anterior. Una bióloga saca 12 peces con una red y cuenta cuántos están marcados. Los peces capturados no regresan al agua mientras se cuentan, así que cada pez que sale cambia la composición de lo que queda: si el primero estaba marcado, quedan menos marcados para los siguientes.

La distribución hipergeométrica responde cuántos marcados aparecerán en la muestra. Como todas las muestras de 12 peces son igual de probables, basta contar: cuántas muestras tienen exactamente cierto número de marcados, entre cuántas muestras posibles hay en total. Ese cociente de conteos es la probabilidad.

La diferencia con la binomial está en la dependencia. Sin reemplazo, las extracciones se corrigen unas a otras: un exceso de marcados al principio deja menos para después. Por eso la hipergeométrica varía menos que una binomial con la misma proporción. Cuando la población es enorme comparada con la muestra, sacar un pez casi no cambia la proporción y ambas distribuciones se vuelven prácticamente iguales.

## Definición

:::definicion[Distribución hipergeométrica]
Una población tiene $N$ elementos, de los cuales $K$ están marcados. Se extrae al azar una muestra de $n$ elementos sin reemplazo, de modo que todas las muestras de tamaño $n$ son igualmente probables. El número $X$ de marcados en la muestra tiene **distribución hipergeométrica**, $X \sim \operatorname{Hiper}(N, K, n)$, con
$$
P(X = k) = \frac{\binom{K}{k}\binom{N - K}{n - k}}{\binom{N}{n}}, \qquad \max(0,\, n - N + K) \le k \le \min(n, K).
$$
:::

El numerador elige $k$ marcados entre los $K$ y $n - k$ sin marca entre los $N - K$; el denominador cuenta todas las muestras posibles. Los límites de $k$ garantizan que ninguna de esas elecciones sea imposible.

:::nota[Qué es X]
$X$ = el número de elementos marcados que salen en una muestra tomada sin reemplazo.
:::

:::nota[Qué hace cada parámetro]
- **$N$, tamaño de la población:** cuántos elementos hay en total. Si aumenta, con $K$ y $n$ fijos hay menos marcados en proporción y la masa se va a la izquierda.
- **$K$, marcados en la población:** cuántos elementos tienen la característica que se cuenta. Si aumenta, se esperan más marcados en la muestra.
- **$n$, tamaño de la muestra:** cuántos elementos se extraen sin reemplazo. Si aumenta, se esperan más marcados y la distribución se ensancha.
:::

:::nota[Qué significa cada símbolo]
- $X$: número de elementos marcados en la muestra.
- $N$: tamaño de la población.
- $K$: elementos marcados en la población.
- $n$: tamaño de la muestra, extraída sin reemplazo.
- $k$: número de marcados cuya probabilidad se calcula.
- $\binom{K}{k}$: maneras de elegir los marcados de la muestra.
- $\binom{N - K}{n - k}$: maneras de elegir los no marcados.
- $\binom{N}{n}$: número total de muestras posibles.
:::

## Cómo usar la visualización

La pestaña Distribución muestra la función de masa hipergeométrica, la región elegida y su probabilidad; los casos cargan un lote pequeño, un estanque con peces marcados y una muestra casi completa, y el ejemplo de la ficha se carga con su botón. La comparación superpone la binomial con la misma proporción, que corresponde a extraer con reemplazo. La pestaña Ver cómo surge saca bolas de una urna sin devolverlas.

Con la muestra casi completa la hipergeométrica se vuelve muy angosta frente a la binomial. Con una población grande y una muestra pequeña, ambas casi coinciden.

## Ejemplo

Un lote de 20 frascos de medicamento contiene 4 caducados. Un inspector revisa 5 frascos elegidos sin reemplazo. Sea $X$ el número de caducados en la revisión, $X \sim \operatorname{Hiper}(20, 4, 5)$.

1. Número de muestras posibles: $\binom{20}{5} = 15504$.
2. Ningún caducado: $P(X = 0) = \binom{4}{0}\binom{16}{5}/15504 = 4368/15504 \approx 0.2817$.
3. Exactamente uno: $P(X = 1) = \binom{4}{1}\binom{16}{4}/15504 = 4 \cdot 1820/15504 \approx 0.4696$.
4. Probabilidad de detectar al menos un caducado: $1 - 0.2817 = 0.7183$.
5. Media: $5 \cdot 4/20 = 1$; varianza: $5 \cdot 0.2 \cdot 0.8 \cdot \frac{15}{19} \approx 0.632$.

:::figura[La revisión de 5 frascos de un lote de 20 con 4 caducados. La urna pierde un frasco por extracción y el conteo de caducados se acumula abajo.]{componente="DistributionGenesis"}
```yaml
proceso: urna
valores:
  N: 20
  K: 4
  n: 5
exito: Caducado
fracaso: Vigente
```
:::

:::figura[Hiper(20, 4, 5): las barras de 1 a 4 suman 0.7183, la probabilidad de que la inspección detecte algún caducado.]{componente="DistributionExplorer"}
```yaml
distribucion: hipergeometrica
valores:
  N: 20
  K: 4
  n: 5
ejemplo:
  titulo: 'Detectar caducados'
  contexto: 'Un lote de 20 frascos tiene 4 caducados y un inspector revisa 5 sin reemplazo.'
  pregunta: '¿Qué probabilidad hay de que la inspección detecte al menos un caducado?'
  valores: {N: 20, K: 4, n: 5}
  region: derecha
  desde: 1
region: derecha
desde: 1
muestras: false
referencia:
  distribucion: binomial
  valores: {n: 5, p: 0.2}
  etiqueta: 'Con reemplazo (binomial)'
  visible: false
```
:::

## Propiedades

- **Media:** $\mathbb{E}[X] = n\dfrac{K}{N}$, igual que la binomial con $p = K/N$.
- **Varianza:** $\operatorname{Var}(X) = n\dfrac{K}{N}\left(1 - \dfrac{K}{N}\right)\dfrac{N - n}{N - 1}$. El último factor, la corrección por población finita, es menor que 1.
- **Soporte acotado:** no puede haber más marcados que $K$ ni que $n$, y si $n > N - K$ la muestra contiene al menos $n - (N - K)$ marcados.
- **Simetría de papeles:** $\operatorname{Hiper}(N, K, n)$ y $\operatorname{Hiper}(N, n, K)$ son la misma distribución.
- **Límite binomial:** si $N \to \infty$ con $K/N \to p$ y $n$ fijo, la hipergeométrica tiende a $\operatorname{Bin}(n, p)$.

:::figura[Tres casos con contexto (lote de medicamentos, peces marcados, muestra casi completa): cada botón carga los parámetros y una frase explica por qué la forma es así.]{componente="DistributionExplorer"}
```yaml
distribucion: hipergeometrica
valores:
  N: 20
  K: 4
  n: 5
casos:
  - nombre: 'Lote de medicamentos'
    descripcion: 'N = 20, K = 4 y n = 5: casi siempre aparecen 0, 1 o 2 caducados.'
    valores: {N: 20, K: 4, n: 5}
  - nombre: 'Peces marcados'
    descripcion: 'N = 50, K = 10 y n = 12: media 2.4, menos dispersa que una binomial con p = 0.2.'
    valores: {N: 50, K: 10, n: 12}
  - nombre: 'Muestra casi completa'
    descripcion: 'N = 12, K = 6 y n = 10: con la muestra cerca del total, el conteo queda casi fijo alrededor de 5.'
    valores: {N: 12, K: 6, n: 10}
referencia:
  distribucion: binomial
  valores: {n: 5, p: 0.2}
  etiqueta: 'Con reemplazo (binomial)'
  visible: false
```
:::

:::figura[Soporte acotado: con N = 10, K = 7 y n = 6 solo hay 3 bolas sin marca, así que la muestra tiene al menos 3 marcadas. Las barras de 0, 1 y 2 valen cero.]{componente="DistributionExplorer"}
```yaml
distribucion: hipergeometrica
valores:
  N: 10
  K: 7
  n: 6
dominio: [-0.5, 6.5]
muestras: false
```
:::

:::figura[Límite binomial: con 100 bolas, 30 marcadas y solo 5 extracciones, la hipergeométrica y la binomial con p = 0.3 (línea punteada) casi coinciden.]{componente="DistributionGenesis"}
```yaml
proceso: urna
valores:
  N: 100
  K: 30
  n: 5
comparar: true
```
:::

:::demostracion
Escribimos $X = \sum_{i=1}^{n} I_i$, donde $I_i$ indica si la extracción $i$ está marcada. Por simetría, $P(I_i = 1) = K/N$, de donde $\mathbb{E}[X] = nK/N$. Para $i \ne j$, $P(I_i = 1, I_j = 1) = \frac{K}{N}\frac{K - 1}{N - 1}$, así que $\operatorname{Cov}(I_i, I_j) = -\frac{K(N - K)}{N^{2}(N - 1)}$. Sumando $n$ varianzas $\frac{K}{N}(1 - \frac{K}{N})$ y $n(n - 1)$ covarianzas se obtiene $\operatorname{Var}(X) = n\frac{K}{N}(1 - \frac{K}{N})\left[1 - \frac{n - 1}{N - 1}\right]$, que es la fórmula con el factor $\frac{N - n}{N - 1}$.
:::

## Errores comunes

- **Usar la binomial en poblaciones pequeñas.** Con 12 bolas, 6 marcadas y 8 extracciones sin reemplazo, la hipergeométrica tiene varianza 0.73, mientras que la binomial con $p = 0.5$ tiene 2. La binomial exagera la incertidumbre.
- **Olvidar la corrección por población finita.** Si se muestrea todo, $n = N$, la varianza es cero: la muestra contiene exactamente $K$ marcados.
- **Confundir los parámetros.** Una tabla puede escribir $(N, K, n)$ y otra $(K, N - K, n)$; antes de calcular hay que identificar población, marcados y muestra.
- **Suponer que cualquier conteo es posible.** Con $N = 10$, $K = 7$ y $n = 6$, obtener 2 o menos marcados es imposible.

:::figura[Con 12 bolas, 6 marcadas y 8 extracciones, la hipergeométrica (puntos) es mucho más angosta que la binomial con p = 0.5 (línea punteada).]{componente="DistributionGenesis"}
```yaml
proceso: urna
valores:
  N: 12
  K: 6
  n: 8
comparar: true
```
:::

:::figura[Muestreo completo: al extraer las 12 bolas sin reemplazo, el resultado es siempre 6 y la varianza teórica vale cero.]{componente="DistributionGenesis"}
```yaml
proceso: urna
valores:
  N: 12
  K: 6
  n: 12
```
:::

## Conexiones

La hipergeométrica se obtiene contando [[combinaciones]] en un espacio equiprobable de muestras. Es la versión sin reemplazo de la [[distribucion-binomial]], a la que se aproxima cuando la población es grande. Con más de dos tipos de elementos se generaliza a la hipergeométrica multivariada, la versión sin reemplazo de la [[distribucion-multinomial]]. Es la base de la prueba exacta de Fisher para tablas de contingencia y del método de captura y recaptura para estimar tamaños de poblaciones animales. El [[mapa-de-relaciones-entre-distribuciones]] la sitúa entre las demás distribuciones.

## Formulario

:::formula[Función de masa]
$$
P(X = k) = \frac{\binom{K}{k}\binom{N - K}{n - k}}{\binom{N}{n}}
$$

- $N$: tamaño de la población.
- $K$: marcados en la población.
- $n$: tamaño de la muestra.
- $k$: marcados en la muestra.
:::

:::formula[Soporte]
$$
\max(0,\, n - N + K) \le k \le \min(n, K)
$$

- $n - N + K$: marcados mínimos cuando los no marcados se agotan.
- $\min(n, K)$: no hay más marcados que la muestra ni que la población.
:::

:::formula[Media y varianza]
$$
\mathbb{E}[X] = n\frac{K}{N}, \qquad \operatorname{Var}(X) = n\frac{K}{N}\left(1 - \frac{K}{N}\right)\frac{N - n}{N - 1}
$$

- $K/N$: proporción de marcados en la población.
- $\frac{N - n}{N - 1}$: corrección por población finita.
:::

:::formula[Límite binomial]
$$
\operatorname{Hiper}(N, K, n) \to \operatorname{Bin}(n, p) \quad \text{si } N \to \infty,\ K/N \to p
$$

- $p$: proporción límite de marcados.
- $n$: se mantiene fijo.
:::
