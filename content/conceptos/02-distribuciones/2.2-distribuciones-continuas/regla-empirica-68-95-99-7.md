---
id: regla-empirica-68-95-99-7
titulo: Regla empírica 68-95-99.7
titulo_en: 68-95-99.7 rule
alias:
  - regla empírica
  - regla de las tres sigmas
  - empirical rule
modulo: 2
submodulo: '2.2'
orden: 4
nivel: basico
prerrequisitos:
  - normal-estandar-y-puntuacion-z
etiquetas:
  - distribución normal
  - desviaciones estándar
  - valores atípicos
  - control de calidad
resumen: >
  En una distribución normal, cerca del 68 % de los valores cae a menos de una desviación estándar de la
  media, el 95 % a menos de dos y el 99.7 % a menos de tres.
formula: 'P(|X - \mu| \le k\sigma) \approx 0.683,\ 0.954,\ 0.997 \quad (k = 1, 2, 3)'
visualizacion:
  componente: DistributionStudio
  parametros:
    explorador:
      distribucion: normal
      valores:
        mu: 30
        sigma: 4
      rangos:
        mu: [10, 50]
        sigma: [1, 10]
      dominio: [10, 50]
      region: intervalo
      desde: 26
      hasta: 34
      casos:
        - nombre: 'Una desviación'
          descripcion: 'De 26 a 34 minutos, la media más o menos una desviación: contiene el 68.3 % de las entregas.'
          valores: {mu: 30, sigma: 4}
          region: intervalo
          desde: 26
          hasta: 34
        - nombre: 'Dos desviaciones'
          descripcion: 'De 22 a 38 minutos: el 95.4 %. Solo una entrega de cada 22 queda fuera.'
          valores: {mu: 30, sigma: 4}
          region: intervalo
          desde: 22
          hasta: 38
        - nombre: 'Tres desviaciones'
          descripcion: 'De 18 a 42 minutos: el 99.7 %. Fuera quedan unas 3 entregas de cada mil.'
          valores: {mu: 30, sigma: 4}
          region: intervalo
          desde: 18
          hasta: 42
      ejemplo:
        titulo: 'Entregas tardías'
        contexto: 'Los tiempos de entrega de un restaurante siguen una normal con media 30 minutos y desviación 4 minutos.'
        pregunta: '¿Qué proporción de las entregas tarda más de 38 minutos?'
        valores: {mu: 30, sigma: 4}
        region: derecha
        desde: 38
referencias:
  - clave: degroot
    capitulo: '5'
  - clave: montgomery-doe
publicado: true
---

## Intuición

Un restaurante de comida a domicilio sabe que sus entregas tardan en promedio 30 minutos, con una desviación estándar de 4 minutos, y que los tiempos tienen forma de campana. Sin calcular integrales, el gerente puede decir mucho: dos de cada tres pedidos llegan entre 26 y 34 minutos, prácticamente todos entre 22 y 38, y un pedido de 42 minutos, tres desviaciones arriba de la media, es algo que ocurre una o dos veces cada mil pedidos.

Esa es la regla empírica. Para cualquier normal, sin importar su media ni su desviación, las proporciones dentro de una, dos y tres desviaciones estándar son siempre las mismas: aproximadamente 68 %, 95 % y 99.7 %. Funciona porque toda normal es una normal estándar estirada y desplazada.

La regla da una idea inmediata de qué es normal y qué es raro, y por eso se usa para detectar valores atípicos y para fijar límites de control en procesos industriales. Su límite es el supuesto: solo es exacta para datos normales. Con distribuciones asimétricas o de colas pesadas las proporciones cambian, a veces mucho.

## Definición

:::teorema[Regla empírica]
Si $X \sim \mathcal{N}(\mu, \sigma^{2})$, entonces
$$
\begin{aligned}
P(\mu - \sigma \le X \le \mu + \sigma) &= 2\Phi(1) - 1 \approx 0.683, \\
P(\mu - 2\sigma \le X \le \mu + 2\sigma) &= 2\Phi(2) - 1 \approx 0.954, \\
P(\mu - 3\sigma \le X \le \mu + 3\sigma) &= 2\Phi(3) - 1 \approx 0.997.
\end{aligned}
$$
:::

