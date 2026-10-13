---
id: distribucion-de-laplace
titulo: Distribución de Laplace
titulo_en: Laplace distribution
alias:
  - Laplace
  - doble exponencial
  - exponencial bilateral
modulo: 2
submodulo: '2.2'
orden: 16
nivel: basico
prerrequisitos:
  - distribucion-exponencial
relaciones:
  - tipo: contrasta
    id: distribucion-normal
etiquetas:
  - distribución continua
  - pico agudo
  - colas exponenciales
  - mediana
resumen: >
  Distribución simétrica con un pico agudo en su centro y colas que decaen exponencialmente. Es la
  diferencia de dos exponenciales independientes y está ligada a la mediana y al error absoluto.
formula: 'f(x) = \frac{1}{2b}\exp\!\left(-\frac{|x - \mu|}{b}\right)'
visualizacion:
  componente: DistributionStudio
  parametros:
    explorador:
      distribucion: laplace
      valores:
        mu: 0
        b: 1
      casos:
        - nombre: 'Cambio de precio'
          descripcion: 'b = 1: cambios diarios casi siempre pequeños y algún salto grande; pico agudo en cero.'
          valores: {mu: 0, b: 1}
        - nombre: 'Error de medición fino'
          descripcion: 'b = 0.3: un instrumento preciso; el pico es alto y estrecho.'
          valores: {mu: 0, b: 0.3}
        - nombre: 'Diferencia de tiempos'
          descripcion: 'μ = 1 y b = 2: la diferencia entre dos tiempos de llegada con media 2, desplazada una unidad.'
          valores: {mu: 1, b: 2}
      ejemplo:
        titulo: 'Cambios grandes'
        contexto: 'El cambio diario en el precio de una acción, en pesos, sigue una Laplace con centro 0 y escala 1.'
        pregunta: '¿Qué probabilidad hay de un cambio mayor que 2 pesos en cualquier dirección?'
        valores: {mu: 0, b: 1}
        region: colas
        desde: -2
        hasta: 2
      referencia:
        distribucion: normal
        valores: {mu: 0, sigma: 1.414}
        etiqueta: 'Normal de la misma varianza'
        visible: true
    genesis:
      componente: ContinuousGenesis
      parametros:
        proceso: diferencia-exponenciales
        valores:
          mu: 0
          b: 1
referencias:
  - clave: wasserman
    capitulo: '2'
  - clave: hastie-esl
    capitulo: '3'
publicado: true
---

## Intuición

Dos corredores salen al mismo tiempo y sus tiempos de llegada tienen la misma distribución exponencial, independiente uno del otro. ¿Cuál es la diferencia entre sus tiempos? Lo más frecuente es que lleguen muy parecidos, así que la diferencia se concentra en un pico afilado en el cero; ocasionalmente uno llega mucho antes, y la diferencia se aleja hacia un lado o el otro con colas exponenciales. Esa diferencia sigue una distribución de Laplace.

Comparada con una normal de la misma varianza, la Laplace es más puntiaguda en el centro y tiene colas más pesadas, aunque mucho más ligeras que las de la Cauchy. Muchos datos reales con pequeños cambios frecuentes y saltos ocasionales, como las variaciones diarias de algunos precios, se parecen más a una Laplace que a una normal.

La Laplace tiene un vínculo profundo con la mediana. Así como la media es el valor que minimiza la suma de errores al cuadrado, ligada a la normal, la mediana minimiza la suma de errores absolutos, ligada a la Laplace. Por eso aparece detrás de la regresión de mínimos errores absolutos y de la penalización tipo lasso.

## Definición

:::definicion[Distribución de Laplace]
Una variable $X$ tiene **distribución de Laplace** con localización $\mu$ y escala $b > 0$, $X \sim \operatorname{Laplace}(\mu, b)$, si su densidad es
$$
f(x) = \frac{1}{2b}\exp\!\left(-\frac{|x - \mu|}{b}\right), \qquad x \in \mathbb{R}.
$$
:::

Su función de distribución es $F(x) = \frac{1}{2}e^{(x - \mu)/b}$ si $x < \mu$ y $F(x) = 1 - \frac{1}{2}e^{-(x - \mu)/b}$ si $x \ge \mu$.

