---
id: distribucion-normal-multivariada
titulo: Distribución normal multivariada
titulo_en: Multivariate normal distribution
alias:
  - normal multivariante
  - gaussiana multivariada
  - distribución normal conjunta
modulo: 2
submodulo: '2.3'
orden: 1
nivel: intermedio
prerrequisitos:
  - distribucion-normal
  - formas-cuadraticas
  - descomposicion-de-cholesky
relaciones:
  - tipo: generaliza
    id: distribucion-normal
  - tipo: relacionado
    id: normal-bivariada-y-sus-contornos
etiquetas:
  - vectores aleatorios
  - matriz de covarianza
  - normal
  - transformación lineal
  - Cholesky
resumen: >
  Distribución de un vector aleatorio cuyas combinaciones lineales son todas normales. Queda
  determinada por un vector de medias y una matriz de covarianza, y su densidad tiene contornos elípticos.
formula: 'f(\mathbf{x}) = \frac{1}{(2\pi)^{d/2}\,|\boldsymbol{\Sigma}|^{1/2}} \exp\!\left(-\tfrac{1}{2}(\mathbf{x} - \boldsymbol{\mu})^{\top}\boldsymbol{\Sigma}^{-1}(\mathbf{x} - \boldsymbol{\mu})\right)'
visualizacion:
  componente: MultivariateExplorer
  parametros:
    modo: normal
    valores:
      mu1: 0
      mu2: 0
      sigma1: 1
      sigma2: 1
      rho: 0.6
    casos:
      - nombre: 'Estatura y peso'
        descripcion: 'En unidades estándar, ρ = 0.6: las personas más altas tienden a pesar más y la nube se inclina hacia arriba a la derecha.'
        valores: {mu1: 0, mu2: 0, sigma1: 1, sigma2: 1, rho: 0.6}
      - nombre: 'Errores independientes'
        descripcion: 'ρ = 0: los errores de dos instrumentos distintos no se relacionan y los contornos son círculos.'
        valores: {mu1: 0, mu2: 0, sigma1: 1, sigma2: 1, rho: 0}
      - nombre: 'Temperatura y calefacción'
        descripcion: 'ρ = -0.8 y desviaciones distintas: a más temperatura exterior, menos consumo de gas; la elipse es angosta y baja hacia la derecha.'
        valores: {mu1: 0, mu2: 0, sigma1: 1.5, sigma2: 1, rho: -0.8}
referencias:
  - clave: blitzstein-hwang
  - clave: bishop
  - clave: murphy
publicado: true
---

## Intuición

La estatura y el peso de las personas adultas no varían por separado: quien es más alto suele pesar más. Si se marca a cada persona como un punto con su estatura en un eje y su peso en el otro, la nube resultante no es redonda ni cuadrada, sino una elipse inclinada. Cerca del centro hay muchos puntos y hacia los bordes cada vez menos, siguiendo en cada dirección una campana.

La distribución normal multivariada describe exactamente esa clase de nube. Cada variable por sí sola es normal, pero además el modelo registra cómo se mueven juntas mediante sus covarianzas. Basta un vector de medias, que dice dónde está el centro, y una matriz de covarianza, que dice qué tan ancha es la nube en cada dirección y hacia dónde se inclina.

Una forma de construirla es partir de varias normales estándar independientes, que forman una nube redonda, y aplicarles una transformación lineal: estirar, inclinar y trasladar. La nube redonda se convierte en una elipse. Por eso la normal multivariada es tan manejable: cualquier combinación lineal de sus componentes vuelve a ser normal, y sus marginales y condicionales también lo son.

## Definición

:::definicion[Distribución normal multivariada]
Un vector aleatorio $\mathbf{X} = (X_1, \dots, X_d)^{\top}$ tiene **distribución normal multivariada** con vector de medias $\boldsymbol{\mu} \in \mathbb{R}^{d}$ y matriz de covarianza $\boldsymbol{\Sigma}$ simétrica definida positiva, y se escribe $\mathbf{X} \sim \mathcal{N}_d(\boldsymbol{\mu}, \boldsymbol{\Sigma})$, si su densidad es
$$
f(\mathbf{x}) = \frac{1}{(2\pi)^{d/2}\,|\boldsymbol{\Sigma}|^{1/2}} \exp\!\left(-\tfrac{1}{2}(\mathbf{x} - \boldsymbol{\mu})^{\top}\boldsymbol{\Sigma}^{-1}(\mathbf{x} - \boldsymbol{\mu})\right), \qquad \mathbf{x} \in \mathbb{R}^{d}.
$$
De forma equivalente, $\mathbf{X}$ es normal multivariada si toda combinación lineal $\mathbf{a}^{\top}\mathbf{X}$ es normal univariada.
:::

