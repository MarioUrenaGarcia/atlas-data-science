---
id: distribucion-binomial-negativa
titulo: Distribución binomial negativa
titulo_en: Negative binomial distribution
alias:
  - binomial negativa
  - distribución de Pascal
  - espera hasta el r-ésimo éxito
modulo: 2
submodulo: '2.1'
orden: 5
nivel: basico
prerrequisitos:
  - distribucion-geometrica
  - combinaciones
relaciones:
  - tipo: generaliza
    id: distribucion-geometrica
  - tipo: contrasta
    id: distribucion-binomial
etiquetas:
  - distribución discreta
  - tiempo de espera
  - sobredispersión
  - conteos
resumen: >
  Cuenta los fracasos, o los ensayos, necesarios hasta acumular r éxitos en ensayos de Bernoulli
  independientes. Es la suma de r geométricas y modela conteos con varianza mayor que la media.
formula: 'P(X = k) = \binom{k + r - 1}{k} p^{r} (1 - p)^{k}, \quad k = 0, 1, 2, \dots'
visualizacion:
  componente: DistributionStudio
  parametros:
    explorador:
      distribucion: binomial-negativa
      valores:
        r: 3
        p: 0.4
      casos:
        - nombre: 'Un solo éxito'
          descripcion: 'r = 1: la binomial negativa es la geométrica de los fracasos; la barra más alta está en cero.'
          valores: {r: 1, p: 0.4}
        - nombre: 'Tres voluntarios'
          descripcion: 'r = 3 y p = 0.4: los rechazos antes del tercer voluntario; media 4.5 y cola a la derecha.'
          valores: {r: 3, p: 0.4}
        - nombre: 'Diez éxitos'
          descripcion: 'r = 10: la suma de diez esperas geométricas ya parece una campana alrededor de 15.'
          valores: {r: 10, p: 0.4}
      ejemplo:
        titulo: 'Reclutamiento rápido'
        contexto: 'Se necesitan 3 voluntarios y cada persona contactada acepta con probabilidad 0.4.'
        pregunta: '¿Qué probabilidad hay de completar el reclutamiento con a lo más 2 rechazos?'
        valores: {r: 3, p: 0.4}
        region: izquierda
        desde: 2
      referencia:
        distribucion: poisson
        valores: {lambda: 4.5}
        etiqueta: 'Poisson con la misma media'
        visible: false
    genesis:
      componente: DistributionGenesis
      parametros:
        proceso: r-exitos
        valores:
          r: 3
          p: 0.25
        exito: Productivo
        fracaso: Seco
        conteo: ensayos
referencias:
  - clave: blitzstein-hwang
    capitulo: '4'
  - clave: ross-probabilidad
    capitulo: '4'
  - clave: agresti
publicado: true
---

## Intuición

Una compañía petrolera necesita tres pozos productivos en una zona donde cada perforación resulta productiva con probabilidad 0.25. Seguirá perforando hasta lograr los tres. El total de perforaciones es aleatorio: con suerte bastan tres; con mala suerte pueden ser veinte. La distribución binomial negativa describe ese esfuerzo.

La espera completa se puede partir en tramos: los pozos hasta el primer productivo, luego los que faltan hasta el segundo y después hasta el tercero. Cada tramo es una espera geométrica y los tramos no se influyen entre sí, porque las perforaciones son independientes. Así, la binomial negativa es la suma de varias geométricas, y por eso su media y su varianza son las de la geométrica multiplicadas por el número de éxitos buscados.

El nombre viene de que invierte la pregunta de la binomial. En la binomial el número de ensayos está fijo y se cuentan los éxitos; aquí se fija el número de éxitos y lo aleatorio es cuántos ensayos o fracasos hacen falta. Además, su varianza siempre supera a su media, lo que la vuelve un modelo frecuente para conteos más dispersos de lo que permite la Poisson.

## Definición

:::definicion[Distribución binomial negativa]
En ensayos de Bernoulli independientes con probabilidad de éxito $p \in (0, 1]$, sea $X$ el número de fracasos antes del éxito número $r$, con $r$ entero positivo. Entonces $X$ tiene **distribución binomial negativa**, $X \sim \operatorname{BinNeg}(r, p)$, con
$$
P(X = k) = \binom{k + r - 1}{k} p^{r} (1 - p)^{k}, \qquad k = 0, 1, 2, \dots
$$
:::

El coeficiente cuenta las maneras de acomodar $k$ fracasos entre los primeros $k + r - 1$ ensayos; el último ensayo es forzosamente el éxito número $r$. La convención alternativa cuenta los ensayos totales $T = X + r$:
$$
P(T = t) = \binom{t - 1}{r - 1} p^{r} (1 - p)^{t - r}, \qquad t = r, r + 1, \dots
$$

:::nota[Qué significa cada símbolo]
- $X$: número de fracasos antes del éxito número $r$.
- $T = X + r$: número total de ensayos.
- $r$: número de éxitos que se esperan.
- $p$: probabilidad de éxito por ensayo.
- $k$, $t$: valores particulares de $X$ y de $T$.
- $\binom{k + r - 1}{k}$: maneras de colocar los $k$ fracasos antes del último éxito.
- $p^{r}(1 - p)^{k}$: probabilidad de una secuencia concreta con $r$ éxitos y $k$ fracasos.
:::

