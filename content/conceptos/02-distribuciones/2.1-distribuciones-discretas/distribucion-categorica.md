---
id: distribucion-categorica
titulo: Distribución categórica
titulo_en: Categorical distribution
alias:
  - categórica
  - distribución discreta general
  - multinoulli
modulo: 2
submodulo: '2.1'
orden: 8
nivel: basico
prerrequisitos:
  - distribucion-de-bernoulli
relaciones:
  - tipo: generaliza
    id: distribucion-de-bernoulli
  - tipo: generaliza
    id: distribucion-uniforme-discreta
etiquetas:
  - distribución discreta
  - categorías
  - codificación one-hot
  - clasificación
resumen: >
  Describe un experimento con k resultados posibles, cada uno con su propia probabilidad. Generaliza
  la Bernoulli a más de dos categorías y es el modelo de salida de los clasificadores.
formula: 'P(X = j) = p_j, \quad j = 1, \dots, k, \quad \sum_{j=1}^{k} p_j = 1'
visualizacion:
  componente: DistributionGenesis
  parametros:
    proceso: ruleta
    categorias:
      - etiqueta: Auto
        probabilidad: 0.35
      - etiqueta: Autobús
        probabilidad: 0.3
      - etiqueta: Metro
        probabilidad: 0.2
      - etiqueta: Bicicleta
        probabilidad: 0.1
      - etiqueta: A pie
        probabilidad: 0.05
referencias:
  - clave: murphy
    capitulo: '2'
  - clave: bishop
    capitulo: '2'
publicado: true
---

## Intuición

Una encuesta pregunta a una persona elegida al azar cómo llega a su trabajo: en auto, autobús, metro, bicicleta o a pie. La respuesta no es un número sino una categoría, y cada categoría tiene su propia probabilidad según qué tan común es en la ciudad. La distribución categórica es exactamente esa lista de probabilidades.

Se puede imaginar como una ruleta dividida en sectores de distintos tamaños: el sector del auto ocupa el 35 % del círculo, el de la bicicleta el 10 %. Girar la ruleta una vez equivale a observar una respuesta. A diferencia de la Bernoulli, que solo admite dos resultados, aquí hay tantos como sectores; a diferencia de la uniforme, los sectores no tienen por qué ser iguales.

Como las categorías no tienen un orden natural, no tiene sentido hablar de la "media" de la respuesta. Lo que sí tiene sentido es la frecuencia de cada categoría. Por eso suele representarse cada resultado como un vector de ceros con un solo uno en la posición de la categoría observada; el promedio de esos vectores estima directamente las probabilidades. Esta es la distribución que producen los clasificadores cuando asignan una probabilidad a cada clase.

## Definición

:::definicion[Distribución categórica]
Sea $\mathbf{p} = (p_1, \dots, p_k)$ un vector con $p_j \ge 0$ y $\sum_{j=1}^{k} p_j = 1$. Una variable aleatoria $X$ con valores en $\{1, \dots, k\}$ tiene **distribución categórica** con parámetro $\mathbf{p}$, $X \sim \operatorname{Cat}(\mathbf{p})$, si
$$
P(X = j) = p_j, \qquad j = 1, \dots, k.
$$
:::

Las etiquetas $1, \dots, k$ solo nombran las categorías. La **codificación one-hot** representa el resultado como el vector $\mathbf{e} = (e_1, \dots, e_k)$ con $e_j = \mathbf{1}\{X = j\}$; con ella, $P(X = j) = \prod_{i=1}^{k} p_i^{e_i}$ cuando $\mathbf{e}$ es el vector de la categoría $j$.

:::nota[Qué significa cada símbolo]
- $X$: categoría observada, nombrada con un número del 1 al $k$.
- $k$: número de categorías.
- $\mathbf{p}$: vector de probabilidades de las categorías.
- $p_j$: probabilidad de la categoría $j$.
- $\mathbf{e}$: vector one-hot del resultado.
- $e_j$: vale 1 si salió la categoría $j$ y 0 si no.
- $\mathbf{1}\{X = j\}$: indicadora del evento $X = j$.
:::

## Cómo usar la visualización

La ruleta tiene un sector por modo de transporte, de tamaño proporcional a su probabilidad. Cada giro detiene la aguja dentro de un sector y esa categoría suma uno en el histograma inferior, que compara la frecuencia observada con la probabilidad teórica. Los controles de peso cambian el tamaño de cada sector; los pesos se normalizan para que las probabilidades sumen uno.

Con pocas respuestas la bicicleta o el traslado a pie pueden no aparecer; con cientos, cada barra se acerca a su probabilidad. Al igualar todos los pesos la ruleta se vuelve uniforme. Al dejar en cero todos los pesos menos dos, la ruleta se reduce a una Bernoulli.

## Ejemplo

En una población hipotética, los grupos sanguíneos tienen probabilidades O: 0.45, A: 0.40, B: 0.11 y AB: 0.04. Sea $X$ el grupo de un donante elegido al azar.

1. Comprobación: $0.45 + 0.40 + 0.11 + 0.04 = 1$.
2. Un paciente del grupo A puede recibir sangre de los grupos A y O: $P(X \in \{A, O\}) = 0.40 + 0.45 = 0.85$.
3. Un paciente del grupo O solo puede recibir del grupo O: probabilidad 0.45.
4. Con codificación one-hot, la indicadora del grupo B tiene media 0.11 y varianza $0.11 \cdot 0.89 = 0.0979$.

