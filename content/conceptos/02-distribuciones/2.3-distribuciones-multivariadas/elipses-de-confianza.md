---
id: elipses-de-confianza
titulo: Elipses de confianza
titulo_en: Confidence ellipses
alias:
  - elipse de probabilidad
  - región de confianza elíptica
  - elipse de error
modulo: 2
submodulo: '2.3'
orden: 3
nivel: intermedio
prerrequisitos:
  - normal-bivariada-y-sus-contornos
  - distribucion-chi-cuadrada
relaciones:
  - tipo: relacionado
    id: distancia-de-mahalanobis-en-la-normal-multivariada
etiquetas:
  - regiones de probabilidad
  - chi-cuadrada
  - elipses
  - incertidumbre conjunta
  - normal bivariada
resumen: >
  Región elíptica que contiene una probabilidad fijada de una normal multivariada. Su tamaño sale de un
  cuantil de la chi-cuadrada y su forma de la matriz de covarianza.
formula: '\left\{\mathbf{x} : (\mathbf{x} - \boldsymbol{\mu})^{\top}\boldsymbol{\Sigma}^{-1}(\mathbf{x} - \boldsymbol{\mu}) \le \chi^{2}_{d;\,q}\right\}'
visualizacion:
  componente: MultivariateExplorer
  parametros:
    modo: elipse
    valores:
      mu1: 0
      mu2: 0
      sigma1: 3
      sigma2: 2
      rho: 0.5
      nivel: 0.95
    caja: true
    casos:
      - nombre: 'Error de GPS'
        descripcion: 'Error este y norte en metros con σ = 3 y 2 y ρ = 0.5: la elipse del 95 % se inclina porque los dos errores comparten la misma geometría de satélites.'
        valores: {mu1: 0, mu2: 0, sigma1: 3, sigma2: 2, rho: 0.5, nivel: 0.95}
      - nombre: 'Impactos en un blanco'
        descripcion: 'Tiro sin sesgo ni correlación, σ = 1 en cada eje: la elipse es un círculo de radio 2.45 para el 95 %.'
        valores: {mu1: 0, mu2: 0, sigma1: 1, sigma2: 1, rho: 0, nivel: 0.95}
      - nombre: 'Dos pesos de un modelo'
        descripcion: 'Dos coeficientes estimados con ρ = -0.9: la región conjunta es una franja angosta, mucho más chica que el rectángulo de los intervalos separados.'
        valores: {mu1: 1, mu2: 0.5, sigma1: 1, sigma2: 1, rho: -0.9, nivel: 0.95}
referencias:
  - clave: wasserman
  - clave: casella-berger
publicado: true
---

## Intuición

Un receptor de GPS no da la posición exacta: el error hacia el este y el error hacia el norte varían al azar, y suelen estar correlacionados porque los dos dependen de los mismos satélites. Para comunicar la incertidumbre no basta con dar un margen en cada dirección por separado; hace falta una región del plano que contenga la posición verdadera con una probabilidad dada, por ejemplo el 95 %.

Para errores normales, la mejor región de ese tipo es una elipse: la que encierra la probabilidad pedida con el área más pequeña posible. Su forma copia la de los contornos de la densidad, y su tamaño se ajusta hasta que adentro queda justo la probabilidad deseada.

El tamaño no se obtiene con el 1.96 de la normal univariada. En dos dimensiones la distancia de Mahalanobis al centro tiene distribución chi-cuadrada con dos grados de libertad, y el radio de la elipse sale de su cuantil. Usar el valor de una dimensión produce una elipse demasiado chica, y usar el rectángulo de dos intervalos por separado produce una región con otra probabilidad y más área de la necesaria.

## Definición

