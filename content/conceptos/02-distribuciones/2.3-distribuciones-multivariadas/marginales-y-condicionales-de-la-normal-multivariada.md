---
id: marginales-y-condicionales-de-la-normal-multivariada
titulo: Marginales y condicionales de la normal multivariada
titulo_en: Marginal and conditional distributions of the multivariate normal
alias:
  - condicional de la normal
  - complemento de Schur
  - regresión en la normal bivariada
modulo: 2
submodulo: '2.3'
orden: 4
nivel: intermedio
prerrequisitos:
  - normal-bivariada-y-sus-contornos
relaciones:
  - tipo: relacionado
    id: distribucion-normal-multivariada
etiquetas:
  - distribución condicional
  - distribución marginal
  - regresión lineal
  - complemento de Schur
  - predicción
resumen: >
  Las marginales y las condicionales de una normal multivariada son normales. La media condicional es
  lineal en el valor observado y la varianza condicional no depende de él.
formula: 'X_2 \mid X_1 = a \;\sim\; \mathcal{N}\!\left(\mu_2 + \rho\frac{\sigma_2}{\sigma_1}(a - \mu_1),\ \sigma_2^{2}(1 - \rho^{2})\right)'
visualizacion:
  componente: MultivariateExplorer
  parametros:
    modo: condicional
    valores:
      mu1: 0
      mu2: 0
      sigma1: 2
      sigma2: 2
      rho: 0.7
      corte: 3
    casos:
      - nombre: 'Temperatura de hoy y mañana'
        descripcion: 'Anomalías de temperatura en °C con σ = 2 y ρ = 0.7: saber que hoy hizo 3 °C más de lo normal mueve el pronóstico de mañana a 2.1 °C y reduce su varianza a la mitad.'
        valores: {mu1: 0, mu2: 0, sigma1: 2, sigma2: 2, rho: 0.7, corte: 3}
      - nombre: 'Estaturas de padres e hijos'
        descripcion: 'ρ = 0.5 en unidades estándar: un padre dos desviaciones arriba predice un hijo solo una desviación arriba; es la regresión a la media.'
        valores: {mu1: 0, mu2: 0, sigma1: 1, sigma2: 1, rho: 0.5, corte: 2}
      - nombre: 'Variables independientes'
        descripcion: 'ρ = 0: observar X₁ no cambia nada; la condicional coincide con la marginal.'
        valores: {mu1: 0, mu2: 0, sigma1: 1.5, sigma2: 1, rho: 0, corte: 2}
referencias:
  - clave: blitzstein-hwang
  - clave: bishop
  - clave: murphy
publicado: true
---

## Intuición

Antes de saber nada, la anomalía de temperatura de mañana (cuánto más caliente o más fría estará que lo normal) puede caer en un rango amplio. Pero si hoy hizo tres grados más de lo normal, el panorama cambia: los días calurosos suelen venir seguidos de días calurosos. El pronóstico de mañana se desplaza hacia arriba y además se vuelve más preciso.

La normal multivariada hace este razonamiento con fórmulas cerradas. Ignorar una variable y quedarse con la otra da la **marginal**, que es simplemente la normal de esa variable con su media y su varianza. Fijar el valor de una variable y preguntar cómo se distribuye la otra da la **condicional**, que también es normal.

La media condicional sigue una recta: sube proporcionalmente al valor observado, con pendiente que depende de la correlación. La varianza condicional es siempre menor que la marginal cuando hay correlación, y es la misma sin importar qué valor se haya observado. Geométricamente, la condicional es la rebanada vertical de la campana bivariada en el valor observado, vuelta a escalar para que su área sea uno.

## Definición

