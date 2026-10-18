---
id: desigualdad-de-holder
titulo: Desigualdad de Hölder
titulo_en: Hölder's inequality
alias:
  - desigualdad de Hoelder
  - exponentes conjugados
modulo: 1
submodulo: '1.5'
orden: 6
nivel: avanzado
prerrequisitos:
  - desigualdad-de-cauchy-schwarz
  - momentos
relaciones:
  - tipo: generaliza
    id: desigualdad-de-cauchy-schwarz
  - tipo: relacionado
    id: normas-vectoriales
etiquetas:
  - exponentes conjugados
  - normas Lp
  - producto de variables
  - Minkowski
resumen: >
  La esperanza del producto de dos variables está acotada por el producto de sus normas Lp y Lq,
  con 1/p + 1/q = 1. Generaliza a Cauchy y Schwarz (p = q = 2) y permite repartir los momentos entre
  las dos variables.
formula: '\mathbb{E}|XY| \le \big(\mathbb{E}|X|^p\big)^{1/p}\,\big(\mathbb{E}|Y|^q\big)^{1/q}, \qquad \frac{1}{p} + \frac{1}{q} = 1'
visualizacion:
  componente: InequalityBound
  parametros:
    modo: holder
    rho: 0.5
    exponente: 3
referencias:
  - clave: casella-berger
    capitulo: '4.7'
  - clave: durrett
publicado: true
---

## Intuición

La desigualdad de Cauchy y Schwarz mide a las dos variables con el mismo instrumento, el segundo momento. A veces conviene medirlas de manera distinta: si una variable tiene colas pesadas y solo tiene momentos bajos, y la otra es acotada y tiene todos sus momentos, es natural pedirle menos a la primera y más a la segunda. La **desigualdad de Hölder** permite ese reparto: se elige un exponente $p$ para $X$ y su exponente conjugado $q = p/(p - 1)$ para $Y$, y el producto queda acotado por $\|X\|_p \|Y\|_q$.

Cada elección de $p$ da una cota válida. Con $p = q = 2$ se recupera Cauchy y Schwarz, y cuando las dos variables son igual de "pesadas", esa suele ser la más ajustada.

## Definición

:::teorema[Desigualdad de Hölder]
Sean $p, q > 1$ con $\frac{1}{p} + \frac{1}{q} = 1$. Si $\mathbb{E}|X|^p$ y $\mathbb{E}|Y|^q$ son finitos, entonces
$$
\mathbb{E}|XY| \le \|X\|_p\, \|Y\|_q, \qquad \|X\|_p = \big(\mathbb{E}|X|^p\big)^{1/p}.
$$
:::

La prueba usa la desigualdad de Young, $ab \le a^p/p + b^q/q$ para $a, b \ge 0$, aplicada a $|X|/\|X\|_p$ y $|Y|/\|Y\|_q$, y toma esperanzas.

:::figura[Con $p = 1.5$ el exponente conjugado es $q = 3$: la cota pide un momento menor a $X$ y uno mayor a $Y$. Para normales correlacionadas, todas las cotas superan a $\mathbb{E}|XY|$, y la menor está en $p = 2$.]{componente="InequalityBound"}
```yaml
modo: holder
rho: 0.8
exponente: 1.5
```
:::

:::nota[Qué significa cada símbolo]
- $X$, $Y$: variables aleatorias.
- $p$, $q$: exponentes conjugados, $1/p + 1/q = 1$.
- $\|X\|_p = (\mathbb{E}|X|^p)^{1/p}$: norma $L^p$ de $X$.
- $a$, $b$: números no negativos de la desigualdad de Young.
- $\rho$: correlación del par normal.
- $Z$: normal estándar; $\Gamma$: función gamma.
:::

## Cómo usar la visualización

$X$ y $Y$ son normales estándar con correlación 0.5. La gráfica de la izquierda muestra $|\mathbb{E}[XY]|$ y $\mathbb{E}|XY|$ en función de $\rho$; la de la derecha, la cota de Hölder en función de $p$, con la línea punteada en el valor exacto $\mathbb{E}|XY| \approx 0.72$. El encabezado escribe la cota con $p = 3$ y $q = 1.5$.

La deslizadera de $p$ mueve el punto sobre la curva de cotas: todas quedan por encima del valor exacto, con mínimo 1 en $p = 2$ y creciendo hacia los extremos. La de $\rho$ sube o baja la línea del valor exacto.

## Ejemplo

