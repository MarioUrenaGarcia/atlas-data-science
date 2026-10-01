---
id: distribucion-de-cauchy
titulo: Distribución de Cauchy
titulo_en: Cauchy distribution
alias:
  - Cauchy
  - distribución de Lorentz
  - distribución del faro
modulo: 2
submodulo: '2.2'
orden: 15
nivel: basico
prerrequisitos:
  - distribucion-uniforme-continua
relaciones:
  - tipo: caso-particular
    id: distribucion-t-de-student
  - tipo: contrasta
    id: distribucion-normal
etiquetas:
  - distribución continua
  - colas pesadas
  - sin media
  - valores extremos
resumen: >
  Distribución simétrica en forma de campana pero con colas tan pesadas que no tiene media ni varianza.
  Aparece como la posición donde un haz con ángulo uniforme toca una recta.
formula: 'f(x) = \frac{1}{\pi\gamma\left[1 + \left(\frac{x - x_0}{\gamma}\right)^{2}\right]}'
visualizacion:
  componente: DistributionStudio
  parametros:
    explorador:
      distribucion: cauchy
      valores:
        x0: 0
        gamma: 1
      casos:
        - nombre: 'Faro cercano'
          descripcion: 'γ = 0.5: el faro está cerca de la costa, los impactos se agrupan alrededor del centro pero las colas siguen siendo pesadas.'
          valores: {x0: 0, gamma: 0.5}
        - nombre: 'Faro a 1 km'
          descripcion: 'γ = 1: la mitad de los impactos cae entre -1 y 1 km, y uno de cada cinco cae a más de 3 km.'
          valores: {x0: 0, gamma: 1}
        - nombre: 'Faro lejano'
          descripcion: 'γ = 2.5: la campana es baja y ancha; la escala multiplica todas las distancias.'
          valores: {x0: 0, gamma: 2.5}
      ejemplo:
        titulo: 'Impactos lejanos'
        contexto: 'Un faro a 1 km de una costa recta apunta en una dirección al azar hacia la costa.'
        pregunta: '¿Qué probabilidad hay de que el haz toque la costa a más de 3 km del punto central, hacia cualquier lado?'
        valores: {x0: 0, gamma: 1}
        region: colas
        desde: -3
        hasta: 3
      referencia:
        distribucion: normal
        valores: {mu: 0, sigma: 1.483}
        etiqueta: 'Normal con los mismos cuartiles'
        visible: true
    genesis:
      componente: ContinuousGenesis
      parametros:
        proceso: faro
        valores:
          x0: 0
          gamma: 1
referencias:
  - clave: blitzstein-hwang
    capitulo: '7'
  - clave: wasserman
    capitulo: '2'
publicado: true
---

## Intuición

Un faro está a un kilómetro de una costa recta y gira su luz hasta detenerse en una dirección al azar, cualquier ángulo hacia la costa con la misma probabilidad. ¿Dónde toca el haz la costa? Casi siempre cerca del punto frente al faro, pero cuando el ángulo se acerca a ser paralelo a la costa el haz llega a puntos lejanísimos. Esa posición sigue una distribución de Cauchy.

A simple vista la densidad parece una campana parecida a la normal, solo un poco más baja y ancha. La diferencia está en las colas: caen tan despacio que los valores muy lejanos, aunque raros, son lo bastante frecuentes para impedir que exista la media. Un solo destello casi paralelo a la costa puede mover el promedio de miles de observaciones.

Por eso la Cauchy es el ejemplo clásico de lo que ocurre sin varianza finita: el promedio de muchas observaciones no se estabiliza, tiene la misma distribución que una sola observación. La ley de los grandes números y el teorema central del límite no aplican. Su centro y su escala se describen con la mediana y los cuartiles, que sí existen.

## Definición

:::definicion[Distribución de Cauchy]
Una variable $X$ tiene **distribución de Cauchy** con localización $x_0$ y escala $\gamma > 0$, $X \sim \operatorname{Cauchy}(x_0, \gamma)$, si su densidad es
$$
f(x) = \frac{1}{\pi\gamma\left[1 + \left(\frac{x - x_0}{\gamma}\right)^{2}\right]}, \qquad x \in \mathbb{R},
$$
y su función de distribución es $F(x) = \frac{1}{2} + \frac{1}{\pi}\arctan\!\left(\frac{x - x_0}{\gamma}\right)$.
:::