Sea $\mathbf{X} = (\mathbf{X}_a, \mathbf{X}_b) \sim \mathcal{N}(\boldsymbol{\mu}, \boldsymbol{\Sigma})$ con
$$
\boldsymbol{\mu} = \begin{pmatrix} \boldsymbol{\mu}_a \\ \boldsymbol{\mu}_b \end{pmatrix}, \qquad \boldsymbol{\Sigma} = \begin{pmatrix} \boldsymbol{\Sigma}_{aa} & \boldsymbol{\Sigma}_{ab} \\ \boldsymbol{\Sigma}_{ba} & \boldsymbol{\Sigma}_{bb} \end{pmatrix}.
$$

:::teorema[Marginales y condicionales]
1. La marginal de $\mathbf{X}_a$ es $\mathcal{N}(\boldsymbol{\mu}_a, \boldsymbol{\Sigma}_{aa})$.
2. La condicional de $\mathbf{X}_a$ dado $\mathbf{X}_b = \mathbf{x}_b$ es normal con
$$
\boldsymbol{\mu}_{a \mid b} = \boldsymbol{\mu}_a + \boldsymbol{\Sigma}_{ab}\boldsymbol{\Sigma}_{bb}^{-1}(\mathbf{x}_b - \boldsymbol{\mu}_b), \qquad \boldsymbol{\Sigma}_{a \mid b} = \boldsymbol{\Sigma}_{aa} - \boldsymbol{\Sigma}_{ab}\boldsymbol{\Sigma}_{bb}^{-1}\boldsymbol{\Sigma}_{ba}.
$$
:::

En dos dimensiones, con $X_1$ observado igual a $a$:
$$
\mathbb{E}[X_2 \mid X_1 = a] = \mu_2 + \rho\frac{\sigma_2}{\sigma_1}(a - \mu_1), \qquad \operatorname{Var}(X_2 \mid X_1 = a) = \sigma_2^{2}(1 - \rho^{2}).
$$

:::nota[Qué es X]
$X$ = el par $(X_1, X_2)$, por ejemplo la anomalía de temperatura de hoy y la de mañana, en °C respecto al promedio de esas fechas.
:::

:::nota[Qué hace cada parámetro]
- **$a$, valor observado de $X_1$:** dónde se corta la campana. Si aumenta, la media condicional sube a lo largo de la recta de regresión y la varianza condicional no cambia.
- **$\rho$, correlación:** cuánto informa $X_1$ sobre $X_2$. Si aumenta en valor absoluto, la pendiente crece y la varianza condicional baja por el factor $1 - \rho^{2}$.
- **$\sigma_1, \sigma_2$, desviaciones:** las escalas. Si aumenta $\sigma_2$, la condicional se ensancha; si aumenta $\sigma_1$, la pendiente $\rho\sigma_2/\sigma_1$ baja.
:::

:::nota[Qué significa cada símbolo]
- $\mathbf{X}_a$, $\mathbf{X}_b$: dos bloques de componentes de $\mathbf{X}$; $\mathbf{x}_b$: valor observado del segundo.
- $\boldsymbol{\mu}_a$, $\boldsymbol{\mu}_b$: medias de cada bloque.
- $\boldsymbol{\Sigma}_{aa}$, $\boldsymbol{\Sigma}_{bb}$: covarianzas de cada bloque; $\boldsymbol{\Sigma}_{ab} = \boldsymbol{\Sigma}_{ba}^{\top}$: covarianza cruzada.
- $\boldsymbol{\mu}_{a \mid b}$, $\boldsymbol{\Sigma}_{a \mid b}$: media y covarianza condicionales; esta última es el complemento de Schur.
- $\mu_i$, $\sigma_i$, $\rho$: medias, desviaciones y correlación en dos dimensiones; $a$: valor observado de $X_1$.
:::

## Cómo usar la visualización

A la izquierda están los contornos de la normal bivariada, la recta de regresión $\mathbb{E}[X_2 \mid X_1]$ y un corte vertical en $X_1 = a$ con el intervalo condicional del 95 %; el punto del corte se arrastra horizontalmente. A la derecha se comparan la densidad condicional de $X_2$ (curva continua) y su marginal (línea punteada). El panel da la media y la varianza condicionales y el factor $1 - \rho^{2}$.

