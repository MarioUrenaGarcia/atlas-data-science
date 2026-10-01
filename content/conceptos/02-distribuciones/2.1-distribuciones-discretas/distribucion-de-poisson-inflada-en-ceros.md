---
id: distribucion-de-poisson-inflada-en-ceros
titulo: Distribución de Poisson inflada en ceros
titulo_en: Zero-inflated Poisson distribution
alias:
  - Poisson inflada en ceros
  - ZIP
  - zero-inflated Poisson
modulo: 2
submodulo: '2.1'
orden: 13
nivel: intermedio
prerrequisitos:
  - distribucion-de-poisson
relaciones:
  - tipo: generaliza
    id: distribucion-de-poisson
  - tipo: relacionado
    id: distribucion-binomial-negativa
etiquetas:
  - distribución discreta
  - exceso de ceros
  - mezcla
  - sobredispersión
resumen: >
  Mezcla un cero seguro, con probabilidad π, y un conteo de Poisson, con probabilidad 1 - π. Modela
  conteos con más ceros de los que permite una Poisson, como visitas al médico o capturas de pesca.
formula: 'P(X = 0) = \pi + (1 - \pi)e^{-\lambda}, \quad P(X = k) = (1 - \pi)\frac{e^{-\lambda}\lambda^{k}}{k!}\ (k \ge 1)'
visualizacion:
  componente: DistributionGenesis
  parametros:
    proceso: ceros-inflados
    valores:
      pi: 0.35
      lambda: 3
    unidad: visitas al dentista en un año
    comparar: true
referencias:
  - clave: agresti
  - clave: mcelreath
    capitulo: '12'
publicado: true
---

## Intuición

Una encuesta pregunta a cada persona cuántas veces visitó al dentista el año pasado. Muchas respuestas son cero, pero por dos razones distintas. Algunas personas no tienen acceso a un dentista o nunca van; para ellas el cero es seguro. Otras sí acuden cuando lo necesitan y simplemente no lo necesitaron ese año; su cero es un conteo de Poisson que salió cero por azar.

La distribución de Poisson inflada en ceros modela esa población mezclada. Para cada persona se decide primero, como con una moneda cargada, si pertenece al grupo de los ceros seguros, llamados ceros estructurales. Si no pertenece, su número de visitas sigue una Poisson. El resultado tiene muchos más ceros que una Poisson con la misma media y, a la vez, conserva la forma de Poisson en los valores positivos.

Este modelo es útil cuando el exceso de ceros tiene una explicación: personas que no pescan entre los visitantes de un parque, días en que una máquina está apagada o pacientes que no tienen la enfermedad que causa los síntomas. Ignorar esa mezcla y ajustar una Poisson simple subestima los ceros y la variabilidad.

## Definición

:::definicion[Poisson inflada en ceros]
Sean $\pi \in [0, 1)$ y $\lambda > 0$. Si $Z \sim \operatorname{Bernoulli}(\pi)$ y $Y \sim \operatorname{Poisson}(\lambda)$ son independientes, la variable $X = (1 - Z)\,Y$ tiene **distribución de Poisson inflada en ceros**, $X \sim \operatorname{ZIP}(\pi, \lambda)$:
$$
P(X = 0) = \pi + (1 - \pi)e^{-\lambda}, \qquad P(X = k) = (1 - \pi)\frac{e^{-\lambda}\lambda^{k}}{k!}, \quad k = 1, 2, \dots
$$
:::

La probabilidad del cero tiene dos sumandos: los ceros estructurales, $\pi$, y los ceros de la parte Poisson, $(1 - \pi)e^{-\lambda}$.

:::nota[Qué significa cada símbolo]
- $X$: conteo observado.
- $Z$: indicadora de cero estructural.
- $Y$: conteo de la parte Poisson.
- $\pi$: probabilidad de cero estructural.
- $\lambda$: media de la parte Poisson.
- $k$: conteo particular.
- $e^{-\lambda}$: probabilidad de que la parte Poisson valga cero.
- $k!$: factorial de $k$.
:::

## Cómo usar la visualización

Cada experimento es una persona. El recuadro de la izquierda hace el primer sorteo: si dice "Cero estructural", la persona no visita al dentista y la línea de tiempo queda apagada; si dice "Rama Poisson", las visitas aparecen como marcas a lo largo del año. El histograma pinta en verde la parte de la barra del cero que viene de ceros estructurales.

Con $\pi = 0.35$ y $\lambda = 3$, la barra del cero, 0.382, es 2.7 veces la de la Poisson con la misma media (línea punteada), 0.142. Al bajar $\pi$ a 0 la parte verde desaparece y el histograma es una Poisson. Al subir $\pi$ el resto de las barras baja en proporción, sin cambiar de forma.

## Ejemplo

En un parque, el número de peces que captura un grupo de visitantes sigue $\operatorname{ZIP}(0.4, 2.5)$: el 40 % de los grupos no pesca y los demás capturan según una Poisson de media 2.5.

1. Ningún pez: $P(X = 0) = 0.4 + 0.6\,e^{-2.5} \approx 0.4 + 0.6 \cdot 0.0821 = 0.4493$.
2. Exactamente dos: $P(X = 2) = 0.6 \cdot e^{-2.5}\,2.5^{2}/2! \approx 0.6 \cdot 0.2565 = 0.1539$.
3. Media: $\mathbb{E}[X] = 0.6 \cdot 2.5 = 1.5$; varianza: $1.5\,(1 + 0.4 \cdot 2.5) = 3$, el doble de la media.
4. Una Poisson con media 1.5 daría $P(X = 0) = e^{-1.5} \approx 0.223$, la mitad de lo observado.
5. De los grupos sin peces, la fracción que no pescó es $0.4/0.4493 \approx 0.89$.

