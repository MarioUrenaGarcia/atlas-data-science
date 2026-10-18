---
id: matriz-de-covarianza
titulo: Matriz de covarianza
titulo_en: Covariance matrix
alias:
  - matriz de varianzas y covarianzas
  - matriz de dispersión
  - Sigma
modulo: 1
submodulo: '1.4'
orden: 8
nivel: intermedio
prerrequisitos:
  - covarianza
  - matrices-definidas-positivas-y-semidefinidas
relaciones:
  - tipo: relacionado
    id: matriz-de-correlacion
  - tipo: relacionado
    id: formas-cuadraticas
etiquetas:
  - vector aleatorio
  - varianzas y covarianzas
  - elipses
  - semidefinida positiva
resumen: >
  La matriz de covarianza de un vector aleatorio tiene las varianzas en la diagonal y las covarianzas fuera de ella. Es simétrica y semidefinida positiva, y sus vectores propios dan los ejes de la dispersión.
formula: '\boldsymbol{\Sigma} = \mathbb{E}\big[(\mathbf{X} - \boldsymbol{\mu})(\mathbf{X} - \boldsymbol{\mu})^\top\big], \qquad \Sigma_{ij} = \operatorname{Cov}(X_i, X_j)'
visualizacion:
  componente: JointDistribution2D
  parametros:
    modo: matriz-covarianza
    modelo: normal-bivariada
    parametros:
      sigmaX: 2
      sigmaY: 1
      rho: 0.5
referencias:
  - clave: blitzstein-hwang
    capitulo: '7.5'
  - clave: wasserman
publicado: true
---

## Intuición

Con dos o más variables, una sola varianza ya no describe la dispersión: cada variable tiene la suya y cada par tiene una covarianza. La **matriz de covarianza** las ordena en una tabla cuadrada: en la diagonal, la varianza de cada coordenada; fuera de ella, la covarianza de cada par.

Esa tabla tiene una lectura geométrica precisa. Para una normal bivariada, las curvas de igual densidad son elipses, y la matriz decide su forma: las varianzas estiran la nube a lo largo de los ejes coordenados y la covarianza la inclina. Los ejes de las elipses apuntan en las direcciones de los vectores propios de la matriz, y su longitud es proporcional a la raíz de los valores propios: el valor propio grande es la varianza en la dirección de mayor dispersión.

## Definición

:::definicion[Matriz de covarianza]
Sea $\mathbf{X} = (X_1, \dots, X_d)^\top$ un vector aleatorio con medias $\boldsymbol{\mu} = \mathbb{E}[\mathbf{X}]$ y varianzas finitas. Su **matriz de covarianza** es la matriz $d \times d$
$$
\boldsymbol{\Sigma} = \mathbb{E}\big[(\mathbf{X} - \boldsymbol{\mu})(\mathbf{X} - \boldsymbol{\mu})^\top\big], \qquad \Sigma_{ij} = \operatorname{Cov}(X_i, X_j).
$$
:::

Para dos variables con desviaciones estándar $\sigma_X$, $\sigma_Y$ y correlación $\rho$,
$$
\boldsymbol{\Sigma} = \begin{pmatrix} \sigma_X^2 & \rho\,\sigma_X\sigma_Y \\ \rho\,\sigma_X\sigma_Y & \sigma_Y^2 \end{pmatrix}.
$$

:::figura[Con varianzas iguales a 1 y correlación 0, la matriz de covarianza es la identidad y las elipses son círculos: no hay dirección preferida.]{componente="JointDistribution2D"}
```yaml
modo: matriz-covarianza
modelo: normal-bivariada
parametros:
  sigmaX: 1
  sigmaY: 1
  rho: 0
```
:::

:::nota[Qué significa cada símbolo]
- $\mathbf{X}$: vector aleatorio con coordenadas $X_1, \dots, X_d$.
- $\boldsymbol{\mu}$: vector de medias.
- $\boldsymbol{\Sigma}$: matriz de covarianza; $\Sigma_{ij}$, su entrada $(i, j)$.
- $^\top$: transpuesta.
- $\sigma_X$, $\sigma_Y$: desviaciones estándar; $\rho$: correlación.
- $\mathbf{a}$: vector de pesos de una combinación lineal.
- $\mathbf{A}$: matriz de una transformación lineal; $\mathbf{b}$: vector constante.
- $\mathbf{Q}$: matriz cuyas columnas son los vectores propios; $\boldsymbol{\Lambda}$: matriz diagonal de valores propios.
- $\det$: determinante.
- $\lambda_1$, $\lambda_2$: valores propios; $\mathbf{S}_n$: matriz de covarianza muestral con $n$ puntos.
:::

## Cómo usar la visualización

El encabezado muestra la matriz $\boldsymbol{\Sigma}$ con $\sigma_X = 2$, $\sigma_Y = 1$ y $\rho = 0.5$; cuando empiezan a aparecer puntos simulados, muestra a su lado la matriz de covarianza muestral $\mathbf{S}_n$, que se acerca a $\boldsymbol{\Sigma}$ conforme crece $n$. Las elipses marcan una y dos desviaciones estándar en el sentido de la forma cuadrática, y los segmentos son los ejes propios: el largo apunta en la dirección de mayor varianza, 4.30, y el corto en la de menor, 0.70.

Las tres deslizaderas cambian las desviaciones estándar y la correlación. Con $\rho = 0$ los ejes se alinean con los ejes coordenados; con $\rho$ cerca de 1 la elipse se aplasta y el valor propio menor se acerca a 0.

## Ejemplo

Dos inversiones tienen rendimientos $X$ y $Y$ con $\sigma_X = 1.5$, $\sigma_Y = 1$ y $\rho = -0.6$:
$$
\boldsymbol{\Sigma} = \begin{pmatrix} 2.25 & -0.9 \\ -0.9 & 1 \end{pmatrix}.
$$

