---
id: metodo-delta-multivariado
titulo: Método delta multivariado
titulo_en: Multivariate delta method
alias:
  - método delta para varios parámetros
  - propagación de errores con covarianzas
modulo: 3
submodulo: '3.1'
orden: 16
nivel: avanzado
prerrequisitos:
  - metodo-delta
  - tcl-multivariado
etiquetas:
  - normalidad asintótica
  - gradiente
  - matriz de covarianza
  - estimador de razón
resumen: >
  Si un vector de estimadores es asintóticamente normal con covarianza Σ, una función g derivable de
  ese vector también lo es, con varianza ∇gᵀ Σ ∇g: la dispersión del vector proyectada sobre el gradiente.
formula: '\sqrt{n}\,(\mathbf{T}_n - \boldsymbol{\theta}) \xrightarrow{d} \mathcal{N}_k(\mathbf{0}, \boldsymbol{\Sigma}) \ \Rightarrow\ \sqrt{n}\,\big(g(\mathbf{T}_n) - g(\boldsymbol{\theta})\big) \xrightarrow{d} \mathcal{N}\big(0,\ \nabla g(\boldsymbol{\theta})^\top\boldsymbol{\Sigma}\,\nabla g(\boldsymbol{\theta})\big)'
visualizacion:
  componente: AsymptoticTransform
  parametros:
    modo: delta-multivariado
    medias: [4, 2]
    desviaciones: [1.5, 0.8]
    correlacion: 0.4
    transformacion: cociente
    transformaciones:
      - cociente
      - producto
      - distancia
      - diferencia-log
    n: 30
referencias:
  - clave: wasserman
  - clave: casella-berger
publicado: true
---

## Intuición

Un hospital quiere estimar el costo promedio por día de hospitalización. Con una muestra de pacientes calcula el costo medio por paciente y la estancia media en días, y reporta su cociente. Ambos promedios son inciertos y además están correlacionados: los pacientes que se quedan más días suelen costar más. ¿Cuánta incertidumbre tiene el cociente?

El método delta multivariado responde con la misma idea que su versión de una variable, ahora en el plano. Cerca del punto verdadero, la función se parece a un plano tangente, y su valor cambia solo cuando el vector de estimadores se mueve en la dirección del gradiente. Moverse a lo largo de una curva de nivel no cambia el resultado. Por eso la varianza de la función es la varianza de la nube de estimadores proyectada sobre la dirección del gradiente, y en ella entran las covarianzas: si costo y estancia suben juntos, su cociente se mueve menos de lo que sugerirían sus varianzas por separado.

## Definición

:::teorema[Método delta multivariado]
Sea $\mathbf{T}_n$ un vector aleatorio en $\mathbb{R}^k$ con $\sqrt{n}\,(\mathbf{T}_n - \boldsymbol{\theta}) \xrightarrow{d} \mathcal{N}_k(\mathbf{0}, \boldsymbol{\Sigma})$, y sea $g: \mathbb{R}^k \to \mathbb{R}$ diferenciable en $\boldsymbol{\theta}$ con gradiente $\nabla g(\boldsymbol{\theta}) \neq \mathbf{0}$. Entonces
$$
\sqrt{n}\,\big(g(\mathbf{T}_n) - g(\boldsymbol{\theta})\big) \xrightarrow{d} \mathcal{N}\big(0,\ \nabla g(\boldsymbol{\theta})^\top\boldsymbol{\Sigma}\,\nabla g(\boldsymbol{\theta})\big).
$$
:::

Si $\mathbf{g}: \mathbb{R}^k \to \mathbb{R}^m$ tiene matriz jacobiana $\mathbf{J}$ en $\boldsymbol{\theta}$, el límite es $\mathcal{N}_m(\mathbf{0}, \mathbf{J}\boldsymbol{\Sigma}\mathbf{J}^\top)$. Para dos coordenadas con varianzas $\sigma_1^2$, $\sigma_2^2$ y covarianza $\sigma_{12}$:
$$
\nabla g^\top\boldsymbol{\Sigma}\,\nabla g = g_1^2\sigma_1^2 + 2g_1g_2\,\sigma_{12} + g_2^2\sigma_2^2,
$$
donde $g_1$ y $g_2$ son las derivadas parciales en $\boldsymbol{\theta}$.

