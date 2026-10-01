---
id: distribucion-normal-asimetrica
titulo: Distribución normal asimétrica
titulo_en: Skew normal distribution
alias:
  - normal sesgada
  - skew normal
  - normal de Azzalini
modulo: 2
submodulo: '2.2'
orden: 26
nivel: intermedio
prerrequisitos:
  - distribucion-normal-truncada
relaciones:
  - tipo: generaliza
    id: distribucion-normal
etiquetas:
  - distribución continua
  - asimetría
  - selección
  - modelado flexible
resumen: >
  Extiende la normal con un parámetro de forma α que inclina la campana hacia un lado. Con α = 0 es la
  normal; su densidad es la normal multiplicada por una función de distribución normal.
formula: 'f(x) = \frac{2}{\omega}\,\varphi\!\left(\frac{x - \xi}{\omega}\right)\Phi\!\left(\alpha\frac{x - \xi}{\omega}\right)'
visualizacion:
  componente: DistributionStudio
  parametros:
    explorador:
      distribucion: normal-asimetrica
      valores:
        xi: 0
        omega: 1
        alpha: 4
      casos:
        - nombre: 'Sin asimetría'
          descripcion: 'α = 0: la normal estándar; el factor Φ(0) = 1/2 no inclina nada.'
          valores: {xi: 0, omega: 1, alpha: 0}
        - nombre: 'Tiempos de reacción'
          descripcion: 'α = 4: casi toda la masa a la derecha del centro, con cola derecha, porque las respuestas lentas son más comunes que las muy rápidas.'
          valores: {xi: 0, omega: 1, alpha: 4}
        - nombre: 'Rendimiento con pérdidas'
          descripcion: 'α = -4: espejo del caso anterior; cola hacia la izquierda, como rendimientos con caídas ocasionales.'
          valores: {xi: 0, omega: 1, alpha: -4}
      ejemplo:
        titulo: 'Error de pronóstico'
        contexto: 'El error estandarizado de un pronóstico de demanda sigue una normal asimétrica con ξ = 0, ω = 1 y α = 4.'
        pregunta: '¿Qué probabilidad hay de que el error sea negativo, es decir, de sobreestimar la demanda?'
        valores: {xi: 0, omega: 1, alpha: 4}
        region: izquierda
        desde: 0
      referencia:
        distribucion: normal
        valores: {mu: 0, sigma: 1}
        etiqueta: 'Normal estándar'
        visible: true
    genesis:
      componente: ContinuousGenesis
      parametros:
        proceso: seleccion
        valores:
          alpha: 4
referencias:
  - clave: murphy
publicado: true
---

## Intuición

Muchas variables tienen forma de campana, pero inclinada: los tiempos de reacción en una prueba de atención, los errores de un pronóstico que tiende a subestimar o la grasa corporal en una población. La normal no puede reproducir esa inclinación, porque es perfectamente simétrica. La normal asimétrica, propuesta por Adelchi Azzalini, agrega un solo parámetro que la inclina hacia un lado sin perder la forma suave de campana.

La construcción es sencilla: se toma la densidad normal y se multiplica por una función de distribución normal que crece hacia un lado. Ese factor deja intacta la mitad de la campana hacia donde crece y aplasta la otra mitad. El resultado sigue integrando uno gracias a un factor 2.

También tiene una interpretación de selección: si una normal se observa solo cuando otra variable normal correlacionada supera un umbral, lo que queda es una normal asimétrica. Por eso aparece en datos de poblaciones seleccionadas, como pacientes que acuden a consulta solo cuando sus síntomas pasan de cierto nivel.

## Definición

:::definicion[Distribución normal asimétrica]
Una variable $X$ tiene **distribución normal asimétrica** con localización $\xi$, escala $\omega > 0$ y forma $\alpha \in \mathbb{R}$, $X \sim \operatorname{SN}(\xi, \omega, \alpha)$, si
$$
f(x) = \frac{2}{\omega}\,\varphi\!\left(\frac{x - \xi}{\omega}\right)\Phi\!\left(\alpha\frac{x - \xi}{\omega}\right), \qquad x \in \mathbb{R}.
$$
:::

