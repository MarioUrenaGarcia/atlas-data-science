---
id: distribucion-de-gumbel
titulo: Distribución de Gumbel
titulo_en: Gumbel distribution
alias:
  - Gumbel
  - valor extremo tipo I
  - distribución de máximos
modulo: 2
submodulo: '2.2'
orden: 19
nivel: intermedio
prerrequisitos:
  - distribucion-exponencial
relaciones:
  - tipo: relacionado
    id: distribucion-de-weibull
  - tipo: relacionado
    id: distribucion-logistica
etiquetas:
  - valores extremos
  - máximos
  - periodo de retorno
  - hidrología
resumen: >
  Distribución límite del máximo de muchas variables con colas exponenciales. Se usa para máximos
  anuales de caudales, lluvias o vientos y para calcular periodos de retorno.
formula: 'F(x) = \exp\!\left(-e^{-(x - \mu)/\beta}\right)'
visualizacion:
  componente: DistributionStudio
  parametros:
    explorador:
      distribucion: gumbel
      valores:
        mu: 3
        beta: 0.8
      rangos:
        mu: [-3, 6]
        beta: [0.2, 3]
      dominio: [-3, 12]
      casos:
        - nombre: 'Caudal máximo de un río'
          descripcion: 'μ = 3 y β = 0.8 (cientos de m³/s): asimetría a la derecha, porque los años excepcionales empujan la cola hacia caudales muy altos.'
          valores: {mu: 3, beta: 0.8}
        - nombre: 'Racha máxima de viento'
          descripcion: 'μ = 5 y β = 0.5 (decenas de km/h): misma forma, más concentrada; la cola derecha sigue siendo más larga que la izquierda.'
          valores: {mu: 5, beta: 0.5}
        - nombre: 'Gumbel estándar'
          descripcion: 'μ = 0 y β = 1: el límite del máximo de muchas exponenciales menos su logaritmo; moda en 0 y media 0.577.'
          valores: {mu: 0, beta: 1}
      ejemplo:
        titulo: 'Crecida del río'
        contexto: 'El caudal máximo anual de un río, en cientos de m³/s, sigue una Gumbel con μ = 3 y β = 0.8.'
        pregunta: '¿Qué probabilidad hay de que en un año el caudal máximo supere 500 m³/s?'
        valores: {mu: 3, beta: 0.8}
        region: derecha
        desde: 5
    genesis:
      componente: ContinuousGenesis
      parametros:
        proceso: maximo
        valores:
          n: 20
referencias:
  - clave: coles
    capitulo: '3'
publicado: true
---

## Intuición

Un ingeniero que diseña un puente no se preocupa por el caudal promedio del río sino por el máximo del año, y en particular por la crecida que ocurre, en promedio, una vez cada cien años. Ese máximo resulta de comparar muchos días: es el mayor de 365 caudales diarios. Cuando se toma el máximo de muchas variables cuyas colas decaen como una exponencial, su distribución converge siempre a la misma forma, sin importar los detalles de cada día. Esa forma es la de Gumbel.

La Gumbel es asimétrica hacia la derecha: el máximo no puede ser mucho menor que lo típico, porque bastaría con un solo día alto para subirlo, pero sí puede ser mucho mayor en años excepcionales. Su cola derecha es exponencial, de modo que valores muy extremos son raros pero no imposibles.

Es una de las tres distribuciones límite de los extremos, junto con la Weibull, para variables acotadas, y la Fréchet, para colas pesadas. En hidrología, meteorología e ingeniería estructural se usa para estimar niveles de retorno: el valor que se supera en promedio una vez cada $T$ años.

## Definición

:::definicion[Distribución de Gumbel]
Una variable $X$ tiene **distribución de Gumbel** con localización $\mu$ y escala $\beta > 0$ si
$$
F(x) = \exp\!\left(-e^{-(x - \mu)/\beta}\right), \qquad f(x) = \frac{1}{\beta}e^{-z - e^{-z}}, \quad z = \frac{x - \mu}{\beta}, \quad x \in \mathbb{R}.
$$
:::

