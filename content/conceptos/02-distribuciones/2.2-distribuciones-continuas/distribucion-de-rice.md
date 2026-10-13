---
id: distribucion-de-rice
titulo: Distribución de Rice
titulo_en: Rice distribution
alias:
  - Rice
  - distribución de Rician
  - Rician fading
modulo: 2
submodulo: '2.2'
orden: 22
nivel: avanzado
prerrequisitos:
  - distribucion-de-rayleigh
relaciones:
  - tipo: generaliza
    id: distribucion-de-rayleigh
etiquetas:
  - magnitud de un vector
  - señal y ruido
  - comunicaciones inalámbricas
  - resonancia magnética
resumen: >
  Distribución de la distancia al origen de un punto normal bidimensional cuyo centro está a distancia
  ν del origen. Describe la amplitud de una señal fija más ruido, y con ν = 0 es la Rayleigh.
formula: 'f(r) = \frac{r}{\sigma^{2}}\exp\!\left(-\frac{r^{2} + \nu^{2}}{2\sigma^{2}}\right) I_0\!\left(\frac{r\nu}{\sigma^{2}}\right)'
visualizacion:
  componente: DistributionStudio
  parametros:
    explorador:
      distribucion: rice
      valores:
        nu: 3
        sigma: 1
      dominio: [0, 10]
      casos:
        - nombre: 'Sin línea de vista'
          descripcion: 'ν = 0: solo hay ruido y la amplitud es Rayleigh; los desvanecimientos profundos son frecuentes.'
          valores: {nu: 0, sigma: 1}
        - nombre: 'Línea de vista'
          descripcion: 'ν = 3 y σ = 1: la señal directa domina; la amplitud se agrupa alrededor de 3 y casi nunca cae a cero.'
          valores: {nu: 3, sigma: 1}
        - nombre: 'Señal muy fuerte'
          descripcion: 'ν = 6: con señal mucho mayor que el ruido la Rice es casi una normal centrada en 6 con desviación 1.'
          valores: {nu: 6, sigma: 1}
      ejemplo:
        titulo: 'Desvanecimiento'
        contexto: 'La amplitud recibida por una antena con línea de vista sigue una Rice con ν = 3 y σ = 1.'
        pregunta: '¿Qué probabilidad hay de que la amplitud caiga por debajo de 1.5, el umbral de corte del receptor?'
        valores: {nu: 3, sigma: 1}
        region: izquierda
        desde: 1.5
      referencia:
        distribucion: rayleigh
        valores: {sigma: 1}
        etiqueta: 'Sin línea de vista (Rayleigh)'
        visible: true
    genesis:
      componente: ContinuousGenesis
      parametros:
        proceso: distancia
        valores:
          nu: 3
          sigma: 1
referencias:
  - clave: ross-probabilidad
publicado: true
---

## Intuición

Una antena recibe dos cosas a la vez: la señal que llega directo desde el transmisor, que tiene una amplitud fija, y una mezcla de ecos que rebotan en edificios y se suman como ruido aleatorio en dos componentes. La señal recibida es un vector: la flecha fija de la señal directa más una perturbación normal en cada eje. Su amplitud, la longitud de esa suma, sigue una distribución de Rice.

Si no hay señal directa, la flecha fija desaparece y la amplitud es Rayleigh: los desvanecimientos profundos, cuando los ecos se cancelan, son frecuentes. Si la señal directa es fuerte comparada con el ruido, la amplitud se agrupa alrededor de su valor y casi nunca se acerca a cero. La Rice cubre todo el camino entre esos dos extremos.

El mismo modelo aparece en imágenes de resonancia magnética, donde la magnitud de cada píxel combina la señal del tejido y ruido en dos canales, y en el análisis de la precisión de disparos alrededor de un blanco desplazado.

## Definición

:::definicion[Distribución de Rice]
Si $X \sim \mathcal{N}(\nu, \sigma^{2})$ y $Y \sim \mathcal{N}(0, \sigma^{2})$ son independientes, la distancia $R = \sqrt{X^{2} + Y^{2}}$ tiene **distribución de Rice** con parámetros $\nu \ge 0$ y $\sigma > 0$:
$$
f(r) = \frac{r}{\sigma^{2}}\exp\!\left(-\frac{r^{2} + \nu^{2}}{2\sigma^{2}}\right) I_0\!\left(\frac{r\nu}{\sigma^{2}}\right), \qquad r \ge 0,
$$
donde $I_0(z) = \sum_{m \ge 0} \frac{(z/2)^{2m}}{(m!)^{2}}$ es la función de Bessel modificada de orden cero.
:::

