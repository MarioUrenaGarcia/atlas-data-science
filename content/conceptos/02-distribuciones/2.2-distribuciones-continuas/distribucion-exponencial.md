---
id: distribucion-exponencial
titulo: Distribución exponencial
titulo_en: Exponential distribution
alias:
  - exponencial
  - tiempo entre llegadas
  - Exp(λ)
modulo: 2
submodulo: '2.2'
orden: 5
nivel: basico
prerrequisitos:
  - distribucion-uniforme-continua
  - distribucion-de-poisson
relaciones:
  - tipo: relacionado
    id: distribucion-geometrica
etiquetas:
  - distribución continua
  - tiempo de espera
  - tasa constante
  - confiabilidad
resumen: >
  Modela el tiempo hasta un evento que ocurre a tasa constante λ, como la siguiente llegada de un proceso
  de Poisson. Su densidad decrece exponencialmente y su media es 1/λ.
formula: 'f(x) = \lambda e^{-\lambda x}, \quad x \ge 0'
visualizacion:
  componente: DistributionStudio
  parametros:
    explorador:
      distribucion: exponencial
      valores:
        lambda: 0.5
      casos:
        - nombre: 'Llamadas a soporte'
          descripcion: 'Una llamada cada 2 minutos en promedio: la densidad es máxima en cero y la mitad de las esperas dura menos de 1.4 minutos.'
          valores: {lambda: 0.5}
        - nombre: 'Caja rápida'
          descripcion: 'Llegan 2 clientes por minuto: las esperas se acortan y la curva se comprime contra el cero.'
          valores: {lambda: 2}
        - nombre: 'Falla de un circuito'
          descripcion: 'Una falla cada 5 mil horas en promedio: la curva es baja y la cola, muy larga.'
          valores: {lambda: 0.2}
      ejemplo:
        titulo: 'Vida de un circuito'
        contexto: 'La vida de un circuito es exponencial con media de 2 mil horas, es decir, tasa 0.5 por mil horas.'
        pregunta: '¿Qué probabilidad hay de que dure más de 3 mil horas?'
        valores: {lambda: 0.5}
        region: derecha
        desde: 3
    genesis:
      componente: ContinuousGenesis
      parametros:
        proceso: llegadas
        valores:
          lambda: 0.5
          k: 1
        fijos: [k]
        unidad: llamadas a un centro de soporte, 0.5 por minuto
referencias:
  - clave: blitzstein-hwang
    capitulo: '5'
  - clave: ross-procesos
    capitulo: '5'
publicado: true
---

## Intuición

A un centro de soporte técnico llegan llamadas a razón de una cada dos minutos en promedio, sin ningún patrón: cada instante es tan propicio como cualquier otro para que suene el teléfono. ¿Cuánto hay que esperar a la siguiente llamada? Esperas cortas son las más frecuentes, pero de vez en cuando pasan cinco o seis minutos sin llamadas. La distribución exponencial describe este tiempo de espera.

Su forma se explica por la tasa constante. En cada pequeño intervalo de tiempo la probabilidad de que llegue la llamada es la misma, así que la probabilidad de seguir esperando se multiplica por el mismo factor en cada intervalo: decae exponencialmente. Por la misma razón la exponencial no tiene memoria: haber esperado ya tres minutos no hace que la llamada esté "más cerca".

La exponencial es la pareja continua de la Poisson. Si los eventos llegan como un proceso de Poisson con tasa λ, el número de eventos en un intervalo es Poisson y el tiempo entre eventos consecutivos es exponencial con la misma λ. Se usa para tiempos entre llegadas, duraciones de llamadas y vidas de componentes que no se desgastan, como algunos circuitos electrónicos.

## Definición

:::definicion[Distribución exponencial]
Una variable aleatoria $X$ tiene **distribución exponencial** con tasa $\lambda > 0$, $X \sim \operatorname{Exp}(\lambda)$, si su densidad es
$$
f(x) = \lambda e^{-\lambda x}, \qquad x \ge 0,
$$
y $f(x) = 0$ para $x < 0$. Su función de distribución es $F(x) = 1 - e^{-\lambda x}$ y su función de supervivencia es $P(X > x) = e^{-\lambda x}$.
:::

