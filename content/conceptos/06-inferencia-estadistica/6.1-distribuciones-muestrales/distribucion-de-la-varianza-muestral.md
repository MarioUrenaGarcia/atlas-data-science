---
id: distribucion-de-la-varianza-muestral
titulo: Distribución de la varianza muestral
titulo_en: Sampling distribution of the sample variance
alias:
  - distribución de S cuadrada
  - varianza muestral y chi cuadrada
modulo: 6
submodulo: '6.1'
orden: 4
nivel: basico
prerrequisitos:
  - distribucion-muestral
  - varianza-muestral
  - distribucion-chi-cuadrada
etiquetas:
  - inferencia
  - varianza muestral
  - chi cuadrada
  - normalidad
resumen: >
  En una muestra normal, (n - 1) S² / σ² sigue una chi cuadrada con n - 1 grados de libertad. La varianza
  muestral es insesgada, asimétrica a la derecha y muy sensible a que la población no sea normal.
formula: '\frac{(n - 1)S^2}{\sigma^2} \sim \chi^2_{n-1}'
visualizacion:
  componente: SamplingSimulator
  parametros:
    poblacion:
      distribucion: normal
      valores:
        mu: 0
        sigma: 1
    estadistico: varianza
    n: 6
    nMaximo: 60
referencias:
  - clave: casella-berger
    capitulo: '5'
  - clave: degroot
publicado: true
---

## Intuición

Una fábrica de tornillos necesita que la longitud varíe poco. Cada turno, un inspector mide 6 tornillos y calcula la varianza de esas longitudes. Aunque la máquina no cambie, la varianza calculada sube y baja de turno en turno: a veces sale muy chica porque tocaron 6 tornillos parecidos, a veces grande porque tocó uno raro. Para saber si una varianza alta es motivo de alarma, hay que conocer cómo se distribuye la varianza muestral cuando todo está bien.

Si las longitudes son normales, la respuesta es exacta: la varianza muestral, multiplicada por $(n - 1)/\sigma^2$, sigue una distribución chi cuadrada. Esa distribución es asimétrica a la derecha, sobre todo con muestras pequeñas: lo más frecuente es obtener una varianza algo menor que la verdadera, compensada por ocasionales valores muy grandes. Con muestras grandes se vuelve más simétrica y concentrada.

## Definición

:::teorema[Distribución de la varianza muestral en poblaciones normales]
Si $X_1, \dots, X_n$ es una muestra aleatoria de $\mathcal{N}(\mu, \sigma^2)$ y
$$
S^2 = \frac{1}{n - 1}\sum_{i=1}^{n} (X_i - \bar{X})^2,
$$
entonces
$$
\frac{(n - 1)S^2}{\sigma^2} \sim \chi^2_{n-1},
$$
y en consecuencia $\mathbb{E}[S^2] = \sigma^2$ y $\operatorname{Var}(S^2) = \dfrac{2\sigma^4}{n - 1}$.
:::

Para poblaciones no normales sigue siendo cierto que $\mathbb{E}[S^2] = \sigma^2$, pero la varianza de $S^2$ depende de la curtosis: $\operatorname{Var}(S^2) = \sigma^4\left(\frac{2}{n - 1} + \frac{\kappa}{n}\right)$, con $\kappa$ el exceso de curtosis, y la forma chi cuadrada deja de valer.

:::nota[Qué significa cada símbolo]
- $X_1, \dots, X_n$: muestra; $n$: tamaño; $\bar{X}$: media muestral.
- $S^2$: varianza muestral con denominador $n - 1$.
- $\mu$, $\sigma^2$: media y varianza de la población; $\sigma^4 = (\sigma^2)^2$.
- $\chi^2_{n-1}$: chi cuadrada con $n - 1$ grados de libertad.
- $\kappa$: exceso de curtosis de la población (0 para la normal).
:::

## Cómo usar la visualización

La población es normal estándar ($\sigma^2 = 1$) y cada muestra de tamaño $n$ aporta su varianza al histograma. La curva es la distribución exacta, $\sigma^2\chi^2_{n-1}/(n - 1)$.

Controles: **Tamaño de cada muestra**, los parámetros de la población y la curva teórica.

Experimentos sugeridos:

1. Con $n = 6$, observar la cola derecha y que la moda queda por debajo de 1.
2. Subir $n$ a 50: la distribución se vuelve casi simétrica y concentrada alrededor de 1.
3. Comparar la media de los valores de $S^2$ con $\sigma^2 = 1$: coinciden, aunque la mayoría de las muestras dé menos de 1.