**Construcción por selección:** si $Z_0, Z_1 \sim \mathcal{N}(0, 1)$ son independientes, la variable $Z_1$ si $Z_0 \le \alpha Z_1$ y $-Z_1$ en otro caso tiene distribución $\operatorname{SN}(0, 1, \alpha)$.

:::nota[Qué significa cada símbolo]
- $\xi$: localización; no es la media salvo si $\alpha = 0$.
- $\omega$: escala; no es la desviación salvo si $\alpha = 0$.
- $\alpha$: forma; positiva inclina a la derecha, negativa a la izquierda.
- $\varphi$, $\Phi$: densidad y distribución de la normal estándar.
- $Z_0$, $Z_1$: normales estándar independientes.
:::

## Cómo usar la visualización

La pestaña Distribución muestra la densidad asimétrica junto a la normal estándar (línea punteada), la región elegida y su probabilidad; los casos cargan una forma simétrica, una inclinada a la derecha y otra a la izquierda, y el ejemplo de la ficha se carga con su botón. La pestaña Ver cómo surge sortea dos normales y conserva o refleja la primera según la segunda.

Al pasar de $\alpha = 0$ a $\alpha = 4$, la mitad izquierda de la campana se aplasta y la derecha se eleva hasta el doble. Con $\alpha$ mayor que 10 la forma ya casi es la seminormal.

## Ejemplo

El error estandarizado de un pronóstico de demanda sigue $\operatorname{SN}(0, 1, 4)$.

1. Parámetro auxiliar: $\delta = \alpha/\sqrt{1 + \alpha^{2}} = 4/\sqrt{17} \approx 0.970$.
2. Error medio: $\delta\sqrt{2/\pi} \approx 0.774$; el pronóstico subestima en promedio.
3. Probabilidad de error negativo: $P(X < 0) \approx 0.078$.
4. Desviación estándar: $\sqrt{1 - 2\delta^{2}/\pi} \approx 0.633$, menor que 1 porque la masa se concentra a la derecha.

:::figura[Error de pronóstico: el área sombreada a la izquierda de 0 vale 0.078. El botón carga el ejemplo.]{componente="DistributionExplorer"}
```yaml
distribucion: normal-asimetrica
valores:
  xi: 0
  omega: 1
  alpha: 4
ejemplo:
  titulo: 'Error de pronóstico'
  contexto: 'El error estandarizado de un pronóstico de demanda sigue una normal asimétrica con ξ = 0, ω = 1 y α = 4.'
  pregunta: '¿Qué probabilidad hay de que el error sea negativo?'
  valores: {xi: 0, omega: 1, alpha: 4}
  region: izquierda
  desde: 0
region: izquierda
desde: 0
muestras: false
```
:::

## Propiedades

- **Media y varianza:** $\mathbb{E}[X] = \xi + \omega\delta\sqrt{2/\pi}$ y $\operatorname{Var}(X) = \omega^{2}(1 - 2\delta^{2}/\pi)$, con $\delta = \alpha/\sqrt{1 + \alpha^{2}}$.
- **Caso α = 0:** es la normal $\mathcal{N}(\xi, \omega^{2})$.
- **Espejo:** $\operatorname{SN}(0, 1, -\alpha)$ es el reflejo de $\operatorname{SN}(0, 1, \alpha)$.
- **Límite:** cuando $\alpha \to \infty$ se obtiene la seminormal.
- **Cuadrado:** si $X \sim \operatorname{SN}(0, 1, \alpha)$, entonces $X^{2} \sim \chi^{2}_{1}$ para cualquier $\alpha$.
- **Asimetría acotada:** el coeficiente de asimetría está entre $-0.995$ y $0.995$; no sirve para asimetrías muy fuertes.

