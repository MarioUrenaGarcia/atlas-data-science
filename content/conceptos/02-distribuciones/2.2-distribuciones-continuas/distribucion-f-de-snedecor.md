---
id: distribucion-f-de-snedecor
titulo: Distribución F de Snedecor
titulo_en: F distribution
alias:
  - distribución F
  - F de Fisher-Snedecor
  - cociente de varianzas
modulo: 2
submodulo: '2.2'
orden: 11
nivel: basico
prerrequisitos:
  - distribucion-chi-cuadrada
relaciones:
  - tipo: relacionado
    id: distribucion-t-de-student
etiquetas:
  - distribución continua
  - cociente de varianzas
  - análisis de varianza
  - grados de libertad
resumen: >
  Es el cociente de dos chi-cuadradas independientes, cada una dividida entre sus grados de libertad.
  Describe el cociente de dos varianzas muestrales de poblaciones normales con la misma varianza.
formula: 'F = \frac{V_1/d_1}{V_2/d_2} \sim F_{d_1, d_2}'
visualizacion:
  componente: DistributionStudio
  parametros:
    explorador:
      distribucion: f
      valores:
        d1: 9
        d2: 14
      casos:
        - nombre: 'Denominador pequeño'
          descripcion: 'd₁ = 5 y d₂ = 3: el denominador a veces es casi cero y la cola derecha es muy larga.'
          valores: {d1: 5, d2: 3}
        - nombre: 'Dos máquinas'
          descripcion: 'd₁ = 9 y d₂ = 14: varianzas de 10 y 15 botellas; el cociente se concentra cerca de 1.'
          valores: {d1: 9, d2: 14}
        - nombre: 'Muestras grandes'
          descripcion: 'd₁ = 30 y d₂ = 60: ambas varianzas son precisas y el cociente cae entre 0.6 y 1.6 en casi nueve de cada diez casos.'
          valores: {d1: 30, d2: 60}
        - nombre: 'ANOVA chico'
          descripcion: 'd₁ = 2 y d₂ = 10: cola derecha pesada; análisis de varianza con muestras chicas.'
          valores: {d1: 2, d2: 10}
        - nombre: 'Ejemplo de clase'
          descripcion: 'd₁ = 5 y d₂ = 20: más estable; comparación de medias de seis grupos.'
          valores: {d1: 5, d2: 20}
        - nombre: 'ANOVA grande'
          descripcion: 'd₁ = 10 y d₂ = 50: más concentrada; muestras grandes y comparación de modelos.'
          valores: {d1: 10, d2: 50}
      ejemplo:
        titulo: 'Varianzas de dos máquinas'
        contexto: 'Dos máquinas igual de precisas producen varianzas muestrales con 9 y 14 grados de libertad.'
        pregunta: '¿Qué probabilidad hay de que su cociente supere 2.1 por azar?'
        valores: {d1: 9, d2: 14}
        region: derecha
        desde: 2.1
    genesis:
      componente: ContinuousGenesis
      parametros:
        proceso: cociente-f
        valores:
          d1: 5
          d2: 20
referencias:
  - clave: casella-berger
    capitulo: '5'
  - clave: montgomery-doe
    capitulo: '3'
publicado: true
---

## Intuición

Dos máquinas llenan botellas de jarabe y el área de calidad quiere saber si una es más irregular que la otra. Toma 10 botellas de la primera y 15 de la segunda y calcula la varianza de cada grupo. Aunque las dos máquinas fueran igual de precisas, las varianzas muestrales no saldrían iguales: cada una tiene su propio ruido. ¿Qué tan distinto puede ser su cociente por puro azar? La distribución F responde esa pregunta.

Cada varianza muestral, bien escalada, es una chi-cuadrada dividida entre sus grados de libertad, una cantidad que en promedio vale 1. El cociente de dos de estas cantidades independientes se concentra alrededor de 1 cuando ambas muestras son grandes, y se dispersa mucho cuando alguna es pequeña. Por eso la F tiene dos parámetros: los grados de libertad del numerador y los del denominador.