:::figura[Los grupos de visitantes del parque. El 89 % de la barra del cero es verde: grupos que no pescaron. La línea punteada es la Poisson de media 1.5.]{componente="DistributionGenesis"}
```yaml
proceso: ceros-inflados
valores:
  pi: 0.4
  lambda: 2.5
unidad: peces capturados por grupo
comparar: true
```
:::

:::figura[ZIP(0.4, 2.5): la barra del cero mide 0.449 y las demás conservan la forma de la Poisson(2.5) multiplicada por 0.6.]{componente="DistributionExplorer"}
```yaml
distribucion: poisson-inflada
valores:
  pi: 0.4
  lambda: 2.5
desde: 0
hasta: 0
muestras: false
```
:::

## Propiedades

- **Media:** $\mathbb{E}[X] = (1 - \pi)\lambda$.
- **Varianza:** $\operatorname{Var}(X) = (1 - \pi)\lambda(1 + \pi\lambda)$, mayor que la media si $\pi > 0$.
- **Probabilidad posterior del cero estructural:** $P(Z = 1 \mid X = 0) = \dfrac{\pi}{\pi + (1 - \pi)e^{-\lambda}}$.
- **Forma de los positivos:** condicionada a $X \ge 1$, la distribución es la de una Poisson truncada en cero, igual que sin inflación.
- **Caso límite:** con $\pi = 0$ se recupera la $\operatorname{Poisson}(\lambda)$.

:::figura[Sobredispersión: ZIP(0.35, 3) tiene media 1.95 y varianza 4.0; la Poisson de la misma media (línea punteada) tiene varianza 1.95.]{componente="DistributionExplorer"}
```yaml
distribucion: poisson-inflada
valores:
  pi: 0.35
  lambda: 3
muestras: false
referencia:
  distribucion: poisson
  valores:
    lambda: 1.95
  etiqueta: Poisson de media 1.95
```
:::

:::figura[Con π = 0 no hay ceros estructurales y la distribución es una Poisson(3).]{componente="DistributionExplorer"}
```yaml
distribucion: poisson-inflada
valores:
  pi: 0
  lambda: 3
muestras: false
```
:::

:::demostracion
Como $X = (1 - Z)Y$ con $Z$ y $Y$ independientes y $(1 - Z)^{2} = 1 - Z$: $\mathbb{E}[X] = (1 - \pi)\lambda$ y $\mathbb{E}[X^{2}] = (1 - \pi)(\lambda + \lambda^{2})$. Entonces $\operatorname{Var}(X) = (1 - \pi)(\lambda + \lambda^{2}) - (1 - \pi)^{2}\lambda^{2} = (1 - \pi)\lambda(1 + \pi\lambda)$. La probabilidad posterior es la regla de Bayes aplicada a los dos orígenes del cero.
:::

## Errores comunes

- **Atribuir todos los ceros a la parte estructural.** Con $\lambda = 2.5$, un 11 % de los ceros viene de grupos que sí pescaron y no capturaron nada.
- **Ajustar una Poisson a datos con exceso de ceros.** La Poisson subestima la proporción de ceros y la varianza, lo que lleva a errores estándar demasiado pequeños.
- **Interpretar λ como la media de los datos.** $\lambda$ es la media de quienes están en la rama Poisson; la media de todos es $(1 - \pi)\lambda$.
- **Confundirla con el modelo de obstáculo.** En el modelo de obstáculo todos los ceros vienen de la primera etapa y los positivos siguen una Poisson truncada; en la ZIP también la Poisson puede producir ceros.

:::figura[Los dos orígenes del cero: con λ = 1 la parte Poisson produce muchos ceros (e^-1 = 0.37), y la parte verde es solo una fracción de la barra.]{componente="DistributionGenesis"}
```yaml
proceso: ceros-inflados
valores:
  pi: 0.3
  lambda: 1
unidad: reclamaciones de seguro por póliza
comparar: false
```
:::

## Conexiones

La ZIP es una mezcla de un cero seguro, elegido con una [[distribucion-de-bernoulli]], y una [[distribucion-de-poisson]], a la que generaliza. Como la [[distribucion-binomial-negativa]], sirve para conteos sobredispersos, pero concentra el exceso en el cero; existe también una binomial negativa inflada en ceros que combina ambos fenómenos. Es un ejemplo de mezcla de distribuciones con dos componentes.

## Formulario

:::formula[Función de masa]
$$
P(X = 0) = \pi + (1 - \pi)e^{-\lambda}, \qquad P(X = k) = (1 - \pi)\frac{e^{-\lambda}\lambda^{k}}{k!},\ k \ge 1
$$

- $\pi$: probabilidad de cero estructural.
- $\lambda$: media de la parte Poisson.
- $k$: conteo positivo.
:::

:::formula[Construcción]
$$
X = (1 - Z)\,Y, \qquad Z \sim \operatorname{Bernoulli}(\pi), \qquad Y \sim \operatorname{Poisson}(\lambda)
$$

- $Z$: vale 1 si el cero es estructural.
- $Y$: conteo de Poisson, independiente de $Z$.
:::

:::formula[Media y varianza]
$$
\mathbb{E}[X] = (1 - \pi)\lambda, \qquad \operatorname{Var}(X) = (1 - \pi)\lambda(1 + \pi\lambda)
$$

- La varianza supera a la media en $(1 - \pi)\pi\lambda^{2}$.
:::

:::formula[Origen de un cero observado]
$$
P(Z = 1 \mid X = 0) = \frac{\pi}{\pi + (1 - \pi)e^{-\lambda}}
$$

- Probabilidad de que un cero observado sea estructural.
:::