:::teorema[Máximo de exponenciales]
Si $E_1, \dots, E_n$ son $\operatorname{Exp}(1)$ independientes, entonces $\max_i E_i - \log n$ converge en distribución a la Gumbel estándar ($\mu = 0$, $\beta = 1$).
:::

:::nota[Qué es X]
$X$ = el máximo de muchas observaciones con cola ligera, como el caudal máximo anual de un río.
:::

:::nota[Qué hace cada parámetro]
- **$\mu$, localización:** la moda, el máximo más probable. Si aumenta, la curva se desliza a la derecha.
- **$\beta$, escala:** qué tan dispersos están los máximos. Si aumenta, la curva se ensancha y baja.
:::

:::nota[Qué significa cada símbolo]
- $X$: valor máximo, por ejemplo el caudal máximo anual.
- $\mu$: localización, que es la moda.
- $\beta$: escala.
- $z$: valor estandarizado.
- $F(x)$: probabilidad de que el máximo no supere $x$.
- $E_i$: exponenciales independientes; $n$: cuántas se comparan.
:::

## Cómo usar la visualización

La pestaña Distribución muestra la densidad de Gumbel, la región elegida y su probabilidad; los casos cargan caudales, vientos y la Gumbel estándar, y el ejemplo de la ficha se carga con su botón. La pestaña Ver cómo surge toma el máximo de $n$ exponenciales, le resta $\log n$ y lo acumula; la línea punteada es la Gumbel límite.

En la pestaña animada, con $n = 1$ el resultado es una exponencial desplazada y con $n = 20$ el histograma ya coincide con la Gumbel. En la vista de función de distribución, la probabilidad acumulada 0.99 da el nivel de retorno de 100 años.

## Ejemplo

El caudal máximo anual de un río, en cientos de m³/s, sigue $\operatorname{Gumbel}(3, 0.8)$.

1. Caudal máximo más probable: la moda, 300 m³/s.
2. Caudal medio: $\mu + 0.5772\beta \approx 3.46$, es decir, 346 m³/s.
3. Probabilidad de superar 500 m³/s en un año: $1 - \exp(-e^{-(5 - 3)/0.8}) = 1 - \exp(-e^{-2.5}) \approx 0.079$.
4. Nivel de retorno de 100 años, el cuantil 0.99: $\mu - \beta\log(-\log 0.99) \approx 3 + 0.8 \cdot 4.60 = 6.68$, es decir, 668 m³/s.

:::figura[Crecida del río: el área sombreada a la derecha de 5 (500 m³/s) vale 0.079. El botón carga el ejemplo.]{componente="DistributionExplorer"}
```yaml
distribucion: gumbel
valores:
  mu: 3
  beta: 0.8
rangos:
  mu: [-3, 6]
  beta: [0.2, 3]
dominio: [-3, 12]
ejemplo:
  titulo: 'Crecida del río'
  contexto: 'El caudal máximo anual de un río, en cientos de m³/s, sigue una Gumbel con μ = 3 y β = 0.8.'
  pregunta: '¿Qué probabilidad hay de que en un año el caudal máximo supere 500 m³/s?'
  valores: {mu: 3, beta: 0.8}
  region: derecha
  desde: 5
region: derecha
desde: 5
probabilidad: 0.99
muestras: false
```
:::

## Propiedades

- **Media y varianza:** $\mathbb{E}[X] = \mu + \gamma_E\beta$ con $\gamma_E \approx 0.5772$ (constante de Euler-Mascheroni) y $\operatorname{Var}(X) = \frac{\pi^{2}\beta^{2}}{6}$.
- **Moda y mediana:** moda $\mu$, mediana $\mu - \beta\log\log 2 \approx \mu + 0.367\beta$.
- **Cuantil y nivel de retorno:** $x_p = \mu - \beta\log(-\log p)$; el nivel de retorno de $T$ años es $x_{1 - 1/T}$.
- **Estabilidad bajo máximos:** el máximo de $n$ Gumbel independientes con la misma escala es Gumbel con localización $\mu + \beta\log n$.
- **Asimetría fija:** su coeficiente de asimetría es siempre 1.14, sin importar los parámetros.
- **Diferencia de Gumbel:** la diferencia de dos Gumbel independientes con la misma escala es logística.