:::figura[Donantes elegidos al azar. Cada giro es un donante y las barras se estabilizan en 0.45, 0.40, 0.11 y 0.04.]{componente="DistributionGenesis"}
```yaml
proceso: ruleta
categorias:
  - etiqueta: O
    probabilidad: 0.45
  - etiqueta: A
    probabilidad: 0.4
  - etiqueta: B
    probabilidad: 0.11
  - etiqueta: AB
    probabilidad: 0.04
```
:::

## Propiedades

- **Indicadoras:** cada $e_j = \mathbf{1}\{X = j\}$ es $\operatorname{Bernoulli}(p_j)$, con $\mathbb{E}[e_j] = p_j$ y $\operatorname{Var}(e_j) = p_j(1 - p_j)$.
- **Covarianza negativa:** para $i \ne j$, $\operatorname{Cov}(e_i, e_j) = -p_i p_j$, porque si sale una categoría no puede salir otra.
- **Media del vector one-hot:** $\mathbb{E}[\mathbf{e}] = \mathbf{p}$; promediar los vectores de muchas observaciones estima las probabilidades.
- **Casos particulares:** con $k = 2$ es una Bernoulli; con $p_j = 1/k$ para todo $j$ es una uniforme sobre las categorías.
- **Agrupación:** juntar categorías suma sus probabilidades y produce otra categórica con menos clases.
- **Repetición:** el conteo de cada categoría en $n$ observaciones independientes sigue una distribución multinomial.

:::figura[Con dos categorías la categórica es una Bernoulli: una ruleta con sectores de 0.7 y 0.3.]{componente="DistributionGenesis"}
```yaml
proceso: ruleta
categorias:
  - etiqueta: Aprueba
    probabilidad: 0.7
  - etiqueta: Reprueba
    probabilidad: 0.3
```
:::

:::figura[Con pesos iguales es la uniforme sobre las categorías: seis sectores iguales de 1/6, como un dado sin números.]{componente="DistributionGenesis"}
```yaml
proceso: ruleta
categorias:
  - etiqueta: Rojo
    probabilidad: 1
  - etiqueta: Azul
    probabilidad: 1
  - etiqueta: Verde
    probabilidad: 1
  - etiqueta: Amarillo
    probabilidad: 1
  - etiqueta: Negro
    probabilidad: 1
  - etiqueta: Blanco
    probabilidad: 1
```
:::

:::figura[Agrupación: juntar A, B y AB en "No O" da una categórica de dos clases con probabilidades 0.45 y 0.55.]{componente="DistributionGenesis"}
```yaml
proceso: ruleta
categorias:
  - etiqueta: O
    probabilidad: 0.45
  - etiqueta: No O
    probabilidad: 0.55
```
:::

## Errores comunes

- **Promediar las etiquetas numéricas.** Si auto = 1 y a pie = 5, la "media" 2.2 no significa nada: cambiar la numeración la cambiaría. Se resumen las frecuencias o la moda, no la media de los códigos.
- **Suponer categorías igualmente probables.** Que haya cinco modos de transporte no implica probabilidad 0.2 para cada uno.
- **Olvidar normalizar.** Unos pesos como 7, 6, 4, 2 y 1 deben dividirse entre su suma, 20, para obtener probabilidades.
- **Esperar que todas las categorías aparezcan en una muestra pequeña.** Una categoría con probabilidad 0.04 falta en una muestra de 10 observaciones con probabilidad $0.96^{10} \approx 0.66$.

:::figura[Pesos sin normalizar: 7, 6, 4, 2 y 1 producen los mismos sectores que 0.35, 0.30, 0.20, 0.10 y 0.05, porque la ruleta los divide entre su suma.]{componente="DistributionGenesis"}
```yaml
proceso: ruleta
categorias:
  - etiqueta: Auto
    probabilidad: 7
  - etiqueta: Autobús
    probabilidad: 6
  - etiqueta: Metro
    probabilidad: 4
  - etiqueta: Bicicleta
    probabilidad: 2
  - etiqueta: A pie
    probabilidad: 1
```
:::

## Conexiones

La categórica generaliza la [[distribucion-de-bernoulli]] a más de dos resultados e incluye a la [[distribucion-uniforme-discreta]] como el caso de probabilidades iguales. Contar las categorías en $n$ repeticiones independientes da la [[distribucion-multinomial]]. Cuando sus probabilidades se tratan como desconocidas, la distribución de Dirichlet es el modelo natural para el vector $\mathbf{p}$. En aprendizaje automático, la función softmax produce un vector de probabilidades categóricas y la entropía cruzada mide qué tan bien predice la categoría observada.

## Formulario

:::formula[Función de masa]
$$
P(X = j) = p_j, \qquad \sum_{j=1}^{k} p_j = 1
$$

- $X$: categoría observada.
- $k$: número de categorías.
- $p_j$: probabilidad de la categoría $j$.
:::

:::formula[Forma con codificación one-hot]
$$
P(\mathbf{e}) = \prod_{j=1}^{k} p_j^{e_j}
$$

- $\mathbf{e}$: vector con un 1 en la categoría observada y 0 en las demás.
- $e_j$: componente $j$ del vector.
:::

:::formula[Momentos de las indicadoras]
$$
\mathbb{E}[e_j] = p_j, \qquad \operatorname{Var}(e_j) = p_j(1 - p_j), \qquad \operatorname{Cov}(e_i, e_j) = -p_i p_j\ (i \ne j)
$$

- $e_j$: indicadora de la categoría $j$.
- $i$, $j$: dos categorías distintas.
:::

:::formula[Normalización de pesos]
$$
p_j = \frac{w_j}{\sum_{i=1}^{k} w_i}
$$

- $w_j$: peso no negativo de la categoría $j$.
- La división garantiza que las probabilidades sumen uno.
:::