La F es la distribución de referencia del análisis de varianza, que compara la variación entre grupos con la variación dentro de los grupos, y de las pruebas que comparan modelos de regresión anidados. En todos los casos la pregunta es la misma: si un cociente de varianzas es mayor de lo que el azar explicaría.

## Definición

:::definicion[Distribución F]
Sean $V_1 \sim \chi^{2}_{d_1}$ y $V_2 \sim \chi^{2}_{d_2}$ independientes. La variable
$$
F = \frac{V_1/d_1}{V_2/d_2}
$$
tiene **distribución F de Snedecor** con $d_1$ y $d_2$ grados de libertad, $F \sim F_{d_1, d_2}$, con densidad
$$
f(x) = \frac{1}{B\!\left(\frac{d_1}{2}, \frac{d_2}{2}\right)}\left(\frac{d_1}{d_2}\right)^{d_1/2} x^{d_1/2 - 1}\left(1 + \frac{d_1}{d_2}x\right)^{-\frac{d_1 + d_2}{2}}, \qquad x > 0.
$$
:::

:::teorema[Cociente de varianzas muestrales]
Si $S_1^{2}$ y $S_2^{2}$ son varianzas muestrales de muestras normales independientes de tamaños $n_1$ y $n_2$ con la misma varianza, entonces $S_1^{2}/S_2^{2} \sim F_{n_1 - 1,\, n_2 - 1}$.
:::

:::nota[Qué es X]
$X$ = el cociente de dos varianzas estimadas, cada una dividida entre sus grados de libertad.
:::

:::nota[Qué hace cada parámetro]
- **$d_1$, grados del numerador:** los grados de libertad de la varianza de arriba; en un análisis de varianza, el número de grupos menos uno. Si aumenta, la curva se concentra y el pico se acerca a 1.
- **$d_2$, grados del denominador:** los grados de libertad de la varianza de abajo; en un análisis de varianza, las observaciones menos los grupos. Si aumenta, la cola derecha se acorta y la curva se estabiliza.
:::

:::nota[Qué significa cada símbolo]
- $F$: cociente de varianzas escaladas.
- $V_1$, $V_2$: chi-cuadradas independientes.
- $d_1$, $d_2$: grados de libertad del numerador y del denominador.
- $B$: función beta.
- $S_1^{2}$, $S_2^{2}$: varianzas muestrales.
- $n_1$, $n_2$: tamaños de las muestras.
:::

## Cómo usar la visualización

La pestaña Distribución muestra la densidad $F_{d_1, d_2}$, la región elegida y su probabilidad; los casos cargan grados pequeños, intermedios y grandes, y el ejemplo de la ficha se carga con su botón. La pestaña Ver cómo surge calcula en cada experimento las dos chi-cuadradas escaladas y su cociente.

Con pocos grados en el denominador aparecen cocientes enormes. Con muchos grados en ambos lados la distribución se estrecha alrededor de 1. El cuantil 0.95, que marca el valor crítico de una prueba, se lee con la probabilidad acumulada.

## Ejemplo

La máquina A produce 10 botellas con varianza muestral 6.2 ml² y la máquina B 15 botellas con varianza 3.8 ml². Si ambas tuvieran la misma varianza, el cociente seguiría $F_{9, 14}$.

1. Cociente observado: $6.2/3.8 \approx 1.63$.
2. El cuantil 0.95 de $F_{9, 14}$ es 2.65; un cociente de 1.63 está por debajo, así que la diferencia es compatible con el azar.
3. Para declarar a la máquina A más irregular al 5 %, el cociente tendría que superar 2.65.
4. La probabilidad de un cociente mayor que 2.1 por azar es $P(F_{9,14} > 2.1) \approx 0.10$.

:::figura[F con 9 y 14 grados: el cuantil 0.95 es 2.65; el área sombreada a la derecha de 2.1 vale 0.10.]{componente="DistributionExplorer"}
```yaml
distribucion: f
valores:
  d1: 9
  d2: 14
ejemplo:
  titulo: 'Varianzas de dos máquinas'
  contexto: 'Dos máquinas igual de precisas producen varianzas muestrales con 9 y 14 grados de libertad.'
  pregunta: '¿Qué probabilidad hay de que su cociente supere 2.1 por azar?'
  valores: {d1: 9, d2: 14}
  region: derecha
  desde: 2.1
region: derecha
desde: 2.1
muestras: false
```
:::

