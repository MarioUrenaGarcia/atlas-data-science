---
id: distribucion-de-levy
titulo: Distribución de Lévy
titulo_en: Lévy distribution
alias:
  - Lévy
  - tiempo de primer paso
  - estable con índice 1/2
modulo: 2
submodulo: '2.2'
orden: 31
nivel: avanzado
prerrequisitos:
  - normal-estandar-y-puntuacion-z
relaciones:
  - tipo: relacionado
    id: distribucion-de-cauchy
etiquetas:
  - colas muy pesadas
  - primer paso
  - movimiento browniano
  - sin media
resumen: >
  Distribución en los positivos con cola tan pesada que no tiene media. Es el tiempo que tarda un
  movimiento browniano en alcanzar un nivel fijo, y equivale a c/Z² con Z normal estándar.
formula: 'f(x) = \sqrt{\frac{c}{2\pi}}\,\frac{e^{-c/(2(x - \mu))}}{(x - \mu)^{3/2}}, \quad x > \mu'
visualizacion:
  componente: DistributionStudio
  parametros:
    explorador:
      distribucion: levy
      valores:
        mu: 0
        c: 1
      dominio: [0, 20]
      casos:
        - nombre: 'Barrera cercana'
          descripcion: 'c = 0.5: la partícula suele llegar pronto, pero la cola sigue siendo pesada.'
          valores: {mu: 0, c: 0.5}
        - nombre: 'Barrera a distancia 1'
          descripcion: 'c = 1: mediana 2.2, pero una de cada cuatro esperas dura más de 10; la media es infinita.'
          valores: {mu: 0, c: 1}
        - nombre: 'Barrera lejana'
          descripcion: 'c = 3: la escala crece con el cuadrado de la distancia; los tiempos se alargan mucho.'
          valores: {mu: 0, c: 3}
      ejemplo:
        titulo: 'Primer paso de una partícula'
        contexto: 'Una partícula con movimiento browniano estándar parte de 0; el tiempo que tarda en llegar al nivel 1 sigue una Lévy con c = 1.'
        pregunta: '¿Qué probabilidad hay de que tarde más de 10 unidades de tiempo?'
        valores: {mu: 0, c: 1}
        region: derecha
        desde: 10
    genesis:
      componente: ContinuousGenesis
      parametros:
        proceso: inverso-cuadrado
        valores:
          mu: 0
          c: 1
referencias:
  - clave: durrett
  - clave: karlin-taylor
publicado: true
---

## Intuición

Una partícula de polen se mueve al azar en el agua, con un movimiento browniano en una dimensión. Si se coloca una barrera a cierta distancia, ¿cuánto tarda la partícula en tocarla por primera vez? Con frecuencia llega pronto, pero a veces se aleja en la dirección contraria y tarda muchísimo en regresar. Ese tiempo de primer paso sigue una distribución de Lévy.

Su cola es tan pesada que el tiempo medio de llegada es infinito, aunque la partícula llega con probabilidad uno. La mediana es finita y razonable, pero las esperas excepcionalmente largas son lo bastante frecuentes para que el promedio no exista. Es un ejemplo de cómo un proceso sin ninguna rareza puede producir tiempos con colas extremas.

Hay una construcción muy simple: si $Z$ es una normal estándar, $1/Z^{2}$ sigue una Lévy. Valores de $Z$ cercanos a cero, que no son raros, producen valores enormes de $1/Z^{2}$. La Lévy es, junto con la normal y la Cauchy, una de las pocas distribuciones estables con densidad explícita.

## Definición

:::definicion[Distribución de Lévy]
Una variable $X$ tiene **distribución de Lévy** con localización $\mu$ y escala $c > 0$ si
$$
f(x) = \sqrt{\frac{c}{2\pi}}\,\frac{e^{-c/(2(x - \mu))}}{(x - \mu)^{3/2}}, \qquad F(x) = 2\left[1 - \Phi\!\left(\sqrt{\frac{c}{x - \mu}}\right)\right], \qquad x > \mu.
$$
:::

**Construcción:** si $Z \sim \mathcal{N}(0, 1)$, entonces $\mu + c/Z^{2}$ tiene distribución de Lévy. El tiempo que un movimiento browniano estándar tarda en alcanzar el nivel $d > 0$ es Lévy con $\mu = 0$ y $c = d^{2}$.

:::nota[Qué es X]
$X$ = un tiempo de primer paso, como el tiempo que tarda un movimiento browniano en alcanzar una barrera.
:::

:::nota[Qué hace cada parámetro]
- **$\mu$, localización:** el valor mínimo posible. Si aumenta, toda la curva se desliza a la derecha.
- **$c$, escala:** el cuadrado de la distancia a la barrera en el primer paso. Si aumenta, la curva se estira a la derecha y los tiempos crecen.
:::

:::nota[Qué significa cada símbolo]
- $X$: tiempo de primer paso u otra cantidad con cola extrema.
- $\mu$: localización, el valor mínimo.
- $c$: escala; para el primer paso, el cuadrado de la distancia a la barrera.
- $\Phi$: función de distribución normal estándar.
- $Z$: normal estándar.
- $d$: distancia a la barrera.
:::

## Cómo usar la visualización

La pestaña Distribución muestra la densidad de Lévy, la región elegida y su probabilidad; los casos cargan barreras cercana, intermedia y lejana, y el ejemplo de la ficha se carga con su botón. La pestaña Ver cómo surge sortea una normal y la transforma en $c/Z^{2}$: cuando $Z$ cae cerca de cero, el resultado sale fuera de la vista.

Con el botón de simulación, la media de las muestras crece sin estabilizarse, mientras que la mediana se queda cerca de $2.2c$. Al duplicar la distancia a la barrera, la escala $c$ se multiplica por cuatro.

