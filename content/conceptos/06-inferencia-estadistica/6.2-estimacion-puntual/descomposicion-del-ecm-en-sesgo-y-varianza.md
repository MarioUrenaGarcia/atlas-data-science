---
id: descomposicion-del-ecm-en-sesgo-y-varianza
titulo: Descomposición del ECM en sesgo y varianza
titulo_en: Bias-variance decomposition of the mean squared error
alias:
  - compromiso sesgo-varianza en estimación
  - ECM igual a varianza más sesgo al cuadrado
modulo: 6
submodulo: '6.2'
orden: 5
nivel: intermedio
prerrequisitos:
  - error-cuadratico-medio
etiquetas:
  - inferencia
  - sesgo
  - varianza
  - contracción
resumen: >
  El error cuadrático medio se separa exactamente en varianza más sesgo al cuadrado. Aceptar algo de sesgo,
  por ejemplo contrayendo la media hacia un valor, puede reducir tanto la varianza que el error total baje.
formula: '\mathbb{E}\big[(\hat{\theta} - \theta)^2\big] = \operatorname{Var}(\hat{\theta}) + \big(\mathbb{E}[\hat{\theta}] - \theta\big)^2'
visualizacion:
  componente: EstimatorLab
  parametros:
    modo: compromiso
    n: 5
    theta: 1
    sigma: 3
referencias:
  - clave: hastie-esl
    capitulo: '7'
  - clave: casella-berger
    capitulo: '7'
publicado: true
---

## Intuición

Para estimar el efecto de un fertilizante se cuenta con 5 parcelas, muy variables entre sí. La media de las 5 es insesgada, pero oscila mucho. Una alternativa es multiplicarla por un factor menor que 1, acercándola a cero: si en realidad el efecto es pequeño, esa contracción casi no introduce error sistemático y en cambio calma mucho las oscilaciones. Se paga con sesgo y se cobra en varianza.

La **descomposición del error cuadrático medio** hace exacto ese intercambio: el error total es la suma de la varianza y del sesgo al cuadrado, sin términos cruzados. Si un cambio en el estimador baja la varianza más de lo que sube el sesgo al cuadrado, el error total baja. Con pocos datos y mucho ruido, el mejor estimador en error cuadrático medio casi nunca es el insesgado. Esta misma idea gobierna la regularización en aprendizaje automático.

## Definición

:::teorema[Descomposición del error cuadrático medio]
Para cualquier estimador $\hat{\theta}$ con varianza finita,
$$
\mathbb{E}\big[(\hat{\theta} - \theta)^2\big] = \operatorname{Var}(\hat{\theta}) + \big(\mathbb{E}[\hat{\theta}] - \theta\big)^2.
$$
:::

:::demostracion[Prueba]
Sea $m = \mathbb{E}[\hat{\theta}]$. Sumando y restando $m$, $(\hat{\theta} - \theta)^2 = (\hat{\theta} - m)^2 + 2(\hat{\theta} - m)(m - \theta) + (m - \theta)^2$. Al tomar esperanza, el término cruzado se anula porque $\mathbb{E}[\hat{\theta} - m] = 0$, y queda $\operatorname{Var}(\hat{\theta}) + (m - \theta)^2$.
:::

Ejemplo central, la media contraída $c\bar{X}$ con $0 \le c \le 1$ y datos con media $\mu$ y varianza $\sigma^2$:
$$
\operatorname{ECM}(c\bar{X}) = c^2\frac{\sigma^2}{n} + (1 - c)^2\mu^2,
$$
que se minimiza en $c^{*} = \dfrac{\mu^2}{\mu^2 + \sigma^2/n}$.

:::nota[Qué significa cada símbolo]
- $\hat{\theta}$: estimador; $\theta$: valor verdadero; $m$: esperanza del estimador.
- $\operatorname{Var}(\hat{\theta})$: varianza; $\mathbb{E}[\hat{\theta}] - \theta$: sesgo.
- $c$: factor de contracción; $\bar{X}$: media muestral; $n$: tamaño de muestra.
- $\mu$, $\sigma^2$: media y varianza de los datos.
- $c^{*}$: factor que minimiza el error cuadrático medio.
:::

## Cómo usar la visualización

El factor $c$ recorre de 0 a 1. Las curvas muestran la varianza $c^2\sigma^2/n$, que crece, el sesgo al cuadrado $(1 - c)^2\mu^2$, que decrece, y su suma, el error cuadrático medio. La animación termina en el factor óptimo $c^{*}$, marcado con una línea punteada.