Si $\mathbf{Z}$ es un vector de $d$ normales estándar independientes y $\mathbf{L}$ es el factor de Cholesky de $\boldsymbol{\Sigma}$, es decir, $\mathbf{L}\mathbf{L}^{\top} = \boldsymbol{\Sigma}$, entonces $\mathbf{X} = \boldsymbol{\mu} + \mathbf{L}\mathbf{Z} \sim \mathcal{N}_d(\boldsymbol{\mu}, \boldsymbol{\Sigma})$. En dos dimensiones, con desviaciones $\sigma_1$, $\sigma_2$ y correlación $\rho$,
$$
\boldsymbol{\Sigma} = \begin{pmatrix} \sigma_1^{2} & \rho\sigma_1\sigma_2 \\ \rho\sigma_1\sigma_2 & \sigma_2^{2} \end{pmatrix}.
$$

:::nota[Qué es X]
$\mathbf{X}$ = un vector de $d$ mediciones tomadas juntas sobre la misma unidad, como la estatura y el peso de una persona.
:::

:::nota[Qué hace cada parámetro]
- **$\boldsymbol{\mu}$, vector de medias:** el centro de la nube. Si aumenta una de sus entradas, toda la nube se traslada en esa dirección sin cambiar de forma.
- **$\sigma_i$, desviaciones:** la dispersión de cada componente. Si aumenta $\sigma_1$, la nube se estira a lo largo del primer eje.
- **$\rho$, correlación:** la inclinación conjunta, entre $-1$ y 1. Si aumenta hacia 1, la elipse se angosta y se inclina hacia arriba a la derecha; con $\rho = 0$ sus ejes quedan alineados con los de coordenadas.
:::

:::nota[Qué significa cada símbolo]
- $\mathbf{X}$: vector aleatorio de $d$ componentes; $\mathbf{x}$: un valor posible.
- $d$: dimensión, el número de componentes.
- $\boldsymbol{\mu}$: vector de medias, $\mathbb{E}[\mathbf{X}] = \boldsymbol{\mu}$.
- $\boldsymbol{\Sigma}$: matriz de covarianza, con $\operatorname{Cov}(X_i, X_j)$ en la entrada $(i, j)$.
- $|\boldsymbol{\Sigma}|$: determinante de $\boldsymbol{\Sigma}$; $\boldsymbol{\Sigma}^{-1}$: su inversa.
- $(\mathbf{x} - \boldsymbol{\mu})^{\top}\boldsymbol{\Sigma}^{-1}(\mathbf{x} - \boldsymbol{\mu})$: forma cuadrática, el cuadrado de la distancia de Mahalanobis.
- $\mathbf{a}$: vector de coeficientes de una combinación lineal.
- $\mathbf{Z}$: normales estándar independientes; $\mathbf{L}$: factor de Cholesky, triangular inferior.
- $\sigma_1$, $\sigma_2$: desviaciones estándar; $\rho$: correlación.
:::

## Cómo usar la visualización

La gráfica muestra las elipses que encierran el 50, el 90 y el 99 % de la probabilidad, los ejes principales y el centro, que se puede arrastrar. Los controles fijan medias, desviaciones y correlación; el panel da la matriz de covarianza, su determinante y sus valores propios. Los casos cargan estatura y peso, errores independientes y temperatura con calefacción. El botón de simulación agrega 500 puntos y el panel cuenta cuántos caen dentro de cada elipse.

Sube $\rho$ hacia 0.95 y observa que la elipse se vuelve una aguja y el determinante se acerca a cero. Con $\rho = 0$ cambia $\sigma_1$ y observa que los ejes siguen alineados con las coordenadas. Simula y comprueba que cerca de la mitad de los puntos cae en la elipse del 50 %.

## Ejemplo

En una población adulta, la estatura en centímetros y el peso en kilogramos siguen una normal bivariada con $\boldsymbol{\mu} = (170, 70)^{\top}$, $\sigma_1 = 7$, $\sigma_2 = 10$ y $\rho = 0.6$.

