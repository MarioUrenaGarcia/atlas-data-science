---
id: distribucion-normal-truncada
titulo: Distribución normal truncada
titulo_en: Truncated normal distribution
alias:
  - normal truncada
  - normal recortada
  - truncated normal
modulo: 2
submodulo: '2.2'
orden: 25
nivel: intermedio
prerrequisitos:
  - distribucion-normal
relaciones:
  - tipo: caso-particular
    id: distribucion-normal
etiquetas:
  - distribución continua
  - truncamiento
  - selección
  - límites físicos
resumen: >
  Es una normal restringida a un intervalo [a, b] y reescalada para que su área sea uno. Describe
  mediciones con límites físicos y poblaciones seleccionadas por un umbral, como los aspirantes admitidos.
formula: 'f(x) = \frac{\varphi\!\left(\frac{x - \mu}{\sigma}\right)}{\sigma\left[\Phi(\beta) - \Phi(\alpha)\right]}, \quad a \le x \le b'
visualizacion:
  componente: DistributionStudio
  parametros:
    explorador:
      distribucion: normal-truncada
      valores:
        mu: 70
        sigma: 12
        a: 60
        b: 140
      rangos:
        mu: [40, 100]
        sigma: [2, 20]
        a: [0, 100]
        b: [0, 140]
      dominio: [30, 110]
      casos:
        - nombre: 'Aspirantes admitidos'
          descripcion: 'Normal(70, 12²) con corte inferior en 60: solo se admite desde 60 puntos; la densidad empieza alta en el corte y luego decae.'
          valores: {mu: 70, sigma: 12, a: 60, b: 140}
        - nombre: 'Examen con tope'
          descripcion: 'Normal(85, 10²) recortada en 100: nadie puede pasar de 100, así que la masa que quedaba arriba se reparte en el resto.'
          valores: {mu: 85, sigma: 10, a: 0, b: 100}
        - nombre: 'Pieza con tolerancias'
          descripcion: 'Normal(70, 12²) entre 55 y 85: se descartan las piezas fuera de tolerancia por ambos lados y queda una campana cortada.'
          valores: {mu: 70, sigma: 12, a: 55, b: 85}
      ejemplo:
        titulo: 'Puntajes de admitidos'
        contexto: 'Los puntajes de los aspirantes siguen una normal con media 70 y desviación 12, y solo se admite a quienes obtienen 60 o más.'
        pregunta: '¿Qué proporción de los admitidos obtuvo más de 80 puntos?'
        valores: {mu: 70, sigma: 12, a: 60, b: 140}
        region: derecha
        desde: 80
      referencia:
        distribucion: normal
        valores: {mu: 70, sigma: 12}
        etiqueta: 'Normal original, sin truncar'
        visible: true
    genesis:
      componente: ContinuousGenesis
      parametros:
        proceso: truncamiento
        valores:
          mu: 0
          sigma: 1
          a: 0
          b: 5
referencias:
  - clave: casella-berger
  - clave: gelman-bda
publicado: true
---

## Intuición

Los puntajes de un examen de admisión siguen una campana con media 70, pero la universidad solo admite a quienes obtienen 60 o más. La distribución de los puntajes de los admitidos no es la campana original: es la parte de la campana a la derecha de 60, estirada hacia arriba para que vuelva a representar el cien por ciento de los admitidos. Esa es una normal truncada.

Truncar no es lo mismo que mover o encoger la campana. Dentro del intervalo permitido, la forma es exactamente la de la normal original; lo único que cambia es la altura, que se multiplica por el mismo factor en todos los puntos. Por eso la densidad salta de golpe en los cortes y la media se desplaza hacia el lado que no se recortó.

Aparece siempre que hay selección por umbral o límites físicos: pesos que no pueden ser negativos, piezas que pasan un control de tolerancias, temperaturas de un proceso con alarmas o variables latentes en modelos de respuesta binaria.

## Definición

:::definicion[Distribución normal truncada]
Sea $X \sim \mathcal{N}(\mu, \sigma^{2})$ y sean $a < b$ (posiblemente $a = -\infty$ o $b = \infty$). La distribución de $X$ condicionada a $a \le X \le b$ tiene densidad
$$
f(x) = \frac{\varphi\!\left(\frac{x - \mu}{\sigma}\right)}{\sigma\,[\Phi(\beta) - \Phi(\alpha)]}, \qquad a \le x \le b,
$$
con $\alpha = (a - \mu)/\sigma$ y $\beta = (b - \mu)/\sigma$.
:::

