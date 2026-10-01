---
id: distribucion-normal
titulo: Distribución normal
titulo_en: Normal distribution
alias:
  - normal
  - distribución gaussiana
  - campana de Gauss
modulo: 2
submodulo: '2.2'
orden: 2
nivel: basico
prerrequisitos:
  - distribucion-uniforme-continua
  - funcion-exponencial-y-logaritmo-natural
relaciones:
  - tipo: relacionado
    id: funcion-error
etiquetas:
  - distribución continua
  - campana
  - gaussiana
  - sumas de efectos
resumen: >
  Distribución simétrica en forma de campana, determinada por su media μ y su varianza σ². Aparece
  cuando una magnitud es la suma de muchos efectos pequeños e independientes.
formula: 'f(x) = \frac{1}{\sigma\sqrt{2\pi}}\exp\!\left(-\frac{(x - \mu)^{2}}{2\sigma^{2}}\right)'
visualizacion:
  componente: DistributionStudio
  parametros:
    explorador:
      distribucion: normal
      valores:
        mu: 170
        sigma: 7
      rangos:
        mu: [120, 200]
        sigma: [2, 20]
      dominio: [115, 205]
      casos:
        - nombre: 'Estatura de mujeres'
          descripcion: 'Media 160 cm y desviación 6 cm: campana simétrica alrededor de 160, porque la estatura suma muchos efectos pequeños.'
          valores: {mu: 160, sigma: 6}
        - nombre: 'Estatura de hombres'
          descripcion: 'Media 175 cm y desviación 7 cm: la misma forma, desplazada 15 cm y un poco más ancha.'
          valores: {mu: 175, sigma: 7}
        - nombre: 'Niños de 10 años'
          descripcion: 'Media 138 cm y desviación 6 cm: la campana se mueve a la izquierda sin cambiar de forma.'
          valores: {mu: 138, sigma: 6}
      ejemplo:
        titulo: 'Estaturas altas'
        contexto: 'La estatura de las personas adultas de una población sigue una normal con media 170 cm y desviación 7 cm.'
        pregunta: '¿Qué proporción mide más de 180 cm?'
        valores: {mu: 170, sigma: 7}
        region: derecha
        desde: 180
    genesis:
      componente: ContinuousGenesis
      parametros:
        proceso: suma-uniformes
        valores:
          n: 12
referencias:
  - clave: blitzstein-hwang
    capitulo: '5'
  - clave: casella-berger
    capitulo: '3'
publicado: true
---

## Intuición

La estatura de una persona adulta depende de muchísimos factores: cientos de genes, la alimentación en la infancia, enfermedades, el sueño. Cada uno suma o resta un poco, y ninguno domina a los demás. Cuando una magnitud resulta de sumar muchos efectos pequeños e independientes, su distribución toma casi siempre la misma forma: una campana simétrica, alta en el centro y con colas que caen muy rápido. Esa forma es la distribución normal.

Dos números bastan para describirla. La media marca el centro de la campana y la desviación estándar su ancho: la campana tiene sus puntos de inflexión, donde cambia de curvatura, a una desviación estándar del centro. Moverse dos desviaciones ya deja fuera a menos del 5 % de los casos, y tres desviaciones, a menos de tres de cada mil.

La normal es central en estadística por dos razones. Una es empírica: muchas mediciones físicas, errores de instrumentos y promedios se comportan así. La otra es matemática: el teorema central del límite garantiza que los promedios de muchas observaciones independientes son aproximadamente normales, sin importar la distribución original. Además es fácil de manejar: sumas y transformaciones lineales de normales siguen siendo normales.

## Definición

:::definicion[Distribución normal]
Una variable aleatoria $X$ tiene **distribución normal** con media $\mu \in \mathbb{R}$ y varianza $\sigma^{2} > 0$, $X \sim \mathcal{N}(\mu, \sigma^{2})$, si su densidad es
$$
f(x) = \frac{1}{\sigma\sqrt{2\pi}}\exp\!\left(-\frac{(x - \mu)^{2}}{2\sigma^{2}}\right), \qquad x \in \mathbb{R}.
$$
:::

Su función de distribución no tiene fórmula elemental; se escribe con la normal estándar $\Phi$ como $F(x) = \Phi\!\left(\frac{x - \mu}{\sigma}\right)$, donde $\Phi(z) = \int_{-\infty}^{z} \frac{1}{\sqrt{2\pi}} e^{-t^{2}/2}\,dt$.

:::nota[Qué significa cada símbolo]
- $X$: variable aleatoria normal.
- $\mu$: media, el centro de la campana.
- $\sigma$: desviación estándar, el ancho; $\sigma^{2}$ es la varianza.
- $\pi$, $e$: constantes matemáticas; $\exp(u) = e^{u}$.
- $f(x)$: densidad en $x$.
- $\Phi(z)$: función de distribución de la normal estándar.
- $t$: variable de integración.
:::

