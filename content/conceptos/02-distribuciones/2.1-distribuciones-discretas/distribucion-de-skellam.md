---
id: distribucion-de-skellam
titulo: Distribución de Skellam
titulo_en: Skellam distribution
alias:
  - Skellam
  - diferencia de dos Poisson
  - Poisson difference distribution
modulo: 2
submodulo: '2.1'
orden: 14
nivel: intermedio
prerrequisitos:
  - distribucion-de-poisson
relaciones:
  - tipo: relacionado
    id: distribucion-de-rademacher
etiquetas:
  - distribución discreta
  - diferencia de conteos
  - goles
  - valores negativos
resumen: >
  Distribución de la diferencia entre dos conteos de Poisson independientes. Toma valores enteros
  positivos y negativos; su media es la diferencia de las tasas y su varianza, la suma.
formula: 'P(X = k) = e^{-(\mu_1 + \mu_2)}\left(\frac{\mu_1}{\mu_2}\right)^{k/2} I_{|k|}\!\left(2\sqrt{\mu_1\mu_2}\right)'
visualizacion:
  componente: DistributionGenesis
  parametros:
    proceso: diferencia-de-llegadas
    valores:
      mu1: 1.6
      mu2: 1.1
    flujos: [Local, Visitante]
    unidad: diferencia de goles en un partido
referencias:
  - clave: karlin-taylor
  - clave: ross-procesos
publicado: true
---

## Intuición

En un partido de futbol, el equipo local anota en promedio 1.6 goles y el visitante 1.1. Si los goles de cada equipo llegan como eventos raros e independientes, el número de goles de cada lado es una Poisson. Pero lo que define el resultado no son los goles de cada equipo por separado sino su diferencia: ganar 2 a 0 o 4 a 2 es, para la tabla de diferencias, lo mismo. La distribución de Skellam describe esa diferencia.

A diferencia de la Poisson, la diferencia puede ser negativa: el local puede perder. Su centro está en la diferencia de las tasas, 0.5 goles a favor del local, pero su dispersión crece con la suma de las tasas, porque cada gol, de cualquiera de los dos equipos, mueve la diferencia una unidad. Un partido con muchos goles tiene diferencias más extremas que uno cerrado, aunque las tasas estén igual de equilibradas.

La misma idea aparece en conteos que suben y bajan: pacientes que ingresan y salen de un piso de hospital, órdenes de compra y de venta de una acción, o fotones de señal menos fotones de fondo en un detector. Siempre que se restan dos conteos de Poisson independientes, el resultado es Skellam.

## Definición

:::definicion[Distribución de Skellam]
Sean $N_1 \sim \operatorname{Poisson}(\mu_1)$ y $N_2 \sim \operatorname{Poisson}(\mu_2)$ independientes. La diferencia $X = N_1 - N_2$ tiene **distribución de Skellam**, $X \sim \operatorname{Skellam}(\mu_1, \mu_2)$, con valores en $\mathbb{Z}$ y
$$
P(X = k) = \sum_{j = \max(0, -k)}^{\infty} \frac{e^{-\mu_1}\mu_1^{j + k}}{(j + k)!}\,\frac{e^{-\mu_2}\mu_2^{j}}{j!} = e^{-(\mu_1 + \mu_2)}\left(\frac{\mu_1}{\mu_2}\right)^{k/2} I_{|k|}\!\left(2\sqrt{\mu_1\mu_2}\right).
$$
:::

La suma recorre todas las formas de obtener la diferencia $k$: el segundo conteo vale $j$ y el primero $j + k$. La forma cerrada usa la función de Bessel modificada de primera especie, $I_{\nu}(z) = \sum_{m \ge 0} \frac{(z/2)^{2m + \nu}}{m!\,(m + \nu)!}$.

:::nota[Qué significa cada símbolo]
- $X$: diferencia entre los dos conteos.
- $N_1$, $N_2$: conteos de Poisson independientes.
- $\mu_1$, $\mu_2$: medias de esos conteos.
- $k$: diferencia particular, entera y posiblemente negativa.
- $j$: valor del segundo conteo en la suma.
- $I_{\nu}(z)$: función de Bessel modificada de orden $\nu$.
- $\mathbb{Z}$: conjunto de los enteros.
:::

## Cómo usar la visualización

Cada experimento es un partido. Los goles de cada equipo aparecen como marcas en su propia línea a lo largo del tiempo, y los números de la derecha son los marcadores. Al terminar, la diferencia local menos visitante cae en el histograma, que se compara con la función de masa de Skellam.

Con tasas 1.6 y 1.1 el histograma tiene su máximo en 0 y está algo cargado a la derecha; la media se acerca a 0.5 y la varianza a 2.7. Al igualar las tasas la forma se vuelve simétrica alrededor de 0. Al subir ambas tasas a 5 sin cambiar su diferencia, la media no cambia pero la distribución se ensancha mucho.

## Ejemplo

En un piso de hospital ingresan en promedio 3 pacientes por hora y son dados de alta 2, de forma independiente. Sea $X$ el cambio en la ocupación durante una hora, $X \sim \operatorname{Skellam}(3, 2)$.

1. Cambio esperado: $\mathbb{E}[X] = 3 - 2 = 1$ paciente más por hora.
2. Varianza: $\operatorname{Var}(X) = 3 + 2 = 5$, con desviación estándar $\sqrt{5} \approx 2.24$.
3. Ocupación sin cambio: $P(X = 0) = e^{-5} I_0(2\sqrt{6}) \approx 0.168$.
4. La ocupación sube en la hora: $P(X > 0) \approx 0.585$; baja: $P(X < 0) \approx 0.247$.
5. Aunque en promedio entra un paciente más de los que salen, en casi una de cada cuatro horas la ocupación disminuye.

