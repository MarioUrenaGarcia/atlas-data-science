---
id: distribucion-de-erlang
titulo: Distribución de Erlang
titulo_en: Erlang distribution
alias:
  - Erlang
  - espera hasta la k-ésima llegada
modulo: 2
submodulo: '2.2'
orden: 8
nivel: basico
prerrequisitos:
  - distribucion-gamma
relaciones:
  - tipo: caso-particular
    id: distribucion-gamma
  - tipo: relacionado
    id: distribucion-de-poisson
etiquetas:
  - distribución continua
  - tiempo de espera
  - suma de exponenciales
  - teoría de colas
resumen: >
  Es el tiempo hasta la llegada número k de un proceso de Poisson con tasa λ, es decir, la suma de k
  esperas exponenciales independientes. Es la gamma con forma entera.
formula: 'f(t) = \frac{\lambda^{k} t^{k - 1} e^{-\lambda t}}{(k - 1)!}, \quad t \ge 0'
visualizacion:
  componente: DistributionStudio
  parametros:
    explorador:
      distribucion: erlang
      valores:
        k: 3
        lambda: 2
      casos:
        - nombre: 'Primera llamada'
          descripcion: 'Con k = 1 la Erlang es la exponencial: lo más probable es esperar muy poco.'
          valores: {k: 1, lambda: 2}
        - nombre: 'Tercera llamada'
          descripcion: 'k = 3 y λ = 2: casi nunca se juntan tres llamadas en muy poco tiempo, así que la densidad empieza en cero.'
          valores: {k: 3, lambda: 2}
        - nombre: 'Décima llamada'
          descripcion: 'k = 10: la espera es la suma de diez exponenciales y ya parece una campana alrededor de 5 minutos.'
          valores: {k: 10, lambda: 2}
      ejemplo:
        titulo: 'Tres llamadas en un minuto'
        contexto: 'Un conmutador recibe llamadas al azar con tasa 2 por minuto.'
        pregunta: '¿Qué probabilidad hay de que la tercera llamada llegue antes de 1 minuto?'
        valores: {k: 3, lambda: 2}
        region: izquierda
        desde: 1
    genesis:
      componente: ContinuousGenesis
      parametros:
        proceso: llegadas
        valores:
          lambda: 2
          k: 3
        unidad: llamadas a un conmutador, 2 por minuto
referencias:
  - clave: ross-procesos
    capitulo: '5'
  - clave: blitzstein-hwang
    capitulo: '8'
publicado: true
---

## Intuición

Un conmutador recibe en promedio dos llamadas por minuto, al azar. Una supervisora quiere saber cuánto tarda en acumularse la tercera llamada de un turno. Esa espera tiene tres tramos: hasta la primera llamada, de la primera a la segunda y de la segunda a la tercera. Cada tramo es una espera exponencial con tasa 2 y los tramos son independientes, así que la espera total es su suma. Su distribución es la de Erlang.

A diferencia de la exponencial, la Erlang con más de una etapa casi nunca da esperas muy cortas: para que pase poco tiempo, las tres llamadas tendrían que llegar muy juntas. Por eso su densidad empieza en cero, sube hasta un máximo y luego decae. Al aumentar el número de etapas la distribución se concentra relativamente alrededor de su media y su forma se acerca a una campana.

Agner Krarup Erlang la estudió a principios del siglo XX para dimensionar centrales telefónicas, y sigue siendo básica en teoría de colas: modela tiempos de servicio formados por varias fases idénticas y el tiempo hasta acumular cierto número de eventos.

## Definición

:::definicion[Distribución de Erlang]
Sean $E_1, \dots, E_k$ variables independientes con distribución $\operatorname{Exp}(\lambda)$ y $k$ entero positivo. La suma $T = E_1 + \dots + E_k$ tiene **distribución de Erlang**, $T \sim \operatorname{Erlang}(k, \lambda)$, con densidad
$$
f(t) = \frac{\lambda^{k} t^{k - 1} e^{-\lambda t}}{(k - 1)!}, \qquad t \ge 0.
$$
:::

Equivale a $\operatorname{Gamma}(k, \lambda)$ con forma entera. Su función de distribución tiene forma cerrada gracias a la relación con la Poisson:
$$
P(T \le t) = 1 - \sum_{j=0}^{k-1} e^{-\lambda t}\frac{(\lambda t)^{j}}{j!}.
$$