**Construcción:** si $E_1, E_2 \sim \operatorname{Exp}(1/b)$ son independientes, entonces $\mu + E_1 - E_2 \sim \operatorname{Laplace}(\mu, b)$.

:::nota[Qué es X]
$X$ = un valor con un pico agudo en el centro y colas exponenciales a ambos lados, como el error de una medición con valores atípicos ocasionales.
:::

:::nota[Qué hace cada parámetro]
- **$\mu$, localización:** el centro: media, mediana y moda. Si aumenta, la curva se desliza a la derecha.
- **$b$, escala:** qué tan rápido decaen las colas. Si aumenta, la curva se ensancha y el pico baja.
:::

:::nota[Qué significa cada símbolo]
- $X$: variable de Laplace.
- $\mu$: localización, que es media, mediana y moda.
- $b$: escala; cada cola decae como $e^{-|x - \mu|/b}$.
- $|x - \mu|$: distancia al centro.
- $E_1$, $E_2$: exponenciales independientes con media $b$.
:::

## Cómo usar la visualización

La pestaña Distribución muestra la densidad de Laplace junto a la normal de la misma varianza (línea punteada), la región elegida y su probabilidad; los casos cargan escalas distintas y el ejemplo de la ficha se carga con su botón. La pestaña Ver cómo surge resta dos tiempos exponenciales en cada experimento y acumula la diferencia.

La comparación muestra el pico más alto y las colas más pesadas de la Laplace. Con la región de colas a partir de $\pm 5$ la Laplace conserva 0.0067 de probabilidad, unas 17 veces más que la normal.

## Ejemplo

El cambio diario en el precio de una acción, en pesos, se modela con $\operatorname{Laplace}(0, 1)$.

1. Varianza: $2b^{2} = 2$, desviación estándar $\sqrt{2} \approx 1.41$.
2. Probabilidad de un cambio de más de 2 pesos en cualquier dirección: $P(|X| > 2) = e^{-2} \approx 0.135$.
3. Una normal con la misma varianza daría $P(|X| > 2) = 2[1 - \Phi(2/\sqrt{2})] \approx 0.157$; en este umbral es incluso mayor.
4. Pero más lejos la Laplace domina: $P(|X| > 5) = e^{-5} \approx 0.0067$ frente a $0.0004$ de la normal, unas 17 veces más.

:::figura[Laplace(0, 1): las colas más allá de ±2 suman 0.135; la línea punteada es la normal de la misma varianza.]{componente="DistributionExplorer"}
```yaml
distribucion: laplace
valores:
  mu: 0
  b: 1
ejemplo:
  titulo: 'Cambios grandes'
  contexto: 'El cambio diario en el precio de una acción, en pesos, sigue una Laplace con centro 0 y escala 1.'
  pregunta: '¿Qué probabilidad hay de un cambio mayor que 2 pesos en cualquier dirección?'
  valores: {mu: 0, b: 1}
  region: colas
  desde: -2
  hasta: 2
region: colas
desde: -2
hasta: 2
muestras: false
referencia:
  distribucion: normal
  valores: {mu: 0, sigma: 1.414}
  etiqueta: 'Normal de la misma varianza'
  visible: true
```
:::

## Propiedades

- **Media y varianza:** $\mathbb{E}[X] = \mu$ y $\operatorname{Var}(X) = 2b^{2}$.
- **Curtosis:** su exceso de curtosis es 3; tiene más masa en el centro y en las colas que la normal.
- **Simetría:** media, mediana y moda coinciden en $\mu$.
- **Diferencia de exponenciales:** $E_1 - E_2$ con exponenciales independientes de igual media es Laplace.
- **Valor absoluto:** $|X - \mu| \sim \operatorname{Exp}(1/b)$.
- **Mediana y error absoluto:** el estimador de máxima verosimilitud de $\mu$ con datos de Laplace es la mediana muestral.
- **Mezcla de normales:** una normal con varianza aleatoria exponencial es Laplace.

