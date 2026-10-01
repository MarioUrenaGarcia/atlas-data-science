---
id: distribucion-gamma
titulo: Distribución gamma
titulo_en: Gamma distribution
alias:
  - gamma
  - Gamma(α, β)
modulo: 2
submodulo: '2.2'
orden: 7
nivel: basico
prerrequisitos:
  - distribucion-exponencial
  - funcion-gamma
relaciones:
  - tipo: generaliza
    id: distribucion-exponencial
etiquetas:
  - distribución continua
  - forma y tasa
  - asimetría positiva
  - sumas de exponenciales
resumen: >
  Familia de distribuciones positivas con forma α y tasa β. Con α entero describe la espera hasta el
  evento número α de un proceso de Poisson; con α real modela cantidades positivas asimétricas.
formula: 'f(x) = \frac{\beta^{\alpha}}{\Gamma(\alpha)}\, x^{\alpha - 1} e^{-\beta x}, \quad x > 0'
visualizacion:
  componente: DistributionStudio
  parametros:
    explorador:
      distribucion: gamma
      valores:
        alpha: 2
        beta: 2
      casos:
        - nombre: 'Forma 1'
          descripcion: 'Con α = 1 la gamma es una exponencial: densidad máxima en cero.'
          valores: {alpha: 1, beta: 1}
        - nombre: 'Lluvia mensual'
          descripcion: 'α = 2 y β = 2: valores positivos con moda en 0.5, media en 1 y cola larga a la derecha.'
          valores: {alpha: 2, beta: 2}
        - nombre: 'Nueve reparaciones'
          descripcion: 'Tiempo total de 9 reparaciones de media 1/3 cada una: α = 9, β = 3, ya casi simétrica.'
          valores: {alpha: 9, beta: 3}
      ejemplo:
        titulo: 'Mes muy lluvioso'
        contexto: 'La precipitación mensual, en cientos de milímetros, sigue una gamma con forma 2 y tasa 2.'
        pregunta: '¿Qué probabilidad hay de un mes con más de 200 mm?'
        valores: {alpha: 2, beta: 2}
        region: derecha
        desde: 2
    genesis:
      componente: ContinuousGenesis
      parametros:
        proceso: llegadas
        valores:
          lambda: 1
          k: 4
referencias:
  - clave: blitzstein-hwang
    capitulo: '8'
  - clave: casella-berger
    capitulo: '3'
publicado: true
---

## Intuición

La cantidad de lluvia que cae en un mes de temporada seca nunca es negativa, suele ser moderada y de vez en cuando es mucho mayor que lo habitual. Ese patrón, valores positivos con una cola larga a la derecha, es exactamente lo que describe la familia gamma. Sus dos parámetros permiten ajustar la forma de la asimetría y la escala de los valores.

El origen más claro de la gamma es la suma de esperas exponenciales. Si los eventos llegan al azar con cierta tasa, la espera hasta el tercer evento es la suma de tres esperas exponenciales independientes, y su distribución es gamma con forma 3. Con forma 1 se recupera la exponencial; al crecer la forma, la distribución se aleja del cero y se vuelve más simétrica, hasta parecerse a una normal.

La gamma admite formas no enteras, que ya no se interpretan como un número de eventos, y entonces sirve como modelo flexible para tiempos, montos de reclamaciones de seguros, precipitación o concentraciones. También es la distribución de la que derivan la chi-cuadrada y, en estadística bayesiana, la distribución inicial más usada para tasas y precisiones.

## Definición

:::definicion[Distribución gamma]
Una variable aleatoria $X$ tiene **distribución gamma** con forma $\alpha > 0$ y tasa $\beta > 0$, $X \sim \operatorname{Gamma}(\alpha, \beta)$, si su densidad es
$$
f(x) = \frac{\beta^{\alpha}}{\Gamma(\alpha)}\, x^{\alpha - 1} e^{-\beta x}, \qquad x > 0,
$$
donde $\Gamma(\alpha) = \int_{0}^{\infty} t^{\alpha - 1}e^{-t}\,dt$ es la función gamma.
:::

Otra parametrización usa la escala $\theta = 1/\beta$: $f(x) = \frac{1}{\Gamma(\alpha)\theta^{\alpha}} x^{\alpha - 1}e^{-x/\theta}$. Conviene revisar cuál usa cada texto o programa.