**Construcción del faro:** si $\Theta \sim U(-\pi/2, \pi/2)$, entonces $x_0 + \gamma\tan\Theta \sim \operatorname{Cauchy}(x_0, \gamma)$.

:::nota[Qué significa cada símbolo]
- $X$: posición en la recta.
- $x_0$: localización, que es la mediana y la moda.
- $\gamma$: escala, la mitad de la distancia entre los cuartiles.
- $\Theta$: ángulo uniforme del haz respecto a la perpendicular.
- $\arctan$: arco tangente.
- $\pi$: constante pi.
:::

## Cómo usar la visualización

La pestaña Distribución muestra la densidad de Cauchy junto a la normal con los mismos cuartiles (línea punteada), la región elegida y su probabilidad; los casos cambian la distancia del faro y el ejemplo de la ficha se carga con su botón. La pestaña Ver cómo surge gira el haz del faro a un ángulo uniforme y marca dónde toca la costa.

En la pestaña animada, de vez en cuando el haz sale casi paralelo a la costa y el impacto cae fuera de la vista: esos casos son las colas pesadas. Con el botón de simulación, la media de las muestras salta de un valor a otro sin estabilizarse.

## Ejemplo

El faro está a $\gamma = 1$ km de la costa, frente al punto $x_0 = 0$, y el punto de impacto es $X \sim \operatorname{Cauchy}(0, 1)$.

1. Mediana: 0, el punto frente al faro; cuartiles: $\pm 1$ km.
2. Probabilidad de que el haz toque a más de 3 km del punto central: $P(|X| > 3) = 1 - \frac{2}{\pi}\arctan 3 \approx 0.205$.
3. Una normal con los mismos cuartiles daría $P(|X| > 3) \approx 0.043$: la Cauchy produce valores lejanos casi cinco veces más.
4. La media no existe: $\int |x| f(x)\,dx = \infty$, porque $|x| f(x)$ decae como $1/|x|$.

:::figura[Cauchy(0, 1): las dos colas más allá de ±3 suman 0.205.]{componente="DistributionExplorer"}
```yaml
distribucion: cauchy
valores:
  x0: 0
  gamma: 1
ejemplo:
  titulo: 'Impactos lejanos'
  contexto: 'Un faro a 1 km de una costa recta apunta en una dirección al azar hacia la costa.'
  pregunta: '¿Qué probabilidad hay de que el haz toque la costa a más de 3 km del punto central, hacia cualquier lado?'
  valores: {x0: 0, gamma: 1}
  region: colas
  desde: -3
  hasta: 3
region: colas
desde: -3
hasta: 3
muestras: false
referencia:
  distribucion: normal
  valores: {mu: 0, sigma: 1.483}
  etiqueta: 'Normal con los mismos cuartiles'
  visible: true
```
:::

## Propiedades

- **Sin momentos:** no tiene media ni varianza ni momentos de orden mayor o igual a 1.
- **Mediana y cuartiles:** mediana $x_0$, cuartiles $x_0 \pm \gamma$.
- **Estabilidad:** el promedio de $n$ variables $\operatorname{Cauchy}(x_0, \gamma)$ independientes es otra vez $\operatorname{Cauchy}(x_0, \gamma)$; promediar no reduce la dispersión.
- **Cociente de normales:** si $Z_1, Z_2$ son normales estándar independientes, $Z_1/Z_2 \sim \operatorname{Cauchy}(0, 1)$.
- **Relación con la t:** la $t$ de Student con un grado de libertad es la Cauchy estándar.
- **Cola:** $P(X > x) \approx \frac{\gamma}{\pi x}$ para $x$ grande, una ley de potencia con exponente 1.

