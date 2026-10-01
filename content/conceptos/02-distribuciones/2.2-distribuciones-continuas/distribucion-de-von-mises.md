---
id: distribucion-de-von-mises
titulo: Distribución de von Mises
titulo_en: von Mises distribution
alias:
  - von Mises
  - normal circular
  - distribución circular
modulo: 2
submodulo: '2.2'
orden: 24
nivel: avanzado
prerrequisitos:
  - distribucion-normal
relaciones:
  - tipo: contrasta
    id: distribucion-uniforme-continua
etiquetas:
  - datos circulares
  - direcciones
  - ángulos
  - concentración
resumen: >
  Distribución para ángulos y direcciones, la análoga circular de la normal. Tiene una dirección media μ
  y una concentración κ: con κ = 0 es uniforme en el círculo y con κ grande se parece a una normal.
formula: 'f(\theta) = \frac{e^{\kappa\cos(\theta - \mu)}}{2\pi I_0(\kappa)}, \quad \theta \in [\mu - \pi, \mu + \pi)'
visualizacion:
  componente: DistributionStudio
  parametros:
    explorador:
      distribucion: von-mises
      valores:
        mu: 0
        kappa: 2
      casos:
        - nombre: 'Sin dirección preferida'
          descripcion: 'κ = 0: todas las direcciones son igual de probables; la densidad es una línea horizontal.'
          valores: {mu: 0, kappa: 0}
        - nombre: 'Viento dominante'
          descripcion: 'κ = 2: el viento sopla casi siempre del este (μ = 0), pero con mucha variación alrededor.'
          valores: {mu: 0, kappa: 2}
        - nombre: 'Aves migratorias'
          descripcion: 'μ = 1.57 y κ = 12: casi todas vuelan hacia el norte; con κ grande la forma es casi normal con desviación 0.29.'
          valores: {mu: 1.57, kappa: 12}
      ejemplo:
        titulo: 'Dirección del viento'
        contexto: 'La dirección del viento, en radianes medidos desde el este, sigue una von Mises con μ = 0 y κ = 2.'
        pregunta: '¿Qué probabilidad hay de que el viento sople a menos de 45 grados (π/4) de la dirección dominante?'
        valores: {mu: 0, kappa: 2}
        region: intervalo
        desde: -0.785
        hasta: 0.785
    genesis:
      componente: ContinuousGenesis
      parametros:
        proceso: direccion
        valores:
          mu: 0
          kappa: 2
referencias:
  - clave: murphy
  - clave: bishop
    capitulo: '2'
publicado: true
---

## Intuición

La dirección del viento, la hora de llegada de los pacientes a una clínica a lo largo del día o la orientación de las aves al migrar son datos circulares: el ángulo 359 grados está junto al 1 grado, aunque los números estén lejos. Promediar esos números como si estuvieran en una recta da resultados absurdos: el promedio de 359 y 1 sería 180, justo la dirección opuesta.

La distribución de von Mises es la análoga de la normal en el círculo. Tiene una dirección media, hacia la que apuntan la mayoría de los ángulos, y un parámetro de concentración que hace el papel del inverso de la varianza: con concentración cero todas las direcciones son igual de probables, y con concentración alta los ángulos se agrupan estrechamente alrededor de la dirección media.

Su densidad se construye con el coseno de la diferencia de ángulos, que es máximo cuando el ángulo coincide con la dirección media y mínimo en la dirección opuesta, y es automáticamente periódico. Por eso no hay que preocuparse de dónde se "corta" el círculo.

## Definición

:::definicion[Distribución de von Mises]
Un ángulo $\Theta$ tiene **distribución de von Mises** con dirección media $\mu$ y concentración $\kappa \ge 0$, $\Theta \sim \operatorname{vM}(\mu, \kappa)$, si su densidad en el círculo es
$$
f(\theta) = \frac{e^{\kappa\cos(\theta - \mu)}}{2\pi I_0(\kappa)},
$$
donde $I_0(\kappa) = \frac{1}{2\pi}\int_0^{2\pi} e^{\kappa\cos t}\,dt$ es la función de Bessel modificada de orden cero.
:::

