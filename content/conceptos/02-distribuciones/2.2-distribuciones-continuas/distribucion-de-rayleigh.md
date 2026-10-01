---
id: distribucion-de-rayleigh
titulo: Distribución de Rayleigh
titulo_en: Rayleigh distribution
alias:
  - Rayleigh
  - distancia de un error bidimensional
modulo: 2
submodulo: '2.2'
orden: 21
nivel: intermedio
prerrequisitos:
  - distribucion-chi-cuadrada
relaciones:
  - tipo: caso-particular
    id: distribucion-de-weibull
etiquetas:
  - distribución continua
  - magnitud de un vector
  - viento
  - error de posición
resumen: >
  Distribución de la distancia al origen de un punto cuyas dos coordenadas son normales independientes
  con media cero y la misma varianza. Modela velocidades del viento y errores de posición en el plano.
formula: 'f(r) = \frac{r}{\sigma^{2}}e^{-r^{2}/(2\sigma^{2})}, \quad r \ge 0'
visualizacion:
  componente: DistributionStudio
  parametros:
    explorador:
      distribucion: rayleigh
      valores:
        sigma: 6
      rangos:
        sigma: [0.5, 10]
      dominio: [0, 30]
      casos:
        - nombre: 'Viento en la costa'
          descripcion: 'σ = 6 m/s: velocidad media 7.5 m/s; nunca negativa y con cola hacia rachas fuertes, porque es la magnitud de dos componentes normales.'
          valores: {sigma: 6}
        - nombre: 'Error de un GPS'
          descripcion: 'σ = 3 m por eje: la distancia al punto verdadero rara vez es cero, porque eso exige acertar en ambos ejes a la vez.'
          valores: {sigma: 3}
        - nombre: 'Ruido de una señal'
          descripcion: 'σ = 1.5: amplitud del ruido en un receptor; la forma es siempre la misma, solo cambia la escala.'
          valores: {sigma: 1.5}
      ejemplo:
        titulo: 'Viento fuerte'
        contexto: 'La velocidad del viento en un sitio costero sigue una Rayleigh con σ = 6 m/s.'
        pregunta: '¿Qué probabilidad hay de que en un momento dado el viento supere 15 m/s?'
        valores: {sigma: 6}
        region: derecha
        desde: 15
    genesis:
      componente: ContinuousGenesis
      parametros:
        proceso: distancia
        valores:
          nu: 0
          sigma: 1
        fijos: [nu]
referencias:
  - clave: ross-probabilidad
  - clave: blitzstein-hwang
    capitulo: '5'
publicado: true
---

## Intuición

El viento sopla en el plano: tiene una componente norte-sur y otra este-oeste. Si cada componente fluctúa como una normal con media cero y la misma dispersión, independientes entre sí, la velocidad del viento es la longitud del vector, la raíz de la suma de los cuadrados. Esa longitud sigue una distribución de Rayleigh.

Aunque cada componente es simétrica y su valor más probable es cero, la magnitud casi nunca es cero: para eso ambas componentes tendrían que ser cero al mismo tiempo. El círculo de radio pequeño alrededor del origen tiene muy poca área, así que la densidad de la distancia empieza en cero, sube hasta un máximo en $\sigma$ y luego decae con una cola que recoge las rachas fuertes.

La misma situación aparece en el error de un receptor GPS, que comete errores normales en dos direcciones, en la amplitud del ruido de una señal de radio y en la dispersión de disparos alrededor de un blanco. Si el vector tiene además una parte fija, la distancia sigue la distribución de Rice, de la que la Rayleigh es el caso sin señal.

## Definición

:::definicion[Distribución de Rayleigh]
Si $X, Y \sim \mathcal{N}(0, \sigma^{2})$ son independientes, la distancia $R = \sqrt{X^{2} + Y^{2}}$ tiene **distribución de Rayleigh** con escala $\sigma > 0$:
$$
f(r) = \frac{r}{\sigma^{2}}e^{-r^{2}/(2\sigma^{2})}, \qquad F(r) = 1 - e^{-r^{2}/(2\sigma^{2})}, \qquad r \ge 0.
$$
:::

Equivalentemente, $R^{2}/\sigma^{2} \sim \chi^{2}_{2}$, y $R^{2}$ es exponencial con media $2\sigma^{2}$.

:::nota[Qué significa cada símbolo]
- $R$: distancia al origen, o magnitud del vector.
- $X$, $Y$: componentes normales independientes.
- $\sigma$: desviación estándar de cada componente, que es la moda de $R$.
- $f(r)$, $F(r)$: densidad y función de distribución.
- $\chi^{2}_{2}$: chi-cuadrada con dos grados de libertad.
:::

## Cómo usar la visualización

La pestaña Distribución muestra la densidad de Rayleigh, la región elegida y su probabilidad; los casos cargan viento, error de GPS y ruido, y el ejemplo de la ficha se carga con su botón. La pestaña Ver cómo surge dibuja un punto normal en el plano, traza el círculo que pasa por él y registra su radio.

En la pestaña animada se ve que los puntos casi nunca caen sobre el origen aunque esté en el centro de la nube. En la pestaña estática, los tres casos tienen la misma forma con distinta escala: la moda siempre está en $\sigma$ y la media en $1.25\sigma$.

## Ejemplo

La velocidad del viento en un sitio costero sigue una Rayleigh con $\sigma = 6$ m/s.