:::definicion[Elipse de confianza]
Sea $\mathbf{X} \sim \mathcal{N}_d(\boldsymbol{\mu}, \boldsymbol{\Sigma})$. La **elipse (o elipsoide) de probabilidad** $q$ es
$$
E_q = \left\{\mathbf{x} \in \mathbb{R}^{d} : (\mathbf{x} - \boldsymbol{\mu})^{\top}\boldsymbol{\Sigma}^{-1}(\mathbf{x} - \boldsymbol{\mu}) \le c_q\right\}, \qquad c_q = \chi^{2}_{d;\,q},
$$
donde $\chi^{2}_{d;\,q}$ es el cuantil $q$ de la chi-cuadrada con $d$ grados de libertad. Cumple $P(\mathbf{X} \in E_q) = q$. En dos dimensiones $c_q = -2\log(1 - q)$.
:::

Cuando $\boldsymbol{\mu}$ y $\boldsymbol{\Sigma}$ son estimaciones, como en una región de confianza para una media o para los coeficientes de un modelo, la misma forma se usa con $\boldsymbol{\Sigma}$ igual a la covarianza del estimador; con muestras chicas el cuantil chi-cuadrada se cambia por uno de la F.

:::nota[Qué es X]
$\mathbf{X}$ = el vector aleatorio cuya región de probabilidad se busca, como el error de posición de un GPS en metros hacia el este y hacia el norte.
:::

:::nota[Qué hace cada parámetro]
- **$q$, nivel de confianza:** la probabilidad que debe quedar dentro. Si aumenta, la elipse crece sin cambiar de forma, cada vez más rápido cerca de 1.
- **$\boldsymbol{\mu}$, centro:** la posición de la elipse. Si aumenta una de sus entradas, la elipse se traslada.
- **$\sigma_1, \sigma_2, \rho$, covarianza:** la forma y orientación. Si aumenta $|\rho|$, la elipse se angosta y su área baja.
:::

:::nota[Qué significa cada símbolo]
- $E_q$: región elíptica con probabilidad $q$.
- $\mathbf{x}$: punto del espacio; $d$: dimensión.
- $\boldsymbol{\mu}$: centro; $\boldsymbol{\Sigma}$: matriz de covarianza.
- $c_q$: radio al cuadrado de la elipse; $\chi^{2}_{d;\,q}$: cuantil $q$ de la chi-cuadrada con $d$ grados.
- $\log$: logaritmo natural.
:::

## Cómo usar la visualización

La gráfica muestra la elipse del nivel elegido, sus ejes principales y, con el interruptor, el rectángulo formado por los dos intervalos marginales del mismo nivel. El control "Nivel de confianza" cambia $q$; el panel da el radio al cuadrado $c$, los semiejes y el área. Los casos cargan el error de un GPS, impactos en un blanco y dos coeficientes estimados. Al simular, el panel compara la fracción de puntos dentro de la elipse y dentro del rectángulo.

Simula 1000 puntos con el caso del GPS y comprueba que cerca del 95 % cae en la elipse y cerca del 91 % en el rectángulo. Carga el caso de los dos pesos y observa cuánto más chica es la elipse que el rectángulo. Sube $q$ de 0.95 a 0.99 y observa que $c$ pasa de 5.99 a 9.21.

## Ejemplo

El error de posición de un GPS, en metros, es normal bivariado con centro en cero, $\sigma_1 = 3$ hacia el este, $\sigma_2 = 2$ hacia el norte y $\rho = 0.5$. Se busca la elipse del 95 %.

1. Covarianza: $\boldsymbol{\Sigma} = \begin{pmatrix} 9 & 3 \\ 3 & 4 \end{pmatrix}$, con traza 13 y determinante $36 - 9 = 27$.
2. Valores propios: $\lambda = 6.5 \pm \sqrt{6.5^{2} - 27} = 6.5 \pm 3.905$, es decir, $\lambda_1 \approx 10.405$ y $\lambda_2 \approx 2.595$.
3. Radio al cuadrado: $c = -2\log(0.05) \approx 5.991$.
4. Semiejes: $\sqrt{5.991 \cdot 10.405} \approx 7.90$ m y $\sqrt{5.991 \cdot 2.595} \approx 3.94$ m.
5. Área: $\pi c\sqrt{|\boldsymbol{\Sigma}|} = \pi \cdot 5.991 \cdot 5.196 \approx 97.8$ m².
6. El rectángulo de los intervalos $\pm 1.96\sigma_i$, de $\pm 5.88$ m y $\pm 3.92$ m, tiene área 92.2 m² y probabilidad de solo 0.91 aproximadamente; para llegar al 95 % tendría que crecer.

