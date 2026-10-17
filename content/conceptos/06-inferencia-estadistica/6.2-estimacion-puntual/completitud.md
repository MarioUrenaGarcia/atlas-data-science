---
id: completitud
titulo: Completitud
titulo_en: Completeness
alias:
  - estadístico completo
  - familia completa
modulo: 6
submodulo: '6.2'
orden: 12
nivel: avanzado
prerrequisitos:
  - suficiencia-minima
etiquetas:
  - inferencia
  - completitud
  - unicidad
  - estimadores insesgados
resumen: >
  Un estadístico T es completo si la única función de T con esperanza cero para todo valor del parámetro
  es la función cero. Garantiza que hay a lo más un estimador insesgado que sea función de T.
formula: '\mathbb{E}_\theta[g(T)] = 0\ \ \forall \theta \implies P_\theta\big(g(T) = 0\big) = 1\ \ \forall \theta'
visualizacion:
  componente: SufficiencyLab
  parametros:
    modo: completitud
    g: [1, -1, 1, -1]
referencias:
  - clave: casella-berger
    capitulo: '6'
publicado: true
---

## Intuición

Supóngase que se tiene un número de éxitos $T$ en 3 ensayos y se busca una regla $g$ que asigne un número a cada resultado posible, 0, 1, 2 o 3, de modo que su promedio sea cero sin importar cuál sea la probabilidad de éxito $p$. Se pueden poner valores positivos y negativos que se compensen para cierto $p$, pero al cambiar $p$ el balance se rompe. La única regla que funciona para todos los $p$ es la trivial: $g = 0$ en todos lados.

Esa rigidez se llama **completitud**. Parece abstracta, pero tiene una consecuencia muy concreta: si dos estimadores insesgados son funciones de un estadístico completo, su diferencia tiene esperanza cero para todo $p$, así que son el mismo estimador. Con un estadístico completo, el estimador insesgado basado en él, si existe, es único.

## Definición

:::definicion[Completitud]
Un estadístico $T$ es **completo** para la familia $\{P_\theta\}$ si, para toda función $g$,
$$
\mathbb{E}_\theta[g(T)] = 0\ \ \text{para todo } \theta \implies P_\theta\big(g(T) = 0\big) = 1\ \ \text{para todo } \theta.
$$
:::

Caso binomial: con $T \sim \operatorname{Binomial}(n, p)$,
$$
\mathbb{E}_p[g(T)] = \sum_{k=0}^{n} g(k)\binom{n}{k}p^k(1 - p)^{n - k},
$$
un polinomio en $p$. Si se anula para todo $p \in (0, 1)$, al dividir entre $(1 - p)^n$ queda un polinomio en $r = p/(1 - p)$ que se anula para todo $r > 0$, y sus coeficientes $g(k)\binom{n}{k}$ deben ser cero. Por lo tanto $T$ es completo.

:::nota[Qué significa cada símbolo]
- $T$: estadístico; $g$: función cualquiera de $T$.
- $\theta$: parámetro; $P_\theta$: distribución bajo $\theta$; $\mathbb{E}_\theta$: esperanza bajo $\theta$.
- $n$: número de ensayos; $p$: probabilidad de éxito; $k$: valor de $T$.
- $r = p/(1 - p)$: momios de éxito.
:::

## Cómo usar la visualización

La función $g$ toma cuatro valores, $g(0), \dots, g(3)$, que se fijan con los controles. La curva es $\mathbb{E}_p[g(T)]$ como función de $p$ y el punto la recorre al reproducir. El panel reporta el mayor valor absoluto de la curva.

Experimentos sugeridos:

1. Con $g = (1, -1, 1, -1)$ la curva cruza el cero, pero no es cero en todos lados.
2. Intentar ajustar los cuatro valores para que la curva quede plana en cero: solo se logra con los cuatro en cero.
3. Probar $g = (0, 1, -1, 0)$: la esperanza es $3p(1-p)^2 - 3p^2(1-p) = 3p(1-p)(1-2p)$, que dentro de $(0, 1)$ solo se anula en $p = 0.5$ (también vale cero en los extremos 0 y 1).