:::figura[Tres casos con contexto (faro cercano, faro a 1 km, faro lejano): cada botón carga los parámetros y una frase explica por qué la forma es así.]{componente="DistributionExplorer"}
```yaml
distribucion: cauchy
valores:
  x0: 0
  gamma: 1
casos:
  - nombre: 'Faro cercano'
    descripcion: 'γ = 0.5: el faro está cerca de la costa, los impactos se agrupan alrededor del centro pero las colas siguen siendo pesadas.'
    valores: {x0: 0, gamma: 0.5}
  - nombre: 'Faro a 1 km'
    descripcion: 'γ = 1: la mitad de los impactos cae entre -1 y 1 km, y uno de cada cinco cae a más de 3 km.'
    valores: {x0: 0, gamma: 1}
  - nombre: 'Faro lejano'
    descripcion: 'γ = 2.5: la campana es baja y ancha; la escala multiplica todas las distancias.'
    valores: {x0: 0, gamma: 2.5}
referencia:
  distribucion: normal
  valores: {mu: 0, sigma: 1.483}
  etiqueta: 'Normal con los mismos cuartiles'
  visible: true
```
:::

:::figura[Construcción del faro: el ángulo es uniforme, pero los impactos casi paralelos a la costa caen muy lejos y alimentan las colas.]{componente="ContinuousGenesis"}
```yaml
proceso: faro
valores:
  x0: 0
  gamma: 1
```
:::

:::figura[Promediar no ayuda: cada resultado es el promedio de 30 pasos con colas de tipo Cauchy (P(|X| > x) = 1/x). El promedio no se concentra y sigue una Cauchy, tan dispersa como un solo paso.]{componente="ContinuousGenesis"}
```yaml
proceso: suma-colas-pesadas
valores:
  alpha: 1
  n: 30
fijos: [alpha]
```
:::

## Errores comunes

- **Reportar la media muestral.** Con datos de Cauchy la media muestral salta sin estabilizarse; hay que usar la mediana.
- **Juzgar las colas por la forma central.** Cerca del centro la Cauchy parece normal; la diferencia está en los extremos.
- **Calcular desviaciones estándar.** La varianza muestral crece sin límite al aumentar la muestra.
- **Pensar que es un caso raro de laboratorio.** Aparece en cocientes de mediciones con ruido, en espectroscopía (perfil de Lorentz) y en la t con un grado de libertad.

:::figura[La campana de Cauchy (curva) frente a la normal con los mismos cuartiles (línea punteada): parecidas en el centro, muy distintas en las colas.]{componente="DistributionExplorer"}
```yaml
distribucion: cauchy
valores:
  x0: 0
  gamma: 1
muestras: false
referencia:
  distribucion: normal
  valores:
    mu: 0
    sigma: 1.483
  etiqueta: Normal con los mismos cuartiles
```
:::

## Conexiones

La Cauchy se obtiene transformando la [[distribucion-uniforme-continua]] del ángulo con la tangente, y es la [[distribucion-t-de-student]] con un grado de libertad. Contrasta con la [[distribucion-normal]]: ambas son simétricas, pero la Cauchy no tiene varianza. Es un caso de las [[distribuciones-estables]] con índice 1, y junto con la [[distribucion-de-levy]] es de las pocas estables con densidad explícita.

## Formulario

:::formula[Densidad]
$$
f(x) = \frac{1}{\pi\gamma\left[1 + \left(\frac{x - x_0}{\gamma}\right)^{2}\right]}
$$

- $x_0$: localización.
- $\gamma$: escala.
:::

:::formula[Función de distribución]
$$
F(x) = \frac{1}{2} + \frac{1}{\pi}\arctan\!\left(\frac{x - x_0}{\gamma}\right)
$$

- $\arctan$: arco tangente.
:::

:::formula[Construcción del faro]
$$
X = x_0 + \gamma\tan\Theta, \qquad \Theta \sim U\!\left(-\tfrac{\pi}{2}, \tfrac{\pi}{2}\right)
$$

- $\Theta$: ángulo uniforme.
:::

:::formula[Estabilidad del promedio]
$$
\bar{X}_n = \frac{1}{n}\sum_{i=1}^{n} X_i \sim \operatorname{Cauchy}(x_0, \gamma)
$$

- $n$: número de observaciones independientes.
:::
