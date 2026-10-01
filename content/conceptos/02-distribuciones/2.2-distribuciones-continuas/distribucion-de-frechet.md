---
id: distribucion-de-frechet
titulo: Distribución de Fréchet
titulo_en: Fréchet distribution
alias:
  - Fréchet
  - valor extremo tipo II
  - máximos de colas pesadas
modulo: 2
submodulo: '2.2'
orden: 20
nivel: intermedio
prerrequisitos:
  - distribucion-de-pareto
  - distribucion-de-gumbel
relaciones:
  - tipo: relacionado
    id: distribucion-de-weibull
etiquetas:
  - valores extremos
  - colas pesadas
  - máximos
  - seguros
resumen: >
  Distribución límite del máximo de muchas variables con colas de ley de potencia. Describe los
  extremos de pérdidas financieras, reclamaciones de seguros o tamaños de inundaciones extremas.
formula: 'F(x) = \exp\!\left(-\left(\frac{x - m}{s}\right)^{-\alpha}\right), \quad x > m'
visualizacion:
  componente: DistributionStudio
  parametros:
    explorador:
      distribucion: frechet
      valores:
        alpha: 3
        s: 1
        m: 0
      fijos: [m]
      dominio: [0, 8]
      casos:
        - nombre: 'Cola muy pesada'
          descripcion: 'α = 1.5: la media existe pero la varianza no; un año puede tener una pérdida máxima muchas veces la típica.'
          valores: {alpha: 1.5, s: 1}
        - nombre: 'Reclamación máxima'
          descripcion: 'α = 3 y s = 1 (millones): la mayor reclamación del año ronda 1.1 millones, con cola derecha larga.'
          valores: {alpha: 3, s: 1}
        - nombre: 'Cola moderada'
          descripcion: 'α = 7: los máximos se concentran cerca de la escala y la forma se parece a una Gumbel.'
          valores: {alpha: 7, s: 1}
      ejemplo:
        titulo: 'Reclamación extrema'
        contexto: 'La mayor reclamación anual de una aseguradora, en millones de pesos, sigue una Fréchet con α = 3 y escala 1.'
        pregunta: '¿Qué probabilidad hay de que en un año la mayor reclamación supere 3 millones?'
        valores: {alpha: 3, s: 1}
        region: derecha
        desde: 3
    genesis:
      componente: ContinuousGenesis
      parametros:
        proceso: maximo-pareto
        valores:
          n: 20
          alpha: 3
referencias:
  - clave: coles
    capitulo: '3'
publicado: true
---

## Intuición

Una aseguradora recibe miles de reclamaciones al año, la mayoría pequeñas y unas pocas enormes, con una cola que sigue una ley de potencia. Lo que le preocupa es la mayor reclamación del año, que puede comprometer su solvencia. Cuando se toma el máximo de muchas variables de cola pesada, el resultado converge a la distribución de Fréchet.

La diferencia con la Gumbel está en la cola. Si las variables originales tienen colas exponenciales, el máximo tiene cola exponencial; si tienen colas de ley de potencia, como la Pareto, el máximo hereda una cola de ley de potencia con el mismo índice. Por eso la Fréchet produce máximos mucho más extremos: con índice 1.5, el máximo de un año puede ser decenas de veces el de otro.

El índice de cola $\alpha$ es el número clave: cuanto menor, más pesada la cola. Con $\alpha \le 1$ la media del máximo es infinita y con $\alpha \le 2$ lo es su varianza. Estimar bien este índice es la tarea central en la gestión de riesgos de pérdidas extremas.

## Definición

:::definicion[Distribución de Fréchet]
Una variable $X$ tiene **distribución de Fréchet** con índice $\alpha > 0$, escala $s > 0$ y localización $m$ si
$$
F(x) = \exp\!\left(-\left(\frac{x - m}{s}\right)^{-\alpha}\right), \qquad f(x) = \frac{\alpha}{s}\left(\frac{x - m}{s}\right)^{-1-\alpha}\exp\!\left(-\left(\frac{x - m}{s}\right)^{-\alpha}\right), \qquad x > m.
$$
:::

