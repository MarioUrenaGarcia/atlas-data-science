---
id: normal-estandar-y-puntuacion-z
titulo: Normal estándar y puntuación z
titulo_en: Standard normal and z-score
alias:
  - puntuación z
  - estandarización
  - z-score
  - normal estándar
modulo: 2
submodulo: '2.2'
orden: 3
nivel: basico
prerrequisitos:
  - distribucion-normal
relaciones:
  - tipo: caso-particular
    id: distribucion-normal
etiquetas:
  - estandarización
  - tablas normales
  - comparación de escalas
  - percentiles
resumen: >
  La normal estándar tiene media 0 y varianza 1. La puntuación z, (x - μ)/σ, mide cuántas desviaciones
  estándar se aleja un valor de la media y lleva cualquier normal a la estándar.
formula: 'Z = \frac{X - \mu}{\sigma} \sim \mathcal{N}(0, 1)'
visualizacion:
  componente: DistributionStudio
  parametros:
    explorador:
      distribucion: normal
      valores:
        mu: 0
        sigma: 1
      fijos: [mu, sigma]
      region: intervalo
      desde: -1.5
      hasta: 1.5
      probabilidad: 0.975
      casos:
        - nombre: '95 % central'
          descripcion: 'El intervalo de -1.96 a 1.96 contiene el 95 % del área: es el que usan los intervalos de confianza al 95 %.'
          valores: {}
          region: intervalo
          desde: -1.96
          hasta: 1.96
        - nombre: 'Cola del 5 %'
          descripcion: 'A la derecha de 1.645 queda el 5 %: el valor crítico de una prueba de una cola al 5 %.'
          valores: {}
          region: derecha
          desde: 1.645
        - nombre: 'Colas del 1 %'
          descripcion: 'Fuera de ±2.576 queda el 1 % repartido en dos colas de 0.5 %.'
          valores: {}
          region: colas
          desde: -2.576
          hasta: 2.576
      ejemplo:
        titulo: 'Percentil en matemáticas'
        contexto: 'La calificación de 85 en un examen con media 72 y desviación 10 equivale a z = 1.3.'
        pregunta: '¿Qué proporción del grupo obtuvo una calificación menor?'
        valores: {}
        region: izquierda
        desde: 1.3
referencias:
  - clave: blitzstein-hwang
    capitulo: '5'
  - clave: degroot
    capitulo: '5'
publicado: true
---

## Intuición

Una estudiante obtiene 85 puntos en un examen de matemáticas y 78 en uno de historia. ¿En cuál le fue mejor? Las calificaciones no se pueden comparar directamente: el examen de historia pudo ser más difícil o tener calificaciones más concentradas. Lo que importa es qué tan arriba quedó respecto a su grupo en cada examen.

La puntuación z resuelve la comparación midiendo la distancia a la media en unidades de desviación estándar. Si la media de matemáticas fue 72 con desviación 10, los 85 puntos están 1.3 desviaciones arriba; si la media de historia fue 65 con desviación 6, los 78 puntos están 2.17 desviaciones arriba. En historia destacó más.

Cuando los datos son normales, convertir a puntuaciones z produce siempre la misma distribución: la normal estándar, con media 0 y desviación 1. Por eso basta una sola tabla, la de la normal estándar, para calcular probabilidades de cualquier normal: se estandariza el valor y se consulta la tabla. La puntuación z también sirve fuera de la normalidad para describir posiciones relativas, aunque entonces las probabilidades de la tabla dejan de ser exactas.

## Definición

:::definicion[Normal estándar]
La **normal estándar** es $\mathcal{N}(0, 1)$, con densidad $\varphi(z) = \frac{1}{\sqrt{2\pi}} e^{-z^{2}/2}$ y función de distribución $\Phi(z) = \int_{-\infty}^{z} \varphi(t)\,dt$.
:::

:::definicion[Puntuación z]
La **puntuación z** de un valor $x$ respecto a una población con media $\mu$ y desviación estándar $\sigma$ es
$$
z = \frac{x - \mu}{\sigma}.
$$
:::

:::teorema[Estandarización]
Si $X \sim \mathcal{N}(\mu, \sigma^{2})$, entonces $Z = (X - \mu)/\sigma \sim \mathcal{N}(0, 1)$ y $P(X \le x) = \Phi\!\left(\frac{x - \mu}{\sigma}\right)$.
:::

