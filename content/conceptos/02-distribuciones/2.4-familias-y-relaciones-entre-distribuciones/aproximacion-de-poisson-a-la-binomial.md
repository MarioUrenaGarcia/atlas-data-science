---
id: aproximacion-de-poisson-a-la-binomial
titulo: Aproximación de Poisson a la binomial
titulo_en: Poisson approximation to the binomial
alias:
  - ley de los eventos raros
  - límite de Poisson
  - teorema de Le Cam
modulo: 2
submodulo: '2.4'
orden: 10
nivel: intermedio
prerrequisitos:
  - distribucion-de-poisson
relaciones:
  - tipo: contrasta
    id: aproximacion-normal-a-la-binomial
etiquetas:
  - aproximación
  - eventos raros
  - binomial
  - Poisson
  - límite
resumen: >
  Con muchos ensayos y una probabilidad de éxito pequeña, la binomial se parece a una Poisson con
  λ = np. Explica por qué los conteos de eventos raros siguen una Poisson.
formula: '\binom{n}{k}p^{k}(1 - p)^{n - k} \;\to\; e^{-\lambda}\frac{\lambda^{k}}{k!} \qquad (n \to \infty,\ np \to \lambda)'
visualizacion:
  componente: DistributionExplorer
  parametros:
    distribucion: binomial
    valores:
      n: 500
      p: 0.004
    rangos:
      n: [1, 1000]
      p: [0.0005, 0.2]
    dominio: [0, 14]
    region: izquierda
    desde: 3
    muestras: false
    casos:
      - nombre: 'Piezas defectuosas'
        descripcion: 'n = 500 y p = 0.004, λ = 2: las barras y los puntos de la Poisson casi se enciman; la distancia entre ambas es menor que 0.001.'
        valores: {n: 500, p: 0.004}
      - nombre: 'Probabilidad no tan pequeña'
        descripcion: 'n = 20 y p = 0.1, λ = 2: misma media, pero la binomial está más concentrada; la Poisson exagera las colas.'
        valores: {n: 20, p: 0.1}
      - nombre: 'Errores tipográficos'
        descripcion: 'n = 1000 caracteres y p = 0.005, λ = 5: casi idénticas.'
        valores: {n: 1000, p: 0.005}
    referencia:
      distribucion: poisson
      enlace:
        lambda: {de: [n, p]}
      etiqueta: 'Poisson con λ = np'
      visible: true
referencias:
  - clave: ross-probabilidad
  - clave: blitzstein-hwang
publicado: true
---

## Intuición

Una línea de producción fabrica 500 piezas y cada una sale defectuosa con probabilidad 0.004. El número de defectuosas es binomial con muchos ensayos y una probabilidad minúscula. En promedio aparecen dos defectos, y casi nunca más de seis. Calcular con la binomial obliga a manejar coeficientes como $\binom{500}{3}$ y potencias como $0.996^{497}$; la Poisson con media 2 da prácticamente los mismos números con una fórmula mucho más simple.

La razón es que, cuando cada ensayo casi nunca tiene éxito, lo que importa es solo el número esperado de éxitos, $np$. Partir el tiempo o el espacio en muchísimos pedazos diminutos, cada uno con una probabilidad pequeña de contener un evento, es justamente como surge la Poisson. Por eso se le llama la ley de los eventos raros: accidentes en una carretera, errores en un texto, llamadas en un minuto o mutaciones en un gen.

La aproximación necesita que $p$ sea pequeña, no solo que $n$ sea grande. Con $p = 0.1$ la binomial tiene varianza $np(1 - p)$, claramente menor que la de la Poisson, $np$, y la diferencia se nota en las colas.

## Definición

:::teorema[Límite de Poisson]
Si $X_n \sim \operatorname{Bin}(n, p_n)$ con $np_n \to \lambda > 0$ cuando $n \to \infty$, entonces para cada $k = 0, 1, 2, \dots$
$$
P(X_n = k) \to e^{-\lambda}\frac{\lambda^{k}}{k!}.
$$
:::