Su **longitud resultante media**, $\rho = \mathbb{E}[\cos(\Theta - \mu)] = I_1(\kappa)/I_0(\kappa)$, mide la concentración en una escala de 0 (dispersión total) a 1 (todo en $\mu$).

:::nota[Qué representa la variable]
$\Theta$ = un ángulo o una dirección, como la orientación del viento o la hora del día de un evento.
:::

:::nota[Qué hace cada parámetro]
- **$\mu$, dirección media:** el ángulo alrededor del que se agrupan los datos. Si aumenta, la curva gira alrededor del círculo.
- **$\kappa$, concentración:** qué tan agrupados están los ángulos, análoga a $1/\sigma^{2}$. Si aumenta, la curva se angosta alrededor de $\mu$; con $\kappa = 0$ es uniforme.
:::

:::nota[Qué significa cada símbolo]
- $\Theta$: ángulo aleatorio, en radianes.
- $\mu$: dirección media.
- $\kappa$: concentración; análoga a $1/\sigma^{2}$ de la normal.
- $\cos(\theta - \mu)$: vale 1 en la dirección media y $-1$ en la opuesta.
- $I_0$, $I_1$: funciones de Bessel modificadas de órdenes cero y uno.
- $\rho$: longitud resultante media.
:::

## Cómo usar la visualización

La pestaña Distribución muestra la densidad sobre un intervalo de longitud $2\pi$ centrado en $\mu$, la región elegida y su probabilidad; los casos cargan una dirección sin preferencia, el viento y las aves, y el ejemplo de la ficha se carga con su botón. La pestaña Ver cómo surge dibuja cada dirección como una flecha en el círculo y la acumula en el histograma.

Con $\kappa = 0$ la densidad es plana a la altura $1/(2\pi)$. Al subir $\kappa$ las flechas se agrupan alrededor de la dirección media; con $\kappa = 12$ casi todas caen a menos de medio radián de ella.

## Ejemplo

La dirección del viento, en radianes desde el este, sigue $\operatorname{vM}(0, 2)$.

1. Probabilidad de que sople a menos de 45 grados ($\pi/4$) de la dirección dominante: $P(|\Theta| < 0.785) \approx 0.674$.
2. Con una dirección uniforme esa probabilidad sería $\frac{\pi/2}{2\pi} = 0.25$.
3. Longitud resultante media: $\rho = I_1(2)/I_0(2) \approx 0.698$.
4. Densidad en la dirección dominante frente a la opuesta: su cociente es $e^{2\kappa} = e^{4} \approx 55$.

:::figura[Dirección del viento: el intervalo de -π/4 a π/4 alrededor de la dirección dominante acumula 0.674. El botón carga el ejemplo.]{componente="DistributionExplorer"}
```yaml
distribucion: von-mises
valores:
  mu: 0
  kappa: 2
ejemplo:
  titulo: 'Dirección del viento'
  contexto: 'La dirección del viento, en radianes desde el este, sigue una von Mises con μ = 0 y κ = 2.'
  pregunta: '¿Qué probabilidad hay de que sople a menos de π/4 de la dirección dominante?'
  valores: {mu: 0, kappa: 2}
  region: intervalo
  desde: -0.785
  hasta: 0.785
region: intervalo
desde: -0.785
hasta: 0.785
muestras: false
```
:::

## Propiedades

- **Simetría:** la densidad es simétrica alrededor de $\mu$ y tiene su mínimo en la dirección opuesta, $\mu + \pi$.
- **Caso κ = 0:** uniforme en el círculo.
- **Concentración alta:** para $\kappa$ grande, $\Theta \approx \mathcal{N}(\mu, 1/\kappa)$.
- **Longitud resultante:** $\rho = I_1(\kappa)/I_0(\kappa)$ crece de 0 a 1 con $\kappa$; la varianza circular es $1 - \rho$.
- **Media circular:** la dirección media se estima con el ángulo del vector promedio de los puntos $(\cos\theta_i, \sin\theta_i)$, no con el promedio de los ángulos.
- **Máxima entropía:** entre las distribuciones circulares con media circular dada, la von Mises es la de máxima entropía.

