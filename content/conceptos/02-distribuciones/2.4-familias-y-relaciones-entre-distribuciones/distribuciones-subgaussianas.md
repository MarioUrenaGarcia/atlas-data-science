---
id: distribuciones-subgaussianas
titulo: Distribuciones subgaussianas
titulo_en: Sub-Gaussian distributions
alias:
  - variables subgaussianas
  - colas subgaussianas
  - proxy de varianza
modulo: 2
submodulo: '2.4'
orden: 12
nivel: avanzado
prerrequisitos:
  - distribuciones-de-colas-pesadas
  - distribucion-de-rademacher
relaciones:
  - tipo: contrasta
    id: distribuciones-de-colas-pesadas
etiquetas:
  - concentración
  - colas ligeras
  - cotas exponenciales
  - Hoeffding
  - aprendizaje estadístico
resumen: >
  Variables cuyas colas caen al menos tan rápido como las de una normal: P(|X - μ| ≥ t) ≤ 2 exp(-t²/(2σ²)).
  Incluyen las normales y todas las variables acotadas, y sus sumas se concentran con rapidez.
formula: 'P(|X - \mu| \ge t) \le 2\exp\!\left(-\frac{t^{2}}{2\sigma^{2}}\right), \qquad \mathbb{E}\big[e^{\lambda(X - \mu)}\big] \le e^{\lambda^{2}\sigma^{2}/2}'
visualizacion:
  componente: FamilyLab
  parametros:
    modo: subgaussiana
    subgaussiana: normal
    valores:
      sigma: 1
      t: 3
    casos:
      - nombre: 'Error de medición normal'
        descripcion: 'Normal estándar con σ = 1: la cota 2e^(-t²/2) queda arriba de la cola en todo el rango; en t = 3 da 0.022 frente a 0.0027 real.'
        valores: {sigma: 1, t: 3}
      - nombre: 'Cota demasiado ajustada'
        descripcion: 'Normal estándar con σ = 0.8: la cota cae demasiado rápido y la cola la supera; σ debe ser al menos la desviación.'
        valores: {sigma: 0.8, t: 3}
      - nombre: 'Holgura grande'
        descripcion: 'σ = 2: la cota se cumple, pero es tan holgada que casi no informa.'
        valores: {sigma: 2, t: 3}
referencias:
  - clave: wasserman
  - clave: murphy
publicado: true
---

## Intuición

Muchos resultados del aprendizaje estadístico dicen cosas como "con alta probabilidad, el error de entrenamiento está cerca del error real". Para demostrarlos hace falta saber que las variables aleatorias involucradas no se alejan demasiado de su media, y no solo en promedio: hace falta una cota explícita para la probabilidad de desviaciones grandes, que caiga muy rápido con el tamaño de la desviación.

Las variables subgaussianas son las que tienen colas al menos tan ligeras como las de una normal. Su probabilidad de alejarse $t$ de la media está acotada por una curva de forma gaussiana, $2e^{-t^{2}/(2\sigma^{2})}$, donde $\sigma$ hace las veces de una desviación. La normal es el ejemplo obvio, pero la clase incluye todas las variables acotadas, como un signo aleatorio $\pm 1$, la proporción de aciertos de un clasificador o cualquier medición que no puede salirse de un intervalo.

Lo valioso es que la propiedad pasa a las sumas: el promedio de $n$ variables subgaussianas independientes es subgaussiano con parámetro $\sigma/\sqrt{n}$, así que la probabilidad de que el promedio se aleje de la media cae exponencialmente con $n$. Las distribuciones de colas pesadas, como la Laplace o la t, no tienen esta propiedad.

## Definición

:::definicion[Variable subgaussiana]
Una variable $X$ con media $\mu$ es **subgaussiana con parámetro $\sigma$** (o proxy de varianza $\sigma^{2}$) si
$$
\mathbb{E}\big[e^{\lambda(X - \mu)}\big] \le e^{\lambda^{2}\sigma^{2}/2} \qquad \text{para todo } \lambda \in \mathbb{R}.
$$
Esta condición implica la cota de colas
$$
P(|X - \mu| \ge t) \le 2\exp\!\left(-\frac{t^{2}}{2\sigma^{2}}\right), \qquad t \ge 0,
$$
y, recíprocamente, una cota de colas de esa forma implica la condición sobre la función generadora con otra constante.
:::