1. Covarianza: $\rho\sigma_1\sigma_2 = 0.6 \cdot 7 \cdot 10 = 42$, así que $\boldsymbol{\Sigma} = \begin{pmatrix} 49 & 42 \\ 42 & 100 \end{pmatrix}$.
2. Determinante: $|\boldsymbol{\Sigma}| = 49 \cdot 100 - 42^{2} = 3136$, con raíz 56.
3. Inversa: $\boldsymbol{\Sigma}^{-1} = \frac{1}{3136}\begin{pmatrix} 100 & -42 \\ -42 & 49 \end{pmatrix}$.
4. Para una persona de 177 cm y 80 kg, $\mathbf{x} - \boldsymbol{\mu} = (7, 10)^{\top}$ y la forma cuadrática vale $\frac{100 \cdot 49 - 2 \cdot 42 \cdot 70 + 49 \cdot 100}{3136} = \frac{3920}{3136} = 1.25$.
5. Densidad: $f(\mathbf{x}) = \frac{e^{-1.25/2}}{2\pi \cdot 56} \approx 0.001521$, frente a $\frac{1}{2\pi \cdot 56} \approx 0.002842$ en el centro.
6. La marginal del peso es $\mathcal{N}(70, 100)$, así que $P(\text{peso} > 80) = P(Z > 1) \approx 0.1587$.

:::figura[Estatura y peso en unidades estándar: con ρ = 0.6 la nube se inclina; la persona de 177 cm y 80 kg está a una desviación de la media en cada variable, dentro de la elipse del 50 %.]{componente="MultivariateExplorer"}
```yaml
modo: normal
valores:
  mu1: 0
  mu2: 0
  sigma1: 1
  sigma2: 1
  rho: 0.6
niveles: [0.5, 0.9]
```
:::

## Propiedades

- **Combinaciones lineales:** si $\mathbf{X} \sim \mathcal{N}_d(\boldsymbol{\mu}, \boldsymbol{\Sigma})$, entonces $\mathbf{A}\mathbf{X} + \mathbf{b} \sim \mathcal{N}(\mathbf{A}\boldsymbol{\mu} + \mathbf{b}, \mathbf{A}\boldsymbol{\Sigma}\mathbf{A}^{\top})$.
- **Construcción:** $\mathbf{X} = \boldsymbol{\mu} + \mathbf{L}\mathbf{Z}$ con $\mathbf{L}\mathbf{L}^{\top} = \boldsymbol{\Sigma}$; es la forma de simularla.
- **Marginales y condicionales:** todas son normales; se estudian en [[marginales-y-condicionales-de-la-normal-multivariada]].
- **Correlación cero e independencia:** para componentes conjuntamente normales, covarianza cero implica independencia.
- **Contornos elípticos:** la densidad es constante sobre elipsoides $(\mathbf{x} - \boldsymbol{\mu})^{\top}\boldsymbol{\Sigma}^{-1}(\mathbf{x} - \boldsymbol{\mu}) = c$, con ejes en las direcciones de los vectores propios de $\boldsymbol{\Sigma}$ y semiejes $\sqrt{c\lambda_i}$.
- **Distancia de Mahalanobis:** $(\mathbf{X} - \boldsymbol{\mu})^{\top}\boldsymbol{\Sigma}^{-1}(\mathbf{X} - \boldsymbol{\mu}) \sim \chi^{2}_{d}$.

:::figura[Construcción: cada punto de una nube de normales estándar independientes viaja a μ + L z; el círculo unitario se convierte en la elipse de Σ. Con el botón de reproducción la transformación avanza paso a paso.]{componente="MultivariateExplorer"}
```yaml
modo: construccion
valores:
  mu1: 1
  mu2: 0.5
  sigma1: 1.5
  sigma2: 1
  rho: 0.6
```
:::

:::figura[Correlación cero: con ρ = 0 los ejes de las elipses coinciden con los de coordenadas, aunque las desviaciones sean distintas; para la normal, eso significa que las componentes son independientes.]{componente="MultivariateExplorer"}
```yaml
modo: normal
valores:
  mu1: 0
  mu2: 0
  sigma1: 2
  sigma2: 1
  rho: 0
```
:::

## Errores comunes

