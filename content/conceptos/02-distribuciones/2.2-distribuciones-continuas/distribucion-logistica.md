---
id: distribucion-logistica
titulo: Distribución logística
titulo_en: Logistic distribution
alias:
  - logística
  - distribución de la función sigmoide
modulo: 2
submodulo: '2.2'
orden: 17
nivel: basico
prerrequisitos:
  - distribucion-uniforme-continua
  - funcion-sigmoide-y-funcion-softplus
relaciones:
  - tipo: contrasta
    id: distribucion-de-laplace
etiquetas:
  - distribución continua
  - función sigmoide
  - log-momios
  - modelos de elección
resumen: >
  Distribución simétrica cuya función de distribución es la curva sigmoide. Es la distribución del
  logaritmo de los momios de una uniforme y está detrás de la regresión logística.
formula: 'F(x) = \frac{1}{1 + e^{-(x - \mu)/s}}'
visualizacion:
  componente: DistributionStudio
  parametros:
    explorador:
      distribucion: logistica
      valores:
        mu: 0
        s: 1
      casos:
        - nombre: 'Logística estándar'
          descripcion: 's = 1: campana simétrica con desviación 1.81; su función de distribución es la sigmoide.'
          valores: {mu: 0, s: 1}
        - nombre: 'Umbral desplazado'
          descripcion: 'μ = 2: la variable latente de una elección con un umbral más alto; toda la curva se mueve sin cambiar de forma.'
          valores: {mu: 2, s: 1}
        - nombre: 'Decisión muy ruidosa'
          descripcion: 's = 2.5: la curva se ensancha y la sigmoide sube más despacio.'
          valores: {mu: 0, s: 2.5}
      ejemplo:
        titulo: 'Ventaja en ajedrez'
        contexto: 'En la logística estándar, el valor 1.15 equivale a una ventaja de 200 puntos de calificación.'
        pregunta: '¿Qué probabilidad de ganar tiene el jugador con esa ventaja?'
        valores: {mu: 0, s: 1}
        region: izquierda
        desde: 1.15
      referencia:
        distribucion: normal
        valores: {mu: 0, sigma: 1.814}
        etiqueta: 'Normal de la misma varianza'
        visible: false
    genesis:
      componente: ContinuousGenesis
      parametros:
        proceso: log-momios
        valores:
          mu: 0
          s: 1
referencias:
  - clave: agresti
  - clave: james-isl
    capitulo: '4'
publicado: true
---

## Intuición

En el ajedrez, la probabilidad de que un jugador le gane a otro depende de la diferencia entre sus calificaciones. Si son iguales, la probabilidad es 1/2; si uno tiene 200 puntos más, gana alrededor de tres de cada cuatro partidas; con 800 puntos más, casi siempre. La curva que pasa de 0 a 1 conforme crece la diferencia tiene forma de S: es la función sigmoide, y la distribución cuya función acumulada es esa curva se llama logística.

Su densidad se parece mucho a la normal: es simétrica y tiene forma de campana. La diferencia es que sus colas son un poco más pesadas, de tipo exponencial. Su ventaja práctica es que la función de distribución tiene una fórmula cerrada y su inversa también: el logaritmo de los momios, $\log\frac{p}{1 - p}$. Por eso transforma probabilidades en números reales y viceversa con mucha facilidad.

Esa conexión explica su papel en estadística: en la regresión logística se supone que una variable latente con distribución logística decide el resultado, de modo que la probabilidad de éxito es la sigmoide de una combinación lineal de predictores.

## Definición

:::definicion[Distribución logística]
Una variable $X$ tiene **distribución logística** con localización $\mu$ y escala $s > 0$ si
$$
F(x) = \frac{1}{1 + e^{-(x - \mu)/s}}, \qquad f(x) = \frac{e^{-(x - \mu)/s}}{s\left(1 + e^{-(x - \mu)/s}\right)^{2}}.
$$
:::

**Construcción:** si $U \sim U(0, 1)$, entonces $\mu + s\log\frac{U}{1 - U}$ tiene distribución logística; es decir, el logaritmo de los momios de una probabilidad uniforme es logístico.