:::figura[Error de GPS: la elipse del 95 % frente al rectángulo de los intervalos marginales del 95 % (línea punteada). Al simular, el rectángulo atrapa cerca del 91 % de los puntos.]{componente="MultivariateExplorer"}
```yaml
modo: elipse
valores:
  mu1: 0
  mu2: 0
  sigma1: 3
  sigma2: 2
  rho: 0.5
  nivel: 0.95
caja: true
```
:::

## Propiedades

- **Probabilidad exacta:** $P(\mathbf{X} \in E_q) = q$, porque $(\mathbf{X} - \boldsymbol{\mu})^{\top}\boldsymbol{\Sigma}^{-1}(\mathbf{X} - \boldsymbol{\mu}) \sim \chi^{2}_{d}$.
- **Área mínima:** entre todas las regiones con probabilidad $q$, la elipse $E_q$ tiene el menor volumen, porque contiene los puntos de mayor densidad.
- **Semiejes:** en las direcciones de los vectores propios de $\boldsymbol{\Sigma}$, con longitudes $\sqrt{c_q\lambda_i}$.
- **Área en el plano:** $\pi c_q\sqrt{|\boldsymbol{\Sigma}|}$.
- **Dimensión:** el radio crece con $d$: para $q = 0.95$, $c = 3.84$ con $d = 1$, 5.99 con $d = 2$ y 7.81 con $d = 3$.
- **Proyecciones:** la sombra de $E_q$ sobre un eje es más ancha que el intervalo marginal del mismo nivel; por eso la elipse no equivale a dos intervalos.

:::figura[Casos con contexto (GPS, impactos en un blanco, dos pesos de un modelo): cada botón carga la covarianza y el nivel, y una frase explica la forma de la región.]{componente="MultivariateExplorer"}
```yaml
modo: elipse
valores:
  mu1: 0
  mu2: 0
  sigma1: 1
  sigma2: 1
  rho: 0
  nivel: 0.95
caja: true
casos:
  - nombre: 'Error de GPS'
    descripcion: 'σ = 3 y 2, ρ = 0.5: elipse inclinada de 7.9 por 3.9 metros.'
    valores: {mu1: 0, mu2: 0, sigma1: 3, sigma2: 2, rho: 0.5, nivel: 0.95}
  - nombre: 'Impactos en un blanco'
    descripcion: 'Círculo de radio √5.99 = 2.45 cuando no hay correlación y σ = 1.'
    valores: {mu1: 0, mu2: 0, sigma1: 1, sigma2: 1, rho: 0, nivel: 0.95}
  - nombre: 'Dos pesos de un modelo'
    descripcion: 'ρ = -0.9: la región conjunta es una franja; muchos puntos del rectángulo quedan fuera.'
    valores: {mu1: 1, mu2: 0.5, sigma1: 1, sigma2: 1, rho: -0.9, nivel: 0.95}
```
:::

:::figura[El nivel cambia el tamaño, no la forma: con q = 0.5 la elipse es mucho más chica (c = 1.39) que con q = 0.99 (c = 9.21). Mueve el control del nivel para pasar de una a otra.]{componente="MultivariateExplorer"}
```yaml
modo: elipse
valores:
  mu1: 0
  mu2: 0
  sigma1: 1.5
  sigma2: 1
  rho: 0.4
  nivel: 0.5
```
:::

## Errores comunes