Segundo ejemplo, análisis de varianza de seis grupos. Con 6 grupos y 26 observaciones, el estadístico tiene $d_1 = 6 - 1 = 5$ y $d_2 = 26 - 6 = 20$ grados de libertad; si todas las medias son iguales sigue una $F_{5, 20}$, con media $20/18 \approx 1.11$.

1. La pregunta es $P(F_{5, 20} > 2.71)$.
2. Como 2.71 es el cuantil 0.95 de $F_{5, 20}$, la probabilidad es 0.05.
3. Un valor observado mayor que 2.71 lleva a rechazar que las seis medias sean iguales al 5 %.

:::figura[ANOVA de seis grupos: el área a la derecha de 2.71 vale 0.05. El botón carga el ejemplo.]{componente="DistributionExplorer"}
```yaml
distribucion: f
valores:
  d1: 5
  d2: 20
ejemplo:
  titulo: 'ANOVA de seis grupos'
  contexto: 'Un análisis de varianza con 6 grupos y 26 observaciones tiene d₁ = 5 y d₂ = 20; el valor crítico al 5 % es 2.71.'
  pregunta: '¿Qué probabilidad hay de obtener un F mayor que 2.71 si todas las medias son iguales?'
  valores: {d1: 5, d2: 20}
  region: derecha
  desde: 2.71
region: derecha
desde: 2.71
muestras: false
```
:::

## Propiedades

- **Media:** $\mathbb{E}[F] = d_2/(d_2 - 2)$ si $d_2 > 2$; no depende de $d_1$.
- **Varianza:** $\dfrac{2d_2^{2}(d_1 + d_2 - 2)}{d_1(d_2 - 2)^{2}(d_2 - 4)}$ si $d_2 > 4$.
- **Recíproco:** si $F \sim F_{d_1, d_2}$, entonces $1/F \sim F_{d_2, d_1}$; por eso $F_{d_1,d_2;\,p} = 1/F_{d_2,d_1;\,1-p}$.
- **Relación con la t:** si $T \sim t_{\nu}$, entonces $T^{2} \sim F_{1, \nu}$.
- **Relación con la beta:** $\frac{d_1F/d_2}{1 + d_1F/d_2} \sim \operatorname{Beta}(d_1/2, d_2/2)$.
- **Límite:** cuando $d_2 \to \infty$, $d_1F \to \chi^{2}_{d_1}$.

:::figura[Casos con contexto (denominador pequeño, dos máquinas, muestras grandes, ANOVA chico, ejemplo de clase, ANOVA grande): cada botón carga los parámetros y una frase explica por qué la forma es así.]{componente="DistributionExplorer"}
```yaml
distribucion: f
valores:
  d1: 9
  d2: 14
casos:
  - nombre: 'Denominador pequeño'
    descripcion: 'd₁ = 5 y d₂ = 3: el denominador a veces es casi cero y la cola derecha es muy larga.'
    valores: {d1: 5, d2: 3}
  - nombre: 'Dos máquinas'
    descripcion: 'd₁ = 9 y d₂ = 14: varianzas de 10 y 15 botellas; el cociente se concentra cerca de 1.'
    valores: {d1: 9, d2: 14}
  - nombre: 'Muestras grandes'
    descripcion: 'd₁ = 30 y d₂ = 60: ambas varianzas son precisas y el cociente cae entre 0.6 y 1.6 en casi nueve de cada diez casos.'
    valores: {d1: 30, d2: 60}
  - nombre: 'ANOVA chico'
    descripcion: 'd₁ = 2 y d₂ = 10: cola derecha pesada; análisis de varianza con muestras chicas.'
    valores: {d1: 2, d2: 10}
  - nombre: 'Ejemplo de clase'
    descripcion: 'd₁ = 5 y d₂ = 20: más estable; comparación de medias de seis grupos.'
    valores: {d1: 5, d2: 20}
  - nombre: 'ANOVA grande'
    descripcion: 'd₁ = 10 y d₂ = 50: más concentrada; muestras grandes y comparación de modelos.'
    valores: {d1: 10, d2: 50}
```
:::