Algunos textos la parametrizan con la media $\beta = 1/\lambda$, escribiendo $f(x) = \frac{1}{\beta} e^{-x/\beta}$. Ambas formas describen la misma distribución.

:::nota[Qué significa cada símbolo]
- $X$: tiempo de espera hasta el evento.
- $\lambda$: tasa, número esperado de eventos por unidad de tiempo.
- $\beta = 1/\lambda$: escala, la espera media.
- $f(x)$: densidad en el tiempo $x$.
- $F(x)$: probabilidad de que el evento ocurra antes de $x$.
- $P(X > x)$: probabilidad de seguir esperando después de $x$.
:::

## Cómo usar la visualización

La pestaña Distribución muestra la densidad $\lambda e^{-\lambda x}$, la región elegida y su probabilidad; los casos cargan tasas de situaciones reales y el ejemplo de la ficha se carga con su botón. La pestaña Ver cómo surge muestra la espera hasta la siguiente llamada en una línea de tiempo, y cada espera cae en un histograma.

Con $\lambda = 0.5$ la media es 2, pero la mediana es solo 1.39: unas pocas esperas largas elevan la media. En la caja rápida todo se comprime contra el cero. Al pulsar la simulación de 1000 muestras, la varianza simulada se acerca a $1/\lambda^{2}$, el cuadrado de la media.

## Ejemplo

La vida de un tipo de circuito electrónico es exponencial con media de 2000 horas, es decir, $\lambda = 1/2000$ por hora.

1. Probabilidad de que dure más de 3000 horas: $P(X > 3000) = e^{-3000/2000} = e^{-1.5} \approx 0.223$.
2. Probabilidad de que falle en las primeras 500 horas: $1 - e^{-0.25} \approx 0.221$.
3. Mediana: el tiempo $m$ con $e^{-m/2000} = 0.5$ es $m = 2000\log 2 \approx 1386$ horas.
4. Desviación estándar: igual a la media, 2000 horas; las vidas de estos circuitos son muy variables.

:::figura[Vida de los circuitos en miles de horas, Exp(0.5): el área sombreada a la derecha de 3 vale 0.223 y el cuantil 0.5 es 1.39.]{componente="DistributionExplorer"}
```yaml
distribucion: exponencial
valores:
  lambda: 0.5
ejemplo:
  titulo: 'Vida de un circuito'
  contexto: 'La vida de un circuito es exponencial con media de 2 mil horas, es decir, tasa 0.5 por mil horas.'
  pregunta: '¿Qué probabilidad hay de que dure más de 3 mil horas?'
  valores: {lambda: 0.5}
  region: derecha
  desde: 3
region: derecha
desde: 3
muestras: false
```
:::

## Propiedades

- **Media y varianza:** $\mathbb{E}[X] = 1/\lambda$ y $\operatorname{Var}(X) = 1/\lambda^{2}$; la desviación estándar es igual a la media.
- **Mediana:** $\log 2/\lambda \approx 0.693/\lambda$, menor que la media.
- **Pérdida de memoria:** $P(X > s + t \mid X > s) = P(X > t)$; es la única distribución continua con esta propiedad.
- **Tasa de falla constante:** $f(x)/P(X > x) = \lambda$ para todo $x$.
- **Mínimo de exponenciales:** si $X_i \sim \operatorname{Exp}(\lambda_i)$ son independientes, $\min_i X_i \sim \operatorname{Exp}(\lambda_1 + \dots + \lambda_n)$.
- **Escala:** si $X \sim \operatorname{Exp}(1)$, entonces $X/\lambda \sim \operatorname{Exp}(\lambda)$.
- **Relación con la uniforme:** si $U \sim U(0, 1)$, $-\log U/\lambda \sim \operatorname{Exp}(\lambda)$.

:::figura[Tres casos con contexto (llamadas a soporte, caja rápida, falla de un circuito): cada botón carga los parámetros y una frase explica por qué la forma es así.]{componente="DistributionExplorer"}
```yaml
distribucion: exponencial
valores:
  lambda: 0.5
casos:
  - nombre: 'Llamadas a soporte'
    descripcion: 'Una llamada cada 2 minutos en promedio: la densidad es máxima en cero y la mitad de las esperas dura menos de 1.4 minutos.'
    valores: {lambda: 0.5}
  - nombre: 'Caja rápida'
    descripcion: 'Llegan 2 clientes por minuto: las esperas se acortan y la curva se comprime contra el cero.'
    valores: {lambda: 2}
  - nombre: 'Falla de un circuito'
    descripcion: 'Una falla cada 5 mil horas en promedio: la curva es baja y la cola, muy larga.'
    valores: {lambda: 0.2}
```
:::

