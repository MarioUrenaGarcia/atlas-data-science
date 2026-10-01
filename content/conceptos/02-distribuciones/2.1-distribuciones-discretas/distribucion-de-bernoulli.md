---
id: distribucion-de-bernoulli
titulo: Distribución de Bernoulli
titulo_en: Bernoulli distribution
alias:
  - ensayo de Bernoulli
  - variable indicadora
  - Bernoulli trial
modulo: 2
submodulo: '2.1'
orden: 2
nivel: basico
prerrequisitos: []
relaciones:
  - tipo: caso-particular
    id: distribucion-uniforme-discreta
etiquetas:
  - distribución discreta
  - éxito y fracaso
  - indicadora
  - ensayo
resumen: >
  Describe un experimento con dos resultados, éxito con probabilidad p y fracaso con probabilidad 1 - p,
  codificados como 1 y 0. Es la pieza con la que se construyen la binomial, la geométrica y otras.
formula: 'P(X = 1) = p, \quad P(X = 0) = 1 - p'
visualizacion:
  componente: DistributionStudio
  parametros:
    explorador:
      distribucion: bernoulli
      valores:
        p: 0.12
      casos:
        - nombre: 'Fiebre tras vacuna'
          descripcion: 'p = 0.12: la barra del 1 es baja; el evento ocurre en uno de cada ocho casos aproximadamente.'
          valores: {p: 0.12}
        - nombre: 'Moneda justa'
          descripcion: 'p = 0.5: dos barras iguales y la varianza máxima, 0.25.'
          valores: {p: 0.5}
        - nombre: 'Tiro libre'
          descripcion: 'p = 0.75: la barra del 1 domina; una jugadora encesta tres de cada cuatro tiros.'
          valores: {p: 0.75}
      ejemplo:
        titulo: 'Fiebre tras la vacuna'
        contexto: 'El 12 % de los pacientes presenta fiebre leve después de una vacuna.'
        pregunta: '¿Qué probabilidad hay de que un paciente elegido al azar presente fiebre?'
        valores: {p: 0.12}
        region: derecha
        desde: 1
    genesis:
      componente: DistributionGenesis
      parametros:
        proceso: moneda
        valores:
          p: 0.75
        exito: Encesta
        fracaso: Falla
referencias:
  - clave: blitzstein-hwang
    capitulo: '3'
  - clave: casella-berger
    capitulo: '3'
publicado: true
---

## Intuición

Una jugadora de baloncesto lanza un tiro libre: encesta o falla. Un paciente responde a un tratamiento o no responde. Una pieza sale correcta o defectuosa. Muchas preguntas sobre el mundo se reducen a un sí o un no, y la distribución de Bernoulli es el modelo más simple para esas preguntas.

El truco consiste en anotar el resultado con números: 1 para el resultado que interesa, llamado éxito aunque sea una falla, y 0 para el otro. Con esa codificación el número tiene un significado útil: su promedio a lo largo de muchas repeticiones es la proporción de éxitos. Si la jugadora encesta el 75 % de sus tiros, el promedio de una larga lista de unos y ceros se acerca a 0.75.

Todo el modelo depende de un solo número, la probabilidad de éxito. La incertidumbre es máxima cuando éxito y fracaso son igual de probables y desaparece cuando uno de los dos es seguro. Repetir ensayos de Bernoulli independientes y contar, esperar o registrar los resultados da lugar a la mayoría de las distribuciones discretas de este submódulo.

## Definición

:::definicion[Distribución de Bernoulli]
Una variable aleatoria $X$ tiene **distribución de Bernoulli** con parámetro $p \in [0, 1]$, y se escribe $X \sim \operatorname{Bernoulli}(p)$, si toma solo los valores 0 y 1 con
$$
P(X = 1) = p, \qquad P(X = 0) = 1 - p.
$$
De forma compacta, $P(X = k) = p^{k}(1 - p)^{1 - k}$ para $k \in \{0, 1\}$.
:::

Si $A$ es un evento con $P(A) = p$, su indicadora $\mathbf{1}\{A\}$, que vale 1 cuando ocurre $A$ y 0 cuando no, tiene distribución $\operatorname{Bernoulli}(p)$. Un **ensayo de Bernoulli** es un experimento cuyo resultado se registra de esta manera.