## Cómo usar la visualización

La pestaña Distribución muestra la campana con media $\mu$ y desviación $\sigma$, la región de probabilidad elegida en el selector y su valor en el panel. Los casos cargan estaturas de grupos distintos; el ejemplo de la ficha se carga con su botón. La pestaña Ver cómo surge suma 12 números uniformes por experimento y muestra cómo los resultados forman una campana.

Al pasar de un caso a otro la campana se desplaza sin cambiar de forma. Al duplicar $\sigma$ la altura baja a la mitad, porque el área sigue siendo uno. Con el botón de simulación se superponen 1000 estaturas simuladas que llenan la curva.

## Ejemplo

La estatura de las personas adultas de una población sigue $\mathcal{N}(170, 7^{2})$ en centímetros.

1. Para comparar con la normal estándar se calcula $z = (180 - 170)/7 \approx 1.43$.
2. Proporción de personas de más de 180 cm: $P(X > 180) = 1 - \Phi(1.4286) \approx 0.0766$, algo menos del 8 %.
3. Proporción entre 160 y 180 cm: $\Phi(1.4286) - \Phi(-1.4286) \approx 0.847$.
4. Estatura que solo supera el 5 % de la población: el cuantil 0.95 es $170 + 1.645 \cdot 7 \approx 181.5$ cm.

:::figura[Estaturas de más de 180 cm: el área sombreada a la derecha vale 0.0766.]{componente="DistributionExplorer"}
```yaml
distribucion: normal
valores:
  mu: 170
  sigma: 7
rangos:
  mu: [120, 200]
  sigma: [2, 20]
dominio: [115, 205]
ejemplo:
  titulo: 'Estaturas altas'
  contexto: 'La estatura de las personas adultas de una población sigue una normal con media 170 cm y desviación 7 cm.'
  pregunta: '¿Qué proporción mide más de 180 cm?'
  valores: {mu: 170, sigma: 7}
  region: derecha
  desde: 180
region: derecha
desde: 180
muestras: false
```
:::

## Propiedades

- **Simetría:** la densidad es simétrica alrededor de $\mu$, que es a la vez media, mediana y moda.
- **Puntos de inflexión:** la curva cambia de curvatura en $\mu \pm \sigma$.
- **Transformaciones lineales:** si $X \sim \mathcal{N}(\mu, \sigma^{2})$, entonces $aX + b \sim \mathcal{N}(a\mu + b, a^{2}\sigma^{2})$ para $a \ne 0$.
- **Sumas:** si $X \sim \mathcal{N}(\mu_1, \sigma_1^{2})$ y $Y \sim \mathcal{N}(\mu_2, \sigma_2^{2})$ son independientes, $X + Y \sim \mathcal{N}(\mu_1 + \mu_2, \sigma_1^{2} + \sigma_2^{2})$.
- **Colas ligeras:** la densidad cae como $e^{-x^{2}/2}$, más rápido que cualquier exponencial; los valores lejanos son muy raros.
- **Origen por sumas:** la suma de muchas variables independientes con varianza finita se aproxima a una normal (teorema central del límite).
- **Máxima entropía:** entre todas las distribuciones con media y varianza dadas, la normal es la de mayor entropía.

:::figura[Tres casos con contexto (estatura de mujeres, estatura de hombres, niños de 10 años): cada botón carga los parámetros y una frase explica por qué la forma es así.]{componente="DistributionExplorer"}
```yaml
distribucion: normal
valores:
  mu: 170
  sigma: 7
rangos:
  mu: [120, 200]
  sigma: [2, 20]
dominio: [115, 205]
casos:
  - nombre: 'Estatura de mujeres'
    descripcion: 'Media 160 cm y desviación 6 cm: campana simétrica alrededor de 160, porque la estatura suma muchos efectos pequeños.'
    valores: {mu: 160, sigma: 6}
  - nombre: 'Estatura de hombres'
    descripcion: 'Media 175 cm y desviación 7 cm: la misma forma, desplazada 15 cm y un poco más ancha.'
    valores: {mu: 175, sigma: 7}
  - nombre: 'Niños de 10 años'
    descripcion: 'Media 138 cm y desviación 6 cm: la campana se mueve a la izquierda sin cambiar de forma.'
    valores: {mu: 138, sigma: 6}
```
:::

:::figura[Origen por sumas: cada resultado suma 12 números uniformes entre 0 y 1. El histograma ya es casi indistinguible de la normal con media 6 y varianza 1.]{componente="ContinuousGenesis"}
```yaml
proceso: suma-uniformes
valores:
  n: 12
```
:::

:::figura[Efecto de σ: con la misma media, la normal de desviación 7 (curva) es más alta y angosta que la de desviación 14 (línea punteada).]{componente="DistributionExplorer"}
```yaml
distribucion: normal
valores:
  mu: 170
  sigma: 7
rangos:
  mu: [140, 200]
  sigma: [2, 20]
dominio: [120, 220]
muestras: false
referencia:
  distribucion: normal
  valores:
    mu: 170
    sigma: 14
  etiqueta: Desviación 14
```
:::

