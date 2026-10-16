---
id: distribucion-de-dirichlet
titulo: Distribución de Dirichlet
titulo_en: Dirichlet distribution
alias:
  - Dirichlet
  - beta multivariada
modulo: 2
submodulo: '2.3'
orden: 6
nivel: intermedio
prerrequisitos:
  - distribucion-beta
  - distribucion-categorica
relaciones:
  - tipo: generaliza
    id: distribucion-beta
  - tipo: relacionado
    id: distribucion-multinomial
etiquetas:
  - proporciones
  - símplex
  - distribución conjugada
  - composición
  - beta
resumen: >
  Distribución de un vector de proporciones que suman uno, como las participaciones de mercado de
  varias marcas. Generaliza la beta y es la distribución conjugada de la categórica y la multinomial.
formula: 'f(\mathbf{p}) = \frac{\Gamma(\alpha_0)}{\prod_{i=1}^{k}\Gamma(\alpha_i)} \prod_{i=1}^{k} p_i^{\alpha_i - 1}, \qquad \alpha_0 = \sum_{i=1}^{k}\alpha_i'
visualizacion:
  componente: MultivariateExplorer
  parametros:
    modo: dirichlet
    valores:
      a1: 4
      a2: 6
      a3: 10
    casos:
      - nombre: 'Participación de mercado'
        descripcion: 'α = (4, 6, 10): tres marcas con participaciones medias de 20, 30 y 50 %; la densidad se concentra cerca de esa mezcla.'
        valores: {a1: 4, a2: 6, a3: 10}
      - nombre: 'Sin información'
        descripcion: 'α = (1, 1, 1): todas las mezclas son igual de plausibles y el triángulo queda parejo.'
        valores: {a1: 1, a2: 1, a3: 1}
      - nombre: 'Temas dispersos'
        descripcion: 'α = (0.3, 0.3, 0.3): cada documento trata casi un solo tema; la masa se va a las esquinas.'
        valores: {a1: 0.3, a2: 0.3, a3: 0.3}
referencias:
  - clave: gelman-bda
  - clave: murphy
publicado: true
---

## Intuición

Tres marcas se reparten el mercado de un refresco. Las participaciones son tres números positivos que suman uno, por ejemplo 20, 30 y 50 %. Nadie las conoce con exactitud, y la incertidumbre sobre ellas es una distribución sobre todos los repartos posibles. Esa distribución vive en un triángulo: cada punto del triángulo es un reparto, con las esquinas como los casos extremos en que una sola marca tiene todo.

La distribución de Dirichlet es el modelo más usado para esos repartos. Cada componente tiene un parámetro de concentración. La proporción media de cada componente es su parámetro dividido entre la suma de todos, y la suma total controla qué tan segura es la creencia: con parámetros grandes la densidad es un pico angosto alrededor de la media; con parámetros iguales a uno es pareja sobre todo el triángulo; con parámetros menores que uno empuja la masa a las esquinas.

Funciona como la beta en varias dimensiones. De hecho, cada proporción por separado tiene distribución beta, y si se observan conteos de cada categoría, la Dirichlet se actualiza sumando esos conteos a sus parámetros.

## Definición

:::definicion[Distribución de Dirichlet]
Sean $\alpha_1, \dots, \alpha_k > 0$ y $\alpha_0 = \sum_i \alpha_i$. El vector $\mathbf{p} = (p_1, \dots, p_k)$ con $p_i > 0$ y $\sum_i p_i = 1$ tiene **distribución de Dirichlet**, $\mathbf{p} \sim \operatorname{Dir}(\boldsymbol{\alpha})$, si su densidad sobre el símplex es
$$
f(\mathbf{p}) = \frac{\Gamma(\alpha_0)}{\prod_{i=1}^{k}\Gamma(\alpha_i)} \prod_{i=1}^{k} p_i^{\alpha_i - 1}.
$$
:::

Se simula con gammas: si $G_i \sim \operatorname{Gamma}(\alpha_i, 1)$ son independientes, entonces $\mathbf{p} = (G_1, \dots, G_k)/\sum_j G_j \sim \operatorname{Dir}(\boldsymbol{\alpha})$.

:::nota[Qué es X]
$X$ = el vector $\mathbf{p}$ de proporciones que suman uno, como las participaciones de mercado de tres marcas.
:::