:::nota[Qué significa cada símbolo]
- $\mathbf{T}_n$: vector de $k$ estimadores calculados con $n$ datos.
- $\boldsymbol{\theta}$: vector de parámetros al que converge.
- $\boldsymbol{\Sigma}$: matriz de covarianza asintótica de $\sqrt{n}(\mathbf{T}_n - \boldsymbol{\theta})$.
- $g$: función de varias variables; $\nabla g(\boldsymbol{\theta})$, su gradiente, el vector de derivadas parciales.
- $\nabla g^\top\boldsymbol{\Sigma}\,\nabla g$: varianza de la proyección sobre el gradiente.
- $\mathbf{J}$: matriz jacobiana de una función con $m$ salidas.
- $g_1, g_2$: derivadas parciales respecto a cada coordenada; $\sigma_{12}$, la covarianza entre coordenadas.
:::

## Cómo usar la visualización

A la izquierda se acumulan pares de medias $(\bar{X}_n, \bar{Y}_n)$ alrededor del punto verdadero; la flecha es el gradiente de $g$ y las líneas rectas son curvas de nivel de su aproximación lineal, separadas por una desviación estándar predicha. A la derecha, el histograma de $g(\bar{X}_n, \bar{Y}_n)$ se compara con la normal del método delta. Los controles fijan la función, el tamaño de muestra y la correlación entre las coordenadas.

Con el cociente $x/y$ y correlación 0.4, la desviación predicha es 0.155. Al bajar la correlación a 0 sube a 0.200, y con correlación negativa el eje largo de la nube se alinea con la dirección del gradiente y la dispersión del cociente crece todavía más. Con la distancia al origen el gradiente apunta en la dirección radial.

## Ejemplo

Se estima el costo por día de hospitalización como $R = \bar{X}/\bar{Y}$, donde $X$ es el costo por paciente (media 4, en decenas de miles de pesos, desviación 1.5) e $Y$ la estancia (media 2 días, desviación 0.8), con correlación 0.4. Se usan $n = 30$ pacientes.

1. Covarianza: $\sigma_{12} = 0.4 \cdot 1.5 \cdot 0.8 = 0.48$.
2. Con $g(x, y) = x/y$: $g_1 = 1/y = 0.5$ y $g_2 = -x/y^2 = -1$ en $(4, 2)$.
3. $\nabla g^\top\boldsymbol{\Sigma}\,\nabla g = 0.5^2 \cdot 2.25 + 2 \cdot 0.5 \cdot (-1) \cdot 0.48 + 1 \cdot 0.64 = 0.5625 - 0.48 + 0.64 = 0.7225$.
4. Error estándar: $\sqrt{0.7225/30} = 0.155$. El costo por día estimado es aproximadamente $\mathcal{N}(2, 0.155^2)$.
5. Si se ignorara la correlación, el resultado sería $\sqrt{1.2025/30} = 0.200$, un error estándar 29 % mayor.

:::figura[El ejemplo del hospital: cociente de costo medio entre estancia media con correlación 0.4. La desviación predicha, 0.155, coincide con la observada.]{componente="AsymptoticTransform"}
```yaml
modo: delta-multivariado
medias: [4, 2]
desviaciones: [1.5, 0.8]
correlacion: 0.4
transformacion: cociente
n: 30
```
:::

## Propiedades

- **Proyección sobre el gradiente:** solo la componente del error en la dirección de $\nabla g$ afecta a $g$ a primer orden.
- **Producto:** $\operatorname{Var}(\bar{X}\bar{Y}) \approx \frac{1}{n}\big(\mu_Y^2\sigma_X^2 + 2\mu_X\mu_Y\sigma_{XY} + \mu_X^2\sigma_Y^2\big)$.
- **Diferencia de logaritmos:** $\log\bar{X} - \log\bar{Y}$ tiene varianza aproximada $\frac{1}{n}\big(\frac{\sigma_X^2}{\mu_X^2} - \frac{2\sigma_{XY}}{\mu_X\mu_Y} + \frac{\sigma_Y^2}{\mu_Y^2}\big)$, la suma de los coeficientes de variación al cuadrado menos la covarianza relativa.
- **Varias salidas:** la covarianza de un vector de funciones es $\mathbf{J}\boldsymbol{\Sigma}\mathbf{J}^\top$.
- **Gradiente nulo:** si $\nabla g(\boldsymbol{\theta}) = \mathbf{0}$, hace falta un desarrollo de segundo orden con la matriz hessiana.