:::nota[Qué significa cada símbolo]
- $X$: cantidad positiva.
- $\alpha$: parámetro de forma.
- $\beta$: tasa; $\theta = 1/\beta$ es la escala.
- $\Gamma(\alpha)$: función gamma, que generaliza el factorial: $\Gamma(n) = (n - 1)!$.
- $x^{\alpha - 1}$: controla el comportamiento cerca de cero.
- $e^{-\beta x}$: controla la cola derecha.
- $t$: variable de integración.
:::

## Cómo usar la visualización

La pestaña Distribución muestra la densidad gamma con forma $\alpha$ y tasa $\beta$, la región elegida y su probabilidad. Los casos recorren la forma: exponencial, sesgada y casi simétrica; el ejemplo de la ficha se carga con su botón. La pestaña Ver cómo surge suma esperas exponenciales hasta la cuarta llegada, que es una gamma con forma 4.

Con $\alpha < 1$ la densidad se dispara en el cero; con $\alpha = 1$ es exponencial. Al subir $\alpha$ con la media fija, la curva se angosta: la desviación relativa es $1/\sqrt{\alpha}$.

## Ejemplo

La precipitación de un mes, medida en cientos de milímetros, sigue $\operatorname{Gamma}(2, 2)$.

1. Media: $\alpha/\beta = 1$, es decir, 100 mm; varianza: $\alpha/\beta^{2} = 0.5$.
2. Probabilidad de un mes con más de 200 mm: para $\alpha = 2$, $P(X > x) = e^{-\beta x}(1 + \beta x)$, así que $P(X > 2) = e^{-4}(1 + 4) \approx 0.0916$.
3. Cuantil 0.9: alrededor de 1.94, es decir, 194 mm; uno de cada diez meses llueve más que eso.
4. La moda, el valor más frecuente, es $(\alpha - 1)/\beta = 0.5$, mitad de la media: la asimetría separa ambos valores.

:::figura[Gamma(2, 2): el área sombreada de 2 en adelante vale 0.0916; la moda está en 0.5 y la media en 1.]{componente="DistributionExplorer"}
```yaml
distribucion: gamma
valores:
  alpha: 2
  beta: 2
ejemplo:
  titulo: 'Mes muy lluvioso'
  contexto: 'La precipitación mensual, en cientos de milímetros, sigue una gamma con forma 2 y tasa 2.'
  pregunta: '¿Qué probabilidad hay de un mes con más de 200 mm?'
  valores: {alpha: 2, beta: 2}
  region: derecha
  desde: 2
region: derecha
desde: 2
muestras: false
```
:::

## Propiedades

- **Media y varianza:** $\mathbb{E}[X] = \alpha/\beta$ y $\operatorname{Var}(X) = \alpha/\beta^{2}$.
- **Moda:** $(\alpha - 1)/\beta$ si $\alpha \ge 1$; si $\alpha < 1$ la densidad es máxima en el cero.
- **Suma:** si $X_i \sim \operatorname{Gamma}(\alpha_i, \beta)$ son independientes con la misma tasa, $\sum X_i \sim \operatorname{Gamma}(\sum \alpha_i, \beta)$.
- **Casos particulares:** $\operatorname{Gamma}(1, \lambda) = \operatorname{Exp}(\lambda)$; $\operatorname{Gamma}(k, \lambda)$ con $k$ entero es la Erlang; $\operatorname{Gamma}(k/2, 1/2) = \chi^{2}_{k}$.
- **Escala:** si $X \sim \operatorname{Gamma}(\alpha, \beta)$ y $c > 0$, $cX \sim \operatorname{Gamma}(\alpha, \beta/c)$.
- **Forma límite:** para $\alpha$ grande, $X \approx \mathcal{N}(\alpha/\beta, \alpha/\beta^{2})$.

:::figura[Tres casos con contexto (forma 1, lluvia mensual, nueve reparaciones): cada botón carga los parámetros y una frase explica por qué la forma es así.]{componente="DistributionExplorer"}
```yaml
distribucion: gamma
valores:
  alpha: 2
  beta: 2
casos:
  - nombre: 'Forma 1'
    descripcion: 'Con α = 1 la gamma es una exponencial: densidad máxima en cero.'
    valores: {alpha: 1, beta: 1}
  - nombre: 'Lluvia mensual'
    descripcion: 'α = 2 y β = 2: valores positivos con moda en 0.5, media en 1 y cola larga a la derecha.'
    valores: {alpha: 2, beta: 2}
  - nombre: 'Nueve reparaciones'
    descripcion: 'Tiempo total de 9 reparaciones de media 1/3 cada una: α = 9, β = 3, ya casi simétrica.'
    valores: {alpha: 9, beta: 3}
```
:::