:::nota[Qué significa cada símbolo]
- $\mu$, $\sigma$: media y desviación de la normal original, no de la truncada.
- $a$, $b$: límites del intervalo permitido.
- $\alpha$, $\beta$: límites estandarizados.
- $\varphi$, $\Phi$: densidad y distribución de la normal estándar.
- $\Phi(\beta) - \Phi(\alpha)$: probabilidad que la normal original deja dentro del intervalo; es el factor de reescalamiento.
:::

## Cómo usar la visualización

La pestaña Distribución muestra la densidad truncada junto a la normal original (línea punteada), la región elegida y su probabilidad; los casos cargan un corte inferior, un tope superior y un corte por ambos lados, y el ejemplo de la ficha se carga con su botón. La pestaña Ver cómo surge sortea normales y descarta las que caen fuera del intervalo; las aceptadas forman el histograma.

Al acercar el corte $a$ a la media, la densidad truncada se separa más de la original y la media sube. Con límites muy lejanos las dos curvas coinciden.

## Ejemplo

Los puntajes siguen $\mathcal{N}(70, 12^{2})$ y solo se admite desde 60 puntos.

1. Proporción de aspirantes admitidos: $1 - \Phi\!\left(\frac{60 - 70}{12}\right) = 1 - \Phi(-0.833) \approx 0.798$.
2. Media de los admitidos: $\mu + \sigma\frac{\varphi(\alpha)}{1 - \Phi(\alpha)} = 70 + 12\cdot\frac{0.282}{0.798} \approx 74.2$.
3. Proporción de admitidos con más de 80: $\frac{1 - \Phi(0.833)}{0.798} = \frac{0.202}{0.798} \approx 0.254$.
4. La desviación de los admitidos baja de 12 a unos 9.1 puntos.

:::figura[Puntajes de admitidos: el área sombreada a la derecha de 80 vale 0.254; la línea punteada es la normal antes del corte. El botón carga el ejemplo.]{componente="DistributionExplorer"}
```yaml
distribucion: normal-truncada
valores:
  mu: 70
  sigma: 12
  a: 60
  b: 140
rangos:
  mu: [40, 100]
  sigma: [2, 20]
  a: [0, 100]
  b: [0, 140]
dominio: [30, 110]
ejemplo:
  titulo: 'Puntajes de admitidos'
  contexto: 'Los puntajes siguen una normal con media 70 y desviación 12, y solo se admite desde 60.'
  pregunta: '¿Qué proporción de los admitidos obtuvo más de 80 puntos?'
  valores: {mu: 70, sigma: 12, a: 60, b: 140}
  region: derecha
  desde: 80
region: derecha
desde: 80
muestras: false
referencia:
  distribucion: normal
  valores:
    mu: 70
    sigma: 12
  etiqueta: Normal original
```
:::

## Propiedades

- **Media:** $\mu + \sigma\frac{\varphi(\alpha) - \varphi(\beta)}{\Phi(\beta) - \Phi(\alpha)}$.
- **Varianza:** $\sigma^{2}\left[1 + \frac{\alpha\varphi(\alpha) - \beta\varphi(\beta)}{\Phi(\beta) - \Phi(\alpha)} - \left(\frac{\varphi(\alpha) - \varphi(\beta)}{\Phi(\beta) - \Phi(\alpha)}\right)^{2}\right]$, siempre menor que $\sigma^{2}$.
- **Forma conservada:** dentro de $[a, b]$ la densidad es proporcional a la normal original.
- **Media normal:** con $\mu = 0$, $\sigma = 1$ y $a = 0$, $b = \infty$ se obtiene la seminormal, con media $\sqrt{2/\pi} \approx 0.80$.
- **Simulación:** por rechazo (sortear normales y descartar las de fuera) o por inversión, con $\mu + \sigma\Phi^{-1}(\Phi(\alpha) + U[\Phi(\beta) - \Phi(\alpha)])$.