## Ejemplo

El tiempo de primer paso al nivel 1 de un movimiento browniano estándar sigue una Lévy con $\mu = 0$ y $c = 1$.

1. Llega antes de 1: $P(X < 1) = 2[1 - \Phi(1)] \approx 0.317$.
2. Tarda más de 10: $P(X > 10) = 1 - 2[1 - \Phi(0.316)] \approx 0.248$.
3. Mediana: $c/[\Phi^{-1}(0.75)]^{2} = 1/0.455 \approx 2.20$.
4. Cuantil 0.9: alrededor de 63; una de cada diez esperas dura más de 63 unidades.

:::figura[Primer paso: el área sombreada a la derecha de 10 vale 0.248. El botón carga el ejemplo.]{componente="DistributionExplorer"}
```yaml
distribucion: levy
valores:
  mu: 0
  c: 1
dominio: [0, 20]
ejemplo:
  titulo: 'Primer paso de una partícula'
  contexto: 'El tiempo que un movimiento browniano estándar tarda en llegar al nivel 1 sigue una Lévy con c = 1.'
  pregunta: '¿Qué probabilidad hay de que tarde más de 10 unidades de tiempo?'
  valores: {mu: 0, c: 1}
  region: derecha
  desde: 10
region: derecha
desde: 10
muestras: false
```
:::

## Propiedades

- **Sin media ni varianza:** $P(X > x) \approx \sqrt{\frac{2c}{\pi x}}$ para $x$ grande; la cola decae como $x^{-1/2}$.
- **Mediana:** $\mu + c/[\Phi^{-1}(3/4)]^{2} \approx \mu + 2.198c$.
- **Moda:** $\mu + c/3$.
- **Estabilidad:** es la distribución estable con índice $\alpha = 1/2$ y asimetría total $\beta = 1$; la suma de Lévy independientes es Lévy.
- **Escalamiento con la distancia:** el tiempo hasta la barrera $d$ es $d^{2}$ veces el tiempo hasta la barrera 1.

:::figura[Tres casos con contexto (barrera cercana, a distancia 1 y lejana): cada botón carga la escala y una frase explica por qué la forma es así.]{componente="DistributionExplorer"}
```yaml
distribucion: levy
valores:
  mu: 0
  c: 1
dominio: [0, 20]
casos:
  - nombre: 'Barrera cercana'
    descripcion: 'c = 0.5: llegadas rápidas y cola pesada.'
    valores: {mu: 0, c: 0.5}
  - nombre: 'Barrera a distancia 1'
    descripcion: 'c = 1: mediana 2.2.'
    valores: {mu: 0, c: 1}
  - nombre: 'Barrera lejana'
    descripcion: 'c = 3: tiempos mucho más largos.'
    valores: {mu: 0, c: 3}
muestras: false
```
:::

:::figura[Construcción c/Z²: los valores de Z cercanos a cero producen tiempos enormes, que caen fuera de la vista.]{componente="ContinuousGenesis"}
```yaml
proceso: inverso-cuadrado
valores:
  mu: 0
  c: 1
```
:::

## Errores comunes

- **Reportar el tiempo medio de llegada.** Es infinito; la mediana es la medida útil.
- **Pensar que la partícula podría no llegar.** En una dimensión llega con probabilidad uno; lo que no es finito es el promedio.
- **Escalar la distancia de manera lineal.** Duplicar la distancia multiplica los tiempos por cuatro, no por dos.
- **Confundirla con la lognormal.** Ambas son positivas y asimétricas, pero la lognormal tiene todos sus momentos y la Lévy ninguno.

:::figura[Lévy (curva) frente a la lognormal con la misma mediana (línea punteada): la cola de la Lévy está muy por encima a partir de 10.]{componente="DistributionExplorer"}
```yaml
distribucion: levy
valores:
  mu: 0
  c: 1
dominio: [0, 20]
region: derecha
desde: 10
muestras: false
referencia:
  distribucion: lognormal
  valores:
    mu: 0.79
    sigma: 1
  etiqueta: Lognormal con la misma mediana
```
:::

## Conexiones

La Lévy se construye con la [[normal-estandar-y-puntuacion-z|normal estándar]] y, como la [[distribucion-de-cauchy]], es una de las [[distribuciones-estables]] con densidad explícita. Su cola, de índice 1/2, es más pesada que la de la [[distribucion-de-pareto]] con cualquier índice mayor que 1/2. Es el tiempo de primer paso del movimiento browniano, resultado que se obtiene con el principio de reflexión. El [[mapa-de-relaciones-entre-distribuciones]] la sitúa entre las demás distribuciones.

## Formulario

:::formula[Densidad y distribución]
$$
f(x) = \sqrt{\frac{c}{2\pi}}\,\frac{e^{-c/(2(x - \mu))}}{(x - \mu)^{3/2}}, \qquad F(x) = 2\left[1 - \Phi\!\left(\sqrt{\tfrac{c}{x - \mu}}\right)\right]
$$

- $\mu$: localización; $c$: escala.
- $\Phi$: distribución normal estándar.
:::

:::formula[Construcción]
$$
X = \mu + \frac{c}{Z^{2}}, \qquad Z \sim \mathcal{N}(0, 1)
$$

- $Z$: normal estándar.
:::

:::formula[Mediana y moda]
$$
\operatorname{mediana} = \mu + \frac{c}{\left[\Phi^{-1}(3/4)\right]^{2}}, \qquad \operatorname{moda} = \mu + \frac{c}{3}
$$

- $\Phi^{-1}(3/4) \approx 0.674$.
:::

:::formula[Primer paso del movimiento browniano]
$$
T_d \sim \operatorname{Lévy}(0,\ d^{2})
$$

- $d$: distancia a la barrera.
:::
