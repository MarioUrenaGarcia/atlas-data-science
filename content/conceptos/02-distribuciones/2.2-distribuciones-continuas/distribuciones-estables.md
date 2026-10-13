---
id: distribuciones-estables
titulo: Distribuciones estables
titulo_en: Stable distributions
alias:
  - distribuciones alfa-estables
  - leyes estables de Lévy
  - stable distributions
modulo: 2
submodulo: '2.2'
orden: 32
nivel: avanzado
prerrequisitos:
  - distribucion-de-cauchy
  - distribucion-de-levy
relaciones:
  - tipo: generaliza
    id: distribucion-normal
etiquetas:
  - colas pesadas
  - sumas de variables
  - teorema central del límite generalizado
  - finanzas
resumen: >
  Familia de distribuciones cerrada bajo sumas: la suma de variables estables independientes con el mismo
  índice α es otra estable del mismo tipo. Incluye la normal (α = 2), la Cauchy (α = 1) y la Lévy (α = 1/2).
formula: '\varphi(t) = \exp\!\left(i\delta t - |\gamma t|^{\alpha}\left[1 - i\beta\,\operatorname{sign}(t)\tan\tfrac{\pi\alpha}{2}\right]\right)'
visualizacion:
  componente: DistributionStudio
  parametros:
    explorador:
      distribucion: estable
      valores:
        alpha: 1.5
        beta: 0
        gamma: 1
        delta: 0
      dominio: [-10, 10]
      casos:
        - nombre: 'Normal (α = 2)'
          descripcion: 'α = 2: la normal con varianza 2γ²; es la única estable con varianza finita.'
          valores: {alpha: 2, beta: 0, gamma: 1, delta: 0}
        - nombre: 'Rendimientos financieros'
          descripcion: 'α = 1.5: campana con colas pesadas; caídas de 5 escalas ocurren cien veces más que en la normal.'
          valores: {alpha: 1.5, beta: 0, gamma: 1, delta: 0}
        - nombre: 'Cauchy (α = 1)'
          descripcion: 'α = 1 y β = 0: la Cauchy; ni media ni varianza existen.'
          valores: {alpha: 1, beta: 0, gamma: 1, delta: 0}
      ejemplo:
        titulo: 'Caída extrema'
        contexto: 'Los rendimientos diarios estandarizados de un activo se modelan con una estable simétrica de índice 1.5 y escala 1.'
        pregunta: '¿Qué probabilidad hay de una ganancia mayor que 5 escalas en un día?'
        valores: {alpha: 1.5, beta: 0, gamma: 1, delta: 0}
        region: derecha
        desde: 5
      referencia:
        distribucion: normal
        valores: {mu: 0, sigma: 1.414}
        etiqueta: 'Normal (estable con α = 2, γ = 1)'
        visible: true
    genesis:
      componente: ContinuousGenesis
      parametros:
        proceso: suma-colas-pesadas
        valores:
          alpha: 1.5
          n: 30
referencias:
  - clave: durrett
  - clave: tsay
publicado: true
---

## Intuición

Al sumar muchas variables independientes con varianza finita, el teorema central del límite garantiza que la suma estandarizada se parece a una normal. Pero ¿qué pasa si las variables tienen colas tan pesadas que su varianza es infinita, como las pérdidas extremas de un mercado o los saltos de algunos procesos físicos? Las sumas ya no convergen a la normal, sino a otra distribución de una familia más amplia: las distribuciones estables.

Una distribución es estable si sumar dos copias independientes produce la misma distribución, solo reescalada y desplazada. La normal tiene esta propiedad, y es el caso de varianza finita. Las demás estables tienen colas de ley de potencia con índice $\alpha$ entre 0 y 2: cuanto menor $\alpha$, más pesadas las colas. Con $\alpha = 1$ se obtiene la Cauchy, y con $\alpha = 1/2$ y asimetría total, la Lévy.

Benoît Mandelbrot propuso en los años sesenta que los cambios de precios en los mercados seguían estables con $\alpha$ cercano a 1.7, para explicar por qué las caídas grandes ocurren mucho más de lo que predice la normal. Salvo en tres casos, las estables no tienen densidad con fórmula elemental y se definen por su función característica.

## Definición

:::definicion[Distribución estable]
Una variable $X$ es **estable** si para $X_1, X_2$ copias independientes de $X$ y constantes $a, b > 0$ existen $c > 0$ y $d$ tales que $aX_1 + bX_2$ tiene la misma distribución que $cX + d$. Toda estable tiene función característica
$$
\varphi(t) = \exp\!\left(i\delta t - |\gamma t|^{\alpha}\left[1 - i\beta\,\operatorname{sign}(t)\tan\tfrac{\pi\alpha}{2}\right]\right), \qquad \alpha \ne 1,
$$
con una corrección logarítmica cuando $\alpha = 1$. Se escribe $X \sim S(\alpha, \beta, \gamma, \delta)$.
:::