:::nota[Qué hace cada parámetro]
- **$\alpha_i$, concentración de la componente $i$:** su peso relativo. Si aumenta $\alpha_1$, la masa se desplaza hacia la esquina $p_1 = 1$ y la media de $p_1$ sube.
- **$\alpha_0$, concentración total:** la seguridad de la creencia. Si aumenta con las proporciones fijas, la densidad se vuelve un pico más angosto; con todos los $\alpha_i < 1$ la masa se va a las esquinas.
:::

:::nota[Qué significa cada símbolo]
- $\mathbf{p}$: vector de proporciones; $p_i$: proporción de la componente $i$.
- $k$: número de componentes.
- $\boldsymbol{\alpha}$: vector de concentraciones; $\alpha_0$: su suma.
- $\Gamma$: función gamma.
- $G_i$: variables gamma independientes usadas para simular.
:::

## Cómo usar la visualización

El triángulo es el símplex de tres proporciones: la esquina inferior izquierda es $p_1 = 1$, la inferior derecha $p_2 = 1$ y la superior $p_3 = 1$. El sombreado es la densidad, más oscuro donde es mayor, y el punto grande marca la media. Los controles fijan $\alpha_1$, $\alpha_2$ y $\alpha_3$; el panel da la media y la varianza de cada proporción. El botón de simulación agrega 300 vectores y el panel compara sus medias con las teóricas.

Multiplica los tres parámetros por cinco y observa que la media no se mueve, pero la mancha se encoge. Baja los tres a 0.3 y observa que los puntos se pegan a las esquinas. Sube solo $\alpha_3$ y observa que la masa sube hacia el vértice superior.

## Ejemplo

Las participaciones de mercado de tres marcas se modelan con $\operatorname{Dir}(4, 6, 10)$.

1. Concentración total: $\alpha_0 = 20$.
2. Medias: $\mathbb{E}[p_i] = \alpha_i/\alpha_0$, es decir, $(0.2, 0.3, 0.5)$.
3. Varianza de la tercera: $\operatorname{Var}(p_3) = \frac{0.5 \cdot 0.5}{21} \approx 0.0119$, con desviación $\approx 0.109$.
4. Covarianza entre las dos primeras: $\operatorname{Cov}(p_1, p_2) = -\frac{4 \cdot 6}{20^{2} \cdot 21} \approx -0.00286$; si una crece, las demás tienen que ceder.
5. La marginal de la primera es $p_1 \sim \operatorname{Beta}(4, 16)$, así que $P(p_1 > 0.3) \approx 0.133$.

:::figura[Participación de mercado: con α = (4, 6, 10) la densidad se concentra cerca de la media (0.2, 0.3, 0.5), marcada con el punto. Al simular, las medias de las muestras se acercan a esos valores.]{componente="MultivariateExplorer"}
```yaml
modo: dirichlet
valores:
  a1: 4
  a2: 6
  a3: 10
```
:::

## Propiedades

- **Media y varianza:** $\mathbb{E}[p_i] = \alpha_i/\alpha_0$ y $\operatorname{Var}(p_i) = \frac{\bar{p}_i(1 - \bar{p}_i)}{\alpha_0 + 1}$, con $\bar{p}_i = \alpha_i/\alpha_0$.
- **Covarianza negativa:** $\operatorname{Cov}(p_i, p_j) = -\frac{\alpha_i\alpha_j}{\alpha_0^{2}(\alpha_0 + 1)}$ para $i \ne j$.
- **Marginales beta:** $p_i \sim \operatorname{Beta}(\alpha_i, \alpha_0 - \alpha_i)$; con $k = 2$ la Dirichlet es la beta.
- **Agregación:** sumar componentes suma parámetros; por ejemplo $(p_1 + p_2, p_3) \sim \operatorname{Dir}(\alpha_1 + \alpha_2, \alpha_3)$.
- **Conjugación:** si $\mathbf{p} \sim \operatorname{Dir}(\boldsymbol{\alpha})$ y se observan conteos $\mathbf{n}$ de una multinomial, la posterior es $\operatorname{Dir}(\boldsymbol{\alpha} + \mathbf{n})$.
- **Uniforme:** $\operatorname{Dir}(1, \dots, 1)$ es uniforme sobre el símplex, con densidad constante $(k - 1)!$.

