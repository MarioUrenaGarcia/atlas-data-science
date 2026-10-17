---
id: consistencia
titulo: Consistencia
titulo_en: Consistency
alias:
  - estimador consistente
  - consistencia débil
modulo: 6
submodulo: '6.2'
orden: 6
nivel: intermedio
prerrequisitos:
  - error-cuadratico-medio
  - convergencia-en-probabilidad
relaciones:
  - tipo: relacionado
    id: ley-debil-de-los-grandes-numeros
etiquetas:
  - inferencia
  - consistencia
  - convergencia
  - tamaño de muestra
resumen: >
  Un estimador es consistente si, al crecer el tamaño de muestra, la probabilidad de que se aleje del valor
  verdadero más de cualquier tolerancia tiende a cero. Es la garantía mínima de que más datos ayudan.
formula: '\hat{\theta}_n \xrightarrow{P} \theta \iff \lim_{n \to \infty} P\big(|\hat{\theta}_n - \theta| > \varepsilon\big) = 0\ \ \forall \varepsilon > 0'
visualizacion:
  componente: EstimatorLab
  parametros:
    modo: consistencia
    problema: media-normal
    estimadores: [media, primero]
    nMaximo: 500
    epsilon: 0.2
    theta: 2
referencias:
  - clave: wasserman
    capitulo: '6'
  - clave: casella-berger
    capitulo: '10'
publicado: true
---

## Intuición

Un estimador debería mejorar con más datos. Si una encuestadora entrevista a 100 personas y luego a 10000, espera que la segunda estimación esté más cerca de la verdad. Un estimador **consistente** garantiza eso: con muestras cada vez más grandes, la probabilidad de equivocarse por más de una tolerancia cualquiera se va a cero.

No todo estimador lo cumple. Usar solo el primer dato de la muestra para estimar la media es insesgado, pero no importa cuántos datos se junten: la estimación sigue siendo un solo dato y sigue igual de errática. En cambio, la media de todos los datos se va encerrando en una banda cada vez más angosta alrededor del valor verdadero. La consistencia es una propiedad de la sucesión de estimadores al crecer $n$, no de una muestra en particular.

## Definición

:::definicion[Consistencia]
Una sucesión de estimadores $\hat{\theta}_n = t_n(X_1, \dots, X_n)$ es **consistente** para $\theta$ si converge en probabilidad a $\theta$, lo que se escribe $\hat{\theta}_n \xrightarrow{P} \theta$:
$$
\lim_{n \to \infty} P_\theta\big(|\hat{\theta}_n - \theta| > \varepsilon\big) = 0\quad \text{para todo } \varepsilon > 0 \text{ y todo } \theta.
$$
:::

Condición suficiente: si $\operatorname{ECM}(\hat{\theta}_n) \to 0$, es decir, si el sesgo y la varianza tienden a cero, el estimador es consistente, porque la desigualdad de Markov aplicada a $(\hat{\theta}_n - \theta)^2$ (el mismo argumento que produce la desigualdad de Chebyshev) da
$$
P\big(|\hat{\theta}_n - \theta| > \varepsilon\big) \le \frac{\operatorname{ECM}(\hat{\theta}_n)}{\varepsilon^2}.
$$

:::nota[Qué significa cada símbolo]
- $\hat{\theta}_n$: estimador calculado con $n$ observaciones; $t_n$: su regla.
- $\theta$: valor verdadero; $\varepsilon$: tolerancia positiva.
- $P_\theta$: probabilidad cuando el parámetro vale $\theta$.
- $\xrightarrow{P}$: convergencia en probabilidad.
- $\operatorname{ECM}$: error cuadrático medio.
:::

## Cómo usar la visualización

Cada línea sigue a un estimador mientras una misma muestra crece de 2 a 500 observaciones. Arriba, la media muestral; abajo, el primer dato. La banda sombreada es $\theta \pm \varepsilon$. El encabezado estima, con 25 trayectorias, la probabilidad de quedar fuera de la banda para el tamaño actual.

El control **Tolerancia** cambia $\varepsilon$.

Experimentos sugeridos:

1. Observar cómo las trayectorias de la media se meten en la banda y ya no salen.
2. Comparar con el primer dato: sus líneas son horizontales, porque agregar datos no lo cambia, y la fracción fuera de la banda no baja.
3. Reducir $\varepsilon$ a 0.05: la media necesita más datos para entrar en la banda, pero termina entrando.

## Ejemplo

Media de datos con $\sigma = 1$, tolerancia $\varepsilon = 0.2$.

1. $\operatorname{ECM}(\bar{X}_n) = \sigma^2/n = 1/n$.
2. Cota: $P(|\bar{X}_n - \mu| > 0.2) \le \frac{1/n}{0.04} = \frac{25}{n}$.
3. Con $n = 500$: la cota es $0.05$. El valor exacto con la normal es $P(|Z| > 0.2\sqrt{500}) = P(|Z| > 4.47)$, prácticamente cero.
4. Para el primer dato: $P(|X_1 - \mu| > 0.2) = P(|Z| > 0.2) \approx 0.84$ para cualquier $n$.

:::figura[Estimación de la varianza normal con los divisores n y n - 1: ambos son consistentes aunque uno sea sesgado, porque el sesgo desaparece al crecer n.]{componente="EstimatorLab"}
```yaml
modo: consistencia
problema: varianza-normal
estimadores: [s2, mle]
nMaximo: 500
epsilon: 0.3
theta: 2
```
:::

## Propiedades

- **Insesgado no implica consistente** (el primer dato) y **consistente no implica insesgado** (el divisor $n$ en la varianza).
- **ECM que tiende a cero basta** para la consistencia.
- **Se conserva por funciones continuas:** si $\hat{\theta}_n$ es consistente, $g(\hat{\theta}_n)$ lo es para $g(\theta)$.

:::figura[El máximo de una uniforme converge al extremo verdadero muy rápido, aunque siempre desde abajo.]{componente="EstimatorLab"}
```yaml
modo: consistencia
problema: maximo-uniforme
estimadores: [maximo, momentos]
nMaximo: 300
epsilon: 0.2
theta: 2
```
:::

## Errores comunes

- **Creer que consistente significa bueno para una muestra pequeña.** Es una propiedad límite; con $n$ chico puede ser peor que otro estimador.
- **Confundir consistencia con insesgadez.** Son propiedades distintas: una mira el límite, la otra el promedio para cada $n$.
- **Suponer que basta que la varianza baje.** Si el sesgo no desaparece, el estimador converge a un valor equivocado.

:::figura[Un estimador inconsistente: n veces el mínimo de una exponencial, insesgado para la media, no se concentra al crecer la muestra.]{componente="EstimatorLab"}
```yaml
modo: consistencia
problema: media-exponencial
estimadores: [media, minimo]
nMaximo: 300
epsilon: 0.3
theta: 2
```
:::

## Conexiones

La consistencia es [[convergencia-en-probabilidad]] del estimador al parámetro. La [[ley-debil-de-los-grandes-numeros]] dice que la media muestral es consistente. Se garantiza cuando el [[error-cuadratico-medio]] tiende a cero, y el [[teorema-del-mapeo-continuo]] la conserva al transformar.

## Formulario

:::formula[Consistencia]
$$
\lim_{n \to \infty} P_\theta\big(|\hat{\theta}_n - \theta| > \varepsilon\big) = 0
$$

- $\hat{\theta}_n$: estimador con $n$ datos; $\varepsilon$: tolerancia; $\theta$: valor verdadero.
:::

:::formula[Cota por el error cuadrático medio]
$$
P\big(|\hat{\theta}_n - \theta| > \varepsilon\big) \le \frac{\operatorname{ECM}(\hat{\theta}_n)}{\varepsilon^2}
$$

- Desigualdad de Markov aplicada a $(\hat{\theta}_n - \theta)^2$.
:::

:::formula[Caso de la media]
$$
P\big(|\bar{X}_n - \mu| > \varepsilon\big) \le \frac{\sigma^2}{n\varepsilon^2}
$$

- $\bar{X}_n$: media de $n$ datos; $\mu$, $\sigma^2$: media y varianza de la población.
:::