:::nota[Qué significa cada símbolo]
- $X$: resultado codificado, 1 para éxito y 0 para fracaso.
- $p$: probabilidad de éxito, entre 0 y 1.
- $1 - p$: probabilidad de fracaso, a veces escrita $q$.
- $k$: valor posible de $X$, 0 o 1.
- $\mathbf{1}\{A\}$: indicadora del evento $A$.
:::

## Cómo usar la visualización

La pestaña Distribución muestra las dos barras, $1 - p$ en el 0 y $p$ en el 1, con la región elegida y su probabilidad; el panel da la media $p$ y la varianza $p(1 - p)$. Los casos cargan situaciones con probabilidades distintas y el ejemplo de la ficha se carga con su botón. La pestaña Ver cómo surge lanza tiros libres y acumula los resultados.

Al llevar $p$ a 0.5 la varianza llega a su máximo, 0.25; con $p = 0$ o $p = 1$ vale cero. Con el botón de simulación, la media de las muestras se acerca a $p$, porque el promedio de unos y ceros es la proporción de éxitos.

## Ejemplo

Después de aplicar una vacuna, el 12 % de los pacientes presenta fiebre leve. Para un paciente elegido al azar, sea $X = 1$ si presenta fiebre y $X = 0$ si no, de modo que $X \sim \operatorname{Bernoulli}(0.12)$.

1. Probabilidad de fiebre: $P(X = 1) = 0.12$; de no tenerla: $P(X = 0) = 0.88$.
2. Esperanza: $\mathbb{E}[X] = 0 \cdot 0.88 + 1 \cdot 0.12 = 0.12$.
3. Segundo momento: como $X^2 = X$, $\mathbb{E}[X^2] = 0.12$.
4. Varianza: $\operatorname{Var}(X) = 0.12 - 0.12^2 = 0.12 \cdot 0.88 = 0.1056$, con desviación estándar $\sqrt{0.1056} \approx 0.325$.

:::figura[Un paciente tras la vacuna: la ficha se rellena cuando aparece fiebre y queda vacía cuando no. La frecuencia del 1 se estabiliza cerca de 0.12 y la del 0 cerca de 0.88.]{componente="DistributionGenesis"}
```yaml
proceso: moneda
valores:
  p: 0.12
exito: Fiebre
fracaso: Sin fiebre
```
:::

:::figura[El ejemplo en la visualización: el botón carga los parámetros y la región de "Fiebre tras la vacuna" y muestra la probabilidad pedida.]{componente="DistributionExplorer"}
```yaml
distribucion: bernoulli
valores:
  p: 0.12
ejemplo:
  titulo: 'Fiebre tras la vacuna'
  contexto: 'El 12 % de los pacientes presenta fiebre leve después de una vacuna.'
  pregunta: '¿Qué probabilidad hay de que un paciente elegido al azar presente fiebre?'
  valores: {p: 0.12}
  region: derecha
  desde: 1
region: derecha
desde: 1
muestras: false
```
:::

## Propiedades

- **Media y momentos:** como $X^k = X$ para todo $k \ge 1$, $\mathbb{E}[X^k] = p$; en particular $\mathbb{E}[X] = p$.
- **Varianza:** $\operatorname{Var}(X) = p(1 - p)$, máxima e igual a 1/4 cuando $p = 1/2$ y nula cuando $p$ es 0 o 1.
- **Simetría:** $1 - X \sim \operatorname{Bernoulli}(1 - p)$; intercambiar los nombres de éxito y fracaso refleja la distribución.
- **Suma de ensayos:** la suma de $n$ variables $\operatorname{Bernoulli}(p)$ independientes es $\operatorname{Bin}(n, p)$.
- **Producto:** si $X$ y $Y$ son Bernoulli independientes con parámetros $p$ y $q$, entonces $XY \sim \operatorname{Bernoulli}(pq)$, porque $XY = 1$ solo cuando ambas valen 1.

:::figura[Tres casos con contexto (fiebre tras vacuna, moneda justa, tiro libre): cada botón carga los parámetros y una frase explica por qué la forma es así.]{componente="DistributionExplorer"}
```yaml
distribucion: bernoulli
valores:
  p: 0.12
casos:
  - nombre: 'Fiebre tras vacuna'
    descripcion: 'p = 0.12: la barra del 1 es baja; el evento ocurre en uno de cada ocho casos aproximadamente.'
    valores: {p: 0.12}
  - nombre: 'Moneda justa'
    descripcion: 'p = 0.5: dos barras iguales y la varianza máxima, 0.25.'
    valores: {p: 0.5}
  - nombre: 'Tiro libre'
    descripcion: 'p = 0.75: la barra del 1 domina; una jugadora encesta tres de cada cuatro tiros.'
    valores: {p: 0.75}
```
:::