:::nota[Qué representa la variable]
$T$ = el tiempo hasta la llegada número $k$ cuando las llegadas ocurren a una tasa constante.
:::

:::nota[Qué hace cada parámetro]
- **$k$, número de llegadas:** cuántas esperas exponenciales se suman. Si aumenta, la curva se vuelve más simétrica y la espera crece.
- **$\lambda$, tasa:** cuántas llegadas ocurren por unidad de tiempo. Si aumenta, las esperas se acortan y la curva se comprime hacia el cero.
:::

:::nota[Qué significa cada símbolo]
- $T$: tiempo hasta la llegada número $k$.
- $E_i$: espera entre la llegada $i - 1$ y la $i$.
- $k$: número de llegadas o etapas, entero positivo.
- $\lambda$: tasa de llegadas por unidad de tiempo.
- $(k - 1)!$: factorial de $k - 1$.
- $j$: número de llegadas en $[0, t]$ en la suma.
:::

## Cómo usar la visualización

La pestaña Distribución muestra la densidad de Erlang, la región elegida y su probabilidad; los casos cargan la primera, la tercera y la décima llamada, y el ejemplo de la ficha se carga con su botón. La pestaña Ver cómo surge muestra las llegadas numeradas en una línea de tiempo hasta la llegada número $k$.

Con $k = 3$ la media es $k/\lambda = 1.5$ minutos y casi nunca se completan las tres llamadas antes de 0.2 minutos. Al pasar al caso de la décima llamada, la desviación relativa baja a $1/\sqrt{10} \approx 0.32$ y la forma se vuelve casi simétrica.

## Ejemplo

Las llamadas llegan a razón de $\lambda = 2$ por minuto y $T$ es el tiempo hasta la tercera, $T \sim \operatorname{Erlang}(3, 2)$.

1. Media y varianza: $\mathbb{E}[T] = 3/2 = 1.5$ minutos y $\operatorname{Var}(T) = 3/4$.
2. Probabilidad de completar tres llamadas en el primer minuto: equivale a que en 1 minuto lleguen al menos tres llamadas, con $N \sim \operatorname{Poisson}(2)$: $P(T \le 1) = 1 - e^{-2}(1 + 2 + 2) = 1 - 5e^{-2} \approx 0.323$.
3. Probabilidad de esperar más de 2 minutos: con $N \sim \operatorname{Poisson}(4)$, $P(T > 2) = P(N \le 2) = e^{-4}(1 + 4 + 8) \approx 0.238$.

:::figura[Erlang(3, 2): el área sombreada hasta 1 minuto vale 0.323, la misma probabilidad de que en un minuto lleguen al menos tres llamadas.]{componente="DistributionExplorer"}
```yaml
distribucion: erlang
valores:
  k: 3
  lambda: 2
ejemplo:
  titulo: 'Tres llamadas en un minuto'
  contexto: 'Un conmutador recibe llamadas al azar con tasa 2 por minuto.'
  pregunta: '¿Qué probabilidad hay de que la tercera llamada llegue antes de 1 minuto?'
  valores: {k: 3, lambda: 2}
  region: izquierda
  desde: 1
region: izquierda
desde: 1
muestras: false
```
:::

:::figura[La dualidad con la Poisson: en un minuto con tasa 2, las barras de 3 en adelante suman 0.323.]{componente="DistributionExplorer"}
```yaml
distribucion: poisson
valores:
  lambda: 2
desde: 3
hasta: 15
muestras: false
```
:::

## Propiedades

- **Media y varianza:** $\mathbb{E}[T] = k/\lambda$ y $\operatorname{Var}(T) = k/\lambda^{2}$.
- **Moda:** $(k - 1)/\lambda$.
- **Dualidad con la Poisson:** $P(T_k \le t) = P(N(t) \ge k)$, donde $N(t) \sim \operatorname{Poisson}(\lambda t)$ cuenta las llegadas en $[0, t]$.
- **Suma:** $\operatorname{Erlang}(k_1, \lambda) + \operatorname{Erlang}(k_2, \lambda) = \operatorname{Erlang}(k_1 + k_2, \lambda)$ para sumandos independientes.
- **Concentración:** el coeficiente de variación es $1/\sqrt{k}$; más etapas significan una espera más predecible en términos relativos.
- **Límite normal:** para $k$ grande, $T \approx \mathcal{N}(k/\lambda, k/\lambda^{2})$.