:::nota[Qué es X]
$X$ = un valor con forma de campana y colas algo más pesadas que la normal, como el logaritmo de los momios de un evento.
:::

:::nota[Qué hace cada parámetro]
- **$\mu$, localización:** el centro: media, mediana y moda. Si aumenta, la curva se desliza a la derecha.
- **$s$, escala:** la dispersión; la desviación estándar es $s\pi/\sqrt{3}$. Si aumenta, la curva se ensancha y baja.
:::

:::nota[Qué significa cada símbolo]
- $X$: variable logística.
- $\mu$: localización, que es media, mediana y moda.
- $s$: escala; la desviación estándar es $s\pi/\sqrt{3}$.
- $F(x)$: función sigmoide desplazada y escalada.
- $U$: uniforme estándar.
- $\log\frac{U}{1 - U}$: logaritmo de los momios.
:::

## Cómo usar la visualización

La pestaña Distribución muestra la densidad logística, la región elegida y su probabilidad; la comparación superpone la normal de la misma varianza. Los casos desplazan y ensanchan la curva, y el ejemplo de la ficha se carga con su botón. La pestaña Ver cómo surge toma una probabilidad uniforme y la convierte en el logaritmo de sus momios.

En la vista de función de distribución aparece la sigmoide. Con la comparación activada, la logística y la normal casi coinciden en el centro, pero en la región de colas más allá de $\pm 4$ la logística conserva más probabilidad.

## Ejemplo

En el sistema de calificación de ajedrez, la probabilidad de que un jugador gane es $F(d)$ con $d$ la diferencia de calificaciones y una logística de escala $s = 400/\log 10 \approx 173.7$.

1. Con $d = 0$: $F(0) = 0.5$.
2. Con $d = 200$: $F(200) = \frac{1}{1 + 10^{-200/400}} = \frac{1}{1 + 0.316} \approx 0.760$.
3. Con $d = -200$: por simetría, $1 - 0.760 = 0.240$.
4. La desviación estándar de la variable latente es $173.7 \cdot \pi/\sqrt{3} \approx 315$ puntos.

:::figura[Logística estándar: el valor 1.15 equivale a 200 puntos de ventaja en la escala de calificaciones; la región hasta 1.15 acumula 0.760.]{componente="DistributionExplorer"}
```yaml
distribucion: logistica
valores:
  mu: 0
  s: 1
ejemplo:
  titulo: 'Ventaja en ajedrez'
  contexto: 'En la logística estándar, el valor 1.15 equivale a una ventaja de 200 puntos de calificación.'
  pregunta: '¿Qué probabilidad de ganar tiene el jugador con esa ventaja?'
  valores: {mu: 0, s: 1}
  region: izquierda
  desde: 1.15
region: izquierda
desde: 1.15
muestras: false
referencia:
  distribucion: normal
  valores: {mu: 0, sigma: 1.814}
  etiqueta: 'Normal de la misma varianza'
  visible: false
```
:::

## Propiedades

- **Media y varianza:** $\mathbb{E}[X] = \mu$ y $\operatorname{Var}(X) = \frac{s^{2}\pi^{2}}{3}$.
- **Cuantil explícito:** $F^{-1}(p) = \mu + s\log\frac{p}{1 - p}$.
- **Densidad y sigmoide:** $f(x) = \frac{1}{s}F(x)\left[1 - F(x)\right]$.
- **Colas:** decaen como $e^{-|x - \mu|/s}$, más pesadas que las normales y con exceso de curtosis 1.2.
- **Diferencia de Gumbel:** la diferencia de dos variables de Gumbel independientes con la misma escala es logística, lo que la conecta con los modelos de elección.
- **Cercanía con la normal:** una logística con $s = 1$ se parece a una normal con desviación 1.7.