:::figura[Mínimo de exponenciales: con tres servidores independientes que se liberan a tasa 0.5 cada uno, la espera hasta que se libera el primero es Exp(1.5), mucho más concentrada que Exp(0.5) (línea punteada).]{componente="DistributionExplorer"}
```yaml
distribucion: exponencial
valores:
  lambda: 1.5
muestras: false
referencia:
  distribucion: exponencial
  valores:
    lambda: 0.5
  etiqueta: Un solo servidor, Exp(0.5)
```
:::

:::figura[La función de distribución 1 - e^(-0.5x): sube rápido al principio y se acerca a 1 sin alcanzarlo. El 90 % de las esperas termina antes de 4.6 minutos.]{componente="DistributionExplorer"}
```yaml
distribucion: exponencial
valores:
  lambda: 0.5
vista: acumulada
probabilidad: 0.9
muestras: false
```
:::

## Errores comunes

- **Confundir tasa con media.** Con una llamada cada 2 minutos, la tasa es 0.5 por minuto; usar $\lambda = 2$ produce esperas cuatro veces más cortas.
- **Tomar la media como espera típica.** La mitad de las esperas es menor que $0.69$ veces la media.
- **Usarla para vidas con desgaste.** Una pieza que se desgasta tiene tasa de falla creciente; la exponencial supone tasa constante y para esos casos conviene la Weibull.
- **Creer que una espera larga anuncia una llegada inminente.** Por la falta de memoria, lo que falta por esperar no depende de lo ya esperado.

:::figura[Tasa frente a media: Exp(2) (curva) tiene media 0.5, mientras que Exp(0.5) (línea punteada) tiene media 2. Confundirlas cambia la escala de tiempo por un factor de cuatro.]{componente="DistributionExplorer"}
```yaml
distribucion: exponencial
valores:
  lambda: 2
muestras: false
referencia:
  distribucion: exponencial
  valores:
    lambda: 0.5
  etiqueta: Exp(0.5), media 2
```
:::

## Conexiones

La exponencial es la espera entre llegadas de un proceso cuyo conteo es de [[distribucion-de-poisson|Poisson]], y es la versión continua de la [[distribucion-geometrica]]. Su [[propiedad-de-perdida-de-memoria]] la distingue de las demás. Sumar exponenciales independientes da la [[distribucion-de-erlang]] y, en general, la [[distribucion-gamma]]; elevarla a una potencia da la [[distribucion-de-weibull]], y la diferencia de dos exponenciales da la [[distribucion-de-laplace]]. Se simula a partir de la [[distribucion-uniforme-continua]] con $-\log U/\lambda$.

## Formulario

:::formula[Densidad y distribución]
$$
f(x) = \lambda e^{-\lambda x}, \qquad F(x) = 1 - e^{-\lambda x}, \qquad x \ge 0
$$

- $\lambda$: tasa.
- $x$: tiempo.
:::

:::formula[Supervivencia]
$$
P(X > x) = e^{-\lambda x}
$$

- Probabilidad de seguir esperando después de $x$.
:::

:::formula[Media, varianza y mediana]
$$
\mathbb{E}[X] = \frac{1}{\lambda}, \qquad \operatorname{Var}(X) = \frac{1}{\lambda^{2}}, \qquad \operatorname{mediana} = \frac{\log 2}{\lambda}
$$

- $\log$: logaritmo natural.
:::

:::formula[Mínimo de exponenciales independientes]
$$
\min(X_1, \dots, X_n) \sim \operatorname{Exp}(\lambda_1 + \dots + \lambda_n)
$$

- $\lambda_i$: tasa de cada espera.
:::

:::formula[Simulación desde una uniforme]
$$
X = -\frac{\log U}{\lambda}, \qquad U \sim U(0, 1)
$$

- $U$: uniforme estándar.
:::