:::figura[Tres casos con contexto (caudal, viento y Gumbel estándar): cada botón carga los parámetros y una frase explica por qué la forma es así.]{componente="DistributionExplorer"}
```yaml
distribucion: gumbel
valores:
  mu: 3
  beta: 0.8
rangos:
  mu: [-3, 6]
  beta: [0.2, 3]
dominio: [-3, 12]
casos:
  - nombre: 'Caudal máximo de un río'
    descripcion: 'μ = 3 y β = 0.8: asimetría a la derecha por los años excepcionales.'
    valores: {mu: 3, beta: 0.8}
  - nombre: 'Racha máxima de viento'
    descripcion: 'μ = 5 y β = 0.5: más concentrada, con la misma asimetría.'
    valores: {mu: 5, beta: 0.5}
  - nombre: 'Gumbel estándar'
    descripcion: 'μ = 0 y β = 1: moda en 0 y media 0.577.'
    valores: {mu: 0, beta: 1}
muestras: false
```
:::

:::figura[El máximo de 20 exponenciales menos log 20: el histograma ya sigue la Gumbel límite (línea punteada).]{componente="ContinuousGenesis"}
```yaml
proceso: maximo
valores:
  n: 20
```
:::

## Errores comunes

- **Usar una normal para máximos anuales.** La normal es simétrica y subestima los extremos altos; el nivel de 100 años sale demasiado bajo.
- **Interpretar el periodo de retorno como un calendario.** Una crecida de 100 años tiene probabilidad 0.01 cada año; puede ocurrir dos años seguidos.
- **Aplicarla a máximos de variables de cola pesada.** Si los datos diarios siguen una ley de potencia, el límite es la Fréchet, con cola mucho más pesada.
- **Confundir μ con la media.** La media es $\mu + 0.577\beta$.

:::figura[Gumbel frente a la normal con la misma media y varianza (línea punteada): la normal subestima la cola derecha, que es la que importa en el diseño.]{componente="DistributionExplorer"}
```yaml
distribucion: gumbel
valores:
  mu: 0
  beta: 1
dominio: [-4, 7]
region: derecha
desde: 4
muestras: false
referencia:
  distribucion: normal
  valores:
    mu: 0.577
    sigma: 1.283
  etiqueta: Normal de la misma media y varianza
```
:::

## Conexiones

La Gumbel es el límite del máximo de variables con colas como la [[distribucion-exponencial]]. Forma, con la [[distribucion-de-weibull]] y la [[distribucion-de-frechet]], la familia de distribuciones de valores extremos. La diferencia de dos Gumbel independientes es una [[distribucion-logistica]], hecho que sustenta los modelos de elección discreta. El [[mapa-de-relaciones-entre-distribuciones]] la sitúa entre las demás distribuciones.

## Formulario

:::formula[Distribución y densidad]
$$
F(x) = \exp\!\left(-e^{-(x - \mu)/\beta}\right), \qquad f(x) = \frac{1}{\beta}e^{-z - e^{-z}}, \quad z = \frac{x - \mu}{\beta}
$$

- $\mu$: localización.
- $\beta$: escala.
:::

:::formula[Media y varianza]
$$
\mathbb{E}[X] = \mu + \gamma_E\beta, \qquad \operatorname{Var}(X) = \frac{\pi^{2}\beta^{2}}{6}
$$

- $\gamma_E \approx 0.5772$: constante de Euler-Mascheroni.
:::

:::formula[Nivel de retorno]
$$
x_{T} = \mu - \beta\log\!\left(-\log\left(1 - \tfrac{1}{T}\right)\right)
$$

- $T$: periodo de retorno en años.
:::

:::formula[Máximo de exponenciales]
$$
\max(E_1, \dots, E_n) - \log n \to \operatorname{Gumbel}(0, 1)
$$

- $E_i \sim \operatorname{Exp}(1)$ independientes.
:::