## Cómo usar la visualización

La pestaña Distribución muestra la función de masa de los fracasos antes del éxito número $r$, la región elegida y su probabilidad; los casos cargan uno, tres y diez éxitos, y el ejemplo de la ficha se carga con su botón. La comparación superpone la Poisson de la misma media, más angosta. La pestaña Ver cómo surge simula perforaciones hasta el tercer pozo productivo.

Con la comparación activada se ve la sobredispersión: la varianza de la binomial negativa siempre supera a su media. Al subir $r$ la forma se vuelve más simétrica.

## Ejemplo

Un estudio clínico necesita reclutar 3 voluntarios y cada persona contactada acepta con probabilidad 0.4, de manera independiente. Sea $X$ el número de personas que rechazan antes del tercer voluntario, $X \sim \operatorname{BinNeg}(3, 0.4)$.

1. Exactamente 2 rechazos: $P(X = 2) = \binom{4}{2}(0.4)^{3}(0.6)^{2} = 6 \cdot 0.064 \cdot 0.36 \approx 0.1382$.
2. Ningún rechazo: $P(X = 0) = 0.4^{3} = 0.064$; un rechazo: $P(X = 1) = 3 \cdot 0.064 \cdot 0.6 = 0.1152$.
3. Completar el reclutamiento con a lo más 5 contactos equivale a $X \le 2$: $0.064 + 0.1152 + 0.1382 = 0.3174$.
4. Rechazos esperados: $\mathbb{E}[X] = 3 \cdot 0.6/0.4 = 4.5$, es decir, 7.5 contactos en promedio, con varianza $3 \cdot 0.6/0.16 = 11.25$.

:::figura[BinNeg(3, 0.4) contando rechazos: las barras de 0 a 2 suman 0.3174, la probabilidad de reclutar a los tres con a lo más cinco contactos.]{componente="DistributionExplorer"}
```yaml
distribucion: binomial-negativa
valores:
  r: 3
  p: 0.4
ejemplo:
  titulo: 'Reclutamiento rápido'
  contexto: 'Se necesitan 3 voluntarios y cada persona contactada acepta con probabilidad 0.4.'
  pregunta: '¿Qué probabilidad hay de completar el reclutamiento con a lo más 2 rechazos?'
  valores: {r: 3, p: 0.4}
  region: izquierda
  desde: 2
region: izquierda
desde: 2
muestras: false
referencia:
  distribucion: poisson
  valores: {lambda: 4.5}
  etiqueta: 'Poisson con la misma media'
  visible: false
```
:::

:::figura[El reclutamiento simulado contacto por contacto. Cada campaña termina con el tercer voluntario y registra cuántas personas rechazaron.]{componente="DistributionGenesis"}
```yaml
proceso: r-exitos
valores:
  r: 3
  p: 0.4
exito: Acepta
fracaso: Rechaza
conteo: fracasos
```
:::

## Propiedades

- **Media y varianza:** $\mathbb{E}[X] = \dfrac{r(1 - p)}{p}$ y $\operatorname{Var}(X) = \dfrac{r(1 - p)}{p^{2}}$; para los ensayos totales, $\mathbb{E}[T] = r/p$ con la misma varianza.
- **Suma de geométricas:** $X$ es la suma de $r$ variables independientes que cuentan los fracasos antes de cada éxito.
- **Sobredispersión:** $\operatorname{Var}(X) = \mathbb{E}[X]/p > \mathbb{E}[X]$; la varianza siempre supera a la media.
- **Caso $r = 1$:** se recupera la geométrica de los fracasos.
- **Dualidad con la binomial:** necesitar a lo más $n$ ensayos equivale a obtener al menos $r$ éxitos en $n$ ensayos: $P(T \le n) = P(\operatorname{Bin}(n, p) \ge r)$.
- **Parámetro real:** la fórmula se extiende a $r > 0$ no entero escribiendo el coeficiente con la función gamma; así surge como mezcla de Poisson con tasa gamma.

:::figura[Tres casos con contexto (un solo éxito, tres voluntarios, diez éxitos): cada botón carga los parámetros y una frase explica por qué la forma es así.]{componente="DistributionExplorer"}
```yaml
distribucion: binomial-negativa
valores:
  r: 3
  p: 0.4
casos:
  - nombre: 'Un solo éxito'
    descripcion: 'r = 1: la binomial negativa es la geométrica de los fracasos; la barra más alta está en cero.'
    valores: {r: 1, p: 0.4}
  - nombre: 'Tres voluntarios'
    descripcion: 'r = 3 y p = 0.4: los rechazos antes del tercer voluntario; media 4.5 y cola a la derecha.'
    valores: {r: 3, p: 0.4}
  - nombre: 'Diez éxitos'
    descripcion: 'r = 10: la suma de diez esperas geométricas ya parece una campana alrededor de 15.'
    valores: {r: 10, p: 0.4}
referencia:
  distribucion: poisson
  valores: {lambda: 4.5}
  etiqueta: 'Poisson con la misma media'
  visible: false
```
:::