:::nota[Qué significa cada símbolo]
- $Z$: variable normal estándar.
- $z$: puntuación de un valor particular.
- $x$: valor original, en sus unidades.
- $\mu$, $\sigma$: media y desviación estándar de la población.
- $\varphi(z)$: densidad de la normal estándar.
- $\Phi(z)$: probabilidad acumulada hasta $z$.
- $t$: variable de integración.
:::

## Cómo usar la visualización

La curva es la normal estándar, con media 0 y desviación 1 fijas. El selector elige la región: entre $a$ y $b$, hasta $a$, desde $a$ o las dos colas, y el panel da su probabilidad; la línea punteada marca el cuantil de la probabilidad acumulada elegida. Los casos cargan las regiones más usadas en inferencia y el ejemplo de la ficha se carga con su botón.

El caso del 95 % central da 0.95 entre $\pm 1.96$. Al cambiar la región a las colas con los mismos límites, la probabilidad es 0.05. En la vista de función de distribución se lee $\Phi(z)$ directamente, y por simetría $\Phi(-z) = 1 - \Phi(z)$.

## Ejemplo

En matemáticas la media fue 72 y la desviación 10; en historia, 65 y 6. Ambos grupos tienen calificaciones aproximadamente normales.

1. Puntuación en matemáticas: $z_M = (85 - 72)/10 = 1.3$.
2. Puntuación en historia: $z_H = (78 - 65)/6 \approx 2.17$.
3. Percentil en matemáticas: $\Phi(1.3) \approx 0.903$; superó al 90.3 % del grupo.
4. Percentil en historia: $\Phi(2.17) \approx 0.985$; superó al 98.5 %. En términos relativos, el resultado de historia es mejor.

:::figura[Matemáticas: la calificación 85 equivale a z = 1.3, que deja a su izquierda el 90.3 % del área de la normal estándar.]{componente="DistributionExplorer"}
```yaml
distribucion: normal
valores:
  mu: 0
  sigma: 1
fijos: [mu, sigma]
region: izquierda
desde: 1.3
probabilidad: 0.975
ejemplo:
  titulo: 'Percentil en matemáticas'
  contexto: 'La calificación de 85 en un examen con media 72 y desviación 10 equivale a z = 1.3.'
  pregunta: '¿Qué proporción del grupo obtuvo una calificación menor?'
  valores: {}
  region: izquierda
  desde: 1.3
muestras: false
```
:::

:::figura[Historia: la calificación 78 en N(65, 6²) deja a su izquierda el 98.5 %. La campana es más angosta, así que la misma distancia en puntos vale más desviaciones.]{componente="DistributionExplorer"}
```yaml
distribucion: normal
valores:
  mu: 65
  sigma: 6
rangos:
  mu: [40, 100]
  sigma: [2, 20]
dominio: [30, 110]
desde: 30
hasta: 78
muestras: false
```
:::

## Propiedades

- **Media y varianza de z:** cualquier conjunto de valores estandarizados tiene media 0 y desviación 1, sea normal o no.
- **Simetría:** $\Phi(-z) = 1 - \Phi(z)$ y $P(|Z| \le z) = 2\Phi(z) - 1$.
- **Cuantiles usuales:** $z_{0.90} \approx 1.282$, $z_{0.95} \approx 1.645$, $z_{0.975} \approx 1.960$, $z_{0.995} \approx 2.576$.
- **Regreso a las unidades:** $x = \mu + z\sigma$; el cuantil $p$ de cualquier normal es $\mu + z_p\sigma$.
- **Invarianza:** la puntuación z no depende de las unidades; medir en centímetros o en pulgadas da el mismo $z$.