Las probabilidades salen de estandarizar: $P(|X - \mu| \le k\sigma) = P(|Z| \le k) = 2\Phi(k) - 1$, que no depende de $\mu$ ni de $\sigma$.

:::nota[Qué significa cada símbolo]
- $X$: variable con distribución normal.
- $\mu$: media.
- $\sigma$: desviación estándar.
- $k$: número de desviaciones estándar, 1, 2 o 3.
- $Z$: normal estándar.
- $\Phi$: función de distribución de la normal estándar.
:::

## Cómo usar la visualización

La curva representa los tiempos de entrega, $\mathcal{N}(30, 4^{2})$. Los tres casos sombrean una, dos y tres desviaciones alrededor de la media, y el panel muestra su probabilidad: 0.683, 0.954 y 0.997. El ejemplo de la ficha se carga con su botón y sombrea la cola de las entregas tardías.

Al cambiar la desviación a 8 minutos y poner la región de 22 a 38, que ahora es una sola desviación, la probabilidad vuelve a ser 0.683: lo que importa es el número de desviaciones, no los minutos. Con la región de colas se lee lo que queda fuera.

## Ejemplo

Los tiempos de entrega siguen $\mathcal{N}(30, 4^{2})$ minutos y el restaurante recibe 500 pedidos en un fin de semana.

1. Entre 26 y 34 minutos: alrededor del 68.3 %, unos 341 pedidos.
2. Entre 22 y 38 minutos: el 95.4 %, unos 477 pedidos; los 23 restantes se reparten por igual entre muy rápidos y muy lentos.
3. Más de 38 minutos: $(1 - 0.954)/2 \approx 0.023$, unos 11 pedidos.
4. Más de 42 minutos: $(1 - 0.997)/2 \approx 0.0013$, menos de un pedido esperado. Si ocurren varios, hay que sospechar de un problema en el proceso.

:::figura[Entregas de más de 38 minutos, dos desviaciones arriba de la media: la cola sombreada vale 0.023, la mitad de lo que queda fuera de ±2σ.]{componente="DistributionExplorer"}
```yaml
distribucion: normal
valores:
  mu: 30
  sigma: 4
rangos:
  mu: [10, 50]
  sigma: [1, 10]
dominio: [10, 50]
region: derecha
desde: 38
ejemplo:
  titulo: 'Entregas tardías'
  contexto: 'Los tiempos de entrega de un restaurante siguen una normal con media 30 minutos y desviación 4 minutos.'
  pregunta: '¿Qué proporción de las entregas tarda más de 38 minutos?'
  valores: {mu: 30, sigma: 4}
  region: derecha
  desde: 38
muestras: false
```
:::

:::figura[Tres desviaciones: de 18 a 42 minutos queda el 99.7 % del área; la cola de la derecha, más allá de 42, apenas se ve.]{componente="DistributionExplorer"}
```yaml
distribucion: normal
valores:
  mu: 30
  sigma: 4
rangos:
  mu: [10, 50]
  sigma: [1, 10]
dominio: [10, 50]
desde: 18
hasta: 42
muestras: true
```
:::

## Propiedades

- **Independencia de la escala:** las tres proporciones valen para toda normal, porque dependen solo de $k$.
- **Colas:** fuera de $\pm 1\sigma$ queda el 31.7 %, fuera de $\pm 2\sigma$ el 4.6 % y fuera de $\pm 3\sigma$ el 0.27 %, repartidos por igual en ambos lados.
- **Valores exactos útiles:** $\pm 1.645\sigma$ contiene el 90 %, $\pm 1.96\sigma$ el 95 % y $\pm 2.576\sigma$ el 99 %.
- **Comparación con Chebyshev:** para cualquier distribución con varianza finita, al menos $1 - 1/k^{2}$ de la probabilidad está a menos de $k$ desviaciones: 75 % con $k = 2$ y 89 % con $k = 3$. La regla empírica da valores mucho mayores porque usa la forma normal.
- **Límites de control:** en control estadístico de procesos se usan los límites $\mu \pm 3\sigma$; una medición fuera de ellos ocurre por azar con probabilidad 0.0027.