Para $n$ y $p$ concretos, la cota de Le Cam controla el error en todos los eventos a la vez: la distancia de variación total cumple
$$
\sup_{A}\big|P(X \in A) - P(Y \in A)\big| \le np^{2}, \qquad X \sim \operatorname{Bin}(n, p),\ Y \sim \operatorname{Poisson}(np).
$$
Regla práctica: la aproximación es buena si $n \ge 20$ y $p \le 0.05$, o $n \ge 100$ y $np \le 10$.

:::nota[Qué es X]
$X$ = el número de éxitos raros en muchos ensayos, como las piezas defectuosas en un lote de 500.
:::

:::nota[Qué hace cada parámetro]
- **$n$, número de ensayos:** cuántas oportunidades hay de que ocurra el evento. Si aumenta con $np$ fijo, la binomial se acerca cada vez más a la Poisson.
- **$p$, probabilidad de éxito:** qué tan raro es el evento. Si aumenta con $np$ fijo, la binomial se vuelve más concentrada que la Poisson y la aproximación empeora.
:::

:::nota[Qué significa cada símbolo]
- $X_n$: binomial con $n$ ensayos y probabilidad $p_n$; $k$: número de éxitos.
- $\lambda$: límite de $np_n$, la media de la Poisson.
- $Y$: variable de Poisson con media $np$; $A$: cualquier conjunto de valores.
- $\sup_A$: máximo sobre todos los conjuntos; $np^{2}$: cota del error.
:::

## Cómo usar la visualización

Las barras son la binomial y la línea punteada con puntos es la Poisson con la misma media $np$, que sigue a los controles. La región sombreada da la probabilidad exacta de la binomial. Los casos cargan piezas defectuosas, una probabilidad no tan pequeña y errores tipográficos.

Con las piezas defectuosas observa que cada punto cae en la punta de su barra. Carga el caso con $p = 0.1$ y observa que la barra del 2 es más alta que el punto de la Poisson: la binomial está más concentrada. Mantén $np = 2$ y sube $n$ de 20 a 1000 para ver cómo se juntan.

## Ejemplo

Un lote tiene 500 piezas y cada una es defectuosa con probabilidad 0.004, independientemente. $X \sim \operatorname{Bin}(500, 0.004)$; se aproxima con $\operatorname{Poisson}(2)$.

1. $\lambda = np = 2$.
2. Ninguna defectuosa: exacta $0.996^{500} \approx 0.13479$; Poisson $e^{-2} \approx 0.13534$.
3. Como mucho tres: exacta $\approx 0.8575$; Poisson $e^{-2}(1 + 2 + 2 + 4/3) \approx 0.8571$.
4. La distancia de variación total entre ambas es $\approx 0.0009$, por debajo de la cota de Le Cam $np^{2} = 0.008$.
5. La varianza binomial es $np(1 - p) = 1.992$ y la de la Poisson 2: con $p$ tan chica son casi iguales.

:::figura[Piezas defectuosas: la región X ≤ 3 de la binomial con n = 500 y p = 0.004 vale 0.8575, y la Poisson con λ = 2 (puntos) da 0.8571.]{componente="DistributionExplorer"}
```yaml
distribucion: binomial
valores:
  n: 500
  p: 0.004
rangos:
  n: [1, 1000]
  p: [0.0005, 0.2]
dominio: [0, 10]
region: izquierda
desde: 3
muestras: false
referencia:
  distribucion: poisson
  enlace:
    lambda: {de: [n, p]}
  etiqueta: Poisson con λ = np
  visible: true
```
:::

## Propiedades

- **Misma media:** la Poisson aproximante tiene media $np$, igual a la de la binomial.
- **Varianzas:** binomial $np(1 - p)$, Poisson $np$; la razón $1 - p$ mide qué tan buena es la aproximación.
- **Cota de Le Cam:** el error total no supera $np^{2} = \lambda p$; con $\lambda$ fija, baja proporcionalmente a $p$.
- **Ensayos no idénticos:** si los ensayos tienen probabilidades $p_i$ distintas y pequeñas, el número de éxitos es aproximadamente Poisson con $\lambda = \sum p_i$, con error a lo más $\sum p_i^{2}$.
- **Derivación:** $\binom{n}{k}p^{k}(1 - p)^{n - k} = \frac{n(n - 1)\cdots(n - k + 1)}{n^{k}}\frac{\lambda^{k}}{k!}\left(1 - \frac{\lambda}{n}\right)^{n - k}$, y el primer factor tiende a 1 y el último a $e^{-\lambda}$.