:::nota[Qué es X]
$X$ = una cantidad cuyas desviaciones grandes son tan raras como las de una normal, como el signo aleatorio de una caminata o el error de una medición acotada.
:::

:::nota[Qué hace cada parámetro]
- **$\sigma$, parámetro de la cota:** la escala de la curva gaussiana que domina a la cola. Si aumenta, la cota se vuelve más holgada; si baja por debajo del mínimo válido, la cola la supera.
- **$t$, umbral:** la desviación cuya probabilidad se acota. Si aumenta, la cota cae como $e^{-t^{2}/(2\sigma^{2})}$.
:::

:::nota[Qué significa cada símbolo]
- $X$: variable aleatoria; $\mu$: su media.
- $\lambda$: argumento de la función generadora de momentos.
- $\sigma$: parámetro subgaussiano; $\sigma^{2}$: proxy de varianza.
- $t$: tamaño de la desviación.
- $e^{\lambda^{2}\sigma^{2}/2}$: función generadora de una normal centrada con varianza $\sigma^{2}$.
:::

## Cómo usar la visualización

La gráfica compara, en escala logarítmica, la cola real $P(|X| \ge t)$ de la variable elegida (curva continua) con la cota $2e^{-t^{2}/(2\sigma^{2})}$ (punteada). El selector cambia la variable: normal, signo de Rademacher, uniforme, Laplace y t con 3 grados. El panel indica si la cota se cumple en todo el rango y, si no, desde qué umbral falla. Los casos cargan la normal con la cota correcta, una demasiado ajustada y una holgada.

Con la normal baja $\sigma$ de 1 a 0.8 y observa que la cola cruza la cota. Cambia a la Laplace y observa que con cualquier $\sigma$ la cola recta termina por arriba de la parábola punteada: no es subgaussiana. Elige la uniforme con $\sigma = 0.58$ y comprueba que la cota se cumple.

## Ejemplo

Un error de medición es normal estándar. Se compara su cola con la cota subgaussiana con $\sigma = 1$, y después se aplica la misma idea a una suma.

1. Cola real: $P(|X| \ge 3) = 2(1 - \Phi(3)) \approx 0.0027$.
2. Cota: $2e^{-9/2} \approx 0.0222$; es ocho veces mayor, pero tiene la forma correcta.
3. Un signo de Rademacher $\pm 1$ es subgaussiano con $\sigma = 1$, porque $\mathbb{E}[e^{\lambda X}] = \cosh\lambda \le e^{\lambda^{2}/2}$.
4. La suma de 100 signos independientes es subgaussiana con $\sigma^{2} = 100$: $P(|S_{100}| \ge 30) \le 2e^{-900/200} = 2e^{-4.5} \approx 0.022$.
5. Como $S_{100}$ es aproximadamente normal con desviación 10, la probabilidad real es cercana a $P(|Z| \ge 3) \approx 0.003$; la cota no es exacta, pero vale para todo $n$ sin aproximaciones.

:::figura[Error de medición normal: con σ = 1 la cota punteada queda arriba de la cola real en todo el rango; en t = 3 vale 0.022 frente a 0.0027.]{componente="FamilyLab"}
```yaml
modo: subgaussiana
subgaussiana: normal
valores:
  sigma: 1
  t: 3
```
:::

## Propiedades

- **Normales:** $\mathcal{N}(\mu, s^{2})$ es subgaussiana con $\sigma = s$, y ese valor es el mínimo posible.
- **Variables acotadas (Hoeffding):** si $a \le X \le b$, $X$ es subgaussiana con $\sigma = (b - a)/2$.
- **Sumas independientes:** si $X_i$ es subgaussiana con $\sigma_i$, $\sum X_i$ lo es con $\sigma^{2} = \sum \sigma_i^{2}$.
- **Promedios:** el promedio de $n$ variables con parámetro $\sigma$ lo es con $\sigma/\sqrt{n}$, de modo que $P(|\bar{X} - \mu| \ge t) \le 2e^{-nt^{2}/(2\sigma^{2})}$.
- **Varianza:** $\operatorname{Var}(X) \le \sigma^{2}$; el proxy siempre es al menos la varianza.
- **Momentos:** todos los momentos existen y crecen como $\mathbb{E}|X|^{k} \le C\,(\sigma\sqrt{k})^{k}$.

