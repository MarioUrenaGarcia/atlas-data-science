---
id: distribucion-beta
titulo: Distribución beta
titulo_en: Beta distribution
alias:
  - beta
  - Beta(a, b)
modulo: 2
submodulo: '2.2'
orden: 12
nivel: basico
prerrequisitos:
  - distribucion-uniforme-continua
  - funcion-beta
relaciones:
  - tipo: generaliza
    id: distribucion-uniforme-continua
  - tipo: relacionado
    id: distribucion-beta-binomial
etiquetas:
  - distribución continua
  - proporciones
  - intervalo [0, 1]
  - estadísticos de orden
resumen: >
  Familia de distribuciones en el intervalo [0, 1] con dos parámetros de forma. Modela proporciones y
  probabilidades desconocidas, y describe los estadísticos de orden de muestras uniformes.
formula: 'f(x) = \frac{x^{a - 1}(1 - x)^{b - 1}}{B(a, b)}, \quad 0 < x < 1'
visualizacion:
  componente: DistributionStudio
  parametros:
    explorador:
      distribucion: beta
      valores:
        a: 3
        b: 17
      rangos:
        a: [0.2, 60]
        b: [0.2, 60]
      dominio: [0, 1]
      casos:
        - nombre: 'Sin información'
          descripcion: 'Beta(1, 1) es la uniforme: todas las proporciones son igual de plausibles antes de ver datos.'
          valores: {a: 1, b: 1}
        - nombre: 'Tasa de conversión'
          descripcion: 'Beta(3, 17): concentrada cerca de 0.15, como si se hubieran visto 3 conversiones en 20 visitas.'
          valores: {a: 3, b: 17}
        - nombre: 'Opinión polarizada'
          descripcion: 'Beta(0.5, 0.5): la masa se acumula cerca de 0 y de 1, como en temas donde casi todos están de un lado.'
          valores: {a: 0.5, b: 0.5}
      ejemplo:
        titulo: 'Conversión alta'
        contexto: 'La incertidumbre sobre la tasa de conversión de una página se describe con una Beta(3, 17).'
        pregunta: '¿Qué probabilidad hay de que la tasa real supere 0.25?'
        valores: {a: 3, b: 17}
        region: derecha
        desde: 0.25
    genesis:
      componente: ContinuousGenesis
      parametros:
        proceso: estadistico-de-orden
        valores:
          n: 6
          k: 2
referencias:
  - clave: blitzstein-hwang
    capitulo: '8'
  - clave: gelman-bda
    capitulo: '2'
publicado: true
---

## Intuición

Seis corredores de una carrera cruzan la meta en momentos aleatorios dentro de un minuto, y nos interesa el instante en que llega el segundo. No es uniforme: es más probable que caiga en la primera mitad del minuto, porque hace falta que solo uno llegue antes y cuatro después. Ese instante, el segundo menor de seis números uniformes, sigue una distribución beta.

La beta es la familia natural para cantidades entre 0 y 1: proporciones de votos, tasas de conversión, probabilidades desconocidas. Sus dos parámetros de forma, $a$ y $b$, funcionan como pesos que empujan la masa hacia el 1 o hacia el 0. Con $a = b = 1$ es la uniforme; con $a$ mayor que $b$ se carga a la derecha; con ambos grandes se concentra alrededor de $a/(a + b)$; con ambos menores que 1 toma forma de U.

En estadística bayesiana la beta describe lo que se sabe sobre una probabilidad. Si se parte de una beta y se observan éxitos y fracasos, la distribución actualizada sigue siendo beta, con los éxitos sumados a $a$ y los fracasos a $b$. Por eso $a$ y $b$ se interpretan a menudo como conteos de éxitos y fracasos previos.

## Definición

:::definicion[Distribución beta]
Una variable aleatoria $X$ tiene **distribución beta** con parámetros de forma $a > 0$ y $b > 0$, $X \sim \operatorname{Beta}(a, b)$, si su densidad es
$$
f(x) = \frac{x^{a - 1}(1 - x)^{b - 1}}{B(a, b)}, \qquad 0 < x < 1,
$$
donde $B(a, b) = \int_0^1 t^{a - 1}(1 - t)^{b - 1}\,dt = \frac{\Gamma(a)\Gamma(b)}{\Gamma(a + b)}$.
:::

:::teorema[Estadísticos de orden de uniformes]
Si $U_1, \dots, U_n$ son uniformes en $(0, 1)$ independientes y $U_{(k)}$ es el $k$-ésimo menor, entonces $U_{(k)} \sim \operatorname{Beta}(k, n - k + 1)$.
:::

