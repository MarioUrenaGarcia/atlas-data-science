---
id: integral-de-lebesgue
titulo: Integral de Lebesgue
titulo_en: Lebesgue integral
alias:
  - integral respecto de una medida
  - integral abstracta
  - ∫ f dμ
modulo: 0
submodulo: '0.9'
orden: 7
nivel: avanzado
prerrequisitos:
  - funciones-medibles
  - medida-y-espacio-de-medida
relaciones:
  - tipo: generaliza
    id: integral-definida-como-area
  - tipo: contrasta
    id: sumas-de-riemann
etiquetas:
  - integración
  - funciones simples
  - teoría de la medida
  - esperanza
resumen: >
  La integral de Lebesgue corta el eje de los valores en lugar del dominio: suma cada valor por la medida
  del conjunto donde la función lo toma. Se define con funciones simples y aproximaciones desde abajo.
formula: '\int f\,d\mu = \sup\Big\{\int \varphi\,d\mu : 0 \le \varphi \le f,\ \varphi \text{ simple}\Big\}, \qquad \int \sum_{i} c_i \mathbf{1}_{A_i}\,d\mu = \sum_{i} c_i\,\mu(A_i)'
visualizacion:
  componente: MeasureLab
  parametros:
    modo: simple
    funcion: cuadrado
    enfoque: lebesgue
referencias:
  - clave: durrett
publicado: true
---

## Intuición

Para contar el dinero de una caja hay dos métodos. El primero toma las monedas en el orden en que aparecen y va sumando sus valores. El segundo las separa por denominación, cuenta cuántas hay de cada una y multiplica. Riemann integra con el primer método: parte el dominio en pedazos y suma altura por ancho. Lebesgue usa el segundo: agrupa los puntos según el valor de la función y suma valor por tamaño del grupo.

Agrupar por valores tiene una ventaja decisiva: el tamaño de cada grupo se mide con una medida, así que no importa qué tan desordenados estén los puntos. Funciones que saltan en todas partes, como la que vale 1 en los racionales y 0 en los irracionales, no tienen integral de Riemann, pero sí de Lebesgue: el grupo de los puntos con valor 1 mide cero y la integral es 0.

La construcción va por etapas: primero las funciones simples, que toman finitos valores; luego las funciones no negativas, como límite de funciones simples que crecen hacia ellas; por último, las funciones con signo, separando parte positiva y negativa.

## Definición

:::definicion[Integral de Lebesgue]
Sea $(\Omega, \mathcal{F}, \mu)$ un espacio de medida.

1. Para una función simple $\varphi = \sum_{i=1}^{m} c_i \mathbf{1}_{A_i}$ con $c_i \ge 0$ y $A_i \in \mathcal{F}$: $\int \varphi\,d\mu = \sum_{i} c_i\,\mu(A_i)$.
2. Para $f \ge 0$ medible: $\int f\,d\mu = \sup\{\int \varphi\,d\mu : 0 \le \varphi \le f,\ \varphi \text{ simple}\}$.
3. Para $f$ medible con $\int |f|\,d\mu < \infty$: $\int f\,d\mu = \int f^+\,d\mu - \int f^-\,d\mu$, con $f^+ = \max(f, 0)$ y $f^- = \max(-f, 0)$.
:::

Las funciones simples $\varphi_n = \min\big(n, 2^{-n}\lfloor 2^n f \rfloor\big)$ crecen hacia $f$, y $\int f\,d\mu = \lim_n \int \varphi_n\,d\mu$. Para $f \ge 0$ también vale la forma por capas $\int f\,d\mu = \int_0^\infty \mu(\{f > t\})\,dt$.

:::nota[Qué significa cada símbolo]
- $(\Omega, \mathcal{F}, \mu)$: espacio de medida.
- $\varphi$, $\varphi_n$: funciones simples, con finitos valores.
- $c_i$: valores de la función simple; $A_i$: conjuntos donde los toma; $m$: número de valores.
- $\mathbf{1}_{A}$: indicadora de $A$.
- $f$: función medible; $f^+$, $f^-$: partes positiva y negativa.
- $\lfloor \cdot \rfloor$: parte entera hacia abajo.
- $\mu(\{f > t\})$: medida del conjunto donde $f$ supera a $t$.
:::

## Cómo usar la visualización

La curva es $f(x) = x^2$ en $[0, 1]$. Las franjas horizontales son la función simple $\varphi_n$: el eje de valores se corta en niveles de altura $1/2^n$, y cada franja ocupa el conjunto donde $f$ supera su nivel. El encabezado suma altura por medida de cada nivel. La reproducción refina $n$ de 1 a 6.

Con $n = 1$ la integral de la función simple es 0.1464; con $n = 2$, 0.2317; con $n = 6$, 0.3259. Los valores crecen hacia $1/3$ sin pasarse, y lo que falta es menor que $2^{-n}$.

## Ejemplo

Se calcula $\int \varphi_2\,d\lambda$ para $f(x) = x^2$ en $[0, 1]$, con niveles de altura $1/4$.