La razón $K = \nu^{2}/(2\sigma^{2})$, cociente entre la potencia de la señal directa y la del ruido, se llama factor $K$ en comunicaciones.

:::nota[Qué representa la variable]
$R$ = la amplitud de una señal fija más ruido normal en dos dimensiones.
:::

:::nota[Qué hace cada parámetro]
- **$\nu$, amplitud de la señal:** la distancia del centro de la nube al origen. Si aumenta, la curva se aleja del cero y se vuelve más simétrica.
- **$\sigma$, ruido:** la desviación del ruido en cada componente. Si aumenta, la curva se ensancha y, con señal débil, se parece a una Rayleigh.
:::

:::nota[Qué significa cada símbolo]
- $R$: amplitud, o distancia al origen.
- $\nu$: distancia del centro de la nube al origen, la amplitud de la señal fija.
- $\sigma$: desviación del ruido en cada componente.
- $X$, $Y$: componentes normales independientes.
- $I_0$: función de Bessel modificada de orden cero.
- $K$: factor de Rice, potencia de señal entre potencia de ruido.
:::

## Cómo usar la visualización

La pestaña Distribución muestra la densidad de Rice junto a la Rayleigh sin señal directa (línea punteada), la región elegida y su probabilidad; los casos cargan sin línea de vista, con línea de vista y con señal muy fuerte, y el ejemplo de la ficha se carga con su botón. La pestaña Ver cómo surge dibuja puntos normales alrededor de un centro a distancia $\nu$ del origen y registra su distancia.

Al subir $\nu$ la masa se aleja del cero y la forma se vuelve simétrica. La región hasta 1.5 mide la probabilidad de un corte de señal: es mucho menor con línea de vista que sin ella.

## Ejemplo

La amplitud recibida por una antena con línea de vista sigue una Rice con $\nu = 3$ y $\sigma = 1$; el receptor pierde la señal si la amplitud cae por debajo de 1.5.

1. Factor $K = 9/2 = 4.5$: la señal directa tiene 4.5 veces la potencia del ruido.
2. Probabilidad de corte: $P(R < 1.5) \approx 0.041$.
3. Sin línea de vista ($\nu = 0$), la amplitud sería Rayleigh y $P(R < 1.5) = 1 - e^{-1.125} \approx 0.675$.
4. Amplitud media con línea de vista: alrededor de 3.17, un poco mayor que $\nu$ porque el ruido siempre suma magnitud.

:::figura[Desvanecimiento: la región hasta 1.5 tiene probabilidad 0.041 con línea de vista; la Rayleigh sin señal directa (línea punteada) pondría ahí 0.675. El botón carga el ejemplo.]{componente="DistributionExplorer"}
```yaml
distribucion: rice
valores:
  nu: 3
  sigma: 1
dominio: [0, 10]
ejemplo:
  titulo: 'Desvanecimiento'
  contexto: 'La amplitud recibida por una antena con línea de vista sigue una Rice con ν = 3 y σ = 1.'
  pregunta: '¿Qué probabilidad hay de que la amplitud caiga por debajo de 1.5?'
  valores: {nu: 3, sigma: 1}
  region: izquierda
  desde: 1.5
region: izquierda
desde: 1.5
muestras: false
referencia:
  distribucion: rayleigh
  valores:
    sigma: 1
  etiqueta: Sin línea de vista (Rayleigh)
```
:::

## Propiedades

- **Segundo momento:** $\mathbb{E}[R^{2}] = 2\sigma^{2} + \nu^{2}$.
- **Media:** $\sigma\sqrt{\pi/2}\,L_{1/2}\!\left(-\frac{\nu^{2}}{2\sigma^{2}}\right)$, con $L_{1/2}$ un polinomio de Laguerre; siempre mayor que $\nu$.
- **Caso ν = 0:** es la Rayleigh con escala $\sigma$.
- **Señal fuerte:** si $\nu \gg \sigma$, $R \approx \mathcal{N}(\nu, \sigma^{2})$.
- **Relación con la chi-cuadrada:** $R^{2}/\sigma^{2}$ es una chi-cuadrada no central con 2 grados de libertad y no centralidad $\nu^{2}/\sigma^{2}$.
- **Invarianza de rotación:** solo importa la distancia del centro al origen, no su dirección.