:::nota[Qué es X]
$X$ = una suma normalizada de muchas variables con colas pesadas; su forma se conserva al sumar copias independientes.
:::

:::nota[Qué hace cada parámetro]
- **$\alpha$, índice de estabilidad:** el peso de las colas, entre 0 y 2. Si aumenta, las colas se adelgazan; con $\alpha = 2$ es la normal.
- **$\beta$, asimetría:** la inclinación, entre $-1$ y 1. Si aumenta, la cola derecha se alarga.
- **$\gamma$, escala:** la dispersión. Si aumenta, la curva se ensancha.
- **$\delta$, localización:** el desplazamiento. Si aumenta, la curva se desliza a la derecha.
:::

:::nota[Qué significa cada símbolo]
- $\alpha \in (0, 2]$: índice de estabilidad; controla el peso de las colas.
- $\beta \in [-1, 1]$: asimetría; 0 es simétrica.
- $\gamma > 0$: escala.
- $\delta$: localización.
- $\varphi(t) = \mathbb{E}[e^{itX}]$: función característica.
- $i$: unidad imaginaria; $\operatorname{sign}(t)$: signo de $t$.
:::

## Cómo usar la visualización

La pestaña Distribución muestra la densidad estable, calculada numéricamente, junto a la normal estable con $\alpha = 2$ (línea punteada); la región elegida da su probabilidad. Los casos cargan la normal, una estable con $\alpha = 1.5$ y la Cauchy, y el ejemplo de la ficha se carga con su botón. La pestaña Ver cómo surge suma pasos de cola pesada y divide entre $n^{1/\alpha}$: el resultado se acerca a una estable, no a una normal.

Al bajar $\alpha$ desde 2 la campana se vuelve más puntiaguda y sus colas más altas. Al mover $\beta$ la distribución se inclina hacia un lado.

## Ejemplo

Los rendimientos diarios estandarizados de un activo se modelan con $S(1.5, 0, 1, 0)$.

1. Probabilidad de una ganancia de más de 5 escalas: $P(X > 5) \approx 0.021$, unos cinco días al año.
2. Con la normal estable con $\alpha = 2$ y la misma escala ($\sigma = \sqrt{2}$): $P(X > 5) \approx 0.0002$, unas cien veces menos.
3. Probabilidad de superar 3 escalas: alrededor de 0.052.
4. La media es 0, pero la varianza es infinita: la desviación estándar muestral no se estabiliza al aumentar los datos.

:::figura[Caída extrema: el área sombreada a la derecha de 5 vale 0.021; la normal estable (línea punteada) pondría 0.0002. El botón carga el ejemplo.]{componente="DistributionExplorer"}
```yaml
distribucion: estable
valores:
  alpha: 1.5
  beta: 0
  gamma: 1
  delta: 0
dominio: [-10, 10]
ejemplo:
  titulo: 'Caída extrema'
  contexto: 'Los rendimientos diarios estandarizados de un activo siguen una estable simétrica de índice 1.5 y escala 1.'
  pregunta: '¿Qué probabilidad hay de una ganancia mayor que 5 escalas en un día?'
  valores: {alpha: 1.5, beta: 0, gamma: 1, delta: 0}
  region: derecha
  desde: 5
region: derecha
desde: 5
muestras: false
referencia:
  distribucion: normal
  valores:
    mu: 0
    sigma: 1.414
  etiqueta: Normal estable con α = 2
```
:::

## Propiedades

- **Casos explícitos:** $\alpha = 2$ es la normal $\mathcal{N}(\delta, 2\gamma^{2})$; $\alpha = 1$, $\beta = 0$ es la Cauchy; $\alpha = 1/2$, $\beta = 1$ es la Lévy.
- **Colas:** si $\alpha < 2$, $P(|X| > x) \approx C x^{-\alpha}$; la varianza es infinita y la media existe solo si $\alpha > 1$.
- **Estabilidad bajo sumas:** la suma de $n$ copias independientes de $S(\alpha, \beta, \gamma, 0)$ es $S(\alpha, \beta, n^{1/\alpha}\gamma, 0)$ si $\alpha \ne 1$.
- **Teorema central del límite generalizado:** las sumas normalizadas de variables independientes solo pueden converger a distribuciones estables; con colas de índice $\alpha < 2$ el límite es una estable de índice $\alpha$.
- **Simulación:** el método de Chambers, Mallows y Stuck genera estables a partir de una uniforme y una exponencial.

