---
id: convergencia-en-media-cuadratica
titulo: Convergencia en media cuadrática
titulo_en: Convergence in mean square
alias:
  - convergencia en L2
  - convergencia en media de orden 2
  - convergencia en media r
modulo: 3
submodulo: '3.1'
orden: 4
nivel: intermedio
prerrequisitos:
  - convergencia-en-probabilidad
etiquetas:
  - convergencia
  - error cuadrático medio
  - esperanza
  - estimadores
resumen: >
  Xₙ converge en media cuadrática a X si el error cuadrático medio E[(Xₙ - X)²] tiende a cero. Implica
  convergencia en probabilidad y es la forma natural de medir la precisión de un estimador.
formula: 'X_n \xrightarrow{L^2} X \iff \lim_{n \to \infty} \mathbb{E}\big[(X_n - X)^2\big] = 0'
visualizacion:
  componente: ConvergenceViz
  parametros:
    modo: media-cuadratica
    sucesion: ruido-decreciente
    sucesiones:
      - ruido-decreciente
      - media-moneda
      - maquina-de-escribir
      - pico-creciente
    trayectorias: 150
    horizonte: 400
referencias:
  - clave: casella-berger
    capitulo: '5.5'
  - clave: wasserman
publicado: true
---

## Intuición

Una encuestadora estima la proporción de votantes que apoya una propuesta. Su error en una encuesta concreta puede ser grande o pequeño, pero la empresa evalúa su método con un promedio: el error al cuadrado promedio sobre todas las encuestas que podría haber hecho. Si ese promedio se va a cero al aumentar el tamaño de muestra, el método es cada vez más preciso en un sentido muy concreto y cuantificable.

Eso es la convergencia en media cuadrática. Elevar al cuadrado castiga mucho los errores grandes, así que este modo no tolera que haya errores enormes, aunque sean raros. Por eso es exigente: una sucesión puede estar en cero casi siempre y aun así no converger en media cuadrática si, con probabilidad pequeña, toma valores gigantescos. A cambio, cuando se cumple, da directamente una cota de la probabilidad de error mediante la desigualdad de Markov, y por tanto implica convergencia en probabilidad.

## Definición

:::definicion[Convergencia en media cuadrática]
Sean $X_n$ y $X$ variables aleatorias con $\mathbb{E}[X_n^2] < \infty$ y $\mathbb{E}[X^2] < \infty$. La sucesión **converge en media cuadrática** (o en $L^2$) a $X$, y se escribe $X_n \xrightarrow{L^2} X$, si
$$
\lim_{n \to \infty} \mathbb{E}\big[(X_n - X)^2\big] = 0.
$$
:::

Más en general, para $r \ge 1$, $X_n$ **converge en media de orden $r$** si $\mathbb{E}\big[|X_n - X|^r\big] \to 0$. Cuando el límite es una constante $\theta$ y $X_n = \hat{\theta}_n$ es un estimador, $\mathbb{E}[(\hat{\theta}_n - \theta)^2]$ es su **error cuadrático medio**, que se descompone como
$$
\mathbb{E}\big[(\hat{\theta}_n - \theta)^2\big] = \operatorname{Var}(\hat{\theta}_n) + \big(\mathbb{E}[\hat{\theta}_n] - \theta\big)^2.
$$

:::nota[Qué significa cada símbolo]
- $X_n$: término $n$ de la sucesión; $X$, el límite.
- $\mathbb{E}[(X_n - X)^2]$: esperanza del cuadrado de la diferencia, el error cuadrático medio.
- $\xrightarrow{L^2}$: "converge en media cuadrática a".
- $r$: orden del momento; $r = 2$ es la media cuadrática y $r = 1$, la media absoluta.
- $\hat{\theta}_n$: estimador con $n$ datos; $\theta$, el parámetro.
- $\operatorname{Var}(\hat{\theta}_n)$: varianza del estimador; $\mathbb{E}[\hat{\theta}_n] - \theta$, su sesgo.
:::

## Cómo usar la visualización

Arriba se dibujan las trayectorias de $X_n - X$. Abajo, en escala logarítmica, la línea oscura es el promedio de $(X_n - X)^2$ sobre todas las trayectorias y la discontinua, el valor exacto $\mathbb{E}[(X_n - X)^2]$. Una recta descendente en esta escala indica que el error decrece como una potencia de $n$.

Con el ruido que se reduce como $1/\sqrt{n}$ el error cuadrático baja como $1/n$, una recta de pendiente $-1$. La máquina de escribir también converge, pero más despacio, como $1/\sqrt{2n}$, y por escalones. Con el pico creciente $n\,\mathbf{1}\{U < 1/n\}$ la curva exacta crece como $n$, mientras que el promedio simulado cae a cero en cuanto ninguna trayectoria tiene picos: la simulación no ve los valores raros que dominan la esperanza.

## Ejemplo

Una encuesta estima la proporción $p = 0.3$ de votantes que apoyan una propuesta con $\hat{p}_n = \frac{1}{n}\sum_{i=1}^n B_i$, donde $B_i \sim \operatorname{Bernoulli}(p)$ son las respuestas independientes.

1. El estimador es insesgado: $\mathbb{E}[\hat{p}_n] = p$, así que el error cuadrático medio es la varianza.
2. $\mathbb{E}[(\hat{p}_n - p)^2] = \operatorname{Var}(\hat{p}_n) = \frac{p(1-p)}{n} = \frac{0.21}{n}$.
3. Con $n = 400$: $\frac{0.21}{400} = 0.000525$; la raíz del error cuadrático medio es $0.0229$, unos 2.3 puntos porcentuales.
4. Como $0.21/n \to 0$, $\hat{p}_n \xrightarrow{L^2} p$.
5. Por la desigualdad de Markov aplicada a $(\hat{p}_n - p)^2$: $P(|\hat{p}_n - p| > 0.05) \le \frac{0.000525}{0.05^2} = 0.21$. La convergencia en media cuadrática ya da la convergencia en probabilidad.