:::figura[Tres casos con contexto (aspirantes admitidos, examen con tope y pieza con tolerancias): cada botón carga los parámetros y una frase explica por qué la forma es así.]{componente="DistributionExplorer"}
```yaml
distribucion: normal-truncada
valores:
  mu: 70
  sigma: 12
  a: 60
  b: 140
rangos:
  mu: [40, 100]
  sigma: [2, 20]
  a: [0, 100]
  b: [0, 140]
dominio: [30, 110]
casos:
  - nombre: 'Aspirantes admitidos'
    descripcion: 'Corte inferior en 60: salto en el corte y media que sube.'
    valores: {mu: 70, sigma: 12, a: 60, b: 140}
  - nombre: 'Examen con tope'
    descripcion: 'Tope en 100: la masa de arriba se reparte en el resto.'
    valores: {mu: 85, sigma: 10, a: 0, b: 100}
  - nombre: 'Pieza con tolerancias'
    descripcion: 'Corte en 55 y 85: campana cortada por ambos lados.'
    valores: {mu: 70, sigma: 12, a: 55, b: 85}
muestras: false
```
:::

:::figura[Seminormal por rechazo: se sortean normales estándar y se descartan las negativas; las aceptadas forman la mitad derecha de la campana, con altura doble.]{componente="ContinuousGenesis"}
```yaml
proceso: truncamiento
valores:
  mu: 0
  sigma: 1
  a: 0
  b: 5
```
:::

## Errores comunes

- **Leer μ y σ como la media y la desviación de los datos.** Son parámetros de la normal original; los datos truncados tienen otra media y menor desviación.
- **Estimar μ con el promedio de los datos truncados.** Ese promedio está sesgado hacia el lado no recortado.
- **Confundir truncamiento con censura.** En la censura se sabe que hubo un valor fuera del límite aunque no se conozca; en el truncamiento esos casos ni siquiera se observan.
- **Usar la simulación por rechazo con cortes extremos.** Si el intervalo tiene probabilidad pequeña, casi todas las normales se descartan; conviene la inversión.

:::figura[Corte lejos de la media: con a = 2.5 en una normal estándar casi todo se descarta; el rechazo se vuelve muy lento.]{componente="ContinuousGenesis"}
```yaml
proceso: truncamiento
valores:
  mu: 0
  sigma: 1
  a: 2.5
  b: 5
```
:::

## Conexiones

La normal truncada es una [[distribucion-normal]] condicionada a un intervalo. Con un solo corte en la media es la seminormal, relacionada con el valor absoluto de una normal. Aparece en los modelos de selección muestral, en el modelo probit como variable latente y en la estadística bayesiana cuando un parámetro tiene restricciones de signo.

## Formulario

:::formula[Densidad]
$$
f(x) = \frac{\varphi\!\left(\frac{x - \mu}{\sigma}\right)}{\sigma\,[\Phi(\beta) - \Phi(\alpha)]}, \qquad \alpha = \frac{a - \mu}{\sigma},\ \beta = \frac{b - \mu}{\sigma}
$$

- $\mu$, $\sigma$: parámetros de la normal original.
- $a$, $b$: límites.
:::

:::formula[Media]
$$
\mathbb{E}[X] = \mu + \sigma\frac{\varphi(\alpha) - \varphi(\beta)}{\Phi(\beta) - \Phi(\alpha)}
$$

- $\varphi$, $\Phi$: densidad y distribución normal estándar.
:::

:::formula[Varianza]
$$
\operatorname{Var}(X) = \sigma^{2}\left[1 + \frac{\alpha\varphi(\alpha) - \beta\varphi(\beta)}{\Phi(\beta) - \Phi(\alpha)} - \left(\frac{\varphi(\alpha) - \varphi(\beta)}{\Phi(\beta) - \Phi(\alpha)}\right)^{2}\right]
$$

- Es menor que la varianza original.
:::

:::formula[Simulación por inversión]
$$
X = \mu + \sigma\,\Phi^{-1}\big(\Phi(\alpha) + U[\Phi(\beta) - \Phi(\alpha)]\big), \qquad U \sim U(0, 1)
$$

- $\Phi^{-1}$: cuantil normal estándar.
:::