:::figura[Tres casos con contexto (normal, rendimientos financieros y Cauchy): cada botón carga los parámetros y una frase explica por qué la forma es así.]{componente="DistributionExplorer"}
```yaml
distribucion: estable
valores:
  alpha: 1.5
  beta: 0
  gamma: 1
  delta: 0
dominio: [-10, 10]
casos:
  - nombre: 'Normal (α = 2)'
    descripcion: 'α = 2: la normal, la única con varianza finita.'
    valores: {alpha: 2, beta: 0, gamma: 1, delta: 0}
  - nombre: 'Rendimientos financieros'
    descripcion: 'α = 1.5: colas pesadas.'
    valores: {alpha: 1.5, beta: 0, gamma: 1, delta: 0}
  - nombre: 'Cauchy (α = 1)'
    descripcion: 'α = 1: sin media ni varianza.'
    valores: {alpha: 1, beta: 0, gamma: 1, delta: 0}
muestras: false
```
:::

:::figura[Teorema central del límite generalizado: la suma de 30 pasos con colas de índice 1.5, dividida entre 30^(1/1.5), se acerca a la estable de índice 1.5.]{componente="ContinuousGenesis"}
```yaml
proceso: suma-colas-pesadas
valores:
  alpha: 1.5
  n: 30
```
:::

:::figura[Asimetría: con α = 1.5 y β = 0.8 la estable (curva) se inclina con una cola derecha más larga que la izquierda; la línea punteada es la versión simétrica.]{componente="DistributionExplorer"}
```yaml
distribucion: estable
valores:
  alpha: 1.5
  beta: 0.8
  gamma: 1
  delta: 0
dominio: [-10, 10]
muestras: false
referencia:
  distribucion: estable
  valores:
    alpha: 1.5
    beta: 0
    gamma: 1
    delta: 0
  etiqueta: Simétrica, β = 0
```
:::

## Errores comunes

- **Esperar que toda suma grande sea normal.** Si los sumandos tienen varianza infinita, el límite es una estable no normal.
- **Normalizar con raíz de n.** Para índice $\alpha$ la normalización correcta es $n^{1/\alpha}$.
- **Calcular la varianza de una estable con α < 2.** Es infinita; la escala $\gamma$ y los cuantiles son las medidas útiles.
- **Mezclar parametrizaciones.** Existen varias convenciones para $\beta$ y $\delta$; los parámetros de un texto no siempre coinciden con los de otro.

:::figura[Normalizar con √n es incorrecto para α = 1.5: la normal de varianza 2 (línea punteada) subestima las colas de la suma normalizada.]{componente="DistributionExplorer"}
```yaml
distribucion: estable
valores:
  alpha: 1.5
  beta: 0
  gamma: 1
  delta: 0
dominio: [-10, 10]
region: colas
desde: -4
hasta: 4
muestras: false
referencia:
  distribucion: normal
  valores:
    mu: 0
    sigma: 1.414
  etiqueta: Normal de varianza 2
```
:::

## Conexiones

Las estables generalizan la [[distribucion-normal]] e incluyen a la [[distribucion-de-cauchy]] y a la [[distribucion-de-levy]] como casos con densidad explícita. Sus colas son de ley de potencia, como la de la [[distribucion-de-pareto]], y son los únicos límites posibles de sumas normalizadas de variables independientes. Se usan en finanzas, física de procesos con saltos y procesamiento de señales con ruido impulsivo. El [[mapa-de-relaciones-entre-distribuciones]] la sitúa entre las demás distribuciones.

## Formulario

:::formula[Función característica]
$$
\varphi(t) = \exp\!\left(i\delta t - |\gamma t|^{\alpha}\left[1 - i\beta\,\operatorname{sign}(t)\tan\tfrac{\pi\alpha}{2}\right]\right), \qquad \alpha \ne 1
$$

- $\alpha$: índice; $\beta$: asimetría; $\gamma$: escala; $\delta$: localización.
:::

:::formula[Estabilidad bajo sumas]
$$
X_1 + \dots + X_n \sim S(\alpha, \beta, n^{1/\alpha}\gamma, 0), \qquad X_i \sim S(\alpha, \beta, \gamma, 0)
$$

- $n$: número de sumandos independientes.
:::

:::formula[Cola]
$$
P(|X| > x) \approx C\,x^{-\alpha}, \qquad \alpha < 2
$$

- $C$: constante que depende de los parámetros.
:::

:::formula[Caso normal]
$$
S(2, \beta, \gamma, \delta) = \mathcal{N}(\delta, 2\gamma^{2})
$$

- Con $\alpha = 2$ la asimetría no tiene efecto.
:::