:::figura[Tres casos con contexto (sin asimetría, tiempos de reacción y rendimiento con pérdidas): cada botón carga los parámetros y una frase explica por qué la forma es así.]{componente="DistributionExplorer"}
```yaml
distribucion: normal-asimetrica
valores:
  xi: 0
  omega: 1
  alpha: 4
casos:
  - nombre: 'Sin asimetría'
    descripcion: 'α = 0: la normal estándar.'
    valores: {xi: 0, omega: 1, alpha: 0}
  - nombre: 'Tiempos de reacción'
    descripcion: 'α = 4: cola a la derecha.'
    valores: {xi: 0, omega: 1, alpha: 4}
  - nombre: 'Rendimiento con pérdidas'
    descripcion: 'α = -4: cola a la izquierda.'
    valores: {xi: 0, omega: 1, alpha: -4}
muestras: false
```
:::

:::figura[Construcción por selección: se conserva Z₁ cuando Z₀ ≤ αZ₁ y se refleja en otro caso; el histograma sigue la normal asimétrica.]{componente="ContinuousGenesis"}
```yaml
proceso: seleccion
valores:
  alpha: 4
```
:::

## Errores comunes

- **Tomar ξ como la media.** Con $\alpha = 4$ la media está 0.77 escalas a la derecha de $\xi$.
- **Tomar ω como la desviación.** La desviación es $\omega\sqrt{1 - 2\delta^{2}/\pi}$, menor que $\omega$.
- **Usarla para asimetrías extremas.** Su asimetría no supera 0.995 en valor absoluto; datos muy sesgados piden lognormal o gamma.
- **Interpretar α como coeficiente de asimetría.** Es un parámetro de forma; la asimetría crece con $\alpha$ pero se satura.

:::figura[Saturación de la asimetría: con α = 10 (curva) la forma casi coincide con la seminormal; aumentar más α apenas cambia la curva. La línea punteada es la normal estándar.]{componente="DistributionExplorer"}
```yaml
distribucion: normal-asimetrica
valores:
  xi: 0
  omega: 1
  alpha: 10
muestras: false
referencia:
  distribucion: normal
  valores:
    mu: 0
    sigma: 1
  etiqueta: Normal estándar
```
:::

## Conexiones

La normal asimétrica generaliza la [[distribucion-normal]] y en su límite se vuelve la seminormal, un caso de la [[distribucion-normal-truncada]]. Su cuadrado es una [[distribucion-chi-cuadrada]] con un grado de libertad. Es una alternativa a la [[distribucion-lognormal]] cuando la asimetría es moderada y los valores pueden ser negativos.

## Formulario

:::formula[Densidad]
$$
f(x) = \frac{2}{\omega}\,\varphi\!\left(\frac{x - \xi}{\omega}\right)\Phi\!\left(\alpha\frac{x - \xi}{\omega}\right)
$$

- $\xi$: localización; $\omega$: escala; $\alpha$: forma.
- $\varphi$, $\Phi$: densidad y distribución normal estándar.
:::

:::formula[Media y varianza]
$$
\mathbb{E}[X] = \xi + \omega\delta\sqrt{\tfrac{2}{\pi}}, \qquad \operatorname{Var}(X) = \omega^{2}\left(1 - \tfrac{2\delta^{2}}{\pi}\right), \qquad \delta = \frac{\alpha}{\sqrt{1 + \alpha^{2}}}
$$

- $\delta$: parámetro auxiliar entre $-1$ y 1.
:::

:::formula[Construcción por selección]
$$
X = \begin{cases} Z_1, & Z_0 \le \alpha Z_1 \\ -Z_1, & Z_0 > \alpha Z_1 \end{cases}
$$

- $Z_0$, $Z_1$: normales estándar independientes.
:::