:::figura[Tres casos con contexto (sin línea de vista, con línea de vista y señal muy fuerte): cada botón carga los parámetros y una frase explica por qué la forma es así.]{componente="DistributionExplorer"}
```yaml
distribucion: rice
valores:
  nu: 3
  sigma: 1
dominio: [0, 10]
casos:
  - nombre: 'Sin línea de vista'
    descripcion: 'ν = 0: es la Rayleigh, con mucha masa cerca de cero.'
    valores: {nu: 0, sigma: 1}
  - nombre: 'Línea de vista'
    descripcion: 'ν = 3: se agrupa alrededor de 3.'
    valores: {nu: 3, sigma: 1}
  - nombre: 'Señal muy fuerte'
    descripcion: 'ν = 6: casi una normal centrada en 6.'
    valores: {nu: 6, sigma: 1}
muestras: false
```
:::

:::figura[Construcción en el plano: los puntos rodean el centro (3, 0) y el círculo por cada punto mide su distancia al origen.]{componente="ContinuousGenesis"}
```yaml
proceso: distancia
valores:
  nu: 3
  sigma: 1
```
:::

## Errores comunes

- **Tomar la amplitud promedio como la señal.** La media de $R$ es mayor que $\nu$; con poca señal, el ruido infla la amplitud observada.
- **Usar la Rayleigh cuando hay línea de vista.** Sobreestima mucho la probabilidad de cortes.
- **Usar la normal cuando la señal es débil.** Con $\nu$ comparable a $\sigma$ la Rice es asimétrica y no puede ser negativa.
- **Confundir ν con el factor K.** $K$ es un cociente de potencias, $\nu^{2}/(2\sigma^{2})$, no la amplitud.

:::figura[Señal débil: con ν = 1 la Rice (curva) es asimétrica y muy distinta de una normal centrada en 1, que pondría probabilidad en amplitudes negativas.]{componente="DistributionExplorer"}
```yaml
distribucion: rice
valores:
  nu: 1
  sigma: 1
dominio: [-3, 5]
muestras: false
referencia:
  distribucion: normal
  valores:
    mu: 1
    sigma: 1
  etiqueta: Normal centrada en ν
```
:::

## Conexiones

La Rice generaliza la [[distribucion-de-rayleigh]] al caso con señal fija, y su cuadrado reescalado es una [[distribucion-chi-cuadrada-no-central]] con dos grados de libertad. Con señal fuerte se aproxima por la [[distribucion-normal]]. Es el modelo estándar de desvanecimiento en comunicaciones inalámbricas con línea de vista. El [[mapa-de-relaciones-entre-distribuciones]] la sitúa entre las demás distribuciones.

## Formulario

:::formula[Densidad]
$$
f(r) = \frac{r}{\sigma^{2}}\exp\!\left(-\frac{r^{2} + \nu^{2}}{2\sigma^{2}}\right) I_0\!\left(\frac{r\nu}{\sigma^{2}}\right)
$$

- $\nu$: distancia del centro al origen.
- $\sigma$: ruido por componente.
- $I_0$: función de Bessel modificada de orden cero.
:::

:::formula[Construcción]
$$
R = \sqrt{X^{2} + Y^{2}}, \qquad X \sim \mathcal{N}(\nu, \sigma^{2}),\ Y \sim \mathcal{N}(0, \sigma^{2})
$$

- $X$, $Y$: componentes independientes.
:::

:::formula[Segundo momento y factor K]
$$
\mathbb{E}[R^{2}] = 2\sigma^{2} + \nu^{2}, \qquad K = \frac{\nu^{2}}{2\sigma^{2}}
$$

- $K$: cociente de potencias de señal y ruido.
:::

:::formula[Función de Bessel modificada]
$$
I_0(z) = \sum_{m=0}^{\infty} \frac{(z/2)^{2m}}{(m!)^{2}}
$$

- $m$: índice de la serie.
:::