:::nota[Qué significa cada símbolo]
- $X$: proporción o probabilidad entre 0 y 1.
- $a$, $b$: parámetros de forma, positivos.
- $B(a, b)$: función beta, constante de normalización.
- $\Gamma$: función gamma.
- $U_{(k)}$: el $k$-ésimo valor al ordenar $n$ uniformes de menor a mayor.
- $n$, $k$: tamaño de la muestra y posición.
:::

## Cómo usar la visualización

La pestaña Distribución muestra la densidad beta en el intervalo de 0 a 1, la región elegida y su probabilidad; los casos cargan una beta uniforme, una concentrada y una en forma de U, y el ejemplo de la ficha se carga con su botón. La pestaña Ver cómo surge ordena $n$ números uniformes y registra el que ocupa la posición $k$, que es una beta.

Al pasar de un caso a otro se ve el papel de los parámetros: $a$ empuja la masa hacia el 1 y $b$ hacia el 0. En la pestaña animada, con $k = 1$ se registra el mínimo y con $k = n$ el máximo.

## Ejemplo

Un equipo de producto representa su incertidumbre sobre la tasa de conversión de una página con $\operatorname{Beta}(3, 17)$, equivalente a haber visto 3 conversiones y 17 visitas sin conversión.

1. Tasa esperada: $\mathbb{E}[X] = 3/(3 + 17) = 0.15$.
2. Varianza: $\frac{ab}{(a + b)^{2}(a + b + 1)} = \frac{51}{400 \cdot 21} \approx 0.00607$, desviación 0.078.
3. Probabilidad de que la tasa real supere 0.25: $P(X > 0.25) \approx 0.111$.
4. Si después se observan 6 conversiones en 40 visitas, la distribución actualizada es $\operatorname{Beta}(3 + 6, 17 + 34) = \operatorname{Beta}(9, 51)$, con media 0.15 y desviación menor, 0.046.

:::figura[Beta(3, 17): el área sombreada a la derecha de 0.25 vale 0.111.]{componente="DistributionExplorer"}
```yaml
distribucion: beta
valores:
  a: 3
  b: 17
rangos:
  a: [0.2, 60]
  b: [0.2, 60]
dominio: [0, 1]
ejemplo:
  titulo: 'Conversión alta'
  contexto: 'La incertidumbre sobre la tasa de conversión de una página se describe con una Beta(3, 17).'
  pregunta: '¿Qué probabilidad hay de que la tasa real supere 0.25?'
  valores: {a: 3, b: 17}
  region: derecha
  desde: 0.25
region: derecha
desde: 0.25
muestras: false
```
:::

:::figura[Después de 6 conversiones en 40 visitas, Beta(9, 51) (curva) es más angosta que la inicial Beta(3, 17) (línea punteada), con el mismo centro.]{componente="DistributionExplorer"}
```yaml
distribucion: beta
valores:
  a: 9
  b: 51
rangos:
  a: [0.2, 60]
  b: [0.2, 60]
dominio: [0, 0.6]
muestras: false
referencia:
  distribucion: beta
  valores:
    a: 3
    b: 17
  etiqueta: Antes de los datos, Beta(3, 17)
```
:::

## Propiedades

- **Media y varianza:** $\mathbb{E}[X] = \dfrac{a}{a + b}$ y $\operatorname{Var}(X) = \dfrac{ab}{(a + b)^{2}(a + b + 1)}$.
- **Moda:** $\dfrac{a - 1}{a + b - 2}$ si $a, b > 1$.
- **Formas:** uniforme si $a = b = 1$; simétrica si $a = b$; en U si $a, b < 1$; monótona si uno de los parámetros es menor que 1 y el otro mayor.
- **Simetría:** $1 - X \sim \operatorname{Beta}(b, a)$.
- **Cociente de gammas:** si $G_1 \sim \operatorname{Gamma}(a, 1)$ y $G_2 \sim \operatorname{Gamma}(b, 1)$ son independientes, $G_1/(G_1 + G_2) \sim \operatorname{Beta}(a, b)$.
- **Conjugación con la binomial:** con datos de $s$ éxitos y $f$ fracasos, $\operatorname{Beta}(a, b)$ se actualiza a $\operatorname{Beta}(a + s, b + f)$.