Controles: tamaño de muestra $n$, media verdadera $\mu$ y desviación $\sigma$.

Experimentos sugeridos:

1. Comparar el error en $c = 1$ (insesgado) con el mínimo: con $n = 5$, $\mu = 1$ y $\sigma = 3$, el mínimo es casi la tercera parte.
2. Subir $n$ a 100: $c^{*}$ se acerca a 1; con muchos datos conviene contraer poco.
3. Subir $\mu$ a 5: el sesgo pesa más y $c^{*}$ también se acerca a 1.

## Ejemplo

Con $\mu = 1$, $\sigma = 3$ y $n = 5$, la varianza de la media es $\sigma^2/n = 9/5 = 1.8$.

1. Insesgado, $c = 1$: $\operatorname{ECM} = 1.8$.
2. Factor óptimo: $c^{*} = 1/(1 + 1.8) \approx 0.357$.
3. En $c^{*}$: varianza $0.357^2 \cdot 1.8 \approx 0.230$; sesgo al cuadrado $(0.643)^2 \cdot 1 \approx 0.413$; total $\approx 0.643$.
4. Fórmula cerrada del mínimo: $\mu^2 \frac{\sigma^2/n}{\mu^2 + \sigma^2/n} = 1.8/2.8 \approx 0.643$, poco más de la tercera parte de 1.8.

:::figura[Con 50 parcelas en lugar de 5: la varianza de la media baja a 0.18 y el factor óptimo sube a 0.85.]{componente="EstimatorLab"}
```yaml
modo: compromiso
n: 50
theta: 1
sigma: 3
```
:::

## Propiedades

- **No hay término cruzado:** la suma es exacta para cualquier estimador.
- **El óptimo depende del parámetro desconocido:** $c^{*}$ requiere conocer $\mu$, por eso en la práctica se estima o se elige por validación.
- **Generaliza a predicción:** el error esperado de un modelo se descompone en sesgo al cuadrado, varianza y ruido irreducible.

:::figura[Sesgo y varianza simulados para tres divisores de la suma de cuadrados: el error total es menor con el divisor n + 1, sesgado.]{componente="EstimatorLab"}
```yaml
modo: comparar
problema: varianza-normal
n: 4
theta: 3
```
:::

## Errores comunes

- **Pensar que un sesgo pequeño siempre es tolerable.** Si el parámetro está lejos del punto hacia el que se contrae, el sesgo domina.
- **Sumar sesgo y desviación estándar.** La descomposición suma el sesgo al cuadrado con la varianza, no el sesgo con la desviación.
- **Confundirla con la descomposición de la varianza de los datos.** Aquí se descompone el error del estimador respecto al valor verdadero.

:::figura[Contraer cuando el parámetro está lejos: con media 5, el sesgo al cuadrado crece rápido y el factor óptimo casi no se separa de 1.]{componente="EstimatorLab"}
```yaml
modo: compromiso
n: 5
theta: 5
sigma: 3
```
:::

## Conexiones

La descomposición une el [[sesgo-de-un-estimador]], la [[varianza-de-un-estimador]] y el [[error-cuadratico-medio]]. La media contraída es la idea de los estimadores de contracción y del estimador de James-Stein. En aprendizaje automático reaparece como el compromiso entre sesgo y varianza de los modelos.

## Formulario

:::formula[Descomposición del ECM]
$$
\mathbb{E}\big[(\hat{\theta} - \theta)^2\big] = \operatorname{Var}(\hat{\theta}) + \big(\mathbb{E}[\hat{\theta}] - \theta\big)^2
$$

- $\hat{\theta}$: estimador; $\theta$: valor verdadero.
:::

:::formula[Error de la media contraída]
$$
\operatorname{ECM}(c\bar{X}) = c^2\frac{\sigma^2}{n} + (1 - c)^2\mu^2
$$

- $c$: factor de contracción; $\sigma^2/n$: varianza de la media; $\mu$: media verdadera.
:::

:::formula[Factor óptimo]
$$
c^{*} = \frac{\mu^2}{\mu^2 + \sigma^2/n},\qquad \operatorname{ECM}(c^{*}\bar{X}) = \frac{\mu^2\,\sigma^2/n}{\mu^2 + \sigma^2/n}
$$

- El error mínimo siempre es menor que $\sigma^2/n$, el del estimador insesgado.
:::