:::figura[Tres casos con contexto (logística estándar, umbral desplazado, decisión muy ruidosa): cada botón carga los parámetros y una frase explica por qué la forma es así.]{componente="DistributionExplorer"}
```yaml
distribucion: logistica
valores:
  mu: 0
  s: 1
casos:
  - nombre: 'Logística estándar'
    descripcion: 's = 1: campana simétrica con desviación 1.81; su función de distribución es la sigmoide.'
    valores: {mu: 0, s: 1}
  - nombre: 'Umbral desplazado'
    descripcion: 'μ = 2: la variable latente de una elección con un umbral más alto; toda la curva se mueve sin cambiar de forma.'
    valores: {mu: 2, s: 1}
  - nombre: 'Decisión muy ruidosa'
    descripcion: 's = 2.5: la curva se ensancha y la sigmoide sube más despacio.'
    valores: {mu: 0, s: 2.5}
referencia:
  distribucion: normal
  valores: {mu: 0, sigma: 1.814}
  etiqueta: 'Normal de la misma varianza'
  visible: false
```
:::

:::figura[Logaritmo de los momios: cada resultado transforma una probabilidad uniforme U en log(U/(1 - U)); el histograma forma la logística.]{componente="ContinuousGenesis"}
```yaml
proceso: log-momios
valores:
  mu: 0
  s: 1
```
:::

:::figura[La función de distribución es la sigmoide: el cuantil 0.9 de la logística estándar es log 9 = 2.20.]{componente="DistributionExplorer"}
```yaml
distribucion: logistica
valores:
  mu: 0
  s: 1
vista: acumulada
probabilidad: 0.9
muestras: false
```
:::

## Errores comunes

- **Confundir la escala con la desviación estándar.** La desviación es $s\pi/\sqrt{3} \approx 1.81s$.
- **Pensar que es idéntica a la normal.** Son parecidas en el centro, pero las colas logísticas son más pesadas; los modelos logit y probit difieren sobre todo en probabilidades extremas.
- **Leer los coeficientes de una regresión logística como cambios en probabilidad.** Cambian el logaritmo de los momios; el efecto en probabilidad depende de dónde se esté en la sigmoide.
- **Olvidar que el centro es suave.** A diferencia de la Laplace, la logística no tiene vértice.

:::figura[Logística estándar (curva) frente a la normal con la misma varianza (línea punteada): casi iguales en el centro, la logística conserva más masa en las colas.]{componente="DistributionExplorer"}
```yaml
distribucion: logistica
valores:
  mu: 0
  s: 1
dominio: [-8, 8]
muestras: false
referencia:
  distribucion: normal
  valores:
    mu: 0
    sigma: 1.814
  etiqueta: Normal de la misma varianza
```
:::

## Conexiones

La función de distribución logística es la [[funcion-sigmoide-y-funcion-softplus|función sigmoide]], y la distribución se obtiene transformando la [[distribucion-uniforme-continua]] con el logaritmo de los momios. Es pariente de la [[distribucion-de-laplace]], con colas parecidas y centro suave, y surge como diferencia de dos variables de la [[distribucion-de-gumbel]]. Es la base de la regresión logística y de los modelos de elección discreta. El [[mapa-de-relaciones-entre-distribuciones]] la sitúa entre las demás distribuciones.

## Formulario

:::formula[Distribución y densidad]
$$
F(x) = \frac{1}{1 + e^{-(x - \mu)/s}}, \qquad f(x) = \frac{1}{s}F(x)\left[1 - F(x)\right]
$$

- $\mu$: localización.
- $s$: escala.
:::

:::formula[Cuantil]
$$
F^{-1}(p) = \mu + s\log\frac{p}{1 - p}
$$

- $p$: probabilidad acumulada.
- $\log\frac{p}{1 - p}$: logaritmo de los momios.
:::

:::formula[Media y varianza]
$$
\mathbb{E}[X] = \mu, \qquad \operatorname{Var}(X) = \frac{s^{2}\pi^{2}}{3}
$$

- La desviación estándar es $s\pi/\sqrt{3}$.
:::

:::formula[Probabilidad en el sistema de ajedrez]
$$
P(\text{gana}) = \frac{1}{1 + 10^{-d/400}}
$$

- $d$: diferencia de calificaciones; equivale a una logística con $s = 400/\log 10$.
:::
