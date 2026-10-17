---
id: teorema-de-basu
titulo: Teorema de Basu
titulo_en: Basu's theorem
alias:
  - independencia de Basu
modulo: 6
submodulo: '6.2'
orden: 16
nivel: avanzado
prerrequisitos:
  - estadisticos-ancilares
  - completitud
etiquetas:
  - inferencia
  - independencia
  - completitud
  - ancilaridad
resumen: >
  Si T es suficiente y completo y A es ancilar, entonces T y A son independientes. Permite probar
  independencias, como la de la media y la varianza muestrales normales, sin calcular distribuciones conjuntas.
formula: 'T\ \text{suficiente completo},\ A\ \text{ancilar} \implies T \perp A'
visualizacion:
  componente: SufficiencyLab
  parametros:
    modo: ancilar
    n: 8
referencias:
  - clave: casella-berger
    capitulo: '6'
publicado: true
---

## Intuición

La media de una muestra normal (con varianza conocida) captura toda la información sobre $\mu$, y lo hace de forma completa. El rango no contiene ninguna información sobre $\mu$. Podría pensarse que esto basta para que el rango sea independiente de la media, pero no es así: en una uniforme en $(\theta, \theta + 1)$ el rango también es ancilar y, sin embargo, está relacionado con el par (mínimo, máximo), que es suficiente. Lo que descarta la dependencia es la completitud: la probabilidad condicional de cualquier evento del rango dada la media, menos su probabilidad sin condicionar, es una función de la media con esperanza cero para todo $\mu$, y la completitud obliga a que sea cero. El teorema de Basu convierte esta intuición en un resultado exacto: un estadístico suficiente completo y uno ancilar son **independientes**.

Su gran utilidad es práctica: permite probar independencias sin calcular ninguna distribución conjunta. La independencia de la media y la varianza muestrales en poblaciones normales, que requiere cálculos laboriosos por otras vías, sale en una línea.

## Definición

:::teorema[Teorema de Basu]
Si $T$ es un estadístico suficiente y completo para $\theta$ y $A$ es un estadístico ancilar, entonces $T$ y $A$ son independientes para todo valor de $\theta$.
:::

:::demostracion[Idea de la prueba]
Para un evento $B$, $P(A \in B)$ no depende de $\theta$ porque $A$ es ancilar, y $P(A \in B \mid T)$ tampoco depende de $\theta$ porque $T$ es suficiente. La función $g(T) = P(A \in B \mid T) - P(A \in B)$ tiene esperanza cero para todo $\theta$; por completitud, $g(T) = 0$, es decir, $P(A \in B \mid T) = P(A \in B)$.
:::

Aplicación: con $X_i \sim \mathcal{N}(\mu, \sigma^2)$ y $\sigma$ fija, $\bar{X}$ es suficiente y completo para $\mu$ y $S^2$ es ancilar para $\mu$; por lo tanto $\bar{X}$ y $S^2$ son independientes. Como el argumento vale para cada $\sigma$, la independencia se cumple siempre.

:::nota[Qué significa cada símbolo]
- $T$: estadístico suficiente y completo; $A$: estadístico ancilar.
- $\perp$: independencia; $B$: un evento cualquiera.
- $g(T)$: función de $T$ usada en la prueba.
- $\bar{X}$, $S^2$: media y varianza muestrales; $\mu$, $\sigma$: parámetros de la normal.
:::

## Cómo usar la visualización

Muestras normales de tamaño 8 con desviación 1: cada punto es el par (media, rango). La media es suficiente y completa para $\mu$; el rango es ancilar. La nube no muestra relación: la correlación es cercana a cero y la distribución vertical de los puntos es la misma en cualquier posición horizontal.

Experimentos sugeridos:

1. Observar la nube: el rango no cambia con la media dentro de la nube.
2. Mover $\mu$: la nube se traslada sin deformarse.
3. Con $n = 2$ la nube sigue sin estructura.

## Ejemplo

Uniforme en $(0, \theta)$ con muestra $X_1, \dots, X_n$:

1. $T = X_{(n)}$ es suficiente y completo para $\theta$.
2. $A = X_{(1)}/X_{(n)}$ es ancilar: al escalar los datos por $\theta$, el cociente no cambia.
3. Por Basu, $X_{(n)}$ y $X_{(1)}/X_{(n)}$ son independientes.
4. Consecuencia: $\mathbb{E}[X_{(1)}] = \mathbb{E}[A \cdot T] = \mathbb{E}[A]\,\mathbb{E}[T]$, de donde $\mathbb{E}[A] = \frac{\theta/(n+1)}{n\theta/(n+1)} = \frac{1}{n}$.

:::figura[Media y rango con muestras de 3: independientes aunque las muestras sean muy pequeñas.]{componente="SufficiencyLab"}
```yaml
modo: ancilar
n: 3
```
:::

## Propiedades

- **Prueba independencias sin cálculos de distribuciones conjuntas.**
- **Requiere completitud:** con un suficiente que no es completo, puede haber dependencia con un ancilar.
- **Recíproco:** si $T$ es suficiente y acotadamente completo, todo estadístico independiente de $T$ es ancilar.

:::figura[Dependencia cuando no se cumplen las hipótesis: en una población exponencial, media y varianza muestrales están correlacionadas, porque la varianza no es ancilar para la media.]{componente="SamplingLab"}
```yaml
modo: cochran
poblacion: exponencial
n: 8
```
:::

## Errores comunes

- **Aplicarlo sin completitud.** La conclusión puede fallar.
- **Confundir correlación cero con independencia.** El teorema da independencia completa, algo más fuerte que correlación cero.
- **Olvidar que la ancilaridad es relativa al parámetro.** $S^2$ es ancilar para $\mu$, no para $\sigma$.

:::figura[Población normal: la media y la varianza muestrales son independientes, como predice el teorema de Basu.]{componente="SamplingLab"}
```yaml
modo: cochran
poblacion: normal
n: 12
```
:::

## Conexiones

Basu combina la [[completitud]], la [[suficiencia]] y los [[estadisticos-ancilares]]. Da una prueba alternativa de la independencia de media y varianza muestrales que aparece en el [[teorema-de-cochran]].

## Formulario

:::formula[Teorema de Basu]
$$
T\ \text{suficiente y completo},\ A\ \text{ancilar} \implies T \perp A
$$

- $T$: suficiente completo; $A$: ancilar; $\perp$: independencia.
:::

:::formula[Consecuencia normal]
$$
\bar{X} \perp S^2
$$

- Media y varianza muestrales de una muestra normal.
:::

:::formula[Ejemplo uniforme]
$$
\mathbb{E}\Big[\frac{X_{(1)}}{X_{(n)}}\Big] = \frac{\mathbb{E}[X_{(1)}]}{\mathbb{E}[X_{(n)}]} = \frac{1}{n}
$$

- $X_{(1)}$, $X_{(n)}$: mínimo y máximo de una uniforme en $(0, \theta)$.
:::