:::figura[Tres casos con contexto (sin información, tasa de conversión, opinión polarizada): cada botón carga los parámetros y una frase explica por qué la forma es así.]{componente="DistributionExplorer"}
```yaml
distribucion: beta
valores:
  a: 3
  b: 17
rangos:
  a: [0.2, 60]
  b: [0.2, 60]
dominio: [0, 1]
casos:
  - nombre: 'Sin información'
    descripcion: 'Beta(1, 1) es la uniforme: todas las proporciones son igual de plausibles antes de ver datos.'
    valores: {a: 1, b: 1}
  - nombre: 'Tasa de conversión'
    descripcion: 'Beta(3, 17): concentrada cerca de 0.15, como si se hubieran visto 3 conversiones en 20 visitas.'
    valores: {a: 3, b: 17}
  - nombre: 'Opinión polarizada'
    descripcion: 'Beta(0.5, 0.5): la masa se acumula cerca de 0 y de 1, como en temas donde casi todos están de un lado.'
    valores: {a: 0.5, b: 0.5}
```
:::

:::figura[Forma de U: con a = b = 0.5 la masa se acumula cerca de 0 y de 1.]{componente="DistributionExplorer"}
```yaml
distribucion: beta
valores:
  a: 0.5
  b: 0.5
muestras: false
```
:::

:::figura[El mínimo de 5 uniformes es Beta(1, 5): decreciente, con la mayor densidad en cero.]{componente="ContinuousGenesis"}
```yaml
proceso: estadistico-de-orden
valores:
  n: 5
  k: 1
```
:::

:::figura[La mediana de 15 uniformes es Beta(8, 8): simétrica y concentrada alrededor de 0.5.]{componente="ContinuousGenesis"}
```yaml
proceso: estadistico-de-orden
valores:
  n: 15
  k: 8
```
:::

## Errores comunes

- **Confundir la media con la moda.** En $\operatorname{Beta}(3, 17)$ la media es 0.15 y la moda $2/18 \approx 0.11$.
- **Usar la beta para cantidades fuera de [0, 1].** Para modelar porcentajes hay que dividir entre 100; para otros intervalos se reescala.
- **Interpretar a y b como datos reales.** Son pseudoconteos que expresan información previa; $\operatorname{Beta}(1, 1)$ equivale a cero datos.
- **Olvidar que la densidad puede ser infinita.** Con $a < 1$ la densidad diverge en 0; no hay error en la fórmula.

:::figura[Media frente a moda: en Beta(3, 17) el cuantil 0.5 es 0.14, la media 0.15 y la moda 0.11.]{componente="DistributionExplorer"}
```yaml
distribucion: beta
valores:
  a: 3
  b: 17
rangos:
  a: [0.2, 60]
  b: [0.2, 60]
dominio: [0, 0.6]
probabilidad: 0.5
vista: acumulada
muestras: false
```
:::

## Conexiones

La beta generaliza la [[distribucion-uniforme-continua]] y su normalización es la [[funcion-beta]]. Surge como cociente de variables de la [[distribucion-gamma]] y como estadístico de orden de uniformes. Es la distribución conjugada de la [[distribucion-binomial]], y mezclar una binomial sobre una probabilidad beta da la [[distribucion-beta-binomial]]. Una transformación de la [[distribucion-f-de-snedecor]] es beta, y la [[distribucion-de-kumaraswamy]] es una alternativa con función de distribución explícita.

## Formulario

:::formula[Densidad]
$$
f(x) = \frac{x^{a - 1}(1 - x)^{b - 1}}{B(a, b)}, \qquad 0 < x < 1
$$

- $a$, $b$: parámetros de forma.
- $B(a, b)$: función beta.
:::

:::formula[Función beta]
$$
B(a, b) = \int_0^1 t^{a - 1}(1 - t)^{b - 1}\,dt = \frac{\Gamma(a)\Gamma(b)}{\Gamma(a + b)}
$$

- $\Gamma$: función gamma.
:::

:::formula[Media, varianza y moda]
$$
\mathbb{E}[X] = \frac{a}{a + b}, \qquad \operatorname{Var}(X) = \frac{ab}{(a + b)^{2}(a + b + 1)}, \qquad \operatorname{moda} = \frac{a - 1}{a + b - 2}
$$

- La moda vale para $a, b > 1$.
:::

:::formula[Estadístico de orden]
$$
U_{(k)} \sim \operatorname{Beta}(k,\ n - k + 1)
$$

- $n$: número de uniformes.
- $k$: posición al ordenarlas.
:::

:::formula[Actualización con datos binomiales]
$$
\operatorname{Beta}(a, b) \to \operatorname{Beta}(a + s,\ b + f)
$$

- $s$: éxitos observados.
- $f$: fracasos observados.
:::