:::figura[Propiedad: el producto de dos medias. El gradiente (y, x) pondera cada varianza con la media de la otra coordenada.]{componente="AsymptoticTransform"}
```yaml
modo: delta-multivariado
medias: [3, 5]
desviaciones: [1, 2]
correlacion: 0
transformacion: producto
n: 40
```
:::

:::figura[Propiedad: la distancia al origen solo responde a errores radiales. Las curvas de nivel lineales son perpendiculares a la dirección del punto.]{componente="AsymptoticTransform"}
```yaml
modo: delta-multivariado
medias: [3, 4]
desviaciones: [1, 1]
correlacion: 0
transformacion: distancia
n: 25
```
:::

## Errores comunes

- **Ignorar las covarianzas.** Sumar solo $g_1^2\sigma_1^2 + g_2^2\sigma_2^2$ sobreestima o subestima la varianza según el signo de la covarianza.
- **Usarlo cuando el denominador puede acercarse a cero.** Para un cociente con $\mu_Y$ pequeño frente a su error estándar, la función no es aproximadamente lineal y la distribución del cociente tiene colas pesadas.
- **Evaluar el gradiente fuera de $\boldsymbol{\theta}$.** Se evalúa en el límite, y en la práctica en las estimaciones.
- **Confundir $\boldsymbol{\Sigma}$ con $\boldsymbol{\Sigma}/n$.** La covarianza del vector de medias es $\boldsymbol{\Sigma}/n$; el teorema usa $\boldsymbol{\Sigma}$ con el factor $\sqrt{n}$.

:::figura[Error común: ignorar la correlación. Con la correlación en -0.6 la nube se alinea con el gradiente del cociente y su dispersión crece mucho.]{componente="AsymptoticTransform"}
```yaml
modo: delta-multivariado
medias: [4, 2]
desviaciones: [1.5, 0.8]
correlacion: -0.6
transformacion: cociente
n: 30
```
:::

## Conexiones

Generaliza el [[metodo-delta]] usando el [[tcl-multivariado]] como punto de partida. La varianza resultante es una [[formas-cuadraticas|forma cuadrática]] en el gradiente, y la matriz $\boldsymbol{\Sigma}$ es [[matrices-definidas-positivas-y-semidefinidas|semidefinida positiva]], así que la varianza nunca es negativa. Se usa para errores estándar de razones, elasticidades y funciones de coeficientes de regresión.

## Formulario

:::formula[Método delta multivariado]
$$
\sqrt{n}\,\big(g(\mathbf{T}_n) - g(\boldsymbol{\theta})\big) \xrightarrow{d} \mathcal{N}\big(0,\ \nabla g^\top\boldsymbol{\Sigma}\,\nabla g\big)
$$

- $\mathbf{T}_n$: vector de estimadores.
- $\boldsymbol{\theta}$: su límite.
- $\boldsymbol{\Sigma}$: covarianza asintótica.
- $\nabla g$: gradiente de $g$ en $\boldsymbol{\theta}$.
:::

:::formula[Varianza en dos coordenadas]
$$
\nabla g^\top\boldsymbol{\Sigma}\,\nabla g = g_1^2\sigma_1^2 + 2g_1g_2\,\sigma_{12} + g_2^2\sigma_2^2
$$

- $g_1$, $g_2$: derivadas parciales.
- $\sigma_1^2$, $\sigma_2^2$: varianzas; $\sigma_{12}$: covarianza.
:::

:::formula[Cociente de medias]
$$
\operatorname{Var}\Big(\frac{\bar{X}}{\bar{Y}}\Big) \approx \frac{1}{n}\Big(\frac{\sigma_X^2}{\mu_Y^2} - \frac{2\mu_X\sigma_{XY}}{\mu_Y^3} + \frac{\mu_X^2\sigma_Y^2}{\mu_Y^4}\Big)
$$

- $\mu_X$, $\mu_Y$: medias; $\sigma_X^2$, $\sigma_Y^2$: varianzas; $\sigma_{XY}$: covarianza.
- $n$: tamaño de muestra.
:::

:::formula[Varias salidas]
$$
\sqrt{n}\,\big(\mathbf{g}(\mathbf{T}_n) - \mathbf{g}(\boldsymbol{\theta})\big) \xrightarrow{d} \mathcal{N}_m\big(\mathbf{0},\ \mathbf{J}\boldsymbol{\Sigma}\mathbf{J}^\top\big)
$$

- $\mathbf{J}$: matriz jacobiana $m \times k$ de $\mathbf{g}$ en $\boldsymbol{\theta}$.
:::
