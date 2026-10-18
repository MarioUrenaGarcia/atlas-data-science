---
id: familia-exponencial
titulo: Familia exponencial
titulo_en: Exponential family
alias:
  - familias exponenciales
  - forma exponencial
  - forma canónica
modulo: 2
submodulo: '2.4'
orden: 1
nivel: intermedio
prerrequisitos:
  - distribucion-de-poisson
  - distribucion-normal
relaciones:
  - tipo: relacionado
    id: estadisticos-suficientes-naturales-y-parametros-naturales
  - tipo: relacionado
    id: distribuciones-conjugadas
etiquetas:
  - familia exponencial
  - parámetro natural
  - función de partición
  - suficiencia
  - modelos lineales generalizados
resumen: >
  Familia de distribuciones cuya densidad se escribe como h(x) exp(η T(x) - A(η)). Incluye la Bernoulli,
  la Poisson, la normal y la exponencial, y la derivada de A da la media del estadístico T.
formula: 'p(x \mid \eta) = h(x)\exp\!\big(\eta\,T(x) - A(\eta)\big), \qquad A''(\eta) = \mathbb{E}[T(X)], \quad A''''(\eta) = \operatorname{Var}(T(X))'
visualizacion:
  componente: FamilyLab
  parametros:
    modo: exponencial
    familia: poisson
    valores:
      eta: 1.1
    casos:
      - nombre: 'Llegadas a urgencias'
        descripcion: 'η = 1.1, es decir, λ = e^1.1 ≈ 3 pacientes por hora: la pendiente de A en ese punto es justo 3, la media.'
        valores: {eta: 1.1}
      - nombre: 'Eventos raros'
        descripcion: 'η = -1: λ ≈ 0.37; A(η) = e^η es casi plana y la masa se concentra en el cero.'
        valores: {eta: -1}
      - nombre: 'Conteos grandes'
        descripcion: 'η = 2.5: λ ≈ 12; la curva A se empina y con ella crecen la media y la varianza.'
        valores: {eta: 2.5}
referencias:
  - clave: casella-berger
  - clave: bishop
  - clave: wasserman
publicado: true
---

## Intuición

La Bernoulli, la binomial, la Poisson, la normal, la exponencial, la gamma y la beta parecen distribuciones sin nada en común. Sin embargo, todas se pueden escribir con el mismo molde: una parte que depende solo del dato, una exponencial de un parámetro por una función del dato y un término que normaliza. Esa forma común es la familia exponencial.

El molde tiene consecuencias prácticas. Toda la información que los datos aportan sobre el parámetro queda en una suma simple, el estadístico suficiente: el número de éxitos, el total de los conteos, la suma de las mediciones. La función que normaliza, llamada función de partición logarítmica, guarda los momentos: su pendiente es la media del estadístico y su curvatura es la varianza. Como esa función es convexa, la verosimilitud tiene un único máximo y los estimadores se obtienen igualando la media teórica con la observada.

Por eso la familia exponencial es la base de los modelos lineales generalizados, de las distribuciones conjugadas en estadística bayesiana y de muchos algoritmos de aprendizaje automático. Reconocer que una distribución pertenece a ella da acceso a todas esas herramientas a la vez.

## Definición

:::definicion[Familia exponencial de un parámetro]
Una familia de distribuciones es una **familia exponencial** si su densidad o función de masa se escribe
$$
p(x \mid \eta) = h(x)\exp\!\big(\eta\,T(x) - A(\eta)\big),
$$
donde $h(x) \ge 0$ no depende de $\eta$, $T(x)$ es el **estadístico suficiente**, $\eta$ es el **parámetro natural** y
$$
A(\eta) = \log \int h(x)\,e^{\eta T(x)}\,dx
$$
es la **función de partición logarítmica**, que hace que la distribución sume uno. El conjunto de $\eta$ donde $A(\eta)$ es finita es el espacio natural de parámetros.
:::

Con varios parámetros se escribe $\boldsymbol{\eta}^{\top}\mathbf{T}(x)$ en lugar de $\eta\,T(x)$. Algunos ejemplos:

- **Bernoulli:** $\eta = \log\frac{p}{1 - p}$, $T(x) = x$, $A(\eta) = \log(1 + e^{\eta})$.
- **Poisson:** $\eta = \log\lambda$, $T(x) = x$, $h(x) = 1/x!$, $A(\eta) = e^{\eta}$.
- **Normal con varianza 1:** $\eta = \mu$, $T(x) = x$, $h(x) = e^{-x^{2}/2}/\sqrt{2\pi}$, $A(\eta) = \eta^{2}/2$.
- **Exponencial:** $\eta = -\lambda$, $T(x) = x$, $A(\eta) = -\log(-\eta)$.

:::nota[Qué es X]
$X$ = una observación de cualquier distribución de la familia, por ejemplo el número de pacientes que llegan a urgencias en una hora.
:::

:::nota[Qué hace cada parámetro]
- **$\eta$, parámetro natural:** la coordenada en la que la familia es lineal. Si aumenta, la distribución se desplaza hacia valores mayores de $T(X)$, porque $A'(\eta)$ es creciente.
- **$A(\eta)$, función de partición:** no se elige; queda determinada por $h$ y $T$. Su pendiente es la media y su curvatura la varianza.
:::

:::nota[Qué significa cada símbolo]
- $p(x \mid \eta)$: densidad o masa de $x$ dado el parámetro.
- $h(x)$: medida base, la parte que solo depende del dato.
- $T(x)$: estadístico suficiente; $\eta$: parámetro natural.
- $A(\eta)$: función de partición logarítmica; $A'$, $A''$: sus derivadas.
- $p$, $\lambda$, $\mu$: parámetros usuales de la Bernoulli, la Poisson o la exponencial y la normal.
- $\boldsymbol{\eta}$, $\mathbf{T}$: versiones vectoriales con varios parámetros.
:::

## Cómo usar la visualización

A la izquierda está la distribución para el parámetro natural elegido; a la derecha, la función $A(\eta)$ con su tangente en ese punto. La pendiente de la tangente es la media de $T(X)$ y aparece en el panel junto con la curvatura, que es la varianza, y el parámetro usual. Los casos cargan llegadas a urgencias, eventos raros y conteos grandes.

Mueve $\eta$ hacia la derecha y observa que la tangente se empina al mismo tiempo que la masa se corre a la derecha. Con $\eta = \log 3 \approx 1.1$ comprueba que la pendiente es 3, la media de la Poisson. Observa que $A$ siempre es convexa: nunca se dobla hacia abajo.

## Ejemplo

El número de pacientes que llegan a urgencias en una hora es Poisson con $\lambda = 3$. Se reescribe en forma de familia exponencial.

1. La masa es $P(X = x) = \frac{\lambda^{x}e^{-\lambda}}{x!} = \frac{1}{x!}\exp(x\log\lambda - \lambda)$.
2. Se identifica $h(x) = 1/x!$, $T(x) = x$, $\eta = \log\lambda = \log 3 \approx 1.099$ y $A(\eta) = e^{\eta}$.
3. Media: $A'(\eta) = e^{\eta} = 3$. Varianza: $A''(\eta) = e^{\eta} = 3$. La igualdad de media y varianza de la Poisson sale de que $A$ es su propia derivada.
4. Con 5 horas observadas y $\sum x_i = 17$, la log verosimilitud es $\eta\sum x_i - 5A(\eta) + \text{constante}$; su derivada se anula cuando $A'(\hat{\eta}) = 17/5$, es decir, $\hat{\lambda} = 3.4$.
5. El estimador de máxima verosimilitud iguala la media teórica del estadístico con su promedio observado, una regla que vale para toda la familia.

:::figura[Llegadas a urgencias: con η = log 3 la masa de la Poisson se centra en 3 y la tangente de A tiene pendiente 3.]{componente="FamilyLab"}
```yaml
modo: exponencial
familia: poisson
valores:
  eta: 1.1
```
:::

## Propiedades

- **Momentos desde A:** $\mathbb{E}[T(X)] = A'(\eta)$ y $\operatorname{Var}(T(X)) = A''(\eta)$; en general, las derivadas de $A$ son los cumulantes de $T(X)$.
- **Convexidad:** $A$ es convexa porque su segunda derivada es una varianza; por eso la log verosimilitud es cóncava en $\eta$ y tiene a lo sumo un máximo.
- **Máxima verosimilitud:** el estimador cumple $A'(\hat{\eta}) = \frac{1}{n}\sum_i T(x_i)$.
- **Suficiencia:** para una muestra, $\sum_i T(x_i)$ es suficiente para $\eta$.
- **Conjugación:** toda familia exponencial tiene una familia de distribuciones a priori conjugadas.
- **Máxima entropía:** entre las distribuciones con $\mathbb{E}[T(X)]$ fija, la de familia exponencial es la de mayor entropía respecto a $h$.

:::figura[Casos con contexto (llegadas a urgencias, eventos raros, conteos grandes): cada botón carga el parámetro natural y una frase explica la relación con la media.]{componente="FamilyLab"}
```yaml
modo: exponencial
familia: poisson
valores:
  eta: 0
casos:
  - nombre: 'Llegadas a urgencias'
    descripcion: 'η = 1.1: media 3.'
    valores: {eta: 1.1}
  - nombre: 'Eventos raros'
    descripcion: 'η = -1: media 0.37.'
    valores: {eta: -1}
  - nombre: 'Conteos grandes'
    descripcion: 'η = 2.5: media 12.2.'
    valores: {eta: 2.5}
```
:::

:::figura[Bernoulli en forma natural: η es el logaritmo de los momios; con η = 0, p = 0.5 y la pendiente de A = log(1 + e^η) es 0.5.]{componente="FamilyLab"}
```yaml
modo: exponencial
familia: bernoulli
valores:
  eta: 0
```
:::

:::figura[Normal con varianza 1: A(η) = η²/2 es una parábola; su pendiente es la media y su curvatura, siempre 1, la varianza.]{componente="FamilyLab"}
```yaml
modo: exponencial
familia: normal
valores:
  eta: 1
```
:::

:::figura[Exponencial: con η = -λ, A(η) = -log(-η) y su pendiente -1/η es la espera media; con η = -0.5 la media es 2.]{componente="FamilyLab"}
```yaml
modo: exponencial
familia: exponencial
valores:
  eta: -0.5
```
:::

## Errores comunes

- **Confundir el parámetro natural con el usual.** En la Bernoulli el natural es el logaritmo de los momios, no $p$; en la exponencial es $-\lambda$.
- **Pensar que toda distribución es de familia exponencial.** La uniforme en $[0, \theta]$, la Cauchy y las mezclas no lo son: su soporte depende del parámetro o su densidad no tiene la forma pedida.
- **Olvidar el término $A(\eta)$.** Sin él la densidad no suma uno; es la pieza que guarda los momentos.
- **Creer que $h(x)$ afecta la estimación.** Como no depende del parámetro, desaparece al derivar la log verosimilitud.

:::figura[El soporte importa: la uniforme en [0, θ] no es familia exponencial porque el intervalo donde la densidad es positiva cambia con θ; aquí, con b = 4, la densidad vale 0 fuera de [0, 4].]{componente="DistributionExplorer"}
```yaml
distribucion: uniforme
valores:
  a: 0
  b: 4
dominio: [-1, 6]
muestras: false
```
:::

## Conexiones

La familia incluye la [[distribucion-de-bernoulli]], la [[distribucion-de-poisson]], la [[distribucion-normal]], la [[distribucion-exponencial]], la [[distribucion-gamma]] y la [[distribucion-beta]], y se escribe con la [[funcion-exponencial-y-logaritmo-natural|función exponencial]]. Sus [[estadisticos-suficientes-naturales-y-parametros-naturales]] condensan los datos, y cada familia tiene sus [[distribuciones-conjugadas]]. Es la base de los modelos lineales generalizados, donde el parámetro natural se modela como una combinación lineal de variables. El [[mapa-de-relaciones-entre-distribuciones]] reúne estas distribuciones.

## Formulario

:::formula[Forma de familia exponencial]
$$
p(x \mid \eta) = h(x)\exp\!\big(\eta\,T(x) - A(\eta)\big)
$$

- $h(x)$: medida base; $T(x)$: estadístico suficiente.
- $\eta$: parámetro natural; $A(\eta)$: función de partición logarítmica.
:::

:::formula[Función de partición]
$$
A(\eta) = \log \int h(x)\,e^{\eta T(x)}\,dx
$$

- Con datos discretos la integral es una suma.
:::

:::formula[Momentos]
$$
A'(\eta) = \mathbb{E}[T(X)], \qquad A''(\eta) = \operatorname{Var}(T(X))
$$

- $A'$, $A''$: primera y segunda derivadas de $A$.
:::

:::formula[Poisson en forma natural]
$$
P(X = x) = \frac{1}{x!}\exp(\eta x - e^{\eta}), \qquad \eta = \log\lambda
$$

- $\lambda$: tasa; $x$: conteo.
:::

:::formula[Bernoulli en forma natural]
$$
P(X = x) = \exp\!\big(\eta x - \log(1 + e^{\eta})\big), \qquad \eta = \log\frac{p}{1 - p}
$$

- $p$: probabilidad de éxito; $\frac{p}{1-p}$: momios.
:::

:::formula[Máxima verosimilitud]
$$
A'(\hat{\eta}) = \frac{1}{n}\sum_{i=1}^{n} T(x_i)
$$

- $\hat{\eta}$: estimador; $n$: tamaño de muestra; $x_i$: observaciones.
:::