## Ejemplo

Longitudes de tornillos con $\sigma = 0.2$ mm ($\sigma^2 = 0.04$); el inspector mide $n = 6$.

1. $\frac{5 S^2}{0.04} \sim \chi^2_5$.
2. El percentil 95 de $\chi^2_5$ es 11.07; entonces $P(S^2 > 0.04 \cdot 11.07/5) = P(S^2 > 0.0886) = 0.05$.
3. Una varianza muestral mayor que 0.0886 mm² ocurre solo 5 % de las veces si la máquina está bien: es una señal para revisarla.
4. Error estándar de $S^2$: $\sqrt{2 \cdot 0.04^2/5} \approx 0.0253$, más de la mitad de la varianza que se quiere estimar.

:::figura[Muestras de 6 de una normal con varianza 1.44: la varianza muestral es muy dispersa y asimétrica.]{componente="SamplingSimulator"}
```yaml
poblacion:
  distribucion: normal
  valores:
    mu: 0
    sigma: 1.2
estadistico: varianza
n: 6
poblacionEditable: false
```
:::

## Propiedades

- **Insesgada:** $\mathbb{E}[S^2] = \sigma^2$ gracias al denominador $n - 1$.
- **Asimétrica a la derecha,** con moda menor que $\sigma^2$, sobre todo con $n$ pequeño.
- **Relativamente imprecisa:** su coeficiente de variación es $\sqrt{2/(n - 1)}$, que con $n = 11$ vale 0.45.
- **Independiente de $\bar{X}$** en poblaciones normales (teorema de Cochran).

:::figura[La desviación estándar muestral S, en cambio, está ligeramente sesgada hacia abajo: la media de sus valores queda por debajo de sigma.]{componente="SamplingSimulator"}
```yaml
poblacion:
  distribucion: normal
  valores:
    mu: 0
    sigma: 2
estadistico: desviacion
n: 5
poblacionEditable: false
teoria: false
```
:::

## Errores comunes

- **Aplicar la chi cuadrada a poblaciones no normales.** Con colas pesadas la varianza muestral es mucho más variable de lo que dice la chi cuadrada, y los intervalos para $\sigma^2$ fallan.
- **Creer que una $S^2$ menor que $\sigma^2$ indica un error.** Por la asimetría, lo típico es obtener varianzas algo menores que la verdadera.
- **Suponer que $S$ es insesgado porque $S^2$ lo es.** La raíz es cóncava, así que $\mathbb{E}[S] < \sigma$.

:::figura[Población de Laplace, con colas más pesadas que la normal: la varianza muestral varía mucho más y la curva chi cuadrada no se muestra porque no aplica.]{componente="SamplingSimulator"}
```yaml
poblacion:
  distribucion: laplace
estadistico: varianza
n: 6
poblacionEditable: false
```
:::

## Conexiones

La [[varianza-muestral]] y la [[correccion-de-bessel]] explican el denominador $n - 1$. Su distribución exacta usa la [[distribucion-chi-cuadrada]] y su independencia de la media es el [[teorema-de-cochran]]. Dividir la media entre el error estándar estimado con $S$ produce la [[distribucion-t-de-student]] del [[estadistico-pivote]].

## Formulario

:::formula[Varianza muestral]
$$
S^2 = \frac{1}{n - 1}\sum_{i=1}^{n} (X_i - \bar{X})^2
$$

- $X_i$: observaciones; $\bar{X}$: media muestral; $n$: tamaño de muestra.
:::

:::formula[Distribución exacta bajo normalidad]
$$
\frac{(n - 1)S^2}{\sigma^2} \sim \chi^2_{n-1}
$$

- $\sigma^2$: varianza de la población; $\chi^2_{n-1}$: chi cuadrada con $n - 1$ grados de libertad.
:::

:::formula[Media y varianza de S²]
$$
\mathbb{E}[S^2] = \sigma^2,\qquad \operatorname{Var}(S^2) = \frac{2\sigma^4}{n - 1}
$$

- La varianza es la del caso normal.
:::

:::formula[Varianza de S² en general]
$$
\operatorname{Var}(S^2) = \sigma^4\left(\frac{2}{n - 1} + \frac{\kappa}{n}\right)
$$

- $\kappa$: exceso de curtosis de la población.
:::
