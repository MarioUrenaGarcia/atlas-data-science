---
id: teorema-de-lehmann-scheffe
titulo: Teorema de Lehmann-Scheffé
titulo_en: Lehmann-Scheffé theorem
alias:
  - Lehmann-Scheffé
modulo: 6
submodulo: '6.2'
orden: 14
nivel: avanzado
prerrequisitos:
  - teorema-de-rao-blackwell
  - completitud
etiquetas:
  - inferencia
  - UMVUE
  - completitud
  - suficiencia
resumen: >
  Si T es suficiente y completo, cualquier estimador insesgado que sea función de T es el único estimador
  insesgado de varianza mínima (UMVUE). Basta encontrar una función insesgada de T.
formula: 'T\ \text{suficiente y completo},\ \mathbb{E}_\theta[\varphi(T)] = \tau(\theta)\ \forall \theta \implies \varphi(T)\ \text{es el UMVUE de } \tau(\theta)'
visualizacion:
  componente: EstimatorLab
  parametros:
    modo: comparar
    problema: maximo-uniforme
    estimadores: [momentos, maximo-corregido]
    n: 5
    theta: 4
referencias:
  - clave: casella-berger
    capitulo: '7'
publicado: true
---

## Intuición

Buscar el mejor estimador insesgado entre todos los posibles parece imposible: hay infinitos. El teorema de Lehmann-Scheffé da un camino directo. Si se dispone de un estadístico que es a la vez suficiente (no pierde información) y completo (no admite funciones insesgadas de cero que no sean triviales), basta con encontrar una función de ese estadístico que sea insesgada. Esa función es automáticamente el mejor estimador insesgado, y además el único.

Para el extremo $\theta$ de una uniforme en $(0, \theta)$, el máximo de la muestra es suficiente y completo. El máximo se queda corto en promedio por un factor $n/(n + 1)$; corregido, $\frac{n+1}{n}X_{(n)}$ es insesgado. Por el teorema, ningún otro estimador insesgado de $\theta$, como $2\bar{X}$, puede tener menor varianza para ningún valor de $\theta$.

## Definición

:::teorema[Teorema de Lehmann-Scheffé]
Sea $T$ un estadístico suficiente y completo para $\theta$. Si $\varphi(T)$ es un estimador insesgado de $\tau(\theta)$, entonces $\varphi(T)$ es el **único** estimador insesgado de $\tau(\theta)$ con varianza mínima uniformemente en $\theta$ (UMVUE).
:::

:::demostracion[Idea de la prueba]
Sea $W$ cualquier estimador insesgado de $\tau(\theta)$. Por Rao-Blackwell, $\mathbb{E}[W \mid T]$ es insesgado, función de $T$ y con varianza no mayor que la de $W$. Como $\mathbb{E}[W \mid T] - \varphi(T)$ es función de $T$ con esperanza cero para todo $\theta$, la completitud obliga a que sea cero: $\mathbb{E}[W \mid T] = \varphi(T)$. Así $\operatorname{Var}(\varphi(T)) \le \operatorname{Var}(W)$.
:::

:::nota[Qué significa cada símbolo]
- $T$: estadístico suficiente y completo; $\varphi$: función de $T$.
- $\tau(\theta)$: cantidad que se quiere estimar, función del parámetro $\theta$.
- $W$: cualquier otro estimador insesgado de $\tau(\theta)$.
- UMVUE: estimador insesgado de varianza uniformemente mínima.
:::

## Cómo usar la visualización

Dos estimadores insesgados de $\theta = 4$ para una uniforme en $(0, \theta)$, con muestras de 5: dos veces la media y el máximo corregido. El segundo es función del estadístico suficiente y completo $X_{(n)}$ y, por el teorema, es el UMVUE.

Experimentos sugeridos:

1. Comprobar que ambos se centran en 4: los dos son insesgados.
2. Comparar varianzas: la del máximo corregido es menor para cualquier $n$.
3. Subir $n$: la ventaja del máximo corregido crece, porque su varianza baja como $1/n^2$ y la de $2\bar{X}$ como $1/n$.

## Ejemplo

Uniforme en $(0, \theta)$ con $n = 5$:

1. $X_{(5)}$ tiene densidad $5x^4/\theta^5$ en $(0, \theta)$, de modo que $\mathbb{E}[X_{(5)}] = \frac{5}{6}\theta$.
2. $\varphi(T) = \frac{6}{5}X_{(5)}$ es insesgado.
3. $X_{(n)}$ es suficiente (factorización con la indicadora $\mathbf{1}\{x_{(n)} \le \theta\}$) y completo, así que $\frac{6}{5}X_{(5)}$ es el UMVUE de $\theta$.
4. Varianzas con $\theta = 4$: $\operatorname{Var}(2\bar{X}) = \theta^2/15 \approx 1.067$ y $\operatorname{Var}\big(\frac{6}{5}X_{(5)}\big) = \theta^2/35 \approx 0.457$.