- **Usar 1.96 en dos dimensiones.** Con $c = 1.96^{2} = 3.84$ la elipse contiene solo $1 - e^{-1.92} \approx 0.853$ de la probabilidad, no 0.95.
- **Reemplazar la elipse por el rectángulo de dos intervalos.** El rectángulo tiene otra probabilidad (0.9025 si las variables son independientes) y, con correlación fuerte, incluye zonas casi imposibles y deja fuera zonas probables.
- **Dibujar la elipse con las desviaciones como semiejes.** Los semiejes son $\sqrt{c\lambda_i}$, no $\sigma_1$ y $\sigma_2$, salvo que $\rho = 0$ y $c = 1$.
- **Olvidar que la región depende de la dimensión.** El mismo nivel en tres dimensiones necesita un radio mayor.

:::figura[Usar 1.96: con nivel 0.853 la elipse tiene c = 3.84, el cuadrado de 1.96. Simula y observa que solo el 85 % de los puntos queda dentro.]{componente="MultivariateExplorer"}
```yaml
modo: elipse
valores:
  mu1: 0
  mu2: 0
  sigma1: 1
  sigma2: 1
  rho: 0.3
  nivel: 0.853
```
:::

:::figura[Rectángulo contra elipse con correlación fuerte: con ρ = -0.9 el rectángulo de los intervalos del 95 % incluye esquinas donde casi nunca cae un punto.]{componente="MultivariateExplorer"}
```yaml
modo: elipse
valores:
  mu1: 0
  mu2: 0
  sigma1: 1
  sigma2: 1
  rho: -0.9
  nivel: 0.95
caja: true
```
:::

## Conexiones

La forma de la elipse es la de los contornos de la [[normal-bivariada-y-sus-contornos]], y su tamaño sale de un cuantil de la [[distribucion-chi-cuadrada]]. El borde de la elipse está formado por los puntos con la misma [[distancia-de-mahalanobis-en-la-normal-multivariada|distancia de Mahalanobis]] al centro. Para distribuciones con colas pesadas como la [[distribucion-t-multivariada]], el radio sale de una F. Las elipses de incertidumbre también aparecen en el teorema central del límite multivariado y en el filtro de Kalman. El [[mapa-de-relaciones-entre-distribuciones]] reúne las distribuciones del módulo.

## Formulario

:::formula[Elipse de probabilidad]
$$
E_q = \left\{\mathbf{x} : (\mathbf{x} - \boldsymbol{\mu})^{\top}\boldsymbol{\Sigma}^{-1}(\mathbf{x} - \boldsymbol{\mu}) \le \chi^{2}_{d;\,q}\right\}
$$

- $q$: probabilidad dentro; $d$: dimensión.
- $\boldsymbol{\mu}$: centro; $\boldsymbol{\Sigma}$: covarianza.
- $\chi^{2}_{d;\,q}$: cuantil $q$ de la chi-cuadrada con $d$ grados.
:::

:::formula[Radio en dos dimensiones]
$$
c_q = -2\log(1 - q)
$$

- $c_q$: radio al cuadrado; para $q = 0.95$ vale 5.991.
:::

:::formula[Semiejes y área]
$$
a_i = \sqrt{c_q\lambda_i}, \qquad A = \pi c_q\sqrt{|\boldsymbol{\Sigma}|}
$$

- $a_i$: semieje en la dirección del vector propio $i$.
- $\lambda_i$: valores propios de $\boldsymbol{\Sigma}$; $|\boldsymbol{\Sigma}|$: determinante.
:::

:::formula[Probabilidad de una elipse con radio c]
$$
P\big((\mathbf{X} - \boldsymbol{\mu})^{\top}\boldsymbol{\Sigma}^{-1}(\mathbf{X} - \boldsymbol{\mu}) \le c\big) = 1 - e^{-c/2} \qquad (d = 2)
$$

- $c$: radio al cuadrado cualquiera; con $c = 3.84$ da 0.853.
:::
