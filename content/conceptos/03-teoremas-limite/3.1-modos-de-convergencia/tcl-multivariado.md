---
id: tcl-multivariado
titulo: TCL multivariado
titulo_en: Multivariate central limit theorem
alias:
  - teorema central del límite multivariado
  - TCL para vectores aleatorios
modulo: 3
submodulo: '3.1'
orden: 12
nivel: intermedio
prerrequisitos:
  - tcl-de-lindeberg-levy
  - matrices-definidas-positivas-y-semidefinidas
etiquetas:
  - teorema central del límite
  - vectores aleatorios
  - matriz de covarianza
  - normal multivariada
  - Cramér-Wold
resumen: >
  La media de vectores aleatorios independientes con la misma distribución y covarianza finita Σ
  cumple que √n(X̄ₙ - μ) converge a una normal multivariada con media cero y matriz de covarianza Σ.
formula: '\sqrt{n}\,\big(\bar{\mathbf{X}}_n - \boldsymbol{\mu}\big) \xrightarrow{d} \mathcal{N}_k\big(\mathbf{0}, \boldsymbol{\Sigma}\big)'
visualizacion:
  componente: CentralLimit
  parametros:
    modo: multivariado
    poblacion: parabola
    poblaciones:
      - parabola
      - dado-par
      - exponenciales-acumuladas
    n: 10
referencias:
  - clave: wasserman
  - clave: casella-berger
publicado: true
---

## Intuición

En una línea de manufactura cada pieza pasa por dos estaciones. Para cada pieza se registran dos tiempos: cuándo sale de la primera estación y cuándo sale de la segunda. Esos dos números están ligados, porque el segundo incluye al primero, y su nube de puntos es asimétrica. Si se promedian los tiempos de 50 piezas, el par de promedios ya no se distribuye de forma irregular: su nube tiene forma de elipse y se describe con una normal de dos dimensiones.

El teorema central del límite multivariado dice que esto ocurre siempre que las piezas sean independientes y las varianzas finitas. La forma de la elipse, su inclinación y sus ejes, la fija la matriz de covarianza de un solo vector, que se hereda intacta. Lo notable es que lo que se vuelve normal es el vector completo, no solo cada coordenada por separado: también cualquier combinación lineal de las coordenadas es normal. Esa última observación, conocida como el recurso de Cramér-Wold, permite deducir el caso multivariado del univariado.

## Definición

:::teorema[TCL multivariado]
Sean $\mathbf{X}_1, \mathbf{X}_2, \dots$ vectores aleatorios en $\mathbb{R}^k$, independientes e idénticamente distribuidos, con media $\boldsymbol{\mu} = \mathbb{E}[\mathbf{X}_1]$ y matriz de covarianza $\boldsymbol{\Sigma} = \operatorname{Cov}(\mathbf{X}_1)$ con entradas finitas. Entonces
$$
\sqrt{n}\,\big(\bar{\mathbf{X}}_n - \boldsymbol{\mu}\big) \xrightarrow{d} \mathcal{N}_k(\mathbf{0}, \boldsymbol{\Sigma}), \qquad \bar{\mathbf{X}}_n = \frac{1}{n}\sum_{i=1}^n \mathbf{X}_i.
$$
:::

:::teorema[Recurso de Cramér-Wold]
$\mathbf{Y}_n \xrightarrow{d} \mathbf{Y}$ en $\mathbb{R}^k$ si y solo si $\mathbf{a}^\top\mathbf{Y}_n \xrightarrow{d} \mathbf{a}^\top\mathbf{Y}$ para todo $\mathbf{a} \in \mathbb{R}^k$.
:::

Aplicado aquí: para todo $\mathbf{a}$, $\mathbf{a}^\top\mathbf{X}_i$ son variables reales independientes con varianza $\mathbf{a}^\top\boldsymbol{\Sigma}\mathbf{a}$, y el teorema univariado da $\sqrt{n}\,\mathbf{a}^\top(\bar{\mathbf{X}}_n - \boldsymbol{\mu}) \xrightarrow{d} \mathcal{N}(0, \mathbf{a}^\top\boldsymbol{\Sigma}\mathbf{a})$, que es la ley de $\mathbf{a}^\top\mathbf{Z}$ con $\mathbf{Z} \sim \mathcal{N}_k(\mathbf{0}, \boldsymbol{\Sigma})$.