:::teorema[Máximo de variables de Pareto]
Si $X_1, \dots, X_n$ son $\operatorname{Pareto}(1, \alpha)$ independientes, entonces $\max_i X_i / n^{1/\alpha}$ converge en distribución a la Fréchet con índice $\alpha$, escala 1 y localización 0.
:::

:::nota[Qué significa cada símbolo]
- $X$: valor máximo.
- $\alpha$: índice de cola.
- $s$: escala.
- $m$: localización, el mínimo posible.
- $F(x)$: probabilidad de que el máximo no supere $x$.
- $n^{1/\alpha}$: factor con el que crece el máximo de $n$ variables de Pareto.
:::

## Cómo usar la visualización

La pestaña Distribución muestra la densidad de Fréchet, la región elegida y su probabilidad; los casos cargan índices de cola de 1.5, 3 y 7, y el ejemplo de la ficha se carga con su botón. La pestaña Ver cómo surge toma el máximo de $n$ valores de Pareto, lo divide entre $n^{1/\alpha}$ y lo acumula frente a la Fréchet límite.

Con el caso de cola muy pesada, el botón de simulación produce de vez en cuando máximos enormes y la varianza simulada no se estabiliza. Con índice 7 la densidad se concentra cerca de 1 y su forma se parece a la de una Gumbel.

## Ejemplo

La mayor reclamación anual de una aseguradora, en millones de pesos, sigue una Fréchet con $\alpha = 3$, $s = 1$ y $m = 0$.

1. Probabilidad de superar 3 millones en un año: $1 - \exp(-3^{-3}) = 1 - e^{-0.037} \approx 0.036$.
2. Mediana: $s(\log 2)^{-1/\alpha} = 0.693^{-1/3} \approx 1.13$ millones.
3. Media: $s\,\Gamma(1 - 1/\alpha) = \Gamma(0.667) \approx 1.35$ millones.
4. Nivel de 100 años, el cuantil 0.99: $(-\log 0.99)^{-1/3} = 0.01005^{-1/3} \approx 4.63$ millones, más de cuatro veces la mediana.

:::figura[Reclamación extrema: el área sombreada a la derecha de 3 millones vale 0.036. El botón carga el ejemplo.]{componente="DistributionExplorer"}
```yaml
distribucion: frechet
valores:
  alpha: 3
  s: 1
  m: 0
fijos: [m]
dominio: [0, 8]
ejemplo:
  titulo: 'Reclamación extrema'
  contexto: 'La mayor reclamación anual de una aseguradora, en millones de pesos, sigue una Fréchet con α = 3 y escala 1.'
  pregunta: '¿Qué probabilidad hay de que en un año la mayor reclamación supere 3 millones?'
  valores: {alpha: 3, s: 1}
  region: derecha
  desde: 3
region: derecha
desde: 3
probabilidad: 0.99
muestras: false
```
:::

## Propiedades

- **Media:** $m + s\,\Gamma(1 - 1/\alpha)$ si $\alpha > 1$; infinita si $\alpha \le 1$.
- **Varianza:** $s^{2}\left[\Gamma(1 - 2/\alpha) - \Gamma(1 - 1/\alpha)^{2}\right]$ si $\alpha > 2$.
- **Cola:** $P(X > x) \approx \left(\frac{x - m}{s}\right)^{-\alpha}$ para $x$ grande, una ley de potencia con el mismo índice que los datos.
- **Cuantil:** $x_p = m + s(-\log p)^{-1/\alpha}$.
- **Relación con la Weibull:** si $X$ es Fréchet con localización 0, entonces $1/X$ es Weibull con forma $\alpha$.
- **Estabilidad bajo máximos:** el máximo de $n$ Fréchet independientes con el mismo índice es Fréchet con escala $s\,n^{1/\alpha}$.