:::figura[Tres casos con contexto (primera llamada, tercera llamada, décima llamada): cada botón carga los parámetros y una frase explica por qué la forma es así.]{componente="DistributionExplorer"}
```yaml
distribucion: erlang
valores:
  k: 3
  lambda: 2
casos:
  - nombre: 'Primera llamada'
    descripcion: 'Con k = 1 la Erlang es la exponencial: lo más probable es esperar muy poco.'
    valores: {k: 1, lambda: 2}
  - nombre: 'Tercera llamada'
    descripcion: 'k = 3 y λ = 2: casi nunca se juntan tres llamadas en muy poco tiempo, así que la densidad empieza en cero.'
    valores: {k: 3, lambda: 2}
  - nombre: 'Décima llamada'
    descripcion: 'k = 10: la espera es la suma de diez exponenciales y ya parece una campana alrededor de 5 minutos.'
    valores: {k: 10, lambda: 2}
```
:::

:::figura[Con una sola etapa la Erlang es la exponencial: la espera de la primera llamada tiene su máximo en cero.]{componente="ContinuousGenesis"}
```yaml
proceso: llegadas
valores:
  lambda: 2
  k: 1
unidad: primera llamada, tasa 2 por minuto
```
:::

:::figura[Con 12 etapas la espera es mucho más predecible: Erlang(12, 2) tiene media 6 y coeficiente de variación 0.29.]{componente="ContinuousGenesis"}
```yaml
proceso: llegadas
valores:
  lambda: 2
  k: 12
unidad: duodécima llamada, tasa 2 por minuto
```
:::

## Errores comunes

- **Multiplicar la espera exponencial por k y conservar la forma.** $kE_1$ tiene la misma media que la Erlang, pero varianza $k^{2}/\lambda^{2}$, $k$ veces mayor, y forma exponencial.
- **Usar k no entero.** La Erlang exige un número entero de etapas; con forma real se habla de la gamma.
- **Olvidar que las etapas deben tener la misma tasa.** Si las fases tienen tasas distintas la suma es hipoexponencial, no Erlang.
- **Confundir la llegada k con el conteo.** La Erlang es un tiempo; el número de llegadas en un tiempo fijo es Poisson.

:::figura[Erlang(3, 2) (curva) frente a 3 veces una exponencial, que es Exp(2/3) (línea punteada): igual media de 1.5, pero la segunda tiene mucha más masa en esperas cortas y largas.]{componente="DistributionExplorer"}
```yaml
distribucion: erlang
valores:
  k: 3
  lambda: 2
dominio: [0, 8]
muestras: false
referencia:
  distribucion: exponencial
  valores:
    lambda: 0.667
  etiqueta: Tres veces una exponencial
```
:::

## Conexiones

La Erlang es la [[distribucion-gamma]] con forma entera y la suma de esperas de la [[distribucion-exponencial]]. Su función de distribución se escribe con la [[distribucion-de-poisson]], que cuenta las llegadas en un intervalo. La [[propiedad-de-perdida-de-memoria]] de cada etapa es la razón de que los tramos sean independientes. Con tasa $1/2$ y forma $k/2$, la gamma correspondiente es la [[distribucion-chi-cuadrada]]. El [[mapa-de-relaciones-entre-distribuciones]] la sitúa entre las demás distribuciones.

## Formulario

:::formula[Densidad]
$$
f(t) = \frac{\lambda^{k} t^{k - 1} e^{-\lambda t}}{(k - 1)!}, \qquad t \ge 0
$$

- $k$: número de etapas o llegadas.
- $\lambda$: tasa.
:::

:::formula[Función de distribución]
$$
P(T \le t) = 1 - \sum_{j=0}^{k-1} e^{-\lambda t}\frac{(\lambda t)^{j}}{j!}
$$

- $j$: posibles conteos menores que $k$.
:::

:::formula[Dualidad con la Poisson]
$$
P(T_k \le t) = P(N(t) \ge k), \qquad N(t) \sim \operatorname{Poisson}(\lambda t)
$$

- $N(t)$: número de llegadas en $[0, t]$.
:::

:::formula[Media, varianza y moda]
$$
\mathbb{E}[T] = \frac{k}{\lambda}, \qquad \operatorname{Var}(T) = \frac{k}{\lambda^{2}}, \qquad \operatorname{moda} = \frac{k - 1}{\lambda}
$$

- Coeficiente de variación: $1/\sqrt{k}$.
:::