:::nota[Qué significa cada símbolo]
- $\mathbf{X}_i$: vector aleatorio $i$ con $k$ coordenadas.
- $\boldsymbol{\mu}$: vector de medias.
- $\boldsymbol{\Sigma}$: matriz de covarianza $k \times k$, simétrica y semidefinida positiva; su entrada $(j, l)$ es $\operatorname{Cov}(X_{1j}, X_{1l})$.
- $\bar{\mathbf{X}}_n$: vector de medias muestrales.
- $\mathcal{N}_k(\mathbf{0}, \boldsymbol{\Sigma})$: normal de $k$ dimensiones con media cero y covarianza $\boldsymbol{\Sigma}$.
- $\mathbf{a}$: vector de coeficientes de una combinación lineal; $\mathbf{a}^\top$, su transpuesto.
- $\mathbf{a}^\top\boldsymbol{\Sigma}\mathbf{a}$: varianza de la combinación lineal $\mathbf{a}^\top\mathbf{X}$.
:::

## Cómo usar la visualización

El panel izquierdo muestra observaciones individuales centradas, $\mathbf{X} - \boldsymbol{\mu}$; el derecho, los vectores $\sqrt{n}(\bar{\mathbf{X}}_n - \boldsymbol{\mu})$ que se van acumulando. En ambos se dibujan las elipses de la matriz de covarianza a una y dos desviaciones. Abajo, el histograma de la proyección en la dirección $\theta$ elegida, estandarizada, se compara con la normal estándar.

Con los puntos sobre la parábola $(U, U^2)$ la nube individual es una curva, pero las medias reescaladas llenan la elipse. Como $\operatorname{Cov}(U, U^2) = 0$, la elipse no está inclinada: en el límite las dos coordenadas son normales independientes aunque cada observación tenga $U^2$ determinado por $U$. Al girar $\theta$, todas las proyecciones siguen la campana.

## Ejemplo

En una línea de producción, $E_1$ es el tiempo en la primera estación y $E_2$ en la segunda, exponenciales independientes con media 1 minuto. Para cada pieza se registra $\mathbf{X} = (E_1, E_1 + E_2)$ y se promedian $n = 50$ piezas.

1. Media: $\boldsymbol{\mu} = (1, 2)$. Covarianza: $\operatorname{Var}(E_1) = 1$, $\operatorname{Var}(E_1 + E_2) = 2$, $\operatorname{Cov}(E_1, E_1 + E_2) = 1$, así que $\boldsymbol{\Sigma} = \begin{pmatrix} 1 & 1 \\ 1 & 2 \end{pmatrix}$.
2. Por el teorema, $\bar{\mathbf{X}}_{50} \approx \mathcal{N}_2\big((1, 2), \boldsymbol{\Sigma}/50\big)$; la correlación entre los promedios es $1/\sqrt{2} = 0.707$.
3. Valores propios de $\boldsymbol{\Sigma}$: $\lambda = \frac{3 \pm \sqrt{5}}{2}$, es decir, 2.618 y 0.382. La región que contiene al 95 % de los pares de promedios es una elipse con semiejes $2.448\sqrt{\lambda/50}$: 0.560 y 0.214 minutos, inclinada 58 grados, en la dirección del vector propio $(1, 1.618)$.
4. Para una sola coordenada se usa la marginal: el tiempo total medio tiene desviación $\sqrt{2/50} = 0.2$, y $P(\bar{X}_{50,2} > 2.3) \approx 1 - \Phi(1.5) = 0.067$.
5. Para la diferencia de promedios, $\mathbf{a} = (-1, 1)$: varianza $\mathbf{a}^\top\boldsymbol{\Sigma}\mathbf{a}/50 = (1 - 2 + 2)/50 = 0.02$, que es la del promedio de $E_2$, como debe ser.

:::figura[El ejemplo de las dos estaciones: vectores (E₁, E₁ + E₂). La nube individual es asimétrica; las medias de 50 piezas llenan una elipse inclinada con correlación 0.707.]{componente="CentralLimit"}
```yaml
modo: multivariado
poblacion: exponenciales-acumuladas
n: 50
```
:::

## Propiedades

- **La covarianza se hereda:** la del límite es exactamente $\boldsymbol{\Sigma}$, la de una sola observación.
- **Combinaciones lineales:** $\sqrt{n}\,\mathbf{A}(\bar{\mathbf{X}}_n - \boldsymbol{\mu}) \xrightarrow{d} \mathcal{N}(\mathbf{0}, \mathbf{A}\boldsymbol{\Sigma}\mathbf{A}^\top)$ para cualquier matriz $\mathbf{A}$.
- **Forma cuadrática:** si $\boldsymbol{\Sigma}$ es invertible, $n(\bar{\mathbf{X}}_n - \boldsymbol{\mu})^\top\boldsymbol{\Sigma}^{-1}(\bar{\mathbf{X}}_n - \boldsymbol{\mu}) \xrightarrow{d} \chi^2_k$, base de las regiones de confianza elípticas.
- **Correlación cero se vuelve independencia:** si dos coordenadas no están correlacionadas, en el límite son normales independientes, aunque en cada observación dependan una de otra.
- **Frecuencias multinomiales:** el vector de proporciones de una multinomial es asintóticamente normal con covarianza $\operatorname{diag}(\mathbf{p}) - \mathbf{p}\mathbf{p}^\top$, lo que justifica la prueba ji cuadrada.