:::figura[Tres casos con contexto (una desviación, dos desviaciones, tres desviaciones): cada botón carga los parámetros y una frase explica por qué la forma es así.]{componente="DistributionExplorer"}
```yaml
distribucion: normal
valores:
  mu: 30
  sigma: 4
rangos:
  mu: [10, 50]
  sigma: [1, 10]
dominio: [10, 50]
region: intervalo
desde: 26
hasta: 34
casos:
  - nombre: 'Una desviación'
    descripcion: 'De 26 a 34 minutos, la media más o menos una desviación: contiene el 68.3 % de las entregas.'
    valores: {mu: 30, sigma: 4}
    region: intervalo
    desde: 26
    hasta: 34
  - nombre: 'Dos desviaciones'
    descripcion: 'De 22 a 38 minutos: el 95.4 %. Solo una entrega de cada 22 queda fuera.'
    valores: {mu: 30, sigma: 4}
    region: intervalo
    desde: 22
    hasta: 38
  - nombre: 'Tres desviaciones'
    descripcion: 'De 18 a 42 minutos: el 99.7 %. Fuera quedan unas 3 entregas de cada mil.'
    valores: {mu: 30, sigma: 4}
    region: intervalo
    desde: 18
    hasta: 42
```
:::


## Errores comunes

- **Aplicarla a datos asimétricos.** En una exponencial con media 2 y desviación 2, el intervalo de $\mu - \sigma$ a $\mu + \sigma$, de 0 a 4, contiene el 86.5 %, no el 68 %.
- **Confundir el 95 % con dos colas de 5 %.** Fuera de $\pm 2\sigma$ queda 4.6 % en total, unos 2.3 % de cada lado.
- **Considerar imposible lo que está más allá de 3σ.** Con millones de observaciones, los valores a más de tres desviaciones aparecen por miles.
- **Usar la desviación muestral de una muestra pequeña como si fuera σ.** Con pocos datos la estimación de $\sigma$ es imprecisa y las proporciones reales se desvían.

:::figura[Exponencial con media 2: el intervalo de 0 a 4, que es la media más o menos una desviación, contiene 0.865 de la probabilidad, no 0.68.]{componente="DistributionExplorer"}
```yaml
distribucion: exponencial
valores:
  lambda: 0.5
desde: 0
hasta: 4
muestras: false
```
:::

:::figura[Con colas pesadas las proporciones cambian: en una t con 3 grados de libertad, cuya desviación es 1.73, el intervalo de una desviación (sombreado) contiene 0.82 en lugar de 0.68, y más allá de tres desviaciones queda 0.014 en lugar de 0.0027. La línea punteada es la normal de la misma varianza.]{componente="DistributionExplorer"}
```yaml
distribucion: t
valores:
  nu: 3
desde: -1.73
hasta: 1.73
muestras: false
referencia:
  distribucion: normal
  valores:
    mu: 0
    sigma: 1.732
  etiqueta: Normal de la misma varianza
```
:::

## Conexiones

La regla empírica resume las áreas de la [[distribucion-normal]] obtenidas con la [[normal-estandar-y-puntuacion-z]]. La desigualdad de Chebyshev da cotas válidas para cualquier distribución, mucho más conservadoras. Los límites $\pm 3\sigma$ son la base de las gráficas de control, y los valores $\pm 1.96$ aparecen en los intervalos de confianza al 95 %. Cuando la distribución tiene colas pesadas, como la [[distribucion-t-de-student]] con pocos grados de libertad, las proporciones de la regla dejan de valer.

## Formulario

:::formula[Regla empírica]
$$
P(|X - \mu| \le k\sigma) = 2\Phi(k) - 1 \approx \begin{cases} 0.683, & k = 1 \\ 0.954, & k = 2 \\ 0.997, & k = 3 \end{cases}
$$

- $\mu$: media.
- $\sigma$: desviación estándar.
- $k$: número de desviaciones.
- $\Phi$: función de distribución normal estándar.
:::

:::formula[Cola de un lado]
$$
P(X > \mu + k\sigma) = 1 - \Phi(k)
$$

- Con $k = 2$ vale 0.023; con $k = 3$, 0.0013.
:::

:::formula[Cota de Chebyshev]
$$
P(|X - \mu| < k\sigma) \ge 1 - \frac{1}{k^{2}}
$$

- Válida para cualquier distribución con varianza finita.
:::