:::figura[El ejemplo con una proporción: el error cuadrático medio de la proporción de volados es 1/(4n) y en escala logarítmica forma una recta de pendiente -1.]{componente="ConvergenceViz"}
```yaml
modo: media-cuadratica
sucesion: media-moneda
trayectorias: 200
horizonte: 400
```
:::

## Propiedades

- **Implica convergencia en probabilidad:** por Markov, $P(|X_n - X| > \varepsilon) \le \mathbb{E}[(X_n - X)^2]/\varepsilon^2$.
- **Jerarquía de órdenes:** si $r > s \ge 1$, la convergencia en media de orden $r$ implica la de orden $s$, por la desigualdad de Jensen.
- **Convergencia de momentos:** si $X_n \xrightarrow{L^2} X$, entonces $\mathbb{E}[X_n] \to \mathbb{E}[X]$ y $\mathbb{E}[X_n^2] \to \mathbb{E}[X^2]$.
- **Criterio para estimadores:** $\hat{\theta}_n \xrightarrow{L^2} \theta$ si y solo si la varianza y el sesgo tienden a cero.
- **No implica convergencia casi segura:** la máquina de escribir converge en media cuadrática y ninguna trayectoria converge.

:::figura[Propiedad: media cuadrática sin convergencia casi segura. El error cuadrático de la máquina de escribir es 1/k en el bloque k y tiende a cero aunque cada trayectoria siga saltando a 1.]{componente="ConvergenceViz"}
```yaml
modo: media-cuadratica
sucesion: maquina-de-escribir
trayectorias: 100
horizonte: 500
```
:::

:::demostracion
Para la convergencia de las esperanzas: por la desigualdad de Cauchy-Schwarz, $|\mathbb{E}[X_n] - \mathbb{E}[X]| \le \mathbb{E}|X_n - X| \le \sqrt{\mathbb{E}[(X_n - X)^2]} \to 0$.
:::

## Errores comunes

- **Creer que convergencia casi segura o en probabilidad implica media cuadrática.** $X_n = n\,\mathbf{1}\{U < 1/n\}$ converge a 0 casi seguramente, pero $\mathbb{E}[X_n^2] = n^2 \cdot \frac{1}{n} = n \to \infty$.
- **Confundir el error cuadrático medio con la varianza.** Coinciden solo si el estimador es insesgado; en general se suma el sesgo al cuadrado.
- **Estimarlo con pocas simulaciones cuando hay valores raros enormes.** El promedio simulado de $X_n^2$ puede ser cero mientras la esperanza verdadera crece sin límite.
- **Suponer que existe.** Si $\mathbb{E}[X_n^2] = \infty$, este modo ni siquiera está definido.

:::figura[Error común: convergencia en probabilidad sin media cuadrática. El pico n · 1{U < 1/n} casi siempre vale 0, pero E[Xₙ²] = n crece; el promedio simulado lo subestima porque los picos son raros.]{componente="ConvergenceViz"}
```yaml
modo: media-cuadratica
sucesion: pico-creciente
trayectorias: 300
horizonte: 300
```
:::

## Conexiones

Implica la [[convergencia-en-probabilidad]] y no guarda relación de implicación con la [[convergencia-casi-segura]], como resume [[relaciones-entre-modos-de-convergencia]]. Su cálculo usa las desigualdades de Markov y de Chebyshev y la descomposición del error en varianza y sesgo. Es el modo en que la media muestral converge en la [[ley-debil-de-los-grandes-numeros]] cuando la varianza es finita, y la base de la geometría de [[espacios-vectoriales]] de variables aleatorias, donde $\sqrt{\mathbb{E}[X^2]}$ actúa como una [[normas-vectoriales|norma]].

## Formulario

:::formula[Convergencia en media cuadrática]
$$
X_n \xrightarrow{L^2} X \iff \mathbb{E}\big[(X_n - X)^2\big] \to 0
$$

- $X_n$: término $n$.
- $X$: límite.
- $\mathbb{E}$: esperanza.
:::

:::formula[Convergencia en media de orden r]
$$
\mathbb{E}\big[|X_n - X|^r\big] \to 0, \quad r \ge 1
$$

- $r$: orden del momento.
:::

:::formula[Descomposición del error cuadrático medio]
$$
\mathbb{E}\big[(\hat{\theta}_n - \theta)^2\big] = \operatorname{Var}(\hat{\theta}_n) + \big(\mathbb{E}[\hat{\theta}_n] - \theta\big)^2
$$

- $\hat{\theta}_n$: estimador.
- $\theta$: parámetro.
- $\operatorname{Var}$: varianza; el segundo término es el sesgo al cuadrado.
:::

:::formula[De media cuadrática a probabilidad]
$$
P\big(|X_n - X| > \varepsilon\big) \le \frac{\mathbb{E}[(X_n - X)^2]}{\varepsilon^2}
$$

- $\varepsilon$: tolerancia positiva.
:::

:::formula[Proporción muestral]
$$
\mathbb{E}\big[(\hat{p}_n - p)^2\big] = \frac{p(1 - p)}{n}
$$

- $\hat{p}_n$: proporción observada en $n$ respuestas.
- $p$: proporción real.
- $n$: tamaño de muestra.
:::