:::figura[Suma de normales independientes: si un trayecto en autobús dura N(25, 4²) y la espera N(5, 3²), el total es N(30, 5²), más ancho que cualquiera de los dos.]{componente="DistributionExplorer"}
```yaml
distribucion: normal
valores:
  mu: 30
  sigma: 5
rangos:
  mu: [0, 60]
  sigma: [1, 10]
dominio: [10, 50]
muestras: true
referencia:
  distribucion: normal
  valores:
    mu: 25
    sigma: 4
  etiqueta: Solo el trayecto, N(25, 4²)
```
:::

:::demostracion
Que el área total es 1 se sigue de la integral de Gauss. Con $z = (x - \mu)/\sigma$ basta ver que $I = \int_{-\infty}^{\infty} e^{-z^{2}/2}dz = \sqrt{2\pi}$. En coordenadas polares,
$$
I^{2} = \int\!\!\int e^{-(z^{2} + w^{2})/2}\,dz\,dw = \int_{0}^{2\pi}\!\!\int_{0}^{\infty} e^{-r^{2}/2} r\,dr\,d\theta = 2\pi.
$$
:::

## Errores comunes

- **Suponer que todo es normal.** Ingresos, tiempos de espera o tamaños de archivos son asimétricos y con colas largas; tratarlos como normales subestima los valores extremos.
- **Confundir σ con σ².** En $\mathcal{N}(170, 49)$ el segundo número es la varianza; la desviación estándar es 7. Muchos textos y programas escriben la desviación en lugar de la varianza, así que conviene revisar la convención.
- **Leer la densidad como probabilidad.** $f(170) \approx 0.057$ no es la probabilidad de medir exactamente 170 cm, que es cero.
- **Sumar desviaciones estándar.** En la suma de independientes se suman las varianzas: $\sqrt{4^{2} + 3^{2}} = 5$, no $4 + 3 = 7$.

:::figura[Un caso no normal: tiempos de espera exponenciales con media 2. La normal de la misma media y varianza (línea punteada) asigna probabilidad a esperas negativas y subestima la cola derecha.]{componente="DistributionExplorer"}
```yaml
distribucion: exponencial
valores:
  lambda: 0.5
dominio: [-4, 10]
muestras: false
referencia:
  distribucion: normal
  valores:
    mu: 2
    sigma: 2
  etiqueta: Normal de media 2 y desviación 2
```
:::

## Conexiones

La normal se construye con la [[funcion-exponencial-y-logaritmo-natural|exponencial]] de una parábola y su función de distribución se expresa con la [[funcion-error]]. Su versión con media 0 y varianza 1 es la [[normal-estandar-y-puntuacion-z]], y la [[regla-empirica-68-95-99-7]] resume sus probabilidades más usadas. Muchas distribuciones se derivan de ella: la [[distribucion-chi-cuadrada]] (sumas de cuadrados), la [[distribucion-t-de-student]] y la [[distribucion-f-de-snedecor]] (cocientes) y la [[distribucion-lognormal]] (exponencial de una normal). Aparece como límite de la [[distribucion-binomial]] y de la [[distribucion-de-poisson]] cuando sus varianzas son grandes.

## Formulario

:::formula[Densidad]
$$
f(x) = \frac{1}{\sigma\sqrt{2\pi}}\exp\!\left(-\frac{(x - \mu)^{2}}{2\sigma^{2}}\right)
$$

- $\mu$: media.
- $\sigma$: desviación estándar.
- $x$: valor real.
:::

:::formula[Función de distribución]
$$
F(x) = \Phi\!\left(\frac{x - \mu}{\sigma}\right), \qquad \Phi(z) = \int_{-\infty}^{z}\frac{1}{\sqrt{2\pi}}e^{-t^{2}/2}\,dt
$$

- $\Phi$: función de distribución de la normal estándar.
- $t$: variable de integración.
:::

:::formula[Transformación lineal]
$$
aX + b \sim \mathcal{N}(a\mu + b,\ a^{2}\sigma^{2})
$$

- $a \ne 0$, $b$: constantes reales.
:::

:::formula[Suma de normales independientes]
$$
X + Y \sim \mathcal{N}(\mu_1 + \mu_2,\ \sigma_1^{2} + \sigma_2^{2})
$$

- $\mu_1$, $\mu_2$: medias.
- $\sigma_1^{2}$, $\sigma_2^{2}$: varianzas, que se suman.
:::

:::formula[Cuantil]
$$
x_p = \mu + \sigma\,z_p, \qquad z_p = \Phi^{-1}(p)
$$

- $p$: probabilidad acumulada.
- $z_p$: cuantil de la normal estándar, por ejemplo $z_{0.95} \approx 1.645$.
:::