:::figura[Skellam(3, 2): las barras positivas, sombreadas, suman 0.585. La barra del 0 mide 0.168.]{componente="DistributionExplorer"}
```yaml
distribucion: skellam
valores:
  mu1: 3
  mu2: 2
desde: 1
hasta: 25
muestras: false
```
:::

:::figura[Ingresos y altas de una hora en dos líneas de tiempo. El cambio de ocupación es la diferencia de los marcadores.]{componente="DistributionGenesis"}
```yaml
proceso: diferencia-de-llegadas
valores:
  mu1: 3
  mu2: 2
flujos: [Ingresos, Altas]
unidad: cambio de ocupación en una hora
```
:::

## Propiedades

- **Media y varianza:** $\mathbb{E}[X] = \mu_1 - \mu_2$ y $\operatorname{Var}(X) = \mu_1 + \mu_2$.
- **Simetría:** si $\mu_1 = \mu_2$, la distribución es simétrica alrededor de 0; en general, $-X \sim \operatorname{Skellam}(\mu_2, \mu_1)$.
- **Suma:** la suma de Skellam independientes es Skellam con las tasas sumadas por separado.
- **Aproximación normal:** si $\mu_1 + \mu_2$ es grande, $X \approx \mathcal{N}(\mu_1 - \mu_2,\ \mu_1 + \mu_2)$.
- **Probabilidad de empate:** $P(X = 0) = e^{-(\mu_1 + \mu_2)} I_0(2\sqrt{\mu_1\mu_2})$, que decrece cuando ambas tasas crecen.

:::figura[Con tasas iguales, 2 y 2, la distribución es simétrica alrededor de 0: ganar y perder tienen la misma probabilidad, 0.397, y el empate tiene 0.207.]{componente="DistributionExplorer"}
```yaml
distribucion: skellam
valores:
  mu1: 2
  mu2: 2
desde: 0
hasta: 0
muestras: false
```
:::

:::figura[La misma diferencia de medias, 0.5, con tasas 5.5 y 5: la varianza sube a 10.5 y la distribución se ensancha, aunque el centro no cambie.]{componente="DistributionGenesis"}
```yaml
proceso: diferencia-de-llegadas
valores:
  mu1: 5.5
  mu2: 5
flujos: [Local, Visitante]
unidad: diferencia de goles con marcador alto
```
:::

## Errores comunes

- **Restar las varianzas.** La varianza de una diferencia de variables independientes es la suma de las varianzas: $\operatorname{Var}(N_1 - N_2) = \mu_1 + \mu_2$, no $\mu_1 - \mu_2$.
- **Pensar que la diferencia es Poisson.** Una Poisson no toma valores negativos y tiene varianza igual a la media; la Skellam puede ser negativa y su varianza supera a $|\mu_1 - \mu_2|$.
- **Aplicarla a conteos dependientes.** Si los dos conteos están correlacionados, por ejemplo goles en partidos donde un equipo reacciona al marcador, la diferencia ya no es Skellam.
- **Concluir que el favorito casi siempre gana.** Con tasas 1.6 y 1.1, el local gana en menos de la mitad de los partidos.

:::figura[Tasas 1.6 y 1.1: el local gana solo con probabilidad 0.49 (barras sombreadas), empata con 0.25 y pierde con 0.26.]{componente="DistributionExplorer"}
```yaml
distribucion: skellam
valores:
  mu1: 1.6
  mu2: 1.1
desde: 1
hasta: 25
muestras: false
```
:::

## Conexiones

La Skellam es la diferencia de dos conteos de [[distribucion-de-poisson|Poisson]] independientes. Así como la suma de signos de la [[distribucion-de-rademacher]] describe una caminata aleatoria en tiempos fijos, la Skellam describe la posición de una caminata que da pasos hacia arriba y hacia abajo en tiempos de Poisson. Se usa en modelos de resultados deportivos, en el análisis de cambios de precio de activos en tiempo continuo y en la comparación de conteos de fotones.

## Formulario

:::formula[Función de masa como suma]
$$
P(X = k) = \sum_{j \ge \max(0, -k)} \frac{e^{-\mu_1}\mu_1^{j + k}}{(j + k)!}\,\frac{e^{-\mu_2}\mu_2^{j}}{j!}
$$

- $\mu_1$, $\mu_2$: medias de los dos conteos.
- $k$: diferencia.
- $j$: valor del segundo conteo.
:::

:::formula[Forma con la función de Bessel]
$$
P(X = k) = e^{-(\mu_1 + \mu_2)}\left(\frac{\mu_1}{\mu_2}\right)^{k/2} I_{|k|}\!\left(2\sqrt{\mu_1\mu_2}\right)
$$

- $I_{\nu}(z)$: función de Bessel modificada de orden $\nu$.
:::

:::formula[Media y varianza]
$$
\mathbb{E}[X] = \mu_1 - \mu_2, \qquad \operatorname{Var}(X) = \mu_1 + \mu_2
$$

- Las medias se restan y las varianzas se suman.
:::

:::formula[Aproximación normal]
$$
X \approx \mathcal{N}(\mu_1 - \mu_2,\ \mu_1 + \mu_2)
$$

- Útil cuando $\mu_1 + \mu_2$ es grande.
:::