:::figura[Propiedad: correlación cero se vuelve independencia. Cada punto (U, U²) depende totalmente de U, pero las medias reescaladas forman una elipse sin inclinación.]{componente="CentralLimit"}
```yaml
modo: multivariado
poblacion: parabola
n: 40
```
:::

:::figura[Propiedad: coordenadas discretas y correlacionadas. Para el dado y su paridad, la nube individual son 6 puntos; la media de 30 tiradas ya se reparte en la elipse con correlación 0.29.]{componente="CentralLimit"}
```yaml
modo: multivariado
poblacion: dado-par
n: 30
```
:::

## Errores comunes

- **Verificar solo las marginales.** Que cada coordenada sea aproximadamente normal no garantiza que el vector lo sea; el teorema asegura la normalidad conjunta.
- **Olvidar las covarianzas.** Tratar las coordenadas como independientes cuando $\boldsymbol{\Sigma}$ tiene entradas fuera de la diagonal produce regiones de confianza con la orientación equivocada.
- **Usar la covarianza de las medias en lugar de la de una observación.** El vector de medias tiene covarianza $\boldsymbol{\Sigma}/n$; la del límite reescalado por $\sqrt{n}$ es $\boldsymbol{\Sigma}$.
- **Pensar que necesita $\boldsymbol{\Sigma}$ invertible.** El teorema vale con $\boldsymbol{\Sigma}$ singular; el límite es una normal degenerada concentrada en un subespacio.

:::figura[Error común: n pequeño. Con n = 2 la nube de medias todavía conserva la curvatura de la parábola y no es elíptica.]{componente="CentralLimit"}
```yaml
modo: multivariado
poblacion: parabola
n: 2
```
:::

## Conexiones

Extiende el [[tcl-de-lindeberg-levy]] a vectores mediante el recurso de Cramér-Wold. La matriz de covarianza límite es [[matrices-definidas-positivas-y-semidefinidas|semidefinida positiva]] y sus [[valores-y-vectores-propios]] dan los ejes de las elipses, como en una [[formas-cuadraticas|forma cuadrática]]. Es la base del [[metodo-delta-multivariado]] y del [[teorema-de-donsker]], que lo lleva a dimensión infinita.

## Formulario

:::formula[TCL multivariado]
$$
\sqrt{n}\,\big(\bar{\mathbf{X}}_n - \boldsymbol{\mu}\big) \xrightarrow{d} \mathcal{N}_k(\mathbf{0}, \boldsymbol{\Sigma})
$$

- $\bar{\mathbf{X}}_n$: vector de medias de $n$ observaciones.
- $\boldsymbol{\mu}$: vector de medias poblacional.
- $\boldsymbol{\Sigma}$: matriz de covarianza de una observación.
- $k$: dimensión.
:::

:::formula[Cramér-Wold]
$$
\mathbf{Y}_n \xrightarrow{d} \mathbf{Y} \iff \mathbf{a}^\top\mathbf{Y}_n \xrightarrow{d} \mathbf{a}^\top\mathbf{Y}\ \ \forall \mathbf{a}
$$

- $\mathbf{a}$: vector de coeficientes.
:::

:::formula[Transformaciones lineales]
$$
\sqrt{n}\,\mathbf{A}(\bar{\mathbf{X}}_n - \boldsymbol{\mu}) \xrightarrow{d} \mathcal{N}(\mathbf{0}, \mathbf{A}\boldsymbol{\Sigma}\mathbf{A}^\top)
$$

- $\mathbf{A}$: matriz de coeficientes con $k$ columnas.
:::

:::formula[Forma cuadrática]
$$
n\,(\bar{\mathbf{X}}_n - \boldsymbol{\mu})^\top\boldsymbol{\Sigma}^{-1}(\bar{\mathbf{X}}_n - \boldsymbol{\mu}) \xrightarrow{d} \chi^2_k
$$

- $\boldsymbol{\Sigma}^{-1}$: inversa de la covarianza.
- $\chi^2_k$: ji cuadrada con $k$ grados de libertad.
:::

:::formula[Semiejes de la región del 95 %]
$$
\text{semieje}_j = \sqrt{\chi^2_{k,\,0.95}}\,\sqrt{\frac{\lambda_j}{n}}
$$

- $\lambda_j$: valores propios de $\boldsymbol{\Sigma}$.
- $\chi^2_{k,\,0.95}$: cuantil 0.95 de la ji cuadrada; para $k = 2$ vale 5.991 y su raíz, 2.448.
:::