:::figura[Casos con contexto (piezas defectuosas, probabilidad no tan pequeña, errores tipográficos): cada botón carga n y p, y una frase compara binomial y Poisson.]{componente="DistributionExplorer"}
```yaml
distribucion: binomial
valores:
  n: 20
  p: 0.1
rangos:
  n: [1, 1000]
  p: [0.0005, 0.2]
dominio: [0, 14]
muestras: false
casos:
  - nombre: 'Piezas defectuosas'
    descripcion: 'λ = 2 con p = 0.004: casi iguales.'
    valores: {n: 500, p: 0.004}
  - nombre: 'Probabilidad no tan pequeña'
    descripcion: 'λ = 2 con p = 0.1: la binomial más concentrada.'
    valores: {n: 20, p: 0.1}
  - nombre: 'Errores tipográficos'
    descripcion: 'λ = 5 con p = 0.005.'
    valores: {n: 1000, p: 0.005}
referencia:
  distribucion: poisson
  enlace:
    lambda: {de: [n, p]}
  etiqueta: Poisson con λ = np
  visible: true
```
:::

## Errores comunes

- **Usarla solo porque $n$ es grande.** Con $n = 1000$ y $p = 0.5$ la Poisson tiene varianza 500 y la binomial 250; la aproximación correcta es la normal.
- **Elegir λ distinto de $np$.** La Poisson aproximante debe tener la misma media que la binomial.
- **Aplicarla a eventos dependientes.** Si los defectos llegan en racimos (una máquina descalibrada daña varias piezas seguidas), el conteo tiene más varianza que una Poisson.
- **Olvidar que la Poisson no tiene máximo.** Asigna una probabilidad pequeña a valores mayores que $n$, imposibles en la binomial; con $p$ pequeña es despreciable.

:::figura[n grande no basta: con n = 60 y p = 0.2 la Poisson con λ = 12 (puntos) es mucho más ancha que la binomial, cuya varianza es 9.6.]{componente="DistributionExplorer"}
```yaml
distribucion: binomial
valores:
  n: 60
  p: 0.2
rangos:
  n: [1, 1000]
  p: [0.0005, 0.2]
dominio: [0, 30]
muestras: false
referencia:
  distribucion: poisson
  enlace:
    lambda: {de: [n, p]}
  etiqueta: Poisson con λ = np
  visible: true
```
:::

## Conexiones

Conecta la [[distribucion-binomial]] con la [[distribucion-de-poisson]] y explica el papel de la Poisson para eventos raros. Es un caso de [[convergencia-en-distribucion]] y contrasta con la [[aproximacion-normal-a-la-binomial]], que se usa cuando $np$ y $n(1 - p)$ son grandes. El mismo límite, aplicado a llegadas en el tiempo, da el proceso de Poisson. El [[mapa-de-relaciones-entre-distribuciones]] reúne estas aproximaciones.

## Formulario

:::formula[Límite de Poisson]
$$
\binom{n}{k}p^{k}(1 - p)^{n - k} \to e^{-\lambda}\frac{\lambda^{k}}{k!}, \qquad np \to \lambda
$$

- $n$: ensayos; $p$: probabilidad de éxito; $k$: éxitos; $\lambda$: media límite.
:::

:::formula[Cota de Le Cam]
$$
\sup_{A}\big|P(X \in A) - P(Y \in A)\big| \le np^{2}
$$

- $X$: binomial; $Y$: Poisson con media $np$; $A$: conjunto de valores.
:::

:::formula[Ensayos con probabilidades distintas]
$$
\lambda = \sum_{i=1}^{n} p_i, \qquad \text{error} \le \sum_{i=1}^{n} p_i^{2}
$$

- $p_i$: probabilidad de éxito del ensayo $i$.
:::

:::formula[Varianzas]
$$
\operatorname{Var}_{\text{bin}} = np(1 - p), \qquad \operatorname{Var}_{\text{Poisson}} = np
$$

- Su cociente $1 - p$ mide la calidad de la aproximación.
:::