:::figura[Suma de exponenciales: el tiempo hasta la cuarta llegada, con tasa 1, es Gamma(4, 1). Cada espera exponencial se suma a la anterior.]{componente="ContinuousGenesis"}
```yaml
proceso: llegadas
valores:
  lambda: 1
  k: 4
```
:::

:::figura[Forma menor que 1: con α = 0.5 la densidad es infinita en cero y decrece; con la misma tasa, la exponencial (línea punteada) parte de una altura finita.]{componente="DistributionExplorer"}
```yaml
distribucion: gamma
valores:
  alpha: 0.5
  beta: 1
dominio: [0, 5]
muestras: false
referencia:
  distribucion: exponencial
  valores:
    lambda: 1
  etiqueta: Exponencial, α = 1
```
:::

:::figura[Forma grande: Gamma(10, 4) tiene media 2.5 y es casi simétrica; la normal de la misma media y varianza (línea punteada) ya la sigue de cerca.]{componente="DistributionExplorer"}
```yaml
distribucion: gamma
valores:
  alpha: 10
  beta: 4
muestras: false
referencia:
  distribucion: normal
  valores:
    mu: 2.5
    sigma: 0.79
  etiqueta: Normal de media 2.5 y desviación 0.79
```
:::

## Errores comunes

- **Confundir tasa con escala.** $\operatorname{Gamma}(2, 2)$ tiene media 1 con tasa 2, pero media 4 si el 2 es la escala.
- **Pensar que la forma solo puede ser entera.** La forma entera tiene la interpretación de número de eventos, pero cualquier $\alpha > 0$ es válido.
- **Sumar gammas con tasas distintas como si fueran gamma.** La propiedad de suma exige la misma tasa; con tasas diferentes la suma no es gamma.
- **Tomar la media como valor típico.** Con forma pequeña la media supera claramente a la moda y a la mediana.

:::figura[Tasa frente a escala: Gamma(2, tasa 2) (curva) tiene media 1, mientras que Gamma(2, tasa 0.5), es decir escala 2 (línea punteada), tiene media 4.]{componente="DistributionExplorer"}
```yaml
distribucion: gamma
valores:
  alpha: 2
  beta: 2
dominio: [0, 12]
muestras: false
referencia:
  distribucion: gamma
  valores:
    alpha: 2
    beta: 0.5
  etiqueta: Gamma con escala 2
```
:::

## Conexiones

La gamma generaliza la [[distribucion-exponencial]] y, con forma entera, coincide con la [[distribucion-de-erlang]]. Su normalización es la [[funcion-gamma]]. La [[distribucion-chi-cuadrada]] es una gamma con tasa 1/2, y el cociente $X/(X + Y)$ de dos gammas independientes con la misma tasa sigue una [[distribucion-beta]]. El inverso de una gamma da la [[distribucion-gamma-inversa]]. Cuando la tasa de una [[distribucion-de-poisson]] es gamma, el conteo resultante es una [[distribucion-binomial-negativa]].

## Formulario

:::formula[Densidad]
$$
f(x) = \frac{\beta^{\alpha}}{\Gamma(\alpha)}\, x^{\alpha - 1} e^{-\beta x}, \qquad x > 0
$$

- $\alpha$: forma.
- $\beta$: tasa.
- $\Gamma$: función gamma.
:::

:::formula[Media, varianza y moda]
$$
\mathbb{E}[X] = \frac{\alpha}{\beta}, \qquad \operatorname{Var}(X) = \frac{\alpha}{\beta^{2}}, \qquad \operatorname{moda} = \frac{\alpha - 1}{\beta}\ (\alpha \ge 1)
$$

- La moda es 0 cuando $\alpha < 1$.
:::

:::formula[Suma con la misma tasa]
$$
\sum_{i} \operatorname{Gamma}(\alpha_i, \beta) \sim \operatorname{Gamma}\Big(\sum_{i}\alpha_i, \beta\Big)
$$

- Los sumandos deben ser independientes.
:::

:::formula[Función gamma]
$$
\Gamma(\alpha) = \int_{0}^{\infty} t^{\alpha - 1}e^{-t}\,dt, \qquad \Gamma(n) = (n - 1)!
$$

- $t$: variable de integración.
- $n$: entero positivo.
:::

:::formula[Supervivencia con forma 2]
$$
P(X > x) = e^{-\beta x}(1 + \beta x), \qquad \alpha = 2
$$

- Caso del ejemplo; en general se usa la función gamma incompleta.
:::