:::figura[Denominador con pocos grados: con d₂ = 3 el denominador a veces es casi cero y el cociente se dispara; la cola derecha es muy larga.]{componente="ContinuousGenesis"}
```yaml
proceso: cociente-f
valores:
  d1: 5
  d2: 3
```
:::

:::figura[Muchos grados en ambos lados: F con 30 y 60 grados se concentra alrededor de 1.]{componente="DistributionExplorer"}
```yaml
distribucion: f
valores:
  d1: 30
  d2: 60
muestras: false
```
:::

## Errores comunes

- **Invertir los grados de libertad.** $F_{9, 14}$ y $F_{14, 9}$ son distintas; el primer número corresponde al numerador.
- **Poner la varianza menor en el numerador para una prueba de una cola hacia arriba.** Si se busca saber si A es más variable, A va en el numerador.
- **Usarla con datos no normales.** La prueba F de igualdad de varianzas es muy sensible a la falta de normalidad, más que la prueba t.
- **Esperar que la media sea 1.** La media es $d_2/(d_2 - 2)$, ligeramente mayor que 1.

:::figura[Orden de los grados: F₉,₁₄ (curva) frente a F₁₄,₉ (línea punteada). Intercambiar numerador y denominador cambia la distribución.]{componente="DistributionExplorer"}
```yaml
distribucion: f
valores:
  d1: 9
  d2: 14
muestras: false
referencia:
  distribucion: f
  valores:
    d1: 14
    d2: 9
  etiqueta: F con 14 y 9 grados
```
:::

## Conexiones

La F es un cociente de dos [[distribucion-chi-cuadrada|chi-cuadradas]] y contiene el cuadrado de la [[distribucion-t-de-student]] como caso $d_1 = 1$. Una transformación de la F es una [[distribucion-beta]]. Es la distribución de referencia en el análisis de varianza y en la comparación de modelos de regresión. En el análisis de varianza compara la variación entre grupos con la variación dentro de los grupos. El [[mapa-de-relaciones-entre-distribuciones]] reúne estas conexiones con las demás distribuciones y explica cómo leer sus gráficas.

:::figura[Chi-cuadrada y F: el cociente de dos chi-cuadradas divididas entre sus grados. Con d₁ = 5 y d₂ = 20 la curva queda centrada cerca de 1.]{componente="DistributionExplorer"}
```yaml
distribucion: f
valores:
  d1: 5
  d2: 20
muestras: true
```
:::

## Formulario

:::formula[Construcción]
$$
F = \frac{V_1/d_1}{V_2/d_2}, \qquad V_i \sim \chi^{2}_{d_i}\ \text{independientes}
$$

- $d_1$, $d_2$: grados de libertad.
:::

:::formula[Densidad]
$$
f(x) = \frac{1}{B\!\left(\frac{d_1}{2}, \frac{d_2}{2}\right)}\left(\frac{d_1}{d_2}\right)^{d_1/2} x^{d_1/2 - 1}\left(1 + \frac{d_1}{d_2}x\right)^{-\frac{d_1 + d_2}{2}}
$$

- $B$: función beta.
- $x > 0$.
:::

:::formula[Cociente de varianzas muestrales]
$$
\frac{S_1^{2}}{S_2^{2}} \sim F_{n_1 - 1,\, n_2 - 1}
$$

- $S_i^{2}$: varianzas muestrales de poblaciones normales con la misma varianza.
:::

:::formula[Media y recíproco]
$$
\mathbb{E}[F] = \frac{d_2}{d_2 - 2}\ (d_2 > 2), \qquad \frac{1}{F} \sim F_{d_2, d_1}
$$

- La media depende solo del denominador.
:::

:::formula[Relación con la t]
$$
T^{2} \sim F_{1, \nu}, \qquad T \sim t_{\nu}
$$

- $\nu$: grados de libertad de la t.
:::