1. Velocidad más frecuente: la moda, 6 m/s.
2. Velocidad media: $\sigma\sqrt{\pi/2} \approx 7.52$ m/s; mediana: $\sigma\sqrt{2\log 2} \approx 7.06$ m/s.
3. Probabilidad de superar 15 m/s: $e^{-15^{2}/(2 \cdot 36)} = e^{-3.125} \approx 0.044$.
4. Un aerogenerador que se detiene por seguridad por encima de 15 m/s estaría parado alrededor del 4.4 % del tiempo.

:::figura[Viento fuerte: el área sombreada a la derecha de 15 m/s vale 0.044. El botón carga el ejemplo.]{componente="DistributionExplorer"}
```yaml
distribucion: rayleigh
valores:
  sigma: 6
rangos:
  sigma: [0.5, 10]
dominio: [0, 30]
ejemplo:
  titulo: 'Viento fuerte'
  contexto: 'La velocidad del viento en un sitio costero sigue una Rayleigh con σ = 6 m/s.'
  pregunta: '¿Qué probabilidad hay de que en un momento dado el viento supere 15 m/s?'
  valores: {sigma: 6}
  region: derecha
  desde: 15
region: derecha
desde: 15
muestras: false
```
:::

## Propiedades

- **Moda, mediana y media:** $\sigma$, $\sigma\sqrt{2\log 2} \approx 1.177\sigma$ y $\sigma\sqrt{\pi/2} \approx 1.253\sigma$.
- **Varianza:** $\frac{4 - \pi}{2}\sigma^{2} \approx 0.429\sigma^{2}$.
- **Relación con la chi-cuadrada y la exponencial:** $R^{2}/\sigma^{2} \sim \chi^{2}_{2}$ y $R^{2} \sim \operatorname{Exp}(1/(2\sigma^{2}))$.
- **Caso de la Weibull:** es la Weibull con forma 2 y escala $\sigma\sqrt{2}$.
- **Simulación:** $\sigma\sqrt{-2\log U}$ con $U$ uniforme, la misma idea del método de Box-Muller.
- **Caso de la Rice:** la Rice con $\nu = 0$.

:::figura[Tres casos con contexto (viento, GPS y ruido): cada botón carga la escala y una frase explica por qué la forma es así.]{componente="DistributionExplorer"}
```yaml
distribucion: rayleigh
valores:
  sigma: 6
rangos:
  sigma: [0.5, 10]
dominio: [0, 30]
casos:
  - nombre: 'Viento en la costa'
    descripcion: 'σ = 6 m/s: moda en 6, media 7.5.'
    valores: {sigma: 6}
  - nombre: 'Error de un GPS'
    descripcion: 'σ = 3 m: la misma forma comprimida a la mitad.'
    valores: {sigma: 3}
  - nombre: 'Ruido de una señal'
    descripcion: 'σ = 1.5: más comprimida aún; la forma no cambia.'
    valores: {sigma: 1.5}
muestras: false
```
:::

:::figura[Construcción en el plano: cada punto es normal en ambos ejes alrededor del origen y su distancia cae en el histograma.]{componente="ContinuousGenesis"}
```yaml
proceso: distancia
valores:
  nu: 0
  sigma: 1
fijos: [nu]
```
:::

## Errores comunes

- **Pensar que la distancia más probable es cero.** El origen es el punto más denso del plano, pero la distancia cero es improbable porque el círculo pequeño tiene poca área.
- **Confundir σ con la media.** La media es $1.25\sigma$.
- **Aplicarla si las componentes tienen varianzas distintas o media distinta de cero.** Con media no nula aparece la Rice; con varianzas distintas la distribución es otra.
- **Sumar magnitudes como si fueran escalares.** La magnitud de la suma de dos vectores no es la suma de las magnitudes.

:::figura[Con un centro desplazado la distancia ya no es Rayleigh: con ν = 2 los puntos rodean un centro alejado del origen y la distancia se concentra cerca de 2.]{componente="ContinuousGenesis"}
```yaml
proceso: distancia
valores:
  nu: 2
  sigma: 1
```
:::

## Conexiones

La Rayleigh es la raíz de una [[distribucion-chi-cuadrada]] con dos grados de libertad, escalada, y es la [[distribucion-de-weibull]] con forma 2. Si el vector tiene una componente fija, la distancia sigue la [[distribucion-de-rice]]. Su simulación con $\sigma\sqrt{-2\log U}$ es el corazón del método de Box-Muller para generar normales.

## Formulario

:::formula[Densidad y distribución]
$$
f(r) = \frac{r}{\sigma^{2}}e^{-r^{2}/(2\sigma^{2})}, \qquad F(r) = 1 - e^{-r^{2}/(2\sigma^{2})}
$$

- $\sigma$: escala, desviación de cada componente.
- $r \ge 0$: distancia.
:::

:::formula[Construcción]
$$
R = \sqrt{X^{2} + Y^{2}}, \qquad X, Y \sim \mathcal{N}(0, \sigma^{2})
$$

- $X$, $Y$: componentes independientes.
:::

:::formula[Centros y varianza]
$$
\operatorname{moda} = \sigma, \qquad \mathbb{E}[R] = \sigma\sqrt{\tfrac{\pi}{2}}, \qquad \operatorname{Var}(R) = \tfrac{4 - \pi}{2}\sigma^{2}
$$

- La mediana es $\sigma\sqrt{2\log 2}$.
:::

:::formula[Simulación]
$$
R = \sigma\sqrt{-2\log U}, \qquad U \sim U(0, 1)
$$

- $U$: uniforme estándar.
:::