:::figura[Tres casos con contexto (cambio de precio, error de medición fino, diferencia de tiempos): cada botón carga los parámetros y una frase explica por qué la forma es así.]{componente="DistributionExplorer"}
```yaml
distribucion: laplace
valores:
  mu: 0
  b: 1
casos:
  - nombre: 'Cambio de precio'
    descripcion: 'b = 1: cambios diarios casi siempre pequeños y algún salto grande; pico agudo en cero.'
    valores: {mu: 0, b: 1}
  - nombre: 'Error de medición fino'
    descripcion: 'b = 0.3: un instrumento preciso; el pico es alto y estrecho.'
    valores: {mu: 0, b: 0.3}
  - nombre: 'Diferencia de tiempos'
    descripcion: 'μ = 1 y b = 2: la diferencia entre dos tiempos de llegada con media 2, desplazada una unidad.'
    valores: {mu: 1, b: 2}
referencia:
  distribucion: normal
  valores: {mu: 0, sigma: 1.414}
  etiqueta: 'Normal de la misma varianza'
  visible: true
```
:::

:::figura[Diferencia de exponenciales: cada resultado resta dos tiempos de llegada con media 1; el histograma forma el pico agudo de la Laplace.]{componente="ContinuousGenesis"}
```yaml
proceso: diferencia-exponenciales
valores:
  mu: 0
  b: 1
```
:::

:::figura[Escala: con b = 2 la Laplace (curva) es más ancha y baja que con b = 0.5 (línea punteada); el pico sigue siendo agudo.]{componente="DistributionExplorer"}
```yaml
distribucion: laplace
valores:
  mu: 0
  b: 2
muestras: false
referencia:
  distribucion: laplace
  valores:
    mu: 0
    b: 0.5
  etiqueta: Escala 0.5
```
:::

## Errores comunes

- **Confundir b con la desviación estándar.** La desviación es $b\sqrt{2}$.
- **Tratarla como una normal con colas un poco más gruesas.** Su pico es un vértice, no una curva suave, y eso cambia qué estimadores funcionan mejor.
- **Usar la media muestral como estimador del centro.** Con datos de Laplace la mediana es más eficiente.
- **Confundirla con la logística.** Ambas son simétricas y con colas exponenciales, pero la logística tiene centro suave y su densidad no tiene vértice.

:::figura[Pico agudo frente a pico suave: la Laplace (curva) y la logística de la misma varianza (línea punteada) tienen colas parecidas, pero solo la Laplace tiene un vértice en el centro.]{componente="DistributionExplorer"}
```yaml
distribucion: laplace
valores:
  mu: 0
  b: 1
muestras: false
referencia:
  distribucion: logistica
  valores:
    mu: 0
    s: 0.78
  etiqueta: Logística de la misma varianza
```
:::

## Conexiones

La Laplace es la diferencia de dos [[distribucion-exponencial|exponenciales]] y se contrasta con la [[distribucion-normal]]: una se asocia con el error absoluto y la mediana, la otra con el error cuadrático y la media. La [[distribucion-logistica]] es su pariente de centro suave. En aprendizaje automático, una distribución previa de Laplace sobre los coeficientes equivale a la penalización lasso, que lleva coeficientes exactamente a cero. El [[mapa-de-relaciones-entre-distribuciones]] la sitúa entre las demás distribuciones.

## Formulario

:::formula[Densidad]
$$
f(x) = \frac{1}{2b}\exp\!\left(-\frac{|x - \mu|}{b}\right)
$$

- $\mu$: localización.
- $b$: escala.
:::

:::formula[Función de distribución]
$$
F(x) = \begin{cases} \tfrac{1}{2}e^{(x - \mu)/b}, & x < \mu \\ 1 - \tfrac{1}{2}e^{-(x - \mu)/b}, & x \ge \mu \end{cases}
$$

- Cada mitad es una cola exponencial.
:::

:::formula[Media, varianza y colas]
$$
\mathbb{E}[X] = \mu, \qquad \operatorname{Var}(X) = 2b^{2}, \qquad P(|X - \mu| > t) = e^{-t/b}
$$

- $t$: distancia al centro.
:::

:::formula[Construcción]
$$
X = \mu + E_1 - E_2, \qquad E_i \sim \operatorname{Exp}(1/b)
$$

- $E_1$, $E_2$: exponenciales independientes de media $b$.
:::