:::figura[Casos con contexto (error normal, cota demasiado ajustada, holgura grande): cada botón carga σ y el umbral, y una frase explica si la cota se cumple.]{componente="FamilyLab"}
```yaml
modo: subgaussiana
subgaussiana: normal
valores:
  sigma: 1.5
  t: 2
casos:
  - nombre: 'Error de medición normal'
    descripcion: 'σ = 1: cota válida.'
    valores: {sigma: 1, t: 3}
  - nombre: 'Cota demasiado ajustada'
    descripcion: 'σ = 0.8: la cola la supera.'
    valores: {sigma: 0.8, t: 3}
  - nombre: 'Holgura grande'
    descripcion: 'σ = 2: válida pero poco informativa.'
    valores: {sigma: 2, t: 3}
```
:::

:::figura[Variable acotada: la uniforme en [-1, 1] es subgaussiana con σ² = 1/3 (σ ≈ 0.58); su cola llega a cero en t = 1 y la cota siempre la rebasa.]{componente="FamilyLab"}
```yaml
modo: subgaussiana
subgaussiana: uniforme
valores:
  sigma: 0.58
  t: 0.8
```
:::

## Errores comunes

- **Pensar que toda variable con varianza finita es subgaussiana.** La Laplace tiene varianza 1 y no lo es: su cola $e^{-\sqrt{2}t}$ termina por encima de cualquier curva gaussiana.
- **Usar la varianza como proxy sin verificarlo.** En la normal y en algunas acotadas coinciden, pero en general el proxy puede ser mayor que la varianza.
- **Leer la cota como la probabilidad.** Es una cota superior; puede ser varias veces mayor que la probabilidad real.
- **Aplicar las cotas de concentración a datos de colas pesadas.** Con colas pesadas los promedios se concentran mucho más despacio y las cotas subgaussianas son falsas.

:::figura[La Laplace no es subgaussiana: con varianza 1 y σ = 1, su cola exponencial cruza la cota gaussiana cerca de t = 3.25 y queda por encima de ahí en adelante.]{componente="FamilyLab"}
```yaml
modo: subgaussiana
subgaussiana: laplace
valores:
  sigma: 1
  t: 4
```
:::

## Conexiones

Contrastan con las [[distribuciones-de-colas-pesadas]]. Su ejemplo central es la [[distribucion-normal]], y la [[distribucion-de-rademacher]] y la [[distribucion-uniforme-continua]] son subgaussianas por ser acotadas; la [[distribucion-de-laplace]] y la [[distribucion-t-de-student]] no lo son. Las cotas de concentración que producen, como la desigualdad de Hoeffding, son versiones cuantitativas de la [[ley-debil-de-los-grandes-numeros]] y se usan en teoría del aprendizaje y en análisis de algoritmos aleatorios. El [[mapa-de-relaciones-entre-distribuciones]] reúne estas familias.

## Formulario

:::formula[Condición sobre la generadora de momentos]
$$
\mathbb{E}\big[e^{\lambda(X - \mu)}\big] \le e^{\lambda^{2}\sigma^{2}/2}, \qquad \lambda \in \mathbb{R}
$$

- $\mu$: media; $\sigma^{2}$: proxy de varianza; $\lambda$: argumento.
:::

:::formula[Cota de colas]
$$
P(|X - \mu| \ge t) \le 2\exp\!\left(-\frac{t^{2}}{2\sigma^{2}}\right)
$$

- $t$: umbral de desviación.
:::

:::formula[Variables acotadas]
$$
a \le X \le b \;\Rightarrow\; \sigma = \frac{b - a}{2}
$$

- $a$, $b$: extremos del soporte.
:::

:::formula[Promedios]
$$
P(|\bar{X} - \mu| \ge t) \le 2\exp\!\left(-\frac{n t^{2}}{2\sigma^{2}}\right)
$$

- $\bar{X}$: promedio de $n$ variables independientes con parámetro $\sigma$.
:::

:::formula[Rademacher]
$$
\mathbb{E}[e^{\lambda X}] = \cosh\lambda \le e^{\lambda^{2}/2}
$$

- $X = \pm 1$ con probabilidad 1/2 cada uno; $\cosh$: coseno hiperbólico.
:::