:::figura[Varianza máxima con p = 0.5: los dos valores tienen la misma masa y la varianza alcanza 0.25.]{componente="DistributionExplorer"}
```yaml
distribucion: bernoulli
valores:
  p: 0.5
muestras: false
```
:::

:::figura[Simetría: Bernoulli(0.9) (barras) es el reflejo de Bernoulli(0.1) (línea punteada). Ambas tienen la misma varianza 0.09.]{componente="DistributionExplorer"}
```yaml
distribucion: bernoulli
valores:
  p: 0.9
muestras: false
referencia:
  distribucion: bernoulli
  valores:
    p: 0.1
  etiqueta: Bernoulli(0.1)
```
:::

:::figura[Suma de ensayos: cinco pacientes vacunados, cada uno con probabilidad 0.12 de fiebre. El número de pacientes con fiebre ya no es Bernoulli, es binomial.]{componente="DistributionGenesis"}
```yaml
proceso: ensayos
valores:
  n: 5
  p: 0.12
exito: Fiebre
fracaso: Sin fiebre
```
:::

## Errores comunes

- **Suponer que dos resultados implican probabilidad 1/2.** Que un tiro tenga solo dos desenlaces no los hace igual de probables; con $p = 0.12$ el éxito ocurre en uno de cada ocho casos aproximadamente.
- **Confundir la varianza con p.** La varianza es $p(1 - p)$, no $p$: con $p = 0.9$ vale 0.09, igual que con $p = 0.1$.
- **Codificar el fracaso como -1 y seguir usando las fórmulas.** Con valores $\pm 1$ la media es $2p - 1$ y la varianza $4p(1 - p)$; esa variable es una transformación de la Bernoulli, no una Bernoulli.
- **Olvidar que éxito es una etiqueta.** El éxito puede ser un evento indeseable, como una falla o un contagio; lo que importa es qué resultado se codifica con 1.

:::figura[Dos resultados no significan mitad y mitad: con p = 0.12 la barra del 1 se queda muy por debajo de la del 0.]{componente="DistributionExplorer"}
```yaml
distribucion: bernoulli
valores:
  p: 0.12
muestras: true
```
:::

:::figura[Con valores -1 y +1 se obtiene otra distribución: con probabilidad 1/2 cada uno es la distribución de Rademacher, de media 0 y varianza 1, no 1/2 y 1/4.]{componente="DistributionGenesis"}
```yaml
proceso: signos
valores:
  n: 1
```
:::

## Conexiones

Repetir ensayos de Bernoulli independientes y contar los éxitos da la [[distribucion-binomial]]; contar los ensayos hasta el primer éxito da la [[distribucion-geometrica]], y hasta el éxito número $r$, la [[distribucion-binomial-negativa]]. Con más de dos resultados el modelo se generaliza a la [[distribucion-categorica]]. Codificar los dos resultados como $-1$ y $+1$ con probabilidad 1/2 da la [[distribucion-de-rademacher]]. Con $p = 1/2$, la Bernoulli es la [[distribucion-uniforme-discreta]] sobre $\{0, 1\}$.

## Formulario

:::formula[Función de masa]
$$
P(X = k) = p^{k}(1 - p)^{1 - k}, \qquad k \in \{0, 1\}
$$

- $X$: resultado, 1 para éxito y 0 para fracaso.
- $p$: probabilidad de éxito.
- $k$: valor posible, 0 o 1.
:::

:::formula[Media y varianza]
$$
\mathbb{E}[X] = p, \qquad \operatorname{Var}(X) = p(1 - p)
$$

- $\mathbb{E}[X]$: proporción esperada de éxitos.
- $\operatorname{Var}(X)$: varianza, máxima con $p = 1/2$.
:::

:::formula[Momentos]
$$
\mathbb{E}[X^{k}] = p, \qquad k \ge 1
$$

- $X^k = X$ porque $X$ solo vale 0 o 1.
:::

:::formula[Indicadora de un evento]
$$
\mathbf{1}\{A\} \sim \operatorname{Bernoulli}(P(A))
$$

- $A$: evento cualquiera.
- $\mathbf{1}\{A\}$: vale 1 si ocurre $A$ y 0 si no.
- $P(A)$: probabilidad del evento, que es el parámetro.
:::