## Ejemplo

$T \sim \operatorname{Binomial}(3, p)$ y $g = (1, -1, 1, -1)$, es decir, $g(k) = (-1)^k$.

1. $\mathbb{E}_p[g(T)] = \sum_k (-1)^k\binom{3}{k}p^k(1 - p)^{3 - k} = \big((1 - p) - p\big)^3 = (1 - 2p)^3$.
2. Vale 1 en $p = 0$, 0 en $p = 0.5$ y $-1$ en $p = 1$.
3. Se anula en un solo punto, no en todos: $g$ no es un contraejemplo a la completitud.
4. Consecuencia: $\hat{p} = T/3$ es el único estimador insesgado de $p$ que es función de $T$.

:::figura[Una función con valores mixtos, g = (0, 1, -1, 0): dentro de (0, 1) su esperanza se anula solo en p = 0.5.]{componente="SufficiencyLab"}
```yaml
modo: completitud
g: [0, 1, -1, 0]
```
:::

## Propiedades

- **Familias exponenciales:** el estadístico suficiente natural de una familia exponencial de rango completo es completo.
- **Completo y suficiente implica suficiente mínimo** (cuando existe un suficiente mínimo).
- **Unicidad de estimadores insesgados** que son funciones de $T$.

:::figura[Con más ensayos: binomial de 4 con g alternante, cuya esperanza es (1 - 2p) a la cuarta, siempre positiva salvo en p = 0.5.]{componente="SufficiencyLab"}
```yaml
modo: completitud
g: [1, -1, 1, -1, 1]
```
:::

## Errores comunes

- **Confundir completo con suficiente.** Un estadístico puede ser suficiente sin ser completo y viceversa (una constante es completa pero no suficiente).
- **Creer que basta con que la esperanza se anule en algunos valores del parámetro.** La condición exige que se anule para todos.
- **Pensar que toda familia es completa.** Por ejemplo, para la uniforme en $(\theta, \theta + 1)$ el par (mínimo, máximo) es suficiente mínimo pero no completo, porque el rango tiene esperanza constante.

:::figura[Con 4 ensayos, g = (1, 0, 0, 0, -1): su esperanza, (1 - p) a la cuarta menos p a la cuarta, se anula en p = 0.5 y en ningún otro valor, así que no contradice la completitud.]{componente="SufficiencyLab"}
```yaml
modo: completitud
g: [1, 0, 0, 0, -1]
```
:::

## Conexiones

La completitud complementa la [[suficiencia-minima]] y es la hipótesis clave del [[teorema-de-lehmann-scheffe]] y del [[teorema-de-basu]]. Garantiza la unicidad de los [[estimadores-insesgados-de-varianza-minima]] construidos con el [[teorema-de-rao-blackwell]].

## Formulario

:::formula[Completitud]
$$
\mathbb{E}_\theta[g(T)] = 0\ \forall \theta \implies P_\theta\big(g(T) = 0\big) = 1\ \forall \theta
$$

- $T$: estadístico; $g$: función; $\theta$: parámetro.
:::

:::formula[Esperanza bajo la binomial]
$$
\mathbb{E}_p[g(T)] = \sum_{k=0}^{n} g(k)\binom{n}{k}p^k(1 - p)^{n - k}
$$

- $n$: ensayos; $p$: probabilidad de éxito; $g(k)$: valor de la función en $T = k$.
:::

:::formula[Caso alternante]
$$
\sum_{k=0}^{n} (-1)^k\binom{n}{k}p^k(1 - p)^{n - k} = (1 - 2p)^n
$$

- Se obtiene por el binomio de Newton con $a = 1 - p$ y $b = -p$.
:::