Arrastra el corte y observa que la curva condicional se desplaza sin cambiar de ancho. Sube $\rho$ a 0.95 y observa que la condicional se vuelve muy angosta. Carga el caso de variables independientes: las dos curvas coinciden.

## Ejemplo

Las anomalías de temperatura de dos días seguidos en una ciudad, en °C, son normales bivariadas con medias 0, desviaciones 2 y $\rho = 0.7$. Hoy la anomalía fue de 3 °C.

1. Media condicional: $\mathbb{E}[X_2 \mid X_1 = 3] = 0 + 0.7 \cdot \frac{2}{2}(3 - 0) = 2.1$ °C.
2. Varianza condicional: $4(1 - 0.49) = 2.04$, con desviación $\approx 1.428$ °C.
3. La varianza marginal de mañana es 4: observar el día de hoy la reduce casi a la mitad.
4. Probabilidad de que mañana también sea más cálido que lo normal: $P(X_2 > 0 \mid X_1 = 3) = \Phi(2.1/1.428) = \Phi(1.470) \approx 0.929$.
5. Sin la información de hoy esa probabilidad sería 0.5.

:::figura[Temperatura de hoy y mañana: con una anomalía de 3 °C hoy, la condicional de mañana (curva continua) se centra en 2.1 °C y es más angosta que la marginal (línea punteada).]{componente="MultivariateExplorer"}
```yaml
modo: condicional
valores:
  mu1: 0
  mu2: 0
  sigma1: 2
  sigma2: 2
  rho: 0.7
  corte: 3
```
:::

## Propiedades

- **Linealidad de la media:** $\mathbb{E}[X_2 \mid X_1 = a]$ es una recta en $a$, la recta de regresión poblacional, con pendiente $\rho\sigma_2/\sigma_1$.
- **Varianza constante:** $\operatorname{Var}(X_2 \mid X_1 = a)$ no depende de $a$; esto es la homocedasticidad del modelo lineal normal.
- **Reducción de varianza:** la fracción de varianza que queda es $1 - \rho^{2}$, y la explicada es $\rho^{2}$.
- **Independencia:** con $\rho = 0$ la condicional coincide con la marginal.
- **Regresión a la media:** en unidades estándar la media condicional es $\rho a$, más cerca de la media que $a$ cuando $|\rho| < 1$.
- **Ley de la varianza total:** $\sigma_2^{2} = \mathbb{E}[\operatorname{Var}(X_2 \mid X_1)] + \operatorname{Var}(\mathbb{E}[X_2 \mid X_1]) = \sigma_2^{2}(1 - \rho^{2}) + \rho^{2}\sigma_2^{2}$.

:::figura[Casos con contexto (temperatura, estaturas de padres e hijos, variables independientes): cada botón carga la covarianza y el corte, y una frase explica qué cambia en la condicional.]{componente="MultivariateExplorer"}
```yaml
modo: condicional
valores:
  mu1: 0
  mu2: 0
  sigma1: 1
  sigma2: 1
  rho: 0.5
  corte: 2
casos:
  - nombre: 'Temperatura de hoy y mañana'
    descripcion: 'ρ = 0.7: media condicional 2.1 y varianza 2.04 frente a 4.'
    valores: {mu1: 0, mu2: 0, sigma1: 2, sigma2: 2, rho: 0.7, corte: 3}
  - nombre: 'Estaturas de padres e hijos'
    descripcion: 'ρ = 0.5: un padre a dos desviaciones predice un hijo a una desviación.'
    valores: {mu1: 0, mu2: 0, sigma1: 1, sigma2: 1, rho: 0.5, corte: 2}
  - nombre: 'Variables independientes'
    descripcion: 'ρ = 0: condicional igual a la marginal.'
    valores: {mu1: 0, mu2: 0, sigma1: 1.5, sigma2: 1, rho: 0, corte: 2}
```
:::