:::figura[Tres casos con contexto (95 % central, cola del 5 %, colas del 1 %): cada botón carga los parámetros y una frase explica por qué la forma es así.]{componente="DistributionExplorer"}
```yaml
distribucion: normal
valores:
  mu: 0
  sigma: 1
fijos: [mu, sigma]
region: intervalo
desde: -1.5
hasta: 1.5
probabilidad: 0.975
casos:
  - nombre: '95 % central'
    descripcion: 'El intervalo de -1.96 a 1.96 contiene el 95 % del área: es el que usan los intervalos de confianza al 95 %.'
    valores: {}
    region: intervalo
    desde: -1.96
    hasta: 1.96
  - nombre: 'Cola del 5 %'
    descripcion: 'A la derecha de 1.645 queda el 5 %: el valor crítico de una prueba de una cola al 5 %.'
    valores: {}
    region: derecha
    desde: 1.645
  - nombre: 'Colas del 1 %'
    descripcion: 'Fuera de ±2.576 queda el 1 % repartido en dos colas de 0.5 %.'
    valores: {}
    region: colas
    desde: -2.576
    hasta: 2.576
```
:::

:::figura[Cuantil 0.975: deja 2.5 % en la cola derecha y vale 1.96. Por simetría, -1.96 deja 2.5 % en la izquierda.]{componente="DistributionExplorer"}
```yaml
distribucion: normal
valores:
  mu: 0
  sigma: 1
fijos: [mu, sigma]
vista: acumulada
probabilidad: 0.975
muestras: false
```
:::

:::figura[Simetría: el área a la izquierda de -1.3 (sombreada) es igual al área a la derecha de 1.3, 0.097.]{componente="DistributionExplorer"}
```yaml
distribucion: normal
valores:
  mu: 0
  sigma: 1
fijos: [mu, sigma]
desde: -4
hasta: -1.3
muestras: false
```
:::

## Errores comunes

- **Olvidar dividir entre σ.** $x - \mu$ es una distancia en unidades originales; sin dividir no se puede comparar con la tabla.
- **Dividir entre la varianza.** Con $\sigma^{2} = 100$ se divide entre 10, no entre 100.
- **Leer la tabla como probabilidad de la cola derecha.** $\Phi(1.3) = 0.903$ es la probabilidad de estar por debajo; por encima es $0.097$.
- **Usar las probabilidades normales con datos muy asimétricos.** La puntuación z sigue describiendo la posición, pero $\Phi(z)$ ya no da el percentil correcto.

:::figura[Por encima frente a por debajo: con z = 1.3, el área sombreada a la derecha es 0.097, no 0.903.]{componente="DistributionExplorer"}
```yaml
distribucion: normal
valores:
  mu: 0
  sigma: 1
fijos: [mu, sigma]
desde: 1.3
hasta: 4
muestras: false
```
:::

## Conexiones

La normal estándar es el caso $\mu = 0$, $\sigma = 1$ de la [[distribucion-normal]], y la estandarización permite pasar de una a otra. Sus áreas más usadas se resumen en la [[regla-empirica-68-95-99-7]]. Las sumas de cuadrados de normales estándar dan la [[distribucion-chi-cuadrada]], y el cociente entre una normal estándar y la raíz de una chi-cuadrada da la [[distribucion-t-de-student]]. La puntuación z reaparece en las pruebas de hipótesis y en la estandarización de variables antes de comparar o combinar escalas.

## Formulario

:::formula[Puntuación z]
$$
z = \frac{x - \mu}{\sigma}
$$

- $x$: valor original.
- $\mu$: media de la población.
- $\sigma$: desviación estándar.
:::

:::formula[Densidad y distribución estándar]
$$
\varphi(z) = \frac{1}{\sqrt{2\pi}}e^{-z^{2}/2}, \qquad \Phi(z) = \int_{-\infty}^{z}\varphi(t)\,dt
$$

- $\varphi$: densidad de $\mathcal{N}(0, 1)$.
- $\Phi$: función de distribución.
:::

:::formula[Estandarización]
$$
P(X \le x) = \Phi\!\left(\frac{x - \mu}{\sigma}\right)
$$

- $X \sim \mathcal{N}(\mu, \sigma^{2})$.
:::

:::formula[Simetría]
$$
\Phi(-z) = 1 - \Phi(z), \qquad P(|Z| \le z) = 2\Phi(z) - 1
$$

- $Z \sim \mathcal{N}(0, 1)$.
:::

:::formula[Cuantil en unidades originales]
$$
x_p = \mu + z_p\,\sigma
$$

- $z_p$: cuantil $p$ de la normal estándar.
:::