:::figura[Dualidad con la binomial: en Bin(5, 0.4), obtener al menos 3 éxitos (barras sombreadas) tiene probabilidad 0.3174, la misma que reclutar a los tres voluntarios en a lo más cinco contactos.]{componente="DistributionExplorer"}
```yaml
distribucion: binomial
valores:
  n: 5
  p: 0.4
desde: 3
hasta: 5
muestras: false
```
:::

:::figura[Sobredispersión: BinNeg(3, 0.25) contando fracasos tiene media 9 y varianza 36; la Poisson con la misma media (línea punteada) tiene varianza 9 y es mucho más angosta.]{componente="DistributionExplorer"}
```yaml
distribucion: binomial-negativa
valores:
  r: 3
  p: 0.25
muestras: false
referencia:
  distribucion: poisson
  valores:
    lambda: 9
  etiqueta: Poisson de media 9
```
:::

:::figura[Con r grande la forma se acerca a una campana: BinNeg(10, 0.4) tiene media 15 y es casi simétrica.]{componente="DistributionExplorer"}
```yaml
distribucion: binomial-negativa
valores:
  r: 10
  p: 0.4
muestras: false
```
:::

:::demostracion
Si $G_1, \dots, G_r$ son los fracasos entre éxitos consecutivos, cada uno con media $(1 - p)/p$ y varianza $(1 - p)/p^{2}$ e independientes, entonces $X = G_1 + \dots + G_r$ tiene media $r(1 - p)/p$ y varianza $r(1 - p)/p^{2}$. Para la dualidad: $T \le n$ ocurre exactamente cuando el éxito número $r$ llega a más tardar en el ensayo $n$, es decir, cuando entre los primeros $n$ ensayos hay al menos $r$ éxitos.
:::

## Errores comunes

- **Mezclar las dos convenciones.** Contar fracasos o contar ensayos desplaza la distribución en $r$ unidades: con $r = 3$ y $p = 0.4$ las medias son 4.5 y 7.5.
- **Usar $\binom{k + r}{k}$ en lugar de $\binom{k + r - 1}{k}$.** El último ensayo es siempre un éxito, así que solo se reparten los demás.
- **Tratarla como binomial.** En la binomial lo aleatorio son los éxitos con ensayos fijos; aquí el número de ensayos es aleatorio y no tiene tope.
- **Esperar que la varianza sea igual a la media.** Ese es el caso de la Poisson; la binomial negativa siempre tiene varianza mayor.

:::figura[El mismo reclutamiento contando ensayos totales: el histograma empieza en 3 y su media es 7.5, tres unidades más que contando rechazos.]{componente="DistributionGenesis"}
```yaml
proceso: r-exitos
valores:
  r: 3
  p: 0.4
exito: Acepta
fracaso: Rechaza
conteo: ensayos
```
:::

## Conexiones

La binomial negativa generaliza la [[distribucion-geometrica]], que es el caso de un solo éxito, y su coeficiente se obtiene contando [[combinaciones]]. Frente a la [[distribucion-binomial]], intercambia lo fijo y lo aleatorio. Por su varianza mayor que la media se usa como alternativa a la [[distribucion-de-poisson]] para conteos sobredispersos, por ejemplo en ecología y en número de reclamaciones de seguros. Su versión con $r$ real se escribe con la [[funcion-gamma]].

## Formulario

:::formula[Función de masa (fracasos)]
$$
P(X = k) = \binom{k + r - 1}{k} p^{r} (1 - p)^{k}, \qquad k = 0, 1, \dots
$$

- $X$: fracasos antes del éxito $r$.
- $r$: éxitos requeridos.
- $p$: probabilidad de éxito.
- $k$: número de fracasos.
:::

:::formula[Función de masa (ensayos)]
$$
P(T = t) = \binom{t - 1}{r - 1} p^{r} (1 - p)^{t - r}, \qquad t = r, r + 1, \dots
$$

- $T = X + r$: ensayos totales.
- $t$: número de ensayos; el ensayo $t$ es el éxito $r$.
:::

:::formula[Media y varianza]
$$
\mathbb{E}[X] = \frac{r(1 - p)}{p}, \qquad \mathbb{E}[T] = \frac{r}{p}, \qquad \operatorname{Var}(X) = \operatorname{Var}(T) = \frac{r(1 - p)}{p^{2}}
$$

- $\mathbb{E}[X]$, $\mathbb{E}[T]$: medias de fracasos y de ensayos.
- La varianza es la misma en ambas convenciones.
:::

:::formula[Dualidad con la binomial]
$$
P(T \le n) = P\big(\operatorname{Bin}(n, p) \ge r\big)
$$

- $n$: número de ensayos disponibles.
- $\operatorname{Bin}(n, p)$: éxitos en $n$ ensayos.
:::
