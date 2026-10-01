---
id: funcion-sigmoide-y-funcion-softplus
titulo: Función sigmoide y función softplus
titulo_en: Sigmoid and softplus functions
alias:
  - función logística
  - sigmoide
  - softplus
  - log-odds
modulo: 0
submodulo: '0.4'
orden: 23
nivel: basico
prerrequisitos:
  - funcion-exponencial-y-logaritmo-natural
  - regla-de-la-cadena
etiquetas:
  - sigmoide
  - softplus
  - regresión logística
  - funciones de activación
resumen: >
  La sigmoide 1/(1 + e^(-x)) convierte cualquier número real en un valor entre 0 y 1, y la softplus
  log(1 + e^x) es una versión suave de max(0, x); la derivada de la softplus es la sigmoide.
formula: '\sigma(x) = \frac{1}{1 + e^{-x}}, \qquad \operatorname{softplus}(x) = \log(1 + e^{x}), \qquad \operatorname{softplus}''(x) = \sigma(x)'
visualizacion:
  componente: CalculusViz
  parametros:
    modo: derivadas
    funciones: [softplus, sigmoide]
    orden: 2
referencias:
  - clave: goodfellow
    capitulo: '3'
  - clave: bishop
publicado: true
---

## Intuición

Muchos modelos producen un puntaje que puede ser cualquier número, positivo o negativo, pero lo que se necesita es una probabilidad entre 0 y 1. La sigmoide hace esa conversión de forma suave: puntajes muy negativos dan probabilidades cercanas a 0, muy positivos cercanas a 1, y el puntaje 0 da exactamente 0.5. Su forma de S también describe el crecimiento de una población con recursos limitados o la adopción de una tecnología.

La softplus resuelve otro problema: produce números siempre positivos, como una varianza o una tasa, sin el quiebre brusco de la función $\max(0, x)$. Para $x$ muy negativo se acerca a 0 y para $x$ muy positivo se parece a la recta $y = x$. Ambas están íntimamente ligadas: la pendiente de la softplus en cada punto es exactamente el valor de la sigmoide ahí. Por eso aparecen juntas en la regresión logística, en las redes neuronales y en las funciones de pérdida de clasificación.

## Definición

:::definicion[Sigmoide y softplus]
$$
\sigma(x) = \frac{1}{1 + e^{-x}} = \frac{e^{x}}{1 + e^{x}}, \qquad \operatorname{softplus}(x) = \log(1 + e^{x}).
$$
La inversa de la sigmoide es la **función logit**, $\sigma^{-1}(p) = \log\frac{p}{1 - p}$, definida para $0 < p < 1$.
:::

:::teorema[Derivadas]
$$
\sigma'(x) = \sigma(x)\,\big(1 - \sigma(x)\big), \qquad \operatorname{softplus}'(x) = \sigma(x).
$$
:::

:::nota[Qué significa cada símbolo]
- $\sigma(x)$: sigmoide o función logística.
- $e^{x}$: exponencial natural.
- $\log$: logaritmo natural.
- $\operatorname{softplus}(x)$: versión suave de $\max(0, x)$.
- $p$: probabilidad entre 0 y 1.
- $\frac{p}{1 - p}$: momios u *odds*; $\log\frac{p}{1 - p}$ es su logaritmo.
:::

## Cómo usar la visualización

El selector cambia entre la softplus y la sigmoide. El primer panel muestra la función con su tangente, el segundo su derivada y el tercero su segunda derivada. Con la softplus, la gráfica del segundo panel es exactamente la sigmoide; con la sigmoide, el segundo panel es la campana $\sigma(1 - \sigma)$.

Al recorrer la softplus, la pendiente de la tangente pasa de casi 0 a casi 1, que son los valores extremos de la sigmoide. En la sigmoide, la derivada es máxima en 0, donde vale 0.25, y se apaga en los extremos: ahí la función está saturada y casi no responde a cambios.

## Ejemplo

Un modelo de riesgo crediticio asigna a un cliente el puntaje $x = 2$.

1. Probabilidad de impago: $\sigma(2) = \frac{1}{1 + e^{-2}} = \frac{1}{1 + 0.1353} = 0.8808$.
2. Sensibilidad: $\sigma'(2) = 0.8808 \cdot 0.1192 = 0.1050$; subir el puntaje en 0.1 sube la probabilidad en cerca de 0.0105.
3. Logit de vuelta: $\log\frac{0.8808}{0.1192} = \log 7.389 = 2$.
4. Softplus del mismo puntaje: $\log(1 + e^{2}) = \log 8.389 = 2.1269$, apenas mayor que 2.
5. Para $x = -2$: $\sigma(-2) = 1 - \sigma(2) = 0.1192$ y $\operatorname{softplus}(-2) = 0.1269$, un número pequeño pero positivo.