:::figura[Tres casos con contexto (cola muy pesada, reclamación máxima y cola moderada): cada botón carga los parámetros y una frase explica por qué la forma es así.]{componente="DistributionExplorer"}
```yaml
distribucion: frechet
valores:
  alpha: 3
  s: 1
  m: 0
fijos: [m]
dominio: [0, 8]
casos:
  - nombre: 'Cola muy pesada'
    descripcion: 'α = 1.5: la varianza no existe y aparecen máximos enormes.'
    valores: {alpha: 1.5, s: 1}
  - nombre: 'Reclamación máxima'
    descripcion: 'α = 3: mediana 1.13 y cola derecha larga.'
    valores: {alpha: 3, s: 1}
  - nombre: 'Cola moderada'
    descripcion: 'α = 7: concentrada cerca de 1, parecida a una Gumbel.'
    valores: {alpha: 7, s: 1}
muestras: false
```
:::

:::figura[Máximo de 20 valores de Pareto con índice 3, divididos entre 20^(1/3): el histograma se acerca a la Fréchet límite (línea punteada).]{componente="ContinuousGenesis"}
```yaml
proceso: maximo-pareto
valores:
  n: 20
  alpha: 3
```
:::

## Errores comunes

- **Modelar máximos de pérdidas con una Gumbel.** Si las pérdidas tienen cola de ley de potencia, la Gumbel subestima los extremos; el nivel de 100 años puede salir varias veces menor.
- **Confiar en la varianza muestral con α ≤ 2.** La varianza teórica es infinita y la muestral no converge.
- **Ignorar la localización.** La Fréchet tiene un mínimo $m$; si los datos pueden ser negativos o menores que $m$, el modelo no aplica.
- **Extrapolar con un índice mal estimado.** Pequeños cambios en $\alpha$ cambian mucho los cuantiles extremos.

:::figura[Fréchet con índice 3 (curva) frente a una Gumbel con la misma mediana y forma parecida en el centro (línea punteada): la cola derecha de la Fréchet es mucho más pesada.]{componente="DistributionExplorer"}
```yaml
distribucion: frechet
valores:
  alpha: 3
  s: 1
  m: 0
fijos: [m]
dominio: [0, 8]
region: derecha
desde: 4
muestras: false
referencia:
  distribucion: gumbel
  valores:
    mu: 1
    beta: 0.35
  etiqueta: Gumbel de forma parecida en el centro
```
:::

## Conexiones

La Fréchet es el límite del máximo de variables de cola pesada, como la [[distribucion-de-pareto]], y comparte familia con la [[distribucion-de-gumbel]] y la [[distribucion-de-weibull]]; su inverso es una Weibull. Es la distribución de referencia para extremos en seguros, finanzas y desastres naturales con colas pesadas.

## Formulario

:::formula[Distribución]
$$
F(x) = \exp\!\left(-\left(\frac{x - m}{s}\right)^{-\alpha}\right), \qquad x > m
$$

- $\alpha$: índice de cola.
- $s$: escala.
- $m$: localización.
:::

:::formula[Media y varianza]
$$
\mathbb{E}[X] = m + s\,\Gamma\!\left(1 - \tfrac{1}{\alpha}\right), \qquad \operatorname{Var}(X) = s^{2}\left[\Gamma\!\left(1 - \tfrac{2}{\alpha}\right) - \Gamma\!\left(1 - \tfrac{1}{\alpha}\right)^{2}\right]
$$

- $\Gamma$: función gamma; requieren $\alpha > 1$ y $\alpha > 2$.
:::

:::formula[Cuantil]
$$
x_p = m + s(-\log p)^{-1/\alpha}
$$

- $p$: probabilidad acumulada.
:::

:::formula[Máximo de Pareto]
$$
\frac{\max(X_1, \dots, X_n)}{n^{1/\alpha}} \to \operatorname{Fréchet}(\alpha, 1, 0)
$$

- $X_i \sim \operatorname{Pareto}(1, \alpha)$ independientes.
:::
