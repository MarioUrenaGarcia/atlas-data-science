---
id: teorema-de-rao-blackwell
titulo: Teorema de Rao-Blackwell
titulo_en: Rao-Blackwell theorem
alias:
  - rao-blackwellización
  - mejora por condicionamiento
modulo: 6
submodulo: '6.2'
orden: 13
nivel: avanzado
prerrequisitos:
  - suficiencia
  - error-cuadratico-medio
etiquetas:
  - inferencia
  - suficiencia
  - esperanza condicional
  - mejora de estimadores
resumen: >
  Si se condiciona un estimador en un estadístico suficiente, se obtiene un estimador con el mismo sesgo y
  un error cuadrático medio menor o igual. Ningún estimador debería ignorar al estadístico suficiente.
formula: '\hat{\theta} = \mathbb{E}\big[\tilde{\theta} \mid T\big],\qquad \operatorname{ECM}(\hat{\theta}) \le \operatorname{ECM}(\tilde{\theta})'
visualizacion:
  componente: SufficiencyLab
  parametros:
    modo: rao-blackwell
    lambda: 1.5
    n: 10
referencias:
  - clave: casella-berger
    capitulo: '7'
  - clave: wasserman
publicado: true
---

## Intuición

Un centro de llamadas recibe un número de quejas por hora que sigue una distribución de Poisson y quiere estimar la probabilidad de una hora sin quejas, $e^{-\lambda}$. Una regla burda es mirar solo la primera hora: si no hubo quejas, estimar 1; si las hubo, estimar 0. Es insesgada, pero usa una sola hora y solo puede dar 0 o 1.

El teorema de Rao-Blackwell dice cómo mejorarla sin pensar mucho: promediar la regla burda sobre todas las muestras que tienen el mismo valor del estadístico suficiente, aquí el total de quejas. Si en 10 horas hubo $T$ quejas, cada queja cae en la primera hora con probabilidad $1/10$, de modo que la probabilidad de que la primera hora no tenga ninguna es $(9/10)^T$. Ese número reemplaza al 0 o 1. Conserva el promedio y elimina la parte del error que venía de detalles irrelevantes de la muestra.

## Definición

:::teorema[Teorema de Rao-Blackwell]
Sea $\tilde{\theta}$ un estimador de $\theta$ con varianza finita y $T$ un estadístico suficiente. Entonces $\hat{\theta} = \mathbb{E}[\tilde{\theta} \mid T]$:

1. es un estimador (no depende de $\theta$, gracias a la suficiencia de $T$);
2. tiene el mismo valor esperado: $\mathbb{E}_\theta[\hat{\theta}] = \mathbb{E}_\theta[\tilde{\theta}]$;
3. cumple $\operatorname{ECM}(\hat{\theta}) \le \operatorname{ECM}(\tilde{\theta})$ para todo $\theta$, con igualdad solo si $\tilde{\theta}$ ya es función de $T$.
:::

:::demostracion[Idea de la prueba]
Por la ley de la varianza total, $\operatorname{Var}(\tilde{\theta}) = \operatorname{Var}\big(\mathbb{E}[\tilde{\theta} \mid T]\big) + \mathbb{E}\big[\operatorname{Var}(\tilde{\theta} \mid T)\big] \ge \operatorname{Var}(\hat{\theta})$. Como el sesgo es el mismo, el error cuadrático medio también es menor o igual.
:::

:::nota[Qué significa cada símbolo]
- $\tilde{\theta}$: estimador inicial; $\hat{\theta}$: estimador mejorado.
- $T$: estadístico suficiente; $\mathbb{E}[\cdot \mid T]$: esperanza condicional dado $T$.
- $\theta$: parámetro; $\operatorname{ECM}$: error cuadrático medio; $\operatorname{Var}$: varianza.
:::

## Cómo usar la visualización

Para muestras de Poisson se calculan el estimador burdo $\mathbf{1}\{X_1 = 0\}$ y el mejorado $((n - 1)/n)^T$. Sus histogramas se acumulan en gris y en color; la línea vertical marca el valor verdadero $e^{-\lambda}$. El panel compara medias y varianzas y da la reducción de varianza.

Controles: tasa $\lambda$ y tamaño de muestra $n$.

Experimentos sugeridos:

1. Comprobar que las dos medias se acercan a $e^{-1.5} \approx 0.223$: ambos son insesgados.
2. Comparar varianzas: la del burdo es cercana a 0.17 y la del mejorado, a 0.01.
3. Subir $n$ a 40: el mejorado se concentra todavía más; el burdo no cambia, porque solo usa la primera observación.

## Ejemplo

Poisson con $\lambda = 1.5$ y $n = 10$ horas; se observaron $T = 12$ quejas en total.

1. Estimador burdo: depende solo de la primera hora; si tuvo 2 quejas, vale 0.
2. Mejorado: $(9/10)^{12} \approx 0.282$.
3. Varianza del burdo: $e^{-\lambda}(1 - e^{-\lambda}) \approx 0.223 \cdot 0.777 \approx 0.173$.
4. Varianza del mejorado: $\operatorname{Var}\big((9/10)^T\big)$ con $T \sim \operatorname{Poisson}(15)$, igual a $e^{-2\lambda}(e^{\lambda/n} - 1) \approx 0.0498 \cdot 0.162 \approx 0.0081$, más de 20 veces menor.

:::figura[Con más datos por muestra, n = 30: el estimador mejorado es casi un punto, el burdo sigue repartido entre 0 y 1.]{componente="SufficiencyLab"}
```yaml
modo: rao-blackwell
lambda: 1.5
n: 30
```
:::

## Propiedades

- **Nunca empeora:** condicionar en un suficiente reduce o mantiene el error, para cualquier pérdida convexa.
- **Conserva el sesgo:** si el inicial es insesgado, el mejorado también.
- **Idempotente:** condicionar dos veces en $T$ no cambia nada.
- **Con un suficiente completo,** el resultado es el estimador insesgado de varianza mínima (teorema de Lehmann-Scheffé).

:::figura[Tasa baja, λ = 0.3: la probabilidad de cero quejas es alta y ambos estimadores la aciertan en promedio, pero el mejorado varía mucho menos.]{componente="SufficiencyLab"}
```yaml
modo: rao-blackwell
lambda: 0.3
n: 10
```
:::

## Errores comunes

- **Condicionar en un estadístico no suficiente.** Entonces $\mathbb{E}[\tilde{\theta} \mid T]$ en general depende de $\theta$ y no es un estimador.
- **Pensar que el resultado es automáticamente óptimo.** Sin completitud, distintos estimadores iniciales pueden dar distintos resultados.
- **Olvidar que la mejora requiere un estimador inicial.** El teorema mejora; no inventa estimadores.

:::figura[Muestras de 3: el estimador mejorado sigue siendo insesgado y varía menos, pero es el mejor posible solo porque el total es además completo, por el teorema de Lehmann-Scheffé.]{componente="SufficiencyLab"}
```yaml
modo: rao-blackwell
lambda: 1.5
n: 3
```
:::

## Conexiones

El teorema usa la [[suficiencia]] y reduce el [[error-cuadratico-medio]]. Con la [[completitud]] lleva al [[teorema-de-lehmann-scheffe]] y a los [[estimadores-insesgados-de-varianza-minima]]. La prueba es la ley de la varianza total aplicada a la esperanza condicional.

## Formulario

:::formula[Estimador de Rao-Blackwell]
$$
\hat{\theta} = \mathbb{E}\big[\tilde{\theta} \mid T\big]
$$

- $\tilde{\theta}$: estimador inicial; $T$: estadístico suficiente.
:::

:::formula[Mejora en varianza]
$$
\operatorname{Var}(\tilde{\theta}) = \operatorname{Var}(\hat{\theta}) + \mathbb{E}\big[\operatorname{Var}(\tilde{\theta} \mid T)\big] \ge \operatorname{Var}(\hat{\theta})
$$

- Ley de la varianza total.
:::

:::formula[Ejemplo Poisson]
$$
\mathbb{E}\big[\mathbf{1}\{X_1 = 0\} \mid T = t\big] = \Big(\frac{n - 1}{n}\Big)^{t},\qquad T = \sum_{i=1}^{n} X_i
$$

- $n$: tamaño de muestra; $t$: total observado; $\mathbf{1}\{\cdot\}$: indicadora.
:::

:::formula[Varianza del estimador mejorado]
$$
\operatorname{Var}\Big[\Big(\frac{n - 1}{n}\Big)^{T}\Big] = e^{-2\lambda}\big(e^{\lambda/n} - 1\big)
$$

- $\lambda$: tasa de la Poisson; $T \sim \operatorname{Poisson}(n\lambda)$.
:::