Para normales estándar, $\mathbb{E}|Z|^r = 2^{r/2}\,\Gamma\big(\tfrac{r+1}{2}\big)/\sqrt{\pi}$. Con $p = 3$ y $q = 3/2$:

1. $\|X\|_3 = \big(\mathbb{E}|Z|^3\big)^{1/3} = \big(2^{1.5}/\sqrt{\pi}\big)^{1/3} \approx 1.596^{1/3} \approx 1.169$.
2. $\|Y\|_{1.5} = \big(\mathbb{E}|Z|^{1.5}\big)^{2/3} \approx 0.860^{2/3} \approx 0.905$.
3. Cota de Hölder: $1.169 \cdot 0.905 \approx 1.057$.
4. Con $\rho = 0.5$, el valor exacto es $\mathbb{E}|XY| = \tfrac{2}{\pi}\big(\sqrt{0.75} + 0.5 \arcsin 0.5\big) \approx 0.718$, por debajo de la cota.

:::figura[Con $p = 6$ el exponente conjugado es 1.2: la cota sube a cerca de 1.3, más lejos del valor exacto que la de Cauchy y Schwarz.]{componente="InequalityBound"}
```yaml
modo: holder
rho: 0.5
exponente: 6
```
:::

## Propiedades

- **Cauchy y Schwarz:** es el caso $p = q = 2$.
- **Minkowski:** de Hölder se deduce la desigualdad triangular $\|X + Y\|_p \le \|X\|_p + \|Y\|_p$, que hace de $\|\cdot\|_p$ una norma.
- **Orden de las normas (Lyapunov):** con $Y = 1$, $\|X\|_r \le \|X\|_s$ para $r \le s$: los momentos de orden alto controlan a los de orden bajo.
- **Varios factores:** $\mathbb{E}|X_1 \cdots X_k| \le \prod_i \|X_i\|_{p_i}$ si $\sum_i 1/p_i = 1$.
- **Casos extremos:** con $p = 1$ y $q = \infty$, $\mathbb{E}|XY| \le \mathbb{E}|X| \cdot \sup|Y|$.

:::figura[Correlación cercana a 1 con $p = 2$: la cota de Hölder coincide con la de Cauchy y Schwarz, 1, y el valor exacto se acerca a ella porque $Y$ es casi igual a $X$.]{componente="InequalityBound"}
```yaml
modo: holder
rho: 0.95
exponente: 2
```
:::

## Errores comunes

- **Elegir exponentes que no son conjugados.** Si $1/p + 1/q \ne 1$, la desigualdad puede fallar.
- **Creer que la cota es la misma para todo $p$.** Todas son válidas, pero su calidad depende de cómo se reparten los momentos.
- **Olvidar los valores absolutos.** La desigualdad acota $\mathbb{E}|XY|$; para $\mathbb{E}[XY]$ se usa que $|\mathbb{E}[XY]| \le \mathbb{E}|XY|$.

:::figura[Con $p = 1.1$ el exponente conjugado es 11: la norma de orden 11 de una normal es cercana a 2.1 y la cota sube a cerca de 1.7, válida pero poco informativa.]{componente="InequalityBound"}
```yaml
modo: holder
rho: 0.5
exponente: 1.1
```
:::

## Conexiones

La desigualdad de Hölder generaliza la [[desigualdad-de-cauchy-schwarz]] y se expresa con los [[momentos]] de cada variable, que definen normas como las [[normas-vectoriales]]. Junto con la [[desigualdad-de-jensen]] ordena los momentos de distinto orden, y aparece en las condiciones de momentos del [[tcl-de-lyapunov]].

## Formulario

:::formula[Desigualdad de Hölder]
$$
\mathbb{E}|XY| \le \big(\mathbb{E}|X|^p\big)^{1/p}\,\big(\mathbb{E}|Y|^q\big)^{1/q}
$$

- $p, q > 1$ con $1/p + 1/q = 1$.
:::

:::formula[Desigualdad de Young]
$$
ab \le \frac{a^p}{p} + \frac{b^q}{q}
$$

- $a, b \ge 0$; base de la prueba.
:::

:::formula[Orden de las normas]
$$
\big(\mathbb{E}|X|^r\big)^{1/r} \le \big(\mathbb{E}|X|^s\big)^{1/s}, \qquad 0 < r \le s
$$

- Desigualdad de Lyapunov.
:::

:::formula[Momentos absolutos de la normal]
$$
\mathbb{E}|Z|^r = \frac{2^{r/2}\,\Gamma\big(\frac{r+1}{2}\big)}{\sqrt{\pi}}
$$

- $Z$ normal estándar, $r > 0$.
:::