- **Creer que marginales normales bastan.** Dos variables pueden ser normales cada una sin que el par sea normal bivariado; la definición exige que toda combinación lineal sea normal.
- **Usar una matriz que no es definida positiva.** Una matriz simétrica con correlaciones arbitrarias puede tener un valor propio negativo y no ser una covarianza; con $|\rho| \to 1$ el determinante se anula y la densidad deja de existir.
- **Confundir $\boldsymbol{\Sigma}$ con la matriz de correlaciones.** La diagonal de $\boldsymbol{\Sigma}$ son varianzas, no unos; la de correlaciones se obtiene dividiendo cada entrada entre $\sigma_i\sigma_j$.
- **Pensar que correlación cero implica independencia siempre.** Solo es cierto si las variables son conjuntamente normales.

:::figura[Correlación casi uno: con ρ = 0.95 la elipse es una aguja y el determinante 0.0975 está cerca de cero; con ρ = 1 la matriz deja de ser invertible.]{componente="MultivariateExplorer"}
```yaml
modo: normal
valores:
  mu1: 0
  mu2: 0
  sigma1: 1
  sigma2: 1
  rho: 0.95
ejes: true
```
:::

## Conexiones

Generaliza la [[distribucion-normal]] a varias dimensiones. Su matriz de covarianza es una de las [[matrices-definidas-positivas-y-semidefinidas]], el exponente de la densidad es una de las [[formas-cuadraticas]] y la simulación usa la [[descomposicion-de-cholesky]]. En dos dimensiones se estudia con detalle en [[normal-bivariada-y-sus-contornos]], y sus regiones de probabilidad son las [[elipses-de-confianza]]. Su exponente es la [[distancia-de-mahalanobis-en-la-normal-multivariada|distancia de Mahalanobis]]. Con colas más pesadas se obtiene la [[distribucion-t-multivariada]], y la covarianza muestral de datos normales sigue una [[distribucion-de-wishart]]. El [[mapa-de-relaciones-entre-distribuciones]] la sitúa entre las demás distribuciones.

## Formulario

:::formula[Densidad]
$$
f(\mathbf{x}) = \frac{1}{(2\pi)^{d/2}\,|\boldsymbol{\Sigma}|^{1/2}} \exp\!\left(-\tfrac{1}{2}(\mathbf{x} - \boldsymbol{\mu})^{\top}\boldsymbol{\Sigma}^{-1}(\mathbf{x} - \boldsymbol{\mu})\right)
$$

- $\mathbf{x}$: punto de $\mathbb{R}^{d}$; $d$: dimensión.
- $\boldsymbol{\mu}$: vector de medias; $\boldsymbol{\Sigma}$: matriz de covarianza, con determinante $|\boldsymbol{\Sigma}|$ e inversa $\boldsymbol{\Sigma}^{-1}$.
:::

:::formula[Covarianza en dos dimensiones]
$$
\boldsymbol{\Sigma} = \begin{pmatrix} \sigma_1^{2} & \rho\sigma_1\sigma_2 \\ \rho\sigma_1\sigma_2 & \sigma_2^{2} \end{pmatrix}, \qquad |\boldsymbol{\Sigma}| = \sigma_1^{2}\sigma_2^{2}(1 - \rho^{2})
$$

- $\sigma_1$, $\sigma_2$: desviaciones estándar; $\rho$: correlación.
:::

:::formula[Construcción]
$$
\mathbf{X} = \boldsymbol{\mu} + \mathbf{L}\mathbf{Z}, \qquad \mathbf{L}\mathbf{L}^{\top} = \boldsymbol{\Sigma}
$$

- $\mathbf{Z}$: vector de normales estándar independientes.
- $\mathbf{L}$: factor de Cholesky de $\boldsymbol{\Sigma}$.
:::

:::formula[Transformación lineal]
$$
\mathbf{A}\mathbf{X} + \mathbf{b} \sim \mathcal{N}(\mathbf{A}\boldsymbol{\mu} + \mathbf{b},\ \mathbf{A}\boldsymbol{\Sigma}\mathbf{A}^{\top})
$$

- $\mathbf{A}$: matriz de coeficientes; $\mathbf{b}$: vector de desplazamiento.
- $\mathbf{A}^{\top}$: transpuesta de $\mathbf{A}$.
:::

:::formula[Distancia de Mahalanobis]
$$
(\mathbf{X} - \boldsymbol{\mu})^{\top}\boldsymbol{\Sigma}^{-1}(\mathbf{X} - \boldsymbol{\mu}) \sim \chi^{2}_{d}
$$

- $\chi^{2}_{d}$: chi-cuadrada con $d$ grados de libertad.
:::