:::figura[Varianza constante: con ρ = 0.8 la condicional tiene varianza 0.36 para cualquier corte; arrastra el punto y observa que la curva solo se traslada.]{componente="MultivariateExplorer"}
```yaml
modo: condicional
valores:
  mu1: 0
  mu2: 0
  sigma1: 1
  sigma2: 1
  rho: 0.8
  corte: -1.5
```
:::

## Errores comunes

- **Esperar que la media condicional siga el eje mayor de la elipse.** La recta de regresión tiene pendiente $\rho\sigma_2/\sigma_1$, menor que la del eje mayor; los extremos de $X_1$ predicen valores de $X_2$ menos extremos.
- **Creer que la condicional es más incierta lejos del centro.** En la normal la varianza condicional es la misma para todo valor observado.
- **Pensar que una correlación de 0.7 explica el 70 % de la varianza.** La fracción explicada es $\rho^{2} = 0.49$.
- **Suponer que marginales normales implican condicionales normales.** Las fórmulas valen cuando el vector es conjuntamente normal.

:::figura[Correlación 0.7 no explica el 70 %: la condicional (curva continua) conserva el 51 % de la varianza de la marginal (línea punteada).]{componente="MultivariateExplorer"}
```yaml
modo: condicional
valores:
  mu1: 0
  mu2: 0
  sigma1: 1
  sigma2: 1
  rho: 0.7
  corte: 0
```
:::

## Conexiones

Las fórmulas son las de la [[distribucion-normal-multivariada]] en bloques y usan la [[matriz-identidad-y-matriz-inversa|inversa]] de un bloque de la covarianza. En dos dimensiones, la rebanada se lee sobre los contornos de la [[normal-bivariada-y-sus-contornos]]. La media condicional lineal es el fundamento de la regresión lineal y del filtro de Kalman. Si las colas son pesadas, la [[distribucion-t-multivariada]] también tiene condicionales t, pero con varianza que sí depende del valor observado. El [[mapa-de-relaciones-entre-distribuciones]] reúne las distribuciones del módulo.

## Formulario

:::formula[Marginal]
$$
\mathbf{X}_a \sim \mathcal{N}(\boldsymbol{\mu}_a, \boldsymbol{\Sigma}_{aa})
$$

- $\mathbf{X}_a$: bloque de componentes; $\boldsymbol{\mu}_a$, $\boldsymbol{\Sigma}_{aa}$: su media y su covarianza.
:::

:::formula[Condicional en bloques]
$$
\boldsymbol{\mu}_{a \mid b} = \boldsymbol{\mu}_a + \boldsymbol{\Sigma}_{ab}\boldsymbol{\Sigma}_{bb}^{-1}(\mathbf{x}_b - \boldsymbol{\mu}_b), \qquad \boldsymbol{\Sigma}_{a \mid b} = \boldsymbol{\Sigma}_{aa} - \boldsymbol{\Sigma}_{ab}\boldsymbol{\Sigma}_{bb}^{-1}\boldsymbol{\Sigma}_{ba}
$$

- $\mathbf{x}_b$: valor observado del bloque $b$.
- $\boldsymbol{\Sigma}_{ab}$: covarianza cruzada; $\boldsymbol{\Sigma}_{bb}^{-1}$: inversa del bloque observado.
:::

:::formula[Condicional en dos dimensiones]
$$
X_2 \mid X_1 = a \sim \mathcal{N}\!\left(\mu_2 + \rho\frac{\sigma_2}{\sigma_1}(a - \mu_1),\ \sigma_2^{2}(1 - \rho^{2})\right)
$$

- $a$: valor observado de $X_1$.
- $\mu_i$, $\sigma_i$: medias y desviaciones; $\rho$: correlación.
:::

:::formula[Descomposición de la varianza]
$$
\sigma_2^{2} = \sigma_2^{2}(1 - \rho^{2}) + \rho^{2}\sigma_2^{2}
$$

- El primer término es la varianza que queda; el segundo, la explicada por $X_1$.
:::