:::figura[El puntaje del ejemplo sobre la sigmoide: en x = 2 la altura es 0.8808 y las secantes giran hasta la tangente, cuya pendiente es la sensibilidad 0.1050.]{componente="CalculusViz"}
```yaml
modo: secante
funcion: sigmoide
x0: 2
```
:::

:::figura[El mismo puntaje sobre la softplus: en x = 2 la altura es 2.1269, apenas sobre la recta y = x, y la pendiente de la tangente es 0.8808, el valor de la sigmoide en 2, porque la derivada de la softplus es la sigmoide.]{componente="CalculusViz"}
```yaml
modo: secante
funcion: softplus
x0: 2
```
:::

## Propiedades

- **Simetría:** $\sigma(-x) = 1 - \sigma(x)$, así que $\sigma(0) = \tfrac{1}{2}$.
- **Relación entre ambas:** $\operatorname{softplus}(x) - \operatorname{softplus}(-x) = x$ y $\log\sigma(x) = -\operatorname{softplus}(-x)$.
- **Integral:** $\int_{-\infty}^{x}\sigma(t)\,dt = \operatorname{softplus}(x)$.
- **Acotamientos:** $0 < \sigma(x) < 1$ y $\max(0, x) < \operatorname{softplus}(x) \le \max(0, x) + \log 2$.
- **Saturación:** para $|x|$ grande, $\sigma'(x) \approx 0$, lo que frena el aprendizaje en redes neuronales profundas.
- **Estabilidad numérica:** para $x$ grande conviene calcular $\operatorname{softplus}(x) = x + \log(1 + e^{-x})$ para evitar desbordes.

:::figura[Caso de la softplus como área acumulada: el área bajo la sigmoide desde -6 hasta x traza la softplus, y la pendiente de la curva de abajo es la altura de la sigmoide.]{componente="CalculusViz"}
```yaml
modo: acumulada
funcion: sigmoide
desde: -6
hasta: 6
nombre: softplus
```
:::

:::demostracion
Derivada de la softplus: por la regla de la cadena, $\frac{d}{dx}\log(1 + e^{x}) = \frac{e^{x}}{1 + e^{x}} = \sigma(x)$. Derivada de la sigmoide: $\sigma(x) = (1 + e^{-x})^{-1}$, así que $\sigma'(x) = \frac{e^{-x}}{(1 + e^{-x})^2} = \sigma(x)\cdot\frac{e^{-x}}{1 + e^{-x}} = \sigma(x)(1 - \sigma(x))$.
:::

## Errores comunes

- **Interpretar la salida de la sigmoide como probabilidad calibrada sin más.** Solo lo es si el modelo se entrenó para ello.
- **Confundir softplus con ReLU.** $\max(0, x)$ tiene una esquina en 0; la softplus es suave y siempre positiva.
- **Calcular $e^{-x}$ para $x$ muy negativo sin cuidado.** Puede desbordarse; se usa $\sigma(x) = \frac{e^x}{1 + e^x}$ en ese caso.
- **Olvidar que $\sigma'$ es pequeña en los extremos.** Un modelo muy seguro de sí mismo casi no se corrige con gradientes.

## Conexiones

Ambas funciones se construyen con la [[funcion-exponencial-y-logaritmo-natural|exponencial y el logaritmo]] y sus derivadas se obtienen con la [[regla-de-la-cadena]]. La sigmoide es monótona y tiene un punto de inflexión en 0, como se ve con las [[derivadas-de-orden-superior]]. En estadística, la regresión logística modela $P(Y = 1) = \sigma(\beta_0 + \beta_1 x)$; en aprendizaje profundo, ambas se usan como funciones de activación y para garantizar parámetros positivos.

## Formulario

:::formula[Sigmoide y logit]
$$
\sigma(x) = \frac{1}{1 + e^{-x}}, \qquad \sigma^{-1}(p) = \log\frac{p}{1 - p}
$$

- $p \in (0, 1)$.
:::

:::formula[Softplus]
$$
\operatorname{softplus}(x) = \log(1 + e^{x})
$$

- Aproxima $\max(0, x)$ de forma suave.
:::

:::formula[Derivadas]
$$
\sigma'(x) = \sigma(x)\big(1 - \sigma(x)\big), \qquad \operatorname{softplus}'(x) = \sigma(x)
$$

- La derivada máxima de la sigmoide es $\sigma'(0) = 0.25$.
:::

:::formula[Identidades]
$$
\sigma(-x) = 1 - \sigma(x), \qquad \operatorname{softplus}(x) - \operatorname{softplus}(-x) = x
$$

- Válidas para todo $x$ real.
:::