1. $\lambda(\{x^2 \ge 1/4\}) = 1 - 0.5 = 0.5$.
2. $\lambda(\{x^2 \ge 1/2\}) = 1 - 0.707 = 0.293$.
3. $\lambda(\{x^2 \ge 3/4\}) = 1 - 0.866 = 0.134$.
4. $\lambda(\{x^2 \ge 1\}) = 0$.
5. $\int \varphi_2\,d\lambda = \tfrac{1}{4}(0.5 + 0.293 + 0.134 + 0) = 0.2317$, por debajo de $\int_0^1 x^2\,dx = 1/3$.

:::figura[Raíz de x con franjas horizontales: la integral de la función simple sube de 0.375 a 0.531, 0.602 y 0.635, y con seis niveles llega a 0.659, cerca de 2/3.]{componente="MeasureLab"}
```yaml
modo: simple
funcion: raiz
enfoque: lebesgue
```
:::

## Propiedades

- **Linealidad:** $\int (af + bg)\,d\mu = a\int f\,d\mu + b\int g\,d\mu$ para $f$, $g$ integrables.
- **Monotonía:** si $f \le g$ c.t.p., entonces $\int f\,d\mu \le \int g\,d\mu$.
- **Coincide con Riemann:** si $f$ es integrable según Riemann en $[a, b]$, también lo es según Lebesgue y las dos integrales coinciden.

:::figura[La onda $\tfrac{1}{2} + \tfrac{2}{5}\sin(2\pi x)$ con rectángulos verticales de Riemann: las sumas inferiores valen 0.3, 0.3, 0.4, 0.45, 0.475 y 0.4875, y se acercan al mismo valor 0.5 que las franjas de Lebesgue.]{componente="MeasureLab"}
```yaml
modo: simple
funcion: onda
enfoque: riemann
```
:::

- **Esperanza:** para una variable aleatoria $X$ con probabilidad $P$, $\mathbb{E}[X] = \int X\,dP = \int x\,dP_X(x)$, donde $\mathbb{E}$ es la esperanza y $P_X$ la distribución de $X$.
- **Desigualdad triangular:** $\big|\int f\,d\mu\big| \le \int |f|\,d\mu$.

## Errores comunes

- **Pensar que Lebesgue da valores distintos de Riemann.** Para funciones integrables según Riemann los resultados coinciden; Lebesgue amplía la clase de funciones integrables y facilita los límites.
- **Integrar funciones con signo sin revisar $\int |f|$.** Si $\int f^+ = \int f^- = \infty$, la integral no está definida aunque parezca haber cancelación.
- **Confundir la integral impropia de Riemann con la de Lebesgue.** $\int_1^\infty \frac{\sin x}{x}\,dx$ converge como integral impropia, pero no es integrable según Lebesgue, porque $\int_1^\infty \frac{|\sin x|}{x}\,dx = \infty$.

:::figura[La onda con franjas horizontales: las integrales de la función simple valen 0.25, 0.375, 0.4375 y siguen hasta 0.4922 con seis niveles; se aproximan a 0.5 desde abajo, igual que las sumas de Riemann.]{componente="MeasureLab"}
```yaml
modo: simple
funcion: onda
enfoque: lebesgue
```
:::

## Conexiones

Integra [[funciones-medibles]] respecto de una [[medida-y-espacio-de-medida|medida]]. Extiende la [[integral-definida-como-area]] y se contrasta con las [[sumas-de-riemann]]. Sus teoremas de límite son el [[teorema-de-convergencia-monotona]], el [[teorema-de-convergencia-dominada]] y el [[lema-de-fatou]], y con ella se definen la [[esperanza-matematica]] y los [[espacios-lp]].

## Formulario

:::formula[Integral de una función simple]
$$
\int \sum_{i=1}^{m} c_i\mathbf{1}_{A_i}\,d\mu = \sum_{i=1}^{m} c_i\,\mu(A_i)
$$

- $c_i$: valores no negativos; $A_i$: conjuntos medibles; $\mu$: medida.
:::

:::formula[Funciones no negativas]
$$
\int f\,d\mu = \sup\Big\{\int\varphi\,d\mu : 0 \le \varphi \le f,\ \varphi \text{ simple}\Big\}
$$

- $f$: función medible no negativa; $\varphi$: funciones simples por debajo de $f$.
:::

:::formula[Aproximación estándar]
$$
\varphi_n = \min\big(n,\ 2^{-n}\lfloor 2^{n} f\rfloor\big) \uparrow f
$$

- $n$: nivel de refinamiento; $\lfloor\cdot\rfloor$: parte entera hacia abajo.
:::

:::formula[Forma por capas]
$$
\int f\,d\mu = \int_0^\infty \mu(\{f > t\})\,dt
$$

- $f \ge 0$ medible; $t$: nivel de corte; $\mu(\{f > t\})$: medida del conjunto sobre el nivel.
:::

:::formula[Funciones con signo]
$$
\int f\,d\mu = \int f^+\,d\mu - \int f^-\,d\mu
$$

- $f^+ = \max(f, 0)$, $f^- = \max(-f, 0)$; requiere $\int |f|\,d\mu < \infty$.
:::