:::figura[Tres casos con contexto (sin dirección preferida, viento dominante y aves migratorias): cada botón carga los parámetros y una frase explica por qué la forma es así.]{componente="DistributionExplorer"}
```yaml
distribucion: von-mises
valores:
  mu: 0
  kappa: 2
casos:
  - nombre: 'Sin dirección preferida'
    descripcion: 'κ = 0: densidad plana en 1/(2π).'
    valores: {mu: 0, kappa: 0}
  - nombre: 'Viento dominante'
    descripcion: 'κ = 2: pico en el este con mucha variación.'
    valores: {mu: 0, kappa: 2}
  - nombre: 'Aves migratorias'
    descripcion: 'κ = 12: casi normal alrededor del norte.'
    valores: {mu: 1.57, kappa: 12}
muestras: false
```
:::

:::figura[Direcciones en el círculo: cada flecha es una dirección sorteada con κ = 2; se agrupan alrededor del este sin dejar de cubrir todo el círculo.]{componente="ContinuousGenesis"}
```yaml
proceso: direccion
valores:
  mu: 0
  kappa: 2
```
:::

## Errores comunes

- **Promediar ángulos como números.** El promedio de 350 y 10 grados es 0, no 180; hay que promediar vectores unitarios.
- **Usar la normal sin cortar el círculo.** Una normal en la recta asigna probabilidad a ángulos fuera de $[-\pi, \pi)$ y no reconoce que $-\pi$ y $\pi$ son el mismo punto.
- **Confundir κ con una desviación.** $\kappa$ crece con la concentración; mayor $\kappa$ significa menos dispersión.
- **Olvidar las unidades.** La densidad está definida para radianes; con grados hay que convertir.

:::figura[Concentración alta: con κ = 12 la von Mises (curva) casi coincide con la normal de varianza 1/12 (línea punteada).]{componente="DistributionExplorer"}
```yaml
distribucion: von-mises
valores:
  mu: 0
  kappa: 12
muestras: false
referencia:
  distribucion: normal
  valores:
    mu: 0
    sigma: 0.289
  etiqueta: Normal de varianza 1/12
```
:::

## Conexiones

La von Mises es la análoga circular de la [[distribucion-normal]] y con concentración cero se reduce a una [[distribucion-uniforme-continua]] en el círculo. Su normalización usa la misma función de Bessel que la [[distribucion-de-rice]]. Se usa en meteorología, biología del movimiento animal, ritmos circadianos y en modelos de ángulos de torsión de proteínas. El [[mapa-de-relaciones-entre-distribuciones]] la sitúa entre las demás distribuciones.

## Formulario

:::formula[Densidad]
$$
f(\theta) = \frac{e^{\kappa\cos(\theta - \mu)}}{2\pi I_0(\kappa)}
$$

- $\mu$: dirección media.
- $\kappa$: concentración.
- $I_0$: función de Bessel modificada de orden cero.
:::

:::formula[Longitud resultante media]
$$
\rho = \mathbb{E}[\cos(\Theta - \mu)] = \frac{I_1(\kappa)}{I_0(\kappa)}
$$

- $I_1$: función de Bessel modificada de orden uno.
- $1 - \rho$: varianza circular.
:::

:::formula[Aproximación normal]
$$
\Theta \approx \mathcal{N}\!\left(\mu, \frac{1}{\kappa}\right), \qquad \kappa \text{ grande}
$$

- La varianza es el inverso de la concentración.
:::

:::formula[Dirección media de una muestra]
$$
\hat{\mu} = \operatorname{atan2}\!\left(\sum_i \sin\theta_i,\ \sum_i \cos\theta_i\right)
$$

- $\theta_i$: ángulos observados.
- $\operatorname{atan2}$: ángulo del vector suma.
:::