1. Un portafolio con la mitad en cada una tiene rendimiento $\mathbf{a}^\top \mathbf{X}$ con $\mathbf{a} = (0.5, 0.5)^\top$.
2. Su varianza es $\mathbf{a}^\top \boldsymbol{\Sigma}\, \mathbf{a} = 0.25 \cdot 2.25 + 2 \cdot 0.25 \cdot (-0.9) + 0.25 \cdot 1 = 0.5625 - 0.45 + 0.25 = 0.3625$.
3. Es menor que la varianza de cualquiera de las dos inversiones: la covarianza negativa compensa los movimientos.

:::figura[El ejemplo de las inversiones: con correlación $-0.6$ la nube se inclina hacia abajo, y la dirección $(1, 1)$, la del portafolio mitad y mitad, queda cerca del eje corto.]{componente="JointDistribution2D"}
```yaml
modo: matriz-covarianza
modelo: normal-bivariada
parametros:
  sigmaX: 1.5
  sigmaY: 1
  rho: -0.6
```
:::

## Propiedades

- **Simétrica y semidefinida positiva:** $\boldsymbol{\Sigma}^\top = \boldsymbol{\Sigma}$ y $\mathbf{a}^\top \boldsymbol{\Sigma}\, \mathbf{a} = \operatorname{Var}(\mathbf{a}^\top \mathbf{X}) \ge 0$ para todo $\mathbf{a}$.
- **Transformaciones lineales:** $\operatorname{Cov}(\mathbf{A}\mathbf{X} + \mathbf{b}) = \mathbf{A}\, \boldsymbol{\Sigma}\, \mathbf{A}^\top$.
- **Ejes propios:** $\boldsymbol{\Sigma} = \mathbf{Q} \boldsymbol{\Lambda} \mathbf{Q}^\top$; las columnas de $\mathbf{Q}$ son las direcciones de dispersión y los valores propios en $\boldsymbol{\Lambda}$ son las varianzas en esas direcciones.
- **Varianza generalizada:** $\det \boldsymbol{\Sigma}$, producto de los valores propios, mide el volumen de la nube; es 0 si alguna combinación lineal de las coordenadas es constante.
- **Independencia:** si las coordenadas son independientes, $\boldsymbol{\Sigma}$ es diagonal; el recíproco solo vale para vectores normales.

:::figura[Con correlación 0.95 la elipse casi colapsa en una recta: el valor propio menor es muy pequeño y el determinante se acerca a 0, porque $X - Y$ casi no varía.]{componente="JointDistribution2D"}
```yaml
modo: matriz-covarianza
modelo: normal-bivariada
parametros:
  sigmaX: 1
  sigmaY: 1
  rho: 0.95
```
:::

## Errores comunes

- **Aceptar cualquier matriz simétrica.** Una matriz con varianzas 1 y covarianza 1.2 no es una matriz de covarianza: no es semidefinida positiva y daría una correlación mayor que 1.
- **Confundirla con la matriz de correlación.** La matriz de correlación tiene unos en la diagonal; la de covarianza conserva las escalas de cada variable.
- **Leer la inclinación de la nube solo en la covarianza.** La dirección de los ejes depende también de las varianzas: con varianzas muy distintas, una correlación moderada da ejes casi alineados con el eje de la variable más dispersa.

:::figura[Correlación 0.5 con $\sigma_X = 3$ y $\sigma_Y = 0.5$: los ejes propios casi coinciden con los coordenados, aunque la correlación es la misma que en la figura principal.]{componente="JointDistribution2D"}
```yaml
modo: matriz-covarianza
modelo: normal-bivariada
parametros:
  sigmaX: 3
  sigmaY: 0.5
  rho: 0.5
```
:::

## Conexiones

La matriz de covarianza reúne la [[covarianza]] de todos los pares y la [[varianza]] de cada coordenada. Es una de las [[matrices-definidas-positivas-y-semidefinidas]], y sus [[valores-y-vectores-propios]] describen la forma de la dispersión mediante el [[teorema-espectral]]; la varianza de una combinación lineal es una de las [[formas-cuadraticas]]. Normalizada da la [[matriz-de-correlacion]]. En los teoremas límite aparece en el [[tcl-multivariado]] y en el [[metodo-delta-multivariado]].

## Formulario

:::formula[Definición]
$$
\boldsymbol{\Sigma} = \mathbb{E}\big[(\mathbf{X} - \boldsymbol{\mu})(\mathbf{X} - \boldsymbol{\mu})^\top\big]
$$

- $\Sigma_{ij} = \operatorname{Cov}(X_i, X_j)$, $\Sigma_{ii} = \operatorname{Var}(X_i)$.
:::

:::formula[Caso de dos variables]
$$
\boldsymbol{\Sigma} = \begin{pmatrix} \sigma_X^2 & \rho\,\sigma_X\sigma_Y \\ \rho\,\sigma_X\sigma_Y & \sigma_Y^2 \end{pmatrix}
$$

- $\rho$: correlación entre $X$ y $Y$.
:::

:::formula[Combinación lineal]
$$
\operatorname{Var}(\mathbf{a}^\top \mathbf{X}) = \mathbf{a}^\top \boldsymbol{\Sigma}\, \mathbf{a}
$$

- $\mathbf{a}$: vector de pesos.
:::

:::formula[Transformación lineal]
$$
\operatorname{Cov}(\mathbf{A}\mathbf{X} + \mathbf{b}) = \mathbf{A}\, \boldsymbol{\Sigma}\, \mathbf{A}^\top
$$

- $\mathbf{A}$: matriz; $\mathbf{b}$: vector constante.
:::