:::figura[Las mismas dos recetas con n = 20: la ventaja del UMVUE se vuelve muy grande.]{componente="EstimatorLab"}
```yaml
modo: comparar
problema: maximo-uniforme
estimadores: [momentos, maximo-corregido]
n: 20
theta: 4
```
:::

## Propiedades

- **Receta en dos pasos:** encontrar un suficiente completo y luego una función insesgada de él, o aplicar Rao-Blackwell a cualquier estimador insesgado.
- **Unicidad:** el UMVUE es único.
- **No siempre existe:** si ninguna función de $T$ es insesgada para $\tau(\theta)$, no hay UMVUE.
- **No es necesariamente el de menor error cuadrático medio:** un estimador sesgado puede tener menor ECM.

:::figura[Rao-Blackwell y completitud juntos: el estimador mejorado de P(X = 0) en una Poisson es función del total, suficiente y completo, así que es el UMVUE.]{componente="SufficiencyLab"}
```yaml
modo: rao-blackwell
lambda: 2
n: 8
```
:::

## Errores comunes

- **Aplicarlo sin completitud.** Con un suficiente que no es completo, una función insesgada de él no tiene por qué ser óptima.
- **Confundir UMVUE con mínimo error cuadrático medio.** Un estimador sesgado puede tener menor error cuadrático medio. En la varianza normal, el UMVUE es $S^2$, con divisor $n - 1$, pero el divisor $n + 1$ tiene menor error cuadrático medio. En la uniforme, $\frac{n+2}{n+1}X_{(n)}$, sesgado, tiene error cuadrático medio $\theta^2/(n+1)^2$, menor que el $\theta^2/(n(n+2))$ del UMVUE; el máximo sin corregir, en cambio, tiene uno mayor, $2\theta^2/((n+1)(n+2))$.
- **Creer que el UMVUE siempre es razonable.** Hay casos en que el UMVUE toma valores fuera del espacio de parámetros.

:::figura[Sesgado contra UMVUE en la varianza normal con muestras de 10 y varianza 3: el divisor n + 1 tiene menor error cuadrático medio que el UMVUE con divisor n - 1.]{componente="EstimatorLab"}
```yaml
modo: comparar
problema: varianza-normal
estimadores: [s2, n1]
n: 10
theta: 3
```
:::

## Conexiones

El teorema combina el [[teorema-de-rao-blackwell]] con la [[completitud]] y la [[suficiencia]], y caracteriza a los [[estimadores-insesgados-de-varianza-minima]]. Se contrasta con el [[error-cuadratico-medio]] como criterio, que admite estimadores sesgados.

## Formulario

:::formula[Teorema de Lehmann-Scheffé]
$$
\mathbb{E}_\theta[\varphi(T)] = \tau(\theta)\ \forall \theta \implies \varphi(T) = \text{UMVUE de } \tau(\theta)
$$

- $T$: suficiente y completo; $\varphi$: función; $\tau(\theta)$: cantidad a estimar.
:::

:::formula[UMVUE del extremo de una uniforme]
$$
\hat{\theta} = \frac{n + 1}{n}X_{(n)},\qquad \operatorname{Var}(\hat{\theta}) = \frac{\theta^2}{n(n + 2)}
$$

- $X_{(n)}$: máximo de la muestra; $n$: tamaño; $\theta$: extremo superior.
:::

:::formula[Densidad y media del máximo]
$$
f_{X_{(n)}}(x) = \frac{n x^{n-1}}{\theta^n},\ \ 0 < x < \theta,\qquad \mathbb{E}[X_{(n)}] = \frac{n}{n + 1}\theta
$$

- $X_{(n)}$: máximo de $n$ uniformes en $(0, \theta)$; con $n = 5$, densidad $5x^4/\theta^5$ y media $5\theta/6$.
:::

:::formula[Errores cuadráticos medios en la uniforme]
$$
\operatorname{ECM}(X_{(n)}) = \frac{2\theta^2}{(n + 1)(n + 2)},\qquad \operatorname{ECM}\Big(\frac{n + 2}{n + 1}X_{(n)}\Big) = \frac{\theta^2}{(n + 1)^2}
$$

- $\operatorname{ECM}$: error cuadrático medio; el primero es el máximo sin corregir, el segundo un múltiplo sesgado con menor error que el UMVUE.
:::

:::formula[Varianza de dos veces la media]
$$
\operatorname{Var}(2\bar{X}) = \frac{\theta^2}{3n}
$$

- $\bar{X}$: media muestral.
:::