:::figura[Casos con contexto (participación de mercado, sin información, temas dispersos): cada botón carga las concentraciones y una frase explica la forma de la densidad.]{componente="MultivariateExplorer"}
```yaml
modo: dirichlet
valores:
  a1: 1
  a2: 1
  a3: 1
casos:
  - nombre: 'Participación de mercado'
    descripcion: 'α = (4, 6, 10): pico alrededor de (0.2, 0.3, 0.5).'
    valores: {a1: 4, a2: 6, a3: 10}
  - nombre: 'Sin información'
    descripcion: 'α = (1, 1, 1): densidad constante igual a 2.'
    valores: {a1: 1, a2: 1, a3: 1}
  - nombre: 'Temas dispersos'
    descripcion: 'α = (0.3, 0.3, 0.3): la masa se acumula en las esquinas.'
    valores: {a1: 0.3, a2: 0.3, a3: 0.3}
```
:::

:::figura[Conjugación: tras observar 4, 6 y 10 compras de cada marca, la Dirichlet(4, 6, 10) se vuelve Dirichlet(8, 12, 20); la media sigue en (0.2, 0.3, 0.5), pero la mancha es más chica porque α₀ subió de 20 a 40.]{componente="MultivariateExplorer"}
```yaml
modo: dirichlet
valores:
  a1: 8
  a2: 12
  a3: 20
```
:::

## Errores comunes

- **Leer cada $\alpha_i$ como una probabilidad.** La probabilidad media es $\alpha_i/\alpha_0$; el tamaño absoluto de los parámetros mide la concentración, no el reparto.
- **Tratar las proporciones como independientes.** Como suman uno, están correlacionadas negativamente; no se pueden simular por separado con betas independientes.
- **Usar parámetros muy chicos como "sin información".** Con $\alpha_i < 1$ la distribución favorece repartos extremos; la opción pareja es $\alpha_i = 1$.
- **Olvidar que solo hay $k - 1$ grados de libertad.** La última proporción queda determinada por las demás; la densidad se define sobre el símplex, no sobre $\mathbb{R}^{k}$.

:::figura[Parámetros chicos no son neutros: con α = (0.5, 0.5, 0.5) la densidad es mayor cerca de las esquinas y de los bordes, no en el centro.]{componente="MultivariateExplorer"}
```yaml
modo: dirichlet
valores:
  a1: 0.5
  a2: 0.5
  a3: 0.5
```
:::

## Conexiones

Generaliza la [[distribucion-beta]] a más de dos proporciones y es la distribución conjugada de la [[distribucion-categorica]] y de la [[distribucion-multinomial]]. Se construye con variables de la [[distribucion-gamma]] normalizadas, y su constante usa la [[funcion-gamma]]. Aparece en modelos bayesianos de proporciones, en modelos de temas para textos y en el análisis de datos de composición. El [[mapa-de-relaciones-entre-distribuciones]] la sitúa entre las demás distribuciones.

## Formulario

:::formula[Densidad]
$$
f(\mathbf{p}) = \frac{\Gamma(\alpha_0)}{\prod_{i=1}^{k}\Gamma(\alpha_i)} \prod_{i=1}^{k} p_i^{\alpha_i - 1}
$$

- $\mathbf{p}$: proporciones que suman uno; $k$: número de componentes.
- $\alpha_i$: concentraciones; $\alpha_0$: su suma; $\Gamma$: función gamma.
:::

:::formula[Media y varianza]
$$
\mathbb{E}[p_i] = \frac{\alpha_i}{\alpha_0}, \qquad \operatorname{Var}(p_i) = \frac{\bar{p}_i(1 - \bar{p}_i)}{\alpha_0 + 1}
$$

- $\bar{p}_i = \alpha_i/\alpha_0$: proporción media.
:::

:::formula[Covarianza]
$$
\operatorname{Cov}(p_i, p_j) = -\frac{\alpha_i\alpha_j}{\alpha_0^{2}(\alpha_0 + 1)}, \qquad i \ne j
$$

- $i$, $j$: dos componentes distintas.
:::

:::formula[Construcción con gammas]
$$
\mathbf{p} = \frac{(G_1, \dots, G_k)}{\sum_{j} G_j}, \qquad G_i \sim \operatorname{Gamma}(\alpha_i, 1)
$$

- $G_i$: gammas independientes de forma $\alpha_i$ y tasa 1.
:::

:::formula[Actualización conjugada]
$$
\operatorname{Dir}(\boldsymbol{\alpha}) \;\longrightarrow\; \operatorname{Dir}(\boldsymbol{\alpha} + \mathbf{n})
$$

- $\mathbf{n}$: conteos observados de cada categoría.
:::
